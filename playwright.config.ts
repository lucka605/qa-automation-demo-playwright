import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // ✅ 1. reporter
  reporter: [['html']],

  // ✅ 2.
  use: {
    headless: false,
    trace: 'on-first-retry',              // ✅ 
    video: 'retain-on-failure',           // ✅ 
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
  },

  // ✅ 3. 
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        
      },
    },
  ],
});
