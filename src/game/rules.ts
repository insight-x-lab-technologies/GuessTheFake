import type {
  GuessResult,
  GuessTheFakeModeId,
  GuessTheFakePlayer,
  GuessTheFakeRound,
  GuessTheFakeScoring,
  GuessTheFakeState,
  GuessTheFakeTeam
} from './types';

export const POINTS_PER_CORRECT_GUESS = 10;
export const DEFAULT_SPEED_BONUS_POINTS = 5;
export const MAX_STREAK_MULTIPLIER = 3;
export const DEFAULT_SCORING: GuessTheFakeScoring = {
  correctGuessPoints: POINTS_PER_CORRECT_GUESS,
  wrongGuessPenalty: 0,
  speedBonusPoints: DEFAULT_SPEED_BONUS_POINTS
};

export function createInitialGuessTheFakeState(): GuessTheFakeState {
  return {
    phase: 'setup',
    modeId: 'classic',
    players: [
      { id: 'player-1', name: 'Jogador 1', score: 0 },
      { id: 'player-2', name: 'Jogador 2', score: 0 }
    ],
    teams: [],
    rounds: [],
    currentRoundIndex: 0,
    activePlayerIndex: 0,
    activeTeamIndex: 0,
    selectedStatementId: null,
    totalRounds: 5,
    lastResult: null,
    roundGuesses: {},
    correctGuessesInMatch: 0,
    longestStreakInMatch: 0,
    currentStreakByPlayer: {},
    currentStreakByTeam: {}
  };
}

export function normalizePlayers(names: string[]): GuessTheFakePlayer[] {
  return names
    .map((name, index) => ({
      id: `player-${index + 1}`,
      name: name.trim() || `Jogador ${index + 1}`,
      score: 0
    }))
    .slice(0, 8);
}

export function startMatch(
  state: GuessTheFakeState,
  options: {
    playerNames: string[];
    totalRounds: number;
    rounds: GuessTheFakeRound[];
    modeId?: GuessTheFakeModeId;
    shuffleRounds?: boolean;
    random?: () => number;
  }
): GuessTheFakeState {
  const players = normalizePlayers(options.playerNames);
  if (players.length < 1) throw new Error('At least one player is required.');
  if (options.rounds.length < 1) throw new Error('At least one round is required.');
  const modeId = options.modeId ?? 'classic';
  const teams = modeId === 'teams' ? createBalancedTeams(players) : [];
  const random = options.random ?? Math.random;
  const preparedRounds = prepareRoundsForMatch(options.rounds, {
    shuffle: options.shuffleRounds ?? false,
    random
  });
  const totalRounds = sanitizeRoundCount(options.totalRounds, preparedRounds.length);

  return {
    ...state,
    phase: 'intro',
    modeId,
    players,
    teams,
    rounds: preparedRounds.slice(0, totalRounds),
    totalRounds,
    currentRoundIndex: 0,
    activePlayerIndex: 0,
    activeTeamIndex: 0,
    selectedStatementId: null,
    lastResult: null,
    roundGuesses: {},
    correctGuessesInMatch: 0,
    longestStreakInMatch: 0,
    currentStreakByPlayer: Object.fromEntries(players.map(player => [player.id, 0])),
    currentStreakByTeam: Object.fromEntries(teams.map(team => [team.id, 0]))
  };
}

export function beginPreparation(state: GuessTheFakeState): GuessTheFakeState {
  if (state.phase !== 'intro' && state.phase !== 'revealed') return state;
  return { ...state, phase: 'preparing', selectedStatementId: null, lastResult: null, roundGuesses: {} };
}

export function beginPlaying(state: GuessTheFakeState): GuessTheFakeState {
  if (state.phase !== 'intro' && state.phase !== 'preparing') return state;
  return { ...state, phase: 'playing', selectedStatementId: null, roundGuesses: {} };
}

export function getCurrentRound(state: GuessTheFakeState) {
  return state.rounds[state.currentRoundIndex] ?? null;
}

