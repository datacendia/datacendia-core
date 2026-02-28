// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// FAIRNESS & BIAS ALGORITHMS — Industry-Standard Metrics
// =============================================================================
// Implements the four canonical fairness metrics used in AI governance,
// insurance underwriting, lending, and hiring.
// References:
//   - Feldman et al. (2015) "Certifying and removing disparate impact"
//   - Hardt et al. (2016) "Equality of Opportunity in Supervised Learning"
//   - Chouldechova (2017) "Fair prediction with disparate impact"
//   - EEOC Uniform Guidelines on Employee Selection (29 CFR 1607) — 80% Rule

import { mean } from './statistics';

// =============================================================================
// TYPES
// =============================================================================

export interface FairnessAuditResult {
  disparateImpactRatio: number;
  disparateImpactPass: boolean;
  statisticalParityDifference: number;
  statisticalParityPass: boolean;
  equalizedOddsDifference: number;
  equalizedOddsPass: boolean;
  predictiveParityDifference: number;
  predictiveParityPass: boolean;
  overallFairnessScore: number;
  protectedClassAnalysis: ProtectedClassResult[];
  recommendations: string[];
}

export interface ProtectedClassResult {
  group: string;
  selectionRate: number;
  positiveRate: number;
  truePositiveRate: number;
  falsePositiveRate: number;
  positivePredictiveValue: number;
  sampleSize: number;
}

export interface GroupOutcomes {
  group: string;
  outcomes: Array<{
    predicted: 'positive' | 'negative';
    actual: 'positive' | 'negative';
  }>;
}

// =============================================================================
// DISPARATE IMPACT RATIO (80% Rule / Four-Fifths Rule)
// =============================================================================
// Used by: EEOC, EU AI Act, Insurance regulators, CFPB
// Formula: selection_rate(protected) / selection_rate(privileged)
// Threshold: ratio ≥ 0.8 (80%) means no disparate impact
// Reference: 29 CFR 1607.4D

/**
 * Calculate the Disparate Impact Ratio between two groups.
 * 
 * @param protectedPositives - Number of positive outcomes in protected group
 * @param protectedTotal - Total members of protected group
 * @param privilegedPositives - Number of positive outcomes in privileged group
 * @param privilegedTotal - Total members of privileged group
 * @returns Ratio in [0, ∞). Values ≥ 0.8 indicate no disparate impact.
 */
export function disparateImpactRatio(
  protectedPositives: number,
  protectedTotal: number,
  privilegedPositives: number,
  privilegedTotal: number
): number {
  if (protectedTotal === 0 || privilegedTotal === 0) return 1;
  const protectedRate = protectedPositives / protectedTotal;
  const privilegedRate = privilegedPositives / privilegedTotal;
  if (privilegedRate === 0) return protectedRate > 0 ? Infinity : 1;
  return protectedRate / privilegedRate;
}

/**
 * Check if the 80% rule (four-fifths rule) is satisfied.
 */
export function passes80PercentRule(
  protectedPositives: number,
  protectedTotal: number,
  privilegedPositives: number,
  privilegedTotal: number,
  threshold: number = 0.8
): boolean {
  return disparateImpactRatio(protectedPositives, protectedTotal, privilegedPositives, privilegedTotal) >= threshold;
}

// =============================================================================
// STATISTICAL PARITY (Demographic Parity)
// =============================================================================
// The probability of a positive outcome should be the same across groups.
// Formula: |P(Ŷ=1|A=0) - P(Ŷ=1|A=1)|
// Threshold: difference ≤ 0.1 (10%) is generally acceptable

/**
 * Statistical Parity Difference between two groups.
 * @returns Absolute difference in positive outcome rates. Lower is fairer.
 */
export function statisticalParityDifference(
  groupAPositives: number,
  groupATotal: number,
  groupBPositives: number,
  groupBTotal: number
): number {
  if (groupATotal === 0 || groupBTotal === 0) return 0;
  const rateA = groupAPositives / groupATotal;
  const rateB = groupBPositives / groupBTotal;
  return Math.abs(rateA - rateB);
}

