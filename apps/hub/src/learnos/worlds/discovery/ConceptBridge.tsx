// src/worlds/discovery/ConceptBridge.tsx
import { motion, AnimatePresence } from 'framer-motion';

interface Props { visible: boolean; message: string; emoji: string; lumoName: string; onDismiss: () => void; }

export default function ConceptBridge({ visible, message, emoji, lumoName, onDismiss }: Props) {
  return (
    <AnimatePresence>{visible && (
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-16 left-4 right-4 z-40">
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-4 border border-indigo-600/40 shadow-2xl">
          <div className="flex items-start gap-3"><div className="text-2xl flex-shrink-0">{emoji}</div>
            <div className="flex-1"><p className="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-1">🦚 {lumoName} connects the dots</p><p className="text-white text-sm leading-relaxed">{message}</p></div>
            <button onClick={onDismiss} className="text-indigo-400 hover:text-white text-lg flex-shrink-0">✕</button>
          </div>
        </div>
      </motion.div>
    )}</AnimatePresence>
  );
}
