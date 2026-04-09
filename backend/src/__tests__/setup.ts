// =============================================================================
// VITEST TEST SETUP
// =============================================================================
// Minimal setup for backend tests. No mocks — tests run against real services.
// Requires: docker compose -f docker-compose.dev.yml up -d (Postgres, Redis)
// Optional: Ollama running on localhost:11434 (for LLM-dependent tests)

import { beforeAll } from 'vitest';

const API_BASE = process.env.API_URL || 'http://localhost:3001/api/v1';

beforeAll(async () => {
  // Verify the backend is reachable before running integration tests
  try {
    const res = await fetch(`${API_BASE}/../health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) {
      console.warn(`[Test Setup] Backend returned ${res.status} — some integration tests may fail`);
    }
  } catch {
    console.warn('[Test Setup] Backend not reachable at ' + API_BASE);
    console.warn('[Test Setup] Start it with: cd backend && npm run dev');
    console.warn('[Test Setup] Pure unit tests (PII detector) will still pass.');
  }
});
