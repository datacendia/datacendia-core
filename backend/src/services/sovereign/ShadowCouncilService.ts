// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { BoundedMap } from '../../utils/BoundedMap.js';
import { deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';

class ShadowCouncilServiceImpl {
  private sessions = new BoundedMap<string, any>({ maxSize: 5000 });

  async createSession(data: any) {
    const session = { id: `shadow-${crypto.randomUUID().slice(0, 8)}`, organizationId: data.organizationId, createdBy: data.createdBy, name: data.name || 'Shadow Session', status: 'active', deliberations: [], createdAt: new Date().toISOString() };
    this.sessions.set(session.id, session);
    return session;
  }

  listSessions(orgId: string, userId?: string) {
    return [...this.sessions.values()].filter(s => !orgId || s.organizationId === orgId);
  }

  getSession(id: string) { return this.sessions.get(id) || null; }

  async startDeliberation(data: any) {
    const session = this.sessions.get(data.sessionId);
    if (!session) throw new Error('Session not found');
    const seed = `delib-${data.sessionId}-${Date.now()}`;
    const delib = { id: `sd-${crypto.randomUUID().slice(0, 8)}`, sessionId: data.sessionId, topic: data.topic || 'Untitled', consensus: deterministicPercentage(65, 20, seed), recommendation: deterministicPick(['approve', 'reject', 'defer', 'modify'], seed), createdAt: new Date().toISOString() };
    session.deliberations.push(delib);
    return delib;
  }

  async closeSession(id: string) {
    const session = this.sessions.get(id);
    if (!session) throw new Error('Session not found');
    session.status = 'closed';
  }

  async compareToOfficial(shadowId: string, officialId: string) {
    const seed = `compare-${shadowId}-${officialId}`;
    return { shadowId, officialId, alignment: deterministicPercentage(72, 18, seed), divergences: [], comparedAt: new Date().toISOString() };
  }
}

export const shadowCouncilService = new ShadowCouncilServiceImpl();
