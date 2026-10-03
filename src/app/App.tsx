import { XCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { getMusicZone } from '../core/audio/audio';
import { ABOUT_US_CATEGORY_ID } from '../game/about-us';
import { getLocalizedText } from '../game/content-schema';
import '../styles/reset.css';
import '../styles/tokens.css';
import '../styles/base.css';
import type { LocalizeText, Screen } from './app-types';
import { useAboutUsAuthoring } from './hooks/useAboutUsAuthoring';
import { useAudio } from './hooks/useAudio';
import { useGrowth } from './hooks/useGrowth';
import { useLocalData } from './hooks/useLocalData';
import { useMatch } from './hooks/useMatch';
import { useMatchSetup } from './hooks/useMatchSetup';
import { useMultiDevice } from './hooks/useMultiDevice';
import { usePackEditor } from './hooks/usePackEditor';
import { usePacks } from './hooks/usePacks';
import { useProfiles } from './hooks/useProfiles';
import { usePwaStatus } from './hooks/usePwaStatus';
import { useProgress } from './hooks/useProgress';
import { useSettings } from './hooks/useSettings';
import { readMatchBoot } from './match-boot';
import { buildMultiplayerSnapshot, buildPresenterBoard } from './match-summary';
import { hasMatchInProgress } from './new-match-flow';
import { getScreenIcon, getScreenLabelKey, SCREENS } from './navigation';
import { AboutUsAuthoringPanel } from './screens/AboutUsAuthoringPanel';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { GameBoardScreen } from './screens/GameBoardScreen';
import { GrowthScreen } from './screens/GrowthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { Medal } from './screens/Medal';
import { MultiDeviceScreen } from './screens/MultiDeviceScreen';
import { NewMatchChoiceScreen } from './screens/NewMatchChoiceScreen';
import { PackEditorPanel } from './screens/PackEditorPanel';
import { PacksScreen } from './screens/PacksScreen';
import { PresenterView } from './screens/PresenterView';
import { PwaStatusNotices } from './screens/PwaStatusNotices';
import { ProfilesScreen } from './screens/ProfilesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SetupScreen } from './screens/SetupScreen';
import { formatSoloChallenge, formatSoloPlayer } from './solo-labels';
import { getTrackViews } from './progress-tracks';
import styles from './App.module.css';

export function App() {
  const mainRef = useRef<HTMLElement | null>(null);
  const statementButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { settings, setSettings, updateSettings, t, ...seasonal } = useSettings();
  const [boot] = useState(() => readMatchBoot(settings.language));
  const [screen, setScreen] = useState<Screen>(boot.hasMatch ? 'play' : 'home');

  const audio = useAudio(settings);
  const pwa = usePwaStatus();
  const progress = useProgress();
  const packs = usePacks({ t, language: settings.language });
  const profiles = useProfiles({ t, progress });
  const localData = useLocalData({ t, settings, setSettings, progress, packs, profiles });
  const setup = useMatchSetup({
    enabledPacks: packs.enabledPacks,
    contentFeedback: progress.contentFeedback,
    settings,
    updateSettings,
    counters: progress.achievementState.counters,
    feedbackSummary: progress.contentFeedbackSummary,
    soloRecords: progress.soloRecords,
    getSoloKeyForName: profiles.getSoloKeyForName
  });
  const packEditor = usePackEditor({ t, language: settings.language, packs });
  const authoring = useAboutUsAuthoring({ t, setup });
  const categoryIds = useMemo(() => setup.availableCategories.map(category => category.id), [setup.availableCategories]);
  const match = useMatch({
    boot,
    settings,
    updateSettings,
    t,
    setup,
    audio,
    progress,
    getSoloKeyForName: profiles.getSoloKeyForName,
    enabledPackIds: packs.enabledPacks.map(pack => pack.id),
    categoryIds,
    screen,
    setScreen,
    onAboutUsRematch: () => authoring.begin()
  });
  const { gameState, round, timerSeconds } = match;

  const text: LocalizeText = (value, fallback = '') => getLocalizedText(value, settings.language, fallback);
  const categoryLabel = (categoryId: string) => {
    if (categoryId === 'all') return t('setup.allCategories');
    if (categoryId === ABOUT_US_CATEGORY_ID) return t('aboutUs.category');
    const category = setup.allCategories.find(candidate => candidate.id === categoryId);
    return category ? text(category.title, categoryId) : categoryId;
  };
  const challengeLabel = (challengeKey: string) => formatSoloChallenge(challengeKey, t, categoryLabel);

  const hostSnapshot = useMemo(() => buildMultiplayerSnapshot(
    gameState,
    timerSeconds,
    undefined,
    buildPresenterBoard(gameState, {
      t,
      text,
      categoryTitle: round?.categoryId === ABOUT_US_CATEGORY_ID
        ? t('aboutUs.category')
        : setup.allCategories.find(category => category.id === round?.categoryId)?.title
    })
  ), [
    match.activeSubjectName,
    gameState,
    setup.allCategories,
    settings.language,
    timerSeconds
  ]);
  const multiDevice = useMultiDevice({ t, hostSnapshot, onInviteLinkOpened: () => setScreen('multiDevice') });
  const growth = useGrowth({
    t,
    matchResult: gameState.phase === 'finished'
      ? {
        winnerNames: match.winners.map(player => player.name),
        modeId: gameState.modeId,
        totalRounds: gameState.totalRounds,
        solo: match.solo
          ? {
            points: gameState.players[0]?.score ?? 0,
            correct: gameState.correctGuessesInMatch,
            challengeLabel: [
              categoryLabel(gameState.challenge.categoryId),
              gameState.challenge.difficulty === 'all' ? t('setup.allDifficulties') : t(`setup.${gameState.challenge.difficulty}`)
            ].join(', ')
          }
          : undefined
      }
      : null
  });

  const matchLanguageNotice = match.activeMatchUsesPreviousLanguage ? match.activeMatchLanguage : null;
  const musicZone = getMusicZone(screen, gameState.phase);

  const { syncZone } = audio;
  useEffect(() => {
    syncZone(musicZone);
  }, [musicZone, syncZone]);

  useEffect(() => {
    document.body.dataset.activeScreen = screen;
  }, [screen]);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      if (!match.showNewMatchChoices && gameState.phase === 'playing' && !match.handoffSubject) {
        statementButtonRefs.current[0]?.focus({ preventScroll: true });
        return;
      }
      mainRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [screen, gameState.phase, gameState.currentRoundIndex, match.showNewMatchChoices, match.handoffSubject]);

  function handleShellClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    const control = target?.closest('button, [role="button"], input, select');
    if (!(control instanceof HTMLElement)) return;
    if (control.hasAttribute('disabled') || control.getAttribute('aria-disabled') === 'true') return;
    if (control.closest('[data-audio-skip="true"]')) return;
    if (control.classList.contains(styles.statementCard)) return;
    audio.playUi(control.closest('nav') ? 'navigation' : 'ui-click');
  }

  function navigate(target: Screen) {
    if (target === 'play') {
      match.requestNewMatch();
      return;
    }
    match.hideNewMatchChoices();
    setScreen(target);
  }

  const scoreReset = {
    status: match.scoreResetStatus,
    request: match.requestScoreReset,
    confirm: match.resetScores,
    cancel: match.cancelScoreReset
  };

  return (
    <div className={styles.appShell} onClickCapture={handleShellClick}>
      <div className={styles.ambientBackdrop} aria-hidden="true" />
      <aside className={styles.sidebar}>
        <div>
          <p className={styles.kicker}>{t('app.kicker')}</p>
          <h1 className={styles.logo}>{t('game.title')}</h1>
        </div>
        <nav className={styles.nav} aria-label={t('app.navLabel')}>
          {SCREENS.map(item => (
            <button
              key={item}
              aria-current={screen === item ? 'page' : undefined}
              className={screen === item ? styles.navActive : ''}
              onClick={() => navigate(item)}
              type="button"
            >
              {getScreenIcon(item, 18)} <span>{t(getScreenLabelKey(item))}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main ref={mainRef} className={styles.main} tabIndex={-1} aria-label={t(getScreenLabelKey(screen))}>
        {progress.achievementNotice ? (
          <aside className={styles.toast} role="status" aria-live="polite">
            <Medal key={progress.achievementNotice.id} rarity={progress.achievementNotice.rarity} unlocking />
            <div>
              <strong>{t('achievements.newUnlock')}</strong>
              <span>{t(progress.achievementNotice.titleKey)}</span>
              {progress.achievementNotice.rarity ? (
                <span>{t('art.medal.unlockedRarity', { rarity: t(`art.medal.${progress.achievementNotice.rarity}`) })}</span>
              ) : null}
            </div>
            <button type="button" onClick={progress.dismissAchievementNotice} aria-label={t('app.dismiss')}>
              <XCircle size={16} />
            </button>
          </aside>
        ) : null}
        <PwaStatusNotices t={t} pwa={pwa} toastSlotBusy={Boolean(progress.achievementNotice)} />

        {screen === 'home' ? (
          <HomeScreen
            t={t}
            seasonalSuggestion={seasonal.seasonalSuggestion}
            onNewMatch={match.requestNewMatch}
            onPlaySolo={match.requestSoloMatch}
            onApplySeasonal={seasonal.applySeasonalTheme}
            onDismissSeasonal={seasonal.dismissSeasonalSuggestion}
          />
        ) : null}

        {screen === 'play' ? (
          <section className={styles.screenStack}>
            {match.showNewMatchChoices && hasMatchInProgress(gameState.phase) ? (
              <NewMatchChoiceScreen
                t={t}
                matchLanguageNotice={matchLanguageNotice}
                currentLanguage={settings.language}
                onContinue={match.continueCurrentMatch}
                onRestart={match.restartCurrentMatch}
                onOpenSetup={() => match.openCleanSetup()}
              />
            ) : null}

            {!match.showNewMatchChoices && gameState.phase === 'setup' && authoring.active ? (
              <AboutUsAuthoringPanel
                t={t}
                authoring={authoring}
                getProfileForName={profiles.getProfileForName}
                setupError={setup.setupError}
                onStart={() => {
                  if (match.startNewMatch({ aboutUsEntries: authoring.entries })) authoring.cancel();
                }}
              />
            ) : null}

            {!match.showNewMatchChoices && gameState.phase === 'setup' && !authoring.active ? (
              <SetupScreen
                t={t}
                text={text}
                setup={setup}
                profiles={profiles.profiles.profiles}
                contentStatus={packs.builtinStatus}
                onStart={() => (setup.selectedModeId === 'about-us' ? authoring.begin() : match.startNewMatch())}
              />
            ) : null}

            {!match.showNewMatchChoices && gameState.phase !== 'setup' && (round || gameState.phase === 'finished') ? (
              <GameBoardScreen
                t={t}
                text={text}
                match={match}
                round={round}
                growth={growth}
                presenter={multiDevice}
                categoryLabel={categoryLabel}
                getProfileForName={profiles.getProfileForName}
                statementButtonRefs={statementButtonRefs}
                saveAsPack={{
                  status: authoring.savedStatus,
                  onSave: () => authoring.saveAsPack(gameState, match.activeMatchLanguage ?? settings.language, packs.savePack)
                }}
              />
            ) : null}
          </section>
        ) : null}

        {screen === 'leaderboard' ? (
          <LeaderboardScreen
            t={t}
            progress={progress}
            localData={localData}
            challengeLabel={challengeLabel}
            soloPlayerLabel={playerKey => formatSoloPlayer(playerKey, profiles.profiles)}
          />
        ) : null}
        {screen === 'achievements' ? (
          <AchievementsScreen
            t={t}
            progress={progress}
            trackViews={getTrackViews(match.tracks, progress.achievementView.counters)}
            categoryLabel={categoryLabel}
          />
        ) : null}
        {screen === 'profiles' ? <ProfilesScreen t={t} profiles={profiles} challengeLabel={challengeLabel} /> : null}
        {screen === 'packs' && packEditor.open ? <PackEditorPanel t={t} editor={packEditor} /> : null}
        {screen === 'packs' && !packEditor.open ? (
          <PacksScreen
            t={t}
            text={text}
            language={settings.language}
            packs={packs}
            hasDraft={Boolean(packEditor.draft)}
            onCreatePack={packEditor.start}
            onEditPack={packId => {
              const pack = packs.installedPacks.packs.find(candidate => candidate.id === packId);
              if (pack) packEditor.editPack(pack);
            }}
          />
        ) : null}
        {screen === 'multiDevice' ? <MultiDeviceScreen t={t} multiDevice={multiDevice} /> : null}
        {screen === 'growth' ? <GrowthScreen t={t} growth={growth} /> : null}
        {screen === 'settings' ? (
          <SettingsScreen
            t={t}
            settings={settings}
            updateSettings={updateSettings}
            matchLanguageNotice={matchLanguageNotice}
            scoreReset={scoreReset}
            onPreviewSound={audio.preview}
            localData={localData}
          />
        ) : null}
      </main>
      {multiDevice.presenterOpen ? (
        <PresenterView t={t} snapshot={multiDevice.mirroredSnapshot} onClose={multiDevice.closePresenter} />
      ) : null}
    </div>
  );
}
