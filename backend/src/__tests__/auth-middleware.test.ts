/**
 * Tests — authenticate middleware
 *
 * Every way a caller's token can be unusable must end in 401; only failures
 * on our side (database, cache) may surface as server errors.
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
vi.mock('../config/redis.js', () => ({
  cache: { exists: vi.fn(async () => false), get: vi.fn(async () => null), set: vi.fn(async () => undefined) },
}));

const { authenticate } = await import('../middleware/auth.js');

const key = new TextEncoder().encode(SECRET);
function sign(opts: { secret?: Uint8Array; exp?: number | string } = {}) {
  return new jose.SignJWT({ organizationId: 'org-1' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('user-1')
    .setIssuedAt()
    .setExpirationTime(opts.exp ?? '5m')
    .sign(opts.secret ?? key);
}

async function run(authorization?: string) {
  const req = { headers: authorization ? { authorization } : {} } as unknown as Request;
  const next = vi.fn() as unknown as NextFunction & ReturnType<typeof vi.fn>;
  await authenticate(req, {} as Response, next);
  expect(next).toHaveBeenCalledTimes(1);
  return { req, err: (next as ReturnType<typeof vi.fn>).mock.calls[0]![0] as { statusCode?: number; message?: string } | undefined };
}

describe('authenticate', () => {
  beforeEach(() => {
    findUnique.mockReset();
    findUnique.mockResolvedValue({
      id: 'user-1', email: 'sarah.chen@acme.demo', name: 'Sarah Chen', role: 'ADMIN', status: 'ACTIVE',
      organization_id: 'org-1', created_at: new Date(), updated_at: new Date(), deleted_at: null,
      organizations: { id: 'org-1' }, preferences: {},
    });
  });

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
    const token = await sign();
    const tampered = token.slice(0, -1) + (token.endsWith('A') ? 'B' : 'A');
    expect((await run(`Bearer ${tampered}`)).err?.statusCode).toBe(401);
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
});
