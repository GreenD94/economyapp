'use client';
import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration = 750, startDelay = 0): number {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(null!);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    clearTimeout(timer.current);
    if (target === 0) { setValue(0); return; }

    timer.current = setTimeout(() => {
      const start = performance.now();
      function tick(now: number) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(target * eased);
        if (p < 1) raf.current = requestAnimationFrame(tick);
        else setValue(target);
      }
      raf.current = requestAnimationFrame(tick);
    }, startDelay);

    return () => { clearTimeout(timer.current); cancelAnimationFrame(raf.current); };
  }, [target, duration, startDelay]);

  return value;
}
