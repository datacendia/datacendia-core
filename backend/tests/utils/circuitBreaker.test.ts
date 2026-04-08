/**
 * Tests for backend/src/utils/circuitBreaker.ts
 * Covers: CircuitBreaker state transitions, execute, fallback, stats, reset, trip
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the logger to prevent console output
vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { getCircuitBreaker, getAllCircuitBreakerStats, CircuitBreaker } from '../../src/utils/circuitBreaker.js';

describe('CircuitBreaker', () => {
  let breaker: CircuitBreaker;

  beforeEach(() => {
    // Create a fresh breaker with unique name for test isolation
    breaker = getCircuitBreaker(`test-${Date.now()}-${Math.random()}`, {
      failureThreshold: 3,
      resetTimeout: 100,
      halfOpenMaxAttempts: 2,
    });
  });

  describe('initial state', () => {
    it('should start in CLOSED state', () => {
      const stats = breaker.getStats();
      expect(stats.state).toBe('CLOSED');
      expect(stats.failures).toBe(0);
      expect(stats.successes).toBe(0);
      expect(stats.totalCalls).toBe(0);
    });
  });

  describe('CLOSED state', () => {
    it('should execute function successfully', async () => {
      const result = await breaker.execute(async () => 'success');
      expect(result).toBe('success');
      expect(breaker.getStats().totalCalls).toBe(1);
    });

    it('should track successes', async () => {
      await breaker.execute(async () => 'ok');
      const stats = breaker.getStats();
      expect(stats.lastSuccess).toBeDefined();
      expect(stats.failures).toBe(0);
    });

    it('should count failures without opening', async () => {
      const fail = async () => { throw new Error('fail'); };
      for (let i = 0; i < 2; i++) {
        await breaker.execute(fail).catch(() => {});
      }
      const stats = breaker.getStats();
      expect(stats.state).toBe('CLOSED');
      expect(stats.failures).toBe(2);
    });

    it('should reset failure count on success', async () => {
      await breaker.execute(async () => { throw new Error('fail'); }).catch(() => {});
      await breaker.execute(async () => { throw new Error('fail'); }).catch(() => {});
      await breaker.execute(async () => 'success');
      expect(breaker.getStats().failures).toBe(0);
    });
  });

  describe('CLOSED → OPEN transition', () => {
    it('should open after reaching failure threshold', async () => {
      const fail = async () => { throw new Error('fail'); };
      for (let i = 0; i < 3; i++) {
        await breaker.execute(fail).catch(() => {});
      }
      expect(breaker.getStats().state).toBe('OPEN');
    });
  });

  describe('OPEN state', () => {
    beforeEach(async () => {
      const fail = async () => { throw new Error('fail'); };
      for (let i = 0; i < 3; i++) {
        await breaker.execute(fail).catch(() => {});
      }
    });

    it('should reject calls without fallback', async () => {
      await expect(breaker.execute(async () => 'success')).rejects.toThrow('Service unavailable');
    });

    it('should use fallback when open', async () => {
      const result = await breaker.execute(
        async () => 'success',
        () => 'fallback-value'
      );
      expect(result).toBe('fallback-value');
    });
  });

  describe('OPEN → HALF_OPEN transition', () => {
    it('should transition to HALF_OPEN after reset timeout', async () => {
      const fail = async () => { throw new Error('fail'); };
      for (let i = 0; i < 3; i++) {
        await breaker.execute(fail).catch(() => {});
      }
      expect(breaker.getStats().state).toBe('OPEN');

      await new Promise(resolve => setTimeout(resolve, 150));
      await breaker.execute(async () => 'recovered');
      const stats = breaker.getStats();
      expect(stats.state === 'HALF_OPEN' || stats.state === 'CLOSED').toBe(true);
    });
  });

  describe('HALF_OPEN → CLOSED transition', () => {
    it('should close after enough successes in HALF_OPEN', async () => {
      const fail = async () => { throw new Error('fail'); };
      for (let i = 0; i < 3; i++) {
        await breaker.execute(fail).catch(() => {});
      }
      await new Promise(resolve => setTimeout(resolve, 150));
      await breaker.execute(async () => 'ok');
      await breaker.execute(async () => 'ok');
      expect(breaker.getStats().state).toBe('CLOSED');
    });
  });

  describe('HALF_OPEN → OPEN on failure', () => {
    it('should return to OPEN on failure during HALF_OPEN', async () => {
      const fail = async () => { throw new Error('fail'); };
      for (let i = 0; i < 3; i++) {
        await breaker.execute(fail).catch(() => {});
      }
      await new Promise(resolve => setTimeout(resolve, 150));
      await breaker.execute(fail).catch(() => {});
      expect(breaker.getStats().state).toBe('OPEN');
    });
  });

  describe('manual controls', () => {
    it('should manually reset to CLOSED', async () => {
      const fail = async () => { throw new Error('fail'); };
      for (let i = 0; i < 3; i++) {
        await breaker.execute(fail).catch(() => {});
      }
      breaker.reset();
      expect(breaker.getStats().state).toBe('CLOSED');
      expect(breaker.getStats().failures).toBe(0);
    });

    it('should manually trip to OPEN', () => {
      breaker.trip();
      expect(breaker.getStats().state).toBe('OPEN');
    });
  });

  describe('stats tracking', () => {
    it('should track total calls and failures', async () => {
      await breaker.execute(async () => 'ok');
      await breaker.execute(async () => { throw new Error('fail'); }).catch(() => {});
      await breaker.execute(async () => 'ok');
      const stats = breaker.getStats();
      expect(stats.totalCalls).toBe(3);
      expect(stats.totalFailures).toBe(1);
    });
  });
});

describe('getCircuitBreaker', () => {
  it('should return same instance for same name', () => {
    const name = `singleton-test-${Date.now()}`;
    const a = getCircuitBreaker(name);
    const b = getCircuitBreaker(name);
    expect(a).toBe(b);
  });
});

describe('getAllCircuitBreakerStats', () => {
  it('should return stats for all registered breakers', () => {
    const name = `stats-test-${Date.now()}`;
    getCircuitBreaker(name);
    const stats = getAllCircuitBreakerStats();
    expect(stats[name]).toBeDefined();
    expect(stats[name].state).toBe('CLOSED');
  });
});
