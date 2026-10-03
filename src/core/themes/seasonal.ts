import type { ThemeId } from './themes';

// W16-05: seasonal theme suggested by the local date. Pure: the caller
// passes the date. A season key carries the year the season starts in, so a
// dismissal lasts for that season only.

export type Season = {
  id: 'halloween' | 'festive';
  themeId: ThemeId;
  // Inclusive month/day window in local time; may wrap the new year.
  from: [month: number, day: number];
  to: [month: number, day: number];
};

export const SEASONS: Season[] = [
  { id: 'halloween', themeId: 'halloween', from: [10, 1], to: [11, 2] },
  { id: 'festive', themeId: 'festive', from: [12, 1], to: [1, 6] }
];

export type SeasonalSuggestion = {
  season: Season;
  // e.g. 'halloween-2026', 'festive-2026' (also on 2027-01-03).
  key: string;
};

function dayOfYearKey(month: number, day: number) {
  return month * 100 + day;
}

export function getSeasonalSuggestion(date: Date): SeasonalSuggestion | null {
  const month = date.getMonth() + 1;
  const today = dayOfYearKey(month, date.getDate());
  for (const season of SEASONS) {
    const from = dayOfYearKey(...season.from);
    const to = dayOfYearKey(...season.to);
    const wraps = from > to;
    const inside = wraps ? today >= from || today <= to : today >= from && today <= to;
    if (!inside) continue;
    const startYear = wraps && today <= to ? date.getFullYear() - 1 : date.getFullYear();
    return { season, key: `${season.id}-${startYear}` };
  }
  return null;
}

// The suggestion shows only while the theme is not applied yet and the
// player has not dismissed it this season.
export function shouldOfferSeasonalTheme(
  suggestion: SeasonalSuggestion | null,
  currentTheme: ThemeId,
  dismissedKey: string
): suggestion is SeasonalSuggestion {
  return Boolean(suggestion && suggestion.season.themeId !== currentTheme && suggestion.key !== dismissedKey);
}
