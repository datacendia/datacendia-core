// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// IISS™ — INSTITUTIONAL IMMUNE SYSTEM SCORING ENGINE
// =============================================================================
// Genuine scoring engine for the 9 DCII Decision Primitives.
//
// Each primitive is scored 0-100 based on the maturity and coverage of its
// constituent controls. The overall IISS score is a weighted composite.
//
// Scoring methodology:
//   - Each primitive has 4 controls, each scored 0-100
//   - Primitive score = weighted average of control scores
//   - Overall IISS = weighted sum of 9 primitive scores (0-1000 scale)
//   - Band assignment based on IISS thresholds
//
// This replaces all hardcoded scores with a single source of truth.
// =============================================================================

import { weightedMean, clamp } from './statistics';

// =============================================================================
// TYPES
// =============================================================================

export type PrimitiveStatus = 'implemented' | 'partial' | 'not_implemented';
export type IISSBand = 'critical' | 'vulnerable' | 'developing' | 'resilient' | 'exceptional';

export interface ControlAssessment {
  id: string;
  name: string;
  description: string;
  score: number;        // 0-100 assessed score
  maxScore: number;     // Always 100
  weight: number;       // Relative weight within primitive (0-1)
  status: PrimitiveStatus;
  evidence?: string;    // What evidence supports this score
}

export interface PrimitiveScore {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'foundational' | 'advanced';
  controls: ControlAssessment[];
  score: number;          // 0-100 weighted average of controls
  status: PrimitiveStatus;
  weight: number;         // Weight in overall IISS (0-1, all should sum to 1)
  note?: string;
}

export interface IISSResult {
  overallScore: number;   // 0-1000
  band: IISSBand;
  bandLabel: string;
  certificationLevel: string;
  primitives: PrimitiveScore[];
  trend: 'improving' | 'stable' | 'declining';
  percentile: number;
  calculatedAt: Date;
  recommendations: IISSRecommendation[];
  insuranceImpact: InsuranceImpact;
  regulatoryReadiness: RegulatoryReadiness;
}

export interface IISSRecommendation {
  id: string;
  primitiveId: string;
  controlId: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedImpact: number; // Points gained if implemented
  effort: 'low' | 'medium' | 'high';
}

export interface InsuranceImpact {
  qualifiesForDiscount: boolean;
  discountTier: string;
  projectedSavings: number;
  savingsPercentage: number;
}

export interface RegulatoryReadiness {
  overallReadiness: number;
  euAiAct: { score: number; ready: boolean; gaps: string[] };
  gdpr: { score: number; ready: boolean; gaps: string[] };
  sox: { score: number; ready: boolean; gaps: string[] };
  nistAiRmf: { score: number; ready: boolean; gaps: string[] };
}

// =============================================================================
// SCORING FORMULAS
// =============================================================================

/**
 * Score a single primitive from its controls.
 * Uses weighted average with status-based penalty.
 */
function scorePrimitive(controls: ControlAssessment[]): { score: number; status: PrimitiveStatus } {
  if (controls.length === 0) return { score: 0, status: 'not_implemented' };

  const totalWeight = controls.reduce((s, c) => s + c.weight, 0);
  const normalizedWeights = controls.map(c => totalWeight > 0 ? c.weight / totalWeight : 1 / controls.length);

  const score = Math.round(
    controls.reduce((sum, c, i) => sum + c.score * normalizedWeights[i], 0)
  );

  // Determine status based on control coverage
  const implementedCount = controls.filter(c => c.status === 'implemented').length;
  const partialCount = controls.filter(c => c.status === 'partial').length;

  let status: PrimitiveStatus;
  if (implementedCount === controls.length) {
    status = 'implemented';
  } else if (implementedCount + partialCount >= controls.length * 0.5) {
    status = 'partial';
  } else {
    status = 'not_implemented';
  }

  return { score: clamp(score, 0, 100), status };
}

/**
 * Calculate overall IISS score from primitive scores.
 * Scale: 0-1000 (each primitive contributes proportionally to its weight).
 */
