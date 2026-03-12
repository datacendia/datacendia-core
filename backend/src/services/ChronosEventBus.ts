// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { logger } from '../utils/logger.js';

export const chronosEventBus = {
  startFlushScheduler(intervalMs: number): void {
    logger.info(`[Chronos] Event bus flush scheduler stub (interval: ${intervalMs}ms)`);
  },
};
