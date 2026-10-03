import type { MascotMood } from '../mascot';
import styles from '../App.module.css';

// W16-01: the face of the app icon as a mascot with five expressions.
// Colors come from tokens (--mascot-*), so every theme can retint it.
// Decorative: the text next to it always carries the meaning.
export function Mascot({ mood, size = 'md' }: { mood: MascotMood; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <svg
      className={styles.mascot}
      data-mood={mood}
      data-size={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
    >
      {mood === 'celebrating' ? <Confetti /> : null}
      <g className={styles.mascotBody}>
        {mood === 'celebrating' ? <RaisedArms /> : <RestingArms />}
        <path
          d="M30 50c0-17 14-30 30-30h2c17 0 30 13 30 30v20c0 20-15 36-31 36S30 90 30 70z"
          fill="var(--mascot-face, #ffd166)"
          stroke="var(--mascot-ink, #1f123d)"
          strokeWidth="5"
        />
        <path
          d="M34 56c8-14 20-20 34-17 9 2 16 8 20 17V48c0-15-12-26-27-26h-1c-15 0-27 11-27 26z"
          fill="var(--mascot-ink, #1f123d)"
        />
        <circle cx="42" cy="78" r="5" fill="var(--mascot-cheek, #ff8fab)" opacity=".7" />
        <circle cx="80" cy="78" r="5" fill="var(--mascot-cheek, #ff8fab)" opacity=".7" />
        <Face mood={mood} />
        {mood === 'celebrating' ? <PartyHat /> : null}
      </g>
      {mood === 'thinking' ? <ThoughtBubbles /> : null}
      {mood === 'shocked' ? <path d="M96 40c4 6 6 10 6 13a6 6 0 0 1-12 0c0-3 2-7 6-13z" fill="var(--mascot-drop, #7dd3fc)" /> : null}
    </svg>
  );
}

const INK = 'var(--mascot-ink, #1f123d)';

function Face({ mood }: { mood: MascotMood }) {
  if (mood === 'thinking') {
    return (
      <g>
        <circle cx="49" cy="66" r="5" fill={INK} />
        <circle cx="73" cy="66" r="5" fill={INK} />
        <circle cx="51" cy="64" r="1.6" fill="#fff" />
        <circle cx="75" cy="64" r="1.6" fill="#fff" />
        <path d="M44 56l10-2M68 54l10 2" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M54 88c4 1 9 1 14-2" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </g>
    );
  }
  if (mood === 'suspicious') {
    return (
      <g>
        <path d="M43 67h12M67 66c3-3 9-3 12 0" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M42 58l14 3M66 55l14-5" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M52 88c6-3 13-3 19 1" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </g>
    );
  }
  if (mood === 'laughing') {
    return (
      <g>
        <path d="M43 68c3-6 9-6 12 0M67 68c3-6 9-6 12 0" stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M47 80c8 14 20 14 28 0z" fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M54 88c4-3 10-3 14 0" fill="var(--mascot-cheek, #ff8fab)" />
      </g>
    );
  }
  if (mood === 'shocked') {
    return (
      <g>
        <circle cx="49" cy="65" r="7" fill="#fff" stroke={INK} strokeWidth="3" />
        <circle cx="73" cy="65" r="7" fill="#fff" stroke={INK} strokeWidth="3" />
        <circle cx="49" cy="66" r="3" fill={INK} />
        <circle cx="73" cy="66" r="3" fill={INK} />
        <path d="M42 53c4-3 9-4 13-3M67 50c4-1 9 0 13 3" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <ellipse cx="61" cy="88" rx="6" ry="8" fill={INK} />
      </g>
    );
  }
  return (
    <g>
      <path d="M43 67c3-6 9-6 12 0M67 67c3-6 9-6 12 0" stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M45 80c9 16 23 16 32 0z" fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M53 89c5-3 11-3 16 0" fill="var(--mascot-cheek, #ff8fab)" />
    </g>
  );
}

function RestingArms() {
  return (
    <path
      d="M30 82c-9 5-14 12-16 21M92 82c9 5 14 12 16 21"
      fill="none"
      stroke="var(--mascot-arm, #ffffff)"
      strokeWidth="8"
      strokeLinecap="round"
    />
  );
}

function RaisedArms() {
  return (
    <path
      d="M31 74c-10-4-16-14-17-26M91 74c10-4 16-14 17-26"
      fill="none"
      stroke="var(--mascot-arm, #ffffff)"
      strokeWidth="8"
      strokeLinecap="round"
    />
  );
}

function PartyHat() {
  return (
    <g>
      <path d="M48 26l14-24 12 24z" fill="var(--mascot-accent, #ec4899)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M53 18l14 2M50 23l20 2" stroke="var(--mascot-face, #ffd166)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="62" cy="3" r="4" fill="var(--mascot-face, #ffd166)" stroke={INK} strokeWidth="2" />
    </g>
  );
}

function ThoughtBubbles() {
  return (
    <g fill="var(--mascot-arm, #ffffff)" stroke={INK} strokeWidth="2.5">
      <circle cx="93" cy="36" r="2.5" />
      <circle cx="99" cy="27" r="4" />
      <circle cx="107" cy="13" r="9" />
      <text x="107" y="17.5" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} stroke="none">?</text>
    </g>
  );
}

function Confetti() {
  return (
    <g className={styles.mascotConfetti}>
      <rect x="10" y="20" width="6" height="10" rx="2" fill="var(--accent1, #ff6b6b)" transform="rotate(-20 13 25)" />
      <rect x="102" y="58" width="6" height="10" rx="2" fill="var(--accent4, #4d96ff)" transform="rotate(25 105 63)" />
      <circle cx="18" cy="60" r="3.5" fill="var(--accent2, #ffd93d)" />
      <circle cx="104" cy="30" r="3" fill="var(--accent3, #6bcb77)" />
      <path d="M90 10l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="var(--accent2, #ffd93d)" />
    </g>
  );
}
