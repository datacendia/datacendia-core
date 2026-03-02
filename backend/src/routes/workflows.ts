/**
 * API Routes — Workflows
 *
 * Express route handler defining REST endpoints.
 * @module routes/workflows
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import { pubsub } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load workflow scenarios from JSON file
// @ts-ignore TS1470: import.meta used with CommonJS output (runtime uses tsx/ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let workflowScenarios: any[] = [];
try {
  const scenariosPath1 = join(__dirname, '../data/workflow-scenarios.json');
  const scenariosPath2 = join(__dirname, '../data/workflow-scenarios-part2.json');

  const file1 = JSON.parse(readFileSync(scenariosPath1, 'utf-8'));
  const part1: any[] = Array.isArray(file1?.scenarios) ? file1.scenarios : [];

  // Part2 is a raw array of scenario objects
  const file2 = JSON.parse(readFileSync(scenariosPath2, 'utf-8'));
  const part2: any[] = Array.isArray(file2) ? file2 : [];

  const byId = new Map<string, any>();
  for (const s of [...part1, ...part2]) {
    if (s?.id) byId.set(String(s.id), s);
  }

  const parseIdNum = (id: string): number => {
    const match = /WF-(\d+)/i.exec(id);
    return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
  };

  workflowScenarios = Array.from(byId.values()).sort((a, b) =>
    parseIdNum(String(a?.id)) - parseIdNum(String(b?.id))
  );

  logger.info(
    `Loaded ${workflowScenarios.length} workflow scenarios (part1=${part1.length}, part2=${part2.length})`
  );
} catch (err) {
  logger.warn('Could not load workflow scenarios:', err);
}

const router = Router();

/**
 * GET /api/v1/workflows/scenarios
 * Get all workflow scenarios (walkthroughs) - no auth required for demo
 */
router.get('/scenarios', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;
  
  let filtered = workflowScenarios;
  
  if (category) {
    filtered = filtered.filter(s => s.category === category);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(searchLower) ||
      s.tags?.some((t: string) => t.toLowerCase().includes(searchLower))
    );
  }
  
  res.json({
    success: true,
    data: filtered,
    meta: {
      total: workflowScenarios.length,
      filtered: filtered.length,
    },
  });
});

router.use(devAuth);

const workflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  trigger: z.object({
    type: z.enum(['manual', 'schedule', 'event', 'webhook']),
    schedule: z.string().optional(),
    event: z.string().optional(),
  }),
  definition: z.object({
    nodes: z.array(z.object({
      id: z.string(),
      type: z.string(),
      config: z.record(z.unknown()),
      inputs: z.array(z.string()).optional(),
      outputs: z.unknown().optional(),
    })),
    edges: z.array(z.object({
      from: z.string(),
      to: z.string(),
      condition: z.string().optional(),
      on: z.string().optional(),
    })),
  }),
});

/**
 * GET /api/v1/workflows
 * List workflows
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;
    const status = req.query.status as string | undefined;
    const category = req.query.category as string | undefined;

    const workflows = await prisma.workflows.findMany({
      where: {
        organization_id: orgId,
        ...(status && { status: status as 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED' }),
        ...(category && { category }),
      },
      orderBy: { updated_at: 'desc' },
    });

    res.json({
      success: true,
      data: workflows,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/workflows/:id
 * Get single workflow
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workflow = await prisma.workflows.findUnique({
      where: { id: req.params.id },
    });

    if (!workflow) {
      throw errors.notFound('Workflow');
    }

    if (workflow.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    res.json({
      success: true,
      data: workflow,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/workflows
 * Create workflow
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = workflowSchema.parse(req.body);
    const orgId = req.organizationId!;

    const workflowId = crypto.randomUUID();

    const workflow = await prisma.workflows.create({
      data: {
        id: workflowId,
        name: data.name,
        description: data.description,
        category: data.category,
        trigger: data.trigger as Prisma.InputJsonValue,
        definition: data.definition as Prisma.InputJsonValue,
        organization_id: orgId,
        status: 'DRAFT',
        updated_at: new Date(),
      },
    });

    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: req.user!.id,
        action: 'workflow.create',
        resource_type: 'workflow',
        resource_id: workflow.id,
        details: { name: workflow.name } as Prisma.InputJsonValue,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || undefined,
      },
    });

    res.status(201).json({
      success: true,
      data: workflow,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/workflows/:id
 * Update workflow
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workflow = await prisma.workflows.findUnique({
      where: { id: req.params.id },
    });

    if (!workflow) {
      throw errors.notFound('Workflow');
    }

    if (workflow.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    const data = workflowSchema.partial().parse(req.body);

    const updated = await prisma.workflows.update({
      where: { id: req.params.id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        trigger: data.trigger as Prisma.InputJsonValue,
        definition: data.definition as Prisma.InputJsonValue,
        updated_at: new Date(),
      },
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/workflows/:id/activate
 * Activate workflow
 */
