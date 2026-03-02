/**
 * API Routes — Adversarial Redteam
 *
 * Express route handler defining REST endpoints.
 * @module routes/adversarial-redteam
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DATACENDIA ADVERSARIAL RED TEAM ROUTES
 * 
 * API endpoints for the "100 Ways This Could Fail" feature
 */

import { Router, Request, Response } from 'express';
import { adversarialRedTeamService } from '../services/council/AdversarialRedTeamService.js';

const router = Router();

/**
 * POST /api/v1/adversarial-redteam/start
 * Start a new red team session
 */
router.post('/start', (req: Request, res: Response) => {
  const { decision, context, config } = req.body;
  
  if (!decision) {
    return res.status(400).json({ error: 'decision is required' });
  }
  
  const session = adversarialRedTeamService.startSession(decision, context, config);
  
  res.json({ success: true, session });
});

/**
 * GET /api/v1/adversarial-redteam/:sessionId
 * Get session by ID
 */
router.get('/:sessionId', (req: Request, res: Response) => {
  const session = adversarialRedTeamService.getSession(req.params.sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json(session);
});

/**
 * POST /api/v1/adversarial-redteam/:sessionId/attack
 * Generate attacks for a session
 */
router.post('/:sessionId/attack', async (req: Request, res: Response) => {
  try {
    const attacks = await adversarialRedTeamService.generateAttacks(req.params.sessionId);
    
    res.json({ success: true, attackCount: attacks.length, attacks });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * GET /api/v1/adversarial-redteam/:sessionId/report
 * Export as "100 Ways This Could Fail" report
 */
router.get('/:sessionId/report', (req: Request, res: Response) => {
  try {
    const report = adversarialRedTeamService.exportAsFailureReport(req.params.sessionId);
    
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * DELETE /api/v1/adversarial-redteam/:sessionId
 * End a session
 */
router.delete('/:sessionId', (req: Request, res: Response) => {
  adversarialRedTeamService.endSession(req.params.sessionId);
  
  res.json({ success: true });
});

export default router;
