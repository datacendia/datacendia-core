// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CENDIA VOX SERVICE — Stakeholder Voice & Democratic Participation Engine
// =============================================================================

import crypto from 'crypto';
import { deterministicPercentage, deterministicPick, deterministicFloat, deterministicBool, deterministicInt } from '../utils/deterministic.js';

interface Stakeholder {
  id: string;
  organizationId: string;
  name: string;
  role: string;
  influence: number;
  sentiment: number;
  engagementScore: number;
  signals: Signal[];
}

interface Signal {
  id: string;
  stakeholderId: string;
  type: string;
  content: string;
  sentiment: number;
  urgency: string;
  createdAt: string;
}

interface ImpactAssessment {
  id: string;
  decisionId: string;
  stakeholderId: string;
  stakeholderName: string;
  impactLevel: string;
  impactScore: number;
  description: string;
}

interface Vote {
  id: string;
  decisionId: string;
  stakeholderId: string;
  position: string;
  weight: number;
  rationale: string;
  castAt: string;
}

interface Assembly {
  id: string;
  organizationId: string;
  decisionId: string;
  title: string;
  assemblyType: string;
  participants: string[];
  outcome: string;
  consensusScore: number;
  conductedAt: string;
}

const DEFAULT_STAKEHOLDERS = [
  { name: 'Board of Directors', role: 'governance', influence: 0.95, sentiment: 0.7 },
  { name: 'Executive Team', role: 'executive', influence: 0.9, sentiment: 0.75 },
  { name: 'Compliance Department', role: 'compliance', influence: 0.8, sentiment: 0.6 },
  { name: 'Employee Representatives', role: 'workforce', influence: 0.6, sentiment: 0.65 },
  { name: 'External Auditors', role: 'oversight', influence: 0.7, sentiment: 0.55 },
  { name: 'Community Advisory Board', role: 'community', influence: 0.5, sentiment: 0.5 },
  { name: 'Customers / Clients', role: 'customer', influence: 0.65, sentiment: 0.7 },
  { name: 'Regulatory Bodies', role: 'regulator', influence: 0.85, sentiment: 0.5 },
];

class CendiaVoxServiceImpl {
  private stakeholders = new Map<string, Stakeholder>();
  private impacts = new Map<string, ImpactAssessment[]>();
  private votes = new Map<string, Vote[]>();
  private assemblies = new Map<string, Assembly>();
  private signals = new Map<string, Signal>();
  private vetoes: any[] = [];

  async initializeStakeholders(orgId: string): Promise<Stakeholder[]> {
    const created: Stakeholder[] = [];
    for (const def of DEFAULT_STAKEHOLDERS) {
      const id = `sh-${crypto.randomUUID().slice(0, 8)}`;
      const stakeholder: Stakeholder = {
        id, organizationId: orgId, name: def.name, role: def.role,
        influence: def.influence, sentiment: def.sentiment,
        engagementScore: deterministicPercentage(65, 20, `eng-${orgId}-${def.name}`),
        signals: [],
      };
      this.stakeholders.set(id, stakeholder);
      created.push(stakeholder);
    }
    return created;
  }

  async getStakeholders(orgId: string): Promise<Stakeholder[]> {
    return [...this.stakeholders.values()].filter(s => s.organizationId === orgId);
  }

  async updateStakeholder(id: string, updates: Partial<Stakeholder>): Promise<Stakeholder> {
    const s = this.stakeholders.get(id);
    if (!s) throw new Error(`Stakeholder ${id} not found`);
    const { name, role, influence, sentiment, engagementScore } = updates;
    if (name !== undefined) s.name = name;
    if (role !== undefined) s.role = role;
    if (influence !== undefined) s.influence = influence;
    if (sentiment !== undefined) s.sentiment = sentiment;
    if (engagementScore !== undefined) s.engagementScore = engagementScore;
    return s;
  }

  async ingestSignal(stakeholderId: string, data: any): Promise<Signal> {
    const stakeholder = this.stakeholders.get(stakeholderId);
    if (!stakeholder) throw new Error(`Stakeholder ${stakeholderId} not found`);
    const signal: Signal = {
      id: `sig-${crypto.randomUUID().slice(0, 8)}`,
      stakeholderId, type: data.type || 'feedback',
      content: data.content || '', sentiment: data.sentiment ?? 0.5,
      urgency: data.urgency || 'medium', createdAt: new Date().toISOString(),
    };
    stakeholder.signals.push(signal);
    this.signals.set(signal.id, signal);
    return signal;
  }

