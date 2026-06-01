// src/worlds/lab/modules/BloodCirculation.tsx
// Interactive blood circulation simulation with heart rate control

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import BloodCirculationCanvas from './BloodCirculationCanvas';

export default function BloodCirculation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [heartRate, setHeartRate] = useState(72);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setHeartRate(val);
    LearningService.trackEvent(
      'blood-circulation-session',
      'lab',
      language,
      'canvas_interaction',
      'blood-circulation',
      { heartRate: val }
    );
  }, [language]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-rose-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">❤️</div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            {t('lab.bloodcirculation.title', { defaultValue: 'Blood Circulation' })}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Watch blood flow through your heart and body!
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={togglePlay}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              isPlaying
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <BloodCirculationCanvas heartRate={heartRate} isPlaying={isPlaying} />
        </div>

        {/* Heart rate slider */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">😴 Resting (60)</span>
            <span className="text-sm text-slate-400">🏃 Exercise (180)</span>
          </div>
          <input
            type="range"
            min="60"
            max="180"
            value={heartRate}
            onChange={handleRateChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #EF4444 100%)`,
            }}
          />
          <div className="text-center mt-2 text-sm text-slate-400">
            Heart rate: {heartRate} BPM
          </div>
        </div>

        {/* Circulation facts */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-1">🫀</div>
            <div className="font-bold text-red-600 text-sm">100K</div>
            <p className="text-sm text-red-400 mt-1">Beats per day</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-1">🩸</div>
            <div className="font-bold text-blue-600 text-sm">5L</div>
            <p className="text-sm text-blue-400 mt-1">Blood volume</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-1">🌍</div>
            <div className="font-bold text-purple-600 text-sm">2.5x</div>
            <p className="text-sm text-purple-400 mt-1">Vessels circle Earth</p>
          </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🕉️</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1">Ayurvedic Connection</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sushruta (600 BCE) described blood circulation 1,500 years before William Harvey!
                His <strong>Sushruta Samhita</strong> detailed 360 bones, blood vessels (<strong>Sira</strong>),
                and surgical techniques that are still studied today. He's called the "Father of Surgery."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
