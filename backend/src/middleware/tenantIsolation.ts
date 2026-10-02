/**
 * Middleware — Tenant Isolation
 *
 * Enforces organization-level data isolation across all tenant-bound API routes.
 * Provides helpers for verifying resource ownership and auditing cross-tenant access attempts.
 *
 * @exports requireOrgScope, verifyOrgOwnership, auditTenantAccess
 * @module middleware/tenantIsolation
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Request, Response, NextFunction } from 'express';
import { errors } from './errorHandler.js';
import { authenticate } from './auth.js';
import { logger } from '../utils/logger.js';

// =============================================================================
// TENANT ISOLATION MIDDLEWARE
// =============================================================================

/**
 * Middleware: Require that req.organizationId is set.
 * Place after auth middleware on any route that accesses tenant-scoped data.
 * Rejects with 403 if no org context is available.
 */
export const requireOrgScope = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.organizationId) {
    logger.warn('Tenant isolation: request without organizationId', {
      path: req.path,
      method: req.method,
      userId: req.user?.id,
      ip: req.ip,
    });
    next(errors.forbidden('Organization context required'));
    return;
  }
  next();
};

/**
 * Middleware: tenant gate for the org-scoped API, mounted once at app level.
 *
 * requireOrgScope needs req.organizationId, which authentication sets, but the
 * domain routers authenticate per route, after app-level middleware has run.
 * Mounted ahead of them on its own, as it was from 12 April 2026, it refused
 * every API request past login, signed in or not.
 *
 * The gate only ever adds a check. A request with a usable session must have
 * an organization. Any other request (no token, or a token authenticate
 * rejects) goes on to its route, whose own authentication decides, so public
 * routes stay public and protected routes still answer 401.
 */
export const tenantGate = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.headers.authorization?.startsWith('Bearer ')) {
    next();
    return;
  }
  void authenticate(req, res, (err?: unknown) => {
    if (!err) {
      requireOrgScope(req, res, next);
    } else if ((err as { statusCode?: number }).statusCode === 401) {
      next();
    } else {
      next(err);
    }
  });
};

/**
 * Verify that a resource belongs to the requesting user's organization.
 * Returns true if access is allowed, false if denied.
 * Automatically logs cross-tenant access attempts.
 *
 * Usage in route handlers:
 *   if (!verifyOrgOwnership(req, resource.organization_id)) {
 *     throw errors.forbidden();
 *   }
 */
export function verifyOrgOwnership(
  req: Request,
  resourceOrgId: string | null | undefined
): boolean {
  const requestOrgId = req.organizationId;

  // SUPER_ADMIN can access any org (for platform admin operations)
  if (req.user?.role === 'SUPER_ADMIN') {
    if (resourceOrgId && resourceOrgId !== requestOrgId) {
      auditTenantAccess(req, resourceOrgId, 'cross_tenant_admin', true);
    }
    return true;
  }

  if (!requestOrgId || !resourceOrgId) {
    return false;
  }

  if (resourceOrgId !== requestOrgId) {
    auditTenantAccess(req, resourceOrgId, 'cross_tenant_denied', false);
    return false;
  }

  return true;
}

/**
 * Create a Prisma where clause that enforces org scoping.
 * Use this when building queries to ensure tenant isolation at the data layer.
 *
 * Usage:
 *   const items = await prisma.deliberations.findMany({
 *     where: { ...orgWhere(req), status: 'ACTIVE' },
 *   });
 */
export function orgWhere(req: Request): { organization_id: string } {
  if (!req.organizationId) {
    throw errors.forbidden('Organization context required for data access');
  }
  return { organization_id: req.organizationId };
}

/**
 * Log a tenant access event for security audit trail.
 * Called automatically by verifyOrgOwnership on cross-tenant attempts.
 * Can also be called manually for custom audit events.
 */
export function auditTenantAccess(
  req: Request,
  targetOrgId: string,
  action: string,
  allowed: boolean
): void {
  const event = {
    timestamp: new Date().toISOString(),
    action,
    allowed,
    userId: req.user?.id || 'unknown',
    userEmail: req.user?.email || 'unknown',
    userRole: req.user?.role || 'unknown',
    sourceOrgId: req.organizationId || 'none',
    targetOrgId,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  if (allowed) {
    logger.info('Tenant access: cross-org access granted (admin)', event);
  } else {
    logger.warn('Tenant access: CROSS-TENANT ACCESS DENIED', event);
  }
}

export default {
  requireOrgScope,
  tenantGate,
  verifyOrgOwnership,
  orgWhere,
  auditTenantAccess,
};
