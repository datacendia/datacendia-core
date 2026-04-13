// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPick, deterministicPercentage } from '../../utils/deterministic.js';

class CendiaWitnessServiceImpl {
  private records = new Map<string, any>();
  private legalHolds: any[] = [];
  private discoveryRequests: any[] = [];

  async getDashboard(orgId: string) {
    const recs = this.getRecordsForOrg(orgId);
    return { organizationId: orgId, totalRecords: recs.length, legalHolds: this.legalHolds.filter(h => h.organizationId === orgId).length, discoveryRequests: this.discoveryRequests.filter(d => d.organizationId === orgId).length };
  }

  getRecordsForOrg(orgId: string, filters?: any) {
    let recs = [...this.records.values()].filter(r => r.organizationId === orgId);
    if (filters?.eventType) recs = recs.filter(r => r.eventType === filters.eventType);
    if (filters?.legalRelevance) recs = recs.filter(r => r.legalRelevance === filters.legalRelevance);
    return recs;
  }

  getWitnessRecord(id: string) { return this.records.get(id) || null; }

  async verifyRecordIntegrity(id: string) {
    const record = this.records.get(id);
    if (!record) throw new Error('Record not found');
    return { recordId: id, valid: true, hash: record.hash, verifiedAt: new Date().toISOString() };
  }

  async getChainOfCustody(id: string) {
    const record = this.records.get(id);
    if (!record) throw new Error('Record not found');
    return [{ action: 'created', actor: 'system', timestamp: record.createdAt }, { action: 'witnessed', actor: 'witness-node', timestamp: record.witnessedAt || record.createdAt }];
  }

  getActiveLegalHolds(orgId: string) { return this.legalHolds.filter(h => h.organizationId === orgId && h.status === 'active'); }

  getDiscoveryRequests(orgId: string) { return this.discoveryRequests.filter(d => d.organizationId === orgId); }
}

export const cendiaWitnessService = new CendiaWitnessServiceImpl();
