// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Service — User Directory
 *
 * The organization's people, as Settings > Users shows them, read from the
 * users table. The route used to call a stub that resolved null, so it threw on
 * `users.length` and the page showed an empty table. This is the read path;
 * inviting and editing users stay with the full platform.
 *
 * @module services/admin/userDirectory
 */

import type { UserRole, UserStatus } from '@prisma/client';
import { prisma } from '../../config/database.js';

export type DirectoryRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type DirectoryStatus = 'active' | 'pending' | 'suspended' | 'inactive';

export interface DirectoryUser {
  id: string;
  email: string;
  name: string;
  role: DirectoryRole;
  status: DirectoryStatus;
  lastLoginAt?: string;
  createdAt: string;
  mfaEnabled: boolean;
}

// The settings UI has four roles and four statuses; the schema's enums differ.
const ROLE: Record<UserRole, DirectoryRole> = {
  OWNER: 'owner',
  SUPER_ADMIN: 'owner',
  ADMIN: 'admin',
  ANALYST: 'editor',
  VIEWER: 'viewer',
};
const STATUS: Record<UserStatus, DirectoryStatus> = { ACTIVE: 'active', INVITED: 'pending', DISABLED: 'suspended' };

// The schema values behind each UI value, for filtering in the query.
const rolesFor = (role: string): UserRole[] =>
  (Object.keys(ROLE) as UserRole[]).filter((r) => ROLE[r] === role);
const statusesFor = (status: string): UserStatus[] =>
  (Object.keys(STATUS) as UserStatus[]).filter((s) => STATUS[s] === status);

// Filters come from the query string, where a repeated parameter is an array:
// only a non-empty plain string filters.
const asFilter = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;

export const userDirectory = {
  async listUsers(
    organizationId: string,
    filters: { role?: unknown; status?: unknown; search?: unknown } = {},
  ): Promise<DirectoryUser[]> {
    const role = asFilter(filters.role);
    const status = asFilter(filters.status);
    const search = asFilter(filters.search);
    const rows = await prisma.users.findMany({
      where: {
        organization_id: organizationId,
        deleted_at: null,
        ...(role ? { role: { in: rolesFor(role) } } : {}),
        ...(status ? { status: { in: statusesFor(status) } } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      orderBy: { created_at: 'desc' },
      select: {
        id: true, email: true, name: true, role: true, status: true,
        last_login_at: true, created_at: true, mfa_enabled: true,
      },
    });
    return rows.map((u): DirectoryUser => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: ROLE[u.role] ?? 'viewer',
      status: STATUS[u.status] ?? 'inactive',
      lastLoginAt: u.last_login_at?.toISOString(),
      createdAt: u.created_at.toISOString(),
      mfaEnabled: u.mfa_enabled,
    }));
  },

  async getUserMetrics(organizationId: string): Promise<{
    totalUsers: number;
    activeUsers: number;
    pendingInvites: number;
    byRole: Record<string, number>;
  }> {
    const groups = await prisma.users.groupBy({
      by: ['role', 'status'],
      where: { organization_id: organizationId, deleted_at: null },
      _count: { _all: true },
    });
    const metrics = { totalUsers: 0, activeUsers: 0, pendingInvites: 0, byRole: {} as Record<string, number> };
    for (const g of groups) {
      const n = g._count._all;
      const role = ROLE[g.role] ?? 'viewer';
      metrics.totalUsers += n;
      metrics.byRole[role] = (metrics.byRole[role] ?? 0) + n;
      if (g.status === 'ACTIVE') {
        metrics.activeUsers += n;
      }
      if (g.status === 'INVITED') {
        metrics.pendingInvites += n;
      }
    }
    return metrics;
  },
};
