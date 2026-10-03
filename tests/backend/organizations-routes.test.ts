/**
 * Organization Routes — Unit Tests
 * Settings > Organization saves through PUT /organizations/current: an owner
 * may save, industry and size are kept, and settings are merged so other
 * features' keys survive.
 *
 * Run: npx vitest run tests/backend/organizations-routes.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

const db = vi.hoisted(() => ({ findUnique: vi.fn(), update: vi.fn(), audit: vi.fn() }));
vi.mock('../../backend/src/config/database.js', () => ({
  prisma: {
    organizations: { findUnique: db.findUnique, update: db.update },
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

describe('PUT /organizations/current', () => {
  beforeEach(() => {
    db.findUnique.mockReset().mockResolvedValue({ settings: { fiscalYearStart: 'January', currency: 'USD' } });
    db.update.mockReset().mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
      id: 'org-1',
      name: data.name ?? 'Acme',
      slug: 'acme',
      industry: data.industry ?? null,
      company_size: data.company_size ?? null,
      settings: data.settings ?? {},
    }));
    db.audit.mockReset().mockResolvedValue({});
  });

  it('merges settings, keeping keys the page does not send', async () => {
    const res = await request(app)
      .put('/organizations/current')
      .send({ name: 'Acme Corporation', settings: { currency: 'EUR', primaryContact: 'Sarah Chen' } });
    expect(res.status).toBe(200);
    expect(db.update.mock.calls[0][0].data.settings).toEqual({
      fiscalYearStart: 'January',
      currency: 'EUR',
      primaryContact: 'Sarah Chen',
    });
  });

  it('saves industry and company size', async () => {
    const res = await request(app)
      .put('/organizations/current')
      .send({ industry: 'technology', companySize: '1001-5000' });
    expect(res.status).toBe(200);
    expect(db.update.mock.calls[0][0].data).toMatchObject({ industry: 'technology', company_size: '1001-5000' });
    expect(res.body.data).toMatchObject({ industry: 'technology', companySize: '1001-5000' });
    // No settings sent: the stored ones are left alone.
    expect(db.update.mock.calls[0][0].data.settings).toBeUndefined();
  });

  it("lets the organization's owner save", async () => {
    const res = await request(app).put('/organizations/current').set('x-test-role', 'OWNER').send({ name: 'Acme' });
    expect(res.status).toBe(200);
  });

  it('turns away an analyst', async () => {
    const res = await request(app).put('/organizations/current').set('x-test-role', 'ANALYST').send({ name: 'Acme' });
    expect(res.status).toBe(403);
    expect(db.update).not.toHaveBeenCalled();
  });
});
