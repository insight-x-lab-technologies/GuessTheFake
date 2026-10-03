import type { ReactNode } from 'react';
import type { ProfileAvatarId } from '../../core/profiles/profiles';

// W16-02: 24 flat avatars drawn on a 64x64 grid. The round background is
// the profile color (ProfileAvatar paints it); each avatar keeps its own
// fixed palette so it reads on every profile color.

const INK = '#2a1e3a';

function Eyes({ y = 34, gap = 6, r = 2.4 }: { y?: number; gap?: number; r?: number }) {
  return (
    <g fill={INK}>
      <circle cx={32 - gap} cy={y} r={r} />
      <circle cx={32 + gap} cy={y} r={r} />
    </g>
  );
}

function Smile({ y = 42, w = 4 }: { y?: number; w?: number }) {
  return <path d={`M${32 - w} ${y}q${w} ${w * 0.9} ${w * 2} 0`} fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />;
}

function Blush({ y = 40, gap = 11 }: { y?: number; gap?: number }) {
  return (
    <g fill="#ff8fab" opacity=".55">
      <circle cx={32 - gap} cy={y} r="2.6" />
      <circle cx={32 + gap} cy={y} r="2.6" />
    </g>
  );
}

export const AVATAR_ART: Record<ProfileAvatarId, ReactNode> = {
  fox: (
    <>
      <path d="M13 12l13 12-9 6zM51 12L38 24l9 6z" fill="#ea580c" />
      <path d="M16 15l7 7-5 3zM48 15l-7 7 5 3z" fill="#fed7aa" />
      <circle cx="32" cy="36" r="18" fill="#f97316" />
      <path d="M17 38q15 22 30 0-7 5-15 5t-15-5z" fill="#fff7ed" />
      <Eyes y={33} />
      <circle cx="32" cy="42" r="2.6" fill={INK} />
    </>
  ),
  panda: (
    <>
      <circle cx="17" cy="20" r="7" fill={INK} />
      <circle cx="47" cy="20" r="7" fill={INK} />
      <circle cx="32" cy="36" r="19" fill="#f8fafc" />
      <ellipse cx="25" cy="35" rx="5" ry="6.5" fill={INK} transform="rotate(20 25 35)" />
      <ellipse cx="39" cy="35" rx="5" ry="6.5" fill={INK} transform="rotate(-20 39 35)" />
      <circle cx="25.5" cy="34" r="1.6" fill="#fff" />
      <circle cx="38.5" cy="34" r="1.6" fill="#fff" />
      <ellipse cx="32" cy="42" rx="3" ry="2" fill={INK} />
      <Smile y={45} w={3} />
    </>
  ),
  owl: (
    <>
      <path d="M14 18l9 8-7 4zM50 18l-9 8 7 4z" fill="#78350f" />
      <ellipse cx="32" cy="37" rx="19" ry="19" fill="#a16207" />
      <ellipse cx="32" cy="46" rx="11" ry="9" fill="#fde68a" />
      <circle cx="25" cy="33" r="7" fill="#fff" />
      <circle cx="39" cy="33" r="7" fill="#fff" />
      <circle cx="25" cy="33" r="3.4" fill={INK} />
      <circle cx="39" cy="33" r="3.4" fill={INK} />
      <path d="M29 39h6l-3 5z" fill="#f59e0b" />
    </>
  ),
  octopus: (
    <>
      <path d="M17 44c-2 6-6 8-8 8M25 46c0 6-2 9-5 11M39 46c0 6 2 9 5 11M47 44c2 6 6 8 8 8" fill="none" stroke="#9333ea" strokeWidth="5" strokeLinecap="round" />
      <path d="M13 36a19 19 0 0 1 38 0v6c0 4-4 6-8 6H21c-4 0-8-2-8-6z" fill="#a855f7" />
      <circle cx="22" cy="24" r="2.5" fill="#d8b4fe" />
      <circle cx="42" cy="22" r="1.8" fill="#d8b4fe" />
      <Eyes y={35} />
      <Smile y={41} />
    </>
  ),
  lion: (
    <>
      <circle cx="32" cy="34" r="25" fill="#b45309" />
      <circle cx="32" cy="35" r="16" fill="#fbbf24" />
      <Eyes y={32} gap={5.5} />
      <path d="M29 38h6l-3 3z" fill={INK} />
      <path d="M32 41v2M28 44q4 3 8 0" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  turtle: (
    <>
      <path d="M8 58a24 16 0 0 1 48 0z" fill="#15803d" />
      <path d="M20 58l4-9h16l4 9M24 49l8-5 8 5" fill="none" stroke="#86efac" strokeWidth="2" />
      <circle cx="32" cy="30" r="15" fill="#4ade80" />
      <Eyes y={29} gap={5} />
      <Smile y={35} />
      <Blush y={34} gap={9} />
    </>
  ),
  penguin: (
    <>
      <circle cx="32" cy="35" r="20" fill={INK} />
      <path d="M19 38c0-11 6-14 13-11 7-3 13 0 13 11 0 9-6 14-13 14s-13-5-13-14z" fill="#f8fafc" />
      <Eyes y={35} gap={5} />
      <path d="M28 40h8l-4 4z" fill="#f59e0b" />
      <Blush y={41} gap={9} />
    </>
  ),
  unicorn: (
    <>
      <path d="M32 4l-4 16h8z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
      <path d="M17 18l6 8-7 2zM47 18l-6 8 7 2z" fill="#fbcfe8" />
      <circle cx="32" cy="37" r="18" fill="#fdf2f8" />
      <path d="M46 26c6 6 8 14 4 22-2-8-6-14-12-18zM40 21c6 0 10 4 11 9-4-3-8-4-12-4z" fill="#c084fc" />
      <path d="M44 24c4 4 6 9 4 14" fill="none" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
      <Eyes y={36} gap={6} />
      <Smile y={43} />
      <Blush y={42} gap={11} />
    </>
  ),
  bee: (
    <>
      <ellipse cx="17" cy="22" rx="8" ry="6" fill="#e0f2fe" opacity=".9" transform="rotate(-30 17 22)" />
      <ellipse cx="47" cy="22" rx="8" ry="6" fill="#e0f2fe" opacity=".9" transform="rotate(30 47 22)" />
      <path d="M25 18c-2-5-5-8-8-8M39 18c2-5 5-8 8-8" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <circle cx="17" cy="10" r="2.5" fill={INK} />
      <circle cx="47" cy="10" r="2.5" fill={INK} />
      <circle cx="32" cy="36" r="18" fill="#facc15" />
      <rect x="16" y="45" width="32" height="4.5" rx="2.2" fill={INK} />
      <Eyes y={33} />
      <Smile y={39} />
    </>
  ),
  whale: (
    <>
      <path d="M30 14v-6M30 14c-3-4-7-5-9-4M30 14c3-4 7-5 9-4" fill="none" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 34l8-9-1 11 6 3H50z" fill="#2563eb" />
      <path d="M7 38c0-14 10-20 23-20 13 0 22 8 22 20 0 9-9 14-22 14S7 47 7 38z" fill="#3b82f6" />
      <path d="M11 42c6 6 30 6 38 0-3 6-10 9-19 9s-16-3-19-9z" fill="#bfdbfe" />
      <circle cx="21" cy="34" r="2.4" fill={INK} />
      <path d="M25 40q4 3 8 0" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  cactus: (
    <>
      <path d="M18 30v-6a4 4 0 0 1 8 0v8M46 26v-4a4 4 0 0 0-8 0v10" fill="none" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
      <rect x="22" y="12" width="20" height="38" rx="10" fill="#22c55e" />
      <path d="M27 18v4M37 22v4M31 44v3" stroke="#bbf7d0" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="32" cy="12" r="4" fill="#f472b6" />
      <path d="M18 48h28l-3 10H21z" fill="#c2410c" />
      <Eyes y={30} gap={4.5} r={2} />
      <Smile y={35} w={3} />
    </>
  ),
  rocket: (
    <>
      <path d="M26 48l6 12 6-12z" fill="#f97316" />
      <path d="M29 48l3 7 3-7z" fill="#fde047" />
      <path d="M22 38l-8 10h10zM42 38l8 10H40z" fill="#ef4444" />
      <path d="M32 6c9 8 12 20 11 32l-1 10H22l-1-10C20 26 23 14 32 6z" fill="#e2e8f0" />
      <path d="M32 6c4 3 7 8 9 12H23c2-4 5-9 9-12z" fill="#ef4444" />
      <circle cx="32" cy="30" r="6" fill="#38bdf8" stroke="#475569" strokeWidth="2.4" />
      <circle cx="30" cy="28" r="1.6" fill="#fff" />
    </>
  ),
  cat: (
    <>
      <path d="M14 14l12 10-11 6zM50 14L38 24l11 6z" fill="#94a3b8" />
      <path d="M17 18l6 5-5 3zM47 18l-6 5 5 3z" fill="#fbcfe8" />
      <circle cx="32" cy="36" r="18" fill="#94a3b8" />
      <path d="M32 18v6M27 19l1 5M37 19l-1 5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <Eyes y={34} />
      <path d="M30 39h4l-2 2z" fill="#f472b6" />
      <path d="M32 41q-2 3-4 2M32 41q2 3 4 2M12 37l9 1M12 42l9-1M52 37l-9 1M52 42l-9-1" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  dog: (
    <>
      <circle cx="32" cy="35" r="18" fill="#d6a36b" />
      <ellipse cx="15" cy="32" rx="6" ry="12" fill="#7c4a1e" transform="rotate(18 15 32)" />
      <ellipse cx="49" cy="32" rx="6" ry="12" fill="#7c4a1e" transform="rotate(-18 49 32)" />
      <ellipse cx="32" cy="43" rx="9" ry="7" fill="#f5deb3" />
      <Eyes y={32} />
      <ellipse cx="32" cy="40" rx="3.2" ry="2.4" fill={INK} />
      <path d="M30 46c0 4 4 4 4 0z" fill="#f43f5e" />
    </>
  ),
  frog: (
    <>
      <circle cx="21" cy="22" r="8" fill="#84cc16" />
      <circle cx="43" cy="22" r="8" fill="#84cc16" />
      <ellipse cx="32" cy="40" rx="22" ry="15" fill="#84cc16" />
      <circle cx="21" cy="22" r="4.5" fill="#fff" />
      <circle cx="43" cy="22" r="4.5" fill="#fff" />
      <circle cx="21" cy="23" r="2.4" fill={INK} />
      <circle cx="43" cy="23" r="2.4" fill={INK} />
      <path d="M20 41q12 9 24 0" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <Blush y={40} gap={15} />
    </>
  ),
  bear: (
    <>
      <circle cx="16" cy="20" r="7" fill="#92400e" />
      <circle cx="48" cy="20" r="7" fill="#92400e" />
      <circle cx="16" cy="20" r="3.5" fill="#fcd34d" />
      <circle cx="48" cy="20" r="3.5" fill="#fcd34d" />
      <circle cx="32" cy="36" r="19" fill="#b45309" />
      <ellipse cx="32" cy="43" rx="9" ry="7" fill="#fde68a" />
      <Eyes y={33} />
      <ellipse cx="32" cy="40" rx="3.2" ry="2.4" fill={INK} />
      <Smile y={44} w={3} />
    </>
  ),
  rabbit: (
    <>
      <ellipse cx="24" cy="15" rx="5" ry="13" fill="#f1f5f9" />
      <ellipse cx="40" cy="15" rx="5" ry="13" fill="#f1f5f9" />
      <ellipse cx="24" cy="15" rx="2.4" ry="9" fill="#fbcfe8" />
      <ellipse cx="40" cy="15" rx="2.4" ry="9" fill="#fbcfe8" />
      <circle cx="32" cy="39" r="17" fill="#f1f5f9" />
      <Eyes y={36} />
      <path d="M30 41h4l-2 2z" fill="#f472b6" />
      <rect x="30" y="44" width="4" height="4" rx="1" fill="#fff" stroke={INK} strokeWidth="1.2" />
      <Blush y={43} gap={10} />
    </>
  ),
  koala: (
    <>
      <circle cx="14" cy="26" r="10" fill="#9ca3af" />
      <circle cx="50" cy="26" r="10" fill="#9ca3af" />
      <circle cx="14" cy="26" r="5" fill="#fbcfe8" />
      <circle cx="50" cy="26" r="5" fill="#fbcfe8" />
      <circle cx="32" cy="37" r="18" fill="#9ca3af" />
      <Eyes y={33} gap={7} />
      <ellipse cx="32" cy="41" rx="4.5" ry="6" fill={INK} />
      <Smile y={49} w={3} />
    </>
  ),
  monkey: (
    <>
      <circle cx="13" cy="34" r="7" fill="#92400e" />
      <circle cx="51" cy="34" r="7" fill="#92400e" />
      <circle cx="13" cy="34" r="3.5" fill="#fcd9b6" />
      <circle cx="51" cy="34" r="3.5" fill="#fcd9b6" />
      <circle cx="32" cy="34" r="19" fill="#92400e" />
      <path d="M32 26c4-4 12-3 12 4 0 3-1 5-2 6 2 2 3 4 3 7 0 6-6 9-13 9s-13-3-13-9c0-3 1-5 3-7-1-1-2-3-2-6 0-7 8-8 12-4z" fill="#fcd9b6" />
      <Eyes y={33} gap={5} />
      <path d="M30 40h.1M34 40h.1" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <Smile y={44} />
    </>
  ),
  pig: (
    <>
      <path d="M15 16l10 6-9 7zM49 16l-10 6 9 7z" fill="#f472b6" />
      <circle cx="32" cy="36" r="19" fill="#f9a8d4" />
      <ellipse cx="32" cy="42" rx="8" ry="6" fill="#f472b6" />
      <ellipse cx="29" cy="42" rx="1.6" ry="2.4" fill={INK} />
      <ellipse cx="35" cy="42" rx="1.6" ry="2.4" fill={INK} />
      <Eyes y={32} />
    </>
  ),
  chick: (
    <>
      <path d="M30 14c-1-4 1-7 3-8M33 14c2-4 5-5 7-4" fill="none" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="36" r="20" fill="#fde047" />
      <path d="M12 40c4 2 8 2 10-2M52 40c-4 2-8 2-10-2" fill="none" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
      <Eyes y={33} />
      <path d="M28 38h8l-4 5z" fill="#f97316" />
      <Blush y={40} gap={12} />
    </>
  ),
  robot: (
    <>
      <path d="M32 14V8" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="7" r="3.5" fill="#f43f5e" />
      <rect x="10" y="28" width="5" height="12" rx="2" fill="#64748b" />
      <rect x="49" y="28" width="5" height="12" rx="2" fill="#64748b" />
      <rect x="14" y="14" width="36" height="38" rx="9" fill="#cbd5e1" />
      <rect x="19" y="22" width="26" height="14" rx="5" fill="#1e293b" />
      <circle cx="26" cy="29" r="3" fill="#22d3ee" />
      <circle cx="38" cy="29" r="3" fill="#22d3ee" />
      <path d="M23 44h18M27 41v6M32 41v6M37 41v6" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  alien: (
    <>
      <path d="M24 16l-5-8M40 16l5-8" stroke="#65a30d" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="19" cy="7" r="3" fill="#a3e635" />
      <circle cx="45" cy="7" r="3" fill="#a3e635" />
      <path d="M32 14c12 0 19 8 19 18 0 12-10 22-19 22S13 44 13 32c0-10 7-18 19-18z" fill="#a3e635" />
      <ellipse cx="24" cy="33" rx="5" ry="7.5" fill={INK} transform="rotate(-25 24 33)" />
      <ellipse cx="40" cy="33" rx="5" ry="7.5" fill={INK} transform="rotate(25 40 33)" />
      <circle cx="23" cy="30" r="1.6" fill="#fff" />
      <circle cx="39" cy="30" r="1.6" fill="#fff" />
      <Smile y={45} w={3} />
    </>
  ),
  ghost: (
    <>
      <path d="M15 54V32a17 17 0 0 1 34 0v22l-5.5-4-5.5 4-5.5-4-5.5 4-5.5-4z" fill="#f8fafc" />
      <ellipse cx="26" cy="32" rx="3" ry="4.4" fill={INK} />
      <ellipse cx="38" cy="32" rx="3" ry="4.4" fill={INK} />
      <ellipse cx="32" cy="41" rx="3" ry="3.6" fill={INK} />
      <Blush y={38} gap={12} />
    </>
  )
};

export function AvatarArt({ avatar }: { avatar: ProfileAvatarId }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      {AVATAR_ART[avatar]}
    </svg>
  );
}
