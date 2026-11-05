import { defineConfig, devices } from '@playwright/test';

// Intentionally excludes local DB tests: run them with playwright.integration.config.ts.
export default defineConfig({
  testDir: './tests',
  testMatch: '**/test_case*.spec.ts',
  forbidOnly: !!process.env.CI,
  fullyParallel: false, // Shared demo user + public site; avoid concurrent purchases.
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://automationexercise.com',
    headless: process.env.HEADED !== '1',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
