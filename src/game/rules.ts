import { isSoloMode } from './modes';
import type {
  GuessResult,
  GuessTheFakeChallenge,
  GuessTheFakeModeId,
  GuessTheFakePlayer,
  GuessTheFakeRound,
  GuessTheFakeScoring,
  GuessTheFakeState,
  GuessTheFakeTeam,
  SpecialRoundKind,
  TableMomentKind
} from './types';

export const POINTS_PER_CORRECT_GUESS = 10;
export const DEFAULT_SPEED_BONUS_POINTS = 5;
export const MAX_STREAK_MULTIPLIER = 3;
export const DEFAULT_SCORING: GuessTheFakeScoring = {
  correctGuessPoints: POINTS_PER_CORRECT_GUESS,
  wrongGuessPenalty: 0,
  speedBonusPoints: DEFAULT_SPEED_BONUS_POINTS
};

// W13-01 table moments.
export const TABLE_MOMENT_KINDS: TableMomentKind[] = ['defend', 'vote', 'change-mind'];
export const TABLE_VOTE_BONUS = 2;

// W13-02 special rounds.
export const SPECIAL_ROUND_INTERVAL = 3;
export const RANDOM_SPECIAL_ROUND_KINDS: SpecialRoundKind[] = [
  'double-or-nothing',
  'gradual-clue',
  'lightning',
  'category-challenge'
];
export const GRADUAL_CLUE_START = 2;
export const GRADUAL_CLUE_BONUS_PER_HIDDEN = 2;
export const LIGHTNING_MIN_SECONDS = 10;
export const CATEGORY_CHALLENGE_MULTIPLIER = 1.5;

export const DEFAULT_CHALLENGE: GuessTheFakeChallenge = { categoryId: 'all', difficulty: 'all', packIds: [] };

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
    currentStreakByTeam: {},
    challenge: DEFAULT_CHALLENGE,
    tableMoments: false,
    tableMoment: null,
    specialRoundsEnabled: false,
    specialRounds: [],
    revealedClues: GRADUAL_CLUE_START
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
    challenge?: Partial<GuessTheFakeChallenge>;
    tableMoments?: boolean;
    specialRounds?: boolean;
    // Recently played or weak rounds: drawn only after every other round.
    deprioritizedRoundIds?: string[];
  }
): GuessTheFakeState {
  const modeId = options.modeId ?? 'classic';
  const solo = isSoloMode(modeId);
  const players = normalizePlayers(solo ? options.playerNames.slice(0, 1) : options.playerNames);
  if (players.length < 1) throw new Error('At least one player is required.');
  if (options.rounds.length < 1) throw new Error('At least one round is required.');
  const teams = modeId === 'teams' ? createBalancedTeams(players) : [];
  const random = options.random ?? Math.random;
  const preparedRounds = prepareRoundsForMatch(options.rounds, {
    shuffle: options.shuffleRounds ?? false,
    random,
    deprioritizedRoundIds: options.deprioritizedRoundIds
  });
  const totalRounds = sanitizeRoundCount(options.totalRounds, preparedRounds.length);
  const specialRoundsEnabled = Boolean(options.specialRounds);

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
    currentStreakByTeam: Object.fromEntries(teams.map(team => [team.id, 0])),
    challenge: {
      categoryId: options.challenge?.categoryId ?? DEFAULT_CHALLENGE.categoryId,
      difficulty: options.challenge?.difficulty ?? DEFAULT_CHALLENGE.difficulty,
      packIds: [...(options.challenge?.packIds ?? [])].sort()
    },
    // Table moments need a table: hidden in solo.
    tableMoments: !solo && Boolean(options.tableMoments),
    tableMoment: null,
    specialRoundsEnabled,
    specialRounds: specialRoundsEnabled ? assignSpecialRounds(totalRounds, random) : Array(totalRounds).fill(null),
    revealedClues: GRADUAL_CLUE_START
  };
}

export function beginPreparation(state: GuessTheFakeState): GuessTheFakeState {
  if (state.phase !== 'intro' && state.phase !== 'revealed') return state;
  return {
    ...state,
    phase: 'preparing',
    selectedStatementId: null,
    lastResult: null,
    roundGuesses: {},
    tableMoment: null,
    revealedClues: GRADUAL_CLUE_START
  };
}

