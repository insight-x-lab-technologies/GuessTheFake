import type { StorageAdapter } from '../core/storage/storage';

// In-memory StorageAdapter for storage tests.
export function createMemoryStorage(): StorageAdapter {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => void values.set(key, value),
    removeItem: key => void values.delete(key)
  };
}
