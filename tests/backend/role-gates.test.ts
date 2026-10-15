/**
 * Role Gates — Unit Tests
 * Members can read the vertical configuration, but only an organization's
 * admins can change it; the AI Marketing Studio is the platform owner's alone.
 *
 * Run: npx vitest run tests/backend/role-gates.test.ts
 */

import { describe, it, expect, vi } from 'vitest';
import express, { type NextFunction, type Request, type Response, type Router } from 'express';
import request from 'supertest';

// Every service method resolves, so a request the gate lets through succeeds.
const anyService = vi.hoisted(
  () => () =>
    new Proxy({} as Record<string, unknown>, {
      get: (target, key: string) => (target[key] ??= vi.fn(async () => ({ id: 'cfg-1', verticalId: 'technology' }))),
    })
);
vi.mock('../../backend/src/services/enterprise/VerticalConfigService.js', () => ({ verticalConfigService: anyService() }));
vi.mock('../../backend/src/services/ollama.js', () => ({ default: anyService() }));
vi.mock('../../backend/src/utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../backend/src/middleware/auth.js', () => ({
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

import verticalConfigRoutes from '../../backend/src/routes/vertical-config';
import marketingStudioRoutes from '../../backend/src/routes/marketing-studio';

// What the domain router's authenticate() provides, with the role from a header.
function appFor(path: string, routes: Router) {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    const r = req as Request & { organizationId?: string; user?: { id: string; role: string } };
    r.organizationId = 'org-1';
    r.user = { id: 'usr-1', role: String(req.headers['x-test-role']) };
    next();
  });
  app.use(path, routes);
  return app;
}

const verticals = appFor('/vertical-config', verticalConfigRoutes);
const studio = appFor('/marketing-studio', marketingStudioRoutes);

describe('vertical-config', () => {
  it.each([
    ['post', '/vertical-config/organization'],
    ['put', '/vertical-config/organization'],
    ['post', '/vertical-config/organization/switch-vertical'],
    ['post', '/vertical-config/toggle/council'],
    ['post', '/vertical-config/toggle-bulk'],
  ] as const)('an analyst cannot %s %s', async (method, url) => {
    const res = await request(verticals)[method](url).set('x-test-role', 'ANALYST').send({});
    expect(res.status).toBe(403);
  });

  it.each([['OWNER'], ['ADMIN'], ['SUPER_ADMIN']])('%s can change the configuration', async (role) => {
    const res = await request(verticals).post('/vertical-config/toggle/council').set('x-test-role', role).send({ enabled: true });
    expect(res.status).toBe(200);
  });

  it("any member can read the organization's configuration", async () => {
    const res = await request(verticals).get('/vertical-config/organization').set('x-test-role', 'ANALYST');
    expect(res.status).toBe(200);
  });
});

describe('marketing-studio', () => {
  it.each([['ADMIN'], ['OWNER'], ['ANALYST']])('turns away %s', async (role) => {
    const res = await request(studio).post('/marketing-studio/copy').set('x-test-role', role).send({ topic: 'x' });
    expect(res.status).toBe(403);
  });

  it('lets the platform owner in', async () => {
    const res = await request(studio).post('/marketing-studio/copy').set('x-test-role', 'SUPER_ADMIN').send({ topic: 'x' });
    expect(res.status).toBe(200);
  });
});
