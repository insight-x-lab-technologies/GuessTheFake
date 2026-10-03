import { describe, expect, it } from 'vitest';
import {
  estimateRoundSeconds,
  suggestCategory,
  suggestDifficulty,
  suggestMatchSetup,
  suggestModeForPlayers,
  suggestSoloChallenge,
  type MatchSuggestionInput
} from './match-suggestion';
import type { GuessTheFakeDifficulty } from './types';

const categories = ['history', 'science', 'animals'];
const difficulties: GuessTheFakeDifficulty[] = ['easy', 'medium', 'hard'];
const availableRounds = categories.flatMap(categoryId =>
  difficulties.flatMap(difficulty => Array.from({ length: 5 }, () => ({ categoryId, difficulty })))
);
const emptyHistory = { guessesByDifficulty: {}, correctByDifficulty: {}, categoriesPlayed: {} };

function input(overrides: Partial<MatchSuggestionInput> = {}): MatchSuggestionInput {
  return {
    playerCount: 3,
    minutesAvailable: 15,
    roundTimeSeconds: 60,
    availableRounds,
    history: emptyHistory,
    ...overrides
  };
}

describe('match suggestion', () => {
  it('picks the mode from the number of players', () => {
    expect([1, 2, 3, 4, 8].map(suggestModeForPlayers)).toEqual(['solo', 'all-guess', 'all-guess', 'teams', 'teams']);
  });

  it('starts a new table on easy and moves with its accuracy', () => {
    expect(suggestDifficulty(emptyHistory).difficulty).toBe('easy');
    const strong = { ...emptyHistory, guessesByDifficulty: { easy: 10 }, correctByDifficulty: { easy: 9 } };
    expect(suggestDifficulty(strong)).toEqual({ difficulty: 'medium', reason: { key: 'suggest.reason.harder', params: { percent: 90 } } });
    const weak = { ...emptyHistory, guessesByDifficulty: { easy: 10, medium: 10 }, correctByDifficulty: { easy: 9, medium: 2 } };
    expect(suggestDifficulty(weak).difficulty).toBe('easy');
    const fine = { ...emptyHistory, guessesByDifficulty: { hard: 10 }, correctByDifficulty: { hard: 9 } };
    expect(suggestDifficulty(fine).difficulty).toBe('hard');
  });

  it('avoids repeated and weak categories', () => {
    expect(suggestCategory(categories, {})).toEqual({ categoryId: 'all', reason: null });
    expect(suggestCategory(categories, { history: 4, science: 1, animals: 0 }).categoryId).toBe('animals');
    const skipping = suggestCategory(categories, { history: 4, science: 1, animals: 0 }, ['animals']);
    expect(skipping).toEqual({ categoryId: 'science', reason: { key: 'suggest.reason.freshSkippingWeak', params: { category: 'science' } } });
    expect(suggestCategory(['animals'], { animals: 2 }, ['animals']).categoryId).toBe('animals');
  });

  it('fits the round count to the time available', () => {
    expect(estimateRoundSeconds('all-guess', 3, 60)).toBe(81);
    expect(suggestMatchSetup(input({ minutesAvailable: 15 })).roundCount).toBe(11);
    expect(suggestMatchSetup(input({ minutesAvailable: 5 })).roundCount).toBe(3);
    expect(suggestMatchSetup(input({ minutesAvailable: 120 })).roundCount).toBe(15);
  });

  it('widens the filters when the suggested cell has too few rounds', () => {
    const sparse = [{ categoryId: 'history', difficulty: 'hard' as const }, ...availableRounds.filter(round => round.categoryId !== 'history')];
    const suggestion = suggestMatchSetup(input({
      availableRounds: sparse,
      history: { ...emptyHistory, categoriesPlayed: { science: 3, animals: 3 } }
    }));
    expect(suggestion.categoryId).toBe('all');
    expect(suggestion.difficulty).toBe('easy');
  });

  it('suggests a solo challenge close to the record', () => {
    const record = (difficulty: GuessTheFakeDifficulty | 'all', correct: number, achievedAt: string) => ({
      challenge: { totalRounds: 5, categoryId: 'science', difficulty },
      result: { points: correct * 10, correct, totalRounds: 5, bestStreak: correct, achievedAt }
    });
    expect(suggestSoloChallenge([]).reason.key).toBe('suggest.reason.soloFirst');
    const open = suggestSoloChallenge([record('easy', 5, '2026-10-02'), record('medium', 3, '2026-10-01')]);
    expect(open).toMatchObject({ challenge: { difficulty: 'medium' }, recordToBeat: 30 });
    const harder = suggestSoloChallenge([record('easy', 5, '2026-10-02')]);
    expect(harder).toMatchObject({ challenge: { difficulty: 'medium' }, recordToBeat: null, reason: { key: 'suggest.reason.soloHarder' } });

    const suggestion = suggestMatchSetup(input({ playerCount: 1, soloRecords: [record('medium', 3, '2026-10-01')] }));
    expect(suggestion).toMatchObject({ modeId: 'solo', roundCount: 5, difficulty: 'medium', categoryId: 'science', recordToBeat: 30 });
  });
});
