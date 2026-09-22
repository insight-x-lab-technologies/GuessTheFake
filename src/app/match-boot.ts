import type { Language } from '../core/i18n/i18n';
import { loadPersistedGuessTheFakeMatch } from '../game/match-storage';
import { createInitialGuessTheFakeState } from '../game/rules';
import type { GuessTheFakeState } from '../game/types';

export type MatchBoot = {
  hasMatch: boolean;
  state: GuessTheFakeState;
  activeMatchLanguage: Language | null;
  timerSeconds: number;
  // True when a persisted match was restored; it opens behind the choice panel.
  restored: boolean;
  // `?demo=game`: useMatch starts the demo once the language's rounds load.
  demo: boolean;
};

// Decides how the app opens: `?demo=game` starts a demo match, otherwise a
// persisted match in progress is restored behind the continue/restart choice.
export function readMatchBoot(language: Language): MatchBoot {
  const demoMode = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('demo')
    : null;

  if (demoMode === 'game') {
    return {
      hasMatch: true,
      state: createInitialGuessTheFakeState(),
      activeMatchLanguage: language,
      timerSeconds: 0,
      restored: false,
      demo: true
    };
  }

  const persisted = typeof localStorage !== 'undefined' ? loadPersistedGuessTheFakeMatch() : null;
  if (persisted) {
    return {
      hasMatch: true,
      state: persisted.state,
      activeMatchLanguage: persisted.activeMatchLanguage,
      timerSeconds: persisted.timerSeconds,
      restored: true,
      demo: false
    };
  }

  return {
    hasMatch: false,
    state: createInitialGuessTheFakeState(),
    activeMatchLanguage: null,
    timerSeconds: 0,
    restored: false,
    demo: false
  };
}
