// src/worlds/early/EarlySessionSummary.tsx

import { motion, AnimatePresence } from 'framer-motion';
import type { EarlyProgress } from './types/early.types';
import { Trans, useTranslation } from "react-i18next";

interface EarlySessionSummaryProps {
  visible: boolean;
  progress: EarlyProgress | null;
  sessionMinutes: number;
  onClose: () => void;
}

export default function EarlySessionSummary({ visible, progress, sessionMinutes, onClose }: EarlySessionSummaryProps) {
  const { t } = useTranslation();
  if (!progress) return null;

  const achievements = [
    progress.storiesBuilt > 0 && `📖 ${progress.storiesBuilt} ${t('auto.earlysessionsummary.stories', 'stories')}`,
    progress.problemsSolved > 0 && `🔢 ${progress.problemsSolved} ${t('auto.earlysessionsummary.problems', 'problems')}`,
    progress.lettersExplored.length > 0 && `🌳 ${progress.lettersExplored.length} ${t('auto.earlysessionsummary.letters', 'letters')}`,
    progress.recipesCompleted.length > 0 && `👨‍🍳 ${progress.recipesCompleted.length} ${t('auto.earlysessionsummary.recipes', 'recipes')}`,
    progress.patternsCompleted > 0 && `🔍 ${progress.patternsCompleted} ${t('auto.earlysessionsummary.patterns', 'patterns')}`,
    progress.sentencesCompleted > 0 && `✏️ ${progress.sentencesCompleted} ${t('auto.earlysessionsummary.sentences', 'sentences')}`,
    progress.plantStagesCompleted > 0 && `🌱 ${progress.plantStagesCompleted} ${t('auto.earlysessionsummary.stages', 'stages')}`,
    progress.waterCycleCompleted > 0 && `💧 ${t('auto.earlysessionsummary.water_cycle', 'Water cycle')}`,
    progress.habitatsExplored > 0 && `🌍 ${progress.habitatsExplored} ${t('auto.earlysessionsummary.habitats', 'habitats')}`,
    progress.shadowChallengesSolved > 0 && `🔦 ${progress.shadowChallengesSolved} ${t('auto.earlysessionsummary.shadows', 'shadows')}`,
    progress.magnetSortingCompleted > 0 && `🧲 ${t('auto.earlysessionsummary.magnets', 'Magnets')}`,
    progress.correctPurchases > 0 && `💰 ${progress.correctPurchases} ${t('auto.earlysessionsummary.purchases', 'purchases')}`,
  ].filter(Boolean) as string[];

  const stars = sessionMinutes >= 12 ? 3 : sessionMinutes >= 8 ? 2 : 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
          className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={onClose} />
          <motion.div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl pb-8" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🐤</div>
              <div className="flex justify-center gap-1 mb-1">{Array.from({ length: 3 }, (_, i) => (<span key={i} className={`text-3xl ${i < stars ? '' : 'opacity-20'}`}>⭐</span>))}</div>
              <p className="text-base text-gray-500">{sessionMinutes} <Trans i18nKey="auto.earlysessionsummary.minutes_of_adventure">minutes of adventure!</Trans></p>
            </div>
            {achievements.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-4">{achievements.map((a, i) => (<span key={i} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">{a}</span>))}</div>
            )}
            <div className="bg-indigo-50 rounded-2xl p-3 mb-4 border border-indigo-100"><p className="text-base text-indigo-800 font-medium text-center"><Trans i18nKey="auto.earlysessionsummary.what_a_wonderful_adventure_tod">"What a wonderful adventure today! Come back tomorrow! 🐤"</Trans></p></div>
            <button onClick={onClose} className="w-full py-4 bg-indigo-600 text-white font-bold text-xl rounded-2xl min-h-[56px]"><Trans i18nKey="auto.earlysessionsummary.see_you_next_time">See you next time! 👋</Trans></button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
