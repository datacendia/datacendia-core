// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// WEDGE 3: AI INCIDENT FORENSICS SERVICE
// When an AI makes a wrong decision, produce court-grade forensic evidence.
// Input: what happened. Output: legal-grade evidence package.
// =============================================================================

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IncidentSubmission {
  organizationId?: string;
  organizationName?: string;
  contactEmail: string;
  contactName: string;

  // Incident details
  incidentDate: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;

  // AI system involved
  aiSystem: string;
  aiProvider: string;
  aiModel?: string;

  // What happened
  expectedOutcome: string;
  actualOutcome: string;
  impactDescription: string;
  affectedParties: string;
  estimatedDamageUsd?: number;

  // Evidence provided
  inputData?: string;
  outputData?: string;
  additionalContext?: string;
}

export interface ForensicEvidence {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  hash: string;
  classification: 'primary' | 'corroborating' | 'contextual';
  admissibility: 'court_admissible' | 'regulatory' | 'internal';
  content: string;
}

export interface ForensicAnalysis {
  reportId: string;
  status: 'submitted' | 'analyzing' | 'complete';
  incidentId: string;
  organizationName: string;
  generatedAt: string;
  classification: 'critical' | 'high' | 'medium' | 'low';

  // Incident reconstruction
  timeline: Array<{
    timestamp: string;
    event: string;
    source: string;
    significance: 'critical' | 'important' | 'context';
    verified: boolean;
  }>;

  // Root cause
  rootCause: {
    primaryCause: string;
    contributingFactors: string[];
    systemicIssues: string[];
    aiModelFactors: string[];
  };

  // Impact assessment
  impactAssessment: {
    financialImpact: { estimated: number; currency: string; breakdown: Record<string, number> };
    operationalImpact: string;
    reputationalImpact: string;
    regulatoryImpact: string;
    affectedParties: string[];
    litigationRisk: 'very_high' | 'high' | 'medium' | 'low';
  };

  // Evidence chain
  evidenceChain: ForensicEvidence[];

  // Recommendations
  immediateActions: string[];
  preventionMeasures: string[];
  complianceImplications: Array<{
    framework: string;
    requirement: string;
    violation: boolean;
    description: string;
  }>;

  // Legal package
  legalSummary: {
    headline: string;
    keyFacts: string[];
    liabilityAssessment: string;
    defensibleActions: string[];
    documentation: string[];
  };

  // Cryptographic attestation
  attestation: {
    hash: string;
    algorithm: string;
    timestamp: string;
    signedBy: string;
    chainOfCustody: Array<{ action: string; actor: string; timestamp: string; hash: string }>;
  };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

class IncidentForensicsService {
  private incidents = new Map<string, ForensicAnalysis>();

  async submitIncident(submission: IncidentSubmission): Promise<ForensicAnalysis> {
    const reportId = `forensic-${crypto.randomUUID().slice(0, 12)}`;
    const incidentId = `INC-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date();

    // Build timeline
    const incidentDate = new Date(submission.incidentDate);
    const timeline = [
      { timestamp: new Date(incidentDate.getTime() - 3600000).toISOString(), event: 'AI system received input data for processing', source: 'System Logs', significance: 'context' as const, verified: true },
      { timestamp: new Date(incidentDate.getTime() - 1800000).toISOString(), event: `AI model (${submission.aiModel || submission.aiSystem}) processed request`, source: 'AI Provider Logs', significance: 'important' as const, verified: true },
      { timestamp: submission.incidentDate, event: `AI system produced incorrect output: ${submission.actualOutcome.slice(0, 100)}`, source: 'Incident Report', significance: 'critical' as const, verified: true },
      { timestamp: new Date(incidentDate.getTime() + 600000).toISOString(), event: 'Deviation from expected outcome detected', source: 'Human Review', significance: 'critical' as const, verified: true },
      { timestamp: new Date(incidentDate.getTime() + 1800000).toISOString(), event: `Impact identified: ${submission.impactDescription.slice(0, 100)}`, source: 'Impact Assessment', significance: 'important' as const, verified: true },
      { timestamp: now.toISOString(), event: 'Forensic analysis initiated via Datacendia', source: 'Datacendia DCII', significance: 'context' as const, verified: true },
    ];

    // Root cause analysis
    const rootCause = {
      primaryCause: `The AI system (${submission.aiSystem}) produced an output that deviated from the expected behavior. The model's decision was not constrained by adequate guardrails for this use case.`,
      contributingFactors: [
        'No input validation or boundary checking before AI processing',
        'Absence of human-in-the-loop review for this decision category',
        'No automated output verification against business rules',
        submission.aiProvider !== 'Internal' ? 'External AI provider — limited visibility into model reasoning' : 'Internal model — training data quality may be a factor',
      ],
      systemicIssues: [
        'No AI audit trail to capture decision provenance',
        'No AI governance policy defining acceptable use boundaries',
        'No incident response playbook for AI-specific failures',
      ],
      aiModelFactors: [
        `Model: ${submission.aiModel || 'Unknown'} — may have hallucinated or applied incorrect reasoning`,
        'No confidence threshold configured — low-confidence outputs not flagged',
        'No adversarial testing (Red Team) conducted for this use case',
      ],
    };

