// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

class RDPServiceImpl {
  private packages = new Map<string, any>();
  private instances = new Map<string, any>();

  async buildPackage(orgId: string, name: string, type: string, options?: any) {
    const id = `pkg-${crypto.randomUUID().slice(0, 8)}`;
    const pkg = { id, organizationId: orgId, name, type, options: options || {}, status: 'built', size: '124MB', createdAt: new Date().toISOString() };
    this.packages.set(id, pkg);
    return pkg;
  }

  getPackage(id: string) { return this.packages.get(id) || null; }

  async deploy(packageId: string, targetEndpoint?: string) {
    const pkg = this.packages.get(packageId);
    if (!pkg) throw new Error('Package not found');
    const id = `inst-${crypto.randomUUID().slice(0, 8)}`;
    const instance = { id, packageId, endpoint: targetEndpoint || 'localhost:8080', status: 'running', deployedAt: new Date().toISOString() };
    this.instances.set(id, instance);
    return instance;
  }

  getInstance(id: string) { return this.instances.get(id) || null; }

  async checkInstanceHealth(id: string) {
    const inst = this.instances.get(id);
    if (!inst) throw new Error('Instance not found');
    return { instanceId: id, healthy: true, uptime: Date.now() - new Date(inst.deployedAt).getTime(), checkedAt: new Date().toISOString() };
  }

  async exportForAirGap(packageId: string) {
    const pkg = this.packages.get(packageId);
    if (!pkg) throw new Error('Package not found');
    return { packageId, format: 'tar.gz', checksum: crypto.createHash('md5').update(packageId).digest('hex'), exportedAt: new Date().toISOString() };
  }

  getMetrics() { return { totalPackages: this.packages.size, totalInstances: this.instances.size, activeInstances: [...this.instances.values()].filter(i => i.status === 'running').length }; }
}

export const rdpService = new RDPServiceImpl();
