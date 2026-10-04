/**
 * Vitest — live-environment suites (`npm run test:live`)
 *
 * These call a running API, Ollama, MinIO or frontend and skip their checks
 * when nothing answers, so they prove nothing in CI. Run them against a stack:
 *   docker compose -f docker-compose.demo.yml up -d && npm run test:live
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'live',
    environment: 'node',
    globals: true,
    include: ['tests/ai-validation/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    testTimeout: 120000,
  },
});
