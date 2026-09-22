import type { ContentPack } from '../../../core/content-packs/content-packs';
import type { Language } from '../../../core/i18n/i18n';
import { GAME_ID } from '../../modes';
import type { GuessTheFakePackContent, GuessTheFakeRound } from '../../types';
import { BUILTIN_CATEGORIES, BUILTIN_PACK_ID, BUILTIN_PACK_TITLE, BUILTIN_ROUNDS } from './catalog';

export { BUILTIN_PACK_ID } from './catalog';

export type BuiltinRoundText = {
  statements: [string, string, string, string, string];
  explanation: string;
};

export type BuiltinTexts = Record<string, BuiltinRoundText>;

const textLoaders: Record<Language, () => Promise<{ default: BuiltinTexts }>> = {
  pt: () => import('./texts/pt'),
  en: () => import('./texts/en'),
  es: () => import('./texts/es'),
  fr: () => import('./texts/fr'),
  de: () => import('./texts/de'),
  it: () => import('./texts/it')
};

const letters = ['a', 'b', 'c', 'd', 'e'];

// Joins the neutral catalog with one language's texts. Rounds without text in
// that language are left out, so a partial translation degrades to fewer rounds.
export function createBuiltinPack(language: Language, texts: BuiltinTexts): ContentPack<GuessTheFakePackContent> {
  const rounds = BUILTIN_ROUNDS.flatMap<GuessTheFakeRound>(entry => {
    const roundText = texts[entry.id];
    if (!roundText) return [];
    return [{
      id: entry.id,
      categoryId: entry.categoryId,
      difficulty: entry.difficulty,
      statements: roundText.statements.map((statement, index) => ({
        id: `${entry.id}-${letters[index]}`,
        text: { [language]: statement }
      })),
      fakeStatementId: `${entry.id}-${letters[entry.fakeIndex]}`,
      explanation: { [language]: roundText.explanation },
      ageRating: entry.ageRating,
      sources: entry.sources,
      review: entry.review
    }];
  });

  return {
    id: BUILTIN_PACK_ID,
    gameId: GAME_ID,
    schemaVersion: 1,
    builtin: true,
    enabled: true,
    title: BUILTIN_PACK_TITLE,
    languages: [language],
    content: { categories: BUILTIN_CATEGORIES, rounds }
  };
}

export async function loadBuiltinPack(language: Language) {
  const { default: texts } = await textLoaders[language]();
  return createBuiltinPack(language, texts);
}
