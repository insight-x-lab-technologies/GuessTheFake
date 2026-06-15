import type { ThemeId } from './themes';

export type ContrastPair = {
  foreground: string;
  background: string;
  requiredRatio: number;
  label: string;
};

export const THEME_CONTRAST_AUDIT: Record<ThemeId, ContrastPair[]> = {
  cosmic: [
    { label: 'text on surface', foreground: '#ffffff', background: '#231e5a', requiredRatio: 4.5 },
    { label: 'accent text', foreground: '#271729', background: '#ffd93d', requiredRatio: 4.5 },
    { label: 'primary button', foreground: '#111111', background: '#d64f41', requiredRatio: 4.5 }
  ],
  'liquid-glass': [
    { label: 'text on surface', foreground: '#162033', background: '#eaf2ff', requiredRatio: 4.5 },
    { label: 'accent text', foreground: '#ffffff', background: '#2563eb', requiredRatio: 4.5 },
    { label: 'success button', foreground: '#08392b', background: '#a2f4d9', requiredRatio: 4.5 }
  ],
  material3: [
    { label: 'text on surface', foreground: '#1d1b20', background: '#fef7ff', requiredRatio: 4.5 },
    { label: 'accent text', foreground: '#ffffff', background: '#6750a4', requiredRatio: 4.5 },
    { label: 'danger text', foreground: '#ffffff', background: '#b3261e', requiredRatio: 4.5 }
  ],
  'light-mode': [
    { label: 'text on surface', foreground: '#111827', background: '#ffffff', requiredRatio: 4.5 },
    { label: 'muted text', foreground: '#374151', background: '#ffffff', requiredRatio: 4.5 },
    { label: 'primary button', foreground: '#ffffff', background: '#111827', requiredRatio: 4.5 }
  ],
  'dark-mode': [
    { label: 'text on surface', foreground: '#f9fafb', background: '#121212', requiredRatio: 4.5 },
    { label: 'primary button', foreground: '#111111', background: '#d1d5db', requiredRatio: 4.5 },
    { label: 'success button', foreground: '#04130d', background: '#34d399', requiredRatio: 4.5 }
  ],
  'high-contrast': [
    { label: 'text on surface', foreground: '#ffffff', background: '#000000', requiredRatio: 7 },
    { label: 'accent text', foreground: '#000000', background: '#ffff00', requiredRatio: 7 },
    { label: 'secondary button', foreground: '#000000', background: '#00e5ff', requiredRatio: 7 }
  ]
};

export function calculateContrastRatio(foreground: string, background: string) {
  const foregroundLuminance = getRelativeLuminance(hexToRgb(foreground));
  const backgroundLuminance = getRelativeLuminance(hexToRgb(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

export function auditThemeContrast(pairs: ContrastPair[]) {
  return pairs.map(pair => ({
    ...pair,
    ratio: calculateContrastRatio(pair.foreground, pair.background),
    passes: calculateContrastRatio(pair.foreground, pair.background) >= pair.requiredRatio
  }));
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  if (!/^[\da-f]{6}$/i.test(value)) throw new Error(`Invalid hex color: ${hex}`);
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16)
  ];
}

function getRelativeLuminance([red, green, blue]: [number, number, number]) {
  const [r, g, b] = [red, green, blue].map(channel => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
