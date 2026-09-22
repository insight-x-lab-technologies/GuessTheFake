import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES, type TranslationTree } from '../core/i18n/i18n';
import { translations } from './translations';

function keys(tree: TranslationTree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'object' ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`]
  );
}

describe('UI translations', () => {
  it('gives every published language its own tree with every English key', () => {
    const englishKeys = keys(translations.en).sort();

    SUPPORTED_LANGUAGES.filter(language => language !== 'en').forEach(language => {
      expect(translations[language]).not.toBe(translations.en);
      expect(keys(translations[language]).sort()).toEqual(englishKeys);
    });
  });
});
