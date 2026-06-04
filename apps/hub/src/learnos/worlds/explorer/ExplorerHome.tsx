import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { useExplorerProgress } from './hooks/useExplorerProgress';
import { ExplorerNav } from './components/ExplorerNav';
import { EXPLORER_CONCEPTS } from './data/explorerContent';
import type { InterestLens } from './types/explorer.types';

export default function ExplorerHome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { progress, isVisited, isCompleted } = useExplorerProgress();
  const [selectedLens, setSelectedLens] = useState<InterestLens | 'all'>('all');
  const [showWelcome, setShowWelcome] = useState(!progress?.conceptsVisited.length);

  const filteredConcepts = selectedLens === 'all'
    ? EXPLORER_CONCEPTS
    : EXPLORER_CONCEPTS.filter((c) => c.lenses.includes(selectedLens));

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Welcome overlay — only on first visit */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-slate-950
                     flex flex-col items-center justify-center p-8"
        >
          <div className="max-w-sm text-center">
            <div className="text-5xl mb-6">✦</div>
            <h1 className="text-2xl font-bold text-white mb-3">
              {t('explorer.welcome_title')}
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {t('explorer.welcome_message')}
            </p>
            <p className="text-slate-600 text-sm mb-8 italic">
              {t('explorer.welcome_subtitle', 'Every concept connects to something in your everyday life.')}
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="px-8 py-4 bg-violet-700 text-white
                         font-bold rounded-2xl text-base min-h-[56px]"
            >
              {t('explorer.begin')}
            </button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {t('explorer.world_name', 'Future Explorers')}
            </h1>
          </div>
          {/* Subtle progress — not prominent */}
          {progress && progress.conceptsVisited.length > 0 && (
            <p className="text-slate-700 text-sm">
              {progress.conceptsVisited.length} {t('explorer.of', 'of')} {EXPLORER_CONCEPTS.length} {t('explorer.explored', 'explored')}
            </p>
          )}
        </div>

        {/* Last visited concept — continue prompt */}
        {progress?.lastVisitedConcept && (
          <button
            onClick={() => {
              const concept = EXPLORER_CONCEPTS.find(
                (c) => c.id === progress.lastVisitedConcept
              );
              if (concept) navigate(`/explorer/${concept.path}`);
            }}
            className="w-full mt-3 bg-slate-900 rounded-xl p-3
                       border border-slate-800 text-left flex items-center gap-3
                       hover:border-slate-700 transition-colors"
          >
            <span className="text-xl">
              {EXPLORER_CONCEPTS.find(
                (c) => c.id === progress.lastVisitedConcept
              )?.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-slate-500 text-sm">{t('explorer.continue_where_left', 'Continue where you left off...')}</p>
              <p className="text-slate-300 text-sm font-medium truncate">
                {t(`explorer.concepts.${progress.lastVisitedConcept}.title` as any, EXPLORER_CONCEPTS.find(
                  (c) => c.id === progress.lastVisitedConcept
                )?.title || '')}
              </p>
            </div>
            <span className="text-slate-700 text-sm">→</span>
          </button>
        )}
      </div>

      {/* Interest lens selector */}
      <ExplorerNav selectedLens={selectedLens} onSelectLens={setSelectedLens} />

      {/* Concept list — editorial feel, not grid */}
      <div className="px-5 pb-24 space-y-3">
        {filteredConcepts.map((concept, i) => {
          const visited = isVisited(concept.id);
          const completed = isCompleted(concept.id);

          return (
            <motion.button
              key={concept.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => navigate(`/explorer/${concept.path}`)}
              className="w-full text-left bg-slate-900 rounded-2xl p-5
                         border border-slate-800 hover:border-slate-700
                         transition-all duration-200 active:scale-[0.99]"
            >
              <div className="flex items-start gap-4">
                {/* Emoji */}
                <span className="text-3xl flex-shrink-0 mt-0.5">
                  {concept.emoji}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-white text-sm leading-tight">
                      {t(`explorer.concepts.${concept.id}.title` as any, concept.title)}
                    </p>
                    {/* Visited indicator — subtle */}
                    {visited && !completed && (
                      <span className="text-slate-600 text-sm flex-shrink-0 mt-0.5">
                        ◐
                      </span>
                    )}
                    {completed && (
                      <span className="text-violet-500 text-sm flex-shrink-0 mt-0.5">
                        ✦
                      </span>
                    )}
                  </div>

                  {/* Hook — the adult-framed question */}
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {t(`explorer.concepts.${concept.id}.hook` as any, concept.hook)}
                  </p>

                  {/* Time estimate — small, not prominent */}
                  <p className="text-slate-700 text-sm mt-2">
                    ~{concept.estimatedMinutes} {t('explorer.time_estimate', 'min')}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <ParentCorner onExit={() => navigate('/home')} />
    </div>
  );
}
