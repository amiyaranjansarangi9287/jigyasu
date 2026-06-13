// src/worlds/discovery/DiscoveryReport.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useDiscoveryReport } from './hooks/useDiscoveryReport';
import { DISCOVERY_MODULES } from './data/discoveryContent';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

interface Props { visible: boolean; onClose: () => void; }
const MC = { aware: '#6366F1', understand: '#8B5CF6', apply: '#06B6D4', connect: '#F59E0B' };

export default function DiscoveryReport({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { generateReport, getMastery } = useDiscoveryReport();
  const report = generateReport();

  return (
    <AnimatePresence>{visible && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/95 flex items-end justify-center" onClick={onClose}>
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} className="bg-slate-900 rounded-t-3xl w-full max-w-md max-h-[88vh] overflow-y-auto border-t border-slate-700" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-slate-900 px-5 pt-5 pb-3 border-b border-slate-800 flex items-center justify-between">
            <div><h2 className="text-lg font-extrabold text-white"><Trans i18nKey="auto.discoveryreport.discovery_report">Discovery Report</Trans></h2><p className="text-slate-500 text-sm"><Trans i18nKey="auto.discoveryreport.your_constellation_of_knowledg">Your constellation of knowledge</Trans></p></div>
            <button onClick={onClose} className="text-slate-500 text-xl">✕</button>
          </div>
          {report && (
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-4 gap-2">{(['aware','understand','apply','connect'] as const).map(l => {
                const c = l === 'aware' ? report.modulesAware : l === 'understand' ? report.modulesUnderstood : l === 'apply' ? report.modulesApplied : report.modulesConnected;
                return <div key={l} className="bg-slate-800 rounded-xl p-3 text-center"><div className="text-xl font-bold" style={{ color: MC[l] }}>{c}</div><div className="text-slate-500 text-sm">{t(`auto.discoveryreport.level_${l}`, l.charAt(0).toUpperCase() + l.slice(1))}</div></div>;
              })}</div>
              <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-4 border border-indigo-700/30 flex items-center justify-between">
                <div><p className="text-indigo-400 text-sm font-bold uppercase"><Trans i18nKey="auto.discoveryreport.wonder_score">Wonder Score</Trans></p><p className="text-white text-sm mt-1">{report.rabbitHoles} <Trans i18nKey="auto.discoveryreport.rabbit_holes">rabbit holes ·</Trans> {report.connectionsFound} <Trans i18nKey="auto.discoveryreport.connections">connections</Trans></p></div>
                <div className="text-4xl font-extrabold text-indigo-400">{report.wonderScore}</div>
              </div>
              <div className="grid grid-cols-4 gap-2">{DISCOVERY_MODULES.map(m => {
                const mastery = getMastery(m.id);
                return <div key={m.id} className="bg-slate-800 rounded-xl p-2 text-center"><div className="text-xl">{m.emoji}</div>{mastery && <div className="text-sm font-bold mt-1" style={{ color: MC[mastery] }}>{mastery === 'connect' ? '★' : mastery === 'apply' ? '●' : mastery === 'understand' ? '◐' : '○'}</div>}</div>;
              })}</div>
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50"><p className="text-slate-400 text-sm italic"><Trans i18nKey="auto.discoveryreport.the_measure_of_intelligence_is">"The measure of intelligence is the ability to change."</Trans></p><p className="text-slate-600 text-sm mt-2"><Trans i18nKey="auto.discoveryreport.lumo">— Lumo</Trans></p></div>
              <button onClick={onClose} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl min-h-[52px]"><Trans i18nKey="auto.discoveryreport.return_to_constellation">Return to Constellation</Trans></button>
            </div>
          )}
        </motion.div>
      </motion.div>
    )}</AnimatePresence>
  );
}
