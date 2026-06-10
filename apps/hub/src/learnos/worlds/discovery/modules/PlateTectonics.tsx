// src/worlds/discovery/modules/PlateTectonics.tsx
import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { useDiscoverySession } from '../hooks/useDiscoverySession';
import { useConceptBridges } from '../hooks/useConceptBridges';

const BOUNDARIES = [
  { id: 'convergent', name: 'Convergent', emoji: '⛰️', effect: 'Mountains form', indian: 'Indian Plate → Eurasian Plate = Himalayas!' },
  { id: 'divergent', name: 'Divergent', emoji: '🌊', effect: 'New ocean floor', indian: 'Red Sea widening as Africa and Arabia pull apart' },
  { id: 'transform', name: 'Transform', emoji: '🌍', effect: 'Earthquakes', indian: 'Similar to San Andreas fault mechanism' },
  { id: 'subduction', name: 'Subduction', emoji: '🌋', effect: 'Volcanoes', indian: 'Andaman Islands formed by subduction' },
];

export default function PlateTectonics() {
  const { t } = useTranslation();
  const lumo = useLumoSage();
  const { recordTectonics } = useDiscoveryProgress();
  const { trackEvent } = useDiscoverySession();
  useConceptBridges('plate-tectonics');
  const [selected, setSelected] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState<string[]>([]);

  const handleSelect = useCallback(async (id: string) => {
    setSelected(id);
    if (!discovered.includes(id)) {
      setDiscovered(p => [...p, id]);
      await recordTectonics(id);
      await trackEvent('plate-tectonics', 'correct_answer', { boundary: id });
      if (id === 'convergent') lumo.afterDiscovery();
    }
  }, [discovered, recordTectonics, trackEvent, lumo]);

  const info = BOUNDARIES.find(b => b.id === selected);

  return (
    <DiscoveryShell module="plate-tectonics">
      <div className="flex-1 flex flex-col p-5 bg-slate-900 pb-24">
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4">
          <p className="text-white font-bold text-sm">{t('discovery.modules.PlateTectonics.txt_MovingCont', '🌍 Moving Continents')}</p>
          <p className="text-slate-400 text-sm mt-1"><Trans i18nKey="auto.platetectonics.discover_what_happens_at_plate">Discover what happens at plate boundaries (</Trans>{discovered.length}<Trans i18nKey="auto.platetectonics.4">/4)</Trans></p>
          <div className="flex gap-1 mt-2">{BOUNDARIES.map(b => <div key={b.id} className={`flex-1 h-1.5 rounded-full ${discovered.includes(b.id) ? 'bg-indigo-500' : 'bg-slate-700'}`} />)}</div>
        </div>

        {/* Visual plate scene */}
        <div className="bg-gradient-to-b from-slate-800 to-orange-950 rounded-2xl border border-slate-700 mb-4 overflow-hidden" style={{ height: '160px' }}>
          <div className="w-full h-full relative flex items-center justify-center gap-2">
            <motion.div animate={{ x: selected === 'convergent' ? 20 : selected === 'divergent' ? -30 : 0 }} className="w-1/3 h-3/4 bg-blue-900/60 border-2 border-blue-500/40 rounded-lg flex items-center justify-center text-2xl">🏔️</motion.div>
            <div className={`w-1 h-3/4 transition-all ${selected ? 'bg-orange-500' : 'bg-slate-600'}`} />
            <motion.div animate={{ x: selected === 'convergent' ? -20 : selected === 'divergent' ? 30 : 0 }} className="w-1/3 h-3/4 bg-green-900/60 border-2 border-green-500/40 rounded-lg flex items-center justify-center text-2xl">🌿</motion.div>
            {selected === 'subduction' && <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: -20, opacity: 1 }} className="absolute text-4xl">🌋</motion.div>}
            {selected === 'transform' && <motion.div animate={{ x: [-5,5,-5] }} transition={{ repeat: Infinity, duration: 0.3 }} className="absolute text-3xl">💥</motion.div>}
          </div>
        </div>

        {/* Boundary buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {BOUNDARIES.map(b => (
            <button key={b.id} onClick={() => handleSelect(b.id)}
              className={`bg-slate-800 rounded-2xl p-3 text-left border transition-all min-h-[70px] ${selected === b.id ? 'border-indigo-500 bg-indigo-950/30' : discovered.includes(b.id) ? 'border-indigo-700/50' : 'border-slate-700'}`}>
              <div className="text-lg mb-1">{b.emoji}</div>
              <p className="text-white text-sm font-bold">{b.name}</p>
              <p className="text-slate-500 text-sm">{b.effect}</p>
            </button>
          ))}
        </div>

        {/* Info panel */}
        <AnimatePresence>{info && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <p className="text-white font-bold text-sm mb-1">{info.emoji} {info.name}</p>
            <p className="text-slate-300 text-sm mb-2">{info.effect}</p>
            <p className="text-amber-400 text-sm font-medium">🇮🇳 {info.indian}</p>
          </motion.div>
        )}</AnimatePresence>
      </div>
    </DiscoveryShell>
  );
}
