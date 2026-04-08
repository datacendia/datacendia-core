/**
 * Tests for lib/utils.ts
 * Covers: formatCurrency, formatNumber, formatBytes, formatRelativeTime
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatCurrency, formatNumber, formatBytes, formatRelativeTime } from '../../lib/utils';

describe('formatCurrency', () => {
  it('should format USD by default', () => {
    const result = formatCurrency(1234.56);
    expect(result).toBe('$1,234.56');
  });

  it('should format zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format negative values', () => {
    const result = formatCurrency(-500);
    expect(result).toBe('-$500.00');
  });

  it('should format with custom currency', () => {
    const result = formatCurrency(1000, 'EUR', 'de-DE');
    expect(result).toContain('1.000');
  });

  it('should format large numbers', () => {
    const result = formatCurrency(1000000);
    expect(result).toBe('$1,000,000.00');
  });
});

describe('formatNumber', () => {
  it('should format with locale string', () => {
    const result = formatNumber(1234567);
    expect(result).toBe('1,234,567');
  });

  it('should format with decimal places', () => {
    const result = formatNumber(3.14159, 2);
    expect(result).toBe('3.14');
  });

  it('should format zero with decimals', () => {
    expect(formatNumber(0, 2)).toBe('0.00');
  });

  it('should format with custom locale', () => {
    const result = formatNumber(1234.5, 'de-DE');
    expect(result).toContain('1.234');
  });

  it('should format negative numbers', () => {
    const result = formatNumber(-42, 0);
    expect(result).toBe('-42');
  });
});

describe('formatBytes', () => {
  it('should return "0 Bytes" for zero', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('should format bytes', () => {
    expect(formatBytes(500)).toBe('500 Bytes');
  });

  it('should format kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('should format megabytes', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
  });

  it('should format gigabytes', () => {
    expect(formatBytes(1073741824)).toBe('1 GB');
  });

  it('should format terabytes', () => {
    expect(formatBytes(1099511627776)).toBe('1 TB');
  });

  it('should respect decimal places', () => {
    expect(formatBytes(1536, 1)).toBe('1.5 KB');
  });

  it('should handle fractional KB', () => {
    const result = formatBytes(1500, 2);
    expect(result).toBe('1.46 KB');
  });
});

describe('formatRelativeTime', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return "just now" for recent times', () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe('just now');
  });

  it('should return minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000);
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago');
  });

  it('should return hours ago', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600000);
    expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago');
  });

  it('should return days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000);
    expect(formatRelativeTime(twoDaysAgo)).toBe('2d ago');
  });

  it('should handle string dates', () => {
    const dateStr = new Date(Date.now() - 10 * 60000).toISOString();
    expect(formatRelativeTime(dateStr)).toBe('10m ago');
  });

  it('should handle 59 minutes (still minutes)', () => {
    const fiftyNineMinutes = new Date(Date.now() - 59 * 60000);
    expect(formatRelativeTime(fiftyNineMinutes)).toBe('59m ago');
  });

  it('should handle 23 hours (still hours)', () => {
    const twentyThreeHours = new Date(Date.now() - 23 * 3600000);
    expect(formatRelativeTime(twentyThreeHours)).toBe('23h ago');
  });
});
