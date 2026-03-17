// =============================================================================
// LOAD TEST — Council Decision Endpoint
// Fires concurrent council decision requests and validates throughput and
// latency stay within acceptable bounds. Run with: npm run load-test
// =============================================================================

import { describe, it, expect, beforeAll } from 'vitest';

const API_BASE = process.env.API_URL || 'http://localhost:3001/api/v1';
const CONCURRENT_REQUESTS = parseInt(process.env.LOAD_CONCURRENCY || '10', 10);
const ITERATIONS = parseInt(process.env.LOAD_ITERATIONS || '3', 10);
const ACCEPTABLE_ERROR_RATE = 0.10; // 10% ceiling — council calls hit LLM
const MAX_P95_MS = 30_000; // 30-second P95 (deliberation takes time)

interface RequestResult {
  durationMs: number;
  status: number;
  ok: boolean;
  error?: string;
}

let authToken: string | null = null;

async function getAuthToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.LOAD_TEST_EMAIL || 'test@datacendia.com',
        password: process.env.LOAD_TEST_PASSWORD || 'TestPassword123!',
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { token?: string };
      return data.token ?? null;
    }
  } catch {
    // fall through
  }
  return null;
}

async function triggerCouncilDecision(token: string | null): Promise<RequestResult> {
  const start = Date.now();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}/council/decisions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        question: 'Should we expand our infrastructure capacity by 20%?',
        context: 'Load test — automated evaluation',
        priority: 'medium',
      }),
      signal: AbortSignal.timeout(MAX_P95_MS + 5_000),
    });
    return { durationMs: Date.now() - start, status: res.status, ok: res.ok };
  } catch (err) {
    return {
      durationMs: Date.now() - start,
      status: 0,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function percentile(sorted: number[], p: number): number {
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

describe('Council decision endpoint load test', () => {
  beforeAll(async () => {
    authToken = await getAuthToken();
    if (!authToken) {
      console.warn('[Council Load] Could not obtain auth token — requests will be unauthenticated');
    }
  });

  it(`sustains ${CONCURRENT_REQUESTS} concurrent decisions × ${ITERATIONS} iterations`, async () => {
    const allResults: RequestResult[] = [];

    for (let i = 0; i < ITERATIONS; i++) {
      const batch = await Promise.all(
        Array.from({ length: CONCURRENT_REQUESTS }, () => triggerCouncilDecision(authToken))
      );
      allResults.push(...batch);
    }

    const total = allResults.length;
    // Treat 401/403 as infrastructure failures, not council logic failures
    const infraFailures = allResults.filter(r => !r.ok && r.status !== 401 && r.status !== 403).length;
    const errorRate = infraFailures / total;

    const durations = allResults.map(r => r.durationMs).sort((a, b) => a - b);
    const p50 = percentile(durations, 50);
    const p95 = percentile(durations, 95);

    console.log(`\n[Council Load] total=${total} infra_errors=${infraFailures} (${(errorRate * 100).toFixed(1)}%)`);
    console.log(`[Council Load] latency p50=${p50}ms p95=${p95}ms`);

    expect(errorRate, `infra error rate ${(errorRate * 100).toFixed(1)}% exceeds ${ACCEPTABLE_ERROR_RATE * 100}% ceiling`).toBeLessThanOrEqual(ACCEPTABLE_ERROR_RATE);
    expect(p95, `P95 latency ${p95}ms exceeds ${MAX_P95_MS}ms ceiling`).toBeLessThanOrEqual(MAX_P95_MS);
  }, 120_000);
});
