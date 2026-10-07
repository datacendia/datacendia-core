/**
 * Demo Access — Unit Tests
 * POST /auth/demo-access signs a visitor in with only a name and an email, so
 * it must never open a registered account: it is off unless DEMO_MODE is set,
 * it reopens only accounts it created (users.demo_visitor, which no user can
 * set) that still hold their Analyst seat, and the seats it hands out live in
 * the showcase workspace with a session the refresh endpoint accepts.
 *
 * Run: npx vitest run tests/backend/demo-access.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

const cfg = vi.hoisted(() => ({ demoMode: true, nodeEnv: 'test' }));
const db = vi.hoisted(() => ({
  findUser: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  findOrg: vi.fn(),
  upsertOrg: vi.fn(),
  createSession: vi.fn(),
  findSessions: vi.fn(),
}));
const verifyRefreshToken = vi.hoisted(() => vi.fn());
const sendEmail = vi.hoisted(() => vi.fn());

vi.mock('../../backend/src/config/index.js', () => ({ config: cfg }));
vi.mock('../../backend/src/config/database.js', () => ({
  prisma: {
    users: { findUnique: db.findUser, create: db.createUser, update: db.updateUser },
    organizations: { findUnique: db.findOrg, upsert: db.upsertOrg },
    sessions: { create: db.createSession, findMany: db.findSessions },
  },
}));
vi.mock('../../backend/src/config/redis.js', () => ({ cache: { get: vi.fn(), set: vi.fn(), del: vi.fn() } }));
vi.mock('../../backend/src/utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../backend/src/services/email.js', () => ({ emailService: { send: sendEmail } }));
vi.mock('../../backend/src/middleware/auth.js', () => ({
  authenticate: (_req: Request, _res: Response, next: NextFunction) => next(),
  generateAccessToken: vi.fn(async () => 'access-token'),
  generateRefreshToken: vi.fn(async () => 'refresh-token'),
  verifyRefreshToken,
}));
// Real bcrypt at its lowest cost: fast, and a stored session still has to match its token
vi.mock('bcryptjs', async (importOriginal) => {
  const real = (await importOriginal<{ default: typeof import('bcryptjs') }>()).default;
  return { default: { ...real, hash: (s: string) => real.hash(s, 4) } };
});

import authRoutes from '../../backend/src/routes/auth';
import { errorHandler } from '../../backend/src/middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use(errorHandler);

const SHOWCASE = { id: 'demo-acme-corp', name: 'Acme Corporation', slug: 'acme' };

function account(overrides: Record<string, unknown> = {}) {
  return {
    id: 'usr-1',
    email: 'cfo@acme.example',
    name: 'Real CFO',
    role: 'ADMIN',
    status: 'ACTIVE',
    deleted_at: null,
    organization_id: SHOWCASE.id,
    preferences: {},
    demo_visitor: false,
    ...overrides,
  };
}

const visit = (body: Record<string, unknown>) => request(app).post('/auth/demo-access').send(body);

beforeEach(() => {
  cfg.demoMode = true;
  for (const fn of Object.values(db)) {
    fn.mockReset();
  }
  verifyRefreshToken.mockReset();
  db.findOrg.mockResolvedValue(SHOWCASE);
  db.createUser.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ deleted_at: null, ...data }));
  db.updateUser.mockResolvedValue({});
  db.createSession.mockResolvedValue({});
  sendEmail.mockReset().mockResolvedValue(undefined);
});

describe('POST /auth/demo-access', () => {
  it('does not exist unless the deployment is a demo', async () => {
    cfg.demoMode = false;

    const res = await visit({ name: 'Visitor', email: 'visitor@example.com' });

    expect(res.status).toBe(404);
    expect(db.findUser).not.toHaveBeenCalled();
    expect(db.createUser).not.toHaveBeenCalled();
  });

  it('refuses the email of a registered account and issues nothing', async () => {
    db.findUser.mockResolvedValue(account());

    const res = await visit({ name: 'Mallory', email: 'CFO@acme.example' });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toBe('This email belongs to a registered account. Sign in with your password.');
    expect(res.body.data).toBeUndefined();
    expect(db.createSession).not.toHaveBeenCalled();
    expect(db.updateUser).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('ignores a demo flag a user wrote into their own preferences', async () => {
    // PUT /users/me lets a user store any preferences; they carry no authority here
    db.findUser.mockResolvedValue(account({ preferences: { demoVisitor: true }, demo_visitor: false }));

    const res = await visit({ name: 'Mallory', email: 'cfo@acme.example' });

    expect(res.status).toBe(409);
    expect(db.createSession).not.toHaveBeenCalled();
  });

  it('asks for the password once a demo account has been promoted', async () => {
    db.findUser.mockResolvedValue(account({ email: 'ada@example.com', role: 'ADMIN', demo_visitor: true }));

    const res = await visit({ name: 'Ada', email: 'ada@example.com' });

    expect(res.status).toBe(409);
    expect(db.createSession).not.toHaveBeenCalled();
  });

  it('gives a new visitor an Analyst seat in the showcase workspace', async () => {
    db.findUser.mockResolvedValue(null);

    const res = await visit({ name: '  Ada Lovelace ', email: ' Ada@Example.COM ' });

    expect(res.status).toBe(200);
    expect(db.findUser).toHaveBeenCalledWith({ where: { email: 'ada@example.com' } });
    const { data } = db.createUser.mock.calls[0][0];
    expect(data).toMatchObject({
      email: 'ada@example.com',
      name: 'Ada Lovelace',
      role: 'ANALYST',
      status: 'ACTIVE',
      organization_id: 'demo-acme-corp',
      demo_visitor: true,
    });
    expect(data.preferences).toBeUndefined();
    expect(db.upsertOrg).not.toHaveBeenCalled();
    expect(res.body.data).toMatchObject({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { email: 'ada@example.com', role: 'ANALYST' },
    });
  });

  it('stores a session the refresh endpoint accepts', async () => {
    let created: Record<string, unknown> | undefined;
    db.createUser.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => {
      created = { deleted_at: null, ...data };
      return created;
    });
    db.findUser.mockImplementation(async ({ where }: { where: { id?: string } }) => (where.id ? created : null));
    const sessions: Array<{ refresh_token_hash: string; expires_at: Date }> = [];
    db.createSession.mockImplementation(async ({ data }: { data: (typeof sessions)[number] }) => {
      sessions.push(data);
      return data;
    });
    db.findSessions.mockImplementation(async () => sessions);
    verifyRefreshToken.mockImplementation(async () => created?.id);

    const entry = await visit({ name: 'Ada', email: 'ada@example.com' });

    expect(sessions).toHaveLength(1);
    expect(sessions[0].expires_at.getTime()).toBeGreaterThan(Date.now() + 29 * 24 * 60 * 60 * 1000);
    const refreshed = await request(app).post('/auth/refresh').send({ refreshToken: entry.body.data.refreshToken });
    expect(refreshed.status).toBe(200);
    expect(refreshed.body.data.accessToken).toBe('access-token');
    // The stored hash belongs to that token alone
    const forged = await request(app).post('/auth/refresh').send({ refreshToken: 'another-token' });
    expect(forged.status).toBe(401);
  });

  it('uses the shared demo workspace when the showcase one was not seeded', async () => {
    db.findOrg.mockResolvedValue(null);
    db.upsertOrg.mockResolvedValue({ id: 'org-demo', slug: 'demo' });
    db.findUser.mockResolvedValue(null);

    const res = await visit({ name: 'Ada', email: 'ada@example.com' });

    expect(res.status).toBe(200);
    expect(db.upsertOrg.mock.calls[0][0].where).toEqual({ slug: 'demo' });
    expect(db.createUser.mock.calls[0][0].data.organization_id).toBe('org-demo');
  });

  it('lets a returning visitor back in without creating another account', async () => {
    db.findUser.mockResolvedValue(
      account({ id: 'usr-demo', email: 'ada@example.com', role: 'ANALYST', demo_visitor: true })
    );

    const res = await visit({ name: 'Ada', email: 'ada@example.com' });

    expect(res.status).toBe(200);
    expect(db.createUser).not.toHaveBeenCalled();
    expect(res.body.data.user).toMatchObject({ id: 'usr-demo', role: 'ANALYST' });
    expect(sendEmail.mock.calls[0][0].text).toContain('New user: Returning');
  });

  it('keeps a deactivated demo account closed', async () => {
    db.findUser.mockResolvedValue(account({ status: 'SUSPENDED', role: 'ANALYST', demo_visitor: true }));

    const res = await visit({ name: 'Ada', email: 'cfo@acme.example' });

    expect(res.status).toBe(403);
    expect(db.createSession).not.toHaveBeenCalled();
  });

  it.each([
    ['a missing email', { name: 'Ada' }],
    ['an invalid email', { name: 'Ada', email: 'not-an-email' }],
    ['a blank name', { name: '   ', email: 'ada@example.com' }],
    ['a name with a line break', { name: 'Ada\r\nBcc: list@example.com', email: 'ada@example.com' }],
  ])('rejects %s', async (_label, body) => {
    const res = await visit(body);

    expect(res.status).toBe(400);
    expect(db.findUser).not.toHaveBeenCalled();
  });
});
