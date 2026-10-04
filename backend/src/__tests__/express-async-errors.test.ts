/**
 * Tests — rejected handlers reach the error handler
 *
 * Without utils/expressAsyncErrors, Express 4 drops the promise an async
 * handler returns: a rejection leaves the request unanswered and becomes an
 * unhandled rejection, which the logger turns into process exit.
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import '../utils/expressAsyncErrors.js';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import type { AddressInfo } from 'net';

let base = '';
let close: () => void = () => {};
const unhandled = vi.fn();

beforeAll(async () => {
  process.on('unhandledRejection', unhandled);

  const app = express();
  app.get('/type-error', async (req: Request) => {
    // A plain bug in an async handler, no throw or await in sight.
    (req as unknown as { body: { missing: { field: string } } }).body.missing.field.trim();
  });
  app.get('/rejected', async () => {
    await Promise.reject(new Error('database unavailable'));
  });
  app.get('/ok', async (_req: Request, res: Response) => {
    res.json({ ok: true });
  });
  const router = express.Router();
  router.use(async (_req: Request, _res: Response, _next: NextFunction) => {
    throw new Error('middleware failed');
  });
  app.use('/nested', router);
  // Arity 4: Express must still recognise this as the error handler.
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ error: err.message });
  });

  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  close = () => server.close();
});

afterAll(() => {
  close();
  process.off('unhandledRejection', unhandled);
});

const get = async (p: string) => {
  const res = await fetch(`${base}${p}`, { signal: AbortSignal.timeout(3000) });
  return { status: res.status, body: await res.json() };
};

describe('async handlers under Express 4', () => {
  it('answers a TypeError inside an async handler with the error handler', async () => {
    const { status, body } = await get('/type-error');
    expect(status).toBe(500);
    expect(body.error).toMatch(/Cannot read properties of undefined/);
  });

  it('answers a rejected await', async () => {
    expect(await get('/rejected')).toEqual({ status: 500, body: { error: 'database unavailable' } });
  });

  it('answers a throwing async middleware in a nested router', async () => {
    expect(await get('/nested/anything')).toEqual({ status: 500, body: { error: 'middleware failed' } });
  });

  it('leaves working handlers alone', async () => {
    expect(await get('/ok')).toEqual({ status: 200, body: { ok: true } });
  });

  it('leaves nothing unhandled for the logger to exit on', () => {
    expect(unhandled).not.toHaveBeenCalled();
  });
});
