// src/worlds/academy/modules/NaturalSelection.tsx
import { useState, useCallback } from 'react';
import AcademyShell from '../AcademyShell';
import { useLumoAncient } from '../hooks/useLumoAncient';
import { useAcademyProgress } from '../hooks/useAcademyProgress';
import { ENVIRONMENTS } from '../data/academyContent';

const TRAITS = [
  { id: 'white', emoji: '⚪', count: 30 },
  { id: 'dark', emoji: '⚫', count: 30 },
  { id: 'tawny', emoji: '🟤', count: 30 },
];

export default function NaturalSelection() {
  const lumo = useLumoAncient();
  const { recordNaturalSelection } = useAcademyProgress();
  const [envIdx, setEnvIdx] = useState(0);
  const [generation, setGeneration] = useState(0);
  const [pops, setPops] = useState<Record<string, number>>({ white: 30, dark: 30, tawny: 30 });
  const env = ENVIRONMENTS[envIdx];

  const run = useCallback(async (gens: number) => {
    setGeneration((g) => g + gens);
    setPops((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k] = Math.max(0, Math.round(next[k] * (k === env.favored ? 1 + gens * 0.08 : 1 - gens * 0.04)));
      });
      return next;
    });
    await recordNaturalSelection(generation + gens, generation + gens >= 20, false);
    if (gens >= 50) lumo.afterProfoundDiscovery();
  }, [env, generation, recordNaturalSelection, lumo]);

  return (
    <AcademyShell module="natural-selection">
      <div className="min-h-screen bg-slate-950 p-5 pb-24">
        <div className="flex gap-2 overflow-x-auto mb-4 no-scrollbar">{ENVIRONMENTS.map((e, i) => <button key={e.id} onClick={() => { setEnvIdx(i); setGeneration(0); setPops({ white: 30, dark: 30, tawny: 30 }); }} className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-bold ${envIdx === i ? 'bg-green-900/60 text-green-300 border border-green-600' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>{e.emoji} {e.name}</button>)}</div>
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 mb-4"><p className="text-white font-bold">Generation {generation}</p><p className="text-slate-400 text-sm mt-1">Favoured trait: {env.favored}</p><p className="text-amber-400 text-sm mt-2">🇮🇳 {env.indian}</p></div>
        <div className="space-y-3 mb-4">{TRAITS.map((t) => <div key={t.id} className="bg-slate-900 rounded-xl p-3 border border-slate-800"><div className="flex justify-between text-sm mb-1"><span className="text-white">{t.emoji} {t.id}</span><span className="text-slate-400">{pops[t.id]}</span></div><div className="h-3 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{ width: `${Math.min(100, pops[t.id])}%` }} /></div></div>)}</div>
        <div className="grid grid-cols-3 gap-2"><button onClick={() => run(1)} className="py-3 bg-green-700 text-white rounded-xl font-bold">+1 Gen</button><button onClick={() => run(10)} className="py-3 bg-green-700 text-white rounded-xl font-bold">+10</button><button onClick={() => run(50)} className="py-3 bg-green-700 text-white rounded-xl font-bold">+50</button></div>
      </div>
    </AcademyShell>
  );
}