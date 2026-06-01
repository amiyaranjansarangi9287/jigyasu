// src/worlds/tiny/SessionSummary.tsx
// Post-session parent summary. Shows discoveries as emoji chips.

import { motion, AnimatePresence } from 'framer-motion';
import type { TinyProgress } from './types/tiny.types';
import { TINY_MODULES } from './data/tinyContent';

interface SessionSummaryProps {
  visible: boolean;
  progress: TinyProgress | null;
  sessionMinutes: number;
  onClose: () => void;
}

export default function SessionSummary({ visible, progress, sessionMinutes, onClose }: SessionSummaryProps) {
  if (!progress) return null;

  const discoveries = [
    progress.animalsDiscovered.length > 0 && `🐾 ${progress.animalsDiscovered.length}`,
    progress.colorsMixed.length > 0 && `🎨 ${progress.colorsMixed.length}`,
    progress.shapesMatched.length > 0 && `⭐ ${progress.shapesMatched.length}`,
    progress.animalsPlayed.length > 0 && `🎵 ${progress.animalsPlayed.length}`,
    progress.bubblesPopped > 0 && `🫧 ${progress.bubblesPopped}`,
    progress.weathersDiscovered.length > 0 && `⛅ ${progress.weathersDiscovered.length}`,
    progress.farmAnimalsFound.length > 0 && `🐄 ${progress.farmAnimalsFound.length}`,
    progress.nightDiscovered && '🌙',
  ].filter(Boolean) as string[];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
        >
          <div className="absolute inset-0 bg-black/20" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">🌟</div>
              <div className="text-xl font-bold text-gray-700">
                {sessionMinutes >= 5 ? '⭐⭐⭐' : sessionMinutes >= 3 ? '⭐⭐' : '⭐'}
              </div>
            </div>

            {discoveries.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {discoveries.map((d, i) => (
                  <span key={i} className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-base font-medium">
                    {d}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-center gap-2 mb-4">
              {TINY_MODULES.map((module) => {
                const explored =
                  (module.id === 'tap-world' && progress.totalTaps > 0) ||
                  (module.id === 'color-mixer' && progress.colorsMixed.length > 0) ||
                  (module.id === 'shape-sorter' && progress.shapesMatched.length > 0) ||
                  (module.id === 'animal-orchestra' && progress.animalsPlayed.length > 0) ||
                  (module.id === 'bubble-world' && progress.bubblesPopped > 0) ||
                  (module.id === 'weather-maker' && progress.weathersDiscovered.length > 0) ||
                  (module.id === 'farm-friends' && progress.farmAnimalsFound.length > 0) ||
                  (module.id === 'day-and-night' && progress.nightDiscovered);
                return (
                  <div key={module.id} className={`text-2xl transition-all ${explored ? 'opacity-100 scale-110' : 'opacity-25'}`}>
                    {module.emoji}
                  </div>
                );
              })}
            </div>

            <button onClick={onClose} className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl text-xl min-h-[56px]">
              ✓
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
