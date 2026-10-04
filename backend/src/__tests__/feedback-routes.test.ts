/**
 * Tests — feedback routes, mounted at /api/v1/feedback
 *
 * The list and create routes used to be /feedback inside a router mounted at
 * /api/v1/feedback, so the page's GET/POST /api/v1/feedback got 404.
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import express from 'express';
import type { AddressInfo } from 'net';

vi.mock('../services/feedback/FeedbackService.js', () => ({
  feedbackService: {
    listFeedback: vi.fn(async () => [{ id: 'fb-1' }]),
    submitFeedback: vi.fn(async (body: object) => ({ id: 'fb-2', ...body })),
    getFeedback: vi.fn(async (id: string) => (id === 'fb-1' ? { id } : null)),
    getAnalytics: vi.fn(async () => ({ total: 1 })),
  },
}));

const { default: feedbackRoutes } = await import('../routes/feedback.js');

let base = '';
let close: () => void = () => {};
beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/feedback', feedbackRoutes);
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1/feedback`;
  close = () => server.close();
});
afterAll(() => close());

describe('feedback routes', () => {
  it('lists feedback at the mount path (was /feedback/feedback)', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
    expect((await res.json()).data).toEqual([{ id: 'fb-1' }]);
  });

  it('creates feedback at the mount path', async () => {
    const res = await fetch(base, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: 'x' }),
    });
    expect(res.status).toBe(201);
  });

  it('serves one entry by id', async () => {
    expect((await fetch(`${base}/fb-1`)).status).toBe(200);
    expect((await fetch(`${base}/missing`)).status).toBe(404);
  });

  it('keeps /analytics from being read as an id', async () => {
    const res = await fetch(`${base}/analytics`);
    expect(res.status).toBe(200);
    expect((await res.json()).data).toEqual({ total: 1 });
  });
});
