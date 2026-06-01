// src/worlds/lab/modules/NumberLine.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import NumberLineCanvas from './NumberLineCanvas';

export default function NumberLine() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [position, setPosition] = useState(0);
  const [targetPosition, setTargetPosition] = useState(5);
  const [showJumps, setShowJumps] = useState(true);

  const handleTargetChange = useCallback((val: number) => {
    setTargetPosition(val);
    setPosition(0);
    LearningService.trackEvent('number-line-session', 'lab', language, 'target_change', 'number-line', { target: val });
  }, [language]);

  const toggleJumps = useCallback(() => setShowJumps(p => !p), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📏</div>
          <h1 className="text-3xl font-extrabold text-slate-800">{t('lab.numberline.title', { defaultValue: 'Number Line' })}</h1>
          <p className="text-sm text-slate-500 mt-2">Watch the character jump to any number!</p>
        </div>
        <div className="flex justify-center gap-3 mb-6">
          {[-10, -5, 0, 5, 10].map(n => (
            <button key={n} onClick={() => handleTargetChange(n)} className={`px-4 py-3 rounded-xl font-bold transition ${targetPosition === n ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
              {n}
            </button>
          ))}
          <button onClick={toggleJumps} className="px-4 py-3 rounded-xl bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 transition">
            {showJumps ? '🦘 Jumps' : '🦘 Off'}
          </button>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <NumberLineCanvas position={position} targetPosition={targetPosition} showJumps={showJumps} />
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🕉️</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1">Indian Number Innovation</h3>
              <p className="text-gray-600 text-sm leading-relaxed">India gave the world <strong>zero</strong> and <strong>negative numbers</strong>! Brahmagupta (628 CE) defined rules for negative numbers — calling them "debt" vs "fortune." The number line concept with negatives was understood 1,000 years before Europe!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
