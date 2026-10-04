/**
 * Vitest — root unit tests (`npm test`)
 *
 * Without this file, `vitest run` at the root fell back to defaults: every
 * *.test / *.spec file in the repo, in Node, with no setup. It collected the
 * Playwright suite, the widgets package and the backend's own tests, and ran
 * DOM tests without a DOM, so it was never run in CI.
 *
 * Not here, on purpose:
 * - backend/: its own vitest.config.ts and CI job;
 * - packages/widgets: its own dependencies and widgets.yml workflow;
 * - tests/e2e, tests/visual: Playwright (`npm run test:e2e`, `test:visual`);
 * - tests/ai-validation, tests/integration: need a running API or model
 *   (`npm run test:live`, vitest.live.config.ts); tests/load, tests/chaos.
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: 'frontend',
            environment: 'jsdom',
            globals: true,
            setupFiles: ['tests/setup.ts'],
            include: ['src/**/*.test.{ts,tsx}', 'tests/frontend/**/*.test.{ts,tsx}'],
          },
        },
        {
          extends: true,
          test: {
            name: 'node',
            environment: 'node',
            globals: true,
            include: [
              'tests/backend/**/*.test.ts',
              'tests/contract/**/*.test.ts',
              'tests/verticals/**/*.test.ts',
            ],
            // Backend modules validate these at import; same values as the
            // backend CI job. Nothing here connects to them.
            env: {
              NODE_ENV: 'test',
              DATABASE_URL: 'postgresql://datacendia:datacendia_test@localhost:5432/datacendia_test',
              REDIS_URL: 'redis://localhost:6379',
              JWT_SECRET: 'test-secret-key-for-ci-minimum-32-chars',
              JWT_REFRESH_SECRET: 'test-refresh-secret-for-ci-minimum-32-chars',
            },
          },
        },
      ],
    },
  })
);
