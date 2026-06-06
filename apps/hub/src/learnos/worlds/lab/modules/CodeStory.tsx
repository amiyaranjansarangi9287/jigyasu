// src/worlds/lab/modules/CodeStory.tsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LabShell from '../LabShell';
import { useLumoOwl } from '../hooks/useLumoOwl';
import { useLabProgress } from '../hooks/useLabProgress';
import { useLabSession } from '../hooks/useLabSession';
import { useCrossConceptDetector } from '../hooks/useCrossConceptDetector';
import { CODE_CHALLENGES } from '../data/labContent';

const BLOCK_DEFS: Record<string, { label: string; emoji: string; color: string }> = {
  'move-right': { label: 'Move Right', emoji: '➡️', color: '#3B82F6' },
  'move-left': { label: 'Move Left', emoji: '⬅️', color: '#3B82F6' },
  'move-up': { label: 'Move Up', emoji: '⬆️', color: '#3B82F6' },
  'move-down': { label: 'Move Down', emoji: '⬇️', color: '#3B82F6' },
  'if-dragon': { label: 'IF dragon', emoji: '🐉', color: '#8B5CF6' },
  'then-left': { label: 'THEN left', emoji: '⬅️', color: '#8B5CF6' },
  'else-right': { label: 'ELSE right', emoji: '➡️', color: '#7C3AED' },
  'repeat-5': { label: 'REPEAT ×5', emoji: '🔁', color: '#10B981' },
  'repeat-4': { label: 'REPEAT ×4', emoji: '🔁', color: '#10B981' },
  'collect': { label: 'Collect', emoji: '🪙', color: '#F59E0B' },
};

export default function CodeStory() {
  const lumo = useLumoOwl('code-story');
  const { recordCodeStory, updateCertification } = useLabProgress();
  const { trackEvent } = useLabSession();
  useCrossConceptDetector('code-story');

  const [idx, setIdx] = useState(0);
  const [blocks, setBlocks] = useState<{ id: string; type: string }[]>([]);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState<'success'|'fail'|null>(null);

  const ch = CODE_CHALLENGES[idx];

  const addBlock = useCallback((type: string) => { if (!running) setBlocks(p => [...p, { id: `${Date.now()}`, type }]); }, [running]);

  const runCode = useCallback(async () => {
    if (blocks.length === 0) return;
    setRunning(true); setResult(null);
    for (let i = 0; i < blocks.length; i++) { await new Promise(r => setTimeout(r, 400)); setStep(i); }
    await new Promise(r => setTimeout(r, 500));
    const types = blocks.map(b => b.type);
    const ok = ch.solutionBlocks.every(s => types.includes(s));
    setResult(ok ? 'success' : 'fail'); setStep(-1); setRunning(false);
    if (ok) {
      lumo.showAfterDiscovery();
      const usedIf = types.some(t => t.startsWith('if-') || t.startsWith('then'));
      const usedLoop = types.some(t => t.startsWith('repeat'));
      await recordCodeStory(true, usedIf, usedLoop);
      await updateCertification('code-story', 'explorer');
      await trackEvent('code-story', 'correct_answer');
    } else { await trackEvent('code-story', 'wrong_answer'); }
  }, [blocks, ch, lumo, recordCodeStory, updateCertification, trackEvent]);

  return (
    <LabShell module="code-story" subject="computer-science">
      <div className="min-h-screen bg-teal-50 flex flex-col">
        <div className="bg-white border-b px-5 pt-5 pb-4">
          <div className="flex items-start gap-3"><span className="text-4xl">{ch.characterEmoji}</span><div className="flex-1"><h2 className="font-extrabold text-slate-800">{ch.title}</h2><p className="text-sm text-slate-500">{ch.story}</p></div><span className="text-3xl">{ch.sceneEmoji}</span></div>
          <div className="mt-2 text-sm font-bold text-teal-600 bg-teal-100 px-3 py-1 rounded-full inline-block">Goal: {ch.goal}</div>
        </div>
        <div className="bg-white border-b px-3 py-3">
          <p className="text-sm text-slate-400 font-bold mb-2">BLOCKS</p>
          <div className="flex flex-wrap gap-2">{ch.availableBlocks.map(bt => {
            const d = BLOCK_DEFS[bt]; if (!d) return null;
            return <button key={bt} onClick={() => addBlock(bt)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-bold min-h-[44px]" style={{ borderColor: d.color, color: d.color, backgroundColor: `${d.color}15` }}><span>{d.emoji}</span><span className="text-sm">{d.label}</span></button>;
          })}</div>
        </div>
        <div className="flex-1 px-4 py-4">
          <div className="flex items-center justify-between mb-3"><p className="text-sm font-bold text-slate-600">My Code ({blocks.length})</p><button onClick={() => { setBlocks([]); setResult(null); }} className="text-sm text-red-500 font-bold">Clear</button></div>
          <div className="min-h-[120px] bg-slate-800 rounded-2xl p-3 space-y-2 mb-4">
            {blocks.length === 0 ? <p className="text-slate-500 text-sm text-center py-4">Add blocks above...</p>
            : blocks.map((b, i) => {
              const d = BLOCK_DEFS[b.type] ?? { emoji: '?', label: b.type, color: '#888' };
              return <div key={b.id} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${step === i ? 'ring-2 ring-white scale-105' : ''}`} style={{ backgroundColor: `${d.color}33` }}>
                <span className="text-sm font-mono text-slate-400 w-5">{i+1}.</span><span>{d.emoji}</span><span className="text-sm font-bold text-white flex-1">{d.label}</span>
                {step === i && <span className="text-white animate-pulse">▶</span>}
                {!running && <button onClick={() => setBlocks(p => p.filter(x => x.id !== b.id))} className="text-slate-500 text-sm">✕</button>}
              </div>;
            })}
          </div>
          <AnimatePresence>{result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-4 mb-4 flex items-center gap-2 ${result === 'success' ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
              <span className="text-2xl">{result === 'success' ? '✅' : '🤔'}</span>
              <p className={`font-bold text-sm ${result === 'success' ? 'text-green-400' : 'text-red-400'}`}>{result === 'success' ? 'Goal achieved!' : `Try again. ${ch.hint}`}</p>
            </motion.div>
          )}</AnimatePresence>
        </div>
        <div className="px-5 pb-24 pt-2">
          {result !== 'success' ? <button onClick={runCode} disabled={running || blocks.length === 0} className={`w-full py-4 rounded-2xl font-bold text-lg min-h-[56px] ${running || blocks.length === 0 ? 'bg-slate-700 text-slate-500' : 'bg-teal-600 text-white'}`}>{running ? '⚙️ Running...' : '▶ Run Code'}</button>
          : <button onClick={() => { setIdx(p => (p + 1) % CODE_CHALLENGES.length); setBlocks([]); setResult(null); }} className="w-full py-4 bg-teal-600 text-white font-bold text-lg rounded-2xl min-h-[56px]">Next Challenge →</button>}
        </div>
      </div>
    </LabShell>
  );
}
