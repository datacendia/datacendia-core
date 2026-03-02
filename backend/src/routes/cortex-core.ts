// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Cortex Core API Routes
 * Single gateway for all Services to access organizational data
 * Enforces: Sources â†’ Pillars â†’ Cortex â†’ Services
 */

import { Router, Request, Response } from 'express';
import { cortexCore } from '../services/cortex/index';
import type { QueryParams, AnalyzeParams, SimulateParams, GovernParams, ContextOptions } from '../services/cortex/types';

const router = Router();

// =============================================================================
// QUERY ENGINE - /api/v1/cortex/query
// =============================================================================

/**
 * POST /api/v1/cortex/query
 * Universal query interface for any organizational data
 */
router.post('/query', async (req: Request, res: Response) => {
  try {
    const params: QueryParams = {
      intent: req.body.intent || 'structured',
      query: req.body.query,
      pillars: req.body.pillars,
      context: {
        organizationId: req.body.context?.organizationId || req.headers['x-organization-id'] as string || 'default',
        userId: req.body.context?.userId || req.headers['x-user-id'] as string,
        timeRange: req.body.context?.timeRange,
      },
    };

    const result = await cortexCore.query(params);
    res.json(result);
  } catch (error) {
    console.error('[CortexCore] Query error:', error);
    res.status(500).json({ success: false, error: 'Query failed', message: (error as Error).message });
  }
});

// =============================================================================
// ANALYZE ENGINE - /api/v1/cortex/analyze
// =============================================================================

/**
 * POST /api/v1/cortex/analyze
 * AI-powered analysis on organizational data
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const params: AnalyzeParams = {
      type: req.body.type || 'risk',
      subject: req.body.subject || { entityType: 'organization', entityId: 'default' },
      parameters: req.body.parameters,
      context: {
        organizationId: req.body.context?.organizationId || req.headers['x-organization-id'] as string || 'default',
        userId: req.body.context?.userId || req.headers['x-user-id'] as string,
      },
    };

    const result = await cortexCore.analyze(params);
    res.json(result);
  } catch (error) {
    console.error('[CortexCore] Analyze error:', error);
    res.status(500).json({ success: false, error: 'Analysis failed', message: (error as Error).message });
  }
});

// =============================================================================
// COMPUTATION ENGINE - /api/v1/cortex/simulate
// =============================================================================

/**
 * POST /api/v1/cortex/simulate
 * Run simulations and forecasts
 */
router.post('/simulate', async (req: Request, res: Response) => {
  try {
    const params: SimulateParams = {
      type: req.body.type || 'forecast',
      baseline: req.body.baseline || { entityType: 'metric' },
      changes: req.body.changes || [],
      horizon: req.body.horizon || '30d',
      iterations: req.body.iterations,
      context: {
        organizationId: req.body.context?.organizationId || req.headers['x-organization-id'] as string || 'default',
        userId: req.body.context?.userId || req.headers['x-user-id'] as string,
      },
    };

    const result = await cortexCore.simulate(params);
    res.json(result);
  } catch (error) {
    console.error('[CortexCore] Simulate error:', error);
    res.status(500).json({ success: false, error: 'Simulation failed', message: (error as Error).message });
  }
});

// =============================================================================
// GOVERN ENGINE - /api/v1/cortex/govern
// =============================================================================

/**
 * POST /api/v1/cortex/govern
 * Governance, compliance, and ethics checks
 */
router.post('/govern', async (req: Request, res: Response) => {
  try {
    const params: GovernParams = {
      action: req.body.action || 'check',
      subject: req.body.subject || { entityType: 'decision', entityId: 'unknown' },
      governanceType: req.body.governanceType || 'compliance',
      parameters: req.body.parameters,
      context: {
        organizationId: req.body.context?.organizationId || req.headers['x-organization-id'] as string || 'default',
        userId: req.body.context?.userId || req.headers['x-user-id'] as string,
      },
      reason: req.body.reason,
    };

    const result = await cortexCore.govern(params);
    res.json(result);
  } catch (error) {
    console.error('[CortexCore] Govern error:', error);
    res.status(500).json({ success: false, error: 'Governance check failed', message: (error as Error).message });
  }
});

// =============================================================================
// CONTEXT ENGINE - /api/v1/cortex/context
// =============================================================================

/**
 * GET /api/v1/cortex/context/:entityType/:entityId
 * Get unified organizational context for any entity
 */
router.get('/context/:entityType/:entityId', async (req: Request, res: Response) => {
  try {
    const { entityType, entityId } = req.params;
    const options: ContextOptions = {
      depth: parseInt(req.query['depth'] as string) || 1,
      include: req.query['include'] ? (req.query['include'] as string).split(',') as any : undefined,
      exclude: req.query['exclude'] ? (req.query['exclude'] as string).split(',') as any : undefined,
    };
    const context = {
      organizationId: req.headers['x-organization-id'] as string || 'default',
      userId: req.headers['x-user-id'] as string,
    };

    const result = await cortexCore.getContext(entityType || '', entityId || '', options, context);
    res.json(result);
  } catch (error) {
    console.error('[CortexCore] Context error:', error);
    res.status(500).json({ success: false, error: 'Context retrieval failed', message: (error as Error).message });
  }
});

// =============================================================================
// UTILITY ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/cortex/pillars
 * List available pillars and their status
 */
router.get('/pillars', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    pillars: [
      { name: 'helm', description: 'Metrics & KPIs', status: 'active' },
      { name: 'lineage', description: 'Data Provenance', status: 'active' },
      { name: 'predict', description: 'Forecasting', status: 'active' },
      { name: 'flow', description: 'Workflow Automation', status: 'active' },
      { name: 'health', description: 'System Health', status: 'active' },
      { name: 'guard', description: 'Security & Compliance', status: 'active' },
      { name: 'ethics', description: 'Ethical Guardrails', status: 'active' },
      { name: 'agents', description: 'AI Advisors', status: 'active' },
    ],
  });
});

/**
 * GET /api/v1/cortex/status
 * Health check for Cortex Core API
 */
router.get('/status', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'operational',
    version: '1.0.0',
    engines: {
      query: 'operational',
      analyze: 'operational',
      simulate: 'operational',
      govern: 'operational',
      context: 'operational',
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/v1/cortex/natural-language
 * Direct natural language query endpoint
 */
router.post('/natural-language', async (req: Request, res: Response) => {
  try {
    const result = await cortexCore.query({
      intent: 'natural_language',
      query: req.body.question || req.body.query,
      context: {
        organizationId: req.body.organizationId || req.headers['x-organization-id'] as string || 'default',
        userId: req.headers['x-user-id'] as string,
      },
    });
    res.json(result);
  } catch (error) {
    console.error('[CortexCore] NL Query error:', error);
    res.status(500).json({ success: false, error: 'Query failed', message: (error as Error).message });
  }
});

export default router;
