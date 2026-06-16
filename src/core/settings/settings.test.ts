import { describe, expect, it } from 'vitest';
import { createStorageKey, writeVersioned, type StorageAdapter } from '../storage/storage';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  normalizeFontScale,
  normalizeSettings,
  SETTINGS_KEY,
  SETTINGS_VERSION
} from './settings';

function createMemoryStorage(): StorageAdapter {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: key => {
      values.delete(key);
    }
  };
}

describe('platform settings', () => {
  it('normalizes audio volumes', () => {
    expect(normalizeSettings({ soundVolume: 2, musicVolume: -1 })).toMatchObject({
      soundVolume: 1,
      musicVolume: 0
    });
    expect(normalizeSettings({ soundVolume: Number.NaN, musicVolume: 'loud' })).toMatchObject({
      soundVolume: DEFAULT_SETTINGS.soundVolume,
      musicVolume: DEFAULT_SETTINGS.musicVolume
    });
  });

  it('normalizes font scale to one of the five supported levels', () => {
    expect(normalizeFontScale('xs')).toBe('xs');
    expect(normalizeFontScale('sm')).toBe('sm');
    expect(normalizeFontScale('md')).toBe('md');
    expect(normalizeFontScale('lg')).toBe('lg');
    expect(normalizeFontScale('xl')).toBe('xl');
    expect(normalizeFontScale('huge')).toBe(DEFAULT_SETTINGS.fontScale);
    expect(normalizeSettings({ fontScale: 'lg' })).toMatchObject({ fontScale: 'lg' });
  });

  it('migrates v1 settings into the current settings schema', () => {
    const storage = createMemoryStorage();
    writeVersioned(
      storage,
      createStorageKey('platform', 'settings', 1),
      { ...DEFAULT_SETTINGS, soundVolume: undefined, musicVolume: undefined, musicEnabled: true },
      1
    );

    const loaded = loadSettings(storage as Storage);

    expect(loaded.musicEnabled).toBe(true);
    expect(loaded.fontScale).toBe(DEFAULT_SETTINGS.fontScale);
    expect(loaded.soundVolume).toBe(DEFAULT_SETTINGS.soundVolume);
    expect(loaded.musicVolume).toBe(DEFAULT_SETTINGS.musicVolume);
    expect(storage.getItem(SETTINGS_KEY)).toContain(`"version":${SETTINGS_VERSION}`);
  });
});
