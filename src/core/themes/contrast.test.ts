import { describe, expect, it } from 'vitest';
import { auditThemeContrast, calculateContrastRatio, THEME_CONTRAST_AUDIT } from './contrast';

describe('theme contrast audit', () => {
  it('calculates WCAG contrast ratios', () => {
    expect(calculateContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
  });

  it('keeps audited theme text pairs above their required contrast', () => {
    Object.entries(THEME_CONTRAST_AUDIT).forEach(([themeId, pairs]) => {
      auditThemeContrast(pairs).forEach(result => {
        expect(
          result.passes,
          `${themeId} ${result.label} ratio ${result.ratio.toFixed(2)}`
        ).toBe(true);
      });
    });
  });
});
