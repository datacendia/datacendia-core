// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

interface AuditEntry {
  id: string;
  organizationId: string;
  eventType: string;
  actor: string;
  action: string;
  target?: string;
  metadata?: any;
  hash: string;
  previousHash: string;
  timestamp: string;
}

class ImmutableAuditLedgerImpl {
  private entries: AuditEntry[] = [];
  private lastHash = '0'.repeat(64);

  async append(data: { organizationId: string; eventType: string; actor: string; action: string; target?: string; metadata?: any }) {
    const id = `audit-${crypto.randomUUID().slice(0, 8)}`;
    const timestamp = new Date().toISOString();
    const payload = JSON.stringify({ ...data, timestamp, previousHash: this.lastHash });
    const hash = crypto.createHash('sha256').update(payload).digest('hex');
    const entry: AuditEntry = { id, ...data, hash, previousHash: this.lastHash, timestamp };
    this.entries.push(entry);
    this.lastHash = hash;
    return entry;
  }

  async getEntriesWithProof(filters: { organizationId: string; startDate?: Date; endDate?: Date; eventTypes?: string[]; limit?: number }) {
    let results = this.entries.filter(e => e.organizationId === filters.organizationId);
    if (filters.startDate) results = results.filter(e => new Date(e.timestamp) >= filters.startDate!);
    if (filters.endDate) results = results.filter(e => new Date(e.timestamp) <= filters.endDate!);
    if (filters.eventTypes?.length) results = results.filter(e => filters.eventTypes!.includes(e.eventType));
    if (filters.limit) results = results.slice(-filters.limit);
    const proof = { chainLength: this.entries.length, lastHash: this.lastHash, verifiedAt: new Date().toISOString() };
    return { entries: results, proof };
  }

  async verifyIntegrity() {
    let previousHash = '0'.repeat(64);
    let valid = true;
    for (const entry of this.entries) {
      if (entry.previousHash !== previousHash) { valid = false; break; }
      previousHash = entry.hash;
    }
    return { valid, chainLength: this.entries.length, lastHash: this.lastHash, verifiedAt: new Date().toISOString() };
  }

  async exportWithProof(opts: { organizationId: string; startDate: Date; endDate: Date; exportedBy: string }) {
    const { entries, proof } = await this.getEntriesWithProof(opts);
    const exportHash = crypto.createHash('sha256').update(JSON.stringify(entries)).digest('hex');
    return { entries, proof, exportHash, exportedBy: opts.exportedBy, exportedAt: new Date().toISOString() };
  }

  getStats() { return { totalEntries: this.entries.length, lastHash: this.lastHash, lastEntry: this.entries[this.entries.length - 1]?.timestamp || null }; }
}

export const immutableAuditLedger = new ImmutableAuditLedgerImpl();
