// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// OPA (Open Policy Agent) ADMIN & EVALUATION API ROUTES
// Mounted at /api/v1/opa
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { devAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { opa } from '../services/opa/OPAService.js';

const router = Router();
router.use(devAuth);

// ─── Health & Stats ────────────────────────────────────────────────────

/**
 * GET /api/v1/opa/health
 */
router.get('/health', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const health = await opa.checkHealth();
    res.json({ success: true, data: health });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/opa/stats
 */
router.get('/stats', (_req: Request, res: Response) => {
  res.json({ success: true, data: opa.getStats() });
});

// ─── Policy Management ─────────────────────────────────────────────────

/**
 * GET /api/v1/opa/policies
 * List all policies
 */
router.get('/policies', (_req: Request, res: Response) => {
  const policies = opa.getPolicies().map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    enabled: p.enabled,
    priority: p.priority,
    complianceFrameworks: p.complianceFrameworks,
    verticals: p.verticals,
    hasRego: !!p.rego,
    hasEvaluator: !!p.evaluator,
  }));

  res.json({
    success: true,
    data: {
      policies,
      totalPolicies: policies.length,
      activePolicies: policies.filter(p => p.enabled).length,
      byCategory: policies.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    },
  });
});

/**
 * GET /api/v1/opa/policies/:policyId
 */
router.get('/policies/:policyId', (req: Request, res: Response) => {
  const policy = opa.getPolicy(req.params.policyId!);
  if (!policy) {
    res.status(404).json({ success: false, error: 'Policy not found' });
    return;
  }

  res.json({
    success: true,
    data: {
      id: policy.id,
      name: policy.name,
      description: policy.description,
      category: policy.category,
      enabled: policy.enabled,
      priority: policy.priority,
      complianceFrameworks: policy.complianceFrameworks,
      verticals: policy.verticals,
      hasRego: !!policy.rego,
      rego: policy.rego,
    },
  });
});

/**
 * PATCH /api/v1/opa/policies/:policyId/toggle
 */
router.patch('/policies/:policyId/toggle', (req: Request, res: Response) => {
  const { enabled } = req.body;
  if (typeof enabled !== 'boolean') {
    res.status(400).json({ success: false, error: 'Missing required field: enabled (boolean)' });
    return;
  }

  const success = opa.setPolicyEnabled(req.params.policyId!, enabled);
  if (!success) {
    res.status(404).json({ success: false, error: 'Policy not found' });
    return;
  }

  logger.info(`[OPA API] Policy ${req.params.policyId} ${enabled ? 'enabled' : 'disabled'} by ${req.user?.email || 'unknown'}`);
  res.json({ success: true, data: { policyId: req.params.policyId, enabled } });
});

/**
 * GET /api/v1/opa/policies/category/:category
 */
router.get('/policies/category/:category', (req: Request, res: Response) => {
  const policies = opa.getPoliciesByCategory(req.params.category as any);
  res.json({
    success: true,
    data: policies.map(p => ({
      id: p.id, name: p.name, description: p.description,
      enabled: p.enabled, complianceFrameworks: p.complianceFrameworks,
    })),
  });
});

/**
 * GET /api/v1/opa/policies/framework/:framework
 */
router.get('/policies/framework/:framework', (req: Request, res: Response) => {
  const policies = opa.getPoliciesByFramework(req.params.framework!);
  res.json({
    success: true,
    data: policies.map(p => ({
      id: p.id, name: p.name, description: p.description,
      enabled: p.enabled, category: p.category,
    })),
  });
});

// ─── Evaluation ────────────────────────────────────────────────────────

/**
 * POST /api/v1/opa/evaluate
 * Evaluate an authorization request against all applicable policies
 */
router.post('/evaluate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subject, action, resource, context } = req.body;

    if (!subject || !action || !resource) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: subject, action, resource',
      });
      return;
    }

    // Enrich subject with request context
    const enrichedInput = {
      subject: {
        ...subject,
        organizationId: subject.organizationId || req.organizationId,
      },
      action,
      resource,
      context: {
        timestamp: new Date().toISOString(),
        ipAddress: req.ip,
        environment: process.env.NODE_ENV || 'development',
        ...context,
      },
    };

    const result = await opa.evaluate(enrichedInput);

    // Emit to Kafka if available
    try {
      const { kafkaEventBridge } = await import('../services/kafka/KafkaEventBridge.js');
      await kafkaEventBridge.emitAudit({
        organizationId: enrichedInput.subject.organizationId || 'unknown',
        userId: enrichedInput.subject.id,
        action: `opa.evaluate.${result.allow ? 'allow' : 'deny'}`,
        resourceType: enrichedInput.resource.type,
        resourceId: enrichedInput.resource.id,
        details: {
          opaDecisionId: result.metadata.decisionId,
          violations: result.violations.length,
          obligations: result.obligations.length,
          policiesEvaluated: result.metadata.policiesEvaluated,
        },
      });
    } catch {
      // Kafka not critical
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/opa/evaluate/batch
 * Evaluate multiple authorization requests
 */
router.post('/evaluate/batch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { requests } = req.body;

    if (!Array.isArray(requests) || requests.length === 0) {
      res.status(400).json({ success: false, error: 'Missing required field: requests (array)' });
      return;
    }

    if (requests.length > 50) {
      res.status(400).json({ success: false, error: 'Maximum 50 requests per batch' });
      return;
    }

    const results = await Promise.all(
      requests.map((r: any) => opa.evaluate({
        subject: r.subject,
        action: r.action,
        resource: r.resource,
        context: {
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          ...r.context,
        },
      }))
    );

    res.json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          allowed: results.filter(r => r.allow).length,
          denied: results.filter(r => !r.allow).length,
          totalViolations: results.reduce((sum, r) => sum + r.violations.length, 0),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── Bundles ───────────────────────────────────────────────────────────

/**
 * GET /api/v1/opa/bundles
 */
router.get('/bundles', (_req: Request, res: Response) => {
  const bundles = opa.getBundles().map(b => ({
    id: b.id,
    name: b.name,
    version: b.version,
    description: b.description,
    policyCount: b.policies.length,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  }));

  res.json({ success: true, data: bundles });
});

export default router;
