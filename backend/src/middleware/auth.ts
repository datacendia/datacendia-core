/**
 * Middleware — Auth
 *
 * Express middleware for request processing pipeline.
 *
 * @exports authenticate, requireRole, devAuth, optionalAuth, generateAccessToken, generateRefreshToken, verifyRefreshToken
 * @module middleware/auth
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Request, Response, NextFunction } from 'express';
import * as jose from 'jose';
import { config } from '../config/index.js';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { errors } from './errorHandler.js';
import { logger } from '../utils/logger.js';
import { blockIfDemo } from './demoGuard.js';

interface AuthOrganization {
  id: string;
  name: string;
  slug: string;
  [key: string]: any;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  organizationId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  organization: AuthOrganization;
  preferences?: any;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      organizationId?: string;
    }
  }
}

interface JWTPayload {
  sub: string;
  email: string;
  organizationId: string;
  role: string;
  iat: number;
  exp: number;
  mfaVerified?: boolean; // set when MFA TOTP step is completed
}

// Roles that MUST complete MFA if their account has MFA enabled (CC6.1)
const MFA_REQUIRED_ROLES = new Set(['OWNER', 'SUPER_ADMIN', 'ADMIN']);

const JWT_SECRET = new TextEncoder().encode(config.jwtSecret);

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw errors.unauthorized('No token provided');
    }

    const token = authHeader.substring(7);

    // Verify token
    const { payload } = await jose.jwtVerify(token, JWT_SECRET) as { payload: JWTPayload };

    // Check if token is in blacklist (logged out tokens)
    const isBlacklisted = await cache.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      throw errors.unauthorized('Token has been revoked');
    }

    // Try to get user from cache
    const cacheKey = `user:${payload.sub}`;
    let user = await cache.get<AuthUser>(cacheKey);

    if (!user) {
      // Fetch from database
      const dbUser = await prisma.users.findUnique({
        where: { id: payload.sub },
        include: { organizations: true },
      });

      if (!dbUser || dbUser.status !== 'ACTIVE' || dbUser.deleted_at) {
        throw errors.unauthorized('User not found or inactive');
      }

      user = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        status: dbUser.status,
        organizationId: dbUser.organization_id,
        createdAt: dbUser.created_at,
        updatedAt: dbUser.updated_at,
        organization: dbUser.organizations as AuthOrganization,
        preferences: dbUser.preferences,
      };
      
      // Cache for 5 minutes
      await cache.set(cacheKey, user, 300);
    }

    req.user = user;
    req.organizationId = user.organizationId;

    // MFA enforcement for privileged roles (CC6.1)
    if (MFA_REQUIRED_ROLES.has(user.role)) {
      // Fetch live MFA status (not from cache — must be authoritative)
      const dbUser = await prisma.users.findUnique({
        where: { id: user.id },
        select: { mfa_enabled: true },
      });
      if (dbUser?.mfa_enabled) {
        // Check Redis for MFA verification flag tied to this token
        const mfaKey = `mfa:verified:${payload.sub}:${payload.iat}`;
        const mfaVerified = await cache.exists(mfaKey);
        if (!mfaVerified && !payload.mfaVerified) {
          res.status(403).json({
            success: false,
            error: {
              code: 'MFA_REQUIRED',
              message: 'Multi-factor authentication is required for your account. Please complete MFA verification.',
            },
          });
          return;
        }
      }
    }

    if (blockIfDemo(req, res)) return;
    next();
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      next(errors.unauthorized('Token has expired'));
    } else if (error instanceof jose.errors.JWTInvalid) {
      next(errors.unauthorized('Invalid token'));
    } else {
      next(error);
    }
  }
};

/**
 * Check if user has required role
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(errors.unauthorized());
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(errors.forbidden('Insufficient permissions'));
      return;
    }

    next();
  };
};

/**
 * Development mode authentication bypass
 * Creates a demo user context when no token is provided
 */
export const devAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const timeout = <T>(ms: number, promise: Promise<T>) =>
    Promise.race([
      promise,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('devAuth timeout')), ms)),
    ]);
  
  // If token provided, use real auth
  if (authHeader?.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  
  // If REQUIRE_AUTH is set, don't allow bypass
  if (config.requireAuth) {
    throw errors.unauthorized('Authentication required');
  }

  // Explicitly block bypass in non-development/test environments
  if (config.nodeEnv !== 'development' && config.nodeEnv !== 'test') {
    throw errors.unauthorized('Authentication required');
  }

  // In development without REQUIRE_AUTH, use real seeded organization
  logger.warn('⚠️  DEV AUTH BYPASS ACTIVE - Request authenticated without token', {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    warning: 'Debug mode active - restrict in production',
  });

  try {
    const primaryAdminUser = await timeout(
      1500,
      prisma.users.findUnique({
        where: { email: 'admin@datacendia.com' },
        include: { organizations: true },
      })
    );

    const adminUser =
      primaryAdminUser ??
      (await timeout(
        1500,
        prisma.users.findFirst({
          where: { role: 'SUPER_ADMIN' },
          orderBy: { created_at: 'asc' },
          include: { organizations: true },
        })
      ));

    if (adminUser) {
      req.user = {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        organizationId: adminUser.organization_id,
        status: adminUser.status,
        createdAt: adminUser.created_at,
        updatedAt: adminUser.updated_at,
        organization: adminUser.organizations,
        preferences: adminUser.preferences,
      } as any;
      req.organizationId = adminUser.organization_id;
      if (blockIfDemo(req, res)) return;
      return next();
    }
  } catch (dbError) {
    logger.error('Dev auth: DB lookup failed — no hardcoded fallback. Seed the database first.', { error: dbError instanceof Error ? dbError.message : String(dbError) });
    throw errors.unauthorized('Dev auth bypass requires a seeded database with at least one admin user. Run: npx prisma db seed');
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  // Try to authenticate but don't fail
  authenticate(req, res, (err) => {
    // Ignore auth errors for optional auth
    next();
  });
};

/**
 * Mark MFA as verified for the given user+iat session in Redis.
 * Called by the MFA verify endpoint after TOTP is confirmed.
 */
export const markMfaVerified = async (userId: string, iat: number): Promise<void> => {
  const mfaKey = `mfa:verified:${userId}:${iat}`;
  // TTL matches JWT expiry (1 hour by default)
  await cache.set(mfaKey, true, 3600);
};

export const generateAccessToken = async (user: {
  id: string;
  email: string;
  organizationId: string;
  role: string;
  mfaVerified?: boolean;
}): Promise<string> => {
  const token = await new jose.SignJWT({
    sub: user.id,
    email: user.email,
    organizationId: user.organizationId,
    role: user.role,
    ...(user.mfaVerified ? { mfaVerified: true } : {}),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwtExpiresIn)
    .sign(JWT_SECRET);

  return token;
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = async (userId: string): Promise<string> => {
  const REFRESH_SECRET = new TextEncoder().encode(config.jwtRefreshSecret);
  
  const token = await new jose.SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwtRefreshExpiresIn)
    .sign(REFRESH_SECRET);

  return token;
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = async (token: string): Promise<string> => {
  const REFRESH_SECRET = new TextEncoder().encode(config.jwtRefreshSecret);
  
  try {
    const { payload } = await jose.jwtVerify(token, REFRESH_SECRET);
    return payload.sub as string;
  } catch {
    throw errors.unauthorized('Invalid refresh token');
  }
};

export default authenticate;
