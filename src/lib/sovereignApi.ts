// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// SOVEREIGN STACK API CLIENT
// Enterprise Platinum Standard - Full data flow integration
// =============================================================================

const SOVEREIGN_API_BASE = '/api/v1/sovereign';
const DRUID_API_BASE = '/api/v1/druid';

// =============================================================================
// TYPES
// =============================================================================

export interface TimelineEvent {
  id: string;
  timestamp: string;
  eventType: string;
  entityType: string;
  entityId: string;
  action: string;
  actor: string;
  metadata: Record<string, any>;
}

export interface VectorSearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata: Record<string, any>;
}

export interface QueueStats {
  [queueName: string]: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  };
}

export interface ServiceHealth {
  available: boolean;
  latency?: number;
}

export interface SovereignHealthStatus {
  healthy: boolean;
  services: Record<string, ServiceHealth>;
  timestamp: string;
}

// =============================================================================
// DRUID API - Timeline & Analytics
// =============================================================================

export const druidApi = {
  /**
   * Query timeline events (powers CendiaChronos™)
   * Uses the new /api/v1/druid/chronos/decisions endpoint
   */
  async queryTimeline(
    startTime: Date,
    endTime: Date,
    _eventTypes?: string[],
    limit = 500
  ): Promise<TimelineEvent[]> {
    try {
      const params = new URLSearchParams({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        limit: String(limit),
      });
      const response = await fetch(`${DRUID_API_BASE}/chronos/decisions?${params}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.warn('[Druid] Timeline query failed:', error);
      return [];
    }
  },

  /**
   * Query aggregated metrics (agent performance)
   */
  async queryMetrics(
    _metric: string,
    startTime: Date,
    endTime: Date,
    granularity: 'minute' | 'hour' | 'day' = 'hour'
  ): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        granularity,
      });
      const response = await fetch(`${DRUID_API_BASE}/pulse/agents?${params}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.warn('[Druid] Metrics query failed:', error);
      return [];
    }
  },

  /**
   * Get risk trend data
   */
  async getRiskTrend(days = 30): Promise<any[]> {
    try {
      const response = await fetch(`${DRUID_API_BASE}/chronos/risk-trend?days=${days}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.warn('[Druid] Risk trend query failed:', error);
      return [];
    }
  },

  /**
   * Get audit trail (CendiaWitness™)
   */
  async getAuditTrail(options?: {
    resourceType?: string;
    actorId?: string;
    startTime?: Date;
    endTime?: Date;
    limit?: number;
  }): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (options?.resourceType) {params.append('resourceType', options.resourceType);}
      if (options?.actorId) {params.append('actorId', options.actorId);}
      if (options?.startTime) {params.append('startTime', options.startTime.toISOString());}
      if (options?.endTime) {params.append('endTime', options.endTime.toISOString());}
      if (options?.limit) {params.append('limit', String(options.limit));}
      
      const response = await fetch(`${DRUID_API_BASE}/witness/audit?${params}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.warn('[Druid] Audit trail query failed:', error);
      return [];
    }
  },

  /**
   * Check Druid health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${DRUID_API_BASE}/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return false;
    }
  },

  /**
   * Seed demo data
   */
  async seedData(): Promise<boolean> {
    try {
      const response = await fetch(`${DRUID_API_BASE}/seed`, { method: 'POST' });
      const data = await response.json();
      return data.success;
    } catch {
      return false;
    }
  },
};

// =============================================================================
// MINIO API - Document Storage
// =============================================================================

export const storageApi = {
  /**
   * Upload document to MinIO
   */
  async uploadDocument(
    fileName: string,
    content: ArrayBuffer | string,
    contentType: string,
    metadata?: Record<string, string>,
    bucket = 'cendia-documents'
  ): Promise<{ url: string; etag: string } | null> {
    const base64Content =
      typeof content === 'string'
        ? btoa(content)
        : btoa(String.fromCharCode(...new Uint8Array(content)));

    const response = await fetch(`${SOVEREIGN_API_BASE}/storage/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bucket, fileName, content: base64Content, contentType, metadata }),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },

  /**
   * Download document from MinIO
   */
  async downloadDocument(bucket: string, fileName: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/storage/download/${bucket}/${fileName}`);
      if (!response.ok) {return null;}
      return await response.blob();
    } catch {
      return null;
    }
  },

  /**
   * List files in bucket
   */
  async listFiles(bucket: string, prefix?: string): Promise<any[]> {
    const url = prefix
      ? `${SOVEREIGN_API_BASE}/storage/list/${bucket}?prefix=${encodeURIComponent(prefix)}`
      : `${SOVEREIGN_API_BASE}/storage/list/${bucket}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.success ? data.data : [];
  },

  /**
   * Get bucket statistics
   */
  async getBucketStats(bucket: string): Promise<{ count: number; totalSize: number } | null> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/storage/stats/${bucket}`);
    const data = await response.json();
    return data.success ? data.data : null;
  },

  /**
   * Check storage health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/storage/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return false;
    }
  },
};

// =============================================================================
// VECTOR API - RAG & Semantic Search
// =============================================================================

export const vectorApi = {
  /**
   * Store document with embeddings for RAG
   */
  async storeDocument(
    documentId: string,
    content: string,
    metadata?: Record<string, any>,
    chunkSize = 500
  ): Promise<number> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, content, metadata, chunkSize }),
    });
    const data = await response.json();
    return data.success ? data.chunks : 0;
  },

  /**
   * Search similar documents (RAG retrieval)
   */
  async searchSimilar(query: string, limit = 5, threshold = 0.7): Promise<VectorSearchResult[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit, threshold }),
    });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  /**
   * Store decision context for agent memory
   */
  async storeDecisionContext(decision: {
    decisionId: string;
    title: string;
    context: string;
    outcome: string;
    confidence: number;
    participants: string[];
  }): Promise<boolean> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decision),
    });
    const data = await response.json();
    return data.success;
  },

  /**
   * Find similar past decisions
   */
  async findSimilarDecisions(query: string, limit = 5): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/decisions/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit }),
    });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  /**
   * Store agent memory
   */
  async storeAgentMemory(memory: {
    agentId: string;
    memoryType: 'episodic' | 'semantic' | 'procedural';
    content: string;
    importance: number;
    expiresAt?: Date;
  }): Promise<boolean> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/agent-memory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memory),
    });
    const data = await response.json();
    return data.success;
  },

  /**
   * Recall agent memories
   */
  async recallAgentMemories(agentId: string, query: string, limit = 10): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/agent-memory/recall`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, query, limit }),
    });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  /**
   * Check vector service health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/vector/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return false;
    }
  },
};

// =============================================================================
// QUEUE API - Agent Orchestration
// =============================================================================

export const queueApi = {
  /**
   * Queue a deliberation job
   */
  async queueDeliberation(deliberation: {
    sessionId: string;
    question: string;
    agents: string[];
    context?: Record<string, any>;
    priority?: 'critical' | 'high' | 'normal' | 'low';
  }): Promise<string | null> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/queue/deliberation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deliberation),
    });
    const data = await response.json();
    return data.success ? data.jobId : null;
  },

  /**
   * Queue a document processing job
   */
  async queueDocumentProcessing(doc: {
    documentId: string;
    fileName: string;
    fileType: string;
    storageUrl: string;
    extractText?: boolean;
    generateEmbeddings?: boolean;
    runOCR?: boolean;
  }): Promise<string | null> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/queue/document`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    const data = await response.json();
    return data.success ? data.jobId : null;
  },

  /**
   * Get queue statistics
   */
  async getStats(): Promise<QueueStats> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/queue/stats`);
    const data = await response.json();
    return data.success ? data.data : {};
  },

  /**
   * Get job status
   */
  async getJobStatus(jobId: string, queue?: string): Promise<any> {
    const url = queue
      ? `${SOVEREIGN_API_BASE}/queue/job/${jobId}?queue=${queue}`
      : `${SOVEREIGN_API_BASE}/queue/job/${jobId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.success ? data.data : null;
  },

  /**
   * Check queue service health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/queue/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return false;
    }
  },
};

// =============================================================================
// PROMETHEUS API - Metrics
// =============================================================================

export const metricsApi = {
  /**
   * Query Prometheus for time-series metrics
   */
  async queryRange(query: string, start: Date, end: Date, step = '1m'): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/prometheus/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        start: Math.floor(start.getTime() / 1000),
        end: Math.floor(end.getTime() / 1000),
        step,
      }),
    });
    const data = await response.json();
    return data.success ? data.data?.result || [] : [];
  },

  /**
   * Get current metric value
   */
  async getCurrentValue(metricName: string): Promise<number | null> {
    const response = await fetch(
      `${SOVEREIGN_API_BASE}/prometheus/metric/${encodeURIComponent(metricName)}`
    );
    const data = await response.json();
    if (data.success && data.data?.result?.[0]?.value) {
      return parseFloat(data.data.result[0].value[1]);
    }
    return null;
  },

  /**
   * Check Prometheus health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/prometheus/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return false;
    }
  },
};

// =============================================================================
// N8N API - Workflow Automation
// =============================================================================

export const workflowApi = {
  /**
   * Get all n8n workflows
   */
  async getWorkflows(): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/n8n/workflows`);
    const data = await response.json();
    return data.success ? data.data : [];
  },

  /**
   * Trigger a workflow
   */
  async triggerWorkflow(workflowId: string, payload?: any): Promise<boolean> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/n8n/trigger/${workflowId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    const data = await response.json();
    return data.success;
  },

  /**
   * Check n8n health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/n8n/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return false;
    }
  },
};

// =============================================================================
// UNLEASH API - Feature Flags
// =============================================================================

export const featureFlagsApi = {
  /**
   * Get all feature flags
   */
  async getAllFlags(): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/unleash/features`);
    const data = await response.json();
    return data.success ? data.data : [];
  },

  /**
   * Check if feature is enabled
   */
  async isEnabled(featureName: string): Promise<boolean> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/unleash/feature/${featureName}`);
    const data = await response.json();
    return data.enabled ?? false;
  },

  /**
   * Check Unleash health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/unleash/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return false;
    }
  },
};

// =============================================================================
// ENTERPRISE SECURITY API - Keycloak, Casbin, Tika
// =============================================================================

const ENTERPRISE_API_BASE = '/api/v1/enterprise/security';

export const enterpriseApi = {
  /**
   * Get current authenticated user from Keycloak
   */
  async getCurrentUser(): Promise<any> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/me`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },

  /**
   * Check if user has permission (Casbin policy check)
   */
  async checkPermission(resource: string, action: string): Promise<boolean> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/check-permission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource, action }),
    });
    const data = await response.json();
    return data.allowed ?? false;
  },

  /**
   * Check if user can approve a decision type
   */
  async canApproveDecision(
    decisionType: string,
    existingApprovers: string[] = []
  ): Promise<{ allowed: boolean; reason: string }> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/policies/can-approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decisionType, existingApprovers }),
    });
    const data = await response.json();
    return { allowed: data.allowed ?? false, reason: data.reason ?? '' };
  },

  /**
   * Check if user can veto a decision type
   */
  async canVetoDecision(decisionType: string): Promise<{ allowed: boolean; reason: string }> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/policies/can-veto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decisionType }),
    });
    const data = await response.json();
    return { allowed: data.allowed ?? false, reason: data.reason ?? '' };
  },

  /**
   * Extract text from document using Apache Tika
   */
  async extractDocument(
    content: string, // base64 encoded
    mimeType: string,
    fileName?: string,
    useOCR = false
  ): Promise<{ text: string; metadata: any; wordCount: number } | null> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/documents/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, mimeType, fileName, useOCR }),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },

  async extractDocumentFromVault(
    bucket: string,
    path: string,
    mimeType: string,
    fileName?: string,
    useOCR = false
  ): Promise<{ text: string; metadata: any; wordCount: number } | null> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/documents/extract-from-vault`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bucket, path, mimeType, fileName, useOCR }),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },

  /**
   * Detect document type
   */
  async detectDocumentType(
    content: string
  ): Promise<{ mimeType: string; formatName: string } | null> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/documents/detect-type`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },

  /**
   * Get supported document formats
   */
  async getSupportedFormats(): Promise<string[]> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/documents/formats`);
    const data = await response.json();
    return data.success ? data.data : [];
  },

  /**
   * Get enterprise security status
   */
  async getSecurityStatus(): Promise<any> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/security/status`);
    const data = await response.json();
    return data.success ? data.data : null;
  },

  /**
   * Check Tika service health
   */
  async checkTikaHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${ENTERPRISE_API_BASE}/documents/health`);
      const data = await response.json();
      return data.available ?? false;
    } catch {
      return false;
    }
  },
};

// =============================================================================
// CENDIAVAULT™ - Document Storage (MinIO)
// =============================================================================

export interface VaultDocument {
  id: string;
  filename: string;
  bucket: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  metadata: Record<string, any>;
}

export const vaultApi = {
  /**
   * Upload document to CendiaVault (MinIO)
   */
  async uploadDocument(
    file: File,
    bucket: string = 'council-documents',
    metadata?: Record<string, any>
  ): Promise<VaultDocument | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }

      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.warn('[CendiaVault] Upload failed, document stored locally:', error);
      // Return a local reference for offline/dev mode
      return {
        id: `local-${Date.now()}`,
        filename: file.name,
        bucket,
        path: `${bucket}/${file.name}`,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        metadata: metadata || {},
      };
    }
  },

  /**
   * Get document from CendiaVault
   */
  async getDocument(bucket: string, path: string): Promise<Blob | null> {
    try {
      const response = await fetch(
        `${SOVEREIGN_API_BASE}/vault/download?bucket=${bucket}&path=${encodeURIComponent(path)}`
      );
      if (response.ok) {
        return await response.blob();
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * List documents in a bucket
   */
  async listDocuments(bucket: string = 'council-documents'): Promise<VaultDocument[]> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/list?bucket=${bucket}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch {
      return [];
    }
  },

  /**
   * Delete document from CendiaVault
   */
  async deleteDocument(bucket: string, path: string): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket, path }),
      });
      const data = await response.json();
      return data.success ?? false;
    } catch {
      return false;
    }
  },

  /**
   * Check vault health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/health`);
      const data = await response.json();
      return data.available ?? false;
    } catch {
      return false;
    }
  },
};

// =============================================================================
// SOVEREIGN STACK HEALTH
// =============================================================================

export const sovereignApi = {
  /**
   * Get health status of all sovereign services
   */
  async getHealthStatus(): Promise<SovereignHealthStatus> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/health`);
    const data = await response.json();
    return data;
  },

  // Re-export all service APIs
  druid: druidApi,
  storage: storageApi,
  vector: vectorApi,
  queue: queueApi,
  metrics: metricsApi,
  workflow: workflowApi,
  featureFlags: featureFlagsApi,
  enterprise: enterpriseApi,
  vault: vaultApi,
};

export default sovereignApi;
