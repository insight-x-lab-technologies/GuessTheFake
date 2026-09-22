import { describe, expect, it } from 'vitest';
import { getAvailableDifficultiesForCategory, normalizeSetupFilters } from './setup-filters';
import type { GuessTheFakeRound } from '../game/types';

const rounds: GuessTheFakeRound[] = [
  {
    id: 'history-easy',
    categoryId: 'history',
    difficulty: 'easy',
    fakeStatementId: 'history-easy-fake',
    statements: [
      { id: 'history-easy-1', text: 'A' },
      { id: 'history-easy-2', text: 'B' },
      { id: 'history-easy-3', text: 'C' },
      { id: 'history-easy-4', text: 'D' },
      { id: 'history-easy-fake', text: 'E' }
    ]
  },
  {
    id: 'science-hard',
    categoryId: 'science',
    difficulty: 'hard',
    fakeStatementId: 'science-hard-fake',
    statements: [
      { id: 'science-hard-1', text: 'A' },
      { id: 'science-hard-2', text: 'B' },
      { id: 'science-hard-3', text: 'C' },
      { id: 'science-hard-4', text: 'D' },
      { id: 'science-hard-fake', text: 'E' }
    ]
  }
];

describe('setup filter helpers', () => {
  it('returns difficulties available for the selected category', () => {
    expect(getAvailableDifficultiesForCategory(rounds, 'history')).toEqual(['easy']);
    expect(getAvailableDifficultiesForCategory(rounds, 'all')).toEqual(['easy', 'hard']);
  });

  it('keeps valid category and difficulty selections', () => {
    expect(normalizeSetupFilters(
      { categoryId: 'science', difficulty: 'hard' },
      { categoryIds: ['history', 'science'], rounds }
    )).toEqual({ categoryId: 'science', difficulty: 'hard' });
  });

  it('resets invalid category and difficulty selections after content changes', () => {
    expect(normalizeSetupFilters(
      { categoryId: 'sports', difficulty: 'medium' },
      { categoryIds: ['history', 'science'], rounds }
    )).toEqual({ categoryId: 'all', difficulty: 'all' });
  });

  it('resets difficulty when the selected category no longer offers it', () => {
    expect(normalizeSetupFilters(
      { categoryId: 'history', difficulty: 'hard' },
      { categoryIds: ['history', 'science'], rounds }
    )).toEqual({ categoryId: 'history', difficulty: 'all' });
  });
});
