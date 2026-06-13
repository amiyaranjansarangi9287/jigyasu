// src/worlds/early/PipAdventureMap.tsx

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdventureMap, EARLY_ACHIEVEMENTS } from './hooks/useAdventureMap';
import { useEarlyProgress } from './hooks/useEarlyProgress';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

interface PipAdventureMapProps {
  visible: boolean;
  onClose: () => void;
}

export default function PipAdventureMap({ visible, onClose }: PipAdventureMapProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const { progress } = useEarlyProgress();
  const { isUnlocked, getUnlockedCount, getTotalCount, newlyUnlocked } = useAdventureMap(progress);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width; const h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const animate = (timestamp: number) => {
      const time = timestamp / 1000;
      ctx.clearRect(0, 0, w, h);

      // Parchment background
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#FEF3C7'); bg.addColorStop(0.5, '#FDE68A'); bg.addColorStop(1, '#FCD34D');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

      // Border
      ctx.strokeStyle = '#92400E'; ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, w - 16, h - 16);

      // Path
      ctx.strokeStyle = 'rgba(146,64,14,0.3)'; ctx.lineWidth = 3; ctx.setLineDash([8, 5]);
      ctx.beginPath();
      EARLY_ACHIEVEMENTS.forEach((a, i) => {
        const x = a.locationOnMap.x * w; const y = a.locationOnMap.y * h;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke(); ctx.setLineDash([]);

      // Achievement locations
      EARLY_ACHIEVEMENTS.forEach(a => {
        const x = a.locationOnMap.x * w; const y = a.locationOnMap.y * h;
        const unlck = isUnlocked(a.id);
        const pulse = Math.sin(time * 3 + a.locationOnMap.x * 10) * 3;

        if (unlck) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 25);
          glow.addColorStop(0, 'rgba(251,191,36,0.5)'); glow.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.arc(x, y + pulse, 25, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
          ctx.font = '24px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(a.mapEmoji, x, y + pulse);
          ctx.fillStyle = '#78350F'; ctx.font = 'bold 8px sans-serif';
          ctx.fillText(a.name, x, y + 20 + pulse);
        } else {
          ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(180,160,120,0.4)'; ctx.fill();
          ctx.strokeStyle = 'rgba(146,64,14,0.3)'; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = 'rgba(146,64,14,0.4)'; ctx.font = '14px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', x, y);
        }
      });

      // Pip
      ctx.font = '28px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🐤', w * 0.5, h * 0.5 + Math.sin(time * 1.5) * 5);

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [visible, isUnlocked]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-amber-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="text-2xl">🗺️</span><span className="font-extrabold text-white text-base"><Trans i18nKey="auto.pipadventuremap.pip_s_adventure_map">Pip's Adventure Map</Trans></span></div>
              <div className="bg-white/20 px-3 py-1 rounded-full"><span className="text-white text-sm font-bold">{getUnlockedCount()}/{getTotalCount()} ⭐</span></div>
            </div>
            <canvas ref={canvasRef} className="w-full" style={{ height: '300px' }} />
            <button onClick={onClose} className="absolute top-12 right-3 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-xl shadow">✕</button>
            <AnimatePresence>{newlyUnlocked && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 bg-amber-500 rounded-2xl p-3 text-white flex items-center gap-2 shadow-lg">
                <span className="text-3xl">{EARLY_ACHIEVEMENTS.find(a => a.id === newlyUnlocked)?.emoji}</span>
                <div><p className="font-bold text-base">{EARLY_ACHIEVEMENTS.find(a => a.id === newlyUnlocked)?.name}!</p>
                  <p className="text-sm text-amber-100">{EARLY_ACHIEVEMENTS.find(a => a.id === newlyUnlocked)?.description}</p></div>
              </motion.div>
            )}</AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
