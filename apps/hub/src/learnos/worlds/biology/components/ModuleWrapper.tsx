import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Trophy, Award } from 'lucide-react';
import { MODULE_CONNECTIONS, MODULE_NAMES, UserProgress, visitModule, saveProgress, getLevelTitle } from '../lib/progress';
import { playLevelUp } from '../lib/sounds';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

interface ModuleWrapperProps {
  moduleId: string;
  children: React.ReactNode;
  progress: UserProgress;
  setProgress: (p: UserProgress) => void;
  onNavigate: (id: string) => void;
}

const levelUpParticles = Array.from({ length: 30 }, (_, i) => ({
  x: ((i * 37) % 400) - 200,
  y: ((i * 53) % 400) - 200,
  rotate: (i * 137) % 720,
}));

export default function ModuleWrapper({ moduleId, children, progress, setProgress, onNavigate }: ModuleWrapperProps) {
  const { t } = useTranslation();
  const [showXP, setShowXP] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);

  // Track visit
  useEffect(() => {
    const timers: number[] = [];
    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay);
      timers.push(timer);
    };

    const prevLevel = progress.level;
    const updated = visitModule(progress, moduleId);
    setProgress(updated);
    saveProgress(updated);

    // Show XP popup on first visit
    if (!progress.modulesVisited[moduleId]?.visited) {
      schedule(() => setShowXP(true), 0);
      schedule(() => setShowXP(false), 2500);
    }

    // Level up celebration
    if (updated.level > prevLevel) {
      schedule(() => {
        setNewLevel(updated.level);
        setShowLevelUp(true);
        playLevelUp();
      }, 0);
      schedule(() => setShowLevelUp(false), 4000);
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [moduleId]); // Intentionally limited deps

  const connections = MODULE_CONNECTIONS[moduleId];
  const xpToNext = 100 - (progress.xp % 100);

  return (
    <div className="min-h-screen bg-gray-950">
      {children}

      {/* XP popup on first visit */}
      <AnimatePresence>
        {showXP && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="fixed bottom-20 right-4 bg-emerald-500/90 backdrop-blur text-white px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 z-40 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold"><Trans i18nKey="auto.modulewrapper.25_xp">+25 XP</Trans></span>
            <span className="text-sm opacity-80"><Trans i18nKey="auto.modulewrapper.new_module">New module!</Trans></span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level up celebration */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Confetti particles */}
            {levelUpParticles.map((particle, i) => (
              <motion.div key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#a855f7', '#ec4899'][i % 6],
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  scale: [0, 1.5, 0],
                  rotate: particle.rotate,
                }}
                transition={{ duration: 2, delay: i * 0.03, ease: 'easeOut' }}
              />
            ))}
            {/* Level up card */}
            <motion.div
              initial={{ scale: 0.5, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-lg border-2 border-yellow-500/50 rounded-2xl px-8 py-6 text-center shadow-2xl shadow-yellow-500/20">
              <motion.div className="text-5xl mb-2"
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}>
                🎉
              </motion.div>
              <div className="text-sm text-yellow-400 font-bold uppercase tracking-wider mb-1"><Trans i18nKey="auto.modulewrapper.level_up">Level Up!</Trans></div>
              <div className="text-4xl font-black text-white mb-1"><Trans i18nKey="auto.modulewrapper.level">Level</Trans> {newLevel}</div>
              <div className="text-sm text-yellow-400/80">{getLevelTitle(newLevel)}</div>
              <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-400">
                <Award className="w-3 h-3" /> <Trans i18nKey="auto.modulewrapper.keep_exploring_to_level_up_mor">Keep exploring to level up more!</Trans>
                                            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom bar: Back + XP + Related modules */}
      <div className="sticky bottom-0 z-30 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 pb-safe">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 sm:gap-3">
          {/* Back */}
          <button onClick={() => onNavigate('home')}
            className="flex items-center gap-1 text-gray-400 hover:text-white text-sm shrink-0 transition-colors px-2 py-1 rounded-lg hover:bg-gray-800 active:scale-95">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline"><Trans i18nKey="auto.modulewrapper.home">Home</Trans></span>
          </button>

          {/* XP bar */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span className="text-sm text-yellow-400 font-bold"><Trans i18nKey="auto.modulewrapper.lv">Lv.</Trans>{progress.level}</span>
            <div className="w-12 sm:w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all"
                style={{ width: `${((progress.xp % 100) / 100) * 100}%` }} />
            </div>
            <span className="text-[9px] text-gray-600 hidden sm:inline">{xpToNext}<Trans i18nKey="auto.modulewrapper.next">→next</Trans></span>
          </div>

          <div className="flex-1" />

          {/* Related modules */}
          {connections && (
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-600 hidden sm:inline"><Trans i18nKey="auto.modulewrapper.next">Next:</Trans></span>
              {connections.related.slice(0, 3).map(relId => {
                const mod = MODULE_NAMES[relId];
                if (!mod) return null;
                const isVisited = progress.modulesVisited[relId]?.visited;
                return (
                  <button key={relId} onClick={() => onNavigate(relId)}
                    className={`flex items-center gap-0.5 px-1.5 sm:px-2 py-1 rounded-lg text-[9px] sm:text-sm font-medium transition-all active:scale-95 ${isVisited ? 'bg-gray-800 text-gray-500 hover:text-white' : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'}`}>
                    <span>{mod.emoji}</span>
                    <span className="hidden md:inline">{mod.name}</span>
                    {!isVisited && <span className="text-[7px] text-yellow-400 hidden sm:inline"><Trans i18nKey="auto.modulewrapper.25">+25</Trans></span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
