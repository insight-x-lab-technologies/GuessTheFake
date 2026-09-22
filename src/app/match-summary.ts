import type { MultiplayerGameSnapshot } from '../core/multiplayer/multiplayer';
import { GAME_ID } from '../game/modes';
import { getActiveGuessSubject, getCurrentRound } from '../game/rules';
import type { GuessTheFakeState } from '../game/types';

export function getScoreRows(state: GuessTheFakeState) {
  return state.modeId === 'teams' && state.teams.length
    ? state.teams.map(team => ({ name: team.name, score: team.score }))
    : state.players.map(player => ({ name: player.name, score: player.score }));
}

export function getLeaderboardRows(state: GuessTheFakeState) {
  const rows = getScoreRows(state);
  const bestScore = Math.max(...rows.map(row => row.score));
  return rows.map(row => ({
    playerName: row.name,
    points: row.score,
    isWinner: row.score === bestScore
  }));
}

export function buildMultiplayerSnapshot(
  state: GuessTheFakeState,
  timerSeconds: number,
  updatedAt = new Date().toISOString()
): MultiplayerGameSnapshot {
  const round = getCurrentRound(state);
  const activePlayer = state.players[state.activePlayerIndex];

  return {
    gameId: GAME_ID,
    modeId: state.modeId,
    phase: state.phase,
    roundNumber: round ? Math.min(state.currentRoundIndex + 1, state.totalRounds) : 0,
    totalRounds: state.totalRounds,
    activeSubjectName: getActiveGuessSubject(state)?.name ?? activePlayer?.name ?? '-',
    timerSeconds,
    revealed: state.phase === 'revealed' || state.phase === 'finished',
    scoreboard: getScoreRows(state),
    updatedAt
  };
}
