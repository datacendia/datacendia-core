// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

type ServiceCategory = 'core' | 'intelligence' | 'security' | 'compliance' | 'operations' | 'analytics';

interface ServiceDef { id: string; name: string; category: ServiceCategory; description: string; enterprise: boolean }
interface VerticalTemplate { id: string; name: string; description: string; coreServices: string[]; recommendedServices: string[]; excludedServices: string[] }
interface OrgConfig { id: string; organizationId: string; verticalId: string; enabledServices: string[]; disabledServices: string[]; createdBy: string; createdAt: string; updatedAt: string }

const SERVICE_CATALOG: ServiceDef[] = [
  { id: 'council', name: 'AI Council', category: 'core', description: 'Multi-agent deliberation', enterprise: false },
  { id: 'express', name: 'Express Intelligence', category: 'intelligence', description: 'Quick LLM analysis', enterprise: false },
  { id: 'crucible', name: 'CendiaCrucible', category: 'security', description: 'Red-teaming & security testing', enterprise: true },
  { id: 'panopticon', name: 'CendiaPanopticon', category: 'compliance', description: 'Compliance monitoring', enterprise: true },
  { id: 'aegis', name: 'CendiaAegis', category: 'security', description: 'Threat intelligence', enterprise: true },
  { id: 'horizon', name: 'CendiaHorizon', category: 'analytics', description: 'Strategic forecasting', enterprise: true },
  { id: 'echo', name: 'CendiaEcho', category: 'analytics', description: 'Decision intelligence', enterprise: true },
  { id: 'carbon-aware', name: 'CendiaCarbonAware', category: 'operations', description: 'Carbon-aware scheduling', enterprise: true },
];

const VERTICAL_TEMPLATES: VerticalTemplate[] = [
  { id: 'legal', name: 'Legal', description: 'Law firms & legal departments', coreServices: ['council', 'express'], recommendedServices: ['panopticon', 'echo'], excludedServices: [] },
  { id: 'healthcare', name: 'Healthcare', description: 'Hospitals & health systems', coreServices: ['council', 'express'], recommendedServices: ['panopticon', 'crucible'], excludedServices: [] },
  { id: 'financial', name: 'Financial Services', description: 'Banks, funds & fintech', coreServices: ['council', 'express'], recommendedServices: ['aegis', 'panopticon', 'horizon'], excludedServices: [] },
  { id: 'insurance', name: 'Insurance', description: 'Insurance carriers & MGAs', coreServices: ['council', 'express'], recommendedServices: ['panopticon', 'horizon', 'echo'], excludedServices: [] },
  { id: 'sports', name: 'Sports', description: 'Sports organizations', coreServices: ['council', 'express'], recommendedServices: ['echo', 'horizon'], excludedServices: [] },
  { id: 'government', name: 'Government', description: 'Federal, state & local agencies', coreServices: ['council', 'express'], recommendedServices: ['crucible', 'panopticon', 'aegis'], excludedServices: [] },
];

class VerticalConfigServiceImpl {
  private orgConfigs = new Map<string, OrgConfig>();

  getServiceCatalog(): ServiceDef[] { return SERVICE_CATALOG; }
  getServiceById(id: string): ServiceDef | undefined { return SERVICE_CATALOG.find(s => s.id === id); }
  getServicesByCategory(category: ServiceCategory): ServiceDef[] { return SERVICE_CATALOG.filter(s => s.category === category); }

  getVerticalTemplates(): VerticalTemplate[] { return VERTICAL_TEMPLATES; }
  getVerticalById(id: string): VerticalTemplate | undefined { return VERTICAL_TEMPLATES.find(v => v.id === id); }
  getRecommendedServices(verticalId: string): ServiceDef[] {
    const v = this.getVerticalById(verticalId);
    if (!v) return [];
    return SERVICE_CATALOG.filter(s => v.recommendedServices.includes(s.id));
  }

  compareVerticals(id1: string, id2: string) {
    const v1 = this.getVerticalById(id1); const v2 = this.getVerticalById(id2);
    if (!v1 || !v2) return { error: 'Vertical not found' };
    const shared = v1.recommendedServices.filter(s => v2.recommendedServices.includes(s));
    const onlyV1 = v1.recommendedServices.filter(s => !v2.recommendedServices.includes(s));
    const onlyV2 = v2.recommendedServices.filter(s => !v1.recommendedServices.includes(s));
    return { vertical1: v1.name, vertical2: v2.name, sharedServices: shared, uniqueToFirst: onlyV1, uniqueToSecond: onlyV2 };
  }

  async getOrganizationConfig(organizationId: string): Promise<OrgConfig | null> { return this.orgConfigs.get(organizationId) ?? null; }

  async createOrganizationConfig(organizationId: string, verticalId: string, userId: string, _overrides?: any): Promise<OrgConfig> {
    const v = this.getVerticalById(verticalId);
    const enabled = v ? [...v.coreServices, ...v.recommendedServices] : ['council', 'express'];
    const config: OrgConfig = { id: crypto.randomUUID(), organizationId, verticalId, enabledServices: enabled, disabledServices: v?.excludedServices || [], createdBy: userId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.orgConfigs.set(organizationId, config);
    return config;
  }

  async updateOrganizationConfig(organizationId: string, updates: Partial<OrgConfig>, _userId: string): Promise<OrgConfig | null> {
    const c = this.orgConfigs.get(organizationId); if (!c) return null;
    Object.assign(c, updates, { updatedAt: new Date().toISOString() }); return c;
  }

  async switchVertical(organizationId: string, verticalId: string, userId: string, _preserveCustom?: boolean): Promise<OrgConfig | null> {
    const existing = this.orgConfigs.get(organizationId);
    if (!existing) return this.createOrganizationConfig(organizationId, verticalId, userId);
    const v = this.getVerticalById(verticalId);
    existing.verticalId = verticalId;
    existing.enabledServices = v ? [...v.coreServices, ...v.recommendedServices] : existing.enabledServices;
    existing.updatedAt = new Date().toISOString();
    return existing;
  }

  async toggleService(organizationId: string, serviceId: string, enabled: boolean, _userId: string, _reason?: string) {
    const c = this.orgConfigs.get(organizationId); if (!c) return null;
    if (enabled) { c.enabledServices = [...new Set([...c.enabledServices, serviceId])]; c.disabledServices = c.disabledServices.filter(s => s !== serviceId); }
    else { c.enabledServices = c.enabledServices.filter(s => s !== serviceId); c.disabledServices = [...new Set([...c.disabledServices, serviceId])]; }
    c.updatedAt = new Date().toISOString();
    return { serviceId, enabled, config: c };
  }

  async bulkToggleServices(organizationId: string, toggles: { serviceId: string; enabled: boolean }[], userId: string) {
    return Promise.all(toggles.map(t => this.toggleService(organizationId, t.serviceId, t.enabled, userId)));
  }

  async getEnabledServices(organizationId: string): Promise<string[]> { return this.orgConfigs.get(organizationId)?.enabledServices || ['council', 'express']; }
  async getDisabledServices(organizationId: string): Promise<string[]> { return this.orgConfigs.get(organizationId)?.disabledServices || []; }
  async isServiceEnabled(organizationId: string, serviceId: string): Promise<boolean> { return (await this.getEnabledServices(organizationId)).includes(serviceId); }
}

export const verticalConfigService = new VerticalConfigServiceImpl();
