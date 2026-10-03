import type { AchievementCounters } from '../core/achievements/achievements';

// W13-04: progress tracks. Each track is a ladder of targets over one local
// counter; the next objective is the closest unfinished step.

export type ProgressTrackGroup = 'category' | 'difficulty' | 'style' | 'curation';

export type ProgressTrack = {
  id: string;
  group: ProgressTrackGroup;
  titleKey: string;
  objectiveKey: string;
  targets: number[];
  // Counts only table (non-solo) play.
  tableOnly?: boolean;
  categoryId?: string;
  difficulty?: string;
  getProgress: (counters: AchievementCounters) => number;
};

export type ProgressTrackView = {
  track: ProgressTrack;
  progress: number;
  completedSteps: number;
  totalSteps: number;
  nextTarget: number | null;
};

export type NextObjective = ProgressTrackView & { nextTarget: number; remaining: number };

const CATEGORY_TARGETS = [3, 10, 25];
const DIFFICULTY_TARGETS = [5, 15, 40];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

export function buildProgressTracks(categoryIds: string[]): ProgressTrack[] {
  const categories = categoryIds.map<ProgressTrack>(categoryId => ({
    id: `category-${categoryId}`,
    group: 'category',
    titleKey: 'tracks.category',
    objectiveKey: 'tracks.objective.category',
    targets: CATEGORY_TARGETS,
    categoryId,
    getProgress: counters => counters.correctByCategory[categoryId] ?? 0
  }));
  const difficulties = DIFFICULTIES.map<ProgressTrack>(difficulty => ({
    id: `difficulty-${difficulty}`,
    group: 'difficulty',
    titleKey: 'tracks.difficulty',
    objectiveKey: 'tracks.objective.difficulty',
    targets: DIFFICULTY_TARGETS,
    difficulty,
    getProgress: counters => counters.correctByDifficulty[difficulty] ?? 0
  }));
  return [
    ...categories,
    ...difficulties,
    {
      id: 'style-streak',
      group: 'style',
      titleKey: 'tracks.streak',
      objectiveKey: 'tracks.objective.streak',
      targets: [3, 5, 8],
      getProgress: counters => counters.longestStreak
    },
    {
      id: 'style-perfect',
      group: 'style',
      titleKey: 'tracks.perfect',
      objectiveKey: 'tracks.objective.perfect',
      targets: [1, 3, 10],
      getProgress: counters => counters.perfectMatches
    },
    {
      id: 'style-table',
      group: 'style',
      titleKey: 'tracks.table',
      objectiveKey: 'tracks.objective.table',
      targets: [1, 5, 15],
      tableOnly: true,
      getProgress: counters => counters.tableMatches
    },
    {
      id: 'style-solo',
      group: 'style',
      titleKey: 'tracks.solo',
      objectiveKey: 'tracks.objective.solo',
      targets: [1, 5, 15],
      getProgress: counters => counters.soloMatches
    },
    {
      id: 'curation-feedback',
      group: 'curation',
      titleKey: 'tracks.feedback',
      objectiveKey: 'tracks.objective.feedback',
      targets: [3, 10, 25],
      getProgress: counters => counters.contentFeedbackCount
    },
    {
      id: 'curation-packs',
      group: 'curation',
      titleKey: 'tracks.packs',
      objectiveKey: 'tracks.objective.packs',
      targets: [1, 2, 3],
      getProgress: counters => Object.keys(counters.packsUsed).length
    }
  ];
}

export function getTrackView(track: ProgressTrack, counters: AchievementCounters): ProgressTrackView {
  const progress = Math.max(0, track.getProgress(counters));
  const completedSteps = track.targets.filter(target => progress >= target).length;
  return {
    track,
    progress,
    completedSteps,
    totalSteps: track.targets.length,
    nextTarget: track.targets.find(target => progress < target) ?? null
  };
}

export function getTrackViews(tracks: ProgressTrack[], counters: AchievementCounters) {
  return tracks.map(track => getTrackView(track, counters));
}

// Picks the unfinished step closest to completion. Tracks of what was just
// played (category, difficulty) get a boost so the objective feels
// connected to the match; solo leaves table-only tracks out.
export function getNextObjective(
  tracks: ProgressTrack[],
  counters: AchievementCounters,
  context: { solo: boolean; categoryIds?: string[]; difficulty?: string } = { solo: false }
): NextObjective | null {
  let best: { view: NextObjective; score: number } | null = null;
  tracks.forEach(track => {
    if (context.solo && track.tableOnly) return;
    const view = getTrackView(track, counters);
    if (view.nextTarget === null) return;
    const previousTarget = track.targets[view.completedSteps - 1] ?? 0;
    const ratio = (view.progress - previousTarget) / (view.nextTarget - previousTarget);
    const related = (track.categoryId && context.categoryIds?.includes(track.categoryId))
      || (track.difficulty && track.difficulty === context.difficulty);
    const score = ratio + (related ? 0.25 : 0);
    if (!best || score > best.score) {
      best = { view: { ...view, nextTarget: view.nextTarget, remaining: view.nextTarget - view.progress }, score };
    }
  });
  return (best as { view: NextObjective } | null)?.view ?? null;
}
