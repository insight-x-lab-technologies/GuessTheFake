import { mkdirSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES, type Language } from '../core/i18n/i18n';
import { buildReviewSheet, findInvalidReviews } from './content-review';
import { loadBuiltinPack } from './data/builtin';
import { BUILTIN_ROUNDS } from './data/builtin/catalog';
import { BUILTIN_REVIEWS } from './data/builtin/reviews';
import type { GuessTheFakePackContent, GuessTheFakeRound } from './types';

function round(id: string, reviewed = false): GuessTheFakeRound {
  return {
    id,
    categoryId: 'c',
    difficulty: 'easy',
    fakeStatementId: `${id}-b`,
    explanation: { pt: 'Explicacao.', en: 'Explanation.' },
    statements: ['a', 'b', 'c', 'd', 'e'].map(letter => ({ id: `${id}-${letter}`, text: { pt: `pt ${letter}`, en: `en ${letter}` } })),
    review: reviewed ? { status: 'reviewed', reviewedAt: '2026-09-01' } : { status: 'draft' }
  };
}

describe('content review sheet', () => {
  const content: GuessTheFakePackContent = { categories: [{ id: 'c', title: { pt: 'C' } }], rounds: [round('r1'), round('r2', true)] };

  it('lists draft rounds with the fake marked, the comparison language and a paste-ready log line', () => {
    const sheet = buildReviewSheet({ pt: content, en: content }, { language: 'pt', compareLanguage: 'en', today: '2026-09-22' });

    expect(sheet).toContain('Revisadas: 1 de 2. Nesta folha: 1.');
    expect(sheet).toContain('### r1');
    expect(sheet).not.toContain('### r2');
    expect(sheet).toContain('2. **[FALSA]** pt b');
    expect(sheet).toContain('   > en: en b');
    expect(sheet).toContain("Registro: `'r1': { status: 'reviewed', reviewedAt: '2026-09-22' },`");
  });

  it('can include reviewed rounds', () => {
    const sheet = buildReviewSheet({ pt: content }, { language: 'pt', includeReviewed: true, today: '2026-09-22' });

    expect(sheet).toContain('### r2 (revisada)');
    expect(sheet).not.toContain('> en:');
  });

  it('flags invalid review log entries', () => {
    expect(findInvalidReviews({
      r1: { status: 'reviewed', reviewedAt: '2026-09-22' },
      r2: { status: 'reviewed', reviewedAt: '22/09/2026' },
      r3: { status: 'draft' },
      nope: { status: 'reviewed', reviewedAt: '2026-09-22' }
    }, ['r1', 'r2', 'r3'])).toEqual([
      'r2: reviewedAt must be YYYY-MM-DD',
      'r3: status must be reviewed',
      'nope: unknown round id'
    ]);
  });

  it('keeps the builtin review log consistent with the catalog', () => {
    expect(findInvalidReviews(BUILTIN_REVIEWS, BUILTIN_ROUNDS.map(entry => entry.id))).toEqual([]);
  });

  // `npm run review:content` writes content-review/<lang>.md (REVIEW_LANG, REVIEW_COMPARE, REVIEW_ALL).
  it.runIf(Boolean(process.env.REVIEW_SHEET))('writes the review sheet', async () => {
    const language = (process.env.REVIEW_LANG || 'pt') as Language;
    const compareLanguage = (process.env.REVIEW_COMPARE || (language === 'en' ? 'pt' : 'en')) as Language;
    expect(SUPPORTED_LANGUAGES).toContain(language);
    expect(SUPPORTED_LANGUAGES).toContain(compareLanguage);

    const packs = {
      [language]: (await loadBuiltinPack(language)).content,
      [compareLanguage]: (await loadBuiltinPack(compareLanguage)).content
    };
    const sheet = buildReviewSheet(packs, {
      language,
      compareLanguage,
      includeReviewed: Boolean(process.env.REVIEW_ALL),
      today: new Date().toISOString().slice(0, 10)
    });
    mkdirSync('content-review', { recursive: true });
    writeFileSync(`content-review/${language}.md`, sheet);
    console.log(`content-review/${language}.md`);
  });
});
