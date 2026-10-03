import { describe, expect, it } from 'vitest';
import { createDefaultAchievementCounters, type AchievementCounters } from '../core/achievements/achievements';
import { buildProgressTracks, getNextObjective, getTrackView } from './progress-tracks';

function counters(overrides: Partial<AchievementCounters> = {}): AchievementCounters {
  return { ...createDefaultAchievementCounters(), ...overrides };
}

describe('progress tracks (W13-04)', () => {
  const tracks = buildProgressTracks(['science', 'history']);

  it('builds category, difficulty, style, and curation tracks', () => {
    expect(tracks.map(track => track.id)).toEqual([
      'category-science',
      'category-history',
      'difficulty-easy',
      'difficulty-medium',
      'difficulty-hard',
      'style-streak',
      'style-perfect',
      'style-table',
      'style-solo',
      'curation-feedback',
      'curation-packs'
    ]);
  });

  it('reports completed steps and the next target', () => {
    const science = tracks[0];
    expect(getTrackView(science, counters({ correctByCategory: { science: 12 } }))).toMatchObject({
      progress: 12,
      completedSteps: 2,
      totalSteps: 3,
      nextTarget: 25
    });
    expect(getTrackView(science, counters({ correctByCategory: { science: 30 } })).nextTarget).toBeNull();
  });

  it('picks the closest step, boosting what the match just played', () => {
    const state = counters({ correctByCategory: { science: 2, history: 2 }, longestStreak: 2 });
    expect(getNextObjective(tracks, state)?.track.id).toBe('category-science');
    expect(getNextObjective(tracks, state, { solo: false, categoryIds: ['history'] })).toMatchObject({
      track: { id: 'category-history' },
      remaining: 1,
      nextTarget: 3
    });
  });

  it('leaves table-only tracks out of a solo objective', () => {
    const tableOnly = [tracks.find(track => track.id === 'style-table')!];
    expect(getNextObjective(tableOnly, counters(), { solo: false })?.track.id).toBe('style-table');
    expect(getNextObjective(tableOnly, counters(), { solo: true })).toBeNull();
  });
});
