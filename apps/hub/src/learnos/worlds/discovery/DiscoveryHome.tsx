// src/worlds/discovery/DiscoveryHome.tsx
import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ParentCorner } from '@/shared/layout';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import { useDiscoveryProgress } from './hooks/useDiscoveryProgress';
import { CONSTELLATION_NODES, DISCOVERY_MODULES } from './data/discoveryContent';
import DiscoveryReport from './DiscoveryReport';

export default function DiscoveryHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { progress, getMastery } = useDiscoveryProgress();
  const [hovered, setHovered] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = CanvasHelpers.setupHiDPI(canvas, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
    const w = canvas.getBoundingClientRect().width, h = canvas.getBoundingClientRect().height;
    let frame: number;
    const stars = Array.from({ length: 60 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5, tw: Math.random() * Math.PI * 2 }));
    const render = (t: number) => {
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#0F172A'; ctx.fillRect(0, 0, w, h);
      stars.forEach(s => { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(t/1000 + s.tw)*0.2})`; ctx.fill(); });
      CONSTELLATION_NODES.forEach(n => {
        const nx = n.x * w, ny = n.y * h;
        n.connections.forEach(cid => {
          const cn = CONSTELLATION_NODES.find(node => node.id === cid);
          if (cn) { ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(cn.x * w, cn.y * h); ctx.strokeStyle = 'rgba(99,102,241,0.15)'; ctx.lineWidth = 1; ctx.stroke(); }
        });
        const m = getMastery(n.id);
        ctx.beginPath(); ctx.arc(nx, ny, hovered === n.id ? 10 : 7, 0, Math.PI * 2);
        ctx.fillStyle = m ? '#6366F1' : '#1E293B'; ctx.fill();
        ctx.strokeStyle = '#6366F1'; ctx.lineWidth = 2; ctx.stroke();
      });
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [getMastery, hovered]);

  const hInfo = hovered ? DISCOVERY_MODULES.find(m => m.id === hovered) : null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="px-5 pt-6 pb-3 flex justify-between items-center text-white">
        <div><h1 className="text-xl font-extrabold">{t('discovery.title', 'Discovery Engine')}</h1></div>
        <div className="bg-slate-800 px-3 py-1.5 rounded-full text-indigo-400 text-sm font-bold">{Object.values(progress?.mastery || {}).filter(Boolean).length} / 14</div>
      </div>
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">{CONSTELLATION_NODES.map(n => (
          <button key={n.id} onClick={() => navigate(`/discovery/${n.id}`)} onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)} className="opacity-0" style={{ gridColumnStart: Math.floor(n.x*6)+1, gridRowStart: Math.floor(n.y*4)+1 }} />
        ))}</div>
        <AnimatePresence>{hInfo && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-4 left-4 right-4 bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="flex items-start gap-3"><span className="text-3xl">{hInfo.emoji}</span><div className="flex-1"><p className="font-bold text-white text-sm">{t(`discovery.modules.${hInfo.id}.title`, hInfo.title)}</p><p className="text-slate-400 text-sm mt-0.5">{t(`discovery.modules.${hInfo.id}.hook`, hInfo.hook)}</p></div><button onClick={() => navigate(`/discovery/${hInfo.path}`)} className="bg-indigo-600 text-white text-sm font-bold px-3 py-2 rounded-xl">{t('discovery.explore', 'Explore →')}</button></div>
          </motion.div>
        )}</AnimatePresence>
      </div>
      <ParentCorner onExit={() => navigate('/home')} />
      <button onClick={() => setShowReport(true)} className="fixed bottom-6 right-6 z-10 w-14 h-14 rounded-2xl bg-indigo-700 border border-indigo-500 shadow-xl flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform" aria-label="Discovery Report">
        <span className="text-lg">🌌</span><span className="text-sm text-white font-bold">{t('discovery.report', 'Report')}</span>
      </button>
      <DiscoveryReport visible={showReport} onClose={() => setShowReport(false)} />
    </div>
  );
}
