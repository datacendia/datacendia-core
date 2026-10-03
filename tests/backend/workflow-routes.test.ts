/**
 * Workflow Routes — Unit Tests
 * Bridge lists the organization's workflow executions. GET /executions used to
 * be registered after GET /:id, which took "executions" for a workflow id and
 * answered 404.
 *
 * Run: npx vitest run tests/backend/workflow-routes.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

const db = vi.hoisted(() => ({
  executionsFindMany: vi.fn(),
  executionsCount: vi.fn(),
  workflowsFindUnique: vi.fn(),
}));
vi.mock('../../backend/src/config/database.js', () => ({
  prisma: {
    workflow_executions: { findMany: db.executionsFindMany, count: db.executionsCount },
    workflows: { findUnique: db.workflowsFindUnique },
  },
}));
vi.mock('../../backend/src/config/redis.js', () => ({ pubsub: { publish: vi.fn() } }));
vi.mock('../../backend/src/utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../backend/src/middleware/auth.js', () => ({
  devAuth: (req: Request, _res: Response, next: NextFunction) => {
    (req as Request & { organizationId?: string }).organizationId = 'org-1';
    next();
  },
}));

import workflowRoutes from '../../backend/src/routes/workflows';

const app = express();
app.use(express.json());
app.use('/workflows', workflowRoutes);
app.use((err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.statusCode ?? 500).json({ success: false, error: { message: err.message } });
});

describe('workflow routes', () => {
  beforeEach(() => {
    db.executionsFindMany.mockReset().mockResolvedValue([
      { id: 'ex-1', status: 'COMPLETED', workflows: { name: 'Vendor review' } },
    ]);
    db.executionsCount.mockReset().mockResolvedValue(1);
    db.workflowsFindUnique.mockReset().mockResolvedValue(null);
  });

  it("GET /executions lists the organization's executions", async () => {
    const res = await request(app).get('/workflows/executions?status=COMPLETED');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([{ id: 'ex-1', status: 'COMPLETED', workflows: { name: 'Vendor review' } }]);
    expect(res.body.pagination).toEqual({ page: 1, limit: 20, total: 1 });
    expect(db.executionsFindMany.mock.calls[0][0].where).toEqual({
      workflows: { organization_id: 'org-1' },
      status: 'COMPLETED',
    });
    // It never looked for a workflow called "executions".
    expect(db.workflowsFindUnique).not.toHaveBeenCalled();
  });

  it('GET /:id still looks up a single workflow', async () => {
    const res = await request(app).get('/workflows/wf-missing');
    expect(res.status).toBe(404);
    expect(db.workflowsFindUnique).toHaveBeenCalledWith({ where: { id: 'wf-missing' } });
  });
});
