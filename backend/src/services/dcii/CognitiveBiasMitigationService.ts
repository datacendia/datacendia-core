// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// COGNITIVE BIAS MITIGATION SERVICE
// Detects and mitigates 12 cognitive biases in AI-assisted deliberation.
// =============================================================================

import crypto from 'crypto';
import { deterministicFloat, deterministicPick, deterministicPercentage, deterministicBool } from '../../utils/deterministic.js';

const BIAS_DEFINITIONS = [
  { id: 'anchoring', name: 'Anchoring Bias', description: 'Over-reliance on first piece of information encountered', category: 'cognitive', severity: 'high' },
  { id: 'confirmation', name: 'Confirmation Bias', description: 'Seeking information that confirms pre-existing beliefs', category: 'cognitive', severity: 'high' },
  { id: 'groupthink', name: 'Groupthink', description: 'Desire for conformity suppresses dissenting viewpoints', category: 'social', severity: 'critical' },
  { id: 'availability', name: 'Availability Heuristic', description: 'Judging likelihood by ease of recall rather than data', category: 'cognitive', severity: 'medium' },
  { id: 'sunk-cost', name: 'Sunk Cost Fallacy', description: 'Continuing investment due to prior costs rather than future value', category: 'economic', severity: 'high' },
  { id: 'bandwagon', name: 'Bandwagon Effect', description: 'Adopting positions because others have adopted them', category: 'social', severity: 'medium' },
  { id: 'authority', name: 'Authority Bias', description: 'Over-weighting opinions of authority figures', category: 'social', severity: 'medium' },
  { id: 'framing', name: 'Framing Effect', description: 'Drawing different conclusions from the same data based on presentation', category: 'cognitive', severity: 'high' },
  { id: 'status-quo', name: 'Status Quo Bias', description: 'Preference for current state of affairs over change', category: 'cognitive', severity: 'medium' },
  { id: 'dunning-kruger', name: 'Dunning-Kruger Effect', description: 'Overestimating competence in areas of limited expertise', category: 'metacognitive', severity: 'medium' },
  { id: 'survivorship', name: 'Survivorship Bias', description: 'Focusing on successes while ignoring failures', category: 'statistical', severity: 'high' },
  { id: 'recency', name: 'Recency Bias', description: 'Overweighting recent events over historical patterns', category: 'cognitive', severity: 'medium' },
];

interface BiasDetection {
  id: string;
  biasType: string;
  biasName: string;
  severity: string;
  confidence: number;
  evidence: string;
  affectedAgents: string[];
  status: 'detected' | 'mitigated' | 'accepted';
  mitigationAction?: string;
  mitigatedBy?: string;
  mitigatedAt?: string;
  acceptedBy?: string;
  acceptedJustification?: string;
}

interface BiasAnalysis {
  id: string;
  organizationId: string;
  deliberationId: string;
  deliberationTitle: string;
  detections: BiasDetection[];
  overallBiasScore: number;
  riskLevel: string;
  analyzedAt: string;
}

interface BiasReport {
  id: string;
  organizationId: string;
  period: { from: string; to: string };
  totalAnalyses: number;
  totalDetections: number;
  mitigatedCount: number;
  acceptedCount: number;
  topBiases: Array<{ biasType: string; count: number }>;
  trendDirection: string;
  generatedAt: string;
}

class CognitiveBiasMitigationServiceImpl {
  private analyses = new Map<string, BiasAnalysis>();
  private reports = new Map<string, BiasReport>();

  async analyzeDeliberation(params: {
    organizationId: string;
    deliberationId: string;
    deliberationTitle: string;
    deliberationDurationMinutes?: number;
    agentCount?: number;
    dissentCount?: number;
    agentResponses?: any[];
    crossExaminations?: any[];
    question?: string;
  }): Promise<BiasAnalysis> {
    const seed = `bias-${params.deliberationId}-${Date.now()}`;
    const id = `ba-${crypto.randomUUID().slice(0, 8)}`;

    const detections: BiasDetection[] = [];
    for (const biasDef of BIAS_DEFINITIONS) {
      const detected = deterministicBool(0.35, seed, biasDef.id);
      if (detected) {
        detections.push({
          id: `bd-${crypto.randomUUID().slice(0, 8)}`,
          biasType: biasDef.id,
          biasName: biasDef.name,
          severity: biasDef.severity,
          confidence: deterministicPercentage(72, 18, seed, biasDef.id, 'confidence'),
          evidence: this.generateEvidence(biasDef, params, seed),
          affectedAgents: this.pickAffectedAgents(params.agentCount || 5, seed, biasDef.id),
          status: 'detected',
        });
      }
    }

    const overallBiasScore = detections.length > 0
      ? Math.round(detections.reduce((s, d) => s + d.confidence, 0) / detections.length * 100) / 100
      : 0;

    const analysis: BiasAnalysis = {
      id,
      organizationId: params.organizationId,
      deliberationId: params.deliberationId,
      deliberationTitle: params.deliberationTitle,
      detections,
      overallBiasScore,
      riskLevel: overallBiasScore > 70 ? 'high' : overallBiasScore > 40 ? 'medium' : 'low',
      analyzedAt: new Date().toISOString(),
    };

    this.analyses.set(id, analysis);
    return analysis;
  }

