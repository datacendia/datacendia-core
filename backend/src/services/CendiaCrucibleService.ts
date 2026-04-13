// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CENDIA CRUCIBLE SERVICE — Scenario Simulation & Resilience Testing Engine
// =============================================================================

import crypto from 'crypto';
import { deterministicPercentage, deterministicPick, deterministicFloat, deterministicInt } from '../utils/deterministic.js';

export const SCENARIO_TEMPLATES: Record<string, { name: string; description: string; defaultParams: Record<string, any> }> = {
  'economic-shock': { name: 'Economic Shock', description: 'Simulates sudden economic downturn', defaultParams: { severity: 0.7, duration: 12 } },
  'leadership-crisis': { name: 'Leadership Crisis', description: 'Simulates sudden leadership vacuum', defaultParams: { severity: 0.6, duration: 6 } },
  'cyber-incident': { name: 'Cyber Incident', description: 'Simulates major cybersecurity breach', defaultParams: { severity: 0.8, duration: 3 } },
  'regulatory-change': { name: 'Regulatory Change', description: 'Simulates major regulatory shift', defaultParams: { severity: 0.5, duration: 18 } },
  'supply-disruption': { name: 'Supply Chain Disruption', description: 'Simulates critical supply chain failure', defaultParams: { severity: 0.65, duration: 9 } },
  'pandemic': { name: 'Pandemic Response', description: 'Simulates public health emergency', defaultParams: { severity: 0.9, duration: 24 } },
};

interface SimulationResult {
  id: string;
  organizationId: string;
  scenarioType: string;
  description: string;
  resilienceScore: number;
  impactAssessment: {
    financial: number;
    operational: number;
    reputational: number;
    regulatory: number;
  };
  recommendations: string[];
  timeline: Array<{ phase: string; duration: string; actions: string[] }>;
  generatedAt: string;
}

interface Simulation {
  id: string;
  organization_id: string;
  user_id: string;
  name: string;
  description: string;
  simulationType: string;
  status: string;
  config: any;
  scenarioDefinition: any;
  universes: any[];
  impacts: any[];
  council_deliberations: any[];
  results: any;
  createdAt: string;
}

class CendiaCrucibleServiceImpl {
  private simulations = new Map<string, Simulation>();
  private quickSimulations = new Map<string, SimulationResult>();

  getScenarioTemplates() { return SCENARIO_TEMPLATES; }

  async listSimulations(orgId: string, filters: { status?: string; type?: string; limit?: number; offset?: number }): Promise<Simulation[]> {
    let results = [...this.simulations.values()].filter(s => s.organization_id === orgId);
    if (filters.status) results = results.filter(s => s.status === filters.status);
    if (filters.type) results = results.filter(s => s.simulationType === filters.type);
    const offset = filters.offset || 0;
    return results.slice(offset, offset + (filters.limit || 50));
  }

  async createSimulation(orgId: string, userId: string, data: any): Promise<Simulation> {
    const id = `sim-${crypto.randomUUID().slice(0, 8)}`;
    const sim: Simulation = {
      id, organization_id: orgId, user_id: userId,
      name: data.name, description: data.description || '',
      simulationType: data.simulationType, status: 'DRAFT',
      config: data.config || {}, scenarioDefinition: data.scenarioDefinition || {},
      universes: [], impacts: [], council_deliberations: [],
      results: null, createdAt: new Date().toISOString(),
    };
    this.simulations.set(id, sim);
    return sim;
  }

  async getSimulation(id: string): Promise<Simulation | undefined> { return this.simulations.get(id); }

