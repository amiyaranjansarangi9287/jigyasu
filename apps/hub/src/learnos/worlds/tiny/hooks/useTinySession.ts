// src/worlds/tiny/hooks/useTinySession.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLearnerStore } from '@/store';
import { SessionService, LearningService } from '@/services';
import { AGE_GROUPS } from '@/constants/ageGroups';
import type { TinyModule } from '../types/tiny.types';

export function useTinySession() {
  const { language } = useLearnerStore();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  const MAX_SECONDS = AGE_GROUPS.tiny.maxSessionMinutes * 60;

  // Start session on mount (once)
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const begin = async () => {
      try {
        const session = await SessionService.startSession('tiny', language);
        setSessionId(session.id);
        setSessionStarted(true);

        await LearningService.trackEvent(
          session.id,
          'tiny',
          language,
          'world_entered',
          'tiny-world',
          {}
        );
      } catch (e) {
        console.warn('[TinyWorld] Session start failed:', e);
        setSessionStarted(true);
      }
    };

    begin();
  }, [language]);

  // Session timer
  useEffect(() => {
    if (!sessionStarted) return;

    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= MAX_SECONDS) {
          setShowBreak(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionStarted, MAX_SECONDS]);

  const trackModuleOpen = useCallback(async (module: TinyModule) => {
    if (!sessionId) return;
    try {
      await LearningService.trackEvent(
        sessionId,
        'tiny',
        language,
        'module_opened',
        module,
        { elapsedSeconds }
      );
    } catch (e) {
      console.warn('[TinyWorld] Track module open failed:', e);
    }
  }, [sessionId, language, elapsedSeconds]);

  const trackModuleClose = useCallback(async (module: TinyModule) => {
    if (!sessionId) return;
    try {
      await LearningService.trackEvent(
        sessionId,
        'tiny',
        language,
        'module_closed',
        module,
        { elapsedSeconds }
      );
    } catch (e) {
      console.warn('[TinyWorld] Track module close failed:', e);
    }
  }, [sessionId, language, elapsedSeconds]);

  const trackInteraction = useCallback(async (
    module: TinyModule,
    payload: Record<string, unknown>
  ) => {
    if (!sessionId) return;
    try {
      await LearningService.trackEvent(
        sessionId,
        'tiny',
        language,
        'canvas_interaction',
        module,
        payload
      );
    } catch (e) {
      console.warn('[TinyWorld] Track interaction failed:', e);
    }
  }, [sessionId, language]);

  const dismissBreak = useCallback(() => {
    setShowBreak(false);
    setElapsedSeconds(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= MAX_SECONDS) {
          setShowBreak(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return next;
      });
    }, 1000);
  }, [MAX_SECONDS]);

  const companionMood =
    elapsedSeconds >= 450 ? 'sleepy' as const :
    elapsedSeconds >= 420 ? 'sleepy' as const :
    'normal' as const;

  return {
    sessionStarted,
    elapsedSeconds,
    showBreak,
    companionMood,
    trackModuleOpen,
    trackModuleClose,
    trackInteraction,
    dismissBreak,
    sessionId,
  };
}
