import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  worker: { format: 'es' },
  build: { target: 'es2022', sourcemap: true },
  test: {
    include: ['test/**/*.test.ts'],
    // Slow validation tiers (time-step convergence, paper reproduction) run
    // with `npm run test:full` and in CI.
    exclude: process.env.FULL ? ['node_modules/**'] : ['node_modules/**', 'test/slow/**'],
    testTimeout: 120_000,
  },
});
