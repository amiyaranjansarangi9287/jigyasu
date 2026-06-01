import { useState, useCallback, useEffect } from 'react';
import { db } from '@/db';
import type { ExplorerProgress, ExplorerConcept } from '../types/explorer.types';

const DEFAULT_PROGRESS: ExplorerProgress = {
  conceptsVisited: [],
  conceptsCompleted: [],
  thinkingPromptsEngaged: 0,
  everydayConnectionsRead: 0,
  lumoInteractions: 0,
  totalMinutes: 0,
  totalSessions: 0,
  lastSessionAt: 0,
  updatedAt: 0,
};

const PROGRESS_KEY = 'explorer-world-progress';

export function useExplorerProgress() {
  const [progress, setProgress] = useState<ExplorerProgress | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await db.conceptProgress.get(PROGRESS_KEY);
        if (stored?.payload) {
          setProgress(stored.payload as ExplorerProgress);
        } else {
          setProgress({ ...DEFAULT_PROGRESS });
        }
      } catch {
        setProgress({ ...DEFAULT_PROGRESS });
      }
    };
    load();
  }, []);

  const saveProgress = useCallback(async (updated: ExplorerProgress) => {
    try {
      await db.conceptProgress.put({
        conceptId: PROGRESS_KEY,
        ageGroup: 'explorer',
        status: 'in_progress',
        attemptsCount: updated.totalSessions,
        hintsUsed: 0,
        wrongAnswers: 0,
        timeSpentSeconds: Math.floor(updated.totalMinutes * 60),
        lumoInteractions: updated.lumoInteractions,
        payload: updated,
      });
    } catch (err) {
      console.warn('[Explorer] Progress save failed:', err);
    }
  }, []);

  const markVisited = useCallback(async (concept: ExplorerConcept) => {
    if (!progress) return;
    if (progress.conceptsVisited.includes(concept)) return;

    const updated: ExplorerProgress = {
      ...progress,
      conceptsVisited: [...progress.conceptsVisited, concept],
      lastVisitedConcept: concept,
      updatedAt: Date.now(),
    };
    setProgress(updated);
    await saveProgress(updated);
  }, [progress, saveProgress]);

  const markCompleted = useCallback(async (concept: ExplorerConcept) => {
    if (!progress) return;

    const updated: ExplorerProgress = {
      ...progress,
      conceptsVisited: progress.conceptsVisited.includes(concept)
        ? progress.conceptsVisited
        : [...progress.conceptsVisited, concept],
      conceptsCompleted: progress.conceptsCompleted.includes(concept)
        ? progress.conceptsCompleted
        : [...progress.conceptsCompleted, concept],
      lastVisitedConcept: concept,
      updatedAt: Date.now(),
    };
    setProgress(updated);
    await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordThinkingPrompt = useCallback(async () => {
    if (!progress) return;
    const updated: ExplorerProgress = {
      ...progress,
      thinkingPromptsEngaged: progress.thinkingPromptsEngaged + 1,
      updatedAt: Date.now(),
    };
    setProgress(updated);
    await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordEverydayConnection = useCallback(async () => {
    if (!progress) return;
    const updated: ExplorerProgress = {
      ...progress,
      everydayConnectionsRead: progress.everydayConnectionsRead + 1,
      updatedAt: Date.now(),
    };
    setProgress(updated);
    await saveProgress(updated);
  }, [progress, saveProgress]);

  const isVisited = useCallback((concept: ExplorerConcept) => {
    return progress?.conceptsVisited.includes(concept) ?? false;
  }, [progress]);

  const isCompleted = useCallback((concept: ExplorerConcept) => {
    return progress?.conceptsCompleted.includes(concept) ?? false;
  }, [progress]);

  return {
    progress,
    markVisited,
    markCompleted,
    recordThinkingPrompt,
    recordEverydayConnection,
    isVisited,
    isCompleted,
  };
}
