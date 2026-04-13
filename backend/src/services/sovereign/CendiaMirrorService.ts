// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';

class CendiaMirrorServiceImpl {
  private twins = new Map<string, any>();
  private scenarios = new Map<string, any>();

  async getDashboard(orgId: string) {
    const twins = this.getTwinsForOrg(orgId);
    return { organizationId: orgId, totalTwins: twins.length, activeTwins: twins.filter((t: any) => t.status === 'active').length, scenarios: this.scenarios.size };
  }

  getTwinsForOrg(orgId: string) { return [...this.twins.values()].filter(t => t.organizationId === orgId); }

  getTwin(id: string) { return this.twins.get(id) || null; }

  async syncTwin(id: string, state: any) {
    const twin = this.twins.get(id);
    if (!twin) return null;
    twin.state = state;
    twin.lastSyncedAt = new Date().toISOString();
    twin.snapshots = twin.snapshots || [];
    twin.snapshots.push({ id: `snap-${crypto.randomUUID().slice(0, 8)}`, state, timestamp: new Date().toISOString() });
    return twin;
  }

  async getSnapshots(twinId: string, limit: number) {
    const twin = this.twins.get(twinId);
    return (twin?.snapshots || []).slice(-limit);
  }

  async createScenario(data: any) {
    const id = `scenario-${crypto.randomUUID().slice(0, 8)}`;
    const scenario = { id, name: data.name || 'What-If Scenario', twinIds: data.twinIds || [], parameters: data.parameters || {}, status: 'created', createdAt: new Date().toISOString() };
    this.scenarios.set(id, scenario);
    return scenario;
  }

  async runSimulation(scenarioId: string) {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) throw new Error('Scenario not found');
    const seed = `sim-${scenarioId}`;
    scenario.status = 'completed';
    return { scenarioId, outcome: deterministicPick(['positive', 'neutral', 'negative', 'mixed'], seed), confidence: deterministicPercentage(75, 15, seed), completedAt: new Date().toISOString() };
  }
}

export const cendiaMirrorService = new CendiaMirrorServiceImpl();
