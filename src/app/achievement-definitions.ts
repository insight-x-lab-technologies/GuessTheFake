import type { AchievementDefinition } from '../core/achievements/achievements';

export const achievementDefinitions: AchievementDefinition[] = [
  {
    id: 'first-correct',
    rarity: 'bronze',
    titleKey: 'achievements.firstWinTitle',
    descriptionKey: 'achievements.firstWinDescription',
    target: 1,
    getProgress: counters => counters.correctGuesses
  },
  {
    id: 'five-rounds',
    rarity: 'bronze',
    titleKey: 'achievements.roundsTitle',
    descriptionKey: 'achievements.roundsDescription',
    target: 5,
    getProgress: counters => counters.roundsPlayed
  },
  {
    id: 'streak-three',
    rarity: 'silver',
    titleKey: 'achievements.streakTitle',
    descriptionKey: 'achievements.streakDescription',
    target: 3,
    getProgress: counters => counters.longestStreak
  },
  {
    id: 'perfect-match',
    rarity: 'gold',
    titleKey: 'achievements.perfectTitle',
    descriptionKey: 'achievements.perfectDescription',
    target: 1,
    getProgress: counters => counters.perfectMatches
  },
  {
    id: 'category-tour',
    rarity: 'silver',
    titleKey: 'achievements.categoryTitle',
    descriptionKey: 'achievements.categoryDescription',
    target: 5,
    getProgress: counters => Object.keys(counters.categoriesPlayed).length
  },
  {
    id: 'pack-curator',
    rarity: 'gold',
    titleKey: 'achievements.packTitle',
    descriptionKey: 'achievements.packDescription',
    target: 2,
    getProgress: counters => Object.keys(counters.packsUsed).length
  },
  {
    id: 'content-editor',
    rarity: 'silver',
    titleKey: 'achievements.feedbackTitle',
    descriptionKey: 'achievements.feedbackDescription',
    target: 3,
    getProgress: counters => counters.contentFeedbackCount
  },
  {
    id: 'legend-streak',
    rarity: 'legendary',
    titleKey: 'achievements.legendTitle',
    descriptionKey: 'achievements.legendDescription',
    target: 10,
    getProgress: counters => counters.longestStreak
  }
];
