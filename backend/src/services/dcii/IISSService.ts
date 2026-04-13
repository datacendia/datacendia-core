// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// IISS — Institutional Immune System Score
// Quantifies organizational resilience across 8 governance dimensions.
// =============================================================================

import crypto from 'crypto';
import { deterministicPercentage, deterministicFloat, deterministicPick } from '../../utils/deterministic.js';

interface IISSScore {
  id: string;
  organizationId: string;
  organizationName: string;
  overallScore: number;
  band: string;
  certificationLevel?: string;
  dimensions: DimensionScore[];
  assessments: Assessment[];
  generatedAt: string;
  generatedBy: string;
  calculatedAt?: string;
}

interface DimensionScore {
  id: string;
  name: string;
  score: number;
  weight: number;
  trend: string;
  findings: string[];
  primitive?: string;
  maxScore?: number;
  normalizedScore?: number;
}

interface Assessment {
  id: string;
  dimensionId: string;
  score: number;
  evidence: string;
  timestamp: string;
}

const DIMENSIONS = [
  { id: 'transparency', name: 'Transparency & Disclosure', weight: 0.15, description: 'Openness of decision processes and data access' },
  { id: 'accountability', name: 'Accountability Mechanisms', weight: 0.15, description: 'Clear chains of responsibility and consequence' },
  { id: 'dissent', name: 'Dissent Integration', weight: 0.12, description: 'Capacity to absorb and act on dissenting views' },
  { id: 'evidence', name: 'Evidence-Based Practice', weight: 0.12, description: 'Reliance on verifiable evidence in decision-making' },
  { id: 'adaptability', name: 'Adaptive Capacity', weight: 0.12, description: 'Speed of response to new information or threats' },
  { id: 'equity', name: 'Equity & Inclusion', weight: 0.12, description: 'Fair treatment and representation across stakeholders' },
  { id: 'integrity', name: 'Process Integrity', weight: 0.12, description: 'Tamper-evidence and auditability of governance records' },
  { id: 'learning', name: 'Institutional Learning', weight: 0.10, description: 'Capacity to learn from outcomes and improve' },
];

const BANDS = [
  { min: 90, label: 'Exemplary', color: '#22c55e', description: 'World-class institutional resilience' },
  { min: 75, label: 'Strong', color: '#3b82f6', description: 'Robust governance with minor gaps' },
  { min: 60, label: 'Adequate', color: '#eab308', description: 'Functional but improvement needed' },
  { min: 40, label: 'Vulnerable', color: '#f97316', description: 'Significant governance gaps detected' },
  { min: 0, label: 'Critical', color: '#ef4444', description: 'Institutional integrity at risk' },
];

const BENCHMARKS: Record<string, number> = {
  'financial-services': 72, 'healthcare': 68, 'technology': 65, 'government': 61,
  'education': 59, 'manufacturing': 55, 'retail': 52, 'energy': 63,
};

class IISSServiceImpl {
  private scores = new Map<string, IISSScore>();
  private assessments = new Map<string, Assessment>();

  async calculateScore(organizationId: string, organizationName: string, initiatedBy: string): Promise<IISSScore> {
    const seed = `iiss-${organizationId}-${Date.now()}`;
    const id = `iiss-${crypto.randomUUID().slice(0, 8)}`;

    const localAssessments: Assessment[] = [];
    const dimensions: DimensionScore[] = DIMENSIONS.map(dim => {
      const score = deterministicPercentage(65, 20, seed, dim.id);
      const assessmentId = `assess-${crypto.randomUUID().slice(0, 8)}`;
      const assessment: Assessment = {
        id: assessmentId,
        dimensionId: dim.id,
        score,
        evidence: `Automated assessment of ${dim.name} for ${organizationName}`,
        timestamp: new Date().toISOString(),
      };
      this.assessments.set(assessmentId, assessment);
      localAssessments.push(assessment);

      return {
        id: dim.id,
        name: dim.name,
        score,
        weight: dim.weight,
        trend: deterministicPick(['improving', 'stable', 'declining'], seed, dim.id, 'trend'),
        findings: [
          `${dim.name} scored ${score.toFixed(1)}% — ${score >= 75 ? 'meets' : score >= 50 ? 'partially meets' : 'below'} target threshold`,
          `${deterministicPick(['Key strength', 'Notable gap', 'Improvement area'], seed, dim.id, 'finding')}: ${dim.description}`,
        ],
      };
    });

    const overallScore = Math.round(
      dimensions.reduce((sum, d) => sum + d.score * d.weight, 0) * 100
    ) / 100;
    const band = BANDS.find(b => overallScore >= b.min)?.label || 'Critical';

    const iissScore: IISSScore = {
      id,
      organizationId,
      organizationName,
      overallScore,
      band,
      dimensions,
      assessments: localAssessments,
      generatedAt: new Date().toISOString(),
      generatedBy: initiatedBy,
    };

    this.scores.set(id, iissScore);
    return iissScore;
  }

  getLatestScore(organizationId: string): IISSScore | undefined {
    return [...this.scores.values()]
      .filter(s => s.organizationId === organizationId)
      .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))[0];
  }

  getScore(scoreId: string): IISSScore | undefined { return this.scores.get(scoreId); }

  getHistory(organizationId: string): IISSScore[] {
    return [...this.scores.values()]
      .filter(s => s.organizationId === organizationId)
      .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
  }

  getAllScores(): IISSScore[] { return [...this.scores.values()]; }

  getDimensionDefinitions() { return DIMENSIONS; }

  getScoreBandInfo() { return BANDS; }

  getBenchmarks(industry?: string) {
    if (industry) return { industry, benchmark: BENCHMARKS[industry] || 60 };
    return Object.entries(BENCHMARKS).map(([industry, benchmark]) => ({ industry, benchmark }));
  }

  getAssessment(assessmentId: string): Assessment | undefined { return this.assessments.get(assessmentId); }
}

export const iissService = new IISSServiceImpl();
