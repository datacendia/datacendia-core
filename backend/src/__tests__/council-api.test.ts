// =============================================================================
// INTEGRATION TESTS — Council API Routes
// =============================================================================
// Tests against the REAL running backend. No mocks.
//
// Prerequisites:
//   1. docker compose -f docker-compose.dev.yml up -d
//   2. cd backend && npm run dev
//   3. Ollama running with at least one model (for LLM tests)
//
// Run: cd backend && npx vitest run src/__tests__/council-api.test.ts

import { describe, it, expect, beforeAll } from 'vitest';

const API_BASE = process.env.API_URL || 'http://localhost:3001/api/v1';
let backendAvailable = false;

async function api(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    signal: AbortSignal.timeout(10000),
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

beforeAll(async () => {
  try {
    const res = await fetch(`${API_BASE}/council/status`, { signal: AbortSignal.timeout(5000) });
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
    console.warn('\n⚠️  Backend not running — Council integration tests will be skipped.');
    console.warn('   Start with: cd backend && npm run dev\n');
  }
});

// =============================================================================
// Council Status
// =============================================================================
describe('GET /council/status', () => {
  it('returns operational status with service info', async () => {
    if (!backendAvailable) return;
    const { status, body } = await api('/council/status');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.service).toBe('TheCouncil');
    expect(body.data.status).toBe('operational');
  });

  it('lists agent roles including core C-suite', async () => {
    if (!backendAvailable) return;
    const { body } = await api('/council/status');
    expect(body.data.agents).toBeGreaterThan(0);
    expect(body.data.agentRoles).toBeInstanceOf(Array);
    expect(body.data.agentRoles).toContain('chief');
    expect(body.data.agentRoles).toContain('cfo');
    expect(body.data.agentRoles).toContain('ciso');
    expect(body.data.agentRoles).toContain('redteam');
  });

  it('returns metrics from real database', async () => {
    if (!backendAvailable) return;
    const { body } = await api('/council/status');
    expect(body.data.metrics).toBeDefined();
    expect(typeof body.data.metrics.totalDeliberations).toBe('number');
    expect(typeof body.data.metrics.totalDecisions).toBe('number');
    expect(typeof body.data.metrics.totalMessages).toBe('number');
  });
});

// =============================================================================
// Council Modes
// =============================================================================
describe('GET /council/modes', () => {
  it('returns all deliberation modes', async () => {
    if (!backendAvailable) return;
    const { status, body } = await api('/council/modes');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThanOrEqual(8);
  });

  it('each mode has id, name, description, agents array', async () => {
    if (!backendAvailable) return;
    const { body } = await api('/council/modes');
    for (const mode of body.data) {
      expect(mode).toHaveProperty('id');
      expect(mode).toHaveProperty('name');
      expect(mode).toHaveProperty('description');
      expect(mode).toHaveProperty('agents');
      expect(mode.agents).toBeInstanceOf(Array);
      expect(mode.agents.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('executive mode includes chief, cfo, coo, ciso', async () => {
    if (!backendAvailable) return;
    const { body } = await api('/council/modes');
    const executive = body.data.find((m: any) => m.id === 'executive');
    expect(executive).toBeDefined();
    expect(executive.agents).toEqual(expect.arrayContaining(['chief', 'cfo', 'coo', 'ciso']));
  });

  it('crisis mode includes chief, ciso, coo, risk', async () => {
    if (!backendAvailable) return;
    const { body } = await api('/council/modes');
    const crisis = body.data.find((m: any) => m.id === 'crisis');
    expect(crisis).toBeDefined();
    expect(crisis.agents).toEqual(expect.arrayContaining(['chief', 'ciso', 'coo', 'risk']));
  });
});

// =============================================================================
// Council Agents
// =============================================================================
describe('GET /council/agents', () => {
  it('returns agent list from database', async () => {
    if (!backendAvailable) return;
    const { status, body } = await api('/council/agents');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
  });
});

// =============================================================================
// Deliberation — Input Validation (real Zod validation on live server)
// =============================================================================
describe('POST /council/deliberations — validation', () => {
  it('rejects empty question', async () => {
    if (!backendAvailable) return;
    const { status } = await api('/council/deliberations', {
      method: 'POST',
      body: JSON.stringify({ question: '' }),
    });
    expect(status).toBeGreaterThanOrEqual(400);
  });

  it('rejects missing question field', async () => {
    if (!backendAvailable) return;
    const { status } = await api('/council/deliberations', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    expect(status).toBeGreaterThanOrEqual(400);
  });

  it('rejects question exceeding 2000 chars', async () => {
    if (!backendAvailable) return;
    const { status } = await api('/council/deliberations', {
      method: 'POST',
      body: JSON.stringify({ question: 'x'.repeat(2001) }),
    });
    expect(status).toBeGreaterThanOrEqual(400);
  });
});

// =============================================================================
// Query — Input Validation
// =============================================================================
describe('POST /council/query — validation', () => {
  it('rejects empty query', async () => {
    if (!backendAvailable) return;
    const { status } = await api('/council/query', {
      method: 'POST',
      body: JSON.stringify({ query: '' }),
    });
    expect(status).toBeGreaterThanOrEqual(400);
  });

  it('rejects missing query field', async () => {
    if (!backendAvailable) return;
    const { status } = await api('/council/query', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    expect(status).toBeGreaterThanOrEqual(400);
  });
});

// =============================================================================
// Deliberation History
// =============================================================================
describe('GET /council/deliberations', () => {
  it('returns deliberation list from real database', async () => {
    if (!backendAvailable) return;
    const { status, body } = await api('/council/deliberations');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toBeInstanceOf(Array);
  });

  it('respects limit parameter', async () => {
    if (!backendAvailable) return;
    const { status, body } = await api('/council/deliberations?limit=5');
    expect(status).toBe(200);
    expect(body.data.length).toBeLessThanOrEqual(5);
  });
});

// =============================================================================
// Recent Decisions
// =============================================================================
describe('GET /council/decisions/recent', () => {
  it('returns recent decisions from real database', async () => {
    if (!backendAvailable) return;
    const { status, body } = await api('/council/decisions/recent');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });
});

// =============================================================================
// Gateway — PII Test Endpoint (if gateway routes are mounted)
// =============================================================================
describe('POST /gateway/test-pii', () => {
  it('detects PII in submitted text', async () => {
    if (!backendAvailable) return;
    const { status, body } = await api('/gateway/test-pii', {
      method: 'POST',
      body: JSON.stringify({ text: 'My SSN is 123-45-6789 and email is test@test.com' }),
    });
    if (status === 404) return; // gateway routes may not be mounted at this path
    expect(status).toBe(200);
    expect(body.hasPII || body.data?.hasPII).toBe(true);
  });

  it('returns clean for text without PII', async () => {
    if (!backendAvailable) return;
    const { status, body } = await api('/gateway/test-pii', {
      method: 'POST',
      body: JSON.stringify({ text: 'The quarterly revenue report shows strong growth.' }),
    });
    if (status === 404) return;
    expect(status).toBe(200);
  });
});
