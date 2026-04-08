/**
 * Tests for backend/src/middleware/tenantIsolation.ts
 * Covers: requireOrgScope, verifyOrgOwnership, orgWhere, auditTenantAccess
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/middleware/errorHandler.js', () => ({
  errors: {
    forbidden: (msg?: string) => {
      const err: any = new Error(msg || 'Access denied');
      err.statusCode = 403;
      err.code = 'FORBIDDEN';
      return err;
    },
  },
}));

vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { requireOrgScope, verifyOrgOwnership, orgWhere, auditTenantAccess } from '../../src/middleware/tenantIsolation.js';
import type { Request, Response, NextFunction } from 'express';

function createMockReq(overrides: Record<string, any> = {}): Partial<Request> {
  return {
    path: '/test',
    method: 'GET',
    ip: '127.0.0.1',
    get: vi.fn(() => 'test-agent') as any,
    ...overrides,
  };
}

function createMockRes(): Partial<Response> {
  return {};
}

describe('requireOrgScope', () => {
  it('should call next when organizationId is present', () => {
    const req = createMockReq({ organizationId: 'org-123' });
    const res = createMockRes();
    const next: NextFunction = vi.fn();

    requireOrgScope(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with forbidden error when organizationId is missing', () => {
    const req = createMockReq({ organizationId: undefined });
    const res = createMockRes();
    const next: NextFunction = vi.fn();

    requireOrgScope(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 403,
    }));
  });
});

describe('verifyOrgOwnership', () => {
  it('should return true when orgs match', () => {
    const req = createMockReq({
      organizationId: 'org-123',
      user: { id: 'u1', email: 'test@test.com', role: 'ADMIN' },
    });

    expect(verifyOrgOwnership(req as Request, 'org-123')).toBe(true);
  });

  it('should return false when orgs do not match', () => {
    const req = createMockReq({
      organizationId: 'org-123',
      user: { id: 'u1', email: 'test@test.com', role: 'ADMIN' },
    });

    expect(verifyOrgOwnership(req as Request, 'org-456')).toBe(false);
  });

  it('should return true for SUPER_ADMIN accessing any org', () => {
    const req = createMockReq({
      organizationId: 'org-123',
      user: { id: 'u1', email: 'admin@test.com', role: 'SUPER_ADMIN' },
    });

    expect(verifyOrgOwnership(req as Request, 'org-456')).toBe(true);
  });

  it('should return false when request has no organizationId', () => {
    const req = createMockReq({
      organizationId: undefined,
      user: { id: 'u1', email: 'test@test.com', role: 'ADMIN' },
    });

    expect(verifyOrgOwnership(req as Request, 'org-123')).toBe(false);
  });

  it('should return false when resource has no orgId', () => {
    const req = createMockReq({
      organizationId: 'org-123',
      user: { id: 'u1', email: 'test@test.com', role: 'ADMIN' },
    });

    expect(verifyOrgOwnership(req as Request, null)).toBe(false);
  });
});

describe('orgWhere', () => {
  it('should return org filter clause', () => {
    const req = createMockReq({ organizationId: 'org-123' });
    expect(orgWhere(req as Request)).toEqual({ organization_id: 'org-123' });
  });

  it('should throw forbidden error when no org context', () => {
    const req = createMockReq({ organizationId: undefined });
    expect(() => orgWhere(req as Request)).toThrow();
  });
});

describe('auditTenantAccess', () => {
  it('should log access events without throwing', () => {
    const req = createMockReq({
      organizationId: 'org-123',
      user: { id: 'u1', email: 'test@test.com', role: 'ADMIN' },
    });

    // Should not throw
    expect(() => {
      auditTenantAccess(req as Request, 'org-456', 'cross_tenant_denied', false);
    }).not.toThrow();

    expect(() => {
      auditTenantAccess(req as Request, 'org-456', 'cross_tenant_admin', true);
    }).not.toThrow();
  });
});
