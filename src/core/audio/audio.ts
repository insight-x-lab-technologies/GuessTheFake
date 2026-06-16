export type AudioEvent =
  | 'correct'
  | 'wrong'
  | 'round-start'
  | 'match-finished'
  | 'ui-click'
  | 'navigation'
  | 'card-select'
  | 'preview';

export type MusicZone = 'menu' | 'gameplay' | 'silent';

export type AudioSettings = {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume?: number;
  musicVolume?: number;
};

export type ThemeAudioTrackId = 'cosmic' | 'spring' | 'autumn';

export type ThemeAudioTracks = Record<ThemeAudioTrackId, Record<Exclude<MusicZone, 'silent'>, string>>;

export type PlatformAudioService = {
  unlock: () => void;
  isUnlocked: () => boolean;
  syncMusic: (options: {
    settings: AudioSettings;
    themeId: string;
    zone: MusicZone;
    reducedMotion?: boolean;
  }) => void;
  playEvent: (event: AudioEvent, settings: AudioSettings) => void;
  stopMusic: () => void;
  dispose: () => void;
};

export function shouldPlaySound(settings: AudioSettings, event: AudioEvent) {
  return settings.soundEnabled && event !== 'round-start';
}

export function shouldPlayMusic(settings: AudioSettings, zone: MusicZone) {
  return settings.musicEnabled && zone !== 'silent';
}

export function getMusicZone(screen: string, phase: string): MusicZone {
  if (screen !== 'play') return 'menu';
  if (phase === 'setup' || phase === 'finished') return 'menu';
  if (phase === 'intro' || phase === 'preparing' || phase === 'playing' || phase === 'revealed') return 'gameplay';
  return 'silent';
}

export function getTrackThemeId(themeId: string): ThemeAudioTrackId {
  if (themeId === 'spring' || themeId === 'material3' || themeId === 'light-mode') return 'spring';
  if (themeId === 'autumn' || themeId === 'liquid-glass') return 'autumn';
  return 'cosmic';
}

export function clampAudioVolume(value: number | undefined, fallback: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(1, Math.max(0, value));
}

export function getToneForEvent(event: AudioEvent) {
  if (event === 'correct') return { frequency: 660, durationMs: 110 };
  if (event === 'wrong') return { frequency: 180, durationMs: 140 };
  if (event === 'match-finished') return { frequency: 520, durationMs: 180 };
  if (event === 'navigation') return { frequency: 480, durationMs: 55 };
  if (event === 'card-select') return { frequency: 560, durationMs: 70 };
  if (event === 'preview') return { frequency: 620, durationMs: 120 };
  return { frequency: 420, durationMs: 80 };
}

export function createPlatformAudioService(options: { tracks: ThemeAudioTracks }): PlatformAudioService {
  let unlocked = false;
  let audioContext: AudioContext | null = null;
  let music: HTMLAudioElement | null = null;
  let currentTrackUrl = '';
  let fadeTimer: number | null = null;
  let lastEventAt = 0;
  let lastEvent: AudioEvent | null = null;

  const clearFade = () => {
    if (fadeTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(fadeTimer);
    }
    fadeTimer = null;
  };

  const fadeTo = (targetVolume: number, durationMs: number, afterFade?: () => void) => {
    if (!music) {
      afterFade?.();
      return;
    }
    clearFade();
    if (durationMs <= 0 || typeof window === 'undefined') {
      music.volume = targetVolume;
      afterFade?.();
      return;
    }

    const startingVolume = music.volume;
    const startedAt = performance.now();
    fadeTimer = window.setInterval(() => {
      if (!music) {
        clearFade();
        return;
      }
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      music.volume = startingVolume + (targetVolume - startingVolume) * progress;
      if (progress >= 1) {
        clearFade();
        afterFade?.();
      }
    }, 40);
  };

  const ensureContext = () => {
    if (typeof window === 'undefined') return null;
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return null;
    audioContext = audioContext ?? new AudioContextConstructor();
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => undefined);
    }
    return audioContext;
  };

  return {
    unlock() {
      unlocked = true;
      ensureContext();
    },

    isUnlocked() {
      return unlocked;
    },

    syncMusic({ settings, themeId, zone, reducedMotion = false }) {
      if (!unlocked || typeof Audio === 'undefined' || zone === 'silent' || !shouldPlayMusic(settings, zone)) {
        this.stopMusic();
        return;
      }

      const trackTheme = getTrackThemeId(themeId);
      const trackUrl = options.tracks[trackTheme][zone];
      const targetVolume = clampAudioVolume(settings.musicVolume, 0.35);
      const fadeMs = reducedMotion ? 0 : 260;

      if (currentTrackUrl !== trackUrl) {
        const startNextTrack = () => {
          music?.pause();
          music = new Audio(trackUrl);
          music.loop = true;
          music.volume = 0;
          currentTrackUrl = trackUrl;
          music.play().catch(() => undefined);
          fadeTo(targetVolume, fadeMs);
        };

        if (music) {
          fadeTo(0, fadeMs, startNextTrack);
          return;
        }

        startNextTrack();
        return;
      }

      const currentMusic = music;
      if (!currentMusic) return;
      if (currentMusic.paused) currentMusic.play().catch(() => undefined);
      fadeTo(targetVolume, fadeMs);
    },

    playEvent(event, settings) {
      if (!unlocked || !shouldPlaySound(settings, event)) return;
      if (typeof performance !== 'undefined') {
        const now = performance.now();
        if (lastEvent === event && now - lastEventAt < 70) return;
        lastEvent = event;
        lastEventAt = now;
      }

      const context = ensureContext();
      if (!context) return;
      try {
        const tone = getToneForEvent(event);
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.value = tone.frequency;
        oscillator.type = event === 'wrong' ? 'sawtooth' : 'sine';
        gain.gain.value = 0.12 * clampAudioVolume(settings.soundVolume, 0.65);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + tone.durationMs / 1000);
      } catch {
        undefined;
      }
    },

    stopMusic() {
      clearFade();
      music?.pause();
    },

    dispose() {
      clearFade();
      music?.pause();
      music = null;
      currentTrackUrl = '';
      audioContext?.close().catch(() => undefined);
      audioContext = null;
      unlocked = false;
    }
  };
}
