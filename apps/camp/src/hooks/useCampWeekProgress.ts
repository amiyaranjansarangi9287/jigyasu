// CampCraft - Camp Week Progress Hook

import { useState, useEffect, useCallback } from 'react';

export interface CampWeekProgress {
  weekId: string;
  completedDays: number[];
  startedAt: number;
  completedAt?: number;
}

const STORAGE_KEY = 'campcraft-week-progress';

function loadAllProgress(): Record<string, CampWeekProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveAllProgress(progress: Record<string, CampWeekProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useCampWeekProgress(weekId: string) {
  const [progress, setProgress] = useState<CampWeekProgress>(() => {
    const all = loadAllProgress();
    return all[weekId] || {
      weekId,
      completedDays: [],
      startedAt: 0
    };
  });

  useEffect(() => {
    const all = loadAllProgress();
    all[weekId] = progress;
    saveAllProgress(all);
  }, [weekId, progress]);

  const startWeek = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      startedAt: prev.startedAt || Date.now()
    }));
  }, []);

  const completeDay = useCallback((day: number) => {
    setProgress(prev => {
      if (prev.completedDays.includes(day)) return prev;
      const newDays = [...prev.completedDays, day];
      const isComplete = newDays.length >= 5;
      return {
        ...prev,
        completedDays: newDays,
        completedAt: isComplete ? Date.now() : undefined
      };
    });
  }, []);

  const resetWeek = useCallback(() => {
    setProgress({
      weekId,
      completedDays: [],
      startedAt: 0
    });
  }, [weekId]);

  return {
    progress,
    startWeek,
    completeDay,
    resetWeek,
    isStarted: progress.startedAt > 0,
    isCompleted: !!progress.completedAt,
    completedDaysCount: progress.completedDays.length
  };
}

// Utility to check status of any week
export function useCampWeekStatus() {
  const getStatus = useCallback((weekId: string): 'not-started' | 'in-progress' | 'completed' => {
    const all = loadAllProgress();
    const progress = all[weekId];
    if (!progress || !progress.startedAt) return 'not-started';
    if (progress.completedAt) return 'completed';
    return 'in-progress';
  }, []);

  const getCompletedWeeksCount = useCallback((): number => {
    const all = loadAllProgress();
    return Object.values(all).filter(p => p.completedAt).length;
  }, []);

  return {
    getStatus,
    getCompletedWeeksCount
  };
}
