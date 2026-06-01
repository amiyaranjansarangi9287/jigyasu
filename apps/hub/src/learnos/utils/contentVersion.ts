// src/utils/contentVersion.ts
// Detects content version mismatches and handles stale progress

import type { ConceptProgress } from '../types/shared';
import { moduleRegistry } from '../core/ModuleRegistry';

const CURRENT_CONTENT_VERSION = '1.0.0';

export function checkContentVersion(
  progress: ConceptProgress,
): { isStale: boolean; currentVersion: string; progressVersion: string } {
  const module = moduleRegistry.get(progress.conceptId);
  const currentVersion = module?.contentVersion ?? CURRENT_CONTENT_VERSION;
  const progressVersion = progress.contentVersion ?? '1.0.0';

  return {
    isStale: currentVersion !== progressVersion,
    currentVersion,
    progressVersion,
  };
}

export function updateContentVersion(
  progress: ConceptProgress,
  newVersion?: string,
): ConceptProgress {
  return {
    ...progress,
    contentVersion: newVersion ?? CURRENT_CONTENT_VERSION,
  };
}

export function getStaleConcepts(progressList: ConceptProgress[]): ConceptProgress[] {
  return progressList.filter((p) => checkContentVersion(p).isStale);
}

export function resetStaleProgress(
  progressList: ConceptProgress[],
): { kept: ConceptProgress[]; reset: ConceptProgress[] } {
  const kept: ConceptProgress[] = [];
  const reset: ConceptProgress[] = [];

  for (const p of progressList) {
    const { isStale } = checkContentVersion(p);
    if (isStale) {
      // If completed or mastered, keep but mark as stale
      if (p.status === 'completed' || p.status === 'mastered') {
        kept.push(p);
      } else {
        // Reset in-progress concepts to start fresh with new content
        reset.push({
          ...p,
          status: 'not_started',
          attemptsCount: 0,
          hintsUsed: 0,
          wrongAnswers: 0,
          timeSpentSeconds: 0,
          lumoInteractions: 0,
          startedAt: undefined,
          completedAt: undefined,
          masteredAt: undefined,
        });
      }
    } else {
      kept.push(p);
    }
  }

  return { kept, reset };
}
