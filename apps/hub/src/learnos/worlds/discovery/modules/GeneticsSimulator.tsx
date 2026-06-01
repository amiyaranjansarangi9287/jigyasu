// src/worlds/discovery/modules/GeneticsSimulator.tsx
import { useState, useCallback } from 'react';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { GENETIC_TRAITS } from '../data/discoveryContent';

export default function GeneticsSimulator() {
  const lumo = useLumoSage();
  const { recordGeneticsCross, updateMastery } = useDiscoveryProgress();
  const [idx] = useState(0);
  const trait = GENETIC_TRAITS[idx];

  const handleSimulate = useCallback(async () => {
    lumo.afterDiscovery();
    await recordGeneticsCross(true, true);
    await updateMastery('genetics-simulator', 'understand');
  }, [lumo, recordGeneticsCross, updateMastery]);

  return (
    <DiscoveryShell module="genetics-simulator">
      <div className="flex-1 flex flex-col p-6 bg-slate-900">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 mb-6 text-center">
          <div className="text-6xl mb-4">{trait.emoji}</div>
          <h2 className="text-xl font-bold text-white mb-2">{trait.name}</h2>
          <p className="text-sm text-slate-400 italic">"{trait.exampleContext}"</p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-6 flex-1 flex flex-col items-center justify-center">
          <p className="text-sm text-slate-500 font-bold uppercase mb-4 tracking-widest">Inheritance Table</p>
          <div className="grid grid-cols-2 gap-4">
             <div className="w-20 h-20 bg-slate-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl">{trait.dominantAllele}{trait.dominantAllele}</div>
             <div className="w-20 h-20 bg-slate-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl">{trait.dominantAllele}{trait.recessiveAllele}</div>
             <div className="w-20 h-20 bg-slate-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl">{trait.dominantAllele}{trait.recessiveAllele}</div>
             <div className="w-20 h-20 bg-slate-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl">{trait.recessiveAllele}{trait.recessiveAllele}</div>
          </div>
        </div>
        <button onClick={handleSimulate} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl">Run Genetic Cross</button>
      </div>
    </DiscoveryShell>
  );
}
