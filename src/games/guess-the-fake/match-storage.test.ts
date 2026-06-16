import { describe, expect, it } from 'vitest';
import type { StorageAdapter } from '../../core/storage/storage';
import { getBuiltinRounds } from './data/sample-pack';
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
