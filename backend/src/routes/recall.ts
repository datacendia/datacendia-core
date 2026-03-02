// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIARECALL™ ROUTES - Decision Outcome Tracking API
// =============================================================================

import { Router, Request, Response } from 'express';
import { cendiaRecallService } from '../services/CendiaRecallService.js';
import { logger } from '../utils/logger.js';

const router = Router();

// ---------------------------------------------------------------------------
// HEALTH
// ---------------------------------------------------------------------------

router.get('/recall/health', async (_req: Request, res: Response) => {
  try {
    const health = await cendiaRecallService.getHealth();
    res.json({ success: true, data: health });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------------------------------------------------------------
// OUTCOME TRACKERS
// ---------------------------------------------------------------------------

router.post('/recall/trackers', async (req: Request, res: Response) => {
  try {
    const { organizationId, decisionId, title, predictedOutcomes, trackedBy, options } = req.body;
    if (!organizationId || !decisionId || !title || !predictedOutcomes) {
      return res.status(400).json({ success: false, error: 'Missing required fields: organizationId, decisionId, title, predictedOutcomes' });
    }
    const tracker = await cendiaRecallService.createOutcomeTracker(
      organizationId, decisionId, title, predictedOutcomes, trackedBy || 'system', options
    );
    res.status(201).json({ success: true, data: tracker });
  } catch (error: any) {
    logger.error('CendiaRecall route error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/recall/trackers', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'default';
    const status = req.query.status as string | undefined;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const result = await cendiaRecallService.getOutcomes(organizationId, { status: status as any, limit, offset });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/recall/trackers/:id', async (req: Request, res: Response) => {
  try {
    const outcome = await cendiaRecallService.getOutcome(req.params.id);
    if (!outcome) return res.status(404).json({ success: false, error: 'Tracker not found' });
    res.json({ success: true, data: outcome });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------------------------------------------------------------
// RECORD ACTUAL OUTCOMES
// ---------------------------------------------------------------------------

router.post('/recall/trackers/:id/actual', async (req: Request, res: Response) => {
  try {
    const { metric, actualValue, unit, evidenceSource, verified } = req.body;
    if (!metric || actualValue === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields: metric, actualValue' });
    }
    const result = await cendiaRecallService.recordActualOutcome(req.params.id, {
      metric,
      actualValue,
      unit: unit || '',
      measuredAt: new Date(),
      evidenceSource: evidenceSource || 'manual',
      verified: verified || false,
    });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/recall/trackers/:id/roi', async (req: Request, res: Response) => {
  try {
    const { actualROI } = req.body;
    if (actualROI === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required field: actualROI' });
    }
    const result = await cendiaRecallService.recordActualROI(req.params.id, actualROI);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------------------------------------------------------------
// VERIFICATION & CLOSURE
// ---------------------------------------------------------------------------

router.post('/recall/trackers/:id/verify', async (req: Request, res: Response) => {
  try {
    const { verifiedBy } = req.body;
    const result = await cendiaRecallService.verifyOutcome(req.params.id, verifiedBy || 'system');
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/recall/trackers/:id/close', async (req: Request, res: Response) => {
  try {
    const { lessonsLearned } = req.body;
    const result = await cendiaRecallService.closeOutcome(req.params.id, lessonsLearned || []);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------------------------------------------------------------
// REPORTS & ANALYTICS
// ---------------------------------------------------------------------------

router.get('/recall/accuracy', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'default';
    const period = (req.query.period as string) || 'last-90-days';
    const report = await cendiaRecallService.getPredictionAccuracyReport(organizationId, period);
    res.json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/recall/lessons', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'default';
    const category = req.query.category as string | undefined;
    const impact = req.query.impact as string | undefined;
    const limit = parseInt(req.query.limit as string) || 20;
    const lessons = await cendiaRecallService.getLessonsLearned(organizationId, { category, impact, limit });
    res.json({ success: true, data: lessons });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/recall/lessons/:id/endorse', async (req: Request, res: Response) => {
  try {
    const { endorsedBy } = req.body;
    const result = await cendiaRecallService.endorseLesson(req.params.id, endorsedBy || 'system');
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------------------------------------------------------------
// FEEDBACK LOOP
// ---------------------------------------------------------------------------

router.get('/recall/feedback/:decisionType', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'default';
    const feedback = await cendiaRecallService.getFeedbackForDecisionType(organizationId, req.params.decisionType);
    res.json({ success: true, data: feedback });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
