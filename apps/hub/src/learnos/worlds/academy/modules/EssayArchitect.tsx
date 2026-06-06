// src/worlds/academy/modules/EssayArchitect.tsx
import { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import AcademyShell from '../AcademyShell';
import { useLumoAncient } from '../hooks/useLumoAncient';
import { useAcademyProgress } from '../hooks/useAcademyProgress';
import { ESSAY_PROMPTS } from '../data/academyContent';

const BLOCKS = ['thesis', 'evidence', 'analysis', 'counter', 'rebuttal', 'conclusion'];

export default function EssayArchitect() {
  const { t } = useTranslation();
  const lumo = useLumoAncient();
  const { recordEssay } = useAcademyProgress();
  const [promptIdx, setPromptIdx] = useState(0);
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [showModel, setShowModel] = useState(false);
  const prompt = ESSAY_PROMPTS[promptIdx];

  const score = useMemo(() => {
    const filled = BLOCKS.filter((b) => (blocks[b] ?? '').trim().length > 20).length;
    const counterStrong = (blocks.counter ?? '').trim().length >= 30;
    const rebuttalLinked = (blocks.rebuttal ?? '').toLowerCase().includes('however') || (blocks.rebuttal ?? '').toLowerCase().includes('therefore');
    return Math.min(100, filled * 12 + (counterStrong ? 14 : 0) + (rebuttalLinked ? 14 : 0));
  }, [blocks]);

  const saveEssay = useCallback(async () => {
    const counterStrong = (blocks.counter ?? '').trim().length >= 30;
    await recordEssay(prompt.id, counterStrong, score);
    if (counterStrong) lumo.afterProfoundDiscovery();
  }, [blocks, prompt, score, recordEssay, lumo]);

  return (
    <AcademyShell module="essay-architect">
      <div className="min-h-screen bg-slate-950 p-5 pb-24">
        <div className="flex gap-2 overflow-x-auto mb-4 no-scrollbar">{ESSAY_PROMPTS.map((p, i) => <button key={p.id} onClick={() => { setPromptIdx(i); setBlocks({}); }} className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-bold ${promptIdx === i ? 'bg-violet-900/70 text-violet-300 border border-violet-600' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>{p.title}</button>)}</div>
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 mb-4"><p className="text-white font-bold">{prompt.prompt}</p><p className="text-slate-500 text-sm mt-2">{prompt.examinerTip}</p></div>
        <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 mb-4"><div className="flex justify-between text-sm mb-2"><span className="text-slate-400 font-bold">{t('academy.modules.EssayArchitect.spn_FlowScore', 'Flow Score')}</span><span className="text-white font-bold">{score}/100</span></div><div className="h-2 bg-slate-800 rounded-full"><div className="h-full bg-violet-500 rounded-full" style={{ width: `${score}%` }} /></div></div>
        <div className="space-y-3">{BLOCKS.map((b) => <div key={b} className="bg-slate-900 rounded-xl border border-slate-800 p-3"><p className="text-violet-400 text-sm font-bold uppercase mb-2">{b}</p><textarea value={blocks[b] ?? ''} onChange={(e) => setBlocks((prev) => ({ ...prev, [b]: e.target.value }))} rows={2} className="w-full bg-slate-950 text-white rounded-lg p-3 text-sm border border-slate-800 focus:outline-none focus:border-violet-600" placeholder={`Write your ${b}...`} /></div>)}</div>
        <button onClick={() => setShowModel(!showModel)} className="w-full mt-4 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold">{showModel ? 'Hide' : 'Show'} Model Structure</button>
        {showModel && <div className="mt-3 bg-violet-950/30 border border-violet-900/40 rounded-xl p-3 text-sm text-violet-200">Thesis → Evidence → Analysis → Counter → Rebuttal → Conclusion. Every block must earn its place.</div>}
        <button onClick={saveEssay} className="w-full mt-4 py-4 bg-violet-700 text-white rounded-2xl font-bold">{t('academy.modules.EssayArchitect.btn_SaveStruct', 'Save Structure')}</button>
      </div>
    </AcademyShell>
  );
}
