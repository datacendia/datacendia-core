// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Data Subject Rights Service
 *
 * Implements GDPR Articles 15-22 and CCPA consumer rights:
 *   - Art. 15 / CCPA: Right of Access (DSAR)
 *   - Art. 17 / CCPA: Right to Erasure ("Right to be Forgotten")
 *   - Art. 18      : Right to Restriction of Processing
 *   - Art. 20      : Right to Data Portability
 *
 * All requests are logged to audit_logs for regulatory evidence.
 * Erasure performs a GDPR-compliant soft-then-hard delete:
 *   1. Immediately nullifies/pseudonymises personal data fields
 *   2. Sets deleted_at timestamp (logical delete)
 *   3. Hard purge is handled by RetentionService after 30-day grace period
 */

import { prisma } from '../../config/database.js';
import type { Prisma } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import crypto from 'crypto';

export interface DSARReport {
  generatedAt: string;
  requestedBy: string;
  legalBasis: string;
  profile: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    createdAt: string;
    lastLoginAt: string | null;
    emailVerified: boolean;
    mfaEnabled: boolean;
    preferences: unknown;
    notificationPreferences: unknown;
    languagePreferences: unknown;
  };
  organization: {
    id: string;
    name: string;
    industry: string | null;
  } | null;
  sessions: Array<{ id: string; createdAt: string; expiresAt: string; ipAddress: string | null; userAgent: string | null }>;
  auditLog: Array<{ id: string; action: string; resourceType: string; createdAt: string; ipAddress: string | null }>;
  apiKeys: Array<{ id: string; name: string; createdAt: string; lastUsedAt: string | null; expiresAt: string | null }>;
  deliberationsParticipated: Array<{ id: string; title: string; createdAt: string; status: string }>;
  teams: Array<{ teamId: string; teamName: string; role: string }>;
  dataRetentionPolicy: string;
  rightsToBeForgotten: string;
  rightsToPortability: string;
}

export interface ErasureResult {
  userId: string;
  erasedAt: string;
  fieldsNullified: string[];
  sessionsRevoked: number;
  apiKeysRevoked: number;
  accountStatus: string;
  gracePeriodEnds: string;
  note: string;
}

export interface PortabilityExport {
  exportedAt: string;
  format: 'JSON';
  schema: string;
  data: {
    user: Record<string, unknown>;
    deliberations: unknown[];
    auditEvents: unknown[];
    preferences: unknown;
  };
}

// Pseudonymisation token for erasure — one-way, non-reversible
function pseudonymise(value: string): string {
  return `ERASED-${crypto.createHash('sha256').update(value + process.env.JWT_SECRET).digest('hex').slice(0, 12)}`;
}

export class DataSubjectRightsService {

