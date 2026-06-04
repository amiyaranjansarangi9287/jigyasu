// src/worlds/academy/hooks/useAcademyReport.ts
import { useCallback } from 'react';
import { useAcademyProgress } from './useAcademyProgress';
import { ACADEMY_MODULES } from '../data/academyContent';
import type { DepthLevel } from '../types/academy.types';

export function useAcademyReport() {
  const { progress, getDepth } = useAcademyProgress();

  const generateReport = useCallback(() => {
    if (!progress) return null;
    const depthCounts: Record<DepthLevel, number> = { surface: 0, mechanism: 0, principle: 0, frontier: 0 };
    let depthScore = 0;
    let explored = 0;
    const depthValue: Record<DepthLevel, number> = { surface: 1, mechanism: 2, principle: 3, frontier: 4 };
    ACADEMY_MODULES.forEach((module) => {
      const depth = getDepth(module.id);
      if (!depth) return;
      explored += 1;
      depthCounts[depth] += 1;
      depthScore += depthValue[depth];
    });
    const examAccuracy = progress.examQuestionsAttempted > 0
      ? Math.round((progress.examQuestionsCorrect / progress.examQuestionsAttempted) * 100)
      : 0;
    const averageDepth = explored > 0 ? Math.round((depthScore / explored) * 10) / 10 : 0;
    const readinessScore = Math.min(100, Math.round((averageDepth / 4) * 50 + (examAccuracy / 100) * 30 + (explored / ACADEMY_MODULES.length) * 20));

    return {
      depthCounts,
      explored,
      totalModules: ACADEMY_MODULES.length,
      averageDepth,
      readinessScore,
      examAccuracy,
      examAttempted: progress.examQuestionsAttempted,
      totalMinutes: Math.round(progress.totalMinutes),
      totalSessions: progress.totalSessions,
    };
  }, [progress, getDepth]);

  return { generateReport, progress, getDepth };
}
