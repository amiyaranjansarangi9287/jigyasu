// src/hooks/useReducedMotion.ts
// Respects prefers-reduced-motion for accessibility

import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return reduced;
}

export function useMotionProps(reduced: boolean) {
  return reduced
    ? { initial: false, animate: false, exit: false, transition: { duration: 0 } }
    : {};
}
