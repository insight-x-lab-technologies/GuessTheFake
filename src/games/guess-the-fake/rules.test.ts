import { describe, expect, it } from 'vitest';
import { getBuiltinRounds } from './data/sample-pack';
import {
  advanceRound,
  beginPlaying,
  calculateSpeedBonus,
  calculateStreakMultiplier,
  createInitialGuessTheFakeState,
  getActiveGuessSubject,
  getWinners,
  prepareRoundsForMatch,
  recalibrateScores,
  sanitizeRoundCount,
  startMatch,
  submitGuess,
  timeOutRound
} from './rules';

describe('Guess the Fake rules', () => {
  it('starts a match with normalized players and bounded rounds', () => {
    const state = startMatch(createInitialGuessTheFakeState(), {
      playerNames: ['Ana', ''],
      totalRounds: 40,
      rounds: getBuiltinRounds()
    });

    expect(state.phase).toBe('intro');
    expect(state.totalRounds).toBe(30);
    expect(state.players.map(player => player.name)).toEqual(['Ana', 'Jogador 2']);
  });

  it('awards points only for the fake statement', () => {
    const state = startMatch(createInitialGuessTheFakeState(), {
      playerNames: ['Ana'],
      totalRounds: 1,
      rounds: getBuiltinRounds()
    });

    const playing = beginPlaying(state);
    const round = getBuiltinRounds()[0];
    const { state: revealed, result } = submitGuess(playing, round.fakeStatementId);

    expect(result.correct).toBe(true);
    expect(revealed.players[0].score).toBe(10);
    expect(revealed.phase).toBe('revealed');
  });

  it('adds speed bonus from external timer data without using timers in rules', () => {
    const state = beginPlaying(startMatch(createInitialGuessTheFakeState(), {
      playerNames: ['Ana'],
      totalRounds: 1,
      rounds: getBuiltinRounds()
    }));

    const { state: revealed, result } = submitGuess(
      state,
      getBuiltinRounds()[0].fakeStatementId,
      { correctGuessPoints: 10, wrongGuessPenalty: 0, speedBonusPoints: 6 },
      { remainingSeconds: 20, totalSeconds: 60 }
    );

    expect(result.speedBonus).toBe(2);
    expect(result.pointsAwarded).toBe(12);
    expect(revealed.players[0].score).toBe(12);
  });

  it('finishes after the configured number of rounds', () => {
    const playing = startMatch(createInitialGuessTheFakeState(), {
      playerNames: ['Ana'],
      totalRounds: 1,
      rounds: getBuiltinRounds()
    });
    const { state: revealed } = submitGuess(beginPlaying(playing), getBuiltinRounds()[0].fakeStatementId);
    const finished = advanceRound(revealed);

    expect(finished.phase).toBe('finished');
    expect(getWinners(finished)[0].name).toBe('Ana');
  });

  it('supports configurable scoring and recalibration', () => {
    const state = beginPlaying(startMatch(createInitialGuessTheFakeState(), {
      playerNames: ['Ana'],
      totalRounds: 1,
      rounds: getBuiltinRounds()
    }));

    const { state: revealed } = submitGuess(state, getBuiltinRounds()[0].fakeStatementId, {
      correctGuessPoints: 15,
      wrongGuessPenalty: -2
    });

    expect(revealed.players[0].score).toBe(15);
    expect(recalibrateScores(revealed).players[0].score).toBe(0);
  });

  it('limits requested rounds to available content without wrapping', () => {
    const state = startMatch(createInitialGuessTheFakeState(), {
      playerNames: ['Ana'],
      totalRounds: 999,
      rounds: getBuiltinRounds().slice(0, 3)
    });

    expect(state.totalRounds).toBe(3);
    expect(state.rounds).toHaveLength(3);
  });

  it('sanitizes invalid round counts', () => {
    expect(sanitizeRoundCount(Number.NaN, 10)).toBe(1);
    expect(sanitizeRoundCount(-5, 10)).toBe(1);
    expect(sanitizeRoundCount(4.8, 10)).toBe(4);
    expect(sanitizeRoundCount(50, 12)).toBe(12);
  });

  it('shuffles rounds and statements while preserving fake statement ids', () => {
    const randomValues = [0.1, 0.7, 0.2, 0.8, 0.3, 0.9, 0.4, 0.6, 0.5, 0.1];
    let randomIndex = 0;
    const rounds = getBuiltinRounds().slice(0, 2);
    const prepared = prepareRoundsForMatch(rounds, {
      shuffle: true,
      random: () => randomValues[randomIndex++ % randomValues.length]
    });

    expect(prepared).toHaveLength(2);
    prepared.forEach(round => {
      expect(round.statements.some(statement => statement.id === round.fakeStatementId)).toBe(true);
    });
    expect(prepared[0].statements.map(statement => statement.id)).not.toEqual(rounds[0].statements.map(statement => statement.id));
  });

  it('tracks streaks and perfect matches in state', () => {
    const started = startMatch(createInitialGuessTheFakeState(), {
      playerNames: ['Ana'],
      totalRounds: 1,
      rounds: getBuiltinRounds()
    });
    const { state } = submitGuess(beginPlaying(started), getBuiltinRounds()[0].fakeStatementId);

    expect(state.correctGuessesInMatch).toBe(1);
    expect(state.longestStreakInMatch).toBe(1);
  });

  it('calculates bounded speed bonuses and streak multipliers', () => {
    expect(calculateSpeedBonus(30, 60, 5)).toBe(3);
    expect(calculateSpeedBonus(0, 60, 5)).toBe(0);
    expect(calculateSpeedBonus(70, 60, 5)).toBe(5);
    expect(calculateStreakMultiplier(0)).toBe(1);
    expect(calculateStreakMultiplier(2)).toBe(1.5);
    expect(calculateStreakMultiplier(10)).toBe(3);
  });

  it('keeps all-guess rounds open until every player has guessed', () => {
    const started = startMatch(createInitialGuessTheFakeState(), {
      modeId: 'all-guess',
      playerNames: ['Ana', 'Bruno'],
      totalRounds: 1,
      rounds: getBuiltinRounds()
    });
    const playing = beginPlaying(started);
    const round = getBuiltinRounds()[0];

    const first = submitGuess(playing, round.fakeStatementId).state;
    expect(first.phase).toBe('playing');
    expect(getActiveGuessSubject(first)?.name).toBe('Bruno');

    const second = submitGuess(first, round.statements.find(statement => statement.id !== round.fakeStatementId)!.id).state;
    expect(second.phase).toBe('revealed');
    expect(Object.keys(second.roundGuesses)).toEqual(['player-1', 'player-2']);
    expect(second.players.map(player => player.score)).toEqual([10, 0]);
  });

  it('times out pending all-guess players as wrong guesses', () => {
    const playing = beginPlaying(startMatch(createInitialGuessTheFakeState(), {
      modeId: 'all-guess',
      playerNames: ['Ana', 'Bruno'],
      totalRounds: 1,
      rounds: getBuiltinRounds()
    }));
    const first = submitGuess(playing, getBuiltinRounds()[0].fakeStatementId).state;
    const timedOut = timeOutRound(first, { correctGuessPoints: 10, wrongGuessPenalty: -1 }).state;

    expect(timedOut.phase).toBe('revealed');
    expect(timedOut.players.map(player => player.score)).toEqual([10, -1]);
    expect(timedOut.roundGuesses['player-2'].correct).toBe(false);
  });

  it('supports team mode with separate team scoring', () => {
    const playing = beginPlaying(startMatch(createInitialGuessTheFakeState(), {
      modeId: 'teams',
      playerNames: ['Ana', 'Bruno', 'Caio', 'Duda'],
      totalRounds: 1,
      rounds: getBuiltinRounds()
    }));

    expect(playing.teams.map(team => team.playerIds)).toEqual([
      ['player-1', 'player-3'],
      ['player-2', 'player-4']
    ]);

    const revealed = submitGuess(playing, getBuiltinRounds()[0].fakeStatementId).state;
    expect(revealed.players.every(player => player.score === 0)).toBe(true);
    expect(revealed.teams[0].score).toBe(10);
    expect(getWinners(revealed).map(winner => winner.name)).toEqual(['Time 1']);
  });

  it('applies streak multiplier after repeated correct guesses by the same subject', () => {
    const rounds = getBuiltinRounds().slice(0, 3);
    const started = startMatch(createInitialGuessTheFakeState(), {
      playerNames: ['Ana'],
      totalRounds: 3,
      rounds
    });

    const first = advanceRound(submitGuess(beginPlaying(started), rounds[0].fakeStatementId).state);
    const second = advanceRound(submitGuess(beginPlaying(first), rounds[1].fakeStatementId).state);
    const third = submitGuess(beginPlaying(second), rounds[2].fakeStatementId).state;

    expect(third.lastResult?.streakMultiplier).toBe(1.5);
    expect(third.players[0].score).toBe(35);
  });
});
