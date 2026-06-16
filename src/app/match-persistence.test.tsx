import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { savePersistedGuessTheFakeMatch, GUESS_THE_FAKE_QUICK_GAME_KEY } from '../games/guess-the-fake/match-storage';
import { getBuiltinRounds } from '../games/guess-the-fake/data/sample-pack';
import { createInitialGuessTheFakeState, startMatch } from '../games/guess-the-fake/rules';
import { App } from './App';

describe('active match persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('restores a saved active match behind explicit continue and clean setup choices', async () => {
    const state = startMatch(createInitialGuessTheFakeState(), {
      playerNames: ['Ana', 'Bruno'],
      totalRounds: 2,
      rounds: getBuiltinRounds()
    });
    savePersistedGuessTheFakeMatch({ state, activeMatchLanguage: 'pt', timerSeconds: 0 });

    render(<App />);

    expect(screen.getByText(/partida em andamento|match in progress/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continuar partida|continue match/i }));
    expect(await screen.findByText(/vez de ana|ana's turn/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /nova partida|new match/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /abrir setup|open setup/i }));

    expect(await screen.findByText(/preparar partida|prepare match/i)).toBeInTheDocument();
    await waitFor(() => expect(localStorage.getItem(GUESS_THE_FAKE_QUICK_GAME_KEY)).toBeNull());
  });
});
