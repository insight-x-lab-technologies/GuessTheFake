import type { ContentPack } from '../core/content-packs/content-packs';
import type { Language } from '../core/i18n/i18n';
import { createStorageKey, readVersioned, removeStored, writeVersioned, type StorageAdapter } from '../core/storage/storage';
import { getLocalizedText, validateGuessTheFakePack } from './content-schema';
import { GAME_ID } from './modes';
import type { GuessTheFakeDifficulty, GuessTheFakePackContent } from './types';

// W17-05: pack authoring in the UI. A draft is one-language and flat, so the
// form stays simple; draftToPack turns it into a regular community pack.

export const PACK_DRAFT_STATEMENT_COUNT = 5;
export const PACK_DRAFT_MAX_STATEMENT = 200;

export type PackDraftCategory = {
  id: string;
  // Builtin categories keep every translation; custom ones only the draft language.
  title: Record<string, string>;
};

export type PackDraftRound = {
  key: string;
  categoryId: string;
  difficulty: GuessTheFakeDifficulty;
  statements: string[];
  fakeIndex: number;
  explanation: string;
};

export type PackDraft = {
  // Set when editing an installed pack; a new id is made on first save.
  packId: string | null;
  language: Language;
  title: string;
  description: string;
  emoji: string;
  categories: PackDraftCategory[];
  rounds: PackDraftRound[];
};

export type PackDraftIssueKey =
  | 'editor.issue.title'
  | 'editor.issue.noRounds'
  | 'editor.issue.category'
  | 'editor.issue.statement'
  | 'editor.issue.statementLong'
  | 'editor.issue.duplicate'
  | 'editor.issue.fake'
  | 'editor.issue.explanation';

export type PackDraftIssue = {
  key: PackDraftIssueKey;
  roundIndex?: number;
  statementIndex?: number;
};

export const PACK_DRAFT_VERSION = 1;
export const PACK_DRAFT_KEY = createStorageKey('game.guess-the-fake', 'pack-draft', PACK_DRAFT_VERSION);

export function createEmptyPackDraft(language: Language, categories: PackDraftCategory[]): PackDraft {
  return {
    packId: null,
    language,
    title: '',
    description: '',
    emoji: '✏️',
    categories,
    rounds: [createEmptyDraftRound(categories[0]?.id ?? 'custom', 1)]
  };
}

export function createEmptyDraftRound(categoryId: string, serial: number): PackDraftRound {
  return {
    key: `round-${serial}-${Math.random().toString(36).slice(2, 8)}`,
    categoryId,
    difficulty: 'easy',
    statements: Array(PACK_DRAFT_STATEMENT_COUNT).fill(''),
    fakeIndex: -1,
    explanation: ''
  };
}

// "Comida de rua" -> "custom-comida-de-rua"; unique within the draft.
export function createCustomCategory(name: string, language: Language, existing: PackDraftCategory[]): PackDraftCategory | null {
  const title = name.trim();
  if (!title) return null;
  const slug = title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32) || 'category';
  if (existing.some(category => getLocalizedText(category.title, language).toLocaleLowerCase() === title.toLocaleLowerCase())) return null;
  let id = `custom-${slug}`;
  for (let index = 2; existing.some(category => category.id === id); index += 1) id = `custom-${slug}-${index}`;
  return { id, title: { [language]: title } };
}

export function getDraftIssues(draft: PackDraft): PackDraftIssue[] {
  const issues: PackDraftIssue[] = [];
  if (!draft.title.trim()) issues.push({ key: 'editor.issue.title' });
  if (!draft.rounds.length) issues.push({ key: 'editor.issue.noRounds' });
  const seen = new Set<string>();
  draft.rounds.forEach((round, roundIndex) => {
    if (!draft.categories.some(category => category.id === round.categoryId)) issues.push({ key: 'editor.issue.category', roundIndex });
    round.statements.forEach((statement, statementIndex) => {
      const text = statement.trim();
      if (!text) {
        issues.push({ key: 'editor.issue.statement', roundIndex, statementIndex });
        return;
      }
      if (text.length > PACK_DRAFT_MAX_STATEMENT) issues.push({ key: 'editor.issue.statementLong', roundIndex, statementIndex });
      const normalized = text.toLocaleLowerCase();
      if (seen.has(normalized)) issues.push({ key: 'editor.issue.duplicate', roundIndex, statementIndex });
      seen.add(normalized);
    });
    if (!Number.isInteger(round.fakeIndex) || round.fakeIndex < 0 || round.fakeIndex >= PACK_DRAFT_STATEMENT_COUNT) {
      issues.push({ key: 'editor.issue.fake', roundIndex });
    }
    if (!round.explanation.trim()) issues.push({ key: 'editor.issue.explanation', roundIndex });
  });
  return issues;
}

