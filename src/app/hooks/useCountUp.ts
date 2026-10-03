import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../browser';

// W15-03: animates a number from 0 to `target`. Shows the target at once
// under reduced motion or where requestAnimationFrame is missing.
export function useCountUp(target: number, durationMs = 650) {
  const animate = typeof window !== 'undefined'
    && typeof window.requestAnimationFrame === 'function'
    && typeof window.matchMedia === 'function'
    && !prefersReducedMotion()
    && target !== 0;
  const [value, setValue] = useState(animate ? 0 : target);

  useEffect(() => {
    if (!animate) {
      setValue(target);
      return undefined;
    }
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [animate, durationMs, target]);

  return value;
}
