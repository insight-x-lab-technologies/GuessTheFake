import type { GuessTheFakePhase } from '../game/types';

// Onda 15 "juice": pure helpers behind the timer, countdown and confetti
// effects. Timers, audio and canvas stay in hooks and components.

export const TIMER_WARNING_SECONDS = 10;
export const TIMER_CRITICAL_SECONDS = 3;

export type TimerUrgency = 'calm' | 'warning' | 'critical';

export function getTimerUrgency(seconds: number): TimerUrgency {
  if (seconds <= TIMER_CRITICAL_SECONDS) return 'critical';
  if (seconds <= TIMER_WARNING_SECONDS) return 'warning';
  return 'calm';
}

// Fraction of the round still left, for the progress bar.
export function getTimerProgress(seconds: number, totalSeconds: number) {
  if (!Number.isFinite(seconds) || !Number.isFinite(totalSeconds) || totalSeconds <= 0) return 0;
  return Math.min(1, Math.max(0, seconds / totalSeconds));
}

export type TimerSample = { phase: GuessTheFakePhase; roundIndex: number; seconds: number };

// Which tick a timer step deserves. Only a one-second step inside the same
// phase and round ticks, so phase switches, restores and resets stay silent;
// the first number of the 3-2-1 preparation (the timer being set) also ticks.
export function getTimerCue(previous: TimerSample, next: TimerSample): 'tick' | 'tick-strong' | null {
  if (next.seconds <= 0) return null;
  const samePeriod = previous.phase === next.phase && previous.roundIndex === next.roundIndex;
  const stepped = samePeriod && next.seconds === previous.seconds - 1;
  if (next.phase === 'preparing') {
    return stepped || !samePeriod || next.seconds > previous.seconds ? 'tick' : null;
  }
  if (next.phase !== 'playing' || !stepped) return null;
  const urgency = getTimerUrgency(next.seconds);
  if (urgency === 'critical') return 'tick-strong';
  return urgency === 'warning' ? 'tick' : null;
}

export type ConfettiParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
};

export const CONFETTI_GRAVITY = 900;

// A burst from the top center of a `width` x `height` canvas.
export function createConfettiParticles(
  count: number,
  width: number,
  height: number,
  colors: string[],
  random: () => number = Math.random
): ConfettiParticle[] {
  const palette = colors.length ? colors : ['#f59e0b'];
  return Array.from({ length: Math.max(0, Math.floor(count)) }, (_, index) => {
    const angle = -Math.PI / 2 + (random() - 0.5) * Math.PI * 0.9;
    const speed = 380 + random() * 520;
    return {
      x: width / 2 + (random() - 0.5) * width * 0.3,
      y: height * 0.35,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 5 + random() * 6,
      rotation: random() * Math.PI,
      spin: (random() - 0.5) * 12,
      color: palette[index % palette.length]
    };
  });
}

export function stepConfetti(particles: ConfettiParticle[], seconds: number, height: number) {
  return particles
    .map(particle => ({
      ...particle,
      x: particle.x + particle.vx * seconds,
      y: particle.y + particle.vy * seconds,
      vx: particle.vx * (1 - Math.min(1, seconds * 0.6)),
      vy: particle.vy + CONFETTI_GRAVITY * seconds,
      rotation: particle.rotation + particle.spin * seconds
    }))
    .filter(particle => particle.y < height + particle.size);
}
