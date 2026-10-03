export const GAME_ID = 'guess-the-fake';

export type GameMode = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  minPlayers: number;
  maxPlayers: number;
  // Personal challenge: one player, fixed rounds, personal record.
  solo: boolean;
};

export const GAME_MODES: GameMode[] = [
  {
    id: 'solo',
    titleKey: 'modes.solo.title',
    descriptionKey: 'modes.solo.description',
    minPlayers: 1,
    maxPlayers: 1,
    solo: true
  },
  {
    id: 'classic',
    titleKey: 'modes.classic.title',
    descriptionKey: 'modes.classic.description',
    minPlayers: 1,
    maxPlayers: 8,
    solo: false
  },
  {
    id: 'all-guess',
    titleKey: 'modes.allGuess.title',
    descriptionKey: 'modes.allGuess.description',
    minPlayers: 2,
    maxPlayers: 8,
    solo: false
  },
  {
    id: 'teams',
    titleKey: 'modes.teams.title',
    descriptionKey: 'modes.teams.description',
    minPlayers: 2,
    maxPlayers: 8,
    solo: false
  }
];

// Screens and rules ask this, never `players.length`.
export function isSoloMode(modeId: string) {
  return GAME_MODES.some(mode => mode.id === modeId && mode.solo);
}
