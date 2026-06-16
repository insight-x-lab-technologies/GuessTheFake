import { describe, expect, it } from 'vitest';
import {
  clampAudioVolume,
  getMusicZone,
  getToneForEvent,
  getTrackThemeId,
  shouldPlayMusic,
  shouldPlaySound
} from './audio';

describe('audio helpers', () => {
  it('respects sound and music settings', () => {
    expect(shouldPlaySound({ soundEnabled: false, musicEnabled: true }, 'correct')).toBe(false);
    expect(shouldPlaySound({ soundEnabled: true, musicEnabled: false }, 'correct')).toBe(true);
    expect(shouldPlayMusic({ soundEnabled: false, musicEnabled: true }, 'gameplay')).toBe(true);
    expect(shouldPlayMusic({ soundEnabled: false, musicEnabled: true }, 'silent')).toBe(false);
  });

  it('maps contextual events to tones', () => {
    expect(getToneForEvent('correct').frequency).toBeGreaterThan(getToneForEvent('wrong').frequency);
    expect(getToneForEvent('navigation').durationMs).toBeLessThan(getToneForEvent('match-finished').durationMs);
  });

  it('maps screen and phase to menu or gameplay music zones', () => {
    expect(getMusicZone('home', 'setup')).toBe('menu');
    expect(getMusicZone('settings', 'playing')).toBe('menu');
    expect(getMusicZone('play', 'setup')).toBe('menu');
    expect(getMusicZone('play', 'playing')).toBe('gameplay');
    expect(getMusicZone('play', 'idle')).toBe('silent');
  });

  it('maps themes to available audio track families with fallback', () => {
    expect(getTrackThemeId('material3')).toBe('spring');
    expect(getTrackThemeId('liquid-glass')).toBe('autumn');
    expect(getTrackThemeId('high-contrast')).toBe('cosmic');
  });

  it('clamps invalid audio volumes', () => {
    expect(clampAudioVolume(1.4, 0.5)).toBe(1);
    expect(clampAudioVolume(-1, 0.5)).toBe(0);
    expect(clampAudioVolume(Number.NaN, 0.5)).toBe(0.5);
  });
});
