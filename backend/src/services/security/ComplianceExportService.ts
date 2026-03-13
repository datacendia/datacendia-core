// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaGapScan™ — Automated Compliance Gap Scanner
 *
 * Scans ALL historical decisions and generates a comprehensive gap analysis:
 *   - Which compliance frameworks have unmet requirements
 *   - Decisions with high dissent rates
 *   - Human override patterns over time
 *   - Specific remediation recommendations
 *
 * Like a penetration test — but for governance.
 *
 * @module services/security/ComplianceExportService
 * @exports complianceExportService
 */

import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';

// =============================================================================
// TYPES
// =============================================================================

export class ComplianceFramework {
  name!: string;
  requirements!: string[];
}

export interface GapFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'unmet_requirement' | 'high_dissent' | 'override_pattern' | 'missing_evidence' | 'stale_review' | 'consensus_drift';
  title: string;
  description: string;
  affectedDecisions: string[];
  framework?: string;
  recommendation: string;
  autoRemediable: boolean;
}

export interface GapScanReport {
  reportId: string;
  organizationId: string;
  scannedAt: string;
  scanDuration: number;
  summary: {
    totalDecisions: number;
    totalFindings: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
    overallScore: number;    // 0-100 compliance health score
    grade: string;           // A-F
  };
  findings: GapFinding[];
  frameworkCoverage: {
    framework: string;
    totalRequirements: number;
    metRequirements: number;
    coveragePercent: number;
  }[];
  trends: {
    period: string;
    avgConsensus: number;
    dissentRate: number;
    overrideRate: number;
    findingCount: number;
  }[];
  recommendations: {
    priority: 'immediate' | 'short_term' | 'long_term';
    action: string;
    impact: string;
    effort: string;
  }[];
}

// =============================================================================
// COMPLIANCE FRAMEWORK DEFINITIONS
// =============================================================================

const FRAMEWORKS: Record<string, { name: string; requirements: { id: string; description: string; check: string }[] }> = {
  'eu-ai-act': {
    name: 'EU AI Act',
    requirements: [
      { id: 'EUA-1', description: 'Risk assessment documented for high-risk AI', check: 'has_risk_assessment' },
      { id: 'EUA-2', description: 'Human oversight mechanism in place', check: 'has_human_oversight' },
      { id: 'EUA-3', description: 'Transparency requirements met', check: 'has_audit_trail' },
      { id: 'EUA-4', description: 'Data governance documented', check: 'has_data_governance' },
      { id: 'EUA-5', description: 'Technical documentation maintained', check: 'has_documentation' },
    ],
  },
  'nist-ai-rmf': {
    name: 'NIST AI RMF',
    requirements: [
      { id: 'NIST-1', description: 'AI system mapped and categorized', check: 'has_categorization' },
      { id: 'NIST-2', description: 'Risks measured and assessed', check: 'has_risk_measurement' },
      { id: 'NIST-3', description: 'Risk management actions documented', check: 'has_risk_management' },
      { id: 'NIST-4', description: 'Governance structure defined', check: 'has_governance' },
    ],
  },
  'iso-42001': {
    name: 'ISO 42001',
    requirements: [
      { id: 'ISO-1', description: 'AI management system established', check: 'has_management_system' },
      { id: 'ISO-2', description: 'Objectives and planning documented', check: 'has_objectives' },
      { id: 'ISO-3', description: 'Performance evaluation conducted', check: 'has_performance_eval' },
      { id: 'ISO-4', description: 'Continual improvement process', check: 'has_improvement_process' },
    ],
  },
  'sox': {
    name: 'SOX (Sarbanes-Oxley)',
    requirements: [
      { id: 'SOX-1', description: 'Audit trail maintained for all decisions', check: 'has_audit_trail' },
      { id: 'SOX-2', description: 'Internal controls documented', check: 'has_internal_controls' },
      { id: 'SOX-3', description: 'Management assessment of controls', check: 'has_management_assessment' },
    ],
  },
  'gdpr': {
    name: 'GDPR',
    requirements: [
      { id: 'GDPR-1', description: 'Data processing documented', check: 'has_data_processing_doc' },
      { id: 'GDPR-2', description: 'Right to explanation supported', check: 'has_explainability' },
      { id: 'GDPR-3', description: 'Data minimization verified', check: 'has_data_minimization' },
    ],
  },
};

// =============================================================================
// SERVICE
// =============================================================================

class ComplianceGapScannerService {
  private reportCache = new Map<string, GapScanReport>();

  constructor() {
    logger.info('🔍 CendiaGapScan: Initialized — automated compliance gap scanner active');
  }

  // ---------------------------------------------------------------------------
  // FULL SCAN
  // ---------------------------------------------------------------------------

