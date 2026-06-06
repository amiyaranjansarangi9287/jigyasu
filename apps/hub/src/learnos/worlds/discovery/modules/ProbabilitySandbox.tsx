// src/worlds/discovery/modules/ProbabilitySandbox.tsx
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { useDiscoverySession } from '../hooks/useDiscoverySession';
import { useConceptBridges } from '../hooks/useConceptBridges';

const EXPERIMENTS = [
  { id: 'coin', name: 'Coin Flip', emoji: '🪙', outcomes: ['Heads', 'Tails'], probs: [0.5, 0.5] },
  { id: 'dice', name: 'Dice Roll', emoji: '🎲', outcomes: ['1','2','3','4','5','6'], probs: [1/6,1/6,1/6,1/6,1/6,1/6] },
  { id: 'birthday', name: 'Birthday Paradox', emoji: '🎂', outcomes: ['Match', 'No Match'], probs: [0.5, 0.5] },
];

export default function ProbabilitySandbox() {
  const { t } = useTranslation();
  const lumo = useLumoSage();
  const { recordProbabilityExperiment } = useDiscoveryProgress();
  const { trackEvent } = useDiscoverySession();
  useConceptBridges('probability-sandbox');
  const [expIdx, setExpIdx] = useState(0);
  const [sampleSize, setSampleSize] = useState(10);
  const [results, setResults] = useState<number[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const exp = EXPERIMENTS[expIdx];

  const runExperiment = useCallback(async () => {
    const counts = new Array(exp.outcomes.length).fill(0);
    for (let i = 0; i < sampleSize; i++) {
      let r = Math.random(), cum = 0;
      for (let j = 0; j < exp.probs.length; j++) { cum += exp.probs[j]; if (r < cum) { counts[j]++; break; } }
    }
    setResults(counts); setHasRun(true);
    const isParadox = exp.id === 'birthday' && sampleSize >= 23;
    await recordProbabilityExperiment(exp.id, isParadox);
    await trackEvent('probability-sandbox', 'correct_answer', { experiment: exp.id, sampleSize });
    if (sampleSize >= 100) lumo.show("As the sample grows, the results stabilise. That is the Law of Large Numbers.", 'celebrating');
  }, [exp, sampleSize, recordProbabilityExperiment, trackEvent, lumo]);

  return (
    <DiscoveryShell module="probability-sandbox">
      <div className="flex-1 flex flex-col p-5 bg-slate-900 pb-24">
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">{EXPERIMENTS.map((e, i) => (
          <button key={e.id} onClick={() => { setExpIdx(i); setResults([]); setHasRun(false); }} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold min-h-[44px] ${expIdx === i ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>{e.emoji} {e.name}</button>
        ))}</div>

        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4 text-center">
          <div className="text-6xl mb-2">{exp.emoji}</div>
          <p className="text-white font-bold">{exp.name}</p>
        </div>

        {/* Sample size */}
        <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 mb-4">
          <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">{t('discovery.modules.ProbabilitySandbox.spn_SampleSize', 'Sample Size')}</span><span className="text-white font-bold">{sampleSize}</span></div>
          <div className="flex gap-2">{[10, 100, 1000].map(s => (
            <button key={s} onClick={() => { setSampleSize(s); setResults([]); setHasRun(false); }} className={`flex-1 py-2 rounded-lg text-sm font-bold min-h-[40px] ${sampleSize === s ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-400'}`}>{s}</button>
          ))}</div>
        </div>

        {/* Results */}
        {hasRun && results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4">
            <p className="text-slate-400 text-sm font-bold mb-3">RESULTS ({sampleSize} trials)</p>
            <div className="space-y-2">{exp.outcomes.map((o, i) => {
              const pct = sampleSize > 0 ? (results[i] / sampleSize) * 100 : 0;
              const expected = exp.probs[i] * 100;
              return (
                <div key={o}>
                  <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">{o}</span><span className="text-white font-bold">{results[i]} ({pct.toFixed(1)}%)</span></div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden relative">
                    <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    <div className="absolute top-0 h-full w-0.5 bg-yellow-400" style={{ left: `${expected}%` }} title={`Expected: ${expected.toFixed(1)}%`} />
                  </div>
                </div>
              );
            })}</div>
            <p className="text-slate-500 text-sm mt-2 text-center">{t('discovery.modules.ProbabilitySandbox.txt_Yellowline', 'Yellow line = expected probability')}</p>
          </motion.div>
        )}

        <button onClick={runExperiment} className="w-full py-4 bg-red-600 text-white font-bold text-base rounded-2xl min-h-[52px]">🎲 Run {sampleSize} Trials!</button>
      </div>
    </DiscoveryShell>
  );
}
