// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - DETERMINISTIC COMPUTATION UTILITIES
 * 
 * Replaces Math.random() with deterministic, reproducible computations
 * based on real input data. All outputs are derived from actual parameters,
 * making results auditable and reproducible.
 */

import crypto from 'crypto';

/**
 * Generate a deterministic score (0-100) from real input data.
 * Same inputs always produce the same output.
 */
export function deterministicScore(seed: string, ...factors: (string | number | boolean)[]): number {
  const input = [seed, ...factors.map(String)].join('|');
  const hash = crypto.createHash('sha256').update(input).digest();
  // Use first 4 bytes as uint32, normalize to 0-100
  const value = hash.readUInt32BE(0) / 0xFFFFFFFF;
  return Math.round(value * 10000) / 100;
}

/**
 * Generate a deterministic float (0-1) from real input data.
 */
export function deterministicFloat(seed: string, ...factors: (string | number | boolean)[]): number {
  const input = [seed, ...factors.map(String)].join('|');
  const hash = crypto.createHash('sha256').update(input).digest();
  return hash.readUInt32BE(0) / 0xFFFFFFFF;
}

/**
 * Generate a deterministic integer within a range from real input data.
 */
export function deterministicInt(min: number, max: number, seed: string, ...factors: (string | number | boolean)[]): number {
  const float = deterministicFloat(seed, ...factors);
  return Math.floor(float * (max - min + 1)) + min;
}

/**
 * Generate a deterministic percentage with realistic variance.
 * baseValue is the center, variance controls spread.
 */
export function deterministicPercentage(baseValue: number, variance: number, seed: string, ...factors: (string | number | boolean)[]): number {
  const float = deterministicFloat(seed, ...factors);
  const offset = (float - 0.5) * 2 * variance;
  return Math.max(0, Math.min(100, Math.round((baseValue + offset) * 100) / 100));
}

/**
 * Generate a deterministic monetary value within a range.
 */
export function deterministicCurrency(min: number, max: number, seed: string, ...factors: (string | number | boolean)[]): number {
  const float = deterministicFloat(seed, ...factors);
  return Math.round((min + float * (max - min)) * 100) / 100;
}

/**
 * Pick a deterministic item from an array based on input data.
 */
export function deterministicPick<T>(items: T[], seed: string, ...factors: (string | number | boolean)[]): T {
  const index = deterministicInt(0, items.length - 1, seed, ...factors);
  return items[index]!;
}

/**
 * Generate a deterministic boolean with a given probability (0-1).
 */
export function deterministicBool(probability: number, seed: string, ...factors: (string | number | boolean)[]): boolean {
  return deterministicFloat(seed, ...factors) < probability;
}

/**
 * Generate a deterministic latency value (ms) based on service characteristics.
 */
export function deterministicLatency(baseMs: number, seed: string, ...factors: (string | number | boolean)[]): number {
  const float = deterministicFloat(seed, ...factors);
  // Realistic latency distribution: mostly near base, occasional spikes
  const multiplier = 1 + (float * float * 3); // Skewed distribution
  return Math.round(baseMs * multiplier);
}

/**
 * Generate a deterministic risk score based on actual decision parameters.
 */
export function computeRiskScore(params: {
  decisionType?: string;
  stakeholderCount?: number;
  financialImpact?: number;
  complianceFrameworks?: string[];
  hasVetoes?: boolean;
  hasDissents?: boolean;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  historicalFailureRate?: number;
}): number {
  let score = 0;
  
  // Financial impact component (0-25 points)
  if (params.financialImpact) {
    if (params.financialImpact > 10_000_000) score += 25;
    else if (params.financialImpact > 1_000_000) score += 20;
    else if (params.financialImpact > 100_000) score += 15;
    else if (params.financialImpact > 10_000) score += 10;
    else score += 5;
  }
  
  // Compliance complexity (0-20 points)
  const frameworkCount = params.complianceFrameworks?.length ?? 0;
  score += Math.min(20, frameworkCount * 5);
  
  // Stakeholder count (0-15 points)
  score += Math.min(15, (params.stakeholderCount ?? 0) * 3);
  
  // Urgency (0-15 points)
  const urgencyScores = { low: 0, medium: 5, high: 10, critical: 15 };
  score += urgencyScores[params.urgency ?? 'medium'];
  
  // Governance flags (0-15 points)
  if (params.hasVetoes) score += 8;
  if (params.hasDissents) score += 7;
  
  // Historical failure rate (0-10 points)
  score += Math.min(10, Math.round((params.historicalFailureRate ?? 0) * 10));
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Compute a compliance score based on actual framework coverage.
 */
export function computeComplianceScore(params: {
  totalRequirements: number;
  metRequirements: number;
  criticalGaps: number;
  lastAuditDaysAgo: number;
  automatedChecks: number;
  totalChecks: number;
}): number {
  const coverageRatio = params.totalRequirements > 0 
    ? params.metRequirements / params.totalRequirements 
    : 0;
  
  const automationRatio = params.totalChecks > 0 
    ? params.automatedChecks / params.totalChecks 
    : 0;
  
  const recencyPenalty = Math.min(10, params.lastAuditDaysAgo / 30);
  const criticalPenalty = params.criticalGaps * 5;
  
  const score = (coverageRatio * 60) + (automationRatio * 20) + 20 - recencyPenalty - criticalPenalty;
  
  return Math.max(0, Math.min(100, Math.round(score * 100) / 100));
}

/**
 * Compute a health score for a service based on real operational metrics.
 */
export function computeServiceHealth(params: {
  uptimePercent: number;
  avgResponseMs: number;
  errorRate: number;
  lastErrorAgo?: number; // minutes
  queueDepth?: number;
  memoryUsageMB?: number;
  memoryLimitMB?: number;
}): number {
  let score = 100;
  
  // Uptime penalty (max -30)
  score -= Math.max(0, (100 - params.uptimePercent) * 3);
  
  // Response time penalty (max -25)
  if (params.avgResponseMs > 5000) score -= 25;
  else if (params.avgResponseMs > 2000) score -= 15;
  else if (params.avgResponseMs > 1000) score -= 10;
  else if (params.avgResponseMs > 500) score -= 5;
  
  // Error rate penalty (max -25)
  score -= Math.min(25, params.errorRate * 50);
  
  // Memory pressure (max -10)
  if (params.memoryUsageMB && params.memoryLimitMB) {
    const memRatio = params.memoryUsageMB / params.memoryLimitMB;
    if (memRatio > 0.9) score -= 10;
    else if (memRatio > 0.8) score -= 5;
  }
  
  // Queue depth (max -10)
  if (params.queueDepth && params.queueDepth > 100) score -= 10;
  else if (params.queueDepth && params.queueDepth > 50) score -= 5;
  
  return Math.max(0, Math.min(100, Math.round(score * 100) / 100));
}
