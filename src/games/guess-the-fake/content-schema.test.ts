import { describe, expect, it } from 'vitest';
import { sampleGuessTheFakePack } from './data/sample-pack';
import { getLocalizedText, validateGuessTheFakePack } from './content-schema';
import type { Language } from '../../core/i18n/i18n';
import type { GuessTheFakeDifficulty } from './types';

const languages: Language[] = ['pt', 'en', 'es', 'fr', 'de', 'it'];
const difficulties: GuessTheFakeDifficulty[] = ['easy', 'medium', 'hard'];
const expectedStatementsPerSlice = 150;

describe('Guess the Fake content schema', () => {
  it('accepts the built-in pack', () => {
    const result = validateGuessTheFakePack(sampleGuessTheFakePack, {
      expectedGameId: 'guess-the-fake'
    });

    expect(result.ok).toBe(true);
    expect(sampleGuessTheFakePack.content.rounds.length).toBe(630);
  });

  it('covers every category, difficulty, and published language with 150 statements', () => {
    const categoryIds = sampleGuessTheFakePack.content.categories.map(category => category.id);

    expect(sampleGuessTheFakePack.languages).toEqual(languages);

    for (const categoryId of categoryIds) {
      for (const difficulty of difficulties) {
        const rounds = sampleGuessTheFakePack.content.rounds.filter(round => (
          round.categoryId === categoryId && round.difficulty === difficulty
        ));

        expect(rounds).toHaveLength(expectedStatementsPerSlice / 5);

        for (const language of languages) {
          const statements = rounds.flatMap(round =>
            round.statements.map(statement => getLocalizedText(statement.text, language))
          );

          expect(statements).toHaveLength(expectedStatementsPerSlice);
          expect(statements.every(statement => statement.trim().length > 0)).toBe(true);
          expect(new Set(statements).size).toBe(expectedStatementsPerSlice);
        }
      }
    }
  });

  it('does not repeat built-in statements within each language', () => {
    for (const language of languages) {
      const statements = sampleGuessTheFakePack.content.rounds.flatMap(round =>
        round.statements.map(statement => getLocalizedText(statement.text, language))
      );

      expect(new Set(statements).size).toBe(statements.length);
    }
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
