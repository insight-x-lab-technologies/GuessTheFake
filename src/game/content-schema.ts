import type { ContentPack } from '../core/content-packs/content-packs';
import type { Language } from '../core/i18n/i18n';
import type {
  GuessTheFakeAgeRating,
  GuessTheFakeDifficulty,
  GuessTheFakePackContent,
  GuessTheFakeRound,
  LocalizedText
} from './types';

export type ContentValidationIssue = {
  path: string;
  message: string;
};

export type ContentValidationResult = {
  ok: boolean;
  issues: ContentValidationIssue[];
};

const difficulties: GuessTheFakeDifficulty[] = ['easy', 'medium', 'hard'];
const ageRatings: GuessTheFakeAgeRating[] = ['all', '10+'];

export function validateGuessTheFakePack(
  pack: unknown,
  options: { expectedGameId?: string; language?: Language } = {}
): ContentValidationResult {
  const issues: ContentValidationIssue[] = [];
  const candidate = pack as ContentPack<GuessTheFakePackContent>;

  if (!candidate || typeof candidate !== 'object') {
    return invalid('pack', 'Pack must be an object.');
  }

  requireText(candidate.id, 'id', issues);
  requireText(candidate.gameId, 'gameId', issues);
  if (options.expectedGameId && candidate.gameId !== options.expectedGameId) {
    issues.push({ path: 'gameId', message: `Pack gameId must be ${options.expectedGameId}.` });
  }
  if (candidate.schemaVersion !== 1) {
    issues.push({ path: 'schemaVersion', message: 'Schema version must be 1.' });
  }
  if (!candidate.title || typeof candidate.title !== 'object') {
    issues.push({ path: 'title', message: 'Title translations are required.' });
  }

  const content = candidate.content;
  if (!content || typeof content !== 'object') {
    return { ok: false, issues: [...issues, { path: 'content', message: 'Content is required.' }] };
  }

  const categoryIds = new Set<string>();
  if (!Array.isArray(content.categories) || content.categories.length < 1) {
    issues.push({ path: 'content.categories', message: 'At least one category is required.' });
  } else {
    content.categories.forEach((category, index) => {
      const path = `content.categories.${index}`;
      if (!requireText(category.id, `${path}.id`, issues)) return;
      if (categoryIds.has(category.id)) {
        issues.push({ path: `${path}.id`, message: 'Category ids must be unique.' });
      }
      categoryIds.add(category.id);
      validateLocalizedText(category.title, `${path}.title`, issues, options.language);
    });
  }

  if (!Array.isArray(content.rounds) || content.rounds.length < 1) {
    issues.push({ path: 'content.rounds', message: 'At least one round is required.' });
  } else {
    validateRounds(content.rounds, categoryIds, issues, options.language);
  }

  return { ok: issues.length === 0, issues };
}

export function getLocalizedText(text: LocalizedText | undefined, language: Language, fallback = '') {
  if (!text) return fallback;
  if (typeof text === 'string') return text;
  return text[language] ?? text.en ?? text.pt ?? Object.values(text)[0] ?? fallback;
}

function validateRounds(
  rounds: GuessTheFakeRound[],
  categoryIds: Set<string>,
  issues: ContentValidationIssue[],
  language?: Language
) {
  const roundIds = new Set<string>();
  const statementIds = new Set<string>();

  rounds.forEach((round, roundIndex) => {
    const path = `content.rounds.${roundIndex}`;
    if (!requireText(round.id, `${path}.id`, issues)) return;
    if (roundIds.has(round.id)) {
      issues.push({ path: `${path}.id`, message: 'Round ids must be unique.' });
    }
    roundIds.add(round.id);

    if (!categoryIds.has(round.categoryId)) {
      issues.push({ path: `${path}.categoryId`, message: 'Round category must exist in this pack.' });
    }
    if (!difficulties.includes(round.difficulty)) {
      issues.push({ path: `${path}.difficulty`, message: 'Difficulty must be easy, medium, or hard.' });
    }
    if (!Array.isArray(round.statements) || round.statements.length !== 5) {
      issues.push({ path: `${path}.statements`, message: 'Each round must have exactly 5 statements.' });
      return;
    }

    let fakeMatches = 0;
    round.statements.forEach((statement, statementIndex) => {
      const statementPath = `${path}.statements.${statementIndex}`;
      if (statementIds.has(statement.id)) {
        issues.push({ path: `${statementPath}.id`, message: 'Statement ids must be unique.' });
      }
      statementIds.add(statement.id);
      validateLocalizedText(statement.text, `${statementPath}.text`, issues, language);
      if (statement.id === round.fakeStatementId) fakeMatches += 1;
    });

    if (fakeMatches !== 1) {
      issues.push({ path: `${path}.fakeStatementId`, message: 'fakeStatementId must match exactly one statement.' });
    }
    validateLocalizedText(round.explanation, `${path}.explanation`, issues, language);
    if (round.ageRating !== undefined && !ageRatings.includes(round.ageRating)) {
      issues.push({ path: `${path}.ageRating`, message: 'Age rating must be all or 10+.' });
    }
  });
}

function validateLocalizedText(
  text: LocalizedText | Record<string, string> | undefined,
  path: string,
  issues: ContentValidationIssue[],
  language?: Language
) {
  if (typeof text === 'string') {
    if (!text.trim()) issues.push({ path, message: 'Text cannot be empty.' });
    return;
  }
  if (!text || typeof text !== 'object') {
    issues.push({ path, message: 'Localized text is required.' });
    return;
  }
  if (language && !text[language]) {
    issues.push({ path, message: `Missing ${language} translation.` });
  }
  if (!Object.values(text).some(value => value.trim())) {
    issues.push({ path, message: 'At least one translation is required.' });
  }
}

function requireText(value: unknown, path: string, issues: ContentValidationIssue[]) {
  if (typeof value !== 'string' || !value.trim()) {
    issues.push({ path, message: 'Value must be a non-empty string.' });
    return false;
  }
  return true;
}

function invalid(path: string, message: string): ContentValidationResult {
  return { ok: false, issues: [{ path, message }] };
}
