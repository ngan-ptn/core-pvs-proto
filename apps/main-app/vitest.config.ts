import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    passWithNoTests: true,
    maxWorkers: 4,
    minWorkers: 1,
    maxConcurrency: 4,
    testTimeout: 30000,
    hookTimeout: 30000,

    pool: 'forks',
    poolOptions: {
      forks: {
        minForks: 1,
        maxForks: 4,
      },
    },
  },
})
