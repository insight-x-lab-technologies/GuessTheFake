import { act, renderHook } from '@testing-library/react';
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

function renderMatch() {
  const audio = { unlock: vi.fn(), play: vi.fn() };
  const setScreen = vi.fn<(screen: Screen) => void>();
  const hook = renderHook(() => {
    const progress = useProgress();
    const setup = useMatchSetup({ enabledPacks: [sampleGuessTheFakePack], contentFeedback: progress.contentFeedback });
    const match = useMatch({
      boot: {
        hasMatch: false,
        state: createInitialGuessTheFakeState(),
        activeMatchLanguage: null,
        timerSeconds: 0,
        restored: false,
        demo: false
      },
      settings,
      t,
      setup,
      audio,
      progress,
      enabledPackIds: [sampleGuessTheFakePack.id],
      screen: 'play',
      setScreen
    });
    return { match, progress };
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
});
