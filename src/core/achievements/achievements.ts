import { createStorageKey, readVersioned, writeVersioned } from '../storage/storage';

export type AchievementDefinition = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  target: number;
  getProgress: (counters: AchievementCounters) => number;
};

export type AchievementCounters = {
  matchesFinished: number;
  roundsPlayed: number;
  correctGuesses: number;
  longestStreak: number;
  perfectMatches: number;
  categoriesPlayed: Record<string, number>;
  packsUsed: Record<string, number>;
  contentFeedbackCount: number;
};

export type AchievementState = {
  counters: AchievementCounters;
  unlocked: Record<string, string>;
};

export const ACHIEVEMENTS_VERSION = 1;
export const ACHIEVEMENTS_KEY = createStorageKey('platform', 'achievements', ACHIEVEMENTS_VERSION);

export function createDefaultAchievementState(): AchievementState {
  return {
    counters: {
      matchesFinished: 0,
      roundsPlayed: 0,
      correctGuesses: 0,
      longestStreak: 0,
      perfectMatches: 0,
      categoriesPlayed: {},
      packsUsed: {},
      contentFeedbackCount: 0
    },
    unlocked: {}
  };
}

export function loadAchievements(storage: Storage = localStorage) {
  return normalizeAchievementState(readVersioned(storage, ACHIEVEMENTS_KEY, createDefaultAchievementState(), ACHIEVEMENTS_VERSION));
}

export function saveAchievements(state: AchievementState, storage: Storage = localStorage) {
  writeVersioned(storage, ACHIEVEMENTS_KEY, state, ACHIEVEMENTS_VERSION);
}

export function evaluateAchievements(
  state: AchievementState,
  definitions: AchievementDefinition[],
  now = new Date().toISOString()
) {
  return evaluateAchievementsWithUnlocks(state, definitions, now).state;
}

export function evaluateAchievementsWithUnlocks(
  state: AchievementState,
  definitions: AchievementDefinition[],
  now = new Date().toISOString()
) {
  const next: AchievementState = {
    counters: { ...state.counters },
    unlocked: { ...state.unlocked }
  };
  const newlyUnlocked: AchievementDefinition[] = [];

  definitions.forEach(definition => {
    if (next.unlocked[definition.id]) return;
    if (definition.getProgress(next.counters) >= definition.target) {
      next.unlocked[definition.id] = now;
      newlyUnlocked.push(definition);
    }
  });

  return { state: next, newlyUnlocked };
}

export function normalizeAchievementState(state: Partial<AchievementState>): AchievementState {
  const defaults = createDefaultAchievementState();
  return {
    counters: {
      ...defaults.counters,
      ...state.counters,
      categoriesPlayed: { ...defaults.counters.categoriesPlayed, ...state.counters?.categoriesPlayed },
      packsUsed: { ...defaults.counters.packsUsed, ...state.counters?.packsUsed }
    },
    unlocked: { ...defaults.unlocked, ...state.unlocked }
  };
}

export function exportAchievements(state: AchievementState) {
  return JSON.stringify(normalizeAchievementState(state), null, 2);
}

export function getAchievementSummary(state: AchievementState, definitions: AchievementDefinition[]) {
  const normalized = normalizeAchievementState(state);
  const unlockedCount = definitions.filter(definition => normalized.unlocked[definition.id]).length;
  const totalProgress = definitions.reduce((sum, definition) => {
    const progress = Math.min(definition.getProgress(normalized.counters), definition.target);
    return sum + progress / definition.target;
  }, 0);

  return {
    unlockedCount,
    totalCount: definitions.length,
    completionPercent: definitions.length ? Math.round((totalProgress / definitions.length) * 100) : 0,
    nextLocked: definitions.find(definition => !normalized.unlocked[definition.id]) ?? null
  };
}
