// src/worlds/discovery/modules/CarbonCycle.tsx
import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { useDiscoverySession } from '../hooks/useDiscoverySession';

const RESERVOIRS = [
  { id: 'atmosphere', name: 'Atmosphere', emoji: '☁️', amount: '860B tonnes', color: '#60A5FA' },
  { id: 'oceans', name: 'Oceans', emoji: '🌊', amount: '38,000B tonnes', color: '#0EA5E9' },
  { id: 'plants', name: 'Plants', emoji: '🌿', amount: '560B tonnes', color: '#22C55E' },
  { id: 'fossil', name: 'Fossil Fuels', emoji: '⛽', amount: '4,000B tonnes', color: '#374151' },
];

const FLOWS = [
  { id: 'photo', from: 'atmosphere', to: 'plants', name: 'Photosynthesis', human: false },
  { id: 'resp', from: 'plants', to: 'atmosphere', name: 'Respiration', human: false },
  { id: 'dissolve', from: 'atmosphere', to: 'oceans', name: 'Dissolution', human: false },
  { id: 'burn', from: 'fossil', to: 'atmosphere', name: 'Combustion', human: true },
];

export default function CarbonCycle() {
  const { t } = useTranslation();
  const lumo = useLumoSage();
  const { recordCarbonFlow } = useDiscoveryProgress();
  const { trackEvent } = useDiscoverySession();
  const [selected, setSelected] = useState<string | null>(null);
  const [humanSlider, setHumanSlider] = useState(1);
  const [tracked, setTracked] = useState<string[]>([]);

  const handleFlow = useCallback(async (flowId: string, isHuman: boolean) => {
    setSelected(flowId);
    if (!tracked.includes(flowId)) { setTracked(p => [...p, flowId]); await recordCarbonFlow(flowId, isHuman); await trackEvent('carbon-cycle', 'canvas_interaction'); }
    if (isHuman) lumo.show("We release ancient carbon 10,000× faster than it accumulated.", 'thinking');
  }, [tracked, recordCarbonFlow, trackEvent, lumo]);

  return (
    <DiscoveryShell module="carbon-cycle">
      <div className="flex-1 flex flex-col p-5 bg-slate-900 pb-24">
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4">
          <p className="text-white font-bold">{t('discovery.modules.CarbonCycle.txt_CarbonCycl', '🌿 Carbon Cycle')}</p>
          <p className="text-slate-400 text-sm mt-1"><Trans i18nKey="auto.carboncycle.a_carbon_atom_has_been_in_dino">A carbon atom has been in dinosaurs, oceans, and you (</Trans>{tracked.length}/{FLOWS.length} <Trans i18nKey="auto.carboncycle.flows_tracked">flows tracked)</Trans></p>
        </div>

        {/* Reservoirs */}
        <div className="grid grid-cols-2 gap-3 mb-4">{RESERVOIRS.map(r => (
          <div key={r.id} className="bg-slate-800 rounded-xl p-3 border border-slate-700 text-center">
            <div className="text-2xl mb-1">{r.emoji}</div>
            <p className="text-white text-sm font-bold">{r.name}</p>
            <p className="text-slate-500 text-sm">{r.amount}</p>
          </div>
        ))}</div>

        {/* Flows */}
        <p className="text-slate-500 text-sm font-bold mb-2">{t('discovery.modules.CarbonCycle.txt_CARBONFLOW', 'CARBON FLOWS')}</p>
        <div className="space-y-2 mb-4">{FLOWS.map(f => (
          <button key={f.id} onClick={() => handleFlow(f.id, f.human)}
            className={`w-full bg-slate-800 rounded-xl p-3 border text-left flex items-center gap-3 min-h-[52px] transition-all ${selected === f.id ? 'border-green-500' : tracked.includes(f.id) ? 'border-slate-600' : 'border-slate-700'}`}>
            <span className="text-lg">{f.human ? '🏭' : '🔄'}</span>
            <div><p className="text-white text-sm font-bold">{f.name}</p><p className="text-slate-500 text-sm">{f.from} → {f.to}{f.human ? ' ⚠️ Human-caused' : ''}</p></div>
            {tracked.includes(f.id) && <span className="ml-auto text-green-500 text-sm">{t('discovery.modules.CarbonCycle.spn_', '✓')}</span>}
          </button>
        ))}</div>

        {/* Human impact slider */}
        <div className="bg-red-950/30 rounded-2xl p-4 border border-red-900/30">
          <div className="flex justify-between text-sm mb-2"><span className="text-orange-400 font-bold">{t('discovery.modules.CarbonCycle.spn_FossilFuel', '🏭 Fossil Fuel Burning Rate')}</span><span className="text-white font-bold">×{humanSlider}</span></div>
          <input type="range" min={1} max={10} value={humanSlider} onChange={e => { setHumanSlider(Number(e.target.value)); if (Number(e.target.value) >= 5) lumo.show("At this rate, atmospheric CO₂ rises dangerously fast.", 'questioning'); }} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#EF4444' }} />
          <motion.div animate={{ height: humanSlider * 3 }} className="mt-3 bg-red-500/30 rounded-full mx-auto w-20 flex items-end justify-center">
            <span className="text-sm text-orange-400 pb-1">{t('discovery.modules.CarbonCycle.spn_CO', 'CO₂')}</span>
          </motion.div>
        </div>
      </div>
    </DiscoveryShell>
  );
}
