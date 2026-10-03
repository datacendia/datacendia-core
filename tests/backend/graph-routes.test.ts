/**
 * Graph Routes — Unit Tests
 * Without Neo4j (the quick-start demo has none) the graph routes say so with a
 * 503 the UI can explain. Labels can't be used to inject Cypher, and search
 * text is matched literally.
 *
 * Run: npx vitest run tests/backend/graph-routes.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

const read = vi.hoisted(() => vi.fn());
vi.mock('../../backend/src/config/neo4j.js', () => ({ graph: { read, write: vi.fn() } }));
vi.mock('../../backend/src/config/database.js', () => ({ prisma: {} }));
vi.mock('../../backend/src/utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../backend/src/middleware/auth.js', () => ({
  devAuth: (req: Request, _res: Response, next: NextFunction) => {
    (req as Request & { organizationId?: string }).organizationId = 'org-1';
    next();
  },
}));

import graphRoutes from '../../backend/src/routes/graph';

const app = express();
app.use(express.json());
app.use('/graph', graphRoutes);
app.use((err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.name === 'ZodError' ? 400 : err.statusCode ?? 500;
  res.status(status).json({ success: false, error: { message: err.message } });
});

const neo4jDown = () =>
  Object.assign(new Error('Failed to connect to server. Please ensure that your database is listening'), {
    code: 'ServiceUnavailable',
  });

describe('graph routes', () => {
  beforeEach(() => {
    read.mockReset().mockResolvedValue([]);
  });

  it('answers 503 GRAPH_UNAVAILABLE when Neo4j is not connected', async () => {
    read.mockRejectedValue(neo4jDown());
    const res = await request(app).get('/graph/entities');
    expect(res.status).toBe(503);
    expect(res.body.error.code).toBe('GRAPH_UNAVAILABLE');
    expect(res.body.error.message).not.toMatch(/Please ensure/);
  });

  it('leaves other failures to the app error handler', async () => {
    read.mockRejectedValue(new Error('syntax error in query'));
    const res = await request(app).get('/graph/search?q=risk');
    expect(res.status).toBe(500);
  });

  it.each([
    ['/graph/entities?type=Person%20RETURN%201%20UNION%20MATCH%20(x)%20RETURN%20x'],
    ['/graph/search?q=risk&type=Person%20OR%201%3D1'],
  ])('refuses a type that is not a plain label: %s', async (url) => {
    const res = await request(app).get(url);
    expect(res.status).toBe(400);
    expect(read).not.toHaveBeenCalled();
  });

  it('matches search text literally', async () => {
    await request(app).get('/graph/search?q=C%2B%2B%20(v2)&type=Person');
    const [cypher, params] = read.mock.calls[0];
    expect(params.pattern).toBe('(?i).*C\\+\\+ \\(v2\\).*');
    expect(cypher).toContain('AND n:Person');
  });

  it('caps the search limit', async () => {
    await request(app).get('/graph/search?q=risk&limit=100000');
    expect(read.mock.calls[0][1].limit).toBe(100);
  });
});
