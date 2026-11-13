import { defineConfig, devices } from '@playwright/test'

const port = 4173

// Tests run against the built server in .output: the prerendered pages and the /api routes that ship.
// Desktop matches the 1440px boards; phone matches the 390px Phone boards.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'on-first-retry',
    // Lets a machine with a preinstalled Chromium use it instead of downloading one.
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined },
  },
  webServer: {
    command: 'node .output/server/index.mjs',
    url: `http://127.0.0.1:${port}`,
    env: { NITRO_PORT: String(port), NITRO_HOST: '127.0.0.1' },
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    // The API test doesn't depend on the viewport, so it runs once, well inside the rate limit.
    { name: 'phone', testIgnore: /beta-api/, use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
})
