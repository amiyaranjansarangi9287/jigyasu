// src/hooks/useIdleTimer.ts
// Detects user inactivity and triggers callbacks

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseIdleTimerOptions {
  timeoutMs: number;
  warningMs: number;
  onIdle: () => void;
  onWarning?: () => void;
  onActive?: () => void;
  enabled?: boolean;
}

const IDLE_EVENTS = [
  'mousedown',
  'keydown',
  'touchstart',
  'mousemove',
  'scroll',
  'keypress',
];

export function useIdleTimer({
  timeoutMs,
  warningMs,
  onIdle,
  onWarning,
  onActive,
  enabled = true,
}: UseIdleTimerOptions) {
  const [isIdle, setIsIdle] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(timeoutMs);

  const lastActivityRef = useRef<number | null>(null);
  const warningFiredRef = useRef(false);
  const idleFiredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onIdleRef = useRef(onIdle);
  const onWarningRef = useRef(onWarning);
  const onActiveRef = useRef(onActive);

  useEffect(() => {
    onIdleRef.current = onIdle;
    onWarningRef.current = onWarning;
    onActiveRef.current = onActive;
  }, [onIdle, onWarning, onActive]);

  const reset = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningFiredRef.current = false;
    idleFiredRef.current = false;
    setIsIdle(false);
    setIsWarning(false);
    onActiveRef.current?.();
  }, []);

  const checkIdle = useCallback(() => {
    if (!enabled) return;

    if (lastActivityRef.current === null) {
      lastActivityRef.current = Date.now();
    }

    const elapsed = Date.now() - lastActivityRef.current;
    const remaining = timeoutMs - elapsed;

    setRemainingMs(Math.max(0, remaining));

    if (remaining <= 0 && !idleFiredRef.current) {
      idleFiredRef.current = true;
      setIsIdle(true);
      setIsWarning(false);
      onIdleRef.current();
    } else if (remaining <= warningMs && !warningFiredRef.current) {
      warningFiredRef.current = true;
      setIsWarning(true);
      onWarningRef.current?.();
    } else if (remaining > warningMs) {
      warningFiredRef.current = false;
      setIsWarning(false);
    }
  }, [enabled, timeoutMs, warningMs]);

  useEffect(() => {
    if (!enabled) return;

    lastActivityRef.current = Date.now();

    timerRef.current = setInterval(checkIdle, 1000);

    const handleActivity = () => {
      reset();
    };

    for (const event of IDLE_EVENTS) {
      window.addEventListener(event, handleActivity, { passive: true });
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      for (const event of IDLE_EVENTS) {
        window.removeEventListener(event, handleActivity);
      }
    };
  }, [enabled, reset, checkIdle]);

  return { isIdle, isWarning, remainingMs, reset };
}
