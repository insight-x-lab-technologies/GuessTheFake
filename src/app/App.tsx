import {
  BadgeCheck,
  Boxes,
  CheckCircle2,
  Clock,
  Cog,
  Copy,
  Download,
  Home,
  Link2,
  ListChecks,
  Medal,
  QrCode,
  Sparkles,
  Play,
  Radio,
  RotateCcw,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  Unplug,
  Upload,
  Wifi,
  XCircle
} from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  createDefaultAchievementState,
  evaluateAchievementsWithUnlocks,
  getAchievementSummary,
  loadAchievements,
  normalizeAchievementState,
  saveAchievements,
  type AchievementDefinition,
  type AchievementState
} from '../core/achievements/achievements';
import { getToneForEvent, shouldPlayMusic, shouldPlaySound, type AudioEvent } from '../core/audio/audio';
import {
  exportPacks,
  getEnabledPacks,
  getPackTitle,
  loadInstalledPacks,
  parsePackImport,
  removeInstalledPack,
  saveInstalledPacks,
  setPackEnabled,
  upsertInstalledPack
} from '../core/content-packs/content-packs';
import {
  loadContentFeedback,
  normalizeContentFeedback,
  rateContent,
  saveContentFeedback,
  shouldSkipRound,
  summarizeContentFeedback,
  type ContentRating
} from '../core/content-feedback/content-feedback';
import { SUPPORTED_LANGUAGES, translate, type Language } from '../core/i18n/i18n';
import {
  exportLeaderboard,
  filterLeaderboard,
  getPlayerLeaderboardDetail,
  importLeaderboard,
  loadLeaderboard,
  recordLeaderboardMatch,
  saveLeaderboard,
  sortLeaderboardBy,
  summarizeLeaderboard,
  type LeaderboardSort
} from '../core/leaderboard/leaderboard';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type PlatformSettings } from '../core/settings/settings';
import { applyTheme, THEMES, type ThemeId } from '../core/themes/themes';
import { Button } from '../core/ui/Button';
import {
  createInitialMultiplayerSessionState,
  createInviteUrl,
  createSessionStateMessage,
  disconnectMultiplayerSession,
  exportMultiplayerSnapshot,
  hostMultiplayerSession,
  importMultiplayerSnapshot,
  joinMultiplayerSession,
  loadMultiplayerSession,
  parseMultiplayerMessage,
  reduceMultiplayerMessage,
  saveMultiplayerSession,
  serializeMultiplayerMessage,
  type MultiplayerGameSnapshot,
  type MultiplayerMessage,
  type MultiplayerTransportKind
} from '../core/multiplayer/multiplayer';
import {
  exportLocalData,
  importLocalData,
  loadUserIdentity,
  saveUserIdentity,
  type UserIdentity
} from '../core/user-data/user-data';
import gameplayMusicUrl from '../assets/songs/cosmic_gameplay.mp3';
import { getLocalizedText, validateGuessTheFakePack } from '../games/guess-the-fake/content-schema';
import { sampleGuessTheFakePack, type GuessTheFakePackContent } from '../games/guess-the-fake/data/sample-pack';
import { guessTheFakeManifest } from '../games/guess-the-fake/game.manifest';
import {
  advanceRound,
  beginPlaying,
  beginPreparation,
  createInitialGuessTheFakeState,
  getActiveGuessSubject,
  getCurrentRound,
  getWinners,
  recalibrateScores,
  sanitizeRoundCount,
  startMatch,
  submitGuess,
  timeOutRound
} from '../games/guess-the-fake/rules';
import type {
  GuessResult,
  GuessTheFakeDifficulty,
  GuessTheFakeModeId,
  GuessTheFakeRound,
  GuessTheFakeState
} from '../games/guess-the-fake/types';
import '../styles/reset.css';
import '../styles/tokens.css';
import '../styles/base.css';
import { getNextStatementFocusIndex, getStatementShortcutIndex } from './accessibility';
import styles from './App.module.css';
import { translations } from './translations';

type Screen = 'home' | 'play' | 'leaderboard' | 'achievements' | 'packs' | 'multiDevice' | 'settings';

const homePreviewKeys = [
  'home.previewOne',
  'home.previewTwo',
  'home.previewThree',
  'home.previewFour',
  'home.previewFive'
];

const achievementDefinitions: AchievementDefinition[] = [
  {
    id: 'first-correct',
    titleKey: 'achievements.firstWinTitle',
    descriptionKey: 'achievements.firstWinDescription',
    target: 1,
    getProgress: counters => counters.correctGuesses
  },
  {
    id: 'five-rounds',
    titleKey: 'achievements.roundsTitle',
    descriptionKey: 'achievements.roundsDescription',
    target: 5,
    getProgress: counters => counters.roundsPlayed
  },
  {
    id: 'streak-three',
    titleKey: 'achievements.streakTitle',
    descriptionKey: 'achievements.streakDescription',
    target: 3,
    getProgress: counters => counters.longestStreak
  },
  {
    id: 'perfect-match',
    titleKey: 'achievements.perfectTitle',
    descriptionKey: 'achievements.perfectDescription',
    target: 1,
    getProgress: counters => counters.perfectMatches
  },
  {
    id: 'category-tour',
    titleKey: 'achievements.categoryTitle',
    descriptionKey: 'achievements.categoryDescription',
    target: 5,
    getProgress: counters => Object.keys(counters.categoriesPlayed).length
  },
  {
    id: 'pack-curator',
    titleKey: 'achievements.packTitle',
    descriptionKey: 'achievements.packDescription',
    target: 2,
    getProgress: counters => Object.keys(counters.packsUsed).length
  },
  {
    id: 'content-editor',
    titleKey: 'achievements.feedbackTitle',
    descriptionKey: 'achievements.feedbackDescription',
    target: 3,
    getProgress: counters => counters.contentFeedbackCount
  }
];

