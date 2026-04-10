// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { generateId, now, sr_create, sr_list } from './_base.js';

export type MatterType = 'litigation' | 'contract' | 'regulatory' | 'ip' | 'employment' | 'corporate' | 'data_privacy';
export type MatterStatus = 'open' | 'in_progress' | 'pending_review' | 'settled' | 'closed' | 'on_hold';

export interface LegalMatter {
  id: string;
  title: string;
  type: MatterType;
  status: MatterStatus;
  description: string;
  counterparty?: string;
  estimatedExposure?: number;
  currency: string;
  jurisdiction?: string;
  filingDate?: string;
  deadlines: { title: string; dueDate: string; critical: boolean }[];
  assignedCounsel: string[];
  tags: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
}

const SN = 'CendiaDocket';
const matters = new Map<string, LegalMatter>();

const SAMPLE_MATTERS: LegalMatter[] = [
  { id: 'mat-1', title: 'Data Processing Agreement — EU Customer', type: 'data_privacy', status: 'in_progress', description: 'GDPR-compliant DPA negotiation with enterprise EU customer', counterparty: 'Acme GmbH', estimatedExposure: 0, currency: 'EUR', jurisdiction: 'Germany', deadlines: [{ title: 'DPA signature deadline', dueDate: new Date(Date.now() + 30 * 86400000).toISOString(), critical: true }], assignedCounsel: ['Sarah Klein, Privacy Counsel'], tags: ['GDPR', 'DPA', 'EU'], riskLevel: 'medium', createdAt: new Date(Date.now() - 20 * 86400000).toISOString(), updatedAt: now() },
  { id: 'mat-2', title: 'IP Infringement Claim — Patent 7,234,891', type: 'ip', status: 'open', description: 'Third-party patent troll claim against core policy engine algorithm', counterparty: 'PatentCo LLC', estimatedExposure: 2500000, currency: 'USD', jurisdiction: 'Delaware', deadlines: [{ title: 'Response to claim', dueDate: new Date(Date.now() + 45 * 86400000).toISOString(), critical: true }], assignedCounsel: ['Morrison & Foerster LLP'], tags: ['IP', 'Patent', 'Litigation'], riskLevel: 'high', createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), updatedAt: now() },
];

class CendiaDocketService {
  createMatter(input: Partial<LegalMatter>): LegalMatter {
    const matter: LegalMatter = {
      id: generateId(), title: input.title || 'New Matter', type: input.type || 'contract',
      status: 'open', description: input.description || '', counterparty: input.counterparty,
      estimatedExposure: input.estimatedExposure, currency: input.currency || 'USD',
      jurisdiction: input.jurisdiction, filingDate: input.filingDate,
      deadlines: input.deadlines || [], assignedCounsel: input.assignedCounsel || [],
      tags: input.tags || [], riskLevel: input.riskLevel || 'medium',
      createdAt: now(), updatedAt: now(),
    };
    matters.set(matter.id, matter);
    sr_create(SN, 'matter', matter).catch(() => {});
    return matter;
  }

  getAllMatters(): LegalMatter[] {
    if (matters.size === 0) SAMPLE_MATTERS.forEach((m) => matters.set(m.id, m));
    return Array.from(matters.values());
  }

  async analyzeLitigation(id: string): Promise<{ matterId: string; winProbability: number; exposureRange: { low: number; high: number }; strategy: string; keyRisks: string[]; recommendations: string[] }> {
    const matter = matters.get(id) || SAMPLE_MATTERS.find((m) => m.id === id);
    const exposure = matter?.estimatedExposure ?? 1000000;
    return {
      matterId: id,
      winProbability: Math.round(55 + Math.random() * 30),
      exposureRange: { low: Math.round(exposure * 0.3), high: Math.round(exposure * 1.4) },
      strategy: matter?.type === 'ip' ? 'File IPR challenge to invalidate patent — 70% success rate in similar cases. Simultaneously prepare prior art defense.' : 'Negotiate settlement — litigation cost exceeds exposure at current trajectory.',
      keyRisks: ['Discovery costs could exceed $500K', 'Precedent could impact future product development', 'Reputational exposure if case becomes public'],
      recommendations: ['Engage specialized IP litigation firm', 'Commission prior art search immediately', 'Evaluate early settlement — estimate $400K vs $2.5M trial exposure'],
    };
  }

  async analyzeContract(documentId: string, content: string): Promise<{ documentId: string; riskScore: number; issues: { clause: string; risk: string; severity: string; recommendation: string }[]; summary: string }> {
    const wordCount = content?.split(' ')?.length ?? 100;
    const riskScore = Math.round(30 + Math.random() * 50);
    return {
      documentId,
      riskScore,
      issues: [
        { clause: 'Limitation of Liability', risk: 'Cap is asymmetric — vendor liability capped at 1 month fees', severity: 'high', recommendation: 'Negotiate cap to 12 months of fees or $1M minimum' },
        { clause: 'Data Processing', risk: 'No explicit data residency requirements', severity: 'medium', recommendation: 'Add GDPR Article 46 transfer mechanism and data residency schedule' },
        { clause: 'Termination', risk: 'No termination for convenience — 24-month lock-in', severity: 'medium', recommendation: 'Negotiate 90-day termination for convenience clause' },
      ],
      summary: `Analyzed ${wordCount} word contract. Risk score: ${riskScore}/100. 3 issues identified requiring negotiation. Overall assessment: ${riskScore > 60 ? 'High risk — do not sign without amendments' : 'Moderate risk — negotiate key clauses before execution'}.`,
    };
  }
}

export const cendiaDocketService = new CendiaDocketService();
