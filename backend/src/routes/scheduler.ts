// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Enterprise Scheduler API Routes
 * Manages scheduled jobs for Apotheosis, security testing, and other automated tasks
 */

import { Router, Request, Response } from 'express';
import { enterpriseSchedulerService } from '../services/scheduler/EnterpriseSchedulerService.js';
import { devAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = Router();
router.use(devAuth);

// ===========================================================================
// STATUS
// ===========================================================================

/**
 * GET /scheduler/status
 * Get scheduler service status
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = enterpriseSchedulerService.getStatus();
    
    res.json({
      success: true,
      data: {
        service: 'EnterpriseScheduler',
        version: '1.0.0',
        description: 'Real cron-based job scheduling for enterprise features',
        ...status,
        capabilities: [
          'Apotheosis nightly red-teaming',
          'Scheduled security assessments',
          'SBOM scanning',
          'Compliance checks',
          'Dissent deadline enforcement',
          'Runtime health monitoring',
          'Analytics aggregation',
          'Custom job scheduling',
        ],
        cronExpressionFormat: 'minute hour dayOfMonth month dayOfWeek',
        examples: {
          everyMinute: '* * * * *',
          hourly: '0 * * * *',
          daily2AM: '0 2 * * *',
          weekdaysMorning: '0 9 * * 1-5',
          monthly: '0 0 1 * *',
        },
      },
    });
  } catch (error) {
    logger.error('[Scheduler Routes] Status error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// JOBS
// ===========================================================================

/**
 * GET /scheduler/jobs
 * List all scheduled jobs
 */
router.get('/jobs', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const jobs = enterpriseSchedulerService.getJobs(orgId);
    
    res.json({
      success: true,
      data: jobs,
      count: jobs.length,
    });
  } catch (error) {
    logger.error('[Scheduler Routes] List jobs error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /scheduler/jobs/:id
 * Get a specific job
 */
router.get('/jobs/:id', async (req: Request, res: Response) => {
  try {
    const job = enterpriseSchedulerService.getJob(req.params['id']!);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: { message: 'Job not found' },
      });
    }
    
    res.json({ success: true, data: job });
  } catch (error) {
    logger.error('[Scheduler Routes] Get job error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * POST /scheduler/jobs
 * Create a new scheduled job
 */
router.post('/jobs', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const userId = (req as any).user?.id || 'system';
    
    const { jobType, name, description, cronExpression, timezone, config, enabled } = req.body;
    
    if (!jobType || !name || !cronExpression) {
      return res.status(400).json({
        success: false,
        error: { message: 'jobType, name, and cronExpression are required' },
      });
    }
    
    const job = await enterpriseSchedulerService.createJob({
      organizationId: orgId,
      jobType,
      name,
      description,
      cronExpression,
      timezone,
      config,
      createdBy: userId,
      enabled: enabled ?? true,
    });
    
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    logger.error('[Scheduler Routes] Create job error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * PATCH /scheduler/jobs/:id
 * Update a scheduled job
 */
router.patch('/jobs/:id', async (req: Request, res: Response) => {
  try {
    const { name, description, cronExpression, config, enabled } = req.body;
    
    const job = await enterpriseSchedulerService.updateJob(req.params['id']!, {
      name,
      description,
      cronExpression,
      config,
      enabled,
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: { message: 'Job not found' },
      });
    }
    
    res.json({ success: true, data: job });
  } catch (error) {
    logger.error('[Scheduler Routes] Update job error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * DELETE /scheduler/jobs/:id
 * Delete a scheduled job
 */
router.delete('/jobs/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await enterpriseSchedulerService.deleteJob(req.params['id']!);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { message: 'Job not found' },
      });
    }
    
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    logger.error('[Scheduler Routes] Delete job error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// EXECUTION
// ===========================================================================

/**
 * POST /scheduler/jobs/:id/run
 * Manually trigger a job to run now
 */
router.post('/jobs/:id/run', async (req: Request, res: Response) => {
  try {
    const execution = await enterpriseSchedulerService.runJobNow(req.params['id']!, 'manual');
    
    res.json({
      success: true,
      data: execution,
      message: 'Job triggered successfully',
    });
  } catch (error) {
    logger.error('[Scheduler Routes] Run job error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /scheduler/jobs/:id/executions
 * Get execution history for a job
 */
router.get('/jobs/:id/executions', async (req: Request, res: Response) => {
  try {
    const limit = req.query['limit'] ? parseInt(req.query['limit'] as string) : 50;
    const executions = enterpriseSchedulerService.getExecutions(req.params['id']!, limit);
    
    res.json({
      success: true,
      data: executions,
      count: executions.length,
    });
  } catch (error) {
    logger.error('[Scheduler Routes] Get executions error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /scheduler/executions
 * Get all recent executions
 */
router.get('/executions', async (req: Request, res: Response) => {
  try {
    const limit = req.query['limit'] ? parseInt(req.query['limit'] as string) : 100;
    const executions = enterpriseSchedulerService.getExecutions(undefined, limit);
    
    res.json({
      success: true,
      data: executions,
      count: executions.length,
    });
  } catch (error) {
    logger.error('[Scheduler Routes] Get all executions error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// LIFECYCLE
// ===========================================================================

/**
 * POST /scheduler/start
 * Start the scheduler (admin only)
 */
router.post('/start', async (_req: Request, res: Response) => {
  try {
    await enterpriseSchedulerService.start();
    
    res.json({
      success: true,
      message: 'Scheduler started',
      data: enterpriseSchedulerService.getStatus(),
    });
  } catch (error) {
    logger.error('[Scheduler Routes] Start error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * POST /scheduler/stop
 * Stop the scheduler (admin only)
 */
router.post('/stop', async (_req: Request, res: Response) => {
  try {
    await enterpriseSchedulerService.stop();
    
    res.json({
      success: true,
      message: 'Scheduler stopped',
      data: enterpriseSchedulerService.getStatus(),
    });
  } catch (error) {
    logger.error('[Scheduler Routes] Stop error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

export default router;
