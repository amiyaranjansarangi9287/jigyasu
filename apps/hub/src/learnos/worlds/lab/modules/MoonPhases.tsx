// src/worlds/lab/modules/MoonPhases.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import MoonPhasesCanvas from './MoonPhasesCanvas';

const PHASES = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
const EMOJIS = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];

export default function MoonPhases() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [phase, setPhase] = useState(4);
  const [showOrbit, setShowOrbit] = useState(false);

  const handlePhaseChange = useCallback((p: number) => {
    setPhase(p);
    LearningService.trackEvent('moon-phases-session', 'lab', language, 'phase_change', 'moon-phases', { phase: p });
  }, [language]);

  const toggleView = useCallback(() => setShowOrbit(p => !p), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{EMOJIS[phase]}</div>
          <h1 className="text-3xl font-extrabold text-white">{t('lab.moonphases.title', { defaultValue: 'Moon Phases' })}</h1>
          <p className="text-sm text-slate-400 mt-2">{t('lab.modules.MoonPhases.txt_Clickeachp', 'Click each phase to see the Moon change!')}</p>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={toggleView} className="px-5 py-2 rounded-xl bg-indigo-600/30 text-indigo-200 text-sm font-medium hover:bg-indigo-600/50 transition">
            {showOrbit ? '🌙 Moon View' : '🔄 Orbit View'}
          </button>
        </div>
        <div className="bg-slate-800/50 rounded-3xl shadow-sm border border-slate-700/50 p-4 mb-6">
          <MoonPhasesCanvas phase={phase} showOrbit={showOrbit} />
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-4 shadow-sm border border-slate-700/50">
          <div className="grid grid-cols-8 gap-2">
            {PHASES.map((p, i) => (
              <button key={i} onClick={() => handlePhaseChange(i)} className={`py-2 rounded-xl text-sm font-medium transition ${phase === i ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                <div className="text-lg">{EMOJIS[i]}</div>
                <div className="text-sm">{p.split(' ').pop()}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.MoonPhases.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-400 font-bold text-sm mb-1"><Trans i18nKey="auto.moonphases.indian_lunar_calendar">Indian Lunar Calendar</Trans></h3>
              <p className="text-gray-300 text-sm leading-relaxed"><Trans i18nKey="auto.moonphases.india_s">India's</Trans> <strong><Trans i18nKey="auto.moonphases.panchang">Panchang</Trans></strong> <Trans i18nKey="auto.moonphases.calendar_tracks_30_lunar_phase">calendar tracks 30 lunar phases (Tithis). Festivals like Diwali (Amavasya) and Karwa Chauth (Purnima) are based on moon phases. Ancient Indians calculated the lunar month at 29.53 days — accurate to modern science!</Trans></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
