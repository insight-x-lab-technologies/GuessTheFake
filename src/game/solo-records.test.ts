import { describe, expect, it } from 'vitest';
import type { StorageAdapter } from '../core/storage/storage';
import { getBuiltinRounds } from '../test/builtin';
import { advanceRound, beginPlaying, createInitialGuessTheFakeState, startMatch, submitGuess } from './rules';
import {
  getSoloChallengeFromState,
  getSoloChallengeKey,
  getSoloPlayerKey,
  getSoloResult,
  isNewSoloRecord,
  listSoloRecords,
  loadSoloRecords,
  migrateSoloRecordsToProfile,
  parseSoloChallengeKey,
  recordSoloResult,
  saveSoloRecords,
  SOLO_RECORDS_KEY,
  type SoloResult
} from './solo-records';

function createMemoryStorage(): StorageAdapter {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
}

const result = (points: number, correct: number, achievedAt = '2026-10-03T10:00:00.000Z'): SoloResult => ({
  points,
  correct,
  totalRounds: 5,
  bestStreak: correct,
  achievedAt
});

describe('solo records', () => {
  it('builds challenge keys with optional segments for special rounds and packs', () => {
    expect(getSoloChallengeKey({ totalRounds: 5, categoryId: 'science', difficulty: 'hard' })).toBe('5|science|hard');
    const key = getSoloChallengeKey({ totalRounds: 5, categoryId: 'all', difficulty: 'all', specialRounds: true, packIds: ['z', 'a'] });
    expect(key).toBe('5|all|all|special|packs:a+z');
    expect(parseSoloChallengeKey(key)).toEqual({
      totalRounds: 5,
      categoryId: 'all',
      difficulty: 'all',
      specialRounds: true,
      packIds: ['a', 'z']
    });
  });

  it('derives the result of a finished solo match', () => {
    let state = beginPlaying(startMatch(createInitialGuessTheFakeState(), {
      modeId: 'solo',
      playerNames: ['Ana'],
      totalRounds: 1,
      rounds: getBuiltinRounds(),
      challenge: { categoryId: 'science', difficulty: 'easy' }
    }));
    expect(getSoloResult(state)).toBeNull();
    state = advanceRound(submitGuess(state, state.rounds[0].fakeStatementId).state);

    expect(getSoloResult(state, 'now')).toEqual({ points: 10, correct: 1, totalRounds: 1, bestStreak: 1, achievedAt: 'now' });
    expect(getSoloChallengeKey(getSoloChallengeFromState(state))).toBe('1|science|easy');
  });

  it('breaks ties by correct answers and never counts a full tie', () => {
    expect(isNewSoloRecord(null, result(0, 0))).toBe(true);
    expect(isNewSoloRecord(result(40, 4), result(41, 1))).toBe(true);
    expect(isNewSoloRecord(result(40, 3), result(40, 4))).toBe(true);
    expect(isNewSoloRecord(result(40, 4), result(40, 4))).toBe(false);
    expect(isNewSoloRecord(result(40, 4), result(39, 5))).toBe(false);
  });

  it('keeps only the best result per player and challenge', () => {
    const first = recordSoloResult({ records: {} }, 'ana', '5|all|all', result(30, 3));
    expect(first.isNewRecord).toBe(true);
    expect(first.previous).toBeNull();
    const worse = recordSoloResult(first.model, 'ana', '5|all|all', result(20, 2));
    expect(worse.isNewRecord).toBe(false);
    expect(worse.previous?.points).toBe(30);
    expect(worse.model).toBe(first.model);
    const better = recordSoloResult(first.model, 'ana', '5|all|all', result(50, 5));
    expect(listSoloRecords(better.model).map(row => row.points)).toEqual([50]);
  });

  it('moves name records to a new profile, keeping the best per challenge', () => {
    const model = {
      records: {
        ana: { '5|all|all': result(30, 3), '3|all|easy': result(20, 2) },
        'profile:p1': { '5|all|all': result(40, 4) }
      }
    };
    const migrated = migrateSoloRecordsToProfile(model, ' Ana ', 'p1');
    expect(Object.keys(migrated.records)).toEqual(['profile:p1']);
    expect(migrated.records['profile:p1']['5|all|all'].points).toBe(40);
    expect(migrated.records['profile:p1']['3|all|easy'].points).toBe(20);
    expect(migrateSoloRecordsToProfile(model, 'Bruno', 'p2')).toBe(model);
    expect(getSoloPlayerKey(' Ana ')).toBe('ana');
    expect(getSoloPlayerKey('Ana', 'p1')).toBe('profile:p1');
  });

  it('falls back to empty records for missing, invalid, and wrong-version data', () => {
    const storage = createMemoryStorage();
    expect(loadSoloRecords(storage)).toEqual({ records: {} });
    storage.setItem(SOLO_RECORDS_KEY, '{not json');
    expect(loadSoloRecords(storage)).toEqual({ records: {} });
    storage.setItem(SOLO_RECORDS_KEY, JSON.stringify({ version: 99, value: { records: { ana: { k: result(1, 1) } } } }));
    expect(loadSoloRecords(storage)).toEqual({ records: {} });
    storage.setItem(SOLO_RECORDS_KEY, JSON.stringify({ version: 1, value: { records: { ana: { ok: result(1, 1), bad: { points: 'x' } } } } }));
    expect(Object.keys(loadSoloRecords(storage).records.ana)).toEqual(['ok']);

    saveSoloRecords({ records: { ana: { '5|all|all': result(10, 1) } } }, storage);
    expect(loadSoloRecords(storage).records.ana['5|all|all'].points).toBe(10);
  });
});
