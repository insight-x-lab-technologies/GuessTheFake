import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LANGUAGE,
  detectClientLanguage,
  normalizeLanguage,
  translate,
  type TranslationTree
} from './i18n';

describe('platform i18n', () => {
  it('normalizes supported locale tags to published languages', () => {
    expect(normalizeLanguage('pt-BR')).toBe('pt');
    expect(normalizeLanguage('es-MX')).toBe('es');
    expect(normalizeLanguage('de_DE')).toBe('de');
    expect(normalizeLanguage('nl-NL')).toBe(DEFAULT_LANGUAGE);
  });

  it('detects the first supported client language and falls back to English', () => {
    expect(detectClientLanguage({ languages: ['nl-NL', 'fr-FR'], language: 'de-DE' })).toBe('fr');
    expect(detectClientLanguage({ languages: ['ja-JP'], language: 'nl-NL' })).toBe('en');
  });

  it('uses English as the default translation fallback', () => {
    const dictionaries = {
      pt: {},
      en: { action: { start: 'Start' } },
      es: {},
      fr: {},
      de: {},
      it: {}
    } satisfies Record<string, TranslationTree>;

    expect(translate(dictionaries, 'fr', 'action.start')).toBe('Start');
  });
});
