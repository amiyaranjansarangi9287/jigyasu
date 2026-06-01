// src/worlds/discovery/modules/GeometryProofBuilder.tsx
import { useState, useCallback } from 'react';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { GEOMETRY_THEOREMS } from '../data/discoveryContent';

export default function GeometryProofBuilder() {
  const lumo = useLumoSage();
  const { recordProofCompleted, updateMastery } = useDiscoveryProgress();
  const [idx] = useState(0);
  const t = GEOMETRY_THEOREMS[idx];

  const handleComplete = useCallback(async () => {
    lumo.afterDiscovery();
    await recordProofCompleted(true, false);
    await updateMastery('geometry-proof', 'understand');
  }, [lumo, recordProofCompleted, updateMastery]);

  return (
    <DiscoveryShell module="geometry-proof">
      <div className="flex-1 flex flex-col p-6 bg-slate-900">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 mb-6">
          <div className="flex items-center gap-3 mb-2"><span className="text-3xl">{t.emoji}</span><h2 className="text-xl font-bold text-white">{t.name}</h2></div>
          <p className="text-sm text-slate-400 font-medium italic">"{t.statement}"</p>
        </div>
        <div className="flex-1 border border-slate-700 rounded-2xl p-4 mb-6 flex flex-col">
          <p className="text-sm text-slate-500 font-bold uppercase mb-4 tracking-widest">Formal Proof Steps</p>
          <div className="space-y-3">{t.proofSteps.map((step, i) => (
            <div key={i} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 text-sm text-slate-300">
              <span className="text-indigo-400 font-bold mr-2">{i+1}.</span>{step}
            </div>
          ))}</div>
        </div>
        <button onClick={handleComplete} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl">I Understand the Proof</button>
      </div>
    </DiscoveryShell>
  );
}
