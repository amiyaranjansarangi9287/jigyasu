// src/worlds/academy/components/ExamBridge.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExamQuestion, ExamBoard } from '../types/academy.types';

interface Props { questions: ExamQuestion[]; onComplete: (correct: number, total: number) => void; }
const BC: Record<ExamBoard, string> = { CBSE: '#3B82F6', ICSE: '#8B5CF6', JEE: '#EF4444', NEET: '#10B981', IB: '#F59E0B' };

export function ExamBridge({ questions, onComplete }: Props) {
  const [cur, setCur] = useState(0);
  const [ans, setAns] = useState<(number|null)[]>(new Array(questions.length).fill(null));
  const [showMS, setShowMS] = useState(false);
  const [done, setDone] = useState(false);
  const q = questions[cur]; const picked = ans[cur] !== null;

  const handleAnswer = (i: number) => { if (picked) return; const n = [...ans]; n[cur] = i; setAns(n); };
  const handleNext = () => { setShowMS(false); if (cur < questions.length - 1) setCur(p => p + 1); else { const c = ans.filter((a, i) => questions[i].correctIndex !== undefined && a === questions[i].correctIndex).length; setDone(true); onComplete(c, questions.length); } };

  if (done) { const c = ans.filter((a, i) => questions[i].correctIndex !== undefined && a === questions[i].correctIndex).length; return <div className="p-5 text-center"><div className="text-4xl mb-3">{c === questions.length ? '🎯' : '📝'}</div><p className="text-white font-bold text-lg">{c}/{questions.length} correct</p></div>; }

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden">
      <div className="px-4 py-2.5 flex items-center gap-2" style={{ backgroundColor: `${BC[q.board]}22` }}>
        <span className="px-2 py-0.5 rounded text-sm font-bold text-white" style={{ backgroundColor: BC[q.board] }}>{q.board}</span>
        {q.year && <span className="text-slate-500 text-sm">{q.year}</span>}
        <span className="ml-auto text-slate-500 text-sm">{q.marks} marks · {q.topic}</span>
      </div>
      <div className="p-4">
        <p className="text-white text-sm leading-relaxed mb-4 font-medium">{q.question}</p>
        {q.options && <div className="space-y-2 mb-4">{q.options.map((opt, i) => {
          const isSel = ans[cur] === i; const isCorr = q.correctIndex === i; const show = picked;
          return <button key={i} onClick={() => handleAnswer(i)} disabled={picked} className={`w-full text-left py-3 px-4 rounded-xl text-sm min-h-[44px] transition-all ${!show ? 'bg-slate-800 border border-slate-700 text-slate-300' : isCorr ? 'bg-green-900/40 border border-green-700 text-green-300' : isSel ? 'bg-red-900/40 border border-red-700 text-red-300' : 'bg-slate-800/50 border border-slate-800 text-slate-500'}`}><span className="font-mono mr-2 text-slate-500">{String.fromCharCode(65+i)}.</span>{opt}{show && isCorr && <span className="ml-2 text-green-400">✓</span>}</button>;
        })}</div>}
        {!q.options && <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700 text-center"><p className="text-slate-400 text-sm">Structured question — attempt in your notebook</p><button onClick={() => setShowMS(true)} className="mt-2 text-indigo-400 text-sm underline">Show mark scheme</button></div>}
        <AnimatePresence>{(showMS || (picked && q.options)) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-slate-800 rounded-xl p-3 mb-4 border border-slate-700"><p className="text-slate-400 text-sm font-bold uppercase mb-1">Mark Scheme</p><p className="text-slate-300 text-sm leading-relaxed">{q.markscheme}</p></motion.div>
        )}</AnimatePresence>
        <div className="flex items-center justify-between"><span className="text-slate-600 text-sm">{cur+1}/{questions.length}</span><button onClick={handleNext} disabled={!picked && !!q.options} className={`px-4 py-2 rounded-xl text-sm font-bold min-h-[40px] ${picked || !q.options ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-600'}`}>{cur < questions.length - 1 ? 'Next →' : 'Finish'}</button></div>
      </div>
    </div>
  );
}
