import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createPlatformAudioService,
  type AudioEvent,
  type MusicZone,
  type PlatformAudioService,
  type ThemeAudioTracks
} from '../../core/audio/audio';
import type { PlatformSettings } from '../../core/settings/settings';
import autumnGameplayUrl from '../../assets/songs/autumn_gameplay.mp3';
import autumnGameroomUrl from '../../assets/songs/autumn_gameroom.mp3';
import cosmicGameplayUrl from '../../assets/songs/cosmic_gameplay.mp3';
import cosmicGameroomUrl from '../../assets/songs/cosmic_gameroom.mp3';
import springGameplayUrl from '../../assets/songs/spring_gameplay.mp3';
import springGameroomUrl from '../../assets/songs/spring_gameroom.mp3';

const THEME_AUDIO_TRACKS: ThemeAudioTracks = {
  cosmic: {
    menu: cosmicGameroomUrl,
    gameplay: cosmicGameplayUrl
  },
  spring: {
    menu: springGameroomUrl,
    gameplay: springGameplayUrl
  },
  autumn: {
    menu: autumnGameroomUrl,
    gameplay: autumnGameplayUrl
  }
};

export type AudioController = ReturnType<typeof useAudio>;

// Owns the audio service. Callbacks read settings and the music zone through
// refs so timers and state updaters always see the latest values. The shell
// reports the current zone with `syncZone`, since the zone depends on match
// state that is created after this hook.
export function useAudio(settings: PlatformSettings) {
  const serviceRef = useRef<PlatformAudioService | null>(null);
  const settingsRef = useRef(settings);
  const zoneRef = useRef<MusicZone>('menu');
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  ));
  const reducedMotionRef = useRef(reducedMotion);
  settingsRef.current = settings;
  reducedMotionRef.current = reducedMotion;

  if (!serviceRef.current && typeof window !== 'undefined') {
    serviceRef.current = createPlatformAudioService({ tracks: THEME_AUDIO_TRACKS });
  }

  const syncMusic = useCallback(() => {
    serviceRef.current?.syncMusic({
      settings: settingsRef.current,
      themeId: settingsRef.current.theme,
      zone: zoneRef.current,
      reducedMotion: reducedMotionRef.current
    });
  }, []);

  const syncZone = useCallback((zone: MusicZone) => {
    zoneRef.current = zone;
    syncMusic();
  }, [syncMusic]);

  const unlock = useCallback(() => {
    serviceRef.current?.unlock();
    syncMusic();
  }, [syncMusic]);

  const play = useCallback((event: AudioEvent) => {
    serviceRef.current?.playEvent(event, settingsRef.current);
  }, []);

  const playUi = useCallback((event: AudioEvent) => {
    unlock();
    play(event);
  }, [play, unlock]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  useEffect(() => {
    syncMusic();
  }, [reducedMotion, settings, syncMusic]);

  useEffect(() => {
    return () => serviceRef.current?.dispose();
  }, []);

  return { unlock, play, playUi, syncZone, preview: () => playUi('preview') };
}
