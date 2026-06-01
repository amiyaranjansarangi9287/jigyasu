// src/worlds/academy/AcademyHome.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import { useAcademyProgress } from './hooks/useAcademyProgress';
import { ACADEMY_MODULES } from './data/academyContent';
import type { AcademySubject } from './types/academy.types';
import AcademyReport from './AcademyReport';
import PeerChallenge from './PeerChallenge';

const FILTERS: { id: AcademySubject | 'all'; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'mathematics', label: 'Maths' }, { id: 'physics', label: 'Physics' },
  { id: 'chemistry', label: 'Chemistry' }, { id: 'biology', label: 'Biology' }, { id: 'economics', label: 'Econ' }, { id: 'english', label: 'English' },
];
const DL = { surface: '○', mechanism: '◐', principle: '●', frontier: '★' };
const DC = { surface: '#6366F1', mechanism: '#8B5CF6', principle: '#06B6D4', frontier: '#F59E0B' };

export default function AcademyHome() {
  const navigate = useNavigate();
  const { getDepth } = useAcademyProgress();
  const [subject, setSubject] = useState<AcademySubject | 'all'>('all');
  const [examMode, setExamMode] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);

  const filtered = subject === 'all' ? ACADEMY_MODULES : ACADEMY_MODULES.filter(m => m.subject === subject);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800/50 px-5 pt-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div><h1 className="text-2xl font-extrabold text-white tracking-tight">The Academy</h1></div>
          <button onClick={() => setExamMode(!examMode)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold border min-h-[40px] transition-all ${examMode ? 'bg-indigo-900/50 border-indigo-600 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{examMode ? '📝 Exam' : '🔬 Explore'}</button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowReport(true)} className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-slate-300 hover:border-slate-600 transition-all min-h-[40px]">📋 Report</button>
          <button onClick={() => setShowChallenge(true)} className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-slate-300 hover:border-slate-600 transition-all min-h-[40px]">🎯 Challenges</button>
        </div>
      </div>

      <div className="px-5 pt-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map(f => (<button key={f.id} onClick={() => setSubject(f.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-bold min-h-[36px] transition-all ${subject === f.id ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>{f.label}</button>))}
      </div>

      <div className="px-5 pb-24 pt-2 space-y-2">
        {filtered.map((mod, i) => {
          const depth = getDepth(mod.id);
          return (
            <motion.button key={mod.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              onClick={() => navigate(`/academy/${mod.path}`)}
              className="w-full bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 text-left transition-all active:scale-99 flex items-start gap-4">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <span className="text-3xl">{mod.emoji}</span>
                {depth && <span className="text-sm font-bold" style={{ color: DC[depth] }}>{DL[depth]}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1"><p className="font-bold text-white text-sm">{mod.title}</p>
                  <span className="px-1.5 py-0.5 rounded text-sm font-medium flex-shrink-0" style={{ backgroundColor: `${mod.color}22`, color: mod.color }}>{mod.subject}</span></div>
                <p className="text-slate-500 text-sm leading-snug">{examMode ? mod.examRelevance : mod.hook}</p>
              </div>
              <span className="text-slate-700 text-sm flex-shrink-0 mt-1">→</span>
            </motion.button>
          );
        })}
      </div>
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <AcademyReport visible={showReport} onClose={() => setShowReport(false)} />
      <PeerChallenge visible={showChallenge} onClose={() => setShowChallenge(false)} />
    </div>
  );
}
