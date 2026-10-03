import type { SoloChallenge, SoloResult } from './solo-records';
import type { GuessTheFakeDifficulty, GuessTheFakeModeId } from './types';

// W13-05: a suggested match setup. Pure: the setup screen decides whether to
// apply it, and the user can change everything afterwards.

export type MatchSuggestionInput = {
  playerCount: number;
  minutesAvailable: number;
  roundTimeSeconds: number;
  // Every playable round (after "do not repeat"), used to keep the
  // suggestion within the content that actually exists.
  availableRounds: Array<{ categoryId: string; difficulty: GuessTheFakeDifficulty }>;
  history: {
    guessesByDifficulty: Record<string, number>;
    correctByDifficulty: Record<string, number>;
    categoriesPlayed: Record<string, number>;
  };
  // Categories the table rated "weak" more often than "good".
  weakCategoryIds?: string[];
  // Solo only: this player's records.
  soloRecords?: Array<{ challenge: SoloChallenge; result: SoloResult }>;
};

export type SuggestionReason = { key: string; params?: Record<string, string | number> };

export type MatchSuggestion = {
  modeId: GuessTheFakeModeId;
  roundCount: number;
  difficulty: GuessTheFakeDifficulty | 'all';
  categoryId: string;
  recordToBeat: number | null;
  reasons: SuggestionReason[];
};

export const SUGGESTION_MIN_ROUNDS = 3;
export const SUGGESTION_MAX_ROUNDS = 15;
export const DIFFICULTY_SAMPLE_SIZE = 5;
const DIFFICULTIES: GuessTheFakeDifficulty[] = ['easy', 'medium', 'hard'];
const ROUND_OVERHEAD_SECONDS = 25;
const ALL_GUESS_SECONDS_PER_PLAYER = 10;

export function suggestModeForPlayers(playerCount: number): GuessTheFakeModeId {
  if (playerCount <= 1) return 'solo';
  if (playerCount <= 3) return 'all-guess';
  return 'teams';
}

export function estimateRoundSeconds(modeId: GuessTheFakeModeId, playerCount: number, roundTimeSeconds: number) {
  const thinking = Math.max(10, roundTimeSeconds) * 0.6;
  const extra = modeId === 'all-guess' ? Math.max(0, playerCount - 1) * ALL_GUESS_SECONDS_PER_PLAYER : 0;
  return Math.round(thinking + extra + ROUND_OVERHEAD_SECONDS);
}

export function suggestDifficulty(history: MatchSuggestionInput['history']): { difficulty: GuessTheFakeDifficulty; reason: SuggestionReason } {
  const sampled = DIFFICULTIES.filter(level => (history.guessesByDifficulty[level] ?? 0) >= DIFFICULTY_SAMPLE_SIZE);
  if (!sampled.length) return { difficulty: 'easy', reason: { key: 'suggest.reason.newTable' } };
  const current = sampled[sampled.length - 1];
  const accuracy = (history.correctByDifficulty[current] ?? 0) / (history.guessesByDifficulty[current] ?? 1);
  const percent = Math.round(accuracy * 100);
  const index = DIFFICULTIES.indexOf(current);
  if (accuracy >= 0.75 && index < DIFFICULTIES.length - 1) {
    return { difficulty: DIFFICULTIES[index + 1], reason: { key: 'suggest.reason.harder', params: { percent } } };
  }
  if (accuracy < 0.4 && index > 0) {
    return { difficulty: DIFFICULTIES[index - 1], reason: { key: 'suggest.reason.easier', params: { percent } } };
  }
  return { difficulty: current, reason: { key: 'suggest.reason.keep', params: { percent } } };
}

export function suggestCategory(
  availableCategoryIds: string[],
  categoriesPlayed: Record<string, number>,
  weakCategoryIds: string[] = []
): { categoryId: string; reason: SuggestionReason | null } {
  const played = Object.values(categoriesPlayed).reduce((total, count) => total + count, 0);
  if (!played || !availableCategoryIds.length) return { categoryId: 'all', reason: null };
  const strong = availableCategoryIds.filter(id => !weakCategoryIds.includes(id));
  const pool = strong.length ? strong : availableCategoryIds;
  const [freshest] = [...pool].sort((a, b) => (categoriesPlayed[a] ?? 0) - (categoriesPlayed[b] ?? 0) || a.localeCompare(b));
  return {
    categoryId: freshest,
    reason: {
      key: weakCategoryIds.length && strong.length < availableCategoryIds.length ? 'suggest.reason.freshSkippingWeak' : 'suggest.reason.fresh',
      params: { category: freshest }
    }
  };
}

