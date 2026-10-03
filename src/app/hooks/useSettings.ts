import { useEffect, useMemo, useState } from 'react';
import { LANGUAGE_LOCALES, translate } from '../../core/i18n/i18n';
import {
  DEFAULT_SETTINGS,
  FONT_SCALE_VALUES,
  loadSettings,
  saveSettings,
  type PlatformSettings
} from '../../core/settings/settings';
import { getSeasonalSuggestion, shouldOfferSeasonalTheme } from '../../core/themes/seasonal';
import { applyTheme } from '../../core/themes/themes';
import type { Translate } from '../app-types';
import { translations } from '../translations';

export type SettingsController = ReturnType<typeof useSettings>;

export function useSettings(today: Date = new Date()) {
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
    return loadSettings();
  });

  const t = useMemo<Translate>(
    () => (key, params = {}) => translate(translations, settings.language, key, params),
    [settings.language]
  );

  useEffect(() => {
    applyTheme(settings.theme);
    document.documentElement.style.setProperty('--font-scale', String(FONT_SCALE_VALUES[settings.fontScale]));
    document.documentElement.lang = LANGUAGE_LOCALES[settings.language];
    document.title = t('game.title');
    saveSettings(settings);
  }, [settings, t]);

  function updateSettings(next: Partial<PlatformSettings>) {
    setSettings(current => ({ ...current, ...next }));
  }

  // W16-05: read the local date once per session; a season does not change
  // under an open tab often enough to justify a timer.
  const [season] = useState(() => getSeasonalSuggestion(today));
  const seasonalSuggestion = shouldOfferSeasonalTheme(season, settings.theme, settings.seasonalDismissed) ? season : null;

  function applySeasonalTheme() {
    if (season) updateSettings({ theme: season.season.themeId, seasonalDismissed: season.key });
  }

  function dismissSeasonalSuggestion() {
    if (season) updateSettings({ seasonalDismissed: season.key });
  }

  return { settings, setSettings, updateSettings, t, seasonalSuggestion, applySeasonalTheme, dismissSeasonalSuggestion };
}
