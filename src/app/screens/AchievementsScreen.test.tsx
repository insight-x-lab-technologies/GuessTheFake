import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import {
  createDefaultAchievementState,
  getAchievementProgressView,
  updateModeCounters,
  type AchievementModeFilter
} from '../../core/achievements/achievements';
import { summarizeContentFeedback, createEmptyContentFeedback } from '../../core/content-feedback/content-feedback';
import { translate } from '../../core/i18n/i18n';
import { achievementDefinitions } from '../achievement-definitions';
import { translations } from '../translations';
import { AchievementsScreen } from './AchievementsScreen';

const t = (key: string, params: Record<string, string | number> = {}) => translate(translations, 'en', key, params);

function Harness() {
  const [filter, setFilter] = useState<AchievementModeFilter>('all');
  const state = updateModeCounters(
    {
      ...createDefaultAchievementState(),
      counters: { ...createDefaultAchievementState().counters, roundsPlayed: 5, matchesFinished: 1 }
    },
    'classic',
    counters => ({ ...counters, roundsPlayed: 5, matchesFinished: 1 })
  );
  return (
    <AchievementsScreen
      t={t}
      progress={{
        achievementView: getAchievementProgressView(state, achievementDefinitions, filter),
        achievementModeFilter: filter,
        setAchievementModeFilter: setFilter,
        contentFeedbackSummary: summarizeContentFeedback(createEmptyContentFeedback())
      }}
    />
  );
}

describe('AchievementsScreen', () => {
  it('filters trophy progress by mode and shows an empty state for unplayed modes', () => {
    render(<Harness />);

    expect(screen.getByRole('heading', { name: /persistent investigator/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^mode$/i), { target: { value: 'classic' } });
    expect(screen.getByText(/^unlocked$/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^mode$/i), { target: { value: 'teams' } });
    expect(screen.getByRole('status')).toHaveTextContent(/no matches in teams mode yet/i);
    expect(screen.queryByRole('heading', { name: /persistent investigator/i })).not.toBeInTheDocument();
  });
});
