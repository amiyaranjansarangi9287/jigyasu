// src/worlds/lab/modules/Gravity.tsx
// Interactive gravity simulation with Newton vs Einstein views

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import GravityCanvas from './GravityCanvas';

export default function Gravity() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [mass, setMass] = useState(50);
  const [showNewton, setShowNewton] = useState(true);

  const handleMassChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMass(val);
    LearningService.trackEvent(
      'gravity-session',
      'lab',
      language,
      'canvas_interaction',
      'gravity',
      { mass: val, view: showNewton ? 'newton' : 'einstein' }
    );
  }, [language, showNewton]);

  const toggleView = useCallback(() => {
    setShowNewton(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌌</div>
          <h1 className="text-3xl font-extrabold text-white">
            {t('lab.gravity.title', { defaultValue: 'Gravity & Spacetime' })}
          </h1>
          <p className="text-sm text-slate-400 mt-2">{t('lab.modules.Gravity.txt_Dragthesta', 'Drag the star to see how mass bends space!')}</p>
        </div>

        {/* View toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleView}
            className="px-5 py-2 rounded-xl bg-indigo-600/30 text-indigo-200 text-sm font-medium hover:bg-indigo-600/50 transition"
          >
            {showNewton ? '🍎 Newton: Force' : '🌊 Einstein: Curved Space'}
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-slate-800/50 rounded-3xl shadow-sm border border-slate-700/50 p-4 mb-6">
          <GravityCanvas mass={mass} showNewton={showNewton} />
        </div>

        {/* Mass slider */}
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{t('lab.modules.Gravity.spn_Smallmass', '🌑 Small mass')}</span>
            <span className="text-sm text-slate-400">{t('lab.modules.Gravity.spn_Largemass', '☀️ Large mass')}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={mass}
            onChange={handleMassChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #6366F1 0%, #8B5CF6 50%, #F59E0B 100%)`,
            }}
          />
          <div className="text-center mt-2 text-sm text-slate-400">
            <Trans i18nKey="auto.gravity.mass">Mass:</Trans> {mass}
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-amber-900/20 rounded-2xl p-4 text-center border border-amber-700/30">
            <div className="text-3xl mb-2">🍎</div>
            <div className="font-bold text-amber-300 text-sm"><Trans i18nKey="auto.gravity.newton_s_view">Newton's View</Trans></div>
            <p className="text-sm text-amber-400/70 mt-1">{t('lab.modules.Gravity.txt_Gravityisa', 'Gravity is a force pulling objects together')}</p>
          </div>
          <div className="bg-indigo-900/20 rounded-2xl p-4 text-center border border-indigo-700/30">
            <div className="text-3xl mb-2">🌊</div>
            <div className="font-bold text-indigo-300 text-sm"><Trans i18nKey="auto.gravity.einstein_s_view">Einstein's View</Trans></div>
            <p className="text-sm text-indigo-400/70 mt-1">{t('lab.modules.Gravity.txt_Masscurves', 'Mass curves spacetime, objects follow the curve')}</p>
          </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.Gravity.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-400 font-bold text-sm mb-1"><Trans i18nKey="auto.gravity.ancient_indian_insight">Ancient Indian Insight</Trans></h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                <Trans i18nKey="auto.gravity.aryabhata_499_ce_described_gra">Aryabhata (499 CE) described a natural attractive force that pulls objects toward Earth — an early insight into what we now call gravity.
                                              The concept of</Trans> <strong><Trans i18nKey="auto.gravity.gurutva">Gurutva</Trans></strong> <Trans i18nKey="auto.gravity.literally_means_heaviness_and_">(गुरुत्व) literally means "heaviness" and described
                                              how Earth attracts objects toward its center.</Trans>
                                            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
