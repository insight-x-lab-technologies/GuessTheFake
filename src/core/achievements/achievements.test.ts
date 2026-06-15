import { describe, expect, it } from 'vitest';
import {
  createDefaultAchievementState,
  evaluateAchievements,
  evaluateAchievementsWithUnlocks,
  getAchievementSummary,
  normalizeAchievementState
} from './achievements';

describe('achievement helpers', () => {
  it('normalizes old counter shapes and unlocks new goals', () => {
    const state = normalizeAchievementState({
      counters: {
        matchesFinished: 0,
        roundsPlayed: 0,
        correctGuesses: 0
      } as never,
      unlocked: {}
    });

    expect(state.counters.longestStreak).toBe(0);
    const evaluated = evaluateAchievements(
      {
        ...createDefaultAchievementState(),
        counters: { ...state.counters, longestStreak: 3 }
      },
      [
        {
          id: 'streak',
          titleKey: 'title',
          descriptionKey: 'description',
          target: 3,
          getProgress: counters => counters.longestStreak
        }
      ],
      '2026-06-13T00:00:00.000Z'
    );

    expect(evaluated.unlocked.streak).toBe('2026-06-13T00:00:00.000Z');
  });

  it('reports newly unlocked achievements and summary progress', () => {
    const definitions = [
      {
        id: 'rounds',
        titleKey: 'title',
        descriptionKey: 'description',
        target: 2,
        getProgress: (counters: ReturnType<typeof createDefaultAchievementState>['counters']) => counters.roundsPlayed
      },
      {
        id: 'matches',
        titleKey: 'title',
        descriptionKey: 'description',
        target: 4,
        getProgress: (counters: ReturnType<typeof createDefaultAchievementState>['counters']) => counters.matchesFinished
      }
    ];
    const state = {
      ...createDefaultAchievementState(),
      counters: { ...createDefaultAchievementState().counters, roundsPlayed: 2, matchesFinished: 1 }
    };

    const evaluated = evaluateAchievementsWithUnlocks(state, definitions, '2026-06-14T00:00:00.000Z');

    expect(evaluated.newlyUnlocked.map(definition => definition.id)).toEqual(['rounds']);
    expect(getAchievementSummary(evaluated.state, definitions)).toMatchObject({
      unlockedCount: 1,
      totalCount: 2,
      completionPercent: 63
    });
  });
});
