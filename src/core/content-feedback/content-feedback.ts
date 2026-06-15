import {
  createStorageKey,
  readVersionedWithMigrations,
  writeVersioned,
  type StorageAdapter
} from '../storage/storage';

export type ContentRating = 'up' | 'down' | 'skip';

export type ContentFeedbackEntry = {
  roundId: string;
  rating: ContentRating;
  updatedAt: string;
  categoryId?: string;
  difficulty?: string;
};

export type ContentFeedbackModel = {
  entries: ContentFeedbackEntry[];
};

export type ContentFeedbackStats = {
  total: number;
  ratings: Record<ContentRating, number>;
  byCategory: Array<ContentFeedbackStatRow>;
  byDifficulty: Array<ContentFeedbackStatRow>;
};

export type ContentFeedbackStatRow = {
  id: string;
  total: number;
  up: number;
  down: number;
  skip: number;
};

type ContentFeedbackV1Entry = {
  roundId: string;
  rating: ContentRating;
  updatedAt: string;
};

type ContentFeedbackV1Model = {
  entries: ContentFeedbackV1Entry[];
};

export const CONTENT_FEEDBACK_VERSION = 2;
export const CONTENT_FEEDBACK_KEY = createStorageKey('platform', 'content-feedback', CONTENT_FEEDBACK_VERSION);
export const CONTENT_FEEDBACK_V1_KEY = createStorageKey('platform', 'content-feedback', 1);

export function createEmptyContentFeedback(): ContentFeedbackModel {
  return { entries: [] };
}

export function loadContentFeedback(storage: StorageAdapter = localStorage): ContentFeedbackModel {
  return normalizeContentFeedback(readVersionedWithMigrations(storage, CONTENT_FEEDBACK_KEY, createEmptyContentFeedback(), CONTENT_FEEDBACK_VERSION, [
    {
      fromVersion: 1,
      key: CONTENT_FEEDBACK_V1_KEY,
      migrate: value => migrateContentFeedbackV1(value as ContentFeedbackV1Model)
    }
  ]));
}

export function saveContentFeedback(model: ContentFeedbackModel, storage: StorageAdapter = localStorage) {
  writeVersioned(storage, CONTENT_FEEDBACK_KEY, normalizeContentFeedback(model), CONTENT_FEEDBACK_VERSION);
}

export function rateContent(
  model: ContentFeedbackModel,
  roundId: string,
  rating: ContentRating,
  metadata: { categoryId?: string; difficulty?: string } = {},
  now = new Date().toISOString()
): ContentFeedbackModel {
  const entry = { roundId, rating, updatedAt: now, ...metadata };
  const exists = model.entries.some(item => item.roundId === roundId);
  return {
    entries: exists
      ? model.entries.map(item => (item.roundId === roundId ? entry : item))
      : [...model.entries, entry]
  };
}

export function shouldSkipRound(model: ContentFeedbackModel, roundId: string) {
  return model.entries.some(entry => entry.roundId === roundId && entry.rating === 'skip');
}

export function summarizeContentFeedback(model: ContentFeedbackModel): ContentFeedbackStats {
  const normalized = normalizeContentFeedback(model);
  return {
    total: normalized.entries.length,
    ratings: normalized.entries.reduce<Record<ContentRating, number>>(
      (counts, entry) => ({ ...counts, [entry.rating]: counts[entry.rating] + 1 }),
      { up: 0, down: 0, skip: 0 }
    ),
    byCategory: summarizeBy(normalized.entries, 'categoryId'),
    byDifficulty: summarizeBy(normalized.entries, 'difficulty')
  };
}

export function normalizeContentFeedback(model: Partial<ContentFeedbackModel>): ContentFeedbackModel {
  return {
    entries: Array.isArray(model.entries)
      ? model.entries.filter(isValidFeedbackEntry).map(entry => ({
        roundId: entry.roundId,
        rating: entry.rating,
        updatedAt: entry.updatedAt,
        categoryId: normalizeOptionalId(entry.categoryId),
        difficulty: normalizeOptionalId(entry.difficulty)
      }))
      : []
  };
}

function migrateContentFeedbackV1(model: ContentFeedbackV1Model): ContentFeedbackModel {
  return normalizeContentFeedback(model);
}

function summarizeBy(entries: ContentFeedbackEntry[], key: 'categoryId' | 'difficulty') {
  const rows = new Map<string, ContentFeedbackStatRow>();

  entries.forEach(entry => {
    const id = entry[key];
    if (!id) return;
    const current = rows.get(id) ?? { id, total: 0, up: 0, down: 0, skip: 0 };
    current.total += 1;
    current[entry.rating] += 1;
    rows.set(id, current);
  });

  return [...rows.values()].sort((a, b) => b.total - a.total || a.id.localeCompare(b.id));
}

function isValidFeedbackEntry(entry: Partial<ContentFeedbackEntry>): entry is ContentFeedbackEntry {
  return (
    typeof entry.roundId === 'string' &&
    ['up', 'down', 'skip'].includes(String(entry.rating)) &&
    typeof entry.updatedAt === 'string'
  );
}

function normalizeOptionalId(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : undefined;
}
