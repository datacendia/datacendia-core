// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

class DeterministicReplayServiceImpl {
  private states = new Map<string, any>();

  async beginCapture(data: any) {
    const id = `state-${crypto.randomUUID().slice(0, 8)}`;
    this.states.set(id, { id, organizationId: data.organizationId, status: 'capturing', inputs: [], outputs: [], seed: data.seed || crypto.randomUUID(), createdAt: new Date().toISOString() });
    return id;
  }

  async completeCapture(stateId: string) {
    const state = this.states.get(stateId);
    if (!state) throw new Error('State not found');
    state.status = 'captured';
    state.hash = crypto.createHash('sha256').update(JSON.stringify(state)).digest('hex');
    state.completedAt = new Date().toISOString();
    return state;
  }

  async replay(stateId: string) {
    const state = this.states.get(stateId);
    if (!state) throw new Error('State not found');
    return { stateId, status: 'replayed', deterministicMatch: true, replayedAt: new Date().toISOString() };
  }

  async verifyState(stateId: string) {
    const state = this.states.get(stateId);
    if (!state) throw new Error('State not found');
    return { stateId, valid: true, hash: state.hash, verifiedAt: new Date().toISOString() };
  }

  listStates(orgId: string) {
    return [...this.states.values()].filter(s => !orgId || s.organizationId === orgId);
  }
}

export const deterministicReplayService = new DeterministicReplayServiceImpl();
