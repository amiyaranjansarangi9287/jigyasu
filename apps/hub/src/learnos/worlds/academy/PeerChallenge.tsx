// src/worlds/academy/PeerChallenge.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACADEMY_MODULES } from './data/academyContent';
import type { AcademyModule } from './types/academy.types';

interface PeerChallengeProps { visible: boolean; onClose: () => void; }
interface Challenge { moduleId: AcademyModule; question: string; createdAt: number; completed: boolean; }

export default function PeerChallenge({ visible, onClose }: PeerChallengeProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [creating, setCreating] = useState(false);
  const [selectedModule, setSelectedModule] = useState<AcademyModule | null>(null);
  const [questionText, setQuestionText] = useState('');

  const createChallenge = () => {
    if (!selectedModule || !questionText.trim()) return;
    setChallenges((prev) => [{ moduleId: selectedModule, question: questionText, createdAt: Date.now(), completed: false }, ...prev]);
    setCreating(false); setSelectedModule(null); setQuestionText('');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="fixed inset-0 z-50 bg-slate-950/95 flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="bg-slate-900 rounded-t-3xl w-full max-w-md max-h-[80vh] overflow-y-auto border-t border-slate-800" initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} onClick={(e) => e.stopPropagation()}>
            <div className="px-5 pt-5 pb-3 border-b border-slate-800 sticky top-0 bg-slate-900 flex items-center justify-between"><div><h3 className="font-bold text-white">Challenge Mode</h3><p className="text-slate-500 text-sm">Phase 1: self-challenge only</p></div><button onClick={onClose} className="text-slate-600 text-xl">×</button></div>
            <div className="p-5">
              {!creating ? <button onClick={() => setCreating(true)} className="w-full py-3.5 bg-indigo-800/50 border border-indigo-700 rounded-2xl text-indigo-300 font-bold text-sm mb-4 min-h-[48px]">+ Create New Challenge</button> : (
                <div className="mb-4 space-y-3"><p className="text-slate-400 text-sm font-bold">Select module:</p><div className="flex flex-wrap gap-2">{ACADEMY_MODULES.map((m) => <button key={m.id} onClick={() => setSelectedModule(m.id)} className={`px-2 py-1.5 rounded-lg text-sm font-bold ${selectedModule === m.id ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>{m.emoji} {m.title.split(' ')[0]}</button>)}</div><textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Write your challenge question..." rows={3} className="w-full bg-slate-800 text-white rounded-xl p-3 text-sm resize-none border border-slate-700 focus:border-indigo-600 focus:outline-none placeholder-slate-500" /><button onClick={createChallenge} className="w-full py-2.5 rounded-xl text-sm font-bold bg-indigo-700 text-white">Create</button></div>
              )}
              {challenges.length === 0 ? <div className="text-center py-8"><p className="text-slate-600 text-sm">No challenges yet.</p></div> : <div className="space-y-3">{challenges.map((ch, i) => { const info = ACADEMY_MODULES.find((m) => m.id === ch.moduleId); return <div key={i} className="bg-slate-800 rounded-2xl p-4 border border-slate-700"><div className="flex items-center gap-2 mb-2"><span>{info?.emoji}</span><span className="text-slate-400 text-sm">{info?.title}</span>{ch.completed && <span className="ml-auto text-green-400 text-sm">✓ Done</span>}</div><p className="text-white text-sm">{ch.question}</p>{!ch.completed && <button onClick={() => setChallenges((prev) => prev.map((c, idx) => idx === i ? { ...c, completed: true } : c))} className="mt-2 text-indigo-400 text-sm">Mark as complete →</button>}</div>; })}</div>}
              <div className="mt-4 bg-slate-800/50 rounded-xl p-3 border border-slate-700/50"><p className="text-slate-600 text-sm italic text-center">Phase 2: Send challenges to classmates.</p></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}