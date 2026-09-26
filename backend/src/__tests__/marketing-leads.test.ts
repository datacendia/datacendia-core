/**
 * Tests — marketing leads: public submission, admin-only listing
 *
 * The site's forms submit anonymously, but the router sat inside the platform
 * domain, behind the first domain router's authenticate: every submission got
 * 401. Its GET, commented "admin only", checked no role, so any signed-in user
 * of any organization could list Datacendia's leads.
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
vi.mock('../config/redis.js', () => ({
  cache: { exists: vi.fn(async () => false), get: vi.fn(async () => null), set: vi.fn(async () => undefined) },
  pubsub: { subscribe: vi.fn(), publish: vi.fn() },
}));
const roles: Record<string, string> = { admin: 'ADMIN', platform: 'SUPER_ADMIN' };
vi.mock('../config/database.js', () => ({
  prisma: {
    users: {
      findUnique: vi.fn(async ({ where }: { where: { id: string } }) => ({
        id: where.id, email: `${where.id}@acme.demo`, name: where.id, role: roles[where.id], status: 'ACTIVE',
        organization_id: 'org-1', created_at: new Date(), updated_at: new Date(), deleted_at: null,
        organizations: { id: 'org-1' }, preferences: {},
      })),
    },
  },
}));
vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    demo_requests = {
      create: vi.fn(async ({ data }: { data: { id: string } }) => ({ id: data.id })),
      findMany: vi.fn(async () => [{ id: 'mktg-1' }]),
    };
  },
}));

const { default: marketingLeads } = await import('../routes/marketing-leads.js');
const { authenticate } = await import('../middleware/auth.js');
const { errorHandler } = await import('../middleware/errorHandler.js');

const key = new TextEncoder().encode(SECRET);
const tokenFor = (userId: string) =>
  new jose.SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setSubject(userId).setIssuedAt().setExpirationTime('5m').sign(key);

let base = '';
let close: () => void = () => {};
beforeAll(async () => {
  // Mounted like index.ts: public leads before the domain routers, whose
  // router-level authenticate answers everything that reaches them.
  const app = express();
  app.use(express.json());
  app.use('/api/v1/marketing-leads', marketingLeads);
  const domain = express.Router();
  domain.use(authenticate);
  app.use('/api/v1', domain);
  app.use(errorHandler);
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1/marketing-leads`;
  close = () => server.close();
});
afterAll(() => close());

const post = (p: string, body: object) =>
  fetch(`${base}${p}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const list = async (userId?: string) =>
  (await fetch(base, { headers: userId ? { authorization: `Bearer ${await tokenFor(userId)}` } : {} })).status;

describe('marketing leads', () => {
  it('accepts an anonymous lead (was 401)', async () => {
    expect((await post('', { name: 'Ada Lovelace', organization: 'Analytical Engines', source: 'manifesto' })).status).toBe(200);
  });

  it('accepts an anonymous newsletter signup', async () => {
    expect((await post('/newsletter', { email: 'ada@example.com' })).status).toBe(200);
  });

  it('lists leads only for platform admins (any signed-in user could)', async () => {
    expect(await list()).toBe(401);
    expect(await list('admin')).toBe(403);
    expect(await list('platform')).toBe(200);
  });
});
