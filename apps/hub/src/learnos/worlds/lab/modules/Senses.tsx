// src/worlds/lab/modules/Senses.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import SensesCanvas from './SensesCanvas';

const SENSES = [
  { id: 'sight' as const, emoji: '👁️', name: 'Sight' },
  { id: 'hearing' as const, emoji: '👂', name: 'Hearing' },
  { id: 'touch' as const, emoji: '✋', name: 'Touch' },
  { id: 'taste' as const, emoji: '👅', name: 'Taste' },
  { id: 'smell' as const, emoji: '👃', name: 'Smell' },
];

export default function Senses() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [sense, setSense] = useState<'sight' | 'hearing' | 'touch' | 'taste' | 'smell'>('sight');

  const handleSenseChange = useCallback((s: typeof sense) => {
    setSense(s);
    LearningService.trackEvent('senses-session', 'lab', language, 'sense_change', 'senses', { sense: s });
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{SENSES.find(s => s.id === sense)?.emoji}</div>
          <h1 className="text-3xl font-extrabold text-slate-800">{t('lab.senses.title', { defaultValue: 'Five Senses' })}</h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.Senses.txt_Explorehow', 'Explore how your body perceives the world!')}</p>
        </div>
        <div className="flex justify-center gap-3 mb-6">
          {SENSES.map(s => (
            <button key={s.id} onClick={() => handleSenseChange(s.id)} className={`px-4 py-3 rounded-xl font-bold transition ${sense === s.id ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}>
              <div className="text-xl">{s.emoji}</div>
              <div className="text-sm">{s.name}</div>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <SensesCanvas sense={sense} />
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.Senses.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1">Indian Philosophy of Senses</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Indian philosophy describes <strong>5 Indriyas</strong> (senses) connected to 5 elements: sight→fire, hearing→space, touch→air, taste→water, smell→earth. The <strong>Tanmatras</strong> (subtle elements) theory maps senses to atomic properties — remarkably aligned with neuroscience!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
