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

// Static: vi.mock is hoisted above it. Importing inside the first test spent that
// test's 5s timeout loading the module graph, which failed under a full run.
import { devAuth, requireRole } from '../../backend/src/middleware/auth.js';

describe('Auth Middleware — requireRole', () => {
  it('should reject when no user is attached to request', async () => {
    const req = { user: undefined } as any;
    const res = {} as any;
    const next = vi.fn();

    requireRole('ADMIN')(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('should reject when user has wrong role', async () => {
    const req = { user: { role: 'viewer' } } as any;
    const res = {} as any;
    const next = vi.fn();

    requireRole('ADMIN')(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403 })
    );
  });

  it('should pass when user has correct role', async () => {
    const req = { user: { role: 'ADMIN' } } as any;
    const res = {} as any;
    const next = vi.fn();

    requireRole('ADMIN')(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should accept any of multiple allowed roles', async () => {
    const req = { user: { role: 'analyst' } } as any;
    const res = {} as any;
    const next = vi.fn();

    requireRole('ADMIN', 'analyst', 'operator')(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});

describe('Auth Middleware — devAuth environment guards', () => {
  it('should use real auth when Bearer token is provided', async () => {
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
