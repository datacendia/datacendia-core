/**
 * User Directory + Tenant Scope — Unit Tests
 * Settings > Users reads the organization's users; routes that name a tenant
 * serve only that tenant's members (or the platform owner).
 *
 * Run: npx vitest run tests/backend/user-directory.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

const { findMany, groupBy } = vi.hoisted(() => ({ findMany: vi.fn(), groupBy: vi.fn() }));
vi.mock('../../backend/src/config/database.js', () => ({ prisma: { users: { findMany, groupBy } } }));

import { userDirectory } from '../../backend/src/services/admin/userDirectory';
import { ownTenantOnly } from '../../backend/src/middleware/tenantScope';

describe('userDirectory', () => {
  beforeEach(() => {
    findMany.mockReset().mockResolvedValue([]);
    groupBy.mockReset().mockResolvedValue([]);
  });

  it("lists the organization's users in the settings UI's terms", async () => {
    findMany.mockResolvedValue([
      {
        id: 'u1', email: 'a@x.test', name: 'A', role: 'ANALYST', status: 'INVITED',
        last_login_at: null, created_at: new Date('2026-01-01T00:00:00Z'), mfa_enabled: true,
      },
    ]);
    const users = await userDirectory.listUsers('org-1');
    expect(findMany.mock.calls[0][0].where).toEqual({ organization_id: 'org-1', deleted_at: null });
    expect(users).toEqual([
      {
        id: 'u1', email: 'a@x.test', name: 'A', role: 'editor', status: 'pending',
        createdAt: '2026-01-01T00:00:00.000Z', mfaEnabled: true,
      },
    ]);
    expect(users[0]).not.toHaveProperty('lastLoginAt', expect.anything());
  });

  it('reports the last sign-in when there is one', async () => {
    findMany.mockResolvedValue([
      {
        id: 'u2', email: 'b@x.test', name: 'B', role: 'ADMIN', status: 'ACTIVE',
        last_login_at: new Date('2026-09-20T08:30:00Z'), created_at: new Date('2026-01-01T00:00:00Z'), mfa_enabled: false,
      },
    ]);
    const [user] = await userDirectory.listUsers('org-1');
    expect(user.lastLoginAt).toBe('2026-09-20T08:30:00.000Z');
  });

  it('searches names and emails, case-insensitively', async () => {
    await userDirectory.listUsers('org-1', { search: '  bob smith ' });
    expect(findMany.mock.calls[0][0].where.OR).toEqual([
      { name: { contains: 'bob smith', mode: 'insensitive' } },
      { email: { contains: 'bob smith', mode: 'insensitive' } },
    ]);
  });

  it('filters by role and status in the query, mapping UI values to the schema', async () => {
    await userDirectory.listUsers('org-1', { role: 'owner', status: 'pending' });
    const { where } = findMany.mock.calls[0][0];
    expect(where.role).toEqual({ in: ['OWNER', 'SUPER_ADMIN'] });
    expect(where.status).toEqual({ in: ['INVITED'] });
  });

  it('ignores a repeated query parameter instead of crashing', async () => {
    await expect(userDirectory.listUsers('org-1', { search: ['a', 'b'] })).resolves.toEqual([]);
    expect(findMany.mock.calls[0][0].where).not.toHaveProperty('OR');
  });

  it('counts users by role and status from one grouped query', async () => {
    groupBy.mockResolvedValue([
      { role: 'ADMIN', status: 'ACTIVE', _count: { _all: 2 } },
      { role: 'ANALYST', status: 'INVITED', _count: { _all: 1 } },
      { role: 'OWNER', status: 'ACTIVE', _count: { _all: 1 } },
    ]);
    await expect(userDirectory.getUserMetrics('org-1')).resolves.toEqual({
      totalUsers: 4,
      activeUsers: 3,
      pendingInvites: 1,
      byRole: { admin: 2, editor: 1, owner: 1 },
    });
  });
});

describe('ownTenantOnly', () => {
  const run = (params: Record<string, string>, role: string | undefined, organizationId = 'org-1') => {
    const req = { params, organizationId, user: role ? { role } : undefined } as unknown as Request;
    let status: number | undefined;
    const res = { status(code: number) { status = code; return this; }, json() { return this; } } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;
    ownTenantOnly(req, res, next);
    return { status, passed: (next as unknown as ReturnType<typeof vi.fn>).mock.calls.length === 1 };
  };

  it("lets an organization's admin act on their own tenant", () => {
    expect(run({ tenantId: 'org-1' }, 'ADMIN').passed).toBe(true);
    expect(run({ id: 'org-1' }, 'OWNER').passed).toBe(true);
  });

  it("refuses another organization's tenant", () => {
    expect(run({ tenantId: 'org-2' }, 'ADMIN')).toEqual({ status: 403, passed: false });
    expect(run({ id: 'org-2' }, 'OWNER')).toEqual({ status: 403, passed: false });
  });

  it('lets the platform owner act on any tenant', () => {
    expect(run({ tenantId: 'org-2' }, 'SUPER_ADMIN').passed).toBe(true);
  });
});
