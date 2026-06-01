import { useActivityProgress } from '@jigyasu/storage';

export type BuildProgress = {
  toyId: number;
  completedSteps: number[];
  materialsChecked: number[];
  startedAt: number;
  elapsedSeconds: number;
  completedAt?: number;
};

export function useBuildProgress(toyId: number) {
  const {
    progress,
    toggleStep,
    toggleMaterial,
    startActivity,
    updateElapsedTime,
    completeActivity,
    resetProgress
  } = useActivityProgress('toybox', String(toyId));

  return {
    progress: {
      toyId,
      completedSteps: progress.completedSteps,
      materialsChecked: progress.materialsChecked,
      startedAt: progress.startedAt,
      elapsedSeconds: progress.elapsedSeconds,
      completedAt: progress.completedAt
    } as BuildProgress,
    toggleStep,
    toggleMaterial,
    startBuild: startActivity,
    updateElapsed: updateElapsedTime,
    markComplete: completeActivity,
    resetProgress
  };
}
