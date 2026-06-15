import { describe, expect, it } from 'vitest';
import { writeVersioned, type StorageAdapter } from '../storage/storage';
import {
  CONTENT_FEEDBACK_KEY,
  CONTENT_FEEDBACK_V1_KEY,
  loadContentFeedback,
  rateContent,
  shouldSkipRound,
  summarizeContentFeedback
} from './content-feedback';

function createMemoryStorage(): StorageAdapter {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
}

describe('content feedback helpers', () => {
  it('records ratings with round metadata and summarizes by category and difficulty', () => {
    const model = rateContent(
      rateContent({ entries: [] }, 'round-1', 'up', { categoryId: 'science', difficulty: 'easy' }, '2026-06-14T00:00:00.000Z'),
      'round-2',
      'skip',
      { categoryId: 'science', difficulty: 'hard' },
      '2026-06-14T00:01:00.000Z'
    );

    expect(shouldSkipRound(model, 'round-2')).toBe(true);
    expect(summarizeContentFeedback(model)).toMatchObject({
      total: 2,
      ratings: { up: 1, down: 0, skip: 1 },
      byCategory: [{ id: 'science', total: 2, up: 1, down: 0, skip: 1 }],
      byDifficulty: [
        { id: 'easy', total: 1, up: 1, down: 0, skip: 0 },
        { id: 'hard', total: 1, up: 0, down: 0, skip: 1 }
      ]
    });
  });

  it('migrates v1 feedback entries into the v2 schema', () => {
    const storage = createMemoryStorage();
    writeVersioned(
      storage,
      CONTENT_FEEDBACK_V1_KEY,
      { entries: [{ roundId: 'legacy-round', rating: 'down', updatedAt: '2026-06-13T00:00:00.000Z' }] },
      1
    );

    const model = loadContentFeedback(storage);

    expect(model.entries).toEqual([
      { roundId: 'legacy-round', rating: 'down', updatedAt: '2026-06-13T00:00:00.000Z' }
    ]);
    expect(JSON.parse(storage.getItem(CONTENT_FEEDBACK_KEY) ?? '{}').version).toBe(2);
  });
});
