// src/worlds/tiny/WonderGarden.tsx
// Visual garden — grows with each module explored. No text for child.

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTinyProgress } from './hooks/useTinyProgress';
import { TINY_MODULES } from './data/tinyContent';

interface WonderGardenProps {
  visible: boolean;
  onClose: () => void;
}

export default function WonderGarden({ visible, onClose }: WonderGardenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const { progress } = useTinyProgress();

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

    const positions = [
      { x: 0.15, y: 0.55 }, { x: 0.32, y: 0.48 },
      { x: 0.50, y: 0.52 }, { x: 0.68, y: 0.46 },
      { x: 0.85, y: 0.54 }, { x: 0.22, y: 0.68 },
      { x: 0.50, y: 0.65 }, { x: 0.78, y: 0.66 },
    ];

    const explored = [
      (progress?.totalTaps ?? 0) > 0,
      (progress?.colorsMixed.length ?? 0) > 0,
      (progress?.shapesMatched.length ?? 0) > 0,
      (progress?.animalsPlayed.length ?? 0) > 0,
      (progress?.bubblesPopped ?? 0) > 0,
      (progress?.weathersDiscovered.length ?? 0) > 0,
      (progress?.farmAnimalsFound.length ?? 0) > 0,
      progress?.nightDiscovered ?? false,
    ];

    const lastTime = performance.now();

    const animate = (timestamp: number) => {
      const time = (timestamp - lastTime) / 1000 + performance.now() / 1000;
      ctx.clearRect(0, 0, w, h);

      // Garden background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#E0F2FE'); bg.addColorStop(0.5, '#BBF7D0'); bg.addColorStop(1, '#4ADE80');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

      // Ground
      ctx.fillStyle = '#86EFAC'; ctx.fillRect(0, h * 0.60, w, h * 0.40);

      // Sun
      ctx.beginPath(); ctx.arc(w * 0.1, h * 0.1, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#FDE047'; ctx.fill();

      // Path
      ctx.fillStyle = '#D97706';
      ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.78, w * 0.14, h * 0.06, 0, 0, Math.PI * 2); ctx.fill();

      // Plants for each module
      TINY_MODULES.forEach((m, i) => {
        const p = positions[i] || { x: 0.5, y: 0.6 };
        const x = p.x * w; const y = p.y * h;
        const done = explored[i];
        const sway = Math.sin(time * 2 + i * 1.3) * 3;

        if (done) {
          // Stem
          ctx.fillStyle = '#15803D'; ctx.fillRect(x - 2.5, y, 5, 28);
          // Leaf
          ctx.beginPath(); ctx.ellipse(x + 8, y + 15, 6, 3, 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#22C55E'; ctx.fill();
          // Flower/emoji
          const sz = 26 + Math.sin(time * 1.5 + i) * 2;
          ctx.font = `${sz}px sans-serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(m.gardenEmoji, x + sway, y - 10);
        } else {
          // Seed mound
          ctx.fillStyle = '#92400E';
          ctx.beginPath(); ctx.ellipse(x, y + 8, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
          // Tiny sprout
          ctx.fillStyle = '#86EFAC';
          ctx.fillRect(x - 1, y + 2, 2, 6);
        }
      });

      // Progress dots
      const totalModules = TINY_MODULES.length;
      const dotSpacing = Math.min(28, w / (totalModules + 2));
      const startX = w / 2 - (totalModules - 1) * dotSpacing / 2;
      for (let i = 0; i < totalModules; i++) {
        ctx.beginPath(); ctx.arc(startX + i * dotSpacing, h * 0.92, 5, 0, Math.PI * 2);
        ctx.fillStyle = explored[i] ? '#F59E0B' : 'rgba(255,255,255,0.4)'; ctx.fill();
      }

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [visible, progress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <canvas ref={canvasRef} className="w-full aspect-[4/3] block" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80
                         flex items-center justify-center text-2xl shadow"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
