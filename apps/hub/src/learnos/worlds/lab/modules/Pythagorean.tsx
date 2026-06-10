// src/worlds/lab/modules/Pythagorean.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import PythagoreanCanvas from './PythagoreanCanvas';

export default function Pythagorean() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [sideA, setSideA] = useState(3);
  const [sideB, setSideB] = useState(4);

  const handleAChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSideA(val);
    LearningService.trackEvent('pythagorean-session', 'lab', language, 'side_a_change', 'pythagorean', { sideA: val, sideB });
  }, [language, sideB]);

  const handleBChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSideB(val);
    LearningService.trackEvent('pythagorean-session', 'lab', language, 'side_b_change', 'pythagorean', { sideA, sideB: val });
  }, [language, sideA]);

  const hypotenuse = Math.sqrt(sideA * sideA + sideB * sideB);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📐</div>
          <h1 className="text-3xl font-extrabold text-slate-800">{t('lab.pythagorean.title', { defaultValue: 'Pythagorean Theorem' })}</h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.Pythagorean.txt_abcseeitvi', 'a² + b² = c² — see it visually!')}</p>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <PythagoreanCanvas sideA={sideA} sideB={sideB} />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div>
            <div className="flex justify-between mb-2"><span className="text-sm text-slate-400">{t('lab.modules.Pythagorean.spn_SideA', '📏 Side A')}</span><span className="text-sm font-bold text-indigo-600">{sideA}</span></div>
            <input type="range" min="1" max="10" value={sideA} onChange={handleAChange} className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #6366F1, #8B5CF6)' }} />
          </div>
          <div>
            <div className="flex justify-between mb-2"><span className="text-sm text-slate-400">{t('lab.modules.Pythagorean.spn_SideB', '📏 Side B')}</span><span className="text-sm font-bold text-purple-600">{sideB}</span></div>
            <input type="range" min="1" max="10" value={sideB} onChange={handleBChange} className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #A855F7, #EC4899)' }} />
          </div>
        </div>
        <div className="mt-6 bg-indigo-50 rounded-2xl p-5 text-center">
          <div className="text-lg font-bold text-indigo-600 font-mono">{sideA}² + {sideB}² = {sideA * sideA} + {sideB * sideB} = {sideA * sideA + sideB * sideB}</div>
          <div className="text-2xl font-bold text-purple-600 mt-2"><Trans i18nKey="auto.pythagorean.c">c = √</Trans>{sideA * sideA + sideB * sideB} = {hypotenuse.toFixed(2)}</div>
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.Pythagorean.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1"><Trans i18nKey="auto.pythagorean.baudhayana_s_theorem">Baudhayana's Theorem</Trans></h3>
              <p className="text-gray-600 text-sm leading-relaxed"><Trans i18nKey="auto.pythagorean.the">The</Trans> <strong><Trans i18nKey="auto.pythagorean.baudhayana_sulba_sutra">Baudhayana Sulba Sutra</Trans></strong> <Trans i18nKey="auto.pythagorean.800_bce_states_the_pythagorean">(800 BCE) states the Pythagorean theorem 1,000 years before Pythagoras! "The diagonal of a rectangle produces both areas that its sides produce separately." Indians used this for altar construction.</Trans></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
