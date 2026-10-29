import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { include: ['backlog/B017-pheromone-field-with-a-physical-sampling/footprint.test.ts'], testTimeout: 10_000 },
});
