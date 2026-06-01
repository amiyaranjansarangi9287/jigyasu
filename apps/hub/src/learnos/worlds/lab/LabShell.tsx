// src/worlds/lab/LabShell.tsx
import { useNavigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParentCorner } from '@/shared/layout';
import { useLearnerStore } from '@/store';
import { LumoSpeechBubble } from './components/LumoSpeechBubble';
import { useLabSession } from './hooks/useLabSession';
import { useLumoOwl } from './hooks/useLumoOwl';
import type { LabModule, LabSubject } from './types/lab.types';

interface LabShellProps { module: LabModule; subject: LabSubject; children: ReactNode; showLumo?: boolean; }

export default function LabShell({ module, children, showLumo = true }: LabShellProps) {
  const navigate = useNavigate();
  const { enterModule } = useLearnerStore();
  const { showBreak, trackEvent, dismissBreak } = useLabSession();
  const lumo = useLumoOwl(module);

  useEffect(() => {
    trackEvent(module, 'module_opened');
    enterModule(module, module, 'lab');
    return () => { trackEvent(module, 'module_closed'); };
  }, [module, trackEvent, enterModule]);

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col">
      {children}
      {showLumo && <LumoSpeechBubble visible={lumo.guideVisible} message={lumo.guideMessage} name={lumo.guideName} onDismiss={lumo.dismiss} />}
      <ParentCorner onExit={() => navigate('/lab')} />
      <button onClick={() => navigate('/lab')} className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-xl bg-white shadow-lg border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors" aria-label="Back to Lab Zero">← Lab</button>
      <AnimatePresence>
        {showBreak && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-8">
            <div className="text-center max-w-sm"><div className="text-6xl mb-4">🦉</div><h2 className="text-2xl font-bold text-white mb-2">Great Work Today</h2><p className="text-slate-400 text-sm mb-8">You've been doing science for 20 minutes. Your brain deserves a rest.</p>
              <div className="flex gap-3">
                <button onClick={dismissBreak} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl">5 More Minutes</button>
                <button onClick={() => navigate('/lab')} className="flex-1 py-3 bg-slate-700 text-white font-bold rounded-xl">Go to Lab Home</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
