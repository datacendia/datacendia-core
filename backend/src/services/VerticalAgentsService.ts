// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

interface AgentDef { id: string; name: string; verticalId: string; role: string; model: string; temperature: number; systemPrompt: string }
interface VerticalDef { id: string; name: string; description: string; agents: string[] }

const VERTICALS: VerticalDef[] = [
  { id: 'legal', name: 'Legal', description: 'Law firms & legal departments', agents: ['legal-strategist', 'legal-compliance', 'legal-risk', 'legal-research'] },
  { id: 'healthcare', name: 'Healthcare', description: 'Hospitals & health systems', agents: ['hc-clinician', 'hc-compliance', 'hc-operations', 'hc-research'] },
  { id: 'financial', name: 'Financial Services', description: 'Banks & fintech', agents: ['fin-risk', 'fin-compliance', 'fin-trading', 'fin-wealth'] },
  { id: 'insurance', name: 'Insurance', description: 'Insurance carriers & MGAs', agents: ['ins-underwriting', 'ins-claims', 'ins-actuary', 'ins-compliance'] },
  { id: 'sports', name: 'Sports', description: 'Sports organizations', agents: ['sports-scout', 'sports-analytics', 'sports-compliance', 'sports-commercial'] },
  { id: 'government', name: 'Government', description: 'Federal, state & local', agents: ['gov-policy', 'gov-compliance', 'gov-security', 'gov-procurement'] },
];

const AGENTS: AgentDef[] = VERTICALS.flatMap(v => v.agents.map(a => ({ id: a, name: a.split('-').map(w => w[0]!.toUpperCase() + w.slice(1)).join(' '), verticalId: v.id, role: a.split('-')[1] || 'general', model: 'gpt-4o-mini', temperature: 0.5, systemPrompt: `You are a ${a.replace('-', ' ')} specialist.` })));

class VerticalAgentsServiceImpl {
  private activity: any[] = [];

  async getAllVerticals() { return VERTICALS; }
  async getVerticalConfig(id: string) { return VERTICALS.find(v => v.id === id) || null; }
  async getAgentsForVertical(verticalId: string) { return AGENTS.filter(a => a.verticalId === verticalId); }
  async getVerticalMetrics(verticalId: string) { return { verticalId, totalAgents: AGENTS.filter(a => a.verticalId === verticalId).length, activeDecisions: 0, avgConfidence: 0.84 }; }

  async getAllAgents() { return AGENTS; }
  async searchAgents(query: string) { const q = query.toLowerCase(); return AGENTS.filter(a => a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)); }
  async getAgent(id: string) { return AGENTS.find(a => a.id === id) || null; }
  async getAgentMetrics(agentId: string) { const a = AGENTS.find(a2 => a2.id === agentId); if (!a) return null; return { agentId, decisions: 0, avgConfidence: 0.82, avgResponseMs: 1200 }; }
  async getAgentActivity(agentId: string, limit = 50) { return this.activity.filter(a => a.agentId === agentId).slice(0, limit); }

  async getGlobalMetrics() { return { totalVerticals: VERTICALS.length, totalAgents: AGENTS.length, activeDecisions: 0, recentActivity: this.activity.length }; }
  async getRecentActivity(limit = 50) { return this.activity.slice(0, limit); }

  async recordActivity(params: { agentId: string; verticalId: string; action: string; details?: any }) {
    const entry = { id: crypto.randomUUID(), ...params, timestamp: new Date().toISOString() };
    this.activity.unshift(entry);
    if (this.activity.length > 1000) this.activity.pop();
    return entry;
  }

  async healthCheck() { return { status: 'healthy', verticals: VERTICALS.length, agents: AGENTS.length, uptime: process.uptime() }; }
}

export const verticalAgentsService = new VerticalAgentsServiceImpl();
