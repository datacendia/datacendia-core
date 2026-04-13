// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

interface CaseLaw { id: string; citation: string; title: string; court: string; date: string; jurisdiction: string; content: string; sourceSystem: string; importedBy: string; importedAt: string }
interface Matter { id: string; title: string; type: string; status: string; practiceArea: string; responsibleAttorney: string; createdAt: string; updatedAt: string }
interface PrivilegeReview { id: string; matterId: string; documentId: string; status: string; designation: string; reviewedAt: string }

class LegalVerticalServiceImpl {
  private cases = new Map<string, CaseLaw>();
  private matters = new Map<string, Matter>();
  private reviews: PrivilegeReview[] = [];
  private presets = [
    { id: 'litigation-full', name: 'Full Litigation', matterType: 'litigation', agents: ['lead-counsel', 'risk-analyst', 'research-clerk', 'devils-advocate'] },
    { id: 'contract-review', name: 'Contract Review', matterType: 'transactional', agents: ['compliance-officer', 'risk-analyst'] },
    { id: 'compliance-audit', name: 'Compliance Audit', matterType: 'compliance', agents: ['compliance-officer', 'ethics-guardian'] },
    { id: 'ip-review', name: 'IP Review', matterType: 'ip', agents: ['research-clerk', 'lead-counsel'] },
  ];

  getHealth() { return { status: 'healthy', cases: this.cases.size, matters: this.matters.size, uptime: process.uptime(), caseLibrarySize: this.cases.size, mattersCount: this.matters.size, privilegeReviewsCount: 0 }; }

  async ingestCaseLaw(caseData: any): Promise<CaseLaw> {
    const c: CaseLaw = { id: crypto.randomUUID(), citation: caseData.citation || '', title: caseData.title || caseData.name || '', court: caseData.court || '', date: caseData.date || '', jurisdiction: caseData.jurisdiction || '', content: caseData.content || '', sourceSystem: caseData.sourceSystem || 'manual', importedBy: caseData.importedBy || 'system', importedAt: new Date().toISOString() };
    this.cases.set(c.id, c);
    return c;
  }

  async bulkIngestCaseLaw(cases: any[], sourceSystem: string, importedBy: string) {
    const results = await Promise.all(cases.map(c => this.ingestCaseLaw({ ...c, sourceSystem, importedBy })));
    return { imported: results.length, cases: results };
  }

  async searchCaseLaw(query: any) {
    const q = (query.query || query.text || '').toLowerCase();
    return [...this.cases.values()].filter(c => c.title.toLowerCase().includes(q) || c.citation.toLowerCase().includes(q) || c.content.toLowerCase().includes(q)).slice(0, query.limit || 20);
  }

  getCaseById(id: string) { return this.cases.get(id) || null; }
  getCaseByCitation(citation: string) { return [...this.cases.values()].find(c => c.citation === citation) || null; }

  verifyCitation(citation: string) {
    const found = this.getCaseByCitation(citation);
    return { citation, verified: !!found, caseId: found?.id || null, message: found ? 'Citation verified against library' : 'Citation not found in library' };
  }

  getLibraryStats() { return { totalCases: this.cases.size, jurisdictions: [...new Set([...this.cases.values()].map(c => c.jurisdiction))].length, courts: [...new Set([...this.cases.values()].map(c => c.court))].length }; }

  async createMatter(data: any): Promise<Matter> {
    const now = new Date().toISOString();
    const m: Matter = { id: crypto.randomUUID(), title: data.title, type: data.type || 'general', status: data.status || 'active', practiceArea: data.practiceArea || '', responsibleAttorney: data.responsibleAttorney || '', createdAt: now, updatedAt: now };
    this.matters.set(m.id, m);
    return m;
  }

  getMatter(id: string) { return this.matters.get(id) || null; }

  async updateMatter(id: string, updates: Partial<Matter>) {
    const m = this.matters.get(id);
    if (!m) return null;
    Object.assign(m, updates, { updatedAt: new Date().toISOString() });
    return m;
  }

  listMatters(filters?: { status?: string; practiceArea?: string; responsibleAttorney?: string }) {
    let list = [...this.matters.values()];
    if (filters?.status) list = list.filter(m => m.status === filters.status);
    if (filters?.practiceArea) list = list.filter(m => m.practiceArea === filters.practiceArea);
    if (filters?.responsibleAttorney) list = list.filter(m => m.responsibleAttorney === filters.responsibleAttorney);
    return list;
  }

  async submitPrivilegeReview(data: any): Promise<PrivilegeReview> {
    const r: PrivilegeReview = { id: crypto.randomUUID(), matterId: data.matterId, documentId: data.documentId, status: 'reviewed', designation: data.designation || 'not-privileged', reviewedAt: new Date().toISOString() };
    this.reviews.push(r);
    return r;
  }

  canExportDocument(documentId: string) {
    const review = this.reviews.find(r => r.documentId === documentId);
    if (!review) return { canExport: true, reason: 'No privilege review on file' };
    return { canExport: review.designation !== 'privileged', reason: review.designation === 'privileged' ? 'Document is privileged' : 'Document cleared for export' };
  }

  getPrivilegeReviewsForMatter(matterId: string) { return this.reviews.filter(r => r.matterId === matterId); }

  validateCitations(citations: string[]) {
    return citations.map(c => this.verifyCitation(c));
  }

  enforceCitationRequirement(claims: { text: string; citations?: string[] }[]) {
    return claims.map(claim => ({
      text: claim.text,
      hasCitations: !!(claim.citations && claim.citations.length > 0),
      verified: (claim.citations || []).map(c => this.verifyCitation(c)),
      compliant: !!(claim.citations && claim.citations.length > 0),
    }));
  }

  getAgentPresets() { return this.presets; }
  getAgentPreset(id: string) { return this.presets.find(p => p.id === id) || null; }
  getRecommendedPreset(matterType: string) { return this.presets.find(p => p.matterType === matterType) || this.presets[0]; }
}

export const legalVerticalService = new LegalVerticalServiceImpl();
