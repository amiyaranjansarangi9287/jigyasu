// src/worlds/academy/modules/ProjectileMotion.tsx
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import AcademyShell from '../AcademyShell';
import { useLumoAncient } from '../hooks/useLumoAncient';
import { useAcademyProgress } from '../hooks/useAcademyProgress';

export default function ProjectileMotion() {
  const { t } = useTranslation();
  const lumo = useLumoAncient();
  const { recordProjectile } = useAcademyProgress();
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(30);
  const [fired, setFired] = useState(false);
  const g = 9.8;
  const rad = angle * Math.PI / 180;
  const range = Math.round((speed * speed * Math.sin(2 * rad) / g) * 100) / 100;
  const maxH = Math.round((speed * speed * Math.sin(rad) * Math.sin(rad) / (2 * g)) * 100) / 100;
  const tof = Math.round((2 * speed * Math.sin(rad) / g) * 100) / 100;

  const handleFire = useCallback(async () => {
    setFired(true);
    const optimal = angle === 45;
    await recordProjectile(optimal, false, true);
    if (optimal) lumo.afterProfoundDiscovery();
  }, [angle, recordProjectile, lumo]);

  return (
    <AcademyShell module="projectile-motion">
      <div className="flex-1 flex flex-col p-5 bg-slate-950 pb-24">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 mb-4 overflow-hidden" style={{ height: '180px' }}>
          <div className="w-full h-full relative">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700" />
            {fired && (
              <motion.div initial={{ x: 0, y: 0 }} animate={{ x: range * 2, y: [-maxH * 2, 0] }} transition={{ duration: tof * 0.3, ease: 'easeOut' }} className="absolute bottom-1 left-4 text-2xl">🚀</motion.div>
            )}
            <div className="absolute bottom-2 left-4 text-slate-600 text-sm">{angle}°</div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
            <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">{t('academy.modules.ProjectileMotion.spn_LaunchAngl', 'Launch Angle')}</span><span className="text-white font-bold">{angle}°</span></div>
            <input type="range" min={5} max={85} value={angle} onChange={e => { setAngle(Number(e.target.value)); setFired(false); }} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#0EA5E9' }} />
          </div>
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
            <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">{t('academy.modules.ProjectileMotion.spn_InitialSpe', 'Initial Speed')}</span><span className="text-white font-bold">{speed} m/s</span></div>
            <input type="range" min={10} max={80} value={speed} onChange={e => { setSpeed(Number(e.target.value)); setFired(false); }} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#0EA5E9' }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800"><p className="text-cyan-400 text-sm font-bold">{t('academy.modules.ProjectileMotion.txt_Range', 'Range')}</p><p className="text-white font-mono font-bold">{range}m</p></div>
          <div className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800"><p className="text-amber-400 text-sm font-bold">{t('academy.modules.ProjectileMotion.txt_MaxHeight', 'Max Height')}</p><p className="text-white font-mono font-bold">{maxH}m</p></div>
          <div className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800"><p className="text-purple-400 text-sm font-bold">{t('academy.modules.ProjectileMotion.txt_Time', 'Time')}</p><p className="text-white font-mono font-bold">{tof}s</p></div>
        </div>

        <button onClick={handleFire} className="w-full py-4 bg-cyan-600 text-white font-bold rounded-2xl min-h-[52px]">{t('academy.modules.ProjectileMotion.btn_Fire', '🚀 Fire!')}</button>

        {fired && angle === 45 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 bg-cyan-900/20 border border-cyan-700/30 rounded-2xl p-4 text-center">
            <p className="text-cyan-400 font-bold text-sm">{t('academy.modules.ProjectileMotion.txt_45MaximumR', '🎯 45° = Maximum Range!')}</p>
            <p className="text-slate-400 text-sm mt-1">{t('academy.modules.ProjectileMotion.txt_Rusin2gMax', 'R = u²sin(2θ)/g. Max when sin(2θ) = 1, θ = 45°')}</p>
          </motion.div>
        )}
      </div>
    </AcademyShell>
  );
}
