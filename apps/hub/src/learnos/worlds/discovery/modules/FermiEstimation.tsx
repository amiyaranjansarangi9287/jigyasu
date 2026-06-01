// src/worlds/discovery/modules/FermiEstimation.tsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { useDiscoverySession } from '../hooks/useDiscoverySession';

const PROBLEMS = [
  { id: 'rickshaws', question: 'How many auto-rickshaws in Mumbai?', emoji: '🛺', steps: [{ label: 'Mumbai population', hint: '~20 million' }, { label: '% using rickshaws daily', hint: '~10%' }, { label: 'Trips per rickshaw/day', hint: '~30' }], answer: '~70,000', real: '~100,000 permitted', indian: true },
  { id: 'heartbeats', question: 'How many heartbeats in a lifetime?', emoji: '❤️', steps: [{ label: 'Beats per minute', hint: '~70' }, { label: 'Minutes per year', hint: '~525,600' }, { label: 'Years of life', hint: '~70' }], answer: '~2.6 billion', real: '~2.5 billion', indian: false },
  { id: 'searches', question: 'Google searches in India per day?', emoji: '🔍', steps: [{ label: 'Internet users in India', hint: '~700 million' }, { label: '% who search daily', hint: '~60%' }, { label: 'Searches per person', hint: '~5' }], answer: '~2 billion', real: '~3.5 billion', indian: true },
];

export default function FermiEstimation() {
  const lumo = useLumoSage();
  const { recordFermiAttempt } = useDiscoveryProgress();
  const { trackEvent } = useDiscoverySession();
  const [probIdx, setProbIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [estimates, setEstimates] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  const prob = PROBLEMS[probIdx];

  const handleStepSubmit = useCallback((value: string) => {
    const newEst = [...estimates, value];
    setEstimates(newEst);
    if (newEst.length >= prob.steps.length) {
      setRevealed(true);
    } else {
      setStepIdx(s => s + 1);
    }
  }, [estimates, prob]);

  const handleReveal = useCallback(async () => {
    setRevealed(true);
    lumo.afterDiscovery();
    await recordFermiAttempt(prob.id, 70);
    await trackEvent('fermi-estimation', 'correct_answer', { problem: prob.id });
  }, [prob, lumo, recordFermiAttempt, trackEvent]);

  const handleNext = () => {
    setProbIdx(p => (p + 1) % PROBLEMS.length);
    setStepIdx(0); setEstimates([]); setRevealed(false);
  };

  return (
    <DiscoveryShell module="fermi-estimation">
      <div className="flex-1 flex flex-col p-5 bg-slate-900 pb-24">
        {/* Problem selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {PROBLEMS.map((p, i) => (
            <button key={p.id} onClick={() => { setProbIdx(i); setStepIdx(0); setEstimates([]); setRevealed(false); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold min-h-[44px] ${probIdx === i ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
              {p.emoji} {p.id}
            </button>
          ))}
        </div>

        {/* Problem card */}
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-4 text-center">
          <div className="text-5xl mb-3">{prob.emoji}</div>
          <p className="text-white font-bold text-lg">{prob.question}</p>
          {prob.indian && <p className="text-amber-400 text-sm mt-2">🇮🇳 Indian estimation</p>}
        </div>

        {/* Step builder */}
        <div className="space-y-3 mb-4">
          {prob.steps.map((step, i) => (
            <div key={i} className={`bg-slate-800 rounded-xl p-3 border transition-all ${i < estimates.length ? 'border-green-700/50' : i === stepIdx ? 'border-indigo-500' : 'border-slate-700 opacity-40'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 text-sm font-bold">Step {i + 1}: {step.label}</span>
                {i < estimates.length && <span className="text-green-400 text-sm">✓</span>}
              </div>
              {i === stepIdx && !revealed && i >= estimates.length && (
                <StepInput onSubmit={handleStepSubmit} hint={step.hint} />
              )}
              {i < estimates.length && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white font-bold">Your estimate: {estimates[i]}</span>
                  <span className="text-slate-500">Hint: {step.hint}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Result */}
        <AnimatePresence>
          {revealed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-indigo-900/30 border border-indigo-700/50 rounded-2xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-indigo-400 text-sm font-bold">Your Estimate</p>
                  <p className="text-white font-bold text-lg">{prob.answer}</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 text-sm font-bold">Real Answer</p>
                  <p className="text-white font-bold text-lg">{prob.real}</p>
                </div>
              </div>
              <p className="text-indigo-300 text-sm text-center italic">
                "The reasoning matters more than the answer."
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!revealed && estimates.length >= prob.steps.length ? (
          <button onClick={handleReveal} className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl min-h-[52px]">
            Reveal Answer! 🔍
          </button>
        ) : revealed ? (
          <button onClick={handleNext} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl min-h-[52px]">
            Next Problem →
          </button>
        ) : null}
      </div>
    </DiscoveryShell>
  );
}

function StepInput({ onSubmit, hint }: { onSubmit: (v: string) => void; hint: string }) {
  const [val, setVal] = useState('');
  return (
    <div className="flex gap-2 mt-1">
      <input type="text" value={val} onChange={e => setVal(e.target.value)} placeholder={hint}
        className="flex-1 bg-slate-700 text-white rounded-xl px-3 py-2 text-sm border border-slate-600 focus:border-indigo-500 focus:outline-none" />
      <button onClick={() => { if (val.trim()) onSubmit(val.trim()); }}
        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold min-h-[40px]">→</button>
    </div>
  );
}
