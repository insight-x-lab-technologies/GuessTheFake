import { createStorageKey, readVersioned, writeVersioned } from '../storage/storage';

// W16-06: illustrated medal tier. Purely visual; unlock rules are the same.
export type AchievementRarity = 'bronze' | 'silver' | 'gold' | 'legendary';

export const ACHIEVEMENT_RARITIES: AchievementRarity[] = ['bronze', 'silver', 'gold', 'legendary'];

export type AchievementDefinition = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  target: number;
  rarity?: AchievementRarity;
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
  // Onda 13 progress tracks. Keys are opaque ids (difficulty, category).
  guessesByDifficulty: Record<string, number>;
  correctByDifficulty: Record<string, number>;
  correctByCategory: Record<string, number>;
  soloMatches: number;
  tableMatches: number;
};

export type AchievementState = {
  counters: AchievementCounters;
  // Same counters split by the mode a round or match was played in. Unlocks
  // stay global; per-mode unlocks are derived from these counters.
  modeCounters: Record<string, AchievementCounters>;
  // Same counters per local player (normalized name), for personal trophies.
  playerCounters: Record<string, AchievementCounters>;
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
    contentFeedbackCount: 0,
    guessesByDifficulty: {},
    correctByDifficulty: {},
    correctByCategory: {},
    soloMatches: 0,
    tableMatches: 0
  };
}

export function createDefaultAchievementState(): AchievementState {
  return {
    counters: createDefaultAchievementCounters(),
    modeCounters: {},
    playerCounters: {},
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
    playerCounters: { ...state.playerCounters },
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
  const playerCounters = isRecord(state.playerCounters) ? state.playerCounters : {};
  return {
    counters: normalizeCounters(state.counters),
    modeCounters: Object.fromEntries(
      Object.entries(modeCounters).map(([modeId, counters]) => [modeId, normalizeCounters(counters)])
    ),
    playerCounters: Object.fromEntries(
      Object.entries(playerCounters).map(([playerKey, counters]) => [playerKey, normalizeCounters(counters)])
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
    packsUsed: { ...defaults.packsUsed, ...counters?.packsUsed },
    guessesByDifficulty: { ...counters?.guessesByDifficulty },
    correctByDifficulty: { ...counters?.correctByDifficulty },
    correctByCategory: { ...counters?.correctByCategory },
    soloMatches: Number.isFinite(counters?.soloMatches) ? counters?.soloMatches ?? 0 : 0,
    tableMatches: Number.isFinite(counters?.tableMatches) ? counters?.tableMatches ?? 0 : 0
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

export function updatePlayerCounters(
  state: AchievementState,
  playerKey: string,
  update: (counters: AchievementCounters) => AchievementCounters
): AchievementState {
  const current = state.playerCounters[playerKey] ?? createDefaultAchievementCounters();
  return {
    ...state,
    playerCounters: { ...state.playerCounters, [playerKey]: update(current) }
  };
}

// Personal trophies: derived from a player's own counters, like per-mode.
export function getCountersProgressView(counters: AchievementCounters, definitions: AchievementDefinition[]) {
  const items: AchievementProgressItem[] = definitions.map(definition => {
    const progress = Math.min(definition.getProgress(counters), definition.target);
    return { definition, progress, unlocked: progress >= definition.target };
  });
  return { items, unlockedCount: items.filter(item => item.unlocked).length, totalCount: definitions.length };
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
