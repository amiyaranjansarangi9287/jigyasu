import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useCallback, useEffect, useState } from 'react';

export interface ActivityProgress {
  activityId: string;
  completedSteps: number[];
  materialsChecked: number[];
  startedAt: number;
  elapsedSeconds: number;
  completedAt?: number;
  score?: number;
  masteryLevel?: number;
  nextReviewDate?: number;
  srsInterval?: number;
  srsFactor?: number;
}

export function useActivityProgress(appId: string, activityId: string) {
  // Use local state for optimistic UI updates
  const [progress, setProgress] = useState<ActivityProgress>({
    activityId,
    completedSteps: [],
    materialsChecked: [],
    startedAt: 0,
    elapsedSeconds: 0
  });

  const recordId = `${appId}:${activityId}`;

  // Load from Dexie initially
  useEffect(() => {
    let mounted = true;
    db.progress.get(recordId).then(record => {
      if (mounted && record) {
        setProgress({
          activityId: record.activityId,
          completedSteps: record.completedSteps || [],
          materialsChecked: record.materialsChecked || [],
          startedAt: record.startedAt || 0,
          elapsedSeconds: record.elapsedSeconds || 0,
          completedAt: record.completedAt,
          score: record.score,
          masteryLevel: record.masteryLevel,
          nextReviewDate: record.nextReviewDate,
          srsInterval: record.srsInterval,
          srsFactor: record.srsFactor
        });
      }
    });
    return () => { mounted = false; };
  }, [recordId]);

  // Persist to Dexie whenever local progress changes
  useEffect(() => {
    // Only persist if started
    if (progress.startedAt > 0 || progress.completedSteps.length > 0 || progress.materialsChecked.length > 0) {
      db.progress.put({
        id: recordId,
        appId,
        ...progress
      }).catch(console.error);
    }
  }, [progress, recordId, appId, activityId]);

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

  const toggleStep = useCallback((index: number) => {
    setProgress(prev => {
      const isCompleted = prev.completedSteps.includes(index);
      return {
        ...prev,
        completedSteps: isCompleted 
          ? prev.completedSteps.filter(i => i !== index)
          : [...prev.completedSteps, index]
      };
    });
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
    const empty = {
      activityId,
      completedSteps: [],
      materialsChecked: [],
      startedAt: 0,
      elapsedSeconds: 0
    };
    setProgress(empty);
    db.progress.delete(recordId).catch(console.error);
  }, [activityId, recordId]);

  return {
    progress,
    startActivity,
    toggleMaterial,
    completeStep,
    uncompleteStep,
    toggleStep, // Added for toys' useBuildProgress
    updateElapsedTime,
    completeActivity,
    markComplete: completeActivity, // Alias for toys
    resetProgress,
    isStarted: progress.startedAt > 0,
    isCompleted: !!progress.completedAt
  };
}

export function useActivityStatus(appId: string) {
  const allRecords = useLiveQuery(() => db.progress.where('appId').equals(appId).toArray(), [appId]) || [];

  const getStatus = useCallback((activityId: string): 'not-started' | 'in-progress' | 'completed' => {
    const record = allRecords.find(r => r.activityId === activityId);
    if (!record) return 'not-started';
    if (record.completedAt) return 'completed';
    if (record.startedAt || (record.completedSteps && record.completedSteps.length > 0) || (record.materialsChecked && record.materialsChecked.length > 0)) return 'in-progress';
    return 'not-started';
  }, [allRecords]);

  const getProgress = useCallback((activityId: string): ActivityProgress | null => {
    const record = allRecords.find(r => r.activityId === activityId);
    if (!record) return null;
    return {
      activityId: record.activityId,
      completedSteps: record.completedSteps || [],
      materialsChecked: record.materialsChecked || [],
      startedAt: record.startedAt,
      elapsedSeconds: record.elapsedSeconds,
      completedAt: record.completedAt,
      score: record.score,
      masteryLevel: record.masteryLevel,
      nextReviewDate: record.nextReviewDate,
      srsInterval: record.srsInterval,
      srsFactor: record.srsFactor
    };
  }, [allRecords]);

  const getAllProgress = useCallback((): Record<string, ActivityProgress> => {
    const map: Record<string, ActivityProgress> = {};
    for (const record of allRecords) {
      map[record.activityId] = {
        activityId: record.activityId,
        completedSteps: record.completedSteps || [],
        materialsChecked: record.materialsChecked || [],
        startedAt: record.startedAt,
        elapsedSeconds: record.elapsedSeconds,
        completedAt: record.completedAt,
        score: record.score,
        masteryLevel: record.masteryLevel,
        nextReviewDate: record.nextReviewDate,
        srsInterval: record.srsInterval,
        srsFactor: record.srsFactor
      };
    }
    return map;
  }, [allRecords]);

  return {
    getStatus,
    getProgress,
    getAllProgress,
    allProgress: allRecords, // for toys
  };
}
