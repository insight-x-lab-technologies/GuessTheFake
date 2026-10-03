import { useEffect, useMemo, useRef, useState } from 'react';
import type { Language } from '../../core/i18n/i18n';
import type { PlatformSettings } from '../../core/settings/settings';
import { clearPersistedGuessTheFakeMatch, savePersistedGuessTheFakeMatch } from '../../game/match-storage';
import { isSoloMode } from '../../game/modes';
import { getDeprioritizedRoundIds } from '../../game/round-history';
import {
  advanceRound,
  beginPlaying,
  beginPreparation,
  changeGuessInDiscussion,
  createInitialGuessTheFakeState,
  getActiveGuessSubject,
  getCurrentRound,
  getCurrentSpecialRound,
  getRoundTimeSeconds,
  getWinners,
  recalibrateScores,
  revealDiscussion,
  revealNextClue,
  startMatch,
  submitGuess,
  timeOutRound,
  voteInDiscussion
} from '../../game/rules';
import type { SoloResult } from '../../game/solo-records';
import type { GuessTheFakeState } from '../../game/types';
import type { ContentRating } from '../../core/content-feedback/content-feedback';
import type { Screen, Translate } from '../app-types';
import type { MatchBoot } from '../match-boot';
import { getNewMatchNavigationDecision, hasMatchInProgress } from '../new-match-flow';
import { buildProgressTracks, getNextObjective } from '../progress-tracks';
import type { AudioController } from './useAudio';
import type { MatchSetupController } from './useMatchSetup';
import type { ProgressController } from './useProgress';

export type MatchController = ReturnType<typeof useMatch>;

export type SoloOutcome = {
  result: SoloResult;
  previous: SoloResult | null;
  isNewRecord: boolean;
};

type MatchOptions = {
  boot: MatchBoot;
  settings: PlatformSettings;
  updateSettings: (next: Partial<PlatformSettings>) => void;
  t: Translate;
  setup: MatchSetupController;
  audio: Pick<AudioController, 'unlock' | 'play'>;
  progress: Pick<
    ProgressController,
    | 'recordRound'
    | 'recordMatchFinished'
    | 'recordSoloMatch'
    | 'rateRound'
    | 'contentFeedback'
    | 'achievementState'
    | 'roundHistory'
    | 'weakRoundIds'
  >;
  getSoloKeyForName: (name: string) => string;
  enabledPackIds: string[];
  categoryIds: string[];
  screen: Screen;
  setScreen: (screen: Screen) => void;
};

