import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../browser';
import { createConfettiParticles, stepConfetti } from '../fx';
import styles from '../App.module.css';

const CONFETTI_COUNT = 90;
const CONFETTI_MAX_MS = 2200;

// W15-03: a light burst on a correct guess. Own canvas, no library; nothing
// is drawn under reduced motion or without a 2D context.
export function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion() || typeof window.matchMedia !== 'function') return undefined;
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);

    const computed = getComputedStyle(document.documentElement);
    const colors = ['--accent', '--correct', '--timer-color-safe', '--wrong', '--timer-color-warning']
      .map(name => computed.getPropertyValue(name).trim())
      .filter(Boolean);
    let particles = createConfettiParticles(CONFETTI_COUNT, width, height, colors.length ? colors : ['#f59e0b', '#22c55e', '#38bdf8', '#f472b6']);
    const startedAt = performance.now();
    let last = startedAt;
    let frame = 0;

    const draw = (now: number) => {
      const seconds = Math.min(0.05, (now - last) / 1000);
      last = now;
      particles = stepConfetti(particles, seconds, height);
      context.clearRect(0, 0, width, height);
      particles.forEach(particle => {
        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillStyle = particle.color;
        context.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
        context.restore();
      });
      if (particles.length && now - startedAt < CONFETTI_MAX_MS) frame = window.requestAnimationFrame(draw);
      else context.clearRect(0, 0, width, height);
    };
    frame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} className={styles.confettiCanvas} aria-hidden="true" />;
}
