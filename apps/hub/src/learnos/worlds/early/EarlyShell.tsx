// src/worlds/early/EarlyShell.tsx

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import { PipSpeechBubble } from './components/PipSpeechBubble';
import { useEarlySession } from './hooks/useEarlySession';
import { usePip } from './hooks/usePip';
import type { EarlyModule } from './types/early.types';

interface EarlyShellProps {
  module: EarlyModule;
  children: ReactNode;
  showPip?: boolean;
  pipPosition?: 'bottom-right' | 'bottom-left' | 'top-right';
}

export default function EarlyShell({ module, children, showPip = true, pipPosition = 'bottom-right' }: EarlyShellProps) {
  const navigate = useNavigate();
  const { showBreak, trackModuleOpen, trackModuleClose, dismissBreak } = useEarlySession();
  const pip = usePip();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    trackModuleOpen(module);
    return () => { trackModuleClose(module); };
  }, [module, trackModuleOpen, trackModuleClose]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-sky-50">
      {children}

      {showPip && (
        <PipSpeechBubble
          visible={pip.visible}
          message={pip.currentMessage}
          position={pipPosition}
          onDismiss={pip.dismiss}
          onMuteToggle={pip.toggleMute}
          muted={pip.muted}
        />
      )}

      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <button
        onClick={() => navigate('/early')}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl transition-transform active:scale-95"
        aria-label="Back to Adventure Academy"
      >
        🏠
      </button>

      <AnimatePresence>
        {showBreak && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col items-center justify-center p-8"
            onClick={dismissBreak}
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-8xl mb-6">🐤</motion.div>
            <div className="text-6xl mb-4">💤</div>
            <div className="flex justify-center gap-3 text-3xl mt-8 opacity-60">⭐ ⭐ ⭐</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
