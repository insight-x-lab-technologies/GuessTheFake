import { createStorageKey, readVersioned, removeStored, writeVersioned, type StorageAdapter } from '../core/storage/storage';
import type { Language } from '../core/i18n/i18n';
import { DEFAULT_CHALLENGE, GRADUAL_CLUE_START } from './rules';
import type { GuessTheFakeModeId, GuessTheFakePhase, GuessTheFakeState, SpecialRoundKind, TableMomentKind } from './types';

export type PersistedGuessTheFakeMatch = {
  state: GuessTheFakeState;
  activeMatchLanguage: Language;
  timerSeconds: number;
};

export const GUESS_THE_FAKE_QUICK_GAME_VERSION = 1;
export const GUESS_THE_FAKE_QUICK_GAME_KEY = createStorageKey(
  'game.guess-the-fake',
  'quick-game',
  GUESS_THE_FAKE_QUICK_GAME_VERSION
);

const activePhases: GuessTheFakePhase[] = ['intro', 'preparing', 'playing', 'discussing', 'revealed'];
const modes: GuessTheFakeModeId[] = ['solo', 'classic', 'all-guess', 'teams', 'about-us', 'bluff-master'];
const specialKinds: SpecialRoundKind[] = ['double-or-nothing', 'sudden-death', 'gradual-clue', 'lightning', 'category-challenge'];
const momentKinds: TableMomentKind[] = ['defend', 'vote', 'change-mind'];
const languages: Language[] = ['pt', 'en', 'es', 'fr', 'de', 'it'];

export function loadPersistedGuessTheFakeMatch(storage: StorageAdapter = localStorage): PersistedGuessTheFakeMatch | null {
  return normalizePersistedMatch(
    readVersioned<PersistedGuessTheFakeMatch | null>(
      storage,
      GUESS_THE_FAKE_QUICK_GAME_KEY,
      null,
      GUESS_THE_FAKE_QUICK_GAME_VERSION
    )
  );
}

export function savePersistedGuessTheFakeMatch(
  match: PersistedGuessTheFakeMatch,
  storage: StorageAdapter = localStorage
) {
  const normalized = normalizePersistedMatch(match);
  if (!normalized) {
    clearPersistedGuessTheFakeMatch(storage);
    return;
  }

  writeVersioned(storage, GUESS_THE_FAKE_QUICK_GAME_KEY, normalized, GUESS_THE_FAKE_QUICK_GAME_VERSION);
}

export function clearPersistedGuessTheFakeMatch(storage: StorageAdapter = localStorage) {
  removeStored(storage, GUESS_THE_FAKE_QUICK_GAME_KEY);
}

function normalizePersistedMatch(value: PersistedGuessTheFakeMatch | null): PersistedGuessTheFakeMatch | null {
  if (!value || typeof value !== 'object') return null;
  if (!languages.includes(value.activeMatchLanguage)) return null;
  if (!Number.isFinite(value.timerSeconds) || value.timerSeconds < 0) return null;
  if (!isValidState(value.state)) return null;
  const state = withOnda13Defaults(value.state);
  if (state.phase === 'discussing' && !state.tableMoment) return null;

  return {
    activeMatchLanguage: value.activeMatchLanguage,
    timerSeconds: Math.floor(value.timerSeconds),
    state
  };
}

// Matches saved before the solo mode and Onda 13 lack these fields.
function withOnda13Defaults(state: GuessTheFakeState): GuessTheFakeState {
  const challenge = state.challenge && typeof state.challenge === 'object' ? state.challenge : DEFAULT_CHALLENGE;
  const specialRounds = Array.isArray(state.specialRounds) && state.specialRounds.length === state.rounds.length
    ? state.specialRounds.map(kind => (specialKinds.includes(kind as SpecialRoundKind) ? kind : null))
    : Array(state.rounds.length).fill(null);
  const moment = state.tableMoment;
  return {
    ...state,
    challenge: {
      categoryId: typeof challenge.categoryId === 'string' ? challenge.categoryId : DEFAULT_CHALLENGE.categoryId,
      difficulty: ['easy', 'medium', 'hard', 'all'].includes(challenge.difficulty) ? challenge.difficulty : 'all',
      packIds: Array.isArray(challenge.packIds) ? challenge.packIds.filter(id => typeof id === 'string') : [],
      ...(challenge.kids === true ? { kids: true } : {})
    },
    tableMoments: state.tableMoments === true,
    tableMoment: moment && typeof moment === 'object' && momentKinds.includes(moment.kind)
      ? {
        kind: moment.kind,
        votedSubjectId: typeof moment.votedSubjectId === 'string' ? moment.votedSubjectId : null,
        changedSubjectIds: Array.isArray(moment.changedSubjectIds) ? moment.changedSubjectIds : []
      }
      : null,
    specialRoundsEnabled: state.specialRoundsEnabled === true,
    specialRounds,
    revealedClues: Number.isInteger(state.revealedClues) && state.revealedClues >= 1 ? state.revealedClues : GRADUAL_CLUE_START,
    // Matches saved before Onda 15 have no guess history.
    guessHistory: Array.isArray(state.guessHistory)
      ? state.guessHistory.filter(entry => entry && typeof entry === 'object' && Number.isInteger(entry.roundIndex))
      : [],
    // Matches saved before Onda 17 have no bluffers.
    bluffers: Array.isArray(state.bluffers) && state.bluffers.length === state.rounds.length
      ? state.bluffers.map(id => (typeof id === 'string' ? id : null))
      : Array(state.rounds.length).fill(null)
  };
}

function isValidState(state: GuessTheFakeState): state is GuessTheFakeState {
  return Boolean(
    state &&
    typeof state === 'object' &&
    activePhases.includes(state.phase) &&
    modes.includes(state.modeId) &&
    Array.isArray(state.players) &&
    state.players.length >= 1 &&
    state.players.every(player => typeof player.id === 'string' && typeof player.name === 'string' && typeof player.score === 'number') &&
    Array.isArray(state.teams) &&
    state.teams.every(team => typeof team.id === 'string' && typeof team.name === 'string' && Array.isArray(team.playerIds) && typeof team.score === 'number') &&
    Array.isArray(state.rounds) &&
    state.rounds.length >= 1 &&
    Number.isInteger(state.currentRoundIndex) &&
    state.currentRoundIndex >= 0 &&
    state.currentRoundIndex < state.rounds.length &&
    Number.isInteger(state.totalRounds) &&
    state.totalRounds >= 1 &&
    state.totalRounds <= state.rounds.length &&
    Number.isInteger(state.activePlayerIndex) &&
    state.activePlayerIndex >= 0 &&
    state.activePlayerIndex < state.players.length &&
    Number.isInteger(state.activeTeamIndex) &&
    state.activeTeamIndex >= 0 &&
    (state.selectedStatementId === null || typeof state.selectedStatementId === 'string') &&
    (state.lastResult === null || typeof state.lastResult === 'object') &&
    state.roundGuesses &&
    typeof state.roundGuesses === 'object' &&
    typeof state.correctGuessesInMatch === 'number' &&
    typeof state.longestStreakInMatch === 'number' &&
    state.currentStreakByPlayer &&
    typeof state.currentStreakByPlayer === 'object' &&
    state.currentStreakByTeam &&
    typeof state.currentStreakByTeam === 'object'
  );
}
