import { logger } from '../utils/logger.js';
import { z } from 'zod';

const schema_0 = z.object({
  text: z.any(),
}).passthrough();

/**
 * API Routes — Gateway
 *
 * Express route handler defining REST endpoints.
 * @module routes/gateway
 */

/**
 * CendiaGateway™ — AI Governance Gateway Routes
 * 
 * Endpoints:
 *   POST   /api/gateway/proxy/:provider/*     — Reverse proxy to AI provider
 *   GET    /api/gateway/stats                  — Gateway statistics dashboard
 *   GET    /api/gateway/interactions            — List all interactions
 *   GET    /api/gateway/interactions/:id        — Get single interaction
 *   GET    /api/gateway/providers               — List configured providers
 *   GET    /api/gateway/policies                — List gateway policies
 *   POST   /api/gateway/policies                — Create a new policy
 *   PUT    /api/gateway/policies/:id            — Update a policy
 *   DELETE /api/gateway/policies/:id            — Delete a policy
 *   POST   /api/gateway/manifest                — Generate The Governance Receipt™
 *   POST   /api/gateway/governance-receipt/export — Export as HTML/CSV/JSON
 *   POST   /api/gateway/test-pii               — Test PII detection on sample text
 * 
 *   OpenAI-compatible passthrough:
 *   POST   /api/gateway/v1/chat/completions     — OpenAI-compatible endpoint
 *   POST   /api/gateway/v1/messages             — Anthropic-compatible endpoint
 */

import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import CendiaGatewayService from '../services/gateway/CendiaGatewayService.js';
import { scanForPII } from '../services/gateway/PIIDetector.js';
import ModelRouter from '../services/gateway/ModelRouter.js';
import { gatewayProxyServer } from '../services/gateway/GatewayProxyServer.js';
import ShadowAIDetector from '../services/gateway/ShadowAIDetector.js';
import WebhookNotifier from '../services/gateway/WebhookNotifier.js';
import GatewayRateLimiter from '../services/gateway/RateLimiter.js';
import SIEMIntegration from '../services/gateway/SIEMIntegration.js';
import ManifestExporter from '../services/gateway/ManifestExporter.js';
import { gatewayFederationService } from '../services/gateway/GatewayFederationService.js';


const schema_1 = z.object({
  text: z.any(),
}).passthrough();

const router = Router();

// Get service singletons
function getGateway(): CendiaGatewayService {
  return CendiaGatewayService.getInstance();
}

const modelRouter = new ModelRouter();
const shadowDetector = new ShadowAIDetector();
const webhookNotifier = new WebhookNotifier();
const rateLimiter = new GatewayRateLimiter();
const siemIntegration = new SIEMIntegration();
const manifestExporter = new ManifestExporter();

// Helper to extract user info from request (JWT or API key auth)
function extractUserInfo(req: Request): {
  userId: string;
  userEmail: string;
  userDepartment: string;
  organizationId: string;
} {
  // From JWT auth middleware (if authenticated)
  const user = req.user;
  if (user) {
    return {
      userId: user.id || 'anonymous',
      userEmail: user.email || 'unknown@unknown.com',
      userDepartment: user.department || 'unknown' as any,
      organizationId: user.organizationId || 'default-org',
    };
  }

  // Fallback: use auth middleware org context (never trust client-supplied headers for org identity)
  return {
    userId: (req as any).user?.id || 'anonymous',
    userEmail: (req as any).user?.email || 'unknown@unknown.com',
    userDepartment: 'unknown',
    organizationId: (req as any).organizationId || (req as any).user?.organizationId || 'unknown',
  };
}

// =============================================================================
// REVERSE PROXY — OpenAI-compatible endpoint
// =============================================================================

