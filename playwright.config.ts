import { defineConfig, devices } from '@playwright/test';

const host = 'localhost';
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: 'html',
  webServer: [
    {
      command: 'cd apps/hub && pnpm dev',
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'cd apps/physics && pnpm dev',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'cd apps/bio && pnpm dev',
      url: 'http://localhost:3003',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'cd apps/math && pnpm dev',
      url: 'http://localhost:3004',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'cd apps/chem && pnpm dev',
      url: 'http://localhost:3005',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  use: {
    baseURL,
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
});
