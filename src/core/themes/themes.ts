export type ThemeId = 'cosmic' | 'liquid-glass' | 'material3' | 'light-mode' | 'dark-mode' | 'high-contrast';

export type ThemeDefinition = {
  id: ThemeId;
  labelKey: string;
};

export const THEMES: ThemeDefinition[] = [
  { id: 'cosmic', labelKey: 'settings.themeCosmic' },
  { id: 'liquid-glass', labelKey: 'settings.themeLiquidGlass' },
  { id: 'material3', labelKey: 'settings.themeMaterial3' },
  { id: 'light-mode', labelKey: 'settings.themeLightMode' },
  { id: 'dark-mode', labelKey: 'settings.themeDarkMode' },
  { id: 'high-contrast', labelKey: 'settings.themeHighContrast' }
];

export const DEFAULT_THEME: ThemeId = 'cosmic';

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && THEMES.some(theme => theme.id === value);
}

export function normalizeTheme(value: unknown): ThemeId {
  if (isThemeId(value)) return value;
  if (value === 'contrast') return 'high-contrast';
  return DEFAULT_THEME;
}

export function applyTheme(theme: ThemeId, root: HTMLElement = document.documentElement) {
  root.dataset.theme = normalizeTheme(theme);
}
