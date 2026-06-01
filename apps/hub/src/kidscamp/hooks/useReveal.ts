// CampCraft - Scroll Reveal Animation Hook

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref: elementRef, isVisible };
}

// Hook for animated counters
export function useCountUp(
  end: number,
  duration: number = 2000,
  startOnVisible: boolean = true
) {
  const [count, setCount] = useState(0);
  const [shouldStart, setShouldStart] = useState(!startOnVisible);
  const frameRef = useRef<number | undefined>(undefined);

  const start = useCallback(() => {
    setShouldStart(true);
  }, []);

  useEffect(() => {
    if (!shouldStart) return;

    const startTime = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(end * eased);
      
      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, shouldStart]);

  return { count, start };
}
