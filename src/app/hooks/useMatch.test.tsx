import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { translate } from '../../core/i18n/i18n';
import { DEFAULT_SETTINGS, type PlatformSettings } from '../../core/settings/settings';
import { builtinPackEn as sampleGuessTheFakePack } from '../../test/builtin';
import { createInitialGuessTheFakeState } from '../../game/rules';
import type { Screen } from '../app-types';
import { translations } from '../translations';
import { useMatch } from './useMatch';
import { useMatchSetup } from './useMatchSetup';
import { useProgress } from './useProgress';

const settings: PlatformSettings = {
  ...DEFAULT_SETTINGS,
  language: 'en',
  preparationTimeSeconds: 2,
  roundTimeSeconds: 20,
  shuffleRounds: false
};
const t = (key: string, params: Record<string, string | number> = {}) => translate(translations, 'en', key, params);

function renderMatch(overrides: Partial<PlatformSettings> = {}) {
  const audio = { unlock: vi.fn(), play: vi.fn() };
  const setScreen = vi.fn<(screen: Screen) => void>();
  const hook = renderHook(() => {
    const [currentSettings, setSettings] = useState<PlatformSettings>({ ...settings, ...overrides });
    const updateSettings = (next: Partial<PlatformSettings>) => setSettings(current => ({ ...current, ...next }));
    const progress = useProgress();
    const getSoloKeyForName = (name: string) => name.trim().toLocaleLowerCase();
    const setup = useMatchSetup({
      enabledPacks: [sampleGuessTheFakePack],
      contentFeedback: progress.contentFeedback,
      settings: currentSettings,
      updateSettings,
      counters: progress.achievementState.counters,
      feedbackSummary: progress.contentFeedbackSummary,
      soloRecords: progress.soloRecords,
      getSoloKeyForName
    });
    const match = useMatch({
      boot: {
        hasMatch: false,
        state: createInitialGuessTheFakeState(),
        activeMatchLanguage: null,
        timerSeconds: 0,
        restored: false,
        demo: false
      },
      settings: currentSettings,
      updateSettings,
      t,
      setup,
      audio,
      progress,
      getSoloKeyForName,
      enabledPackIds: [sampleGuessTheFakePack.id],
      categoryIds: sampleGuessTheFakePack.content.categories.map(category => category.id),
      screen: 'play',
      setScreen
    });
    return { match, progress, setup, settings: currentSettings };
  });
  return { ...hook, audio, setScreen };
}

async function tick(seconds: number) {
  for (let second = 0; second < seconds; second += 1) {
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
  }
}

