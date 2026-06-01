// src/worlds/tiny/modules/ColorMixer.tsx
// Module 2: Drag color circles to overlap and discover new colors.
// Zero text. Chameleon companion changes color with mixes.

import { useRef, useEffect } from 'react';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import TinyShell from '../TinyShell';
import { useCompanion } from '../hooks/useCompanion';
import { useTinyProgress } from '../hooks/useTinyProgress';
import { MIXER_COLORS, COLOR_MIXES } from '../data/tinyContent';
import type { ColorName } from '../types/tiny.types';

interface ColorCircle {
  id: 'red' | 'blue' | 'yellow';
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  radius: number;
  hex: string;
  isDragging: boolean;
}

interface MixResult {
  resultHex: string;
  x: number;
  y: number;
  scale: number;
  emoji: string;
  age: number;
}

export default function ColorMixer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const circlesRef = useRef<ColorCircle[]>([]);
  const draggingRef = useRef<string | null>(null);
  const mixResultRef = useRef<MixResult | null>(null);
  const returnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const { recordColorMix } = useTinyProgress();

  const companion = useCompanion({
    type: 'chameleon',
    x: 0.88,
    y: 0.12,
    size: 52,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const circleRadius = Math.min(w, h) * 0.13;

    circlesRef.current = [
      { id: 'red', x: w * 0.2, y: h * 0.55, homeX: w * 0.2, homeY: h * 0.55, radius: circleRadius, hex: MIXER_COLORS.red.hex, isDragging: false },
      { id: 'blue', x: w * 0.5, y: h * 0.55, homeX: w * 0.5, homeY: h * 0.55, radius: circleRadius, hex: MIXER_COLORS.blue.hex, isDragging: false },
      { id: 'yellow', x: w * 0.8, y: h * 0.55, homeX: w * 0.8, homeY: h * 0.55, radius: circleRadius, hex: MIXER_COLORS.yellow.hex, isDragging: false },
    ];

    const checkMix = () => {
      if (mixResultRef.current) return; // Already showing a result
      const circles = circlesRef.current;
      const overlapping: Set<string> = new Set();

      for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
          const dist = Math.sqrt((circles[i].x - circles[j].x) ** 2 + (circles[i].y - circles[j].y) ** 2);
          if (dist < circles[i].radius + circles[j].radius - 20) {
            overlapping.add(circles[i].id);
            overlapping.add(circles[j].id);
          }
        }
      }
      if (overlapping.size < 2) return;

      const allThree = overlapping.size === 3;
      let mixKey: string;
      if (allThree) {
        mixKey = 'red+blue+yellow';
      } else {
        const sorted = [...overlapping].sort();
        mixKey = sorted.join('+');
      }

      const mix = COLOR_MIXES[mixKey];
      if (!mix) return;

      const oc = circles.filter((c) => overlapping.has(c.id));
      const midX = oc.reduce((s, c) => s + c.x, 0) / oc.length;
      const midY = oc.reduce((s, c) => s + c.y, 0) / oc.length;

      mixResultRef.current = { resultHex: mix.resultHex, x: midX, y: midY, scale: 0, emoji: mix.emoji, age: 0 };

      if (soundEnabled) {
        try {
          AudioEngine.playChord(mix.sound.freqs, { type: mix.sound.type, duration: 0.8, volume: 0.25, attack: 0.05, decay: 0.2 });
        } catch (_) { /* silent */ }
      }

      recordColorMix(mix.result as ColorName);
      companion.setEmotion('excited', 2000);

      if (returnTimerRef.current) clearTimeout(returnTimerRef.current);
      returnTimerRef.current = setTimeout(() => {
        circlesRef.current.forEach((c) => { c.x = c.homeX; c.y = c.homeY; });
        mixResultRef.current = null;
      }, 2500);
    };

    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      const time = timestamp / 1000;

      ctx.clearRect(0, 0, w, h);

      // White background with dot grid
      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(0,0,0,0.04)';
      for (let gx = 0; gx < w; gx += 40) {
        for (let gy = 0; gy < h; gy += 40) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Circles
      circlesRef.current.forEach((circle) => {
        const pulse = Math.sin(time * 2 + circle.id.charCodeAt(0)) * 3;
        const r = circle.radius + (circle.isDragging ? 10 : pulse);

        // Glow
        const glow = ctx.createRadialGradient(circle.x, circle.y, 0, circle.x, circle.y, r * 1.4);
        glow.addColorStop(0, `${circle.hex}44`);
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, r * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Body
        const grad = ctx.createRadialGradient(circle.x - r * 0.25, circle.y - r * 0.25, 0, circle.x, circle.y, r);
        grad.addColorStop(0, '#ffffffaa');
        grad.addColorStop(0.4, circle.hex);
        grad.addColorStop(1, circle.hex);
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Eyes
        const eyeY = circle.y - r * 0.15;
        const esp = r * 0.3;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(circle.x - esp, eyeY, r * 0.12, 0, Math.PI * 2);
        ctx.arc(circle.x + esp, eyeY, r * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1F2937';
        ctx.beginPath();
        ctx.arc(circle.x - esp, eyeY, r * 0.06, 0, Math.PI * 2);
        ctx.arc(circle.x + esp, eyeY, r * 0.06, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.beginPath();
        ctx.arc(circle.x, circle.y + r * 0.1, r * 0.18, 0.1, Math.PI - 0.1);
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Mix result
      const mix = mixResultRef.current;
      if (mix) {
        mix.age += dt;
        mix.scale = Math.min(1.2, mix.scale + dt * 4);
        const mr = 60 * mix.scale;

        ctx.save();
        const mg = ctx.createRadialGradient(mix.x, mix.y, 0, mix.x, mix.y, mr);
        mg.addColorStop(0, mix.resultHex);
        mg.addColorStop(0.8, `${mix.resultHex}cc`);
        mg.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(mix.x, mix.y, mr, 0, Math.PI * 2);
        ctx.fillStyle = mg;
        ctx.fill();

        ctx.font = `${32 * mix.scale}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(mix.emoji, mix.x, mix.y);
        ctx.restore();
      }

      // If no dragging and circles idle, check mix on release
      if (!draggingRef.current) checkMix();

      // Companion
      companion.updateCompanion(dt, time);
      companion.drawCompanion(ctx, w, h, '🦎');

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
      const pos = getPos(e);
      for (const c of circlesRef.current) {
        const d = Math.sqrt((pos.x - c.x) ** 2 + (pos.y - c.y) ** 2);
        if (d < c.radius + 15) {
          draggingRef.current = c.id;
          c.isDragging = true;
          break;
        }
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      const pos = getPos(e);
      const c = circlesRef.current.find((cc) => cc.id === draggingRef.current);
      if (c) { c.x = pos.x; c.y = pos.y; }
    };

    const handleEnd = () => {
      if (!draggingRef.current) return;
      const c = circlesRef.current.find((cc) => cc.id === draggingRef.current);
      if (c) c.isDragging = false;
      draggingRef.current = null;
      checkMix();
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      cancelAnimationFrame(frameRef.current);
      if (returnTimerRef.current) clearTimeout(returnTimerRef.current);
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseleave', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [soundEnabled, recordColorMix, companion]);

  return (
    <TinyShell module="color-mixer">
      <canvas
        ref={canvasRef}
        className="w-full h-screen block"
        style={{ touchAction: 'none' }}
      />
    </TinyShell>
  );
}