export function submitGuess(
  state: GuessTheFakeState,
  statementId: string,
  scoring: GuessTheFakeScoring = DEFAULT_SCORING,
  timing: { remainingSeconds?: number; totalSeconds?: number } = {}
): { state: GuessTheFakeState; result: GuessResult } {
  const round = getCurrentRound(state);
  if (!round) throw new Error('No active round.');
  if (state.phase !== 'playing') throw new Error('Guesses can only be submitted while playing.');

  const subject = getActiveGuessSubject(state);
  if (!subject) throw new Error('No active guess subject.');
  if (state.roundGuesses[subject.id]) throw new Error('This participant already guessed this round.');
  const correct = statementId === round.fakeStatementId;
  const basePoints = correct ? scoring.correctGuessPoints : scoring.wrongGuessPenalty;
  const speedBonus = correct
    ? calculateSpeedBonus(timing.remainingSeconds ?? 0, timing.totalSeconds ?? 0, scoring.speedBonusPoints ?? 0)
    : 0;
  const previousStreak = subject.kind === 'player'
    ? state.currentStreakByPlayer[subject.id] ?? 0
    : state.currentStreakByTeam[subject.id] ?? 0;
  const nextStreak = correct ? previousStreak + 1 : 0;
  const streakMultiplier = correct ? calculateStreakMultiplier(previousStreak) : 1;
  const pointsAwarded = correct ? Math.round((basePoints + speedBonus) * streakMultiplier) : basePoints;
  const currentStreakByPlayer = subject.kind === 'player'
    ? { ...state.currentStreakByPlayer, [subject.id]: nextStreak }
    : state.currentStreakByPlayer;
  const currentStreakByTeam = subject.kind === 'team'
    ? { ...state.currentStreakByTeam, [subject.id]: nextStreak }
    : state.currentStreakByTeam;
  const players = subject.kind === 'player'
    ? state.players.map(player => player.id === subject.id ? { ...player, score: player.score + pointsAwarded } : player)
    : state.players;
  const teams = subject.kind === 'team'
    ? state.teams.map(team => team.id === subject.id ? { ...team, score: team.score + pointsAwarded } : team)
    : state.teams;

  const result = {
    selectedStatementId: statementId,
    fakeStatementId: round.fakeStatementId,
    correct,
    pointsAwarded,
    basePoints,
    speedBonus,
    streakMultiplier,
    ...(subject.kind === 'player'
      ? { playerId: subject.id, playerName: subject.name }
      : { teamId: subject.id, teamName: subject.name })
  };
  const roundGuesses = { ...state.roundGuesses, [subject.id]: result };
  const nextSubjectState = advanceGuessSubject(state, roundGuesses);

  return {
    state: {
      ...state,
      ...nextSubjectState,
      phase: shouldRevealAfterGuess(state, roundGuesses) ? 'revealed' : 'playing',
      players,
      teams,
      selectedStatementId: statementId,
      lastResult: result,
      roundGuesses,
      correctGuessesInMatch: state.correctGuessesInMatch + (correct ? 1 : 0),
      longestStreakInMatch: Math.max(state.longestStreakInMatch, nextStreak),
      currentStreakByPlayer,
      currentStreakByTeam
    },
    result
  };
}

export function advanceRound(state: GuessTheFakeState): GuessTheFakeState {
  if (state.phase !== 'revealed') return state;
  const nextRoundIndex = state.currentRoundIndex + 1;
  const isFinished = nextRoundIndex >= state.totalRounds;

  return {
    ...state,
    phase: isFinished ? 'finished' : 'intro',
    currentRoundIndex: nextRoundIndex,
    activePlayerIndex: (state.activePlayerIndex + 1) % state.players.length,
    activeTeamIndex: state.teams.length ? (state.activeTeamIndex + 1) % state.teams.length : 0,
    selectedStatementId: null,
    lastResult: null,
    roundGuesses: {}
  };
}

export function timeOutRound(state: GuessTheFakeState, scoring: GuessTheFakeScoring = DEFAULT_SCORING) {
  const round = getCurrentRound(state);
  if (!round) throw new Error('No active round.');
  if (state.phase !== 'playing') throw new Error('Timeout can only happen while playing.');

  let next = state;
  while (next.phase === 'playing') {
    next = submitGuess(next, '', scoring, { remainingSeconds: 0, totalSeconds: 0 }).state;
  }
  return { state: next, result: next.lastResult };
}

