// src/worlds/early/components/PipSpeechBubble.tsx

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface PipSpeechBubbleProps {
  visible: boolean;
  message: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right';
  onDismiss: () => void;
  onMuteToggle: () => void;
  muted: boolean;
}

export function PipSpeechBubble({ visible, message, position = 'bottom-right', onDismiss, onMuteToggle, muted }: PipSpeechBubbleProps) {
  const { t } = useTranslation();
  const pos = {
    'bottom-right': 'bottom-24 right-4',
    'bottom-left': 'bottom-24 left-4',
    'top-right': 'top-24 right-4',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className={`fixed ${pos[position]} z-30 flex flex-col items-end gap-2 max-w-[200px]`}
        >
          <div className="bg-white rounded-2xl shadow-xl p-3 border-2 border-yellow-200 relative">
            <p className="text-base text-gray-700 text-center font-medium leading-snug">{message}</p>
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r-2 border-b-2 border-yellow-200 rotate-45" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onMuteToggle} className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-base" aria-label={muted ? t('auto.pipspeechbubble.unmute_pip', 'Unmute Pip') : t('auto.pipspeechbubble.mute_pip', 'Mute Pip')}>
              {muted ? '🔇' : '🔊'}
            </button>
            <button onClick={onDismiss} className="text-5xl" aria-label={t('auto.pipspeechbubble.dismiss_pip', 'Dismiss Pip')}>🐤</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