// =============================================================================
// EQUALIZED ODDS
// =============================================================================
// True Positive Rate and False Positive Rate should be equal across groups.
// Formula: max(|TPR_A - TPR_B|, |FPR_A - FPR_B|)
// Reference: Hardt et al. (2016)

export interface ConfusionMatrix {
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
}

/**
 * Calculate True Positive Rate (Sensitivity / Recall).
 * TPR = TP / (TP + FN)
 */
export function truePositiveRate(cm: ConfusionMatrix): number {
  const denom = cm.truePositives + cm.falseNegatives;
  return denom === 0 ? 0 : cm.truePositives / denom;
}

/**
 * Calculate False Positive Rate (Fall-out).
 * FPR = FP / (FP + TN)
 */
export function falsePositiveRate(cm: ConfusionMatrix): number {
  const denom = cm.falsePositives + cm.trueNegatives;
  return denom === 0 ? 0 : cm.falsePositives / denom;
}

/**
 * Calculate Positive Predictive Value (Precision).
 * PPV = TP / (TP + FP)
 */
export function positivePredictiveValue(cm: ConfusionMatrix): number {
  const denom = cm.truePositives + cm.falsePositives;
  return denom === 0 ? 0 : cm.truePositives / denom;
}

/**
 * Equalized Odds Difference between two groups.
 * Takes the maximum of |TPR difference| and |FPR difference|.
 * Lower is fairer. Threshold: ≤ 0.1 is acceptable.
 */
export function equalizedOddsDifference(
  groupA: ConfusionMatrix,
  groupB: ConfusionMatrix
): number {
  const tprDiff = Math.abs(truePositiveRate(groupA) - truePositiveRate(groupB));
  const fprDiff = Math.abs(falsePositiveRate(groupA) - falsePositiveRate(groupB));
  return Math.max(tprDiff, fprDiff);
}

// =============================================================================
// PREDICTIVE PARITY
// =============================================================================
// Positive Predictive Value should be equal across groups.
// Formula: |PPV_A - PPV_B|
// Reference: Chouldechova (2017)

/**
 * Predictive Parity Difference between two groups.
 * Lower is fairer. Threshold: ≤ 0.1 is acceptable.
 */
export function predictiveParityDifference(
  groupA: ConfusionMatrix,
  groupB: ConfusionMatrix
): number {
  return Math.abs(positivePredictiveValue(groupA) - positivePredictiveValue(groupB));
}

// =============================================================================
// GINI COEFFICIENT
// =============================================================================
// Measures inequality in a distribution. 0 = perfect equality, 1 = perfect inequality.
// Used in: Economic analysis, insurance, lending fairness, resource allocation.
// Formula: G = (2 × Σ(i × y_i)) / (n × Σy_i) - (n+1)/n

/**
 * Gini Coefficient for a distribution of values.
 * @param values - Array of non-negative values (e.g., incomes, scores, allocations)
 * @returns Value in [0, 1]. 0 = perfect equality, 1 = maximal inequality.
 */
export function giniCoefficient(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const total = sorted.reduce((s, v) => s + v, 0);
  if (total === 0) return 0;

  let cumulativeSum = 0;
  let weightedSum = 0;
  for (let i = 0; i < n; i++) {
    cumulativeSum += sorted[i];
    weightedSum += (2 * (i + 1) - n - 1) * sorted[i];
  }

  return weightedSum / (n * total);
}

// =============================================================================
// COMPREHENSIVE FAIRNESS AUDIT
// =============================================================================

/**
 * Run a comprehensive fairness audit across all four canonical metrics.
 * 
 * @param protectedGroup - Confusion matrix for the protected group
 * @param privilegedGroup - Confusion matrix for the privileged group
 * @param disparateImpactThreshold - Minimum acceptable DI ratio (default: 0.8)
 * @param parityThreshold - Maximum acceptable parity difference (default: 0.1)
 */
