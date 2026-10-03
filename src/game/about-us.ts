import type { ContentPack } from '../core/content-packs/content-packs';
import type { Language } from '../core/i18n/i18n';
import { GAME_ID } from './modes';
import type { GuessTheFakePackContent, GuessTheFakePlayer, GuessTheFakeRound } from './types';

// W17-01 "About us": each player writes four truths and one lie about
// themselves; the rounds never leave the device unless saved as a local pack.

export const ABOUT_US_CATEGORY_ID = 'about-us';
export const ABOUT_US_STATEMENT_COUNT = 5;
export const ABOUT_US_MAX_LENGTH = 140;

export type AboutUsEntry = {
  // Position of the author in the player list (same order as normalizePlayers).
  authorIndex: number;
  statements: string[];
  lieIndex: number;
};

export type AboutUsEntryIssue = 'empty-statement' | 'too-long' | 'duplicate-statement' | 'no-lie';

export function createEmptyAboutUsEntry(authorIndex: number): AboutUsEntry {
  return { authorIndex, statements: Array(ABOUT_US_STATEMENT_COUNT).fill(''), lieIndex: -1 };
}

export function getAboutUsEntryIssues(entry: AboutUsEntry): AboutUsEntryIssue[] {
  const issues = new Set<AboutUsEntryIssue>();
  const texts = entry.statements.map(statement => statement.trim());
  if (texts.length !== ABOUT_US_STATEMENT_COUNT || texts.some(text => !text)) issues.add('empty-statement');
  if (texts.some(text => text.length > ABOUT_US_MAX_LENGTH)) issues.add('too-long');
  const normalized = texts.filter(Boolean).map(text => text.toLocaleLowerCase());
  if (new Set(normalized).size !== normalized.length) issues.add('duplicate-statement');
  if (!Number.isInteger(entry.lieIndex) || entry.lieIndex < 0 || entry.lieIndex >= ABOUT_US_STATEMENT_COUNT) issues.add('no-lie');
  return [...issues];
}

// One round per entry. Ids follow normalizePlayers (`player-<index + 1>`), so
// startMatch can match each round to its author.
export function buildAboutUsRounds(entries: AboutUsEntry[]): GuessTheFakeRound[] {
  return entries
    .filter(entry => getAboutUsEntryIssues(entry).length === 0)
    .map((entry, index) => {
      const id = `${ABOUT_US_CATEGORY_ID}-${index + 1}`;
      return {
        id,
        categoryId: ABOUT_US_CATEGORY_ID,
        difficulty: 'medium',
        statements: entry.statements.map((text, statementIndex) => ({ id: `${id}-${statementIndex + 1}`, text: text.trim() })),
        fakeStatementId: `${id}-${entry.lieIndex + 1}`,
        explanation: '',
        authorPlayerId: `player-${entry.authorIndex + 1}`
      };
    });
}

// "Save as local pack": a regular community pack, playable in any mode.
export function aboutUsRoundsToPack(
  rounds: GuessTheFakeRound[],
  players: GuessTheFakePlayer[],
  options: {
    id: string;
    language: Language;
    title: string;
    categoryTitle: string;
    explanationFor: (authorName: string) => string;
  }
): ContentPack<GuessTheFakePackContent> {
  const { language } = options;
  const localize = (value: unknown) => {
    if (typeof value === 'string') return value;
    const record = value as Record<string, string> | undefined;
    return record?.[language] ?? Object.values(record ?? {})[0] ?? '';
  };
  return {
    id: options.id,
    gameId: GAME_ID,
    schemaVersion: 1,
    title: { [language]: options.title },
    languages: [language],
    enabled: true,
    meta: { cover: { emoji: '💬', color: '#db2777' }, audience: 'family', difficulty: 'medium', license: { kind: 'community' } },
    content: {
      categories: [{ id: ABOUT_US_CATEGORY_ID, title: { [language]: options.categoryTitle } }],
      rounds: rounds
        .filter(round => round.categoryId === ABOUT_US_CATEGORY_ID)
        .map(round => {
          const author = players.find(player => player.id === round.authorPlayerId);
          return {
            id: `${options.id}-${round.id}`,
            categoryId: ABOUT_US_CATEGORY_ID,
            difficulty: round.difficulty,
            statements: round.statements.map(statement => ({
              id: `${options.id}-${statement.id}`,
              text: { [language]: localize(statement.text) }
            })),
            fakeStatementId: `${options.id}-${round.fakeStatementId}`,
            explanation: { [language]: options.explanationFor(author?.name ?? '') }
          };
        })
    }
  };
}
