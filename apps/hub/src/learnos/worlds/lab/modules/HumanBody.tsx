// src/worlds/lab/modules/HumanBody.tsx
import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LabShell from '../LabShell';
import { useLumoOwl } from '../hooks/useLumoOwl';
import { useLabProgress } from '../hooks/useLabProgress';
import { useLabSession } from '../hooks/useLabSession';
import { BODY_SYSTEMS } from '../data/labContent';

export default function HumanBody() {
  const { t } = useTranslation();
  const lumo = useLumoOwl('human-body');
  const { recordBodySystem, updateCertification } = useLabProgress();
  const { trackEvent } = useLabSession();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [explored, setExplored] = useState<string[]>([]);

  const system = BODY_SYSTEMS.find(s => s.id === selectedSystem);

  const handleSelectSystem = useCallback(async (sysId: string) => {
    setSelectedSystem(sysId); setSelectedOrgan(null);
    if (!explored.includes(sysId)) { setExplored(p => [...p, sysId]); await recordBodySystem(sysId); }
    await updateCertification('human-body', 'explorer');
    await trackEvent('human-body', 'canvas_interaction');
    const sys = BODY_SYSTEMS.find(s => s.id === sysId);
    if (sys) lumo.show(`The ${sys.name} System: ${sys.function}`, 'speaking');
    if (explored.length + 1 >= BODY_SYSTEMS.length) lumo.show("Your body is an ecosystem! Organs depend on each other.", 'celebrating');
  }, [explored, recordBodySystem, updateCertification, trackEvent, lumo]);

  return (
    <LabShell module="human-body" subject="biology">
      <div className="min-h-screen bg-red-50 flex flex-col p-6 pb-24">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-red-100 mb-4">
          <h2 className="font-bold text-lg"><Trans i18nKey="auto.humanbody.human_body_systems">🫀 Human Body Systems</Trans></h2>
          <p className="text-sm text-slate-500">{t('lab.modules.HumanBody.txt_Explorehow', 'Explore how your body works!')}</p>
        </div>

        {/* System selector */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {BODY_SYSTEMS.map(sys => (
            <button key={sys.id} onClick={() => handleSelectSystem(sys.id)}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 min-h-[60px] transition-all ${selectedSystem === sys.id ? 'scale-105 shadow-lg' : 'bg-white'}`}
              style={{ borderColor: selectedSystem === sys.id ? sys.color : '#E2E8F0', backgroundColor: selectedSystem === sys.id ? `${sys.color}15` : undefined }}>
              <span className="text-2xl">{sys.emoji}</span>
              <div className="text-left"><p className="font-bold text-sm text-slate-800">{sys.name}</p>
                {explored.includes(sys.id) && <p className="text-sm text-green-500">{t('lab.modules.HumanBody.txt_Explored', '✓ Explored')}</p>}
              </div>
            </button>
          ))}
        </div>

        {/* System details */}
        <AnimatePresence mode="wait">
          {system && (
            <motion.div key={system.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-4">
                <p className="text-sm font-bold text-slate-700 mb-1">{system.function}</p>
                <p className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">💡 {system.interestingFact}</p>
              </div>

              <p className="text-sm text-slate-400 font-bold mb-2">{t('lab.modules.HumanBody.txt_ORGANS', 'ORGANS')}</p>
              <div className="space-y-2">
                {system.organs.map(organ => (
                  <button key={organ.id} onClick={() => setSelectedOrgan(selectedOrgan === organ.id ? null : organ.id)}
                    className={`w-full bg-white rounded-2xl p-4 border-2 text-left transition-all ${selectedOrgan === organ.id ? 'border-red-300 bg-red-50' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3"><span className="text-3xl">{organ.emoji}</span><div><p className="font-bold text-slate-800">{organ.name}</p>
                      {selectedOrgan === organ.id && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-600 mt-1">{organ.fact}</motion.p>}
                    </div></div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {explored.length >= BODY_SYSTEMS.length && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-4 text-white text-center">
            <div className="text-3xl mb-1">❤️🫁🦴🫃</div><p className="font-bold">{t('lab.modules.HumanBody.txt_AllSystems', 'All Systems Explored!')}</p>
          </motion.div>
        )}
      </div>
    </LabShell>
  );
}
