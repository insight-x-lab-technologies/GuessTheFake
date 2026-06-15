import { describe, expect, it } from 'vitest';
import { createStorageKey, readVersionedWithMigrations, writeVersioned, type StorageAdapter } from './storage';

function createMemoryStorage(): StorageAdapter {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
}

describe('versioned storage migrations', () => {
  it('migrates an older envelope into the current key', () => {
    const storage = createMemoryStorage();
    const oldKey = createStorageKey('platform', 'sample', 1);
    const newKey = createStorageKey('platform', 'sample', 2);

    writeVersioned(storage, oldKey, { name: 'Ana' }, 1);

    const value = readVersionedWithMigrations(
      storage,
      newKey,
      { names: [] },
      2,
      [
        {
          fromVersion: 1,
          key: oldKey,
          migrate: previous => ({ names: [(previous as { name: string }).name] })
        }
      ]
    );

    expect(value).toEqual({ names: ['Ana'] });
    expect(JSON.parse(storage.getItem(newKey) ?? '{}')).toMatchObject({
      version: 2,
      value: { names: ['Ana'] }
    });
  });

  it('uses the fallback for invalid migration payloads', () => {
    const storage = createMemoryStorage();
    const oldKey = createStorageKey('platform', 'sample', 1);

    storage.setItem(oldKey, '{');

    expect(readVersionedWithMigrations(storage, createStorageKey('platform', 'sample', 2), 'fallback', 2, [])).toBe('fallback');
  });
});
