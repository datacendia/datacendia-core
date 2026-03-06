/**
 * Utility — Circuit Breaker
 *
 * Shared utility functions and helpers.
 *
 * @exports getCircuitBreaker, getAllCircuitBreakerStats, CircuitBreakerConfig, CircuitBreakerStats, CircuitState
 * @module utils/circuitBreaker
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { logger } from './logger.js';

/**
 * Circuit Breaker Implementation
 * 
 * Provides graceful degradation when external services fail.
 * States: CLOSED (normal) → OPEN (failing) → HALF_OPEN (testing)
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  name: string;
  failureThreshold: number;     // Failures before opening
  resetTimeout: number;         // ms before trying again (half-open)
  halfOpenMaxAttempts: number;  // Successes needed to close
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailure: Date | null;
  lastSuccess: Date | null;
  totalCalls: number;
  totalFailures: number;
}

const DEFAULT_CONFIGS: Record<string, Partial<CircuitBreakerConfig>> = {
  neo4j: { failureThreshold: 3, resetTimeout: 30000, halfOpenMaxAttempts: 2 },
  ollama: { failureThreshold: 2, resetTimeout: 60000, halfOpenMaxAttempts: 1 },
  redis: { failureThreshold: 5, resetTimeout: 10000, halfOpenMaxAttempts: 3 },
  postgres: { failureThreshold: 3, resetTimeout: 15000, halfOpenMaxAttempts: 2 },
};

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures = 0;
  private successes = 0;
  private lastFailure: Date | null = null;
  private lastSuccess: Date | null = null;
  private nextAttempt: Date | null = null;
  private totalCalls = 0;
  private totalFailures = 0;
  
  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(fn: () => Promise<T>, fallback?: () => T): Promise<T> {
    this.totalCalls++;

    // Check if circuit is open
    if (this.state === 'OPEN') {
      if (this.nextAttempt && new Date() < this.nextAttempt) {
        // Still in cooldown
        if (fallback) {
          logger.warn(`[CircuitBreaker:${this.config.name}] OPEN - using fallback`);
          return fallback();
        }
        throw new Error(`[CircuitBreaker:${this.config.name}] Service unavailable`);
      }
      // Cooldown expired, try half-open
      this.state = 'HALF_OPEN';
      this.successes = 0;
      logger.info(`[CircuitBreaker:${this.config.name}] Transitioning to HALF_OPEN`);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallback) {
        logger.warn(`[CircuitBreaker:${this.config.name}] Failed - using fallback`);
        return fallback();
      }
      throw error;
    }
  }

  private onSuccess(): void {
    this.lastSuccess = new Date();
    this.failures = 0;

    if (this.state === 'HALF_OPEN') {
      this.successes++;
      if (this.successes >= this.config.halfOpenMaxAttempts) {
        this.state = 'CLOSED';
        logger.info(`[CircuitBreaker:${this.config.name}] Recovered - CLOSED`);
      }
    }
  }

  private onFailure(): void {
    this.failures++;
    this.totalFailures++;
    this.lastFailure = new Date();

    if (this.state === 'HALF_OPEN') {
      // Failed during test, back to open
      this.state = 'OPEN';
      this.nextAttempt = new Date(Date.now() + this.config.resetTimeout);
      logger.warn(`[CircuitBreaker:${this.config.name}] Failed in HALF_OPEN - back to OPEN`);
    } else if (this.failures >= this.config.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = new Date(Date.now() + this.config.resetTimeout);
      logger.warn(`[CircuitBreaker:${this.config.name}] Threshold reached - OPEN until ${this.nextAttempt.toISOString()}`);
    }
  }

  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailure: this.lastFailure,
      lastSuccess: this.lastSuccess,
      totalCalls: this.totalCalls,
      totalFailures: this.totalFailures,
    };
  }

  // Manual reset (for admin/testing)
  reset(): void {
    this.state = 'CLOSED';
    this.failures = 0;
    this.successes = 0;
    this.nextAttempt = null;
    logger.info(`[CircuitBreaker:${this.config.name}] Manually reset to CLOSED`);
  }

  // Force open (for maintenance)
  trip(): void {
    this.state = 'OPEN';
    this.nextAttempt = new Date(Date.now() + this.config.resetTimeout);
    logger.info(`[CircuitBreaker:${this.config.name}] Manually tripped to OPEN`);
  }
}

// Registry of circuit breakers
const breakers = new Map<string, CircuitBreaker>();

export function getCircuitBreaker(name: string, customConfig?: Partial<CircuitBreakerConfig>): CircuitBreaker {
  if (!breakers.has(name)) {
    const defaultConfig = DEFAULT_CONFIGS[name] || {};
    const config: CircuitBreakerConfig = {
      name,
      failureThreshold: customConfig?.failureThreshold ?? defaultConfig.failureThreshold ?? 3,
      resetTimeout: customConfig?.resetTimeout ?? defaultConfig.resetTimeout ?? 30000,
      halfOpenMaxAttempts: customConfig?.halfOpenMaxAttempts ?? defaultConfig.halfOpenMaxAttempts ?? 2,
    };
    breakers.set(name, new CircuitBreaker(config));
  }
  return breakers.get(name)!;
}

export function getAllCircuitBreakerStats(): Record<string, CircuitBreakerStats> {
  const stats: Record<string, CircuitBreakerStats> = {};
  breakers.forEach((breaker, name) => {
    stats[name] = breaker.getStats();
  });
  return stats;
}

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Neo4j with circuit breaker
import { getCircuitBreaker } from './circuitBreaker';

import { logger } from './logger.js';
const neo4jBreaker = getCircuitBreaker('neo4j');

async function queryNeo4j(cypher: string) {
  return neo4jBreaker.execute(
    // Primary function
    async () => {
      const session = driver.session();
      try {
        return await session.run(cypher);
      } finally {
        await session.close();
      }
    },
    // Fallback (optional)
    () => {
      logger.warn('Neo4j unavailable, returning empty result');
      return { records: [] };
    }
  );
}

// Ollama with circuit breaker
const ollamaBreaker = getCircuitBreaker('ollama');

async function generateWithOllama(prompt: string) {
  return ollamaBreaker.execute(
    async () => {
      const response = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        body: JSON.stringify({ model: 'qwen2.5:14b', prompt }),
      });
      if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
      return response.json();
    },
    // Fallback: queue for later
    () => {
      queueForLater(prompt);
      return { queued: true, message: 'Request queued for processing' };
    }
  );
}

// Check all breaker status (for health endpoint)
app.get('/health/circuits', (req, res) => {
  res.json(getAllCircuitBreakerStats());
});
*/

export { CircuitBreaker };
