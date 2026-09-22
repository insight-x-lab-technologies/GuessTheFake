import { describe, expect, it } from 'vitest';
import {
  createDefaultAchievementState,
  evaluateAchievements,
  evaluateAchievementsWithUnlocks,
  getAchievementProgressView,
  getAchievementSummary,
  normalizeAchievementState,
  updateModeCounters
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

describe('achievement progress by mode', () => {
  const definitions = [
    {
      id: 'rounds',
      titleKey: 'title',
      descriptionKey: 'description',
      target: 3,
      getProgress: (counters: ReturnType<typeof createDefaultAchievementState>['counters']) => counters.roundsPlayed
    }
  ];

  it('defaults missing or invalid mode counters to an empty record', () => {
    expect(normalizeAchievementState({}).modeCounters).toEqual({});
    expect(normalizeAchievementState({ modeCounters: 'broken' as never }).modeCounters).toEqual({});
    const normalized = normalizeAchievementState({
      modeCounters: { classic: { roundsPlayed: 2 } as never }
    });
    expect(normalized.modeCounters.classic.roundsPlayed).toBe(2);
    expect(normalized.modeCounters.classic.categoriesPlayed).toEqual({});
  });

  it('updates only the counters of the given mode', () => {
    const state = updateModeCounters(createDefaultAchievementState(), 'teams', counters => ({
      ...counters,
      roundsPlayed: counters.roundsPlayed + 1
    }));

    expect(state.modeCounters.teams.roundsPlayed).toBe(1);
    expect(state.modeCounters.classic).toBeUndefined();
    expect(state.counters.roundsPlayed).toBe(0);
  });

  it('builds the global view from stored unlocks', () => {
    const state = {
      ...createDefaultAchievementState(),
      unlocked: { rounds: '2026-06-14T00:00:00.000Z' }
    };

    const view = getAchievementProgressView(state, definitions, 'all');

    expect(view.hasData).toBe(true);
    expect(view.items[0]).toMatchObject({ progress: 0, unlocked: true });
  });

  it('derives mode progress and unlocks from mode counters', () => {
    let state = createDefaultAchievementState();
    state = updateModeCounters(state, 'classic', counters => ({ ...counters, roundsPlayed: 3 }));
    state = updateModeCounters(state, 'all-guess', counters => ({ ...counters, roundsPlayed: 1 }));

    const classic = getAchievementProgressView(state, definitions, 'classic');
    const allGuess = getAchievementProgressView(state, definitions, 'all-guess');

    expect(classic.items[0]).toMatchObject({ progress: 3, unlocked: true });
    expect(classic.summary).toMatchObject({ unlockedCount: 1, completionPercent: 100, nextLocked: null });
    expect(allGuess.items[0]).toMatchObject({ progress: 1, unlocked: false });
    expect(allGuess.summary.nextLocked?.id).toBe('rounds');
  });

  it('reports an empty mode when no match or round was played in it', () => {
    const view = getAchievementProgressView(createDefaultAchievementState(), definitions, 'teams');

    expect(view.hasData).toBe(false);
    expect(view.counters.roundsPlayed).toBe(0);
    expect(view.items[0]).toMatchObject({ progress: 0, unlocked: false });
  });
});
