import { Sparkles, XCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { getMusicZone } from '../core/audio/audio';
import { getLocalizedText } from '../game/content-schema';
import '../styles/reset.css';
import '../styles/tokens.css';
import '../styles/base.css';
import type { LocalizeText, Screen } from './app-types';
import { useAudio } from './hooks/useAudio';
import { useGrowth } from './hooks/useGrowth';
import { useLocalData } from './hooks/useLocalData';
import { useMatch } from './hooks/useMatch';
import { useMatchSetup } from './hooks/useMatchSetup';
import { useMultiDevice } from './hooks/useMultiDevice';
import { usePacks } from './hooks/usePacks';
import { useProgress } from './hooks/useProgress';
import { useSettings } from './hooks/useSettings';
import { readMatchBoot } from './match-boot';
import { buildMultiplayerSnapshot } from './match-summary';
import { hasMatchInProgress } from './new-match-flow';
import { getScreenIcon, getScreenLabelKey, SCREENS } from './navigation';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { GameBoardScreen } from './screens/GameBoardScreen';
import { GrowthScreen } from './screens/GrowthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { MultiDeviceScreen } from './screens/MultiDeviceScreen';
import { NewMatchChoiceScreen } from './screens/NewMatchChoiceScreen';
import { PacksScreen } from './screens/PacksScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SetupScreen } from './screens/SetupScreen';
import styles from './App.module.css';

export function App() {
  const mainRef = useRef<HTMLElement | null>(null);
  const statementButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { settings, setSettings, updateSettings, t } = useSettings();
  const [boot] = useState(() => readMatchBoot(settings.language));
  const [screen, setScreen] = useState<Screen>(boot.hasMatch ? 'play' : 'home');

  const audio = useAudio(settings);
  const progress = useProgress();
  const packs = usePacks({ t, language: settings.language });
  const localData = useLocalData({ t, settings, setSettings, progress, packs });
  const setup = useMatchSetup({ enabledPacks: packs.enabledPacks, contentFeedback: progress.contentFeedback });
  const match = useMatch({
    boot,
    settings,
    t,
    setup,
    audio,
    progress,
    enabledPackIds: packs.enabledPacks.map(pack => pack.id),
    screen,
    setScreen
  });
  const { gameState, round, timerSeconds } = match;

  const hostSnapshot = useMemo(() => buildMultiplayerSnapshot(gameState, timerSeconds), [
    match.activeSubjectName,
    gameState.modeId,
    gameState.phase,
    gameState.currentRoundIndex,
    gameState.totalRounds,
    gameState.players,
    gameState.teams,
    timerSeconds
  ]);
  const multiDevice = useMultiDevice({ t, hostSnapshot, onInviteLinkOpened: () => setScreen('multiDevice') });
  const growth = useGrowth({
    t,
    matchResult: gameState.phase === 'finished'
      ? { winnerNames: match.winners.map(player => player.name), modeId: gameState.modeId, totalRounds: gameState.totalRounds }
      : null
  });

  const text: LocalizeText = (value, fallback = '') => getLocalizedText(value, settings.language, fallback);
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
      if (!match.showNewMatchChoices && gameState.phase === 'playing') {
        statementButtonRefs.current[0]?.focus({ preventScroll: true });
        return;
      }
      mainRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [screen, gameState.phase, gameState.currentRoundIndex, match.showNewMatchChoices]);

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
            <Sparkles size={20} />
            <div>
              <strong>{t('achievements.newUnlock')}</strong>
              <span>{t(progress.achievementNotice.titleKey)}</span>
            </div>
            <button type="button" onClick={progress.dismissAchievementNotice} aria-label={t('app.dismiss')}>
              <XCircle size={16} />
            </button>
          </aside>
        ) : null}

        {screen === 'home' ? <HomeScreen t={t} onNewMatch={match.requestNewMatch} /> : null}

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

            {!match.showNewMatchChoices && gameState.phase === 'setup' ? (
              <SetupScreen t={t} text={text} setup={setup} contentStatus={packs.builtinStatus} onStart={() => match.startNewMatch()} />
            ) : null}

            {!match.showNewMatchChoices && gameState.phase !== 'setup' && round ? (
              <GameBoardScreen
                t={t}
                text={text}
                match={match}
                round={round}
                growth={growth}
                statementButtonRefs={statementButtonRefs}
              />
            ) : null}
          </section>
        ) : null}

        {screen === 'leaderboard' ? <LeaderboardScreen t={t} progress={progress} localData={localData} /> : null}
        {screen === 'achievements' ? <AchievementsScreen t={t} progress={progress} /> : null}
        {screen === 'packs' ? <PacksScreen t={t} text={text} language={settings.language} packs={packs} /> : null}
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
    </div>
  );
}