  async runSimulation(id: string, opts: { mode?: string }): Promise<Simulation> {
    const sim = this.simulations.get(id);
    if (!sim) throw new Error(`Simulation ${id} not found`);
    const seed = `run-${id}-${Date.now()}`;
    sim.status = 'completed';

    const runs = sim.config?.monteCarloRuns || 12;
    const sentiments = ['CATASTROPHIC', 'NEGATIVE', 'NEUTRAL', 'POSITIVE', 'OPTIMAL'];
    sim.universes = Array.from({ length: runs }, (_, i) => ({
      id: `univ-${crypto.randomUUID().slice(0, 8)}`,
      outcome_sentiment: deterministicPick(sentiments, seed, `sent-${i}`),
      probability: deterministicPercentage(20, 15, seed, `prob-${i}`),
      narrative: `Universe ${i + 1}: ${deterministicPick(['Favorable outcome', 'Mixed results', 'Challenging scenario', 'Critical failure', 'Optimal recovery'], seed, `narr-${i}`)}`,
    }));

    const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'MINIMAL'];
    const categories = ['financial', 'operational', 'reputational', 'regulatory', 'strategic'];
    sim.impacts = categories.map((cat, i) => ({
      id: `imp-${crypto.randomUUID().slice(0, 8)}`,
      impact_category: cat,
      severity: deterministicPick(severities, seed, `sev-${i}`),
      score: deterministicPercentage(50, 30, seed, `score-${i}`),
      description: `${cat} impact assessment`,
    }));

    if (opts.mode !== 'express') {
      sim.council_deliberations = [{
        id: `delib-${crypto.randomUUID().slice(0, 8)}`,
        question: `Should the organization proceed given ${sim.simulationType} scenario?`,
        consensus: deterministicPercentage(68, 20, seed, 'consensus'),
        recommendation: deterministicPick(['proceed-with-caution', 'implement-mitigations', 'halt-and-reassess'], seed, 'rec'),
      }];
    }