describe('useMatch', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('counts down the preparation and then the round, timing out into a recorded reveal', async () => {
    const { result, audio, setScreen } = renderMatch();

    act(() => {
      result.current.match.startNewMatch();
    });
    expect(setScreen).toHaveBeenCalledWith('play');
    expect(result.current.match.gameState.phase).toBe('intro');

    act(() => {
      result.current.match.beginTurn();
    });
    expect(result.current.match.gameState.phase).toBe('preparing');
    expect(result.current.match.timerSeconds).toBe(2);

    await tick(2);
    expect(result.current.match.gameState.phase).toBe('playing');
    expect(result.current.match.timerSeconds).toBe(20);

    await tick(20);
    expect(result.current.match.gameState.phase).toBe('revealed');
    expect(audio.play).toHaveBeenCalledWith('wrong');
    expect(result.current.progress.achievementState.counters.roundsPlayed).toBe(1);
    expect(result.current.progress.achievementState.modeCounters.classic.roundsPlayed).toBe(1);
  });

  it('pauses the countdown while the new match choice is open', async () => {
    const { result } = renderMatch();

    act(() => {
      result.current.match.startNewMatch();
    });
    act(() => {
      result.current.match.beginTurn();
    });
    act(() => {
      result.current.match.requestNewMatch();
    });
    expect(result.current.match.showNewMatchChoices).toBe(true);

    await tick(3);
    expect(result.current.match.gameState.phase).toBe('preparing');
    expect(result.current.match.timerSeconds).toBe(2);
  });

  it('records a finished match in the leaderboard and the mode counters', () => {
    const { result } = renderMatch();

    act(() => {
      result.current.match.startNewMatch();
    });
    act(() => {
      result.current.match.beginTurn();
    });
    act(() => {
      result.current.match.showStatementsNow();
    });
    const fakeId = result.current.match.round?.fakeStatementId ?? '';
    act(() => {
      result.current.match.chooseStatement(fakeId);
    });
    expect(result.current.match.gameState.phase).toBe('revealed');

    // The default setup plays 5 rounds with two players.
    for (let round = 0; round < 50 && result.current.match.gameState.phase !== 'finished'; round += 1) {
      act(() => {
        if (result.current.match.gameState.phase === 'revealed') result.current.match.continueRound();
        else if (result.current.match.gameState.phase === 'intro') result.current.match.showStatementsNow();
        else if (result.current.match.gameState.phase === 'playing') {
          result.current.match.chooseStatement(result.current.match.round?.statements[0].id ?? '');
        }
      });
    }

    expect(result.current.match.gameState.phase).toBe('finished');
    expect(result.current.progress.leaderboard.entries.length).toBeGreaterThan(0);
    expect(result.current.progress.achievementState.modeCounters.classic.matchesFinished).toBe(1);
    expect(result.current.progress.achievementState.counters.matchesFinished).toBe(1);
  });

  it('plays a solo challenge straight to the statements and keeps the record', () => {
    const { result } = renderMatch();
    act(() => {
      result.current.setup.selectMode('solo');
    });
    act(() => {
      result.current.setup.setSoloPlayerName('Ana');
      result.current.setup.changeRoundCount('2');
    });

    function playSolo(correct: boolean) {
      act(() => {
        result.current.match.startNewMatch();
      });
      for (let step = 0; step < 10 && result.current.match.gameState.phase !== 'finished'; step += 1) {
        act(() => {
          const { gameState, round } = result.current.match;
          if (gameState.phase === 'playing' && round) {
            const pick = correct ? round.fakeStatementId : round.statements.find(statement => statement.id !== round.fakeStatementId)!.id;
            result.current.match.chooseStatement(pick);
          } else if (gameState.phase === 'revealed') {
            result.current.match.continueRound();
          }
        });
      }
    }

    act(() => {
      result.current.match.startNewMatch();
    });
    // No turn ceremony and no preparation in solo.
    expect(result.current.match.gameState.phase).toBe('playing');
    expect(result.current.settings.lastSoloPlayerName).toBe('Ana');

    playSolo(true);
    expect(result.current.match.gameState.phase).toBe('finished');
    expect(result.current.match.soloOutcome).toMatchObject({ isNewRecord: true, previous: null, result: { correct: 2 } });
    expect(result.current.match.winners).toEqual([]);
    expect(result.current.progress.leaderboard.entries).toEqual([]);
    expect(result.current.progress.achievementState.counters.soloMatches).toBe(1);
    expect(result.current.setup.soloRecord?.correct).toBe(2);

    playSolo(false);
    expect(result.current.match.soloOutcome).toMatchObject({ isNewRecord: false, previous: { correct: 2 }, result: { correct: 0 } });
    expect(result.current.match.nextObjective).not.toBeNull();
  });

  it('holds the reveal for a table moment and records the round when it is revealed', () => {
    const { result } = renderMatch({ tableMomentsEnabled: true });
    act(() => {
      result.current.match.startNewMatch();
    });
    act(() => {
      result.current.match.showStatementsNow();
    });
    act(() => {
      result.current.match.chooseStatement(result.current.match.round?.fakeStatementId ?? '');
    });

    expect(result.current.match.gameState.phase).toBe('discussing');
    expect(result.current.progress.achievementState.counters.roundsPlayed).toBe(0);

    act(() => {
      result.current.match.revealMoment();
    });
    expect(result.current.match.gameState.phase).toBe('revealed');
    expect(result.current.progress.achievementState.counters.roundsPlayed).toBe(1);
    expect(result.current.progress.achievementState.playerCounters.ana.correctGuesses).toBe(1);
    expect(result.current.progress.roundHistory.recentRoundIds).toHaveLength(1);
  });

  it('ticks the 3-2-1 preparation and the last seconds, vibrating only when enabled', async () => {
    const vibrate = vi.fn();
    Object.defineProperty(navigator, 'vibrate', { configurable: true, value: vibrate });
    const { result, audio } = renderMatch({ vibrationEnabled: true });
    act(() => {
      result.current.match.startNewMatch();
    });
    act(() => {
      result.current.match.beginTurn();
    });
    await tick(2);
    const ticksDuringPreparation = audio.play.mock.calls.filter(([event]) => event === 'tick').length;
    expect(ticksDuringPreparation).toBe(2);

    await tick(19);
    const events = audio.play.mock.calls.map(([event]) => event);
    expect(events.filter(event => event === 'tick')).toHaveLength(2 + 7);
    expect(events.filter(event => event === 'tick-strong')).toHaveLength(3);
    expect(vibrate).toHaveBeenCalledTimes(3);
    Reflect.deleteProperty(navigator, 'vibrate');
  });

  it('pauses the round on a pass-the-device hand-off in all-guess', async () => {
    const { result } = renderMatch({ passDeviceEnabled: true });
    act(() => {
      result.current.setup.selectMode('all-guess');
    });
    act(() => {
      result.current.match.startNewMatch();
    });
    act(() => {
      result.current.match.showStatementsNow();
    });
    expect(result.current.match.passDevice).toBe(true);
    const first = result.current.match.gameState.players[0].name;
    const second = result.current.match.gameState.players[1].name;

    act(() => {
      result.current.match.chooseStatement(result.current.match.round?.statements[0].id ?? '');
    });
    expect(result.current.match.handoffSubject?.name).toBe(second);
    expect(result.current.match.handoffSubject?.name).not.toBe(first);
    const pausedAt = result.current.match.timerSeconds;
    await tick(3);
    expect(result.current.match.timerSeconds).toBe(pausedAt);

    act(() => {
      result.current.match.confirmHandoff();
    });
    expect(result.current.match.handoffSubject).toBeNull();
    await tick(2);
    expect(result.current.match.timerSeconds).toBe(pausedAt - 2);
  });

  it('skips the hand-off when the setting is off', () => {
    const { result } = renderMatch();
    act(() => {
      result.current.setup.selectMode('all-guess');
    });
    act(() => {
      result.current.match.startNewMatch();
    });
    act(() => {
      result.current.match.showStatementsNow();
    });
    act(() => {
      result.current.match.chooseStatement(result.current.match.round?.statements[0].id ?? '');
    });
    expect(result.current.match.passDevice).toBe(false);
    expect(result.current.match.handoffSubject).toBeNull();
  });

  it('starts a rematch with the same players and a clean history', () => {
    const { result } = renderMatch();
    act(() => {
      result.current.setup.changeRoundCount('1');
    });
    act(() => {
      result.current.match.startNewMatch();
    });
    const players = result.current.match.gameState.players.map(player => player.name);
    const firstRoundId = result.current.match.round?.id;
    act(() => {
      result.current.match.showStatementsNow();
    });
    act(() => {
      result.current.match.chooseStatement(result.current.match.round?.fakeStatementId ?? '');
    });
    act(() => {
      result.current.match.continueRound();
    });
    expect(result.current.match.gameState.phase).toBe('finished');
    expect(result.current.match.gameState.guessHistory).toHaveLength(1);

    act(() => {
      result.current.match.rematch();
    });
    expect(result.current.match.gameState.phase).toBe('intro');
    expect(result.current.match.gameState.players.map(player => player.name)).toEqual(players);
    expect(result.current.match.gameState.guessHistory).toEqual([]);
    // The round just played goes to the back of the queue.
    expect(result.current.match.round?.id).not.toBe(firstRoundId);
  });
});
