// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPick, deterministicPercentage } from '../../utils/deterministic.js';

class SynthesisEngineServiceImpl {
  private syntheses = new Map<string, any>();

  async initiateSynthesis(data: any) {
    const id = `synth-${crypto.randomUUID().slice(0, 8)}`;
    const seed = `synth-${id}`;
    const synthesis = { id, organizationId: data.organizationId, userId: data.userId, question: data.question, context: data.context, agents: data.agents, mode: data.mode, status: 'completed', consensus: deterministicPercentage(78, 15, seed), recommendation: deterministicPick(['approve', 'reject', 'defer', 'investigate'], seed), agentResponses: data.agents.map((a: any) => ({ agentId: a.id || a, position: deterministicPick(['support', 'oppose', 'neutral'], `${seed}-${a.id || a}`), confidence: deterministicPercentage(80, 15, `${seed}-${a.id || a}-conf`) })), createdAt: new Date().toISOString() };
    this.syntheses.set(id, synthesis);
    return synthesis;
  }

  getSynthesis(id: string) { return this.syntheses.get(id) || null; }

  async initiateExecution(synthesisId: string, approverUserId: string) {
    const synthesis = this.syntheses.get(synthesisId);
    if (!synthesis) throw new Error('Synthesis not found');
    return { synthesisId, approvedBy: approverUserId, status: 'executed', executedAt: new Date().toISOString() };
  }

  async getSynthesisHistory(orgId: string) { return [...this.syntheses.values()].filter(s => s.organizationId === orgId); }

  async getMetrics(orgId: string) {
    const items = [...this.syntheses.values()].filter(s => s.organizationId === orgId);
    return { total: items.length, avgConsensus: items.length ? items.reduce((a, b) => a + b.consensus, 0) / items.length : 0 };
  }
}

export const synthesisEngineService = new SynthesisEngineServiceImpl();
