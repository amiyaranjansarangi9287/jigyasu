// src/worlds/academy/hooks/useAcademyCrossConcepts.ts
import { useCallback, useEffect } from 'react';
import { useAcademyProgress } from './useAcademyProgress';
import { useLumoAncient } from './useLumoAncient';
import type { AcademyModule } from '../types/academy.types';

const BRIDGES = [
  { module1: 'trigonometry-circle', module2: 'wave-interference', message: 'The sine function from the unit circle is the same language waves use.' },
  { module1: 'derivatives-visual', module2: 'projectile-motion', message: 'Projectile motion is calculus: position, velocity, acceleration.' },
  { module1: 'redox-reactions', module2: 'electrolysis', message: 'Electrolysis is forced redox. Energy pushes chemistry uphill.' },
  { module1: 'dna-synthesis', module2: 'natural-selection', message: 'Mutation creates variation. Natural selection filters it.' },
] as const;

export function useAcademyCrossConcepts(currentModule: AcademyModule) {
  const { progress, updateDepth } = useAcademyProgress();
  const lumo = useLumoAncient();

  const checkBridges = useCallback(async () => {
    if (!progress) return;
    const bridge = BRIDGES.find((b) => b.module1 === currentModule || b.module2 === currentModule);
    if (!bridge) return;
    const d1 = progress.depth[bridge.module1];
    const d2 = progress.depth[bridge.module2];
    if (d1 && d2) {
      lumo.crossConceptConnection(bridge.message);
      await updateDepth(bridge.module1, 'frontier');
      await updateDepth(bridge.module2, 'frontier');
    }
  }, [currentModule, progress, lumo, updateDepth]);

  useEffect(() => {
    const timer = setTimeout(checkBridges, 10000);
    return () => clearTimeout(timer);
  }, [checkBridges]);
}
