// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPick } from '../../utils/deterministic.js';

class CanaryTripwireServiceImpl {
  private canaries = new Map<string, any>();
  private alerts: any[] = [];

  async deployCanary(data: any) {
    const canary = { id: `canary-${crypto.randomUUID().slice(0, 8)}`, organizationId: data.organizationId, type: data.type || 'document', location: data.location || 'default', status: 'active', deployedAt: new Date().toISOString() };
    this.canaries.set(canary.id, canary);
    return canary;
  }

  async deployCanaryNetwork(data: any) {
    const types = ['document', 'api-key', 'database-record', 'dns-entry', 'email'];
    const canaries = await Promise.all(types.map(type => this.deployCanary({ ...data, type })));
    return canaries;
  }

  listCanaries(orgId: string) { return [...this.canaries.values()].filter(c => !orgId || c.organizationId === orgId); }

  listAlerts(orgId: string) { return this.alerts.filter(a => !orgId || a.organizationId === orgId); }

  getDeploymentStatus(orgId: string) {
    const canaries = this.listCanaries(orgId);
    return { total: canaries.length, active: canaries.filter(c => c.status === 'active').length, triggered: this.alerts.filter(a => a.organizationId === orgId).length };
  }

  async reportTrigger(data: any) {
    const alert = { id: `alert-${crypto.randomUUID().slice(0, 8)}`, canaryId: data.canaryId, organizationId: data.organizationId, sourceIp: data.sourceIp || 'unknown', action: data.action || 'access', severity: deterministicPick(['low', 'medium', 'high', 'critical'], `trigger-${data.canaryId}`), triggeredAt: new Date().toISOString() };
    this.alerts.push(alert);
    const canary = this.canaries.get(data.canaryId);
    if (canary) canary.status = 'triggered';
    return alert;
  }
}

export const canaryTripwireService = new CanaryTripwireServiceImpl();
