import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES } from '../core/i18n/i18n';
import { auditContent, formatAuditReport } from './content-audit';
import { validateGuessTheFakePack } from './content-schema';
import { loadBuiltinPack } from './data/builtin';
import { BUILTIN_ROUNDS } from './data/builtin/catalog';
import { GAME_ID } from './modes';
import type { GuessTheFakePackContent } from './types';

describe('builtin content audit', () => {
  it('ships every published language with release coverage and no issues', async () => {
    const packs = Object.fromEntries(await Promise.all(
      SUPPORTED_LANGUAGES.map(async language => [language, (await loadBuiltinPack(language)).content] as const)
    )) as Record<string, GuessTheFakePackContent>;
    const report = auditContent(packs);

    if (process.env.AUDIT_REPORT) console.log(formatAuditReport(report));

    expect(report.issues).toEqual([]);
    expect(report.lowCells).toEqual([]);
    SUPPORTED_LANGUAGES.forEach(language => {
      expect(packs[language].rounds).toHaveLength(BUILTIN_ROUNDS.length);
      expect(validateGuessTheFakePack({ id: 'x', gameId: GAME_ID, schemaVersion: 1, title: { en: 'x' }, enabled: true, content: packs[language] }, { expectedGameId: GAME_ID, language }).ok).toBe(true);
    });
  });

  it('flags duplicates, empty explanations and low cells', () => {
    const report = auditContent({
      en: {
        categories: [{ id: 'c', title: { en: 'C' } }],
        rounds: [{
          id: 'r',
          categoryId: 'c',
          difficulty: 'easy',
          fakeStatementId: 'r-a',
          explanation: { en: ' ' },
          statements: ['Same.', 'same', 'b', 'c', 'd'].map((text, index) => ({ id: `r-${'abcde'[index]}`, text: { en: text } }))
        }]
      }
    });

    expect(report.issues.map(issue => issue.problem).sort()).toEqual(['duplicate-statement', 'empty-explanation']);
    expect(report.lowCells).toHaveLength(3);
  });
});
