import { useEffect, useMemo, useState } from 'react';
import {
  createDefaultAchievementState,
  evaluateAchievementsWithUnlocks,
  getAchievementProgressView,
  loadAchievements,
  normalizeAchievementState,
  saveAchievements,
  updateModeCounters,
  updatePlayerCounters,
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
import { GAME_ID, isSoloMode } from '../../game/modes';
import { loadRoundHistory, recordPlayedRounds, saveRoundHistory, type RoundHistoryModel } from '../../game/round-history';
import {
  createEmptySoloRecords,
  getSoloChallengeFromState,
  getSoloChallengeKey,
  getSoloResult,
  listSoloRecords,
  loadSoloRecords,
  recordSoloResult,
  saveSoloRecords,
  type SoloRecordsModel,
  type SoloResult
} from '../../game/solo-records';
import type { GuessResult, GuessTheFakeRound, GuessTheFakeState } from '../../game/types';
import { achievementDefinitions } from '../achievement-definitions';
import { getLeaderboardRows, getPlayerCounterKey, getResultPlayerNames } from '../match-summary';
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
  const [soloRecords, setSoloRecordsState] = useState<SoloRecordsModel>(() =>
    loadSoloRecords(typeof localStorage === 'undefined' ? memoryStorage : localStorage)
  );
  const [roundHistory, setRoundHistoryState] = useState<RoundHistoryModel>(() =>
    loadRoundHistory(typeof localStorage === 'undefined' ? memoryStorage : localStorage)
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

  const soloRecordRows = useMemo(() => listSoloRecords(soloRecords), [soloRecords]);
  const weakRoundIds = useMemo(
    () => contentFeedback.entries.filter(entry => entry.rating === 'down').map(entry => entry.roundId),
    [contentFeedback.entries]
  );

  function setSoloRecords(next: SoloRecordsModel) {
    if (typeof localStorage !== 'undefined') saveSoloRecords(next);
    setSoloRecordsState(next);
  }

  function setRoundHistory(next: RoundHistoryModel) {
    if (typeof localStorage !== 'undefined') saveRoundHistory(next);
    setRoundHistoryState(next);
  }

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
    const addRound = (counters: AchievementCounters, guesses: number, correct: number, streak: number): AchievementCounters => ({
      ...counters,
      roundsPlayed: counters.roundsPlayed + 1,
      correctGuesses: counters.correctGuesses + correct,
      longestStreak: Math.max(counters.longestStreak, streak),
      categoriesPlayed: round
        ? { ...counters.categoriesPlayed, [round.categoryId]: (counters.categoriesPlayed[round.categoryId] ?? 0) + 1 }
        : counters.categoriesPlayed,
      guessesByDifficulty: round
        ? { ...counters.guessesByDifficulty, [round.difficulty]: (counters.guessesByDifficulty[round.difficulty] ?? 0) + guesses }
        : counters.guessesByDifficulty,
      correctByDifficulty: round
        ? { ...counters.correctByDifficulty, [round.difficulty]: (counters.correctByDifficulty[round.difficulty] ?? 0) + correct }
        : counters.correctByDifficulty,
      correctByCategory: round
        ? { ...counters.correctByCategory, [round.categoryId]: (counters.correctByCategory[round.categoryId] ?? 0) + correct }
        : counters.correctByCategory
    });
    updateAchievements(current => {
      let next = updateModeCounters(
        { ...current, counters: addRound(current.counters, results.length, correctCount, nextState.longestStreakInMatch) },
        nextState.modeId,
        counters => addRound(counters, results.length, correctCount, nextState.longestStreakInMatch)
      );
      // Personal trophies: each player behind a guess (team members too).
      results.forEach(result => {
        const streak = result.correct ? (result.previousStreak ?? 0) + 1 : 0;
        getResultPlayerNames(nextState, result).forEach(name => {
          next = updatePlayerCounters(next, getPlayerCounterKey(name), counters =>
            addRound(counters, 1, result.correct ? 1 : 0, streak)
          );
        });
      });
      return next;
    });
    if (round) setRoundHistory(recordPlayedRounds(roundHistory, [round.id]));
  }

  function recordMatchFinished(finalState: GuessTheFakeState, packIds: string[]) {
    const solo = isSoloMode(finalState.modeId);
    // A solo challenge has a record, not a win: it stays off the leaderboard.
    if (!solo) {
      setLeaderboard(recordLeaderboardMatch(leaderboard, GAME_ID, finalState.modeId, getLeaderboardRows(finalState)));
    }
    const finishMatch = (counters: AchievementCounters, perfect: boolean): AchievementCounters => ({
      ...counters,
      matchesFinished: counters.matchesFinished + 1,
      perfectMatches: counters.perfectMatches + (perfect ? 1 : 0),
      longestStreak: Math.max(counters.longestStreak, finalState.longestStreakInMatch),
      soloMatches: counters.soloMatches + (solo ? 1 : 0),
      tableMatches: counters.tableMatches + (solo ? 0 : 1),
      packsUsed: packIds.reduce(
        (used, packId) => ({ ...used, [packId]: (used[packId] ?? 0) + 1 }),
        { ...counters.packsUsed }
      )
    });
    const perfect = finalState.correctGuessesInMatch === finalState.totalRounds;
    updateAchievements(current => {
      let next = updateModeCounters(
        { ...current, counters: finishMatch(current.counters, perfect) },
        finalState.modeId,
        counters => finishMatch(counters, perfect)
      );
      finalState.players.forEach(player => {
        next = updatePlayerCounters(next, getPlayerCounterKey(player.name), counters =>
          finishMatch(counters, solo && perfect)
        );
      });
      return next;
    });
  }

  // Solo: keeps the best result per player and challenge.
  function recordSoloMatch(finalState: GuessTheFakeState, playerKey: string): {
    result: SoloResult;
    previous: SoloResult | null;
    isNewRecord: boolean;
  } | null {
    const result = getSoloResult(finalState);
    if (!result) return null;
    const recorded = recordSoloResult(soloRecords, playerKey, getSoloChallengeKey(getSoloChallengeFromState(finalState)), result);
    if (recorded.isNewRecord) setSoloRecords(recorded.model);
    return { result, previous: recorded.previous, isNewRecord: recorded.isNewRecord };
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
    soloRecords,
    soloRecordRows,
    setSoloRecords,
    clearSoloRecords: () => setSoloRecords(createEmptySoloRecords()),
    roundHistory,
    setRoundHistory,
    weakRoundIds,
    recordRound,
    recordMatchFinished,
    recordSoloMatch,
    rateRound
  };
}
