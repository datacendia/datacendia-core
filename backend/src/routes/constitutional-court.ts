/**
 * API Routes — Constitutional Court
 *
 * Express route handler defining REST endpoints.
 * @module routes/constitutional-court
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaConstitutionalCourt™ API Routes
 * 
 * AI Dispute Resolution with Precedent Tracking
 */

import { Router, Request, Response } from 'express';
import { 
  aiConstitutionalCourtService, 
  DisputeCategory 
} from '../services/governance/AIConstitutionalCourtService.js';

const router = Router();

/**
 * GET /api/v1/constitutional-court/health
 * Health check
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'CendiaConstitutionalCourt',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/constitutional-court/principles
 * Get constitutional principles
 */
router.get('/principles', (_req: Request, res: Response) => {
  try {
    const principles = aiConstitutionalCourtService.getPrinciples();
    res.json({ success: true, data: principles });
  } catch (error) {
    console.error('Error getting principles:', error);
    res.status(500).json({ success: false, error: 'Failed to get principles' });
  }
});

/**
 * GET /api/v1/constitutional-court/statistics
 * Get court statistics
 */
router.get('/statistics', (_req: Request, res: Response) => {
  try {
    const stats = aiConstitutionalCourtService.getStatistics();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ success: false, error: 'Failed to get statistics' });
  }
});

/**
 * POST /api/v1/constitutional-court/disputes
 * File a new dispute
 */
router.post('/disputes', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, petitioner, respondent, deliberationId, verticalId, organizationId } = req.body;

    if (!title || !category || !petitioner || !respondent || !organizationId) {
      res.status(400).json({
        success: false,
        error: 'title, category, petitioner, respondent, and organizationId are required',
      });
      return;
    }

    const dispute = await aiConstitutionalCourtService.fileDispute({
      title,
      category: category as DisputeCategory,
      petitioner,
      respondent,
      deliberationId,
      verticalId,
      organizationId,
    });

    res.status(201).json({ success: true, data: dispute });
  } catch (error) {
    console.error('Error filing dispute:', error);
    res.status(500).json({ success: false, error: 'Failed to file dispute' });
  }
});

/**
 * GET /api/v1/constitutional-court/disputes/:id
 * Get dispute by ID
 */
router.get('/disputes/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dispute = aiConstitutionalCourtService.getDispute(id);

    if (!dispute) {
      res.status(404).json({ success: false, error: 'Dispute not found' });
      return;
    }

    res.json({ success: true, data: dispute });
  } catch (error) {
    console.error('Error getting dispute:', error);
    res.status(500).json({ success: false, error: 'Failed to get dispute' });
  }
});

/**
 * GET /api/v1/constitutional-court/disputes/case/:caseNumber
 * Get dispute by case number
 */
router.get('/disputes/case/:caseNumber', async (req: Request, res: Response): Promise<void> => {
  try {
    const { caseNumber } = req.params;
    const dispute = aiConstitutionalCourtService.getDisputeByCaseNumber(caseNumber);

    if (!dispute) {
      res.status(404).json({ success: false, error: 'Dispute not found' });
      return;
    }

    res.json({ success: true, data: dispute });
  } catch (error) {
    console.error('Error getting dispute:', error);
    res.status(500).json({ success: false, error: 'Failed to get dispute' });
  }
});

/**
 * GET /api/v1/constitutional-court/disputes/organization/:orgId
 * Get disputes by organization
 */
router.get('/disputes/organization/:orgId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { orgId } = req.params;
    const disputes = aiConstitutionalCourtService.getDisputesByOrganization(orgId);
    res.json({ success: true, data: disputes });
  } catch (error) {
    console.error('Error getting disputes:', error);
    res.status(500).json({ success: false, error: 'Failed to get disputes' });
  }
});

/**
 * POST /api/v1/constitutional-court/disputes/:id/schedule-hearing
 * Schedule a hearing
 */
router.post('/disputes/:id/schedule-hearing', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { hearingDate } = req.body;

    if (!hearingDate) {
      res.status(400).json({ success: false, error: 'hearingDate is required' });
      return;
    }

    const dispute = await aiConstitutionalCourtService.scheduleHearing(id, new Date(hearingDate));
    res.json({ success: true, data: dispute });
  } catch (error) {
    console.error('Error scheduling hearing:', error);
    res.status(500).json({ success: false, error: 'Failed to schedule hearing' });
  }
});

/**
 * POST /api/v1/constitutional-court/disputes/:id/begin-deliberation
 * Begin deliberation
 */
router.post('/disputes/:id/begin-deliberation', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dispute = await aiConstitutionalCourtService.beginDeliberation(id);
    res.json({ success: true, data: dispute });
  } catch (error) {
    console.error('Error beginning deliberation:', error);
    res.status(500).json({ success: false, error: 'Failed to begin deliberation' });
  }
});

/**
 * POST /api/v1/constitutional-court/disputes/:id/draft-opinion
 * Draft an opinion
 */
router.post('/disputes/:id/draft-opinion', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { ruling, summary, rationale, holdings, principlesApplied, authoringJudge, precedentsCited, dissents } = req.body;

    if (!ruling || !summary || !rationale || !holdings || !authoringJudge) {
      res.status(400).json({
        success: false,
        error: 'ruling, summary, rationale, holdings, and authoringJudge are required',
      });
      return;
    }

    const opinion = await aiConstitutionalCourtService.draftOpinion({
      disputeId: id,
      ruling,
      summary,
      rationale,
      holdings,
      principlesApplied: principlesApplied || [],
      authoringJudge,
      precedentsCited,
      dissents,
    });

    res.json({ success: true, data: opinion });
  } catch (error) {
    console.error('Error drafting opinion:', error);
    res.status(500).json({ success: false, error: 'Failed to draft opinion' });
  }
});

/**
 * POST /api/v1/constitutional-court/disputes/:id/resolve
 * Resolve a dispute
 */
router.post('/disputes/:id/resolve', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dispute = await aiConstitutionalCourtService.resolveDispute(id);
    res.json({ success: true, data: dispute });
  } catch (error) {
    console.error('Error resolving dispute:', error);
    res.status(500).json({ success: false, error: 'Failed to resolve dispute' });
  }
});

/**
 * POST /api/v1/constitutional-court/disputes/:id/appeal
 * File an appeal
 */
router.post('/disputes/:id/appeal', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      res.status(400).json({ success: false, error: 'reason is required' });
      return;
    }

    const dispute = await aiConstitutionalCourtService.fileAppeal(id, reason);
    res.json({ success: true, data: dispute });
  } catch (error) {
    console.error('Error filing appeal:', error);
    res.status(500).json({ success: false, error: 'Failed to file appeal' });
  }
});

/**
 * POST /api/v1/constitutional-court/precedents/search
 * Search for precedents
 */
router.post('/precedents/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, keywords, limit } = req.body;

    const results = await aiConstitutionalCourtService.searchPrecedents({
      category,
      keywords,
      limit,
    });

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error searching precedents:', error);
    res.status(500).json({ success: false, error: 'Failed to search precedents' });
  }
});

export default router;
