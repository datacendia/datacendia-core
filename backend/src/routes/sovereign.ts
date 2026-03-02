// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// SOVEREIGN STACK API ROUTES (Fixed)
// Enterprise Platinum Standard - Full data flow integration
// =============================================================================

import { Router, Request, Response } from 'express';
import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import crypto from 'crypto';
import { druidService, DRUID_DATASOURCES } from '../services/storage/DruidService';
import { minioService, BUCKETS } from '../services/storage/MinioService';
import { vectorService } from '../services/storage/VectorService';
import { agentQueueService, QUEUE_NAMES } from '../services/queue/AgentQueueService';
import { analyticsRouter } from '../services/storage/AnalyticsRouter';
import { CLICKHOUSE_TABLES } from '../services/storage/ClickHouseService';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// Default org for demo (production upgrade: from auth middleware)
const DEFAULT_ORG = 'default-org';

type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

const isBucketName = (value: unknown): value is BucketName => {
  return (
    typeof value === 'string' &&
    (Object.values(BUCKETS) as readonly string[]).includes(value)
  );
};

const vaultUploadDir = './uploads/vault';
if (!fs.existsSync(vaultUploadDir)) {
  fs.mkdirSync(vaultUploadDir, { recursive: true });
}

const vaultUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, vaultUploadDir),
    filename: (_req, file, cb) => {
      const safeOriginal = path.basename(file.originalname);
      cb(null, `${Date.now()}-${crypto.randomUUID()}-${safeOriginal}`);
    },
  }),
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

// =============================================================================
// DRUID ROUTES - Timeline & Analytics
// =============================================================================

/**
 * Query timeline events with auto-routing (Druid or ClickHouse)
 * Powers CendiaChronos™
 */
