import { describe, expect, it } from 'vitest';
import { getSeasonalSuggestion, shouldOfferSeasonalTheme } from './seasonal';

const day = (value: string) => new Date(`${value}T12:00:00`);

describe('seasonal theme suggestion', () => {
  it('suggests Halloween through October and the first days of November', () => {
    expect(getSeasonalSuggestion(day('2026-09-30'))).toBeNull();
    expect(getSeasonalSuggestion(day('2026-10-01'))?.key).toBe('halloween-2026');
    expect(getSeasonalSuggestion(day('2026-11-02'))?.season.themeId).toBe('halloween');
    expect(getSeasonalSuggestion(day('2026-11-03'))).toBeNull();
  });

  it('suggests the festive theme across the new year with one season key', () => {
    expect(getSeasonalSuggestion(day('2026-11-30'))).toBeNull();
    expect(getSeasonalSuggestion(day('2026-12-01'))?.key).toBe('festive-2026');
    expect(getSeasonalSuggestion(day('2027-01-06'))?.key).toBe('festive-2026');
    expect(getSeasonalSuggestion(day('2027-01-07'))).toBeNull();
  });

  it('stops offering once applied or dismissed for the season', () => {
    const suggestion = getSeasonalSuggestion(day('2026-10-20'));
    expect(shouldOfferSeasonalTheme(suggestion, 'cosmic', '')).toBe(true);
    expect(shouldOfferSeasonalTheme(suggestion, 'halloween', '')).toBe(false);
    expect(shouldOfferSeasonalTheme(suggestion, 'cosmic', 'halloween-2026')).toBe(false);
    expect(shouldOfferSeasonalTheme(suggestion, 'cosmic', 'halloween-2025')).toBe(true);
    expect(shouldOfferSeasonalTheme(null, 'cosmic', '')).toBe(false);
  });
});
