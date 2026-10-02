/**
 * Tests — authenticate middleware and token revocation
 *
 * Every way a caller's token can be unusable must end in 401; only failures
 * on our side (database, cache) may surface as server errors. A logged-out
 * token must stay refused however its signature is spelled, over HTTP and
 * WebSocket alike.
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import * as jose from 'jose';

const SECRET = 'unit-test-secret-that-is-long-enough-for-hs256';

// The real config validates DATABASE_URL and JWT_SECRET at import; this is a unit test.
vi.mock('../config/index.js', () => ({
  config: { jwtSecret: SECRET, jwtRefreshSecret: `${SECRET}-refresh`, nodeEnv: 'test' },
}));
vi.mock('../utils/logger.js', () => ({
  logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
const findUnique = vi.fn();
vi.mock('../config/database.js', () => ({ prisma: { users: { findUnique } } }));
const revoked = new Set<string>();
vi.mock('../config/redis.js', () => ({
  cache: {
    exists: vi.fn(async (key: string) => revoked.has(key)),
    get: vi.fn(async () => null),
    set: vi.fn(async () => undefined),
  },
  pubsub: { subscribe: vi.fn(), publish: vi.fn() },
}));

const { authenticate } = await import('../middleware/auth.js');
const { revocationKey } = await import('../utils/tokenRevocation.js');
const { setupWebSocketHandlers } = await import('../websocket/index.js');

const key = new TextEncoder().encode(SECRET);
function sign(opts: { secret?: Uint8Array; exp?: number | string } = {}) {
  return new jose.SignJWT({ organizationId: 'org-1' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('user-1')
    .setIssuedAt()
    .setExpirationTime(opts.exp ?? '5m')
    .sign(opts.secret ?? key);
}

/** Change a character mid-signature: all six of its bits are data, so the bytes change. */
function tamper(token: string): string {
  const [h, p, s] = token.split('.') as [string, string, string];
  return `${h}.${p}.${s.slice(0, 10)}${s[10] === 'A' ? 'B' : 'A'}${s.slice(11)}`;
}

/** Same signature bytes, different string: flip the unused low bit of the last character. */
const B64URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
function respell(token: string): string {
  return token.slice(0, -1) + B64URL[B64URL.indexOf(token.at(-1)!) ^ 1];
}

async function run(authorization?: string) {
  const req = { headers: authorization ? { authorization } : {} } as unknown as Request;
  const next = vi.fn() as unknown as NextFunction & ReturnType<typeof vi.fn>;
  await authenticate(req, {} as Response, next);
  expect(next).toHaveBeenCalledTimes(1);
  return { req, err: (next as ReturnType<typeof vi.fn>).mock.calls[0]![0] as { statusCode?: number; message?: string } | undefined };
}

beforeEach(() => {
  revoked.clear();
  findUnique.mockReset();
  findUnique.mockResolvedValue({
    id: 'user-1', email: 'sarah.chen@acme.demo', name: 'Sarah Chen', role: 'ADMIN', status: 'ACTIVE',
    organization_id: 'org-1', created_at: new Date(), updated_at: new Date(), deleted_at: null,
    organizations: { id: 'org-1' }, preferences: {},
  });
});

describe('authenticate', () => {
  it('accepts a valid token and attaches the user', async () => {
    const { req, err } = await run(`Bearer ${await sign()}`);
    expect(err).toBeUndefined();
    expect((req as Request & { user?: { id: string } }).user?.id).toBe('user-1');
  });

  it('401s without a token', async () => {
    expect((await run()).err?.statusCode).toBe(401);
  });

  it('401s on an expired token, and says so', async () => {
    const { err } = await run(`Bearer ${await sign({ exp: Math.floor(Date.now() / 1000) - 60 })}`);
    expect(err?.statusCode).toBe(401);
    expect(err?.message).toBe('Token has expired');
  });

  it('401s on a tampered signature (was a 500)', async () => {
    expect((await run(`Bearer ${tamper(await sign())}`)).err?.statusCode).toBe(401);
  });

  it('401s on a token signed with another key', async () => {
    const other = new TextEncoder().encode('some-other-secret-that-is-long-enough-too');
    expect((await run(`Bearer ${await sign({ secret: other })}`)).err?.statusCode).toBe(401);
  });

  it('401s on a malformed token', async () => {
    expect((await run('Bearer not-a-jwt')).err?.statusCode).toBe(401);
  });

  it('passes a database failure through instead of hiding it as a 401', async () => {
    const boom = new Error('connection refused');
    findUnique.mockRejectedValueOnce(boom);
    expect((await run(`Bearer ${await sign()}`)).err).toBe(boom);
  });

  it('refuses a revoked token', async () => {
    const token = await sign();
    revoked.add(revocationKey(token));
    const { err } = await run(`Bearer ${token}`);
    expect(err?.statusCode).toBe(401);
    expect(err?.message).toBe('Token has been revoked');
  });

  it('refuses a respelled copy of a revoked token (was accepted)', async () => {
    const token = await sign();
    const copy = respell(token);
    expect(copy).not.toBe(token);
    expect(Buffer.from(copy.split('.')[2]!, 'base64url')).toEqual(Buffer.from(token.split('.')[2]!, 'base64url'));
    revoked.add(revocationKey(token));
    expect((await run(`Bearer ${copy}`)).err?.message).toBe('Token has been revoked');
  });
});

describe('revocationKey', () => {
  it('is unchanged for tokens as issued, so existing blacklist entries still match', async () => {
    const token = await sign();
    expect(revocationKey(token)).toBe(`blacklist:${token}`);
  });

  it('gives every spelling of a signature the same key', async () => {
    const token = await sign();
    expect(revocationKey(respell(token))).toBe(revocationKey(token));
  });
});

describe('WebSocket authentication', () => {
  type Middleware = (socket: unknown, next: (err?: Error) => void) => Promise<void>;
  function handshake() {
    let middleware: Middleware | undefined;
    setupWebSocketHandlers({ use: (fn: Middleware) => { middleware = fn; }, on: vi.fn() } as never);
    return async (token: string) => {
      const next = vi.fn();
      await middleware!({ handshake: { auth: { token }, headers: {} } }, next);
      return next.mock.calls[0]?.[0] as Error | undefined;
    };
  }

  it('accepts a valid token', async () => {
    expect(await handshake()(await sign())).toBeUndefined();
  });

  it('refuses a revoked token, however it is spelled (was accepted)', async () => {
    const connect = handshake();
    const token = await sign();
    revoked.add(revocationKey(token));
    expect((await connect(token))?.message).toBe('Token has been revoked');
    expect((await connect(respell(token)))?.message).toBe('Token has been revoked');
  });
});
