// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCarbonAware™ API Routes
 * 
 * Carbon-Aware AI Workload Scheduling
 */

import { Router, Request, Response } from 'express';
import { carbonAwareSchedulerService, WorkloadPriority, WorkloadStatus } from '../services/scheduling/CarbonAwareSchedulerService.js';

const router = Router();

/**
 * GET /api/v1/carbon-aware/health
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'CendiaCarbonAware',
    status: 'healthy',
    sustainabilityEnabled: true,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/carbon-aware/intensity/:region
 */
router.get('/intensity/:region', async (req: Request, res: Response): Promise<void> => {
  try {
    const intensity = await carbonAwareSchedulerService.getCarbonIntensity(req.params['region']!);
    res.json({ success: true, data: intensity });
  } catch (error) {
    console.error('Error getting carbon intensity:', error);
    res.status(500).json({ success: false, error: 'Failed to get carbon intensity' });
  }
});

/**
 * GET /api/v1/carbon-aware/intensity
 */
router.get('/intensity', async (_req: Request, res: Response): Promise<void> => {
  try {
    const intensities = await carbonAwareSchedulerService.getAllRegionIntensities();
    res.json({ success: true, data: intensities });
  } catch (error) {
    console.error('Error getting intensities:', error);
    res.status(500).json({ success: false, error: 'Failed to get intensities' });
  }
});

/**
 * POST /api/v1/carbon-aware/workloads
 */
router.post('/workloads', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, type, priority, estimatedDurationMinutes, estimatedEnergyWh, preferredRegions, maxDeferralHours } = req.body;

    if (!name || !type || !estimatedDurationMinutes || !estimatedEnergyWh) {
      res.status(400).json({
        success: false,
        error: 'name, type, estimatedDurationMinutes, and estimatedEnergyWh are required',
      });
      return;
    }

    const workload = await carbonAwareSchedulerService.submitWorkload({
      name,
      type,
      priority: priority as WorkloadPriority || 'normal',
      estimatedDurationMinutes,
      estimatedEnergyWh,
      preferredRegions,
      maxDeferralHours,
    });

    res.status(201).json({ success: true, data: workload });
  } catch (error) {
    console.error('Error submitting workload:', error);
    res.status(500).json({ success: false, error: 'Failed to submit workload' });
  }
});

/**
 * GET /api/v1/carbon-aware/workloads
 */
router.get('/workloads', (_req: Request, res: Response) => {
  try {
    const status = _req.query.status as WorkloadStatus | undefined;
    const workloads = carbonAwareSchedulerService.listWorkloads(status);
    res.json({ success: true, data: workloads });
  } catch (error) {
    console.error('Error listing workloads:', error);
    res.status(500).json({ success: false, error: 'Failed to list workloads' });
  }
});

/**
 * GET /api/v1/carbon-aware/workloads/:id
 */
router.get('/workloads/:id', (req: Request, res: Response): void => {
  try {
    const workload = carbonAwareSchedulerService.getWorkload(req.params['id']!);
    if (!workload) {
      res.status(404).json({ success: false, error: 'Workload not found' });
      return;
    }
    res.json({ success: true, data: workload });
  } catch (error) {
    console.error('Error getting workload:', error);
    res.status(500).json({ success: false, error: 'Failed to get workload' });
  }
});

/**
 * POST /api/v1/carbon-aware/workloads/:id/schedule
 */
router.post('/workloads/:id/schedule', async (req: Request, res: Response): Promise<void> => {
  try {
    const decision = await carbonAwareSchedulerService.scheduleWorkload(req.params['id']!);
    res.json({ success: true, data: decision });
  } catch (error) {
    console.error('Error scheduling workload:', error);
    res.status(500).json({ success: false, error: 'Failed to schedule workload' });
  }
});

/**
 * POST /api/v1/carbon-aware/workloads/:id/execute
 */
router.post('/workloads/:id/execute', async (req: Request, res: Response): Promise<void> => {
  try {
    const workload = await carbonAwareSchedulerService.executeWorkload(req.params['id']!);
    res.json({ success: true, data: workload });
  } catch (error) {
    console.error('Error executing workload:', error);
    res.status(500).json({ success: false, error: 'Failed to execute workload' });
  }
});

/**
 * GET /api/v1/carbon-aware/budget/:orgId
 */
router.get('/budget/:orgId', async (req: Request, res: Response): Promise<void> => {
  try {
    const budget = await carbonAwareSchedulerService.getCarbonBudget(req.params['orgId']!);
    res.json({ success: true, data: budget });
  } catch (error) {
    console.error('Error getting budget:', error);
    res.status(500).json({ success: false, error: 'Failed to get budget' });
  }
});

/**
 * GET /api/v1/carbon-aware/report/:orgId
 */
router.get('/report/:orgId', async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await carbonAwareSchedulerService.generateReport(req.params['orgId']!);
    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
});

export default router;