router.post('/:id/activate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workflow = await prisma.workflows.findUnique({
      where: { id: req.params.id },
    });

    if (!workflow) {
      throw errors.notFound('Workflow');
    }

    if (workflow.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    const updated = await prisma.workflows.update({
      where: { id: req.params.id },
      data: { status: 'ACTIVE', updated_at: new Date() },
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/workflows/:id/execute
 * Execute workflow
 */
router.post('/:id/execute', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workflow = await prisma.workflows.findUnique({
      where: { id: req.params.id },
    });

    if (!workflow) {
      throw errors.notFound('Workflow');
    }

    if (workflow.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    const { parameters = {}, async: isAsync = true } = req.body;

    // Create execution record
    const executionId = crypto.randomUUID();

    const execution = await prisma.workflow_executions.create({
      data: {
        id: executionId,
        workflow_id: workflow.id,
        status: 'PENDING',
        parameters: parameters as Prisma.InputJsonValue,
      },
    });

    if (isAsync) {
      // Start execution in background
      executeWorkflow(execution.id, workflow, parameters).catch(err => {
        logger.error('Workflow execution failed:', err);
      });

      res.status(202).json({
        success: true,
        data: {
          executionId: execution.id,
          status: 'pending',
          websocketChannel: `workflow:${execution.id}`,
        },
      });
    } else {
      // Synchronous execution (for simple workflows)
      await executeWorkflow(execution.id, workflow, parameters);

      const completed = await prisma.workflow_executions.findUnique({
        where: { id: execution.id },
      });

      res.json({
        success: true,
        data: completed,
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/workflows/executions
 * Get all workflow executions for the organization
 */
router.get('/executions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const orgId = req.organizationId!;

    const where: any = {
      workflows: { organization_id: orgId },
    };
    if (status) where.status = status;

    const [executions, total] = await Promise.all([
      prisma.workflow_executions.findMany({
        where,
        include: {
          workflows: { select: { name: true } },
        },
        orderBy: { created_at: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.workflow_executions.count({ where }),
    ]);

    res.json({
      success: true,
      data: executions,
      pagination: { page: Number(page), limit: Number(limit), total },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/workflows/:id/executions
 * Get executions for a specific workflow
 */
router.get('/:id/executions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const workflow = await prisma.workflows.findUnique({
      where: { id: req.params.id },
    });

    if (!workflow) {
      throw errors.notFound('Workflow');
    }

    if (workflow.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    const where: any = { workflow_id: req.params.id };
    if (status) where.status = status;

    const [executions, total] = await Promise.all([
      prisma.workflow_executions.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.workflow_executions.count({ where }),
    ]);

    res.json({
      success: true,
      data: executions,
      pagination: { page: Number(page), limit: Number(limit), total },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/workflows/executions/:executionId
 * Get execution status
 */
router.get('/executions/:executionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const execution = await prisma.workflow_executions.findUnique({
      where: { id: req.params.executionId },
    });

    if (!execution) {
      throw errors.notFound('Execution');
    }

    const workflow = await prisma.workflows.findUnique({
      where: { id: execution.workflow_id },
    });

    if (!workflow || workflow.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    const nodeStates = await prisma.execution_nodes.findMany({
      where: { execution_id: execution.id },
    });

    res.json({
      success: true,
      data: {
        ...execution,
        workflow,
        nodeStates,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Execute workflow (simplified implementation)
async function executeWorkflow(
  executionId: string,
  workflow: { id: string; definition: unknown },
  parameters: Record<string, unknown>
) {
  const definition = workflow.definition as {
    nodes: Array<{ id: string; type: string; config: Record<string, unknown> }>;
    edges: Array<{ from: string; to: string }>;
  };

  try {
    await prisma.workflow_executions.update({
      where: { id: executionId },
      data: { status: 'RUNNING', started_at: new Date() },
    });

    await pubsub.publish(`workflow:${executionId}`, {
      type: 'status_change',
      status: 'running',
    });

    const outputs: Record<string, unknown> = {};

    // Simple sequential execution
    for (let i = 0; i < definition.nodes.length; i++) {
      const node = definition.nodes[i];

      await prisma.workflow_executions.update({
        where: { id: executionId },
        data: {
          current_node: node.id,
          progress: Math.round((i / definition.nodes.length) * 100),
        },
      });

      await pubsub.publish(`workflow:${executionId}`, {
        type: 'node_started',
        nodeId: node.id,
        progress: Math.round((i / definition.nodes.length) * 100),
      });

      // Execute node (simplified)
      const nodeStart = Date.now();
      const result = await executeNode(node, parameters, outputs);
      const duration = Date.now() - nodeStart;

      outputs[node.id] = result;

      await prisma.execution_nodes.create({
        data: {
          id: crypto.randomUUID(),
          execution_id: executionId,
          node_id: node.id,
          status: 'COMPLETED',
          input: parameters as Prisma.InputJsonValue,
          output: result as Prisma.InputJsonValue,
          duration,
          started_at: new Date(nodeStart),
          completed_at: new Date(),
        },
      });

      await pubsub.publish(`workflow:${executionId}`, {
        type: 'node_completed',
        nodeId: node.id,
      });
    }

    await prisma.workflow_executions.update({
      where: { id: executionId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        outputs: outputs as Prisma.InputJsonValue,
        completed_at: new Date(),
      },
    });

    await pubsub.publish(`workflow:${executionId}`, {
      type: 'execution_complete',
      status: 'completed',
    });

  } catch (error) {
    logger.error('Workflow execution error:', error);

    await prisma.workflow_executions.update({
      where: { id: executionId },
      data: {
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    await pubsub.publish(`workflow:${executionId}`, {
      type: 'execution_failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

async function executeNode(
  node: { id: string; type: string; config: Record<string, unknown> },
  parameters: Record<string, unknown>,
  previousOutputs: Record<string, unknown>
): Promise<unknown> {
  // Simplified node execution
  switch (node.type) {
    case 'query':
      // Would execute database query
      return { rows: [], count: 0 };

    case 'transform':
      // Would transform data
      return { transformed: true };

    case 'condition':
      // Would evaluate condition
      return { result: true };

    case 'action':
      // Would perform action
      return { success: true };

    case 'approval':
      // Would wait for human approval
      return { approved: true };

    default:
      return { executed: true };
  }
}

export default router;