  async getSignals(stakeholderId: string, limit: number): Promise<Signal[]> {
    const s = this.stakeholders.get(stakeholderId);
    return s ? s.signals.slice(-limit) : [];
  }

  async getAllSignals(orgId: string, limit: number): Promise<Signal[]> {
    const stakeholders = await this.getStakeholders(orgId);
    return stakeholders.flatMap(s => s.signals).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
  }

  async assessImpact(orgId: string, decisionId: string, context: string): Promise<ImpactAssessment[]> {
    const stakeholders = await this.getStakeholders(orgId);
    const seed = `impact-${decisionId}`;
    const assessments = stakeholders.map(s => ({
      id: `imp-${crypto.randomUUID().slice(0, 8)}`,
      decisionId, stakeholderId: s.id, stakeholderName: s.name,
      impactLevel: deterministicPick(['positive', 'neutral', 'negative', 'mixed'], seed, s.id),
      impactScore: deterministicPercentage(50, 30, seed, s.id, 'score'),
      description: `Impact on ${s.name} (${s.role}): ${deterministicPick(['Directly affected', 'Indirectly affected', 'Minimal impact', 'Significant impact'], seed, s.id, 'desc')}`,
    }));
    this.impacts.set(decisionId, assessments);
    return assessments;
  }

  async getDecisionImpacts(decisionId: string): Promise<ImpactAssessment[]> {
    return this.impacts.get(decisionId) || [];
  }

  async conductVote(orgId: string, decisionId: string, context: string): Promise<Vote[]> {
    const stakeholders = await this.getStakeholders(orgId);
    const seed = `vote-${decisionId}`;
    const voteList = stakeholders.map(s => ({
      id: `vote-${crypto.randomUUID().slice(0, 8)}`,
      decisionId, stakeholderId: s.id,
      position: deterministicPick(['approve', 'conditional-approve', 'abstain', 'oppose'], seed, s.id),
      weight: s.influence,
      rationale: `${s.name} position based on ${s.role} perspective`,
      castAt: new Date().toISOString(),
    }));
    this.votes.set(decisionId, voteList);
    return voteList;
  }

  async getDecisionVotes(decisionId: string): Promise<Vote[]> {
    return this.votes.get(decisionId) || [];
  }

  async conductAssembly(orgId: string, decisionId: string, title: string, assemblyType: string): Promise<Assembly> {
    const stakeholders = await this.getStakeholders(orgId);
    const seed = `assembly-${decisionId}`;
    const assembly: Assembly = {
      id: `asm-${crypto.randomUUID().slice(0, 8)}`,
      organizationId: orgId, decisionId, title, assemblyType: assemblyType || 'deliberation',
      participants: stakeholders.map(s => s.id),
      outcome: deterministicPick(['consensus', 'majority-approval', 'conditional-approval', 'deferred'], seed),
      consensusScore: deterministicPercentage(72, 18, seed, 'consensus'),
      conductedAt: new Date().toISOString(),
    };
    this.assemblies.set(assembly.id, assembly);
    return assembly;
  }

  async getAssemblies(orgId: string, limit: number): Promise<Assembly[]> {
    return [...this.assemblies.values()].filter(a => a.organizationId === orgId).slice(-limit);
  }

  async getAllVetoes(orgId: string, limit: number): Promise<any[]> {
    return this.vetoes.filter(v => v.organizationId === orgId).slice(-limit);
  }

  async getDashboard(orgId: string) {
    const stakeholders = await this.getStakeholders(orgId);
    const allSignals = await this.getAllSignals(orgId, 100);
    return {
      stakeholderCount: stakeholders.length,
      averageSentiment: stakeholders.length > 0
        ? Math.round(stakeholders.reduce((s, sh) => s + sh.sentiment, 0) / stakeholders.length * 100) / 100
        : 0,
      totalSignals: allSignals.length,
      recentSignals: allSignals.slice(0, 10),
      assembliesCount: [...this.assemblies.values()].filter(a => a.organizationId === orgId).length,
      vetoCount: this.vetoes.filter(v => v.organizationId === orgId).length,
    };
  }
}

export const cendiaVoxService = new CendiaVoxServiceImpl();
