/**
 * Tests — webhook ingest admin routes and signature check
 *
 * requireAdmin let through any request that had an X-Admin-Key header, whatever
 * its value. The HMAC check called timingSafeEqual on buffers of different
 * lengths, which throws: in an async method, a short signature was an
 * unhandled rejection.
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect, vi, afterAll } from 'vitest';
import express from 'express';
import type { AddressInfo } from 'net';

vi.mock('../utils/logger.js', () => ({
  logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const { WebhookIngestAdapter } = await import('../adapters/sovereign/WebhookIngestAdapter.js');
const { RiskTier, DataClassification } = await import('../adapters/sovereign/SovereignAdapter.js');

const servers: Array<() => void> = [];
afterAll(() => servers.forEach((close) => close()));

async function serve(extra: Record<string, unknown>) {
  const adapter = new WebhookIngestAdapter({
    id: 'webhook-test', name: 'Webhook test', description: 'test',
    riskTier: Object.values(RiskTier)[0] as never,
    capabilities: {
      transportTypes: ['http'], supportsStreaming: false, supportsBatch: false, supportsWriteBack: false,
      cachingAllowed: false, defaultDataClass: Object.values(DataClassification)[0] as never,
      requiresBYOKeys: false, exportControlled: false,
    },
    ...extra,
  });
  const app = express();
  app.use(express.json());
  app.use('/webhooks', adapter.getRouter());
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  servers.push(() => server.close());
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}/webhooks`;
}

describe('webhook admin routes', () => {
  it('refuse a wrong admin key (any value used to pass)', async () => {
    const base = await serve({ adminKey: 'correct-horse-battery-staple' });
    const res = await fetch(`${base}/dead-letter`, { headers: { 'x-admin-key': 'anything' } });
    expect(res.status).toBe(403);
  });

  it('accept the configured admin key', async () => {
    const base = await serve({ adminKey: 'correct-horse-battery-staple' });
    const res = await fetch(`${base}/dead-letter`, { headers: { 'x-admin-key': 'correct-horse-battery-staple' } });
    expect(res.status).toBe(200);
  });

  it('stay closed when no admin key is configured', async () => {
    const base = await serve({});
    const res = await fetch(`${base}/dead-letter`, { headers: { 'x-admin-key': 'anything' } });
    expect(res.status).toBe(403);
  });
});

describe('webhook signature check', () => {
  it('answers 401 to a signature of the wrong length instead of throwing', async () => {
    const unhandled = vi.fn();
    process.on('unhandledRejection', unhandled);
    const base = await serve({ hmacSecret: 'shared-secret' });
    const res = await fetch(`${base}/ingest/source-1`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-signature-256': 'sha256=abc' },
      body: JSON.stringify({ event: 'test' }),
      signal: AbortSignal.timeout(3000),
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
    process.off('unhandledRejection', unhandled);
    expect(res.status).toBe(401);
    expect(unhandled).not.toHaveBeenCalled();
  });
});
