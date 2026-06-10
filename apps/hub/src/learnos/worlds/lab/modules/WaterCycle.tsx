// src/worlds/lab/modules/WaterCycle.tsx
// Interactive water cycle simulation with sun intensity control

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import WaterCycleCanvas from './WaterCycleCanvas';

export default function WaterCycle() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [sunIntensity, setSunIntensity] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleIntensityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSunIntensity(val);
    LearningService.trackEvent(
      'water-cycle-session',
      'lab',
      language,
      'canvas_interaction',
      'water-cycle',
      { sunIntensity: val }
    );
  }, [language]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌧️</div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            {t('lab.watercycle.title', { defaultValue: 'The Water Cycle' })}
          </h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.WaterCycle.txt_Controlthe', 'Control the sun and watch water evaporate, condense, and rain!')}</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={togglePlay}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              isPlaying
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <WaterCycleCanvas sunIntensity={sunIntensity} isPlaying={isPlaying} />
        </div>

        {/* Sun intensity slider */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{t('lab.modules.WaterCycle.spn_Lowsun', '🌥️ Low sun')}</span>
            <span className="text-sm text-slate-400">{t('lab.modules.WaterCycle.spn_Intensesun', '☀️ Intense sun')}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={sunIntensity}
            onChange={handleIntensityChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #94A3B8 0%, #F59E0B 100%)`,
            }}
          />
          <div className="text-center mt-2 text-sm text-slate-400">
            <Trans i18nKey="auto.watercycle.sun_intensity">Sun intensity:</Trans> {Math.round(sunIntensity * 100)}%
          </div>
        </div>

        {/* 4 stages */}
        <div className="mt-6 grid grid-cols-4 gap-3">
          <div className="bg-amber-50 rounded-2xl p-3 text-center">
            <div className="text-2xl mb-1">☀️</div>
            <div className="font-bold text-amber-600 text-sm"><Trans i18nKey="auto.watercycle.evaporation">Evaporation</Trans></div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 text-center">
            <div className="text-2xl mb-1">☁️</div>
            <div className="font-bold text-slate-600 text-sm"><Trans i18nKey="auto.watercycle.condensation">Condensation</Trans></div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-3 text-center">
            <div className="text-2xl mb-1">🌧️</div>
            <div className="font-bold text-blue-600 text-sm"><Trans i18nKey="auto.watercycle.precipitation">Precipitation</Trans></div>
          </div>
          <div className="bg-green-50 rounded-2xl p-3 text-center">
            <div className="text-2xl mb-1">🌊</div>
            <div className="font-bold text-green-600 text-sm"><Trans i18nKey="auto.watercycle.collection">Collection</Trans></div>
          </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.WaterCycle.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1"><Trans i18nKey="auto.watercycle.indian_monsoon_connection">Indian Monsoon Connection</Trans></h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                <Trans i18nKey="auto.watercycle.the_indian_monsoon_is_the_worl">The Indian monsoon is the world's largest water cycle event! Ancient Indians tracked
                                              this through</Trans> <strong><Trans i18nKey="auto.watercycle.nakshatras">Nakshatras</Trans></strong> <Trans i18nKey="auto.watercycle.lunar_mansions_and_built_stepw">(lunar mansions) and built stepwells like</Trans>
                                              <strong> <Trans i18nKey="auto.watercycle.chand_baori">Chand Baori</Trans></strong> <Trans i18nKey="auto.watercycle.800_ce_to_harvest_rainwater_en">(800 CE) to harvest rainwater — engineering that
                                              modern scientists still study today.</Trans>
                                            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
