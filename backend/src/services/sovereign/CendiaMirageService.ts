// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPick, deterministicPercentage } from '../../utils/deterministic.js';

class CendiaMirageServiceImpl {
  private honeytokens = new Map<string, any>();
  private canaries = new Map<string, any>();
  private sandboxes = new Map<string, any>();

  async getDashboard(orgId: string) {
    return { organizationId: orgId, honeytokens: this.getHoneytokens(orgId).length, canaries: this.getCanaries(orgId).length, triggered: this.getTriggeredHoneytokens(orgId).length, sandboxes: this.getSandboxes(orgId).length };
  }

  getHoneytokens(orgId: string) { return [...this.honeytokens.values()].filter(h => h.organizationId === orgId); }

  getTriggeredHoneytokens(orgId: string) { return this.getHoneytokens(orgId).filter(h => h.triggered); }

  getCanaries(orgId: string) { return [...this.canaries.values()].filter(c => c.organizationId === orgId); }

  getCanaryAlerts(orgId: string) { return this.getCanaries(orgId).filter(c => c.alertTriggered); }

  getSandboxes(orgId: string) { return [...this.sandboxes.values()].filter(s => s.organizationId === orgId); }

  async getThreatIntelligence(orgId: string) {
    const seed = `intel-${orgId}`;
    return { organizationId: orgId, threatLevel: deterministicPick(['low', 'medium', 'elevated', 'high'], seed), activeHoneytokens: this.getHoneytokens(orgId).length, recentTriggers: this.getTriggeredHoneytokens(orgId).length, lastUpdated: new Date().toISOString() };
  }
}

export const cendiaMirageService = new CendiaMirageServiceImpl();
