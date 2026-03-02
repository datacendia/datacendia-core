/**
 * API Routes — Temporal
 *
 * Express route handler defining REST endpoints.
 * @module routes/temporal
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// TEMPORAL.IO WORKFLOW ORCHESTRATION API ROUTES
// Mounted at /api/v1/temporal
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { devAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { temporal } from '../services/temporal/TemporalService.js';

const router = Router();
router.use(devAuth);

// ─── Health & Stats ────────────────────────────────────────────────────

/**
 * GET /api/v1/temporal/health
 */
router.get('/health', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const health = await temporal.checkServerHealth();
    res.json({ success: true, data: health });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/temporal/stats
 */
router.get('/stats', (_req: Request, res: Response) => {
  res.json({ success: true, data: temporal.getStats() });
});

// ─── Workflow Definitions ──────────────────────────────────────────────

/**
 * GET /api/v1/temporal/definitions
 * List all registered workflow definitions
 */
router.get('/definitions', (_req: Request, res: Response) => {
  const defs = temporal.getWorkflowDefs().map(d => ({
    id: d.id,
    name: d.name,
    description: d.description,
    taskQueue: d.taskQueue,
    executionTimeoutSec: d.executionTimeoutSec,
    cronSchedule: d.cronSchedule,
    activityCount: d.activities.length,
    signals: d.signals,
    queries: d.queries,
  }));

  res.json({ success: true, data: { definitions: defs, total: defs.length } });
});

/**
 * GET /api/v1/temporal/definitions/:defId
 */
router.get('/definitions/:defId', (req: Request, res: Response) => {
  const def = temporal.getWorkflowDef(req.params.defId!);
  if (!def) {
    res.status(404).json({ success: false, error: 'Workflow definition not found' });
    return;
  }
  res.json({ success: true, data: def });
});

// ─── Workflow Execution ────────────────────────────────────────────────

/**
 * POST /api/v1/temporal/workflows/start
 * Start a new workflow execution
 */
router.post('/workflows/start', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workflowId, workflowType, taskQueue, input, memo, searchAttributes, cronSchedule } = req.body;

    if (!workflowType) {
      res.status(400).json({ success: false, error: 'Missing required field: workflowType' });
      return;
    }

    const execution = await temporal.startWorkflow({
      workflowId,
      workflowType,
      taskQueue,
      input,
      memo: { ...memo, startedBy: req.user?.email || 'api' },
      searchAttributes: {
        ...searchAttributes,
        organizationId: req.organizationId || 'unknown',
      },
      cronSchedule,
    });

    logger.info(`[Temporal API] Workflow ${execution.workflowId} (${workflowType}) started by ${req.user?.email || 'unknown'}`);

    res.json({ success: true, data: execution });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/temporal/workflows
 * List workflow executions
 */
router.get('/workflows', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workflowType, state, limit } = req.query;

    const result = await temporal.listWorkflows({
      workflowType: workflowType as string | undefined,
      state: state as any,
      limit: limit ? parseInt(limit as string) : 50,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/temporal/workflows/:workflowId
 * Get workflow execution details
 */
router.get('/workflows/:workflowId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const execution = await temporal.getWorkflow(req.params.workflowId!);
    if (!execution) {
      res.status(404).json({ success: false, error: 'Workflow execution not found' });
      return;
    }
    res.json({ success: true, data: execution });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/temporal/workflows/:workflowId/signal
 * Send a signal to a running workflow
 */
router.post('/workflows/:workflowId/signal', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { signalName, payload } = req.body;

    if (!signalName) {
      res.status(400).json({ success: false, error: 'Missing required field: signalName' });
      return;
    }

    const success = await temporal.signalWorkflow({
      workflowId: req.params.workflowId!,
      signalName,
      payload,
    });

    if (!success) {
      res.status(404).json({ success: false, error: 'Workflow not found or not running' });
      return;
    }

    logger.info(`[Temporal API] Signal '${signalName}' sent to ${req.params.workflowId} by ${req.user?.email || 'unknown'}`);

    res.json({ success: true, data: { workflowId: req.params.workflowId, signalName, sent: true } });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/temporal/workflows/:workflowId/cancel
 * Cancel a running workflow
 */
router.post('/workflows/:workflowId/cancel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;

    const success = await temporal.cancelWorkflow(req.params.workflowId!, reason);
    if (!success) {
      res.status(404).json({ success: false, error: 'Workflow not found or not running' });
      return;
    }

    logger.info(`[Temporal API] Workflow ${req.params.workflowId} cancelled by ${req.user?.email || 'unknown'}`);

    res.json({ success: true, data: { workflowId: req.params.workflowId, cancelled: true } });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/temporal/workflows/:workflowId/terminate
 * Terminate a workflow immediately
 */
router.post('/workflows/:workflowId/terminate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;

    const success = await temporal.terminateWorkflow(req.params.workflowId!, reason);
    if (!success) {
      res.status(404).json({ success: false, error: 'Workflow not found' });
      return;
    }

    logger.info(`[Temporal API] Workflow ${req.params.workflowId} terminated by ${req.user?.email || 'unknown'}`);

    res.json({ success: true, data: { workflowId: req.params.workflowId, terminated: true } });
  } catch (error) {
    next(error);
  }
});

export default router;
