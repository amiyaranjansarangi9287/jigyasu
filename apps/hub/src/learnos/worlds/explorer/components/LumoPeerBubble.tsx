import { motion, AnimatePresence } from 'framer-motion';
import type { PeacockPeerEmotion } from '../types/explorer.types';

interface PeacockPeerBubbleProps {
  visible: boolean;
  message: string;
  name: string;
  emotion: PeacockPeerEmotion;
  onDismiss: () => void;
}

export function PeacockPeerBubble({
  visible,
  message,
  name,
  emotion,
  onDismiss,
}: PeacockPeerBubbleProps) {
  const emotionPrefix: Record<PeacockPeerEmotion, string> = {
    absent: '',
    sharing: '✦',
    questioning: '?',
    connecting: '↗',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.6 }}
          className="fixed bottom-20 right-4 z-30 max-w-[220px]"
        >
          <div className="bg-slate-900/95 rounded-2xl p-4
                          border border-violet-500/15 shadow-xl backdrop-blur">
            {/* Minimal header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-violet-500 text-sm font-medium">
                {emotionPrefix[emotion]} {name}
              </span>
              <button
                onClick={onDismiss}
                className="text-slate-700 hover:text-slate-500
                           text-sm transition-colors"
              >
                ×
              </button>
            </div>
            {/* Message — italicised, personal-feeling */}
            <p className="text-slate-300 text-sm leading-relaxed italic">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { PeacockPeerBubble as LumoPeerBubble };