export function recalibrateScores(state: GuessTheFakeState): GuessTheFakeState {
  return {
    ...state,
    players: state.players.map(player => ({ ...player, score: 0 })),
    teams: state.teams.map(team => ({ ...team, score: 0 }))
  };
}

export function getWinners(state: GuessTheFakeState) {
  if (state.modeId === 'teams' && state.teams.length) {
    const bestTeamScore = Math.max(...state.teams.map(team => team.score));
    return state.teams.filter(team => team.score === bestTeamScore);
  }
  const bestScore = Math.max(...state.players.map(player => player.score));
  return state.players.filter(player => player.score === bestScore);
}

export function getActiveGuessSubject(state: GuessTheFakeState) {
  if (state.modeId === 'teams') {
    const team = state.teams[state.activeTeamIndex];
    return team ? { kind: 'team' as const, id: team.id, name: team.name } : null;
  }
  const player = state.players[state.activePlayerIndex];
  return player ? { kind: 'player' as const, id: player.id, name: player.name } : null;
}

export function getPendingGuessSubjects(state: GuessTheFakeState) {
  if (state.modeId === 'teams') {
    const team = state.teams[state.activeTeamIndex];
    return team && !state.roundGuesses[team.id] ? [{ kind: 'team' as const, id: team.id, name: team.name }] : [];
  }
  if (state.modeId === 'all-guess') {
    return state.players
      .filter(player => !state.roundGuesses[player.id])
      .map(player => ({ kind: 'player' as const, id: player.id, name: player.name }));
  }
  const player = state.players[state.activePlayerIndex];
  return player && !state.roundGuesses[player.id] ? [{ kind: 'player' as const, id: player.id, name: player.name }] : [];
}

export function calculateSpeedBonus(remainingSeconds: number, totalSeconds: number, maxBonus: number) {
  if (!Number.isFinite(remainingSeconds) || !Number.isFinite(totalSeconds) || !Number.isFinite(maxBonus)) return 0;
  if (remainingSeconds <= 0 || totalSeconds <= 0 || maxBonus <= 0) return 0;
  return Math.max(0, Math.min(maxBonus, Math.ceil((remainingSeconds / totalSeconds) * maxBonus)));
}

export function calculateStreakMultiplier(previousStreak: number) {
  if (!Number.isFinite(previousStreak) || previousStreak < 2) return 1;
  return Math.min(MAX_STREAK_MULTIPLIER, 1 + Math.floor(previousStreak / 2) * 0.5);
}

export function sanitizeRoundCount(value: number, availableRounds: number, maxRounds = 30) {
  if (!Number.isFinite(value)) return Math.min(1, availableRounds);
  return Math.max(1, Math.min(maxRounds, availableRounds, Math.floor(value)));
}

export function prepareRoundsForMatch(
  rounds: GuessTheFakeRound[],
  options: { shuffle: boolean; random?: () => number }
) {
  const random = options.random ?? Math.random;
  const cloned = rounds.map(round => ({
    ...round,
    statements: options.shuffle ? shuffleArray(round.statements, random) : [...round.statements]
  }));

  return options.shuffle ? shuffleArray(cloned, random) : cloned;
}

function shuffleArray<T>(items: T[], random: () => number) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function createBalancedTeams(players: GuessTheFakePlayer[]): GuessTheFakeTeam[] {
  const teamCount = players.length >= 4 ? 2 : Math.min(2, players.length);
  return Array.from({ length: teamCount }, (_, index) => ({
    id: `team-${index + 1}`,
    name: `Time ${index + 1}`,
    playerIds: players.filter((_, playerIndex) => playerIndex % teamCount === index).map(player => player.id),
    score: 0
  }));
}

function shouldRevealAfterGuess(state: GuessTheFakeState, roundGuesses: Record<string, GuessResult>) {
  if (state.modeId === 'all-guess') return state.players.every(player => roundGuesses[player.id]);
  const subject = getActiveGuessSubject(state);
  return Boolean(subject && roundGuesses[subject.id]);
}

function advanceGuessSubject(state: GuessTheFakeState, roundGuesses: Record<string, GuessResult>) {
  if (state.modeId !== 'all-guess') return {};
  const nextPlayerIndex = state.players.findIndex(player => !roundGuesses[player.id]);
  return nextPlayerIndex >= 0 ? { activePlayerIndex: nextPlayerIndex } : {};
}
