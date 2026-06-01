// src/worlds/lab/modules/Photosynthesis.tsx
// Interactive photosynthesis simulation with sun intensity control

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import PhotosynthesisCanvas from './PhotosynthesisCanvas';

export default function Photosynthesis() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [sunIntensity, setSunIntensity] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleIntensityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSunIntensity(val);
    LearningService.trackEvent(
      'photosynthesis-session',
      'lab',
      language,
      'canvas_interaction',
      'photosynthesis',
      { sunIntensity: val }
    );
  }, [language]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            {t('lab.photosynthesis.title', { defaultValue: 'Photosynthesis' })}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Watch how plants turn sunlight into food!
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={togglePlay}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              isPlaying
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <PhotosynthesisCanvas sunIntensity={sunIntensity} isPlaying={isPlaying} />
        </div>

        {/* Sun intensity slider */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">🌥️ Low light</span>
            <span className="text-sm text-slate-400">☀️ Bright sun</span>
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
            Sun intensity: {Math.round(sunIntensity * 100)}%
          </div>
        </div>

        {/* Equation */}
        <div className="mt-6 bg-green-50 rounded-2xl p-5 text-center">
          <div className="text-sm text-green-600 font-mono font-bold">
            6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂
          </div>
          <div className="text-sm text-green-500 mt-2">
            Carbon dioxide + Water + Sunlight → Glucose + Oxygen
          </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌾</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1">Indian Agriculture Connection</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                India's Green Revolution (1960s) maximized photosynthesis through better crop varieties.
                Ancient Indians understood plant nutrition through <strong>Vrikshayurveda</strong>
                (Science of Plant Life), documented ~1000 BCE — describing how sunlight, water, and
                soil nourish plants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
