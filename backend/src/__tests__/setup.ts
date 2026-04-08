// =============================================================================
// BACKEND TEST SETUP - Global Configuration
// =============================================================================

import { vi, beforeAll, afterAll } from 'vitest';

// Suppress console output during tests
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});
