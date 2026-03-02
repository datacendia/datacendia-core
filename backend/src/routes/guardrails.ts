// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// NeMo GUARDRAILS ADMIN & MONITORING API ROUTES
// Mounted at /api/v1/guardrails
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { devAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { nemoGuardrails } from '../services/guardrails/NeMoGuardrailsEngine.js';
import { cendiaSentryService } from '../services/CendiaSentryService.js';

const router = Router();
router.use(devAuth);

// ─── Health & Stats ────────────────────────────────────────────────────

/**
 * GET /api/v1/guardrails/health
 * NeMo Guardrails engine + server health
 */
router.get('/health', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [serverHealth, nemoStats, sentryHealth] = await Promise.all([
      nemoGuardrails.checkServerHealth(),
      Promise.resolve(nemoGuardrails.getStats()),
      cendiaSentryService.getNeMoHealth(),
    ]);

    res.json({
      success: true,
      data: {
        engine: nemoStats,
        server: serverHealth,
        sentry: sentryHealth,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/guardrails/stats
 * Engine statistics
 */
router.get('/stats', async (_req: Request, res: Response) => {
  res.json({ success: true, data: nemoGuardrails.getStats() });
});

// ─── Rails Management ──────────────────────────────────────────────────

/**
 * GET /api/v1/guardrails/rails
 * List all rail definitions
 */
router.get('/rails', async (_req: Request, res: Response) => {
  const rails = nemoGuardrails.getRails().map(r => ({
    id: r.id,
    name: r.name,
    type: r.type,
    enabled: r.enabled,
    description: r.description,
    severity: r.severity,
    action: r.action,
    hasRegexPreFilter: !!(r.regexPreFilter && r.regexPreFilter.length > 0),
    hasPromptTemplate: !!r.promptTemplate,
  }));

  res.json({
    success: true,
    data: {
      rails,
      totalRails: rails.length,
      activeRails: rails.filter(r => r.enabled).length,
      byType: {
        input: rails.filter(r => r.type === 'input').length,
        output: rails.filter(r => r.type === 'output').length,
        dialog: rails.filter(r => r.type === 'dialog').length,
        topical: rails.filter(r => r.type === 'topical').length,
        fact_check: rails.filter(r => r.type === 'fact_check').length,
        moderation: rails.filter(r => r.type === 'moderation').length,
      },
    },
  });
});

/**
 * GET /api/v1/guardrails/rails/:railId
 * Get a specific rail
 */
router.get('/rails/:railId', async (req: Request, res: Response) => {
  const rail = nemoGuardrails.getRail(req.params.railId!);
  if (!rail) {
    res.status(404).json({ success: false, error: 'Rail not found' });
    return;
  }

  res.json({
    success: true,
    data: {
      ...rail,
      regexPreFilter: rail.regexPreFilter?.map(r => r.source) || [],
    },
  });
});

/**
 * PATCH /api/v1/guardrails/rails/:railId/toggle
 * Enable/disable a rail
 */
router.patch('/rails/:railId/toggle', async (req: Request, res: Response) => {
  const { enabled } = req.body;
  if (typeof enabled !== 'boolean') {
    res.status(400).json({ success: false, error: 'Missing required field: enabled (boolean)' });
    return;
  }

  const success = nemoGuardrails.setRailEnabled(req.params.railId!, enabled);
  if (!success) {
    res.status(404).json({ success: false, error: 'Rail not found' });
    return;
  }

  logger.info(`[Guardrails API] Rail ${req.params.railId} ${enabled ? 'enabled' : 'disabled'} by ${req.user?.email || 'unknown'}`);

  res.json({ success: true, data: { railId: req.params.railId, enabled } });
});

// ─── Colang Configuration ──────────────────────────────────────────────

/**
 * GET /api/v1/guardrails/colang
 * Get Colang topic configuration
 */
router.get('/colang', async (_req: Request, res: Response) => {
  res.json({ success: true, data: nemoGuardrails.getColangConfig() });
});

/**
 * PUT /api/v1/guardrails/colang
 * Update Colang topic configuration
 */
router.put('/colang', async (req: Request, res: Response) => {
  const { allowedTopics, blockedTopics, customFlows, factBase } = req.body;

  nemoGuardrails.updateColangConfig({
    allowedTopics,
    blockedTopics,
    customFlows,
    factBase,
  });

  logger.info(`[Guardrails API] Colang config updated by ${req.user?.email || 'unknown'}`);

  res.json({ success: true, data: nemoGuardrails.getColangConfig() });
});

// ─── Evaluation ────────────────────────────────────────────────────────

/**
 * POST /api/v1/guardrails/evaluate/input
 * Evaluate input through input rails (testing endpoint)
 */
router.post('/evaluate/input', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { input, context } = req.body;

    if (!input) {
      res.status(400).json({ success: false, error: 'Missing required field: input' });
      return;
    }

    const result = await nemoGuardrails.evaluateInput(input, context);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/guardrails/evaluate/output
 * Evaluate output through output rails (testing endpoint)
 */
router.post('/evaluate/output', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { input, output, context } = req.body;

    if (!input || !output) {
      res.status(400).json({ success: false, error: 'Missing required fields: input, output' });
      return;
    }

    const result = await nemoGuardrails.evaluateOutput(input, output, context);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/guardrails/evaluate/full
 * Full pipeline evaluation: input + output rails (testing endpoint)
 */
router.post('/evaluate/full', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { input, output, context } = req.body;

    if (!input || !output) {
      res.status(400).json({ success: false, error: 'Missing required fields: input, output' });
      return;
    }

    const result = await nemoGuardrails.evaluateFullPipeline(input, output, context);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/guardrails/check
 * Full CendiaSentry + NeMo Guardrails check (production endpoint)
 */
router.post('/check', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { input, output, inputType, agentId, modelUsed, context } = req.body;

    if (!input) {
      res.status(400).json({ success: false, error: 'Missing required field: input' });
      return;
    }

    const result = await cendiaSentryService.checkContentWithNeMo({
      organizationId: req.organizationId || 'default',
      userId: req.user?.id || 'anonymous',
      inputType: inputType || 'user_query',
      input,
      output,
      agentId,
      modelUsed,
      context,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
