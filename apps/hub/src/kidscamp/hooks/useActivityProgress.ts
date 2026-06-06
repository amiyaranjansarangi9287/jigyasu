// CampCraft - Activity Progress Hook

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchApi } from '../utils/api';

export interface ActivityProgress {
  activityId: string;
  completedSteps: number[];
  materialsChecked: number[];
  startedAt: number;
  elapsedSeconds: number;
  completedAt?: number;
}

const STORAGE_KEY = 'campcraft-progress';

function loadAllProgress(): Record<string, ActivityProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveAllProgress(progress: Record<string, ActivityProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useActivityProgress(activityId: string) {
  const user = null;  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const [progress, setProgress] = useState<ActivityProgress>(() => {
    const all = loadAllProgress();
    return all[activityId] || {
      activityId,
      completedSteps: [],
      materialsChecked: [],
      startedAt: 0,
      elapsedSeconds: 0
    };
  });

  // Persist changes to local storage
  useEffect(() => {
    const all = loadAllProgress();
    all[activityId] = progress;
    saveAllProgress(all);
  }, [activityId, progress]);

  // Sync to backend if logged in
  useEffect(() => {
    if (user && progress.startedAt > 0) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        try {
          await fetchApi('/progress/sync', {
            method: 'POST',
            body: JSON.stringify({
              activity_id: activityId,
              status: progress.completedAt ? 'completed' : 'in_progress',
              duration_seconds: progress.elapsedSeconds,
              steps_completed: progress.completedSteps.length,
              total_steps: progress.completedSteps.length // Just a placeholder, actually need total steps from activity
            })
          });
        } catch (error) {
          console.error("Failed to sync progress", error);
        }
      }, 2000); // 2 second debounce
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [progress, user, activityId]);

  const startActivity = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      startedAt: prev.startedAt || Date.now()
    }));
  }, []);

  const toggleMaterial = useCallback((index: number) => {
    setProgress(prev => {
      const checked = prev.materialsChecked.includes(index)
        ? prev.materialsChecked.filter(i => i !== index)
        : [...prev.materialsChecked, index];
      return { ...prev, materialsChecked: checked };
    });
  }, []);

  const completeStep = useCallback((index: number) => {
    setProgress(prev => {
      if (prev.completedSteps.includes(index)) return prev;
      return {
        ...prev,
        completedSteps: [...prev.completedSteps, index]
      };
    });
  }, []);

  const uncompleteStep = useCallback((index: number) => {
    setProgress(prev => ({
      ...prev,
      completedSteps: prev.completedSteps.filter(i => i !== index)
    }));
  }, []);

  const updateElapsedTime = useCallback((seconds: number) => {
    setProgress(prev => ({
      ...prev,
      elapsedSeconds: seconds
    }));
  }, []);

  const completeActivity = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      completedAt: Date.now()
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({
      activityId,
      completedSteps: [],
      materialsChecked: [],
      startedAt: 0,
      elapsedSeconds: 0
    });
  }, [activityId]);

  return {
    progress,
    startActivity,
    toggleMaterial,
    completeStep,
    uncompleteStep,
    updateElapsedTime,
    completeActivity,
    resetProgress,
    isStarted: progress.startedAt > 0,
    isCompleted: !!progress.completedAt
  };
}

// Utility hook to get status of any activity without full progress tracking
export function useActivityStatus() {
  const user = null;
  // On mount, if user is logged in, we should fetch from /progress/me 
  // and sync it with localStorage.
  useEffect(() => {
    if (user) {
      fetchApi('/progress/me').then(data => {
        if (data && data.progress) {
          const all = loadAllProgress();
          let changed = false;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.progress.forEach((p: any) => {
            const existing = all[p.activity_id];
            if (!existing || existing.elapsedSeconds < p.duration_seconds || (!existing.completedAt && p.status === 'completed')) {
              all[p.activity_id] = {
                ...existing,
                activityId: p.activity_id,
                startedAt: existing?.startedAt || Date.now(),
                elapsedSeconds: Math.max(existing?.elapsedSeconds || 0, p.duration_seconds),
                completedAt: p.status === 'completed' ? (existing?.completedAt || Date.now()) : undefined,
                completedSteps: existing?.completedSteps || [],
                materialsChecked: existing?.materialsChecked || []
              };
              changed = true;
            }
          });
          if (changed) saveAllProgress(all);
        }
      }).catch(err => console.error("Failed to load backend progress", err));
    }
  }, [user]);

  const getStatus = useCallback((activityId: string): 'not-started' | 'in-progress' | 'completed' => {
    const all = loadAllProgress();
    const progress = all[activityId];
    if (!progress || !progress.startedAt) return 'not-started';
    if (progress.completedAt) return 'completed';
    return 'in-progress';
  }, []);

  const getAllProgress = useCallback((): Record<string, ActivityProgress> => {
    return loadAllProgress();
  }, []);

  const getCompletedCount = useCallback((): number => {
    const all = loadAllProgress();
    return Object.values(all).filter(p => p.completedAt).length;
  }, []);

  const getInProgressCount = useCallback((): number => {
    const all = loadAllProgress();
    return Object.values(all).filter(p => p.startedAt && !p.completedAt).length;
  }, []);

  const getTotalTime = useCallback((): number => {
    const all = loadAllProgress();
    return Object.values(all).reduce((sum, p) => sum + p.elapsedSeconds, 0);
  }, []);

  const getCompletedByPillar = useCallback((pillar: string): number => {
    const all = loadAllProgress();
    return Object.values(all).filter(p => 
      p.completedAt && p.activityId.startsWith(pillar)
    ).length;
  }, []);

  return {
    getStatus,
    getAllProgress,
    getCompletedCount,
    getInProgressCount,
    getTotalTime,
    getCompletedByPillar
  };
}