router.post('/druid/timeline', async (req: Request, res: Response) => {
  try {
    const { startTime, endTime, limit = 100, forceBackend } = req.body;
    const orgId = (req as any).orgId || DEFAULT_ORG;
    
    // Use AnalyticsRouter for automatic backend selection
    const result = await analyticsRouter.getDecisionHistory(orgId, {
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      limit,
      characteristics: {
        forceBackend,
        isStreaming: true, // Timeline data is typically streaming
      },
    });

    res.json({ 
      success: result.success, 
      data: result.data,
      backend: result.backend,
      routingReason: result.routingReason,
    });
  } catch (error: unknown) {
    console.error('[Sovereign] Timeline query failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Get aggregated metrics with auto-routing (powers CendiaPulse™)
 */
router.post('/druid/metrics', async (req: Request, res: Response) => {
  try {
    const { startTime, endTime, granularity = 'hour', forceBackend } = req.body;
    const orgId = (req as any).orgId || DEFAULT_ORG;
    
    // Use AnalyticsRouter for automatic backend selection
    const result = await analyticsRouter.getAgentMetrics(orgId, {
      granularity: granularity as 'minute' | 'hour' | 'day',
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      characteristics: {
        forceBackend,
        isStreaming: granularity === 'minute', // Real-time granularity ? Druid
      },
    });

    res.json({ 
      success: result.success, 
      data: result.data,
      backend: result.backend,
      routingReason: result.routingReason,
    });
  } catch (error: unknown) {
    console.error('[Sovereign] Metrics query failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Ingest events with dual-write support (Druid + ClickHouse)
 */
router.post('/druid/ingest', async (req: Request, res: Response) => {
  try {
    const { datasource, table, events, dualWrite = false } = req.body;
    
    // Use AnalyticsRouter for intelligent ingestion
    const result = await analyticsRouter.ingestEvents(events, {
      datasource: datasource || DRUID_DATASOURCES.AUDIT_EVENTS,
      table: table || CLICKHOUSE_TABLES.AUDIT_EVENTS,
      dualWrite, // Write to both backends for redundancy/migration
    });
    
    res.json({ 
      success: true, 
      druid: result.druid,
      clickhouse: result.clickhouse,
    });
  } catch (error: unknown) {
    console.error('[Sovereign] Ingest failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Check analytics backends health (Druid + ClickHouse)
 */
router.get('/druid/health', async (req: Request, res: Response) => {
  try {
    const status = analyticsRouter.getStatus();
    res.json({ 
      success: true, 
      druid: status.druidAvailable,
      clickhouse: status.clickhouseAvailable,
      preferredBackend: status.preferredBackend,
      lastHealthCheck: status.lastHealthCheck,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// MINIO ROUTES - Document Storage
// =============================================================================

/**
 * Upload document to MinIO (powers CendiaGnosis™)
 */
router.post('/storage/upload', async (req: Request, res: Response) => {
  try {
    const { bucket, fileName, content, contentType, metadata } = req.body;
    
    const buffer = Buffer.from(content, 'base64');
    const result = await minioService.uploadBuffer(
      bucket || BUCKETS.DOCUMENTS,
      fileName,
      buffer,
      {
        mimeType: contentType,
        originalName: fileName,
        uploadedBy: metadata?.uploadedBy || 'system',
        organizationId: (req as any).orgId || DEFAULT_ORG,
      }
    );

    res.json({ success: result.success, data: result });
  } catch (error: unknown) {
    console.error('[Sovereign] MinIO upload failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Download document from MinIO
 */
router.get('/storage/download/:bucket/:fileName', async (req: Request, res: Response) => {
  try {
    const { bucket, fileName } = req.params;
    
    const result = await minioService.downloadStream(bucket, fileName);
    
    if (!result.success || !result.stream) {
      res.status(404).json({ success: false, error: 'File not found' });
      return;
    }
    
    res.setHeader('Content-Length', result.size?.toString() || '0');
    result.stream.pipe(res);
  } catch (error: unknown) {
    console.error('[Sovereign] MinIO download failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * List files in bucket
 */
router.get('/storage/list/:bucket', async (req: Request, res: Response) => {
  try {
    const { bucket } = req.params;
    const { prefix } = req.query;
    
    const files = await minioService.listObjects(bucket, prefix as string);
    
    res.json({ success: true, data: files });
  } catch (error: unknown) {
    console.error('[Sovereign] MinIO list failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Get bucket stats
 */
router.get('/storage/stats/:bucket', async (req: Request, res: Response) => {
  try {
    const { bucket } = req.params;
    
    const stats = await minioService.getBucketStats(bucket);
    
    res.json({ success: true, data: stats });
  } catch (error: unknown) {
    console.error('[Sovereign] MinIO stats failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Check MinIO health
 */
router.get('/storage/health', async (req: Request, res: Response) => {
  try {
    await minioService.initialize();
    res.json({ success: true, available: true });
  } catch (error: unknown) {
    res.status(500).json({ success: false, available: false, error: getErrorMessage(error) });
  }
});

router.post('/vault/upload', vaultUpload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }

    const bucketRaw = (req.body.bucket as string) || BUCKETS.COUNCIL_DOCUMENTS;
    if (!isBucketName(bucketRaw)) {
      res.status(400).json({ success: false, error: 'Invalid bucket' });
      return;
    }

    const bucket: BucketName = bucketRaw;

    let metadata: Record<string, any> = {};
    if (typeof req.body.metadata === 'string') {
      try {
        metadata = JSON.parse(req.body.metadata);
      } catch {
        metadata = {};
      }
    }

    await minioService.initialize();

    const objectName = file.filename;
    const result = await minioService.uploadStream(
      bucket,
      objectName,
      fs.createReadStream(file.path),
      file.size,
      {
        mimeType: file.mimetype,
        originalName: file.originalname,
        uploadedBy: metadata.uploadedBy || 'system',
        organizationId: (req as any).orgId || DEFAULT_ORG,
      }
    );

    try {
      fs.unlinkSync(file.path);
    } catch {
      // ignore
    }

    if (!result.success) {
      res.json({ success: false, error: result.error || 'Upload failed' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: `${bucket}/${objectName}`,
        filename: file.originalname,
        bucket,
        path: `${bucket}/${objectName}`,
        size: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date().toISOString(),
        metadata,
      },
    });
  } catch (error: unknown) {
    console.error('[Sovereign] Vault upload failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/vault/download', async (req: Request, res: Response) => {
  try {
    const bucket = req.query.bucket as string;
    const rawPath = (req.query.path as string) || '';
    if (!bucket || !rawPath) {
      res.status(400).json({ success: false, error: 'bucket and path are required' });
      return;
    }

    const objectName = rawPath.startsWith(`${bucket}/`) ? rawPath.slice(bucket.length + 1) : rawPath;
    const result = await minioService.downloadStream(bucket, objectName);

    if (!result.success || !result.stream) {
      res.status(404).json({ success: false, error: result.error || 'File not found' });
      return;
    }

    res.setHeader('Content-Length', result.size?.toString() || '0');
    result.stream.pipe(res);
  } catch (error: unknown) {
    console.error('[Sovereign] Vault download failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/vault/list', async (req: Request, res: Response) => {
  try {
    const bucketRaw = (req.query.bucket as string) || BUCKETS.COUNCIL_DOCUMENTS;
    if (!isBucketName(bucketRaw)) {
      res.status(400).json({ success: false, error: 'Invalid bucket' });
      return;
    }

    const bucket: BucketName = bucketRaw;

    await minioService.initialize();
    const objects = await minioService.listObjects(bucket);

    res.json({
      success: true,
      data: objects.map((o) => ({
        id: `${bucket}/${o.name}`,
        filename: o.name,
        bucket,
        path: `${bucket}/${o.name}`,
        size: o.size,
        mimeType: 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
        metadata: {},
      })),
    });
  } catch (error: unknown) {
    console.error('[Sovereign] Vault list failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.delete('/vault/delete', async (req: Request, res: Response) => {
  try {
    const { bucket, path: rawPath } = req.body || {};
    if (!bucket || !rawPath) {
      res.status(400).json({ success: false, error: 'bucket and path are required' });
      return;
    }
    const objectName = String(rawPath).startsWith(`${bucket}/`) ? String(rawPath).slice(String(bucket).length + 1) : String(rawPath);
    const ok = await minioService.deleteObject(bucket, objectName);
    res.json({ success: ok });
  } catch (error: unknown) {
    console.error('[Sovereign] Vault delete failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/vault/health', async (_req: Request, res: Response) => {
  try {
    await minioService.initialize();
    res.json({ success: true, available: true });
  } catch (error: unknown) {
    res.status(500).json({ success: false, available: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// VECTOR ROUTES - RAG & Semantic Search
// =============================================================================

/**
 * Store document with embeddings (powers RAG)
 */
router.post('/vector/store', async (req: Request, res: Response) => {
  try {
    const { documentId, content, metadata, chunkSize = 500 } = req.body;
    const orgId = (req as any).orgId || DEFAULT_ORG;
    
    // Split content into chunks and store each
    const chunks = content.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [content];
    let storedCount = 0;
    
    for (let i = 0; i < chunks.length; i++) {
      await vectorService.storeDocumentChunk(orgId, {
        documentId,
        chunkIndex: i,
        content: chunks[i],
        metadata,
      });
      storedCount++;
    }
    
    res.json({ success: true, chunks: storedCount });
  } catch (error: unknown) {
    console.error('[Sovereign] Vector store failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Search similar documents
 */
router.post('/vector/search', async (req: Request, res: Response) => {
  try {
    const { query, limit = 5, threshold = 0.7 } = req.body;
    const orgId = (req as any).orgId || DEFAULT_ORG;
    
    const results = await vectorService.searchDocuments(orgId, query, { limit, threshold });
    
    res.json({ success: true, data: results });
  } catch (error: unknown) {
    console.error('[Sovereign] Vector search failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Store decision context for agent memory
 */
router.post('/vector/decision', async (req: Request, res: Response) => {
  try {
    const { decisionId, title, context, outcome, confidence } = req.body;
    const orgId = (req as any).orgId || DEFAULT_ORG;
    
    await vectorService.storeDecisionContext(orgId, {
      decisionId,
      content: `${title}\n\n${context}`,
      outcome,
      confidence,
    });
    
    res.json({ success: true, message: 'Decision context stored' });
  } catch (error: unknown) {
    console.error('[Sovereign] Decision context store failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Find similar past decisions
 */
router.post('/vector/decisions/search', async (req: Request, res: Response) => {
  try {
    const { query, limit = 5 } = req.body;
    const orgId = (req as any).orgId || DEFAULT_ORG;
    
    const results = await vectorService.searchDecisions(orgId, query, { limit });
    
    res.json({ success: true, data: results });
  } catch (error: unknown) {
    console.error('[Sovereign] Decision search failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Store agent memory
 */
router.post('/vector/agent-memory', async (req: Request, res: Response) => {
  try {
    const { agentId, memoryType, content, importance, expiresAt } = req.body;
    const orgId = (req as any).orgId || DEFAULT_ORG;
    
    await vectorService.storeAgentMemory(orgId, agentId, {
      agentId,
      memoryType,
      content,
      importance,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });
    
    res.json({ success: true, message: 'Agent memory stored' });
  } catch (error: unknown) {
    console.error('[Sovereign] Agent memory store failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Recall agent memories
 */
router.post('/vector/agent-memory/recall', async (req: Request, res: Response) => {
  try {
    const { agentId, query, limit = 10 } = req.body;
    const orgId = (req as any).orgId || DEFAULT_ORG;
    
    const memories = await vectorService.retrieveAgentMemory(orgId, agentId, query, { limit });
    
    res.json({ success: true, data: memories });
  } catch (error: unknown) {
    console.error('[Sovereign] Agent memory recall failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Check Vector service health
 */
router.get('/vector/health', async (req: Request, res: Response) => {
  try {
    await vectorService.initialize();
    res.json({ success: true, available: true });
  } catch (error: unknown) {
    res.status(500).json({ success: false, available: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// QUEUE ROUTES - Agent Orchestration
// =============================================================================

/**
 * Queue a deliberation job
 */
router.post('/queue/deliberation', async (req: Request, res: Response) => {
  try {
    const { sessionId, question, agents, context, priority = 'normal' } = req.body;
    const orgId = (req as any).orgId || DEFAULT_ORG;
    
    const priorityMap: Record<string, number> = { critical: 1, high: 2, normal: 3, low: 4 };
    
    const job = await agentQueueService.addCouncilSession({
      organizationId: orgId,
      sessionId,
      question,
      agents,
      mode: 'standard',
      context,
    }, { priority: priorityMap[priority] || 3 });
    
    res.json({ success: true, jobId: job.id });
  } catch (error: unknown) {
    console.error('[Sovereign] Queue deliberation failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Queue a document processing job
 */
router.post('/queue/document', async (req: Request, res: Response) => {
  try {
    const { documentId, fileName, fileType, storageUrl, extractText, generateEmbeddings } = req.body;
    const orgId = (req as any).orgId || DEFAULT_ORG;
    
    const job = await agentQueueService.addDocumentProcessing({
      organizationId: orgId,
      documentId,
      filePath: storageUrl,
      mimeType: fileType,
      extractText,
      generateEmbeddings,
    });
    
    res.json({ success: true, jobId: job.id });
  } catch (error: unknown) {
    console.error('[Sovereign] Queue document failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Get queue statistics
 */
router.get('/queue/stats', async (req: Request, res: Response) => {
  try {
    const stats = await agentQueueService.getAllQueueStats();
    res.json({ success: true, data: stats });
  } catch (error: unknown) {
    console.error('[Sovereign] Queue stats failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Get job status
 */
router.get('/queue/job/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const { queue } = req.query;
    const queueName = (queue as string) || QUEUE_NAMES.COUNCIL_SESSION;
    
    const stats = await agentQueueService.getQueueStats(queueName);
    
    res.json({ success: true, data: { jobId, queueStats: stats } });
  } catch (error: unknown) {
    console.error('[Sovereign] Job status failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Check Queue service health
 */
router.get('/queue/health', async (req: Request, res: Response) => {
  try {
    await agentQueueService.initialize();
    res.json({ success: true, available: true });
  } catch (error: unknown) {
    res.status(500).json({ success: false, available: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// PROMETHEUS ROUTES - Metrics
// =============================================================================

interface PrometheusResponse {
  data?: {
    result?: any[];
  };
}

/**
 * Query Prometheus for metrics
 */
router.post('/prometheus/query', async (req: Request, res: Response) => {
  try {
    const { query, start, end, step } = req.body;
    
    const prometheusUrl = process.env.PROMETHEUS_URL || 'http://localhost:9090';
    const response = await fetch(
      `${prometheusUrl}/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=${step}`
    );
    
    if (!response.ok) {
      throw new Error(`Prometheus query failed: ${response.statusText}`);
    }
    
    const data = await response.json() as PrometheusResponse;
    res.json({ success: true, data: data.data });
  } catch (error: unknown) {
    console.error('[Sovereign] Prometheus query failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Get current metric value
 */
router.get('/prometheus/metric/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    
    const prometheusUrl = process.env.PROMETHEUS_URL || 'http://localhost:9090';
    const response = await fetch(
      `${prometheusUrl}/api/v1/query?query=${encodeURIComponent(name)}`
    );
    
    if (!response.ok) {
      throw new Error(`Prometheus query failed: ${response.statusText}`);
    }
    
    const data = await response.json() as PrometheusResponse;
    res.json({ success: true, data: data.data });
  } catch (error: unknown) {
    console.error('[Sovereign] Prometheus metric failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Check Prometheus health
 */
router.get('/prometheus/health', async (req: Request, res: Response) => {
  try {
    const prometheusUrl = process.env.PROMETHEUS_URL || 'http://localhost:9090';
    const response = await fetch(`${prometheusUrl}/-/healthy`);
    
    res.json({ success: true, available: response.ok });
  } catch (error: unknown) {
    res.status(500).json({ success: false, available: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// N8N ROUTES - Workflow Automation
// =============================================================================

interface N8nResponse {
  data?: any[];
}

/**
 * Get n8n workflows
 */
router.get('/n8n/workflows', async (req: Request, res: Response) => {
  try {
    const n8nUrl = process.env.N8N_URL || 'http://localhost:5678';
    const response = await fetch(`${n8nUrl}/api/v1/workflows`, {
      headers: {
        'X-N8N-API-KEY': process.env.N8N_API_KEY || '',
      },
    });
    
    if (!response.ok) {
      throw new Error(`n8n API failed: ${response.statusText}`);
    }
    
    const data = await response.json() as N8nResponse;
    res.json({ success: true, data: data.data || data });
  } catch (error: unknown) {
    console.error('[Sovereign] n8n workflows failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Trigger n8n workflow
 */
router.post('/n8n/trigger/:workflowId', async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    const payload = req.body;
    
    const n8nUrl = process.env.N8N_URL || 'http://localhost:5678';
    const response = await fetch(`${n8nUrl}/api/v1/workflows/${workflowId}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': process.env.N8N_API_KEY || '',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`n8n trigger failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error: unknown) {
    console.error('[Sovereign] n8n trigger failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Check n8n health
 */
router.get('/n8n/health', async (req: Request, res: Response) => {
  try {
    const n8nUrl = process.env.N8N_URL || 'http://localhost:5678';
    const response = await fetch(`${n8nUrl}/healthz`);
    
    res.json({ success: true, available: response.ok });
  } catch (error: unknown) {
    res.status(500).json({ success: false, available: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// UNLEASH ROUTES - Feature Flags
// =============================================================================

interface UnleashFeaturesResponse {
  features?: any[];
}

interface UnleashFeatureResponse {
  enabled?: boolean;
}

/**
 * Get all feature flags
 */
router.get('/unleash/features', async (req: Request, res: Response) => {
  try {
    const unleashUrl = process.env.UNLEASH_URL || 'http://localhost:4242';
    const response = await fetch(`${unleashUrl}/api/client/features`, {
      headers: {
        'Authorization': process.env.UNLEASH_API_TOKEN || '*:*.cendia-admin-token',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Unleash API failed: ${response.statusText}`);
    }
    
    const data = await response.json() as UnleashFeaturesResponse;
    res.json({ success: true, data: data.features || [] });
  } catch (error: unknown) {
    console.error('[Sovereign] Unleash features failed:', getErrorMessage(error));
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Check if feature is enabled
 */
router.get('/unleash/feature/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    
    const unleashUrl = process.env.UNLEASH_URL || 'http://localhost:4242';
    const response = await fetch(`${unleashUrl}/api/client/features/${name}`, {
      headers: {
        'Authorization': process.env.UNLEASH_API_TOKEN || '*:*.cendia-admin-token',
      },
    });
    
    if (!response.ok) {
      res.json({ success: true, enabled: false });
      return;
    }
    
    const data = await response.json() as UnleashFeatureResponse;
    res.json({ success: true, enabled: data.enabled ?? false });
  } catch (error: unknown) {
    res.json({ success: true, enabled: false });
  }
});

/**
 * Check Unleash health
 */
router.get('/unleash/health', async (req: Request, res: Response) => {
  try {
    const unleashUrl = process.env.UNLEASH_URL || 'http://localhost:4242';
    const response = await fetch(`${unleashUrl}/health`);
    
    res.json({ success: true, available: response.ok });
  } catch (error: unknown) {
    res.status(500).json({ success: false, available: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// SOVEREIGN STACK HEALTH - Overall status
// =============================================================================

/**
 * Get health status of all sovereign services
 */
router.get('/health', async (req: Request, res: Response) => {
  const services: Record<string, { available: boolean; latency?: number }> = {};
  
  const checkService = async (name: string, checkFn: () => Promise<boolean>) => {
    const start = Date.now();
    try {
      const available = await checkFn();
      services[name] = { available, latency: Date.now() - start };
    } catch {
      services[name] = { available: false, latency: Date.now() - start };
    }
  };

  await Promise.all([
    checkService('druid', () => druidService.checkAvailability()),
    checkService('minio', async () => {
      await minioService.initialize();
      return true;
    }),
    checkService('vector', async () => {
      await vectorService.initialize();
      return true;
    }),
    checkService('queue', async () => {
      await agentQueueService.initialize();
      return true;
    }),
    checkService('prometheus', async () => {
      const url = process.env.PROMETHEUS_URL || 'http://localhost:9090';
      const res = await fetch(`${url}/-/healthy`);
      return res.ok;
    }),
    checkService('n8n', async () => {
      const url = process.env.N8N_URL || 'http://localhost:5678';
      const res = await fetch(`${url}/healthz`);
      return res.ok;
    }),
    checkService('unleash', async () => {
      const url = process.env.UNLEASH_URL || 'http://localhost:4242';
      const res = await fetch(`${url}/health`);
      return res.ok;
    }),
  ]);

  const allHealthy = Object.values(services).every(s => s.available);
  
  res.json({
    success: true,
    healthy: allHealthy,
    services,
    timestamp: new Date().toISOString(),
  });
});

export default router;
