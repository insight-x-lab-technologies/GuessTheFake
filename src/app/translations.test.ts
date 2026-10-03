import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
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

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe('translation keys used in code', () => {
  it('resolves every literal t() key in English', () => {
    const englishKeys = new Set(keys(translations.en));
    const missing = sourceFiles(join(process.cwd(), 'src/app')).flatMap(file => {
      const source = readFileSync(file, 'utf8');
      return [...source.matchAll(/\bt\('([a-zA-Z0-9_.-]+)'/g)]
        .map(match => match[1])
        .filter(key => !englishKeys.has(key))
        .map(key => `${file}: ${key}`);
    });

    expect(missing).toEqual([]);
  });
});
