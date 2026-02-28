// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ANOMALY DETECTION ALGORITHMS
// =============================================================================
// Implements statistical anomaly detection methods for compliance drift,
// early warning systems, and operational monitoring.
// References:
//   - Grubbs' Test (ISO 5725-2)
//   - Modified Z-Score (Iglewicz & Hoaglin, 1993)
//   - IQR Fencing (Tukey, 1977)
//   - CUSUM (Page, 1954)

import { mean, stdDevPopulation, median, iqr, ewma, zScore } from './statistics';

// =============================================================================
// TYPES
// =============================================================================

export interface AnomalyResult {
  index: number;
  value: number;
  score: number;
  type: 'spike' | 'drop' | 'drift' | 'outlier';
  severity: 'low' | 'medium' | 'high' | 'critical';
  method: string;
}

export interface DriftResult {
  isDrifting: boolean;
  driftDirection: 'up' | 'down' | 'stable';
  driftMagnitude: number;
  driftRate: number;
  changePoint: number | null;
  confidence: number;
}

// =============================================================================
// Z-SCORE ANOMALY DETECTION
// =============================================================================

/**
 * Detect anomalies using Z-score thresholds.
 * Standard approach: |z| > 3 is anomalous (99.7% of data is within 3σ).
 * 
 * @param values - Time series or dataset
 * @param threshold - Z-score threshold (default: 3.0)
 * @returns Array of detected anomalies
 */
export function detectAnomaliesZScore(
  values: number[],
  threshold: number = 3.0
): AnomalyResult[] {
  if (values.length < 3) return [];

  const avg = mean(values);
  const sd = stdDevPopulation(values);
  if (sd === 0) return [];

  const anomalies: AnomalyResult[] = [];

  values.forEach((v, i) => {
    const z = Math.abs((v - avg) / sd);
    if (z > threshold) {
      const absZ = z;
      anomalies.push({
        index: i,
        value: v,
        score: absZ,
        type: v > avg ? 'spike' : 'drop',
        severity: absZ > 4 ? 'critical' : absZ > 3.5 ? 'high' : absZ > 3 ? 'medium' : 'low',
        method: 'z-score',
      });
    }
  });

  return anomalies;
}

// =============================================================================
// MODIFIED Z-SCORE (Robust to Outliers)
// =============================================================================
// Uses Median Absolute Deviation (MAD) instead of standard deviation.
// More robust for datasets that already contain outliers.
// Reference: Iglewicz & Hoaglin (1993)

/**
 * Median Absolute Deviation.
 * MAD = median(|x_i - median(x)|)
 */
export function medianAbsoluteDeviation(values: number[]): number {
  const med = median(values);
  const deviations = values.map((v) => Math.abs(v - med));
  return median(deviations);
}

/**
 * Modified Z-score using MAD.
 * M_i = 0.6745 × (x_i - median) / MAD
 * Threshold: |M| > 3.5 is typically considered anomalous.
 */
export function modifiedZScore(value: number, values: number[]): number {
  const med = median(values);
  const mad = medianAbsoluteDeviation(values);
  if (mad === 0) return 0;
  return 0.6745 * (value - med) / mad;
}

/**
 * Detect anomalies using Modified Z-score (robust method).
 */
export function detectAnomaliesModifiedZ(
  values: number[],
  threshold: number = 3.5
): AnomalyResult[] {
  if (values.length < 3) return [];

  const med = median(values);
  const mad = medianAbsoluteDeviation(values);
  if (mad === 0) return [];

  const anomalies: AnomalyResult[] = [];

  values.forEach((v, i) => {
    const mz = Math.abs(0.6745 * (v - med) / mad);
    if (mz > threshold) {
      anomalies.push({
        index: i,
        value: v,
        score: mz,
        type: v > med ? 'spike' : 'drop',
        severity: mz > 5 ? 'critical' : mz > 4 ? 'high' : mz > 3.5 ? 'medium' : 'low',
        method: 'modified-z-score',
      });
    }
  });

  return anomalies;
}

