import { useEffect, useMemo, useState } from 'react';
import type { AchievementCounters } from '../../core/achievements/achievements';
import type { ContentPack } from '../../core/content-packs/content-packs';
import { shouldSkipRound, type ContentFeedbackModel, type ContentFeedbackStats } from '../../core/content-feedback/content-feedback';
import type { PlatformSettings } from '../../core/settings/settings';
import type { GuessTheFakePackContent } from '../../game/types';
import { BUILTIN_PACK_ID } from '../../game/data/builtin';
import { GAME_MODES, isSoloMode } from '../../game/modes';
import { suggestMatchSetup, type MatchSuggestion } from '../../game/match-suggestion';
import { sanitizeRoundCount } from '../../game/rules';
import {
  getSoloChallengeKey,
  getSoloRecord,
  listSoloRecords,
  type SoloChallenge,
  type SoloRecordsModel
} from '../../game/solo-records';
import type { GuessTheFakeDifficulty, GuessTheFakeModeId } from '../../game/types';
import { normalizeSetupFilters } from '../setup-filters';

export type MatchSetupController = ReturnType<typeof useMatchSetup>;

export const SUGGESTION_MINUTE_OPTIONS = [5, 10, 15, 20, 30, 45];

// Form state of the New Match screen and the content it would draw from.
export function useMatchSetup({
  enabledPacks,
  contentFeedback,
  settings,
  updateSettings,
  counters,
  feedbackSummary,
  soloRecords,
  getSoloKeyForName
}: {
  enabledPacks: Array<ContentPack<GuessTheFakePackContent>>;
  contentFeedback: ContentFeedbackModel;
  settings: PlatformSettings;
  updateSettings: (next: Partial<PlatformSettings>) => void;
  counters: AchievementCounters;
  feedbackSummary: ContentFeedbackStats;
  soloRecords: SoloRecordsModel;
  getSoloKeyForName: (name: string) => string;
}) {
  const [playerNames, setPlayerNames] = useState('Ana, Bruno');
  const [soloPlayerName, setSoloPlayerName] = useState(settings.lastSoloPlayerName);
  const [selectedModeId, setSelectedModeId] = useState<GuessTheFakeModeId>('classic');
  const [roundCountInput, setRoundCountInput] = useState('5');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GuessTheFakeDifficulty | 'all'>('all');
  const [setupError, setSetupError] = useState('');
  const [suggestionApplied, setSuggestionApplied] = useState(false);

  const allCategories = useMemo(() => {
    const categories = new Map<string, Record<string, string>>();
    enabledPacks.forEach(pack => {
      pack.content.categories.forEach(category => categories.set(category.id, category.title));
    });
    return [...categories.entries()].map(([id, title]) => ({ id, title }));
  }, [enabledPacks]);
  const kids = settings.kidsModeEnabled;
  // W17-03: kids mode draws only kids rounds; otherwise they stay out.
  const languageAvailableRounds = useMemo(() => {
    return enabledPacks.flatMap(pack =>
      pack.content.rounds
        .filter(round => !shouldSkipRound(contentFeedback, round.id))
        .filter(round => (kids ? round.ageRating === 'kids' || pack.meta?.audience === 'kids' : round.ageRating !== 'kids'))
    );
  }, [contentFeedback, enabledPacks, kids]);
  // Categories with rounds under the current audience (kids or not).
  const availableCategories = useMemo(() => {
    const used = new Set(languageAvailableRounds.map(round => round.categoryId));
    return allCategories.filter(category => used.has(category.id));
  }, [allCategories, languageAvailableRounds]);
  const playableRounds = useMemo(() => {
    return languageAvailableRounds
      .filter(round => selectedCategoryId === 'all' || round.categoryId === selectedCategoryId)
      .filter(round => selectedDifficulty === 'all' || round.difficulty === selectedDifficulty);
  }, [languageAvailableRounds, selectedCategoryId, selectedDifficulty]);
  const difficultyCounts = useMemo(() => {
    return languageAvailableRounds.reduce<Record<GuessTheFakeDifficulty, number>>(
      (counts, round) => ({
        ...counts,
        [round.difficulty]: counts[round.difficulty] + 1
      }),
      { easy: 0, medium: 0, hard: 0 }
    );
  }, [languageAvailableRounds]);
  const roundCount = sanitizeRoundCount(Number(roundCountInput), Math.max(1, playableRounds.length));
  const requestedRounds = Number(roundCountInput);
  const contentIsLow = Number.isFinite(requestedRounds)
    && playableRounds.length > 0
    && requestedRounds > playableRounds.length;
  const selectedMode = GAME_MODES.find(mode => mode.id === selectedModeId) ?? GAME_MODES[0];
  const solo = isSoloMode(selectedModeId);
  const tablePlayers = playerNames.split(',').map(name => name.trim()).filter(Boolean);
  const players = solo ? [soloPlayerName.trim()].filter(Boolean) : tablePlayers;
  // Installed and seasonal packs (not the core builtin one) are part of a solo challenge.
  const installedPackIds = useMemo(
    () => enabledPacks.filter(pack => pack.id !== BUILTIN_PACK_ID).map(pack => pack.id).sort(),
    [enabledPacks]
  );
  const challenge: SoloChallenge = {
    totalRounds: playableRounds.length ? roundCount : 0,
    categoryId: selectedCategoryId,
    difficulty: selectedDifficulty,
    specialRounds: settings.specialRoundsEnabled,
    packIds: installedPackIds,
    kids
  };
  const soloPlayerKey = solo && soloPlayerName.trim() ? getSoloKeyForName(soloPlayerName) : '';
  const soloRecord = soloPlayerKey ? getSoloRecord(soloRecords, soloPlayerKey, getSoloChallengeKey(challenge)) : null;

  const weakCategoryIds = useMemo(
    () => feedbackSummary.byCategory.filter(row => row.down > row.up).map(row => row.id),
    [feedbackSummary.byCategory]
  );
  const suggestion: MatchSuggestion = useMemo(() => suggestMatchSetup({
    playerCount: solo ? 1 : tablePlayers.length,
    minutesAvailable: settings.suggestionMinutes,
    roundTimeSeconds: settings.roundTimeSeconds,
    availableRounds: languageAvailableRounds,
    history: {
      guessesByDifficulty: counters.guessesByDifficulty,
      correctByDifficulty: counters.correctByDifficulty,
      categoriesPlayed: counters.categoriesPlayed
    },
    weakCategoryIds,
    soloRecords: solo && soloPlayerKey
      ? listSoloRecords({ records: { [soloPlayerKey]: soloRecords.records[soloPlayerKey] ?? {} } })
        .map(row => ({ challenge: row.challenge, result: row }))
      : []
  }), [
    counters,
    languageAvailableRounds,
    settings.roundTimeSeconds,
    settings.suggestionMinutes,
    solo,
    soloPlayerKey,
    soloRecords,
    tablePlayers.length,
    weakCategoryIds
  ]);

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

  function touch() {
    setSetupError('');
    setSuggestionApplied(false);
  }

  function selectMode(modeId: GuessTheFakeModeId) {
    setSelectedModeId(modeId);
    touch();
  }

  // Adds a family profile to the table, or picks it as the solo player.
  function addPlayerName(name: string) {
    touch();
    if (solo) {
      setSoloPlayerName(name);
      return;
    }
    if (tablePlayers.some(player => player.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setPlayerNames(tablePlayers.filter(player => player.toLocaleLowerCase() !== name.toLocaleLowerCase()).join(', '));
      return;
    }
    setPlayerNames([...tablePlayers, name].join(', '));
  }

  function applySuggestion() {
    setSelectedModeId(suggestion.modeId);
    setRoundCountInput(String(suggestion.roundCount));
    setSelectedCategoryId(suggestion.categoryId);
    setSelectedDifficulty(suggestion.difficulty);
    setSetupError('');
    setSuggestionApplied(true);
  }

  return {
    playerNames,
    setPlayerNames: (value: string) => {
      setPlayerNames(value);
      touch();
    },
    soloPlayerName,
    setSoloPlayerName: (value: string) => {
      setSoloPlayerName(value);
      touch();
    },
    players,
    tablePlayers,
    addPlayerName,
    selectedModeId,
    selectedMode,
    solo,
    selectMode,
    roundCountInput,
    changeRoundCount: (value: string) => {
      setRoundCountInput(value.replace(/[^\d]/g, ''));
      touch();
    },
    roundCount,
    selectedCategoryId,
    setSelectedCategoryId: (value: string) => {
      setSelectedCategoryId(value);
      touch();
    },
    selectedDifficulty,
    setSelectedDifficulty: (value: GuessTheFakeDifficulty | 'all') => {
      setSelectedDifficulty(value);
      touch();
    },
    tableMomentsEnabled: settings.tableMomentsEnabled,
    setTableMomentsEnabled: (enabled: boolean) => updateSettings({ tableMomentsEnabled: enabled }),
    specialRoundsEnabled: settings.specialRoundsEnabled,
    setSpecialRoundsEnabled: (enabled: boolean) => updateSettings({ specialRoundsEnabled: enabled }),
    kidsModeEnabled: kids,
    setKidsModeEnabled: (enabled: boolean) => {
      updateSettings({ kidsModeEnabled: enabled });
      touch();
    },
    allCategories,
    suggestionMinutes: settings.suggestionMinutes,
    setSuggestionMinutes: (minutes: number) => updateSettings({ suggestionMinutes: minutes }),
    suggestion,
    suggestionApplied,
    applySuggestion,
    installedPackIds,
    soloRecord,
    setupError,
    setSetupError,
    availableCategories,
    playableRounds,
    difficultyCounts,
    contentIsLow
  };
}
