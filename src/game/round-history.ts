import { createStorageKey, readVersioned, writeVersioned, type StorageAdapter } from '../core/storage/storage';

// W13-05: recently played rounds are drawn only after every other round.
export type RoundHistoryModel = {
  recentRoundIds: string[];
};

export const ROUND_HISTORY_VERSION = 1;
export const ROUND_HISTORY_KEY = createStorageKey('game.guess-the-fake', 'round-history', ROUND_HISTORY_VERSION);
export const ROUND_HISTORY_LIMIT = 60;

export function createEmptyRoundHistory(): RoundHistoryModel {
  return { recentRoundIds: [] };
}

// Newest first, without duplicates, capped at `limit`.
export function recordPlayedRounds(model: RoundHistoryModel, roundIds: string[], limit = ROUND_HISTORY_LIMIT): RoundHistoryModel {
  const played = [...roundIds].reverse().filter(Boolean);
  const merged = [...played, ...model.recentRoundIds].filter((id, index, all) => all.indexOf(id) === index);
  return { recentRoundIds: merged.slice(0, Math.max(0, limit)) };
}

export function getDeprioritizedRoundIds(history: RoundHistoryModel, weakRoundIds: string[] = []) {
  return [...new Set([...history.recentRoundIds, ...weakRoundIds])];
}

export function normalizeRoundHistory(value: unknown): RoundHistoryModel {
  const ids = (value as RoundHistoryModel | null)?.recentRoundIds;
  return {
    recentRoundIds: Array.isArray(ids)
      ? ids.filter((id): id is string => typeof id === 'string').slice(0, ROUND_HISTORY_LIMIT)
      : []
  };
}

export function loadRoundHistory(storage: StorageAdapter = localStorage): RoundHistoryModel {
  return normalizeRoundHistory(readVersioned<unknown>(storage, ROUND_HISTORY_KEY, null, ROUND_HISTORY_VERSION));
}

export function saveRoundHistory(model: RoundHistoryModel, storage: StorageAdapter = localStorage) {
  writeVersioned(storage, ROUND_HISTORY_KEY, normalizeRoundHistory(model), ROUND_HISTORY_VERSION);
}
