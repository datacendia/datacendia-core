/**
 * Tests — API access past login
 *
 * From 12 April 2026 every org-scoped route answered 403 "Organization context
 * required", signed in or not: requireOrgScope ran at app level, before the
 * per-route authentication that sets the organization. These pin the fix
 * (tenantGate) and devAuth, whose throws never answered under Express 4.
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import type { AddressInfo } from 'net';
import express from 'express';
import * as jose from 'jose';

const SECRET = 'unit-test-secret-that-is-long-enough-for-hs256';

// The real config validates DATABASE_URL and JWT_SECRET at import; this is a unit test.
vi.mock('../config/index.js', () => ({
  config: { jwtSecret: SECRET, jwtRefreshSecret: `${SECRET}-refresh`, nodeEnv: 'test', requireAuth: false },
}));
vi.mock('../utils/logger.js', () => ({
  logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
const findUnique = vi.fn();
const findFirst = vi.fn();
vi.mock('../config/database.js', () => ({ prisma: { users: { findUnique, findFirst } } }));
vi.mock('../config/redis.js', () => ({
  cache: { exists: vi.fn(async () => false), get: vi.fn(async () => null), set: vi.fn(async () => undefined) },
  pubsub: { subscribe: vi.fn(), publish: vi.fn() },
}));

const { config } = await import('../config/index.js');
const { authenticate, devAuth } = await import('../middleware/auth.js');
const { tenantGate } = await import('../middleware/tenantIsolation.js');
const { errorHandler } = await import('../middleware/errorHandler.js');

const settings = config as unknown as { nodeEnv: string; requireAuth: boolean };
const key = new TextEncoder().encode(SECRET);
const sign = () =>
  new jose.SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setSubject('user-1').setIssuedAt().setExpirationTime('5m').sign(key);

function dbUser(organizationId: string | null) {
  return {
    id: 'user-1', email: 'sarah.chen@acme.demo', name: 'Sarah Chen', role: 'ADMIN', status: 'ACTIVE',
    organization_id: organizationId, created_at: new Date(), updated_at: new Date(), deleted_at: null,
    organizations: organizationId ? { id: organizationId } : null, preferences: {},
  };
}

function fakeReq(authorization?: string): Request {
  return {
    headers: authorization ? { authorization } : {},
    path: '/decisions', method: 'GET', ip: '127.0.0.1', get: () => undefined,
  } as unknown as Request;
}

/** Run a middleware and resolve with whatever it passed to next(). */
function through(mw: (req: Request, res: Response, next: NextFunction) => unknown, req: Request) {
  return new Promise<unknown>((resolve) => {
    void mw(req, {} as Response, (err?: unknown) => resolve(err));
  });
}

beforeEach(() => {
  findUnique.mockReset();
  findFirst.mockReset();
  findUnique.mockResolvedValue(dbUser('org-1'));
  findFirst.mockResolvedValue(null);
});

afterEach(() => {
  settings.nodeEnv = 'test';
  settings.requireAuth = false;
});

describe('tenantGate', () => {
  it('lets a request without a token through to its route', async () => {
    const req = fakeReq();
    expect(await through(tenantGate, req)).toBeUndefined();
    expect(req.user).toBeUndefined();
  });

  it('passes a signed-in request that has an organization, with the organization set', async () => {
    const req = fakeReq(`Bearer ${await sign()}`);
    expect(await through(tenantGate, req)).toBeUndefined();
    expect(req.organizationId).toBe('org-1');
  });

  it('refuses a signed-in request without an organization', async () => {
    findUnique.mockResolvedValue(dbUser(null));
    const err = (await through(tenantGate, fakeReq(`Bearer ${await sign()}`))) as { statusCode?: number };
    expect(err?.statusCode).toBe(403);
  });

  it('leaves an unusable token to the route, so public routes still answer', async () => {
    expect(await through(tenantGate, fakeReq('Bearer not-a-jwt'))).toBeUndefined();
  });

  it('passes other failures through', async () => {
    const boom = new Error('database unavailable');
    findUnique.mockRejectedValue(boom);
    expect(await through(tenantGate, fakeReq(`Bearer ${await sign()}`))).toBe(boom);
  });
});

describe('authenticate', () => {
  it('verifies a request once, however many routers run it', async () => {
    const req = fakeReq(`Bearer ${await sign()}`);
    for (let i = 0; i < 3; i++) {
      expect(await through(authenticate, req)).toBeUndefined();
    }
    expect(findUnique).toHaveBeenCalledTimes(1);
  });
});

describe('devAuth', () => {
  it('answers 401 without a token in production (it threw: no answer, then the process exited)', async () => {
    settings.nodeEnv = 'production';
    const err = (await through(devAuth, fakeReq())) as { statusCode?: number };
    expect(err?.statusCode).toBe(401);
  });

  it('answers 401 when REQUIRE_AUTH is set', async () => {
    settings.requireAuth = true;
    const err = (await through(devAuth, fakeReq())) as { statusCode?: number };
    expect(err?.statusCode).toBe(401);
  });

  it('answers 401 in development when no admin user exists (it never answered)', async () => {
    settings.nodeEnv = 'development';
    findUnique.mockResolvedValue(null);
    const err = (await through(devAuth, fakeReq())) as { statusCode?: number };
    expect(err?.statusCode).toBe(401);
  });

  it('signs in as the seeded admin in development', async () => {
    settings.nodeEnv = 'development';
    const req = fakeReq();
    expect(await through(devAuth, req)).toBeUndefined();
    expect(req.organizationId).toBe('org-1');
  });
});

describe('mounted like index.ts: auth routes, then tenantGate, then domain routers', () => {
  let base = '';
  let close: () => void = () => {};

  beforeAll(async () => {
    const app = express();
    const domain = express.Router();
    domain.get('/decisions', authenticate, (req, res) => { res.json({ organizationId: req.organizationId }); });
    domain.get('/public', (_req, res) => { res.json({ ok: true }); });
    app.use('/api/v1', tenantGate);
    app.use('/api/v1', domain);
    app.use(errorHandler);
    const server = app.listen(0);
    await new Promise<void>((resolve) => server.once('listening', () => resolve()));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1`;
    close = () => server.close();
  });
  afterAll(() => close());

  const get = async (p: string, token?: string) => {
    const res = await fetch(`${base}${p}`, { headers: token ? { authorization: `Bearer ${token}` } : {} });
    return { status: res.status, body: await res.json() };
  };

  it('serves a signed-in user their organization (was 403 for everyone)', async () => {
    expect(await get('/decisions', await sign())).toEqual({ status: 200, body: { organizationId: 'org-1' } });
  });

  it('still refuses an anonymous request to a protected route', async () => {
    expect((await get('/decisions')).status).toBe(401);
  });

  it('keeps public routes public, even with a stale token', async () => {
    expect((await get('/public')).status).toBe(200);
    expect((await get('/public', 'not-a-jwt')).status).toBe(200);
  });

  it('refuses a signed-in user who has no organization', async () => {
    findUnique.mockResolvedValue(dbUser(null));
    expect((await get('/decisions', await sign())).status).toBe(403);
  });
});
