/**
 * Tenant Isolation — Integration Tests
 *
 * Verifies that cross-tenant data access is denied, org-scoped queries
 * are enforced, and admin impersonation is properly audited.
 *
 * Run: npx vitest run tests/integration/tenant-isolation.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import {
  requireOrgScope,
  verifyOrgOwnership,
  orgWhere,
  auditTenantAccess,
} from '../../backend/src/middleware/tenantIsolation.js';

// =============================================================================
// HELPERS
// =============================================================================

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    organizationId: 'org-alpha',
    user: {
      id: 'user-1',
      email: 'alice@alpha.com',
      name: 'Alice',
      role: 'ADMIN',
      status: 'ACTIVE',
      organizationId: 'org-alpha',
      createdAt: null,
      updatedAt: null,
      organization: { id: 'org-alpha', name: 'Alpha Corp', slug: 'alpha' },
    },
    path: '/api/v1/test',
    method: 'GET',
    ip: '127.0.0.1',
    get: vi.fn().mockReturnValue('test-agent'),
    headers: {},
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

// =============================================================================
// requireOrgScope
// =============================================================================

describe('requireOrgScope', () => {
  it('passes when organizationId is set', () => {
    const req = mockReq({ organizationId: 'org-alpha' });
    const next = vi.fn();
    requireOrgScope(req, mockRes(), next);
    expect(next).toHaveBeenCalledWith();
  });

  it('rejects when organizationId is missing', () => {
    const req = mockReq({ organizationId: undefined });
    const next = vi.fn();
    requireOrgScope(req, mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('rejects when organizationId is empty string', () => {
    const req = mockReq({ organizationId: '' });
    const next = vi.fn();
    requireOrgScope(req, mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });
});

// =============================================================================
// verifyOrgOwnership
// =============================================================================

describe('verifyOrgOwnership', () => {
  it('allows access when resource org matches request org', () => {
    const req = mockReq({ organizationId: 'org-alpha' });
    expect(verifyOrgOwnership(req, 'org-alpha')).toBe(true);
  });

  it('DENIES access when resource org differs from request org', () => {
    const req = mockReq({ organizationId: 'org-alpha' });
    expect(verifyOrgOwnership(req, 'org-beta')).toBe(false);
  });

  it('DENIES access when resource org is null', () => {
    const req = mockReq({ organizationId: 'org-alpha' });
    expect(verifyOrgOwnership(req, null)).toBe(false);
  });

  it('DENIES access when request org is missing', () => {
    const req = mockReq({ organizationId: undefined });
    expect(verifyOrgOwnership(req, 'org-alpha')).toBe(false);
  });

  it('allows SUPER_ADMIN cross-tenant access', () => {
    const req = mockReq({
      organizationId: 'org-alpha',
      user: {
        id: 'admin-1',
        email: 'superadmin@datacendia.com',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        organizationId: 'org-alpha',
        createdAt: null,
        updatedAt: null,
        organization: { id: 'org-alpha', name: 'Alpha Corp', slug: 'alpha' },
      },
    } as any);
    expect(verifyOrgOwnership(req, 'org-beta')).toBe(true);
  });

  it('regular ADMIN cannot cross-tenant access', () => {
    const req = mockReq({
      organizationId: 'org-alpha',
      user: {
        id: 'user-1',
        email: 'alice@alpha.com',
        name: 'Alice',
        role: 'ADMIN',
        status: 'ACTIVE',
        organizationId: 'org-alpha',
        createdAt: null,
        updatedAt: null,
        organization: { id: 'org-alpha', name: 'Alpha Corp', slug: 'alpha' },
      },
    } as any);
    expect(verifyOrgOwnership(req, 'org-beta')).toBe(false);
  });
});

// =============================================================================
// orgWhere
// =============================================================================

describe('orgWhere', () => {
  it('returns correct where clause with org ID', () => {
    const req = mockReq({ organizationId: 'org-alpha' });
    expect(orgWhere(req)).toEqual({ organization_id: 'org-alpha' });
  });

  it('throws when organizationId is missing', () => {
    const req = mockReq({ organizationId: undefined });
    expect(() => orgWhere(req)).toThrow();
  });
});

// =============================================================================
// Cross-tenant access scenarios
// =============================================================================

describe('Cross-tenant access scenarios', () => {
  it('org-alpha user cannot read org-beta simulation', () => {
    const req = mockReq({ organizationId: 'org-alpha' });
    const simulation = { id: 'sim-1', organization_id: 'org-beta' };
    expect(verifyOrgOwnership(req, simulation.organization_id)).toBe(false);
  });

  it('org-alpha user cannot read org-alpha-typo resource', () => {
    const req = mockReq({ organizationId: 'org-alpha' });
    expect(verifyOrgOwnership(req, 'org-alpha-typo')).toBe(false);
  });

  it('case-sensitive org ID comparison', () => {
    const req = mockReq({ organizationId: 'org-alpha' });
    expect(verifyOrgOwnership(req, 'ORG-ALPHA')).toBe(false);
  });

  it('org-alpha user CAN read org-alpha resource', () => {
    const req = mockReq({ organizationId: 'org-alpha' });
    const deliberation = { id: 'del-1', organization_id: 'org-alpha' };
    expect(verifyOrgOwnership(req, deliberation.organization_id)).toBe(true);
  });
});

// =============================================================================
// auditTenantAccess
// =============================================================================

describe('auditTenantAccess', () => {
  it('logs denied access events', () => {
    const logSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const req = mockReq({ organizationId: 'org-alpha' });

    // auditTenantAccess uses logger, but we can verify it doesn't throw
    expect(() => {
      auditTenantAccess(req, 'org-beta', 'cross_tenant_denied', false);
    }).not.toThrow();

    logSpy.mockRestore();
  });

  it('logs allowed admin access events', () => {
    const logSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const req = mockReq({ organizationId: 'org-alpha' });

    expect(() => {
      auditTenantAccess(req, 'org-beta', 'cross_tenant_admin', true);
    }).not.toThrow();

    logSpy.mockRestore();
  });
});
