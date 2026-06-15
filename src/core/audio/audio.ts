export type AudioEvent = 'correct' | 'wrong' | 'round-start' | 'match-finished';

export type AudioSettings = {
  soundEnabled: boolean;
  musicEnabled: boolean;
};

export function shouldPlaySound(settings: AudioSettings, event: AudioEvent) {
  return settings.soundEnabled && event !== 'round-start';
}

export function shouldPlayMusic(settings: AudioSettings, phase: string) {
  return settings.musicEnabled && (phase === 'intro' || phase === 'preparing' || phase === 'playing' || phase === 'revealed');
}

export function getToneForEvent(event: AudioEvent) {
  if (event === 'correct') return { frequency: 660, durationMs: 110 };
  if (event === 'wrong') return { frequency: 180, durationMs: 140 };
  if (event === 'match-finished') return { frequency: 520, durationMs: 180 };
  return { frequency: 420, durationMs: 80 };
}