router.post('/v1/chat/completions', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const userInfo = extractUserInfo(req);
    const model = req.body?.model || 'gpt-4o';

    // Determine provider from model name (or explicit header override)
    let provider = (req.headers['x-gateway-provider'] as string) || '';
    if (!provider) {
      if (model.startsWith('claude')) provider = 'anthropic';
      else if (model.startsWith('gemini')) provider = 'google';
      else if (model.startsWith('anthropic.') || model.startsWith('meta.') || model.startsWith('amazon.')) provider = 'bedrock';
      else if (model.startsWith('mistral-') || model.startsWith('codestral') || model.startsWith('open-mistral')) provider = 'mistral';
      else if (model.startsWith('command') || model.startsWith('embed-')) provider = 'cohere';
      else if (model.includes('groq') || model === 'mixtral-8x7b-32768' || model === 'gemma2-9b-it' || model === 'llama-3.3-70b-versatile' || model === 'llama-3.1-8b-instant') provider = 'groq';
      else if (['llama', 'codellama', 'phi'].some(p => model.startsWith(p))) provider = 'ollama';
      else provider = 'openai';
    }

    const gatewayRequest = {
      provider,
      model,
      endpoint: '/v1/chat/completions',
      method: 'POST',
      headers: Object.fromEntries(
        Object.entries(req.headers).filter(([_, v]) => typeof v === 'string') as [string, string][]
      ),
      body: req.body,
      ...userInfo,
    };

    // =========================================================================
    // STREAMING PATH — SSE passthrough with governance
    // =========================================================================
    if (req.body?.stream === true) {
      const result = await gateway.processStreamingRequest(gatewayRequest);

      if (result.blocked) {
        return res.status(403).json({
          error: {
            message: `Request blocked by CendiaGateway policy: ${result.interaction.policyReason}`,
            type: 'gateway_policy_block',
            code: 'policy_violation',
            gateway_interaction_id: result.interaction.id,
            pii_detected: result.interaction.piiScan.types,
          },
        });
      }

      if (!result.stream) {
        return res.status(502).json({ error: 'No stream from provider' });
      }

      // Set SSE headers
      res.set('Content-Type', 'text/event-stream');
      res.set('Cache-Control', 'no-cache');
      res.set('Connection', 'keep-alive');
      res.set('X-Gateway-Interaction-Id', result.interaction.id);
      res.set('X-Gateway-Integrity-Hash', result.interaction.integrityHash);
      res.set('X-Gateway-PII-Detected', String(result.interaction.piiScan.hasPII));
      res.set('X-Gateway-Policy-Action', result.interaction.policyAction);
      res.flushHeaders();

      // Pipe the provider's SSE stream directly to the client
      const reader = result.stream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      } catch (streamErr) {
        logger.error('[CendiaGateway] Stream pipe error:', streamErr);
      } finally {
        res.end();
      }
      return;
    }

    // =========================================================================
    // NON-STREAMING PATH — Standard JSON response
    // =========================================================================
    const interaction = await gateway.processRequest(gatewayRequest);

    if (interaction.policyAction === 'block') {
      return res.status(403).json({
        error: {
          message: `Request blocked by CendiaGateway policy: ${interaction.policyReason}`,
          type: 'gateway_policy_block',
          code: 'policy_violation',
          gateway_interaction_id: interaction.id,
          pii_detected: interaction.piiScan.types,
        },
      });
    }

    if (interaction.response) {
      res.set('X-Gateway-Interaction-Id', interaction.id);
      res.set('X-Gateway-Integrity-Hash', interaction.integrityHash);
      res.set('X-Gateway-PII-Detected', String(interaction.piiScan.hasPII));
      res.set('X-Gateway-Policy-Action', interaction.policyAction);
      res.set('X-Gateway-Latency-Ms', String(interaction.latencyMs));

      return res.status(interaction.response.statusCode).json(interaction.response.body);
    }

    return res.status(500).json({ error: 'No response from provider' });
  } catch (err: unknown) {
    logger.error('[CendiaGateway] Proxy error:', err);
    return res.status(500).json({ error: { message: (err as Error).message, type: 'gateway_error' } });
  }
});

// =============================================================================
// REVERSE PROXY — Anthropic-compatible endpoint
// =============================================================================

router.post('/v1/messages', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const userInfo = extractUserInfo(req);

    const interaction = await gateway.processRequest({
      provider: 'anthropic',
      model: req.body?.model || 'claude-3-5-sonnet-20241022',
      endpoint: '/v1/messages',
      method: 'POST',
      headers: Object.fromEntries(
        Object.entries(req.headers).filter(([_, v]) => typeof v === 'string') as [string, string][]
      ),
      body: req.body,
      ...userInfo,
    });

    if (interaction.policyAction === 'block') {
      return res.status(403).json({
        error: {
          message: `Request blocked by CendiaGateway policy: ${interaction.policyReason}`,
          type: 'gateway_policy_block',
          gateway_interaction_id: interaction.id,
        },
      });
    }

    if (interaction.response) {
      res.set('X-Gateway-Interaction-Id', interaction.id);
      res.set('X-Gateway-Integrity-Hash', interaction.integrityHash);
      res.set('X-Gateway-PII-Detected', String(interaction.piiScan.hasPII));
      res.set('X-Gateway-Policy-Action', interaction.policyAction);
      return res.status(interaction.response.statusCode).json(interaction.response.body);
    }

    return res.status(500).json({ error: 'No response from provider' });
  } catch (err: unknown) {
    return res.status(500).json({ error: { message: (err as Error).message } });
  }
});

