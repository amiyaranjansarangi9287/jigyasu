// src/worlds/lab/ExpertMode.tsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabProgress } from './hooks/useLabProgress';
import type { LabModule } from './types/lab.types';

const QUESTIONS: Record<string, { q1: string; kw1: string[]; q2: string; kw2: string[] }> = {
  'circuit-builder': { q1: "What makes a circuit 'complete'?", kw1: ['loop','path','flow','battery'], q2: 'What happens if you break it?', kw2: ['off','stop','dark','open'] },
  'fraction-kitchen': { q1: 'Recipe serves 4, you need 12. What do you do?', kw1: ['multiply','triple','3','times'], q2: 'What about serving 6?', kw2: ['1.5','half','multiply'] },
  'ecosystem-sandbox': { q1: 'What is a food chain?', kw1: ['sun','plant','eat','animal'], q2: 'What if plants disappear?', kw2: ['die','starve','collapse'] },
  'force-lab': { q1: 'What is friction?', kw1: ['slow','stop','surface','rough'], q2: 'If friction vanished?', kw2: ['slide','slip','walk'] },
  'weather-station': { q1: 'Which reading predicts rain best?', kw1: ['pressure','humidity','low','moisture'], q2: 'Why does low pressure mean rain?', kw2: ['air','rise','cool','clouds'] },
  'code-story': { q1: 'What is IF/THEN? Real-life example?', kw1: ['condition','if','then','check'], q2: 'What is a LOOP?', kw2: ['repeat','again','many','multiple'] },
  'buoyancy-lab': { q1: 'Why do some things float?', kw1: ['density','lighter','water','volume'], q2: 'Why does a ship float but a coin sinks?', kw2: ['shape','hollow','volume','air'] },
  'lever-explorer': { q1: 'How does moving a fulcrum help?', kw1: ['closer','force','multiply','effort'], q2: 'Name three levers in daily life.', kw2: ['seesaw','scissors','door'] },
  'statistics-playground': { q1: 'Difference between mean and median?', kw1: ['average','middle','outlier'], q2: 'One scores 100, others 50. Which is fairer?', kw2: ['median','middle','fair'] },
  'human-body': { q1: 'Name two systems that work together.', kw1: ['circulatory','respiratory','oxygen','blood'], q2: 'If respiratory stopped?', kw2: ['oxygen','die','breathe'] },
};

interface Props { visible: boolean; module: LabModule; onClose: () => void; onExpertEarned: () => void; }

export default function ExpertMode({ visible, module, onClose, onExpertEarned }: Props) {
  const [phase, setPhase] = useState<'q1'|'q2'|'done'>('q1');
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');
  const [f1, setF1] = useState<'none'|'good'|'partial'>('none');
  const [f2, setF2] = useState<'none'|'good'|'partial'>('none');
  const { updateCertification } = useLabProgress();
  const qs = QUESTIONS[module];

  const evaluate = useCallback((answer: string, keywords: string[]) => {
    const lower = answer.toLowerCase();
    return keywords.filter(kw => lower.includes(kw)).length >= 2 ? 'good' as const : 'partial' as const;
  }, []);

  const submitQ1 = useCallback(() => {
    if (a1.trim().length < 10) return;
    setF1(evaluate(a1, qs.kw1));
    setTimeout(() => setPhase('q2'), 1500);
  }, [a1, qs, evaluate]);

  const submitQ2 = useCallback(async () => {
    if (a2.trim().length < 10) return;
    const r = evaluate(a2, qs.kw2);
    setF2(r);
    if (f1 === 'good' || r === 'good') { await updateCertification(module, 'expert'); onExpertEarned(); }
    setTimeout(() => setPhase('done'), 1500);
  }, [a2, qs, evaluate, f1, module, updateCertification, onExpertEarned]);

  const reset = () => { setPhase('q1'); setA1(''); setA2(''); setF1('none'); setF2('none'); };
  if (!qs) return null;

  return (
    <AnimatePresence>{visible && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/90 flex items-end justify-center">
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} className="bg-slate-900 rounded-t-3xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><span className="text-2xl">🦉</span><div><p className="text-white font-bold text-sm">Expert Mode</p><p className="text-slate-400 text-sm">Explain to Lumo</p></div></div>
            <button onClick={onClose} className="text-slate-400 text-xl">✕</button>
          </div>
          <div className="flex gap-2 mb-5">{['q1','q2','done'].map((p, i) => (<div key={p} className={`flex-1 h-1.5 rounded-full ${(i === 0 && phase !== 'q1') || (i <= 1 && phase === 'done') || (i === 0 && phase === 'q1') ? 'bg-blue-500' : 'bg-slate-700'}`} />))}</div>

          {phase === 'q1' && (
            <div>
              <div className="bg-slate-800 rounded-2xl p-4 mb-4"><p className="text-white text-sm font-medium">{qs.q1}</p></div>
              <textarea value={a1} onChange={e => setA1(e.target.value)} placeholder="Type your explanation..." rows={4} className="w-full bg-slate-800 text-white rounded-2xl p-4 text-sm resize-none border border-slate-700 focus:border-blue-500 focus:outline-none placeholder-slate-500" />
              {f1 !== 'none' && <div className={`mt-3 rounded-xl p-3 text-sm font-medium ${f1 === 'good' ? 'bg-green-900/50 text-green-300' : 'bg-amber-900/50 text-amber-300'}`}>{f1 === 'good' ? '✓ Good explanation!' : '◎ Reasonable start.'}</div>}
              {f1 === 'none' && <button onClick={submitQ1} disabled={a1.trim().length < 10} className={`w-full py-4 rounded-2xl font-bold mt-3 min-h-[52px] ${a1.trim().length >= 10 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>Submit →</button>}
            </div>
          )}

          {phase === 'q2' && (
            <div>
              <div className="bg-slate-800 rounded-2xl p-4 mb-4"><p className="text-slate-400 text-sm mb-1">Follow-up</p><p className="text-white text-sm font-medium">{qs.q2}</p></div>
              <textarea value={a2} onChange={e => setA2(e.target.value)} placeholder="Think carefully..." rows={4} className="w-full bg-slate-800 text-white rounded-2xl p-4 text-sm resize-none border border-slate-700 focus:border-blue-500 focus:outline-none placeholder-slate-500" />
              {f2 !== 'none' && <div className={`mt-3 rounded-xl p-3 text-sm font-medium ${f2 === 'good' ? 'bg-green-900/50 text-green-300' : 'bg-amber-900/50 text-amber-300'}`}>{f2 === 'good' ? '✓ Excellent!' : '◎ Good effort.'}</div>}
              {f2 === 'none' && <button onClick={submitQ2} disabled={a2.trim().length < 10} className={`w-full py-4 rounded-2xl font-bold mt-3 min-h-[52px] ${a2.trim().length >= 10 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>Final Answer →</button>}
            </div>
          )}

          {phase === 'done' && (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">{f1 === 'good' || f2 === 'good' ? '⭐' : '🔬'}</div>
              <h3 className="text-xl font-extrabold text-white mb-2">{f1 === 'good' || f2 === 'good' ? 'Expert Earned!' : 'Scientist Level'}</h3>
              <p className="text-slate-400 text-sm mb-6">{f1 === 'good' || f2 === 'good' ? 'You can explain this clearly. That is mastery.' : 'Keep practicing — explaining gets easier.'}</p>
              <div className="flex gap-3"><button onClick={reset} className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-2xl">Try Again</button><button onClick={onClose} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl">Back</button></div>
            </div>
          )}
        </motion.div>
      </motion.div>
    )}</AnimatePresence>
  );
}
