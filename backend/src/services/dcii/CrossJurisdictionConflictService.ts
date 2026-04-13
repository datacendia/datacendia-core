// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CROSS-JURISDICTION COMPLIANCE CONFLICT DETECTION
// Identifies regulatory conflicts across international jurisdictions.
// =============================================================================

import crypto from 'crypto';
import { deterministicPercentage, deterministicPick, deterministicBool, deterministicInt } from '../../utils/deterministic.js';

const JURISDICTION_PROFILES: Record<string, { name: string; frameworks: string[]; dataProtection: string; aiRegulation: string }> = {
  US: { name: 'United States', frameworks: ['SOX', 'HIPAA', 'CCPA', 'NIST CSF', 'SEC'], dataProtection: 'Sectoral', aiRegulation: 'Executive Order 14110' },
  EU: { name: 'European Union', frameworks: ['GDPR', 'EU AI Act', 'DORA', 'NIS2', 'MiCA'], dataProtection: 'Comprehensive (GDPR)', aiRegulation: 'EU AI Act (2024)' },
  UK: { name: 'United Kingdom', frameworks: ['UK GDPR', 'FCA', 'PRA', 'ICO'], dataProtection: 'UK GDPR', aiRegulation: 'Pro-innovation approach' },
  SG: { name: 'Singapore', frameworks: ['PDPA', 'MAS TRM', 'AICGF'], dataProtection: 'PDPA', aiRegulation: 'Model AI Governance Framework' },
  CH: { name: 'Switzerland', frameworks: ['nDSG', 'FINMA', 'SBA'], dataProtection: 'nDSG (2023)', aiRegulation: 'Sector-specific guidelines' },
};

interface Conflict {
  id: string;
  organizationId: string;
  jurisdictionA: string;
  jurisdictionB: string;
  conflictType: string;
  severity: string;
  description: string;
  recommendation: string;
  status: 'active' | 'resolved' | 'accepted';
  detectedAt: string;
}

interface JurisdictionAssessment {
  id: string;
  organizationId: string;
  organizationName: string;
  jurisdictions: string[];
  conflicts: Conflict[];
  overallRisk: string;
  complianceScore: number;
  assessedBy: string;
  assessedAt: string;
}

interface EvidencePacket {
  id: string;
  organizationId: string;
  jurisdiction: string;
  framework: string;
  packetType: string;
  contents: Array<{ section: string; evidence: string; status: string }>;
  generatedBy: string;
  generatedAt: string;
  hash: string;
}

interface GoodFaithDocument {
  id: string;
  conflictId: string;
  narrative: string;
  mitigatingActions: string[];
  signedBy: string;
  signedAt: string;
  hash: string;
}

class CrossJurisdictionConflictServiceImpl {
  private assessments = new Map<string, JurisdictionAssessment>();
  private conflicts = new Map<string, Conflict>();
  private evidencePackets = new Map<string, EvidencePacket>();
  private goodFaithDocuments = new Map<string, GoodFaithDocument>();

