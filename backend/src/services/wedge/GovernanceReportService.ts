// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// WEDGE 2: AI GOVERNANCE REPORT GENERATOR
// Generates board-ready AI governance reports from a questionnaire.
// Output: structured JSON that frontend renders as a beautiful report + PDF.
// =============================================================================

import crypto from 'crypto';
import { BoundedMap } from '../../utils/BoundedMap.js';
import { logger } from '../../utils/logger.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GovernanceQuestionnaire {
  // Organization
  organizationName: string;
  industry: string;
  employeeCount: number;
  annualRevenue?: string;
  regions: string[];
  contactEmail: string;
  contactName: string;

  // AI Usage
  aiSystemCount: number;
  aiUseCases: string[];
  aiProviders: string[];
  hasAIPolicy: boolean;
  hasAIInventory: boolean;
  hasAIRiskAssessment: boolean;
  hasHumanOversight: boolean;
  hasAuditTrail: boolean;

  // Compliance
  applicableFrameworks: string[];
  hasDataProtectionOfficer: boolean;
  hasDPIA: boolean;
  hasIncidentResponsePlan: boolean;
  lastSecurityAudit?: string;

  // Data
  dataClassificationPolicy: boolean;
  piiProcessing: boolean;
  crossBorderDataTransfer: boolean;
  dataRetentionPolicy: boolean;
}

export interface GovernanceReport {
  reportId: string;
  organizationName: string;
  generatedAt: string;
  reportVersion: string;
  executiveSummary: {
    overallScore: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    headline: string;
    keyFindings: string[];
    immediateActions: string[];
  };
  governanceScore: {
    overall: number;
    categories: Array<{
      name: string;
      score: number;
      maxScore: number;
      status: 'pass' | 'fail' | 'partial' | 'not_assessed';
      findings: string[];
      recommendations: string[];
    }>;
  };
  aiInventory: {
    totalSystems: number;
    byRiskLevel: { high: number; medium: number; low: number; minimal: number };
    gaps: string[];
  };
  complianceMatrix: Array<{
    framework: string;
    applicability: string;
    overallCompliance: number;
    requirements: Array<{
      id: string;
      requirement: string;
      status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable';
      gap: string;
      remediation: string;
      effort: 'low' | 'medium' | 'high';
      priority: number;
    }>;
  }>;
  riskAssessment: {
    overallRisk: string;
    risks: Array<{
      id: string;
      category: string;
      description: string;
      likelihood: 'very_high' | 'high' | 'medium' | 'low';
      impact: 'critical' | 'high' | 'medium' | 'low';
      riskScore: number;
      currentControls: string;
      recommendedControls: string;
    }>;
  };
  remediationRoadmap: Array<{
    phase: string;
    timeline: string;
    actions: Array<{
      action: string;
      owner: string;
      effort: string;
      impact: string;
      frameworks: string[];
    }>;
  }>;
  boardSummary: {
    headline: string;
    riskPosture: string;
    investmentRequired: string;
    timelineToCompliance: string;
    keyMetrics: Array<{ label: string; value: string; status: string }>;
    recommendations: string[];
  };
  integrityHash: string;
}

// ---------------------------------------------------------------------------
// Framework definitions
// ---------------------------------------------------------------------------

interface FrameworkDef {
  name: string;
  requirements: Array<{
    id: string;
    requirement: string;
    checks: (q: GovernanceQuestionnaire) => 'compliant' | 'partial' | 'non_compliant';
    gap: string;
    remediation: string;
    effort: 'low' | 'medium' | 'high';
  }>;
}

