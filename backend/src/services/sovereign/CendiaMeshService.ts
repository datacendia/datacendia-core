// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPick } from '../../utils/deterministic.js';

class CendiaMeshServiceImpl {
  private nodes = new Map<string, any>();
  private connections: any[] = [];
  private channels: any[] = [];
  private events: any[] = [];
  private policies: any[] = [];

  async getDashboard(orgId: string) {
    return { organizationId: orgId, nodes: this.getNodesForOrg(orgId).length, connections: this.connections.filter(c => c.organizationId === orgId).length, channels: this.channels.filter(c => c.organizationId === orgId).length };
  }

  async getTopology(orgId: string) {
    return { organizationId: orgId, nodes: this.getNodesForOrg(orgId), connections: this.connections.filter(c => c.organizationId === orgId) };
  }

  getNodesForOrg(orgId: string) { return [...this.nodes.values()].filter(n => n.organizationId === orgId); }
  getNode(id: string) { return this.nodes.get(id) || null; }
  getConnections(orgId: string) { return this.connections.filter(c => c.organizationId === orgId); }
  getActiveChannels(orgId: string) { return this.channels.filter(c => c.organizationId === orgId && c.status === 'active'); }
  getEvents(orgId: string, limit: number) { return this.events.filter(e => e.organizationId === orgId).slice(-limit); }
  getPolicies(orgId: string) { return this.policies.filter(p => p.organizationId === orgId); }
}

export const cendiaMeshService = new CendiaMeshServiceImpl();