  /**
   * Art. 15 — Right of Access (DSAR)
   * Returns a comprehensive human-readable report of all personal data held.
   */
  async generateDSAR(userId: string): Promise<DSARReport> {
    const [user, sessions, auditEvents, apiKeys, teamMemberships, langPrefs] = await Promise.all([
      prisma.users.findUnique({
        where: { id: userId },
        include: { organizations: true },
      }),
      prisma.sessions.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        take: 50,
      }),
      prisma.audit_logs.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        take: 100,
        select: { id: true, action: true, resource_type: true, created_at: true, ip_address: true },
      }),
      prisma.api_keys.findMany({
        where: { user_id: userId },
        select: { id: true, name: true, created_at: true, last_used_at: true, expires_at: true },
      }),
      prisma.team_members.findMany({
        where: { user_id: userId },
        include: { teams: { select: { id: true, name: true } } },
      }),
      prisma.user_language_preferences.findUnique({ where: { user_id: userId } }),
    ]);

    if (!user) throw new Error(`User ${userId} not found`);

    const deliberations = await prisma.deliberations.findMany({
      where: { organization_id: user.organization_id },
      select: { id: true, title: true, created_at: true, status: true },
      take: 50,
      orderBy: { created_at: 'desc' },
    });

    logger.info('[DSR] DSAR generated', { userId });

    return {
      generatedAt: new Date().toISOString(),
      requestedBy: user.email,
      legalBasis: 'GDPR Article 15 — Right of Access',
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        createdAt: user.created_at.toISOString(),
        lastLoginAt: user.last_login_at?.toISOString() ?? null,
        emailVerified: user.email_verified,
        mfaEnabled: user.mfa_enabled,
        preferences: user.preferences,
        notificationPreferences: user.notification_preferences,
        languagePreferences: langPrefs ?? null,
      },
      organization: user.organizations ? {
        id: user.organizations.id,
        name: user.organizations.name,
        industry: user.organizations.industry ?? null,
      } : null,
      sessions: sessions.map((s: typeof sessions[number]) => ({
        id: s.id,
        createdAt: s.created_at.toISOString(),
        expiresAt: s.expires_at.toISOString(),
        ipAddress: s.ip_address ?? null,
        userAgent: s.user_agent ?? null,
      })),
      auditLog: auditEvents.map((e: typeof auditEvents[number]) => ({
        id: e.id,
        action: e.action,
        resourceType: e.resource_type,
        createdAt: e.created_at.toISOString(),
        ipAddress: e.ip_address ?? null,
      })),
      apiKeys: apiKeys.map((k: typeof apiKeys[number]) => ({
        id: k.id,
        name: k.name,
        createdAt: k.created_at.toISOString(),
        lastUsedAt: k.last_used_at?.toISOString() ?? null,
        expiresAt: k.expires_at?.toISOString() ?? null,
      })),
      deliberationsParticipated: deliberations.map((d: typeof deliberations[number]) => ({
        id: d.id,
        title: d.title,
        createdAt: d.created_at.toISOString(),
        status: d.status,
      })),
      teams: teamMemberships.map((tm: typeof teamMemberships[number]) => ({
        teamId: tm.team_id,
        teamName: (tm.teams as any)?.name ?? 'Unknown',
        role: tm.role,
      })),
      dataRetentionPolicy: 'Personal data is retained for the duration of your account plus a 30-day deletion grace period. Audit logs are retained for 7 years for regulatory compliance.',
      rightsToBeForgotten: 'You may request erasure of your personal data via DELETE /api/v1/privacy/erasure. Audit logs required for legal compliance will be pseudonymised, not deleted.',
      rightsToPortability: 'You may export your data in JSON format via GET /api/v1/privacy/export.',
    };
  }

  /**
   * Art. 20 — Right to Data Portability
   * Returns a machine-readable JSON export of all user data.
   */
  async exportPortableData(userId: string): Promise<PortabilityExport> {
    const dsar = await this.generateDSAR(userId);

    logger.info('[DSR] Portability export generated', { userId });

    return {
      exportedAt: new Date().toISOString(),
      format: 'JSON',
      schema: 'https://datacendia.com/schemas/data-portability/v1',
      data: {
        user: dsar.profile as Record<string, unknown>,
        deliberations: dsar.deliberationsParticipated,
        auditEvents: dsar.auditLog,
        preferences: {
          general: dsar.profile.preferences,
          notifications: dsar.profile.notificationPreferences,
          language: dsar.profile.languagePreferences,
        },
      },
    };
  }

  /**
   * Art. 17 — Right to Erasure ("Right to be Forgotten")
   *
   * Step 1: Immediately pseudonymises personal identifiers.
   * Step 2: Revokes all active sessions and API keys.
   * Step 3: Sets deleted_at (soft delete) — hard purge after 30-day grace period.
   *
   * Audit log entries are pseudonymised (not deleted) to preserve
   * legal/regulatory evidence integrity per Art. 17(3)(b).
   */
  async eraseUser(userId: string, requestedByUserId: string): Promise<ErasureResult> {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new Error(`User ${userId} not found`);
    if (user.deleted_at) throw new Error('User data has already been erased');

    const erasedEmail = pseudonymise(user.email);
    const erasedName = 'ERASED USER';
    const gracePeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Pseudonymise personal fields
      await tx.users.update({
        where: { id: userId },
        data: {
          email: erasedEmail,
          name: erasedName,
          avatar_url: null,
          password_hash: null,
          mfa_secret: null,
          mfa_backup_codes: null,
          preferences: {},
          notification_preferences: { email: false, inApp: false, push: false, slack: false },
          status: 'DISABLED',
          deleted_at: new Date(),
        },
      });

      // 2. Revoke all active sessions
      await tx.sessions.deleteMany({ where: { user_id: userId } });

      // 3. Revoke all API keys
      await tx.api_keys.updateMany({
        where: { user_id: userId, revoked_at: null },
        data: { revoked_at: new Date() },
      });

      // 4. Nullify language preferences
      await tx.user_language_preferences.deleteMany({ where: { user_id: userId } });

      // 5. Pseudonymise audit log entries (preserve record, remove PII)
      await tx.audit_logs.updateMany({
        where: { user_id: userId },
        data: { ip_address: null, user_agent: null },
      });

      // 6. Log the erasure event itself (immutable compliance record)
      await tx.audit_logs.create({
        data: {
          id: crypto.randomUUID(),
          organization_id: user.organization_id,
          user_id: requestedByUserId,
          action: 'privacy.erasure_completed',
          resource_type: 'user',
          resource_id: userId,
          details: {
            requestedBy: requestedByUserId,
            subjectUserId: userId,
            legalBasis: 'GDPR Article 17',
            gracePeriodEnds: gracePeriodEnd.toISOString(),
          },
          created_at: new Date(),
        },
      });
    });

    logger.info('[DSR] User data erased', { userId, requestedByUserId });

    return {
      userId,
      erasedAt: new Date().toISOString(),
      fieldsNullified: ['email', 'name', 'avatar_url', 'password_hash', 'mfa_secret', 'mfa_backup_codes', 'preferences', 'ip_addresses_in_audit_log'],
      sessionsRevoked: -1, // deleted
      apiKeysRevoked: -1,  // revoked
      accountStatus: 'DISABLED',
      gracePeriodEnds: gracePeriodEnd.toISOString(),
      note: 'Audit log entries are pseudonymised and retained for 7 years for legal compliance per GDPR Art. 17(3)(b). Hard purge of remaining records will occur after the grace period.',
    };
  }

  /**
   * Art. 18 — Right to Restriction of Processing
   * Disables the account and flags it to prevent processing beyond storage.
   */
  async restrictProcessing(userId: string, reason: string): Promise<{ userId: string; restrictedAt: string; reason: string }> {
    await prisma.users.update({
      where: { id: userId },
      data: { status: 'DISABLED' },
    });

    await prisma.sessions.deleteMany({ where: { user_id: userId } });

    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: (await prisma.users.findUnique({ where: { id: userId }, select: { organization_id: true } }))!.organization_id,
        user_id: userId,
        action: 'privacy.restriction_applied',
        resource_type: 'user',
        resource_id: userId,
        details: { reason, legalBasis: 'GDPR Article 18' },
        created_at: new Date(),
      },
    });

    logger.info('[DSR] Processing restricted', { userId, reason });
    return { userId, restrictedAt: new Date().toISOString(), reason };
  }
}

export const dataSubjectRightsService = new DataSubjectRightsService();