const FRAMEWORKS: Record<string, FrameworkDef> = {
  'EU AI Act': {
    name: 'EU AI Act (Regulation 2024/1689)',
    requirements: [
      { id: 'AIA-9', requirement: 'Risk management system for high-risk AI', checks: (q) => q.hasAIRiskAssessment ? 'compliant' : 'non_compliant', gap: 'No AI-specific risk management system', remediation: 'Implement continuous AI risk assessment aligned with Article 9', effort: 'high' },
      { id: 'AIA-10', requirement: 'Data governance for training datasets', checks: (q) => q.dataClassificationPolicy ? 'partial' : 'non_compliant', gap: 'Training data governance not established', remediation: 'Establish data governance procedures for AI training data', effort: 'medium' },
      { id: 'AIA-12', requirement: 'Record-keeping and audit trails', checks: (q) => q.hasAuditTrail ? 'compliant' : 'non_compliant', gap: 'No automated audit trail for AI decisions', remediation: 'Deploy Datacendia Regulator\'s Receipt for court-admissible audit trails', effort: 'low' },
      { id: 'AIA-13', requirement: 'Transparency and information provision', checks: (q) => q.hasAIPolicy ? 'partial' : 'non_compliant', gap: 'AI system documentation incomplete', remediation: 'Create AI transparency documentation per Article 13 requirements', effort: 'medium' },
      { id: 'AIA-14', requirement: 'Human oversight measures', checks: (q) => q.hasHumanOversight ? 'compliant' : 'non_compliant', gap: 'No systematic human oversight of AI outputs', remediation: 'Implement human-in-the-loop review for high-risk AI decisions', effort: 'medium' },
    ],
  },
  'GDPR': {
    name: 'GDPR (Regulation 2016/679)',
    requirements: [
      { id: 'GDPR-22', requirement: 'Automated decision-making safeguards', checks: (q) => q.hasHumanOversight ? 'partial' : 'non_compliant', gap: 'No safeguards for automated AI decision-making', remediation: 'Implement right to human review for AI-automated decisions', effort: 'medium' },
      { id: 'GDPR-35', requirement: 'Data Protection Impact Assessment', checks: (q) => q.hasDPIA ? 'compliant' : 'non_compliant', gap: 'No DPIA conducted for AI systems processing personal data', remediation: 'Conduct DPIA for all AI systems processing personal data', effort: 'high' },
      { id: 'GDPR-37', requirement: 'Data Protection Officer', checks: (q) => q.hasDataProtectionOfficer ? 'compliant' : 'non_compliant', gap: 'No DPO designated', remediation: 'Appoint a Data Protection Officer', effort: 'medium' },
      { id: 'GDPR-44', requirement: 'Cross-border data transfers', checks: (q) => !q.crossBorderDataTransfer ? 'compliant' : q.hasDataProtectionOfficer ? 'partial' : 'non_compliant', gap: 'Cross-border AI data transfers without adequate safeguards', remediation: 'Implement Standard Contractual Clauses or local AI processing', effort: 'high' },
    ],
  },
  'NIST AI RMF': {
    name: 'NIST AI Risk Management Framework',
    requirements: [
      { id: 'GOV-1', requirement: 'AI governance policies and procedures', checks: (q) => q.hasAIPolicy ? 'partial' : 'non_compliant', gap: 'Incomplete AI governance framework', remediation: 'Develop comprehensive AI governance policy aligned with NIST AI RMF', effort: 'medium' },
      { id: 'MAP-1', requirement: 'AI system inventory and classification', checks: (q) => q.hasAIInventory ? 'compliant' : 'non_compliant', gap: 'No centralized AI system inventory', remediation: 'Create and maintain an AI system inventory with risk classifications', effort: 'low' },
      { id: 'MEA-1', requirement: 'AI system monitoring and measurement', checks: (q) => q.hasAuditTrail ? 'partial' : 'non_compliant', gap: 'No systematic measurement of AI system performance and impact', remediation: 'Implement continuous monitoring of AI system outputs and impact', effort: 'medium' },
      { id: 'MAN-1', requirement: 'AI risk response and mitigation', checks: (q) => q.hasIncidentResponsePlan ? 'partial' : 'non_compliant', gap: 'No AI-specific incident response procedures', remediation: 'Develop AI incident response plan with escalation procedures', effort: 'medium' },
    ],
  },
  'SOC 2': {
    name: 'SOC 2 Type II',
    requirements: [
      { id: 'CC6.1', requirement: 'Logical access controls', checks: (q) => q.hasAIPolicy ? 'partial' : 'non_compliant', gap: 'AI tools not included in access control scope', remediation: 'Include all AI tools in logical access control policies', effort: 'low' },
      { id: 'CC7.2', requirement: 'System monitoring', checks: (q) => q.hasAuditTrail ? 'partial' : 'non_compliant', gap: 'AI system activities not monitored', remediation: 'Extend monitoring to cover all AI system interactions', effort: 'medium' },
      { id: 'CC8.1', requirement: 'Change management', checks: (q) => q.hasAIInventory ? 'partial' : 'non_compliant', gap: 'AI model changes not tracked', remediation: 'Include AI model versioning in change management process', effort: 'medium' },
    ],
  },
  'ISO 42001': {
    name: 'ISO/IEC 42001:2023 — AI Management System',
    requirements: [
      { id: '4.1', requirement: 'Context of the organization', checks: (q) => q.hasAIPolicy ? 'partial' : 'non_compliant', gap: 'AI-specific organizational context not documented', remediation: 'Document AI-related interested parties, risks, and opportunities', effort: 'medium' },
      { id: '6.1', requirement: 'AI risk assessment', checks: (q) => q.hasAIRiskAssessment ? 'compliant' : 'non_compliant', gap: 'No formal AI risk assessment process', remediation: 'Establish AI risk assessment methodology and register', effort: 'high' },
      { id: '8.4', requirement: 'AI system documentation', checks: (q) => q.hasAIInventory ? 'partial' : 'non_compliant', gap: 'Incomplete AI system documentation', remediation: 'Create comprehensive documentation for each AI system', effort: 'high' },
      { id: '9.1', requirement: 'Performance evaluation', checks: (q) => q.hasAuditTrail ? 'partial' : 'non_compliant', gap: 'No systematic AI performance measurement', remediation: 'Implement AI performance metrics and regular evaluation cycles', effort: 'medium' },
    ],
  },
  'HIPAA': {
    name: 'HIPAA — AI in Healthcare',
    requirements: [
      { id: 'HIPAA-164.312', requirement: 'Technical safeguards for AI processing PHI', checks: (q) => q.hasAuditTrail && q.dataClassificationPolicy ? 'partial' : 'non_compliant', gap: 'AI systems processing PHI lack required technical safeguards', remediation: 'Implement encryption, access controls, and audit logging for AI-PHI workflows', effort: 'high' },
      { id: 'HIPAA-164.308', requirement: 'AI risk analysis', checks: (q) => q.hasAIRiskAssessment ? 'partial' : 'non_compliant', gap: 'AI systems not included in HIPAA risk analysis', remediation: 'Include AI systems in HIPAA security risk analysis', effort: 'medium' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Score calculation
// ---------------------------------------------------------------------------

function calculateScore(q: GovernanceQuestionnaire): GovernanceReport['governanceScore'] {
  const categories = [
    {
      name: 'AI Governance Policy',
      checks: [q.hasAIPolicy, q.hasAIInventory],
      findings: !q.hasAIPolicy ? ['No formal AI acceptable use policy'] : [],
      recommendations: !q.hasAIPolicy ? ['Draft and publish AI acceptable use policy within 30 days'] : [],
    },
    {
      name: 'Risk Management',
      checks: [q.hasAIRiskAssessment, q.hasIncidentResponsePlan],
      findings: !q.hasAIRiskAssessment ? ['No AI risk assessment conducted'] : [],
      recommendations: !q.hasAIRiskAssessment ? ['Conduct AI risk assessment covering all AI systems'] : [],
    },
    {
      name: 'Human Oversight',
      checks: [q.hasHumanOversight],
      findings: !q.hasHumanOversight ? ['No systematic human oversight of AI decisions'] : [],
      recommendations: !q.hasHumanOversight ? ['Implement human-in-the-loop for high-risk decisions'] : [],
    },
    {
      name: 'Audit & Transparency',
      checks: [q.hasAuditTrail],
      findings: !q.hasAuditTrail ? ['No AI audit trail or decision logging'] : [],
      recommendations: !q.hasAuditTrail ? ['Deploy Datacendia for court-admissible AI audit trails'] : [],
    },
    {
      name: 'Data Protection',
      checks: [q.dataClassificationPolicy, q.dataRetentionPolicy, q.hasDPIA],
      findings: !q.dataClassificationPolicy ? ['No data classification policy for AI data'] : [],
      recommendations: !q.dataClassificationPolicy ? ['Implement data classification for AI training and inference data'] : [],
    },
    {
      name: 'Compliance Readiness',
      checks: [q.hasDataProtectionOfficer, q.applicableFrameworks.length > 0],
      findings: q.applicableFrameworks.length > 0 && !q.hasDPIA ? ['Applicable frameworks identified but no impact assessments'] : [],
      recommendations: !q.hasDPIA ? ['Conduct Data Protection Impact Assessment for AI systems'] : [],
    },
  ];

  return {
    overall: 0, // computed below
    categories: categories.map(cat => {
      const passed = cat.checks.filter(Boolean).length;
      const score = Math.round((passed / cat.checks.length) * 100);
      return {
        name: cat.name,
        score,
        maxScore: 100,
        status: score >= 80 ? 'pass' as const : score >= 40 ? 'partial' as const : 'fail' as const,
        findings: cat.findings,
        recommendations: cat.recommendations,
      };
    }),
  };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

class GovernanceReportService {
  private reports = new BoundedMap<string, GovernanceReport>({ maxSize: 5000 });
  private initialized = false;

  async loadFromDB(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    try {
      const recs = await loadServiceRecords({ serviceName: 'GovernanceReport', recordType: 'report', limit: 500 });
      for (const rec of recs) {
        const d = rec.data as GovernanceReport;
        if (d?.reportId) this.reports.set(d.reportId, d);
      }
      if (recs.length > 0) logger.info(`[GovernanceReport] Restored ${recs.length} reports from DB`);
    } catch (err) {
      logger.warn(`[GovernanceReport] DB restore skipped: ${(err as Error).message}`);
    }
  }

  async generateReport(q: GovernanceQuestionnaire): Promise<GovernanceReport> {
    const reportId = `gov-${crypto.randomUUID().slice(0, 12)}`;
    const scoreData = calculateScore(q);
    const overallScore = Math.round(scoreData.categories.reduce((sum, c) => sum + c.score, 0) / scoreData.categories.length);
    scoreData.overall = overallScore;

    const riskLevel: GovernanceReport['executiveSummary']['riskLevel'] =
      overallScore >= 80 ? 'low' : overallScore >= 60 ? 'medium' : overallScore >= 40 ? 'high' : 'critical';

    // Build compliance matrix
    const complianceMatrix = q.applicableFrameworks
      .filter(f => FRAMEWORKS[f])
      .map(f => {
        const fw = FRAMEWORKS[f];
        const reqs = fw.requirements.map((r, i) => ({
          id: r.id,
          requirement: r.requirement,
          status: r.checks(q),
          gap: r.checks(q) !== 'compliant' ? r.gap : '',
          remediation: r.checks(q) !== 'compliant' ? r.remediation : '',
          effort: r.effort,
          priority: r.checks(q) === 'non_compliant' ? 1 : r.checks(q) === 'partial' ? 2 : 3,
        }));
        const compliant = reqs.filter(r => r.status === 'compliant').length;
        return {
          framework: fw.name,
          applicability: `Applicable — ${q.industry} in ${q.regions.join(', ')}`,
          overallCompliance: Math.round((compliant / reqs.length) * 100),
          requirements: reqs.sort((a, b) => a.priority - b.priority),
        };
      });

    // Risk assessment
    const risks = [
      { id: 'R-001', category: 'Data Leakage', description: 'Employees sharing sensitive data with external AI tools without safeguards', likelihood: q.hasAIPolicy ? 'medium' as const : 'very_high' as const, impact: 'critical' as const, riskScore: q.hasAIPolicy ? 60 : 95, currentControls: q.hasAIPolicy ? 'AI acceptable use policy in place' : 'None', recommendedControls: 'Deploy AI gateway proxy with PII detection and blocking' },
      { id: 'R-002', category: 'Regulatory Non-Compliance', description: `Non-compliance with ${q.applicableFrameworks.join(', ')} requirements for AI systems`, likelihood: q.hasAuditTrail ? 'medium' as const : 'high' as const, impact: 'high' as const, riskScore: q.hasAuditTrail ? 50 : 85, currentControls: q.hasAuditTrail ? 'Basic audit logging' : 'None', recommendedControls: 'Implement comprehensive AI audit trail with cryptographic attestation' },
      { id: 'R-003', category: 'AI Decision Liability', description: 'AI-assisted decisions without evidence trail — liability in litigation', likelihood: 'high' as const, impact: 'critical' as const, riskScore: q.hasAuditTrail ? 55 : 92, currentControls: q.hasHumanOversight ? 'Manual review process' : 'None', recommendedControls: 'Deploy Regulator\'s Receipt for court-admissible decision evidence' },
      { id: 'R-004', category: 'Shadow AI', description: 'Untracked AI tool usage across the organization', likelihood: q.hasAIInventory ? 'medium' as const : 'very_high' as const, impact: 'high' as const, riskScore: q.hasAIInventory ? 45 : 88, currentControls: q.hasAIInventory ? 'AI tool inventory maintained' : 'No visibility into AI tool usage', recommendedControls: 'Deploy Shadow AI Scanner for continuous monitoring' },
    ];

    // Roadmap
    const nonCompliantCount = complianceMatrix.reduce((sum, f) => sum + f.requirements.filter(r => r.status === 'non_compliant').length, 0);
    const remediationRoadmap: GovernanceReport['remediationRoadmap'] = [
      {
        phase: 'Phase 1: Immediate (0–30 days)',
        timeline: '30 days',
        actions: [
          { action: 'Deploy Shadow AI Scanner to quantify current exposure', owner: 'CISO', effort: '1 day', impact: 'Immediate visibility into AI risk', frameworks: ['NIST AI RMF', 'SOC 2'] },
          { action: 'Draft AI Acceptable Use Policy', owner: 'Legal + IT', effort: '1 week', impact: 'Foundation for all compliance efforts', frameworks: ['EU AI Act', 'NIST AI RMF', 'ISO 42001'] },
          { action: 'Create AI system inventory', owner: 'IT', effort: '2 weeks', impact: 'Required for all framework compliance', frameworks: ['EU AI Act', 'NIST AI RMF', 'SOC 2', 'ISO 42001'] },
        ],
      },
      {
        phase: 'Phase 2: Foundation (30–90 days)',
        timeline: '90 days',
        actions: [
          { action: 'Deploy AI Gateway for centralized governance', owner: 'IT Security', effort: '2 weeks', impact: 'PII protection + audit trail for all AI usage', frameworks: ['EU AI Act', 'GDPR', 'HIPAA'] },
          { action: 'Conduct AI risk assessment', owner: 'Risk Management', effort: '4 weeks', impact: `Address ${nonCompliantCount} non-compliant requirements`, frameworks: q.applicableFrameworks },
          { action: 'Implement audit trail with Regulator\'s Receipt', owner: 'IT + Legal', effort: '2 weeks', impact: 'Court-admissible evidence for every AI decision', frameworks: ['EU AI Act', 'SOC 2'] },
        ],
      },
      {
        phase: 'Phase 3: Maturity (90–180 days)',
        timeline: '180 days',
        actions: [
          { action: 'Achieve continuous compliance monitoring', owner: 'Compliance', effort: '4 weeks', impact: 'Automated compliance status tracking', frameworks: q.applicableFrameworks },
          { action: 'Conduct independent AI governance audit', owner: 'External Auditor', effort: '6 weeks', impact: 'Third-party validation of AI governance posture', frameworks: ['SOC 2', 'ISO 42001'] },
          { action: 'Board AI governance report cadence (quarterly)', owner: 'CISO', effort: 'Ongoing', impact: 'Sustained executive visibility', frameworks: ['NIST AI RMF'] },
        ],
      },
    ];

    const failedCategories = scoreData.categories.filter(c => c.status === 'fail').map(c => c.name);
    const headline = overallScore >= 80
      ? `${q.organizationName} demonstrates strong AI governance maturity`
      : overallScore >= 60
      ? `${q.organizationName} has foundational AI governance but significant gaps remain`
      : overallScore >= 40
      ? `${q.organizationName} faces material AI governance gaps requiring immediate action`
      : `${q.organizationName} has critical AI governance deficiencies — immediate remediation required`;

    const report: GovernanceReport = {
      reportId,
      organizationName: q.organizationName,
      generatedAt: new Date().toISOString(),
      reportVersion: '1.0',
      executiveSummary: {
        overallScore,
        riskLevel,
        headline,
        keyFindings: [
          `Overall governance score: ${overallScore}/100 (${riskLevel} risk)`,
          `${q.aiSystemCount} AI systems identified — ${q.hasAIInventory ? 'inventory maintained' : 'no centralized inventory'}`,
          failedCategories.length > 0 ? `Critical gaps in: ${failedCategories.join(', ')}` : 'All governance categories at acceptable levels',
          `${complianceMatrix.reduce((s, f) => s + f.requirements.filter(r => r.status === 'non_compliant').length, 0)} non-compliant requirements across ${complianceMatrix.length} frameworks`,
          q.hasAuditTrail ? 'Basic audit trail in place' : 'No AI audit trail — high litigation risk',
        ],
        immediateActions: [
          'Deploy Shadow AI Scanner to quantify unauthorized AI usage',
          !q.hasAIPolicy ? 'Draft and publish AI acceptable use policy' : null,
          !q.hasAuditTrail ? 'Implement AI audit trail for decision evidence' : null,
          !q.hasAIRiskAssessment ? 'Conduct AI-specific risk assessment' : null,
          'Schedule board briefing on AI governance posture',
        ].filter(Boolean) as string[],
      },
      governanceScore: scoreData,
      aiInventory: {
        totalSystems: q.aiSystemCount,
        byRiskLevel: {
          high: Math.ceil(q.aiSystemCount * 0.2),
          medium: Math.ceil(q.aiSystemCount * 0.35),
          low: Math.ceil(q.aiSystemCount * 0.3),
          minimal: Math.floor(q.aiSystemCount * 0.15),
        },
        gaps: q.hasAIInventory ? [] : ['No centralized AI system inventory', 'AI systems not classified by risk level', 'No owner assigned to AI systems'],
      },
      complianceMatrix,
      riskAssessment: { overallRisk: riskLevel, risks },
      remediationRoadmap,
      boardSummary: {
        headline,
        riskPosture: `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk — ${overallScore}/100 governance score`,
        investmentRequired: overallScore >= 60 ? '$50K–$150K for full compliance' : '$150K–$400K for remediation and compliance',
        timelineToCompliance: overallScore >= 60 ? '90–120 days' : '120–180 days',
        keyMetrics: [
          { label: 'Governance Score', value: `${overallScore}/100`, status: riskLevel },
          { label: 'AI Systems', value: `${q.aiSystemCount}`, status: q.hasAIInventory ? 'low' : 'high' },
          { label: 'Compliance Gaps', value: `${nonCompliantCount}`, status: nonCompliantCount > 5 ? 'critical' : nonCompliantCount > 2 ? 'high' : 'low' },
          { label: 'Frameworks', value: `${q.applicableFrameworks.length}`, status: 'medium' },
        ],
        recommendations: [
          'Invest in centralized AI governance platform',
          'Establish quarterly AI governance board reporting',
          'Designate AI governance committee with cross-functional representation',
        ],
      },
      integrityHash: `sha256:${crypto.createHash('sha256').update(JSON.stringify({ reportId, q })).digest('hex')}`,
    };

    this.reports.set(reportId, report);
    await persistServiceRecord({
      serviceName: 'GovernanceReport',
      recordType: 'report',
      organizationId: q.organizationName,
      referenceId: reportId,
      data: report,
    });
    logger.info(`[GovernanceReport] Generated ${reportId} for ${q.organizationName}: score=${overallScore}, risk=${riskLevel}`);
    return report;
  }

  async getReport(reportId: string): Promise<GovernanceReport | null> {
    await this.loadFromDB();
    return this.reports.get(reportId) ?? null;
  }

  async listReports(): Promise<GovernanceReport[]> {
    await this.loadFromDB();
    return [...this.reports.values()];
  }
}

export const governanceReportService = new GovernanceReportService();
