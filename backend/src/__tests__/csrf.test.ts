import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// The real config validates DATABASE_URL and JWT_SECRET at import; this is a unit test.
vi.mock('../config/index.js', () => ({ config: { nodeEnv: 'development' } }));
vi.mock('../utils/logger.js', () => ({
  logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const { csrfProtection } = await import('../middleware/csrf.js');

function run(req: Partial<Request> & { headers?: Record<string, string> }) {
  const headers = Object.fromEntries(Object.entries(req.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
  const request = {
    method: 'POST',
    path: '/v1/decisions',
    originalUrl: '/api/v1/decisions',
    cookies: {},
    ip: '127.0.0.1',
    get: (name: string) => headers[name.toLowerCase()],
    ...req,
  } as unknown as Request;
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis(), cookie: vi.fn(), setHeader: vi.fn() } as unknown as Response;
  const next = vi.fn() as NextFunction;
  csrfProtection(request, res, next);
  return { res, next };
}

describe('csrfProtection', () => {
  it('rejects an anonymous write without a token', () => {
    const { res, next } = run({});
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('lets a bearer-authenticated write through, since it cannot be forged cross-site', () => {
    const { next } = run({ headers: { Authorization: 'Bearer eyJhbGciOi.test.token' } });
    expect(next).toHaveBeenCalledOnce();
  });

  it('does not treat an empty or non-bearer Authorization header as a bearer token', () => {
    expect(run({ headers: { Authorization: 'Bearer ' } }).next).not.toHaveBeenCalled();
    expect(run({ headers: { Authorization: 'Basic dXNlcjpwYXNz' } }).next).not.toHaveBeenCalled();
  });

  it('accepts a matching double-submit token', () => {
    const { next } = run({ cookies: { csrf_token: 'abc' }, headers: { 'X-CSRF-Token': 'abc' } } as any);
    expect(next).toHaveBeenCalledOnce();
  });

  it('leaves reads alone', () => {
    expect(run({ method: 'GET' }).next).toHaveBeenCalledOnce();
  });
});
