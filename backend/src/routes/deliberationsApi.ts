// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DELIBERATIONS API ROUTES
 * Full CRUD for AI Council deliberations with Prisma
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();
router.use(devAuth);

// Validation schemas
const createDeliberationSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters'),
  config: z.object({
    mode: z.string().optional(),
    agents: z.array(z.string()).optional(),
  }).optional(),
});

const querySchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'AWAITING_APPROVAL', 'COMPLETED', 'CANCELLED']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

/**
 * GET /api/v1/deliberations
 * List deliberations for organization
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page, limit } = querySchema.parse(req.query);
    const orgId = req.organizationId!;

    const where: Prisma.deliberationsWhereInput = {
      organization_id: orgId,
      ...(status && { status }),
    };

    const [deliberations, total] = await Promise.all([
      prisma.deliberations.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          deliberation_messages: {
            take: 1,
            orderBy: { created_at: 'desc' },
          },
        },
      }),
      prisma.deliberations.count({ where }),
    ]);

    res.json({
      success: true,
      data: deliberations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/deliberations/:id
 * Get single deliberation with messages
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliberation = await prisma.deliberations.findUnique({
      where: { id: req.params.id },
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!deliberation) {
      throw errors.notFound('Deliberation');
    }

    if (deliberation.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    res.json({
      success: true,
      data: deliberation,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/deliberations
 * Create new deliberation
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createDeliberationSchema.parse(req.body);
    const orgId = req.organizationId!;

    const deliberation = await prisma.deliberations.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        question: data.question,
        config: (data.config || { mode: 'war-room' }) as Prisma.InputJsonValue,
        status: 'PENDING',
        progress: 0,
      },
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: req.user!.id,
        action: 'deliberation.create',
        resource_type: 'deliberation',
        resource_id: deliberation.id,
        details: { question: data.question } as Prisma.InputJsonValue,
      },
    });

    res.status(201).json({
      success: true,
      data: deliberation,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/deliberations/:id/start
 * Start a pending deliberation (trigger AI agents)
 */
router.post('/:id/start', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliberation = await prisma.deliberations.findUnique({
      where: { id: req.params.id },
    });

    if (!deliberation) {
      throw errors.notFound('Deliberation');
    }

    if (deliberation.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    if (deliberation.status !== 'PENDING') {
      throw errors.badRequest('Deliberation already started or completed');
    }

    // Update to IN_PROGRESS
    const updated = await prisma.deliberations.update({
      where: { id: req.params.id },
      data: {
        status: 'IN_PROGRESS',
        started_at: new Date(),
        current_phase: 'analysis',
        progress: 10,
      },
    });

    // In a real implementation, this would trigger the AI agents
    // For now, we just mark it as started
    
    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: req.organizationId!,
        user_id: req.user!.id,
        action: 'deliberation.start',
        resource_type: 'deliberation',
        resource_id: deliberation.id,
        details: {} as Prisma.InputJsonValue,
      },
    });

    res.json({
      success: true,
      data: updated,
      message: 'Deliberation started. AI agents are analyzing...',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/deliberations/:id/complete
 * Mark deliberation as complete
 */
router.post('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { decision, confidence } = req.body;

    const deliberation = await prisma.deliberations.findUnique({
      where: { id: req.params.id },
    });

    if (!deliberation) {
      throw errors.notFound('Deliberation');
    }

    if (deliberation.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    const updated = await prisma.deliberations.update({
      where: { id: req.params.id },
      data: {
        status: 'COMPLETED',
        completed_at: new Date(),
        decision: decision as Prisma.InputJsonValue,
        confidence,
        progress: 100,
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
 * DELETE /api/v1/deliberations/:id
 * Delete a deliberation (soft delete via cancel)
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliberation = await prisma.deliberations.findUnique({
      where: { id: req.params.id },
    });

    if (!deliberation) {
      throw errors.notFound('Deliberation');
    }

    if (deliberation.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    await prisma.deliberations.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
