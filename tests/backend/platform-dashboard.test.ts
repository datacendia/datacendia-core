/**
 * Platform Dashboard — Unit Tests
 * The admin console's dashboard is computed from the database, not invented,
 * and only platform operators may read it.
 *
 * Run: npx vitest run tests/backend/platform-dashboard.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const db = vi.hoisted(() => ({
  tenantsGroupBy: vi.fn(),
  tenantsFindMany: vi.fn(),
  licensesGroupBy: vi.fn(),
  licensesAggregate: vi.fn(),
  usersCount: vi.fn(),
  auditFindMany: vi.fn(),
}));
vi.mock('../../backend/src/config/database.js', () => ({
  prisma: {
    tenants: { groupBy: db.tenantsGroupBy, findMany: db.tenantsFindMany },
    licenses: { groupBy: db.licensesGroupBy, aggregate: db.licensesAggregate },
    users: { count: db.usersCount },
    audit_logs: { findMany: db.auditFindMany },
  },
}));

import { describeAction, getPlatformDashboard } from '../../backend/src/services/admin/platformDashboard';

const NOW = new Date('2026-10-15T12:00:00Z');

describe('getPlatformDashboard', () => {
  beforeEach(() => {
    db.tenantsGroupBy.mockReset().mockImplementation(async (args: { by: string[] }) =>
      args.by[0] === 'status'
        ? [
            { status: 'ACTIVE', _count: { _all: 3 } },
            { status: 'TRIAL', _count: { _all: 2 } },
            { status: 'CHURNED', _count: { _all: 1 } },
          ]
        : [
            { plan: 'ENTERPRISE', _sum: { mrr: '9000.00' } },
            { plan: 'PROFESSIONAL', _sum: { mrr: '1500.50' } },
            { plan: 'TRIAL', _sum: { mrr: '0.00' } },
          ]
    );
    db.tenantsFindMany.mockReset().mockResolvedValue([
      { created_at: new Date('2026-10-02T00:00:00Z') },
      { created_at: new Date('2026-10-09T00:00:00Z') },
      { created_at: new Date('2026-07-31T23:59:59Z') },
    ]);
    db.licensesGroupBy.mockReset().mockResolvedValue([
      { status: 'ACTIVE', _count: { _all: 4 } },
      { status: 'EXPIRED', _count: { _all: 2 } },
    ]);
    db.licensesAggregate.mockReset().mockResolvedValue({ _count: { _all: 1 }, _sum: { revenue: '1200.00' } });
    db.usersCount.mockReset().mockResolvedValue(42);
    db.auditFindMany.mockReset().mockResolvedValue([
      { action: 'user.login_failed', created_at: new Date('2026-10-15T11:00:00Z'), organizations: { name: 'Acme' } },
      { action: 'COUNCIL_DELIBERATION_COMPLETED', created_at: new Date('2026-10-15T10:00:00Z'), organizations: { name: 'Acme' } },
    ]);
  });

  it('counts tenants by status, ignoring deleted ones', async () => {
    const dashboard = await getPlatformDashboard(NOW);
    expect(dashboard.tenants).toEqual({ total: 6, active: 3, trial: 2, churned: 1 });
    expect(db.tenantsGroupBy.mock.calls[0][0].where).toEqual({ deleted_at: null });
  });

  it('sums MRR from active tenants and derives ARR and the average', async () => {
    const dashboard = await getPlatformDashboard(NOW);
    expect(db.tenantsGroupBy.mock.calls[1][0].where).toEqual({ deleted_at: null, status: 'ACTIVE' });
    expect(dashboard.revenue).toEqual({ mrr: 10500.5, arr: 126006, avgPerTenant: 3500 });
    expect(dashboard.revenueByPlan).toEqual([
      { plan: 'ENTERPRISE', mrr: 9000 },
      { plan: 'PROFESSIONAL', mrr: 1500.5 },
    ]);
  });

  it('reports licenses expiring within 30 days and the revenue they carry', async () => {
    const dashboard = await getPlatformDashboard(NOW);
    expect(dashboard.licenses).toEqual({ total: 6, active: 4, expiring: 1, revenueAtRisk: 1200 });
    const { where } = db.licensesAggregate.mock.calls[0][0];
    expect(where.expires_at).toEqual({ gte: NOW, lte: new Date('2026-11-14T12:00:00Z') });
  });

  it("leaves out deleted users and deleted tenants' licenses", async () => {
    await getPlatformDashboard(NOW);
    expect(db.usersCount).toHaveBeenCalledWith({ where: { deleted_at: null } });
    expect(db.licensesGroupBy.mock.calls[0][0].where).toEqual({ tenant: { deleted_at: null } });
    expect(db.licensesAggregate.mock.calls[0][0].where.tenant).toEqual({ deleted_at: null });
  });

  it('buckets new tenants into the last six calendar months', async () => {
    const dashboard = await getPlatformDashboard(NOW);
    expect(db.tenantsFindMany.mock.calls[0][0].where.created_at).toEqual({ gte: new Date('2026-05-01T00:00:00Z') });
    expect(dashboard.tenantGrowth).toEqual([
      { month: '2026-05', count: 0 },
      { month: '2026-06', count: 0 },
      { month: '2026-07', count: 1 },
      { month: '2026-08', count: 0 },
      { month: '2026-09', count: 0 },
      { month: '2026-10', count: 2 },
    ]);
  });

  it('shows the latest audit events, flagging failures', async () => {
    const dashboard = await getPlatformDashboard(NOW);
    expect(dashboard.users.total).toBe(42);
    expect(dashboard.recentActivity).toEqual([
      { event: 'User login failed', organization: 'Acme', time: '2026-10-15T11:00:00.000Z', isAlert: true },
      { event: 'Council deliberation completed', organization: 'Acme', time: '2026-10-15T10:00:00.000Z', isAlert: false },
    ]);
    expect(dashboard.lastUpdated).toBe(NOW.toISOString());
  });

  it('reports zeros, not invented figures, for an empty platform', async () => {
    db.tenantsGroupBy.mockResolvedValue([]);
    db.tenantsFindMany.mockResolvedValue([]);
    db.licensesGroupBy.mockResolvedValue([]);
    db.licensesAggregate.mockResolvedValue({ _count: { _all: 0 }, _sum: { revenue: null } });
    db.usersCount.mockResolvedValue(0);
    db.auditFindMany.mockResolvedValue([]);
    const dashboard = await getPlatformDashboard(NOW);
    expect(dashboard.tenants).toEqual({ total: 0, active: 0, trial: 0, churned: 0 });
    expect(dashboard.revenue).toEqual({ mrr: 0, arr: 0, avgPerTenant: 0 });
    expect(dashboard.licenses).toEqual({ total: 0, active: 0, expiring: 0, revenueAtRisk: 0 });
    expect(dashboard.revenueByPlan).toEqual([]);
    expect(dashboard.recentActivity).toEqual([]);
  });
});

describe('describeAction', () => {
  it.each([
    ['user.login', 'User login'],
    ['USER_LOGIN', 'User login'],
    ['tenant:suspend', 'Tenant suspend'],
    ['', 'Event'],
  ])('%s -> %s', (action, expected) => {
    expect(describeAction(action)).toBe(expected);
  });
});
