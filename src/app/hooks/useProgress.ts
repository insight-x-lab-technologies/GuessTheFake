import { useEffect, useMemo, useState } from 'react';
import {
  createDefaultAchievementState,
  evaluateAchievementsWithUnlocks,
  getAchievementProgressView,
  loadAchievements,
  normalizeAchievementState,
  saveAchievements,
  updateModeCounters,
  type AchievementCounters,
  type AchievementDefinition,
  type AchievementModeFilter,
  type AchievementState
} from '../../core/achievements/achievements';
import {
  loadContentFeedback,
  rateContent,
  saveContentFeedback,
  summarizeContentFeedback,
  type ContentFeedbackModel,
  type ContentRating
} from '../../core/content-feedback/content-feedback';
import {
  filterLeaderboard,
  getPlayerLeaderboardDetail,
  loadLeaderboard,
  recordLeaderboardMatch,
  saveLeaderboard,
  sortLeaderboardBy,
  summarizeLeaderboard,
  type LeaderboardModel,
  type LeaderboardSort
} from '../../core/leaderboard/leaderboard';
import { GAME_ID } from '../../game/modes';
import type { GuessResult, GuessTheFakeRound, GuessTheFakeState } from '../../game/types';
import { achievementDefinitions } from '../achievement-definitions';
import { getLeaderboardRows } from '../match-summary';
import { memoryStorage } from './storage-fallback';

export type ProgressController = ReturnType<typeof useProgress>;

// Leaderboard, achievements, and content feedback: everything a finished
// round or match writes to local progress.
export function useProgress() {
  const [leaderboard, setLeaderboardState] = useState<LeaderboardModel>(() =>
    loadLeaderboard(typeof localStorage === 'undefined' ? memoryStorage : localStorage)
  );
  const [achievementState, setAchievementState] = useState<AchievementState>(() => {
    if (typeof localStorage === 'undefined') return createDefaultAchievementState();
    return loadAchievements();
  });
  const [contentFeedback, setContentFeedback] = useState<ContentFeedbackModel>(() =>
    loadContentFeedback(typeof localStorage === 'undefined' ? memoryStorage : localStorage)
  );
  const [achievementNotice, setAchievementNotice] = useState<AchievementDefinition | null>(null);
  const [leaderboardSort, setLeaderboardSort] = useState<LeaderboardSort>('wins');
  const [leaderboardModeFilter, setLeaderboardModeFilter] = useState('all');
  const [selectedLeaderboardPlayer, setSelectedLeaderboardPlayer] = useState('');
  const [achievementModeFilter, setAchievementModeFilter] = useState<AchievementModeFilter>('all');

  useEffect(() => {
    saveAchievements(achievementState);
  }, [achievementState]);

  useEffect(() => {
    saveContentFeedback(contentFeedback);
  }, [contentFeedback]);

  const leaderboardEntries = useMemo(() => {
    const filtered = filterLeaderboard(leaderboard.entries, {
      gameId: GAME_ID,
      modeId: leaderboardModeFilter === 'all' ? undefined : leaderboardModeFilter,
      playerName: selectedLeaderboardPlayer || undefined
    });
    return sortLeaderboardBy(filtered, leaderboardSort);
  }, [leaderboard.entries, leaderboardModeFilter, leaderboardSort, selectedLeaderboardPlayer]);
  const leaderboardSummary = useMemo(() => summarizeLeaderboard(leaderboardEntries), [leaderboardEntries]);
  const leaderboardPlayers = useMemo(
    () => [...new Set(leaderboard.entries.map(entry => entry.playerName))],
    [leaderboard.entries]
  );
  const playerDetail = selectedLeaderboardPlayer
    ? getPlayerLeaderboardDetail(leaderboard.entries, selectedLeaderboardPlayer)
    : null;
  const contentFeedbackSummary = useMemo(() => summarizeContentFeedback(contentFeedback), [contentFeedback]);
  const achievementView = useMemo(
    () => getAchievementProgressView(achievementState, achievementDefinitions, achievementModeFilter),
    [achievementModeFilter, achievementState]
  );

  function setLeaderboard(next: LeaderboardModel) {
    saveLeaderboard(next);
    setLeaderboardState(next);
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

  // Applies the same counter update globally and to the mode's own counters.
  function updateCounters(modeId: string, update: (counters: AchievementCounters) => AchievementCounters) {
    updateAchievements(current => updateModeCounters({ ...current, counters: update(current.counters) }, modeId, update));
  }

  function recordRound(nextState: GuessTheFakeState, results: GuessResult[], round: GuessTheFakeRound | null) {
    const correctCount = results.filter(result => result.correct).length;
    updateCounters(nextState.modeId, counters => ({
      ...counters,
      roundsPlayed: counters.roundsPlayed + 1,
      correctGuesses: counters.correctGuesses + correctCount,
      longestStreak: Math.max(counters.longestStreak, nextState.longestStreakInMatch),
      categoriesPlayed: round
        ? {
          ...counters.categoriesPlayed,
          [round.categoryId]: (counters.categoriesPlayed[round.categoryId] ?? 0) + 1
        }
        : counters.categoriesPlayed
    }));
  }

  function recordMatchFinished(finalState: GuessTheFakeState, packIds: string[]) {
    setLeaderboard(recordLeaderboardMatch(leaderboard, GAME_ID, finalState.modeId, getLeaderboardRows(finalState)));
    updateCounters(finalState.modeId, counters => ({
      ...counters,
      matchesFinished: counters.matchesFinished + 1,
      perfectMatches: counters.perfectMatches + (finalState.correctGuessesInMatch === finalState.totalRounds ? 1 : 0),
      longestStreak: Math.max(counters.longestStreak, finalState.longestStreakInMatch),
      packsUsed: packIds.reduce(
        (used, packId) => ({ ...used, [packId]: (used[packId] ?? 0) + 1 }),
        { ...counters.packsUsed }
      )
    }));
  }

  function rateRound(round: GuessTheFakeRound, rating: ContentRating, modeId: string) {
    const next = rateContent(contentFeedback, round.id, rating, {
      categoryId: round.categoryId,
      difficulty: round.difficulty
    });
    const newEntries = next.entries.length - contentFeedback.entries.length;
    setContentFeedback(next);
    updateAchievements(current => updateModeCounters(
      { ...current, counters: { ...current.counters, contentFeedbackCount: next.entries.length } },
      modeId,
      counters => ({ ...counters, contentFeedbackCount: counters.contentFeedbackCount + newEntries })
    ));
  }

  return {
    leaderboard,
    setLeaderboard,
    leaderboardEntries,
    leaderboardSummary,
    leaderboardPlayers,
    playerDetail,
    leaderboardSort,
    setLeaderboardSort,
    leaderboardModeFilter,
    setLeaderboardModeFilter,
    selectedLeaderboardPlayer,
    setSelectedLeaderboardPlayer,
    achievementState,
    setAchievementState,
    achievementView,
    achievementModeFilter,
    setAchievementModeFilter,
    achievementNotice,
    dismissAchievementNotice: () => setAchievementNotice(null),
    contentFeedback,
    setContentFeedback,
    contentFeedbackSummary,
    recordRound,
    recordMatchFinished,
    rateRound
  };
}
