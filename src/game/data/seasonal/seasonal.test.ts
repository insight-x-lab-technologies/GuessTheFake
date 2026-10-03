import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES } from '../../../core/i18n/i18n';
import { createMemoryStorage } from '../../../test/memory-storage';
import { auditContent } from '../../content-audit';
import { validateGuessTheFakePack } from '../../content-schema';
import { GAME_ID } from '../../modes';
import { SEASONAL_PACKS } from './catalog';
import { isPackInSeason, loadSeasonalPackIds, loadSeasonalPacks, saveSeasonalPackIds } from './index';

describe('W17-06 seasonal packs', () => {
  it('ship 30 valid, reviewed rounds per pack in every language', async () => {
    for (const language of SUPPORTED_LANGUAGES) {
      const packs = await loadSeasonalPacks(language, SEASONAL_PACKS.map(pack => pack.id));
      expect(packs).toHaveLength(3);
      for (const pack of packs) {
        expect(pack.content.rounds).toHaveLength(30);
        expect(pack.content.rounds.every(round => round.review?.status === 'reviewed')).toBe(true);
        expect(validateGuessTheFakePack(pack, { expectedGameId: GAME_ID, language }).ok).toBe(true);
        const report = auditContent({ [language]: pack.content }, 10);
        expect(report.issues).toEqual([]);
        expect(report.lowCells).toEqual([]);
      }
    }
  });

  it('loads nothing while every pack is off', async () => {
    expect(await loadSeasonalPacks('pt', [])).toEqual([]);
  });

  it('remembers the packs turned on and ignores unknown ids', () => {
    const storage = createMemoryStorage();
    expect(loadSeasonalPackIds(storage)).toEqual([]);
    saveSeasonalPackIds(['seasonal-halloween', 'seasonal-halloween'], storage);
    expect(loadSeasonalPackIds(storage)).toEqual(['seasonal-halloween']);
    storage.setItem('gtf.game.guess-the-fake.seasonal-packs.v1', JSON.stringify({ version: 1, value: { enabledIds: ['nope', 'seasonal-sports'] }, updatedAt: '' }));
    expect(loadSeasonalPackIds(storage)).toEqual(['seasonal-sports']);
  });

  it('marks the pack of the current season', () => {
    const halloween = SEASONAL_PACKS.find(pack => pack.id === 'seasonal-halloween')!;
    const sports = SEASONAL_PACKS.find(pack => pack.id === 'seasonal-sports')!;
    expect(isPackInSeason(halloween, 'halloween')).toBe(true);
    expect(isPackInSeason(halloween, 'festive')).toBe(false);
    expect(isPackInSeason(sports, 'halloween')).toBe(false);
  });
});
