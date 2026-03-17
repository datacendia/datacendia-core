// =============================================================================
// LOAD TEST — Healthcheck Endpoint
// Verifies the /health endpoint can sustain concurrent requests without
// degradation. Run with: npm run load-test
// =============================================================================

import { describe, it, expect } from 'vitest';

const API_BASE = process.env.API_URL || 'http://localhost:3001';
const CONCURRENT_REQUESTS = parseInt(process.env.LOAD_CONCURRENCY || '20', 10);
const ITERATIONS = parseInt(process.env.LOAD_ITERATIONS || '5', 10);
const ACCEPTABLE_ERROR_RATE = 0.05; // 5% error rate ceiling
const MAX_P99_MS = 2000; // 2-second P99 ceiling

interface RequestResult {
  durationMs: number;
  status: number;
  ok: boolean;
  error?: string;
}

async function hitHealthcheck(): Promise<RequestResult> {
  const start = Date.now();
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(5000) });
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

describe('Healthcheck load test', () => {
  it(`sustains ${CONCURRENT_REQUESTS} concurrent requests × ${ITERATIONS} iterations`, async () => {
    const allResults: RequestResult[] = [];

    for (let i = 0; i < ITERATIONS; i++) {
      const batch = await Promise.all(
        Array.from({ length: CONCURRENT_REQUESTS }, () => hitHealthcheck())
      );
      allResults.push(...batch);
    }

    const total = allResults.length;
    const failures = allResults.filter(r => !r.ok).length;
    const errorRate = failures / total;

    const durations = allResults.map(r => r.durationMs).sort((a, b) => a - b);
    const p50 = percentile(durations, 50);
    const p95 = percentile(durations, 95);
    const p99 = percentile(durations, 99);

    console.log(`\n[Healthcheck Load] total=${total} errors=${failures} (${(errorRate * 100).toFixed(1)}%)`);
    console.log(`[Healthcheck Load] latency p50=${p50}ms p95=${p95}ms p99=${p99}ms`);

    expect(errorRate, `error rate ${(errorRate * 100).toFixed(1)}% exceeds ${ACCEPTABLE_ERROR_RATE * 100}% ceiling`).toBeLessThanOrEqual(ACCEPTABLE_ERROR_RATE);
    expect(p99, `P99 latency ${p99}ms exceeds ${MAX_P99_MS}ms ceiling`).toBeLessThanOrEqual(MAX_P99_MS);
  }, 60_000);
});
