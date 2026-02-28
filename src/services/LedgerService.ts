// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA LEDGER™ — IMMUTABLE DECISION BLOCKCHAIN
// First AI decision provenance for regulatory audit
// Every Council deliberation, vote, veto, and confidence score recorded
// =============================================================================

import { hashSync } from '../lib/algorithms/crypto';

// =============================================================================
// TYPES
// =============================================================================

export type LedgerEventType =
  | 'decision.proposed'
  | 'decision.deliberated'
  | 'decision.voted'
  | 'decision.vetoed'
  | 'decision.approved'
  | 'decision.executed'
  | 'decision.outcome_recorded'
  | 'agent.joined'
  | 'agent.contributed'
  | 'agent.voted'
  | 'agent.vetoed'
  | 'confidence.updated'
  | 'evidence.attached'
  | 'audit.requested'
  | 'audit.completed'
  | 'compliance.check'
  | 'override.requested'
  | 'override.approved'
  | 'override.denied';

export type ComplianceFramework =
  | 'GDPR'
  | 'SOX'
  | 'HIPAA'
  | 'PCI-DSS'
  | 'ISO27001'
  | 'SOC2'
  | 'CCPA'
  | 'NIST';

export interface LedgerEntry {
  id: string;
  sequence: number;
  timestamp: Date;
  eventType: LedgerEventType;

  // Entity references
  decisionId: string;
  organizationId: string;
  userId?: string;
  agentId?: string;

  // Event data
  title: string;
  description: string;
  data: Record<string, any>;

  // Confidence & voting
  confidenceScore?: number;
  vote?: 'approve' | 'reject' | 'abstain' | 'veto';
  voteWeight?: number;

  // Chain integrity
  previousHash: string;
  hash: string;
  signature?: string;

  // Compliance
  complianceFrameworks: ComplianceFramework[];
  retentionPeriodDays: number;
  sensitivityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  piiInvolved: boolean;

  // Verification
  verified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface DecisionRecord {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  proposedAt: Date;
  status: 'proposed' | 'deliberating' | 'voting' | 'approved' | 'rejected' | 'vetoed' | 'executed';

  // Participants
  agents: string[];
  voters: { agentId: string; vote: string; confidence: number; timestamp: Date }[];

  // Outcome
  finalConfidence?: number;
  outcome?: string;
  outcomeRecordedAt?: Date;

  // Ledger
  ledgerEntries: string[]; // Entry IDs
  firstEntryHash: string;
  latestEntryHash: string;

  // Compliance
  complianceStatus: 'pending' | 'compliant' | 'review_needed' | 'violation';
  auditHistory: AuditRecord[];
}

export interface AuditRecord {
  id: string;
  requestedAt: Date;
  requestedBy: string;
  reason: string;
  framework: ComplianceFramework;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  findings: AuditFinding[];
  completedAt?: Date;
  report?: string;
}

export interface AuditFinding {
  id: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  remediation?: string;
  resolved: boolean;
}

export interface LedgerMetrics {
  totalEntries: number;
  totalDecisions: number;
  entriesByType: Record<LedgerEventType, number>;
  entriesByFramework: Record<ComplianceFramework, number>;
  averageConfidence: number;
  vetoRate: number;
  approvalRate: number;
  chainIntegrity: 'valid' | 'broken' | 'unknown';
  lastVerifiedAt?: Date;
  piiEntriesCount: number;
  pendingAudits: number;
}

export interface ChainVerificationResult {
  valid: boolean;
  entriesChecked: number;
  brokenAt?: number;
  brokenEntryId?: string;
  message: string;
}

// =============================================================================
// STORAGE KEY
// =============================================================================

const STORAGE_KEY = 'datacendia_ledger_service';

// =============================================================================
// HASH FUNCTION
// =============================================================================
// Uses FNV-1a + MurmurHash3 finalizer (4 rounds → 256-bit equivalent).
// Produces 64-char hex string with excellent collision resistance.
// For async crypto-grade hashing, use sha256() from lib/algorithms/crypto.

function generateHash(data: string): string {
  return hashSync(data);
}

function createEntryHash(entry: Omit<LedgerEntry, 'hash'>): string {
  const data = JSON.stringify({
    id: entry.id,
    sequence: entry.sequence,
    timestamp: entry.timestamp.toISOString(),
    eventType: entry.eventType,
    decisionId: entry.decisionId,
    previousHash: entry.previousHash,
    data: entry.data,
  });
  return generateHash(data);
}

// =============================================================================
// LEDGER SERVICE
// =============================================================================

class LedgerService {
  private entries: Map<string, LedgerEntry> = new Map();
  private decisions: Map<string, DecisionRecord> = new Map();
  private sequence: number = 0;
  private genesisHash: string = '0000000000000000';

