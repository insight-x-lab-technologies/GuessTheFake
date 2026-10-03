import { describe, expect, it } from 'vitest';
import { builtinPackEn as sampleGuessTheFakePack } from '../test/builtin';
import { getLocalizedText, validateGuessTheFakePack } from './content-schema';

describe('Guess the Fake content schema', () => {
  it('accepts the built-in pack', () => {
    const result = validateGuessTheFakePack(sampleGuessTheFakePack, {
      expectedGameId: 'guess-the-fake',
      language: 'en'
    });

    expect(result.ok).toBe(true);
  });

  it('rejects an unknown age rating', () => {
    const broken = structuredClone(sampleGuessTheFakePack);
    broken.content.rounds[0].ageRating = 'adults' as never;

    expect(validateGuessTheFakePack(broken).issues.some(issue => issue.path.endsWith('ageRating'))).toBe(true);
  });

  it('rejects rounds without exactly one fake statement', () => {
    const broken = structuredClone(sampleGuessTheFakePack);
    broken.content.rounds[0].fakeStatementId = 'missing';
    const result = validateGuessTheFakePack(broken);

    expect(result.ok).toBe(false);
    expect(result.issues.some(issue => issue.path.endsWith('fakeStatementId'))).toBe(true);
  });

  it('rejects invalid difficulty and unknown category', () => {
    const broken = structuredClone(sampleGuessTheFakePack);
    broken.content.rounds[0].difficulty = 'impossible' as never;
    broken.content.rounds[0].categoryId = 'missing-category';
    const result = validateGuessTheFakePack(broken);

    expect(result.ok).toBe(false);
    expect(result.issues.some(issue => issue.path.endsWith('difficulty'))).toBe(true);
    expect(result.issues.some(issue => issue.path.endsWith('categoryId'))).toBe(true);
  });

  it('resolves localized text with fallback', () => {
    expect(getLocalizedText({ pt: 'Olá', en: 'Hello' }, 'en')).toBe('Hello');
    expect(getLocalizedText({ pt: 'Olá' }, 'fr')).toBe('Olá');
  });
});

describe('themed pack metadata validation (W13-07)', () => {
  it('accepts the builtin pack meta', () => {
    expect(sampleGuessTheFakePack.meta?.changelog?.length).toBeGreaterThan(0);
    expect(validateGuessTheFakePack(sampleGuessTheFakePack).ok).toBe(true);
  });

  it('accepts a community pack without meta', () => {
    const { meta: _meta, ...plain } = structuredClone(sampleGuessTheFakePack);
    expect(validateGuessTheFakePack(plain).ok).toBe(true);
  });

  it('rejects malformed meta fields', () => {
    const broken = structuredClone(sampleGuessTheFakePack);
    broken.meta = {
      cover: { emoji: '🏡', color: 'orange' },
      audience: 'everyone' as never,
      difficulty: 'brutal' as never,
      changelog: [{ version: '1', date: '03/10/2026', notes: { en: 'x' } }],
      license: { kind: 'premium', signature: { algorithm: '', keyId: 'k', value: 'v' } }
    };
    const paths = validateGuessTheFakePack(broken).issues.map(issue => issue.path);

    expect(paths).toEqual(expect.arrayContaining([
      'meta.cover.color',
      'meta.audience',
      'meta.difficulty',
      'meta.changelog.0.date',
      'meta.license.signature.algorithm'
    ]));
  });
});
