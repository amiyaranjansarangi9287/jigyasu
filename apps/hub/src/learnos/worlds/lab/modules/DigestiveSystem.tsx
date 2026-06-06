// src/worlds/lab/modules/DigestiveSystem.tsx
// Interactive digestive system simulation with stage control

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import DigestiveCanvas from './DigestiveCanvas';

const STAGES = [
  { id: 0, name: 'Mouth', emoji: '👄', desc: 'Teeth chew food, saliva starts breaking it down' },
  { id: 1, name: 'Esophagus', emoji: '📍', desc: 'Muscle tube pushes food to stomach' },
  { id: 2, name: 'Stomach', emoji: '🫙', desc: 'Acid breaks food into soup-like mixture' },
  { id: 3, name: 'Small Intestine', emoji: '🌀', desc: 'Nutrients absorbed through villi' },
  { id: 4, name: 'Large Intestine', emoji: '🔄', desc: 'Water absorbed, waste prepared' },
];

export default function DigestiveSystem() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleStageChange = useCallback((stage: number) => {
    setCurrentStage(stage);
    LearningService.trackEvent(
      'digestive-session',
      'lab',
      language,
      'canvas_interaction',
      'digestive',
      { stage }
    );
  }, [language]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍎</div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            {t('lab.digestive.title', { defaultValue: 'Digestive System' })}
          </h1>
          <p className="text-sm text-slate-500 mt-2">{t('lab.modules.DigestiveSystem.txt_Followfood', 'Follow food\'s journey through your body!')}</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={togglePlay}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              isPlaying
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-6 max-w-md mx-auto">
          <DigestiveCanvas currentStage={currentStage} isPlaying={isPlaying} />
        </div>

        {/* Stage selector */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex justify-between gap-2">
            {STAGES.map((stage) => (
              <button
                key={stage.id}
                onClick={() => handleStageChange(stage.id)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                  currentStage === stage.id
                    ? 'bg-pink-100 text-pink-700 border-2 border-pink-300'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="text-lg mb-1">{stage.emoji}</div>
                <div>{stage.name}</div>
              </button>
            ))}
          </div>
          <div className="mt-3 text-center text-sm text-slate-500">
            {STAGES[currentStage].desc}
          </div>
        </div>

        {/* Fun facts */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-rose-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">📏</div>
            <div className="font-bold text-rose-600 text-sm">6m Long</div>
            <p className="text-sm text-rose-400 mt-1">{t('lab.modules.DigestiveSystem.txt_Smallintes', 'Small intestine length')}</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="font-bold text-orange-600 text-sm">24-72 hrs</div>
            <p className="text-sm text-orange-400 mt-1">{t('lab.modules.DigestiveSystem.txt_Totaldiges', 'Total digestion time')}</p>
          </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.DigestiveSystem.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-600 font-bold text-sm mb-1">Ayurvedic Connection</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ayurveda described <strong>Agni</strong> (digestive fire) 5,000 years ago! The concept
                of <strong>Jatharagni</strong> — the stomach's digestive power — matches modern
                understanding of stomach acid (HCl) and enzymes. Spices like turmeric and ginger
                were known to boost digestion long before science proved it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
