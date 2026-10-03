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

export type PodiumEntry = { id: string; name: string; score: number; rank: number };

// W15-05: players (or teams) by score. Ties share a rank (1, 1, 3).
export function getPodium(state: GuessTheFakeState): { podium: PodiumEntry[]; rest: PodiumEntry[] } {
  const rows = state.modeId === 'teams' && state.teams.length
    ? state.teams.map(team => ({ id: team.id, name: team.name, score: team.score }))
    : state.players.map(player => ({ id: player.id, name: player.name, score: player.score }));
  const ranked = [...rows]
    .sort((left, right) => right.score - left.score)
    .map((row, _, sorted) => ({ ...row, rank: sorted.findIndex(candidate => candidate.score === row.score) + 1 }));
  return { podium: ranked.slice(0, 3), rest: ranked.slice(3) };
}

export type MatchHighlight =
  | { kind: 'fastest'; name: string; seconds: number }
  | { kind: 'longest-streak'; name: string; streak: number }
  | { kind: 'best-bluff'; fooled: number; text: LocalizedText };

// W15-05: table highlights of a finished match, from its guess history.
export function getMatchHighlights(state: GuessTheFakeState): MatchHighlight[] {
  const history = state.guessHistory ?? [];
  const nameOf = (guess: GuessResult) => guess.teamName ?? guess.playerName ?? '';
  const highlights: MatchHighlight[] = [];

  const timings = new Map<string, number[]>();
  history.forEach(guess => {
    if (!guess.correct || guess.elapsedSeconds === undefined || !nameOf(guess)) return;
    timings.set(nameOf(guess), [...(timings.get(nameOf(guess)) ?? []), guess.elapsedSeconds]);
  });
  const fastest = [...timings.entries()]
    .map(([name, seconds]) => ({ name, seconds: seconds.reduce((sum, value) => sum + value, 0) / seconds.length }))
    .reduce<{ name: string; seconds: number } | null>((best, entry) => (!best || entry.seconds < best.seconds ? entry : best), null);
  if (fastest) highlights.push({ kind: 'fastest', name: fastest.name, seconds: Math.max(1, Math.round(fastest.seconds)) });

  const runs = new Map<string, { current: number; best: number }>();
  history.forEach(guess => {
    const name = nameOf(guess);
    if (!name) return;
    const run = runs.get(name) ?? { current: 0, best: 0 };
    run.current = guess.correct ? run.current + 1 : 0;
    run.best = Math.max(run.best, run.current);
    runs.set(name, run);
  });
  const streak = [...runs.entries()].reduce<{ name: string; streak: number } | null>(
    (best, [name, run]) => (run.best >= 2 && (!best || run.best > best.streak) ? { name, streak: run.best } : best),
    null
  );
  if (streak) highlights.push({ kind: 'longest-streak', ...streak });

  const fooledByRound = new Map<number, number>();
  history.forEach(guess => {
    if (guess.correct || !guess.selectedStatementId) return;
    fooledByRound.set(guess.roundIndex, (fooledByRound.get(guess.roundIndex) ?? 0) + 1);
  });
  const bluff = [...fooledByRound.entries()].reduce<{ roundIndex: number; fooled: number } | null>(
    (best, [roundIndex, fooled]) => (!best || fooled > best.fooled ? { roundIndex, fooled } : best),
    null
  );
  const bluffRound = bluff ? state.rounds[bluff.roundIndex] : undefined;
  const fakeStatement = bluffRound?.statements.find(statement => statement.id === bluffRound.fakeStatementId);
  if (bluff && fakeStatement) highlights.push({ kind: 'best-bluff', fooled: bluff.fooled, text: fakeStatement.text });

  return highlights;
}
