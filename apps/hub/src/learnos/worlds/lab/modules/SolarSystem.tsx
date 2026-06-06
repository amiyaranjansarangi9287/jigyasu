// src/worlds/lab/modules/SolarSystem.tsx
// Interactive solar system simulation with speed control

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import SolarSystemCanvas from './SolarSystemCanvas';

export default function SolarSystem() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [speed, setSpeed] = useState(1);

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSpeed(val);
    LearningService.trackEvent(
      'solar-system-session',
      'lab',
      language,
      'canvas_interaction',
      'solar-system',
      { speed: val }
    );
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌌</div>
          <h1 className="text-3xl font-extrabold text-white">
            {t('lab.solarsystem.title', { defaultValue: 'Solar System' })}
          </h1>
          <p className="text-sm text-slate-400 mt-2">{t('lab.modules.SolarSystem.txt_Watchthepl', 'Watch the planets orbit the Sun!')}</p>
        </div>

        {/* Canvas */}
        <div className="bg-slate-800/50 rounded-3xl shadow-sm border border-slate-700/50 p-4 mb-6">
          <SolarSystemCanvas speed={speed} highlightPlanet={-1} />
        </div>

        {/* Speed slider */}
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{t('lab.modules.SolarSystem.spn_Slow', '🐢 Slow')}</span>
            <span className="text-sm text-slate-400">{t('lab.modules.SolarSystem.spn_Fast', '🚀 Fast')}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={speed}
            onChange={handleSpeedChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #6366F1 0%, #8B5CF6 50%, #F59E0B 100%)`,
            }}
          />
          <div className="text-center mt-2 text-sm text-slate-400">
            Speed: {speed.toFixed(1)}x
          </div>
        </div>

        {/* Planet facts */}
        <div className="mt-6 grid grid-cols-4 gap-3">
          <div className="bg-yellow-900/20 rounded-xl p-3 text-center border border-yellow-700/30">
            <div className="text-xl mb-1">☀️</div>
            <div className="font-bold text-yellow-300 text-sm">Sun</div>
          </div>
          <div className="bg-gray-700/30 rounded-xl p-3 text-center border border-gray-600/30">
            <div className="text-xl mb-1">🌍</div>
            <div className="font-bold text-blue-300 text-sm">Earth</div>
          </div>
          <div className="bg-red-900/20 rounded-xl p-3 text-center border border-red-700/30">
            <div className="text-xl mb-1">🪐</div>
            <div className="font-bold text-red-300 text-sm">Saturn</div>
          </div>
          <div className="bg-orange-900/20 rounded-xl p-3 text-center border border-orange-700/30">
            <div className="text-xl mb-1">🔴</div>
            <div className="font-bold text-orange-300 text-sm">Mars</div>
          </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.SolarSystem.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-400 font-bold text-sm mb-1">Ancient Indian Astronomy</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Aryabhata (499 CE) calculated Earth's circumference with 99% accuracy and described
                heliocentric motion 1,000 years before Copernicus! The <strong>Surya Siddhanta</strong>
                (400 CE) described planetary orbits and eclipses with remarkable precision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
