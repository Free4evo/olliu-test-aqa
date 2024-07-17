import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  timeout: 20000,
  globalTimeout: 60000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: {maxDiffPixels: 50}
  },
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://enotes.pointschool.ru',
    extraHTTPHeaders: {
      'Accept': 'application/vnd.github.v3+json',
      // '_csrf': `${process.env.API_TOKEN}`,
    },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
})