export function createPackId(title: string, now: number) {
  const slug = title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24) || 'pack';
  return `local-${slug}-${now.toString(36)}`;
}

// Only categories used by a round go into the pack.
export function draftToPack(draft: PackDraft, packId: string, today: string): ContentPack<GuessTheFakePackContent> {
  const { language } = draft;
  const usedCategoryIds = new Set(draft.rounds.map(round => round.categoryId));
  return {
    id: packId,
    gameId: GAME_ID,
    schemaVersion: 1,
    title: { [language]: draft.title.trim() },
    languages: [language],
    enabled: true,
    meta: {
      cover: { emoji: draft.emoji.trim().slice(0, 8) || '✏️', color: '#0ea5e9' },
      ...(draft.description.trim() ? { description: { [language]: draft.description.trim() } } : {}),
      audience: 'family',
      difficulty: getDraftDifficulty(draft),
      version: today,
      license: { kind: 'community' }
    },
    content: {
      categories: draft.categories
        .filter(category => usedCategoryIds.has(category.id))
        .map(category => ({ id: category.id, title: category.title })),
      rounds: draft.rounds.map((round, roundIndex) => {
        const roundId = `${packId}-${String(roundIndex + 1).padStart(3, '0')}`;
        return {
          id: roundId,
          categoryId: round.categoryId,
          difficulty: round.difficulty,
          statements: round.statements.map((statement, statementIndex) => ({
            id: `${roundId}-${'abcde'[statementIndex]}`,
            text: { [language]: statement.trim() }
          })),
          fakeStatementId: `${roundId}-${'abcde'[round.fakeIndex] ?? 'a'}`,
          explanation: { [language]: round.explanation.trim() }
        };
      })
    }
  };
}

// Editing an installed pack: texts in `language` (or the first available).
export function packToDraft(pack: ContentPack<GuessTheFakePackContent>, fallbackLanguage: Language): PackDraft {
  const language = (pack.languages?.[0] as Language | undefined) ?? fallbackLanguage;
  return {
    packId: pack.id,
    language,
    title: pack.title[language] ?? Object.values(pack.title)[0] ?? '',
    description: pack.meta?.description?.[language] ?? '',
    emoji: pack.meta?.cover?.emoji ?? '✏️',
    categories: pack.content.categories.map(category => ({ id: category.id, title: category.title })),
    rounds: pack.content.rounds.map((round, index) => ({
      key: `round-${index + 1}-${round.id}`,
      categoryId: round.categoryId,
      difficulty: round.difficulty,
      statements: round.statements.map(statement => getLocalizedText(statement.text, language)),
      fakeIndex: round.statements.findIndex(statement => statement.id === round.fakeStatementId),
      explanation: getLocalizedText(round.explanation, language)
    }))
  };
}

// Builtin categories first, then the draft's own categories.
export function mergeDraftCategories(builtin: PackDraftCategory[], draft: PackDraftCategory[]) {
  const ids = new Set(builtin.map(category => category.id));
  return [...builtin, ...draft.filter(category => !ids.has(category.id))];
}

export function validateDraftPack(draft: PackDraft, packId: string, today: string) {
  const issues = getDraftIssues(draft);
  const pack = draftToPack(draft, packId, today);
  const schema = validateGuessTheFakePack(pack, { expectedGameId: GAME_ID, language: draft.language });
  return { issues, pack, ok: issues.length === 0 && schema.ok, schemaIssues: schema.issues };
}

export function loadPackDraft(storage: StorageAdapter = localStorage): PackDraft | null {
  const draft = readVersioned<PackDraft | null>(storage, PACK_DRAFT_KEY, null, PACK_DRAFT_VERSION);
  if (!draft || typeof draft !== 'object' || !Array.isArray(draft.rounds) || !Array.isArray(draft.categories)) return null;
  return draft;
}

export function savePackDraft(draft: PackDraft | null, storage: StorageAdapter = localStorage) {
  if (!draft) {
    removeStored(storage, PACK_DRAFT_KEY);
    return;
  }
  writeVersioned(storage, PACK_DRAFT_KEY, draft, PACK_DRAFT_VERSION);
}

function getDraftDifficulty(draft: PackDraft) {
  const difficulties = new Set(draft.rounds.map(round => round.difficulty));
  return difficulties.size === 1 ? [...difficulties][0] : 'mixed';
}
