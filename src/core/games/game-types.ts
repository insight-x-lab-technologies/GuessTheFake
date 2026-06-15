export type GameMode = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  minPlayers: number;
  maxPlayers: number;
};

export type GameManifest<TState = unknown> = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  defaultModeId: string;
  contentSchemaVersion: number;
  modes: GameMode[];
  createInitialState: () => TState;
};
