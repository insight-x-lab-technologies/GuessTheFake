// Inert storage for environments without localStorage (SSR-like test setups).
export const memoryStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined
};
