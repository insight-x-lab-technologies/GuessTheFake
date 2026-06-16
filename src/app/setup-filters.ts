import type { GuessTheFakeDifficulty, GuessTheFakeRound } from '../games/guess-the-fake/types';

export type SetupFilters = {
  categoryId: string;
  difficulty: GuessTheFakeDifficulty | 'all';
};

export function getAvailableDifficultiesForCategory(
  rounds: GuessTheFakeRound[],
  categoryId: string
): Array<GuessTheFakeDifficulty> {
  const difficulties = new Set<GuessTheFakeDifficulty>();
  rounds
    .filter(round => categoryId === 'all' || round.categoryId === categoryId)
    .forEach(round => difficulties.add(round.difficulty));
  return [...difficulties];
}

export function normalizeSetupFilters(
  filters: SetupFilters,
  options: {
    categoryIds: string[];
    rounds: GuessTheFakeRound[];
  }
): SetupFilters {
  const categoryId = filters.categoryId === 'all' || options.categoryIds.includes(filters.categoryId)
    ? filters.categoryId
    : 'all';
  const difficulties = getAvailableDifficultiesForCategory(options.rounds, categoryId);
  const difficulty = filters.difficulty === 'all' || difficulties.includes(filters.difficulty)
    ? filters.difficulty
    : 'all';

  return { categoryId, difficulty };
}