export function App() {
  const mainRef = useRef<HTMLElement | null>(null);
  const statementButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const packFileInputRef = useRef<HTMLInputElement | null>(null);
  const dataFileInputRef = useRef<HTMLInputElement | null>(null);
  const leaderboardFileInputRef = useRef<HTMLInputElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioUnlockedRef = useRef(false);
  const multiplayerChannelRef = useRef<BroadcastChannel | null>(null);
  const autoJoinHandledRef = useRef(false);
  const guestIdRef = useRef(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `guest-${crypto.randomUUID()}`
      : `guest-${Math.random().toString(36).slice(2, 10)}`
  );
  const demoMode = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('demo')
    : null;
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
    return loadSettings();
  });
  const [screen, setScreen] = useState<Screen>(demoMode === 'game' ? 'play' : 'home');
  const [gameState, setGameState] = useState<GuessTheFakeState>(() => {
    if (demoMode === 'game') {
      return startMatch(createInitialGuessTheFakeState(), {
        modeId: 'all-guess',
        playerNames: ['Ana', 'Bruno'],
        totalRounds: 5,
        rounds: sampleGuessTheFakePack.content.rounds,
        shuffleRounds: true
      });
    }
    return createInitialGuessTheFakeState();
  });
  const [playerNames, setPlayerNames] = useState('Ana, Bruno');
  const [selectedModeId, setSelectedModeId] = useState<GuessTheFakeModeId>('classic');
  const [roundCountInput, setRoundCountInput] = useState('5');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GuessTheFakeDifficulty | 'all'>('all');
  const [setupError, setSetupError] = useState('');
  const [packStatus, setPackStatus] = useState('');
  const [leaderboardSort, setLeaderboardSort] = useState<LeaderboardSort>('wins');
  const [leaderboardModeFilter, setLeaderboardModeFilter] = useState('all');
  const [selectedLeaderboardPlayer, setSelectedLeaderboardPlayer] = useState('');
  const [dataStatus, setDataStatus] = useState('');
  const [multiDeviceStatus, setMultiDeviceStatus] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [manualSnapshotInput, setManualSnapshotInput] = useState('');
  const [sessionQrDataUrl, setSessionQrDataUrl] = useState('');
  const [multiplayerSession, setMultiplayerSession] = useState(() => {
    if (typeof localStorage === 'undefined') return createInitialMultiplayerSessionState();
    return loadMultiplayerSession();
  });
  const [achievementNotice, setAchievementNotice] = useState<AchievementDefinition | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [userIdentity, setUserIdentity] = useState<UserIdentity>(() => {
    if (typeof localStorage === 'undefined') return { userId: 'gtf-local-demo' };
    return loadUserIdentity();
  });
  const [installedPacks, setInstalledPacks] = useState(() => {
    if (typeof localStorage === 'undefined') {
      return loadInstalledPacks<GuessTheFakePackContent>({ getItem: () => null, setItem: () => undefined, removeItem: () => undefined });
    }
    return loadInstalledPacks<GuessTheFakePackContent>();
  });
  const [contentFeedback, setContentFeedback] = useState(() => {
    if (typeof localStorage === 'undefined') {
      return loadContentFeedback({ getItem: () => null, setItem: () => undefined, removeItem: () => undefined });
    }
    return loadContentFeedback();
  });
  const [leaderboard, setLeaderboard] = useState(() => {
    if (typeof localStorage === 'undefined') {
      return loadLeaderboard({ getItem: () => null, setItem: () => undefined, removeItem: () => undefined });
    }
    return loadLeaderboard();
  });
  const [achievementState, setAchievementState] = useState<AchievementState>(() => {
    if (typeof localStorage === 'undefined') return createDefaultAchievementState();
    return loadAchievements();
  });

  const t = useMemo(
    () => (key: string, params: Record<string, string | number> = {}) =>
      translate(translations, settings.language, key, params),
    [settings.language]
  );

  const allPacks = useMemo(
    () => [sampleGuessTheFakePack, ...installedPacks.packs],
    [installedPacks.packs]
  );
  const enabledPacks = useMemo(
    () => getEnabledPacks(allPacks).filter(pack => !pack.languages || pack.languages.includes(settings.language)),
    [allPacks, settings.language]
  );
  const availableCategories = useMemo(() => {
    const categories = new Map<string, Record<string, string>>();
    enabledPacks.forEach(pack => {
      pack.content.categories.forEach(category => categories.set(category.id, category.title));
    });
    return [...categories.entries()].map(([id, title]) => ({ id, title }));
  }, [enabledPacks]);
  const playableRounds = useMemo(() => {
    return enabledPacks.flatMap(pack =>
      pack.content.rounds
        .filter(round => selectedCategoryId === 'all' || round.categoryId === selectedCategoryId)
        .filter(round => selectedDifficulty === 'all' || round.difficulty === selectedDifficulty)
        .filter(round => !shouldSkipRound(contentFeedback, round.id))
    );
  }, [contentFeedback, enabledPacks, selectedCategoryId, selectedDifficulty]);
  const setupRoundCount = sanitizeRoundCount(Number(roundCountInput), Math.max(1, playableRounds.length));
  const leaderboardEntries = useMemo(() => {
    const filtered = filterLeaderboard(leaderboard.entries, {
      gameId: guessTheFakeManifest.id,
      modeId: leaderboardModeFilter === 'all' ? undefined : leaderboardModeFilter,
      playerName: selectedLeaderboardPlayer || undefined
    });
    return sortLeaderboardBy(filtered, leaderboardSort);
  }, [leaderboard.entries, leaderboardModeFilter, leaderboardSort, selectedLeaderboardPlayer]);
  const leaderboardSummary = useMemo(() => summarizeLeaderboard(leaderboardEntries), [leaderboardEntries]);
  const contentFeedbackSummary = useMemo(() => summarizeContentFeedback(contentFeedback), [contentFeedback]);
  const achievementSummary = useMemo(
    () => getAchievementSummary(achievementState, achievementDefinitions),
    [achievementState]
  );
  const playerDetail = selectedLeaderboardPlayer
    ? getPlayerLeaderboardDetail(leaderboard.entries, selectedLeaderboardPlayer)
    : null;
  const text = (value: Parameters<typeof getLocalizedText>[0], fallback = '') =>
    getLocalizedText(value, settings.language, fallback);

  useEffect(() => {
    applyTheme(settings.theme);
    document.documentElement.lang = settings.language === 'pt' ? 'pt-BR' : 'en';
    document.title = t('game.title');
    saveSettings(settings);
  }, [settings, t]);

  useEffect(() => {
    document.body.dataset.activeScreen = screen;
  }, [screen]);

  useEffect(() => {
    saveAchievements(achievementState);
  }, [achievementState]);

  useEffect(() => {
    saveInstalledPacks(installedPacks);
  }, [installedPacks]);

  useEffect(() => {
    saveContentFeedback(contentFeedback);
  }, [contentFeedback]);

  useEffect(() => {
    saveMultiplayerSession(multiplayerSession);
  }, [multiplayerSession]);

  useEffect(() => {
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
        const currentRound = getCurrentRound(current);
        const timedOut = timeOutRound(current, currentScoring()).state;
        playSound('wrong');
        recordRoundAchievements(timedOut, Object.values(timedOut.roundGuesses), currentRound);
        return timedOut;
      });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [gameState.phase, settings.correctGuessPoints, settings.speedBonusPoints, settings.wrongGuessPenalty, timerSeconds]);

  useEffect(() => {
    if (!audioUnlockedRef.current) return;
    if (!shouldPlayMusic(settings, gameState.phase)) {
      musicRef.current?.pause();
      return;
    }

    if (!musicRef.current) {
      musicRef.current = new Audio(gameplayMusicUrl);
      musicRef.current.loop = true;
      musicRef.current.volume = 0.22;
    }

    musicRef.current.play().catch(() => undefined);
  }, [gameState.phase, settings]);

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

  const round = getCurrentRound(gameState);
  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const activeSubject = getActiveGuessSubject(gameState);
  const winners = gameState.phase === 'finished' ? getWinners(gameState) : [];
  const activeScreenLabel = t(
    screen === 'play' ? 'app.newGame' : `app.${screen === 'multiDevice' ? 'multiDevice' : screen}`
  );
  const navItems: Array<{ id: Screen; label: string; icon: ReactNode }> = [
    { id: 'home', label: t('app.home'), icon: <Home size={18} /> },
    { id: 'play', label: t('app.newGame'), icon: <Play size={18} /> },
    { id: 'leaderboard', label: t('app.leaderboard'), icon: <Medal size={18} /> },
    { id: 'achievements', label: t('app.achievements'), icon: <Trophy size={18} /> },
    { id: 'packs', label: t('app.packs'), icon: <Boxes size={18} /> },
    { id: 'multiDevice', label: t('app.multiDevice'), icon: <Radio size={18} /> },
    { id: 'settings', label: t('app.settings'), icon: <Cog size={18} /> }
  ];
  const hostSnapshot = useMemo(() => buildMultiplayerSnapshot(), [
    activeSubject?.name,
    gameState.modeId,
    gameState.phase,
    gameState.currentRoundIndex,
    gameState.totalRounds,
    gameState.players,
    gameState.teams,
    timerSeconds
  ]);
  const mirroredSnapshot = multiplayerSession.role === 'guest'
    ? multiplayerSession.lastSnapshot
    : hostSnapshot;
  const inviteUrl = multiplayerSession.sessionCode && typeof window !== 'undefined'
    ? createInviteUrl(window.location.href, multiplayerSession.sessionCode)
    : '';
  const canUseBroadcastChannel = supportsBroadcastChannel();
  const sessionQrCells = useMemo(
    () => createSessionQrCells(multiplayerSession.sessionCode || 'GTF-LOCAL'),
    [multiplayerSession.sessionCode]
  );

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      if (gameState.phase === 'playing') {
        statementButtonRefs.current[0]?.focus({ preventScroll: true });
        return;
      }
      mainRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [screen, gameState.phase, gameState.currentRoundIndex]);

  useEffect(() => {
    let cancelled = false;
    if (!inviteUrl) {
      setSessionQrDataUrl('');
      return undefined;
    }

    QRCode.toDataURL(inviteUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 180,
      color: {
        dark: '#111827',
        light: '#ffffff'
      }
    })
      .then(dataUrl => {
        if (!cancelled) setSessionQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setSessionQrDataUrl('');
      });

    return () => {
      cancelled = true;
    };
  }, [inviteUrl]);

  useEffect(() => {
    if (autoJoinHandledRef.current || typeof window === 'undefined') return;
    const code = new URL(window.location.href).searchParams.get('join');
    if (!code) return;
    autoJoinHandledRef.current = true;
    connectMultiplayerSession(code);
    setScreen('multiDevice');
  }, []);

  useEffect(() => {
    multiplayerChannelRef.current?.close();
    multiplayerChannelRef.current = null;

    if (!multiplayerSession.sessionCode || !canUseBroadcastChannel || multiplayerSession.status === 'idle') return undefined;

    const channel = new BroadcastChannel(getMultiplayerChannelName(multiplayerSession.sessionCode));
    multiplayerChannelRef.current = channel;
    channel.onmessage = event => {
      const message = typeof event.data === 'string'
        ? parseMultiplayerMessage(event.data)
        : parseMultiplayerMessage(JSON.stringify(event.data));
      if (!message) return;
      setMultiplayerSession(current => reduceMultiplayerMessage(current, message));
    };

    if (multiplayerSession.role === 'guest') {
      const ready = joinMultiplayerSession(multiplayerSession, multiplayerSession.sessionCode, {
        guestId: guestIdRef.current
      }).message;
      if (ready) channel.postMessage(serializeMultiplayerMessage(ready));
    }

    return () => {
      channel.close();
      if (multiplayerChannelRef.current === channel) multiplayerChannelRef.current = null;
    };
  }, [canUseBroadcastChannel, multiplayerSession.role, multiplayerSession.sessionCode, multiplayerSession.status]);

  useEffect(() => {
    if (multiplayerSession.role !== 'host' || multiplayerSession.status !== 'hosting' || !multiplayerSession.sessionCode) return;
    const message = createSessionStateMessage(multiplayerSession.sessionCode, hostSnapshot);
    postMultiplayerMessage(message);
    setMultiplayerSession(current => ({ ...current, lastSnapshot: hostSnapshot, updatedAt: hostSnapshot.updatedAt }));
  }, [hostSnapshot, multiplayerSession.role, multiplayerSession.sessionCode, multiplayerSession.status]);

  function updateSettings(next: Partial<PlatformSettings>) {
    setSettings(current => ({ ...current, ...next }));
  }

  function unlockAudio() {
    audioUnlockedRef.current = true;
  }

  function playSound(event: AudioEvent) {
    if (!shouldPlaySound(settings, event) || typeof window === 'undefined') return;
    try {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) return;
      const audioContext = audioContextRef.current ?? new AudioContextConstructor();
      audioContextRef.current = audioContext;
      const tone = getToneForEvent(event);
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.frequency.value = tone.frequency;
      oscillator.type = event === 'wrong' ? 'sawtooth' : 'sine';
      gain.gain.value = 0.045;
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + tone.durationMs / 1000);
    } catch {
      undefined;
    }
  }

  function buildMultiplayerSnapshot(): MultiplayerGameSnapshot {
    const scoreRows = gameState.modeId === 'teams' && gameState.teams.length
      ? gameState.teams.map(team => ({ name: team.name, score: team.score }))
      : gameState.players.map(player => ({ name: player.name, score: player.score }));

    return {
      gameId: guessTheFakeManifest.id,
      modeId: gameState.modeId,
      phase: gameState.phase,
      roundNumber: round ? Math.min(gameState.currentRoundIndex + 1, gameState.totalRounds) : 0,
      totalRounds: gameState.totalRounds,
      activeSubjectName: activeSubject?.name ?? activePlayer?.name ?? '-',
      timerSeconds,
      revealed: gameState.phase === 'revealed' || gameState.phase === 'finished',
      scoreboard: scoreRows,
      updatedAt: new Date().toISOString()
    };
  }

  function postMultiplayerMessage(message: MultiplayerMessage) {
    if (!supportsBroadcastChannel()) return;
    const channel = multiplayerChannelRef.current ?? new BroadcastChannel(getMultiplayerChannelName(message.sessionCode));
    channel.postMessage(serializeMultiplayerMessage(message));
    if (!multiplayerChannelRef.current) channel.close();
  }

  function openMultiplayerHost() {
    const transport: MultiplayerTransportKind = supportsBroadcastChannel() ? 'broadcast-channel' : 'manual-offline';
    const hosted = hostMultiplayerSession(multiplayerSession, { transport });
    setMultiplayerSession({ ...hosted, lastSnapshot: hostSnapshot });
    setMultiDeviceStatus(t(transport === 'broadcast-channel' ? 'multiDevice.hostReady' : 'multiDevice.offlineReady'));
  }

  function connectMultiplayerSession(value = joinCodeInput) {
    const transport: MultiplayerTransportKind = supportsBroadcastChannel() ? 'broadcast-channel' : 'manual-offline';
    const joined = joinMultiplayerSession(multiplayerSession, value, {
      guestId: guestIdRef.current,
      transport
    });
    setMultiplayerSession(joined.state);
    if (joined.message) postMultiplayerMessage(joined.message);
    setJoinCodeInput(joined.state.sessionCode);
    setMultiDeviceStatus(t(joined.message ? 'multiDevice.joined' : 'multiDevice.missingCode'));
  }

  function disconnectMultiplayer() {
    const disconnected = disconnectMultiplayerSession(multiplayerSession, { guestId: guestIdRef.current });
    if (disconnected.message) postMultiplayerMessage(disconnected.message);
    setMultiplayerSession(disconnected.state);
    setMultiDeviceStatus(t('multiDevice.disconnected'));
  }

  async function copyText(value: string, statusKey: string) {
    if (!value) return;
    try {
      await navigator.clipboard?.writeText(value);
      setMultiDeviceStatus(t(statusKey));
    } catch {
      setMultiDeviceStatus(value);
    }
  }

  function downloadMultiplayerSnapshot() {
    downloadJson('guess-the-fake-session-snapshot.json', exportMultiplayerSnapshot(hostSnapshot));
    setMultiDeviceStatus(t('multiDevice.snapshotExported'));
  }

  function applyManualSnapshot() {
    const snapshot = importMultiplayerSnapshot(manualSnapshotInput);
    if (!snapshot) {
      setMultiDeviceStatus(t('multiDevice.snapshotInvalid'));
      return;
    }
    setMultiplayerSession(current => ({
      ...current,
      role: 'guest',
      status: 'offline',
      transport: 'manual-offline',
      lastSnapshot: snapshot,
      updatedAt: snapshot.updatedAt,
      error: null
    }));
    setMultiDeviceStatus(t('multiDevice.snapshotImported'));
  }

  function updateAchievements(mutator: (state: AchievementState) => AchievementState) {
    setAchievementState(current => {
      const evaluated = evaluateAchievementsWithUnlocks(
        normalizeAchievementState(mutator(current)),
        achievementDefinitions
      );
      if (evaluated.newlyUnlocked.length) {
        setAchievementNotice(evaluated.newlyUnlocked[0]);
      }
      return evaluated.state;
    });
  }

  function currentScoring() {
    return {
      correctGuessPoints: settings.correctGuessPoints,
      wrongGuessPenalty: settings.wrongGuessPenalty,
      speedBonusPoints: settings.speedBonusPoints
    };
  }

  function recordRoundAchievements(nextState: GuessTheFakeState, results: GuessResult[], currentRound: GuessTheFakeRound | null) {
    const correctCount = results.filter(result => result.correct).length;
    updateAchievements(current => ({
      ...current,
      counters: {
        ...current.counters,
        roundsPlayed: current.counters.roundsPlayed + 1,
        correctGuesses: current.counters.correctGuesses + correctCount,
        longestStreak: Math.max(current.counters.longestStreak, nextState.longestStreakInMatch),
        categoriesPlayed: currentRound
          ? {
            ...current.counters.categoriesPlayed,
            [currentRound.categoryId]: (current.counters.categoriesPlayed[currentRound.categoryId] ?? 0) + 1
          }
          : current.counters.categoriesPlayed
      }
    }));
  }

  function startNewMatch() {
    unlockAudio();
    setSetupError('');
    const names = playerNames.split(',').map(name => name.trim()).filter(Boolean);
    const effectiveNames = names.length ? names : ['Jogador 1'];
    const selectedMode = guessTheFakeManifest.modes.find(mode => mode.id === selectedModeId);
    if (selectedMode && effectiveNames.length < selectedMode.minPlayers) {
      setSetupError(t('setup.notEnoughPlayers', { count: selectedMode.minPlayers }));
      return;
    }
    if (!playableRounds.length) {
      setSetupError(t('setup.noRounds'));
      return;
    }
    const parsedRounds = Number(roundCountInput);
    if (!Number.isFinite(parsedRounds) || parsedRounds < 1) {
      setSetupError(t('setup.invalidRounds'));
      return;
    }
    const next = startMatch(createInitialGuessTheFakeState(), {
      modeId: selectedModeId,
      playerNames: effectiveNames,
      totalRounds: parsedRounds,
      rounds: playableRounds,
      shuffleRounds: settings.shuffleRounds
    });
    setGameState(settings.autoStartRounds ? beginPreparation(next) : next);
    setScreen('play');
  }

  function chooseStatement(statementId: string) {
    unlockAudio();
    const { state } = submitGuess(gameState, statementId, currentScoring(), {
      remainingSeconds: timerSeconds,
      totalSeconds: settings.roundTimeSeconds
    });
    playSound(state.phase === 'revealed' ? (Object.values(state.roundGuesses).some(guess => guess.correct) ? 'correct' : 'wrong') : 'round-start');
    const currentRound = getCurrentRound(gameState);
    if (state.phase === 'revealed') {
      recordRoundAchievements(state, Object.values(state.roundGuesses), currentRound);
    }
    setGameState(state);
  }

  function handleStatementGridKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!round || gameState.phase !== 'playing') return;
    const shortcutIndex = getStatementShortcutIndex(event.key, round.statements.length);
    if (shortcutIndex !== null) {
      event.preventDefault();
      chooseStatement(round.statements[shortcutIndex].id);
      return;
    }

    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown'
      ? 'next'
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
        ? 'previous'
        : null;
    if (!direction) return;

    const currentIndex = statementButtonRefs.current.findIndex(button => button === document.activeElement);
    const nextIndex = getNextStatementFocusIndex(currentIndex, direction, round.statements.length);
    event.preventDefault();
    statementButtonRefs.current[nextIndex]?.focus();
  }

  function beginTurn() {
    unlockAudio();
    setGameState(current => beginPreparation(current));
  }

  function showStatementsNow() {
    unlockAudio();
    playSound('round-start');
    setGameState(current => beginPlaying(current));
  }

  function resetScores() {
    setGameState(current => recalibrateScores(current));
  }

  function continueRound() {
    const next = advanceRound(gameState);

    if (next.phase === 'finished') {
      playSound('match-finished');
      const scoreRows = next.modeId === 'teams' && next.teams.length
        ? next.teams.map(team => ({ name: team.name, points: team.score }))
        : next.players.map(player => ({ name: player.name, points: player.score }));
      const bestScore = Math.max(...scoreRows.map(row => row.points));
      const recorded = recordLeaderboardMatch(
        leaderboard,
        guessTheFakeManifest.id,
        next.modeId,
        scoreRows.map(row => ({
          playerName: row.name,
          points: row.points,
          isWinner: row.points === bestScore
        }))
      );
      saveLeaderboard(recorded);
      setLeaderboard(recorded);
      updateAchievements(current => ({
        ...current,
        counters: {
          ...current.counters,
          matchesFinished: current.counters.matchesFinished + 1,
          perfectMatches: current.counters.perfectMatches + (next.correctGuessesInMatch === next.totalRounds ? 1 : 0),
          longestStreak: Math.max(current.counters.longestStreak, next.longestStreakInMatch),
          packsUsed: enabledPacks.reduce(
            (used, pack) => ({ ...used, [pack.id]: (used[pack.id] ?? 0) + 1 }),
            { ...current.counters.packsUsed }
          )
        }
      }));
    }

    setGameState(next);
  }

  function rateCurrentRound(rating: ContentRating) {
    if (!round) return;
    const next = rateContent(contentFeedback, round.id, rating, {
      categoryId: round.categoryId,
      difficulty: round.difficulty
    });
    setContentFeedback(next);
    updateAchievements(current => ({
      ...current,
      counters: {
        ...current.counters,
        contentFeedbackCount: next.entries.length
      }
    }));
  }

  function downloadJson(filename: string, content: string) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function readFile(file: File, onText: (content: string) => void) {
    const reader = new FileReader();
    reader.onload = () => onText(String(reader.result ?? ''));
    reader.onerror = () => setPackStatus(t('packs.invalidFile'));
    reader.readAsText(file);
  }

  function importPackFromFile(file: File) {
    readFile(file, raw => {
      const pack = parsePackImport<GuessTheFakePackContent>(raw);
      if (!pack) {
        setPackStatus(t('packs.invalidJson'));
        return;
      }
      if (pack.id === sampleGuessTheFakePack.id || pack.builtin) {
        setPackStatus(t('packs.reservedPack'));
        return;
      }
      const validation = validateGuessTheFakePack(pack, {
        expectedGameId: guessTheFakeManifest.id,
        language: settings.language
      });
      if (!validation.ok) {
        setPackStatus(`${t('packs.invalidSchema')}: ${validation.issues[0]?.path ?? 'pack'}`);
        return;
      }
      setInstalledPacks(current =>
        upsertInstalledPack(current, {
          ...pack,
          enabled: true,
          signature: pack.signature ?? createLocalSignature(raw)
        })
      );
      setPackStatus(t('packs.imported'));
    });
  }

  function togglePack(packId: string, enabled: boolean) {
    if (packId === sampleGuessTheFakePack.id && !enabled) {
      setPackStatus(t('packs.builtinRequired'));
      return;
    }
    setInstalledPacks(current => ({ packs: setPackEnabled(current.packs, packId, enabled) }));
    setPackStatus(t('packs.toggled'));
  }

  function removePack(packId: string) {
    setInstalledPacks(current => removeInstalledPack(current, packId));
    setPackStatus(t('packs.removed'));
  }

  function exportAllData() {
    downloadJson(
      'guess-the-fake-data.json',
      exportLocalData({
        user: userIdentity,
        settings,
        leaderboard,
        achievements: achievementState,
        installedPacks,
        contentFeedback
      })
    );
    setDataStatus(t('settings.dataExported'));
  }

  function importAllData(file: File) {
    readFile(file, raw => {
      const data = importLocalData<GuessTheFakePackContent>(raw);
      if (!data) {
        setDataStatus(t('settings.dataInvalid'));
        return;
      }
      setUserIdentity(data.user);
      saveUserIdentity(data.user);
      setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      setLeaderboard(data.leaderboard);
      saveLeaderboard(data.leaderboard);
      setAchievementState(normalizeAchievementState(data.achievements));
      setInstalledPacks(data.installedPacks);
      if (data.contentFeedback) setContentFeedback(normalizeContentFeedback(data.contentFeedback));
      setDataStatus(t('settings.dataImported'));
    });
  }

  function importLeaderboardFromFile(file: File) {
    readFile(file, raw => {
      const imported = importLeaderboard(raw);
      if (!imported) {
        setDataStatus(t('leaderboard.importError'));
        return;
      }
      saveLeaderboard(imported);
      setLeaderboard(imported);
      setDataStatus(t('leaderboard.imported'));
    });
  }

  return (
    <div className={styles.appShell}>
      <div className={styles.ambientBackdrop} aria-hidden="true" />
      <aside className={styles.sidebar}>
        <div>
          <p className={styles.kicker}>{t('app.kicker')}</p>
          <h1 className={styles.logo}>{t('game.title')}</h1>
        </div>
        <nav className={styles.nav} aria-label={t('app.navLabel')}>
          {navItems.map(item => (
            <button
              key={item.id}
              aria-current={screen === item.id ? 'page' : undefined}
              className={screen === item.id ? styles.navActive : ''}
              onClick={() => setScreen(item.id)}
              type="button"
            >
              {item.icon} <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main ref={mainRef} className={styles.main} tabIndex={-1} aria-label={activeScreenLabel}>
        {achievementNotice ? (
          <aside className={styles.toast} role="status" aria-live="polite">
            <Sparkles size={20} />
            <div>
              <strong>{t('achievements.newUnlock')}</strong>
              <span>{t(achievementNotice.titleKey)}</span>
            </div>
            <button type="button" onClick={() => setAchievementNotice(null)} aria-label={t('app.dismiss')}>
              <XCircle size={16} />
            </button>
          </aside>
        ) : null}

        {screen === 'home' ? (
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>{t('app.kicker')}</p>
              <h2 className={styles.heroTitle}>{t('game.description')}</h2>
              <p>{t('home.subtitle')}</p>
              <Button icon={<Play size={18} />} onClick={() => setScreen('play')}>
                {t('app.newGame')}
              </Button>
            </div>
              <div className={styles.statementPreview} aria-label={t('home.previewLabel')}>
                {homePreviewKeys.map(previewKey => (
                <div key={previewKey}>{t(previewKey)}</div>
              ))}
            </div>
          </section>
        ) : null}

        {screen === 'play' ? (
          <section className={styles.screenStack}>
            {gameState.phase === 'setup' ? (
              <div className={styles.panel}>
                <h2 className={styles.pageTitle}>{t('setup.title')}</h2>
                <label className={styles.field}>
                  <span>{t('setup.mode')}</span>
                  <select
                    value={selectedModeId}
                    onChange={event => {
                      setSelectedModeId(event.target.value as GuessTheFakeModeId);
                      setSetupError('');
                    }}
                  >
                    {guessTheFakeManifest.modes.map(mode => (
                      <option key={mode.id} value={mode.id}>{t(mode.titleKey)}</option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>{t('setup.players')}</span>
                  <input value={playerNames} onChange={event => setPlayerNames(event.target.value)} />
                </label>
                <label className={styles.field}>
                  <span>{t('setup.rounds')}</span>
                  <input
                    min={1}
                    max={playableRounds.length || 1}
                    type="number"
                    value={roundCountInput}
                    onChange={event => {
                      setRoundCountInput(event.target.value.replace(/[^\d]/g, ''));
                      setSetupError('');
                    }}
                  />
                </label>
                <label className={styles.field}>
                  <span>{t('setup.category')}</span>
                  <select value={selectedCategoryId} onChange={event => setSelectedCategoryId(event.target.value)}>
                    <option value="all">{t('setup.allCategories')}</option>
                    {availableCategories.map(category => (
                      <option key={category.id} value={category.id}>{text(category.title, category.id)}</option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>{t('setup.difficulty')}</span>
                  <select
                    value={selectedDifficulty}
                    onChange={event => setSelectedDifficulty(event.target.value as GuessTheFakeDifficulty | 'all')}
                  >
                    <option value="all">{t('setup.allDifficulties')}</option>
                    <option value="easy">{t('setup.easy')}</option>
                    <option value="medium">{t('setup.medium')}</option>
                    <option value="hard">{t('setup.hard')}</option>
                  </select>
                </label>
                <p className={setupError ? styles.errorText : styles.helperText}>
                  {setupError || t('setup.availableRounds', {
                    available: playableRounds.length,
                    selected: playableRounds.length ? setupRoundCount : 0
                  })}
                </p>
                <Button icon={<Play size={18} />} onClick={startNewMatch}>{t('setup.start')}</Button>
              </div>
            ) : null}

            {gameState.phase !== 'setup' && round ? (
              <div className={styles.gameBoard}>
                <header className={styles.gameHeader}>
                  <div>
                    <p className={styles.kicker}>
                      {t('game.round', {
                        current: Math.min(gameState.currentRoundIndex + 1, gameState.totalRounds),
                        total: gameState.totalRounds
                      })}
                    </p>
                    <h2 className={styles.pageTitle}>
                      {gameState.modeId === 'teams'
                        ? t('game.activeTeam', { name: activeSubject?.name ?? '-' })
                        : t('game.activePlayer', { name: activeSubject?.name ?? activePlayer?.name ?? '-' })}
                    </h2>
                  </div>
                  <div className={styles.scoreStrip}>
                    {gameState.modeId === 'teams'
                      ? gameState.teams.map(team => (
                        <span key={team.id}>{t('game.teamScore', { name: team.name, score: team.score })}</span>
                      ))
                      : gameState.players.map(player => (
                        <span key={player.id}>{player.name}: {player.score}</span>
                      ))}
                    <button className={styles.inlineTool} type="button" onClick={resetScores}>
                      <RotateCcw size={16} /> {t('game.recalibrateScores')}
                    </button>
                  </div>
                </header>

                {gameState.phase === 'intro' ? (
                  <div className={styles.turnPanel}>
                    <div className={styles.timerBadge}><Clock size={26} /></div>
                    <p className={styles.kicker}>{t('game.round', {
                      current: Math.min(gameState.currentRoundIndex + 1, gameState.totalRounds),
                      total: gameState.totalRounds
                    })}</p>
                    <h2 className={styles.pageTitle}>
                      {gameState.modeId === 'teams'
                        ? t('game.readyTeam', { name: activeSubject?.name ?? '-' })
                        : t('game.readyPlayer', { name: activeSubject?.name ?? activePlayer?.name ?? '-' })}
                    </h2>
                    <p>{t('game.prepareHint')}</p>
                    <Button icon={<Play size={18} />} onClick={beginTurn}>{t('game.startTurn')}</Button>
                  </div>
                ) : null}

                {gameState.phase === 'preparing' ? (
                  <div className={styles.turnPanel}>
                    <div className={styles.timerRing}>
                      <strong>{timerSeconds}</strong>
                      <span>{t('game.secondsLabel')}</span>
                    </div>
                    <h2 className={styles.pageTitle}>{t('game.preparation')}</h2>
                    <p>
                      {gameState.modeId === 'teams'
                        ? t('game.readyTeam', { name: activeSubject?.name ?? '-' })
                        : t('game.readyPlayer', { name: activeSubject?.name ?? activePlayer?.name ?? '-' })}
                    </p>
                    <Button onClick={showStatementsNow}>{t('game.revealBoard')}</Button>
                  </div>
                ) : null}

                {gameState.phase === 'playing' || gameState.phase === 'revealed' ? (
                  <>
                    <div className={styles.roundToolbar}>
                      <p className={styles.prompt}>
                        {gameState.phase === 'revealed'
                          ? t('game.revealedPrompt')
                          : gameState.modeId === 'all-guess'
                            ? t('game.chooseFakeAll', { name: activeSubject?.name ?? '-' })
                            : t('game.chooseFake')}
                      </p>
                      {gameState.phase === 'playing' ? (
                        <span className={styles.timerPill}><Clock size={16} /> {t('game.timeLeft', { seconds: timerSeconds })}</span>
                      ) : null}
                    </div>
                    <div className={styles.statementGrid} onKeyDown={handleStatementGridKeyDown}>
                      <p id="statement-keyboard-hint" className={styles.visuallyHidden}>
                        {t('game.statementKeyboardHint')}
                      </p>
                      {round.statements.map((statement, index) => {
                        const guessesForStatement = Object.values(gameState.roundGuesses).filter(
                          guess => guess.selectedStatementId === statement.id
                        );
                        const pickedNames = guessesForStatement
                          .map(guess => guess.teamName ?? guess.playerName)
                          .filter(Boolean)
                          .join(', ');
                        const isSelected = gameState.selectedStatementId === statement.id;
                        const isPicked = guessesForStatement.length > 0;
                        const isFake = round.fakeStatementId === statement.id;
                        const revealed = gameState.phase === 'revealed';
                        const stateClass = revealed && isFake
                          ? styles.statementFake
                          : revealed && isPicked
                            ? styles.statementWrong
                            : '';
                        return (
                          <button
                            key={statement.id}
                            ref={element => {
                              statementButtonRefs.current[index] = element;
                            }}
                            aria-describedby="statement-keyboard-hint"
                            aria-keyshortcuts={`${index + 1}`}
                            aria-pressed={gameState.phase === 'playing' ? isSelected : undefined}
                            className={`${styles.statementCard} ${stateClass}`}
                            disabled={revealed}
                            onClick={() => chooseStatement(statement.id)}
                            type="button"
                          >
                            <span>{index + 1}</span>
                            <strong>{text(statement.text)}</strong>
                            {revealed && isFake ? <em>{t('game.fakeLabel')}</em> : null}
                            {revealed && isSelected && !pickedNames ? <em>{t('game.selectedLabel')}</em> : null}
                            {revealed && pickedNames ? <em>{t('game.pickedByLabel', { names: pickedNames })}</em> : null}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : null}

                {gameState.phase === 'revealed' ? (
                  <div className={styles.resultPanel}>
                    {Object.values(gameState.roundGuesses).some(guess => guess.correct) ? (
                      <CheckCircle2 size={28} />
                    ) : (
                      <XCircle size={28} />
                    )}
                    <div>
                      <h3 className={styles.cardTitle}>
                        {Object.values(gameState.roundGuesses).some(guess => guess.correct)
                          ? t('game.correct')
                          : t('game.wrong')}
                      </h3>
                      <p>{text(round.explanation)}</p>
                      <div className={styles.guessSummary} aria-label={t('game.allGuesses')}>
                        {Object.values(gameState.roundGuesses).map(guess => (
                          <span key={guess.playerId ?? guess.teamId}>
                            {guess.correct ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                            <b>{guess.playerName ?? guess.teamName}</b>
                            {t('game.scoreBreakdown', {
                              points: guess.pointsAwarded,
                              bonus: guess.speedBonus,
                              multiplier: guess.streakMultiplier
                            })}
                          </span>
                        ))}
                      </div>
                      <div className={styles.feedbackActions} aria-label={t('game.feedbackLabel')}>
                        <button type="button" onClick={() => rateCurrentRound('up')}>
                          <ThumbsUp size={16} /> {t('game.feedbackGood')}
                        </button>
                        <button type="button" onClick={() => rateCurrentRound('down')}>
                          <ThumbsDown size={16} /> {t('game.feedbackBad')}
                        </button>
                        <button type="button" onClick={() => rateCurrentRound('skip')}>
                          <XCircle size={16} /> {t('game.feedbackSkip')}
                        </button>
                      </div>
                    </div>
                    <Button onClick={continueRound}>
                      {gameState.currentRoundIndex + 1 >= gameState.totalRounds ? t('game.finish') : t('game.nextRound')}
                    </Button>
                  </div>
                ) : null}

                {gameState.phase === 'finished' ? (
                  <div className={styles.finalPanel}>
                    <Trophy size={34} />
                    <h2 className={styles.pageTitle}>{winners.map(player => player.name).join(', ')}</h2>
                    <div className={styles.finalScores}>
                      {gameState.modeId === 'teams'
                        ? gameState.teams.map(team => (
                          <span key={team.id}>{t('game.teamScore', { name: team.name, score: team.score })}</span>
                        ))
                        : gameState.players.map(player => (
                          <span key={player.id}>{player.name}: {player.score}</span>
                        ))}
                    </div>
                    <Button onClick={() => setGameState(createInitialGuessTheFakeState())}>{t('game.playAgain')}</Button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        ) : null}

        {screen === 'leaderboard' ? (
          <section className={styles.panel}>
            <div className={styles.pageHeader}>
              <div>
                <h2 className={styles.pageTitle}>{t('leaderboard.title')}</h2>
                <p>{t('leaderboard.subtitle')}</p>
              </div>
              <div className={styles.actionCluster}>
                <Button variant="ghost" icon={<Download size={18} />} onClick={() => downloadJson('guess-the-fake-leaderboard.json', exportLeaderboard(leaderboard))}>
                  {t('leaderboard.export')}
                </Button>
                <Button variant="secondary" icon={<Upload size={18} />} onClick={() => leaderboardFileInputRef.current?.click()}>
                  {t('leaderboard.import')}
                </Button>
                <Button
                  variant="danger"
                  icon={<RotateCcw size={18} />}
                  onClick={() => {
                    const empty = { entries: [] };
                    saveLeaderboard(empty);
                    setLeaderboard(empty);
                  }}
                >
                  {t('leaderboard.reset')}
                </Button>
              </div>
            </div>
            <input
              ref={leaderboardFileInputRef}
              hidden
              type="file"
              accept="application/json,.json"
              onChange={event => {
                const file = event.target.files?.[0];
                if (file) importLeaderboardFromFile(file);
                event.currentTarget.value = '';
              }}
            />
            <div className={styles.controlsGrid}>
              <label className={styles.field}>
                <span>{t('leaderboard.sort')}</span>
                <select value={leaderboardSort} onChange={event => setLeaderboardSort(event.target.value as LeaderboardSort)}>
                  <option value="wins">{t('leaderboard.sortWins')}</option>
                  <option value="points">{t('leaderboard.sortPoints')}</option>
                  <option value="matches">{t('leaderboard.sortMatches')}</option>
                  <option value="winRate">{t('leaderboard.sortWinRate')}</option>
                </select>
              </label>
              <label className={styles.field}>
                <span>{t('leaderboard.mode')}</span>
                <select value={leaderboardModeFilter} onChange={event => setLeaderboardModeFilter(event.target.value)}>
                  <option value="all">{t('leaderboard.allModes')}</option>
                  {guessTheFakeManifest.modes.map(mode => (
                    <option key={mode.id} value={mode.id}>{t(mode.titleKey)}</option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span>{t('leaderboard.player')}</span>
                <select value={selectedLeaderboardPlayer} onChange={event => setSelectedLeaderboardPlayer(event.target.value)}>
                  <option value="">{t('leaderboard.allPlayers')}</option>
                  {[...new Set(leaderboard.entries.map(entry => entry.playerName))].map(playerName => (
                    <option key={playerName} value={playerName}>{playerName}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className={styles.statGrid}>
              <article className={styles.metricCard}>
                <span>{t('leaderboard.summary')}</span>
                <strong>{leaderboardSummary.matches}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{t('leaderboard.bestWinRate')}</span>
                <strong>{leaderboardSummary.bestWinRate}%</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{t('leaderboard.players')}</span>
                <strong>{leaderboardSummary.players}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{t('leaderboard.averagePoints')}</span>
                <strong>{leaderboardSummary.averagePoints}</strong>
              </article>
              {playerDetail ? (
                <article className={styles.metricCard}>
                  <span>{t('leaderboard.playerDetail', { name: playerDetail.playerName })}</span>
                  <strong>{playerDetail.points}</strong>
                </article>
              ) : null}
            </div>
            {leaderboardEntries.length ? (
              <div className={styles.list}>
                {leaderboardEntries.map((entry, index) => (
                  <div key={`${entry.gameId}-${entry.modeId}-${entry.playerName}`} className={styles.listRow}>
                    <div className={styles.rankIdentity}>
                      <strong>{index + 1}</strong>
                      <div>
                        <b>{entry.playerName}</b>
                        <span>{entry.gameId} · {entry.modeId}</span>
                      </div>
                    </div>
                    <span>{t('leaderboard.rowStats', {
                      wins: entry.wins,
                      points: entry.points,
                      matches: entry.matches,
                      winRate: Math.round((entry.wins / entry.matches) * 100)
                    })}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>{t('leaderboard.empty')}</p>
            )}
            {dataStatus ? <p className={styles.helperText}>{dataStatus}</p> : null}
          </section>
        ) : null}

        {screen === 'achievements' ? (
          <section className={styles.panel}>
            <div className={styles.pageHeader}>
              <div>
                <h2 className={styles.pageTitle}>{t('achievements.title')}</h2>
                <p>{t('achievements.subtitle')}</p>
              </div>
              <div className={styles.sessionCode}>
                {t('achievements.completion', {
                  unlocked: achievementSummary.unlockedCount,
                  total: achievementSummary.totalCount,
                  percent: achievementSummary.completionPercent
                })}
              </div>
            </div>
            <div className={styles.statGrid}>
              <article className={styles.metricCard}>
                <span>{t('achievements.matches')}</span>
                <strong>{achievementState.counters.matchesFinished}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{t('achievements.streakMetric')}</span>
                <strong>{achievementState.counters.longestStreak}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{t('achievements.categoriesMetric')}</span>
                <strong>{Object.keys(achievementState.counters.categoriesPlayed).length}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{t('achievements.feedbackMetric')}</span>
                <strong>{achievementState.counters.contentFeedbackCount}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{t('achievements.next')}</span>
                <strong className={styles.metricText}>
                  {achievementSummary.nextLocked ? t(achievementSummary.nextLocked.titleKey) : t('achievements.allUnlocked')}
                </strong>
              </article>
            </div>
            <div className={styles.insightGrid}>
              <article className={styles.smallCard}>
                <ThumbsUp size={22} />
                <h3 className={styles.cardTitle}>{t('feedbackStats.title')}</h3>
                <p>{t('feedbackStats.summary', {
                  up: contentFeedbackSummary.ratings.up,
                  down: contentFeedbackSummary.ratings.down,
                  skip: contentFeedbackSummary.ratings.skip
                })}</p>
                <div className={styles.compactRows}>
                  {contentFeedbackSummary.byCategory.length
                    ? contentFeedbackSummary.byCategory.slice(0, 4).map(row => (
                      <span key={row.id}>
                        <b>{row.id}</b>
                        {t('feedbackStats.row', { total: row.total, up: row.up, down: row.down, skip: row.skip })}
                      </span>
                    ))
                    : <span>{t('feedbackStats.empty')}</span>}
                </div>
              </article>
              <article className={styles.smallCard}>
                <ListChecks size={22} />
                <h3 className={styles.cardTitle}>{t('feedbackStats.difficultyTitle')}</h3>
                <div className={styles.compactRows}>
                  {contentFeedbackSummary.byDifficulty.length
                    ? contentFeedbackSummary.byDifficulty.map(row => (
                      <span key={row.id}>
                        <b>{t(`setup.${row.id}`)}</b>
                        {t('feedbackStats.row', { total: row.total, up: row.up, down: row.down, skip: row.skip })}
                      </span>
                    ))
                    : <span>{t('feedbackStats.empty')}</span>}
                </div>
              </article>
            </div>
            <div className={styles.cardGrid}>
              {achievementDefinitions.map(definition => {
                const unlocked = Boolean(achievementState.unlocked[definition.id]);
                const progress = Math.min(definition.getProgress(achievementState.counters), definition.target);
                return (
                  <article key={definition.id} className={`${styles.smallCard} ${unlocked ? styles.unlockedCard : ''}`}>
                    <BadgeCheck size={22} />
                    <h3 className={styles.cardTitle}>{t(definition.titleKey)}</h3>
                    <p>{t(definition.descriptionKey)}</p>
                    <progress value={progress} max={definition.target} />
                    <span>{unlocked ? t('achievements.unlocked') : `${progress} / ${definition.target}`}</span>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {screen === 'packs' ? (
          <section className={styles.panel}>
            <div className={styles.pageHeader}>
              <div>
                <h2 className={styles.pageTitle}>{t('packs.title')}</h2>
                <p>{t('packs.subtitle')}</p>
              </div>
              <div className={styles.actionCluster}>
                <Button variant="secondary" icon={<Upload size={18} />} onClick={() => packFileInputRef.current?.click()}>
                  {t('packs.import')}
                </Button>
                <Button variant="ghost" icon={<Download size={18} />} onClick={() => downloadJson('guess-the-fake-packs.json', exportPacks(allPacks))}>
                  {t('packs.export')}
                </Button>
              </div>
            </div>
            <input
              ref={packFileInputRef}
              hidden
              type="file"
              accept="application/json,.json"
              onChange={event => {
                const file = event.target.files?.[0];
                if (file) importPackFromFile(file);
                event.currentTarget.value = '';
              }}
            />
            {packStatus ? <p className={styles.helperText}>{packStatus}</p> : null}
            <div className={styles.packLayout}>
              <div className={styles.list}>
                {allPacks.map(pack => {
                  const validation = validateGuessTheFakePack(pack, { expectedGameId: guessTheFakeManifest.id });
                  return (
                    <article key={pack.id} className={styles.smallCard}>
                      <ListChecks size={22} />
                      <h3 className={styles.cardTitle}>{getPackTitle(pack, settings.language)}</h3>
                      <p>
                        {t('packs.roundSummary', {
                          rounds: pack.content.rounds.length,
                          categories: pack.content.categories.length
                        })} · {pack.builtin ? t('packs.builtin') : t('packs.installed')}
                      </p>
                      <span>{t('packs.signature')}: {pack.signature ?? 'local-builtin-v1'}</span>
                      {!validation.ok ? <p className={styles.errorText}>{validation.issues[0]?.message}</p> : null}
                      <div className={styles.feedbackActions}>
                        <label className={styles.switchField}>
                          <input
                            type="checkbox"
                            checked={pack.enabled !== false}
                            disabled={pack.builtin}
                            onChange={event => togglePack(pack.id, event.target.checked)}
                          />
                          <span>{pack.enabled !== false ? t('packs.enabled') : t('packs.disabled')}</span>
                        </label>
                        {!pack.builtin ? (
                          <button type="button" onClick={() => removePack(pack.id)}>{t('packs.remove')}</button>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
              <article className={styles.smallCard}>
                <Star size={22} />
                <h3 className={styles.cardTitle}>{t('packs.preview')}</h3>
                <p>{text(enabledPacks[0]?.content.rounds[0]?.statements[0]?.text, t('packs.empty'))}</p>
                <span>{enabledPacks[0]?.content.rounds[0]?.categoryId ?? '-'}</span>
                <p>{t('packs.validationSummary', {
                  valid: allPacks.filter(pack => validateGuessTheFakePack(pack).ok).length,
                  total: allPacks.length
                })}</p>
              </article>
            </div>
          </section>
        ) : null}

        {screen === 'multiDevice' ? (
          <section className={styles.panel}>
            <div className={styles.pageHeader}>
              <div>
                <h2 className={styles.pageTitle}>{t('multiDevice.title')}</h2>
                <p>{t('multiDevice.subtitle')}</p>
              </div>
              <div className={styles.sessionCode}>
                {multiplayerSession.status === 'idle' ? <Unplug size={16} /> : <Wifi size={16} />}
                {t(`multiDevice.${multiplayerSession.status}`)}
              </div>
            </div>
            {multiDeviceStatus ? <p className={styles.helperText}>{multiDeviceStatus}</p> : null}
            <div className={styles.multiDeviceGrid}>
              <article className={styles.smallCard}>
                <Radio size={24} />
                <h3 className={styles.cardTitle}>{t('multiDevice.host')}</h3>
                <p>{t('multiDevice.hostDescription')}</p>
                {multiplayerSession.role === 'host' && multiplayerSession.sessionCode ? (
                  <>
                    <div className={styles.sessionCode}>{multiplayerSession.sessionCode}</div>
                    <div className={styles.qrPanel} aria-label={t('multiDevice.qrLabel')}>
                      {sessionQrDataUrl ? (
                        <img src={sessionQrDataUrl} alt={t('multiDevice.qrLabel')} />
                      ) : (
                        <>
                          <QrCode size={24} />
                          <div className={styles.qrGrid} aria-hidden="true">
                            {sessionQrCells.map((active, index) => (
                              <span key={index} data-active={active ? 'true' : 'false'} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <label className={styles.field}>
                      <span>{t('multiDevice.inviteLink')}</span>
                      <input value={inviteUrl} readOnly />
                    </label>
                    <div className={styles.compactRows}>
                      <span>
                        <b>{t('multiDevice.connectedGuests')}</b>
                        {multiplayerSession.guests.length}
                      </span>
                      <span>
                        <b>{t('multiDevice.transportLabel')}</b>
                        {t(`multiDevice.transport.${multiplayerSession.transport}`)}
                      </span>
                    </div>
                    <div className={styles.actionCluster}>
                      <Button variant="ghost" icon={<Copy size={18} />} onClick={() => copyText(inviteUrl, 'multiDevice.linkCopied')}>
                        {t('multiDevice.copyLink')}
                      </Button>
                      <Button variant="secondary" icon={<Download size={18} />} onClick={downloadMultiplayerSnapshot}>
                        {t('multiDevice.exportSnapshot')}
                      </Button>
                      <Button variant="danger" icon={<Unplug size={18} />} onClick={disconnectMultiplayer}>
                        {t('multiDevice.disconnect')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button variant="secondary" icon={<Radio size={18} />} onClick={openMultiplayerHost}>
                    {t('multiDevice.host')}
                  </Button>
                )}
              </article>
              <article className={styles.smallCard}>
                <ListChecks size={24} />
                <h3 className={styles.cardTitle}>{t('multiDevice.join')}</h3>
                <p>{t('multiDevice.joinDescription')}</p>
                <label className={styles.field}>
                  <span>{t('multiDevice.code')}</span>
                  <input
                    placeholder="GTF-ABC123"
                    value={joinCodeInput}
                    onChange={event => setJoinCodeInput(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === 'Enter') connectMultiplayerSession();
                    }}
                  />
                </label>
                <div className={styles.actionCluster}>
                  <Button variant="secondary" icon={<Link2 size={18} />} onClick={() => connectMultiplayerSession()}>
                    {t('multiDevice.join')}
                  </Button>
                  {multiplayerSession.role === 'guest' ? (
                    <Button variant="danger" icon={<Unplug size={18} />} onClick={disconnectMultiplayer}>
                      {t('multiDevice.disconnect')}
                    </Button>
                  ) : null}
                </div>
                <label className={styles.field}>
                  <span>{t('multiDevice.manualSnapshot')}</span>
                  <textarea
                    className={styles.snapshotInput}
                    value={manualSnapshotInput}
                    onChange={event => setManualSnapshotInput(event.target.value)}
                    placeholder={t('multiDevice.manualSnapshotPlaceholder')}
                  />
                </label>
                <Button variant="ghost" icon={<Upload size={18} />} onClick={applyManualSnapshot}>
                  {t('multiDevice.applySnapshot')}
                </Button>
              </article>
              <article className={`${styles.smallCard} ${styles.companionPanel}`}>
                <Clock size={24} />
                <h3 className={styles.cardTitle}>{t('multiDevice.localPanel')}</h3>
                {mirroredSnapshot ? (
                  <>
                    <div className={styles.timerRing}>
                      <strong>{mirroredSnapshot.timerSeconds}</strong>
                      <span>{t('game.secondsLabel')}</span>
                    </div>
                    <p>{t('multiDevice.roundStatus', {
                      current: mirroredSnapshot.roundNumber,
                      total: mirroredSnapshot.totalRounds,
                      phase: t(`multiDevice.phase.${mirroredSnapshot.phase}`)
                    })}</p>
                    <div className={styles.sessionCode}>
                      {mirroredSnapshot.revealed ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      {mirroredSnapshot.activeSubjectName}
                    </div>
                    <div className={styles.compactRows}>
                      {mirroredSnapshot.scoreboard.map(row => (
                        <span key={row.name}>
                          <b>{row.name}</b>
                          {row.score}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>{t('multiDevice.waiting')}</p>
                )}
              </article>
            </div>
          </section>
        ) : null}

        {screen === 'settings' ? (
          <section className={styles.panel}>
            <h2 className={styles.pageTitle}>{t('settings.title')}</h2>
            <div className={styles.settingsGrid}>
              <article className={styles.smallCard}>
                <h3 className={styles.cardTitle}>{t('settings.identityTitle')}</h3>
                <label className={styles.field}>
                  <span>{t('settings.language')}</span>
                  <select value={settings.language} onChange={event => updateSettings({ language: event.target.value as Language })}>
                    {SUPPORTED_LANGUAGES.map(language => (
                      <option key={language} value={language}>
                        {language === 'pt' ? 'Português' : language === 'en' ? 'English' : language.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>{t('settings.theme')}</span>
                  <select value={settings.theme} onChange={event => updateSettings({ theme: event.target.value as ThemeId })}>
                    {THEMES.map(theme => (
                      <option key={theme.id} value={theme.id}>{t(theme.labelKey)}</option>
                    ))}
                  </select>
                </label>
              </article>

              <article className={styles.smallCard}>
                <h3 className={styles.cardTitle}>{t('settings.gameplayTitle')}</h3>
                <label className={styles.rangeField}>
                  <span>{t('settings.roundTime')}: {settings.roundTimeSeconds}s</span>
                  <input type="range" min={20} max={120} step={10} value={settings.roundTimeSeconds} onChange={event => updateSettings({ roundTimeSeconds: Number(event.target.value) })} />
                </label>
                <label className={styles.rangeField}>
                  <span>{t('settings.preparationTime')}: {settings.preparationTimeSeconds}s</span>
                  <input type="range" min={1} max={10} step={1} value={settings.preparationTimeSeconds} onChange={event => updateSettings({ preparationTimeSeconds: Number(event.target.value) })} />
                </label>
                <label className={styles.switchField}>
                  <input type="checkbox" checked={settings.autoStartRounds} onChange={event => updateSettings({ autoStartRounds: event.target.checked })} />
                  <span>{t('settings.autoStart')}</span>
                </label>
                <label className={styles.switchField}>
                  <input type="checkbox" checked={settings.shuffleRounds} onChange={event => updateSettings({ shuffleRounds: event.target.checked })} />
                  <span>{t('settings.shuffle')}</span>
                </label>
              </article>

              <article className={styles.smallCard}>
                <h3 className={styles.cardTitle}>{t('settings.scoringTitle')}</h3>
                <label className={styles.field}>
                  <span>{t('settings.correctPoints')}</span>
                  <input type="number" value={settings.correctGuessPoints} onChange={event => updateSettings({ correctGuessPoints: Number(event.target.value) })} />
                </label>
                <label className={styles.field}>
                  <span>{t('settings.wrongPenalty')}</span>
                  <input type="number" value={settings.wrongGuessPenalty} onChange={event => updateSettings({ wrongGuessPenalty: Number(event.target.value) })} />
                </label>
                <label className={styles.field}>
                  <span>{t('settings.speedBonus')}</span>
                  <input type="number" min={0} value={settings.speedBonusPoints} onChange={event => updateSettings({ speedBonusPoints: Number(event.target.value) })} />
                </label>
                <Button variant="ghost" icon={<RotateCcw size={18} />} onClick={resetScores}>{t('game.recalibrateScores')}</Button>
              </article>

              <article className={styles.smallCard}>
                <h3 className={styles.cardTitle}>{t('settings.mediaTitle')}</h3>
                <label className={styles.switchField}>
                  <input type="checkbox" checked={settings.soundEnabled} onChange={event => updateSettings({ soundEnabled: event.target.checked })} />
                  <span>{t('settings.sound')}</span>
                </label>
                <label className={styles.switchField}>
                  <input type="checkbox" checked={settings.musicEnabled} onChange={event => updateSettings({ musicEnabled: event.target.checked })} />
                  <span>{t('settings.music')}</span>
                </label>
              </article>

              <article className={styles.smallCard}>
                <h3 className={styles.cardTitle}>{t('settings.dataTitle')}</h3>
                <p>{t('settings.userId', { id: userIdentity.userId })}</p>
                <div className={styles.actionCluster}>
                  <Button variant="ghost" icon={<Download size={18} />} onClick={exportAllData}>{t('settings.exportData')}</Button>
                  <Button variant="secondary" icon={<Upload size={18} />} onClick={() => dataFileInputRef.current?.click()}>{t('settings.importData')}</Button>
                </div>
                <input
                  ref={dataFileInputRef}
                  hidden
                  type="file"
                  accept="application/json,.json"
                  onChange={event => {
                    const file = event.target.files?.[0];
                    if (file) importAllData(file);
                    event.currentTarget.value = '';
                  }}
                />
                {dataStatus ? <p className={styles.helperText}>{dataStatus}</p> : null}
              </article>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function createLocalSignature(raw: string) {
  let hash = 0;
  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash * 31 + raw.charCodeAt(index)) >>> 0;
  }
  return `local-${hash.toString(16).padStart(8, '0')}`;
}

function supportsBroadcastChannel() {
  return typeof BroadcastChannel !== 'undefined';
}

function getMultiplayerChannelName(sessionCode: string) {
  return `gtf.multiplayer.${sessionCode}`;
}

function createSessionQrCells(sessionCode: string) {
  const size = 11;
  const cells = Array.from({ length: size * size }, (_, index) => {
    const x = index % size;
    const y = Math.floor(index / size);
    const inTopLeft = x < 3 && y < 3;
    const inTopRight = x >= size - 3 && y < 3;
    const inBottomLeft = x < 3 && y >= size - 3;
    if (inTopLeft || inTopRight || inBottomLeft) return x === 0 || y === 0 || x === 2 || y === 2 || x >= size - 3 || y >= size - 3;

    const charCode = sessionCode.charCodeAt((x + y * size) % Math.max(1, sessionCode.length)) || 0;
    return ((charCode + x * 7 + y * 11) % 5) < 2;
  });
  return cells;
}
