// src/worlds/discovery/modules/PeriodicTableExplorer.tsx
import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import DiscoveryShell from '../DiscoveryShell';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { useDiscoverySession } from '../hooks/useDiscoverySession';

const ELEMENTS = [
  { symbol: 'H', name: 'Hydrogen', num: 1, color: '#60A5FA', use: 'Rockets, fuel cells', fact: 'Most abundant in universe' },
  { symbol: 'C', name: 'Carbon', num: 6, color: '#6B7280', use: 'All life, diamonds', fact: 'Forms more compounds than any element' },
  { symbol: 'O', name: 'Oxygen', num: 8, color: '#F87171', use: 'Breathing, steel', fact: 'Third most abundant in universe' },
  { symbol: 'Fe', name: 'Iron', num: 26, color: '#9CA3AF', use: 'Steel, buildings', fact: 'Delhi Iron Pillar: 1600 years without rust! 🇮🇳' },
  { symbol: 'Au', name: 'Gold', num: 79, color: '#F59E0B', use: 'Jewellery, electronics', fact: 'India is world\'s largest gold consumer 🇮🇳' },
  { symbol: 'Si', name: 'Silicon', num: 14, color: '#A78BFA', use: 'Microchips, solar panels', fact: 'Second most abundant in Earth\'s crust' },
];

export default function PeriodicTableExplorer() {
  const { t } = useTranslation();
  const { recordElementExplored } = useDiscoveryProgress();
  const { trackEvent } = useDiscoverySession();
  const [selected, setSelected] = useState<string | null>(null);
  const [explored, setExplored] = useState<string[]>([]);

  const handleSelect = useCallback(async (sym: string) => {
    setSelected(sym);
    if (!explored.includes(sym)) { setExplored(p => [...p, sym]); await recordElementExplored(sym); await trackEvent('periodic-table', 'canvas_interaction'); }
  }, [explored, recordElementExplored, trackEvent]);

  const el = ELEMENTS.find(e => e.symbol === selected);

  return (
    <DiscoveryShell module="periodic-table">
      <div className="flex-1 flex flex-col p-5 bg-slate-900 pb-24">
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4">
          <p className="text-white font-bold">{t('discovery.modules.PeriodicTableExplorer.txt_PeriodicTa', '🧪 Periodic Table Explorer')}</p>
          <p className="text-slate-400 text-sm mt-1"><Trans i18nKey="auto.periodictableexplorer.tap_elements_to_discover_patte">Tap elements to discover patterns (</Trans>{explored.length}/{ELEMENTS.length})</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">{ELEMENTS.map(e => (
          <button key={e.symbol} onClick={() => handleSelect(e.symbol)}
            className={`rounded-2xl p-4 border-2 text-center transition-all min-h-[80px] ${selected === e.symbol ? 'border-indigo-500 scale-105' : explored.includes(e.symbol) ? 'border-slate-600' : 'border-slate-700'}`}
            style={{ backgroundColor: `${e.color}15` }}>
            <div className="text-2xl font-extrabold" style={{ color: e.color }}>{e.symbol}</div>
            <div className="text-slate-400 text-sm font-bold mt-1">{e.name}</div>
            <div className="text-slate-600 text-sm">{e.num}</div>
          </button>
        ))}</div>
        <AnimatePresence>{el && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-2"><div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-extrabold" style={{ backgroundColor: `${el.color}33`, color: el.color }}>{el.symbol}</div>
              <div><p className="text-white font-bold">{el.name}</p><p className="text-slate-500 text-sm"><Trans i18nKey="auto.periodictableexplorer.atomic_number">Atomic number:</Trans> {el.num}</p></div></div>
            <p className="text-slate-300 text-sm mb-1"><Trans i18nKey="auto.periodictableexplorer.used_in">Used in:</Trans> {el.use}</p>
            <p className="text-amber-400 text-sm font-medium">{el.fact}</p>
          </motion.div>
        )}</AnimatePresence>
      </div>
    </DiscoveryShell>
  );
}
