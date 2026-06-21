import { DEFAULT_LANGUAGE, detectClientLanguage, normalizeLanguage, type Language } from '../i18n/i18n';
import { createStorageKey, readVersionedWithMigrations, writeVersioned } from '../storage/storage';
import { DEFAULT_THEME, normalizeTheme, type ThemeId } from '../themes/themes';

export type PlatformSettings = {
  language: Language;
  theme: ThemeId;
  fontScale: FontScale;
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  roundTimeSeconds: number;
  preparationTimeSeconds: number;
  correctGuessPoints: number;
  wrongGuessPenalty: number;
  speedBonusPoints: number;
  autoStartRounds: boolean;
  shuffleRounds: boolean;
};

export type FontScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const FONT_SCALE_VALUES: Record<FontScale, number> = {
  xs: 0.9,
  sm: 0.96,
  md: 1,
  lg: 1.08,
  xl: 1.16
};

export const FONT_SCALE_OPTIONS = Object.keys(FONT_SCALE_VALUES) as FontScale[];

export const DEFAULT_SETTINGS: PlatformSettings = {
  language: DEFAULT_LANGUAGE,
  theme: DEFAULT_THEME,
  fontScale: 'md',
  soundEnabled: true,
  musicEnabled: false,
  soundVolume: 0.65,
  musicVolume: 0.35,
  roundTimeSeconds: 60,
  preparationTimeSeconds: 3,
  correctGuessPoints: 10,
  wrongGuessPenalty: 0,
  speedBonusPoints: 5,
  autoStartRounds: false,
  shuffleRounds: true
};

export function createDefaultSettings(language: Language = DEFAULT_LANGUAGE): PlatformSettings {
  return {
    ...DEFAULT_SETTINGS,
    language
  };
}

export const SETTINGS_VERSION = 3;
export const SETTINGS_KEY = createStorageKey('platform', 'settings', SETTINGS_VERSION);
const PREVIOUS_SETTINGS_KEY = createStorageKey('platform', 'settings', 1);
const PREVIOUS_AUDIO_SETTINGS_KEY = createStorageKey('platform', 'settings', 2);

export function loadSettings(storage: Storage = localStorage): PlatformSettings {
  const defaultSettings = createDefaultSettings(detectClientLanguage());
  const settings = readVersionedWithMigrations(storage, SETTINGS_KEY, defaultSettings, SETTINGS_VERSION, [
    {
      fromVersion: 1,
      key: PREVIOUS_SETTINGS_KEY,
      migrate: value => normalizeSettings(value, defaultSettings)
    },
    {
      fromVersion: 2,
      key: PREVIOUS_AUDIO_SETTINGS_KEY,
      migrate: value => normalizeSettings(value, defaultSettings)
    }
  ]);
  return normalizeSettings(settings, defaultSettings);
}

export function saveSettings(settings: PlatformSettings, storage: Storage = localStorage) {
  writeVersioned(storage, SETTINGS_KEY, normalizeSettings(settings), SETTINGS_VERSION);
}

export function normalizeSettings(value: unknown, fallback: PlatformSettings = DEFAULT_SETTINGS): PlatformSettings {
  const candidate = value && typeof value === 'object' ? value as Partial<PlatformSettings> : {};
  return {
    ...fallback,
    ...candidate,
    language: candidate.language === undefined ? fallback.language : normalizeLanguage(candidate.language, DEFAULT_LANGUAGE),
    theme: normalizeTheme(candidate.theme),
    fontScale: normalizeFontScale(candidate.fontScale),
    soundVolume: normalizeVolume(candidate.soundVolume, fallback.soundVolume),
    musicVolume: normalizeVolume(candidate.musicVolume, fallback.musicVolume)
  };
}

export function normalizeFontScale(value: unknown): FontScale {
  return FONT_SCALE_OPTIONS.includes(value as FontScale) ? value as FontScale : DEFAULT_SETTINGS.fontScale;
}

function normalizeVolume(value: unknown, fallback: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(1, Math.max(0, value));
}
