// src/worlds/lab/hooks/useLabReport.ts
import { useCallback } from 'react';
import { useLabProgress } from './useLabProgress';
import { LAB_MODULES } from '../data/labContent';
import type { CertificationLevel } from '../types/lab.types';

export function useLabReport() {
  const { progress, getCertification } = useLabProgress();

  const generateReport = useCallback(() => {
    if (!progress) return null;
    const certs: Record<CertificationLevel, number> = { explorer: 0, scientist: 0, expert: 0 };
    let explored = 0;
    LAB_MODULES.forEach(m => { const c = getCertification(m.id); if (c) { explored++; certs[c]++; } });
    return { totalExplored: explored, total: LAB_MODULES.length, certs, crossConcepts: progress.crossConceptsFound, lumoChats: progress.lumoInteractions, hints: progress.hintsUsed, minutes: Math.round(progress.totalMinutes) };
  }, [progress, getCertification]);

  return { generateReport, progress, getCertification };
}
