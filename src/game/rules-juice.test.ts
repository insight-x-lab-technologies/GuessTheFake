import { describe, expect, it } from 'vitest';
import { getBuiltinRounds } from '../test/builtin';
import {
  advanceRound,
  beginPlaying,
  createInitialGuessTheFakeState,
  getHandoffSubject,
  startMatch,
  submitGuess,
  timeOutRound
} from './rules';

function allGuessMatch(rounds = 2) {
  return beginPlaying(startMatch(createInitialGuessTheFakeState(), {
    modeId: 'all-guess',
    playerNames: ['Ana', 'Bruno', 'Caio'],
    totalRounds: rounds,
    rounds: getBuiltinRounds()
  }));
}

function wrongStatementId(state: ReturnType<typeof allGuessMatch>) {
  const round = state.rounds[state.currentRoundIndex];
  return round.statements.find(statement => statement.id !== round.fakeStatementId)!.id;
}

describe('Onda 15 rules', () => {
  it('records how long a guess took, but not on timeouts', () => {
    const playing = allGuessMatch();
    const fake = playing.rounds[0].fakeStatementId;
    const { result } = submitGuess(playing, fake, undefined, { remainingSeconds: 45, totalSeconds: 60 });
    expect(result.elapsedSeconds).toBe(15);

    const timedOut = timeOutRound(playing).state;
    expect(Object.values(timedOut.roundGuesses).every(guess => guess.elapsedSeconds === undefined)).toBe(true);
  });

  it('clamps the elapsed time inside the round length', () => {
    const playing = allGuessMatch();
    const fake = playing.rounds[0].fakeStatementId;
    expect(submitGuess(playing, fake, undefined, { remainingSeconds: 90, totalSeconds: 60 }).result.elapsedSeconds).toBe(0);
    expect(submitGuess(playing, fake, undefined, { remainingSeconds: -5, totalSeconds: 60 }).result.elapsedSeconds).toBe(60);
  });

  it('appends the settled guesses of each round to the match history', () => {
    let state = allGuessMatch();
    const fake = state.rounds[0].fakeStatementId;
    state = submitGuess(state, fake).state;
    state = submitGuess(state, wrongStatementId(state)).state;
    state = submitGuess(state, fake).state;
    expect(state.phase).toBe('revealed');
    expect(state.guessHistory).toEqual([]);

    state = advanceRound(state);
    expect(state.guessHistory).toHaveLength(3);
    expect(state.guessHistory.every(entry => entry.roundIndex === 0)).toBe(true);
    expect(state.guessHistory.map(entry => entry.correct)).toEqual([true, false, true]);
  });

  it('starts every match with an empty history', () => {
    expect(allGuessMatch().guessHistory).toEqual([]);
    expect(createInitialGuessTheFakeState().guessHistory).toEqual([]);
  });

  it('asks for a hand-off only when the device moves to another player mid-round', () => {
    const playing = allGuessMatch();
    const afterAna = submitGuess(playing, wrongStatementId(playing)).state;
    expect(getHandoffSubject(playing, afterAna)).toMatchObject({ kind: 'player', name: 'Bruno' });

    const afterBruno = submitGuess(afterAna, wrongStatementId(afterAna)).state;
    expect(getHandoffSubject(afterAna, afterBruno)).toMatchObject({ name: 'Caio' });

    // The last guess reveals the round: nobody to hand the device to.
    const revealed = submitGuess(afterBruno, wrongStatementId(afterBruno)).state;
    expect(getHandoffSubject(afterBruno, revealed)).toBeNull();
  });

  it('never asks for a hand-off outside all-guess', () => {
    const classic = beginPlaying(startMatch(createInitialGuessTheFakeState(), {
      modeId: 'classic',
      playerNames: ['Ana', 'Bruno'],
      totalRounds: 2,
      rounds: getBuiltinRounds()
    }));
    const after = submitGuess(classic, classic.rounds[0].fakeStatementId).state;
    expect(getHandoffSubject(classic, after)).toBeNull();
    expect(getHandoffSubject(classic, classic)).toBeNull();
  });
});
