import {
  AtSign,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  Clock,
  Cog,
  Coffee,
  Copy,
  Download,
  Facebook,
  Gift,
  Home,
  Instagram,
  Link2,
  ListChecks,
  Medal,
  MessageCircle,
  QrCode,
  Send,
  Sparkles,
  Play,
  Radio,
  RotateCcw,
  Share2,
  ShieldCheck,
  Smartphone,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  Twitter,
  Unplug,
  Upload,
  Volume2,
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
import {
  createPlatformAudioService,
  getMusicZone,
  type AudioEvent,
  type PlatformAudioService,
  type ThemeAudioTracks
} from '../core/audio/audio';
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
import { LANGUAGE_LOCALES, SUPPORTED_LANGUAGES, translate, type Language } from '../core/i18n/i18n';
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
import {
  DEFAULT_SETTINGS,
  FONT_SCALE_OPTIONS,
  FONT_SCALE_VALUES,
  loadSettings,
  normalizeSettings,
  saveSettings,
  type FontScale,
  type PlatformSettings
} from '../core/settings/settings';
import {
  DONATION_LINKS,
  SOCIAL_WEB_FALLBACKS,
  createMatchResultShareText,
  createPlatformShareUrl,
  createShareMessage,
  createShareUrl,
  isDonationUrlConfigured,
  type PlatformShareData,
  type SharePlatform
} from '../core/share/share';
import { applyTheme, THEMES, type ThemeId } from '../core/themes/themes';
import { Button } from '../core/ui/Button';
import {
  createInitialMultiplayerSessionState,
  createInviteUrl,
  createSessionStateMessage,
  createWebRtcSignalPayload,
  disconnectMultiplayerSession,
  exportMultiplayerSnapshot,
  hostMultiplayerSession,
  importMultiplayerSnapshot,
  joinMultiplayerSession,
  loadMultiplayerSession,
  normalizeSessionCode,
  parseMultiplayerMessage,
  parseWebRtcSignalPayload,
  reduceMultiplayerMessage,
  saveMultiplayerSession,
  serializeMultiplayerMessage,
  serializeWebRtcSignalPayload,
  updateMultiplayerPeerStatus,
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
import autumnGameplayUrl from '../assets/songs/autumn_gameplay.mp3';
import autumnGameroomUrl from '../assets/songs/autumn_gameroom.mp3';
import cosmicGameplayUrl from '../assets/songs/cosmic_gameplay.mp3';
import cosmicGameroomUrl from '../assets/songs/cosmic_gameroom.mp3';
import springGameplayUrl from '../assets/songs/spring_gameplay.mp3';
import springGameroomUrl from '../assets/songs/spring_gameroom.mp3';
import { getLocalizedText, validateGuessTheFakePack } from '../games/guess-the-fake/content-schema';
import { sampleGuessTheFakePack, type GuessTheFakePackContent } from '../games/guess-the-fake/data/sample-pack';
import { guessTheFakeManifest } from '../games/guess-the-fake/game.manifest';
import {
  clearPersistedGuessTheFakeMatch,
  loadPersistedGuessTheFakeMatch,
  savePersistedGuessTheFakeMatch,
  type PersistedGuessTheFakeMatch
} from '../games/guess-the-fake/match-storage';
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
import { getNewMatchNavigationDecision, hasMatchInProgress } from './new-match-flow';
import { normalizeSetupFilters } from './setup-filters';
import {
  AchievementsScreen,
  GameBoardScreen,
  GrowthScreen,
  HomeScreen,
  LeaderboardScreen,
  MultiDeviceScreen,
  PacksScreen,
  SettingsScreen,
  SetupScreen
} from './screens/AppScreens';
import styles from './App.module.css';
import { translations } from './translations';

type Screen = 'home' | 'play' | 'leaderboard' | 'achievements' | 'packs' | 'multiDevice' | 'growth' | 'settings';

const screenToneClass: Record<Screen, string> = {
  home: 'contextHome',
  play: 'contextPlay',
  leaderboard: 'contextLeaderboard',
  achievements: 'contextAchievements',
  packs: 'contextPacks',
  multiDevice: 'contextMultiDevice',
  growth: 'contextGrowth',
  settings: 'contextSettings'
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
};

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
  const audioServiceRef = useRef<PlatformAudioService | null>(null);
  const multiplayerChannelRef = useRef<BroadcastChannel | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const peerDataChannelRef = useRef<RTCDataChannel | null>(null);
  const peerSessionCodeRef = useRef('');
  const autoJoinHandledRef = useRef(false);
  const guestIdRef = useRef(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `guest-${crypto.randomUUID()}`
      : `guest-${Math.random().toString(36).slice(2, 10)}`
  );
  const demoMode = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('demo')
    : null;
  const initialPersistedMatchRef = useRef<PersistedGuessTheFakeMatch | null | undefined>(undefined);
  if (initialPersistedMatchRef.current === undefined) {
    initialPersistedMatchRef.current = demoMode !== 'game' && typeof localStorage !== 'undefined'
      ? loadPersistedGuessTheFakeMatch()
      : null;
  }
  const initialPersistedMatch = initialPersistedMatchRef.current;
  const restoredTimerSecondsRef = useRef<number | null>(initialPersistedMatch?.timerSeconds ?? null);
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
    return loadSettings();
  });
  const [screen, setScreen] = useState<Screen>(demoMode === 'game' || initialPersistedMatch ? 'play' : 'home');
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
    if (initialPersistedMatch) return initialPersistedMatch.state;
    return createInitialGuessTheFakeState();
  });
  const [playerNames, setPlayerNames] = useState('Ana, Bruno');
  const [selectedModeId, setSelectedModeId] = useState<GuessTheFakeModeId>('classic');
  const [roundCountInput, setRoundCountInput] = useState('5');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GuessTheFakeDifficulty | 'all'>('all');
  const [setupError, setSetupError] = useState('');
  const [showNewMatchChoices, setShowNewMatchChoices] = useState(Boolean(initialPersistedMatch));
  const [scoreResetStatus, setScoreResetStatus] = useState<'confirm' | 'done' | null>(null);
  const [activeMatchLanguage, setActiveMatchLanguage] = useState<Language | null>(() =>
    initialPersistedMatch?.activeMatchLanguage ?? (demoMode === 'game' ? settings.language : null)
  );
  const [packStatus, setPackStatus] = useState('');
  const [leaderboardSort, setLeaderboardSort] = useState<LeaderboardSort>('wins');
  const [leaderboardModeFilter, setLeaderboardModeFilter] = useState('all');
  const [selectedLeaderboardPlayer, setSelectedLeaderboardPlayer] = useState('');
  const [dataStatus, setDataStatus] = useState('');
  const [growthStatus, setGrowthStatus] = useState('');
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalonePwa, setIsStandalonePwa] = useState(() => isRunningStandalonePwa());
  const [multiDeviceStatus, setMultiDeviceStatus] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [manualSnapshotInput, setManualSnapshotInput] = useState('');
  const [webrtcSignalInput, setWebrtcSignalInput] = useState('');
  const [webrtcSignalOutput, setWebrtcSignalOutput] = useState('');
  const [sessionQrDataUrl, setSessionQrDataUrl] = useState('');
  const [multiplayerSession, setMultiplayerSession] = useState(() => {
    if (typeof localStorage === 'undefined') return createInitialMultiplayerSessionState();
    return loadMultiplayerSession();
  });
  const [achievementNotice, setAchievementNotice] = useState<AchievementDefinition | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(() => initialPersistedMatch?.timerSeconds ?? 0);
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
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  ));

  if (!audioServiceRef.current && typeof window !== 'undefined') {
    audioServiceRef.current = createPlatformAudioService({ tracks: THEME_AUDIO_TRACKS });
  }

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
  const languageAvailableRounds = useMemo(() => {
    return enabledPacks.flatMap(pack =>
      pack.content.rounds.filter(round => !shouldSkipRound(contentFeedback, round.id))
    );
  }, [contentFeedback, enabledPacks]);
  const playableRounds = useMemo(() => {
    return languageAvailableRounds
      .filter(round => selectedCategoryId === 'all' || round.categoryId === selectedCategoryId)
      .filter(round => selectedDifficulty === 'all' || round.difficulty === selectedDifficulty);
  }, [languageAvailableRounds, selectedCategoryId, selectedDifficulty]);
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
  const activeMatchUsesPreviousLanguage = hasMatchInProgress(gameState.phase)
    && Boolean(activeMatchLanguage)
    && activeMatchLanguage !== settings.language;

  useEffect(() => {
    applyTheme(settings.theme);
    document.documentElement.style.setProperty('--font-scale', String(FONT_SCALE_VALUES[settings.fontScale]));
    document.documentElement.lang = LANGUAGE_LOCALES[settings.language];
    document.title = t('game.title');
    saveSettings(settings);
  }, [settings, t]);

  useEffect(() => {
    document.body.dataset.activeScreen = screen;
  }, [screen]);

  useEffect(() => {
    setScoreResetStatus(null);
  }, [screen, gameState.phase, gameState.currentRoundIndex]);

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
    const normalized = normalizeSetupFilters(
      { categoryId: selectedCategoryId, difficulty: selectedDifficulty },
      {
        categoryIds: availableCategories.map(category => category.id),
        rounds: languageAvailableRounds
      }
    );

    if (normalized.categoryId !== selectedCategoryId) {
      setSelectedCategoryId(normalized.categoryId);
      setSetupError('');
    }
    if (normalized.difficulty !== selectedDifficulty) {
      setSelectedDifficulty(normalized.difficulty);
      setSetupError('');
    }
  }, [availableCategories, languageAvailableRounds, selectedCategoryId, selectedDifficulty]);

  useEffect(() => {
    saveMultiplayerSession(multiplayerSession);
  }, [multiplayerSession]);

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
    if (restoredTimerSecondsRef.current !== null) {
      restoredTimerSecondsRef.current = null;
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
        const currentRound = getCurrentRound(current);
        const timedOut = timeOutRound(current, currentScoring()).state;
        playSound('wrong');
        recordRoundAchievements(timedOut, Object.values(timedOut.roundGuesses), currentRound);
        return timedOut;
      });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [gameState.phase, settings.correctGuessPoints, settings.speedBonusPoints, settings.wrongGuessPenalty, showNewMatchChoices, timerSeconds]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event as BeforeInstallPromptEvent);
      setGrowthStatus(t('pwa.installReady'));
    };
    const handleInstalled = () => {
      setDeferredInstallPrompt(null);
      setIsStandalonePwa(true);
      setGrowthStatus(t('pwa.installed'));
    };
    const handleVisibility = () => setIsStandalonePwa(isRunningStandalonePwa());

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('pageshow', handleVisibility);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('pageshow', handleVisibility);
    };
  }, [t]);

  useEffect(() => {
    audioServiceRef.current?.syncMusic({
      settings,
      themeId: settings.theme,
      zone: getMusicZone(screen, gameState.phase),
      reducedMotion
    });
  }, [gameState.phase, reducedMotion, screen, settings]);

  useEffect(() => {
    return () => audioServiceRef.current?.dispose();
  }, []);

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
  const currentRoundFeedbackRating = round
    ? contentFeedback.entries.find(entry => entry.roundId === round.id)?.rating ?? null
    : null;
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
    { id: 'growth', label: t('app.growth'), icon: <Share2 size={18} /> },
    { id: 'settings', label: t('app.settings'), icon: <Cog size={18} /> }
  ];
  const screenIconMap: Record<Screen, ReactNode> = {
    home: <Home size={20} />,
    play: <Play size={20} />,
    leaderboard: <Medal size={20} />,
    achievements: <Trophy size={20} />,
    packs: <Boxes size={20} />,
    multiDevice: <Radio size={20} />,
    growth: <Share2 size={20} />,
    settings: <Cog size={20} />
  };
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
  const appShareUrl = typeof window !== 'undefined'
    ? createShareUrl(window.location.href, import.meta.env.VITE_GTF_PUBLIC_URL ?? '')
    : '';
  const appShareData: PlatformShareData = {
    title: t('share.title'),
    text: t('share.text'),
    url: appShareUrl
  };
  const resultShareText = gameState.phase === 'finished'
    ? createMatchResultShareText({
      winnerNames: winners.map(player => player.name),
      modeLabel: t(guessTheFakeManifest.modes.find(mode => mode.id === gameState.modeId)?.titleKey ?? 'game.title'),
      totalRounds: gameState.totalRounds,
      roundsLabel: t('share.roundsLabel'),
      gameTitle: t('game.title'),
      callToAction: t('share.resultCallToAction')
    })
    : '';
  const resultShareData: PlatformShareData = {
    title: t('share.resultTitle'),
    text: resultShareText,
    url: appShareUrl
  };
  const canUseBroadcastChannel = supportsBroadcastChannel();
  const canUseWebRtc = supportsWebRtc();
  const sessionQrCells = useMemo(
    () => createSessionQrCells(multiplayerSession.sessionCode || 'GTF-LOCAL'),
    [multiplayerSession.sessionCode]
  );
  const selectedMode = guessTheFakeManifest.modes.find(mode => mode.id === selectedModeId) ?? guessTheFakeManifest.modes[0];
  const setupPlayers = playerNames.split(',').map(name => name.trim()).filter(Boolean);
  const setupDifficultyCounts = useMemo(() => {
    return languageAvailableRounds.reduce<Record<GuessTheFakeDifficulty, number>>(
      (counts, setupRound) => ({
        ...counts,
        [setupRound.difficulty]: counts[setupRound.difficulty] + 1
      }),
      { easy: 0, medium: 0, hard: 0 }
    );
  }, [languageAvailableRounds]);
  const setupCategoryPreview = availableCategories.slice(0, 6).map(category => text(category.title, category.id));
  const requestedSetupRounds = Number(roundCountInput);
  const setupContentIsLow = Number.isFinite(requestedSetupRounds)
    && playableRounds.length > 0
    && requestedSetupRounds > playableRounds.length;

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      if (!showNewMatchChoices && gameState.phase === 'playing') {
        statementButtonRefs.current[0]?.focus({ preventScroll: true });
        return;
      }
      mainRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [screen, gameState.phase, gameState.currentRoundIndex, showNewMatchChoices]);

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
    return () => closePeerConnection();
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

  function syncCurrentMusic() {
    audioServiceRef.current?.syncMusic({
      settings,
      themeId: settings.theme,
      zone: getMusicZone(screen, gameState.phase),
      reducedMotion
    });
  }

  function unlockAudio() {
    audioServiceRef.current?.unlock();
    syncCurrentMusic();
  }

  function playSound(event: AudioEvent) {
    audioServiceRef.current?.playEvent(event, settings);
  }

  function playUiSound(event: AudioEvent) {
    unlockAudio();
    playSound(event);
  }

  function previewSound() {
    unlockAudio();
    playSound('preview');
  }

  function handleShellClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    const control = target?.closest('button, [role="button"], input, select');
    if (!(control instanceof HTMLElement)) return;
    if (control.hasAttribute('disabled') || control.getAttribute('aria-disabled') === 'true') return;
    if (control.closest('[data-audio-skip="true"]')) return;
    if (control.classList.contains(styles.statementCard)) return;
    playUiSound(control.closest('nav') ? 'navigation' : 'ui-click');
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
    if (peerDataChannelRef.current?.readyState === 'open') {
      peerDataChannelRef.current.send(serializeMultiplayerMessage(message));
    }
    if (!supportsBroadcastChannel()) return;
    const channel = multiplayerChannelRef.current ?? new BroadcastChannel(getMultiplayerChannelName(message.sessionCode));
    channel.postMessage(serializeMultiplayerMessage(message));
    if (!multiplayerChannelRef.current) channel.close();
  }

  function openMultiplayerHost() {
    const transport: MultiplayerTransportKind = supportsWebRtc()
      ? 'webrtc-manual'
      : supportsBroadcastChannel()
        ? 'broadcast-channel'
        : 'manual-offline';
    const hosted = hostMultiplayerSession(multiplayerSession, { transport });
    setMultiplayerSession({ ...hosted, lastSnapshot: hostSnapshot });
    setMultiDeviceStatus(t(transport === 'webrtc-manual' ? 'multiDevice.peerReady' : transport === 'broadcast-channel' ? 'multiDevice.hostReady' : 'multiDevice.offlineReady'));
  }

  function connectMultiplayerSession(value = joinCodeInput) {
    const transport: MultiplayerTransportKind = supportsWebRtc()
      ? 'webrtc-manual'
      : supportsBroadcastChannel()
        ? 'broadcast-channel'
        : 'manual-offline';
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
    closePeerConnection();
    setWebrtcSignalInput('');
    setWebrtcSignalOutput('');
    setMultiplayerSession(disconnected.state);
    setMultiDeviceStatus(t('multiDevice.disconnected'));
  }

  async function createPeerOffer() {
    if (!canUseWebRtc) {
      setMultiDeviceStatus(t('multiDevice.peerUnavailable'));
      setMultiplayerSession(current => updateMultiplayerPeerStatus(current, 'failed', { error: 'peer-unavailable' }));
      return;
    }
    const sessionCode = multiplayerSession.sessionCode || hostMultiplayerSession(multiplayerSession, { transport: 'webrtc-manual' }).sessionCode;
    const hosted = hostMultiplayerSession(multiplayerSession, { transport: 'webrtc-manual' });
    try {
      closePeerConnection();
      peerSessionCodeRef.current = hosted.sessionCode || sessionCode;
      const peer = createPeerConnection('host');
      const channel = peer.createDataChannel('guess-the-fake-session');
      configurePeerDataChannel(channel, 'host');
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      await waitForIceGatheringComplete(peer);
      const payload = createWebRtcSignalPayload('offer', hosted.sessionCode || sessionCode, peer.localDescription?.sdp ?? offer.sdp ?? '');
      setWebrtcSignalOutput(serializeWebRtcSignalPayload(payload));
      setMultiplayerSession({ ...hosted, sessionCode: payload.sessionCode, lastSnapshot: hostSnapshot, peerStatus: 'signaling' });
      setMultiDeviceStatus(t('multiDevice.offerCreated'));
    } catch {
      closePeerConnection();
      setMultiplayerSession(current => updateMultiplayerPeerStatus(current, 'failed', { error: 'peer-offer-failed' }));
      setMultiDeviceStatus(t('multiDevice.offerFailed'));
    }
  }

  async function createPeerAnswer() {
    const payload = parseWebRtcSignalPayload(webrtcSignalInput);
    if (!payload || payload.kind !== 'offer') {
      setMultiDeviceStatus(t('multiDevice.offerInvalid'));
      return;
    }
    if (!canUseWebRtc) {
      setMultiDeviceStatus(t('multiDevice.peerUnavailable'));
      return;
    }

    try {
      closePeerConnection();
      peerSessionCodeRef.current = payload.sessionCode;
      const peer = createPeerConnection('guest');
      await peer.setRemoteDescription({ type: 'offer', sdp: payload.sdp });
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      await waitForIceGatheringComplete(peer);
      const answerPayload = createWebRtcSignalPayload('answer', payload.sessionCode, peer.localDescription?.sdp ?? answer.sdp ?? '');
      setWebrtcSignalOutput(serializeWebRtcSignalPayload(answerPayload));
      const joined = joinMultiplayerSession(multiplayerSession, payload.sessionCode, {
        guestId: guestIdRef.current,
        transport: 'webrtc-manual'
      });
      setJoinCodeInput(payload.sessionCode);
      setMultiplayerSession({ ...joined.state, peerStatus: 'connecting' });
      setMultiDeviceStatus(t('multiDevice.answerCreated'));
    } catch {
      closePeerConnection();
      setMultiplayerSession(current => updateMultiplayerPeerStatus(current, 'failed', { error: 'peer-answer-failed' }));
      setMultiDeviceStatus(t('multiDevice.answerFailed'));
    }
  }

  async function applyPeerAnswer() {
    const payload = parseWebRtcSignalPayload(webrtcSignalInput);
    if (!payload || payload.kind !== 'answer') {
      setMultiDeviceStatus(t('multiDevice.answerInvalid'));
      return;
    }
    if (!peerConnectionRef.current) {
      setMultiDeviceStatus(t('multiDevice.offerFirst'));
      return;
    }
    if (normalizeSessionCode(payload.sessionCode) !== normalizeSessionCode(multiplayerSession.sessionCode)) {
      setMultiDeviceStatus(t('multiDevice.signalWrongSession'));
      return;
    }

    try {
      await peerConnectionRef.current.setRemoteDescription({ type: 'answer', sdp: payload.sdp });
      setMultiplayerSession(current => updateMultiplayerPeerStatus(current, 'connecting', { error: null }));
      setMultiDeviceStatus(t('multiDevice.answerApplied'));
    } catch {
      setMultiplayerSession(current => updateMultiplayerPeerStatus(current, 'failed', { error: 'peer-answer-apply-failed' }));
      setMultiDeviceStatus(t('multiDevice.answerFailed'));
    }
  }

  function resetPeerConnection() {
    closePeerConnection();
    peerSessionCodeRef.current = '';
    setWebrtcSignalInput('');
    setWebrtcSignalOutput('');
    setMultiplayerSession(current => updateMultiplayerPeerStatus(current, current.status === 'idle' ? 'idle' : 'signaling', { error: null }));
    setMultiDeviceStatus(t('multiDevice.peerReset'));
  }

  async function copyTextToClipboard(value: string) {
    if (!value) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.left = '-9999px';
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    const activeElement = document.activeElement;
    textarea.focus();
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (activeElement instanceof HTMLElement) activeElement.focus();
    if (!copied) throw new Error('Clipboard copy failed');
  }

  async function copyText(value: string, statusKey: string) {
    if (!value) return;
    try {
      await copyTextToClipboard(value);
      setMultiDeviceStatus(t(statusKey));
    } catch {
      setMultiDeviceStatus(value);
    }
  }

  function canUseNativeShare(shareData: PlatformShareData) {
    const shareNavigator = navigator as Navigator & {
      share?: (data: PlatformShareData) => Promise<void>;
      canShare?: (data: PlatformShareData) => boolean;
    };
    if (!shareNavigator.share) return false;
    if (!shareNavigator.canShare) return true;
    try {
      return shareNavigator.canShare(shareData);
    } catch {
      return false;
    }
  }

  async function shareNative(shareData: PlatformShareData, fallbackStatusKey = 'share.unavailable') {
    const shareNavigator = navigator as Navigator & {
      share?: (data: PlatformShareData) => Promise<void>;
    };
    if (canUseNativeShare(shareData) && shareNavigator.share) {
      try {
        await shareNavigator.share(shareData);
        setGrowthStatus(t('share.shared'));
        return true;
      } catch (error) {
        if ((error as { name?: string })?.name === 'AbortError') return false;
      }
    }

    return copyShareMessage(shareData, fallbackStatusKey);
  }

  async function copyShareMessage(shareData: PlatformShareData, statusKey = 'share.copied') {
    try {
      await copyTextToClipboard(createShareMessage(shareData));
      setGrowthStatus(t(statusKey));
      return true;
    } catch {
      setGrowthStatus(t('share.copyFailed'));
      return false;
    }
  }

  async function shareToPlatform(platform: SharePlatform | 'native' | 'copy', shareData = appShareData) {
    if (platform === 'native') {
      await shareNative(shareData);
      return;
    }
    if (platform === 'copy') {
      await copyShareMessage(shareData);
      return;
    }

    if (platform === 'instagram' || platform === 'tiktok' || platform === 'threads') {
      const shared = await shareNative(shareData, `share.${platform}Fallback`);
      if (!canUseNativeShare(shareData)) {
        const fallbackUrl = SOCIAL_WEB_FALLBACKS[platform];
        if (fallbackUrl) openExternalUrl(fallbackUrl);
      }
      if (!shared) setGrowthStatus(t(`share.${platform}Fallback`));
      return;
    }

    const platformUrl = createPlatformShareUrl(platform, shareData);
    if (platformUrl) {
      openExternalUrl(platformUrl);
      setGrowthStatus(t('share.opened'));
      return;
    }

    await shareNative(shareData);
  }

  async function installPwa() {
    if (isStandalonePwa) {
      setGrowthStatus(t('pwa.alreadyInstalled'));
      return;
    }
    if (!deferredInstallPrompt) {
      setGrowthStatus(t('pwa.installUnavailable'));
      return;
    }

    await deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    setDeferredInstallPrompt(null);
    setGrowthStatus(t(choice.outcome === 'accepted' ? 'pwa.installAccepted' : 'pwa.installDismissed'));
  }

  function openDonationUrl(url: string) {
    if (!isDonationUrlConfigured(url)) {
      setGrowthStatus(t('donate.linkUnavailable'));
      return;
    }
    openExternalUrl(url);
  }

  function createPeerConnection(role: 'host' | 'guest') {
    const peer = new RTCPeerConnection({ iceServers: getIceServers() });
    peerConnectionRef.current = peer;

    peer.onconnectionstatechange = () => {
      const nextStatus = peer.connectionState === 'connected'
        ? 'connected'
        : peer.connectionState === 'failed'
          ? 'failed'
          : peer.connectionState === 'disconnected' || peer.connectionState === 'closed'
            ? 'disconnected'
            : 'connecting';
      setMultiplayerSession(current => updateMultiplayerPeerStatus(current, nextStatus, {
        error: nextStatus === 'failed' ? 'peer-connection-failed' : null
      }));
      if (nextStatus === 'failed') setMultiDeviceStatus(t('multiDevice.peerFailed'));
    };

    if (role === 'guest') {
      peer.ondatachannel = event => configurePeerDataChannel(event.channel, 'guest');
    }

    return peer;
  }

  function configurePeerDataChannel(channel: RTCDataChannel, role: 'host' | 'guest') {
    peerDataChannelRef.current = channel;
    channel.onopen = () => {
      const sessionCode = peerSessionCodeRef.current || multiplayerSession.sessionCode || joinCodeInput;
      setMultiplayerSession(current => updateMultiplayerPeerStatus(current, 'connected', { error: null }));
      setMultiDeviceStatus(t('multiDevice.peerConnected'));
      if (role === 'guest') {
        const ready = joinMultiplayerSession(multiplayerSession, sessionCode, {
          guestId: guestIdRef.current,
          transport: 'webrtc-manual'
        }).message;
        if (ready) channel.send(serializeMultiplayerMessage(ready));
      } else if (sessionCode) {
        channel.send(serializeMultiplayerMessage(createSessionStateMessage(sessionCode, hostSnapshot)));
      }
    };
    channel.onclose = () => {
      setMultiplayerSession(current => updateMultiplayerPeerStatus(current, current.status === 'idle' ? 'idle' : 'disconnected'));
    };
    channel.onerror = () => {
      setMultiplayerSession(current => updateMultiplayerPeerStatus(current, 'failed', { error: 'peer-data-channel-failed' }));
      setMultiDeviceStatus(t('multiDevice.peerFailed'));
    };
    channel.onmessage = event => {
      const raw = typeof event.data === 'string' ? event.data : '';
      const message = parseMultiplayerMessage(raw);
      if (!message) return;
      setMultiplayerSession(current => reduceMultiplayerMessage(current, message));
    };
  }

  function closePeerConnection() {
    peerDataChannelRef.current?.close();
    peerConnectionRef.current?.close();
    peerDataChannelRef.current = null;
    peerConnectionRef.current = null;
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

  function openCleanSetup(error = '') {
    setSetupError(error);
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

  function restartCurrentMatch() {
    startNewMatch({ onValidationError: 'show-setup' });
  }

  function startNewMatch(options: { onValidationError?: 'stay' | 'show-setup' } = {}) {
    unlockAudio();
    setSetupError('');
    const names = playerNames.split(',').map(name => name.trim()).filter(Boolean);
    const effectiveNames = names.length ? names : ['Jogador 1'];
    if (selectedMode && effectiveNames.length < selectedMode.minPlayers) {
      const error = t('setup.notEnoughPlayers', { count: selectedMode.minPlayers });
      setSetupError(error);
      if (options.onValidationError === 'show-setup') openCleanSetup(error);
      return false;
    }
    if (!playableRounds.length) {
      const error = t('setup.noRounds');
      setSetupError(error);
      if (options.onValidationError === 'show-setup') openCleanSetup(error);
      return false;
    }
    const parsedRounds = Number(roundCountInput);
    if (!Number.isFinite(parsedRounds) || parsedRounds < 1) {
      const error = t('setup.invalidRounds');
      setSetupError(error);
      if (options.onValidationError === 'show-setup') openCleanSetup(error);
      return false;
    }
    const next = startMatch(createInitialGuessTheFakeState(), {
      modeId: selectedModeId,
      playerNames: effectiveNames,
      totalRounds: parsedRounds,
      rounds: playableRounds,
      shuffleRounds: settings.shuffleRounds
    });
    setShowNewMatchChoices(false);
    setActiveMatchLanguage(settings.language);
    setGameState(settings.autoStartRounds ? beginPreparation(next) : next);
    setScreen('play');
    return true;
  }

  function chooseStatement(statementId: string) {
    unlockAudio();
    setGameState(current => {
      if (current.phase !== 'playing') return current;
      const { state } = submitGuess(current, statementId, currentScoring(), {
        remainingSeconds: timerSeconds,
        totalSeconds: settings.roundTimeSeconds
      });
      playSound(state.phase === 'revealed' ? (Object.values(state.roundGuesses).some(guess => guess.correct) ? 'correct' : 'wrong') : 'card-select');
      const currentRound = getCurrentRound(current);
      if (state.phase === 'revealed') {
        recordRoundAchievements(state, Object.values(state.roundGuesses), currentRound);
      }
      return state;
    });
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

  function requestScoreReset() {
    setScoreResetStatus('confirm');
  }

  function resetScores() {
    setGameState(current => recalibrateScores(current));
    setScoreResetStatus('done');
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
      setSettings(normalizeSettings(data.settings));
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
    <div className={styles.appShell} onClickCapture={handleShellClick}>
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
              onClick={() => {
                if (item.id === 'play') {
                  requestNewMatch();
                  return;
                }
                setShowNewMatchChoices(false);
                setScreen(item.id);
              }}
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
          <HomeScreen>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>{t('app.kicker')}</p>
              <h2 className={styles.heroTitle}>{t('game.description')}</h2>
              <p>{t('home.subtitle')}</p>
              <Button icon={<Play size={18} />} onClick={requestNewMatch}>
                {t('app.newGame')}
              </Button>
            </div>
            <div className={`${styles.contextArt} ${styles.contextHome}`} aria-label={t('visual.homeArt')}>
              <Sparkles size={28} />
              <Trophy size={32} />
              <ShieldCheck size={26} />
            </div>
              <div className={styles.statementPreview} aria-label={t('home.previewLabel')}>
                {homePreviewKeys.map(previewKey => (
                <div key={previewKey}>{t(previewKey)}</div>
              ))}
            </div>
          </HomeScreen>
        ) : null}

        {screen === 'play' ? (
          <section className={styles.screenStack}>
            {showNewMatchChoices && hasMatchInProgress(gameState.phase) ? (
              <SetupScreen>
                <div className={styles.pageHeader}>
                  <div className={`${styles.screenMark} ${styles[screenToneClass.play]}`} aria-hidden="true">
                    {screenIconMap.play}
                  </div>
                  <div>
                    <p className={styles.kicker}>{t('newMatchChoice.kicker')}</p>
                    <h2 className={styles.pageTitle}>{t('newMatchChoice.title')}</h2>
                    <p>{t('newMatchChoice.description')}</p>
                    {activeMatchUsesPreviousLanguage ? (
                      <p className={styles.helperText}>
                        {t('newMatchChoice.languageNotice', {
                          match: getLanguageLabel(activeMatchLanguage ?? settings.language),
                          current: getLanguageLabel(settings.language)
                        })}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className={styles.choiceGrid}>
                  <article className={styles.smallCard}>
                    <Play size={22} />
                    <h3 className={styles.cardTitle}>{t('newMatchChoice.continueTitle')}</h3>
                    <p>{t('newMatchChoice.continueDescription')}</p>
                    <Button variant="secondary" icon={<Play size={18} />} onClick={continueCurrentMatch}>
                      {t('newMatchChoice.continueAction')}
                    </Button>
                  </article>
                  <article className={styles.smallCard}>
                    <RotateCcw size={22} />
                    <h3 className={styles.cardTitle}>{t('newMatchChoice.restartTitle')}</h3>
                    <p>{t('newMatchChoice.restartDescription')}</p>
                    <Button variant="danger" icon={<RotateCcw size={18} />} onClick={restartCurrentMatch}>
                      {t('newMatchChoice.restartAction')}
                    </Button>
                  </article>
                  <article className={styles.smallCard}>
                    <Cog size={22} />
                    <h3 className={styles.cardTitle}>{t('newMatchChoice.setupTitle')}</h3>
                    <p>{t('newMatchChoice.setupDescription')}</p>
                    <Button variant="ghost" icon={<Cog size={18} />} onClick={() => openCleanSetup()}>
                      {t('newMatchChoice.setupAction')}
                    </Button>
                  </article>
                </div>
              </SetupScreen>
            ) : null}

            {!showNewMatchChoices && gameState.phase === 'setup' ? (
              <SetupScreen>
                <div className={styles.pageHeader}>
                  <div className={`${styles.screenMark} ${styles[screenToneClass.play]}`} aria-hidden="true">
                    {screenIconMap.play}
                  </div>
                  <div>
                    <h2 className={styles.pageTitle}>{t('setup.title')}</h2>
                    <p>{t('setup.subtitle')}</p>
                  </div>
                  {hasMatchInProgress(gameState.phase) ? (
                    <Button variant="danger" icon={<RotateCcw size={18} />} onClick={restartCurrentMatch}>
                      {t('newMatchChoice.restartAction')}
                    </Button>
                  ) : null}
                </div>
                <div className={styles.setupLayout}>
                  <section className={styles.setupPrimary} aria-label={t('setup.optionsTitle')}>
                    <article className={styles.smallCard}>
                      <ListChecks size={22} />
                      <h3 className={styles.cardTitle}>{t('setup.mode')}</h3>
                      <div className={styles.modeGrid}>
                        {guessTheFakeManifest.modes.map(mode => (
                          <button
                            key={mode.id}
                            type="button"
                            aria-pressed={selectedModeId === mode.id}
                            className={styles.modeCard}
                            onClick={() => {
                              setSelectedModeId(mode.id as GuessTheFakeModeId);
                              setSetupError('');
                            }}
                          >
                            <strong>{t(mode.titleKey)}</strong>
                            <span>{t(mode.descriptionKey)}</span>
                          </button>
                        ))}
                      </div>
                      <label className={styles.visuallyHidden}>
                        {t('setup.mode')}
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
                    </article>

                    <article className={styles.smallCard}>
                      <AtSign size={22} />
                      <h3 className={styles.cardTitle}>{t('setup.players')}</h3>
                      <label className={styles.field}>
                        <span>{t('setup.playersHint')}</span>
                        <input value={playerNames} onChange={event => setPlayerNames(event.target.value)} />
                      </label>
                    </article>

                    <article className={styles.smallCard}>
                      <Star size={22} />
                      <h3 className={styles.cardTitle}>{t('setup.filtersTitle')}</h3>
                      <div className={styles.setupFieldsGrid}>
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
                      </div>
                    </article>
                  </section>

                  <aside className={styles.setupSummary} aria-label={t('setup.summaryTitle')}>
                    <article className={styles.metricCard}>
                      <span>{t('setup.summaryTitle')}</span>
                      <strong className={styles.metricText}>{t(selectedMode.titleKey)}</strong>
                      <p>{t('setup.summaryLine', {
                        players: Math.max(setupPlayers.length, 1),
                        rounds: playableRounds.length ? setupRoundCount : 0,
                        available: playableRounds.length
                      })}</p>
                    </article>
                    <article className={styles.smallCard}>
                      <h3 className={styles.cardTitle}>{t('setup.contentStatusTitle')}</h3>
                      <p className={setupError || setupContentIsLow ? styles.errorText : styles.helperText}>
                        {setupError || t(setupContentIsLow ? 'setup.contentLow' : 'setup.availableRounds', {
                          available: playableRounds.length,
                          selected: playableRounds.length ? setupRoundCount : 0
                        })}
                      </p>
                      <div className={styles.compactRows}>
                        <span><b>{t('setup.easy')}</b>{setupDifficultyCounts.easy}</span>
                        <span><b>{t('setup.medium')}</b>{setupDifficultyCounts.medium}</span>
                        <span><b>{t('setup.hard')}</b>{setupDifficultyCounts.hard}</span>
                      </div>
                    </article>
                    <article className={styles.smallCard}>
                      <h3 className={styles.cardTitle}>{t('setup.previewTitle')}</h3>
                      <div className={styles.tagList}>
                        {setupCategoryPreview.length
                          ? setupCategoryPreview.map(category => <span key={category}>{category}</span>)
                          : <span>{t('packs.empty')}</span>}
                      </div>
                    </article>
                    <Button icon={<Play size={18} />} onClick={() => startNewMatch()}>{t('setup.start')}</Button>
                  </aside>
                </div>
              </SetupScreen>
            ) : null}

            {!showNewMatchChoices && gameState.phase !== 'setup' && round ? (
              <GameBoardScreen>
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
                  <div className={styles.scoreArea}>
                    <div className={styles.scoreStrip}>
                      {gameState.modeId === 'teams'
                        ? gameState.teams.map(team => (
                          <span key={team.id}>{t('game.teamScore', { name: team.name, score: team.score })}</span>
                        ))
                        : gameState.players.map(player => (
                          <span key={player.id}>{player.name}: {player.score}</span>
                        ))}
                      <button
                        aria-controls="score-reset-confirmation"
                        aria-expanded={scoreResetStatus === 'confirm'}
                        className={styles.inlineTool}
                        type="button"
                        onClick={requestScoreReset}
                      >
                        <RotateCcw size={16} /> {t('game.recalibrateScores')}
                      </button>
                    </div>
                    {scoreResetStatus === 'confirm' ? (
                      <div
                        className={styles.scoreResetPanel}
                        id="score-reset-confirmation"
                        role="group"
                        aria-label={t('game.recalibrateConfirmTitle')}
                      >
                        <div>
                          <strong>{t('game.recalibrateConfirmTitle')}</strong>
                          <p>{t('game.recalibrateConfirmDescription')}</p>
                        </div>
                        <div className={styles.scoreResetActions}>
                          <button type="button" className={styles.inlineTool} onClick={resetScores}>
                            <CheckCircle2 size={16} /> {t('game.recalibrateConfirm')}
                          </button>
                          <button type="button" className={styles.inlineTool} onClick={() => setScoreResetStatus(null)}>
                            <XCircle size={16} /> {t('game.recalibrateCancel')}
                          </button>
                        </div>
                      </div>
                    ) : null}
                    {scoreResetStatus === 'done' ? (
                      <p className={styles.scoreResetNotice} role="status">
                        <CheckCircle2 size={16} /> {t('game.recalibrateDone')}
                      </p>
                    ) : null}
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
                            aria-disabled={revealed}
                            aria-keyshortcuts={`${index + 1}`}
                            aria-label={`${t('game.statementOptionLabel', { number: index + 1 })}: ${text(statement.text).replace(/\d+/g, '').trim()}`}
                            aria-pressed={gameState.phase === 'playing' ? isSelected : undefined}
                            className={`${styles.statementCard} ${stateClass}`}
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
                        <button
                          type="button"
                          aria-pressed={currentRoundFeedbackRating === 'up'}
                          onClick={() => rateCurrentRound('up')}
                        >
                          <ThumbsUp size={16} /> {t('game.feedbackGood')}
                        </button>
                        <button
                          type="button"
                          aria-pressed={currentRoundFeedbackRating === 'down'}
                          onClick={() => rateCurrentRound('down')}
                        >
                          <ThumbsDown size={16} /> {t('game.feedbackBad')}
                        </button>
                        <button
                          type="button"
                          aria-pressed={currentRoundFeedbackRating === 'skip'}
                          onClick={() => rateCurrentRound('skip')}
                        >
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
                    <div className={styles.actionCluster}>
                      <Button variant="secondary" icon={<Share2 size={18} />} onClick={() => shareNative(resultShareData)}>
                        {t('share.resultAction')}
                      </Button>
                      <Button onClick={() => openCleanSetup()}>{t('game.playAgain')}</Button>
                    </div>
                    {growthStatus ? <p className={styles.helperText} role="status">{growthStatus}</p> : null}
                  </div>
                ) : null}
              </GameBoardScreen>
            ) : null}
          </section>
        ) : null}

        {screen === 'leaderboard' ? (
              <LeaderboardScreen>
            <div className={styles.pageHeader}>
              <div className={`${styles.screenMark} ${styles[screenToneClass.leaderboard]}`} aria-hidden="true">
                {screenIconMap.leaderboard}
              </div>
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
                <ListChecks size={18} />
                <span>{t('leaderboard.summary')}</span>
                <strong>{leaderboardSummary.matches}</strong>
              </article>
              <article className={styles.metricCard}>
                <Trophy size={18} />
                <span>{t('leaderboard.bestWinRate')}</span>
                <strong>{leaderboardSummary.bestWinRate}%</strong>
              </article>
              <article className={styles.metricCard}>
                <AtSign size={18} />
                <span>{t('leaderboard.players')}</span>
                <strong>{leaderboardSummary.players}</strong>
              </article>
              <article className={styles.metricCard}>
                <Star size={18} />
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
          </LeaderboardScreen>
        ) : null}

        {screen === 'achievements' ? (
          <AchievementsScreen>
            <div className={styles.pageHeader}>
              <div className={`${styles.screenMark} ${styles[screenToneClass.achievements]}`} aria-hidden="true">
                {screenIconMap.achievements}
              </div>
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
          </AchievementsScreen>
        ) : null}

        {screen === 'packs' ? (
          <PacksScreen>
            <div className={styles.pageHeader}>
              <div className={`${styles.screenMark} ${styles[screenToneClass.packs]}`} aria-hidden="true">
                {screenIconMap.packs}
              </div>
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
          </PacksScreen>
        ) : null}

        {screen === 'multiDevice' ? (
          <MultiDeviceScreen>
            <div className={styles.pageHeader}>
              <div className={`${styles.screenMark} ${styles[screenToneClass.multiDevice]}`} aria-hidden="true">
                {screenIconMap.multiDevice}
              </div>
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
                      <span>
                        <b>{t('multiDevice.peerStatusLabel')}</b>
                        {t(`multiDevice.peerStatus.${multiplayerSession.peerStatus}`)}
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
              <article className={styles.smallCard}>
                <Wifi size={24} />
                <h3 className={styles.cardTitle}>{t('multiDevice.peerTitle')}</h3>
                <p>{t('multiDevice.peerDescription')}</p>
                <div className={styles.compactRows}>
                  <span>
                    <b>{t('multiDevice.peerSupport')}</b>
                    {canUseWebRtc ? t('multiDevice.available') : t('multiDevice.unavailable')}
                  </span>
                  <span>
                    <b>{t('multiDevice.peerStatusLabel')}</b>
                    {t(`multiDevice.peerStatus.${multiplayerSession.peerStatus}`)}
                  </span>
                </div>
                <label className={styles.field}>
                  <span>{t('multiDevice.signalOutput')}</span>
                  <textarea
                    className={styles.snapshotInput}
                    value={webrtcSignalOutput}
                    readOnly
                    placeholder={t('multiDevice.signalOutputPlaceholder')}
                  />
                </label>
                <div className={styles.actionCluster}>
                  <Button variant="secondary" icon={<Radio size={18} />} onClick={createPeerOffer} disabled={!canUseWebRtc}>
                    {t('multiDevice.createOffer')}
                  </Button>
                  <Button variant="ghost" icon={<Copy size={18} />} onClick={() => copyText(webrtcSignalOutput, 'multiDevice.signalCopied')} disabled={!webrtcSignalOutput}>
                    {t('multiDevice.copySignal')}
                  </Button>
                </div>
                <label className={styles.field}>
                  <span>{t('multiDevice.signalInput')}</span>
                  <textarea
                    className={styles.snapshotInput}
                    value={webrtcSignalInput}
                    onChange={event => setWebrtcSignalInput(event.target.value)}
                    placeholder={t('multiDevice.signalInputPlaceholder')}
                  />
                </label>
                <div className={styles.actionCluster}>
                  <Button variant="secondary" icon={<Link2 size={18} />} onClick={createPeerAnswer} disabled={!canUseWebRtc}>
                    {t('multiDevice.createAnswer')}
                  </Button>
                  <Button variant="ghost" icon={<CheckCircle2 size={18} />} onClick={applyPeerAnswer} disabled={!canUseWebRtc}>
                    {t('multiDevice.applyAnswer')}
                  </Button>
                  <Button variant="danger" icon={<RotateCcw size={18} />} onClick={resetPeerConnection}>
                    {t('multiDevice.resetPeer')}
                  </Button>
                </div>
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
          </MultiDeviceScreen>
        ) : null}

        {screen === 'growth' ? (
          <GrowthScreen>
            <div className={styles.pageHeader}>
              <div className={`${styles.screenMark} ${styles[screenToneClass.growth]}`} aria-hidden="true">
                {screenIconMap.growth}
              </div>
              <div>
                <h2 className={styles.pageTitle}>{t('growth.title')}</h2>
                <p>{t('growth.subtitle')}</p>
              </div>
              <div className={styles.sessionCode}>
                <Share2 size={16} />
                {canUseNativeShare(appShareData) ? t('share.nativeAvailable') : t('share.copyAvailable')}
              </div>
            </div>
            {growthStatus ? <p className={styles.helperText} role="status">{growthStatus}</p> : null}
            <div className={styles.growthGrid}>
              <article className={styles.smallCard}>
                <Coffee size={24} />
                <h3 className={styles.cardTitle}>{t('donate.title')}</h3>
                <p>{t('donate.subtitle')}</p>
                <div className={styles.donateGrid}>
                  <button
                    type="button"
                    className={styles.donateOption}
                    disabled={!isDonationUrlConfigured(DONATION_LINKS.buyMeCoffee)}
                    onClick={() => openDonationUrl(DONATION_LINKS.buyMeCoffee)}
                  >
                    <Coffee size={20} />
                    <span>
                      <b>{t('donate.buyMeCoffee')}</b>
                      <small>{isDonationUrlConfigured(DONATION_LINKS.buyMeCoffee) ? t('donate.buyMeCoffeeSub') : t('donate.linkUnavailable')}</small>
                    </span>
                  </button>
                  <button
                    type="button"
                    className={styles.donateOption}
                    disabled={!isDonationUrlConfigured(DONATION_LINKS.koFi)}
                    onClick={() => openDonationUrl(DONATION_LINKS.koFi)}
                  >
                    <Gift size={20} />
                    <span>
                      <b>{t('donate.koFi')}</b>
                      <small>{isDonationUrlConfigured(DONATION_LINKS.koFi) ? t('donate.koFiSub') : t('donate.linkUnavailable')}</small>
                    </span>
                  </button>
                </div>
                <div className={styles.compactRows}>
                  <span><b>{t('donate.whyLanguagesTitle')}</b>{t('donate.whyLanguages')}</span>
                  <span><b>{t('donate.whyUpdatesTitle')}</b>{t('donate.whyUpdates')}</span>
                </div>
              </article>

              <article className={styles.smallCard}>
                <Share2 size={24} />
                <h3 className={styles.cardTitle}>{t('share.panelTitle')}</h3>
                <p>{t('share.panelSubtitle')}</p>
                <label className={styles.field}>
                  <span>{t('share.linkLabel')}</span>
                  <input value={appShareUrl} readOnly />
                </label>
                <div className={styles.shareGrid} aria-label={t('share.platformsLabel')}>
                  <button type="button" onClick={() => shareToPlatform('native')} aria-label={t('share.native')}>
                    <Share2 size={18} /> <span>{t('share.native')}</span>
                  </button>
                  <button type="button" onClick={() => shareToPlatform('whatsapp')} aria-label="WhatsApp">
                    <MessageCircle size={18} /> <span>WhatsApp</span>
                  </button>
                  <button type="button" onClick={() => shareToPlatform('facebook')} aria-label="Facebook">
                    <Facebook size={18} /> <span>Facebook</span>
                  </button>
                  <button type="button" onClick={() => shareToPlatform('x')} aria-label="X">
                    <Twitter size={18} /> <span>X</span>
                  </button>
                  <button type="button" onClick={() => shareToPlatform('instagram')} aria-label="Instagram">
                    <Instagram size={18} /> <span>Instagram</span>
                  </button>
                  <button type="button" onClick={() => shareToPlatform('tiktok')} aria-label="TikTok">
                    <Send size={18} /> <span>TikTok</span>
                  </button>
                  <button type="button" onClick={() => shareToPlatform('threads')} aria-label="Threads">
                    <AtSign size={18} /> <span>Threads</span>
                  </button>
                  <button type="button" onClick={() => shareToPlatform('copy')} aria-label={t('share.copy')}>
                    <Copy size={18} /> <span>{t('share.copy')}</span>
                  </button>
                </div>
              </article>

              <article className={styles.smallCard}>
                <Smartphone size={24} />
                <h3 className={styles.cardTitle}>{t('pwa.title')}</h3>
                <p>{t('pwa.description')}</p>
                <div className={styles.compactRows}>
                  <span>
                    <b>{t('pwa.installStatusTitle')}</b>
                    {isStandalonePwa ? t('pwa.installedStatus') : deferredInstallPrompt ? t('pwa.readyStatus') : t('pwa.unavailableStatus')}
                  </span>
                  <span>
                    <b>{t('pwa.offlineStatusTitle')}</b>
                    {t('pwa.offlineStatus')}
                  </span>
                  <span>
                    <b>{t('pwa.linksStatusTitle')}</b>
                    {t('pwa.linksStatus')}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  icon={<Download size={18} />}
                  onClick={installPwa}
                  disabled={isStandalonePwa || !deferredInstallPrompt}
                >
                  {isStandalonePwa ? t('pwa.installedAction') : t('pwa.installAction')}
                </Button>
              </article>
            </div>
          </GrowthScreen>
        ) : null}

        {screen === 'settings' ? (
          <SettingsScreen>
            <div className={styles.pageHeader}>
              <div className={`${styles.screenMark} ${styles[screenToneClass.settings]}`} aria-hidden="true">
                {screenIconMap.settings}
              </div>
              <div>
                <h2 className={styles.pageTitle}>{t('settings.title')}</h2>
                <p>{t('settings.subtitle')}</p>
              </div>
            </div>
            <div className={styles.settingsGrid}>
              <article className={styles.smallCard}>
                <Cog size={22} />
                <h3 className={styles.cardTitle}>{t('settings.identityTitle')}</h3>
                <label className={styles.field}>
                  <span>{t('settings.language')}</span>
                  <select value={settings.language} onChange={event => updateSettings({ language: event.target.value as Language })}>
                    {SUPPORTED_LANGUAGES.map(language => (
                      <option key={language} value={language}>
                        {getLanguageLabel(language)}
                      </option>
                    ))}
                  </select>
                  {activeMatchUsesPreviousLanguage ? (
                    <p className={styles.helperText}>
                      {t('settings.languageAppliesNextMatch', {
                        match: getLanguageLabel(activeMatchLanguage ?? settings.language),
                        current: getLanguageLabel(settings.language)
                      })}
                    </p>
                  ) : null}
                </label>
                <label className={styles.field}>
                  <span>{t('settings.theme')}</span>
                  <select value={settings.theme} onChange={event => updateSettings({ theme: event.target.value as ThemeId })}>
                    {THEMES.map(theme => (
                      <option key={theme.id} value={theme.id}>{t(theme.labelKey)}</option>
                    ))}
                  </select>
                </label>
                <div className={styles.themePreviewGrid} aria-label={t('settings.themePreviewTitle')}>
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      type="button"
                      className={styles.themePreview}
                      data-preview-theme={theme.id}
                      aria-pressed={settings.theme === theme.id}
                      aria-label={t('settings.themePreviewAction', { theme: t(theme.labelKey) })}
                      title={t('settings.themePreviewAction', { theme: t(theme.labelKey) })}
                      onClick={() => updateSettings({ theme: theme.id })}
                    >
                      <span className={styles.themePreviewHeader}>
                        <b>{t(theme.labelKey)}</b>
                        <i>{settings.theme === theme.id ? t('settings.themePreviewActive') : t('settings.themePreviewApply')}</i>
                      </span>
                      <span className={styles.themePreviewBoard} aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                      <span className={styles.themePreviewFooter} aria-hidden="true">
                        <span>{t('settings.themePreviewScore')}</span>
                        <span>{t('settings.themePreviewCorrect')}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <label className={styles.field}>
                  <span>{t('settings.fontScale')}</span>
                  <select value={settings.fontScale} onChange={event => updateSettings({ fontScale: event.target.value as FontScale })}>
                    {FONT_SCALE_OPTIONS.map(scale => (
                      <option key={scale} value={scale}>{t(`settings.fontScale${scale[0].toUpperCase()}${scale.slice(1)}`)}</option>
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
                <Button
                  variant="ghost"
                  icon={<RotateCcw size={18} />}
                  aria-controls="settings-score-reset-confirmation"
                  aria-expanded={scoreResetStatus === 'confirm'}
                  onClick={requestScoreReset}
                >
                  {t('game.recalibrateScores')}
                </Button>
                {scoreResetStatus === 'confirm' ? (
                  <div
                    className={styles.scoreResetPanel}
                    id="settings-score-reset-confirmation"
                    role="group"
                    aria-label={t('game.recalibrateConfirmTitle')}
                  >
                    <div>
                      <strong>{t('game.recalibrateConfirmTitle')}</strong>
                      <p>{t('game.recalibrateConfirmDescription')}</p>
                    </div>
                    <div className={styles.scoreResetActions}>
                      <button type="button" className={styles.inlineTool} onClick={resetScores}>
                        <CheckCircle2 size={16} /> {t('game.recalibrateConfirm')}
                      </button>
                      <button type="button" className={styles.inlineTool} onClick={() => setScoreResetStatus(null)}>
                        <XCircle size={16} /> {t('game.recalibrateCancel')}
                      </button>
                    </div>
                  </div>
                ) : null}
                {scoreResetStatus === 'done' ? (
                  <p className={styles.scoreResetNotice} role="status">
                    <CheckCircle2 size={16} /> {t('game.recalibrateDone')}
                  </p>
                ) : null}
              </article>

              <article className={styles.smallCard}>
                <h3 className={styles.cardTitle}>{t('settings.mediaTitle')}</h3>
                <label className={styles.switchField}>
                  <input type="checkbox" checked={settings.soundEnabled} onChange={event => updateSettings({ soundEnabled: event.target.checked })} />
                  <span>{t('settings.sound')}</span>
                </label>
                <label className={styles.rangeField}>
                  <span>{t('settings.soundVolume')}: {Math.round(settings.soundVolume * 100)}%</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={settings.soundVolume}
                    onChange={event => updateSettings({ soundVolume: Number(event.target.value) })}
                  />
                </label>
                <label className={styles.switchField}>
                  <input type="checkbox" checked={settings.musicEnabled} onChange={event => updateSettings({ musicEnabled: event.target.checked })} />
                  <span>{t('settings.music')}</span>
                </label>
                <label className={styles.rangeField}>
                  <span>{t('settings.musicVolume')}: {Math.round(settings.musicVolume * 100)}%</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={settings.musicVolume}
                    onChange={event => updateSettings({ musicVolume: Number(event.target.value) })}
                  />
                </label>
                <Button
                  variant="secondary"
                  icon={<Volume2 size={18} />}
                  onClick={previewSound}
                  data-audio-skip="true"
                >
                  {t('settings.previewSound')}
                </Button>
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
          </SettingsScreen>
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

function openExternalUrl(url: string) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function isRunningStandalonePwa() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function supportsBroadcastChannel() {
  return typeof BroadcastChannel !== 'undefined';
}

function getLanguageLabel(language: Language) {
  const labels: Record<Language, string> = {
    pt: 'Português do Brasil',
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano'
  };
  return labels[language];
}

function supportsWebRtc() {
  return typeof RTCPeerConnection !== 'undefined';
}

function getIceServers(): RTCIceServer[] {
  const configured = import.meta.env.VITE_GTF_STUN_URLS;
  const urls = typeof configured === 'string'
    ? configured.split(',').map((url: string) => url.trim()).filter(Boolean)
    : [];
  return [
    {
      urls: urls.length ? urls : ['stun:stun.l.google.com:19302']
    }
  ];
}

function waitForIceGatheringComplete(peer: RTCPeerConnection) {
  if (peer.iceGatheringState === 'complete') return Promise.resolve();

  return new Promise<void>(resolve => {
    const timeout = window.setTimeout(() => {
      peer.removeEventListener('icegatheringstatechange', handleChange);
      resolve();
    }, 4500);

    function handleChange() {
      if (peer.iceGatheringState !== 'complete') return;
      window.clearTimeout(timeout);
      peer.removeEventListener('icegatheringstatechange', handleChange);
      resolve();
    }

    peer.addEventListener('icegatheringstatechange', handleChange);
  });
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
