// src/worlds/discovery/DiscoveryShell.tsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParentCorner } from '@/shared/layout';
import { LumoSageBubble } from './components/LumoSageBubble';
import { GoDeeper } from './components/GoDeeper';
import { useDiscoverySession } from './hooks/useDiscoverySession';
import { useLumoSage } from './hooks/useLumoSage';
import type { DiscoveryModule } from './types/discovery.types';
import { DISCOVERY_MODULES, GO_DEEPER_CONTENT } from './data/discoveryContent';

interface Props { module: DiscoveryModule; children: ReactNode; showGoDeeper?: boolean; }
export default function DiscoveryShell({ module, children, showGoDeeper = true }: Props) {
  const navigate = useNavigate();
  const { showBreak, trackEvent, dismissBreak } = useDiscoverySession();
  const lumo = useLumoSage();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    trackEvent(module, 'module_opened');
    return () => { trackEvent(module, 'module_closed'); };
  }, [module, trackEvent]);

  const mod = DISCOVERY_MODULES.find(m => m.id === module);
  const gd = GO_DEEPER_CONTENT.find(g => g.moduleId === module);

  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col">
      <div className="bg-slate-800/50 border-b border-slate-700/50 px-5 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/discovery')} className="text-slate-400 hover:text-white text-sm flex items-center gap-1">← Map</button>
        <div className="text-center text-white font-bold text-sm">{mod?.emoji} {mod?.title}</div>
        <div className="text-slate-500 text-sm uppercase">{mod?.subject}</div>
      </div>
      {children}
      {showGoDeeper && gd && <GoDeeper content={gd} module={module} />}
      <LumoSageBubble visible={lumo.peacockVisible} message={lumo.peacockMessage} name={lumo.peacockName} emotion={lumo.peacockEmotion} onDismiss={lumo.dismiss} />
      <ParentCorner onExit={() => navigate('/discovery')} />
      <AnimatePresence>{showBreak && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/98 flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-sm"><div className="text-5xl mb-5">🦉</div><h2 className="text-2xl font-extrabold text-white mb-3">Productive Session</h2><p className="text-slate-400 text-sm mb-8">25 minutes of deep thinking is exceptional.</p>
            <div className="flex gap-3"><button onClick={dismissBreak} className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-2xl border border-slate-700">5 More Minutes</button><button onClick={() => navigate('/discovery')} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-2xl">Return to Map</button></div>
          </div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}