// =============================================================================
// IQR FENCING (Tukey's Method)
// =============================================================================
// Outlier if value < Q1 - k×IQR or value > Q3 + k×IQR
// k=1.5 for outliers, k=3.0 for extreme outliers

/**
 * Detect outliers using IQR fencing (Tukey's method).
 * @param k - Multiplier (1.5 = outlier, 3.0 = extreme outlier)
 */
export function detectOutliersIQR(
  values: number[],
  k: number = 1.5
): AnomalyResult[] {
  if (values.length < 4) return [];

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqrVal = q3 - q1;

  const lowerFence = q1 - k * iqrVal;
  const upperFence = q3 + k * iqrVal;

  const anomalies: AnomalyResult[] = [];

  values.forEach((v, i) => {
    if (v < lowerFence || v > upperFence) {
      const distance = v < lowerFence ? (lowerFence - v) / iqrVal : (v - upperFence) / iqrVal;
      anomalies.push({
        index: i,
        value: v,
        score: distance,
        type: v < lowerFence ? 'drop' : 'spike',
        severity: distance > 3 ? 'critical' : distance > 2 ? 'high' : distance > 1 ? 'medium' : 'low',
        method: 'iqr-fence',
      });
    }
  });

  return anomalies;
}

// =============================================================================
// CUSUM (Cumulative Sum Control Chart)
// =============================================================================
// Detects persistent shifts in the mean of a process.
// Used in: Manufacturing SPC, compliance drift detection, financial surveillance.
// Reference: Page (1954)

/**
 * CUSUM change detection.
 * Detects when a process mean shifts from its target.
 * 
 * @param values - Time-ordered measurements
 * @param target - Expected mean (default: calculated from data)
 * @param threshold - Decision threshold h (default: 5σ)
 * @param slack - Allowable slack k (default: 0.5σ)
 */
export function cusum(
  values: number[],
  target?: number,
  threshold?: number,
  slack?: number
): {
  cusumHigh: number[];
  cusumLow: number[];
  alarms: Array<{ index: number; type: 'high' | 'low'; value: number }>;
} {
  if (values.length < 2) {
    return { cusumHigh: [], cusumLow: [], alarms: [] };
  }

  const mu = target ?? mean(values);
  const sigma = stdDevPopulation(values);
  const h = threshold ?? 5 * sigma;
  const k = slack ?? 0.5 * sigma;

  const cusumHigh: number[] = [0];
  const cusumLow: number[] = [0];
  const alarms: Array<{ index: number; type: 'high' | 'low'; value: number }> = [];

  for (let i = 0; i < values.length; i++) {
    const prevHigh = cusumHigh[cusumHigh.length - 1];
    const prevLow = cusumLow[cusumLow.length - 1];

    const newHigh = Math.max(0, prevHigh + values[i] - mu - k);
    const newLow = Math.max(0, prevLow - values[i] + mu - k);

    cusumHigh.push(newHigh);
    cusumLow.push(newLow);

    if (newHigh > h) {
      alarms.push({ index: i, type: 'high', value: newHigh });
    }
    if (newLow > h) {
      alarms.push({ index: i, type: 'low', value: newLow });
    }
  }

  return { cusumHigh: cusumHigh.slice(1), cusumLow: cusumLow.slice(1), alarms };
}

// =============================================================================
// DRIFT DETECTION
// =============================================================================

/**
 * Detect drift in a time series using EWMA comparison.
 * Compares recent behavior to historical baseline.
 * 
 * @param values - Time-ordered values
 * @param baselineRatio - Fraction of data to use as baseline (default: 0.7)
 * @param alpha - EWMA smoothing factor (default: 0.3)
 * @param threshold - Drift detection threshold in σ units (default: 2.0)
 */