// =============================================================================
// REVERSE PROXY — Generic provider endpoint
// =============================================================================

router.post('/proxy/:provider/*', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const userInfo = extractUserInfo(req);
    const provider = req.params.provider;
    const endpoint = '/' + (req.params as any)[0]; // Capture the wildcard path

    const interaction = await gateway.processRequest({
      provider,
      model: req.body?.model || 'unknown',
      endpoint,
      method: 'POST',
      headers: Object.fromEntries(
        Object.entries(req.headers).filter(([_, v]) => typeof v === 'string') as [string, string][]
      ),
      body: req.body,
      ...userInfo,
    });

    if (interaction.policyAction === 'block') {
      return res.status(403).json({
        error: {
          message: `Blocked: ${interaction.policyReason}`,
          type: 'gateway_policy_block',
          gateway_interaction_id: interaction.id,
        },
      });
    }

    if (interaction.response) {
      res.set('X-Gateway-Interaction-Id', interaction.id);
      res.set('X-Gateway-Integrity-Hash', interaction.integrityHash);
      return res.status(interaction.response.statusCode).json(interaction.response.body);
    }

    return res.status(500).json({ error: 'No response from provider' });
  } catch (err: unknown) {
    return res.status(500).json({ error: { message: (err as Error).message } });
  }
});

// =============================================================================
// DASHBOARD & STATISTICS
// =============================================================================

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const orgId = req.query.organizationId as string | undefined;
    const stats = gateway.getStats(orgId);
    return res.json(stats);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// INTERACTIONS
// =============================================================================

