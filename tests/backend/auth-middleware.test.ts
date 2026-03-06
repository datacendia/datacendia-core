/**
 * Auth Middleware — Unit Tests
 * Tests authenticate, devAuth, requireRole, and optionalAuth behavior.
 *
 * Run: npx vitest run tests/backend/auth-middleware.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies before importing auth
vi.mock('../../backend/src/config/index.js', () => ({
  config: {
    nodeEnv: 'test',
    requireAuth: false,
    jwtSecret: 'test-secret-minimum-32-characters-long-for-validation',
  },
}));

vi.mock('../../backend/src/config/database.js', () => ({
  prisma: {
    users: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('../../backend/src/config/redis.js', () => ({
  cache: {
    exists: vi.fn().mockResolvedValue(false),
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn(),
  },
}));

vi.mock('../../backend/src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Auth Middleware — requireRole', () => {
  it('should reject when no user is attached to request', async () => {
    // Import after mocks are set up
    const { requireRole } = await import('../../backend/src/middleware/auth.js');

    const req = { user: undefined } as any;
    const res = {} as any;
    const next = vi.fn();

    requireRole('ADMIN')(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('should reject when user has wrong role', async () => {
    const { requireRole } = await import('../../backend/src/middleware/auth.js');

    const req = { user: { role: 'viewer' } } as any;
    const res = {} as any;
    const next = vi.fn();

    requireRole('ADMIN')(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403 })
    );
  });

  it('should pass when user has correct role', async () => {
    const { requireRole } = await import('../../backend/src/middleware/auth.js');

    const req = { user: { role: 'ADMIN' } } as any;
    const res = {} as any;
    const next = vi.fn();

    requireRole('ADMIN')(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should accept any of multiple allowed roles', async () => {
    const { requireRole } = await import('../../backend/src/middleware/auth.js');

    const req = { user: { role: 'analyst' } } as any;
    const res = {} as any;
    const next = vi.fn();

    requireRole('ADMIN', 'analyst', 'operator')(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});

describe('Auth Middleware — devAuth environment guards', () => {
  it('should use real auth when Bearer token is provided', async () => {
    const { devAuth } = await import('../../backend/src/middleware/auth.js');

    const req = {
      headers: { authorization: 'Bearer invalid-token' },
    } as any;
    const res = {} as any;
    const next = vi.fn();

    // devAuth should delegate to authenticate, which will fail on invalid token
    await devAuth(req, res, next);

    // Should have called next with an auth error (invalid token)
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });
});
