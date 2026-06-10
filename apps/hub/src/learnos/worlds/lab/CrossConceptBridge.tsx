// src/worlds/lab/CrossConceptBridge.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Trans } from "react-i18next";

interface Props { visible: boolean; message: string; emoji: string; onDismiss: () => void; lumoName: string; }

export default function CrossConceptBridge({ visible, message, emoji, onDismiss, lumoName }: Props) {
  return (
    <AnimatePresence>{visible && (
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="fixed top-20 left-4 right-4 z-40">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-start gap-3"><div className="text-3xl flex-shrink-0">{emoji}</div>
            <div className="flex-1"><span className="text-sm font-bold text-indigo-200 uppercase">🦚 {lumoName} <Trans i18nKey="auto.crossconceptbridge.sees_a_connection">sees a connection</Trans></span><p className="text-sm text-white leading-relaxed mt-1">{message}</p></div>
            <button onClick={onDismiss} className="text-white/60 hover:text-white text-xl flex-shrink-0">✕</button>
          </div>
        </div>
      </motion.div>
    )}</AnimatePresence>
  );
}
