// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// STATISTICAL ALGORITHMS — Production-Grade Mathematical Functions
// =============================================================================
// All functions use industry-standard formulas with proper edge-case handling.
// References: NIST Engineering Statistics Handbook, ISO 3534-1

/**
 * Arithmetic mean.
 * Returns 0 for empty arrays.
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Weighted mean.
 * Each value is multiplied by its corresponding weight.
 * Throws if arrays have different lengths.
 */
export function weightedMean(values: number[], weights: number[]): number {
  if (values.length !== weights.length) {
    throw new Error('Values and weights must have the same length');
  }
  if (values.length === 0) return 0;
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  if (totalWeight === 0) return 0;
  return values.reduce((s, v, i) => s + v * weights[i], 0) / totalWeight;
}

/**
 * Median (50th percentile).
 * Uses the interpolation method for even-length arrays.
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Population variance (σ²).
 * Divides by N, not N-1.
 */
export function variancePopulation(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = mean(values);
  return values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length;
}

/**
 * Sample variance (s²).
 * Divides by N-1 (Bessel's correction) for unbiased estimation.
 */
export function varianceSample(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  return values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / (values.length - 1);
}

/**
 * Population standard deviation (σ).
 */
export function stdDevPopulation(values: number[]): number {
  return Math.sqrt(variancePopulation(values));
}

/**
 * Sample standard deviation (s).
 */
export function stdDevSample(values: number[]): number {
  return Math.sqrt(varianceSample(values));
}

/**
 * Percentile using the NIST interpolation method.
 * p is 0-100 (e.g., 95 for 95th percentile).
 */
export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  if (p <= 0) return Math.min(...values);
  if (p >= 100) return Math.max(...values);

  const sorted = [...values].sort((a, b) => a - b);
  const rank = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(rank);
  const upper = Math.ceil(rank);
  const fraction = rank - lower;

  if (lower === upper) return sorted[lower];
  return sorted[lower] * (1 - fraction) + sorted[upper] * fraction;
}

/**
 * Interquartile Range (IQR = Q3 - Q1).
 */
export function iqr(values: number[]): number {
  return percentile(values, 75) - percentile(values, 25);
}

/**
 * Z-score: how many standard deviations a value is from the mean.
 * Uses population std dev.
 */
export function zScore(value: number, values: number[]): number {
  const avg = mean(values);
  const sd = stdDevPopulation(values);
  if (sd === 0) return 0;
  return (value - avg) / sd;
}

/**
 * Z-scores for all values in the array.
 */
export function zScores(values: number[]): number[] {
  const avg = mean(values);
  const sd = stdDevPopulation(values);
  if (sd === 0) return values.map(() => 0);
  return values.map((v) => (v - avg) / sd);
}

/**
 * Simple Moving Average (SMA).
 * window: number of data points per window.
 */
export function movingAverage(values: number[], window: number): number[] {
  if (window <= 0 || window > values.length) return [];
  const result: number[] = [];
  for (let i = 0; i <= values.length - window; i++) {
    const slice = values.slice(i, i + window);
    result.push(mean(slice));
  }
  return result;
}

/**
 * Exponentially Weighted Moving Average (EWMA).
 * alpha: smoothing factor (0 < alpha ≤ 1). Higher = more weight on recent.
 * Common values: 0.1 (slow), 0.3 (moderate), 0.5 (fast).
 */
export function ewma(values: number[], alpha: number): number[] {
  if (values.length === 0) return [];
  if (alpha <= 0 || alpha > 1) {
    throw new Error('Alpha must be in (0, 1]');
  }
  const result: number[] = [values[0]];
  for (let i = 1; i < values.length; i++) {
    result.push(alpha * values[i] + (1 - alpha) * result[i - 1]);
  }
  return result;
}

/**
 * Linear regression (least squares).
 * Returns slope (m), intercept (b), and R² coefficient of determination.
 * y = m*x + b
 */
export function linearRegression(x: number[], y: number[]): {
  slope: number;
  intercept: number;
  rSquared: number;
} {
  if (x.length !== y.length || x.length < 2) {
    return { slope: 0, intercept: 0, rSquared: 0 };
  }

  const n = x.length;
  const sumX = x.reduce((s, v) => s + v, 0);
  const sumY = y.reduce((s, v) => s + v, 0);
  const sumXY = x.reduce((s, v, i) => s + v * y[i], 0);
  const sumX2 = x.reduce((s, v) => s + v * v, 0);
  const sumY2 = y.reduce((s, v) => s + v * v, 0);

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return { slope: 0, intercept: mean(y), rSquared: 0 };

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  // R² = 1 - SS_res / SS_tot
  const yMean = sumY / n;
  const ssTot = sumY2 - n * yMean * yMean;
  const ssRes = y.reduce((s, yi, i) => {
    const predicted = slope * x[i] + intercept;
    return s + (yi - predicted) ** 2;
  }, 0);
  const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  return { slope, intercept, rSquared: Math.max(0, Math.min(1, rSquared)) };
}

/**
 * Coefficient of Variation (CV = σ/μ × 100).
 * Measures relative variability. Lower = more consistent.
 */
export function coefficientOfVariation(values: number[]): number {
  const avg = mean(values);
  if (avg === 0) return 0;
  return (stdDevPopulation(values) / Math.abs(avg)) * 100;
}

/**
 * Shannon Entropy (H).
 * Measures information content / uncertainty in a distribution.
 * Input: array of probabilities (must sum to ~1) or raw counts.
 * Returns entropy in bits (log base 2).
 */
export function shannonEntropy(values: number[]): number {
  if (values.length === 0) return 0;
  const total = values.reduce((s, v) => s + v, 0);
  if (total === 0) return 0;

  let entropy = 0;
  for (const v of values) {
    if (v <= 0) continue;
    const p = v / total;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

/**
 * Normalized Shannon Entropy (0-1).
 * 0 = perfectly concentrated, 1 = perfectly uniform.
 */
export function normalizedEntropy(values: number[]): number {
  const h = shannonEntropy(values);
  const maxH = Math.log2(values.filter((v) => v > 0).length);
  if (maxH === 0) return 0;
  return h / maxH;
}

/**
 * Cosine similarity between two vectors.
 * Returns value in [-1, 1]. 1 = identical direction.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return dotProduct / denom;
}

/**
 * Euclidean distance between two vectors.
 */
export function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  return Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));
}

/**
 * Min-Max normalization to [0, 1].
 */
export function normalize(values: number[]): number[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 0.5);
  return values.map((v) => (v - min) / (max - min));
}

/**
 * Clamp a value to [min, max].
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between a and b at fraction t.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}
