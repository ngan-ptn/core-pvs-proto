import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
    maxWorkers: 4,
    minWorkers: 1,
    maxConcurrency: 4,

    pool: 'forks',
    poolOptions: {
      forks: {
        minForks: 1,
        maxForks: 4,
      },
    },

    testTimeout: 30000,
    hookTimeout: 30000,

    reporters: ['basic'],
    watchExclude: ['node_modules', 'dist'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
      ],
    },
  },
})
