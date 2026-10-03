import { describe, expect, it } from 'vitest';
import {
  createConfettiParticles,
  getTimerCue,
  getTimerProgress,
  getTimerUrgency,
  stepConfetti
} from './fx';

describe('timer urgency', () => {
  it('turns warning at 10 seconds and critical at 3', () => {
    expect(getTimerUrgency(60)).toBe('calm');
    expect(getTimerUrgency(11)).toBe('calm');
    expect(getTimerUrgency(10)).toBe('warning');
    expect(getTimerUrgency(4)).toBe('warning');
    expect(getTimerUrgency(3)).toBe('critical');
    expect(getTimerUrgency(0)).toBe('critical');
  });

  it('bounds the progress fraction', () => {
    expect(getTimerProgress(30, 60)).toBe(0.5);
    expect(getTimerProgress(90, 60)).toBe(1);
    expect(getTimerProgress(-1, 60)).toBe(0);
    expect(getTimerProgress(10, 0)).toBe(0);
    expect(getTimerProgress(Number.NaN, 60)).toBe(0);
  });
});

describe('timer cues', () => {
  const playing = (seconds: number, roundIndex = 0) => ({ phase: 'playing' as const, roundIndex, seconds });
  const preparing = (seconds: number, roundIndex = 0) => ({ phase: 'preparing' as const, roundIndex, seconds });

  it('stays silent while there is time to spare', () => {
    expect(getTimerCue(playing(30), playing(29))).toBeNull();
    expect(getTimerCue(playing(12), playing(11))).toBeNull();
  });

  it('ticks through the last ten seconds and hits harder on the last three', () => {
    expect(getTimerCue(playing(11), playing(10))).toBe('tick');
    expect(getTimerCue(playing(5), playing(4))).toBe('tick');
    expect(getTimerCue(playing(4), playing(3))).toBe('tick-strong');
    expect(getTimerCue(playing(2), playing(1))).toBe('tick-strong');
    expect(getTimerCue(playing(1), playing(0))).toBeNull();
  });

  it('ignores phase switches, new rounds and timer resets', () => {
    // preparing 1 -> playing keeps the old value for one render.
    expect(getTimerCue(preparing(1), playing(1))).toBeNull();
    expect(getTimerCue(playing(5, 0), playing(4, 1))).toBeNull();
    expect(getTimerCue(playing(1), playing(60))).toBeNull();
    expect(getTimerCue(playing(5), playing(5))).toBeNull();
  });

  it('counts the 3-2-1 preparation out loud', () => {
    expect(getTimerCue({ phase: 'intro', roundIndex: 0, seconds: 0 }, preparing(3))).toBe('tick');
    expect(getTimerCue(preparing(3), preparing(2))).toBe('tick');
    expect(getTimerCue(preparing(2), preparing(1))).toBe('tick');
    // The phase switches first with the old value; the timer is set next.
    expect(getTimerCue(preparing(0), preparing(3))).toBe('tick');
    expect(getTimerCue(preparing(2), preparing(2))).toBeNull();
  });
});

describe('confetti', () => {
  it('creates the requested burst with the palette', () => {
    const particles = createConfettiParticles(6, 400, 800, ['red', 'blue'], () => 0.5);
    expect(particles).toHaveLength(6);
    expect(particles.map(particle => particle.color)).toEqual(['red', 'blue', 'red', 'blue', 'red', 'blue']);
    expect(particles[0].vy).toBeLessThan(0);
    expect(createConfettiParticles(-2, 400, 800, [])).toEqual([]);
  });

  it('falls with gravity and drops particles that left the canvas', () => {
    const [particle] = createConfettiParticles(1, 400, 800, [], () => 0.5);
    const [later] = stepConfetti([particle], 0.1, 800);
    expect(later.vy).toBeGreaterThan(particle.vy);
    expect(stepConfetti([{ ...particle, y: 900, vy: 10 }], 0.1, 800)).toEqual([]);
  });
});