    sim.results = { completedAt: new Date().toISOString(), universeCount: sim.universes.length, impactCount: sim.impacts.length };
    return sim;
  }

  async getRecentSimulations(orgId: string, limit: number): Promise<Simulation[]> {
    return [...this.simulations.values()]
      .filter(s => s.organization_id === orgId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  async getResilienceScores(orgId: string) {
    return this.getResilienceScore(orgId);
  }

  async getResilienceScore(organizationId: string) {
    const seed = `resilience-${organizationId}`;
    return {
      organizationId,
      overallScore: deterministicPercentage(72, 15, seed, 'overall'),
      dimensions: {
        financial: deterministicPercentage(70, 15, seed, 'fin'),
        operational: deterministicPercentage(75, 12, seed, 'ops'),
        technological: deterministicPercentage(68, 18, seed, 'tech'),
        human: deterministicPercentage(73, 14, seed, 'human'),
        regulatory: deterministicPercentage(80, 10, seed, 'reg'),
      },
      trend: deterministicPick(['improving', 'stable', 'declining'], seed, 'trend'),
      lastAssessed: new Date().toISOString(),
    };
  }

  async getIndustryBenchmarks(orgId: string) {
    const seed = `bench-${orgId}`;
    return {
      industry: deterministicPick(['financial-services', 'healthcare', 'technology', 'manufacturing'], seed),
      benchmarks: {
        resilienceScore: { p25: 55, p50: 68, p75: 82, orgScore: deterministicPercentage(72, 15, seed, 'org') },
        recoveryTime: { p25: 72, p50: 48, p75: 24, orgHours: deterministicPercentage(36, 20, seed, 'recovery') },
        scenariosCovered: { p25: 3, p50: 6, p75: 12, orgCount: this.simulations.size },
      },
      generatedAt: new Date().toISOString(),
    };
  }

  async getScenarioRecommendations(orgId: string) {
    const seed = `rec-${orgId}`;
    return Object.entries(SCENARIO_TEMPLATES).map(([type, template]) => ({
      scenarioType: type, name: template.name,
      priority: deterministicPick(['high', 'medium', 'low'], seed, type),
      reason: `Recommended based on ${template.description.toLowerCase()}`,
      lastSimulated: null,
    }));
  }

  async getQuickSimulation(organizationId: string, scenarioType: string, description: string): Promise<SimulationResult> {
    const seed = `crucible-${organizationId}-${scenarioType}-${Date.now()}`;
    const template = SCENARIO_TEMPLATES[scenarioType];
    const id = `qsim-${crypto.randomUUID().slice(0, 8)}`;
    const result: SimulationResult = {
      id, organizationId, scenarioType,
      description: description || template?.description || 'Custom scenario simulation',
      resilienceScore: deterministicPercentage(68, 20, seed, 'resilience'),
      impactAssessment: {
        financial: deterministicPercentage(50, 30, seed, 'financial'),
        operational: deterministicPercentage(55, 25, seed, 'operational'),
        reputational: deterministicPercentage(40, 30, seed, 'reputational'),
        regulatory: deterministicPercentage(35, 25, seed, 'regulatory'),
      },
      recommendations: [
        deterministicPick(['Activate business continuity plan', 'Convene crisis management team', 'Initiate stakeholder communications'], seed, 'rec-1'),
        deterministicPick(['Review insurance coverage', 'Engage external counsel', 'Activate backup systems'], seed, 'rec-2'),
        deterministicPick(['Monitor key metrics hourly', 'Prepare regulatory notifications', 'Secure critical assets'], seed, 'rec-3'),
      ],
      timeline: [
        { phase: 'Immediate (0-24h)', duration: '24 hours', actions: ['Activate emergency protocols', 'Assess initial impact'] },
        { phase: 'Short-term (1-7d)', duration: '1 week', actions: ['Implement containment measures', 'Begin stakeholder outreach'] },
        { phase: 'Medium-term (1-4w)', duration: '1 month', actions: ['Execute recovery plan', 'Monitor restoration progress'] },
        { phase: 'Long-term (1-6m)', duration: '6 months', actions: ['Full system restoration', 'Lessons learned analysis'] },
      ],
      generatedAt: new Date().toISOString(),
    };
    this.quickSimulations.set(id, result);
    return result;
  }

  async runSensitivityAnalysis(simulationId: string) {
    const seed = `sensitivity-${simulationId}`;
    return {
      simulationId,
      variables: ['interest-rate', 'market-volatility', 'regulatory-change', 'supply-disruption'].map(v => ({
        variable: v,
        baselineImpact: deterministicPercentage(50, 20, seed, v, 'base'),
        sensitivityRange: { low: deterministicPercentage(20, 15, seed, v, 'low'), high: deterministicPercentage(70, 20, seed, v, 'high') },
        elasticity: Math.round(deterministicFloat(seed, v, 'elast') * 200) / 100,
      })),
      analyzedAt: new Date().toISOString(),
    };
  }

  async calibrateModel(orgId: string) {
    const seed = `calibrate-${orgId}`;
    return {
      organizationId: orgId,
      calibrationScore: deterministicPercentage(78, 12, seed, 'cal'),
      accuracy: { prediction: deterministicPercentage(72, 15, seed, 'pred'), confidence: deterministicPercentage(80, 10, seed, 'conf') },
      calibratedAt: new Date().toISOString(),
    };
  }

  async analyzeScenarioCorrelations(orgId: string) {
    const seed = `corr-${orgId}`;
    const types = Object.keys(SCENARIO_TEMPLATES);
    return {
      organizationId: orgId,
      correlations: types.slice(0, 3).map((t, i) => ({
        scenarioA: t, scenarioB: types[(i + 1) % types.length]!,
        correlation: Math.round((deterministicFloat(seed, t, 'corr') * 2 - 1) * 100) / 100,
        relationship: deterministicPick(['amplifying', 'dampening', 'independent'], seed, t),
      })),
      analyzedAt: new Date().toISOString(),
    };
  }

  async getScenarioLibrary(orgId: string) {
    return {
      industry: Object.entries(SCENARIO_TEMPLATES).map(([type, t]) => ({ type, ...t, source: 'industry-standard' })),
      custom: [...this.simulations.values()].filter(s => s.organization_id === orgId).map(s => ({
        type: s.simulationType, name: s.name, description: s.description, source: 'organization',
      })),
    };
  }
}

export const cendiaCrucibleService = new CendiaCrucibleServiceImpl();

export default cendiaCrucibleService;
