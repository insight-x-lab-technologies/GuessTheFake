import type { MultiplayerBoard, MultiplayerGameSnapshot } from '../core/multiplayer/multiplayer';
import { GAME_ID } from '../game/modes';
import { getActiveGuessSubject, getCurrentRound, getCurrentSpecialRound, getVisibleStatementCount } from '../game/rules';
import type { GuessResult, GuessTheFakeState, LocalizedText } from '../game/types';
import type { LocalizeText, Translate } from './app-types';

export function getScoreRows(state: GuessTheFakeState) {
  return state.modeId === 'teams' && state.teams.length
    ? state.teams.map(team => ({ name: team.name, score: team.score }))
    : state.players.map(player => ({ name: player.name, score: player.score }));
}

// Players behind a guess: the player, or every member of the team.
export function getResultPlayerNames(state: GuessTheFakeState, result: GuessResult) {
  if (result.playerId) {
    const player = state.players.find(candidate => candidate.id === result.playerId);
    return player ? [player.name] : result.playerName ? [result.playerName] : [];
  }
  const team = state.teams.find(candidate => candidate.id === result.teamId);
  return team
    ? team.playerIds.map(id => state.players.find(player => player.id === id)?.name).filter((name): name is string => Boolean(name))
    : [];
}

export function getPlayerCounterKey(name: string) {
  return name.trim().toLocaleLowerCase();
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

// W13-06: localized board for a presenter screen. Statements only appear
// while they are on the table; the fake is marked only after the reveal.
export function buildPresenterBoard(
  state: GuessTheFakeState,
  options: { t: Translate; text: LocalizeText; categoryTitle?: LocalizedText }
): MultiplayerBoard | null {
  const round = getCurrentRound(state);
  if (!round || !['playing', 'discussing', 'revealed'].includes(state.phase)) return null;
  const { t, text } = options;
  const revealed = state.phase === 'revealed';
  const visible = getVisibleStatementCount(state);
  const special = getCurrentSpecialRound(state);
  const guesses = Object.values(state.roundGuesses);
  return {
    prompt: revealed
      ? t('game.revealedPrompt')
      : state.phase === 'discussing' && state.tableMoment
        ? t(`moments.${state.tableMoment.kind}.title`)
        : t('game.chooseFake'),
    caption: options.categoryTitle ? text(options.categoryTitle, round.categoryId) : round.categoryId,
    badge: special ? t(`specials.${special}.title`) : undefined,
    explanation: revealed ? text(round.explanation) : undefined,
    items: round.statements.map((statement, index) => {
      const pickedBy = guesses
        .filter(guess => guess.selectedStatementId === statement.id)
        .map(guess => guess.teamName ?? guess.playerName)
        .filter(Boolean)
        .join(', ');
      const isFake = statement.id === round.fakeStatementId;
      if (index >= visible) return { id: statement.id, text: '', state: 'hidden' as const };
      return {
        id: statement.id,
        text: text(statement.text),
        state: revealed && isFake ? 'fake' as const : revealed && pickedBy ? 'wrong' as const : !revealed && pickedBy && state.phase === 'discussing' ? 'picked' as const : 'idle' as const,
        label: revealed && isFake ? t('game.fakeLabel') : (revealed || state.phase === 'discussing') && pickedBy ? pickedBy : undefined
      };
    })
  };
}

export function buildMultiplayerSnapshot(
  state: GuessTheFakeState,
  timerSeconds: number,
  updatedAt = new Date().toISOString(),
  board: MultiplayerBoard | null = null
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
    board,
    updatedAt
  };
}
