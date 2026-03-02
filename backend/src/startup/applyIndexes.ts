// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - AUTO-APPLY DATABASE INDEXES
 *
 * Runs on server startup after PostgreSQL connects.
 * Uses CREATE INDEX IF NOT EXISTS so it's safe to run repeatedly.
 * Idempotent — no-op if indexes already exist.
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { getErrorMessage, getErrorCode } from '../utils/errors.js';

const PERFORMANCE_INDEXES = [
  // Decisions table - Most queried table
  'CREATE INDEX IF NOT EXISTS idx_decisions_org_status ON decisions(organization_id, status)',
  'CREATE INDEX IF NOT EXISTS idx_decisions_created_desc ON decisions(created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_decisions_user ON decisions(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_decisions_type ON decisions(decision_type)',

  // Deliberations table - High-frequency queries
  'CREATE INDEX IF NOT EXISTS idx_deliberations_org_status ON deliberations(organization_id, status)',
  'CREATE INDEX IF NOT EXISTS idx_deliberations_created_desc ON deliberations(created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_deliberations_decision ON deliberations(decision_id)',

  // Alerts table - Real-time queries
  'CREATE INDEX IF NOT EXISTS idx_alerts_org_status ON alerts(organization_id, status)',
  'CREATE INDEX IF NOT EXISTS idx_alerts_created_desc ON alerts(created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity)',
  'CREATE INDEX IF NOT EXISTS idx_alerts_user_unread ON alerts(user_id, read) WHERE read = false',

  // Users table - Authentication and authorization
  'CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id)',
  'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
  'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',

  // Agents table - Council operations
  'CREATE INDEX IF NOT EXISTS idx_agents_org ON agents(organization_id)',
  'CREATE INDEX IF NOT EXISTS idx_agents_type ON agents(agent_type)',
  'CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(is_active) WHERE is_active = true',

  // Data sources table - Integration queries
  'CREATE INDEX IF NOT EXISTS idx_data_sources_org_type ON data_sources(organization_id, source_type)',
  'CREATE INDEX IF NOT EXISTS idx_data_sources_active ON data_sources(is_active) WHERE is_active = true',

  // Workflows table - Automation queries
  'CREATE INDEX IF NOT EXISTS idx_workflows_org_status ON workflows(organization_id, status)',
  'CREATE INDEX IF NOT EXISTS idx_workflows_trigger ON workflows(trigger_type)',

  // Audit logs - Compliance queries
  'CREATE INDEX IF NOT EXISTS idx_audit_logs_org_created ON audit_logs(organization_id, created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)',

  // Decision packets - Evidence retrieval
  'CREATE INDEX IF NOT EXISTS idx_decision_packets_deliberation ON decision_packets(deliberation_id)',
  'CREATE INDEX IF NOT EXISTS idx_decision_packets_signed_at ON decision_packets(signed_at DESC)',

  // Composite indexes for common JOIN patterns
  'CREATE INDEX IF NOT EXISTS idx_decisions_org_created ON decisions(organization_id, created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_deliberations_org_created ON deliberations(organization_id, created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_alerts_org_created ON alerts(organization_id, created_at DESC)',

  // Partial indexes for performance on filtered queries
  'CREATE INDEX IF NOT EXISTS idx_decisions_pending ON decisions(organization_id, status) WHERE status = \'pending\'',
  'CREATE INDEX IF NOT EXISTS idx_decisions_approved ON decisions(organization_id, status) WHERE status = \'approved\'',
  // Fixed: Use correct enum values (IN_PROGRESS, PENDING) instead of invalid 'active'
  'CREATE INDEX IF NOT EXISTS idx_deliberations_active ON deliberations(organization_id, status) WHERE status IN (\'IN_PROGRESS\', \'PENDING\')',

  // Notifications - User inbox queries
  'CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read) WHERE read = false',
  'CREATE INDEX IF NOT EXISTS idx_notifications_org_created ON notifications(organization_id, created_at DESC)',

  // Sessions - Token lookup
  // Fixed: Column is refresh_token_hash, not token
  'CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token_hash)',
  'CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)',
  // Fixed: Use IMMUTABLE expression instead of NOW() for partial index
  'CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)',

  // Team members - Role lookup (replaces non-existent organization_members)
  'CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id)',
];

export async function applyPerformanceIndexes(prisma: PrismaClient): Promise<void> {
  const startTime = Date.now();
  let applied = 0;
  let skipped = 0;
  let failed = 0;

  logger.info('[Indexes] Applying performance indexes...');

  for (const sql of PERFORMANCE_INDEXES) {
    try {
      await prisma.$executeRawUnsafe(sql);
      applied++;
    } catch (error: unknown) {
      // 42P07 = relation already exists, 42P01 = table doesn't exist
      const code = getErrorCode(error);
      if (code === '42P07') {
        skipped++;
      } else if (code === '42P01' || getErrorMessage(error)?.includes('does not exist')) {
        // Table doesn't exist yet (migrations haven't run) — skip silently
        skipped++;
      } else {
        failed++;
        logger.warn(`[Indexes] Failed to apply index: ${sql.substring(0, 80)}...`, getErrorMessage(error));
      }
    }
  }

  const duration = Date.now() - startTime;
  logger.info(
    `[Indexes] Complete in ${duration}ms: ${applied} applied, ${skipped} skipped, ${failed} failed (${PERFORMANCE_INDEXES.length} total)`
  );
}
