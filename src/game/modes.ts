export const GAME_ID = 'guess-the-fake';

export type GameMode = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  minPlayers: number;
  maxPlayers: number;
};

export const GAME_MODES: GameMode[] = [
  {
    id: 'classic',
    titleKey: 'modes.classic.title',
    descriptionKey: 'modes.classic.description',
    minPlayers: 1,
    maxPlayers: 8
  },
  {
    id: 'all-guess',
    titleKey: 'modes.allGuess.title',
    descriptionKey: 'modes.allGuess.description',
    minPlayers: 2,
    maxPlayers: 8
  },
  {
    id: 'teams',
    titleKey: 'modes.teams.title',
    descriptionKey: 'modes.teams.description',
    minPlayers: 2,
    maxPlayers: 8
  }
];
