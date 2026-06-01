// src/worlds/discovery/modules/EconomicSimulation.tsx
import { useState, useCallback } from 'react';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { useDiscoverySession } from '../hooks/useDiscoverySession';

const EVENTS = [
  { id: 'monsoon', name: 'Monsoon Failure', emoji: '☀️', gdp: -2, inflation: +3, note: 'Agriculture is 15% of India\'s GDP' },
  { id: 'oil', name: 'Oil Price Rise', emoji: '🛢️', gdp: -1, inflation: +2, note: 'India imports 80% of its oil' },
  { id: 'tech', name: 'Tech Boom', emoji: '💻', gdp: +2, inflation: 0, note: 'India\'s IT sector is $250B' },
];

export default function EconomicSimulation() {
  const lumo = useLumoSage();
  const { recordEconomicSim, updateMastery } = useDiscoveryProgress();
  const { trackEvent } = useDiscoverySession();
  const [interest, setInterest] = useState(6);
  const [tax, setTax] = useState(25);
  const [gdp, setGdp] = useState(7);
  const [inflation, setInflation] = useState(5);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);

  const applyEvent = useCallback(async (ev: typeof EVENTS[0]) => {
    setActiveEvent(ev.id);
    setGdp(g => Math.max(-5, Math.min(12, g + ev.gdp)));
    setInflation(i => Math.max(0, Math.min(20, i + ev.inflation)));
    await recordEconomicSim(ev.id);
    await updateMastery('economic-simulation', 'understand');
    await trackEvent('economic-simulation', 'canvas_interaction', { event: ev.id });
    lumo.show(`${ev.name}: ${ev.note}`, 'questioning');
  }, [recordEconomicSim, updateMastery, trackEvent, lumo]);

  return (
    <DiscoveryShell module="economic-simulation">
      <div className="flex-1 flex flex-col p-5 bg-slate-900 pb-24">
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4">
          <p className="text-white font-bold">📈 Economic Dashboard</p>
          <p className="text-slate-400 text-sm mt-1">Adjust policies and apply events</p>
        </div>

        {/* Indicators */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700"><p className="text-sm text-slate-500">GDP Growth</p><p className={`text-2xl font-bold ${gdp >= 0 ? 'text-green-400' : 'text-red-400'}`}>{gdp > 0 ? '+' : ''}{gdp}%</p></div>
          <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700"><p className="text-sm text-slate-500">Inflation</p><p className={`text-2xl font-bold ${inflation > 6 ? 'text-red-400' : 'text-cyan-400'}`}>{inflation}%</p></div>
        </div>

        {/* Sliders */}
        <div className="space-y-3 mb-4">
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
            <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">🏦 Interest Rate</span><span className="text-white font-bold">{interest}%</span></div>
            <input type="range" min={1} max={15} value={interest} onChange={e => { setInterest(Number(e.target.value)); setGdp(g => Math.max(-5, g - (Number(e.target.value) - interest) * 0.3)); setInflation(i => Math.max(0, i - (Number(e.target.value) - interest) * 0.2)); }} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#6366F1' }} />
          </div>
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
            <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">💰 Tax Rate</span><span className="text-white font-bold">{tax}%</span></div>
            <input type="range" min={5} max={45} value={tax} onChange={e => setTax(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#F59E0B' }} />
          </div>
        </div>

        {/* Events */}
        <p className="text-slate-500 text-sm font-bold mb-2">APPLY EVENT</p>
        <div className="space-y-2">
          {EVENTS.map(ev => (
            <button key={ev.id} onClick={() => applyEvent(ev)} className={`w-full bg-slate-800 rounded-xl p-3 border text-left min-h-[52px] transition-all ${activeEvent === ev.id ? 'border-indigo-500' : 'border-slate-700'}`}>
              <div className="flex items-center gap-2"><span className="text-xl">{ev.emoji}</span><div><p className="text-white text-sm font-bold">{ev.name}</p><p className="text-slate-500 text-sm">GDP: {ev.gdp > 0 ? '+' : ''}{ev.gdp}% · Inflation: {ev.inflation > 0 ? '+' : ''}{ev.inflation}%</p></div></div>
            </button>
          ))}
        </div>
      </div>
    </DiscoveryShell>
  );
}
