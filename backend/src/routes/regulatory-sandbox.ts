// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaRegulatorySandbox™ API Routes
 * 
 * Test Against Proposed Regulations
 */

import { Router, Request, Response } from 'express';
import { regulatorySandboxService } from '../services/compliance/RegulatorySandboxService.js';

const router = Router();

/**
 * GET /api/v1/regulatory-sandbox/health
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'CendiaRegulatorySandbox',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/regulatory-sandbox/regulations
 */
router.get('/regulations', (req: Request, res: Response) => {
  try {
    const { jurisdiction, status } = req.query;
    const regulations = regulatorySandboxService.getProposedRegulations({
      jurisdiction: jurisdiction as any,
      status: status as any,
    });
    res.json({ success: true, data: regulations });
  } catch (error) {
    console.error('Error getting regulations:', error);
    res.status(500).json({ success: false, error: 'Failed to get regulations' });
  }
});

/**
 * GET /api/v1/regulatory-sandbox/regulations/:id
 */
router.get('/regulations/:id', (req: Request, res: Response): void => {
  try {
    const regulation = regulatorySandboxService.getRegulation(req.params.id);
    if (!regulation) {
      res.status(404).json({ success: false, error: 'Regulation not found' });
      return;
    }
    res.json({ success: true, data: regulation });
  } catch (error) {
    console.error('Error getting regulation:', error);
    res.status(500).json({ success: false, error: 'Failed to get regulation' });
  }
});

/**
 * GET /api/v1/regulatory-sandbox/timeline
 */
router.get('/timeline', (_req: Request, res: Response) => {
  try {
    const timeline = regulatorySandboxService.getRegulatoryTimeline();
    res.json({ success: true, data: timeline });
  } catch (error) {
    console.error('Error getting timeline:', error);
    res.status(500).json({ success: false, error: 'Failed to get timeline' });
  }
});

/**
 * POST /api/v1/regulatory-sandbox/tests
 */
router.post('/tests', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, regulationId, requirements, decisionId, workflowId, systemDescription } = req.body;

    if (!name || !regulationId || !systemDescription) {
      res.status(400).json({
        success: false,
        error: 'name, regulationId, and systemDescription are required',
      });
      return;
    }

    const test = await regulatorySandboxService.createTest({
      name,
      description: description || '',
      regulationId,
      requirements,
      decisionId,
      workflowId,
      systemDescription,
    });

    res.status(201).json({ success: true, data: test });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ success: false, error: 'Failed to create test' });
  }
});

/**
 * POST /api/v1/regulatory-sandbox/tests/:id/run
 */
router.post('/tests/:id/run', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await regulatorySandboxService.runTest(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error running test:', error);
    res.status(500).json({ success: false, error: 'Failed to run test' });
  }
});

/**
 * GET /api/v1/regulatory-sandbox/tests/:id
 */
router.get('/tests/:id', (req: Request, res: Response): void => {
  try {
    const test = regulatorySandboxService.getTest(req.params.id);
    if (!test) {
      res.status(404).json({ success: false, error: 'Test not found' });
      return;
    }
    res.json({ success: true, data: test });
  } catch (error) {
    console.error('Error getting test:', error);
    res.status(500).json({ success: false, error: 'Failed to get test' });
  }
});

/**
 * GET /api/v1/regulatory-sandbox/tests
 */
router.get('/tests', (_req: Request, res: Response) => {
  try {
    const tests = regulatorySandboxService.getAllTests();
    res.json({ success: true, data: tests });
  } catch (error) {
    console.error('Error getting tests:', error);
    res.status(500).json({ success: false, error: 'Failed to get tests' });
  }
});

export default router;
