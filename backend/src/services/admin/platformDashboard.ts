// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * The admin console's platform dashboard, read from the database: tenants,
 * revenue, licenses, users and the latest audit events across every tenant.
 * It spans all tenants, so its route is for platform operators only.
 *
 * Request traffic isn't recorded anywhere it could be summed, so the
 * dashboard reports none rather than inventing figures.
 */

import { prisma } from '../../config/database.js';

const DAY_MS = 86_400_000;
const EXPIRING_WITHIN_DAYS = 30;
const GROWTH_MONTHS = 6;
const ACTIVITY_LIMIT = 8;
const ALERT_ACTION = /fail|denied|reject|suspend|delete|breach|revoke/i;

export interface PlatformDashboard {
  tenants: { total: number; active: number; trial: number; churned: number };
  revenue: { mrr: number; arr: number; avgPerTenant: number };
  licenses: { total: number; active: number; expiring: number; revenueAtRisk: number };
  users: { total: number };
  /** New tenants per calendar month (UTC), oldest first, current month last. */
  tenantGrowth: Array<{ month: string; count: number }>;
  /** MRR of active tenants by plan, largest first; plans without revenue are left out. */
  revenueByPlan: Array<{ plan: string; mrr: number }>;
  /**
   * Latest audit events. They are recorded per organization (the unit all app
   * data is scoped to), which the `tenants` billing registry doesn't link to,
   * so each event names its organization rather than a tenant.
   */
  recentActivity: Array<{ event: string; organization: string; time: string; isAlert: boolean }>;
  lastUpdated: string;
}

const toNumber = (value: unknown): number => Number(value ?? 0) || 0;

const monthKey = (date: Date): string =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;

/** "user.login" or "USER_LOGIN" -> "User login". */
export function describeAction(action: string): string {
  const words = action.replace(/[._:-]+/g, ' ').trim().toLowerCase();
  return words ? words[0].toUpperCase() + words.slice(1) : 'Event';
}

export async function getPlatformDashboard(now: Date = new Date()): Promise<PlatformDashboard> {
  const live = { deleted_at: null };
  const growthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (GROWTH_MONTHS - 1), 1));
  const expiringBy = new Date(now.getTime() + EXPIRING_WITHIN_DAYS * DAY_MS);

  const [tenantsByStatus, mrrByPlan, licensesByStatus, expiring, userCount, newTenants, events] =
    await Promise.all([
      prisma.tenants.groupBy({ by: ['status'], where: live, _count: { _all: true } }),
      prisma.tenants.groupBy({ by: ['plan'], where: { ...live, status: 'ACTIVE' }, _sum: { mrr: true } }),
      prisma.licenses.groupBy({ by: ['status'], where: { tenant: live }, _count: { _all: true } }),
      prisma.licenses.aggregate({
        where: { tenant: live, status: { in: ['ACTIVE', 'EXPIRING'] }, expires_at: { gte: now, lte: expiringBy } },
        _count: { _all: true },
        _sum: { revenue: true },
      }),
      prisma.users.count({ where: { deleted_at: null } }),
      prisma.tenants.findMany({ where: { ...live, created_at: { gte: growthStart } }, select: { created_at: true } }),
      prisma.audit_logs.findMany({
        orderBy: { created_at: 'desc' },
        take: ACTIVITY_LIMIT,
        select: { action: true, created_at: true, organizations: { select: { name: true } } },
      }),
    ]);

  const tenants = (status: string) => tenantsByStatus.find((row) => row.status === status)?._count._all ?? 0;
  const active = tenants('ACTIVE');
  const mrr = mrrByPlan.reduce((sum, row) => sum + toNumber(row._sum.mrr), 0);

  const growth = new Map<string, number>();
  for (let i = 0; i < GROWTH_MONTHS; i++) {
    growth.set(monthKey(new Date(Date.UTC(growthStart.getUTCFullYear(), growthStart.getUTCMonth() + i, 1))), 0);
  }
  for (const { created_at } of newTenants) {
    const key = monthKey(created_at);
    if (growth.has(key)) {
      growth.set(key, (growth.get(key) ?? 0) + 1);
    }
  }

  return {
    tenants: {
      total: tenantsByStatus.reduce((sum, row) => sum + row._count._all, 0),
      active,
      trial: tenants('TRIAL'),
      churned: tenants('CHURNED'),
    },
    revenue: { mrr, arr: mrr * 12, avgPerTenant: active ? Math.round(mrr / active) : 0 },
    licenses: {
      total: licensesByStatus.reduce((sum, row) => sum + row._count._all, 0),
      active: licensesByStatus.find((row) => row.status === 'ACTIVE')?._count._all ?? 0,
      expiring: expiring._count._all,
      revenueAtRisk: toNumber(expiring._sum.revenue),
    },
    users: { total: userCount },
    tenantGrowth: [...growth].map(([month, count]) => ({ month, count })),
    revenueByPlan: mrrByPlan
      .map((row) => ({ plan: String(row.plan), mrr: toNumber(row._sum.mrr) }))
      .filter((row) => row.mrr > 0)
      .sort((a, b) => b.mrr - a.mrr),
    recentActivity: events.map((event) => ({
      event: describeAction(event.action),
      organization: event.organizations?.name ?? '',
      time: event.created_at.toISOString(),
      isAlert: ALERT_ACTION.test(event.action),
    })),
    lastUpdated: now.toISOString(),
  };
}
