// src/worlds/lab/modules/LightShadows.tsx
// Interactive light and shadows simulation with draggable sun

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import LightShadowsCanvas from './LightShadowsCanvas';

export default function LightShadows() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [lightX, setLightX] = useState(50);
  const [lightY, setLightY] = useState(20);

  const handleLightMove = useCallback((x: number, y: number) => {
    setLightX(x);
    setLightY(y);
    LearningService.trackEvent(
      'light-shadows-session',
      'lab',
      language,
      'canvas_interaction',
      'light-shadows',
      { lightX: x, lightY: y }
    );
  }, [language]);

  const timeOfDay = lightY < 20 ? 'Noon' : lightY < 35 ? 'Afternoon' : 'Sunset';

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-amber-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔦</div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            {t('lab.lightshadows.title', { defaultValue: 'Light & Shadows' })}
          </h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.LightShadows.txt_Dragthesun', 'Drag the sun to see how shadows change!')}</p>
        </div>

        {/* Time indicator */}
        <div className="flex justify-center mb-6">
          <div className="px-6 py-3 rounded-2xl font-bold text-lg bg-amber-100 text-amber-700">
            {timeOfDay} — Sun at {Math.round(lightX)}%, {Math.round(lightY)}%
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <LightShadowsCanvas lightX={lightX} lightY={lightY} onLightMove={handleLightMove} />
        </div>

        {/* Explanation */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-yellow-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">☀️</div>
            <div className="font-bold text-yellow-600 text-sm">Light Source</div>
            <p className="text-sm text-yellow-400 mt-1">{t('lab.modules.LightShadows.txt_Lighttrave', 'Light travels in straight lines')}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">🌳</div>
            <div className="font-bold text-slate-600 text-sm">Object Blocks</div>
            <p className="text-sm text-slate-400 mt-1">{t('lab.modules.LightShadows.txt_Opaqueobje', 'Opaque objects block light')}</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">🌑</div>
            <div className="font-bold text-gray-600 text-sm">Shadow Forms</div>
            <p className="text-sm text-gray-400 mt-1">{t('lab.modules.LightShadows.txt_Darkareabe', 'Dark area behind the object')}</p>
          </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.LightShadows.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1">Ancient Indian Shadow Science</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Aryabhata (499 CE) correctly explained eclipses as shadows — the Moon blocks sunlight
                for lunar eclipses, Earth's shadow falls on the Moon for solar eclipses! Ancient Indians
                used <strong>Shanku Yantra</strong> (shadow sticks) to measure time and calculate
                Earth's tilt with remarkable accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
