/**
 * Security — Keycloak Auth
 *
 * Security hardening module for attack prevention and threat detection.
 *
 * @exports initKeycloak, getSessionMiddleware, protect, optionalAuth, hasRole, canVeto, canAccessCouncil, getOrgId
 * @module security/KeycloakAuth
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// KEYCLOAK AUTHENTICATION SERVICE
// Enterprise SSO with OIDC/SAML, MFA, Groups/Roles, Conditional Access
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import Keycloak from 'keycloak-connect';
import session from 'express-session';
import { getErrorMessage } from '../utils/errors.js';

import { logger } from '../utils/logger.js';
// Keycloak configuration
const KEYCLOAK_CONFIG = {
  realm: process.env.KEYCLOAK_REALM || 'cendia',
  authServerUrl: process.env.KEYCLOAK_URL || 'http://localhost:8180',
  clientId: process.env.KEYCLOAK_CLIENT_ID || 'cendia-api',
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
  bearerOnly: true, // API-only mode (no browser redirects)
};

// User roles from Keycloak
export type CendiaRole = 
  | 'admin'           // Full platform access
  | 'analyst'         // Read + analyze
  | 'operator'        // Execute workflows
  | 'auditor'         // Read-only audit access
  | 'council-member'  // Can participate in Council
  | 'veto-authority'  // Can veto decisions
  | 'viewer';         // Read-only

// Keycloak user info
export interface KeycloakUser {
  id: string;
  username: string;
  email: string;
  name: string;
  roles: CendiaRole[];
  organizationId: string;
}

// Extended request with Keycloak auth info
export interface AuthenticatedRequest extends Request {
  kauth?: {
    grant?: {
      access_token?: {
        content: {
          sub: string;
          preferred_username: string;
          email: string;
          name: string;
          realm_access?: { roles: string[] };
          resource_access?: Record<string, { roles: string[] }>;
        };
      };
    };
  };
  keycloakUser?: KeycloakUser;
}

// Session store for Keycloak
const memoryStore = new session.MemoryStore();

// Initialize Keycloak
let keycloak: Keycloak.Keycloak | null = null;

/**
 * Initialize Keycloak adapter
 */
export function initKeycloak(): Keycloak.Keycloak {
  if (keycloak) return keycloak;

  const keycloakConfig = {
    realm: KEYCLOAK_CONFIG.realm,
    'auth-server-url': KEYCLOAK_CONFIG.authServerUrl,
    'ssl-required': 'external',
    resource: KEYCLOAK_CONFIG.clientId,
    'bearer-only': KEYCLOAK_CONFIG.bearerOnly,
    'confidential-port': 0,
    credentials: KEYCLOAK_CONFIG.clientSecret 
      ? { secret: KEYCLOAK_CONFIG.clientSecret }
      : undefined,
  };

  keycloak = new Keycloak({ store: memoryStore }, keycloakConfig as any);
  logger.info('[Keycloak] Initialized for realm:', KEYCLOAK_CONFIG.realm);
  
  return keycloak;
}

/**
 * Get session middleware for Keycloak
 */
export function getSessionMiddleware() {
  return session({
    secret: (() => { const s = process.env.SESSION_SECRET; if (!s && process.env.NODE_ENV === 'production') { throw new Error('SESSION_SECRET must be set in production'); } return s || 'dev-only-session-secret'; })(),
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  });
}

/**
 * Extract user info from Keycloak token
 */
function extractUserFromToken(req: AuthenticatedRequest): void {
  const token = req.kauth?.grant?.access_token?.content;
  if (!token) return;

  // Extract roles from realm and resource access
  const realmRoles = token.realm_access?.roles || [];
  const clientRoles = token.resource_access?.[KEYCLOAK_CONFIG.clientId]?.roles || [];
  const allRoles = [...new Set([...realmRoles, ...clientRoles])];

  // Map to Cendia roles
  const cendiaRoles: CendiaRole[] = allRoles.filter((role): role is CendiaRole => 
    ['admin', 'analyst', 'operator', 'auditor', 'council-member', 'veto-authority', 'viewer'].includes(role)
  );

  // Default to viewer if no specific role
  if (cendiaRoles.length === 0) {
    cendiaRoles.push('viewer');
  }

  req.keycloakUser = {
    id: token.sub,
    username: token.preferred_username,
    email: token.email,
    name: token.name || token.preferred_username,
    roles: cendiaRoles,
    organizationId: (token as any).organization_id || 'default-org',
  };
}

/**
 * Middleware: Protect route with Keycloak authentication
 */
export function protect(role?: CendiaRole | CendiaRole[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // In development, allow bypass with header
    if (process.env.NODE_ENV === 'development' && req.headers['x-bypass-auth'] === 'true') {
      req.keycloakUser = {
        id: 'dev-user',
        username: 'developer',
        email: 'dev@cendia.local',
        name: 'Developer',
        roles: ['admin'],
        organizationId: 'default-org',
      };
      return next();
    }

    // Check for Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No bearer token provided' },
      });
    }

    try {
      // Validate token with Keycloak
      const kc = initKeycloak();
      
      // Use keycloak-connect's built-in protection
      const protectMiddleware = kc.protect();
      
      // Wrap the protect middleware
      protectMiddleware(req, res, (err?: any) => {
        if (err) {
          return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' },
          });
        }

        // Extract user info
        extractUserFromToken(req);

        // Check role if specified
        if (role && req.keycloakUser) {
          const requiredRoles = Array.isArray(role) ? role : [role];
          const hasRole = requiredRoles.some(r => req.keycloakUser!.roles.includes(r));
          
          if (!hasRole) {
            return res.status(403).json({
              success: false,
              error: { 
                code: 'FORBIDDEN', 
                message: `Required role: ${requiredRoles.join(' or ')}` 
              },
            });
          }
        }

        next();
      });
    } catch (error: unknown) {
      console.error('[Keycloak] Auth error:', getErrorMessage(error));
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_ERROR', message: getErrorMessage(error) },
      });
    }
  };
}

/**
 * Middleware: Optional authentication (populates user if token present)
 */
export function optionalAuth() {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return next(); // No token, continue without auth
    }

    try {
      // Try to validate token
      extractUserFromToken(req);
    } catch (error) {
      // Ignore errors for optional auth
    }

    next();
  };
}

/**
 * Check if user has specific role
 */
export function hasRole(req: AuthenticatedRequest, role: CendiaRole | CendiaRole[]): boolean {
  if (!req.keycloakUser) return false;
  const roles = Array.isArray(role) ? role : [role];
  return roles.some(r => req.keycloakUser!.roles.includes(r));
}

/**
 * Check if user can perform action (for CendiaVeto integration)
 */
export function canVeto(req: AuthenticatedRequest): boolean {
  return hasRole(req, ['admin', 'veto-authority']);
}

/**
 * Check if user can access Council (for CendiaCouncil integration)
 */
export function canAccessCouncil(req: AuthenticatedRequest): boolean {
  return hasRole(req, ['admin', 'analyst', 'council-member']);
}

/**
 * Get organization ID from authenticated user
 */
export function getOrgId(req: AuthenticatedRequest): string {
  return req.keycloakUser?.organizationId || 'default-org';
}

// Export keycloak instance getter
export function getKeycloak(): Keycloak.Keycloak {
  return initKeycloak();
}

export default {
  initKeycloak,
  getSessionMiddleware,
  protect,
  optionalAuth,
  hasRole,
  canVeto,
  canAccessCouncil,
  getOrgId,
  getKeycloak,
};
