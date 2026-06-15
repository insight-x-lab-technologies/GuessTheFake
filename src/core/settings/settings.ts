import { DEFAULT_LANGUAGE, type Language } from '../i18n/i18n';
import { createStorageKey, readVersioned, writeVersioned } from '../storage/storage';
import { DEFAULT_THEME, normalizeTheme, type ThemeId } from '../themes/themes';

export type PlatformSettings = {
  language: Language;
  theme: ThemeId;
  soundEnabled: boolean;
  musicEnabled: boolean;
  roundTimeSeconds: number;
  preparationTimeSeconds: number;
  correctGuessPoints: number;
  wrongGuessPenalty: number;
  speedBonusPoints: number;
  autoStartRounds: boolean;
  shuffleRounds: boolean;
};

export const DEFAULT_SETTINGS: PlatformSettings = {
  language: DEFAULT_LANGUAGE,
  theme: DEFAULT_THEME,
  soundEnabled: true,
  musicEnabled: false,
  roundTimeSeconds: 60,
  preparationTimeSeconds: 3,
  correctGuessPoints: 10,
  wrongGuessPenalty: 0,
  speedBonusPoints: 5,
  autoStartRounds: false,
  shuffleRounds: true
};

export const SETTINGS_VERSION = 1;
export const SETTINGS_KEY = createStorageKey('platform', 'settings', SETTINGS_VERSION);

export function loadSettings(storage: Storage = localStorage): PlatformSettings {
  const settings = readVersioned(storage, SETTINGS_KEY, DEFAULT_SETTINGS, SETTINGS_VERSION);
  return { ...DEFAULT_SETTINGS, ...settings, theme: normalizeTheme(settings.theme) };
}

export function saveSettings(settings: PlatformSettings, storage: Storage = localStorage) {
  writeVersioned(storage, SETTINGS_KEY, settings, SETTINGS_VERSION);
}
