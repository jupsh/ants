import { defineConfig } from 'vitest/config';

// Runs only this item's test (the root config covers test/**):
//   npx vitest run --config backlog/B013-general-save-and-restore-of-sim-state/vitest.config.ts
export default defineConfig({
  test: { include: ['backlog/B013-general-save-and-restore-of-sim-state/serialize.test.ts'], testTimeout: 120_000 },
});
