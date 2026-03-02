/**
 * API Routes — Users
 *
 * Express route handler defining REST endpoints.
 * @module routes/users
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import { cache } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(devAuth);

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  preferences: z.record(z.unknown()).optional(),
});

const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']).default('VIEWER'),
  teams: z.array(z.string()).optional(),
  message: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

/**
 * GET /api/v1/users/me
 * Get current user
 */
router.get('/me', (req: Request, res: Response) => {
  const user = req.user!;

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      preferences: user.preferences,
      organizationId: user.organizationId,
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
      },
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    },
  });
});

/**
 * PUT /api/v1/users/me
 * Update current user
 */
router.put('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const userId = req.user!.id;

    const updated = await prisma.users.update({
      where: { id: userId },
      data: {
        name: data.name,
        preferences: data.preferences as Prisma.InputJsonValue,
      },
    });

    // Invalidate cache
    await cache.del(`user:${userId}`);

    res.json({
      success: true,
      data: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        avatarUrl: (updated as any).avatar_url,
        role: updated.role,
        preferences: updated.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/users/me/password
 * Change password
 */
router.put('/me/password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const user = req.user!;

    if (!user.passwordHash) {
      throw errors.badRequest('Cannot change password for OAuth users');
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!validPassword) {
      throw errors.unauthorized('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.users.update({
      where: { id: user.id },
      data: { password_hash: passwordHash },
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: user.organizationId,
        user_id: user.id,
        action: 'user.password_changed',
        resource_type: 'user',
        resource_id: user.id,
      },
    });

    res.json({
      success: true,
      data: { message: 'Password changed successfully' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/users
 * List organization users (admin only)
 */
router.get('/', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;

    const [dbUsers, total] = await Promise.all([
      prisma.users.findMany({
        where: { organization_id: orgId, deleted_at: null },
        select: {
          id: true,
          email: true,
          name: true,
          avatar_url: true,
          role: true,
          status: true,
          last_login_at: true,
          created_at: true,
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.users.count({ where: { organization_id: orgId, deleted_at: null } }),
    ]);

    const users = dbUsers.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      avatarUrl: u.avatar_url,
      role: u.role,
      status: u.status,
      lastLoginAt: u.last_login_at,
      createdAt: u.created_at,
    }));

    res.json({
      success: true,
      data: users,
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
 * POST /api/v1/users/invite
 * Invite new user (admin only)
 */
router.post('/invite', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, role, teams } = inviteUserSchema.parse(req.body);
    const orgId = req.organizationId!;

    // Check if email already exists
    const existing = await prisma.users.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      throw errors.conflict('User with this email already exists');
    }

    // Create invited user
    const user = await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        name: email.split('@')[0],
        organization_id: orgId,
        role,
        status: 'INVITED',
        updated_at: new Date(),
      },
    });

    // Add to teams if specified
    if (teams && teams.length > 0) {
      await prisma.team_members.createMany({
        data: teams.map(teamId => ({
          team_id: teamId,
          user_id: user.id,
        })),
      });
    }

    // Queue invitation email via audit log (notification service dispatches)
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: req.user!.id,
        action: 'user.invitation_email',
        resource_type: 'user',
        resource_id: user.id,
        details: { recipient: user.email, invitedBy: req.user!.id, role },
        ip_address: req.ip || 'unknown',
        user_agent: req.headers['user-agent'] || 'unknown',
      },
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: req.user!.id,
        action: 'user.invite',
        resource_type: 'user',
        resource_id: user.id,
        details: { email, role } as Prisma.InputJsonValue,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/users/:id/role
 * Update user role (admin only)
 */
router.put('/:id/role', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = z.object({ role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']) }).parse(req.body);

    const user = await prisma.users.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      throw errors.notFound('User');
    }

    if (user.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    // Cannot demote yourself
    if (user.id === req.user!.id && role !== req.user!.role) {
      throw errors.badRequest('Cannot change your own role');
    }

    const updated = await prisma.users.update({
      where: { id: req.params.id },
      data: { role },
    });

    // Invalidate cache
    await cache.del(`user:${user.id}`);

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: req.organizationId!,
        user_id: req.user!.id,
        action: 'user.role_changed',
        resource_type: 'user',
        resource_id: user.id,
        details: { newRole: role, previousRole: user.role } as Prisma.InputJsonValue,
      },
    });

    res.json({
      success: true,
      data: {
        id: updated.id,
        role: updated.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/users/:id
 * Delete user (admin only)
 */
router.delete('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      throw errors.notFound('User');
    }

    if (user.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    // Cannot delete yourself
    if (user.id === req.user!.id) {
      throw errors.badRequest('Cannot delete your own account');
    }

    // Soft delete
    await prisma.users.update({
      where: { id: req.params.id },
      data: { deleted_at: new Date(), status: 'DISABLED' },
    });

    // Invalidate cache
    await cache.del(`user:${user.id}`);

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: req.organizationId!,
        user_id: req.user!.id,
        action: 'user.delete',
        resource_type: 'user',
        resource_id: user.id,
      },
    });

    res.json({
      success: true,
      data: { message: 'User deleted' },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
