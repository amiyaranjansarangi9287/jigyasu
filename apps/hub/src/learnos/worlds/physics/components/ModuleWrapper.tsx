// src/worlds/physics/components/ModuleWrapper.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MODULE_CONNECTIONS, MODULE_NAMES, UserProgress, visitModule, saveProgress } from '../lib/progress';
import Navbar from './Navbar';

interface ModuleWrapperProps {
  moduleId: string;
  children: React.ReactNode;
  progress: UserProgress;
  setProgress: (p: UserProgress) => void;
  onNavigate: (id: string) => void;
}

export default function ModuleWrapper({ moduleId, children, progress, setProgress, onNavigate }: ModuleWrapperProps) {
  const navigate = useNavigate();
  const [startTime] = useState(Date.now());
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const updated = visitModule(progress, moduleId);
    setProgress(updated);
    saveProgress(updated);

    if (!progress.modulesVisited[moduleId]?.visited) {
      setShowComplete(true);
      setTimeout(() => setShowComplete(false), 2500);
    }
  }, [moduleId]);

  useEffect(() => {
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const updated = { ...progress, modulesVisited: { ...progress.modulesVisited, [moduleId]: { ...progress.modulesVisited[moduleId], timeSpentSeconds: (progress.modulesVisited[moduleId]?.timeSpentSeconds || 0) + timeSpent } } };
      saveProgress(updated);
    };
  }, []);

  const relatedModules = MODULE_CONNECTIONS[moduleId] || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar currentModule={moduleId} onNavigate={onNavigate} progress={progress} />

      {/* XP Bar */}
      <div className="fixed top-11 left-0 right-0 z-40 h-1 bg-gray-900">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${((progress.xp % 100) / 100) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Completion Toast */}
      {showComplete && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-cyan-500/20 border border-cyan-400/40 rounded-xl px-4 py-2 text-sm font-bold text-cyan-300 backdrop-blur-lg"
        >
          +15 XP — Module visited! 🔬
        </motion.div>
      )}

      {/* Main Content */}
      <main className="pt-16 pb-20">{children}</main>

      {/* Related Modules */}
      {relatedModules.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 backdrop-blur-xl bg-gray-950/90 p-3">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-gray-500 uppercase font-bold mb-2">What to explore next?</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {relatedModules.map(relId => {
                const isVisited = progress.modulesVisited[relId]?.visited;
                return (
                  <button
                    key={relId}
                    onClick={() => navigate(`/physics/${relId}`)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isVisited
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
                    }`}
                  >
                    {MODULE_NAMES[relId] || relId} {isVisited ? '✓' : '→'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
