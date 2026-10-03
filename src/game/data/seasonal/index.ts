import type { ContentPack } from '../../../core/content-packs/content-packs';
import type { Language } from '../../../core/i18n/i18n';
import { createStorageKey, readVersioned, writeVersioned, type StorageAdapter } from '../../../core/storage/storage';
import { GAME_ID } from '../../modes';
import type { GuessTheFakePackContent, GuessTheFakeRound } from '../../types';
import type { BuiltinTexts } from '../builtin';
import { isSeasonalPackId, SEASONAL_PACKS, SEASONAL_REVIEW, SEASONAL_ROUNDS, type SeasonalPackEntry, type SeasonalPackId } from './catalog';

export { SEASONAL_PACKS, isSeasonalPackId, type SeasonalPackId } from './catalog';

const textLoaders: Record<Language, () => Promise<{ default: BuiltinTexts }>> = {
  pt: () => import('./texts/seasonal-pt'),
  en: () => import('./texts/seasonal-en'),
  es: () => import('./texts/seasonal-es'),
  fr: () => import('./texts/seasonal-fr'),
  de: () => import('./texts/seasonal-de'),
  it: () => import('./texts/seasonal-it')
};

const letters = ['a', 'b', 'c', 'd', 'e'];

export function createSeasonalPack(entry: SeasonalPackEntry, language: Language, texts: BuiltinTexts): ContentPack<GuessTheFakePackContent> {
  const rounds = SEASONAL_ROUNDS.filter(round => round.packId === entry.id).flatMap<GuessTheFakeRound>(round => {
    const roundText = texts[round.id];
    if (!roundText) return [];
    return [{
      id: round.id,
      categoryId: round.categoryId,
      difficulty: round.difficulty,
      statements: roundText.statements.map((statement, index) => ({ id: `${round.id}-${letters[index]}`, text: { [language]: statement } })),
      fakeStatementId: `${round.id}-${letters[round.fakeIndex]}`,
      explanation: { [language]: roundText.explanation },
      ageRating: 'all',
      review: SEASONAL_REVIEW
    }];
  });
  return {
    id: entry.id,
    gameId: GAME_ID,
    schemaVersion: 1,
    builtin: true,
    enabled: true,
    title: entry.title,
    languages: [language],
    meta: entry.meta,
    content: { categories: [{ id: entry.categoryId, title: entry.categoryTitle }], rounds }
  };
}

// Downloads the language chunk only when at least one pack is on.
export async function loadSeasonalPacks(language: Language, ids: SeasonalPackId[]) {
  const entries = SEASONAL_PACKS.filter(entry => ids.includes(entry.id));
  if (!entries.length) return [];
  const { default: texts } = await textLoaders[language]();
  return entries.map(entry => createSeasonalPack(entry, language, texts));
}

// Is the pack's season (same windows as the seasonal themes) on today?
export function isPackInSeason(entry: SeasonalPackEntry, seasonId: string | null | undefined) {
  return Boolean(entry.season && entry.season === seasonId);
}

export type SeasonalPacksModel = { enabledIds: SeasonalPackId[] };

export const SEASONAL_PACKS_VERSION = 1;
export const SEASONAL_PACKS_KEY = createStorageKey('game.guess-the-fake', 'seasonal-packs', SEASONAL_PACKS_VERSION);

export function loadSeasonalPackIds(storage: StorageAdapter = localStorage): SeasonalPackId[] {
  const model = readVersioned<SeasonalPacksModel>(storage, SEASONAL_PACKS_KEY, { enabledIds: [] }, SEASONAL_PACKS_VERSION);
  return Array.isArray(model?.enabledIds) ? model.enabledIds.filter(isSeasonalPackId) : [];
}

export function saveSeasonalPackIds(ids: SeasonalPackId[], storage: StorageAdapter = localStorage) {
  writeVersioned(storage, SEASONAL_PACKS_KEY, { enabledIds: [...new Set(ids)] }, SEASONAL_PACKS_VERSION);
}
