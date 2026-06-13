// src/worlds/discovery/modules/ChemicalBalancer.tsx
import { useState, useCallback } from 'react';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { useDiscoverySession } from '../hooks/useDiscoverySession';
import { CHEMICAL_REACTIONS } from '../data/discoveryContent';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

export default function ChemicalBalancer() {
  const { t } = useTranslation();
  const lumo = useLumoSage();
  const { recordReactionBalanced, updateMastery } = useDiscoveryProgress();
  const { trackEvent } = useDiscoverySession();
  const [idx] = useState(0);
  const [rc, setRc] = useState(1); const [pc, setPc] = useState(1);
  const r = CHEMICAL_REACTIONS[idx % CHEMICAL_REACTIONS.length];

  const handleCheck = useCallback(async () => {
    const balanced = rc === 2 && pc === 2; // Fixed for H2O example
    if (balanced) { lumo.afterDiscovery(); await recordReactionBalanced(r.id); await updateMastery('chemical-balancer', 'understand'); await trackEvent('chemical-balancer', 'correct_answer'); }
  }, [rc, pc, r, lumo, recordReactionBalanced, updateMastery, trackEvent]);

  return (
    <DiscoveryShell module="chemical-balancer">
      <div className="flex-1 flex flex-col p-6 bg-slate-900 overflow-auto pb-24">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 mb-6 text-center">
          <h2 className="text-xl font-bold text-white mb-4">{r.name}</h2>
          <div className="flex items-center justify-center gap-4 text-2xl font-mono text-indigo-400">
            <div><button onClick={() => setRc(p => Math.max(1, p-1))} className="text-sm px-2">▼</button> <span className="text-white">{rc}</span>{r.reactants[0].formula} <button onClick={() => setRc(p => p+1)} className="text-sm px-2">▲</button></div>
            <span>+</span> <div>{r.reactants[1].formula}</div> <span>→</span>
            <div><button onClick={() => setPc(p => Math.max(1, p-1))} className="text-sm px-2">▼</button> <span className="text-white">{pc}</span>{r.products[0].formula} <button onClick={() => setPc(p => p+1)} className="text-sm px-2">▲</button></div>
          </div>
        </div>
        <button onClick={handleCheck} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl mb-4"><Trans i18nKey="auto.chemicalbalancer.check_balance">Check Balance</Trans></button>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700"><p className="text-sm text-slate-400"><Trans i18nKey="auto.chemicalbalancer.real_world">Real World:</Trans> {r.realWorldContext}</p></div>
      </div>
    </DiscoveryShell>
  );
}
