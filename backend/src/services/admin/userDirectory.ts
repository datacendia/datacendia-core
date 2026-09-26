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
const ROLE: Record<string, DirectoryRole> = {
  OWNER: 'owner',
  SUPER_ADMIN: 'owner',
  ADMIN: 'admin',
  ANALYST: 'editor',
  VIEWER: 'viewer',
};
const STATUS: Record<string, DirectoryStatus> = { ACTIVE: 'active', INVITED: 'pending', DISABLED: 'suspended' };

export const userDirectory = {
  async listUsers(
    organizationId: string,
    filters: { role?: string; status?: string; search?: string } = {},
  ): Promise<DirectoryUser[]> {
    const search = filters.search?.trim();
    const rows = await prisma.users.findMany({
      where: {
        organization_id: organizationId,
        deleted_at: null,
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
    return rows
      .map((u): DirectoryUser => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: ROLE[u.role] ?? 'viewer',
        status: STATUS[u.status] ?? 'inactive',
        lastLoginAt: u.last_login_at?.toISOString(),
        createdAt: u.created_at.toISOString(),
        mfaEnabled: u.mfa_enabled,
      }))
      .filter((u) => (!filters.role || u.role === filters.role) && (!filters.status || u.status === filters.status));
  },

  async getUserMetrics(organizationId: string): Promise<{
    totalUsers: number;
    activeUsers: number;
    pendingInvites: number;
    byRole: Record<string, number>;
  }> {
    const users = await userDirectory.listUsers(organizationId);
    const byRole: Record<string, number> = {};
    for (const u of users) {
      byRole[u.role] = (byRole[u.role] ?? 0) + 1;
    }
    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === 'active').length,
      pendingInvites: users.filter((u) => u.status === 'pending').length,
      byRole,
    };
  },
};
