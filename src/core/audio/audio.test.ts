import { describe, expect, it } from 'vitest';
import { getToneForEvent, shouldPlayMusic, shouldPlaySound } from './audio';

describe('audio helpers', () => {
  it('respects sound and music settings', () => {
    expect(shouldPlaySound({ soundEnabled: false, musicEnabled: true }, 'correct')).toBe(false);
    expect(shouldPlaySound({ soundEnabled: true, musicEnabled: false }, 'correct')).toBe(true);
    expect(shouldPlayMusic({ soundEnabled: false, musicEnabled: true }, 'playing')).toBe(true);
    expect(shouldPlayMusic({ soundEnabled: false, musicEnabled: true }, 'setup')).toBe(false);
  });

  it('maps contextual events to tones', () => {
    expect(getToneForEvent('correct').frequency).toBeGreaterThan(getToneForEvent('wrong').frequency);
  });
});
