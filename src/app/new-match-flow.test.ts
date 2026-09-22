import { describe, expect, it } from 'vitest';
import { getNewMatchNavigationDecision, hasMatchInProgress } from './new-match-flow';
import type { GuessTheFakePhase } from '../game/types';

describe('new match flow helpers', () => {
  it('treats active gameplay phases as in-progress matches', () => {
    const activePhases: GuessTheFakePhase[] = ['intro', 'preparing', 'playing', 'revealed'];

    activePhases.forEach(phase => {
      expect(hasMatchInProgress(phase)).toBe(true);
      expect(getNewMatchNavigationDecision(phase)).toBe('show-choice');
    });
  });

  it('opens clean setup directly when there is no resumable match', () => {
    expect(hasMatchInProgress('setup')).toBe(false);
    expect(hasMatchInProgress('finished')).toBe(false);
    expect(getNewMatchNavigationDecision('setup')).toBe('show-setup');
    expect(getNewMatchNavigationDecision('finished')).toBe('show-setup');
  });
});
