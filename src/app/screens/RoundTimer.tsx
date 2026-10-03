import { Clock } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { Translate } from '../app-types';
import { getTimerProgress, getTimerUrgency } from '../fx';
import styles from '../App.module.css';

// W15-02: progress bar instead of plain text. The last 10 seconds change
// color and pulse; the last 3 pulse harder (CSS, off under reduced motion).
export function RoundTimer({ t, seconds, totalSeconds }: { t: Translate; seconds: number; totalSeconds: number }) {
  const urgency = getTimerUrgency(seconds);
  const progress = getTimerProgress(seconds, totalSeconds);
  return (
    <div
      className={styles.roundTimer}
      data-urgency={urgency}
      role="timer"
      aria-label={t('game.timeLeft', { seconds })}
      style={{ '--timer-progress': progress } as CSSProperties}
    >
      <Clock size={16} aria-hidden="true" />
      <strong aria-hidden="true">{seconds}</strong>
      <span className={styles.roundTimerTrack} aria-hidden="true">
        <span />
      </span>
    </div>
  );
}
