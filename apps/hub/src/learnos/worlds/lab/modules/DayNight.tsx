// src/worlds/lab/modules/DayNight.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import DayNightCanvas from './DayNightCanvas';

export default function DayNight() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setRotationSpeed(val);
    LearningService.trackEvent('day-night-session', 'lab', language, 'speed_change', 'day-night', { speed: val });
  }, [language]);

  const toggleRotate = useCallback(() => setAutoRotate(p => !p), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌍</div>
          <h1 className="text-3xl font-extrabold text-white">{t('lab.daynight.title', { defaultValue: 'Day & Night' })}</h1>
          <p className="text-sm text-slate-400 mt-2">{t('lab.modules.DayNight.txt_Earthrotat', 'Earth rotates to create day and night!')}</p>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={toggleRotate} className={`px-5 py-2 rounded-xl text-sm font-medium transition ${autoRotate ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
            {autoRotate ? '⏸️ Pause' : '▶️ Rotate'}
          </button>
        </div>
        <div className="bg-slate-800/50 rounded-3xl shadow-sm border border-slate-700/50 p-4 mb-6">
          <DayNightCanvas autoRotate={autoRotate} rotationSpeed={rotationSpeed} />
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-700/50">
          <div className="flex justify-between mb-2"><span className="text-sm text-slate-400">{t('lab.modules.DayNight.spn_Speed', '🔄 Speed')}</span><span className="text-sm font-medium text-indigo-400">{rotationSpeed.toFixed(1)}<Trans i18nKey="auto.daynight.x">x</Trans></span></div>
          <input type="range" min="0.1" max="5" step="0.1" value={rotationSpeed} onChange={handleSpeedChange} className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #6366F1, #8B5CF6)' }} />
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.DayNight.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-400 font-bold text-sm mb-1"><Trans i18nKey="auto.daynight.ancient_indian_astronomy">Ancient Indian Astronomy</Trans></h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t('lab.modules.DayNight.txt_Aryabhata4', 'Aryabhata (499 CE) correctly explained day/night as Earth\'s rotation — an insight that predated its widespread acceptance in Europe by centuries. He calculated Earth\'s circumference with remarkable accuracy (about 39,968 km vs. the actual ~40,075 km).')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
