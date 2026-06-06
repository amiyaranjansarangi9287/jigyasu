// src/worlds/lab/modules/StatesOfMatter.tsx
// Interactive states of matter simulation with temperature control

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import StatesOfMatterCanvas from './StatesOfMatterCanvas';

export default function StatesOfMatter() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [temperature, setTemperature] = useState(20);

  const getStateLabel = (temp: number) => {
    if (temp < 33) return { label: 'SOLID', color: '#60A5FA', emoji: '🧊' };
    if (temp < 66) return { label: 'LIQUID', color: '#3B82F6', emoji: '💧' };
    return { label: 'GAS', color: '#F59E0B', emoji: '💨' };
  };

  const state = getStateLabel(temperature);

  const handleTempChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setTemperature(val);
    LearningService.trackEvent(
      'states-of-matter-session',
      'lab',
      language,
      'canvas_interaction',
      'states-of-matter',
      { temperature: val }
    );
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{state.emoji}</div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            {t('lab.states.title', { defaultValue: 'States of Matter' })}
          </h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.StatesOfMatter.txt_Dragthesli', 'Drag the slider to heat or cool the particles!')}</p>
        </div>

        {/* State indicator */}
        <div className="flex justify-center mb-6">
          <div
            className="px-6 py-3 rounded-2xl font-bold text-lg text-white"
            style={{ backgroundColor: state.color }}
          >
            {state.label} — {temperature}°C
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <StatesOfMatterCanvas temperature={temperature} />
        </div>

        {/* Temperature slider */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{t('lab.modules.StatesOfMatter.spn_Cold', '🧊 Cold')}</span>
            <span className="text-sm text-slate-400">{t('lab.modules.StatesOfMatter.spn_Hot', 'Hot 🔥')}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={temperature}
            onChange={handleTempChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #60A5FA 0%, #3B82F6 33%, #F59E0B 66%, #EF4444 100%)`,
            }}
          />
          <div className="flex justify-between mt-2 text-sm text-slate-400">
            <span>{t('lab.modules.StatesOfMatter.spn_0C', '0°C')}</span>
            <span>{t('lab.modules.StatesOfMatter.spn_33C', '33°C')}</span>
            <span>{t('lab.modules.StatesOfMatter.spn_66C', '66°C')}</span>
            <span>{t('lab.modules.StatesOfMatter.spn_100C', '100°C')}</span>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">🧊</div>
            <div className="font-bold text-blue-600 text-sm">Solid</div>
            <p className="text-sm text-blue-400 mt-1">{t('lab.modules.StatesOfMatter.txt_Particlesv', 'Particles vibrate in place')}</p>
          </div>
          <div className="bg-cyan-50 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">💧</div>
            <div className="font-bold text-cyan-600 text-sm">Liquid</div>
            <p className="text-sm text-cyan-400 mt-1">{t('lab.modules.StatesOfMatter.txt_Particless', 'Particles slide past each other')}</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">💨</div>
            <div className="font-bold text-orange-600 text-sm">Gas</div>
            <p className="text-sm text-orange-400 mt-1">{t('lab.modules.StatesOfMatter.txt_Particlesf', 'Particles fly freely')}</p>
          </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.StatesOfMatter.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1">Ancient Indian Connection</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Maharishi Kanad (~600 BCE) described these states as <strong>Prithvi</strong> (solid),
                <strong> Jala</strong> (liquid), and <strong>Vāyu</strong> (gas) — 2,400 years before
                modern science! The Panchabhutas framework maps perfectly to today's states of matter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
