// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// RISK SCORING ALGORITHMS — Enterprise Risk Management
// =============================================================================
// Implements industry-standard risk quantification methods.
// References:
//   - ISO 31000:2018 Risk Management
//   - NIST SP 800-30 Risk Assessment
//   - Basel III/IV Operational Risk Framework
//   - FAIR (Factor Analysis of Information Risk)

import { mean, weightedMean, percentile, clamp } from './statistics';

// =============================================================================
// TYPES
// =============================================================================

export interface RiskScoreResult {
  score: number;          // 0-100 composite risk score
  grade: string;          // A-F letter grade
  label: string;          // Human-readable label
  color: string;          // UI color key
  factors: RiskFactor[];  // Contributing factors
  riskWeightedExposure: number; // Dollar amount
}

export interface RiskFactor {
  name: string;
  probability: number;   // 0-1
  impact: number;         // Dollar amount or 0-100 severity
  weight: number;         // 0-1 relative importance
  score: number;          // 0-100 factor score
  mitigationEffectiveness: number; // 0-1
}

// =============================================================================
// RISK-WEIGHTED EXPOSURE (RWE)
// =============================================================================
// Standard formula: RWE = Σ(probability_i × impact_i)
// Used in: Pre-Mortem analysis, insurance actuarial, Basel capital requirements

/**
 * Calculate Risk-Weighted Exposure.
 * RWE = Σ(probability × impact × (1 - mitigationEffectiveness))
 */
export function riskWeightedExposure(
  factors: Array<{ probability: number; impact: number; mitigation?: number }>
): number {
  return factors.reduce((total, f) => {
    const netProbability = f.probability * (1 - (f.mitigation || 0));
    return total + netProbability * f.impact;
  }, 0);
}

/**
 * Calculate Expected Loss.
 * EL = PD × LGD × EAD
 * Used in: Basel III credit risk, insurance expected claims.
 * 
 * @param probabilityOfDefault - Probability of loss event (0-1)
 * @param lossGivenDefault - Expected loss severity if event occurs (0-1)
 * @param exposureAtDefault - Total exposure amount ($)
 */
export function expectedLoss(
  probabilityOfDefault: number,
  lossGivenDefault: number,
  exposureAtDefault: number
): number {
  return probabilityOfDefault * lossGivenDefault * exposureAtDefault;
}

/**
 * Value at Risk (VaR) using Historical Simulation method.
 * Returns the loss amount at a given confidence level.
 * 
 * @param losses - Historical loss values (positive = loss)
 * @param confidenceLevel - e.g., 0.95 for 95% VaR
 */
export function valueAtRisk(losses: number[], confidenceLevel: number): number {
  if (losses.length === 0) return 0;
  return percentile(losses, confidenceLevel * 100);
}

/**
 * Conditional Value at Risk (CVaR / Expected Shortfall).
 * Average loss in the worst (1-confidence)% of scenarios.
 * More conservative than VaR.
 */
export function conditionalValueAtRisk(losses: number[], confidenceLevel: number): number {
  if (losses.length === 0) return 0;
  const sorted = [...losses].sort((a, b) => a - b);
  const cutoff = Math.ceil(sorted.length * confidenceLevel);
  const tail = sorted.slice(cutoff);
  return tail.length > 0 ? mean(tail) : sorted[sorted.length - 1];
}

// =============================================================================
// COMPOSITE RISK SCORING
// =============================================================================

/**
 * Calculate a composite risk score from multiple factors.
 * Each factor contributes: factor_score × weight.
 * Factor score = probability × impact_severity (both normalized to 0-100).
 */
export function compositeRiskScore(
  factors: Array<{
    name: string;
    probability: number;    // 0-1
    impactSeverity: number; // 0-100
    weight: number;         // 0-1 (all weights should sum to 1)
    mitigation?: number;    // 0-1
  }>
): RiskScoreResult {
  if (factors.length === 0) {
    return { score: 0, grade: 'A', label: 'Minimal', color: 'green', factors: [], riskWeightedExposure: 0 };
  }

  const totalWeight = factors.reduce((s, f) => s + f.weight, 0);
  const normalizedFactors: RiskFactor[] = factors.map((f) => {
    const rawScore = f.probability * f.impactSeverity;
    const mitigatedScore = rawScore * (1 - (f.mitigation || 0));
    return {
      name: f.name,
      probability: f.probability,
      impact: f.impactSeverity,
      weight: totalWeight > 0 ? f.weight / totalWeight : 1 / factors.length,
      score: clamp(mitigatedScore, 0, 100),
      mitigationEffectiveness: f.mitigation || 0,
    };
  });

  const score = clamp(
    Math.round(weightedMean(
      normalizedFactors.map((f) => f.score),
      normalizedFactors.map((f) => f.weight)
    )),
    0,
    100
  );

  const rwe = factors.reduce((s, f) => {
    const net = f.probability * (1 - (f.mitigation || 0));
    return s + net * f.impactSeverity;
  }, 0);

  return {
    score,
    ...riskGrade(score),
    factors: normalizedFactors,
    riskWeightedExposure: rwe,
  };
}

