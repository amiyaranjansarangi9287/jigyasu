// src/worlds/lab/modules/Atoms.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import AtomsCanvas from './AtomsCanvas';

const ELEMENTS = [
  { id: 'hydrogen' as const, symbol: 'H', name: 'Hydrogen', emoji: '💧' },
  { id: 'helium' as const, symbol: 'He', name: 'Helium', emoji: '🎈' },
  { id: 'carbon' as const, symbol: 'C', name: 'Carbon', emoji: '💎' },
  { id: 'oxygen' as const, symbol: 'O', name: 'Oxygen', emoji: '🫁' },
];

export default function Atoms() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [element, setElement] = useState<'hydrogen' | 'helium' | 'carbon' | 'oxygen'>('hydrogen');
  const [showLabels, setShowLabels] = useState(true);

  const handleElementChange = useCallback((e: typeof element) => {
    setElement(e);
    LearningService.trackEvent('atoms-session', 'lab', language, 'element_change', 'atoms', { element: e });
  }, [language]);

  const toggleLabels = useCallback(() => setShowLabels(p => !p), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-slate-900 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚛️</div>
          <h1 className="text-3xl font-extrabold text-white">{t('lab.atoms.title', { defaultValue: 'Atomic Structure' })}</h1>
          <p className="text-sm text-slate-400 mt-2">Explore the building blocks of matter!</p>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          {ELEMENTS.map(el => (
            <button key={el.id} onClick={() => handleElementChange(el.id)} className={`px-4 py-3 rounded-xl font-bold transition ${element === el.id ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              <div className="text-xl">{el.emoji}</div>
              <div className="text-sm">{el.symbol}</div>
            </button>
          ))}
          <button onClick={toggleLabels} className="px-4 py-3 rounded-xl bg-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-600 transition">
            {showLabels ? '🏷️ Labels' : '🏷️ Off'}
          </button>
        </div>
        <div className="bg-slate-800/50 rounded-3xl shadow-sm border border-slate-700/50 p-4 mb-6">
          <AtomsCanvas element={element} showLabels={showLabels} />
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🕉️</span>
            <div>
              <h3 className="text-orange-400 font-bold text-sm mb-1">Vaisheshika Atomic Theory</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Maharishi Kanad (~600 BCE) proposed <strong>Paramanu</strong> — indivisible atoms — 2,000 years before Dalton! He said atoms combine to form molecules (Dyanuka), predating modern chemistry by millennia.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
