// src/worlds/lab/modules/NewtonsLaws.tsx
// Interactive Newton's laws simulation with force control

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import NewtonsLawsCanvas from './NewtonsLawsCanvas';

export default function NewtonsLaws() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [force, setForce] = useState(50);
  const [mass, setMass] = useState(10);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleForceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setForce(val);
    LearningService.trackEvent(
      'newtons-laws-session',
      'lab',
      language,
      'canvas_interaction',
      'newtons-laws',
      { force: val, mass }
    );
  }, [language, mass]);

  const handleMassChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMass(val);
    LearningService.trackEvent(
      'newtons-laws-session',
      'lab',
      language,
      'canvas_interaction',
      'newtons-laws',
      { force, mass: val }
    );
  }, [language, force]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const acceleration = mass > 0 ? (force / mass).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍎</div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            {t('lab.newtonslaws.title', { defaultValue: "Newton's Laws of Motion" })}
          </h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.NewtonsLaws.txt_FmaPushobj', 'F = ma — Push objects and see how they move!')}</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={togglePlay}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              isPlaying
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <NewtonsLawsCanvas force={force} mass={mass} isPlaying={isPlaying} />
        </div>

        {/* Sliders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">{t('lab.modules.NewtonsLaws.spn_Force', '💪 Force')}</span>
              <span className="text-sm font-medium text-purple-600">{force} <Trans i18nKey="auto.newtonslaws.n">N</Trans></span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={force}
              onChange={handleForceChange}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{ background: 'linear-gradient(to right, #A855F7, #6366F1)' }}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">{t('lab.modules.NewtonsLaws.spn_Mass', '📦 Mass')}</span>
              <span className="text-sm font-medium text-indigo-600">{mass} <Trans i18nKey="auto.newtonslaws.kg">kg</Trans></span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={mass}
              onChange={handleMassChange}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{ background: 'linear-gradient(to right, #6366F1, #3B82F6)' }}
            />
          </div>
        </div>

        {/* Formula display */}
        <div className="mt-6 bg-purple-50 rounded-2xl p-5 text-center">
          <div className="text-sm text-purple-600 font-mono font-bold">
            <Trans i18nKey="auto.newtonslaws.f_ma_a_f_m">F = ma → a = F/m =</Trans> {force}/{mass} = {acceleration} <Trans i18nKey="auto.newtonslaws.m_s">m/s²</Trans>
                                </div>
        </div>

        {/* 3 Laws */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-indigo-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">🛑</div>
            <div className="font-bold text-indigo-600 text-sm"><Trans i18nKey="auto.newtonslaws.1st_law">1st Law</Trans></div>
            <p className="text-sm text-indigo-400 mt-1">{t('lab.modules.NewtonsLaws.txt_InertiaObj', 'Inertia: Objects keep doing what they\'re doing')}</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">💥</div>
            <div className="font-bold text-purple-600 text-sm"><Trans i18nKey="auto.newtonslaws.2nd_law">2nd Law</Trans></div>
            <p className="text-sm text-purple-400 mt-1">{t('lab.modules.NewtonsLaws.txt_FmaForcema', 'F=ma: Force = mass × acceleration')}</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">🔄</div>
            <div className="font-bold text-blue-600 text-sm"><Trans i18nKey="auto.newtonslaws.3rd_law">3rd Law</Trans></div>
            <p className="text-sm text-blue-400 mt-1">{t('lab.modules.NewtonsLaws.txt_ActionReac', 'Action-Reaction: Every force has an equal opposite')}</p>
          </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.NewtonsLaws.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1"><Trans i18nKey="auto.newtonslaws.ancient_indian_physics">Ancient Indian Physics</Trans></h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                <Trans i18nKey="auto.newtonslaws.kanada_600_bce_described_motio">Kanada (traditionally dated around 600 BCE) described motion laws in the Vaisheshika sutras.
                                              He classified motion into 5 types and described how force causes change in
                                              motion. The concept of</Trans> <strong><Trans i18nKey="auto.newtonslaws.vega">Vega</Trans></strong> <Trans i18nKey="auto.newtonslaws.velocity_and">(velocity) and</Trans> <strong><Trans i18nKey="auto.newtonslaws.prayatna">Prayatna</Trans></strong>
                <Trans i18nKey="auto.newtonslaws.effort_force_matches_newton_s_">(effort/force) matches Newton's framework.</Trans>
                                            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
