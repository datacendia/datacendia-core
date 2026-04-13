// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

class CendiaVaultServiceImpl {
  private artifacts = new Map<string, any>();
  private accessLog: any[] = [];

  getStatus() { return { service: 'cendia-vault', status: 'operational', version: '1.0.0', initialized: true }; }

  async getStats() {
    const all = [...this.artifacts.values()];
    return { totalArtifacts: all.length, byType: { 'decision-packet': all.filter(a => a.type === 'decision-packet').length, 'audit-entry': all.filter(a => a.type === 'audit-entry').length, 'evidence-bundle': all.filter(a => a.type === 'evidence-bundle').length, 'signed-report': all.filter(a => a.type === 'signed-report').length, artifact: all.filter(a => a.type === 'artifact').length }, legalHolds: all.filter(a => a.legalHold).length };
  }

  async store(data: any) {
    const id = `vault-${crypto.randomUUID().slice(0, 8)}`;
    const hash = crypto.createHash('sha256').update(typeof data.content === 'string' ? data.content : data.content || '').digest('hex');
    const artifact = { id, type: data.type || 'artifact', title: data.title, mimeType: data.mimeType || 'application/octet-stream', hash, size: data.content?.length || 0, createdBy: data.createdBy || 'system', sourceService: data.sourceService, sourceId: data.sourceId, tags: data.tags || [], metadata: data.metadata || {}, legalHold: false, classification: 'internal', createdAt: new Date().toISOString() };
    this.artifacts.set(id, { ...artifact, _content: data.content });
    return artifact;
  }

  async storeDecisionPacket(data: any) { return this.store({ ...data, type: 'decision-packet', title: data.title, content: JSON.stringify(data.content) }); }
  async storeAuditEntry(data: any) { return this.store({ ...data, type: 'audit-entry', title: `Audit: ${data.action}`, content: JSON.stringify(data.content) }); }
  async storeEvidenceBundle(data: any) { return this.store({ ...data, type: 'evidence-bundle' }); }
  async storeSignedReport(data: any) { return this.store({ ...data, type: 'signed-report' }); }

  async get(id: string, actor?: string) {
    const artifact = this.artifacts.get(id);
    if (!artifact) return null;
    if (actor) this.accessLog.push({ artifactId: id, actor, action: 'read', timestamp: new Date().toISOString() });
    const { _content, ...meta } = artifact;
    return meta;
  }

  async getContent(id: string, actor?: string) {
    const artifact = this.artifacts.get(id);
    if (!artifact) return null;
    if (actor) this.accessLog.push({ artifactId: id, actor, action: 'read-content', timestamp: new Date().toISOString() });
    return artifact._content;
  }

  async getRelated(id: string) {
    const artifact = this.artifacts.get(id);
    if (!artifact) return [];
    return [...this.artifacts.values()].filter(a => a.id !== id && (a.sourceId === artifact.sourceId || a.type === artifact.type)).slice(0, 10).map(({ _content, ...meta }: any) => meta);
  }

  async search(filters: any) {
    let results = [...this.artifacts.values()];
    if (filters.type) results = results.filter(a => a.type === filters.type);
    if (filters.createdBy) results = results.filter(a => a.createdBy === filters.createdBy);
    if (filters.tags?.length) results = results.filter(a => filters.tags.some((t: string) => a.tags?.includes(t)));
    if (filters.classification) results = results.filter(a => a.classification === filters.classification);
    if (filters.legalHold !== undefined) results = results.filter(a => a.legalHold === filters.legalHold);
    if (filters.searchText) { const q = filters.searchText.toLowerCase(); results = results.filter(a => a.title?.toLowerCase().includes(q)); }
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    return results.slice(offset, offset + limit).map(({ _content, ...meta }: any) => meta);
  }

  async getByType(type: string, limit: number) {
    return [...this.artifacts.values()].filter(a => a.type === type).slice(0, limit).map(({ _content, ...meta }: any) => meta);
  }

  async verify(id: string) {
    const artifact = this.artifacts.get(id);
    if (!artifact) throw new Error('Artifact not found');
    const recomputed = crypto.createHash('sha256').update(typeof artifact._content === 'string' ? artifact._content : artifact._content || '').digest('hex');
    return { id, valid: recomputed === artifact.hash, storedHash: artifact.hash, computedHash: recomputed, verifiedAt: new Date().toISOString() };
  }

  async setLegalHold(id: string, hold: boolean, reason?: string) {
    const artifact = this.artifacts.get(id);
    if (!artifact) return false;
    artifact.legalHold = hold;
    if (reason) artifact.legalHoldReason = reason;
    return true;
  }

  async export(ids: string[], options: any, actor: string) {
    const artifacts = ids.map(id => this.artifacts.get(id)).filter(Boolean);
    if (artifacts.length === 0) return { success: false, error: 'No artifacts found' };
    const exported = artifacts.map(({ _content, ...meta }: any) => options.includeContent ? { ...meta, content: _content } : meta);
    const content = JSON.stringify(exported, null, 2);
    this.accessLog.push({ action: 'export', actor, ids, timestamp: new Date().toISOString() });
    return { success: true, content, filename: `vault-export-${Date.now()}.json`, mimeType: 'application/json' };
  }
}

export const cendiaVaultService = new CendiaVaultServiceImpl();
