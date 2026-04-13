// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPick, deterministicPercentage } from '../../utils/deterministic.js';

class UnionServiceImpl {
  private assessments = new Map<string, any>();
  private strategies = new Map<string, any>();

  async ingestThreatAssessment(orgId: string, source: string, threats: any[]) {
    const id = `assess-${crypto.randomUUID().slice(0, 8)}`;
    const assessment = { id, organizationId: orgId, source, threats, threatLevel: deterministicPick(['low', 'medium', 'high', 'critical'], `assess-${id}`), createdAt: new Date().toISOString() };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async synthesizeDefenseStrategy(orgId: string, assessmentId: string) {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error('Assessment not found');
    const id = `strat-${crypto.randomUUID().slice(0, 8)}`;
    const seed = `strat-${id}`;
    const strategy = { id, organizationId: orgId, assessmentId, status: 'draft', layers: [{ name: 'Network', action: deterministicPick(['segment', 'isolate', 'monitor'], seed) }, { name: 'Endpoint', action: deterministicPick(['harden', 'patch', 'quarantine'], `${seed}-ep`) }, { name: 'Identity', action: deterministicPick(['rotate-keys', 'enforce-mfa', 'revoke-tokens'], `${seed}-id`) }], estimatedEffectiveness: deterministicPercentage(82, 12, seed), createdAt: new Date().toISOString() };
    this.strategies.set(id, strategy);
    return strategy;
  }

  getStrategy(id: string) { return this.strategies.get(id) || null; }

  async approveStrategy(strategyId: string, approverId: string) {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) throw new Error('Strategy not found');
    strategy.status = 'approved';
    strategy.approvedBy = approverId;
    strategy.approvedAt = new Date().toISOString();
    return strategy;
  }

  async activateStrategy(strategyId: string) {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) throw new Error('Strategy not found');
    strategy.status = 'active';
    strategy.activatedAt = new Date().toISOString();
    return strategy;
  }

  getSecurityPosture(orgId: string) {
    const strategies = [...this.strategies.values()].filter(s => s.organizationId === orgId && s.status === 'active');
    if (strategies.length === 0) return null;
    const seed = `posture-${orgId}`;
    return { organizationId: orgId, overallScore: deterministicPercentage(78, 15, seed), activeStrategies: strategies.length, coverage: { network: deterministicPercentage(85, 10, `${seed}-net`), endpoint: deterministicPercentage(80, 10, `${seed}-ep`), identity: deterministicPercentage(90, 8, `${seed}-id`) } };
  }

  getMetrics(orgId?: string) {
    let strategies = [...this.strategies.values()];
    if (orgId) strategies = strategies.filter(s => s.organizationId === orgId);
    return { assessments: this.assessments.size, strategies: strategies.length, active: strategies.filter(s => s.status === 'active').length };
  }
}

export const unionService = new UnionServiceImpl();
