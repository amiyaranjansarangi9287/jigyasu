// src/worlds/academy/AcademyReport.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useAcademyReport } from './hooks/useAcademyReport';
import { ACADEMY_MODULES } from './data/academyContent';

interface AcademyReportProps {
  visible: boolean;
  onClose: () => void;
}

const DEPTH_CONFIG = {
  surface: { label: 'Surface', color: '#6366F1', symbol: '○' },
  mechanism: { label: 'Mechanism', color: '#8B5CF6', symbol: '◐' },
  principle: { label: 'Principle', color: '#06B6D4', symbol: '●' },
  frontier: { label: 'Frontier', color: '#F59E0B', symbol: '★' },
};

export default function AcademyReport({ visible, onClose }: AcademyReportProps) {
  const { generateReport, getDepth } = useAcademyReport();
  const report = generateReport();

  return (
    <AnimatePresence>
      {visible && report && (
        <motion.div className="fixed inset-0 z-50 bg-slate-950/98 flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="bg-slate-900 rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto border-t border-slate-800" initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-slate-900 px-5 pt-5 pb-3 border-b border-slate-800 flex items-center justify-between">
              <div><h2 className="text-lg font-extrabold text-white">Academy Report</h2><p className="text-slate-500 text-sm">Depth of understanding across 12 concepts</p></div>
              <button onClick={onClose} className="text-slate-600 hover:text-slate-400 text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gradient-to-r from-indigo-950 to-slate-900 rounded-2xl p-4 border border-indigo-800/30">
                <div className="flex items-center justify-between mb-2"><p className="text-indigo-400 text-sm font-bold uppercase tracking-wider">Exam Readiness</p><p className="text-white text-2xl font-extrabold">{report.readinessScore}<span className="text-slate-500 text-sm font-normal">/100</span></p></div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-700 to-cyan-500" initial={{ width: 0 }} animate={{ width: `${report.readinessScore}%` }} /></div>
              </div>
              <div className="bg-slate-800 rounded-2xl p-4">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-3">Depth Breakdown</p>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(DEPTH_CONFIG) as Array<keyof typeof DEPTH_CONFIG>).map((key) => (
                    <div key={key} className="text-center"><div className="text-xl font-bold" style={{ color: DEPTH_CONFIG[key].color }}>{report.depthCounts[key]}</div><div className="text-sm" style={{ color: DEPTH_CONFIG[key].color }}>{DEPTH_CONFIG[key].symbol}</div><div className="text-slate-600 text-sm">{DEPTH_CONFIG[key].label}</div></div>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                {ACADEMY_MODULES.map((module) => {
                  const depth = getDepth(module.id);
                  return <div key={module.id} className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-xl"><span className="text-lg">{module.emoji}</span><span className="text-slate-300 text-sm flex-1 truncate">{module.title}</span>{depth ? <span className="text-sm font-bold" style={{ color: DEPTH_CONFIG[depth].color }}>{DEPTH_CONFIG[depth].symbol} {DEPTH_CONFIG[depth].label}</span> : <span className="text-slate-700 text-sm">Not started</span>}</div>;
                })}
              </div>
              <button onClick={onClose} className="w-full py-4 bg-indigo-700 text-white font-bold text-sm rounded-2xl min-h-[52px]">Back to Academy</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}