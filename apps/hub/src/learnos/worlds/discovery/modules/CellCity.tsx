// src/worlds/discovery/modules/CellCity.tsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { useDiscoverySession } from '../hooks/useDiscoverySession';
import { Trans } from "react-i18next";

const ORG = [
  { id: 'nucleus', name: 'Nucleus', emoji: '🏢', role: 'City Hall — controls everything' },
  { id: 'mitochondria', name: 'Mitochondria', emoji: '⚡', role: 'Power plants — makes energy' },
  { id: 'ribosome', name: 'Ribosome', emoji: '🏭', role: 'Assembly lines — builds proteins' },
  { id: 'membrane', name: 'Membrane', emoji: '🧱', role: 'City walls — controls entry/exit' },
];

export default function CellCity() {
  const lumo = useLumoSage();
  const { recordCellPlacement, updateMastery } = useDiscoveryProgress();
  const { trackEvent } = useDiscoverySession();
  const [placed, setPlaced] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);

  const handlePlace = useCallback(async (id: string) => {
    if (placed.includes(id)) return;
    setPlaced(p => [...p, id]); setActive(id);
    const o = ORG.find(x => x.id === id)!;
    lumo.show(o.role, 'observing');
    await recordCellPlacement(); await updateMastery('cell-city', 'aware'); await trackEvent('cell-city', 'canvas_interaction');
  }, [placed, lumo, recordCellPlacement, updateMastery, trackEvent]);

  return (
    <DiscoveryShell module="cell-city">
      <div className="flex-1 flex flex-col p-6 bg-slate-900">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-6"><p className="text-white font-bold text-sm"><Trans i18nKey="auto.cellcity.cell_city_architect">Cell City Architect</Trans></p><p className="text-slate-400 text-sm"><Trans i18nKey="auto.cellcity.drag_organelles_to_the_cell_ci">Drag organelles to the cell city</Trans></p></div>
        <div className="flex-1 border-2 border-dashed border-slate-700 rounded-3xl relative flex items-center justify-center">
          <div className="w-64 h-64 border-4 border-indigo-500/30 rounded-full flex flex-wrap gap-4 items-center justify-center p-8">
            {placed.map(id => <motion.div key={id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl">{ORG.find(x => x.id === id)?.emoji}</motion.div>)}
          </div>
          <AnimatePresence>{active && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bottom-6 left-6 right-6 bg-slate-800 p-3 rounded-xl text-center border border-indigo-500/50">
              <p className="text-white font-bold text-sm">{ORG.find(x => x.id === active)?.name}</p><p className="text-slate-400 text-sm">{ORG.find(x => x.id === active)?.role}</p>
            </motion.div>
          )}</AnimatePresence>
        </div>
        <div className="mt-6 flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {ORG.filter(o => !placed.includes(o.id)).map(o => (
            <button key={o.id} onClick={() => handlePlace(o.id)} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col items-center gap-2 min-w-[100px]">
              <span className="text-3xl">{o.emoji}</span><span className="text-sm text-slate-400 font-bold uppercase">{o.name}</span>
            </button>
          ))}
        </div>
        {placed.length === ORG.length && <button onClick={() => setPlaced([])} className="mt-4 w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl"><Trans i18nKey="auto.cellcity.reset_cell">Reset Cell</Trans></button>}
      </div>
    </DiscoveryShell>
  );
}
