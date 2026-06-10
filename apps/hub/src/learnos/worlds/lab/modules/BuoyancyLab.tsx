// src/worlds/lab/modules/BuoyancyLab.tsx
import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LabShell from '../LabShell';
import { useLumoOwl } from '../hooks/useLumoOwl';
import { useLabProgress } from '../hooks/useLabProgress';
import { useLabSession } from '../hooks/useLabSession';
import { BUOYANCY_OBJECTS } from '../data/labContent';

export default function BuoyancyLab() {
  const { t } = useTranslation();
  const lumo = useLumoOwl('buoyancy-lab');
  const { recordBuoyancyTest, updateCertification } = useLabProgress();
  const { trackEvent } = useLabSession();
  const [tested, setTested] = useState<string[]>([]);
  const [activeObj, setActiveObj] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleDrop = useCallback(async (objId: string) => {
    setActiveObj(objId); setShowResult(true);
    if (!tested.includes(objId)) setTested(p => [...p, objId]);
    const densityUnderstood = tested.length >= 3;
    await recordBuoyancyTest(objId, densityUnderstood);
    await updateCertification('buoyancy-lab', 'explorer');
    await trackEvent('buoyancy-lab', 'canvas_interaction');
    if (densityUnderstood) lumo.show("Objects with density < 1.0 float. You discovered the pattern!", 'celebrating');
  }, [tested, recordBuoyancyTest, updateCertification, trackEvent, lumo]);

  const activeObjData = BUOYANCY_OBJECTS.find(o => o.id === activeObj);

  return (
    <LabShell module="buoyancy-lab" subject="physics">
      <div className="min-h-screen bg-cyan-50 flex flex-col p-6 pb-24">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-cyan-100 mb-4">
          <h2 className="font-bold text-lg"><Trans i18nKey="auto.buoyancylab.buoyancy_lab">Buoyancy Lab</Trans></h2>
          <p className="text-sm text-slate-500">{t('lab.modules.BuoyancyLab.txt_Dropobject', 'Drop objects into the water. Which float?')}</p>
          <div className="mt-2 text-sm text-cyan-600 bg-cyan-100 px-3 py-1 rounded-full inline-block"><Trans i18nKey="auto.buoyancylab.water_density_1_0_g_cm">Water density = 1.0 g/cm³</Trans></div>
        </div>

        {/* Water tank */}
        <div className="bg-gradient-to-b from-sky-200 to-blue-400 rounded-2xl h-40 mb-4 flex items-end justify-center overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/20" />
          <AnimatePresence>{activeObj && activeObjData && (
            <motion.div initial={{ y: -60 }} animate={{ y: activeObjData.floats ? -20 : 60 }} transition={{ type: 'spring', damping: 8 }} className="text-5xl absolute">{activeObjData.emoji}</motion.div>
          )}</AnimatePresence>
          {!activeObj && <p className="text-white/60 text-sm pb-4">{t('lab.modules.BuoyancyLab.txt_Dropanobje', 'Drop an object here')}</p>}
        </div>

        {/* Result */}
        {showResult && activeObjData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-2xl p-4 mb-4 text-center ${activeObjData.floats ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            <p className="font-bold text-lg">{activeObjData.emoji} {activeObjData.floats ? 'Floats!' : 'Sinks'}</p>
            <p className="text-sm text-slate-600"><Trans i18nKey="auto.buoyancylab.density">Density:</Trans> {activeObjData.density} — {activeObjData.density < 1 ? 'lighter' : 'heavier'} <Trans i18nKey="auto.buoyancylab.than_water">than water</Trans></p>
          </motion.div>
        )}

        {/* Objects shelf */}
        <p className="text-sm text-slate-400 font-bold mb-2"><Trans i18nKey="auto.buoyancylab.tap_to_test">TAP TO TEST (</Trans>{tested.length}/{BUOYANCY_OBJECTS.length})</p>
        <div className="grid grid-cols-3 gap-3">
          {BUOYANCY_OBJECTS.map(obj => (
            <button key={obj.id} onClick={() => handleDrop(obj.id)} className={`bg-white rounded-2xl p-3 border-2 flex flex-col items-center gap-1 min-h-[80px] transition-all ${tested.includes(obj.id) ? 'border-blue-300 opacity-60' : 'border-slate-200'}`}>
              <span className="text-3xl">{obj.emoji}</span>
              <span className="text-sm font-bold text-slate-500">{obj.name}</span>
              {tested.includes(obj.id) && <span className="text-sm">{obj.floats ? '🟢' : '🔴'}</span>}
            </button>
          ))}
        </div>
      </div>
    </LabShell>
  );
}
