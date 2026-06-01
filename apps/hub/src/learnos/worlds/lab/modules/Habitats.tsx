// src/worlds/lab/modules/Habitats.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import HabitatsCanvas from './HabitatsCanvas';

const HABITATS = [
  { id: 'forest' as const, emoji: '🌲', name: 'Forest' },
  { id: 'ocean' as const, emoji: '🌊', name: 'Ocean' },
  { id: 'desert' as const, emoji: '🏜️', name: 'Desert' },
  { id: 'arctic' as const, emoji: '❄️', name: 'Arctic' },
];

export default function Habitats() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [habitat, setHabitat] = useState<'forest' | 'ocean' | 'desert' | 'arctic'>('forest');

  const handleHabitatChange = useCallback((h: typeof habitat) => {
    setHabitat(h);
    LearningService.trackEvent('habitats-session', 'lab', language, 'habitat_change', 'habitats', { habitat: h });
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{HABITATS.find(h => h.id === habitat)?.emoji}</div>
          <h1 className="text-3xl font-extrabold text-slate-800">{t('lab.habitats.title', { defaultValue: 'Animal Habitats' })}</h1>
          <p className="text-sm text-slate-500 mt-2">Explore where different animals live!</p>
        </div>
        <div className="flex justify-center gap-3 mb-6">
          {HABITATS.map(h => (
            <button key={h.id} onClick={() => handleHabitatChange(h.id)} className={`px-4 py-3 rounded-xl font-bold transition ${habitat === h.id ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
              <div className="text-xl">{h.emoji}</div>
              <div className="text-sm">{h.name}</div>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6">
          <HabitatsCanvas habitat={habitat} />
        </div>
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🕉️</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1">Indian Biodiversity</h3>
              <p className="text-gray-600 text-sm leading-relaxed">India has 4 biodiversity hotspots! From Himalayan snow leopards to Western Ghats frogs, India's habitats are incredibly diverse. Ancient Indians practiced <strong>Van Prastha</strong> — forest conservation — 3,000 years before modern ecology.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
