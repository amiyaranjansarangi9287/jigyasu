import { useActivityStatus as useStorageActivityStatus } from '@jigyasu/storage';
import { useCallback } from 'react';
import type { BuildProgress } from './useBuildProgress';

export type BuildStatus = 'not-started' | 'in-progress' | 'completed';

export function useBuildStatus() {
  const { getStatus: rawGetStatus, getProgress: rawGetProgress, getAllProgress } = useStorageActivityStatus('toybox');

  const getStatus = useCallback((toyId: number): BuildStatus => {
    return rawGetStatus(String(toyId));
  }, [rawGetStatus]);

  const getProgress = useCallback((toyId: number): BuildProgress | null => {
    const p = rawGetProgress(String(toyId));
    if (!p) return null;
    return {
      toyId,
      completedSteps: p.completedSteps,
      materialsChecked: p.materialsChecked,
      startedAt: p.startedAt,
      elapsedSeconds: p.elapsedSeconds,
      completedAt: p.completedAt
    };
  }, [rawGetProgress]);

  // Convert map to keyed by number for toys
  const allProgressNumberKeys = useCallback(() => {
    const all = getAllProgress();
    const result: Record<number, BuildProgress> = {};
    for (const key in all) {
      const p = all[key];
      result[Number(key)] = {
        toyId: Number(key),
        completedSteps: p.completedSteps,
        materialsChecked: p.materialsChecked,
        startedAt: p.startedAt,
        elapsedSeconds: p.elapsedSeconds,
        completedAt: p.completedAt
      };
    }
    return result;
  }, [getAllProgress]);

  return { 
    getStatus, 
    getProgress, 
    allProgress: allProgressNumberKeys() // Toys previously returned a flat map directly
  };
}
