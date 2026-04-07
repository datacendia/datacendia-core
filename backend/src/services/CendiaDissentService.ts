// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CENDIA DISSENT SERVICE (Community Edition)
// Tracks and manages formal dissents during deliberations.
// =============================================================================

import crypto from 'crypto';
import { withFallback } from './_serviceProxy.js';

export interface DissentResponse {
  id: string;
  deliberationId: string;
  agentId: string;
  content: string;
  severity: string;
  timestamp: string;
  resolved: boolean;
  responderId?: string;
  responderName?: string;
  responderRole?: string;
  responseType?: string;
  reasoning?: string;
  mitigatingActions?: string[];
  ledgerHash?: string;
}
export class Dissent { [key: string]: any; }
export class DissenterProfile { [key: string]: any; }
export class OrganizationDissentMetrics { [key: string]: any; }

const store = new Map<string, DissentResponse>();

export const dissentService: any = withFallback({
  async create(data: { deliberationId: string; agentId: string; content: string; severity?: string }): Promise<DissentResponse> {
    const dissent: DissentResponse = {
      id: crypto.randomUUID(),
      deliberationId: data.deliberationId,
      agentId: data.agentId,
      content: data.content,
      severity: data.severity || 'medium',
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    store.set(dissent.id, dissent);
    return dissent;
  },

  async getByDeliberation(deliberationId: string): Promise<DissentResponse[]> {
    return [...store.values()].filter(d => d.deliberationId === deliberationId);
  },

  async resolve(id: string): Promise<DissentResponse | null> {
    const d = store.get(id);
    if (!d) return null;
    d.resolved = true;
    return d;
  },

  async getMetrics(_orgId: string): Promise<OrganizationDissentMetrics> {
    const all = [...store.values()];
    return {
      total: all.length,
      resolved: all.filter(d => d.resolved).length,
      unresolved: all.filter(d => !d.resolved).length,
      bySeverity: { high: all.filter(d => d.severity === 'high').length, medium: all.filter(d => d.severity === 'medium').length, low: all.filter(d => d.severity === 'low').length },
    } as any;
  },
});
