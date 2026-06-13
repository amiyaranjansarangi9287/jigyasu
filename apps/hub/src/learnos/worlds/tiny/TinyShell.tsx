// src/worlds/tiny/TinyShell.tsx
// Wrapper used by all Tiny World modules.
// Handles: back navigation, parent corner, session timer, break screen.

import { useNavigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import { useTinySession } from './hooks/useTinySession';
import type { TinyModule } from './types/tiny.types';
import { useTranslation } from 'react-i18next';

interface TinyShellProps {
  module: TinyModule;
  children: ReactNode;
}

interface BreakStar {
  left: string;
  top: string;
  fontSize: string;
  duration: number;
  delay: number;
}

function createBreakStars(): BreakStar[] {
  const { t } = useTranslation();
  return Array.from({ length: 20 }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    top: `${8 + ((i * 23) % 52)}%`,
    fontSize: `${8 + ((i * 7) % 12)}px`,
    duration: 2 + ((i * 5) % 20) / 10,
    delay: ((i * 3) % 20) / 10,
  }));
}

const BREAK_STARS = createBreakStars();

export default function TinyShell({ module, children }: TinyShellProps) {
  const navigate = useNavigate();
  const {
    showBreak,
    trackModuleOpen,
    trackModuleClose,
    dismissBreak,
  } = useTinySession();

  useEffect(() => {
    trackModuleOpen(module);
    return () => {
      trackModuleClose(module);
    };
  }, [module, trackModuleOpen, trackModuleClose]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {children}

      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      {/* Back button — large, bottom left, child-friendly */}
      <button
        onClick={() => navigate('/tiny')}
        className="fixed bottom-6 left-6 z-40
                   w-16 h-16 rounded-full bg-white/80
                   backdrop-blur-sm shadow-lg
                   flex items-center justify-center
                   text-3xl transition-transform
                   active:scale-95 select-none"
        aria-label="Back to home"
      >
        🏠
      </button>

      {/* Break time overlay — no text, visual only */}
      <AnimatePresence>
        {showBreak && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50
                       bg-gradient-to-b from-indigo-900 to-indigo-950
                       flex flex-col items-center justify-center"
            onClick={dismissBreak}
          >
            {/* Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {BREAK_STARS.map((star, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{
                    duration: star.duration,
                    repeat: Infinity,
                    delay: star.delay,
                  }}
                  style={{
                    left: star.left,
                    top: star.top,
                    fontSize: star.fontSize,
                  }}
                >
                  ⭐
                </motion.div>
              ))}
            </div>

            {/* Sleepy moon */}
            <div className="relative z-10 text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-[120px] mb-8"
              >
                🌙
              </motion.div>
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl"
              >
                😴
              </motion.div>
            </div>

            {/* Tap anywhere to continue — pulsing circle */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute bottom-16
                         w-16 h-16 rounded-full
                         bg-white/20 backdrop-blur-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
