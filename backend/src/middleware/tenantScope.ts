// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Middleware — Tenant Scope
 *
 * Limits routes that name a tenant in the URL to that tenant's own members.
 *
 * @exports ownTenantOnly
 * @module middleware/tenantScope
 */

import type { NextFunction, Request, Response } from 'express';

/**
 * Admits the platform owner (SUPER_ADMIN) for any tenant, and anyone else only
 * for their own organization. The tenant is read from `:tenantId`, else `:id`.
 *
 * The admin router's own guard admits any organization's OWNER or ADMIN, so
 * without this a route taking the tenant from the URL let an admin of one
 * organization read another's data by changing the id.
 */
export function ownTenantOnly(req: Request, res: Response, next: NextFunction): void {
  const tenantId = req.params['tenantId'] ?? req.params['id'];
  const role = (req as Request & { user?: { role?: string } }).user?.role;
  if (role === 'SUPER_ADMIN' || (tenantId !== undefined && tenantId === req.organizationId)) {
    next();
    return;
  }
  res.status(403).json({ error: 'Not allowed for this organization' });
}
