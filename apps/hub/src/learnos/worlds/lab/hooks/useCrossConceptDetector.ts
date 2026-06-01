// src/worlds/lab/hooks/useCrossConceptDetector.ts
import { useEffect, useCallback } from 'react';
import { useLabProgress } from './useLabProgress';
import { useLumoOwl } from './useLumoOwl';
import { CROSS_CONCEPT_BRIDGES } from '../data/labContent';
import type { LabModule, LabProgress } from '../types/lab.types';

function isModuleDone(mod: string, p: LabProgress): boolean {
  switch (mod) {
    case 'circuit-builder': return p.circuitsCompleted > 0;
    case 'fraction-kitchen': return p.recipesSolved > 0;
    case 'ecosystem-sandbox': return p.ecosystemsBuilt > 0;
    case 'force-lab': return p.experimentsDone > 0;
    case 'weather-station': return p.predictionsTotal > 0;
    case 'timeline-explorer': return p.eventsPlaced > 0;
    case 'code-story': return p.codeStoriesCompleted > 0;
    case 'multiplication-lab': return p.multiplicationArraysDone > 0;
    case 'buoyancy-lab': return p.buoyancyObjectsTested.length > 0;
    case 'lever-explorer': return p.leverChallengesCompleted > 0;
    case 'statistics-playground': return p.statsDatasets.length > 0;
    case 'human-body': return p.bodySystemsExplored.length > 0;
    default: return false;
  }
}

export function useCrossConceptDetector(currentModule: LabModule) {
  const { progress, recordCrossConceptUnlocked } = useLabProgress();
  const lumo = useLumoOwl(currentModule);

  const checkBridges = useCallback(async () => {
    if (!progress) return;
    for (const bridge of CROSS_CONCEPT_BRIDGES) {
      if (progress.crossConceptsUnlocked.includes(bridge.id)) continue;
      if (isModuleDone(bridge.module1, progress) && isModuleDone(bridge.module2, progress)) {
        lumo.show(bridge.bridgeMessage, 'curious');
        await recordCrossConceptUnlocked(bridge.id);
        break;
      }
    }
  }, [progress, lumo, recordCrossConceptUnlocked]);

  useEffect(() => { const t = setTimeout(checkBridges, 5000); return () => clearTimeout(t); }, [checkBridges]);
}
