import { useEffect, useMemo, useState } from 'react';
import { LANGUAGE_LOCALES, translate } from '../../core/i18n/i18n';
import {
  DEFAULT_SETTINGS,
  FONT_SCALE_VALUES,
  loadSettings,
  saveSettings,
  type PlatformSettings
} from '../../core/settings/settings';
import { applyTheme } from '../../core/themes/themes';
import type { Translate } from '../app-types';
import { translations } from '../translations';

export function useSettings() {
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

  return { settings, setSettings, updateSettings, t };
}
