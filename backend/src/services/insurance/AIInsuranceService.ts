// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';

export type CoverageType = 'ai-liability' | 'decision-error' | 'data-breach' | 'regulatory-fine' | 'third-party-claims' | 'business-interruption';

const COVERAGE_TYPES: Record<CoverageType, { name: string; description: string; baseRatePerMillion: number }> = {
  'ai-liability': { name: 'AI General Liability', description: 'Coverage for AI system failures and consequential damages', baseRatePerMillion: 12000 },
  'decision-error': { name: 'AI Decision Error', description: 'Coverage for financial losses from incorrect AI decisions', baseRatePerMillion: 18000 },
  'data-breach': { name: 'Data Breach', description: 'Coverage for data breach response and regulatory fines', baseRatePerMillion: 8000 },
  'regulatory-fine': { name: 'Regulatory Fine', description: 'Coverage for AI-related regulatory penalties', baseRatePerMillion: 15000 },
  'third-party-claims': { name: 'Third Party Claims', description: 'Coverage for third-party claims arising from AI outputs', baseRatePerMillion: 10000 },
  'business-interruption': { name: 'Business Interruption', description: 'Coverage for business losses from AI system downtime', baseRatePerMillion: 9000 },
};

class AIInsuranceServiceImpl {
  private quotes = new Map<string, any>();
  private policies = new Map<string, any>();
  private coverageRecords = new Map<string, any>();
  private claims = new Map<string, any>();

  getCoverageTypes() { return Object.entries(COVERAGE_TYPES).map(([id, info]) => ({ id, ...info })); }

  async requestQuote(data: { organizationId: string; coverageType: CoverageType; requestedLimit: number; verticalId?: string; coveredSystems?: string[]; termMonths?: number }) {
    const id = `quote-${crypto.randomUUID().slice(0, 8)}`;
    const ct = COVERAGE_TYPES[data.coverageType] || COVERAGE_TYPES['ai-liability'];
    const limitMil = data.requestedLimit / 1_000_000;
    const seed = `quote-${data.organizationId}-${data.coverageType}`;
    const riskMultiplier = deterministicPercentage(100, 30, seed) / 100;
    const premium = Math.round(ct.baseRatePerMillion * limitMil * riskMultiplier);
    const quote = { id, organizationId: data.organizationId, coverageType: data.coverageType, requestedLimit: data.requestedLimit, premium, termMonths: data.termMonths || 12, riskScore: Math.round(riskMultiplier * 100), status: 'active', validUntil: new Date(Date.now() + 30 * 86400000).toISOString(), createdAt: new Date().toISOString() };
    this.quotes.set(id, quote);
    return quote;
  }

  async bindPolicy(quoteId: string, opts: { coveredSystems: string[]; coveredDecisionTypes: string[]; createdBy: string }) {
    const quote = this.quotes.get(quoteId);
    if (!quote) throw new Error('Quote not found');
    const id = `pol-${crypto.randomUUID().slice(0, 8)}`;
    const certId = `cert-${crypto.randomUUID().slice(0, 8)}`;
    const policy = { id, quoteId, organizationId: quote.organizationId, coverageType: quote.coverageType, limit: quote.requestedLimit, premium: quote.premium, ...opts, certificateId: certId, status: 'active', effectiveDate: new Date().toISOString(), expirationDate: new Date(Date.now() + (quote.termMonths || 12) * 30 * 86400000).toISOString(), createdAt: new Date().toISOString() };
    this.policies.set(id, policy);
    quote.status = 'bound';
    return policy;
  }

  getPolicy(id: string) { return this.policies.get(id) || null; }
  getPoliciesByOrganization(orgId: string) { return [...this.policies.values()].filter(p => p.organizationId === orgId); }

  async coverDecision(data: { policyId: string; decisionId: string; deliberationId?: string; decisionType: string; decisionValue: number; riskFactors?: any }) {
    const policy = this.policies.get(data.policyId);
    if (!policy) throw new Error('Policy not found');
    const id = `cov-${crypto.randomUUID().slice(0, 8)}`;
    const seed = `cov-${data.decisionId}`;
    const record = { id, ...data, coveredAmount: Math.min(data.decisionValue, policy.limit), riskAssessment: { score: deterministicPercentage(30, 25, seed), level: deterministicPick(['low', 'medium', 'high'], seed) }, coveredAt: new Date().toISOString() };
    this.coverageRecords.set(data.decisionId, record);
    return record;
  }

  getCoverageByDecision(decisionId: string) { return this.coverageRecords.get(decisionId) || null; }

  async fileClaim(data: { policyId: string; incidentDate: Date; incidentDescription: string; decisionId?: string; claimAmount: number; claimType: string; supportingDocuments?: string[] }) {
    const policy = this.policies.get(data.policyId);
    if (!policy) throw new Error('Policy not found');
    const id = `claim-${crypto.randomUUID().slice(0, 8)}`;
    const claim = { id, ...data, incidentDate: data.incidentDate.toISOString(), status: 'submitted', adjudicationResult: null, filedAt: new Date().toISOString() };
    this.claims.set(id, claim);
    return claim;
  }

  verifyCertificate(id: string) {
    const policy = [...this.policies.values()].find(p => p.certificateId === id);
    if (!policy) return { valid: false, message: 'Certificate not found' };
    const active = policy.status === 'active' && new Date(policy.expirationDate) > new Date();
    return { valid: active, policyId: policy.id, organizationId: policy.organizationId, coverageType: policy.coverageType, limit: policy.limit, expirationDate: policy.expirationDate, verifiedAt: new Date().toISOString() };
  }
}

export const aiInsuranceService = new AIInsuranceServiceImpl();
