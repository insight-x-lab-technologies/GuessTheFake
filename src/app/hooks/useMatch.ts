import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../core/i18n/i18n';
import type { PlatformSettings } from '../../core/settings/settings';
import { clearPersistedGuessTheFakeMatch, savePersistedGuessTheFakeMatch } from '../../game/match-storage';
import {
  advanceRound,
  beginPlaying,
  beginPreparation,
  createInitialGuessTheFakeState,
  getActiveGuessSubject,
  getCurrentRound,
  getWinners,
  recalibrateScores,
  startMatch,
  submitGuess,
  timeOutRound
} from '../../game/rules';
import type { GuessTheFakeState } from '../../game/types';
import type { ContentRating } from '../../core/content-feedback/content-feedback';
import type { Screen, Translate } from '../app-types';
import type { MatchBoot } from '../match-boot';
import { getNewMatchNavigationDecision, hasMatchInProgress } from '../new-match-flow';
import type { AudioController } from './useAudio';
import type { MatchSetupController } from './useMatchSetup';
import type { ProgressController } from './useProgress';

export type MatchController = ReturnType<typeof useMatch>;

type MatchOptions = {
  boot: MatchBoot;
  settings: PlatformSettings;
  t: Translate;
  setup: MatchSetupController;
  audio: Pick<AudioController, 'unlock' | 'play'>;
  progress: Pick<ProgressController, 'recordRound' | 'recordMatchFinished' | 'rateRound' | 'contentFeedback'>;
  enabledPackIds: string[];
  screen: Screen;
  setScreen: (screen: Screen) => void;
};

