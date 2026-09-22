import type { LocalizedText } from '../game/types';

export type Screen = 'home' | 'play' | 'leaderboard' | 'achievements' | 'packs' | 'multiDevice' | 'growth' | 'settings';

export type Translate = (key: string, params?: Record<string, string | number>) => string;

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
};

// Resolves a localized content value (category, statement, explanation) to a
// string in the active language.
export type LocalizeText = (value: LocalizedText | undefined, fallback?: string) => string;
