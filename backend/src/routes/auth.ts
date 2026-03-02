// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.js';
import {
  authenticate,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../middleware/auth.js';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  organizationName: z.string().min(2, 'Organization name required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

/**
 * POST /api/v1/auth/login
 * User login with email and password
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email: email.toLowerCase() },
      include: { organizations: true },
    });

    if (!user || !user.password_hash) {
      throw errors.unauthorized('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw errors.unauthorized('Account is not active');
    }

    if (user.deleted_at) {
      throw errors.unauthorized('Account has been deleted');
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash); 
    if (!validPassword) {
      // Log failed attempt
      logger.warn(`Failed login attempt for ${email}`, { ip: req.ip });
      throw errors.unauthorized('Invalid email or password');
    }

    // Generate tokens
    const accessToken = await generateAccessToken({
      id: user.id,
      email: user.email,
      organizationId: user.organization_id,
      role: user.role,
    });
    const refreshToken = await generateRefreshToken(user.id);

    // Store refresh token hash in session
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await prisma.sessions.create({
      data: {
        id: crypto.randomUUID(),
        user_id: user.id,
        refresh_token_hash: refreshTokenHash,
        user_agent: req.get('user-agent') || null,
        ip_address: req.ip,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Update last login
    await prisma.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    // Log successful login
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: user.organization_id,
        user_id: user.id,
        action: 'user.login',
        resource_type: 'user',
        resource_id: user.id,
        details: { method: 'password' } as Prisma.InputJsonValue,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || undefined,
      },
    });

    logger.info(`User logged in: ${email}`);

    const org = user.organizations;

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        expiresIn: 3600, // 1 hour
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organization_id,
          organization: {
            id: org.id,
            name: org.name,
            slug: org.slug,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/register
 * Register new user and organization
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, organizationName } = registerSchema.parse(req.body);

    // Check if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw errors.conflict('Email already registered');
    }

    // Create organization and user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const slug = organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const organization = await tx.organizations.create({
        data: {
          id: crypto.randomUUID(),
          name: organizationName,
          slug: `${slug}-${Date.now().toString(36)}`,
          updated_at: new Date(),
        },
      });

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user as admin of the organization (not yet verified)
      const user = await tx.users.create({
        data: {
          id: crypto.randomUUID(),
          email: email.toLowerCase(),
          password_hash: passwordHash,
          name,
          organization_id: organization.id,
          role: 'ADMIN',
          status: 'ACTIVE',
          email_verified: false,
          updated_at: new Date(),
        },
      });

      // Create email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      await tx.email_verifications.create({
        data: {
          id: crypto.randomUUID(),
          user_id: user.id,
          token: verificationToken,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      // Send verification email
      await emailService.sendVerificationEmail(user.email, user.name, verificationToken);

      return { user, organization };
    });

    // Generate tokens
    const accessToken = await generateAccessToken({
      id: result.user.id,
      email: result.user.email,
      organizationId: result.user.organization_id,
      role: result.user.role,
    });
    const refreshToken = await generateRefreshToken(result.user.id);

    // Store refresh token
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await prisma.sessions.create({
      data: {
        id: crypto.randomUUID(),
        user_id: result.user.id,
        refresh_token_hash: refreshTokenHash,
        user_agent: req.get('user-agent') || null,
        ip_address: req.ip,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        expiresIn: 3600,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          organizationId: result.user.organization_id,
          organization: {
            id: result.organization.id,
            name: result.organization.name,
            slug: result.organization.slug,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);

    // Verify refresh token
    const userId = await verifyRefreshToken(refreshToken);

    // Find user
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user || user.status !== 'ACTIVE' || user.deleted_at) {
      throw errors.unauthorized('User not found or inactive');
    }

    // Verify refresh token exists in sessions
    const sessions = await prisma.sessions.findMany({
      where: {
        user_id: userId,
        expires_at: { gt: new Date() },
      },
    });

    let validSession = false;
    for (const session of sessions) {
      const isValid = await bcrypt.compare(refreshToken, session.refresh_token_hash);
      if (isValid) {
        validSession = true;
        break;
      }
    }

    if (!validSession) {
      throw errors.unauthorized('Invalid refresh token');
    }

    // Generate new access token
    const accessToken = await generateAccessToken({
      id: user.id,
      email: user.email,
      organizationId: user.organization_id,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        accessToken,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/logout
 * Logout user and invalidate tokens
 */
router.post('/logout', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.substring(7);

    if (token) {
      // Add token to blacklist (expires when token would expire)
      await cache.set(`blacklist:${token}`, '1', 3600);
    }

    // Delete all sessions for user
    await prisma.sessions.deleteMany({
      where: { user_id: req.user!.id },
    });

    // Clear user cache
    await cache.del(`user:${req.user!.id}`);

    // Log logout
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: req.user!.organizationId,
        user_id: req.user!.id,
        action: 'user.logout',
        resource_type: 'user',
        resource_id: req.user!.id,
        details: {} as Prisma.InputJsonValue,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || undefined,
      },
    });

    res.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/auth/me
 * Get current user info
 */