// Match state, the preparation/round countdown, and every match action.
// Rules stay in game/rules.ts; this hook only orchestrates them.
export function useMatch({
  boot,
  settings,
  updateSettings,
  t,
  setup,
  audio,
  progress,
  getSoloKeyForName,
  enabledPackIds,
  categoryIds,
  screen,
  setScreen
}: MatchOptions) {
  const [gameState, setGameState] = useState<GuessTheFakeState>(boot.state);
  const [timerSeconds, setTimerSeconds] = useState(boot.timerSeconds);
  const [showNewMatchChoices, setShowNewMatchChoices] = useState(boot.restored);
  const [activeMatchLanguage, setActiveMatchLanguage] = useState<Language | null>(boot.activeMatchLanguage);
  const [scoreResetStatus, setScoreResetStatus] = useState<'confirm' | 'done' | null>(null);
  const [soloOutcome, setSoloOutcome] = useState<SoloOutcome | null>(null);
  // `change-mind` moment: whose guess the next statement click replaces.
  const [changingSubjectId, setChangingSubjectId] = useState<string | null>(null);
  const restoredTimerRef = useRef(boot.restored);
  const demoPendingRef = useRef(boot.demo);
  // Timer callbacks run later than the render that scheduled them.
  const latestRef = useRef({ settings, audio, progress });
  latestRef.current = { settings, audio, progress };

  const round = getCurrentRound(gameState);
  const solo = isSoloMode(gameState.modeId);
  const specialRound = getCurrentSpecialRound(gameState);
  const roundTimeSeconds = getRoundTimeSeconds(gameState, settings.roundTimeSeconds);
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
  const tracks = useMemo(() => buildProgressTracks(categoryIds), [categoryIds]);
  const nextObjective = useMemo(() => {
    if (gameState.phase !== 'finished') return null;
    return getNextObjective(tracks, progress.achievementState.counters, {
      solo,
      categoryIds: [...new Set(gameState.rounds.map(matchRound => matchRound.categoryId))],
      difficulty: gameState.challenge.difficulty === 'all' ? undefined : gameState.challenge.difficulty
    });
  }, [gameState.challenge.difficulty, gameState.phase, gameState.rounds, progress.achievementState.counters, solo, tracks]);

  useEffect(() => {
    setScoreResetStatus(null);
    setChangingSubjectId(null);
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
      setTimerSeconds(roundTimeSeconds);
      return;
    }

    setTimerSeconds(0);
  }, [gameState.phase, gameState.currentRoundIndex, settings.preparationTimeSeconds, roundTimeSeconds]);

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
    if (!wakeLock || !['preparing', 'playing', 'discussing', 'revealed'].includes(gameState.phase)) return undefined;

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
    setSoloOutcome(null);
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

  // Home "Play solo": the setup opens with the solo mode selected.
  function requestSoloMatch() {
    requestNewMatch();
    if (getNewMatchNavigationDecision(gameState.phase) !== 'show-choice') setup.selectMode('solo');
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

    const soloMatch = isSoloMode(setup.selectedModeId);
    const next = startMatch(createInitialGuessTheFakeState(), {
      modeId: setup.selectedModeId,
      playerNames: effectiveNames,
      totalRounds: parsedRounds,
      rounds: setup.playableRounds,
      shuffleRounds: settings.shuffleRounds,
      challenge: {
        categoryId: setup.selectedCategoryId,
        difficulty: setup.selectedDifficulty,
        packIds: setup.installedPackIds
      },
      tableMoments: setup.tableMomentsEnabled,
      specialRounds: setup.specialRoundsEnabled,
      deprioritizedRoundIds: getDeprioritizedRoundIds(progress.roundHistory, progress.weakRoundIds)
    });
    if (soloMatch) updateSettings({ lastSoloPlayerName: next.players[0]?.name ?? '' });
    setShowNewMatchChoices(false);
    setActiveMatchLanguage(settings.language);
    setSoloOutcome(null);
    // Solo skips the pass-the-device ceremony: straight to the statements.
    if (soloMatch) {
      audio.play('round-start');
      setGameState(beginPlaying(next));
    } else {
      setGameState(settings.autoStartRounds ? beginPreparation(next) : next);
    }
    setScreen('play');
    return true;
  }

  function chooseStatement(statementId: string) {
    audio.unlock();
    if (gameState.phase === 'discussing') {
      if (changingSubjectId) changeGuessInMoment(changingSubjectId, statementId);
      return;
    }
    setGameState(current => {
      if (current.phase !== 'playing') return current;
      const latest = latestRef.current;
      let next: GuessTheFakeState;
      try {
        next = submitGuess(current, statementId, getScoring(latest.settings), {
          remainingSeconds: timerSeconds,
          totalSeconds: getRoundTimeSeconds(current, latest.settings.roundTimeSeconds)
        }).state;
      } catch {
        // A hidden `gradual-clue` statement cannot be chosen yet.
        return current;
      }
      const anyCorrect = Object.values(next.roundGuesses).some(guess => guess.correct);
      latest.audio.play(next.phase === 'revealed' ? (anyCorrect ? 'correct' : 'wrong') : 'card-select');
      if (next.phase === 'revealed') {
        latest.progress.recordRound(next, Object.values(next.roundGuesses), getCurrentRound(current));
      }
      return next;
    });
  }

  function showNextClue() {
    audio.unlock();
    setGameState(current => revealNextClue(current));
  }

  function voteInMoment(subjectId: string) {
    setGameState(current => voteInDiscussion(current, subjectId));
  }

  function changeGuessInMoment(subjectId: string, statementId: string) {
    setChangingSubjectId(null);
    setGameState(current => changeGuessInDiscussion(current, subjectId, statementId, getScoring(latestRef.current.settings)));
  }

  function revealMoment() {
    audio.unlock();
    setGameState(current => {
      if (current.phase !== 'discussing') return current;
      const latest = latestRef.current;
      const next = revealDiscussion(current);
      const anyCorrect = Object.values(next.roundGuesses).some(guess => guess.correct);
      latest.audio.play(anyCorrect ? 'correct' : 'wrong');
      latest.progress.recordRound(next, Object.values(next.roundGuesses), getCurrentRound(current));
      return next;
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
      progress.recordMatchFinished(next, enabledPackIds);
      if (isSoloMode(next.modeId)) {
        const outcome = progress.recordSoloMatch(next, getSoloKeyForName(next.players[0]?.name ?? ''));
        setSoloOutcome(outcome);
        audio.play(outcome?.isNewRecord ? 'correct' : 'match-finished');
      } else {
        audio.play('match-finished');
      }
      setGameState(next);
      return;
    }

    if (isSoloMode(next.modeId)) {
      audio.play('round-start');
      setGameState(beginPlaying(next));
      return;
    }

    setGameState(next);
  }

  // Solo "Play again": same challenge, fresh rounds.
  function replaySoloChallenge() {
    startNewMatch({ onValidationError: 'show-setup' });
  }

  function rateCurrentRound(rating: ContentRating) {
    if (!round) return;
    progress.rateRound(round, rating, gameState.modeId);
  }

  return {
    gameState,
    timerSeconds,
    round,
    solo,
    specialRound,
    roundTimeSeconds,
    activeSubjectName,
    winners,
    currentRoundFeedbackRating,
    soloOutcome,
    nextObjective,
    tracks,
    changingSubjectId,
    startChangingGuess: (subjectId: string | null) => setChangingSubjectId(subjectId),
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
    requestSoloMatch,
    continueCurrentMatch,
    restartCurrentMatch: () => startNewMatch({ onValidationError: 'show-setup' }),
    startNewMatch,
    replaySoloChallenge,
    chooseStatement,
    showNextClue,
    voteInMoment,
    changeGuessInMoment,
    revealMoment,
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
