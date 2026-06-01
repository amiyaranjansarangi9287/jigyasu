// src/worlds/lab/hooks/useLabSession.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLearnerStore } from '@/store';
import { SessionService, LearningService } from '@/services';
import { AGE_GROUPS } from '@/constants/ageGroups';
import type { LabModule } from '../types/lab.types';

export function useLabSession() {
  const { language } = useLearnerStore();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const MAX_SECONDS = AGE_GROUPS.lab.maxSessionMinutes * 60;

  useEffect(() => {
    if (sessionStarted) return;
    const begin = async () => {
      const session = await SessionService.startSession('lab', language);
      setSessionId(session.id); setSessionStarted(true);
      await LearningService.trackEvent(session.id, 'lab', language, 'world_entered', 'lab-world', {});
    };
    begin();
  }, [language, sessionStarted]);

  useEffect(() => {
    if (!sessionStarted) return;
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= MAX_SECONDS) { setShowBreak(true); if (intervalRef.current) clearInterval(intervalRef.current); }
        return next;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [sessionStarted, MAX_SECONDS]);

  const trackEvent = useCallback(async (module: LabModule, eventType: any, payload: Record<string, unknown> = {}) => {
    if (!sessionId) return;
    await LearningService.trackEvent(sessionId, 'lab', language, eventType, module, payload);
  }, [sessionId, language]);

  const dismissBreak = useCallback(() => {
    setShowBreak(false); setElapsedSeconds(0);
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => { const next = prev + 1; if (next >= MAX_SECONDS) { setShowBreak(true); if (intervalRef.current) clearInterval(intervalRef.current); } return next; });
    }, 1000);
  }, [MAX_SECONDS]);

  return { elapsedSeconds, showBreak, trackEvent, dismissBreak, sessionId };
}
