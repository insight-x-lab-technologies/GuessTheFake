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
  // Same counters split by the mode a round or match was played in. Unlocks
  // stay global; per-mode unlocks are derived from these counters.
  modeCounters: Record<string, AchievementCounters>;
  unlocked: Record<string, string>;
};

export type AchievementModeFilter = 'all' | (string & {});

export type AchievementProgressItem = {
  definition: AchievementDefinition;
  progress: number;
  unlocked: boolean;
};

export const ACHIEVEMENTS_VERSION = 1;
export const ACHIEVEMENTS_KEY = createStorageKey('platform', 'achievements', ACHIEVEMENTS_VERSION);

export function createDefaultAchievementCounters(): AchievementCounters {
  return {
    matchesFinished: 0,
    roundsPlayed: 0,
    correctGuesses: 0,
    longestStreak: 0,
    perfectMatches: 0,
    categoriesPlayed: {},
    packsUsed: {},
    contentFeedbackCount: 0
  };
}

export function createDefaultAchievementState(): AchievementState {
  return {
    counters: createDefaultAchievementCounters(),
    modeCounters: {},
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
    modeCounters: { ...state.modeCounters },
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
  const modeCounters = isRecord(state.modeCounters) ? state.modeCounters : {};
  return {
    counters: normalizeCounters(state.counters),
    modeCounters: Object.fromEntries(
      Object.entries(modeCounters).map(([modeId, counters]) => [modeId, normalizeCounters(counters)])
    ),
    unlocked: { ...state.unlocked }
  };
}

function normalizeCounters(counters: Partial<AchievementCounters> | undefined): AchievementCounters {
  const defaults = createDefaultAchievementCounters();
  return {
    ...defaults,
    ...counters,
    categoriesPlayed: { ...defaults.categoriesPlayed, ...counters?.categoriesPlayed },
    packsUsed: { ...defaults.packsUsed, ...counters?.packsUsed }
  };
}

function isRecord(value: unknown): value is Record<string, Partial<AchievementCounters>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function updateModeCounters(
  state: AchievementState,
  modeId: string,
  update: (counters: AchievementCounters) => AchievementCounters
): AchievementState {
  const current = state.modeCounters[modeId] ?? createDefaultAchievementCounters();
  return {
    ...state,
    modeCounters: { ...state.modeCounters, [modeId]: update(current) }
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

export function getAchievementProgressView(
  state: AchievementState,
  definitions: AchievementDefinition[],
  modeId: AchievementModeFilter = 'all'
) {
  const normalized = normalizeAchievementState(state);
  const modeCounters = modeId === 'all' ? null : normalized.modeCounters[modeId] ?? null;
  const counters = modeId === 'all' ? normalized.counters : modeCounters ?? createDefaultAchievementCounters();
  const items: AchievementProgressItem[] = definitions.map(definition => {
    const progress = Math.min(definition.getProgress(counters), definition.target);
    return {
      definition,
      progress,
      unlocked: modeId === 'all' ? Boolean(normalized.unlocked[definition.id]) : progress >= definition.target
    };
  });
  const unlockedCount = items.filter(item => item.unlocked).length;
  const totalProgress = items.reduce((sum, item) => sum + item.progress / item.definition.target, 0);

  return {
    counters,
    hasData: modeId === 'all'
      || Boolean(modeCounters && (modeCounters.roundsPlayed > 0 || modeCounters.matchesFinished > 0)),
    items,
    summary: {
      unlockedCount,
      totalCount: definitions.length,
      completionPercent: definitions.length ? Math.round((totalProgress / definitions.length) * 100) : 0,
      nextLocked: items.find(item => !item.unlocked)?.definition ?? null
    }
  };
}
