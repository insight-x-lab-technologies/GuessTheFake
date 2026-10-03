// Vitest stand-in for the `virtual:pwa-register` module that only exists
// inside the Vite PWA build. Tests that care inject their own `register`.
import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

export type { RegisterSWOptions };

export function registerSW(_options?: RegisterSWOptions) {
  return async (_reloadPage?: boolean) => undefined;
}
