// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { logger } from '../../utils/logger.js';

export const databaseBackupService = {
  isEnabled(): boolean {
    return !!process.env.BACKUP_ENABLED && process.env.BACKUP_ENABLED === 'true';
  },
  startScheduler(): void {
    logger.info('[CendiaBackup] Backup scheduler stub (no-op)');
  },
  stopScheduler(): void {
    logger.info('[CendiaBackup] Backup scheduler stopped (no-op)');
  },
};
