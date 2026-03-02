// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';
// import { cache } from '../config/redis.js';
// import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();

router.use(devAuth);

const metricQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(50),
});

const createMetricSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1).max(50),
  description: z.string().optional(),
  formula: z.object({
    type: z.enum(['expression', 'query', 'aggregate']),
    expression: z.string().optional(),
    query: z.string().optional(),
  }),
  unit: z.string().optional(),
  category: z.string().optional(),
  thresholds: z.object({
    warning: z.number().optional(),
    critical: z.number().optional(),
  }).optional(),
  refreshSchedule: z.string().optional(),
});

const calculateQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  granularity: z.enum(['hour', 'day', 'week', 'month']).default('day'),
  dimensions: z.string().optional(),
});

/**
 * GET /api/v1/metrics
 * List metric definitions
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, page, pageSize } = metricQuerySchema.parse(req.query);
    const orgId = req.organizationId!;

    const where = {
      organization_id: orgId,
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { code: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [metrics, total] = await Promise.all([
      prisma.metric_definitions.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { users: { select: { id: true, name: true } } },
      }),
      prisma.metric_definitions.count({ where }),
    ]);

    res.json({
      success: true,
      data: metrics,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/metrics/key
 * Get key metrics for dashboard
 */
router.get('/key', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = (req.organizationId as string) || (req.query['organizationId'] as string);
    
    // Skip cache for now to ensure fresh data
    // Get ALL metrics for this org (no category filter)
    const metrics = await prisma.metric_definitions.findMany({
      where: {
        organization_id: orgId,
      },
      take: 6,
    });
    
    // If no org-specific metrics, get any metrics
    const finalMetrics = metrics.length > 0 ? metrics : await prisma.metric_definitions.findMany({ take: 6 });
    
    const keyMetrics = await Promise.all(
      finalMetrics.map(async (metric) => {
        // Get latest and previous values
        const [latest, previous] = await Promise.all([
          prisma.metric_values.findFirst({
            where: { metric_id: metric.id },
            orderBy: { timestamp: 'desc' },
          }),
          prisma.metric_values.findFirst({
            where: { metric_id: metric.id },
            orderBy: { timestamp: 'desc' },
            skip: 1,
          }),
        ]);

        const value = latest?.value || 0;
        const prevValue = previous?.value || value;
        const change = prevValue !== 0 ? ((value - prevValue) / prevValue) * 100 : 0;

        return {
          id: metric.id,
          name: metric.name,
          code: metric.code,
          value,
          unit: metric.unit,
          change: Math.round(change * 10) / 10,
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
          updatedAt: latest?.timestamp,
        };
      })
    );

    res.json({
      success: true,
      data: keyMetrics,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/metrics/:id
 * Get single metric definition
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metric = await prisma.metric_definitions.findUnique({
      where: { id: req.params['id'] as string },
      include: {
        users: { select: { id: true, name: true } },
      },
    });

    if (!metric) {
      throw errors.notFound('Metric');
    }

    if (metric.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    res.json({
      success: true,
      data: metric,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/metrics
 * Create new metric definition
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createMetricSchema.parse(req.body);
    const orgId = req.organizationId!;
    const userId = req.user!.id;

    // Check for duplicate code
    const existing = await prisma.metric_definitions.findUnique({
      where: { organization_id_code: { organization_id: orgId, code: data.code } },
    });

    if (existing) {
      throw errors.conflict(`Metric with code '${data.code}' already exists`);
    }

    const metric = await prisma.metric_definitions.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        name: data.name,
        code: data.code,
        description: data.description ?? null,
        formula: data.formula as Prisma.InputJsonValue,
        unit: data.unit,
        category: data.category,
        thresholds: (data.thresholds ?? {}) as Prisma.InputJsonValue,
        refresh_schedule: data.refreshSchedule,
        owner_id: userId,
        updated_at: new Date(),
      },
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: userId,
        action: 'metric.create',
        resource_type: 'metric',
        resource_id: metric.id,
        details: { name: metric.name, code: metric.code } as Prisma.InputJsonValue,
      },
    });

    res.status(201).json({
      success: true,
      data: metric,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/metrics/:id/calculate
 * Calculate metric values
 */
router.get('/:id/calculate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = calculateQuerySchema.parse(req.query);

    const metric = await prisma.metric_definitions.findUnique({
      where: { id: req.params['id'] as string },
    });

    if (!metric) {
      throw errors.notFound('Metric');
    }

    if (metric.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    // Parse dates
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get metric values
    const values = await prisma.metric_values.findMany({
      where: {
        metric_id: metric.id,
        timestamp: { gte: start, lte: end },
      },
      orderBy: { timestamp: 'asc' },
    });

    // Calculate summary
    const currentValue = values.length > 0 ? values[values.length - 1]!.value : 0;
    const previousValue = values.length > 1 ? values[0]!.value : currentValue;
    const change = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

    res.json({
      success: true,
      data: {
        metric_id: metric.id,
        metricName: metric.name,
        timeRange: { start, end },
        values: values.map(v => ({
          timestamp: v.timestamp,
          value: v.value,
          dimensions: v.dimensions,
        })),
        summary: {
          current: currentValue,
          previous: previousValue,
          change: Math.round(change * 10) / 10,
          trend: change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable',
        },
        calculatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/metrics/:id/history
 * Get metric value history
 */
router.get('/:id/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = calculateQuerySchema.parse(req.query);

    const metric = await prisma.metric_definitions.findUnique({
      where: { id: req.params['id'] as string },
    });

    if (!metric) {
      throw errors.notFound('Metric');
    }

    if (metric.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const values = await prisma.metric_values.findMany({
      where: {
        metric_id: metric.id,
        timestamp: { gte: start, lte: end },
      },
      orderBy: { timestamp: 'asc' },
    });

    res.json({
      success: true,
      data: {
        metric_id: metric.id,
        metricName: metric.name,
        unit: metric.unit,
        values: values.map(v => ({
          timestamp: v.timestamp,
          value: v.value,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
