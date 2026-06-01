// src/worlds/discovery/components/GoDeeper.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import type { GoDeeper as GoDeeperType } from '../data/discoveryContent';
import type { DiscoveryModule } from '../types/discovery.types';

interface GoDeeperProps { content: GoDeeperType; module: DiscoveryModule; }
export function GoDeeper({ content, module }: GoDeeperProps) {
  const [open, setOpen] = useState(false);
  const { recordRabbitHole } = useDiscoveryProgress();
  return (
    <>
      <div className="px-5 pb-4"><button onClick={async () => { setOpen(true); await recordRabbitHole(module); }} className="w-full flex items-center justify-between bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700 hover:border-indigo-500 transition-all min-h-[52px]"><div className="flex items-center gap-2"><span>🕳️</span><span className="text-slate-300 text-sm font-bold">Go Deeper</span></div><span className="text-slate-500 text-sm">{content.connections.length} rabbit holes →</span></button></div>
      <AnimatePresence>{open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-900/90 flex items-end justify-center" onClick={() => setOpen(false)}>
          <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} className="bg-slate-900 rounded-t-3xl w-full max-w-md border-t border-slate-700 p-5 pb-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><div><h3 className="text-white font-bold">Go Deeper</h3><p className="text-slate-500 text-sm">Rabbit holes worth exploring</p></div><button onClick={() => setOpen(false)} className="text-slate-500 text-xl">✕</button></div>
            <div className="space-y-3">{content.connections.map((conn, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-4 border border-slate-700"><p className="text-white text-sm font-bold">{conn.title}</p><p className="text-slate-400 text-sm mt-1">{conn.description}</p></div>
            ))}</div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </>
  );
}
