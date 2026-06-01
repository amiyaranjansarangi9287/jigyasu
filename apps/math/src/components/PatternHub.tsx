import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PatternPuzzle from './PatternPuzzle';
import MemoryMatch from './MemoryMatch';

type Mode = 'patterns' | 'memory';

export default function PatternHub() {
  const [mode, setMode] = useState<Mode>('patterns');

  return (
    <div className="w-full">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-white/5 rounded-2xl p-1 border border-white/10">
          <motion.button
            className={`relative px-4 sm:px-6 py-2 rounded-xl font-medium text-sm transition-colors ${
              mode === 'patterns' ? 'text-white' : 'text-gray-400'
            }`}
            onClick={() => setMode('patterns')}
            whileTap={{ scale: 0.97 }}
          >
            {mode === 'patterns' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500/40 to-orange-500/40 rounded-xl border border-amber-400/30"
                layoutId="mode-indicator"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span>🧩</span>
              <span className="hidden sm:inline">Pattern Puzzles</span>
              <span className="sm:hidden">Patterns</span>
            </span>
          </motion.button>
          <motion.button
            className={`relative px-4 sm:px-6 py-2 rounded-xl font-medium text-sm transition-colors ${
              mode === 'memory' ? 'text-white' : 'text-gray-400'
            }`}
            onClick={() => setMode('memory')}
            whileTap={{ scale: 0.97 }}
          >
            {mode === 'memory' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-pink-500/40 rounded-xl border border-purple-400/30"
                layoutId="mode-indicator"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span>🃏</span>
              <span className="hidden sm:inline">Memory Match</span>
              <span className="sm:hidden">Memory</span>
            </span>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {mode === 'patterns' ? (
          <motion.div
            key="patterns"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PatternPuzzle />
          </motion.div>
        ) : (
          <motion.div
            key="memory"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <MemoryMatch />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