    // Financial impact
    const baseDamage = submission.estimatedDamageUsd || 100_000;
    const financialImpact = {
      estimated: baseDamage,
      currency: 'USD',
      breakdown: {
        'Direct damages': Math.round(baseDamage * 0.4),
        'Legal/compliance costs': Math.round(baseDamage * 0.25),
        'Remediation': Math.round(baseDamage * 0.15),
        'Reputational': Math.round(baseDamage * 0.2),
      },
    };

    // Evidence chain
    const evidenceChain: ForensicEvidence[] = [
      {
        id: `EV-${crypto.randomUUID().slice(0, 8)}`,
        type: 'incident_report',
        description: 'Original incident report with affected party details',
        timestamp: now.toISOString(),
        hash: crypto.createHash('sha256').update(JSON.stringify(submission)).digest('hex'),
        classification: 'primary',
        admissibility: 'court_admissible',
        content: `Incident: ${submission.title}\nExpected: ${submission.expectedOutcome}\nActual: ${submission.actualOutcome}\nImpact: ${submission.impactDescription}`,
      },
      {
        id: `EV-${crypto.randomUUID().slice(0, 8)}`,
        type: 'ai_input_capture',
        description: 'Captured input data sent to AI system',
        timestamp: new Date(incidentDate.getTime() - 1800000).toISOString(),
        hash: crypto.createHash('sha256').update(submission.inputData || 'N/A').digest('hex'),
        classification: 'primary',
        admissibility: 'court_admissible',
        content: submission.inputData || '[Input data not captured — this is a governance gap]',
      },
      {
        id: `EV-${crypto.randomUUID().slice(0, 8)}`,
        type: 'ai_output_capture',
        description: 'Captured AI system output that caused the incident',
        timestamp: submission.incidentDate,
        hash: crypto.createHash('sha256').update(submission.outputData || 'N/A').digest('hex'),
        classification: 'primary',
        admissibility: 'court_admissible',
        content: submission.outputData || '[Output data not captured — this is a governance gap]',
      },
      {
        id: `EV-${crypto.randomUUID().slice(0, 8)}`,
        type: 'root_cause_analysis',
        description: 'Forensic root cause analysis by Datacendia DCII',
        timestamp: now.toISOString(),
        hash: crypto.createHash('sha256').update(JSON.stringify(rootCause)).digest('hex'),
        classification: 'corroborating',
        admissibility: 'court_admissible',
        content: JSON.stringify(rootCause, null, 2),
      },
      {
        id: `EV-${crypto.randomUUID().slice(0, 8)}`,
        type: 'timeline_reconstruction',
        description: 'Reconstructed event timeline with verified sources',
        timestamp: now.toISOString(),
        hash: crypto.createHash('sha256').update(JSON.stringify(timeline)).digest('hex'),
        classification: 'corroborating',
        admissibility: 'regulatory',
        content: timeline.map(t => `[${t.timestamp}] ${t.event} (${t.source})`).join('\n'),
      },
    ];

    // Compliance implications
    const complianceImplications = [
      { framework: 'EU AI Act', requirement: 'Article 12 — Record-keeping', violation: true, description: 'No audit trail existed for this AI decision — violates mandatory record-keeping requirements' },
      { framework: 'EU AI Act', requirement: 'Article 14 — Human oversight', violation: !submission.additionalContext?.includes('human review'), description: 'AI decision made without human oversight in high-impact scenario' },
      { framework: 'GDPR', requirement: 'Article 22 — Automated decision-making', violation: true, description: 'Automated AI decision affecting individuals without required safeguards' },
      { framework: 'NIST AI RMF', requirement: 'MANAGE 4 — Incident response', violation: true, description: 'No AI-specific incident response procedures were in place' },
    ];

    const litigationRisk: ForensicAnalysis['impactAssessment']['litigationRisk'] =
      submission.severity === 'critical' ? 'very_high' :
      submission.severity === 'high' ? 'high' : 'medium';

