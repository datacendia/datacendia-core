/**
 * Tests — the API response cache only answers the caller it was built for
 *
 * The cache used to run before authentication and key entries by URL alone:
 * after one user loaded a page, anyone requesting the same URL within the TTL
 * got that response, anonymous callers included. Reproduced on the demo
 * stack with /users and /alerts.
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import express from 'express';
import type { AddressInfo } from 'net';
import * as jose from 'jose';

const SECRET = 'unit-test-secret-that-is-long-enough-for-hs256';

vi.mock('../config/index.js', () => ({
  config: { jwtSecret: SECRET, jwtRefreshSecret: `${SECRET}-refresh`, nodeEnv: 'test', requireAuth: false },
}));
vi.mock('../utils/logger.js', () => ({
  logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../config/database.js', () => ({
  prisma: {
    users: {
      findUnique: vi.fn(async ({ where }: { where: { id: string } }) => ({
        id: where.id, email: `${where.id}@acme.demo`, name: where.id, role: 'ADMIN', status: 'ACTIVE',
        organization_id: 'org-1', created_at: new Date(), updated_at: new Date(), deleted_at: null,
        organizations: { id: 'org-1' }, preferences: {},
      })),
    },
  },
}));
vi.mock('../config/redis.js', () => ({
  cache: { exists: vi.fn(async () => false), get: vi.fn(async () => null), set: vi.fn(async () => undefined) },
  pubsub: { subscribe: vi.fn(), publish: vi.fn() },
}));
const store = new Map<string, unknown>();
vi.mock('../services/cache.service.js', () => ({
  cacheService: {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    set: vi.fn(async (key: string, value: unknown) => { store.set(key, value); }),
    deletePattern: vi.fn(async () => undefined),
  },
}));

const { authenticate } = await import('../middleware/auth.js');
const { tenantGate } = await import('../middleware/tenantIsolation.js');
const { apiCache } = await import('../middleware/cacheMiddleware.js');
const { errorHandler } = await import('../middleware/errorHandler.js');

const key = new TextEncoder().encode(SECRET);
const tokenFor = (userId: string) =>
  new jose.SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setSubject(userId).setIssuedAt().setExpirationTime('5m').sign(key);

let base = '';
let close: () => void = () => {};
let served = 0;

beforeAll(async () => {
  const app = express();
  const domain = express.Router();
  domain.get('/private', authenticate, (req, res) => { res.json({ user: req.user?.id, n: ++served }); });
  domain.get('/public', (_req, res) => { res.json({ n: ++served }); });
  app.use('/api/v1', tenantGate);
  app.use('/api/v1', apiCache());
  app.use('/api/v1', domain);
  app.use(errorHandler);
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1`;
  close = () => server.close();
});
afterAll(() => close());

async function get(p: string, token?: string) {
  const res = await fetch(`${base}${p}`, { headers: token ? { authorization: `Bearer ${token}` } : {} });
  return { status: res.status, cache: res.headers.get('x-cache'), body: await res.json() };
}

describe('apiCache', () => {
  it("never serves a signed-in user's response to an anonymous caller", async () => {
    const alice = await get('/private?leak-anon', await tokenFor('alice'));
    expect(alice).toMatchObject({ status: 200, body: { user: 'alice' } });
    const anonymous = await get('/private?leak-anon');
    expect(anonymous.status).toBe(401);
    expect(anonymous.body).not.toHaveProperty('user');
  });

  it("never serves one user's response to another", async () => {
    await get('/private?leak-user', await tokenFor('alice'));
    const bob = await get('/private?leak-user', await tokenFor('bob'));
    expect(bob).toMatchObject({ status: 200, cache: 'MISS', body: { user: 'bob' } });
  });

  it('serves a user their own cached response', async () => {
    const token = await tokenFor('carol');
    const first = await get('/private?own', token);
    const second = await get('/private?own', token);
    expect(second).toMatchObject({ status: 200, cache: 'HIT', body: first.body });
  });

  it('shares anonymous responses only among anonymous callers', async () => {
    const first = await get('/public?anon');
    const second = await get('/public?anon');
    expect(second).toMatchObject({ cache: 'HIT', body: first.body });
    const signedIn = await get('/public?anon', await tokenFor('dave'));
    expect(signedIn.cache).toBe('MISS');
  });

  it('does not cache requests whose credentials nobody could attribute', async () => {
    const res = await get('/public?unattributed', 'not-a-jwt');
    expect(res.status).toBe(200);
    expect(res.cache).toBeNull();
  });
});