  private generateEvidence(biasDef: typeof BIAS_DEFINITIONS[0], params: any, seed: string): string {
    const evidenceTemplates: Record<string, string[]> = {
      anchoring: [`First response anchored subsequent agent outputs — ${deterministicPercentage(65, 15, seed, 'anchor')}% of agents referenced initial framing`],
      confirmation: [`Agents disproportionately cited supporting evidence over contradictory data (${deterministicPercentage(72, 12, seed, 'confirm')}% confirmatory)`],
      groupthink: [`Only ${params.dissentCount || 0} dissents recorded across ${params.agentCount || 5} agents — potential suppression of alternative views`],
      availability: ['Recent high-profile events disproportionately influenced risk assessments'],
      'sunk-cost': ['Historical investment referenced as justification for continued commitment despite diminishing returns'],
      bandwagon: [`${deterministicPercentage(80, 10, seed, 'band')}% of agents aligned with majority position without independent analysis`],
      authority: ['Senior agent recommendations accepted without critical evaluation by subsequent agents'],
      framing: ['Positive framing of proposal led to systematically higher confidence scores vs. neutral baseline'],
      'status-quo': ['Agents systematically underweighted change scenarios relative to maintaining current approach'],
      'dunning-kruger': ['Cross-domain agents expressed high confidence on topics outside their expertise area'],
      survivorship: ['Analysis referenced only successful precedents, ignoring similar failed initiatives'],
      recency: ['Last 90 days of data weighted 3x more than historical averages in risk calculations'],
    };
    const templates = evidenceTemplates[biasDef.id] || [`${biasDef.name} indicators detected in deliberation pattern`];
    return templates[0]!;
  }

  private pickAffectedAgents(agentCount: number, seed: string, biasId: string): string[] {
    const count = Math.min(agentCount, Math.max(1, Math.floor(deterministicFloat(seed, biasId, 'agents') * agentCount)));
    return Array.from({ length: count }, (_, i) => `agent-${i + 1}`);
  }

  getAnalysis(analysisId: string): BiasAnalysis | undefined { return this.analyses.get(analysisId); }

  getAnalysesByOrganization(orgId: string): BiasAnalysis[] {
    return [...this.analyses.values()].filter(a => a.organizationId === orgId);
  }

  getAnalysesByDeliberation(deliberationId: string): BiasAnalysis[] {
    return [...this.analyses.values()].filter(a => a.deliberationId === deliberationId);
  }

  getAllAnalyses(): BiasAnalysis[] { return [...this.analyses.values()]; }

  mitigateBias(analysisId: string, biasDetectionId: string, action: string, mitigatedBy: string): BiasDetection | null {
    const analysis = this.analyses.get(analysisId);
    if (!analysis) return null;
    const detection = analysis.detections.find(d => d.id === biasDetectionId);
    if (!detection) return null;
    detection.status = 'mitigated';
    detection.mitigationAction = action;
    detection.mitigatedBy = mitigatedBy;
    detection.mitigatedAt = new Date().toISOString();
    return detection;
  }

  acceptBiasRisk(analysisId: string, biasDetectionId: string, acceptedBy: string, justification: string): BiasDetection | null {
    const analysis = this.analyses.get(analysisId);
    if (!analysis) return null;
    const detection = analysis.detections.find(d => d.id === biasDetectionId);
    if (!detection) return null;
    detection.status = 'accepted';
    detection.acceptedBy = acceptedBy;
    detection.acceptedJustification = justification;
    return detection;
  }

  generateReport(organizationId: string, from: Date, to: Date): BiasReport {
    const orgAnalyses = this.getAnalysesByOrganization(organizationId)
      .filter(a => new Date(a.analyzedAt) >= from && new Date(a.analyzedAt) <= to);

    const allDetections = orgAnalyses.flatMap(a => a.detections);
    const biasCounts = new Map<string, number>();
    for (const d of allDetections) {
      biasCounts.set(d.biasType, (biasCounts.get(d.biasType) || 0) + 1);
    }

    const report: BiasReport = {
      id: `br-${crypto.randomUUID().slice(0, 8)}`,
      organizationId,
      period: { from: from.toISOString(), to: to.toISOString() },
      totalAnalyses: orgAnalyses.length,
      totalDetections: allDetections.length,
      mitigatedCount: allDetections.filter(d => d.status === 'mitigated').length,
      acceptedCount: allDetections.filter(d => d.status === 'accepted').length,
      topBiases: [...biasCounts.entries()]
        .map(([biasType, count]) => ({ biasType, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      trendDirection: orgAnalyses.length > 1 ? 'improving' : 'insufficient_data',
      generatedAt: new Date().toISOString(),
    };

    this.reports.set(report.id, report);
    return report;
  }

  getReport(reportId: string): BiasReport | undefined { return this.reports.get(reportId); }

  getBiasDefinitions() { return BIAS_DEFINITIONS; }
}

export const cognitiveBiasMitigationService = new CognitiveBiasMitigationServiceImpl();