export function runFairnessAudit(
  protectedGroup: ConfusionMatrix,
  privilegedGroup: ConfusionMatrix,
  disparateImpactThreshold: number = 0.8,
  parityThreshold: number = 0.1
): FairnessAuditResult {
  const protectedPositives = protectedGroup.truePositives + protectedGroup.falsePositives;
  const protectedTotal = protectedPositives + protectedGroup.trueNegatives + protectedGroup.falseNegatives;
  const privilegedPositives = privilegedGroup.truePositives + privilegedGroup.falsePositives;
  const privilegedTotal = privilegedPositives + privilegedGroup.trueNegatives + privilegedGroup.falseNegatives;

  const diRatio = disparateImpactRatio(protectedPositives, protectedTotal, privilegedPositives, privilegedTotal);
  const spDiff = statisticalParityDifference(protectedPositives, protectedTotal, privilegedPositives, privilegedTotal);
  const eoDiff = equalizedOddsDifference(protectedGroup, privilegedGroup);
  const ppDiff = predictiveParityDifference(protectedGroup, privilegedGroup);

  const diPass = diRatio >= disparateImpactThreshold;
  const spPass = spDiff <= parityThreshold;
  const eoPass = eoDiff <= parityThreshold;
  const ppPass = ppDiff <= parityThreshold;

  // Overall fairness score (0-100): weighted combination
  const scores = [
    { pass: diPass, diff: Math.abs(1 - diRatio), weight: 0.3 },
    { pass: spPass, diff: spDiff, weight: 0.25 },
    { pass: eoPass, diff: eoDiff, weight: 0.25 },
    { pass: ppPass, diff: ppDiff, weight: 0.2 },
  ];
  const overallFairnessScore = Math.round(
    scores.reduce((s, sc) => s + Math.max(0, (1 - sc.diff)) * 100 * sc.weight, 0)
  );

  const protectedClassAnalysis: ProtectedClassResult[] = [
    {
      group: 'Protected',
      selectionRate: protectedTotal > 0 ? protectedPositives / protectedTotal : 0,
      positiveRate: protectedTotal > 0 ? protectedPositives / protectedTotal : 0,
      truePositiveRate: truePositiveRate(protectedGroup),
      falsePositiveRate: falsePositiveRate(protectedGroup),
      positivePredictiveValue: positivePredictiveValue(protectedGroup),
      sampleSize: protectedTotal,
    },
    {
      group: 'Privileged',
      selectionRate: privilegedTotal > 0 ? privilegedPositives / privilegedTotal : 0,
      positiveRate: privilegedTotal > 0 ? privilegedPositives / privilegedTotal : 0,
      truePositiveRate: truePositiveRate(privilegedGroup),
      falsePositiveRate: falsePositiveRate(privilegedGroup),
      positivePredictiveValue: positivePredictiveValue(privilegedGroup),
      sampleSize: privilegedTotal,
    },
  ];

  const recommendations: string[] = [];
  if (!diPass) recommendations.push(`Disparate Impact ratio (${diRatio.toFixed(3)}) is below ${disparateImpactThreshold} threshold. Review selection criteria for adverse impact on protected class.`);
  if (!spPass) recommendations.push(`Statistical Parity difference (${(spDiff * 100).toFixed(1)}%) exceeds ${parityThreshold * 100}% threshold. Outcome rates differ significantly between groups.`);
  if (!eoPass) recommendations.push(`Equalized Odds difference (${(eoDiff * 100).toFixed(1)}%) exceeds threshold. True/false positive rates differ between groups.`);
  if (!ppPass) recommendations.push(`Predictive Parity difference (${(ppDiff * 100).toFixed(1)}%) exceeds threshold. Precision differs between groups.`);
  if (recommendations.length === 0) recommendations.push('All fairness metrics within acceptable thresholds.');

  return {
    disparateImpactRatio: diRatio,
    disparateImpactPass: diPass,
    statisticalParityDifference: spDiff,
    statisticalParityPass: spPass,
    equalizedOddsDifference: eoDiff,
    equalizedOddsPass: eoPass,
    predictiveParityDifference: ppDiff,
    predictiveParityPass: ppPass,
    overallFairnessScore,
    protectedClassAnalysis,
    recommendations,
  };
}
