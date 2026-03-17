# Load Testing

This directory contains load tests for key Datacendia API endpoints.

## Running Load Tests

```bash
# From the backend/ directory
npm run load-test
```

By default the tests target `http://localhost:3001`. Override with `API_URL`:

```bash
API_URL=https://your-staging.up.railway.app npm run load-test
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `API_URL` | `http://localhost:3001` | Base URL for the API (no `/api/v1` suffix for healthcheck) |
| `LOAD_CONCURRENCY` | `20` (healthcheck), `10` (council) | Concurrent requests per batch |
| `LOAD_ITERATIONS` | `5` (healthcheck), `3` (council) | Number of batches to run |
| `LOAD_TEST_EMAIL` | `test@datacendia.com` | Login email for authenticated endpoints |
| `LOAD_TEST_PASSWORD` | `TestPassword123!` | Login password |

## Test Files

### `healthcheck.load.test.ts`

Fires `LOAD_CONCURRENCY × LOAD_ITERATIONS` requests at `GET /health` and asserts:
- **Error rate** ≤ 5%
- **P99 latency** ≤ 2000 ms

### `council.load.test.ts`

Fires concurrent `POST /api/v1/council/decisions` requests (multi-agent deliberation)
and asserts:
- **Infrastructure error rate** ≤ 10% (401/403 auth responses are excluded)
- **P95 latency** ≤ 30000 ms (council deliberation involves LLM calls)

## Thresholds

Thresholds are intentionally conservative so they pass in CI/CD against a live
staging environment. Tighten them as baseline performance improves.

## Notes

- Load tests are excluded from the default `npm test` run (they require a running server).
- Run them in a pre-production validation step or nightly CI job against staging.
- The council endpoint latency is dominated by LLM inference time; the test
  validates queueing and request routing, not model speed.