export function detectDrift(
  values: number[],
  baselineRatio: number = 0.7,
  alpha: number = 0.3,
  threshold: number = 2.0
): DriftResult {
  if (values.length < 10) {
    return { isDrifting: false, driftDirection: 'stable', driftMagnitude: 0, driftRate: 0, changePoint: null, confidence: 0 };
  }

  const splitIdx = Math.floor(values.length * baselineRatio);
  const baseline = values.slice(0, splitIdx);
  const recent = values.slice(splitIdx);

  const baselineMean = mean(baseline);
  const baselineStd = stdDevPopulation(baseline);

  if (baselineStd === 0) {
    const recentMean = mean(recent);
    const isDiff = recentMean !== baselineMean;
    return {
      isDrifting: isDiff,
      driftDirection: recentMean > baselineMean ? 'up' : recentMean < baselineMean ? 'down' : 'stable',
      driftMagnitude: Math.abs(recentMean - baselineMean),
      driftRate: 0,
      changePoint: isDiff ? splitIdx : null,
      confidence: isDiff ? 1 : 0,
    };
  }

  const recentMean = mean(recent);
  const drift = (recentMean - baselineMean) / baselineStd;
  const isDrifting = Math.abs(drift) > threshold;

  // Find approximate change point using CUSUM
  let changePoint: number | null = null;
  if (isDrifting) {
    const cusumResult = cusum(values, baselineMean);
    if (cusumResult.alarms.length > 0) {
      changePoint = cusumResult.alarms[0].index;
    }
  }

  // Confidence based on effect size and sample size
  const effectSize = Math.abs(drift);
  const sampleConfidence = Math.min(1, recent.length / 30);
  const confidence = Math.min(1, effectSize / threshold * sampleConfidence);

  return {
    isDrifting,
    driftDirection: drift > threshold ? 'up' : drift < -threshold ? 'down' : 'stable',
    driftMagnitude: Math.abs(recentMean - baselineMean),
    driftRate: (recentMean - baselineMean) / recent.length,
    changePoint,
    confidence: Math.round(confidence * 100) / 100,
  };
}

// =============================================================================
// EARLY WARNING SCORE
// =============================================================================

/**
 * Calculate an Early Warning Score from multiple indicators.
 * Each indicator is scored based on how many σ it deviates from its baseline.
 * Returns 0-100 score where higher = more urgent warning.
 */
export function earlyWarningScore(
  indicators: Array<{
    name: string;
    current: number;
    baseline: number[];
    weight: number;
    higherIsBad?: boolean;
  }>
): {
  score: number;
  level: 'normal' | 'watch' | 'warning' | 'critical' | 'emergency';
  triggers: Array<{ name: string; deviation: number; severity: string }>;
} {
  if (indicators.length === 0) {
    return { score: 0, level: 'normal', triggers: [] };
  }

  const triggers: Array<{ name: string; deviation: number; severity: string }> = [];
  let weightedScore = 0;
  let totalWeight = 0;

  for (const ind of indicators) {
    const avg = mean(ind.baseline);
    const sd = stdDevPopulation(ind.baseline);
    const normalizedWeight = ind.weight;
    totalWeight += normalizedWeight;

    if (sd === 0) {
      const diff = Math.abs(ind.current - avg);
      if (diff > 0) {
        const severity = diff > avg * 0.5 ? 'critical' : diff > avg * 0.2 ? 'high' : 'medium';
        triggers.push({ name: ind.name, deviation: diff, severity });
        weightedScore += 75 * normalizedWeight;
      }
      continue;
    }

    let deviation = (ind.current - avg) / sd;
    if (ind.higherIsBad === false) deviation = -deviation;
    if (ind.higherIsBad === undefined) deviation = Math.abs(deviation);

    const factorScore = Math.min(100, Math.max(0, deviation * 25));
    weightedScore += factorScore * normalizedWeight;

    if (Math.abs(deviation) > 1.5) {
      const severity = Math.abs(deviation) > 3 ? 'critical' : Math.abs(deviation) > 2.5 ? 'high' : 'medium';
      triggers.push({ name: ind.name, deviation: Math.round(deviation * 100) / 100, severity });
    }
  }

  const score = totalWeight > 0 ? Math.round(Math.min(100, weightedScore / totalWeight)) : 0;

  let level: 'normal' | 'watch' | 'warning' | 'critical' | 'emergency';
  if (score >= 80) level = 'emergency';
  else if (score >= 60) level = 'critical';
  else if (score >= 40) level = 'warning';
  else if (score >= 20) level = 'watch';
  else level = 'normal';

  return { score, level, triggers };
}
