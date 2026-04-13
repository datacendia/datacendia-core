// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

type TenantPlan = 'pilot' | 'professional' | 'enterprise' | 'sovereign';
type TenantStatus = 'active' | 'suspended' | 'trial' | 'archived';

interface Tenant {
  id: string; name: string; slug: string; plan: TenantPlan; status: TenantStatus;
  settings?: any; metadata?: any; suspendReason?: string;
  userCount?: number; userLimit?: number; mrr?: number;
  createdAt: string; updatedAt: string;
}

class TenantServiceImpl {
  private tenants = new Map<string, Tenant>();

  constructor() {
    const demo: Tenant = { id: 'org-demo', name: 'Demo Organization', slug: 'demo', plan: 'enterprise', status: 'active', settings: { maxUsers: 50, maxAgents: 20 }, metadata: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.tenants.set(demo.id, demo);
  }

  async getTenant(id: string): Promise<Tenant | null> { return this.tenants.get(id) ?? null; }

  async listTenants(filters?: { status?: TenantStatus; plan?: TenantPlan; search?: string }): Promise<Tenant[]> {
    let list = [...this.tenants.values()];
    if (filters?.status) list = list.filter(t => t.status === filters.status);
    if (filters?.plan) list = list.filter(t => t.plan === filters.plan);
    if (filters?.search) { const s = filters.search.toLowerCase(); list = list.filter(t => t.name.toLowerCase().includes(s) || t.slug.toLowerCase().includes(s)); }
    return list;
  }

  async createTenant(params: { name: string; slug: string; plan?: TenantPlan; metadata?: any }): Promise<Tenant> {
    const now = new Date().toISOString();
    const tenant: Tenant = { id: crypto.randomUUID(), name: params.name, slug: params.slug, plan: params.plan || 'pilot', status: 'active', metadata: params.metadata || {}, createdAt: now, updatedAt: now };
    this.tenants.set(tenant.id, tenant);
    return tenant;
  }

  async updateTenant(id: string, updates: Partial<Pick<Tenant, 'name' | 'settings' | 'metadata'>>): Promise<Tenant | null> {
    const t = this.tenants.get(id);
    if (!t) return null;
    Object.assign(t, updates, { updatedAt: new Date().toISOString() });
    return t;
  }

  async upgradePlan(id: string, plan: TenantPlan): Promise<Tenant | null> {
    const t = this.tenants.get(id);
    if (!t) return null;
    t.plan = plan; t.updatedAt = new Date().toISOString();
    return t;
  }

  async suspendTenant(id: string, reason: string): Promise<Tenant | null> {
    const t = this.tenants.get(id);
    if (!t) return null;
    t.status = 'suspended'; t.suspendReason = reason; t.updatedAt = new Date().toISOString();
    return t;
  }

  async getMetrics() {
    const all = [...this.tenants.values()];
    return { total: all.length, active: all.filter(t => t.status === 'active').length, suspended: all.filter(t => t.status === 'suspended').length, byPlan: { pilot: all.filter(t => t.plan === 'pilot').length, professional: all.filter(t => t.plan === 'professional').length, enterprise: all.filter(t => t.plan === 'enterprise').length, sovereign: all.filter(t => t.plan === 'sovereign').length } };
  }
}

export const tenantService = new TenantServiceImpl();
