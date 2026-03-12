// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { logger } from '../utils/logger.js';

interface ChronosEvent {
  organizationId: string;
  eventType: string;
  category: string;
  severity: string;
  title: string;
  description: string;
  actorType: string;
  resourceType: string;
  resourceId: string;
  impact: string;
  magnitude: number;
  metadata?: Record<string, unknown>;
}

const eventBuffer: ChronosEvent[] = [];

export function recordChronosEvent(event: ChronosEvent): void {
  eventBuffer.push(event);
  logger.debug(`[Chronos] Event recorded: ${event.eventType} — ${event.title}`);
}

export const chronosEventBus = {
  startFlushScheduler(intervalMs: number): void {
    logger.info(`[Chronos] Event bus flush scheduler stub (interval: ${intervalMs}ms)`);
  },
};