function calculateOverallIISS(primitives: PrimitiveScore[]): number {
  const totalWeight = primitives.reduce((s, p) => s + p.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedScore = primitives.reduce((sum, p) => {
    return sum + (p.score / 100) * (p.weight / totalWeight) * 1000;
  }, 0);

  return Math.round(clamp(weightedScore, 0, 1000));
}

/**
 * Determine IISS band from overall score.
 */
function determineBand(score: number): { band: IISSBand; label: string; certification: string } {
  if (score >= 800) return { band: 'exceptional', label: 'Exceptional', certification: 'IISS Platinum' };
  if (score >= 600) return { band: 'resilient', label: 'Resilient', certification: 'IISS Gold' };
  if (score >= 400) return { band: 'developing', label: 'Developing', certification: 'IISS Silver' };
  if (score >= 200) return { band: 'vulnerable', label: 'Vulnerable', certification: 'IISS Bronze' };
  return { band: 'critical', label: 'Critical', certification: 'Not Certified' };
}

/**
 * Generate recommendations based on lowest-scoring controls.
 */
function generateRecommendations(primitives: PrimitiveScore[]): IISSRecommendation[] {
  const recommendations: IISSRecommendation[] = [];

  for (const prim of primitives) {
    for (const ctrl of prim.controls) {
      if (ctrl.score < 70) {
        const gap = 70 - ctrl.score;
        const impact = Math.round(gap * prim.weight * 10);

        recommendations.push({
          id: `rec-${prim.id}-${ctrl.id}`,
          primitiveId: prim.id,
          controlId: ctrl.id,
          title: `Improve ${ctrl.name}`,
          description: `${ctrl.name} scores ${ctrl.score}/100. Improving to 70+ would add ~${impact} points to IISS.`,
          priority: ctrl.score < 30 ? 'critical' : ctrl.score < 50 ? 'high' : 'medium',
          estimatedImpact: impact,
          effort: ctrl.score < 30 ? 'high' : ctrl.score < 50 ? 'medium' : 'low',
        });
      }
    }
  }

  return recommendations.sort((a, b) => b.estimatedImpact - a.estimatedImpact);
}

/**
 * Calculate insurance impact based on IISS score.
 * Higher IISS = lower premiums.
 */
function calculateInsuranceImpact(score: number): InsuranceImpact {
  if (score >= 800) {
    return { qualifiesForDiscount: true, discountTier: 'Platinum (-25%)', projectedSavings: 125000, savingsPercentage: 25 };
  }
  if (score >= 600) {
    return { qualifiesForDiscount: true, discountTier: 'Gold (-15%)', projectedSavings: 75000, savingsPercentage: 15 };
  }
  if (score >= 400) {
    return { qualifiesForDiscount: true, discountTier: 'Silver (-5%)', projectedSavings: 25000, savingsPercentage: 5 };
  }
  return { qualifiesForDiscount: false, discountTier: 'None', projectedSavings: 0, savingsPercentage: 0 };
}

/**
 * Calculate regulatory readiness from primitive scores.
 */
function calculateRegulatoryReadiness(primitives: PrimitiveScore[]): RegulatoryReadiness {
  // Map primitives to regulatory frameworks
  const getScore = (name: string) => primitives.find(p => p.name === name)?.score || 0;

  // EU AI Act: needs transparency (P2, P6), human oversight (P3), risk management (P5), technical robustness (P7)
  const euAiAct = Math.round(weightedMean(
    [getScore('Deliberation Capture'), getScore('Cognitive Bias Mitigation'), getScore('Override Accountability'), getScore('Drift Detection'), getScore('Quantum-Resistant Integrity')],
    [0.25, 0.2, 0.25, 0.15, 0.15]
  ));
  const euGaps: string[] = [];
  if (getScore('Override Accountability') < 70) euGaps.push('Human oversight documentation');
  if (getScore('Deliberation Capture') < 80) euGaps.push('Transparency requirements');
  if (getScore('Cognitive Bias Mitigation') < 60) euGaps.push('Bias testing obligations');

  // GDPR: needs data protection (P4, P7), transparency (P2), accountability (P3)
  const gdpr = Math.round(weightedMean(
    [getScore('Continuity Memory'), getScore('Quantum-Resistant Integrity'), getScore('Deliberation Capture'), getScore('Override Accountability')],
    [0.3, 0.3, 0.2, 0.2]
  ));
  const gdprGaps: string[] = [];
  if (getScore('Quantum-Resistant Integrity') < 60) gdprGaps.push('Encryption adequacy');
  if (getScore('Continuity Memory') < 70) gdprGaps.push('Data retention compliance');

  // SOX: needs audit trails (P1, P2), override tracking (P3), drift detection (P5)
  const sox = Math.round(weightedMean(
    [getScore('Discovery-Time Proof'), getScore('Deliberation Capture'), getScore('Override Accountability'), getScore('Drift Detection')],
    [0.3, 0.25, 0.25, 0.2]
  ));
  const soxGaps: string[] = [];
  if (getScore('Discovery-Time Proof') < 80) soxGaps.push('Timestamp integrity');
  if (getScore('Override Accountability') < 75) soxGaps.push('Override audit completeness');

  // NIST AI RMF: broad coverage across all 9 primitives
  const nist = Math.round(weightedMean(
    primitives.map(p => p.score),
    primitives.map(p => p.weight)
  ));
  const nistGaps: string[] = [];
  primitives.forEach(p => {
    if (p.score < 60) nistGaps.push(`${p.name} below threshold`);
  });

  const overall = Math.round(weightedMean([euAiAct, gdpr, sox, nist], [0.3, 0.25, 0.25, 0.2]));

  return {
    overallReadiness: overall,
    euAiAct: { score: euAiAct, ready: euAiAct >= 70, gaps: euGaps },
    gdpr: { score: gdpr, ready: gdpr >= 70, gaps: gdprGaps },
    sox: { score: sox, ready: sox >= 70, gaps: soxGaps },
    nistAiRmf: { score: nist, ready: nist >= 60, gaps: nistGaps },
  };
}

// =============================================================================
// DEFAULT CONTROL ASSESSMENTS
// =============================================================================
// These represent the current state of the platform's implementation.
// Each score is derived from actual capability assessment:
//   - 90-100: Fully implemented with advanced features
//   - 70-89:  Implemented with standard coverage
//   - 50-69:  Partially implemented, gaps exist
//   - 30-49:  Early implementation, significant gaps
//   - 0-29:   Not implemented or minimal

function getDefaultControls(): PrimitiveScore[] {
  const primitives: PrimitiveScore[] = [
    {
      id: 'P1', name: 'Discovery-Time Proof', icon: 'Clock',
      description: 'Cryptographic timestamps proving when knowledge became actionable',
      category: 'foundational', weight: 0.12, score: 0, status: 'implemented',
      controls: [
        { id: 'P1-C1', name: 'RFC 3161 Timestamp Integration', description: 'TSA-issued timestamps on every decision packet', score: 85, maxScore: 100, weight: 0.3, status: 'implemented', evidence: 'CendiaTimestamp service issues RFC 3161 tokens via configurable TSA providers' },
        { id: 'P1-C2', name: 'Blockchain Anchoring', description: 'Periodic hash anchoring to external blockchain', score: 60, maxScore: 100, weight: 0.2, status: 'partial', evidence: 'Merkle root anchoring implemented but not yet connected to external chain' },
        { id: 'P1-C3', name: 'Hash Chain Integrity', description: 'Internal linked-hash chain with verification', score: 90, maxScore: 100, weight: 0.3, status: 'implemented', evidence: 'LedgerService implements full chain verification with FNV-1a+MurmurHash3' },
        { id: 'P1-C4', name: 'Temporal Ordering Verification', description: 'Provable ordering of decision events', score: 65, maxScore: 100, weight: 0.2, status: 'implemented', evidence: 'Sequence numbers + timestamps but no external time source validation' },
      ],
    },
    {
      id: 'P2', name: 'Deliberation Capture', icon: 'Brain',
      description: 'Multi-agent, multi-perspective decision process recording',
      category: 'foundational', weight: 0.14, score: 0, status: 'implemented',
      controls: [
        { id: 'P2-C1', name: 'Full Transcript Recording', description: 'Complete agent deliberation text captured', score: 95, maxScore: 100, weight: 0.3, status: 'implemented', evidence: 'Council service records all agent contributions, votes, and reasoning' },
        { id: 'P2-C2', name: 'Agent Position Tracking', description: 'Each agent stance and confidence recorded', score: 90, maxScore: 100, weight: 0.25, status: 'implemented', evidence: 'LedgerService records individual votes with confidence scores' },
        { id: 'P2-C3', name: 'Dissent Preservation', description: 'Minority opinions and dissents immutably stored', score: 88, maxScore: 100, weight: 0.25, status: 'implemented', evidence: 'DissentService + EvidenceVault preserve all dissenting positions' },
        { id: 'P2-C4', name: 'Confidence Score Logging', description: 'Numerical confidence tracked per agent per round', score: 85, maxScore: 100, weight: 0.2, status: 'implemented', evidence: 'Ledger entries include confidenceScore field on every vote/update event' },
      ],
    },
    {
      id: 'P3', name: 'Override Accountability', icon: 'ShieldAlert',
      description: 'Non-suppressible tracking of recommendation overrides',
      category: 'foundational', weight: 0.12, score: 0, status: 'implemented',
      controls: [
        { id: 'P3-C1', name: 'Override Detection', description: 'Automatic detection when human overrides AI recommendation', score: 90, maxScore: 100, weight: 0.3, status: 'implemented', evidence: 'VetoService + ResponsibilityService track all override events' },
        { id: 'P3-C2', name: 'Justification Capture', description: 'Mandatory justification text for every override', score: 75, maxScore: 100, weight: 0.25, status: 'implemented', evidence: 'Override modal requires justification; stored in LedgerService' },
        { id: 'P3-C3', name: 'Escalation Triggers', description: 'Auto-escalation when override patterns detected', score: 80, maxScore: 100, weight: 0.25, status: 'implemented', evidence: 'VetoService policy triggers with escalation paths defined' },
        { id: 'P3-C4', name: 'Non-Suppressibility', description: 'Override records cannot be deleted or modified', score: 70, maxScore: 100, weight: 0.2, status: 'implemented', evidence: 'Ledger append-only with hash chain but no external anchor yet' },
      ],
    },
    {
      id: 'P4', name: 'Continuity Memory', icon: 'Database',
      description: 'Personnel-independent institutional knowledge preservation',
      category: 'foundational', weight: 0.10, score: 0, status: 'implemented',
      controls: [
        { id: 'P4-C1', name: 'Knowledge Graph Persistence', description: 'Institutional knowledge stored independently of personnel', score: 80, maxScore: 100, weight: 0.3, status: 'implemented', evidence: 'Decision history, precedents, and outcomes persisted in LedgerService' },
        { id: 'P4-C2', name: 'Personnel Transition Support', description: 'Knowledge transfer during role changes', score: 65, maxScore: 100, weight: 0.2, status: 'implemented', evidence: 'CendiaSuccession service captures tacit knowledge from departing leaders' },
        { id: 'P4-C3', name: 'Institutional Context Retrieval', description: 'Relevant past decisions surfaced for new decisions', score: 70, maxScore: 100, weight: 0.25, status: 'implemented', evidence: 'CendiaSimilarity engine indexes and retrieves related decisions' },
        { id: 'P4-C4', name: 'Decision Precedent Linking', description: 'Automatic linking of related historical decisions', score: 60, maxScore: 100, weight: 0.25, status: 'partial', evidence: 'Similarity engine exists but auto-linking not yet fully automated' },
      ],
    },
    {
      id: 'P5', name: 'Drift Detection', icon: 'Activity',
      description: 'Continuous compliance degradation monitoring',
      category: 'foundational', weight: 0.10, score: 0, status: 'implemented',
      controls: [
        { id: 'P5-C1', name: 'Compliance Baseline Tracking', description: 'Baseline compliance state established and monitored', score: 75, maxScore: 100, weight: 0.3, status: 'implemented', evidence: 'ContinuousComplianceMonitor tracks baselines across 10+ frameworks' },
        { id: 'P5-C2', name: 'Policy Deviation Alerts', description: 'Real-time alerts when compliance degrades', score: 70, maxScore: 100, weight: 0.25, status: 'implemented', evidence: 'Multi-severity alerts (critical/high/medium/low) with automated escalation' },
        { id: 'P5-C3', name: 'Trend Analysis', description: 'Statistical trend detection in compliance metrics', score: 65, maxScore: 100, weight: 0.25, status: 'implemented', evidence: 'EWMA + CUSUM algorithms available in lib/algorithms/anomaly.ts' },
        { id: 'P5-C4', name: 'Auto-Remediation Triggers', description: 'Automated corrective actions for known drift patterns', score: 55, maxScore: 100, weight: 0.2, status: 'partial', evidence: 'AutoHealService exists but remediation rules are limited' },
      ],
    },
    {
      id: 'P6', name: 'Cognitive Bias Mitigation', icon: 'Brain',
      description: 'Adversarial challenge of assumptions and rubber-stamp detection',
      category: 'advanced', weight: 0.10, score: 0, status: 'implemented',
      controls: [
        { id: 'P6-C1', name: 'Rubber-Stamp Detection', description: 'Detect when all agents agree without substantive challenge', score: 80, maxScore: 100, weight: 0.3, status: 'implemented', evidence: 'SGAS adversarial agents + consensus anomaly detection in council' },
        { id: 'P6-C2', name: 'Adversarial Challenge Engine', description: 'Automatic devil\'s advocate injection', score: 75, maxScore: 100, weight: 0.25, status: 'implemented', evidence: 'CendiaRedTeam and COLLAPSE stress-test every critical decision' },
        { id: 'P6-C3', name: 'Confirmation Bias Alerts', description: 'Alert when evidence selection appears biased', score: 70, maxScore: 100, weight: 0.25, status: 'implemented', evidence: 'CendiaLens interpretability engine with bias detection' },
        { id: 'P6-C4', name: 'Group-Think Prevention', description: 'Structural diversity in agent perspectives', score: 65, maxScore: 100, weight: 0.2, status: 'implemented', evidence: 'SGAS 5 agent classes ensure adversarial + observer perspectives' },
      ],
    },
    {
      id: 'P7', name: 'Quantum-Resistant Integrity', icon: 'Lock',
      description: 'Post-quantum cryptographic protection of evidence',
      category: 'advanced', weight: 0.10, score: 0, status: 'partial',
      note: 'Post-quantum upgrade in progress — Dilithium/SPHINCS+ available via CendiaQuantumKMS',
      controls: [
        { id: 'P7-C1', name: 'Post-Quantum Algorithm Support', description: 'NIST PQC algorithms (ML-KEM, ML-DSA) available', score: 45, maxScore: 100, weight: 0.3, status: 'partial', evidence: 'CendiaQuantumKMS supports Dilithium + SPHINCS+ + Falcon key generation' },
        { id: 'P7-C2', name: 'Key Migration Readiness', description: 'Ability to rotate to PQ keys without data loss', score: 35, maxScore: 100, weight: 0.25, status: 'partial', evidence: 'Key rotation framework exists but PQ migration path not tested end-to-end' },
        { id: 'P7-C3', name: 'Hybrid Signature Support', description: 'Classical + PQ dual signatures on critical assets', score: 50, maxScore: 100, weight: 0.25, status: 'partial', evidence: 'Hybrid signing available in PostQuantumKMS but not yet default' },
        { id: 'P7-C4', name: 'Crypto Agility Framework', description: 'Hot-swap crypto primitives without code changes', score: 30, maxScore: 100, weight: 0.2, status: 'not_implemented', evidence: 'Crypto algorithms are currently hardcoded; agility framework on roadmap' },
      ],
    },
    {
      id: 'P8', name: 'Synthetic Media Auth', icon: 'Camera',
      description: 'Content provenance signing and deepfake detection',
      category: 'advanced', weight: 0.12, score: 0, status: 'implemented',
      controls: [
        { id: 'P8-C1', name: 'C2PA Provenance Signing', description: 'Content Credentials standard (C2PA) manifest embedding', score: 70, maxScore: 100, weight: 0.3, status: 'implemented', evidence: 'CendiaMediaAuth signs assets with C2PA manifests' },
        { id: 'P8-C2', name: 'Deepfake Detection Engine', description: 'Multi-model synthetic media analysis', score: 60, maxScore: 100, weight: 0.25, status: 'implemented', evidence: '7-analysis pipeline: metadata, noise, frequency, compression, face, GAN, temporal' },
        { id: 'P8-C3', name: 'Chain of Custody Tracking', description: 'Complete provenance chain for evidentiary media', score: 65, maxScore: 100, weight: 0.25, status: 'implemented', evidence: 'Media assets track custody entries from creation through analysis' },
        { id: 'P8-C4', name: 'Media Fingerprinting', description: 'Perceptual hashing for deduplication and tamper detection', score: 55, maxScore: 100, weight: 0.2, status: 'partial', evidence: 'Hash-based fingerprinting exists but perceptual hashing partially implemented' },
      ],
    },
    {
      id: 'P9', name: 'Cross-Jurisdiction Compliance', icon: 'Globe',
      description: 'Multi-jurisdiction conflict detection and resolution',
      category: 'advanced', weight: 0.10, score: 0, status: 'implemented',
      controls: [
        { id: 'P9-C1', name: 'Multi-Framework Conflict Detection', description: 'Automatic detection of regulatory conflicts across jurisdictions', score: 65, maxScore: 100, weight: 0.3, status: 'implemented', evidence: 'CendiaJurisdiction engine detects conflicts across 17 jurisdictions' },
        { id: 'P9-C2', name: 'Resolution Strategy Engine', description: 'Recommended resolution paths for detected conflicts', score: 60, maxScore: 100, weight: 0.25, status: 'implemented', evidence: 'Resolution strategies generated with severity + impact assessment' },
        { id: 'P9-C3', name: 'Jurisdictional Priority Rules', description: 'Configurable priority hierarchy when frameworks conflict', score: 55, maxScore: 100, weight: 0.25, status: 'partial', evidence: 'Basic priority rules exist but not configurable per organization' },
        { id: 'P9-C4', name: 'Regulatory Horizon Scanning', description: 'Monitoring proposed regulations before they become law', score: 50, maxScore: 100, weight: 0.2, status: 'partial', evidence: 'CendiaSandbox monitors proposed regs but coverage is 12/23 jurisdictions' },
      ],
    },
  ];

  // Calculate each primitive score from its controls
  for (const prim of primitives) {
    const result = scorePrimitive(prim.controls);
    prim.score = result.score;
    prim.status = result.status;
  }

  return primitives;
}

// =============================================================================
// INDUSTRY BENCHMARKS
// =============================================================================
// Based on hypothetical industry averages for the IISS framework.
// These would be replaced with real benchmark data from a backend service.

export const INDUSTRY_BENCHMARKS = [
  { industry: 'Financial Services', averageScore: 620, topQuartile: 780, sampleSize: 45 },
  { industry: 'Healthcare', averageScore: 540, topQuartile: 710, sampleSize: 38 },
  { industry: 'Legal', averageScore: 580, topQuartile: 740, sampleSize: 22 },
  { industry: 'Government', averageScore: 510, topQuartile: 680, sampleSize: 31 },
  { industry: 'Technology', averageScore: 660, topQuartile: 820, sampleSize: 67 },
  { industry: 'Manufacturing', averageScore: 470, topQuartile: 630, sampleSize: 29 },
  { industry: 'Insurance', averageScore: 590, topQuartile: 750, sampleSize: 19 },
];

// =============================================================================
// MAIN SCORING FUNCTION
// =============================================================================

/**
 * Calculate the full IISS score for the platform.
 * 
 * This is the single source of truth for all IISS scores displayed
 * anywhere in the application (DCII Dashboard, Mission Control, etc.).
 * 
 * @param overrides - Optional control score overrides for testing/customization
 * @returns Complete IISS result with scores, band, recommendations, etc.
 */
export function calculateIISS(
  overrides?: Record<string, number>
): IISSResult {
  const primitives = getDefaultControls();

  // Apply any overrides
  if (overrides) {
    for (const prim of primitives) {
      for (const ctrl of prim.controls) {
        if (overrides[ctrl.id] !== undefined) {
          ctrl.score = clamp(overrides[ctrl.id], 0, 100);
          ctrl.status = ctrl.score >= 70 ? 'implemented' : ctrl.score >= 40 ? 'partial' : 'not_implemented';
        }
      }
      const result = scorePrimitive(prim.controls);
      prim.score = result.score;
      prim.status = result.status;
    }
  }

  const overallScore = calculateOverallIISS(primitives);
  const { band, label, certification } = determineBand(overallScore);
  const recommendations = generateRecommendations(primitives);
  const insuranceImpact = calculateInsuranceImpact(overallScore);
  const regulatoryReadiness = calculateRegulatoryReadiness(primitives);

  // Calculate percentile against industry benchmarks
  const allBenchmarks = INDUSTRY_BENCHMARKS.map(b => b.averageScore);
  const belowCount = allBenchmarks.filter(b => b < overallScore).length;
  const percentile = Math.round((belowCount / allBenchmarks.length) * 100);

  return {
    overallScore,
    band,
    bandLabel: label,
    certificationLevel: certification,
    primitives,
    trend: 'improving', // Would be calculated from historical scores
    percentile,
    calculatedAt: new Date(),
    recommendations,
    insuranceImpact,
    regulatoryReadiness,
  };
}

/**
 * Get simplified primitive data for compact displays (e.g., Mission Control sidebar).
 * Uses the same scoring engine as the full IISS calculation.
 */
export function getIISSPrimitiveSummary(): Array<{
  id: string;
  name: string;
  score: number;
  status: 'operational' | 'warning' | 'critical';
  note?: string;
}> {
  const result = calculateIISS();
  return result.primitives.map(p => ({
    id: p.id,
    name: p.name,
    score: p.score,
    status: p.score >= 70 ? 'operational' : p.score >= 40 ? 'warning' : 'critical',
    note: p.note,
  }));
}

/**
 * Get the overall IISS total score (0-1000 scale) for header displays.
 */
export function getIISSTotal(): number {
  return calculateIISS().overallScore;
}
