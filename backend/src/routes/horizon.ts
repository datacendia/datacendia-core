/**
 * API Routes — Horizon
 *
 * Express route handler defining REST endpoints.
 * @module routes/horizon
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaHorizon™ API Routes
 * Predictive Decision Intelligence - "What If" Time Machine
 */

import { Router, Request, Response } from 'express';
import { cendiaHorizonService, TimeHorizon } from '../services/CendiaHorizonService.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Health endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'horizon', timestamp: new Date().toISOString() } });
});

/**
 * POST /api/v1/oracle/simulate
 * Create a new Oracle simulation
 */
router.post('/simulate', async (req: Request, res: Response) => {
  try {
    const { question, context, timeHorizon = '90d', branchCount = 3 } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_QUESTION', message: 'Question is required' },
      });
    }

    const simulation = await cendiaHorizonService.createSimulation({
      question,
      context,
      timeHorizon: timeHorizon as TimeHorizon,
      branchCount: Math.min(Math.max(branchCount, 2), 5),
    });

    logger.info(`[Horizon API] Created simulation ${simulation.id}`);

    res.json({
      success: true,
      data: simulation,
    });
  } catch (error) {
    logger.error('[Horizon API] Failed to create simulation:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SIMULATION_FAILED', message: 'Failed to create simulation' },
    });
  }
});

/**
 * GET /api/v1/oracle/simulation/:id
 * Get simulation by ID
 */
router.get('/simulation/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const simulation = cendiaHorizonService.getSimulation(id);

    if (!simulation) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Simulation not found' },
      });
    }

    res.json({
      success: true,
      data: simulation,
    });
  } catch (error) {
    logger.error('[Horizon API] Failed to get simulation:', error);
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: 'Failed to fetch simulation' },
    });
  }
});

/**
 * GET /api/v1/oracle/simulations
 * Get all simulations
 */
router.get('/simulations', async (_req: Request, res: Response) => {
  try {
    const simulations = cendiaHorizonService.getAllSimulations();

    res.json({
      success: true,
      data: simulations,
      count: simulations.length,
    });
  } catch (error) {
    logger.error('[Horizon API] Failed to list simulations:', error);
    res.status(500).json({
      success: false,
      error: { code: 'LIST_FAILED', message: 'Failed to list simulations' },
    });
  }
});

/**
 * GET /api/v1/oracle/status
 * Get Oracle service status
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = cendiaHorizonService.getStatus();

    res.json({
      success: true,
      data: {
        ...status,
        service: 'CendiaHorizon',
        version: '1.0.0',
        features: [
          'Multi-universe simulation',
          'Historical echo matching',
          'Confidence decay modeling',
          'Butterfly effect cascades',
          'Pivotal moment detection',
          'Reversibility scoring',
        ],
      },
    });
  } catch (error) {
    logger.error('[Horizon API] Failed to get status:', error);
    res.status(500).json({
      success: false,
      error: { code: 'STATUS_FAILED', message: 'Failed to get status' },
    });
  }
});

/**
 * POST /api/v1/oracle/demo
 * Run a demo simulation with a pre-built scenario
 */
router.post('/demo', async (req: Request, res: Response) => {
  try {
    const { scenario = 'acquisition' } = req.body;

    const demoScenarios: Record<string, { question: string; context: string }> = {
      acquisition: {
        question: 'Should we acquire CompetitorCo for $50M to accelerate market expansion?',
        context: 'CompetitorCo has 15% market share, 200 employees, and proprietary technology. Our current market share is 25%.',
      },
      expansion: {
        question: 'Should we expand into the European market in Q2?',
        context: 'Current US revenue is $10M ARR. EU market opportunity estimated at $15M. Requires $2M investment and local team.',
      },
      pivot: {
        question: 'Should we pivot from B2B to B2C given changing market dynamics?',
        context: 'B2B revenue declining 5% YoY. Consumer demand signals strong. Would require product rebuild and new GTM.',
      },
      layoffs: {
        question: 'Should we reduce headcount by 20% to extend runway?',
        context: 'Current burn rate $500K/month. 18 months runway. Revenue growth stalled at 5% YoY.',
      },
      partnership: {
        question: 'Should we accept the strategic partnership offer from BigCorp?',
        context: 'BigCorp offers $5M investment for 15% equity and exclusive distribution rights in APAC.',
      },
    };

    const selected = demoScenarios[scenario] || demoScenarios.acquisition;

    const simulation = await cendiaHorizonService.createSimulation({
      question: selected.question,
      context: selected.context,
      timeHorizon: '180d',
      branchCount: 4,
    });

    // Wait a bit for simulation to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = cendiaHorizonService.getSimulation(simulation.id);

    res.json({
      success: true,
      data: result,
      scenario,
    });
  } catch (error) {
    logger.error('[Horizon API] Failed to run demo:', error);
    res.status(500).json({
      success: false,
      error: { code: 'DEMO_FAILED', message: 'Failed to run demo simulation' },
    });
  }
});

export default router;