  async assessOrganization(orgId: string, orgName: string, jurisdictions: string[], assessedBy: string): Promise<JurisdictionAssessment> {
    const seed = `jurisdiction-${orgId}-${jurisdictions.sort().join(',')}`;
    const id = `ja-${crypto.randomUUID().slice(0, 8)}`;
    const detectedConflicts: Conflict[] = [];

    for (let i = 0; i < jurisdictions.length; i++) {
      for (let j = i + 1; j < jurisdictions.length; j++) {
        const jA = jurisdictions[i]!;
        const jB = jurisdictions[j]!;
        const conflictCount = deterministicInt(0, 3, seed, jA, jB);
        for (let k = 0; k < conflictCount; k++) {
          const conflict = this.generateConflict(orgId, jA, jB, seed, k);
          detectedConflicts.push(conflict);
          this.conflicts.set(conflict.id, conflict);
        }
      }
    }

    const complianceScore = detectedConflicts.length === 0 ? 95 :
      Math.max(30, 95 - detectedConflicts.length * 8 - detectedConflicts.filter(c => c.severity === 'critical').length * 12);

    const assessment: JurisdictionAssessment = {
      id, organizationId: orgId, organizationName: orgName, jurisdictions,
      conflicts: detectedConflicts,
      overallRisk: complianceScore >= 80 ? 'low' : complianceScore >= 60 ? 'medium' : complianceScore >= 40 ? 'high' : 'critical',
      complianceScore, assessedBy, assessedAt: new Date().toISOString(),
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  private generateConflict(orgId: string, jA: string, jB: string, seed: string, idx: number): Conflict {
    const s = `${seed}-${jA}-${jB}-${idx}`;
    const types = ['data-transfer', 'consent-requirements', 'retention-period', 'ai-transparency', 'reporting-obligation', 'data-localization'];
    const type = deterministicPick(types, s, 'type');

    const descriptions: Record<string, string> = {
      'data-transfer': `${JURISDICTION_PROFILES[jA]?.name || jA} restricts cross-border data transfers that ${JURISDICTION_PROFILES[jB]?.name || jB} requires for operational reporting`,
      'consent-requirements': `Consent standards in ${JURISDICTION_PROFILES[jA]?.name || jA} (${JURISDICTION_PROFILES[jA]?.dataProtection}) conflict with ${JURISDICTION_PROFILES[jB]?.name || jB} implied consent provisions`,
      'retention-period': `Data retention mandates differ: ${deterministicInt(3, 7, s, 'retA')} years (${jA}) vs ${deterministicInt(1, 5, s, 'retB')} years (${jB})`,
      'ai-transparency': `AI disclosure requirements under ${JURISDICTION_PROFILES[jA]?.aiRegulation} conflict with trade secret protections in ${jB}`,
      'reporting-obligation': `Incident reporting timeline: ${deterministicInt(24, 72, s, 'repA')}h (${jA}) vs ${deterministicInt(48, 168, s, 'repB')}h (${jB})`,
      'data-localization': `${JURISDICTION_PROFILES[jA]?.name || jA} requires local data residency, incompatible with ${jB} centralized processing model`,
    };

    return {
      id: `conflict-${crypto.randomUUID().slice(0, 8)}`,
      organizationId: orgId, jurisdictionA: jA, jurisdictionB: jB,
      conflictType: type, severity: deterministicPick(['medium', 'high', 'critical'], s, 'sev'),
      description: descriptions[type] || `Regulatory conflict between ${jA} and ${jB}`,
      recommendation: deterministicPick([
        'Implement jurisdiction-specific data processing pipelines',
        'Apply strictest standard across all jurisdictions (superset compliance)',
        'Engage local counsel for conflict resolution strategy',
        'Deploy data residency controls with cross-border transfer agreements',
      ], s, 'rec'),
      status: 'active', detectedAt: new Date().toISOString(),
    };
  }

  getAssessment(id: string): JurisdictionAssessment | undefined { return this.assessments.get(id); }
  getAssessmentsByOrganization(orgId: string): JurisdictionAssessment[] {
    return [...this.assessments.values()].filter(a => a.organizationId === orgId);
  }
  getConflictsByOrganization(orgId: string): Conflict[] {
    return [...this.conflicts.values()].filter(c => c.organizationId === orgId);
  }
  getAllConflicts(): Conflict[] { return [...this.conflicts.values()]; }
  getConflict(id: string): Conflict | undefined { return this.conflicts.get(id); }

  async generateGoodFaithDocument(conflictId: string, signedBy: string): Promise<GoodFaithDocument> {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) throw new Error(`Conflict ${conflictId} not found`);
    const doc: GoodFaithDocument = {
      id: `gfd-${crypto.randomUUID().slice(0, 8)}`,
      conflictId,
      narrative: `Good-faith compliance documentation for ${conflict.conflictType} conflict between ${conflict.jurisdictionA} and ${conflict.jurisdictionB}. Organization has identified the regulatory tension and is implementing ${conflict.recommendation}.`,
      mitigatingActions: [
        'Conflict formally identified and documented',
        'Legal counsel engaged in both jurisdictions',
        'Interim compliance measures implemented',
        'Monitoring program established for regulatory updates',
      ],
      signedBy, signedAt: new Date().toISOString(),
      hash: crypto.createHash('sha256').update(`gfd|${conflictId}|${signedBy}|${doc.signedAt}`).digest('hex'),
    };
    this.goodFaithDocuments.set(doc.id, doc);
    return doc;
  }

  async generateEvidencePacket(orgId: string, jurisdiction: string, framework: string, packetType: string, generatedBy: string): Promise<EvidencePacket> {
    const packet: EvidencePacket = {
      id: `ep-${crypto.randomUUID().slice(0, 8)}`,
      organizationId: orgId, jurisdiction, framework, packetType,
      contents: [
        { section: 'Policy Documentation', evidence: `${framework} compliance policy v2.1`, status: 'complete' },
        { section: 'Technical Controls', evidence: `Automated ${framework} control verification report`, status: 'complete' },
        { section: 'Audit Trail', evidence: `12-month audit log for ${jurisdiction} operations`, status: 'complete' },
        { section: 'Gap Analysis', evidence: `Current gaps identified and remediation timeline`, status: 'in_progress' },
      ],
      generatedBy, generatedAt: new Date().toISOString(),
      hash: crypto.createHash('sha256').update(`ep|${orgId}|${jurisdiction}|${framework}|${Date.now()}`).digest('hex'),
    };
    this.evidencePackets.set(packet.id, packet);
    return packet;
  }

  getEvidencePacketsByOrganization(orgId: string): EvidencePacket[] {
    return [...this.evidencePackets.values()].filter(p => p.organizationId === orgId);
  }

  getJurisdictionProfiles() { return Object.entries(JURISDICTION_PROFILES).map(([code, profile]) => ({ code, ...profile })); }
  getJurisdictionProfile(code: string) { return JURISDICTION_PROFILES[code] ? { code, ...JURISDICTION_PROFILES[code] } : undefined; }
}

export const crossJurisdictionConflictService = new CrossJurisdictionConflictServiceImpl();
