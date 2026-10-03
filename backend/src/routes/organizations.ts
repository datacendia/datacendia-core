/**
 * API Routes — Organizations
 *
 * Express route handler defining REST endpoints.
 * @module routes/organizations
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import { cache } from '../config/redis.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(devAuth);

const updateOrgSchema = z.object({
  name: z.string().min(2).optional(),
  industry: z.string().max(100).optional(),
  companySize: z.string().max(50).optional(),
  // Merged into the stored settings: other features keep their own keys there.
  settings: z.record(z.unknown()).optional(),
});

// Settings are a JSON object, but the TR demo seed stored them as a JSON
// string. Read either; anything else counts as no settings.
function settingsObject(value: unknown): Record<string, unknown> {
  let parsed = value;
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return {};
    }
  }
  return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
    ? (parsed as Record<string, unknown>)
    : {};
}

// A save rereads the row and writes only if updated_at hasn't moved since, so
// two concurrent saves can't drop each other's settings keys.
const SAVE_ATTEMPTS = 3;

/**
 * GET /api/v1/organizations/current
 * Get current organization
 */
router.get('/current', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const org = await prisma.organizations.findUnique({
      where: { id: req.organizationId! },
    });

    if (!org) {
      throw errors.notFound('Organization');
    }

    res.json({
      success: true,
      data: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        industry: org.industry,
        companySize: org.company_size,
        settings: settingsObject(org.settings),
        createdAt: org.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/organizations/current
 * Update organization (admin only)
 */
router.put('/current', requireRole('OWNER', 'ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateOrgSchema.parse(req.body);
    const orgId = req.organizationId;
    if (!orgId) {
      throw errors.unauthorized('Organization context required');
    }

    // An empty string is the Settings page's "Not set": clear the column.
    const clearable = (value: string | undefined) => (value === undefined ? undefined : value || null);
    const fields = {
      name: data.name,
      industry: clearable(data.industry),
      company_size: clearable(data.companySize),
    };

    let saved = false;
    for (let attempt = 0; attempt < SAVE_ATTEMPTS && !saved; attempt++) {
      const current = await prisma.organizations.findUnique({
        where: { id: orgId },
        select: { settings: true, updated_at: true },
      });
      if (!current) {
        throw errors.notFound('Organization');
      }
      const settings = data.settings
        ? ({ ...settingsObject(current.settings), ...data.settings } as Prisma.InputJsonValue)
        : undefined;
      const { count } = await prisma.organizations.updateMany({
        where: { id: orgId, updated_at: current.updated_at },
        data: { ...fields, settings, updated_at: new Date() },
      });
      saved = count === 1;
    }
    if (!saved) {
      throw errors.conflict('The organization was changed by another save. Reload and try again.');
    }

    const updated = await prisma.organizations.findUnique({ where: { id: orgId } });
    if (!updated) {
      throw errors.notFound('Organization');
    }

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: req.user!.id,
        action: 'organization.update',
        resource_type: 'organization',
        resource_id: orgId,
        details: data as Prisma.InputJsonValue,
      },
    });

    res.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        industry: updated.industry,
        companySize: updated.company_size,
        settings: settingsObject(updated.settings),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/organizations/current/teams
 * Get organization teams
 */
router.get('/current/teams', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teams = await prisma.teams.findMany({
      where: { organization_id: req.organizationId! },
      include: {
        _count: {
          select: { team_members: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: teams.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        memberCount: t._count.team_members,
        createdAt: t.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/organizations/current/teams
 * Create team (admin only)
 */
router.post('/current/teams', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    }).parse(req.body);

    const team = await prisma.teams.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: req.organizationId!,
        name,
        description,
        updated_at: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/organizations/current/activity
 * Get organization activity log
 */
router.get('/current/activity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;

    const [logs, total] = await Promise.all([
      prisma.audit_logs.findMany({
        where: { organization_id: req.organizationId! },
        include: {
          users: { select: { id: true, name: true, email: true } },
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.audit_logs.count({ where: { organization_id: req.organizationId! } }),
    ]);

    res.json({
      success: true,
      data: logs.map(l => ({
        id: l.id,
        action: l.action,
        resourceType: l.resource_type,
        resourceId: l.resource_id,
        details: l.details,
        user: l.users,
        createdAt: l.created_at,
      })),
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

export default router;
