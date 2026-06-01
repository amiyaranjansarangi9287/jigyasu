// src/worlds/lab/components/PeacockSpeechBubble.tsx
import { motion, AnimatePresence } from 'framer-motion';

interface PeacockSpeechBubbleProps {
  visible: boolean; message: string; name: string; onDismiss: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right';
}

export function PeacockSpeechBubble({ visible, message, name, onDismiss, position = 'bottom-right' }: PeacockSpeechBubbleProps) {
  const pos = { 'bottom-right': 'bottom-24 right-4', 'bottom-left': 'bottom-24 left-4', 'top-right': 'top-24 right-4' }[position];
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, scale: 0.7, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.7, x: 20 }} className={`fixed ${pos} z-30 max-w-[220px]`}>
          <div className="bg-slate-800 rounded-2xl p-3 mb-2 border border-slate-700 shadow-xl relative">
            <p className="text-sm text-slate-200 leading-snug font-medium">{message}</p>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-slate-800 border-r border-b border-slate-700 rotate-45" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <div className="text-sm text-slate-400 font-medium">{name}</div>
            <button onClick={onDismiss} className="text-4xl select-none">�</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export const LumoSpeechBubble = PeacockSpeechBubble;
