// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// BACKEND TEST SETUP
// Global test configuration and environment setup for backend tests
// =============================================================================

import { vi } from 'vitest';

// Mock environment variables for tests
process.env['DATABASE_URL'] = process.env['DATABASE_URL'] || 'postgresql://test:test@localhost:5432/test';
process.env['JWT_SECRET'] = process.env['JWT_SECRET'] || 'test-secret-key-for-testing-only';
process.env['NODE_ENV'] = 'test';

// Mock logger to prevent console output during tests
vi.mock('../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));
