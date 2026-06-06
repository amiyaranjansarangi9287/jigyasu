// src/worlds/lab/modules/Magnets.tsx
// Interactive magnet simulation with pole and distance control

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import MagnetsCanvas from './MagnetsCanvas';

export default function Magnets() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [magnet1Pole, setMagnet1Pole] = useState<'N' | 'S'>('N');
  const [magnet2Pole, setMagnet2Pole] = useState<'N' | 'S'>('S');
  const [distance, setDistance] = useState(150);

  const handleDistanceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setDistance(val);
    LearningService.trackEvent(
      'magnets-session',
      'lab',
      language,
      'canvas_interaction',
      'magnets',
      { magnet1Pole, magnet2Pole, distance: val }
    );
  }, [language, magnet1Pole, magnet2Pole]);

  const togglePole1 = useCallback(() => {
    setMagnet1Pole(prev => prev === 'N' ? 'S' : 'N');
  }, []);

  const togglePole2 = useCallback(() => {
    setMagnet2Pole(prev => prev === 'N' ? 'S' : 'N');
  }, []);

  const isAttracting = (magnet1Pole === 'N' ? 'S' : 'N') !== magnet2Pole;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-950 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🧲</div>
          <h1 className="text-3xl font-extrabold text-white">
            {t('lab.magnets.title', { defaultValue: 'Magnets & Poles' })}
          </h1>
          <p className="text-sm text-slate-400 mt-2">{t('lab.modules.Magnets.txt_Flippolesa', 'Flip poles and adjust distance to see attraction vs repulsion!')}</p>
        </div>

        {/* Pole toggles */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={togglePole1}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition ${
              magnet1Pole === 'N'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Magnet 1: {magnet1Pole}
          </button>
          <button
            onClick={togglePole2}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition ${
              magnet2Pole === 'N'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Magnet 2: {magnet2Pole}
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-slate-800/50 rounded-3xl shadow-sm border border-slate-700/50 p-4 mb-6">
          <MagnetsCanvas magnet1Pole={magnet1Pole} magnet2Pole={magnet2Pole} distance={distance} />
        </div>

        {/* Distance slider */}
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{t('lab.modules.Magnets.spn_Close', '📏 Close')}</span>
            <span className="text-sm text-slate-400">{t('lab.modules.Magnets.spn_Far', 'Far 📏')}</span>
          </div>
          <input
            type="range"
            min="60"
            max="250"
            value={distance}
            onChange={handleDistanceChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #A855F7 0%, #6366F1 100%)`,
            }}
          />
          <div className="text-center mt-2 text-sm text-slate-400">
            Distance: {distance}px
          </div>
        </div>

        {/* Result indicator */}
        <div className={`mt-6 rounded-2xl p-5 text-center ${
          isAttracting
            ? 'bg-purple-900/30 border border-purple-700/30'
            : 'bg-orange-900/30 border border-orange-700/30'
        }`}>
          <div className={`text-2xl font-bold mb-2 ${isAttracting ? 'text-purple-300' : 'text-orange-300'}`}>
            {isAttracting ? '💜 ATTRACT!' : '🧡 REPEL!'}
          </div>
          <p className={`text-sm ${isAttracting ? 'text-purple-400' : 'text-orange-400'}`}>
            {isAttracting
              ? 'Opposite poles attract — they want to stick together!'
              : 'Same poles repel — they push each other away!'}
          </p>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.Magnets.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-400 font-bold text-sm mb-1">Ancient Indian Discovery</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Indians discovered magnetism ~600 BCE! The word "magnet" may come from
                <strong> Magnesia</strong>, but Indian sailors used <strong>Ayaskanta</strong>
                (iron-lover) lodestones for navigation. Sushruta used magnets in surgery to
                remove iron arrows from wounds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
