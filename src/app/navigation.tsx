import { Boxes, Cog, Home, Medal, Play, Radio, Share2, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Screen } from './app-types';

export const SCREENS: Screen[] = ['home', 'play', 'leaderboard', 'achievements', 'packs', 'multiDevice', 'growth', 'settings'];

export const screenToneClass: Record<Screen, string> = {
  home: 'contextHome',
  play: 'contextPlay',
  leaderboard: 'contextLeaderboard',
  achievements: 'contextAchievements',
  packs: 'contextPacks',
  multiDevice: 'contextMultiDevice',
  growth: 'contextGrowth',
  settings: 'contextSettings'
};

export function getScreenLabelKey(screen: Screen) {
  return screen === 'play' ? 'app.newGame' : `app.${screen}`;
}

export function getScreenIcon(screen: Screen, size: number): ReactNode {
  switch (screen) {
    case 'home': return <Home size={size} />;
    case 'play': return <Play size={size} />;
    case 'leaderboard': return <Medal size={size} />;
    case 'achievements': return <Trophy size={size} />;
    case 'packs': return <Boxes size={size} />;
    case 'multiDevice': return <Radio size={size} />;
    case 'growth': return <Share2 size={size} />;
    case 'settings': return <Cog size={size} />;
  }
}
