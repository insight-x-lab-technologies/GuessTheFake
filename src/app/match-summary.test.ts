import { describe, expect, it } from 'vitest';
import { getBuiltinRounds } from '../test/builtin';
import { GAME_ID } from '../game/modes';
import { createInitialGuessTheFakeState, startMatch } from '../game/rules';
import { buildMultiplayerSnapshot, getLeaderboardRows, getScoreRows } from './match-summary';

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
