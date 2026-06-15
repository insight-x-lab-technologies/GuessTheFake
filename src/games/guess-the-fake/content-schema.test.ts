import { describe, expect, it } from 'vitest';
import { sampleGuessTheFakePack } from './data/sample-pack';
import { getLocalizedText, validateGuessTheFakePack } from './content-schema';

describe('Guess the Fake content schema', () => {
  it('accepts the built-in pack', () => {
    const result = validateGuessTheFakePack(sampleGuessTheFakePack, {
      expectedGameId: 'guess-the-fake'
    });

    expect(result.ok).toBe(true);
    expect(sampleGuessTheFakePack.content.rounds.length).toBeGreaterThanOrEqual(50);
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
