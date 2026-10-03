/**
 * Organization Routes — Unit Tests
 * Settings > Organization saves through PUT /organizations/current: an owner
 * may save, industry and size are kept or cleared, settings are merged so
 * other features' keys survive (even a concurrent save's), and every save is
 * audited.
 *
 * Run: npx vitest run tests/backend/organizations-routes.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

const db = vi.hoisted(() => ({ findUnique: vi.fn(), updateMany: vi.fn(), audit: vi.fn() }));
vi.mock('../../backend/src/config/database.js', () => ({
  prisma: {
    organizations: { findUnique: db.findUnique, updateMany: db.updateMany },
    audit_logs: { create: db.audit },
  },
}));
vi.mock('../../backend/src/config/redis.js', () => ({ cache: { get: vi.fn(), set: vi.fn(), del: vi.fn() } }));
vi.mock('../../backend/src/utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../backend/src/middleware/auth.js', () => ({
  devAuth: (req: Request, _res: Response, next: NextFunction) => {
    const r = req as Request & { organizationId?: string; user?: { id: string; role: string } };
    r.organizationId = 'org-1';
    r.user = { id: 'usr-1', role: String(req.headers['x-test-role'] ?? 'ADMIN') };
    next();
  },
  requireRole:
    (...roles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
      const role = (req as Request & { user?: { role: string } }).user?.role ?? '';
      if (roles.includes(role)) {
        next();
      } else {
        res.status(403).json({ success: false });
      }
    },
}));

import organizationRoutes from '../../backend/src/routes/organizations';

const app = express();
app.use(express.json());
app.use('/organizations', organizationRoutes);
app.use((err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.name === 'ZodError' ? 400 : err.statusCode ?? 500).json({ success: false, error: { message: err.message } });
});

type Row = Record<string, unknown> & { updated_at: Date };
let row: Row;

// The stored organization, with updateMany honouring its updated_at guard.
function useRow(initial: Partial<Row> = {}) {
  row = {
    id: 'org-1',
    name: 'Acme',
    slug: 'acme',
    industry: 'Technology',
    company_size: '1001-5000',
    settings: { fiscalYearStart: 'January', currency: 'USD' },
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-10-01T00:00:00Z'),
    ...initial,
  };
  db.findUnique.mockReset().mockImplementation(async () => ({ ...row }));
  db.updateMany
    .mockReset()
    .mockImplementation(async ({ where, data }: { where: { updated_at: Date }; data: Record<string, unknown> }) => {
      if (where.updated_at.getTime() !== row.updated_at.getTime()) {
        return { count: 0 };
      }
      const set = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
      row = { ...row, ...set } as Row;
      return { count: 1 };
    });
  db.audit.mockReset().mockResolvedValue({});
}

describe('PUT /organizations/current', () => {
  beforeEach(() => useRow());

  it('merges settings, keeps keys it was not sent, and says so in the response', async () => {
    const res = await request(app)
      .put('/organizations/current')
      .send({ name: 'Acme Corporation', settings: { currency: 'EUR', primaryContact: 'Sarah Chen' } });
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      name: 'Acme Corporation',
      settings: { fiscalYearStart: 'January', currency: 'EUR', primaryContact: 'Sarah Chen' },
    });
  });

  it('records every save in the audit log', async () => {
    await request(app).put('/organizations/current').send({ name: 'Acme Corporation' });
    expect(db.audit).toHaveBeenCalledTimes(1);
    expect(db.audit.mock.calls[0][0].data).toMatchObject({
      organization_id: 'org-1',
      user_id: 'usr-1',
      action: 'organization.update',
      resource_type: 'organization',
      resource_id: 'org-1',
    });
  });

  it('saves industry and company size, and leaves settings alone when none are sent', async () => {
    const res = await request(app)
      .put('/organizations/current')
      .send({ industry: 'technology', companySize: '5000+' });
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      industry: 'technology',
      companySize: '5000+',
      settings: { fiscalYearStart: 'January', currency: 'USD' },
    });
    expect(db.updateMany.mock.calls[0][0].data.settings).toBeUndefined();
  });

  it('clears industry and company size when the page sends "Not set"', async () => {
    const res = await request(app).put('/organizations/current').send({ industry: '', companySize: '' });
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ industry: null, companySize: null });
  });

  it('reads settings that were stored as a JSON string', async () => {
    useRow({ settings: JSON.stringify({ fiscalYearStart: 'April' }) });
    const res = await request(app).put('/organizations/current').send({ settings: { currency: 'TRY' } });
    expect(res.body.data.settings).toEqual({ fiscalYearStart: 'April', currency: 'TRY' });
  });

  it('keeps a concurrent save\'s settings, retrying against the newer row', async () => {
    db.updateMany.mockImplementationOnce(async () => {
      // Another save lands between this one's read and write.
      row = { ...row, settings: { ...(row.settings as object), dataRetention: '7y' }, updated_at: new Date('2026-10-02T00:00:00Z') };
      return { count: 0 };
    });
    const res = await request(app).put('/organizations/current').send({ settings: { primaryEmail: 'ops@acme.test' } });
    expect(res.status).toBe(200);
    expect(res.body.data.settings).toEqual({
      fiscalYearStart: 'January',
      currency: 'USD',
      dataRetention: '7y',
      primaryEmail: 'ops@acme.test',
    });
  });

  it('answers 409 rather than overwrite when the row keeps changing', async () => {
    db.updateMany.mockResolvedValue({ count: 0 });
    const res = await request(app).put('/organizations/current').send({ name: 'Acme' });
    expect(res.status).toBe(409);
    expect(db.audit).not.toHaveBeenCalled();
  });

  it("lets the organization's owner save", async () => {
    const res = await request(app).put('/organizations/current').set('x-test-role', 'OWNER').send({ name: 'Acme' });
    expect(res.status).toBe(200);
  });

  it('turns away an analyst', async () => {
    const res = await request(app).put('/organizations/current').set('x-test-role', 'ANALYST').send({ name: 'Acme' });
    expect(res.status).toBe(403);
    expect(db.updateMany).not.toHaveBeenCalled();
  });
});

describe('GET /organizations/current', () => {
  it('returns settings stored as a JSON string as an object', async () => {
    useRow({ settings: JSON.stringify({ fiscalYearStart: 'April' }) });
    const res = await request(app).get('/organizations/current');
    expect(res.body.data.settings).toEqual({ fiscalYearStart: 'April' });
  });
});
