export type Language = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it';

export type TranslationValue = string | ((params: Record<string, string | number>) => string);
export type TranslationTree = {
  [key: string]: TranslationValue | TranslationTree;
};

export const SUPPORTED_LANGUAGES: Language[] = ['pt', 'en', 'es', 'fr', 'de', 'it'];
export const DEFAULT_LANGUAGE: Language = 'pt';

export function getNestedTranslation(tree: TranslationTree | undefined, path: string): TranslationValue | undefined {
  return path.split('.').reduce<TranslationTree | TranslationValue | undefined>((current, part) => {
    if (!current || typeof current !== 'object') return undefined;
    return current[part] as TranslationTree | TranslationValue | undefined;
  }, tree) as TranslationValue | undefined;
}

export function translate(
  dictionaries: Record<Language, TranslationTree>,
  language: Language,
  key: string,
  params: Record<string, string | number> = {}
) {
  const value =
    getNestedTranslation(dictionaries[language], key) ??
    getNestedTranslation(dictionaries[DEFAULT_LANGUAGE], key) ??
    key;

  if (typeof value === 'function') return value(params);
  return String(value).replace(/\{(\w+)\}/g, (_, token) => String(params[token] ?? `{${token}}`));
}