router.get('/me', authenticate, async (req: Request, res: Response) => {
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
 * POST /api/v1/auth/forgot-password
 * Request password reset email
 */
router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);

    const user = await prisma.users.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      res.json({
        success: true,
        data: { message: 'If an account exists with this email, a reset link has been sent.' },
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Delete any existing reset tokens for this user
    await prisma.password_resets.deleteMany({
      where: { user_id: user.id },
    });

    // Create new password reset entry
    await prisma.password_resets.create({
      data: {
        id: crypto.randomUUID(),
        user_id: user.id,
        token: resetToken,
        expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send password reset email
    await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
    logger.info(`Password reset email sent to ${email}`);

    res.json({
      success: true,
      data: { message: 'If an account exists with this email, a reset link has been sent.' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/reset-password
 * Reset password using token
 */
router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = z.object({
      token: z.string().min(1),
      password: z.string().min(8),
    }).parse(req.body);

    // Find the reset token
    const passwordReset = await prisma.password_resets.findUnique({
      where: { token },
    });

    if (!passwordReset) {
      throw errors.badRequest('Invalid or expired reset token');
    }

    // Check if token is expired
    if (passwordReset.expires_at < new Date()) {
      await prisma.password_resets.delete({ where: { id: passwordReset.id } });
      throw errors.badRequest('Reset token has expired');
    }

    // Check if token was already used
    if (passwordReset.used_at) {
      throw errors.badRequest('Reset token has already been used');
    }

    // Get user
    const user = await prisma.users.findUnique({
      where: { id: passwordReset.user_id },
    });

    if (!user) {
      throw errors.badRequest('User not found');
    }

    // Update password and mark token as used
    const passwordHash = await bcrypt.hash(password, 12);
    
    await prisma.$transaction([
      prisma.users.update({
        where: { id: user.id },
        data: { password_hash: passwordHash },
      }),
      prisma.password_resets.update({
        where: { id: passwordReset.id },
        data: { used_at: new Date() },
      }),
      prisma.sessions.deleteMany({
        where: { user_id: user.id },
      }),
    ]);

    logger.info(`Password reset completed for ${user.email}`);

    res.json({
      success: true,
      data: { message: 'Password has been reset successfully.' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/verify-email
 * Verify email with token
 */
router.post('/verify-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = z.object({ token: z.string().min(1) }).parse(req.body);

    // Find the verification token
    const verification = await prisma.email_verifications.findUnique({
      where: { token },
    });

    if (!verification) {
      throw errors.badRequest('Invalid verification token');
    }

    // Check if token is expired
    if (verification.expires_at < new Date()) {
      await prisma.email_verifications.delete({ where: { id: verification.id } });
      throw errors.badRequest('Verification token has expired');
    }

    // Get user and mark as verified
    const user = await prisma.users.findUnique({
      where: { id: verification.user_id },
    });

    if (!user) {
      throw errors.badRequest('User not found');
    }

    // Update user and delete verification token
    await prisma.$transaction([
      prisma.users.update({
        where: { id: user.id },
        data: {
          email_verified: true,
          email_verified_at: new Date(),
        },
      }),
      prisma.email_verifications.delete({
        where: { id: verification.id },
      }),
    ]);

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name);

    logger.info(`Email verified for ${user.email}`);

    res.json({
      success: true,
      data: { message: 'Email has been verified successfully.' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/resend-verification
 * Resend email verification
 */
router.post('/resend-verification', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    if (user.emailVerified) {
      res.json({
        success: true,
        data: { message: 'Email is already verified.' },
      });
      return;
    }

    // Delete existing verification token
    await prisma.email_verifications.deleteMany({
      where: { user_id: user.id },
    });

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await prisma.email_verifications.create({
      data: {
        id: crypto.randomUUID(),
        user_id: user.id,
        token: verificationToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email
    await emailService.sendVerificationEmail(user.email, user.name, verificationToken);
    logger.info(`Verification email resent to ${user.email}`);

    res.json({
      success: true,
      data: { message: 'Verification email has been sent.' },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