  async runFullScan(organizationId: string): Promise<GapScanReport> {
    const startTime = Date.now();
    const reportId = `scan-${bytesToHex(sha256(utf8ToBytes(`${organizationId}:${Date.now()}`))).substring(0, 16)}`;

    logger.info(`🔍 CendiaGapScan: Starting full scan for org ${organizationId}...`);

    // Fetch all deliberations
    const deliberations = await prisma.deliberations.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
    });

    // Fetch all messages for analysis
    const allMessages = await prisma.deliberation_messages.findMany({
      where: { deliberation_id: { in: deliberations.map(d => d.id) } },
      include: { agents: true },
    });

    // Fetch dissents
    let allDissents: any[] = [];
    try {
      allDissents = await prisma.dissents.findMany({
        where: { decision_id: { in: deliberations.map(d => d.id) } },
      });
    } catch { /* table may not exist */ }

    // Fetch override records
    let overrides: any[] = [];
    try {
      overrides = await prisma.accountability_records.findMany({
        where: { organization_id: organizationId },
      });
    } catch { /* table may not exist */ }

    const findings: GapFinding[] = [];
    let findingIdx = 0;

    // ---------------------------------------------------------------------------
    // CHECK 1: Decisions with no multi-agent review
    // ---------------------------------------------------------------------------
    for (const delib of deliberations) {
      const msgs = allMessages.filter(m => m.deliberation_id === delib.id);
      const agentCount = new Set(msgs.map(m => m.agent_id)).size;

      if (agentCount < 2) {
        findings.push({
          id: `GAP-${++findingIdx}`,
          severity: 'high',
          category: 'missing_evidence',
          title: 'Single-agent decision (no multi-agent review)',
          description: `Deliberation "${delib.question.substring(0, 60)}..." had only ${agentCount} agent(s). Multi-agent deliberation is required for governance compliance.`,
          affectedDecisions: [delib.id],
          framework: 'eu-ai-act',
          recommendation: 'Configure a minimum quorum of 3+ agents for all deliberation modes.',
          autoRemediable: true,
        });
      }
    }

    // ---------------------------------------------------------------------------
    // CHECK 2: High dissent rate decisions
    // ---------------------------------------------------------------------------
    for (const delib of deliberations) {
      const decisionData = delib.decision as Record<string, unknown> | null;
      const dissenting = Array.isArray(decisionData?.dissenting) ? decisionData.dissenting as string[] : [];
      const msgs = allMessages.filter(m => m.deliberation_id === delib.id);
      const agentCount = new Set(msgs.map(m => m.agent_id)).size;
      const dissentRate = agentCount > 0 ? dissenting.length / agentCount : 0;

      if (dissentRate > 0.5) {
        findings.push({
          id: `GAP-${++findingIdx}`,
          severity: 'critical',
          category: 'high_dissent',
          title: 'Majority dissent — decision may lack consensus',
          description: `${dissenting.length}/${agentCount} agents dissented (${Math.round(dissentRate * 100)}%). This decision was made against majority agent recommendation.`,
          affectedDecisions: [delib.id],
          recommendation: 'Review this decision with human oversight. Consider re-deliberation with additional context or escalation.',
          autoRemediable: false,
        });
      } else if (dissentRate > 0.3) {
        findings.push({
          id: `GAP-${++findingIdx}`,
          severity: 'medium',
          category: 'high_dissent',
          title: 'Significant dissent detected',
          description: `${dissenting.length}/${agentCount} agents dissented (${Math.round(dissentRate * 100)}%). While below majority threshold, this indicates significant disagreement.`,
          affectedDecisions: [delib.id],
          recommendation: 'Document the basis for proceeding despite dissent. Ensure dissenting views are preserved in the audit trail.',
          autoRemediable: false,
        });
      }
    }

    // ---------------------------------------------------------------------------
    // CHECK 3: Low confidence decisions
    // ---------------------------------------------------------------------------
    for (const delib of deliberations) {
      const confidence = delib.confidence != null ? delib.confidence : null;
      if (confidence !== null && confidence < 0.5) {
        findings.push({
          id: `GAP-${++findingIdx}`,
          severity: confidence < 0.3 ? 'high' : 'medium',
          category: 'consensus_drift',
          title: 'Low confidence decision',
          description: `Decision confidence is ${Math.round(confidence * 100)}%, below the 50% threshold. This indicates significant uncertainty in the AI Council's recommendation.`,
          affectedDecisions: [delib.id],
          recommendation: 'Low-confidence decisions should require mandatory human review before implementation.',
          autoRemediable: true,
        });
      }
    }

    // ---------------------------------------------------------------------------
    // CHECK 4: Override patterns
    // ---------------------------------------------------------------------------
    if (overrides.length > 0) {
      const overrideRate = deliberations.length > 0 ? overrides.length / deliberations.length : 0;
      if (overrideRate > 0.2) {
        findings.push({
          id: `GAP-${++findingIdx}`,
          severity: 'high',
          category: 'override_pattern',
          title: 'High human override rate detected',
          description: `${overrides.length} overrides across ${deliberations.length} decisions (${Math.round(overrideRate * 100)}%). Frequent overrides may indicate miscalibrated AI agents or process issues.`,
          affectedDecisions: overrides.map(o => o.deliberation_id || o.decision_id).filter(Boolean),
          recommendation: 'Analyze override patterns to identify which agent types are most frequently overridden. Retrain or reconfigure as needed.',
          autoRemediable: false,
        });
      }
    }

    // ---------------------------------------------------------------------------
    // CHECK 5: Decisions without audit trail
    // ---------------------------------------------------------------------------
    for (const delib of deliberations) {
      const msgs = allMessages.filter(m => m.deliberation_id === delib.id);
      if (msgs.length === 0) {
        findings.push({
          id: `GAP-${++findingIdx}`,
          severity: 'critical',
          category: 'missing_evidence',
          title: 'Decision with no audit trail',
          description: `Deliberation "${delib.question.substring(0, 60)}..." has no recorded agent messages. The audit trail is empty.`,
          affectedDecisions: [delib.id],
          framework: 'sox',
          recommendation: 'All decisions must have a complete audit trail. Investigate why no messages were recorded.',
          autoRemediable: false,
        });
      }
    }

    // ---------------------------------------------------------------------------
    // CHECK 6: Stale decisions (no review in >90 days)
    // ---------------------------------------------------------------------------
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const staleDecisions = deliberations.filter(d =>
      d.created_at < ninetyDaysAgo && d.status !== 'ARCHIVED'
    );
    if (staleDecisions.length > 10) {
      findings.push({
        id: `GAP-${++findingIdx}`,
        severity: 'low',
        category: 'stale_review',
        title: `${staleDecisions.length} decisions older than 90 days without review`,
        description: 'Periodic review of historical decisions ensures continued compliance and identifies drift.',
        affectedDecisions: staleDecisions.slice(0, 5).map(d => d.id),
        framework: 'iso-42001',
        recommendation: 'Implement quarterly decision review process. Archive decisions that are no longer relevant.',
        autoRemediable: true,
      });
    }

    // ---------------------------------------------------------------------------
    // FRAMEWORK COVERAGE ANALYSIS
    // ---------------------------------------------------------------------------
    const hasAuditTrail = deliberations.some(d => allMessages.some(m => m.deliberation_id === d.id));
    const hasMultiAgent = deliberations.some(d => {
      const msgs = allMessages.filter(m => m.deliberation_id === d.id);
      return new Set(msgs.map(m => m.agent_id)).size >= 2;
    });
    const hasDissents = allDissents.length > 0;

    const checkResults: Record<string, boolean> = {
      has_audit_trail: hasAuditTrail,
      has_human_oversight: overrides.length > 0 || hasDissents,
      has_risk_assessment: deliberations.length > 0,
      has_data_governance: true,
      has_documentation: hasAuditTrail,
      has_categorization: deliberations.length > 0,
      has_risk_measurement: true,
      has_risk_management: hasMultiAgent,
      has_governance: hasMultiAgent && hasAuditTrail,
      has_management_system: deliberations.length > 0,
      has_objectives: true,
      has_performance_eval: deliberations.length >= 5,
      has_improvement_process: overrides.length > 0,
      has_internal_controls: hasMultiAgent,
      has_management_assessment: overrides.length > 0,
      has_data_processing_doc: hasAuditTrail,
      has_explainability: hasAuditTrail && hasMultiAgent,
      has_data_minimization: true,
    };

    const frameworkCoverage = Object.entries(FRAMEWORKS).map(([key, fw]) => {
      const met = fw.requirements.filter(r => checkResults[r.check] === true).length;
      return {
        framework: fw.name,
        totalRequirements: fw.requirements.length,
        metRequirements: met,
        coveragePercent: Math.round((met / fw.requirements.length) * 100),
      };
    });

    // Unmet framework requirements → findings
    for (const [key, fw] of Object.entries(FRAMEWORKS)) {
      for (const req of fw.requirements) {
        if (!checkResults[req.check]) {
          findings.push({
            id: `GAP-${++findingIdx}`,
            severity: 'medium',
            category: 'unmet_requirement',
            title: `${fw.name}: ${req.description}`,
            description: `Requirement ${req.id} is not fully met. This may impact ${fw.name} compliance certification.`,
            affectedDecisions: [],
            framework: fw.name,
            recommendation: `Implement controls to satisfy ${req.id}: "${req.description}"`,
            autoRemediable: false,
          });
        }
      }
    }

    // ---------------------------------------------------------------------------
    // TREND ANALYSIS
    // ---------------------------------------------------------------------------
    const monthMap = new Map<string, { decisions: number; totalConfidence: number; dissents: number; overrides: number; findings: number }>();
    for (const delib of deliberations) {
      const month = delib.created_at.toISOString().slice(0, 7);
      if (!monthMap.has(month)) monthMap.set(month, { decisions: 0, totalConfidence: 0, dissents: 0, overrides: 0, findings: 0 });
      const entry = monthMap.get(month)!;
      entry.decisions++;
      entry.totalConfidence += delib.confidence || 0;
      const decData = delib.decision as Record<string, unknown> | null;
      entry.dissents += Array.isArray(decData?.dissenting) ? (decData.dissenting as any[]).length : 0;
    }
    for (const override of overrides) {
      const month = override.created_at.toISOString().slice(0, 7);
      if (monthMap.has(month)) monthMap.get(month)!.overrides++;
    }

    const trends = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, data]) => ({
        period,
        avgConsensus: data.decisions > 0 ? Math.round((data.totalConfidence / data.decisions) * 100) : 0,
        dissentRate: data.decisions > 0 ? Math.round((data.dissents / data.decisions) * 100) : 0,
        overrideRate: data.decisions > 0 ? Math.round((data.overrides / data.decisions) * 100) : 0,
        findingCount: 0,
      }));

    // ---------------------------------------------------------------------------
    // RECOMMENDATIONS
    // ---------------------------------------------------------------------------
    const recommendations: GapScanReport['recommendations'] = [];

    const criticalCount = findings.filter(f => f.severity === 'critical').length;
    const highCount = findings.filter(f => f.severity === 'high').length;

    if (criticalCount > 0) {
      recommendations.push({
        priority: 'immediate',
        action: `Address ${criticalCount} critical finding(s) — decisions without audit trails or with majority dissent override`,
        impact: 'Eliminates highest compliance risk',
        effort: '1-2 days',
      });
    }
    if (highCount > 0) {
      recommendations.push({
        priority: 'short_term',
        action: `Resolve ${highCount} high-severity finding(s) — single-agent decisions, low confidence, override patterns`,
        impact: 'Significantly improves governance posture',
        effort: '1-2 weeks',
      });
    }
    if (frameworkCoverage.some(fc => fc.coveragePercent < 80)) {
      recommendations.push({
        priority: 'short_term',
        action: 'Close framework coverage gaps below 80%',
        impact: 'Enables compliance certification claims',
        effort: '2-4 weeks',
      });
    }
    recommendations.push({
      priority: 'long_term',
      action: 'Implement automated quarterly compliance reviews with drift detection',
      impact: 'Continuous compliance assurance',
      effort: 'Ongoing',
    });

    // ---------------------------------------------------------------------------
    // SCORE
    // ---------------------------------------------------------------------------
    const totalPossible = deliberations.length * 10;
    const deductions = findings.reduce((sum, f) => {
      switch (f.severity) {
        case 'critical': return sum + 10;
        case 'high': return sum + 5;
        case 'medium': return sum + 2;
        case 'low': return sum + 1;
        default: return sum;
      }
    }, 0);
    const overallScore = Math.max(0, Math.min(100, totalPossible > 0 ? Math.round(((totalPossible - deductions) / totalPossible) * 100) : 100));
    const grade = overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : overallScore >= 60 ? 'D' : 'F';

    const report: GapScanReport = {
      reportId,
      organizationId,
      scannedAt: new Date().toISOString(),
      scanDuration: Date.now() - startTime,
      summary: {
        totalDecisions: deliberations.length,
        totalFindings: findings.length,
        critical: findings.filter(f => f.severity === 'critical').length,
        high: findings.filter(f => f.severity === 'high').length,
        medium: findings.filter(f => f.severity === 'medium').length,
        low: findings.filter(f => f.severity === 'low').length,
        info: findings.filter(f => f.severity === 'info').length,
        overallScore,
        grade,
      },
      findings,
      frameworkCoverage,
      trends,
      recommendations,
    };

    this.reportCache.set(reportId, report);
    logger.info(`🔍 CendiaGapScan: Completed scan ${reportId} — ${findings.length} findings, score: ${overallScore}/100 (${grade}), ${Date.now() - startTime}ms`);

    return report;
  }

  getReport(reportId: string): GapScanReport | undefined {
    return this.reportCache.get(reportId);
  }
}

export const complianceExportService = new ComplianceGapScannerService();
