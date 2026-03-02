// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CENDIA APOTHEOSIS™ API ROUTES
// The Self-Improvement Loop That Never Stops
// =============================================================================

import { Router, Request, Response } from 'express';
import { apotheosisService } from '../services/CendiaApotheosisService.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Status endpoints for enterprise testing
router.get('/status', (req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'operational', version: '1.0.0' } });
});

router.get('/upskill-queue', (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
});

router.get('/history', (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
});

// =============================================================================
// APOTHEOSIS SCORE & DASHBOARD
// =============================================================================

/**
 * GET /api/apotheosis/score
 * Get the current Apotheosis Score for the organization
 */
router.get('/score', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId!;
    const score = await apotheosisService.getApotheosisScore(organizationId);
    res.json(score);
  } catch (error) {
    logger.error('[Apotheosis API] Error getting score:', error);
    res.status(500).json({ error: 'Failed to get Apotheosis score' });
  }
});

/**
 * GET /api/apotheosis/latest-run
 * Get the latest Apotheosis run results
 */
router.get('/latest-run', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId!;
    const run = await apotheosisService.getLatestRun(organizationId);
    res.json(run);
  } catch (error) {
    logger.error('[Apotheosis API] Error getting latest run:', error);
    res.status(500).json({ error: 'Failed to get latest run' });
  }
});

/**
 * GET /api/apotheosis/run-history
 * Get historical Apotheosis runs
 */
router.get('/run-history', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId!;
    const limit = parseInt(req.query.limit as string) || 30;
    const runs = await apotheosisService.getRunHistory(organizationId, limit);
    res.json(runs);
  } catch (error) {
    logger.error('[Apotheosis API] Error getting run history:', error);
    res.status(500).json({ error: 'Failed to get run history' });
  }
});

// =============================================================================
// ESCALATIONS
// =============================================================================

/**
 * GET /api/apotheosis/escalations
 * Get pending escalations requiring human decision
 */
router.get('/escalations', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId!;
    const escalations = await apotheosisService.getPendingEscalations(organizationId);
    res.json(escalations);
  } catch (error) {
    logger.error('[Apotheosis API] Error getting escalations:', error);
    res.status(500).json({ error: 'Failed to get escalations' });
  }
});

/**
 * POST /api/apotheosis/escalations/:id/respond
 * Respond to an escalation
 */
router.post('/escalations/:id/respond', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { response, reason } = req.body;
    
    await apotheosisService.respondToEscalation(id, response, reason);
    res.json({ success: true });
  } catch (error) {
    logger.error('[Apotheosis API] Error responding to escalation:', error);
    res.status(500).json({ error: 'Failed to respond to escalation' });
  }
});

// =============================================================================
// PATTERN BANS
// =============================================================================

/**
 * GET /api/apotheosis/banned-patterns
 * Get all banned decision patterns
 */
router.get('/banned-patterns', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId!;
    const patterns = await apotheosisService.getBannedPatterns(organizationId);
    res.json(patterns);
  } catch (error) {
    logger.error('[Apotheosis API] Error getting banned patterns:', error);
    res.status(500).json({ error: 'Failed to get banned patterns' });
  }
});

// =============================================================================
// UPSKILLING
// =============================================================================

/**
 * GET /api/apotheosis/upskill-assignments
 * Get all upskill assignments
 */
router.get('/upskill-assignments', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId!;
    const assignments = await apotheosisService.getUpskillAssignments(organizationId);
    res.json(assignments);
  } catch (error) {
    logger.error('[Apotheosis API] Error getting upskill assignments:', error);
    res.status(500).json({ error: 'Failed to get upskill assignments' });
  }
});

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * GET /api/apotheosis/config
 * Get Apotheosis configuration
 */
router.get('/config', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId!;
    const config = await apotheosisService.getConfig(organizationId);
    res.json(config);
  } catch (error) {
    logger.error('[Apotheosis API] Error getting config:', error);
    res.status(500).json({ error: 'Failed to get config' });
  }
});

/**
 * PUT /api/apotheosis/config
 * Update Apotheosis configuration
 */
router.put('/config', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId!;
    const config = await apotheosisService.updateConfig(organizationId, req.body);
    res.json(config);
  } catch (error) {
    logger.error('[Apotheosis API] Error updating config:', error);
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// =============================================================================
// MANUAL RUN
// =============================================================================

/**
 * POST /api/apotheosis/trigger-run
 * Trigger a manual Apotheosis run
 */
router.post('/trigger-run', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId!;
    const runId = await apotheosisService.triggerManualRun(organizationId);
    res.json({ runId, message: 'Apotheosis run triggered' });
  } catch (error) {
    logger.error('[Apotheosis API] Error triggering run:', error);
    res.status(500).json({ error: 'Failed to trigger run' });
  }
});

export default router;
