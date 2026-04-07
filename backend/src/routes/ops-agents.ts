// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// OPS AGENT API ROUTES — Everyday task-execution agents
//
//   GET  /api/v1/ops-agents                — List all ops agents
//   GET  /api/v1/ops-agents/status         — AI availability check
//   POST /api/v1/ops-agents/tasks          — Submit a task to an agent
//   GET  /api/v1/ops-agents/tasks          — List tasks (with filters)
//   GET  /api/v1/ops-agents/tasks/:id      — Get task status + result
//   POST /api/v1/ops-agents/tasks/:id/cancel — Cancel a running task
// =============================================================================

import { Router, Request, Response } from 'express';
import { opsAgentService } from '../services/ops/OpsAgentService.js';
import { logger } from '../utils/logger.js';

const router = Router();

// List all ops agents
router.get('/', async (_req: Request, res: Response) => {
  try {
    const agents = opsAgentService.getAgents();
    res.json({ success: true, data: agents });
  } catch (error) {
    logger.error('[OpsAgents] List agents error:', error);
    res.status(500).json({ success: false, error: 'Failed to list agents' });
  }
});

// Check AI provider availability
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = await opsAgentService.checkAvailability();
    res.json({ success: true, data: status });
  } catch (error) {
    logger.error('[OpsAgents] Status error:', error);
    res.status(500).json({ success: false, error: 'Status check failed' });
  }
});

// Submit a task
router.post('/tasks', async (req: Request, res: Response) => {
  try {
    const { agentType, title, prompt, context, organizationId, userId, options } = req.body;
    if (!agentType || !prompt) {
      return res.status(400).json({ success: false, error: 'agentType and prompt are required' });
    }
    if (typeof prompt !== 'string') {
      return res.status(400).json({ success: false, error: 'prompt must be a string' });
    }
    const task = await opsAgentService.runTask({
      agentType,
      title: title || `${agentType} task`,
      prompt,
      context,
      organizationId,
      userId,
      options,
    });
    res.json({ success: true, data: task });
  } catch (error) {
    const msg = (error as Error).message;
    if (msg.includes('Invalid agent type') || msg.includes('required') || msg.includes('exceeds maximum')) {
      return res.status(400).json({ success: false, error: msg });
    }
    if (msg.includes('Concurrency limit')) {
      return res.status(429).json({ success: false, error: msg });
    }
    logger.error('[OpsAgents] Submit task error:', error);
    res.status(500).json({ success: false, error: 'Task submission failed' });
  }
});

// List tasks
const VALID_AGENT_TYPES = ['report', 'analytics', 'nlp', 'pipeline'] as const;
const VALID_TASK_STATUSES = ['queued', 'running', 'completed', 'failed', 'cancelled'] as const;

router.get('/tasks', async (req: Request, res: Response) => {
  try {
    const agentType = req.query.agentType as string | undefined;
    const status = req.query.status as string | undefined;
    const limit = req.query.limit ? Math.min(parseInt(req.query.limit as string, 10) || 50, 200) : undefined;

    if (agentType && !VALID_AGENT_TYPES.includes(agentType as any)) {
      return res.status(400).json({ success: false, error: `Invalid agentType. Valid: ${VALID_AGENT_TYPES.join(', ')}` });
    }
    if (status && !VALID_TASK_STATUSES.includes(status as any)) {
      return res.status(400).json({ success: false, error: `Invalid status. Valid: ${VALID_TASK_STATUSES.join(', ')}` });
    }

    const tasks = await opsAgentService.listTasks({
      agentType: agentType as any,
      organizationId: req.query.organizationId as string,
      userId: req.query.userId as string,
      status: status as any,
      limit,
    });
    res.json({ success: true, data: tasks });
  } catch (error) {
    logger.error('[OpsAgents] List tasks error:', error);
    res.status(500).json({ success: false, error: 'Failed to list tasks' });
  }
});

// Get single task
router.get('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const task = await opsAgentService.getTask(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    logger.error('[OpsAgents] Get task error:', error);
    res.status(500).json({ success: false, error: 'Failed to get task' });
  }
});

// Cancel task
router.post('/tasks/:id/cancel', async (req: Request, res: Response) => {
  try {
    const cancelled = await opsAgentService.cancelTask(req.params.id);
    if (!cancelled) return res.status(400).json({ success: false, error: 'Task cannot be cancelled' });
    res.json({ success: true, message: 'Task cancelled' });
  } catch (error) {
    logger.error('[OpsAgents] Cancel task error:', error);
    res.status(500).json({ success: false, error: 'Failed to cancel task' });
  }
});

export default router;