export function beginPlaying(state: GuessTheFakeState): GuessTheFakeState {
  if (state.phase !== 'intro' && state.phase !== 'preparing') return state;
  return { ...state, phase: 'playing', selectedStatementId: null, roundGuesses: {}, tableMoment: null };
}

export function getCurrentRound(state: GuessTheFakeState) {
  return state.rounds[state.currentRoundIndex] ?? null;
}

export function getCurrentSpecialRound(state: GuessTheFakeState): SpecialRoundKind | null {
  return state.specialRounds?.[state.currentRoundIndex] ?? null;
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
  assertStatementVisible(state, round, statementId);

  const scored = scoreGuess(state, round, subject, statementId, scoring, timing, false);
  const roundGuesses = { ...state.roundGuesses, [subject.id]: scored.result };
  const nextSubjectState = advanceGuessSubject(state, roundGuesses);
  const closesRound = shouldRevealAfterGuess(state, roundGuesses);

  return {
    state: {
      ...scored.state,
      ...nextSubjectState,
      phase: closesRound ? (state.tableMoments ? 'discussing' : 'revealed') : 'playing',
      tableMoment: closesRound && state.tableMoments
        ? { kind: getTableMomentKind(state.currentRoundIndex), votedSubjectId: null, changedSubjectIds: [] }
        : null,
      roundGuesses
    },
    result: scored.result
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
    roundGuesses: {},
    tableMoment: null,
    revealedClues: GRADUAL_CLUE_START
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
  // Nothing to defend after a timeout: skip the table moment.
  if (next.phase === 'discussing') next = revealDiscussion(next);
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
  // A solo challenge has a record, not a winner.
  if (isSoloMode(state.modeId)) return [];
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

// Players or teams the table can vote for in a `vote` moment.
export function getVoteCandidates(state: GuessTheFakeState) {
  return state.modeId === 'teams'
    ? state.teams.map(team => ({ kind: 'team' as const, id: team.id, name: team.name }))
    : state.players.map(player => ({ kind: 'player' as const, id: player.id, name: player.name }));
}

export function getTableMomentKind(roundIndex: number): TableMomentKind {
  const index = Number.isInteger(roundIndex) && roundIndex >= 0 ? roundIndex : 0;
  return TABLE_MOMENT_KINDS[index % TABLE_MOMENT_KINDS.length];
}

export function voteInDiscussion(state: GuessTheFakeState, subjectId: string): GuessTheFakeState {
  if (state.phase !== 'discussing' || state.tableMoment?.kind !== 'vote') return state;
  if (!getVoteCandidates(state).some(candidate => candidate.id === subjectId)) return state;
  return { ...state, tableMoment: { ...state.tableMoment, votedSubjectId: subjectId } };
}

// `change-mind`: one change per subject; the new guess loses the speed bonus.
export function changeGuessInDiscussion(
  state: GuessTheFakeState,
  subjectId: string,
  statementId: string,
  scoring: GuessTheFakeScoring = DEFAULT_SCORING
): GuessTheFakeState {
  const round = getCurrentRound(state);
  const moment = state.tableMoment;
  if (!round || state.phase !== 'discussing' || moment?.kind !== 'change-mind') return state;
  if (moment.changedSubjectIds.includes(subjectId)) return state;
  const previous = state.roundGuesses[subjectId];
  if (!previous || previous.selectedStatementId === statementId) return state;
  if (!round.statements.some(statement => statement.id === statementId)) return state;
  assertStatementVisible(state, round, statementId);

  const subject = previous.teamId
    ? { kind: 'team' as const, id: subjectId, name: previous.teamName ?? '' }
    : { kind: 'player' as const, id: subjectId, name: previous.playerName ?? '' };
  const previousStreak = previous.previousStreak ?? 0;
  const undone: GuessTheFakeState = {
    ...state,
    players: subject.kind === 'player'
      ? state.players.map(player => player.id === subjectId ? { ...player, score: player.score - previous.pointsAwarded } : player)
      : state.players,
    teams: subject.kind === 'team'
      ? state.teams.map(team => team.id === subjectId ? { ...team, score: team.score - previous.pointsAwarded } : team)
      : state.teams,
    currentStreakByPlayer: subject.kind === 'player'
      ? { ...state.currentStreakByPlayer, [subjectId]: previousStreak }
      : state.currentStreakByPlayer,
    currentStreakByTeam: subject.kind === 'team'
      ? { ...state.currentStreakByTeam, [subjectId]: previousStreak }
      : state.currentStreakByTeam,
    correctGuessesInMatch: state.correctGuessesInMatch - (previous.correct ? 1 : 0)
  };
  const longestBefore = Math.max(
    previous.longestStreakBefore ?? 0,
    ...Object.values(undone.currentStreakByPlayer),
    ...Object.values(undone.currentStreakByTeam)
  );
  const scored = scoreGuess({ ...undone, longestStreakInMatch: longestBefore }, round, subject, statementId, scoring, {}, true);

  return {
    ...scored.state,
    selectedStatementId: statementId,
    lastResult: scored.result,
    roundGuesses: { ...state.roundGuesses, [subjectId]: scored.result },
    tableMoment: { ...moment, changedSubjectIds: [...moment.changedSubjectIds, subjectId] }
  };
}

export function revealDiscussion(state: GuessTheFakeState): GuessTheFakeState {
  if (state.phase !== 'discussing') return state;
  const votedId = state.tableMoment?.kind === 'vote' ? state.tableMoment.votedSubjectId : null;
  return {
    ...state,
    phase: 'revealed',
    players: votedId
      ? state.players.map(player => player.id === votedId ? { ...player, score: player.score + TABLE_VOTE_BONUS } : player)
      : state.players,
    teams: votedId
      ? state.teams.map(team => team.id === votedId ? { ...team, score: team.score + TABLE_VOTE_BONUS } : team)
      : state.teams
  };
}

// Every SPECIAL_ROUND_INTERVAL rounds one is special; with 3+ rounds the
// last one is always sudden death.
export function assignSpecialRounds(totalRounds: number, random: () => number = Math.random): Array<SpecialRoundKind | null> {
  const count = Number.isFinite(totalRounds) ? Math.max(0, Math.floor(totalRounds)) : 0;
  const specials: Array<SpecialRoundKind | null> = Array.from({ length: count }, (_, index) => {
    if ((index + 1) % SPECIAL_ROUND_INTERVAL !== 0) return null;
    const pick = Math.min(RANDOM_SPECIAL_ROUND_KINDS.length - 1, Math.floor(random() * RANDOM_SPECIAL_ROUND_KINDS.length));
    return RANDOM_SPECIAL_ROUND_KINDS[Math.max(0, pick)];
  });
  if (count >= SPECIAL_ROUND_INTERVAL) specials[count - 1] = 'sudden-death';
  return specials;
}

export function getRoundTimeSeconds(state: GuessTheFakeState, baseSeconds: number) {
  if (getCurrentSpecialRound(state) !== 'lightning') return baseSeconds;
  return Math.max(LIGHTNING_MIN_SECONDS, Math.round(baseSeconds / 3));
}

// `gradual-clue`: statements beyond this count stay hidden.
export function getVisibleStatementCount(state: GuessTheFakeState) {
  const round = getCurrentRound(state);
  if (!round) return 0;
  if (getCurrentSpecialRound(state) !== 'gradual-clue' || state.phase === 'revealed' || state.phase === 'discussing') {
    return round.statements.length;
  }
  return Math.max(1, Math.min(round.statements.length, state.revealedClues ?? GRADUAL_CLUE_START));
}

export function revealNextClue(state: GuessTheFakeState): GuessTheFakeState {
  const round = getCurrentRound(state);
  if (!round || state.phase !== 'playing' || getCurrentSpecialRound(state) !== 'gradual-clue') return state;
  return { ...state, revealedClues: Math.min(round.statements.length, getVisibleStatementCount(state) + 1) };
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
  options: { shuffle: boolean; random?: () => number; deprioritizedRoundIds?: string[] }
) {
  const random = options.random ?? Math.random;
  const cloned = rounds.map(round => ({
    ...round,
    statements: options.shuffle ? shuffleArray(round.statements, random) : [...round.statements]
  }));
  const ordered = options.shuffle ? shuffleArray(cloned, random) : cloned;
  const deprioritized = new Set(options.deprioritizedRoundIds ?? []);
  if (!deprioritized.size) return ordered;
  return [
    ...ordered.filter(round => !deprioritized.has(round.id)),
    ...ordered.filter(round => deprioritized.has(round.id))
  ];
}

function scoreGuess(
  state: GuessTheFakeState,
  round: GuessTheFakeRound,
  subject: { kind: 'player' | 'team'; id: string; name: string },
  statementId: string,
  scoring: GuessTheFakeScoring,
  timing: { remainingSeconds?: number; totalSeconds?: number },
  changedMind: boolean
) {
  const special = getCurrentSpecialRound(state);
  const correct = statementId === round.fakeStatementId;
  const basePoints = correct ? scoring.correctGuessPoints : scoring.wrongGuessPenalty;
  const maxSpeedBonus = (scoring.speedBonusPoints ?? 0) * (special === 'lightning' ? 2 : 1);
  const speedBonus = correct && !changedMind
    ? calculateSpeedBonus(timing.remainingSeconds ?? 0, timing.totalSeconds ?? 0, maxSpeedBonus)
    : 0;
  const previousStreak = subject.kind === 'player'
    ? state.currentStreakByPlayer[subject.id] ?? 0
    : state.currentStreakByTeam[subject.id] ?? 0;
  const currentScore = subject.kind === 'player'
    ? state.players.find(player => player.id === subject.id)?.score ?? 0
    : state.teams.find(team => team.id === subject.id)?.score ?? 0;
  const nextStreak = correct ? previousStreak + 1 : 0;
  const streakMultiplier = correct ? calculateStreakMultiplier(previousStreak) : 1;
  const regularPoints = correct ? Math.round((basePoints + speedBonus) * streakMultiplier) : basePoints;
  const pointsAwarded = applySpecialRound(special, regularPoints, {
    correct,
    currentScore,
    scoring,
    hiddenStatements: round.statements.length - getVisibleStatementCount(state)
  });
  const result: GuessResult = {
    selectedStatementId: statementId,
    fakeStatementId: round.fakeStatementId,
    correct,
    pointsAwarded,
    basePoints,
    speedBonus,
    streakMultiplier,
    previousStreak,
    longestStreakBefore: state.longestStreakInMatch,
    special,
    ...(changedMind ? { changedMind } : {}),
    ...(subject.kind === 'player'
      ? { playerId: subject.id, playerName: subject.name }
      : { teamId: subject.id, teamName: subject.name })
  };

  return {
    result,
    state: {
      ...state,
      players: subject.kind === 'player'
        ? state.players.map(player => player.id === subject.id ? { ...player, score: player.score + pointsAwarded } : player)
        : state.players,
      teams: subject.kind === 'team'
        ? state.teams.map(team => team.id === subject.id ? { ...team, score: team.score + pointsAwarded } : team)
        : state.teams,
      selectedStatementId: statementId,
      lastResult: result,
      correctGuessesInMatch: state.correctGuessesInMatch + (correct ? 1 : 0),
      longestStreakInMatch: Math.max(state.longestStreakInMatch, nextStreak),
      currentStreakByPlayer: subject.kind === 'player'
        ? { ...state.currentStreakByPlayer, [subject.id]: nextStreak }
        : state.currentStreakByPlayer,
      currentStreakByTeam: subject.kind === 'team'
        ? { ...state.currentStreakByTeam, [subject.id]: nextStreak }
        : state.currentStreakByTeam
    } satisfies GuessTheFakeState
  };
}

function applySpecialRound(
  special: SpecialRoundKind | null,
  points: number,
  context: { correct: boolean; currentScore: number; scoring: GuessTheFakeScoring; hiddenStatements: number }
) {
  const floorAtZero = (loss: number) => -Math.min(Math.max(0, context.currentScore), loss);
  switch (special) {
    case 'double-or-nothing':
      return context.correct ? points * 2 : floorAtZero(context.scoring.correctGuessPoints);
    case 'sudden-death':
      return context.correct ? points : floorAtZero(Math.floor(Math.max(0, context.currentScore) / 2));
    case 'gradual-clue':
      return context.correct ? points + Math.max(0, context.hiddenStatements) * GRADUAL_CLUE_BONUS_PER_HIDDEN : points;
    case 'category-challenge':
      return context.correct ? Math.round(points * CATEGORY_CHALLENGE_MULTIPLIER) : points;
    default:
      return points;
  }
}

function assertStatementVisible(state: GuessTheFakeState, round: GuessTheFakeRound, statementId: string) {
  if (!statementId) return;
  const index = round.statements.findIndex(statement => statement.id === statementId);
  if (index >= getVisibleStatementCount(state)) throw new Error('This statement is still hidden.');
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
