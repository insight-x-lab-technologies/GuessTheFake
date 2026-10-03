import { describe, expect, it } from 'vitest';
import type { StorageAdapter } from '../core/storage/storage';
import { getBuiltinRounds } from '../test/builtin';
import {
  clearPersistedGuessTheFakeMatch,
  GUESS_THE_FAKE_QUICK_GAME_KEY,
  loadPersistedGuessTheFakeMatch,
  savePersistedGuessTheFakeMatch
} from './match-storage';
import { createInitialGuessTheFakeState, startMatch } from './rules';

function createMemoryStorage(): StorageAdapter {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
}

describe('Guess the Fake quick-game storage', () => {
  it('persists active matches with language and timer data', () => {
    const storage = createMemoryStorage();
    const state = startMatch(createInitialGuessTheFakeState(), {
      playerNames: ['Ana', 'Bruno'],
      totalRounds: 2,
      rounds: getBuiltinRounds()
    });

    savePersistedGuessTheFakeMatch({ state, activeMatchLanguage: 'pt', timerSeconds: 17 }, storage);

    expect(loadPersistedGuessTheFakeMatch(storage)).toMatchObject({
      activeMatchLanguage: 'pt',
      timerSeconds: 17,
      state: {
        phase: 'intro',
        players: [{ name: 'Ana' }, { name: 'Bruno' }]
      }
    });
  });

  it('falls back for invalid, finished, or cleared matches', () => {
    const storage = createMemoryStorage();
    storage.setItem(GUESS_THE_FAKE_QUICK_GAME_KEY, '{');
    expect(loadPersistedGuessTheFakeMatch(storage)).toBeNull();

    const finished = {
      state: {
        ...startMatch(createInitialGuessTheFakeState(), {
          playerNames: ['Ana'],
          totalRounds: 1,
          rounds: getBuiltinRounds()
        }),
        phase: 'finished' as const
      },
      activeMatchLanguage: 'pt' as const,
      timerSeconds: 0
    };
    savePersistedGuessTheFakeMatch(finished, storage);
    expect(loadPersistedGuessTheFakeMatch(storage)).toBeNull();

    clearPersistedGuessTheFakeMatch(storage);
    expect(storage.getItem(GUESS_THE_FAKE_QUICK_GAME_KEY)).toBeNull();
  });
});

describe('quick-game storage for solo and Onda 13 state', () => {
  function createStorage(): StorageAdapter {
    const values = new Map<string, string>();
    return {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: key => values.delete(key)
    };
  }

  it('restores a match saved before the solo mode with default challenge and variations', () => {
    const storage = createStorage();
    const state = startMatch(createInitialGuessTheFakeState(), {
      playerNames: ['Ana', 'Bruno'],
      totalRounds: 2,
      rounds: getBuiltinRounds()
    });
    const legacy: Record<string, unknown> = { ...state };
    ['challenge', 'tableMoments', 'tableMoment', 'specialRoundsEnabled', 'specialRounds', 'revealedClues'].forEach(field => {
      delete legacy[field];
    });
    storage.setItem(GUESS_THE_FAKE_QUICK_GAME_KEY, JSON.stringify({
      version: 1,
      value: { state: legacy, activeMatchLanguage: 'pt', timerSeconds: 0 }
    }));

    expect(loadPersistedGuessTheFakeMatch(storage)?.state).toMatchObject({
      challenge: { categoryId: 'all', difficulty: 'all', packIds: [] },
      tableMoments: false,
      tableMoment: null,
      specialRoundsEnabled: false,
      specialRounds: [null, null],
      revealedClues: 2
    });
  });

  it('persists a solo match and a table moment in progress', () => {
    const storage = createStorage();
    const solo = startMatch(createInitialGuessTheFakeState(), {
      modeId: 'solo',
      playerNames: ['Ana'],
      totalRounds: 1,
      rounds: getBuiltinRounds()
    });
    savePersistedGuessTheFakeMatch({ state: solo, activeMatchLanguage: 'en', timerSeconds: 0 }, storage);
    expect(loadPersistedGuessTheFakeMatch(storage)?.state.modeId).toBe('solo');

    const discussing = {
      ...solo,
      modeId: 'classic' as const,
      phase: 'discussing' as const,
      tableMoments: true,
      tableMoment: { kind: 'vote' as const, votedSubjectId: null, changedSubjectIds: [] }
    };
    savePersistedGuessTheFakeMatch({ state: discussing, activeMatchLanguage: 'en', timerSeconds: 0 }, storage);
    expect(loadPersistedGuessTheFakeMatch(storage)?.state.tableMoment?.kind).toBe('vote');

    savePersistedGuessTheFakeMatch({ state: { ...discussing, tableMoment: null }, activeMatchLanguage: 'en', timerSeconds: 0 }, storage);
    expect(loadPersistedGuessTheFakeMatch(storage)).toBeNull();
  });
});
