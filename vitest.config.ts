import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'virtual:pwa-register': fileURLToPath(new URL('./src/test/pwa-register-stub.ts', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // e2e/ holds the Playwright smoke (`npm run test:e2e`).
    include: ['src/**/*.test.{ts,tsx}'],
    // Full-App jsdom flows take several seconds on small CI/dev machines.
    testTimeout: 20000
  }
});
