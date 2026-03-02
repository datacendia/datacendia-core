// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import { pubsub } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';
import { druidEventStream } from '../services/DruidEventStream.js';

const router = Router();

router.use(devAuth);

const alertQuerySchema = z.object({
  severity: z.enum(['CRITICAL', 'WARNING', 'INFO']).optional(),
  status: z.enum(['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED']).optional(),
  source: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(50),
});

const acknowledgeSchema = z.object({
  note: z.string().optional(),
});

const resolveSchema = z.object({
  resolution: z.string().min(1, 'Resolution description required'),
  rootCause: z.string().optional(),
});

/**
 * GET /api/v1/alerts
 * List alerts with filtering
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { severity, status, source, page, pageSize } = alertQuerySchema.parse(req.query);
    const orgId = req.organizationId!;

    const where = {
      organization_id: orgId,
      ...(severity && { severity }),
      ...(status && { status }),
      ...(source && { source: { contains: source } }),
    };

    const [alerts, total] = await Promise.all([
      prisma.alerts.findMany({
        where,
        orderBy: [
          { severity: 'asc' }, // CRITICAL first
          { created_at: 'desc' },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { metric_definitions: true },
      }),
      prisma.alerts.count({ where }),
    ]);

    res.json({
      success: true,
      data: alerts,
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
 * GET /api/v1/alerts/summary
 * Get alerts summary (counts by severity)
 */
router.get('/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;

    const counts = await prisma.alerts.groupBy({
      by: ['severity', 'status'],
      where: { organization_id: orgId },
      _count: true,
    });

    const summary = {
      critical: 0,
      warning: 0,
      info: 0,
      active: 0,
      acknowledged: 0,
      resolved: 0,
    };

    counts.forEach(c => {
      const count = c._count;
      if (c.severity === 'CRITICAL') summary.critical += count;
      if (c.severity === 'WARNING') summary.warning += count;
      if (c.severity === 'INFO') summary.info += count;
      if (c.status === 'ACTIVE') summary.active += count;
      if (c.status === 'ACKNOWLEDGED') summary.acknowledged += count;
      if (c.status === 'RESOLVED') summary.resolved += count;
    });

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/alerts/active
 * Get active alerts
 */
router.get('/active', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;

    const alerts = await prisma.alerts.findMany({
      where: {
        organization_id: orgId,
        status: 'ACTIVE',
      },
      orderBy: [
        { severity: 'asc' },
        { created_at: 'desc' },
      ],
      take: 50,
    });

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/alerts/:id
 * Get single alert details
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alert = await prisma.alerts.findUnique({
      where: { id: req.params.id },
      include: { metric_definitions: true },
    });

    if (!alert) {
      throw errors.notFound('Alert');
    }

    if (alert.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/alerts/:id/acknowledge
 * Acknowledge an alert
 */
router.post('/:id/acknowledge', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { note } = acknowledgeSchema.parse(req.body);
    const userId = req.user!.id;

    const alert = await prisma.alerts.findUnique({
      where: { id: req.params.id },
    });

    if (!alert) {
      throw errors.notFound('Alert');
    }

    if (alert.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    if (alert.status !== 'ACTIVE') {
      throw errors.badRequest('Alert is not active');
    }

    const updated = await prisma.alerts.update({
      where: { id: req.params.id },
      data: {
        status: 'ACKNOWLEDGED',
        acknowledged_at: new Date(),
        acknowledged_by: userId,
        metadata: {
          ...(alert.metadata as object || {}),
          acknowledgeNote: note,
        },
      },
    });

    // Publish event
    await pubsub.publish(`alerts:${req.organizationId}`, {
      type: 'alert_acknowledged',
      alertId: alert.id,
      by: req.user!.name,
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: req.organizationId!,
        user_id: userId,
        action: 'alert_acknowledge',
        resource_type: 'alert',
        resource_id: alert.id,
        details: { note } as Prisma.InputJsonValue,
      },
    });

    // Log to Druid for Chronos analytics
    druidEventStream.logAudit({
      organizationId: req.organizationId!,
      eventType: 'alert_acknowledged',
      actorId: userId,
      actorType: 'user',
      resourceType: 'alert',
      resourceId: alert.id,
      action: 'acknowledge',
      outcome: 'success',
      riskScore: alert.severity === 'CRITICAL' ? 90 : alert.severity === 'WARNING' ? 60 : 30,
      metadata: { severity: alert.severity, title: alert.title },
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
 * POST /api/v1/alerts/:id/resolve
 * Resolve an alert
 */
router.post('/:id/resolve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resolution, rootCause } = resolveSchema.parse(req.body);
    const userId = req.user!.id;

    const alert = await prisma.alerts.findUnique({
      where: { id: req.params.id },
    });

    if (!alert) {
      throw errors.notFound('Alert');
    }

    if (alert.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    if (alert.status === 'RESOLVED') {
      throw errors.badRequest('Alert is already resolved');
    }

    const updated = await prisma.alerts.update({
      where: { id: req.params.id },
      data: {
        status: 'RESOLVED',
        resolved_at: new Date(),
        resolved_by: userId,
        resolution,
        metadata: {
          ...(alert.metadata as object || {}),
          rootCause,
        },
      },
    });

    // Publish event
    await pubsub.publish(`alerts:${req.organizationId}`, {
      type: 'alert_resolved',
      alertId: alert.id,
      by: req.user!.name,
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: req.organizationId!,
        user_id: userId,
        action: 'alert.resolve',
        resource_type: 'alert',
        resource_id: alert.id,
        details: { resolution, rootCause } as Prisma.InputJsonValue,
      },
    });

    // Log to Druid for Chronos analytics
    druidEventStream.logAudit({
      organizationId: req.organizationId!,
      eventType: 'alert_resolved',
      actorId: userId,
      actorType: 'user',
      resourceType: 'alert',
      resourceId: alert.id,
      action: 'resolve',
      outcome: 'success',
      riskScore: alert.severity === 'CRITICAL' ? 90 : alert.severity === 'WARNING' ? 60 : 30,
      metadata: { severity: alert.severity, title: alert.title, resolution, rootCause },
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// PUT aliases for acknowledge and resolve (for REST purists)
router.put('/:id/acknowledge', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { note } = acknowledgeSchema.parse(req.body);
    const userId = req.user!.id;

    const alert = await prisma.alerts.findUnique({
      where: { id: req.params.id },
    });

    if (!alert) throw errors.notFound('Alert');
    if (alert.organization_id !== req.organizationId) throw errors.forbidden();
    if (alert.status !== 'ACTIVE') throw errors.badRequest('Alert is not active');

    const updated = await prisma.alerts.update({
      where: { id: req.params.id },
      data: {
        status: 'ACKNOWLEDGED',
        acknowledged_at: new Date(),
        acknowledged_by: userId,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/resolve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resolution } = resolveSchema.parse(req.body);
    const userId = req.user!.id;

    const alert = await prisma.alerts.findUnique({
      where: { id: req.params.id },
    });

    if (!alert) throw errors.notFound('Alert');
    if (alert.organization_id !== req.organizationId) throw errors.forbidden();
    if (alert.status === 'RESOLVED') throw errors.badRequest('Alert is already resolved');

    const updated = await prisma.alerts.update({
      where: { id: req.params.id },
      data: {
        status: 'RESOLVED',
        resolved_at: new Date(),
        resolved_by: userId,
        resolution,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
