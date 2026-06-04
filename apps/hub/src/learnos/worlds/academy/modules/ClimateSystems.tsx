// src/worlds/academy/modules/ClimateSystems.tsx
import { useState, useCallback } from 'react';
import AcademyShell from '../AcademyShell';
import { useLumoAncient } from '../hooks/useLumoAncient';
import { useAcademyProgress } from '../hooks/useAcademyProgress';
import { FEEDBACK_LOOPS } from '../data/academyContent';

export default function ClimateSystems() {
  const lumo = useLumoAncient();
  const { recordClimate } = useAcademyProgress();
  const [co2, setCo2] = useState(422);
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
  const tempRise = Math.round(((co2 - 280) / 120) * 10) / 10;
  const iceCover = Math.max(0, Math.round(100 - tempRise * 18));

  const selectLoop = useCallback(async (id: string) => {
    setSelectedLoop(id);
    await recordClimate(id, tempRise >= 2 ? 1 : 0, true);
    if (tempRise >= 2) lumo.crossConceptConnection('Some changes cannot be reversed on human timescales. What does irreversible mean in science?');
  }, [tempRise, recordClimate, lumo]);

  const loop = FEEDBACK_LOOPS.find((l) => l.id === selectedLoop);

  return (
    <AcademyShell module="climate-systems">
      <div className="min-h-screen bg-slate-950 p-5 pb-24">
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 mb-4">
          <p className="text-white font-bold text-lg">🌡️ Climate Systems</p><p className="text-slate-500 text-sm">Small changes cascade through feedback loops.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4"><div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-center"><p className="text-slate-500 text-sm">CO₂</p><p className="text-white text-2xl font-bold">{co2} ppm</p></div><div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-center"><p className="text-slate-500 text-sm">Warming</p><p className={`text-2xl font-bold ${tempRise >= 2 ? 'text-red-400' : 'text-cyan-400'}`}>{tempRise}°C</p></div></div>
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 mb-4"><div className="flex justify-between text-sm mb-2"><span className="text-slate-400">CO₂ Level</span><span className="text-white">{co2}</span></div><input type="range" min="280" max="600" value={co2} onChange={(e) => setCo2(Number(e.target.value))} className="w-full" /><div className="mt-3"><p className="text-slate-500 text-sm mb-1">Arctic ice cover: {iceCover}%</p><div className="h-3 bg-slate-800 rounded-full"><div className="h-full bg-cyan-400 rounded-full" style={{ width: `${iceCover}%` }} /></div></div></div>
        <p className="text-slate-500 text-sm font-bold uppercase mb-2">Feedback loops</p><div className="space-y-2 mb-4">{FEEDBACK_LOOPS.map((f) => <button key={f.id} onClick={() => selectLoop(f.id)} className={`w-full p-3 rounded-xl border text-left ${selectedLoop === f.id ? 'border-orange-500 bg-orange-950/20' : 'border-slate-800 bg-slate-900'}`}><p className="text-white text-sm font-bold">{f.emoji} {f.name}</p><p className="text-slate-500 text-sm">{f.type} feedback · 🇮🇳 {f.india}</p></button>)}</div>
        {loop && <div className="bg-red-950/30 rounded-xl p-3 border border-red-900/30 text-red-200 text-sm">{loop.type === 'positive' ? 'Amplifying loop' : 'Stabilising loop'}: {loop.name}. India impact: {loop.india}</div>}
      </div>
    </AcademyShell>
  );
}
