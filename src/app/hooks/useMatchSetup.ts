import { useEffect, useMemo, useState } from 'react';
import type { ContentPack } from '../../core/content-packs/content-packs';
import { shouldSkipRound, type ContentFeedbackModel } from '../../core/content-feedback/content-feedback';
import type { GuessTheFakePackContent } from '../../game/types';
import { GAME_MODES } from '../../game/modes';
import { sanitizeRoundCount } from '../../game/rules';
import type { GuessTheFakeDifficulty, GuessTheFakeModeId } from '../../game/types';
import { normalizeSetupFilters } from '../setup-filters';

export type MatchSetupController = ReturnType<typeof useMatchSetup>;

// Form state of the New Match screen and the content it would draw from.
export function useMatchSetup({
  enabledPacks,
  contentFeedback
}: {
  enabledPacks: Array<ContentPack<GuessTheFakePackContent>>;
  contentFeedback: ContentFeedbackModel;
}) {
  const [playerNames, setPlayerNames] = useState('Ana, Bruno');
  const [selectedModeId, setSelectedModeId] = useState<GuessTheFakeModeId>('classic');
  const [roundCountInput, setRoundCountInput] = useState('5');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GuessTheFakeDifficulty | 'all'>('all');
  const [setupError, setSetupError] = useState('');

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
  const players = playerNames.split(',').map(name => name.trim()).filter(Boolean);

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

  return {
    playerNames,
    setPlayerNames,
    players,
    selectedModeId,
    selectedMode,
    selectMode: (modeId: GuessTheFakeModeId) => {
      setSelectedModeId(modeId);
      setSetupError('');
    },
    roundCountInput,
    changeRoundCount: (value: string) => {
      setRoundCountInput(value.replace(/[^\d]/g, ''));
      setSetupError('');
    },
    roundCount,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedDifficulty,
    setSelectedDifficulty,
    setupError,
    setSetupError,
    availableCategories,
    playableRounds,
    difficultyCounts,
    contentIsLow
  };
}
