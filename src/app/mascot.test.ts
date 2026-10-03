import { describe, expect, it } from 'vitest';
import { getFinalMood, getRevealMood, MASCOT_MOODS } from './mascot';

describe('mascot moods (W16-01)', () => {
  it('has the five expressions', () => {
    expect(MASCOT_MOODS).toEqual(['thinking', 'suspicious', 'laughing', 'shocked', 'celebrating']);
  });

  it('laughs when the fake is found and is shocked when it fools everyone', () => {
    expect(getRevealMood(true)).toBe('laughing');
    expect(getRevealMood(false)).toBe('shocked');
  });

  it('celebrates table finals and new solo records, and reacts to other solo runs', () => {
    expect(getFinalMood({ solo: false, isNewRecord: false, correct: 0, totalRounds: 5 })).toBe('celebrating');
    expect(getFinalMood({ solo: true, isNewRecord: true, correct: 1, totalRounds: 5 })).toBe('celebrating');
    expect(getFinalMood({ solo: true, isNewRecord: false, correct: 3, totalRounds: 5 })).toBe('laughing');
    expect(getFinalMood({ solo: true, isNewRecord: false, correct: 1, totalRounds: 5 })).toBe('suspicious');
    expect(getFinalMood({ solo: true, isNewRecord: false, correct: 0, totalRounds: 5 })).toBe('shocked');
  });
});
