// src/worlds/lab/LabReport.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useLabReport } from './hooks/useLabReport';
import { LAB_MODULES } from './data/labContent';
import { Trans } from "react-i18next";

interface Props { visible: boolean; onClose: () => void; }
const certEmoji: Record<string, string> = { explorer: '🔍', scientist: '🔬', expert: '⭐' };
const certColor: Record<string, string> = { explorer: '#0EA5E9', scientist: '#8B5CF6', expert: '#F59E0B' };

export default function LabReport({ visible, onClose }: Props) {
  const { generateReport, getCertification } = useLabReport();
  const report = generateReport();

  return (
    <AnimatePresence>{visible && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-end justify-center p-4" onClick={onClose}>
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="bg-slate-900 rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl px-5 pt-6 pb-5">
            <div className="flex items-center justify-between mb-2"><h2 className="text-xl font-extrabold text-white"><Trans i18nKey="auto.labreport.lab_report">Lab Report</Trans></h2><button onClick={onClose} className="text-white/60 hover:text-white text-lg">✕</button></div>
            <p className="text-blue-200 text-sm"><Trans i18nKey="auto.labreport.your_scientific_journey_so_far">🦚 Your scientific journey so far</Trans></p>
          </div>
          {report && (
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800 rounded-2xl p-3 text-center"><div className="text-2xl font-bold text-white">{report.totalExplored}</div><div className="text-sm text-slate-400"><Trans i18nKey="auto.labreport.of">of</Trans> {report.total}</div></div>
                <div className="bg-slate-800 rounded-2xl p-3 text-center"><div className="text-2xl font-bold text-purple-400">{report.crossConcepts}</div><div className="text-sm text-slate-400"><Trans i18nKey="auto.labreport.connections">connections</Trans></div></div>
                <div className="bg-slate-800 rounded-2xl p-3 text-center"><div className="text-2xl font-bold text-amber-400">{report.minutes}</div><div className="text-sm text-slate-400"><Trans i18nKey="auto.labreport.minutes">minutes</Trans></div></div>
              </div>
              <div className="bg-slate-800 rounded-2xl p-4">
                <p className="text-slate-400 text-sm font-bold uppercase mb-3"><Trans i18nKey="auto.labreport.certifications">Certifications</Trans></p>
                <div className="flex gap-3">{(['explorer','scientist','expert'] as const).map(l => (
                  <div key={l} className="flex-1 text-center"><div className="text-2xl mb-1">{certEmoji[l]}</div><div className="text-xl font-bold" style={{ color: certColor[l] }}>{report.certs[l]}</div><div className="text-sm text-slate-400 capitalize">{l}</div></div>
                ))}</div>
              </div>
              <div className="grid grid-cols-4 gap-2">{LAB_MODULES.map(m => {
                const cert = getCertification(m.id);
                return (<div key={m.id} className={`rounded-xl p-2 text-center ${cert ? 'bg-slate-800' : 'bg-slate-900 opacity-40'}`}><div className="text-xl">{m.emoji}</div>{cert && <div className="text-sm mt-1" style={{ color: certColor[cert] }}>{certEmoji[cert]}</div>}</div>);
              })}</div>
              <div className="bg-indigo-900/50 rounded-2xl p-4 border border-indigo-700/50"><div className="flex items-start gap-2"><span className="text-2xl">🦚</span><p className="text-indigo-200 text-sm italic"><Trans i18nKey="auto.labreport.every_experiment_taught_you_so">"Every experiment taught you something. That is science."</Trans></p></div></div>
              <button onClick={onClose} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl min-h-[52px]"><Trans i18nKey="auto.labreport.back_to_lab">Back to Lab</Trans></button>
            </div>
          )}
        </motion.div>
      </motion.div>
    )}</AnimatePresence>
  );
}
