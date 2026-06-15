export type LocalizedText = string | Record<string, string>;

export type GuessTheFakeStatement = {
  id: string;
  text: LocalizedText;
};

export type GuessTheFakeDifficulty = 'easy' | 'medium' | 'hard';

export type GuessTheFakeRound = {
  id: string;
  categoryId: string;
  difficulty: GuessTheFakeDifficulty;
  statements: GuessTheFakeStatement[];
  fakeStatementId: string;
  explanation?: LocalizedText;
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

export type GuessTheFakeModeId = 'classic' | 'all-guess' | 'teams';

export type GuessTheFakePhase = 'setup' | 'intro' | 'preparing' | 'playing' | 'revealed' | 'finished';

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
};

export type GuessResult = {
  selectedStatementId: string;
  fakeStatementId: string;
  correct: boolean;
  pointsAwarded: number;
  basePoints: number;
  speedBonus: number;
  streakMultiplier: number;
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