router.get('/interactions', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const interactions = gateway.getInteractions({
      organizationId: req.query.organizationId as string,
      userId: req.query.userId as string,
      provider: req.query.provider as string,
      piiOnly: req.query.piiOnly === 'true',
      blockedOnly: req.query.blockedOnly === 'true',
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
    });

    // Strip sensitive data from list view (prompt/response text)
    const sanitized = interactions.map(i => ({
      id: i.id,
      provider: i.request.provider,
      model: i.request.model,
      userId: i.request.userId,
      userEmail: i.request.userEmail,
      userDepartment: i.request.userDepartment,
      piiDetected: i.piiScan.hasPII,
      piiTypes: i.piiScan.types,
      policyAction: i.policyAction,
      policyReason: i.policyReason,
      promptTokens: i.response?.promptTokens || 0,
      responseTokens: i.response?.responseTokens || 0,
      totalTokens: i.response?.totalTokens || 0,
      estimatedCostUsd: i.response?.estimatedCostUsd || 0,
      latencyMs: i.latencyMs,
      statusCode: i.response?.statusCode || 0,
      integrityHash: i.integrityHash,
      requestedAt: i.requestedAt,
    }));

    return res.json({ interactions: sanitized, total: sanitized.length });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/interactions/:id', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const interaction = gateway.getInteraction(req.params.id);
    if (!interaction) {
      return res.status(404).json({ error: 'Interaction not found' });
    }

    return res.json({
      ...interaction,
      // Redact the actual prompt/response in the API response for security
      piiScan: {
        hasPII: interaction.piiScan.hasPII,
        types: interaction.piiScan.types,
        detectionCount: interaction.piiScan.detections.length,
        scanDurationMs: interaction.piiScan.scanDurationMs,
        // Don't expose raw PII values in the API
      },
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// PROVIDERS
// =============================================================================

router.get('/providers', async (_req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const providers = gateway.getProviders().map(p => ({
      id: p.id,
      name: p.name,
      models: p.models,
      // Don't expose baseUrl or auth config
    }));
    return res.json({ providers });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// POLICIES
// =============================================================================

router.get('/policies', async (_req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    return res.json({ policies: gateway.getPolicies() });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/policies', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const policy = {
      id: `policy-${Date.now()}`,
      name: req.body.name || 'New Policy',
      enabled: req.body.enabled ?? true,
      priority: req.body.priority ?? 100,
      departments: req.body.departments || [],
      blockPIITypes: req.body.blockPIITypes || [],
      redactPIITypes: req.body.redactPIITypes || [],
      blockKeywords: req.body.blockKeywords || [],
      maxPromptLength: req.body.maxPromptLength,
      defaultAction: req.body.defaultAction || 'allow',
      notifyOnBlock: req.body.notifyOnBlock ?? true,
      notifyEmail: req.body.notifyEmail,
    };
    gateway.addPolicy(policy);
    return res.status(201).json(policy);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.put('/policies/:id', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const updated = gateway.updatePolicy(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    return res.json(updated);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.delete('/policies/:id', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const removed = gateway.removePolicy(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    return res.json({ success: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// AI MANIFEST™ — Generate compliance artifact
// =============================================================================

router.post('/manifest', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const userInfo = extractUserInfo(req);

    const manifest = await gateway.generateManifest({
      organizationId: req.body.organizationId || userInfo.organizationId,
      organizationName: req.body.organizationName || 'Datacendia',
      periodStart: new Date(req.body.periodStart || Date.now() - 90 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(req.body.periodEnd || Date.now()),
      generatedBy: userInfo.userEmail,
    });

    return res.json(manifest);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// PII DETECTION TEST
// =============================================================================

router.post('/test-pii', async (req: Request, res: Response) => {
  try {
    const { text } = schema_0.parse(req.body);
    if (!text) {
      return res.status(400).json({ error: 'text field is required' });
    }

    const result = scanForPII(text);

    return res.json({
      hasPII: result.hasPII,
      types: result.types,
      detections: result.detections.map(d => ({
        type: d.type,
        redacted: d.redacted,
        confidence: d.confidence,
        // Don't return the actual PII value in the response
      })),
      redactedText: result.redactedText,
      scanDurationMs: result.scanDurationMs,
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// HEALTH CHECK
// =============================================================================

router.get('/health', async (_req: Request, res: Response) => {
  const gateway = getGateway();
  const stats = gateway.getStats();
  return res.json({
    status: 'healthy',
    service: 'CendiaGateway',
    version: '2.0.0',
    providers: gateway.getProviders().length,
    policies: gateway.getPolicies().filter(p => p.enabled).length,
    totalInteractions: stats.totalInteractions,
    uptime: process.uptime(),
    subsystems: {
      modelRouter: 'active',
      shadowAI: shadowDetector.getConfig().enabled ? 'active' : 'disabled',
      rateLimiter: 'active',
      siem: siemIntegration.getStats().activeConfigs > 0 ? 'active' : 'unconfigured',
    },
  });
});

// =============================================================================
// MODEL ROUTING — Cost-optimized fallback chains
// =============================================================================

router.get('/routing/rules', async (_req: Request, res: Response) => {
  try {
    return res.json({ rules: modelRouter.getRules() });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/routing/rules', async (req: Request, res: Response) => {
  try {
    modelRouter.addRule(req.body);
    return res.status(201).json(req.body);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.put('/routing/rules/:id', async (req: Request, res: Response) => {
  try {
    const updated = modelRouter.updateRule(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Rule not found' });
    return res.json(updated);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.delete('/routing/rules/:id', async (req: Request, res: Response) => {
  try {
    if (!modelRouter.removeRule(req.params.id)) return res.status(404).json({ error: 'Rule not found' });
    return res.json({ success: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/routing/performance', async (_req: Request, res: Response) => {
  try {
    return res.json({ models: modelRouter.getPerformanceStats() });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/routing/select', async (req: Request, res: Response) => {
  try {
    const decision = modelRouter.selectModel({
      requestedModel: req.body.model,
      userDepartment: req.body.department || 'unknown',
      userEmail: req.body.email || 'unknown',
      promptText: req.body.promptText || '',
      requiredCapabilities: req.body.capabilities,
    });
    return res.json({ decision });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// SHADOW AI DETECTION
// =============================================================================

router.get('/shadow-ai/events', async (req: Request, res: Response) => {
  try {
    const events = shadowDetector.getEvents({
      organizationId: req.query.organizationId as string,
      type: req.query.type as string as any,
      severity: req.query.severity as string,
      userId: req.query.userId as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
    });
    return res.json({ events, total: events.length });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/shadow-ai/report', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId || (req.query.organizationId as string) || 'unknown';
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const report = shadowDetector.generateReport(orgId, days);
    return res.json(report);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/shadow-ai/acknowledge/:id', async (req: Request, res: Response) => {
  try {
    if (!shadowDetector.acknowledgeEvent(req.params.id)) {
      return res.status(404).json({ error: 'Event not found' });
    }
    return res.json({ success: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/shadow-ai/config', async (_req: Request, res: Response) => {
  return res.json(shadowDetector.getConfig());
});

router.put('/shadow-ai/config', async (req: Request, res: Response) => {
  try {
    shadowDetector.updateConfig(req.body);
    return res.json(shadowDetector.getConfig());
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// WEBHOOK NOTIFICATIONS
// =============================================================================

router.get('/webhooks', async (_req: Request, res: Response) => {
  try {
    const webhooks = webhookNotifier.getWebhooks().map(w => ({
      ...w,
      url: w.url.replace(/\/\/.*@/, '//***@'), // Mask credentials in URL
      secret: w.secret ? '***' : undefined,
    }));
    return res.json({ webhooks });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/webhooks', async (req: Request, res: Response) => {
  try {
    const webhook = {
      id: `webhook-${Date.now()}`,
      ...req.body,
      rateLimitPerMinute: req.body.rateLimitPerMinute || 30,
      includePromptText: req.body.includePromptText ?? false,
    };
    webhookNotifier.addWebhook(webhook);
    return res.status(201).json(webhook);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.put('/webhooks/:id', async (req: Request, res: Response) => {
  try {
    const updated = webhookNotifier.updateWebhook(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Webhook not found' });
    return res.json(updated);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.delete('/webhooks/:id', async (req: Request, res: Response) => {
  try {
    if (!webhookNotifier.removeWebhook(req.params.id)) return res.status(404).json({ error: 'Webhook not found' });
    return res.json({ success: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/webhooks/:id/test', async (req: Request, res: Response) => {
  try {
    const result = await webhookNotifier.testWebhook(req.params.id);
    return res.json(result);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// THE GOVERNANCE RECEIPT™ — Export as HTML (PDF), CSV, JSON
// =============================================================================

// Primary route
router.post('/governance-receipt/export', governanceReceiptHandler);
// Backwards-compatible alias
router.post('/manifest/export', governanceReceiptHandler);

async function governanceReceiptHandler(req: Request, res: Response) {
  try {
    const gateway = getGateway();
    const userInfo = extractUserInfo(req);
    const format = (req.query.format as string) || 'html';

    const manifest = await gateway.generateManifest({
      organizationId: req.body.organizationId || userInfo.organizationId,
      organizationName: req.body.organizationName || 'Datacendia',
      periodStart: new Date(req.body.periodStart || Date.now() - 90 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(req.body.periodEnd || Date.now()),
      generatedBy: userInfo.userEmail,
    });

    switch (format) {
      case 'html':
      case 'pdf': {
        const html = manifestExporter.toHTML(manifest);
        res.set('Content-Type', 'text/html');
        res.set('Content-Disposition', `inline; filename="governance-receipt-${manifest.id}.html"`);
        return res.send(html);
      }
      case 'csv': {
        const csv = manifestExporter.toCSV(manifest);
        res.set('Content-Type', 'text/csv');
        res.set('Content-Disposition', `attachment; filename="governance-receipt-${manifest.id}.csv"`);
        return res.send(csv);
      }
      case 'json':
      default: {
        const json = manifestExporter.toJSON(manifest);
        res.set('Content-Type', 'application/json');
        res.set('Content-Disposition', `attachment; filename="governance-receipt-${manifest.id}.json"`);
        return res.send(json);
      }
    }
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
}

// =============================================================================
// RATE LIMITING — Configuration & Usage
// =============================================================================

router.get('/rate-limits', async (_req: Request, res: Response) => {
  try {
    return res.json({
      configs: rateLimiter.getConfigs(),
      usage: rateLimiter.getUsageStats(),
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/rate-limits', async (req: Request, res: Response) => {
  try {
    const config = {
      id: `ratelimit-${Date.now()}`,
      ...req.body,
      burstMultiplier: req.body.burstMultiplier || 1.0,
      notifyOnExceed: req.body.notifyOnExceed ?? true,
    };
    rateLimiter.addConfig(config);
    return res.status(201).json(config);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.put('/rate-limits/:id', async (req: Request, res: Response) => {
  try {
    const updated = rateLimiter.updateConfig(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Rate limit config not found' });
    return res.json(updated);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.delete('/rate-limits/:id', async (req: Request, res: Response) => {
  try {
    if (!rateLimiter.removeConfig(req.params.id)) return res.status(404).json({ error: 'Rate limit config not found' });
    return res.json({ success: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/rate-limits/check', async (req: Request, res: Response) => {
  try {
    const result = rateLimiter.check({
      userId: req.body.userId || 'test-user',
      userDepartment: req.body.department || 'unknown',
      organizationId: (req as any).organizationId || req.body.organizationId || 'unknown',
    });
    return res.json(result);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// SIEM INTEGRATION
// =============================================================================

router.get('/siem/configs', async (_req: Request, res: Response) => {
  try {
    const configs = siemIntegration.getConfigs().map(c => ({
      ...c,
      authToken: '***',
      authSecret: c.authSecret ? '***' : undefined,
    }));
    return res.json({ configs, stats: siemIntegration.getStats() });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/siem/configs', async (req: Request, res: Response) => {
  try {
    const config = {
      id: `siem-${Date.now()}`,
      batchSize: 50,
      flushIntervalMs: 10_000,
      includePIIDetails: false,
      includePromptHash: true,
      minSeverity: 'warning' as const,
      ...req.body,
    };
    siemIntegration.addConfig(config);
    return res.status(201).json({ ...config, authToken: '***' });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.put('/siem/configs/:id', async (req: Request, res: Response) => {
  try {
    const updated = siemIntegration.updateConfig(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'SIEM config not found' });
    return res.json({ ...updated, authToken: '***' });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.delete('/siem/configs/:id', async (req: Request, res: Response) => {
  try {
    if (!siemIntegration.removeConfig(req.params.id)) return res.status(404).json({ error: 'SIEM config not found' });
    return res.json({ success: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/siem/stats', async (_req: Request, res: Response) => {
  try {
    return res.json(siemIntegration.getStats());
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/siem/flush', async (_req: Request, res: Response) => {
  try {
    for (const config of siemIntegration.getConfigs()) {
      await siemIntegration.flush(config.id);
    }
    return res.json({ success: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// BROWSER EXTENSION ENDPOINTS — Used by Chrome/Firefox/Safari extensions
// =============================================================================

/**
 * POST /api/gateway/scan
 * PII scan endpoint for browser extension pre-flight checks.
 * Extension sends prompt text, gateway returns scan result + policy decision.
 */
router.post('/scan', async (req: Request, res: Response) => {
  try {
    const { text, source, domain, userId, organizationId } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text is required' });
    }

    const piiResult = scanForPII(text);

    // Policy evaluation: block critical PII
    const criticalTypes = ['ssn', 'credit_card', 'medical_record', 'bank_account', 'passport'];
    const foundCritical = piiResult.types.filter((t: string) => criticalTypes.includes(t));

    let blocked = false;
    let warned = false;
    let reason = '';

    if (foundCritical.length > 0) {
      blocked = true;
      reason = `Critical PII detected: ${foundCritical.join(', ')}. Request blocked by CendiaGateway policy.`;
    } else if (piiResult.hasPII) {
      warned = true;
      reason = `PII detected: ${piiResult.types.join(', ')}. Allowed with warning.`;
    }

    logger.info(`[Gateway/scan] source=${source || 'unknown'} domain=${domain || 'unknown'} user=${userId || 'anonymous'} pii=${piiResult.hasPII} blocked=${blocked}`);

    return res.json({
      blocked,
      warned,
      reason,
      piiDetected: piiResult.hasPII,
      piiTypes: piiResult.types,
      detections: piiResult.detections,
      source: source || 'unknown',
      domain: domain || 'unknown',
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * POST /api/gateway/browser-log
 * Logging endpoint for browser extension interaction records.
 * Receives metadata (not prompt text) for audit trail.
 */
router.post('/browser-log', async (req: Request, res: Response) => {
  try {
    const { source, domain, siteName, userId, organizationId, action, piiTypes, promptLength, timestamp } = req.body;

    logger.info(`[Gateway/browser-log] site=${siteName || domain} user=${userId || 'anonymous'} action=${action} pii=${(piiTypes || []).join(',')} len=${promptLength || 0}`);

    // Persist to database if available
    try {
      const { prisma } = await import('../config/database.js');
      await prisma.gateway_interactions.create({
        data: {
          id: crypto.randomUUID(),
          organization_id: organizationId || 'default',
          user_id: userId || 'anonymous',
          user_email: userId || 'anonymous',
          user_department: 'browser',
          provider: domain || 'unknown',
          model: 'browser-session',
          endpoint: '/',
          prompt_text: `[REDACTED — ${promptLength || 0} chars]`,
          response_text: '',
          prompt_tokens: 0,
          response_tokens: 0,
          total_tokens: 0,
          estimated_cost_usd: 0,
          pii_detected: (piiTypes || []).length > 0,
          pii_types: piiTypes || [],
          policy_action: action || 'allow',
          policy_reason: '',
          integrity_hash: crypto.createHash('sha256').update(JSON.stringify(req.body)).digest('hex'),
          signature: crypto.createHmac('sha256', process.env.GATEWAY_SIGNING_KEY || 'UNSIGNED').update(JSON.stringify(req.body)).digest('hex'),
        },
      });
    } catch {
      // DB persistence is best-effort — don't fail the request
    }

    return res.json({ success: true, logged: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// HTTP PROXY MODE ENDPOINTS — Start/stop/manage the network-level proxy
// =============================================================================


/**
 * POST /api/gateway/proxy/start
 * Start the HTTP forward proxy for browser-agnostic AI governance.
 */
router.post('/proxy/start', async (_req: Request, res: Response) => {
  try {
    await gatewayProxyServer.start();
    return res.json({
      success: true,
      message: 'Gateway HTTP proxy started',
      domains: gatewayProxyServer.getGovernedDomains().length,
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * POST /api/gateway/proxy/stop
 * Stop the HTTP forward proxy.
 */
router.post('/proxy/stop', async (_req: Request, res: Response) => {
  try {
    await gatewayProxyServer.stop();
    return res.json({ success: true, message: 'Gateway HTTP proxy stopped' });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * GET /api/gateway/proxy/stats
 * Get proxy server statistics.
 */
router.get('/proxy/stats', async (_req: Request, res: Response) => {
  try {
    return res.json(gatewayProxyServer.getStats());
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * GET /api/gateway/proxy/pac
 * Serve the PAC (Proxy Auto-Configuration) file for browser/system proxy setup.
 */
router.get('/proxy/pac', async (_req: Request, res: Response) => {
  try {
    const pac = gatewayProxyServer.generatePACFile();
    res.setHeader('Content-Type', 'application/x-ns-proxy-autoconfig');
    return res.send(pac);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * GET /api/gateway/proxy/domains
 * List all AI domains governed by the proxy.
 */
router.get('/proxy/domains', async (_req: Request, res: Response) => {
  try {
    return res.json({
      domains: gatewayProxyServer.getGovernedDomains(),
      count: gatewayProxyServer.getGovernedDomains().length,
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * POST /api/gateway/proxy/domains
 * Add a custom AI domain to the governed list.
 */
router.post('/proxy/domains', async (req: Request, res: Response) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'domain is required' });
    gatewayProxyServer.addAIDomain(domain);
    return res.json({ success: true, domain, domains: gatewayProxyServer.getGovernedDomains() });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * DELETE /api/gateway/proxy/domains/:domain
 * Remove an AI domain from the governed list.
 */
router.delete('/proxy/domains/:domain', async (req: Request, res: Response) => {
  try {
    gatewayProxyServer.removeAIDomain(req.params.domain);
    return res.json({ success: true, domains: gatewayProxyServer.getGovernedDomains() });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * GET /api/gateway/proxy/interactions
 * Get recent proxy interactions.
 */
router.get('/proxy/interactions', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const blocked = req.query.blocked === 'true';
    const interactions = blocked
      ? gatewayProxyServer.getBlockedInteractions(limit)
      : gatewayProxyServer.getRecentInteractions(limit);
    return res.json({ interactions, count: interactions.length });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// =============================================================================
// FEDERATION ENDPOINTS — "One agreement, all member orgs covered"
// =============================================================================

router.post('/federation', async (req: Request, res: Response) => {
  try {
    const { name, adminOrgId, adminContact, regulatoryFramework, reportingAuthority, complianceDeadline, description, dataIsolation } = req.body;
    if (!name || !adminOrgId) return res.status(400).json({ error: 'name and adminOrgId are required' });

    const federation = gatewayFederationService.createFederation({
      name, adminOrgId, adminContact, regulatoryFramework, reportingAuthority,
      complianceDeadline: complianceDeadline ? new Date(complianceDeadline) : undefined,
      description, dataIsolation,
    });
    return res.status(201).json(federation);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/federation', async (_req: Request, res: Response) => {
  try {
    return res.json({ federations: gatewayFederationService.listFederations() });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/federation/:id', async (req: Request, res: Response) => {
  try {
    const federation = gatewayFederationService.getFederation(req.params.id);
    if (!federation) return res.status(404).json({ error: 'Federation not found' });
    return res.json(federation);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/federation/:id/dashboard', async (req: Request, res: Response) => {
  try {
    const dashboard = gatewayFederationService.getFederationDashboard(req.params.id);
    if (!dashboard) return res.status(404).json({ error: 'Federation not found' });
    return res.json(dashboard);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/federation/:id/members', async (req: Request, res: Response) => {
  try {
    const { organizationId, orgName, orgCode, customDomains } = req.body;
    if (!organizationId || !orgName) return res.status(400).json({ error: 'organizationId and orgName are required' });

    const member = gatewayFederationService.addMember(req.params.id, { organizationId, orgName, orgCode, customDomains });
    if (!member) return res.status(404).json({ error: 'Federation not found' });
    return res.status(201).json(member);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/federation/:id/members', async (req: Request, res: Response) => {
  try {
    return res.json({ members: gatewayFederationService.getMembers(req.params.id) });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.delete('/federation/:id/members/:orgId', async (req: Request, res: Response) => {
  try {
    const removed = gatewayFederationService.removeMember(req.params.id, req.params.orgId);
    if (!removed) return res.status(404).json({ error: 'Federation or member not found' });
    return res.json({ success: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/federation/:id/policies', async (req: Request, res: Response) => {
  try {
    const policy = gatewayFederationService.addPolicy(req.params.id, req.body);
    if (!policy) return res.status(404).json({ error: 'Federation not found' });
    return res.status(201).json(policy);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/federation/:id/policies', async (req: Request, res: Response) => {
  try {
    const orgId = req.query.orgId as string;
    const policies = orgId
      ? gatewayFederationService.getPoliciesForOrg(req.params.id, orgId)
      : gatewayFederationService.getFederation(req.params.id)?.policies || [];
    return res.json({ policies });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/federation/:id/members/:orgId/stats', async (req: Request, res: Response) => {
  try {
    const periodStart = req.query.start ? new Date(req.query.start as string) : undefined;
    const periodEnd = req.query.end ? new Date(req.query.end as string) : undefined;
    const stats = gatewayFederationService.getMemberStats(req.params.id, req.params.orgId, periodStart, periodEnd);
    if (!stats) return res.status(404).json({ error: 'Federation or member not found' });
    return res.json(stats);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/federation/:id/reports', async (req: Request, res: Response) => {
  try {
    const { reportType, periodStart, periodEnd, title } = req.body;
    if (!reportType || !periodStart || !periodEnd) {
      return res.status(400).json({ error: 'reportType, periodStart, and periodEnd are required' });
    }

    const report = gatewayFederationService.generateReport(req.params.id, {
      reportType,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      title,
    });
    if (!report) return res.status(404).json({ error: 'Federation not found' });
    return res.status(201).json(report);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/federation/:id/interaction', async (req: Request, res: Response) => {
  try {
    const { orgId, blocked, piiDetected, piiTypes, provider } = req.body;
    if (!orgId) return res.status(400).json({ error: 'orgId is required' });

    gatewayFederationService.recordInteraction(req.params.id, orgId, {
      blocked: !!blocked,
      piiDetected: !!piiDetected,
      piiTypes: piiTypes || [],
      provider: provider || 'unknown',
    });
    return res.json({ success: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
