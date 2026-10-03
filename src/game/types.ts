export type LocalizedText = string | Record<string, string>;

export type GuessTheFakeStatement = {
  id: string;
  text: LocalizedText;
};

export type GuessTheFakeDifficulty = 'easy' | 'medium' | 'hard';

// 'kids': written for 6-9 year olds (W17-03).
export type GuessTheFakeAgeRating = 'all' | '10+' | 'kids';

// Editorial metadata. Never shown during a match.
export type GuessTheFakeReview = {
  status: 'draft' | 'reviewed';
  reviewedAt?: string;
  notes?: string;
};

export type GuessTheFakeRound = {
  id: string;
  categoryId: string;
  difficulty: GuessTheFakeDifficulty;
  statements: GuessTheFakeStatement[];
  fakeStatementId: string;
  explanation?: LocalizedText;
  ageRating?: GuessTheFakeAgeRating;
  sources?: string[];
  review?: GuessTheFakeReview;
  // W17-01: player who wrote a table ("about us") round. Never saved in packs.
  authorPlayerId?: string;
};

export type GuessTheFakePackContent = {
  categories: Array<{ id: string; title: Record<string, string> }>;
  rounds: GuessTheFakeRound[];
};

export type GuessTheFakePlayer = {
  id: string;
  name: string;
  score: number;
};

export type GuessTheFakeTeam = {
  id: string;
  name: string;
  playerIds: string[];
  score: number;
};

export type GuessTheFakeModeId = 'solo' | 'classic' | 'all-guess' | 'teams' | 'about-us' | 'bluff-master';

export type GuessTheFakePhase = 'setup' | 'intro' | 'preparing' | 'playing' | 'discussing' | 'revealed' | 'finished';

// W13-02: optional round twists, assigned per match by assignSpecialRounds.
export type SpecialRoundKind = 'double-or-nothing' | 'sudden-death' | 'gradual-clue' | 'lightning' | 'category-challenge';

// W13-01: optional table moment between the last guess and the reveal.
export type TableMomentKind = 'defend' | 'vote' | 'change-mind';

export type TableMoment = {
  kind: TableMomentKind;
  // `vote`: player or team the table voted for (gets TABLE_VOTE_BONUS).
  votedSubjectId: string | null;
  // `change-mind`: subjects that already used their one change.
  changedSubjectIds: string[];
};

// What a solo record is compared against; also used for match-level stats.
export type GuessTheFakeChallenge = {
  categoryId: string;
  difficulty: GuessTheFakeDifficulty | 'all';
  // Installed (non-builtin) packs active when the match started.
  packIds: string[];
  // W17-03: kids-only content.
  kids?: boolean;
};

export type GuessTheFakeState = {
  phase: GuessTheFakePhase;
  modeId: GuessTheFakeModeId;
  players: GuessTheFakePlayer[];
  teams: GuessTheFakeTeam[];
  rounds: GuessTheFakeRound[];
  currentRoundIndex: number;
  activePlayerIndex: number;
  activeTeamIndex: number;
  selectedStatementId: string | null;
  totalRounds: number;
  lastResult: GuessResult | null;
  roundGuesses: Record<string, GuessResult>;
  correctGuessesInMatch: number;
  longestStreakInMatch: number;
  currentStreakByPlayer: Record<string, number>;
  currentStreakByTeam: Record<string, number>;
  challenge: GuessTheFakeChallenge;
  tableMoments: boolean;
  tableMoment: TableMoment | null;
  specialRoundsEnabled: boolean;
  // One entry per match round; null for a regular round.
  specialRounds: Array<SpecialRoundKind | null>;
  // `gradual-clue`: how many statements are visible in the current round.
  revealedClues: number;
  // W15-05: every settled guess of the match, appended when a round closes.
  guessHistory: RoundGuessRecord[];
  // W17-01/02: player who bluffs each round (author or bluff master); null
  // in the other modes. The bluffer does not guess and scores per fooled guess.
  bluffers: Array<string | null>;
};

export type RoundGuessRecord = GuessResult & { roundIndex: number };

export type GuessResult = {
  selectedStatementId: string;
  fakeStatementId: string;
  correct: boolean;
  pointsAwarded: number;
  basePoints: number;
  speedBonus: number;
  streakMultiplier: number;
  // Seconds between the statements showing up and the guess; absent on
  // timeouts and on table-moment changes.
  elapsedSeconds?: number;
  // Streak of the subject before this guess; lets a table moment undo it.
  previousStreak?: number;
  longestStreakBefore?: number;
  special?: SpecialRoundKind | null;
  changedMind?: boolean;
  playerId?: string;
  playerName?: string;
  teamId?: string;
  teamName?: string;
};

export type GuessTheFakeScoring = {
  correctGuessPoints: number;
  wrongGuessPenalty: number;
  speedBonusPoints?: number;
};
