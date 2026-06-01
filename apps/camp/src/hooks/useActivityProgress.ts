import { useActivityProgress as useStorageActivityProgress, useActivityStatus as useStorageActivityStatus, ActivityProgress } from '@jigyasu/storage';
import { useCallback } from 'react';

export { type ActivityProgress };

export function useActivityProgress(activityId: string) {
  return useStorageActivityProgress('campcraft', activityId);
}

export function useActivityStatus() {
  const { getStatus, getAllProgress, allProgress } = useStorageActivityStatus('campcraft');

  const getCompletedCount = useCallback((): number => {
    return allProgress.filter(p => p.completedAt).length;
  }, [allProgress]);

  const getInProgressCount = useCallback((): number => {
    return allProgress.filter(p => p.startedAt && !p.completedAt).length;
  }, [allProgress]);

  const getTotalTime = useCallback((): number => {
    return allProgress.reduce((sum, p) => sum + (p.elapsedSeconds || 0), 0);
  }, [allProgress]);

  const getCompletedByPillar = useCallback((pillar: string): number => {
    return allProgress.filter(p => 
      p.completedAt && p.activityId.startsWith(pillar)
    ).length;
  }, [allProgress]);

  return {
    getStatus,
    getAllProgress,
    getCompletedCount,
    getInProgressCount,
    getTotalTime,
    getCompletedByPillar
  };
}