// Match state, the preparation/round countdown, and every match action.
// Rules stay in game/rules.ts; this hook only orchestrates them.
export function useMatch({
  boot,
  settings,
  t,
  setup,
  audio,
  progress,
  enabledPackIds,
  screen,
  setScreen
}: MatchOptions) {
  const [gameState, setGameState] = useState<GuessTheFakeState>(boot.state);
  const [timerSeconds, setTimerSeconds] = useState(boot.timerSeconds);
  const [showNewMatchChoices, setShowNewMatchChoices] = useState(boot.restored);
  const [activeMatchLanguage, setActiveMatchLanguage] = useState<Language | null>(boot.activeMatchLanguage);
  const [scoreResetStatus, setScoreResetStatus] = useState<'confirm' | 'done' | null>(null);
  const restoredTimerRef = useRef(boot.restored);
  const demoPendingRef = useRef(boot.demo);
  // Timer callbacks run later than the render that scheduled them.
  const latestRef = useRef({ settings, audio, progress });
  latestRef.current = { settings, audio, progress };

  const round = getCurrentRound(gameState);
  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const activeSubject = getActiveGuessSubject(gameState);
  const activeSubjectName = activeSubject?.name ?? activePlayer?.name ?? '-';
  const winners = gameState.phase === 'finished' ? getWinners(gameState) : [];
  const currentRoundFeedbackRating = round
    ? progress.contentFeedback.entries.find(entry => entry.roundId === round.id)?.rating ?? null
    : null;
  const activeMatchUsesPreviousLanguage = hasMatchInProgress(gameState.phase)
    && Boolean(activeMatchLanguage)
    && activeMatchLanguage !== settings.language;

  useEffect(() => {
    setScoreResetStatus(null);
  }, [screen, gameState.phase, gameState.currentRoundIndex]);

  // `?demo=game` waits for the lazily loaded rounds of the active language.
  useEffect(() => {
    if (!demoPendingRef.current || !setup.playableRounds.length) return;
    demoPendingRef.current = false;
    setActiveMatchLanguage(settings.language);
    setGameState(startMatch(createInitialGuessTheFakeState(), {
      modeId: 'all-guess',
      playerNames: ['Ana', 'Bruno'],
      totalRounds: 5,
      rounds: setup.playableRounds,
      shuffleRounds: true
    }));
  }, [setup.playableRounds, settings.language]);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;

    if (!hasMatchInProgress(gameState.phase)) {
      clearPersistedGuessTheFakeMatch();
      return;
    }

    savePersistedGuessTheFakeMatch({
      state: gameState,
      activeMatchLanguage: activeMatchLanguage ?? settings.language,
      timerSeconds
    });
  }, [activeMatchLanguage, gameState, settings.language, timerSeconds]);

  useEffect(() => {
    if (restoredTimerRef.current) {
      restoredTimerRef.current = false;
      if (gameState.phase === 'preparing' || gameState.phase === 'playing') return;
    }

    if (gameState.phase === 'preparing') {
      setTimerSeconds(settings.preparationTimeSeconds);
      return;
    }

    if (gameState.phase === 'playing') {
      setTimerSeconds(settings.roundTimeSeconds);
      return;
    }

    setTimerSeconds(0);
  }, [gameState.phase, gameState.currentRoundIndex, settings.preparationTimeSeconds, settings.roundTimeSeconds]);

  useEffect(() => {
    if (showNewMatchChoices) return undefined;
    if (gameState.phase !== 'preparing' && gameState.phase !== 'playing') return undefined;
    if (timerSeconds <= 0) return undefined;

    const timer = window.setTimeout(() => {
      if (timerSeconds > 1) {
        setTimerSeconds(current => Math.max(0, current - 1));
        return;
      }

      if (gameState.phase === 'preparing') {
        setGameState(current => beginPlaying(current));
        return;
      }

      setGameState(current => {
        const latest = latestRef.current;
        const currentRound = getCurrentRound(current);
        const timedOut = timeOutRound(current, getScoring(latest.settings)).state;
        latest.audio.play('wrong');
        latest.progress.recordRound(timedOut, Object.values(timedOut.roundGuesses), currentRound);
        return timedOut;
      });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [gameState.phase, showNewMatchChoices, timerSeconds]);

  useEffect(() => {
    const wakeLock = (navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> };
    }).wakeLock;
    if (!wakeLock || !['preparing', 'playing', 'revealed'].includes(gameState.phase)) return undefined;

    let released = false;
    let sentinel: { release: () => Promise<void> } | null = null;
    wakeLock.request('screen')
      .then(lock => {
        if (released) {
          lock.release().catch(() => undefined);
          return;
        }
        sentinel = lock;
      })
      .catch(() => undefined);

    return () => {
      released = true;
      sentinel?.release().catch(() => undefined);
    };
  }, [gameState.phase]);

  function openCleanSetup(error = '') {
    setup.setSetupError(error);
    setTimerSeconds(0);
    setShowNewMatchChoices(false);
    setActiveMatchLanguage(null);
    setGameState(createInitialGuessTheFakeState());
    setScreen('play');
  }

  function requestNewMatch() {
    if (getNewMatchNavigationDecision(gameState.phase) === 'show-choice') {
      setShowNewMatchChoices(true);
      setScreen('play');
      return;
    }

    openCleanSetup();
  }

  function continueCurrentMatch() {
    setShowNewMatchChoices(false);
    setScreen('play');
  }

  function startNewMatch(options: { onValidationError?: 'stay' | 'show-setup' } = {}) {
    audio.unlock();
    setup.setSetupError('');
    const effectiveNames = setup.players.length ? setup.players : ['Jogador 1'];
    const fail = (error: string) => {
      setup.setSetupError(error);
      if (options.onValidationError === 'show-setup') openCleanSetup(error);
      return false;
    };
    if (effectiveNames.length < setup.selectedMode.minPlayers) {
      return fail(t('setup.notEnoughPlayers', { count: setup.selectedMode.minPlayers }));
    }
    if (!setup.playableRounds.length) return fail(t('setup.noRounds'));
    const parsedRounds = Number(setup.roundCountInput);
    if (!Number.isFinite(parsedRounds) || parsedRounds < 1) return fail(t('setup.invalidRounds'));

    const next = startMatch(createInitialGuessTheFakeState(), {
      modeId: setup.selectedModeId,
      playerNames: effectiveNames,
      totalRounds: parsedRounds,
      rounds: setup.playableRounds,
      shuffleRounds: settings.shuffleRounds
    });
    setShowNewMatchChoices(false);
    setActiveMatchLanguage(settings.language);
    setGameState(settings.autoStartRounds ? beginPreparation(next) : next);
    setScreen('play');
    return true;
  }

  function chooseStatement(statementId: string) {
    audio.unlock();
    setGameState(current => {
      if (current.phase !== 'playing') return current;
      const latest = latestRef.current;
      const { state } = submitGuess(current, statementId, getScoring(latest.settings), {
        remainingSeconds: timerSeconds,
        totalSeconds: latest.settings.roundTimeSeconds
      });
      const anyCorrect = Object.values(state.roundGuesses).some(guess => guess.correct);
      latest.audio.play(state.phase === 'revealed' ? (anyCorrect ? 'correct' : 'wrong') : 'card-select');
      if (state.phase === 'revealed') {
        latest.progress.recordRound(state, Object.values(state.roundGuesses), getCurrentRound(current));
      }
      return state;
    });
  }

  function beginTurn() {
    audio.unlock();
    setGameState(current => beginPreparation(current));
  }

  function showStatementsNow() {
    audio.unlock();
    audio.play('round-start');
    setGameState(current => beginPlaying(current));
  }

  function resetScores() {
    setGameState(current => recalibrateScores(current));
    setScoreResetStatus('done');
  }

  function continueRound() {
    const next = advanceRound(gameState);

    if (next.phase === 'finished') {
      audio.play('match-finished');
      progress.recordMatchFinished(next, enabledPackIds);
    }

    setGameState(next);
  }

  function rateCurrentRound(rating: ContentRating) {
    if (!round) return;
    progress.rateRound(round, rating, gameState.modeId);
  }

  return {
    gameState,
    timerSeconds,
    round,
    activeSubjectName,
    winners,
    currentRoundFeedbackRating,
    showNewMatchChoices,
    hideNewMatchChoices: () => setShowNewMatchChoices(false),
    activeMatchLanguage,
    activeMatchUsesPreviousLanguage,
    scoreResetStatus,
    requestScoreReset: () => setScoreResetStatus('confirm'),
    cancelScoreReset: () => setScoreResetStatus(null),
    resetScores,
    openCleanSetup,
    requestNewMatch,
    continueCurrentMatch,
    restartCurrentMatch: () => startNewMatch({ onValidationError: 'show-setup' }),
    startNewMatch,
    chooseStatement,
    beginTurn,
    showStatementsNow,
    continueRound,
    rateCurrentRound
  };
}

function getScoring(settings: PlatformSettings) {
  return {
    correctGuessPoints: settings.correctGuessPoints,
    wrongGuessPenalty: settings.wrongGuessPenalty,
    speedBonusPoints: settings.speedBonusPoints
  };
}
