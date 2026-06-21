export type Language = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it';

export type TranslationValue = string | ((params: Record<string, string | number>) => string);
export type TranslationTree = {
  [key: string]: TranslationValue | TranslationTree;
};

export const SUPPORTED_LANGUAGES: Language[] = ['pt', 'en', 'es', 'fr', 'de', 'it'];
export const DEFAULT_LANGUAGE: Language = 'en';
export const LANGUAGE_LOCALES: Record<Language, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it'
};

export type ClientLanguageSource = {
  language?: string;
  languages?: readonly string[];
};

export function normalizeLanguage(value: unknown, fallback: Language = DEFAULT_LANGUAGE): Language {
  if (typeof value !== 'string') return fallback;
  const normalized = value.toLowerCase().trim();
  const exactMatch = SUPPORTED_LANGUAGES.find(language => language === normalized);
  if (exactMatch) return exactMatch;

  const baseLanguage = normalized.split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.find(language => language === baseLanguage) ?? fallback;
}

export function detectClientLanguage(source: ClientLanguageSource = getNavigatorLanguageSource()): Language {
  const candidates = [...(source.languages ?? []), source.language].filter(Boolean);
  for (const candidate of candidates) {
    const language = normalizeLanguage(candidate, DEFAULT_LANGUAGE);
    if (language !== DEFAULT_LANGUAGE || candidate?.toLowerCase().startsWith(DEFAULT_LANGUAGE)) return language;
  }
  return DEFAULT_LANGUAGE;
}

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

function getNavigatorLanguageSource(): ClientLanguageSource {
  return typeof navigator === 'undefined' ? {} : navigator;
}
