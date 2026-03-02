// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - SPORTS VERTICAL
 * Role-Based Access Control Middleware
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export type SportsRole = 
  | 'board'
  | 'ceo'
  | 'cfo'
  | 'sporting_director'
  | 'commercial_director'
  | 'academy_director'
  | 'head_of_recruitment'
  | 'chief_scout'
  | 'data_analyst'
  | 'legal_counsel'
  | 'admin'
  | 'viewer';

export type SportsPermission =
  | 'decisions:create'
  | 'decisions:read'
  | 'decisions:update'
  | 'decisions:delete'
  | 'decisions:approve'
  | 'decisions:export'
  | 'evidence:attach'
  | 'evidence:view'
  | 'scouting:add'
  | 'valuation:add'
  | 'ffp:assess'
  | 'compliance:view'
  | 'templates:view'
  | 'analytics:view'
  | 'admin:manage';

// =============================================================================
// ROLE PERMISSIONS MAPPING
// =============================================================================

const ROLE_PERMISSIONS: Record<SportsRole, SportsPermission[]> = {
  board: [
    'decisions:read', 'decisions:approve', 'decisions:export',
    'evidence:view', 'compliance:view', 'templates:view', 'analytics:view',
    'ffp:assess',
  ],
  ceo: [
    'decisions:read', 'decisions:approve', 'decisions:export',
    'evidence:view', 'compliance:view', 'templates:view', 'analytics:view',
    'ffp:assess',
  ],
  cfo: [
    'decisions:read', 'decisions:approve', 'decisions:export',
    'evidence:view', 'valuation:add', 'ffp:assess',
    'compliance:view', 'templates:view', 'analytics:view',
  ],
  sporting_director: [
    'decisions:create', 'decisions:read', 'decisions:update', 'decisions:approve', 'decisions:export',
    'evidence:attach', 'evidence:view', 'scouting:add', 'valuation:add',
    'compliance:view', 'templates:view', 'analytics:view', 'ffp:assess',
  ],
  commercial_director: [
    'decisions:read', 'decisions:approve', 'decisions:export',
    'evidence:view', 'compliance:view', 'templates:view', 'analytics:view',
  ],
  academy_director: [
    'decisions:create', 'decisions:read', 'decisions:update', 'decisions:approve',
    'evidence:attach', 'evidence:view', 'scouting:add',
    'templates:view', 'analytics:view',
  ],
  head_of_recruitment: [
    'decisions:create', 'decisions:read', 'decisions:update',
    'evidence:attach', 'evidence:view', 'scouting:add', 'valuation:add',
    'templates:view', 'analytics:view',
  ],
  chief_scout: [
    'decisions:read', 'decisions:update',
    'evidence:attach', 'evidence:view', 'scouting:add',
    'templates:view',
  ],
  data_analyst: [
    'decisions:read', 'valuation:add',
    'evidence:view', 'templates:view', 'analytics:view',
    'ffp:assess',
  ],
  legal_counsel: [
    'decisions:read', 'decisions:export',
    'evidence:view', 'compliance:view', 'templates:view',
  ],
  admin: [
    'decisions:create', 'decisions:read', 'decisions:update', 'decisions:delete',
    'decisions:approve', 'decisions:export',
    'evidence:attach', 'evidence:view',
    'scouting:add', 'valuation:add', 'ffp:assess',
    'compliance:view', 'templates:view', 'analytics:view',
    'admin:manage',
  ],
  viewer: [
    'decisions:read', 'evidence:view', 'templates:view', 'analytics:view',
  ],
};

// =============================================================================
// MIDDLEWARE FUNCTIONS
// =============================================================================

/**
 * Extract user role from request (from JWT or session)
 */
export function extractUserRole(req: Request): SportsRole | null {
  // Production upgrade: extract from JWT claims or session
  // For now, check header or body
  const roleFromHeader = req.headers['x-sports-role'] as string;
  const roleFromBody = req.body?.userRole as string;
  
  const role = roleFromHeader || roleFromBody || 'viewer';
  
  if (role in ROLE_PERMISSIONS) {
    return role as SportsRole;
  }
  
  return null;
}

/**
 * Check if role has required permission
 */
export function hasPermission(role: SportsRole, permission: SportsPermission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions?.includes(permission) || false;
}

/**
 * Middleware factory for permission checking
 */
export function requirePermission(permission: SportsPermission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = extractUserRole(req);
    
    if (!role) {
      logger.warn(`Sports Auth: No valid role found for request to ${req.path}`);
      res.status(403).json({ 
        error: 'Access denied',
        message: 'No valid role found',
      });
      return;
    }
    
    if (!hasPermission(role, permission)) {
      logger.warn(`Sports Auth: Role ${role} lacks permission ${permission} for ${req.path}`);
      res.status(403).json({ 
        error: 'Access denied',
        message: `Role '${role}' does not have permission '${permission}'`,
      });
      return;
    }
    
    // Attach role to request for downstream use
    (req as any).sportsRole = role;
    next();
  };
}

/**
 * Middleware to require any of the specified permissions
 */
export function requireAnyPermission(...permissions: SportsPermission[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = extractUserRole(req);
    
    if (!role) {
      res.status(403).json({ error: 'Access denied', message: 'No valid role found' });
      return;
    }
    
    const hasAny = permissions.some(p => hasPermission(role, p));
    
    if (!hasAny) {
      res.status(403).json({ 
        error: 'Access denied',
        message: `Role '${role}' does not have any of the required permissions`,
      });
      return;
    }
    
    (req as any).sportsRole = role;
    next();
  };
}

/**
 * Middleware to require all specified permissions
 */
export function requireAllPermissions(...permissions: SportsPermission[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = extractUserRole(req);
    
    if (!role) {
      res.status(403).json({ error: 'Access denied', message: 'No valid role found' });
      return;
    }
    
    const hasAll = permissions.every(p => hasPermission(role, p));
    
    if (!hasAll) {
      const missing = permissions.filter(p => !hasPermission(role, p));
      res.status(403).json({ 
        error: 'Access denied',
        message: `Role '${role}' is missing permissions: ${missing.join(', ')}`,
      });
      return;
    }
    
    (req as any).sportsRole = role;
    next();
  };
}

/**
 * Get all permissions for a role
 */
export function getPermissionsForRole(role: SportsRole): SportsPermission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Get all available roles
 */
export function getAllRoles(): SportsRole[] {
  return Object.keys(ROLE_PERMISSIONS) as SportsRole[];
}

export default {
  extractUserRole,
  hasPermission,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  getPermissionsForRole,
  getAllRoles,
  ROLE_PERMISSIONS,
};
