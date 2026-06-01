// src/worlds/early/EarlyHome.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import { useEarlyProgress } from './hooks/useEarlyProgress';
import { EARLY_MODULES } from './data/earlyContent';
import PipAdventureMap from './PipAdventureMap';

export default function EarlyHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { progress } = useEarlyProgress();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'language' | 'math' | 'science'>('all');
  const [showMap, setShowMap] = useState(false);

  const categories = [
    { id: 'all' as const, label: '🌟' },
    { id: 'language' as const, label: '📖' },
    { id: 'math' as const, label: '🔢' },
    { id: 'science' as const, label: '🔬' },
  ];

  const modulesByCategory: Record<string, typeof EARLY_MODULES> = {
    all: EARLY_MODULES,
    language: EARLY_MODULES.filter((m) => ['story-builder', 'alphabet-forest', 'word-scramble'].includes(m.id)),
    math: EARLY_MODULES.filter((m) => ['number-line', 'mini-chef', 'coin-counter'].includes(m.id)),
    science: EARLY_MODULES.filter((m) => ['plant-growth', 'water-cycle', 'habitat-heroes', 'shadow-detective', 'magnet-explorer', 'pattern-patrol'].includes(m.id)),
  };

  const visibleModules = modulesByCategory[selectedCategory];

  const getModuleStatus = (moduleId: string) => {
    if (!progress) return 'new';
    switch (moduleId) {
      case 'story-builder': return progress.storiesBuilt > 0 ? 'explored' : 'new';
      case 'number-line': return progress.problemsSolved > 0 ? 'explored' : 'new';
      case 'alphabet-forest': return progress.lettersExplored.length > 0 ? 'explored' : 'new';
      case 'mini-chef': return progress.recipesAttempted.length > 0 ? 'explored' : 'new';
      case 'pattern-patrol': return progress.patternsCompleted > 0 ? 'explored' : 'new';
      case 'word-scramble': return progress.sentencesCompleted > 0 ? 'explored' : 'new';
      case 'plant-growth': return progress.plantStagesCompleted > 0 ? 'explored' : 'new';
      case 'water-cycle': return progress.waterCycleCompleted > 0 ? 'explored' : 'new';
      case 'habitat-heroes': return progress.habitatsExplored > 0 ? 'explored' : 'new';
      case 'shadow-detective': return progress.shadowChallengesSolved > 0 ? 'explored' : 'new';
      case 'magnet-explorer': return progress.magnetSortingCompleted > 0 ? 'explored' : 'new';
      case 'coin-counter': return progress.correctPurchases > 0 ? 'explored' : 'new';
      default: return 'new';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-indigo-50">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 2 }} className="text-4xl">🐤</motion.div>
          <div>
            <h1 className="text-2xl font-extrabold text-indigo-800">Adventure Academy</h1>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-indigo-100 mt-3">
          <p className="text-base text-gray-600 font-medium">🐤 {t('early.pip.greeting', { defaultValue: "Ooh! What shall we discover today?" })}</p>
        </motion.div>
      </div>

      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-base font-bold transition-all duration-200 min-h-[44px] ${
                selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'
              }`}>{cat.label}</button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {visibleModules.map((module, i) => {
            const status = getModuleStatus(module.id);
            return (
              <motion.button key={module.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/early/${module.path}`)}
                className="relative bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-3 min-h-[140px] active:scale-95 transition-transform duration-150"
                style={{ borderTop: `4px solid ${module.color}` }}>
                {status === 'explored' && <div className="absolute top-3 right-3 text-sm bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">✓</div>}
                {status === 'new' && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />}
                <div className="text-5xl">{module.emoji}</div>
                <p className="text-base font-bold text-gray-700 text-center leading-tight">{t(module.titleKey, { defaultValue: module.id })}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      {/* Adventure Map button */}
      <button
        onClick={() => setShowMap(true)}
        className="fixed bottom-6 right-6 z-10 w-16 h-16 rounded-full bg-amber-500 shadow-xl flex items-center justify-center text-3xl active:scale-95 transition-transform select-none"
        aria-label="Adventure Map"
      >
        🗺️
      </button>

      <PipAdventureMap visible={showMap} onClose={() => setShowMap(false)} />
    </div>
  );
}
