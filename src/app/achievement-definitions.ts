import type { AchievementDefinition } from '../core/achievements/achievements';

export const achievementDefinitions: AchievementDefinition[] = [
  {
    id: 'first-correct',
    titleKey: 'achievements.firstWinTitle',
    descriptionKey: 'achievements.firstWinDescription',
    target: 1,
    getProgress: counters => counters.correctGuesses
  },
  {
    id: 'five-rounds',
    titleKey: 'achievements.roundsTitle',
    descriptionKey: 'achievements.roundsDescription',
    target: 5,
    getProgress: counters => counters.roundsPlayed
  },
  {
    id: 'streak-three',
    titleKey: 'achievements.streakTitle',
    descriptionKey: 'achievements.streakDescription',
    target: 3,
    getProgress: counters => counters.longestStreak
  },
  {
    id: 'perfect-match',
    titleKey: 'achievements.perfectTitle',
    descriptionKey: 'achievements.perfectDescription',
    target: 1,
    getProgress: counters => counters.perfectMatches
  },
  {
    id: 'category-tour',
    titleKey: 'achievements.categoryTitle',
    descriptionKey: 'achievements.categoryDescription',
    target: 5,
    getProgress: counters => Object.keys(counters.categoriesPlayed).length
  },
  {
    id: 'pack-curator',
    titleKey: 'achievements.packTitle',
    descriptionKey: 'achievements.packDescription',
    target: 2,
    getProgress: counters => Object.keys(counters.packsUsed).length
  },
  {
    id: 'content-editor',
    titleKey: 'achievements.feedbackTitle',
    descriptionKey: 'achievements.feedbackDescription',
    target: 3,
    getProgress: counters => counters.contentFeedbackCount
  }
];
