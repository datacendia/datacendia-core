// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { logger } from '../utils/logger.js';
import { EventEmitter } from 'events';

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

class ChronosEventBusService extends EventEmitter {
  startFlushScheduler(intervalMs: number): void {
    logger.info(`[Chronos] Event bus flush scheduler stub (interval: ${intervalMs}ms)`);
  }
  async getTimeline(_opts?: any): Promise<any> { return { events: [], total: 0 }; }
  async getStats(_orgId?: string): Promise<any> { return { totalEvents: 0, categories: {} }; }
  async backfill(_orgId?: string): Promise<any> { return { backfilled: 0 }; }
  async emitEvent(_event: any): Promise<string> { return `evt-${Date.now()}`; }
}

export const chronosEventBus = new ChronosEventBusService();