export function suggestMatchSetup(input: MatchSuggestionInput): MatchSuggestion {
  const playerCount = Math.max(1, Math.floor(input.playerCount) || 1);
  const modeId = suggestModeForPlayers(playerCount);
  const reasons: SuggestionReason[] = [{
    key: modeId === 'solo' ? 'suggest.reason.modeSolo' : modeId === 'all-guess' ? 'suggest.reason.modeSmall' : 'suggest.reason.modeBig',
    params: { players: playerCount }
  }];

  const solo = modeId === 'solo' ? suggestSoloChallenge(input.soloRecords ?? []) : null;
  let difficulty: GuessTheFakeDifficulty | 'all';
  let categoryId: string;
  if (solo) {
    difficulty = solo.challenge.difficulty;
    categoryId = solo.challenge.categoryId;
    reasons.push(solo.reason);
  } else {
    const level = suggestDifficulty(input.history);
    const categoryIds = [...new Set(input.availableRounds.map(round => round.categoryId))];
    const category = suggestCategory(categoryIds, input.history.categoriesPlayed, input.weakCategoryIds);
    difficulty = level.difficulty;
    categoryId = category.categoryId;
    reasons.push(level.reason);
    if (category.reason) reasons.push(category.reason);
  }

  // Never suggest a combination without enough content: widen the filters.
  const countFor = (category: string, level: GuessTheFakeDifficulty | 'all') => input.availableRounds.filter(round =>
    (category === 'all' || round.categoryId === category) && (level === 'all' || round.difficulty === level)
  ).length;
  if (countFor(categoryId, difficulty) < SUGGESTION_MIN_ROUNDS) {
    if (countFor(categoryId, 'all') >= SUGGESTION_MIN_ROUNDS) difficulty = 'all';
    else {
      categoryId = 'all';
      if (countFor('all', difficulty) < SUGGESTION_MIN_ROUNDS) difficulty = 'all';
    }
  }

  const minutes = Math.max(1, input.minutesAvailable || 1);
  const byTime = Math.floor((minutes * 60) / estimateRoundSeconds(modeId, playerCount, input.roundTimeSeconds));
  const available = Math.max(1, countFor(categoryId, difficulty));
  const roundCount = solo
    ? Math.min(available, solo.challenge.totalRounds)
    : Math.min(available, Math.max(SUGGESTION_MIN_ROUNDS, Math.min(SUGGESTION_MAX_ROUNDS, byTime)));
  if (!solo) reasons.push({ key: 'suggest.reason.time', params: { minutes, rounds: roundCount } });

  return { modeId, roundCount, difficulty, categoryId, recordToBeat: solo?.recordToBeat ?? null, reasons };
}

// Solo: replay the latest challenge whose record is not perfect; when every
// record is perfect, raise the difficulty of the latest one.
export function suggestSoloChallenge(records: Array<{ challenge: SoloChallenge; result: SoloResult }>) {
  const byDate = [...records]
    .filter(record => !record.challenge.specialRounds && !(record.challenge.packIds ?? []).length)
    .sort((a, b) => b.result.achievedAt.localeCompare(a.result.achievedAt));
  const open = byDate.find(record => record.result.correct < record.result.totalRounds);
  if (open) {
    return {
      challenge: open.challenge,
      recordToBeat: open.result.points as number | null,
      reason: { key: 'suggest.reason.soloBeat', params: { points: open.result.points } } as SuggestionReason
    };
  }
  const latest = byDate[0];
  if (latest) {
    const index = DIFFICULTIES.indexOf(latest.challenge.difficulty as GuessTheFakeDifficulty);
    const harder: GuessTheFakeDifficulty = latest.challenge.difficulty === 'all'
      ? 'hard'
      : DIFFICULTIES[Math.min(DIFFICULTIES.length - 1, index + 1)];
    return {
      challenge: { ...latest.challenge, difficulty: harder },
      recordToBeat: null,
      reason: { key: 'suggest.reason.soloHarder' } as SuggestionReason
    };
  }
  return {
    challenge: { totalRounds: 5, categoryId: 'all', difficulty: 'easy' as const },
    recordToBeat: null,
    reason: { key: 'suggest.reason.soloFirst' } as SuggestionReason
  };
}
