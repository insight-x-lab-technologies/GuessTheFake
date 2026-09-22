import type { Language } from '../core/i18n/i18n';
import { getLocalizedText } from './content-schema';
import type { GuessTheFakeDifficulty, GuessTheFakePackContent } from './types';

// Minimum rounds per language x category x difficulty before a language ships
// (ROADMAP W9-01: 15 rounds = 75 statements).
export const RELEASE_MIN_ROUNDS_PER_CELL = 15;

const difficulties: GuessTheFakeDifficulty[] = ['easy', 'medium', 'hard'];

export type ContentAuditCell = {
  language: Language;
  categoryId: string;
  difficulty: GuessTheFakeDifficulty;
  rounds: number;
  reviewed: number;
};

export type ContentAuditIssue = {
  language?: Language;
  id: string;
  problem: 'duplicate-round-id' | 'duplicate-statement-id' | 'duplicate-statement' | 'missing-text' | 'empty-explanation' | 'invalid-fake';
};

export type ContentAuditReport = {
  cells: ContentAuditCell[];
  issues: ContentAuditIssue[];
  lowCells: ContentAuditCell[];
};

// Pure audit of one or more language packs of the same content.
// `packs` maps each language to the pack content loaded for it.
export function auditContent(
  packs: Partial<Record<Language, GuessTheFakePackContent>>,
  minRoundsPerCell = RELEASE_MIN_ROUNDS_PER_CELL
): ContentAuditReport {
  const cells: ContentAuditCell[] = [];
  const issues: ContentAuditIssue[] = [];

  (Object.entries(packs) as Array<[Language, GuessTheFakePackContent]>).forEach(([language, content]) => {
    const roundIds = new Set<string>();
    const statementIds = new Set<string>();
    const statementTexts = new Map<string, string>();

    content.rounds.forEach(round => {
      if (roundIds.has(round.id)) issues.push({ language, id: round.id, problem: 'duplicate-round-id' });
      roundIds.add(round.id);

      if (round.statements.filter(statement => statement.id === round.fakeStatementId).length !== 1) {
        issues.push({ language, id: round.id, problem: 'invalid-fake' });
      }
      if (!getLocalizedText(round.explanation, language).trim()) {
        issues.push({ language, id: round.id, problem: 'empty-explanation' });
      }

      round.statements.forEach(statement => {
        if (statementIds.has(statement.id)) issues.push({ language, id: statement.id, problem: 'duplicate-statement-id' });
        statementIds.add(statement.id);

        const text = typeof statement.text === 'string' ? statement.text : statement.text[language];
        if (!text?.trim()) {
          issues.push({ language, id: statement.id, problem: 'missing-text' });
          return;
        }
        const normalized = normalizeStatement(text);
        if (statementTexts.has(normalized)) issues.push({ language, id: statement.id, problem: 'duplicate-statement' });
        statementTexts.set(normalized, statement.id);
      });
    });

    content.categories.forEach(category => {
      difficulties.forEach(difficulty => {
        const cellRounds = content.rounds.filter(round => round.categoryId === category.id && round.difficulty === difficulty);
        cells.push({
          language,
          categoryId: category.id,
          difficulty,
          rounds: cellRounds.length,
          reviewed: cellRounds.filter(round => round.review?.status === 'reviewed').length
        });
      });
    });
  });

  return { cells, issues, lowCells: cells.filter(cell => cell.rounds < minRoundsPerCell) };
}

export function formatAuditReport(report: ContentAuditReport) {
  const lines = report.cells.map(cell =>
    `${cell.language}  ${cell.categoryId.padEnd(12)} ${cell.difficulty.padEnd(7)} ${String(cell.rounds).padStart(3)}  reviewed ${String(cell.reviewed).padStart(3)}${cell.rounds < RELEASE_MIN_ROUNDS_PER_CELL ? '  LOW' : ''}`
  );
  const issueLines = report.issues.map(issue => `${issue.language ?? '-'}  ${issue.problem}  ${issue.id}`);
  return [...lines, '', `issues: ${report.issues.length}`, ...issueLines].join('\n');
}

function normalizeStatement(text: string) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}
