// src/worlds/discovery/modules/SpeedDistanceTime.tsx
import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { ScientificSlider } from '@/worlds/lab/components/ScientificSlider';

export default function SpeedDistanceTime() {
  const { t } = useTranslation();
  const lumo = useLumoSage();
  const { recordSpeedGraph, updateMastery } = useDiscoveryProgress();
  const [speed, setSpeed] = useState(60);

  const handleDiscover = useCallback(async () => {
    lumo.afterDiscovery();
    await recordSpeedGraph(true, false);
    await updateMastery('speed-distance-time', 'apply');
  }, [lumo, recordSpeedGraph, updateMastery]);

  return (
    <DiscoveryShell module="speed-distance-time">
      <div className="flex-1 flex flex-col p-6 bg-slate-900">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-6 flex justify-between items-center"><h2 className="text-white font-bold"><Trans i18nKey="auto.speeddistancetime.speed_monitor">Speed Monitor</Trans></h2><div className="bg-indigo-600 px-3 py-1 rounded-full text-white font-mono font-bold">{speed} <Trans i18nKey="auto.speeddistancetime.km_h">km/h</Trans></div></div>
        <div className="flex-1 bg-white/5 border border-slate-800 rounded-3xl mb-6 relative overflow-hidden flex items-center">
          <div className="w-full h-1 bg-slate-800 absolute bottom-1/2" />
          <motion.div animate={{ x: ['-20%', '120%'] }} transition={{ duration: 120/speed, repeat: Infinity, ease: 'linear' }} className="text-5xl">🚀</motion.div>
        </div>
        <div className="mb-6"><ScientificSlider label={t('auto.attr.speeddistancetime.engine_output_speed')} emoji="⚡" value={speed} min={10} max={120} unit="km/h" color="#6366F1" onChange={setSpeed} /></div>
        <button onClick={handleDiscover} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl">{t('discovery.modules.SpeedDistanceTime.btn_ConfirmSpe', 'Confirm Speed Discovery')}</button>
      </div>
    </DiscoveryShell>
  );
}
