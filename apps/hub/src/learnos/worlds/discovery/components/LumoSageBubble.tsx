// src/worlds/discovery/components/PeacockSageBubble.tsx
import { motion, AnimatePresence } from 'framer-motion';
import type { PeacockSageEmotion } from '../types/discovery.types';

interface PeacockSageBubbleProps { visible: boolean; message: string; name: string; emotion: PeacockSageEmotion; onDismiss: () => void; }

export function PeacockSageBubble({ visible, message, name, emotion, onDismiss }: PeacockSageBubbleProps) {
  const iconMap: Record<PeacockSageEmotion, string> = {
    idle: '�',
    observing: '�',
    questioning: '�',
    celebrating: '�✨',
    thinking: '�💭',
    connecting: '�🔗',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, x: 30, scale: 0.85 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 30, scale: 0.85 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="fixed bottom-24 right-4 z-30 max-w-[200px]">
          <div className="bg-slate-800/95 backdrop-blur-sm rounded-2xl p-3 border border-slate-600/50 shadow-2xl mb-2 relative">
            <p className="text-slate-200 text-sm leading-relaxed italic font-medium">"{message}"</p>
            <div className="absolute -bottom-2 right-10 w-4 h-4 bg-slate-800 border-r border-b border-slate-600/50 rotate-45" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-slate-500">{name}</span>
            <button onClick={onDismiss} className="text-3xl opacity-80 hover:opacity-100 transition-opacity">{iconMap[emotion]}</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { PeacockSageBubble as LumoSageBubble };
