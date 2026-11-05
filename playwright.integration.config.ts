import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/integration',
  testMatch: '**/*.integration.spec.ts',
  fullyParallel: true,
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-integration-report', open: 'never' }]],
  use: { trace: 'on-first-retry' },
  webServer: {
    command: 'node server/index.cjs',
    url: 'http://127.0.0.1:3002/health',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
