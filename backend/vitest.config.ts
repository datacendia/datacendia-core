import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: [
      'tests/**/*.test.ts',
      'src/__tests__/**/*.test.ts'
    ],
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: ['node_modules', 'dist', 'tests'],
    },
  },
});
