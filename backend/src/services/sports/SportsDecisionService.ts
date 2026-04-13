// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { SPORTS_DECISION_TEMPLATES } from '../../config/sports/decision-templates.js';
import { SPORTS_COMPLIANCE_FRAMEWORKS } from '../../config/sports/compliance-frameworks.js';

export interface Player { name: string; position: string; age: number; nationality: string; currentClub?: string; marketValue?: number; [key: string]: any; }
export interface Club { name: string; league: string; country: string; [key: string]: any; }

class SportsDecisionServiceImpl {
  private decisions = new Map<string, any>();

  async healthCheck() { return { status: 'healthy', totalDecisions: this.decisions.size, timestamp: new Date().toISOString() }; }

  getTemplate(id: string) { return SPORTS_DECISION_TEMPLATES.find((t: any) => t.id === id) || null; }
  getFramework(id: string) { return SPORTS_COMPLIANCE_FRAMEWORKS.find((f: any) => f.id === id) || null; }

  async createTransferDecision(data: { organizationId: string; userId: string; templateId: string; transactionType: string; player: Player; counterpartyClub: Club; transferFee: number; addOns?: any; agentFee?: number }) {
    const id = `td-${crypto.randomUUID().slice(0, 8)}`;
    const decision: any = {
      id, type: 'transfer', status: 'draft', ...data,
      scoutingAssessments: [], valuations: [], alternatives: [], evidence: [], approvals: [],
      auditTrail: [{ action: 'created', userId: data.userId, timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    this.decisions.set(id, decision);
    return decision;
  }

  async getTransferDecision(id: string) { return this.decisions.get(id) || null; }

  async updateTransferDecision(id: string, userId: string, updates: any) {
    const d = this.decisions.get(id);
    if (!d) throw new Error('Decision not found');
    if (d.status === 'completed') throw new Error('Cannot update completed decision');
    Object.assign(d, updates, { updatedAt: new Date().toISOString() });
    d.auditTrail.push({ action: 'updated', userId, timestamp: new Date().toISOString() });
    return d;
  }

  async addScoutingAssessment(id: string, userId: string, assessment: any) {
    const d = this.decisions.get(id);
    if (!d) throw new Error('Decision not found');
    d.scoutingAssessments.push({ ...assessment, addedBy: userId, addedAt: new Date().toISOString() });
    d.auditTrail.push({ action: 'scouting_added', userId, timestamp: new Date().toISOString() });
    d.updatedAt = new Date().toISOString();
    return d;
  }

  async addValuation(id: string, userId: string, valuation: any) {
    const d = this.decisions.get(id);
    if (!d) throw new Error('Decision not found');
    d.valuations.push({ ...valuation, addedBy: userId, addedAt: new Date().toISOString() });
    d.auditTrail.push({ action: 'valuation_added', userId, timestamp: new Date().toISOString() });
    d.updatedAt = new Date().toISOString();
    return d;
  }

  async addAlternative(id: string, userId: string, alternative: any) {
    const d = this.decisions.get(id);
    if (!d) throw new Error('Decision not found');
    d.alternatives.push({ ...alternative, addedBy: userId, addedAt: new Date().toISOString() });
    d.auditTrail.push({ action: 'alternative_added', userId, timestamp: new Date().toISOString() });
    d.updatedAt = new Date().toISOString();
    return d;
  }

  async attachEvidence(id: string, userId: string, evidence: any) {
    const d = this.decisions.get(id);
    if (!d) throw new Error('Decision not found');
    const eid = `ev-${crypto.randomUUID().slice(0, 6)}`;
    d.evidence.push({ id: eid, ...evidence, uploadedBy: userId, uploadedAt: new Date().toISOString() });
    d.auditTrail.push({ action: 'evidence_attached', userId, evidenceId: eid, timestamp: new Date().toISOString() });
    d.updatedAt = new Date().toISOString();
    return d;
  }

  async submitForApproval(id: string, userId: string) {
    const d = this.decisions.get(id);
    if (!d) throw new Error('Decision not found');
    d.status = 'pending_approval';
    d.auditTrail.push({ action: 'submitted_for_approval', userId, timestamp: new Date().toISOString() });
    d.updatedAt = new Date().toISOString();
    return d;
  }

  async recordApproval(id: string, userId: string, userName: string, role: string, approved: boolean, comments?: string) {
    const d = this.decisions.get(id);
    if (!d) throw new Error('Decision not found');
    d.approvals.push({ userId, userName, role, approved, comments, timestamp: new Date().toISOString() });
    d.auditTrail.push({ action: approved ? 'approved' : 'rejected', userId, role, timestamp: new Date().toISOString() });
    d.updatedAt = new Date().toISOString();
    return d;
  }

  async completeDecision(id: string, userId: string) {
    const d = this.decisions.get(id);
    if (!d) throw new Error('Decision not found');
    d.status = 'completed';
    d.completedAt = new Date().toISOString();
    d.completedBy = userId;
    d.hash = crypto.createHash('sha256').update(JSON.stringify({ ...d, hash: undefined })).digest('hex');
    d.auditTrail.push({ action: 'completed', userId, timestamp: new Date().toISOString() });
    d.updatedAt = new Date().toISOString();
    return d;
  }

  async assessFFPImpact(id: string, financials: { breakEvenPosition: number; squadCostRatio: number }) {
    const d = this.decisions.get(id);
    if (!d) throw new Error('Decision not found');
    const annualCost = (d.transferFee || 0) / 4 + (d.agentFee || 0);
    const newBE = financials.breakEvenPosition - annualCost;
    return { decisionId: id, annualizedCost: annualCost, projectedBreakEven: newBE, compliant: newBE > -30_000_000, riskLevel: newBE > 0 ? 'low' : newBE > -10_000_000 ? 'medium' : 'high', squadCostImpact: financials.squadCostRatio + (annualCost / 100_000_000) * 100 };
  }

  async exportDecisionRecord(id: string) {
    const d = this.decisions.get(id);
    if (!d) throw new Error('Decision not found');
    return { decision: d, exportedAt: new Date().toISOString(), format: 'json', hash: crypto.createHash('sha256').update(JSON.stringify(d)).digest('hex') };
  }

  async getOrganizationDecisions(orgId: string, opts?: { type?: string; status?: string; limit?: number }) {
    let results = [...this.decisions.values()].filter(d => d.organizationId === orgId);
    if (opts?.type) results = results.filter(d => d.type === opts.type);
    if (opts?.status) results = results.filter(d => d.status === opts.status);
    if (opts?.limit) results = results.slice(0, opts.limit);
    return results;
  }
}

export const sportsDecisionService = new SportsDecisionServiceImpl();
