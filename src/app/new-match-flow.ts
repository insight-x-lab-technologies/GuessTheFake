import type { GuessTheFakePhase } from '../game/types';

export type NewMatchNavigationDecision = 'show-setup' | 'show-choice';

export function hasMatchInProgress(phase: GuessTheFakePhase) {
  return phase !== 'setup' && phase !== 'finished';
}

export function getNewMatchNavigationDecision(phase: GuessTheFakePhase): NewMatchNavigationDecision {
  return hasMatchInProgress(phase) ? 'show-choice' : 'show-setup';
}
