// src/worlds/academy/components/PeacockAncientGlow.tsx
import { motion, AnimatePresence } from 'framer-motion';
import type { PeacockAncientEmotion } from '../types/academy.types';

interface Props { visible: boolean; message: string; name: string; emotion: PeacockAncientEmotion; onDismiss: () => void; }

export function PeacockAncientGlow({ visible, message, name, onDismiss }: Props) {
  return (
    <AnimatePresence>{visible && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="fixed bottom-20 right-4 z-30 max-w-[210px]">
        <motion.div initial={{ y: 8 }} animate={{ y: 0 }} className="bg-slate-950/90 rounded-xl p-3 border border-indigo-500/20 shadow-2xl">
          <p className="text-indigo-600 text-sm mb-1.5 font-medium">� {name}</p>
          <p className="text-slate-300 text-sm leading-relaxed italic">"{message}"</p>
        </motion.div>
        <button onClick={onDismiss} className="absolute -top-1 -right-1 w-5 h-5 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 text-sm">×</button>
      </motion.div>
    )}</AnimatePresence>
  );
}

export { PeacockAncientGlow as LumoAncientGlow };
