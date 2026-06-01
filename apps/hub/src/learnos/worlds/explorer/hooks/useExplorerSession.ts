import { useState, useEffect, useCallback, useRef } from 'react';
import { useLearnerStore } from '@/store';
import { SessionService, LearningService } from '@/services';
import type { ExplorerConcept } from '../types/explorer.types';

export function useExplorerSession() {
  const { language } = useLearnerStore();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // No break screen — ever — for Explorer Mode

  useEffect(() => {
    if (sessionStarted) return;
    const begin = async () => {
      const session = await SessionService.startSession('explorer', language);
      setSessionId(session.id);
      setSessionStarted(true);
      await LearningService.trackEvent(
        session.id, 'explorer',
        language, 'world_entered', 'explorer-world', {}
      );
    };
    begin();
  }, [language, sessionStarted]);

  useEffect(() => {
    if (!sessionStarted) return;
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [sessionStarted]);

  const trackConceptOpen = useCallback(async (concept: ExplorerConcept) => {
    if (!sessionId) return;
    await LearningService.trackEvent(
      sessionId, 'explorer',
      language, 'module_opened', concept, {}
    );
  }, [sessionId, language]);

  const trackConceptComplete = useCallback(async (concept: ExplorerConcept) => {
    if (!sessionId) return;
    await LearningService.trackEvent(
      sessionId, 'explorer',
      language, 'concept_completed', concept, {}
    );
  }, [sessionId, language]);

  const trackWonderMoment = useCallback(async (concept: ExplorerConcept) => {
    if (!sessionId) return;
    await LearningService.trackEvent(
      sessionId, 'explorer',
      language, 'wonder_moment', concept, {}
    );
  }, [sessionId, language]);

  return {
    sessionStarted,
    elapsedSeconds,
    showBreak: false,  // Never for Explorer
    trackConceptOpen,
    trackConceptComplete,
    trackWonderMoment,
    sessionId,
  };
}