  constructor() {
    this.loadFromStorage();
    // Seed demo data if empty
    if (this.entries.size === 0 && this.decisions.size === 0) {
      this.seedMarketingDemoData();
    }
  }

  // ---------------------------------------------------------------------------
  // MARKETING DEMO DATA
  // ---------------------------------------------------------------------------

  private seedMarketingDemoData(): void {
    const now = new Date();
    const day = 24 * 60 * 60 * 1000;

    // Create marketing demo decisions
    const demoDecisions: Array<{
      id: string;
      title: string;
      description: string;
      company: string;
      agents: string[];
      status: DecisionRecord['status'];
      finalConfidence: number;
      daysAgo: number;
    }> = [
      {
        id: 'decision-sterling-cyber',
        title: 'Sterling Insurance - Cyber Market Entry',
        description: 'Strategic decision to enter cyber insurance market with $180M capital allocation',
        company: 'Sterling Insurance',
        agents: ['cfo-agent', 'risk-agent', 'strategy-agent', 'compliance-agent', 'actuary-agent'],
        status: 'approved',
        finalConfidence: 87,
        daysAgo: 2,
      },
      {
        id: 'decision-nordic-sovereign',
        title: 'Nordic Financial - Sovereign Deployment',
        description: 'Air-gapped on-premise deployment decision for regulatory compliance',
        company: 'Nordic Financial',
        agents: ['cto-agent', 'security-agent', 'compliance-agent', 'legal-agent'],
        status: 'approved',
        finalConfidence: 92,
        daysAgo: 5,
      },
      {
        id: 'decision-atlas-acquisition',
        title: 'Atlas Manufacturing - Vertex Acquisition',
        description: '$412M acquisition of Vertex Technology Solutions for IoT capabilities',
        company: 'Atlas Manufacturing',
        agents: ['ceo-agent', 'cfo-agent', 'strategy-agent', 'legal-agent', 'hr-agent'],
        status: 'approved',
        finalConfidence: 78,
        daysAgo: 8,
      },
      {
        id: 'decision-quantum-transition',
        title: 'Quantum Energy - Grid Transition',
        description: 'Accelerated renewable energy transition with $500M investment',
        company: 'Quantum Energy',
        agents: ['ceo-agent', 'cfo-agent', 'operations-agent', 'esg-agent', 'risk-agent'],
        status: 'approved',
        finalConfidence: 76,
        daysAgo: 12,
      },
      {
        id: 'decision-nexus-pricing',
        title: 'Nexus Retail - Tiered Pricing Model',
        description: 'Implementation of Good/Better/Best pricing structure',
        company: 'Nexus Retail',
        agents: ['cmo-agent', 'cfo-agent', 'sales-agent', 'analytics-agent'],
        status: 'approved',
        finalConfidence: 84,
        daysAgo: 15,
      },
      {
        id: 'decision-meridian-pipeline',
        title: 'Meridian Healthcare - Talent Pipeline',
        description: 'Partnership with nursing schools for 2-year talent pipeline development',
        company: 'Meridian Healthcare',
        agents: ['chro-agent', 'cfo-agent', 'operations-agent', 'compliance-agent'],
        status: 'approved',
        finalConfidence: 89,
        daysAgo: 18,
      },
      {
        id: 'decision-pacific-vietnam',
        title: 'Pacific Logistics - Vietnam Hub',
        description: '$45M investment in Ho Chi Minh City distribution hub',
        company: 'Pacific Logistics',
        agents: ['coo-agent', 'cfo-agent', 'strategy-agent', 'legal-agent', 'risk-agent'],
        status: 'approved',
        finalConfidence: 74,
        daysAgo: 22,
      },
      {
        id: 'decision-review-pending',
        title: 'Sentinel Corp - Data Center Migration',
        description: 'Proposed migration of primary data center to cloud infrastructure',
        company: 'Sentinel Corp',
        agents: ['cto-agent', 'ciso-agent', 'cfo-agent', 'operations-agent'],
        status: 'deliberating',
        finalConfidence: 68,
        daysAgo: 1,
      },
    ];

    // Create decisions and their ledger entries
    demoDecisions.forEach((dd, idx) => {
      const proposedAt = new Date(now.getTime() - dd.daysAgo * day);

      const decision: DecisionRecord = {
        id: dd.id,
        title: dd.title,
        description: dd.description,
        proposedBy: 'AI Council',
        proposedAt,
        status: dd.status,
        agents: dd.agents,
        voters: dd.agents.map((agentId, vIdx) => ({
          agentId,
          vote: vIdx === 0 && dd.status === 'deliberating' ? 'abstain' : 'approve',
          confidence: dd.finalConfidence + (vIdx * 3 % 10) - 5,
          timestamp: new Date(proposedAt.getTime() + vIdx * 3600000),
        })),
        finalConfidence: dd.finalConfidence,
        ledgerEntries: [],
        firstEntryHash: '',
        latestEntryHash: '',
        complianceStatus: dd.status === 'approved' ? 'compliant' : 'pending',
        auditHistory: dd.status === 'approved' ? [{
          id: `audit-${dd.id}`,
          requestedAt: new Date(proposedAt.getTime() + day),
          requestedBy: 'Compliance Officer',
          reason: 'Regulatory compliance verification',
          framework: idx % 2 === 0 ? 'SOX' : 'SOC2',
          status: 'completed',
          findings: [],
          completedAt: new Date(proposedAt.getTime() + 2 * day),
          report: 'All compliance requirements met. No findings.',
        }] : [],
      };

      this.decisions.set(dd.id, decision);

      // Create ledger entries for each decision
      const eventSequence: Array<{
        type: LedgerEventType;
        title: string;
        desc: string;
        hoursAfter: number;
        confidence?: number;
        vote?: LedgerEntry['vote'];
        frameworks: ComplianceFramework[];
      }> = [
        { type: 'decision.proposed', title: 'Decision Proposed', desc: `${dd.title} submitted for Council deliberation`, hoursAfter: 0, frameworks: ['SOX', 'SOC2'] },
        { type: 'agent.joined', title: 'Council Convened', desc: `${dd.agents.length} agents joined deliberation`, hoursAfter: 1, frameworks: [] },
        { type: 'decision.deliberated', title: 'Deliberation Complete', desc: 'Multi-agent analysis and debate concluded', hoursAfter: 4, confidence: dd.finalConfidence - 5, frameworks: ['SOX'] },
        { type: 'agent.voted', title: 'CFO Agent Vote', desc: 'Financial impact assessment: Favorable', hoursAfter: 5, vote: 'approve', confidence: dd.finalConfidence + 2, frameworks: ['SOX'] },
        { type: 'agent.voted', title: 'Risk Agent Vote', desc: 'Risk profile assessment: Acceptable', hoursAfter: 6, vote: 'approve', confidence: dd.finalConfidence - 3, frameworks: ['SOC2'] },
        { type: 'confidence.updated', title: 'Confidence Consolidated', desc: `Final confidence: ${dd.finalConfidence}%`, hoursAfter: 7, confidence: dd.finalConfidence, frameworks: [] },
        { type: 'decision.approved', title: 'Decision Approved', desc: 'Council unanimously approved with conditions', hoursAfter: 8, vote: 'approve', confidence: dd.finalConfidence, frameworks: ['SOX', 'SOC2'] },
        { type: 'audit.completed', title: 'Compliance Audit', desc: 'Regulatory audit completed successfully', hoursAfter: 32, frameworks: ['SOX', 'SOC2'] },
      ];

      if (dd.status === 'deliberating') {
        // Only first 3 events for pending decisions
        eventSequence.splice(3);
      }

      eventSequence.forEach((evt, evtIdx) => {
        this.sequence++;
        const entryId = `entry-demo-${dd.id}-${evtIdx}`;
        const timestamp = new Date(proposedAt.getTime() + evt.hoursAfter * 3600000);

        const entryWithoutHash: Omit<LedgerEntry, 'hash'> = {
          id: entryId,
          sequence: this.sequence,
          timestamp,
          eventType: evt.type,
          decisionId: dd.id,
          organizationId: dd.company.toLowerCase().replace(/\s+/g, '-'),
          title: evt.title,
          description: evt.desc,
          data: { company: dd.company, agents: dd.agents },
          confidenceScore: evt.confidence,
          vote: evt.vote,
          previousHash: this.getLastHash(),
          complianceFrameworks: evt.frameworks,
          retentionPeriodDays: 2555,
          sensitivityLevel: 'confidential',
          piiInvolved: false,
          verified: true,
          verifiedAt: timestamp,
        };

        const entry: LedgerEntry = {
          ...entryWithoutHash,
          hash: createEntryHash(entryWithoutHash),
        };

        this.entries.set(entryId, entry);
        decision.ledgerEntries.push(entryId);

        if (evtIdx === 0) {
          decision.firstEntryHash = entry.hash;
        }
        decision.latestEntryHash = entry.hash;
      });
    });

    this.saveToStorage();
    console.log('[Ledger] Seeded marketing demo data:', this.entries.size, 'entries,', this.decisions.size, 'decisions');
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.sequence = data.sequence || 0;

        data.entries?.forEach((e: LedgerEntry) => {
          e.timestamp = new Date(e.timestamp);
          if (e.verifiedAt) {
            e.verifiedAt = new Date(e.verifiedAt);
          }
          this.entries.set(e.id, e);
        });

        data.decisions?.forEach((d: DecisionRecord) => {
          d.proposedAt = new Date(d.proposedAt);
          if (d.outcomeRecordedAt) {
            d.outcomeRecordedAt = new Date(d.outcomeRecordedAt);
          }
          d.voters.forEach((v) => (v.timestamp = new Date(v.timestamp)));
          d.auditHistory.forEach((a) => {
            a.requestedAt = new Date(a.requestedAt);
            if (a.completedAt) {
              a.completedAt = new Date(a.completedAt);
            }
          });
          this.decisions.set(d.id, d);
        });
      }
    } catch (error) {
      console.error('Failed to load ledger data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        sequence: this.sequence,
        entries: Array.from(this.entries.values()),
        decisions: Array.from(this.decisions.values()),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save ledger data:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // ENTRY CREATION
  // ---------------------------------------------------------------------------

  private getLastHash(): string {
    if (this.entries.size === 0) {
      return this.genesisHash;
    }

    const sortedEntries = Array.from(this.entries.values()).sort((a, b) => a.sequence - b.sequence);
    return sortedEntries[sortedEntries.length - 1].hash;
  }

  createEntry(
    eventType: LedgerEventType,
    decisionId: string,
    title: string,
    description: string,
    data: Record<string, any>,
    options: {
      organizationId?: string;
      userId?: string;
      agentId?: string;
      confidenceScore?: number;
      vote?: LedgerEntry['vote'];
      voteWeight?: number;
      complianceFrameworks?: ComplianceFramework[];
      sensitivityLevel?: LedgerEntry['sensitivityLevel'];
      piiInvolved?: boolean;
    } = {}
  ): LedgerEntry {
    this.sequence++;
    const id = `entry-${Date.now()}-${this.sequence}`;

    const entryWithoutHash: Omit<LedgerEntry, 'hash'> = {
      id,
      sequence: this.sequence,
      timestamp: new Date(),
      eventType,
      decisionId,
      organizationId: options.organizationId || 'default',
      userId: options.userId,
      agentId: options.agentId,
      title,
      description,
      data,
      confidenceScore: options.confidenceScore,
      vote: options.vote,
      voteWeight: options.voteWeight,
      previousHash: this.getLastHash(),
      complianceFrameworks: options.complianceFrameworks || [],
      retentionPeriodDays: 2555, // 7 years default
      sensitivityLevel: options.sensitivityLevel || 'internal',
      piiInvolved: options.piiInvolved || false,
      verified: false,
    };

    const entry: LedgerEntry = {
      ...entryWithoutHash,
      hash: createEntryHash(entryWithoutHash),
    };

    this.entries.set(id, entry);

    // Update decision record
    const decision = this.decisions.get(decisionId);
    if (decision) {
      decision.ledgerEntries.push(id);
      decision.latestEntryHash = entry.hash;
    }

    this.saveToStorage();
    return entry;
  }

  // ---------------------------------------------------------------------------
  // DECISION MANAGEMENT
  // ---------------------------------------------------------------------------

  createDecision(
    title: string,
    description: string,
    proposedBy: string,
    agents: string[]
  ): DecisionRecord {
    const id = `decision-${Date.now()}`;

    const decision: DecisionRecord = {
      id,
      title,
      description,
      proposedBy,
      proposedAt: new Date(),
      status: 'proposed',
      agents,
      voters: [],
      ledgerEntries: [],
      firstEntryHash: '',
      latestEntryHash: '',
      complianceStatus: 'pending',
      auditHistory: [],
    };

    this.decisions.set(id, decision);

    // Create initial ledger entry
    const entry = this.createEntry(
      'decision.proposed',
      id,
      `Decision Proposed: ${title}`,
      description,
      { proposedBy, agents },
      { userId: proposedBy }
    );

    decision.firstEntryHash = entry.hash;
    decision.latestEntryHash = entry.hash;

    this.saveToStorage();
    return decision;
  }

  recordDeliberation(
    decisionId: string,
    agentId: string,
    contribution: string,
    confidenceScore: number
  ): LedgerEntry {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    decision.status = 'deliberating';

    return this.createEntry(
      'agent.contributed',
      decisionId,
      `Agent Contribution`,
      contribution,
      { agentId, contribution },
      { agentId, confidenceScore }
    );
  }

  recordVote(
    decisionId: string,
    agentId: string,
    vote: 'approve' | 'reject' | 'abstain' | 'veto',
    confidence: number,
    reasoning: string
  ): LedgerEntry {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    decision.status = 'voting';
    decision.voters.push({ agentId, vote, confidence, timestamp: new Date() });

    const eventType: LedgerEventType = vote === 'veto' ? 'agent.vetoed' : 'agent.voted';

    return this.createEntry(
      eventType,
      decisionId,
      `Vote: ${vote.toUpperCase()}`,
      reasoning,
      { agentId, vote, confidence, reasoning },
      { agentId, vote, confidenceScore: confidence, voteWeight: 1 }
    );
  }

  finalizeDecision(
    decisionId: string,
    status: 'approved' | 'rejected' | 'vetoed',
    finalConfidence: number
  ): LedgerEntry {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    decision.status = status;
    decision.finalConfidence = finalConfidence;

    const eventType: LedgerEventType =
      status === 'vetoed'
        ? 'decision.vetoed'
        : status === 'approved'
          ? 'decision.approved'
          : 'decision.voted';

    return this.createEntry(
      eventType,
      decisionId,
      `Decision ${status.toUpperCase()}`,
      `Final confidence: ${finalConfidence}%`,
      { status, finalConfidence, voterSummary: decision.voters },
      { confidenceScore: finalConfidence }
    );
  }

  recordOutcome(decisionId: string, outcome: string, metrics?: Record<string, any>): LedgerEntry {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    decision.outcome = outcome;
    decision.outcomeRecordedAt = new Date();

    return this.createEntry(
      'decision.outcome_recorded',
      decisionId,
      'Outcome Recorded',
      outcome,
      { outcome, metrics },
      {}
    );
  }

  // ---------------------------------------------------------------------------
  // CHAIN VERIFICATION
  // ---------------------------------------------------------------------------

  verifyChain(): ChainVerificationResult {
    const sortedEntries = Array.from(this.entries.values()).sort((a, b) => a.sequence - b.sequence);

    if (sortedEntries.length === 0) {
      return { valid: true, entriesChecked: 0, message: 'Empty chain is valid' };
    }

    let previousHash = this.genesisHash;

    for (let i = 0; i < sortedEntries.length; i++) {
      const entry = sortedEntries[i];

      // Verify previous hash link
      if (entry.previousHash !== previousHash) {
        return {
          valid: false,
          entriesChecked: i,
          brokenAt: entry.sequence,
          brokenEntryId: entry.id,
          message: `Chain broken at sequence ${entry.sequence}: previousHash mismatch`,
        };
      }

      // Verify entry hash
      const { hash: _, ...entryWithoutHash } = entry;
      const expectedHash = createEntryHash(entryWithoutHash as Omit<LedgerEntry, 'hash'>);

      if (entry.hash !== expectedHash) {
        return {
          valid: false,
          entriesChecked: i,
          brokenAt: entry.sequence,
          brokenEntryId: entry.id,
          message: `Chain broken at sequence ${entry.sequence}: hash verification failed`,
        };
      }

      previousHash = entry.hash;
    }

    return {
      valid: true,
      entriesChecked: sortedEntries.length,
      message: `All ${sortedEntries.length} entries verified successfully`,
    };
  }

  verifyEntry(entryId: string): boolean {
    const entry = this.entries.get(entryId);
    if (!entry) {
      return false;
    }

    const { hash: _, ...entryWithoutHash } = entry;
    const expectedHash = createEntryHash(entryWithoutHash as Omit<LedgerEntry, 'hash'>);

    const valid = entry.hash === expectedHash;

    if (valid && !entry.verified) {
      entry.verified = true;
      entry.verifiedAt = new Date();
      this.saveToStorage();
    }

    return valid;
  }

  // ---------------------------------------------------------------------------
  // AUDIT
  // ---------------------------------------------------------------------------

  requestAudit(
    decisionId: string,
    requestedBy: string,
    reason: string,
    framework: ComplianceFramework
  ): AuditRecord {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    const audit: AuditRecord = {
      id: `audit-${Date.now()}`,
      requestedAt: new Date(),
      requestedBy,
      reason,
      framework,
      status: 'pending',
      findings: [],
    };

    decision.auditHistory.push(audit);

    // Create ledger entry for audit request
    this.createEntry(
      'audit.requested',
      decisionId,
      'Audit Requested',
      reason,
      { framework, requestedBy },
      { userId: requestedBy, complianceFrameworks: [framework] }
    );

    this.saveToStorage();
    return audit;
  }

  completeAudit(
    decisionId: string,
    auditId: string,
    findings: AuditFinding[],
    report: string
  ): AuditRecord | null {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      return null;
    }

    const audit = decision.auditHistory.find((a) => a.id === auditId);
    if (!audit) {
      return null;
    }

    audit.status = 'completed';
    audit.completedAt = new Date();
    audit.findings = findings;
    audit.report = report;

    // Update compliance status
    const criticalFindings = findings.filter(
      (f) => f.severity === 'critical' || f.severity === 'high'
    );
    decision.complianceStatus = criticalFindings.length > 0 ? 'review_needed' : 'compliant';

    // Create ledger entry for audit completion
    this.createEntry(
      'audit.completed',
      decisionId,
      'Audit Completed',
      `${findings.length} findings, ${criticalFindings.length} critical/high`,
      { auditId, findingsCount: findings.length, report },
      { complianceFrameworks: [audit.framework] }
    );

    this.saveToStorage();
    return audit;
  }

  // ---------------------------------------------------------------------------
  // DATA ACCESS
  // ---------------------------------------------------------------------------

  getEntry(id: string): LedgerEntry | undefined {
    return this.entries.get(id);
  }

  getAllEntries(): LedgerEntry[] {
    return Array.from(this.entries.values()).sort((a, b) => b.sequence - a.sequence);
  }

  getEntriesForDecision(decisionId: string): LedgerEntry[] {
    return this.getAllEntries().filter((e) => e.decisionId === decisionId);
  }

  getDecision(id: string): DecisionRecord | undefined {
    return this.decisions.get(id);
  }

  getAllDecisions(): DecisionRecord[] {
    return Array.from(this.decisions.values()).sort(
      (a, b) => b.proposedAt.getTime() - a.proposedAt.getTime()
    );
  }

  searchEntries(query: {
    eventType?: LedgerEventType;
    startDate?: Date;
    endDate?: Date;
    agentId?: string;
    complianceFramework?: ComplianceFramework;
    piiOnly?: boolean;
  }): LedgerEntry[] {
    return this.getAllEntries().filter((e) => {
      if (query.eventType && e.eventType !== query.eventType) {
        return false;
      }
      if (query.startDate && e.timestamp < query.startDate) {
        return false;
      }
      if (query.endDate && e.timestamp > query.endDate) {
        return false;
      }
      if (query.agentId && e.agentId !== query.agentId) {
        return false;
      }
      if (
        query.complianceFramework &&
        !e.complianceFrameworks.includes(query.complianceFramework)
      ) {
        return false;
      }
      if (query.piiOnly && !e.piiInvolved) {
        return false;
      }
      return true;
    });
  }

  // ---------------------------------------------------------------------------
  // EXPORT
  // ---------------------------------------------------------------------------

  exportForAudit(decisionId: string): string {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    const entries = this.getEntriesForDecision(decisionId);
    const verification = this.verifyChain();

    const report = {
      exportedAt: new Date().toISOString(),
      chainIntegrity: verification,
      decision: {
        ...decision,
        proposedAt: decision.proposedAt.toISOString(),
        outcomeRecordedAt: decision.outcomeRecordedAt?.toISOString(),
      },
      entries: entries.map((e) => ({
        ...e,
        timestamp: e.timestamp.toISOString(),
        verifiedAt: e.verifiedAt?.toISOString(),
      })),
      entryCount: entries.length,
      hashChain: entries.map((e) => ({ sequence: e.sequence, hash: e.hash })),
    };

    return JSON.stringify(report, null, 2);
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): LedgerMetrics {
    const entries = this.getAllEntries();
    const decisions = this.getAllDecisions();

    const entriesByType: Record<LedgerEventType, number> = {} as any;
    const entriesByFramework: Record<ComplianceFramework, number> = {
      GDPR: 0,
      SOX: 0,
      HIPAA: 0,
      'PCI-DSS': 0,
      ISO27001: 0,
      SOC2: 0,
      CCPA: 0,
      NIST: 0,
    };

    let totalConfidence = 0;
    let confidenceCount = 0;
    let vetoCount = 0;
    let approveCount = 0;
    let piiCount = 0;

    entries.forEach((e) => {
      entriesByType[e.eventType] = (entriesByType[e.eventType] || 0) + 1;
      e.complianceFrameworks.forEach((f) => entriesByFramework[f]++);

      if (e.confidenceScore !== undefined) {
        totalConfidence += e.confidenceScore;
        confidenceCount++;
      }

      if (e.vote === 'veto') {
        vetoCount++;
      }
      if (e.vote === 'approve') {
        approveCount++;
      }
      if (e.piiInvolved) {
        piiCount++;
      }
    });

    const verification = this.verifyChain();
    const pendingAudits = decisions.reduce(
      (sum, d) =>
        sum +
        d.auditHistory.filter((a) => a.status === 'pending' || a.status === 'in_progress').length,
      0
    );

    return {
      totalEntries: entries.length,
      totalDecisions: decisions.length,
      entriesByType,
      entriesByFramework,
      averageConfidence: confidenceCount > 0 ? Math.round(totalConfidence / confidenceCount) : 0,
      vetoRate: entries.length > 0 ? Math.round((vetoCount / entries.length) * 100) : 0,
      approvalRate: entries.length > 0 ? Math.round((approveCount / entries.length) * 100) : 0,
      chainIntegrity: verification.valid ? 'valid' : 'broken',
      lastVerifiedAt: entries.find((e) => e.verified)?.verifiedAt,
      piiEntriesCount: piiCount,
      pendingAudits,
    };
  }
}

// Singleton
export const ledgerService = new LedgerService();
export default ledgerService;
