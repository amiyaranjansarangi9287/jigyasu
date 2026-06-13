// src/worlds/tiny/modules/FarmFriends.tsx
// Module 7: Tap hidden animal zones to discover all 13 farm animals.
// Progress dots at top, parade when complete. Chick companion.

import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import TinyShell from '../TinyShell';
import { useCompanion } from '../hooks/useCompanion';
import { useTinyProgress } from '../hooks/useTinyProgress';
import { FARM_ANIMALS } from '../data/tinyContent';

interface FoundAnimal {
  label: string; emoji: string;
  x: number; y: number;
  revealAge: number; animOffset: number;
}

export default function FarmFriends() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const foundRef = useRef<FoundAnimal[]>([]);
  const [showParade, setShowParade] = useState(false);
  const [foundCount, setFoundCount] = useState(0);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const { recordFarmAnimal, progress } = useTinyProgress();

  const companion = useCompanion({ type: 'chick', x: 0.5, y: 0.92, size: 44 });

  // Restore from progress
  useEffect(() => {
    if (!progress) return;
    
    // Only update if there's a mismatch (e.g. initial load)
    if (foundRef.current.length !== progress.farmAnimalsFound.length) {
      foundRef.current = progress.farmAnimalsFound.map((label) => {
        const a = FARM_ANIMALS.find((f) => f.label === label);
        if (!a) return null;
        return { label: a.label, emoji: a.emoji, x: a.positionHint.x, y: a.positionHint.y, revealAge: 999, animOffset: Math.random() * Math.PI * 2 };
      }).filter(Boolean) as FoundAnimal[];
      
      setFoundCount(progress.farmAnimalsFound.length);
      if (progress.farmCompleted) setShowParade(true);
    }
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width; const h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const groundY = h * 0.70;
    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      const time = timestamp / 1000;
      ctx.clearRect(0, 0, w, h);

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, groundY);
      sky.addColorStop(0, '#7DD3FC'); sky.addColorStop(1, '#BAE6FD');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, groundY);

      // Sun
      ctx.beginPath(); ctx.arc(w * 0.88, h * 0.12, 28, 0, Math.PI * 2);
      ctx.fillStyle = '#FDE047'; ctx.fill();

      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      [[w * 0.25, h * 0.12, 28], [w * 0.5, h * 0.08, 22]].forEach(([cx, cy, r]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.7, cy - r * 0.3, r * 0.8, 0, Math.PI * 2);
        ctx.arc(cx + r * 1.4, cy, r * 0.9, 0, Math.PI * 2);
        ctx.fill();
      });

      // Ground
      ctx.fillStyle = '#65A30D'; ctx.fillRect(0, groundY, w, h - groundY);

      // Path
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h); ctx.lineTo(w * 0.46, groundY);
      ctx.lineTo(w * 0.54, groundY); ctx.lineTo(w * 0.58, h); ctx.fill();

      // Hut
      const bX = w * 0.22;
      ctx.fillStyle = '#DC2626'; ctx.fillRect(bX - 50, groundY - 100, 100, 100);
      ctx.fillStyle = '#B91C1C';
      ctx.beginPath(); ctx.moveTo(bX - 60, groundY - 100); ctx.lineTo(bX, groundY - 145); ctx.lineTo(bX + 60, groundY - 100); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#78350F'; ctx.fillRect(bX - 18, groundY - 50, 16, 50); ctx.fillRect(bX + 2, groundY - 50, 16, 50);
      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath(); ctx.arc(bX - 30, groundY - 75, 8, 0, Math.PI * 2); ctx.arc(bX + 30, groundY - 75, 8, 0, Math.PI * 2); ctx.fill();

      // Pond
      const pX = w * 0.68;
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath(); ctx.ellipse(pX, groundY + 15, 55, 22, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(pX - 25, groundY + 10); ctx.lineTo(pX + 10, groundY + 10); ctx.stroke();

      // Fence
      ctx.strokeStyle = '#D97706'; ctx.lineWidth = 3;
      for (let fx = w * 0.4; fx < w; fx += 25) {
        ctx.beginPath(); ctx.moveTo(fx, groundY + 5); ctx.lineTo(fx, groundY + 25); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(w * 0.4, groundY + 10); ctx.lineTo(w, groundY + 10);
      ctx.moveTo(w * 0.4, groundY + 20); ctx.lineTo(w, groundY + 20); ctx.stroke();

      // Undiscovered glow hints
      FARM_ANIMALS.forEach((a) => {
        if (foundRef.current.some(f => f.label === a.label)) return;
        const ax = a.positionHint.x * w; const ay = a.positionHint.y * h;
        const pulse = 0.12 + Math.sin(time * 2 + a.positionHint.x * 10) * 0.08;
        ctx.beginPath(); ctx.arc(ax, ay, 28, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,200,${pulse})`; ctx.fill();
      });

      // Found animals
      foundRef.current.forEach((f) => {
        f.revealAge += dt;
        const ax = f.x * w; const ay = f.y * h;
        const scale = f.revealAge < 0.5 ? Math.min(1.2, f.revealAge * 4) : 1.0 + Math.sin(f.revealAge * 3 + f.animOffset) * 0.03;
        ctx.font = `${36 * scale}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(f.emoji, ax, ay);
        if (f.revealAge < 1.5) {
          for (let s = 0; s < 3; s++) {
            const sa = (s / 3) * Math.PI * 2 + f.revealAge * 3;
            ctx.font = '12px sans-serif';
            ctx.fillText('✨', ax + Math.cos(sa) * (25 + f.revealAge * 20), ay + Math.sin(sa) * (25 + f.revealAge * 20));
          }
        }
      });

      companion.updateCompanion(dt, time);
      companion.drawCompanion(ctx, w, h, '🐣');
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    const handleTap = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      let tx: number, ty: number;
      if ('touches' in e && e.touches.length > 0) { tx = e.touches[0].clientX - r.left; ty = e.touches[0].clientY - r.top; }
      else { tx = (e as MouseEvent).clientX - r.left; ty = (e as MouseEvent).clientY - r.top; }

      for (const animal of FARM_ANIMALS) {
        if (foundRef.current.some(f => f.label === animal.label)) continue;
        const ax = animal.positionHint.x * w; const ay = animal.positionHint.y * h;
        if (Math.sqrt((tx - ax) ** 2 + (ty - ay) ** 2) < 50) {
          foundRef.current.push({ label: animal.label, emoji: animal.emoji, x: animal.positionHint.x, y: animal.positionHint.y, revealAge: 0, animOffset: Math.random() * Math.PI * 2 });
          if (soundEnabled) { try { AudioEngine.playTone({ frequency: animal.soundFreq, type: animal.soundType, duration: 0.5, volume: 0.3, attack: 0.05, decay: 0.15 }); } catch (_) {} }
          companion.setEmotion('excited', 1500);
          const allFound = recordFarmAnimal(animal.label);
          setFoundCount(prev => prev + 1);
          if (allFound) {
            companion.setEmotion('celebrating', 5000);
            if (soundEnabled) { try { AudioEngine.playCelebration(); } catch (_) {} }
            setShowParade(true);
          }
          return;
        }
      }
      companion.setEmotion('curious', 800);
    };

    canvas.addEventListener('click', handleTap);
    canvas.addEventListener('touchstart', handleTap, { passive: false });
    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener('click', handleTap);
      canvas.removeEventListener('touchstart', handleTap);
    };
  }, [soundEnabled, recordFarmAnimal, companion, progress]);

  return (
    <TinyShell module="farm-friends">
      <div className="relative w-full h-screen">
        <canvas ref={canvasRef} className="w-full h-full block" style={{ touchAction: 'none' }} />
        {/* Progress dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {FARM_ANIMALS.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i < foundCount ? 'bg-yellow-400 scale-125' : 'bg-white/30'}`} />
          ))}
        </div>
        {/* Parade overlay */}
        <AnimatePresence>
          {showParade && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-gradient-to-b from-yellow-100/90 to-green-100/90 flex flex-col items-center justify-center"
              onClick={() => setShowParade(false)}>
              <div className="text-6xl mb-6 animate-bounce">🎉</div>
              <div className="flex flex-wrap gap-3 justify-center text-4xl mb-4 px-4">
                {FARM_ANIMALS.map((a, i) => (
                  <motion.span key={a.label} animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.08 }}>
                    {a.emoji}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TinyShell>
  );
}
