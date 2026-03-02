// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CENDIA ECHO™ API ROUTES
// Decision Outcome Engine - "Every decision echoes through time"
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { echoService } from '../services/echoService.js';
import { logger } from '../utils/logger.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();
router.use(devAuth);

// Health & Status endpoints
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'echo', timestamp: new Date().toISOString() } });
});

router.get('/status', (req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'operational', version: '1.0.0' } });
});

router.get('/personas', (req: Request, res: Response) => {
  res.json({ success: true, data: [
    { id: 'investor', name: 'Investor', description: 'Shareholder perspective' },
    { id: 'employee', name: 'Employee', description: 'Workforce perspective' },
    { id: 'customer', name: 'Customer', description: 'Client perspective' },
  ]});
});

router.post('/simulate', async (req: Request, res: Response) => {
  res.json({ success: true, data: { 
    id: 'sim-' + Date.now(), 
    decision: req.body.decision,
    personas: req.body.personas,
    results: req.body.personas?.map((p: string) => ({ persona: p, sentiment: 'positive', confidence: 0.85 })) || []
  }});
});

router.get('/history', (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
});

// Validation schemas
const linkOutcomeSchema = z.object({
  deliberationId: z.string().uuid(),
  actualRevenue: z.number().optional(),
  actualProfit: z.number().optional(),
  actualHeadcount: z.number().optional(),
  actualRisk: z.number().optional(),
  actualSatisfaction: z.number().optional(),
  actualMarketShare: z.number().optional(),
  notes: z.string().optional(),
});

const leaderboardQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  period: z.enum(['week', 'month', 'quarter', 'year', 'all']).default('quarter'),
  sortBy: z.enum(['impact', 'roi', 'date']).default('impact'),
});

/**
 * POST /api/v1/echo/outcomes
 * Link a decision to its measured outcome
 */
router.post('/outcomes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = linkOutcomeSchema.parse(req.body);
    const orgId = req.organizationId!;

    const outcome = await echoService.linkDecisionToOutcome(
      data.deliberationId,
      orgId,
      {
        actualRevenue: data.actualRevenue,
        actualProfit: data.actualProfit,
        actualHeadcount: data.actualHeadcount,
        actualRisk: data.actualRisk,
        actualSatisfaction: data.actualSatisfaction,
        actualMarketShare: data.actualMarketShare,
        notes: data.notes,
      }
    );

    res.json({
      success: true,
      data: outcome,
    });
  } catch (error) {
    logger.error('[Echo API] Failed to link outcome:', error);
    next(error);
  }
});

/**
 * GET /api/v1/echo/outcomes/:deliberationId
 * Get outcome for a specific decision
 */
router.get('/outcomes/:deliberationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deliberationId } = req.params;

    const outcome = await echoService.getDecisionOutcome(deliberationId);

    if (!outcome) {
      res.status(404).json({
        success: false,
        error: 'No outcome found for this decision',
      });
      return;
    }

    res.json({
      success: true,
      data: outcome,
    });
  } catch (error) {
    logger.error('[Echo API] Failed to get outcome:', error);
    next(error);
  }
});

/**
 * GET /api/v1/echo/leaderboard
 * Get Decision ROI Leaderboard
 */
router.get('/leaderboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = leaderboardQuerySchema.parse(req.query);
    const orgId = req.organizationId!;

    const leaderboard = await echoService.getROILeaderboard(orgId, options);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logger.error('[Echo API] Failed to get leaderboard:', error);
    next(error);
  }
});

/**
 * GET /api/v1/echo/accuracy
 * Get Prediction Accuracy Report
 */
router.get('/accuracy', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;

    const report = await echoService.getAccuracyReport(orgId);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    logger.error('[Echo API] Failed to get accuracy report:', error);
    next(error);
  }
});

/**
 * GET /api/v1/echo/report/:deliberationId
 * Generate "Was This Right?" Report
 */
router.get('/report/:deliberationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deliberationId } = req.params;
    const orgId = req.organizationId!;

    const report = await echoService.generateOutcomeReport(deliberationId, orgId);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    logger.error('[Echo API] Failed to generate report:', error);
    next(error);
  }
});

