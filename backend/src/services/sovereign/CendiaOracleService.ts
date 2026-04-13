// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPick, deterministicPercentage } from '../../utils/deterministic.js';

class CendiaOracleServiceImpl {
  private claims = new Map<string, any>();
  private disputes: any[] = [];

  async getDashboard(orgId: string) {
    const claims = this.getClaimsForOrg(orgId);
    return { organizationId: orgId, totalClaims: claims.length, verified: claims.filter((c: any) => c.status === 'verified').length, pending: claims.filter((c: any) => c.status === 'pending').length, disputes: this.disputes.filter(d => d.organizationId === orgId).length };
  }

  getClaimsForOrg(orgId: string, filters?: any) {
    let results = [...this.claims.values()].filter(c => c.organizationId === orgId);
    if (filters?.status) results = results.filter(c => c.status === filters.status);
    if (filters?.category) results = results.filter(c => c.category === filters.category);
    return results;
  }

  getClaim(id: string) { return this.claims.get(id) || null; }

  async submitClaim(data: any) {
    const id = `claim-${crypto.randomUUID().slice(0, 8)}`;
    const claim = { id, organizationId: data.organizationId || 'demo', assertion: data.assertion, category: data.category || 'general', status: 'pending', evidence: [], votes: [], submittedAt: new Date().toISOString() };
    this.claims.set(id, claim);
    return claim;
  }

  async submitEvidence(claimId: string, data: any) {
    const claim = this.claims.get(claimId);
    if (!claim) throw new Error('Claim not found');
    const evidence = { id: `ev-${crypto.randomUUID().slice(0, 8)}`, claimId, type: data.type || 'document', content: data.content, submittedAt: new Date().toISOString() };
    claim.evidence.push(evidence);
    return evidence;
  }

  async verifyClaim(claimId: string, verifiedBy: string) {
    const claim = this.claims.get(claimId);
    if (!claim) throw new Error('Claim not found');
    claim.status = 'verified';
    claim.verifiedBy = verifiedBy;
    claim.verifiedAt = new Date().toISOString();
    return claim;
  }

  getVotesForClaim(claimId: string) {
    const claim = this.claims.get(claimId);
    return claim?.votes || [];
  }

  getDisputesForOrg(orgId: string) { return this.disputes.filter(d => d.organizationId === orgId); }
}

export const cendiaOracleService = new CendiaOracleServiceImpl();
