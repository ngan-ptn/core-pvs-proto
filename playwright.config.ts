import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: 0,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'event-demo',
      use: {
        baseURL: 'http://localhost:5173',
        browserName: 'chromium',
      },
    },
    {
      name: 'main-app',
      use: {
        baseURL: 'http://localhost:5174',
        browserName: 'chromium',
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm dev:event-demo',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: 'pnpm dev:main-app',
      url: 'http://localhost:5174',
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
})