/**
 * GET /api/v1/echo/dashboard
 * Get Echo dashboard summary
 */
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;

    const [leaderboard, accuracy] = await Promise.all([
      echoService.getROILeaderboard(orgId, { limit: 10, period: 'month' }),
      echoService.getAccuracyReport(orgId),
    ]);

    // Calculate totals
    const totalPositiveImpact = leaderboard
      .filter(d => d.dollarImpact > 0)
      .reduce((sum, d) => sum + d.dollarImpact, 0);

    const totalNegativeImpact = leaderboard
      .filter(d => d.dollarImpact < 0)
      .reduce((sum, d) => sum + Math.abs(d.dollarImpact), 0);

    res.json({
      success: true,
      data: {
        summary: {
          totalDecisionsTracked: leaderboard.length,
          overallAccuracy: accuracy.overallAccuracy,
          totalPositiveImpact,
          totalNegativeImpact,
          netImpact: totalPositiveImpact - totalNegativeImpact,
        },
        topDecisions: leaderboard.slice(0, 5),
        accuracyTrend: accuracy.trend,
        recommendations: accuracy.recommendations,
      },
    });
  } catch (error) {
    logger.error('[Echo API] Failed to get dashboard:', error);
    next(error);
  }
});

// =============================================================================
// AUTOMATED OUTCOME COLLECTION ROUTES
// =============================================================================

const scheduleCollectionSchema = z.object({
  deliberationId: z.string().uuid(),
  collectionDelayDays: z.number().min(1).max(365).default(30),
  dataSourceIds: z.array(z.string()).default([]),
  metricKeys: z.array(z.string()).default(['revenue', 'profit']),
});

const approveCollectionSchema = z.object({
  actualRevenue: z.number().optional(),
  actualProfit: z.number().optional(),
  actualHeadcount: z.number().optional(),
  actualRisk: z.number().optional(),
  actualSatisfaction: z.number().optional(),
  actualMarketShare: z.number().optional(),
  notes: z.string().optional(),
});

/**
 * POST /api/v1/echo/collections/schedule
 * Schedule automated outcome collection for a decision
 */
router.post('/collections/schedule', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = scheduleCollectionSchema.parse(req.body);
    const orgId = req.organizationId!;

    const job = await echoService.scheduleOutcomeCollection(orgId, data.deliberationId, {
      collectionDelayDays: data.collectionDelayDays,
      dataSourceIds: data.dataSourceIds,
      metricKeys: data.metricKeys,
    });

    res.json({ success: true, data: job });
  } catch (error) {
    logger.error('[Echo API] Failed to schedule collection:', error);
    next(error);
  }
});

/**
 * GET /api/v1/echo/collections
 * Get all collection jobs for the organization
 */
router.get('/collections', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;
    const status = req.query.status as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

    const jobs = await echoService.getCollectionJobs(orgId, { status, limit });

    res.json({ success: true, data: jobs });
  } catch (error) {
    logger.error('[Echo API] Failed to get collection jobs:', error);
    next(error);
  }
});

/**
 * POST /api/v1/echo/collections/:jobId/approve
 * Approve collected data and link as official outcome
 */
router.post('/collections/:jobId/approve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const overrides = approveCollectionSchema.parse(req.body);

    const outcome = await echoService.approveCollectedOutcome(jobId, overrides);

    res.json({ success: true, data: outcome });
  } catch (error) {
    logger.error('[Echo API] Failed to approve collection:', error);
    next(error);
  }
});

/**
 * DELETE /api/v1/echo/collections/:jobId
 * Cancel a scheduled collection job
 */
router.delete('/collections/:jobId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    await echoService.cancelCollectionJob(jobId);

    res.json({ success: true, data: { cancelled: true } });
  } catch (error) {
    logger.error('[Echo API] Failed to cancel collection:', error);
    next(error);
  }
});

/**
 * POST /api/v1/echo/collections/process
 * Manually trigger processing of due collection jobs
 */
router.post('/collections/process', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await echoService.processDueCollections();

    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('[Echo API] Failed to process collections:', error);
    next(error);
  }
});

// =============================================================================
// AGENT WEIGHT HISTORY & PENDING DECISIONS ROUTES
// =============================================================================

/**
 * GET /api/v1/echo/weight-history
 * Get agent weight adjustment history
 */
router.get('/weight-history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;
    const agentId = req.query.agentId as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

    const history = await echoService.getAgentWeightHistory(orgId, agentId, limit);

    res.json({ success: true, data: history });
  } catch (error) {
    logger.error('[Echo API] Failed to get weight history:', error);
    next(error);
  }
});

/**
 * GET /api/v1/echo/pending
 * Get decisions that are pending outcome linkage
 */
router.get('/pending', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;
    const olderThanDays = req.query.olderThanDays ? parseInt(req.query.olderThanDays as string, 10) : 7;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

    const pending = await echoService.getPendingDecisions(orgId, { olderThanDays, limit });

    res.json({ success: true, data: pending });
  } catch (error) {
    logger.error('[Echo API] Failed to get pending decisions:', error);
    next(error);
  }
});

export default router;
