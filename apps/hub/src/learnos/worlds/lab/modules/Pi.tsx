// src/worlds/lab/modules/Pi.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import PiCanvas from './PiCanvas';

export default function Pi() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [precision, setPrecision] = useState(5);
  const [showUnwrap, setShowUnwrap] = useState(true);

  const handlePrecisionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setPrecision(val);
    LearningService.trackEvent('pi-session', 'lab', language, 'precision_change', 'pi', { precision: val });
  }, [language]);

  const toggleUnwrap = useCallback(() => setShowUnwrap(p => !p), []);

  const piValue = Math.PI.toFixed(precision);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🥧</div>
          <h1 className="text-3xl font-extrabold text-slate-800">{t('lab.pi.title', { defaultValue: 'The Magic of Pi (π)' })}</h1>
          <p className="text-sm text-slate-500 mt-2">See how π connects circumference to diameter!</p>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={toggleUnwrap} className="px-5 py-2 rounded-xl bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 transition">
            {showUnwrap ? '🔄 Unwrap View' : '⭕ Circle View'}
          </button>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <PiCanvas precision={precision} showUnwrap={showUnwrap} />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between mb-2"><span className="text-sm text-slate-400">🔢 Decimal places</span><span className="text-sm font-bold text-cyan-600">{precision}</span></div>
          <input type="range" min="1" max="15" value={precision} onChange={handlePrecisionChange} className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #06B6D4, #3B82F6)' }} />
        </div>
        <div className="mt-6 bg-cyan-50 rounded-2xl p-5 text-center">
          <div className="text-3xl font-bold text-cyan-600 font-mono">π = {piValue}</div>
          <div className="text-sm text-cyan-400 mt-2">Circumference = π × Diameter</div>
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🕉️</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1">Aryabhata's Pi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Aryabhata (499 CE) calculated π ≈ 3.1416 — accurate to 4 decimal places! His method: "Add 4 to 100, multiply by 8, add 62,000. The diameter of a circle with circumference 20,000 is approximately this." That's 3.1416!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
