import { describe, expect, it } from 'vitest';
import type { StorageAdapter } from '../core/storage/storage';
import {
  getDeprioritizedRoundIds,
  loadRoundHistory,
  recordPlayedRounds,
  ROUND_HISTORY_KEY,
  saveRoundHistory
} from './round-history';

function createMemoryStorage(): StorageAdapter {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
}

describe('round history', () => {
  it('keeps the newest rounds first, without duplicates, up to the limit', () => {
    let model = recordPlayedRounds({ recentRoundIds: [] }, ['a', 'b']);
    model = recordPlayedRounds(model, ['c', 'a'], 3);
    expect(model.recentRoundIds).toEqual(['a', 'c', 'b']);
    expect(recordPlayedRounds(model, ['d'], 2).recentRoundIds).toEqual(['d', 'a']);
  });

  it('adds weak rounds to the deprioritized list', () => {
    expect(getDeprioritizedRoundIds({ recentRoundIds: ['a', 'b'] }, ['b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('falls back to empty history for missing, invalid, and wrong-version data', () => {
    const storage = createMemoryStorage();
    expect(loadRoundHistory(storage)).toEqual({ recentRoundIds: [] });
    storage.setItem(ROUND_HISTORY_KEY, JSON.stringify({ version: 2, value: { recentRoundIds: ['a'] } }));
    expect(loadRoundHistory(storage)).toEqual({ recentRoundIds: [] });
    storage.setItem(ROUND_HISTORY_KEY, JSON.stringify({ version: 1, value: { recentRoundIds: ['a', 3, null] } }));
    expect(loadRoundHistory(storage)).toEqual({ recentRoundIds: ['a'] });
    saveRoundHistory({ recentRoundIds: ['x'] }, storage);
    expect(loadRoundHistory(storage)).toEqual({ recentRoundIds: ['x'] });
  });
});
