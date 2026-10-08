import { defineConfig } from 'vitest/config';
import { simHash } from './scripts/simHash.ts';

export default defineConfig({
  base: './',
  // Precomputed page results are used only when they match this (scripts/precompute.ts).
  define: { __SIM_HASH__: JSON.stringify(simHash()) },
  plugins: [
    {
      // The dev server answers with the current hash, so edits made while it runs are seen.
      name: 'sim-hash',
      configureServer(server) {
        server.middlewares.use('/__sim_hash', (_req, res) => res.end(simHash()));
      },
    },
  ],
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
