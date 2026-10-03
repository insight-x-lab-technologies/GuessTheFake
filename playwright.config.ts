import { defineConfig, devices } from '@playwright/test';

// Real-browser smoke (W14-06). Runs against the production build served by
// `vite preview`, so the manifest, service worker and lazy chunks are real.
const PORT = 4173;

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/`,
    locale: 'pt-BR',
    trace: 'retain-on-failure',
    serviceWorkers: 'block'
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    {
      name: 'mobile-portrait',
      use: { ...devices['Desktop Chrome'], viewport: { width: 402, height: 874 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
    },
    {
      name: 'mobile-landscape',
      use: { ...devices['Desktop Chrome'], viewport: { width: 874, height: 402 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
    }
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000
  }
});
