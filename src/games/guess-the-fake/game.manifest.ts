import type { GameManifest } from '../../core/games/game-types';
import { createInitialGuessTheFakeState } from './rules';
import type { GuessTheFakeState } from './types';

export const guessTheFakeManifest: GameManifest<GuessTheFakeState> = {
  id: 'guess-the-fake',
  titleKey: 'game.title',
  descriptionKey: 'game.description',
  defaultModeId: 'classic',
  contentSchemaVersion: 1,
  modes: [
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
  ],
  createInitialState: createInitialGuessTheFakeState
};
