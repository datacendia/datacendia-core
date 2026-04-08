/**
 * Tests for backend/src/middleware/csrf.ts
 * Covers: generateCsrfToken, csrfTokenHandler, csrfProtection, ensureCsrfToken
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/config/index.js', () => ({
  config: {
    nodeEnv: 'production',
    jwtSecret: 'test-secret',
  },
}));

vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { generateCsrfToken, csrfTokenHandler, csrfProtection, ensureCsrfToken } from '../../src/middleware/csrf.js';
import type { Request, Response, NextFunction } from 'express';

function createMockReq(overrides: Partial<Request> = {}): Partial<Request> {
  return {
    method: 'GET',
    path: '/api/v1/test',
    originalUrl: '/api/v1/test',
    cookies: {},
    get: vi.fn(() => undefined) as any,
    ...overrides,
  };
}

function createMockRes(): any {
  const res: any = {
    _status: 0,
    _json: null,
    _cookies: {} as Record<string, { value: string; options: any }>,
    _headers: {} as Record<string, string>,
    status: vi.fn().mockImplementation(function(code: number) { res._status = code; return res; }),
    json: vi.fn().mockImplementation(function(body: unknown) { res._json = body; return res; }),
    cookie: vi.fn().mockImplementation(function(name: string, value: string, options: any) {
      res._cookies[name] = { value, options };
    }),
    setHeader: vi.fn().mockImplementation(function(name: string, value: string) {
      res._headers[name] = value;
    }),
  };
  return res;
}

describe('generateCsrfToken', () => {
  it('should generate a hex string', () => {
    const token = generateCsrfToken();
    expect(token).toMatch(/^[0-9a-f]+$/);
  });

  it('should generate tokens of 64 characters (32 bytes in hex)', () => {
    const token = generateCsrfToken();
    expect(token).toHaveLength(64);
  });

  it('should generate unique tokens', () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();
    expect(token1).not.toBe(token2);
  });
});

describe('csrfTokenHandler', () => {
  it('should return a CSRF token and set cookie', () => {
    const req = createMockReq();
    const res = createMockRes();

    csrfTokenHandler(req as Request, res as Response);

    expect(res._json.success).toBe(true);
    expect(res._json.csrfToken).toBeDefined();
    expect(res._json.csrfToken).toHaveLength(64);
    expect(res._cookies.csrf_token).toBeDefined();
  });
});

describe('csrfProtection', () => {
  const next: NextFunction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should skip CSRF check for GET requests', () => {
    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    csrfProtection(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should skip CSRF check for HEAD requests', () => {
    const req = createMockReq({ method: 'HEAD' });
    const res = createMockRes();

    csrfProtection(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should skip CSRF check for OPTIONS requests', () => {
    const req = createMockReq({ method: 'OPTIONS' });
    const res = createMockRes();

    csrfProtection(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should skip CSRF for exempt paths', () => {
    const req = createMockReq({
      method: 'POST',
      originalUrl: '/api/v1/webhooks/stripe',
    });
    const res = createMockRes();

    csrfProtection(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should skip CSRF for health check', () => {
    const req = createMockReq({
      method: 'POST',
      originalUrl: '/health',
    });
    const res = createMockRes();

    csrfProtection(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should reject POST without CSRF tokens', () => {
    const req = createMockReq({
      method: 'POST',
      originalUrl: '/api/v1/decisions',
    });
    const res = createMockRes();

    csrfProtection(req as Request, res as Response, next);

    expect(res._status).toBe(403);
    expect(res._json.error.code).toBe('CSRF_TOKEN_MISSING');
  });

  it('should reject POST with mismatched tokens', () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();

    const req = createMockReq({
      method: 'POST',
      originalUrl: '/api/v1/decisions',
      cookies: { csrf_token: token1 },
      get: vi.fn((header: string) => {
        if (header === 'x-csrf-token') return token2;
        return undefined;
      }) as any,
    });
    const res = createMockRes();

    csrfProtection(req as Request, res as Response, next);

    expect(res._status).toBe(403);
    expect(res._json.error.code).toBe('CSRF_TOKEN_INVALID');
  });

  it('should accept POST with matching tokens and rotate', () => {
    const token = generateCsrfToken();

    const req = createMockReq({
      method: 'POST',
      originalUrl: '/api/v1/decisions',
      cookies: { csrf_token: token },
      get: vi.fn((header: string) => {
        if (header === 'x-csrf-token') return token;
        return undefined;
      }) as any,
    });
    const res = createMockRes();

    csrfProtection(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    // Should set new token cookie (rotation)
    expect(res._cookies.csrf_token).toBeDefined();
    expect(res._cookies.csrf_token.value).not.toBe(token);
    // Should expose new token in response header
    expect(res._headers['X-CSRF-Token-New']).toBeDefined();
  });
});

describe('ensureCsrfToken', () => {
  it('should set cookie if no existing token', () => {
    const req = createMockReq({ cookies: {} });
    const res = createMockRes();
    const next = vi.fn();

    ensureCsrfToken(req as Request, res as Response, next);

    expect(res._cookies.csrf_token).toBeDefined();
    expect(next).toHaveBeenCalled();
  });

  it('should not overwrite existing token', () => {
    const req = createMockReq({ cookies: { csrf_token: 'existing-token' } });
    const res = createMockRes();
    const next = vi.fn();

    ensureCsrfToken(req as Request, res as Response, next);

    expect(res._cookies.csrf_token).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
