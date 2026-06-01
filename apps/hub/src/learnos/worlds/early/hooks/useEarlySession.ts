// src/worlds/early/hooks/useEarlySession.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLearnerStore } from '@/store';
import { SessionService, LearningService } from '@/services';
import { AGE_GROUPS } from '@/constants/ageGroups';
import type { EarlyModule } from '../types/early.types';

export function useEarlySession() {
  const { language } = useLearnerStore();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const [pipMood, setPipMood] = useState<'normal' | 'yawning' | 'sleepy'>('normal');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  const MAX_SECONDS = AGE_GROUPS.early.maxSessionMinutes * 60;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const begin = async () => {
      try {
        const session = await SessionService.startSession('early', language);
        setSessionId(session.id);
        setSessionStarted(true);
        await LearningService.trackEvent(session.id, 'early', language, 'world_entered', 'early-world', {});
      } catch (e) { console.warn('[EarlyWorld] Session start failed:', e); setSessionStarted(true); }
    };
    begin();
  }, [language]);

  useEffect(() => {
    if (!sessionStarted) return;
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= 780 && next < 840) setPipMood('yawning');
        else if (next >= 840 && next < MAX_SECONDS) setPipMood('sleepy');
        else if (next >= MAX_SECONDS) { setShowBreak(true); if (intervalRef.current) clearInterval(intervalRef.current); }
        return next;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [sessionStarted, MAX_SECONDS]);

  const trackModuleOpen = useCallback(async (module: EarlyModule) => {
    if (!sessionId) return;
    try { await LearningService.trackEvent(sessionId, 'early', language, 'module_opened', module, { elapsedSeconds }); } catch (_) {}
  }, [sessionId, language, elapsedSeconds]);

  const trackModuleClose = useCallback(async (module: EarlyModule) => {
    if (!sessionId) return;
    try { await LearningService.trackEvent(sessionId, 'early', language, 'module_closed', module, { elapsedSeconds }); } catch (_) {}
  }, [sessionId, language, elapsedSeconds]);

  const trackCorrect = useCallback(async (module: EarlyModule, payload: Record<string, unknown> = {}) => {
    if (!sessionId) return;
    try { await LearningService.trackEvent(sessionId, 'early', language, 'correct_answer', module, payload); } catch (_) {}
  }, [sessionId, language]);

  const trackWrong = useCallback(async (module: EarlyModule, payload: Record<string, unknown> = {}) => {
    if (!sessionId) return;
    try { await LearningService.trackEvent(sessionId, 'early', language, 'wrong_answer', module, payload); } catch (_) {}
  }, [sessionId, language]);

  const dismissBreak = useCallback(() => {
    setShowBreak(false); setElapsedSeconds(0); setPipMood('normal');
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => { const next = prev + 1; if (next >= MAX_SECONDS) { setShowBreak(true); if (intervalRef.current) clearInterval(intervalRef.current); } return next; });
    }, 1000);
  }, [MAX_SECONDS]);

  return { sessionStarted, elapsedSeconds, showBreak, pipMood, trackModuleOpen, trackModuleClose, trackCorrect, trackWrong, dismissBreak, sessionId };
}
