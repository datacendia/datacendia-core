// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// Community stub — enterprise implementation in datacendia-components

import { EventEmitter } from 'events';

class DruidEventStreamService extends EventEmitter {
  startFlushScheduler(_intervalMs: number): void {}
  async getTimeline(_opts?: any): Promise<any[]> { return []; }
  async getStats(): Promise<any> { return { totalEvents: 0 }; }
  async backfill(_opts?: any): Promise<any> { return { backfilled: 0 }; }
  async emitEvent(_event: any): Promise<void> {}
  async logDecision(_data: any): Promise<void> {}
  async logAudit(_data: any): Promise<void> {}
}

export const druidEventStream = new DruidEventStreamService();
