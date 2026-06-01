// src/worlds/discovery/components/UnsolvedQuestion.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import type { UnsolvedQuestion } from '../data/discoveryContent';

interface Props { question: UnsolvedQuestion; }
export function UnsolvedQuestionDisplay({ question }: Props) {
  const [open, setOpen] = useState(false);
  const { recordUnsolvedQuestion } = useDiscoveryProgress();
  return (
    <div className="mx-5 mb-4">
      <button onClick={async () => { setOpen(true); await recordUnsolvedQuestion(); }} className="w-full bg-red-950/30 rounded-2xl p-4 border border-red-900/30 text-left hover:border-red-700/50 transition-all"><div className="flex items-start gap-3"><span className="text-lg">❓</span><div><p className="text-red-400 text-sm font-bold uppercase">Unsolved Question</p><p className="text-white text-sm font-medium">{question.question}</p></div></div></button>
      <AnimatePresence>{open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-slate-800 rounded-2xl p-4 mt-2 border border-slate-700"><p className="text-slate-300 text-sm">{question.context}</p><div className="flex items-center gap-2 mt-2"><span className="text-sm text-slate-500">Field:</span><span className="text-indigo-400 text-sm font-bold">{question.fieldName}</span></div></motion.div>
      )}</AnimatePresence>
    </div>
  );
}
