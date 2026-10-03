import { describe, expect, it } from 'vitest';
import { getBuiltinRounds } from '../test/builtin';
import { GAME_ID } from '../game/modes';
import { beginPlaying, createInitialGuessTheFakeState, startMatch, submitGuess } from '../game/rules';
import { buildMultiplayerSnapshot, buildPresenterBoard, getLeaderboardRows, getScoreRows } from './match-summary';

function createMatch(modeId: 'classic' | 'teams') {
  return startMatch(createInitialGuessTheFakeState(), {
    modeId,
    playerNames: ['Ana', 'Bruno', 'Caio', 'Duda'],
    totalRounds: 3,
    rounds: getBuiltinRounds()
  });
}

describe('match summary helpers', () => {
  it('uses players for individual modes and teams for team mode', () => {
    const classic = createMatch('classic');
    const teams = createMatch('teams');

    expect(getScoreRows(classic).map(row => row.name)).toEqual(['Ana', 'Bruno', 'Caio', 'Duda']);
    expect(getScoreRows(teams)).toHaveLength(teams.teams.length);
  });

  it('marks every tied best score as a winner in leaderboard rows', () => {
    const state = createMatch('classic');
    const scored = {
      ...state,
      players: state.players.map((player, index) => ({ ...player, score: index < 2 ? 10 : 5 }))
    };

    expect(getLeaderboardRows(scored).map(row => row.isWinner)).toEqual([true, true, false, false]);
  });

  it('builds a companion snapshot from the match state', () => {
    const snapshot = buildMultiplayerSnapshot(createMatch('classic'), 12, '2026-09-22T00:00:00.000Z');

    expect(snapshot).toMatchObject({
      gameId: GAME_ID,
      modeId: 'classic',
      phase: 'intro',
      roundNumber: 1,
      totalRounds: 3,
      activeSubjectName: 'Ana',
      timerSeconds: 12,
      revealed: false,
      updatedAt: '2026-09-22T00:00:00.000Z'
    });
  });

  it('reports round zero before a match starts', () => {
    expect(buildMultiplayerSnapshot(createInitialGuessTheFakeState(), 0).roundNumber).toBe(0);
  });
});

describe('presenter board (W13-06)', () => {
  const t = (key: string) => key;
  const text = (value: unknown, fallback = '') => (typeof value === 'object' && value ? Object.values(value as Record<string, string>)[0] : String(value ?? fallback));

  it('shows no board outside the statement phases', () => {
    expect(buildPresenterBoard(createMatch('classic'), { t, text })).toBeNull();
  });

  it('hides the fake until the reveal and marks it afterwards', () => {
    const playing = beginPlaying(createMatch('classic'));
    const round = playing.rounds[0];
    const board = buildPresenterBoard(playing, { t, text });
    expect(board?.items.every(item => item.state === 'idle' && !item.label)).toBe(true);
    expect(board?.explanation).toBeUndefined();

    const revealed = submitGuess(playing, round.fakeStatementId).state;
    const revealedBoard = buildPresenterBoard(revealed, { t, text });
    expect(revealedBoard?.items.find(item => item.id === round.fakeStatementId)).toMatchObject({ state: 'fake', label: 'game.fakeLabel' });
    expect(revealedBoard?.explanation).toBeTruthy();
    expect(buildMultiplayerSnapshot(revealed, 0, 'now', revealedBoard).board).toBe(revealedBoard);
  });

  it('keeps gradual clue statements hidden on the display', () => {
    const playing = beginPlaying(createMatch('classic'));
    const gradual = { ...playing, specialRoundsEnabled: true, specialRounds: ['gradual-clue' as const, null, null] };
    const board = buildPresenterBoard(gradual, { t, text });
    expect(board?.badge).toBe('specials.gradual-clue.title');
    expect(board?.items.filter(item => item.state === 'hidden')).toHaveLength(3);
    expect(board?.items.filter(item => item.state === 'hidden').every(item => item.text === '')).toBe(true);
  });
});
