// src/worlds/academy/modules/RedoxReactions.tsx
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import AcademyShell from '../AcademyShell';
import { useLumoAncient } from '../hooks/useLumoAncient';
import { useAcademyProgress } from '../hooks/useAcademyProgress';

const CONTEXTS = [
  { id: 'rust', title: 'Rust', emoji: '🪨', ox: 'Fe → Fe³⁺ + 3e⁻', red: 'O₂ + 4e⁻ → 2O²⁻', note: 'Iron loses electrons to oxygen. Brown product = iron oxide.', indian: 'India loses thousands of crores annually to corrosion' },
  { id: 'battery', title: 'Zinc-Copper Battery', emoji: '🔋', ox: 'Zn → Zn²⁺ + 2e⁻', red: 'Cu²⁺ + 2e⁻ → Cu', note: 'Zinc gives electrons to copper. Electron flow = electricity!', indian: 'EV batteries (Ola, Tata Nexon) use variants of this' },
  { id: 'water', title: 'Water Electrolysis', emoji: '💧', ox: '2H₂O → O₂ + 4H⁺ + 4e⁻', red: '2H⁺ + 2e⁻ → H₂', note: 'Electricity splits water into H₂ and O₂.', indian: 'India\'s Green Hydrogen Mission uses this with solar power' },
];

export default function RedoxReactions() {
  const { t } = useTranslation();
  const lumo = useLumoAncient();
  const { recordRedox } = useAcademyProgress();
  const [ctxIdx, setCtxIdx] = useState(0);
  const [showElectrons, setShowElectrons] = useState(false);
  const ctx = CONTEXTS[ctxIdx];

  const handleExplore = useCallback(async () => {
    setShowElectrons(true);
    await recordRedox(true, true, ctxIdx === 1);
    if (ctxIdx === 1) lumo.afterProfoundDiscovery();
  }, [ctxIdx, recordRedox, lumo]);

  return (
    <AcademyShell module="redox-reactions">
      <div className="flex-1 flex flex-col p-5 bg-slate-950 pb-24">
        {/* Context selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">{CONTEXTS.map((c, i) => (
          <button key={c.id} onClick={() => { setCtxIdx(i); setShowElectrons(false); }} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold min-h-[44px] ${ctxIdx === i ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>{c.emoji} {c.title}</button>
        ))}</div>

        {/* Electrochemical cell visual */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 mb-4 overflow-hidden" style={{ height: '160px' }}>
          <div className="w-full h-full flex items-center justify-center gap-8 relative">
            {/* Anode */}
            <div className="text-center"><div className="w-12 h-24 bg-slate-600 rounded-lg mb-1" /><p className="text-red-400 text-sm font-bold">{t('academy.modules.RedoxReactions.txt_Anode', 'Anode (−)')}</p><p className="text-slate-500 text-sm">{t('academy.modules.RedoxReactions.txt_Oxidation', 'Oxidation')}</p></div>
            {/* Electron flow */}
            {showElectrons && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
                {[0,1,2].map(i => <motion.div key={i} animate={{ x: [0, 40, 80] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} className="w-2 h-2 rounded-full bg-yellow-400" />)}
                <p className="text-yellow-400 text-sm ml-2">{t('academy.modules.RedoxReactions.txt_e', 'e⁻ →')}</p>
              </div>
            )}
            {/* Wire */}
            <div className="w-20 h-0.5 bg-yellow-600" />
            {/* Cathode */}
            <div className="text-center"><div className="w-12 h-24 bg-amber-700 rounded-lg mb-1" /><p className="text-blue-400 text-sm font-bold">{t('academy.modules.RedoxReactions.txt_Cathode', 'Cathode (+)')}</p><p className="text-slate-500 text-sm">{t('academy.modules.RedoxReactions.txt_Reduction', 'Reduction')}</p></div>
          </div>
        </div>

        {/* Half reactions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-red-950/30 rounded-xl p-3 border border-red-900/30">
            <p className="text-red-400 text-sm font-bold mb-1">{t('academy.modules.RedoxReactions.txt_Oxidation', 'Oxidation')}</p>
            <p className="text-white text-sm font-mono">{ctx.ox}</p>
            <p className="text-slate-500 text-sm mt-1">{t('academy.modules.RedoxReactions.txt_Loseselect', 'Loses electrons')}</p>
          </div>
          <div className="bg-blue-950/30 rounded-xl p-3 border border-blue-900/30">
            <p className="text-blue-400 text-sm font-bold mb-1">{t('academy.modules.RedoxReactions.txt_Reduction', 'Reduction')}</p>
            <p className="text-white text-sm font-mono">{ctx.red}</p>
            <p className="text-slate-500 text-sm mt-1">{t('academy.modules.RedoxReactions.txt_Gainselect', 'Gains electrons')}</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 mb-4">
          <p className="text-slate-300 text-sm leading-relaxed">{ctx.note}</p>
          <p className="text-amber-400 text-sm font-medium mt-2">🇮🇳 {ctx.indian}</p>
        </div>

        <button onClick={handleExplore} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl min-h-[52px]">{showElectrons ? '⚡ Electrons Flowing!' : '⚡ Show Electron Transfer'}</button>
      </div>
    </AcademyShell>
  );
}
