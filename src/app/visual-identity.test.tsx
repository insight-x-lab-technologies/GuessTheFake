import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ACHIEVEMENT_RARITIES } from '../core/achievements/achievements';
import { translate } from '../core/i18n/i18n';
import { PROFILE_AVATARS } from '../core/profiles/profiles';
import { getSeasonalSuggestion } from '../core/themes/seasonal';
import { BUILTIN_CATEGORIES } from '../game/data/builtin/catalog';
import { achievementDefinitions } from './achievement-definitions';
import { useSettings } from './hooks/useSettings';
import { MASCOT_MOODS } from './mascot';
import { AVATAR_ART } from './screens/AvatarArt';
import { CategoryArt, hasCategoryArt } from './screens/CategoryArt';
import { HomeScreen } from './screens/HomeScreen';
import { Mascot } from './screens/Mascot';
import { Medal } from './screens/Medal';
import { PlayerAvatar } from './screens/ProfileAvatar';
import { translations } from './translations';

const t = (key: string, params: Record<string, string | number> = {}) => translate(translations, 'en', key, params);

describe('Onda 16 visual identity', () => {
  beforeEach(() => localStorage.clear());

  it('draws every mascot mood as decorative SVG (W16-01)', () => {
    MASCOT_MOODS.forEach(mood => {
      const { container, unmount } = render(<Mascot mood={mood} />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('data-mood')).toBe(mood);
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      unmount();
    });
  });

  it('has art and a name in every language for each of the 24 avatars (W16-02)', () => {
    expect(Object.keys(AVATAR_ART).sort()).toEqual([...PROFILE_AVATARS].sort());
    PROFILE_AVATARS.forEach(avatar => {
      expect(t(`art.avatars.${avatar}`)).not.toBe(`art.avatars.${avatar}`);
    });
  });

  it('falls back to the default portrait for players without a profile (W16-02)', () => {
    const { container, rerender } = render(<PlayerAvatar profile={null} />);
    expect(container.querySelector('img')).not.toBeNull();
    rerender(<PlayerAvatar profile={{ avatar: 'frog', color: 'lime' }} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('[data-color="lime"] svg')).not.toBeNull();
  });

  it('gives every builtin category its own art and pack categories a neutral tag (W16-03)', () => {
    BUILTIN_CATEGORIES.forEach(category => expect(hasCategoryArt(category.id), category.id).toBe(true));
    expect(hasCategoryArt('my-pack-category')).toBe(false);
    const { container } = render(<CategoryArt categoryId="my-pack-category" />);
    expect(container.querySelector('[data-category="other"]')).not.toBeNull();
  });

  it('assigns a rarity to every trophy, with at least one of each tier (W16-06)', () => {
    achievementDefinitions.forEach(definition => expect(definition.rarity, definition.id).toBeDefined());
    ACHIEVEMENT_RARITIES.forEach(rarity => {
      expect(achievementDefinitions.some(definition => definition.rarity === rarity), rarity).toBe(true);
      expect(t(`art.medal.${rarity}`)).not.toBe(`art.medal.${rarity}`);
    });
    const { container } = render(<Medal rarity="legendary" locked />);
    expect(container.querySelector('svg')?.getAttribute('data-locked')).toBe('true');
  });

  it('suggests the seasonal theme on the home screen until applied or dismissed (W16-05)', () => {
    const october = new Date('2026-10-20T12:00:00');
    const { result } = renderHook(() => useSettings(october));
    expect(result.current.seasonalSuggestion?.key).toBe('halloween-2026');

    const { rerender } = render(
      <HomeScreen
        t={t}
        seasonalSuggestion={result.current.seasonalSuggestion}
        onNewMatch={() => {}}
        onPlaySolo={() => {}}
        onApplySeasonal={result.current.applySeasonalTheme}
        onDismissSeasonal={result.current.dismissSeasonalSuggestion}
      />
    );
    expect(screen.getByText('Halloween vibes')).toBeInTheDocument();
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Use theme' })));
    expect(result.current.settings.theme).toBe('halloween');
    expect(document.documentElement.dataset.theme).toBe('halloween');
    expect(result.current.seasonalSuggestion).toBeNull();
    rerender(<HomeScreen t={t} seasonalSuggestion={result.current.seasonalSuggestion} onNewMatch={() => {}} onPlaySolo={() => {}} />);
    expect(screen.queryByText('Halloween vibes')).toBeNull();
  });

  it('remembers a dismissed season and says nothing out of season (W16-05)', () => {
    const december = new Date('2026-12-24T12:00:00');
    const first = renderHook(() => useSettings(december));
    expect(first.result.current.seasonalSuggestion?.season.themeId).toBe('festive');
    act(() => first.result.current.dismissSeasonalSuggestion());
    expect(first.result.current.seasonalSuggestion).toBeNull();
    expect(first.result.current.settings.theme).not.toBe('festive');
    first.unmount();

    const reopened = renderHook(() => useSettings(new Date('2027-01-02T12:00:00')));
    expect(reopened.result.current.seasonalSuggestion).toBeNull();
    expect(getSeasonalSuggestion(new Date('2027-03-01T12:00:00'))).toBeNull();
  });
});
