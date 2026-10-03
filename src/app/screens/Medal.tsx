import { useId } from 'react';
import type { AchievementRarity } from '../../core/achievements/achievements';
import styles from '../App.module.css';

// W16-06: illustrated medal per rarity. Locked medals render in grey; a
// fresh unlock plays a short pop and shine (off in reduced motion).
const MEDAL_COLORS: Record<AchievementRarity, { light: string; base: string; dark: string; ribbon: string; ribbon2: string }> = {
  bronze: { light: '#f3c79b', base: '#c47a3a', dark: '#8a4b1d', ribbon: '#2563eb', ribbon2: '#1d4ed8' },
  silver: { light: '#f8fafc', base: '#b8c2cf', dark: '#6b7684', ribbon: '#7c3aed', ribbon2: '#5b21b6' },
  gold: { light: '#fff3b0', base: '#f5c542', dark: '#a87b06', ribbon: '#dc2626', ribbon2: '#991b1b' },
  legendary: { light: '#fde7ff', base: '#c084fc', dark: '#6d28d9', ribbon: '#0ea5e9', ribbon2: '#f472b6' }
};

export function Medal({
  rarity = 'bronze',
  locked = false,
  unlocking = false,
  size = 'md'
}: {
  rarity?: AchievementRarity;
  locked?: boolean;
  unlocking?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const id = useId().replace(/:/g, '');
  const colors = MEDAL_COLORS[rarity];
  return (
    <svg
      className={styles.medal}
      data-rarity={rarity}
      data-locked={locked ? 'true' : undefined}
      data-unlocking={unlocking ? 'true' : undefined}
      data-size={size}
      viewBox="0 0 48 60"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-disc`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor={colors.light} />
          <stop offset=".55" stopColor={colors.base} />
          <stop offset="1" stopColor={colors.dark} />
        </radialGradient>
      </defs>
      <path d="M10 2h11l7 22H17z" fill={colors.ribbon} />
      <path d="M38 2H27l-7 22h11z" fill={colors.ribbon2} />
      {rarity === 'legendary' ? (
        <g fill={colors.light} opacity=".9">
          <path d="M24 18l2 6h-4zM24 58l-2-6h4zM4 38l6-2v4zM44 38l-6 2v-4zM9 23l5 3-3 3zM39 53l-5-3 3-3zM39 23l-3 6-3-3zM9 53l3-6 3 3z" />
        </g>
      ) : null}
      <circle cx="24" cy="38" r="15" fill={`url(#${id}-disc)`} stroke={colors.dark} strokeWidth="2" />
      <circle cx="24" cy="38" r="10.5" fill="none" stroke={colors.light} strokeWidth="1.4" opacity=".75" />
      {rarity === 'legendary' ? (
        <path d="M24 29l7 9-7 9-7-9z" fill={colors.light} stroke={colors.dark} strokeWidth="1.4" strokeLinejoin="round" />
      ) : (
        <path
          d="M24 30.5l2.3 4.7 5.2.8-3.8 3.6.9 5.2-4.6-2.4-4.6 2.4.9-5.2-3.8-3.6 5.2-.8z"
          fill={colors.light}
          stroke={colors.dark}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      )}
      {rarity === 'gold' || rarity === 'legendary' ? <path className={styles.medalShine} d="M14 30l6-4 2 2-6 4z" fill="#fff" opacity=".7" /> : null}
    </svg>
  );
}
