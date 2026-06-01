// src/worlds/academy/hooks/useAcademySession.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLearnerStore } from '@/store';
import { SessionService, LearningService } from '@/services';
import type { AcademyModule } from '../types/academy.types';

export function useAcademySession() {
  const { language } = useLearnerStore();
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const intRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    (async () => {
      try {
        const s = await SessionService.startSession('academy', language);
        setSessionId(s.id); setStarted(true);
        await LearningService.trackEvent(s.id, 'academy', language, 'world_entered', 'academy-world', {});
      } catch { setStarted(true); }
    })();
  }, [language]);

  useEffect(() => {
    if (!started) return;
    intRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => { if (intRef.current) clearInterval(intRef.current); };
  }, [started]);

  const trackEvent = useCallback(async (mod: AcademyModule, type: any, payload: Record<string, unknown> = {}) => {
    if (!sessionId) return;
    try { await LearningService.trackEvent(sessionId, 'academy', language, type, mod, payload); } catch (_) {}
  }, [sessionId, language]);

  return { sessionStarted: started, elapsedSeconds: elapsed, showBreak: false, trackEvent, sessionId };
}
