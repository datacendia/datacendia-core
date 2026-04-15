/**
 * Middleware — Demo Guard
 *
 * Prevents mutating database writes for demo / tutorial organisations.
 * Demo data is read-only: GET requests pass through normally so users can
 * explore the seeded dataset, but POST / PUT / PATCH / DELETE are intercepted
 * and a mock success response is returned without touching the database.
 *
 * Real user organisations (UUID-based IDs / slugs) are NEVER affected.
 *
 * @module middleware/demoGuard
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Request, Response } from 'express';

// =============================================================================
// Constants
// =============================================================================

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * All demo org IDs / slugs are prefixed with one of these strings.
 * Real user orgs use UUID IDs and user-chosen slugs — no collision possible.
 */
const DEMO_PREFIXES = ['demo-', 'tutorial-'];

// =============================================================================
// Helpers
// =============================================================================

/**
 * Returns true if the organisation is a seeded demo / tutorial org.
 * Decision is based purely on the org ID prefix — no DB lookup required.
 */
export function isDemoOrg(orgId: string | null | undefined): boolean {
  if (!orgId) return false;
  return DEMO_PREFIXES.some(prefix => orgId.startsWith(prefix));
}

/**
 * If the current request is a mutating operation against a demo org,
 * writes a mock success response and returns `true` (caller must NOT call next()).
 * Otherwise returns `false` and the caller should proceed normally.
 *
 * Exemptions (always allowed even for demo orgs):
 *   - SUPER_ADMIN users (platform admins may need to reset demo data)
 *   - Safe/read methods: GET, HEAD, OPTIONS
 *   - The /auth/* family (login, token refresh — org-independent)
 */
export function blockIfDemo(req: Request, res: Response): boolean {
  const orgId = req.organizationId;
  const role  = req.user?.role;

  if (
    isDemoOrg(orgId) &&
    MUTATING_METHODS.has(req.method) &&
    role !== 'SUPER_ADMIN'
  ) {
    res.status(200).json({
      success: true,
      data: req.body ?? {},
      _demo: true,
      _message:
        'This is a demo organisation — changes are not persisted. ' +
        'Your own organisation data is completely separate and unaffected.',
    });
    return true; // signal: response already sent, do NOT call next()
  }

  return false; // let the request proceed normally
}
