import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,

    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },

    testTimeout: 10000,
    hookTimeout: 10000,

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
