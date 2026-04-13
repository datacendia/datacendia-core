// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPick, deterministicInt, deterministicPercentage } from '../../utils/deterministic.js';

interface DiodeSource { id: string; name: string; type: string; direction: string; status: string; registeredAt: string; }
interface DiodeEvent { id: string; sourceId: string; data: any; timestamp: string; accepted: boolean; }

class DataDiodeServiceImpl {
  private sources = new Map<string, DiodeSource>();
  private events: DiodeEvent[] = [];
  private stats = { totalIngested: 0, totalRejected: 0 };

  async registerSource(data: any): Promise<DiodeSource> {
    const src: DiodeSource = {
      id: `diode-${crypto.randomUUID().slice(0, 8)}`, name: data.name || 'source',
      type: data.type || 'telemetry', direction: 'inbound', status: 'active',
      registeredAt: new Date().toISOString(),
    };
    this.sources.set(src.id, src);
    return src;
  }

  getSources(): DiodeSource[] { return [...this.sources.values()]; }

  getRecentEvents(limit: number): DiodeEvent[] { return this.events.slice(-limit); }

  getStatistics() { return { ...this.stats, sourcesCount: this.sources.size, eventsStored: this.events.length }; }
}

export const dataDiodeService = new DataDiodeServiceImpl();
