/**
 * Tests for backend/src/utils/deterministic.ts
 * Covers: deterministicScore, deterministicFloat, deterministicInt,
 *         deterministicPercentage, deterministicCurrency, deterministicPick,
 *         deterministicBool, deterministicLatency,
 *         computeRiskScore, computeComplianceScore, computeServiceHealth
 */

import { describe, it, expect } from 'vitest';
import {
  deterministicScore,
  deterministicFloat,
  deterministicInt,
  deterministicPercentage,
  deterministicCurrency,
  deterministicPick,
  deterministicBool,
  deterministicLatency,
  computeRiskScore,
  computeComplianceScore,
  computeServiceHealth,
} from '../../src/utils/deterministic.js';

describe('deterministicFloat', () => {
  it('should return a value between 0 and 1', () => {
    const result = deterministicFloat('seed');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });

  it('should be deterministic (same inputs = same output)', () => {
    const result1 = deterministicFloat('seed', 'factor1', 42);
    const result2 = deterministicFloat('seed', 'factor1', 42);
    expect(result1).toBe(result2);
  });

  it('should produce different values for different seeds', () => {
    const result1 = deterministicFloat('seed1');
    const result2 = deterministicFloat('seed2');
    expect(result1).not.toBe(result2);
  });

  it('should produce different values for different factors', () => {
    const result1 = deterministicFloat('seed', 'a');
    const result2 = deterministicFloat('seed', 'b');
    expect(result1).not.toBe(result2);
  });
});

