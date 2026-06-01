// src/worlds/discovery/hooks/useDiscoveryReport.ts
import { useCallback } from 'react';
import { useDiscoveryProgress } from './useDiscoveryProgress';
import { DISCOVERY_MODULES } from '../data/discoveryContent';

export function useDiscoveryReport() {
  const { progress, getMastery } = useDiscoveryProgress();

  const generateReport = useCallback(() => {
    if (!progress) return null;
    let aware = 0, understood = 0, applied = 0, connected = 0;
    DISCOVERY_MODULES.forEach(m => {
      const ml = getMastery(m.id);
      if (!ml) return;
      const s = ml === 'connect' ? 4 : ml === 'apply' ? 3 : ml === 'understand' ? 2 : 1;
      if (s >= 1) aware++; if (s >= 2) understood++; if (s >= 3) applied++; if (s >= 4) connected++;
    });
    const wonderScore = progress.rabbitHolesEntered * 3 + progress.connectionsFound * 5 + progress.unsolvedQuestionsViewed * 2;
    return { modulesAware: aware, modulesUnderstood: understood, modulesApplied: applied, modulesConnected: connected, totalModules: DISCOVERY_MODULES.length, connectionsFound: progress.connectionsFound, rabbitHoles: progress.rabbitHolesEntered, wonderScore };
  }, [progress, getMastery]);

  return { generateReport, progress, getMastery };
}
