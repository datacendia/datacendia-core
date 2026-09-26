/**
 * Tests — Keycloak protect(): the development bypass header
 *
 * x-bypass-auth: true made any caller a Keycloak admin whenever
 * NODE_ENV=development, which the demo compose file sets. It now also needs
 * KEYCLOAK_DEV_BYPASS=true.
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect, vi, afterEach } from 'vitest';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../security/KeycloakAuth.js';

// The real config validates DATABASE_URL and JWT_SECRET at import; this is a unit test.
vi.mock('../config/index.js', () => ({ config: { nodeEnv: 'test' } }));
vi.mock('../utils/logger.js', () => ({
  logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const { protect } = await import('../security/KeycloakAuth.js');

const originalNodeEnv = process.env['NODE_ENV'];

afterEach(() => {
  process.env['NODE_ENV'] = originalNodeEnv;
  delete process.env['KEYCLOAK_DEV_BYPASS'];
});

async function callWithBypassHeader() {
  const req = { headers: { 'x-bypass-auth': 'true' } } as unknown as AuthenticatedRequest;
  const res = {
    statusCode: 200,
    status(code: number) { this.statusCode = code; return this; },
    json() { return this; },
  };
  const next = vi.fn();
  await protect()(req, res as unknown as Response, next);
  return { req, res, next };
}

describe('protect() development bypass', () => {
  it('ignores the header in development without the opt-in (it made callers admin)', async () => {
    process.env['NODE_ENV'] = 'development';
    const { req, res, next } = await callWithBypassHeader();
    expect(next).not.toHaveBeenCalled();
    expect(req.keycloakUser).toBeUndefined();
    expect(res.statusCode).toBe(401);
  });

  it('honours the header in development when a developer opts in', async () => {
    process.env['NODE_ENV'] = 'development';
    process.env['KEYCLOAK_DEV_BYPASS'] = 'true';
    const { req, next } = await callWithBypassHeader();
    expect(next).toHaveBeenCalled();
    expect(req.keycloakUser?.roles).toContain('admin');
  });

  it('ignores the header in production even with the opt-in', async () => {
    process.env['NODE_ENV'] = 'production';
    process.env['KEYCLOAK_DEV_BYPASS'] = 'true';
    const { req, res } = await callWithBypassHeader();
    expect(req.keycloakUser).toBeUndefined();
    expect(res.statusCode).toBe(401);
  });
});
