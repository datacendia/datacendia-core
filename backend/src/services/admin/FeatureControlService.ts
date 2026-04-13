// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

interface Feature { id: string; name: string; type: string; category: string; enabled: boolean; visibility: string; description?: string; updatedAt: string; config?: Record<string, unknown> }
interface Agent { id: string; name: string; category: string; enabled: boolean; model?: string; temperature?: number; systemPrompt?: string; updatedAt: string }
interface Suite { id: string; name: string; enabled: boolean; features: string[]; description?: string }
interface PricingTier { id: string; name: string; price: number; features: string[]; visible: boolean; updatedAt: string }
interface RouteInfo { path: string; method: string; active: boolean }

const SEED_FEATURES: Feature[] = [
  { id: 'council', name: 'AI Council', type: 'core', category: 'deliberation', enabled: true, visibility: 'public', updatedAt: new Date().toISOString() },
  { id: 'express', name: 'Express Intelligence', type: 'core', category: 'intelligence', enabled: true, visibility: 'public', updatedAt: new Date().toISOString() },
  { id: 'crucible', name: 'CendiaCrucible', type: 'enterprise', category: 'security', enabled: true, visibility: 'public', updatedAt: new Date().toISOString() },
  { id: 'horizon', name: 'CendiaHorizon', type: 'enterprise', category: 'forecasting', enabled: true, visibility: 'public', updatedAt: new Date().toISOString() },
  { id: 'panopticon', name: 'CendiaPanopticon', type: 'enterprise', category: 'compliance', enabled: true, visibility: 'public', updatedAt: new Date().toISOString() },
  { id: 'carbon-aware', name: 'CendiaCarbonAware', type: 'enterprise', category: 'sustainability', enabled: true, visibility: 'public', updatedAt: new Date().toISOString() },
];

const SEED_AGENTS: Agent[] = [
  { id: 'strategist', name: 'Strategic Advisor', category: 'core', enabled: true, model: 'gpt-4o-mini', temperature: 0.7, updatedAt: new Date().toISOString() },
  { id: 'risk-analyst', name: 'Risk Analyst', category: 'core', enabled: true, model: 'gpt-4o-mini', temperature: 0.3, updatedAt: new Date().toISOString() },
  { id: 'compliance', name: 'Compliance Officer', category: 'core', enabled: true, model: 'gpt-4o-mini', temperature: 0.2, updatedAt: new Date().toISOString() },
  { id: 'devil-advocate', name: "Devil's Advocate", category: 'core', enabled: true, model: 'gpt-4o-mini', temperature: 0.8, updatedAt: new Date().toISOString() },
];

class FeatureControlServiceImpl {
  private features = new Map<string, Feature>(SEED_FEATURES.map(f => [f.id, f]));
  private agents = new Map<string, Agent>(SEED_AGENTS.map(a => [a.id, a]));
  private suites = new Map<string, Suite>();
  private pricing = new Map<string, PricingTier>();

  async getControlDashboard() {
    return { features: { total: this.features.size, enabled: [...this.features.values()].filter(f => f.enabled).length }, agents: { total: this.agents.size, enabled: [...this.agents.values()].filter(a => a.enabled).length }, suites: this.suites.size, pricingTiers: this.pricing.size };
  }

  async listFeatures(filters?: { type?: string; category?: string; enabled?: boolean }): Promise<Feature[]> {
    let list = [...this.features.values()];
    if (filters?.type) list = list.filter(f => f.type === filters.type);
    if (filters?.category) list = list.filter(f => f.category === filters.category);
    if (filters?.enabled !== undefined) list = list.filter(f => f.enabled === filters.enabled);
    return list;
  }

  async getFeature(id: string): Promise<Feature | null> { return this.features.get(id) ?? null; }

  async updateFeature(id: string, updates: Partial<Feature>): Promise<Feature | null> {
    const f = this.features.get(id); if (!f) return null;
    Object.assign(f, updates, { updatedAt: new Date().toISOString() }); return f;
  }

  async toggleFeature(id: string, enabled: boolean): Promise<Feature | null> { return this.updateFeature(id, { enabled }); }

  async setVisibility(id: string, visibility: string): Promise<Feature | null> { return this.updateFeature(id, { visibility }); }

  async listAgents(filters?: { enabled?: boolean; category?: string }): Promise<Agent[]> {
    let list = [...this.agents.values()];
    if (filters?.enabled !== undefined) list = list.filter(a => a.enabled === filters.enabled);
    if (filters?.category) list = list.filter(a => a.category === filters.category);
    return list;
  }

  async getAgent(id: string): Promise<Agent | null> { return this.agents.get(id) ?? null; }
  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | null> { const a = this.agents.get(id); if (!a) return null; Object.assign(a, updates, { updatedAt: new Date().toISOString() }); return a; }
  async toggleAgent(id: string, enabled: boolean): Promise<Agent | null> { return this.updateAgent(id, { enabled }); }
  async updateAgentModel(id: string, model: string, temperature?: number): Promise<Agent | null> { return this.updateAgent(id, { model, ...(temperature !== undefined && { temperature }) }); }
  async updateAgentPrompt(id: string, systemPrompt: string): Promise<Agent | null> { return this.updateAgent(id, { systemPrompt }); }

  async listSuites(): Promise<Suite[]> { return [...this.suites.values()]; }
  async getSuite(id: string): Promise<Suite | null> { return this.suites.get(id) ?? null; }
  async toggleSuite(id: string, enabled: boolean): Promise<Suite | null> { const s = this.suites.get(id); if (!s) return null; s.enabled = enabled; return s; }

  async listPricing(includeHidden = false): Promise<PricingTier[]> { const all = [...this.pricing.values()]; return includeHidden ? all : all.filter(p => p.visible); }
  async getPricingTier(id: string): Promise<PricingTier | null> { return this.pricing.get(id) ?? null; }
  async updatePricing(id: string, updates: Partial<PricingTier>): Promise<PricingTier | null> { const p = this.pricing.get(id); if (!p) return null; Object.assign(p, updates, { updatedAt: new Date().toISOString() }); return p; }
  async createPricingTier(params: Partial<PricingTier>): Promise<PricingTier> { const t: PricingTier = { id: crypto.randomUUID(), name: params.name || 'New Tier', price: params.price || 0, features: params.features || [], visible: params.visible ?? true, updatedAt: new Date().toISOString() }; this.pricing.set(t.id, t); return t; }
  async deletePricingTier(id: string): Promise<boolean> { return this.pricing.delete(id); }

  async getActiveRoutes(): Promise<RouteInfo[]> {
    return [
      { path: '/api/v1/council', method: 'POST', active: true },
      { path: '/api/v1/express/analyze', method: 'POST', active: true },
      { path: '/api/v1/admin', method: 'GET', active: true },
    ];
  }

  async getSitemapRoutes(): Promise<RouteInfo[]> { return this.getActiveRoutes(); }
}

export const featureControlService = new FeatureControlServiceImpl();