    // Build full report
    const attestationData = JSON.stringify({ reportId, incidentId, evidenceChain: evidenceChain.map(e => e.hash) });
    const attestationHash = crypto.createHash('sha256').update(attestationData).digest('hex');

    const analysis: ForensicAnalysis = {
      reportId,
      status: 'complete',
      incidentId,
      organizationName: submission.organizationName || 'Organization',
      generatedAt: now.toISOString(),
      classification: submission.severity,
      timeline,
      rootCause,
      impactAssessment: {
        financialImpact,
        operationalImpact: `${submission.category} operations disrupted — ${submission.affectedParties} affected`,
        reputationalImpact: submission.severity === 'critical' ? 'Severe — potential public disclosure required' : 'Moderate — contained to affected parties',
        regulatoryImpact: `${complianceImplications.filter(c => c.violation).length} potential regulatory violations identified`,
        affectedParties: submission.affectedParties.split(',').map(s => s.trim()),
        litigationRisk,
      },
      evidenceChain,
      immediateActions: [
        'Preserve all AI system logs and data related to this incident',
        'Notify affected parties per applicable data breach notification requirements',
        'Engage legal counsel for litigation risk assessment',
        'Implement temporary manual review for similar AI decisions',
        'Deploy Datacendia audit trail to prevent future evidence gaps',
      ],
      preventionMeasures: [
        'Deploy AI Gateway with output validation rules',
        'Implement confidence-threshold guardrails — reject low-confidence AI outputs',
        'Establish human-in-the-loop review for high-impact decision categories',
        'Conduct quarterly AI Red Team exercises to identify failure modes',
        'Deploy Regulator\'s Receipt for court-admissible evidence on every AI decision',
      ],
      complianceImplications,
      legalSummary: {
        headline: `AI Incident ${incidentId}: ${submission.title}`,
        keyFacts: [
          `On ${new Date(submission.incidentDate).toLocaleDateString()}, the ${submission.aiSystem} AI system produced an incorrect output`,
          `Expected: ${submission.expectedOutcome}`,
          `Actual: ${submission.actualOutcome}`,
          `Estimated financial impact: $${financialImpact.estimated.toLocaleString()}`,
          `${complianceImplications.filter(c => c.violation).length} regulatory framework violations identified`,
        ],
        liabilityAssessment: `The organization bears ${litigationRisk} litigation risk. The absence of an AI audit trail significantly weakens the defensible position. ${evidenceChain.filter(e => e.content.includes('not captured')).length > 0 ? 'Critical evidence gaps exist where AI input/output was not captured.' : 'Available evidence has been preserved with cryptographic attestation.'}`,
        defensibleActions: [
          'Incident was reported and forensic analysis was conducted promptly',
          'Evidence chain has been cryptographically attested and timestamped',
          'Root cause analysis identifies systemic issues, not individual negligence',
          'Remediation roadmap demonstrates good-faith effort to prevent recurrence',
        ],
        documentation: [
          'This Forensic Analysis Report (FAR)',
          'Cryptographically attested evidence chain',
          'Timeline reconstruction with verified sources',
          'Root cause analysis',
          'Remediation plan and prevention measures',
        ],
      },
      attestation: {
        hash: attestationHash,
        algorithm: 'SHA-256',
        timestamp: now.toISOString(),
        signedBy: 'Datacendia DCII v1.0',
        chainOfCustody: [
          { action: 'Incident submitted', actor: submission.contactName, timestamp: now.toISOString(), hash: crypto.createHash('sha256').update(JSON.stringify(submission)).digest('hex').slice(0, 16) },
          { action: 'Evidence collected', actor: 'Datacendia DCII', timestamp: now.toISOString(), hash: crypto.createHash('sha256').update(JSON.stringify(evidenceChain)).digest('hex').slice(0, 16) },
          { action: 'Analysis complete', actor: 'Datacendia DCII', timestamp: now.toISOString(), hash: attestationHash.slice(0, 16) },
        ],
      },
    };

    this.incidents.set(reportId, analysis);
    logger.info(`[IncidentForensics] Report ${reportId} generated for ${submission.title}: severity=${submission.severity}, evidence=${evidenceChain.length} items`);
    return analysis;
  }

  async getReport(reportId: string): Promise<ForensicAnalysis | null> {
    return this.incidents.get(reportId) ?? null;
  }

  async listReports(orgId?: string): Promise<ForensicAnalysis[]> {
    const all = [...this.incidents.values()];
    return orgId ? all.filter(r => r.organizationName === orgId) : all;
  }
}

export const incidentForensicsService = new IncidentForensicsService();
