// src/worlds/tiny/modules/DayAndNight.tsx
// Module 8: Drag a handle to move the sun across the sky.
// Sky, stars, moon, house windows change. Firefly companion glows at night.

import { useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import TinyShell from '../TinyShell';
import { useCompanion } from '../hooks/useCompanion';
import { useTinyProgress } from '../hooks/useTinyProgress';

export default function DayAndNight() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const sunPosRef = useRef(0.25);
  const isDraggingRef = useRef(false);
  const nightFoundRef = useRef(false);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const { recordNightDiscovery, recordFullCycle, progress } = useTinyProgress();

  const companion = useCompanion({ type: 'firefly', x: 0.85, y: 0.55, size: 44 });

  useEffect(() => {
    if (progress?.nightDiscovered) nightFoundRef.current = true;
  }, [progress]);

  const playAmbient = useCallback((pos: number) => {
    if (!soundEnabled) return;
    try {
      if (pos > 0.75) AudioEngine.playTone({ frequency: 4000, type: 'sine', duration: 0.15, volume: 0.06, attack: 0.01, decay: 0.05 });
      else if (pos < 0.15) {
        AudioEngine.playTone({ frequency: 800, type: 'sawtooth', duration: 0.25, volume: 0.12, attack: 0.05, decay: 0.1 });
        setTimeout(() => AudioEngine.playTone({ frequency: 1200, type: 'sawtooth', duration: 0.2, volume: 0.08, attack: 0.02, decay: 0.08 }), 200);
      } else if (pos > 0.3 && pos < 0.7) AudioEngine.playTone({ frequency: 1400, type: 'triangle', duration: 0.12, volume: 0.06, attack: 0.01, decay: 0.05 });
    } catch (_) { /* silent */ }
  }, [soundEnabled]);

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
    let lastAmbient = 0;
    let lastPos = sunPosRef.current;

    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * w, y: Math.random() * groundY * 0.8,
      r: Math.random() * 1.5 + 0.5, tw: Math.random() * Math.PI * 2,
    }));

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      const time = timestamp / 1000;
      const pos = sunPosRef.current;
      const isNight = pos > 0.75;
      ctx.clearRect(0, 0, w, h);

      // Sky color
      let skyTop: string, skyBot: string;
      if (pos < 0.1) { skyTop = '#0f172a'; skyBot = '#1e1b4b'; }
      else if (pos < 0.2) { skyTop = '#7c2d12'; skyBot = '#ea580c'; }
      else if (pos < 0.65) { skyTop = '#0ea5e9'; skyBot = '#bae6fd'; }
      else if (pos < 0.75) { skyTop = '#c2410c'; skyBot = '#fb923c'; }
      else { skyTop = '#0f172a'; skyBot = '#1e1b4b'; }

      const skyG = ctx.createLinearGradient(0, 0, 0, groundY);
      skyG.addColorStop(0, skyTop); skyG.addColorStop(1, skyBot);
      ctx.fillStyle = skyG; ctx.fillRect(0, 0, w, groundY);

      // Stars
      const starAlpha = pos > 0.7 ? Math.min(1, (pos - 0.7) / 0.1) : pos < 0.15 ? Math.min(1, (0.15 - pos) / 0.05) : 0;
      if (starAlpha > 0) stars.forEach(s => {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${starAlpha * (0.5 + Math.sin(time * 2 + s.tw) * 0.3)})`;
        ctx.fill();
      });

      // Sun arc
      const arcAngle = pos * Math.PI;
      const arcR = Math.min(w, h) * 0.42;
      const cx = w / 2; const cy = groundY + 20;
      const sunX = cx - Math.cos(arcAngle) * arcR;
      const sunY = cy - Math.sin(arcAngle) * arcR;

      if (sunY < groundY) {
        const sz = 28 + (1 - Math.abs(pos - 0.5) * 2) * 10;
        ctx.save();
        ctx.globalAlpha = pos < 0.05 || pos > 0.95 ? 0.3 : 1;
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sz * 2.5);
        sunGlow.addColorStop(0, 'rgba(253,224,71,0.4)'); sunGlow.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(sunX, sunY, sz * 2.5, 0, Math.PI * 2); ctx.fillStyle = sunGlow; ctx.fill();
        ctx.beginPath(); ctx.arc(sunX, sunY, sz, 0, Math.PI * 2);
        ctx.fillStyle = pos > 0.65 || pos < 0.2 ? '#F97316' : '#FDE047'; ctx.fill();
        ctx.restore();
      }

      // Moon
      if (isNight || pos < 0.15) {
        const mPos = (pos + 0.5) % 1;
        const mAngle = mPos * Math.PI;
        const mX = cx - Math.cos(mAngle) * arcR;
        const mY = cy - Math.sin(mAngle) * arcR;
        if (mY < groundY) {
          const mAlpha = isNight ? Math.min(1, (pos - 0.75) / 0.1) : Math.min(0.8, (0.15 - pos) / 0.05);
          ctx.save(); ctx.globalAlpha = Math.max(0, mAlpha);
          ctx.beginPath(); ctx.arc(mX, mY, 22, 0, Math.PI * 2); ctx.fillStyle = '#F1F5F9'; ctx.fill();
          ctx.beginPath(); ctx.arc(mX + 8, mY - 5, 18, 0, Math.PI * 2); ctx.fillStyle = skyTop; ctx.fill();
          ctx.restore();
        }
      }

      // Horizon glow
      if ((pos > 0.08 && pos < 0.25) || (pos > 0.65 && pos < 0.85)) {
        const hG = ctx.createLinearGradient(0, groundY - 60, 0, groundY);
        hG.addColorStop(0, 'transparent');
        hG.addColorStop(1, pos < 0.25 ? 'rgba(251,113,133,0.3)' : 'rgba(251,146,60,0.3)');
        ctx.fillStyle = hG; ctx.fillRect(0, groundY - 60, w, 60);
      }

      // Ground
      ctx.fillStyle = isNight ? '#1A3A1A' : '#4ADE80';
      ctx.fillRect(0, groundY, w, h - groundY);

      // Tree
      const treeX = w * 0.2;
      ctx.fillStyle = isNight ? '#1C1917' : '#78350F';
      ctx.fillRect(treeX - 6, groundY - 100, 12, 100);
      ctx.fillStyle = isNight ? '#14532d' : '#15803D';
      [[0, -100, 32], [-18, -80, 22], [18, -80, 22]].forEach(([dx, dy, r]) => {
        ctx.beginPath(); ctx.arc(treeX + dx, groundY + dy, r, 0, Math.PI * 2); ctx.fill();
      });

      // House
      const hX = w * 0.65;
      ctx.fillStyle = isNight ? '#292524' : '#FEF3C7';
      ctx.fillRect(hX - 35, groundY - 70, 70, 70);
      ctx.fillStyle = '#B91C1C';
      ctx.beginPath(); ctx.moveTo(hX - 45, groundY - 70); ctx.lineTo(hX, groundY - 118); ctx.lineTo(hX + 45, groundY - 70); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#78350F'; ctx.fillRect(hX - 10, groundY - 38, 20, 38);

      // Window glow
      const wGlow = isNight || pos < 0.2 || pos > 0.65;
      if (wGlow) {
        const wg = ctx.createRadialGradient(hX + 20, groundY - 52, 0, hX + 20, groundY - 52, 25);
        wg.addColorStop(0, 'rgba(254,243,199,0.4)'); wg.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(hX + 20, groundY - 52, 25, 0, Math.PI * 2); ctx.fillStyle = wg; ctx.fill();
      }
      ctx.fillStyle = wGlow ? 'rgba(254,243,199,0.9)' : 'rgba(147,197,253,0.6)';
      ctx.fillRect(hX + 12, groundY - 58, 16, 14); ctx.fillRect(hX - 28, groundY - 58, 16, 14);

      // Scene elements
      if (pos < 0.3) { ctx.font = '24px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🐓', w * 0.4, groundY - 15); }
      if (isNight) {
        ctx.font = '24px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🦉', treeX, groundY - 110);
        for (let i = 0; i < 4; i++) {
          const ffX = w * 0.8 + Math.sin(time * 2 + i * 1.5) * 30;
          const ffY = h * 0.6 + Math.cos(time * 1.8 + i) * 25;
          ctx.beginPath(); ctx.arc(ffX, ffY, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(250,204,21,${0.4 + Math.sin(time * 3 + i) * 0.4})`; ctx.fill();
        }
      }

      // Drag handle at bottom
      const grabX = 60 + pos * (w - 120);
      const grabY = h - 50;
      ctx.beginPath(); ctx.moveTo(60, grabY); ctx.lineTo(w - 60, grabY);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(grabX, grabY, 22, 0, Math.PI * 2);
      ctx.fillStyle = isNight ? '#1E40AF' : '#FDE047'; ctx.fill();
      ctx.font = '22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(isNight ? '🌙' : '☀️', grabX, grabY);

      // Firefly companion glow
      if (isNight) {
        const cfX = 0.85 * w; const cfY = 0.55 * h;
        const glow = ctx.createRadialGradient(cfX, cfY, 0, cfX, cfY, 30);
        glow.addColorStop(0, 'rgba(250,204,21,0.5)'); glow.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(cfX, cfY, 30, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
      }
      companion.updateCompanion(dt, time);
      companion.drawCompanion(ctx, w, h, isNight ? '✨' : '🪲');

      // Ambient sound
      if (timestamp - lastAmbient > 3000) { playAmbient(pos); lastAmbient = timestamp; }

      // Night discovery
      if (pos > 0.8 && !nightFoundRef.current) {
        nightFoundRef.current = true;
        recordNightDiscovery();
        companion.setEmotion('surprised', 2000);
      }

      // Full cycle detection
      if (pos > 0.95 && lastPos < 0.05) recordFullCycle();
      if (pos < 0.05 && lastPos > 0.95) recordFullCycle();
      lastPos = pos;

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    // Drag handlers
    const getPos = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      if ('touches' in e && e.touches.length > 0) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
      return { x: (e as MouseEvent).clientX - r.left, y: (e as MouseEvent).clientY - r.top };
    };
    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const p = getPos(e);
      const grabX = 60 + sunPosRef.current * (w - 120);
      if (Math.sqrt((p.x - grabX) ** 2 + (p.y - (h - 50)) ** 2) < 40) isDraggingRef.current = true;
    };
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const p = getPos(e);
      sunPosRef.current = Math.max(0, Math.min(1, (p.x - 60) / (w - 120)));
    };
    const handleEnd = () => { isDraggingRef.current = false; };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);
    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [companion, playAmbient, recordNightDiscovery, recordFullCycle, progress]);

  return (
    <TinyShell module="day-and-night">
      <canvas ref={canvasRef} className="w-full h-screen block" style={{ touchAction: 'none' }} />
    </TinyShell>
  );
}