describe('deterministicScore', () => {
  it('should return a value between 0 and 100', () => {
    const result = deterministicScore('test-seed');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('should be deterministic', () => {
    const a = deterministicScore('seed', 'factor');
    const b = deterministicScore('seed', 'factor');
    expect(a).toBe(b);
  });
});

describe('deterministicInt', () => {
  it('should return an integer within range', () => {
    const result = deterministicInt(1, 10, 'seed');
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should be deterministic', () => {
    const a = deterministicInt(0, 100, 'seed', 'factor');
    const b = deterministicInt(0, 100, 'seed', 'factor');
    expect(a).toBe(b);
  });

  it('should handle single value range', () => {
    const result = deterministicInt(5, 5, 'seed');
    expect(result).toBe(5);
  });
});

describe('deterministicPercentage', () => {
  it('should return a value between 0 and 100', () => {
    const result = deterministicPercentage(50, 30, 'seed');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('should be near the base value', () => {
    const result = deterministicPercentage(50, 5, 'seed');
    expect(result).toBeGreaterThanOrEqual(45);
    expect(result).toBeLessThanOrEqual(55);
  });

  it('should clamp to 0-100', () => {
    const result = deterministicPercentage(0, 50, 'seed');
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

describe('deterministicCurrency', () => {
  it('should return a value within range', () => {
    const result = deterministicCurrency(100, 500, 'seed');
    expect(result).toBeGreaterThanOrEqual(100);
    expect(result).toBeLessThanOrEqual(500);
  });

  it('should have at most two decimal places', () => {
    const result = deterministicCurrency(0, 1000, 'seed');
    const decimals = result.toString().split('.')[1];
    expect(!decimals || decimals.length <= 2).toBe(true);
  });
});

describe('deterministicPick', () => {
  it('should pick an item from the array', () => {
    const items = ['apple', 'banana', 'cherry'];
    const result = deterministicPick(items, 'seed');
    expect(items).toContain(result);
  });

  it('should be deterministic', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    const a = deterministicPick(items, 'seed');
    const b = deterministicPick(items, 'seed');
    expect(a).toBe(b);
  });

  it('should handle single item array', () => {
    expect(deterministicPick(['only'], 'seed')).toBe('only');
  });
});

describe('deterministicBool', () => {
  it('should return true for probability 1', () => {
    expect(deterministicBool(1, 'seed')).toBe(true);
  });

  it('should return false for probability 0', () => {
    expect(deterministicBool(0, 'seed')).toBe(false);
  });

  it('should be deterministic', () => {
    const a = deterministicBool(0.5, 'seed', 'factor');
    const b = deterministicBool(0.5, 'seed', 'factor');
    expect(a).toBe(b);
  });
});

describe('deterministicLatency', () => {
  it('should return a value at least baseMs', () => {
    const result = deterministicLatency(100, 'seed');
    expect(result).toBeGreaterThanOrEqual(100);
  });

  it('should be an integer', () => {
    const result = deterministicLatency(50, 'seed');
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should be deterministic', () => {
    const a = deterministicLatency(100, 'seed');
    const b = deterministicLatency(100, 'seed');
    expect(a).toBe(b);
  });
});

describe('computeRiskScore', () => {
  it('should return base score for empty params', () => {
    const score = computeRiskScore({});
    expect(score).toBe(5); // medium urgency default
  });

  it('should score high financial impact', () => {
    const score = computeRiskScore({ financialImpact: 15_000_000 });
    expect(score).toBeGreaterThanOrEqual(25);
  });

  it('should score compliance frameworks', () => {
    const score = computeRiskScore({ complianceFrameworks: ['SOC2', 'GDPR', 'HIPAA'] });
    expect(score).toBeGreaterThanOrEqual(15);
  });

  it('should score governance flags', () => {
    const score = computeRiskScore({ hasVetoes: true, hasDissents: true });
    expect(score).toBeGreaterThanOrEqual(15);
  });

  it('should score urgency levels', () => {
    const low = computeRiskScore({ urgency: 'low' });
    const critical = computeRiskScore({ urgency: 'critical' });
    expect(critical).toBeGreaterThan(low);
  });

  it('should clamp to 0-100', () => {
    const score = computeRiskScore({
      financialImpact: 100_000_000,
      complianceFrameworks: ['a', 'b', 'c', 'd', 'e'],
      stakeholderCount: 10,
      urgency: 'critical',
      hasVetoes: true,
      hasDissents: true,
      historicalFailureRate: 1.0,
    });
    expect(score).toBeLessThanOrEqual(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

describe('computeComplianceScore', () => {
  it('should return full score for perfect compliance', () => {
    const score = computeComplianceScore({
      totalRequirements: 100,
      metRequirements: 100,
      criticalGaps: 0,
      lastAuditDaysAgo: 0,
      automatedChecks: 50,
      totalChecks: 50,
    });
    expect(score).toBe(100);
  });

  it('should penalize critical gaps', () => {
    const perfect = computeComplianceScore({
      totalRequirements: 100, metRequirements: 100,
      criticalGaps: 0, lastAuditDaysAgo: 0,
      automatedChecks: 50, totalChecks: 50,
    });
    const withGaps = computeComplianceScore({
      totalRequirements: 100, metRequirements: 100,
      criticalGaps: 5, lastAuditDaysAgo: 0,
      automatedChecks: 50, totalChecks: 50,
    });
    expect(withGaps).toBeLessThan(perfect);
  });

  it('should penalize old audits', () => {
    const recent = computeComplianceScore({
      totalRequirements: 100, metRequirements: 100,
      criticalGaps: 0, lastAuditDaysAgo: 1,
      automatedChecks: 50, totalChecks: 50,
    });
    const old = computeComplianceScore({
      totalRequirements: 100, metRequirements: 100,
      criticalGaps: 0, lastAuditDaysAgo: 300,
      automatedChecks: 50, totalChecks: 50,
    });
    expect(recent).toBeGreaterThan(old);
  });

  it('should handle zero requirements', () => {
    const score = computeComplianceScore({
      totalRequirements: 0, metRequirements: 0,
      criticalGaps: 0, lastAuditDaysAgo: 0,
      automatedChecks: 0, totalChecks: 0,
    });
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('should clamp to 0-100', () => {
    const score = computeComplianceScore({
      totalRequirements: 100, metRequirements: 0,
      criticalGaps: 50, lastAuditDaysAgo: 365,
      automatedChecks: 0, totalChecks: 100,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe('computeServiceHealth', () => {
  it('should return 100 for perfect health', () => {
    const score = computeServiceHealth({
      uptimePercent: 100, avgResponseMs: 50, errorRate: 0,
    });
    expect(score).toBe(100);
  });

  it('should penalize low uptime', () => {
    const score = computeServiceHealth({
      uptimePercent: 90, avgResponseMs: 50, errorRate: 0,
    });
    expect(score).toBeLessThan(100);
  });

  it('should penalize high response time', () => {
    const fast = computeServiceHealth({ uptimePercent: 100, avgResponseMs: 100, errorRate: 0 });
    const slow = computeServiceHealth({ uptimePercent: 100, avgResponseMs: 6000, errorRate: 0 });
    expect(fast).toBeGreaterThan(slow);
  });

  it('should penalize high error rate', () => {
    const clean = computeServiceHealth({ uptimePercent: 100, avgResponseMs: 50, errorRate: 0 });
    const errorProne = computeServiceHealth({ uptimePercent: 100, avgResponseMs: 50, errorRate: 0.5 });
    expect(clean).toBeGreaterThan(errorProne);
  });

  it('should penalize high memory usage', () => {
    const score = computeServiceHealth({
      uptimePercent: 100, avgResponseMs: 50, errorRate: 0,
      memoryUsageMB: 950, memoryLimitMB: 1000,
    });
    expect(score).toBeLessThan(100);
  });

  it('should clamp to 0-100', () => {
    const score = computeServiceHealth({
      uptimePercent: 0, avgResponseMs: 10000, errorRate: 1,
      queueDepth: 200, memoryUsageMB: 1000, memoryLimitMB: 1000,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
