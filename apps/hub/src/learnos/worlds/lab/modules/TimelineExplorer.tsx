// src/worlds/lab/modules/TimelineExplorer.tsx
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LabShell from '../LabShell';
import { useLumoOwl } from '../hooks/useLumoOwl';
import { useLabProgress } from '../hooks/useLabProgress';
import { useLabSession } from '../hooks/useLabSession';
import { TIMELINE_EVENTS } from '../data/labContent';

export default function TimelineExplorer() {
  const { t } = useTranslation();
  const lumo = useLumoOwl('timeline-explorer');
  const { recordTimelineEvent, updateCertification } = useLabProgress();
  const { trackEvent } = useLabSession();
  const [placed, setPlaced] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(TIMELINE_EVENTS[0].id);

  const handlePlace = useCallback(async (id: string) => {
    setPlaced(p => [...p, id]); lumo.showAfterDiscovery();
    const isLast = placed.length + 1 >= TIMELINE_EVENTS.length;
    if (isLast) { updateCertification('timeline-explorer', 'explorer'); recordTimelineEvent(true); trackEvent('timeline-explorer', 'correct_answer'); }
    else { recordTimelineEvent(false); trackEvent('timeline-explorer', 'canvas_interaction'); }
    const next = TIMELINE_EVENTS.find(e => !placed.includes(e.id) && e.id !== id);
    setActive(next?.id || null);
  }, [placed, lumo, updateCertification, recordTimelineEvent, trackEvent]);

  return (
    <LabShell module="timeline-explorer" subject="earth-science">
      <div className="flex flex-col h-screen bg-indigo-50 overflow-hidden">
        <div className="bg-white p-6 border-b"><h2 className="font-bold text-lg">Timeline Explorer</h2><p className="text-sm text-slate-400">{t('lab.modules.TimelineExplorer.txt_Discoverwh', 'Discover when major scientific breakthroughs happened.')}</p></div>
        <div className="flex-1 overflow-x-auto overflow-y-hidden relative p-12 whitespace-nowrap">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-indigo-200 -translate-y-1/2" />
          <div className="inline-flex gap-24 items-center h-full">
            {TIMELINE_EVENTS.sort((a,b) => a.year - b.year).map(e => (
              <div key={e.id} className="relative flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all ${placed.includes(e.id) ? 'bg-white border-indigo-500 scale-110' : 'bg-slate-100 border-slate-200 opacity-40'}`}>
                  {placed.includes(e.id) ? e.emoji : '?'}
                </div>
                <div className="mt-4 text-center"><p className={`font-bold text-sm ${placed.includes(e.id) ? 'text-indigo-900' : 'text-slate-300'}`}>{e.year < 0 ? `${Math.abs(e.year)} BCE` : e.year}</p>
                  {placed.includes(e.id) && <p className="text-sm text-indigo-400 font-medium max-w-[80px] whitespace-normal leading-tight">{e.title}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <AnimatePresence>
          {active && (
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} className="bg-white p-6 border-t shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{TIMELINE_EVENTS.find(e => e.id === active)?.emoji}</div>
                <div><p className="font-extrabold text-slate-800">{TIMELINE_EVENTS.find(e => e.id === active)?.title}</p>
                  <p className="text-sm text-slate-400 max-w-sm whitespace-normal">{TIMELINE_EVENTS.find(e => e.id === active)?.description}</p>
                </div>
              </div>
              <button onClick={() => handlePlace(active)} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Place on Timeline</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LabShell>
  );
}