/**
 * Convert a 0-100 risk score to a letter grade, label, and color.
 */
export function riskGrade(score: number): { grade: string; label: string; color: string } {
  if (score >= 80) return { grade: 'F', label: 'Critical', color: 'red' };
  if (score >= 65) return { grade: 'D', label: 'High', color: 'orange' };
  if (score >= 50) return { grade: 'C', label: 'Elevated', color: 'yellow' };
  if (score >= 30) return { grade: 'B', label: 'Moderate', color: 'lime' };
  return { grade: 'A', label: 'Low', color: 'green' };
}

// =============================================================================
// RISK VELOCITY & ACCELERATION
// =============================================================================

/**
 * Risk Velocity: rate of change in risk score over time.
 * Positive = risk increasing, Negative = risk decreasing.
 * 
 * @param scores - Time-ordered risk scores
 * @param periods - Number of periods to average over (default: all)
 */
export function riskVelocity(scores: number[], periods?: number): number {
  if (scores.length < 2) return 0;
  const n = periods ? Math.min(periods, scores.length - 1) : scores.length - 1;
  const recent = scores.slice(-n - 1);
  let totalChange = 0;
  for (let i = 1; i < recent.length; i++) {
    totalChange += recent[i] - recent[i - 1];
  }
  return totalChange / (recent.length - 1);
}

/**
 * Risk Acceleration: rate of change of risk velocity.
 * Positive = risk increasing faster, Negative = risk decelerating.
 */
export function riskAcceleration(scores: number[]): number {
  if (scores.length < 3) return 0;
  const velocities: number[] = [];
  for (let i = 1; i < scores.length; i++) {
    velocities.push(scores[i] - scores[i - 1]);
  }
  return riskVelocity(velocities);
}

// =============================================================================
// MONTE CARLO RISK SIMULATION (Simplified)
// =============================================================================

/**
 * Run a simple Monte Carlo simulation for risk estimation.
 * Uses a seeded PRNG for reproducibility.
 * 
 * @param scenarios - Array of {probability, impact} for each risk factor
 * @param iterations - Number of simulation iterations (default: 10000)
 * @param seed - Random seed for reproducibility
 * @returns Distribution statistics of total losses
 */
export function monteCarloRisk(
  scenarios: Array<{ probability: number; minImpact: number; maxImpact: number }>,
  iterations: number = 10000,
  seed: number = 42
): {
  meanLoss: number;
  medianLoss: number;
  p95Loss: number;
  p99Loss: number;
  maxLoss: number;
  probabilityOfAnyLoss: number;
} {
  // Simple seeded PRNG (xorshift32)
  let state = seed;
  function nextRandom(): number {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return ((state >>> 0) / 0xFFFFFFFF);
  }

  const losses: number[] = [];
  let anyLossCount = 0;

  for (let i = 0; i < iterations; i++) {
    let totalLoss = 0;
    let hadLoss = false;

    for (const scenario of scenarios) {
      if (nextRandom() < scenario.probability) {
        const impact = scenario.minImpact + nextRandom() * (scenario.maxImpact - scenario.minImpact);
        totalLoss += impact;
        hadLoss = true;
      }
    }

    losses.push(totalLoss);
    if (hadLoss) anyLossCount++;
  }

  const sorted = [...losses].sort((a, b) => a - b);

  return {
    meanLoss: mean(losses),
    medianLoss: sorted[Math.floor(sorted.length / 2)],
    p95Loss: percentile(sorted, 95),
    p99Loss: percentile(sorted, 99),
    maxLoss: sorted[sorted.length - 1],
    probabilityOfAnyLoss: anyLossCount / iterations,
  };
}
