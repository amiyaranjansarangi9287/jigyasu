// src/worlds/discovery/hooks/useConceptBridges.ts
import { useEffect, useCallback } from 'react';
import { useDiscoveryProgress } from './useDiscoveryProgress';
import { useLumoSage } from './useLumoSage';
import type { DiscoveryModule } from '../types/discovery.types';

const BRIDGES = [
  { id: 'genetics-probability', m1: 'genetics-simulator' as DiscoveryModule, m2: 'probability-sandbox' as DiscoveryModule, msg: 'Punnett squares and probability are the same mathematics.', emoji: '🧬🔀🎲' },
  { id: 'algebra-chemistry', m1: 'algebra-scales' as DiscoveryModule, m2: 'chemical-balancer' as DiscoveryModule, msg: 'Balancing equations uses identical logic to algebra.', emoji: '⚖️🔀⚗️' },
  { id: 'carbon-chemistry', m1: 'carbon-cycle' as DiscoveryModule, m2: 'chemical-balancer' as DiscoveryModule, msg: 'Every carbon flow is a chemical reaction you can balance.', emoji: '🌿🔀⚗️' },
  { id: 'speed-algebra', m1: 'speed-distance-time' as DiscoveryModule, m2: 'algebra-scales' as DiscoveryModule, msg: 'Speed = Distance ÷ Time is an algebraic equation.', emoji: '🚀🔀⚖️' },
];

export function useConceptBridges(_currentModule: DiscoveryModule) {
  const { progress, updateMastery } = useDiscoveryProgress();
  const lumo = useLumoSage();

  const checkBridges = useCallback(async () => {
    if (!progress) return;
    for (const bridge of BRIDGES) {
      if (progress.connectionIds.includes(bridge.id)) continue;
      if (progress.mastery[bridge.m1] && progress.mastery[bridge.m2]) {
        lumo.crossSubjectBridge(bridge.msg);
        await updateMastery(bridge.m1, 'connect');
        await updateMastery(bridge.m2, 'connect');
        break;
      }
    }
  }, [progress, lumo, updateMastery]);

  useEffect(() => { const t = setTimeout(checkBridges, 8000); return () => clearTimeout(t); }, [checkBridges]);
}
