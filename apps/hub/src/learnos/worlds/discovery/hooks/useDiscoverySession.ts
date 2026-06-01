// src/worlds/discovery/hooks/useDiscoverySession.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLearnerStore } from '@/store';
import { SessionService, LearningService } from '@/services';
import { AGE_GROUPS } from '@/constants/ageGroups';
import type { DiscoveryModule } from '../types/discovery.types';

export function useDiscoverySession() {
  const { language } = useLearnerStore();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);
  const MAX_SECONDS = AGE_GROUPS.discovery.maxSessionMinutes * 60;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const begin = async () => {
      try {
        const session = await SessionService.startSession('discovery', language);
        setSessionId(session.id); setSessionStarted(true);
        await LearningService.trackEvent(session.id, 'discovery', language, 'world_entered', 'discovery-world', {});
      } catch (e) { console.warn('[Discovery] Session start failed:', e); setSessionStarted(true); }
    };
    begin();
  }, [language]);

  useEffect(() => {
    if (!sessionStarted) return;
    intervalRef.current = setInterval(() => {
      setElapsedSeconds(prev => { const n = prev + 1; if (n >= MAX_SECONDS) { setShowBreak(true); if (intervalRef.current) clearInterval(intervalRef.current); } return n; });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [sessionStarted, MAX_SECONDS]);

  const trackEvent = useCallback(async (module: DiscoveryModule, eventType: any, payload: Record<string, unknown> = {}) => {
    if (!sessionId) return;
    await LearningService.trackEvent(sessionId, 'discovery', language, eventType, module, payload);
  }, [sessionId, language]);

  const dismissBreak = useCallback(() => {
    setShowBreak(false); setElapsedSeconds(0);
    intervalRef.current = setInterval(() => { setElapsedSeconds(prev => { const n = prev + 1; if (n >= MAX_SECONDS) { setShowBreak(true); if (intervalRef.current) clearInterval(intervalRef.current); } return n; }); }, 1000);
  }, [MAX_SECONDS]);

  return { sessionStarted, elapsedSeconds, showBreak, trackEvent, dismissBreak, sessionId };
}
