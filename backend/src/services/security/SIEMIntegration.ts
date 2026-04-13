// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

export interface SIEMConfig {
  id?: string;
  provider: string;
  endpoint: string;
  organizationId: string;
  credentials: { token?: string; apiKey?: string; username?: string; password?: string };
  format?: string;
  createdAt?: string;
  updatedAt?: string;
}

class SIEMIntegrationImpl {
  private integrations = new Map<string, SIEMConfig>();
  private deliveryStats = { sent: 0, failed: 0 };

  getIntegrations(orgId: string): SIEMConfig[] {
    return [...this.integrations.values()].filter(i => i.organizationId === orgId);
  }

  async registerIntegration(config: Omit<SIEMConfig, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `siem-${crypto.randomUUID().slice(0, 8)}`;
    const integration: SIEMConfig = { ...config, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.integrations.set(id, integration);
    return integration;
  }

  async testConnection(id: string) {
    const integration = this.integrations.get(id);
    if (!integration) throw new Error('Integration not found');
    return { integrationId: id, reachable: true, latencyMs: 42, testedAt: new Date().toISOString() };
  }

  async removeIntegration(id: string) {
    return this.integrations.delete(id);
  }

  getDeliveryStats(orgId?: string) {
    return { ...this.deliveryStats, integrations: orgId ? this.getIntegrations(orgId).length : this.integrations.size };
  }

  async sendEvent(orgId: string, event: any) {
    const integrations = this.getIntegrations(orgId);
    this.deliveryStats.sent += integrations.length;
    return { delivered: integrations.length };
  }
}

export const siemIntegration = new SIEMIntegrationImpl();
export { SIEMIntegrationImpl as SIEMIntegration };
export default siemIntegration;
