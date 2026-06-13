// src/worlds/lab/modules/Fractions.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import FractionsCanvas from './FractionsCanvas';

export default function Fractions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(4);

  const handleNumChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setNumerator(Math.min(val, denominator));
    LearningService.trackEvent('fractions-session', 'lab', language, 'numerator_change', 'fractions', { numerator: val, denominator });
  }, [language, denominator]);

  const handleDenChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setDenominator(val);
    setNumerator(prev => Math.min(prev, val));
    LearningService.trackEvent('fractions-session', 'lab', language, 'denominator_change', 'fractions', { numerator, denominator: val });
  }, [language, numerator]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍕</div>
          <h1 className="text-3xl font-extrabold text-slate-800">{t('lab.fractions.title', { defaultValue: 'Fractions' })}</h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.Fractions.txt_Seefractio', 'See fractions visually — parts of a whole!')}</p>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <FractionsCanvas numerator={numerator} denominator={denominator} />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div>
            <div className="flex justify-between mb-2"><span className="text-sm text-slate-400">{t('lab.modules.Fractions.spn_Numeratorp', '🔢 Numerator (parts taken)')}</span><span className="text-sm font-bold text-amber-600">{numerator}</span></div>
            <input type="range" min="0" max={denominator} value={numerator} onChange={handleNumChange} className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #F59E0B, #EF4444)' }} />
          </div>
          <div>
            <div className="flex justify-between mb-2"><span className="text-sm text-slate-400">{t('lab.modules.Fractions.spn_Denominato', '📊 Denominator (total parts)')}</span><span className="text-sm font-bold text-orange-600">{denominator}</span></div>
            <input type="range" min="1" max="12" value={denominator} onChange={handleDenChange} className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #3B82F6, #8B5CF6)' }} />
          </div>
        </div>
        <div className="mt-6 bg-amber-50 rounded-2xl p-5 text-center">
          <div className="text-2xl font-bold text-amber-600">{numerator}/{denominator} = {(numerator / denominator * 100).toFixed(0)}%</div>
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.Fractions.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1"><Trans i18nKey="auto.fractions.indian_fraction_heritage">Indian Fraction Heritage</Trans></h3>
              <p className="text-gray-600 text-sm leading-relaxed"><Trans i18nKey="auto.fractions.ancient_indians_used_fractions">Ancient Indians used fractions in the</Trans> <strong><Trans i18nKey="auto.fractions.sulba_sutras">Sulba Sutras</Trans></strong> <Trans i18nKey="auto.fractions.800_bce_for_altar_construction">(traditionally dated around 800 BCE) for altar construction! Aryabhata later developed sophisticated methods for working with fractions and fractions of fractions in his mathematical and astronomical work.</Trans></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
