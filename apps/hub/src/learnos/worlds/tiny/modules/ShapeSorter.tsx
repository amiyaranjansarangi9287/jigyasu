// src/worlds/tiny/modules/ShapeSorter.tsx
// Module 3: Drag shapes to matching holes. Shapes have faces and personality.
// Zero text. Elephant companion stomps happily on matches.

import { useRef, useEffect, useCallback } from 'react';
import { useSettingsStore } from '@/store';
import { ParticleEngine } from '@/shared/canvas/engines/ParticleEngine';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import TinyShell from '../TinyShell';
import { useCompanion } from '../hooks/useCompanion';
import { useTinyProgress } from '../hooks/useTinyProgress';
import { SHAPES } from '../data/tinyContent';
import type { ShapeType } from '../types/tiny.types';

interface DraggableShape {
  id: ShapeType;
  x: number; y: number;
  homeX: number; homeY: number;
  size: number;
  color: string;
  isDragging: boolean;
  isMatched: boolean;
  soundFreq: number;
  idleAnim: number;
}

interface ShapeHole {
  id: ShapeType;
  x: number; y: number;
  size: number;
  color: string;
  glowIntensity: number;
  matched: boolean;
}

function drawShapePath(
  ctx: CanvasRenderingContext2D,
  shapeId: ShapeType,
  x: number, y: number, size: number
) {
  ctx.beginPath();
  switch (shapeId) {
    case 'circle':
      ctx.arc(x, y, size, 0, Math.PI * 2);
      break;
    case 'square':
      ctx.rect(x - size, y - size, size * 2, size * 2);
      break;
    case 'triangle':
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x - size, y + size);
      ctx.closePath();
      break;
    case 'star': {
      for (let i = 0; i < 5; i++) {
        const outerA = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const innerA = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
        if (i === 0) ctx.moveTo(x + size * Math.cos(outerA), y + size * Math.sin(outerA));
        else ctx.lineTo(x + size * Math.cos(outerA), y + size * Math.sin(outerA));
        ctx.lineTo(x + size * 0.4 * Math.cos(innerA), y + size * 0.4 * Math.sin(innerA));
      }
      ctx.closePath();
      break;
    }
  }
}

export default function ShapeSorter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const shapesRef = useRef<DraggableShape[]>([]);
  const holesRef = useRef<ShapeHole[]>([]);
  const draggingRef = useRef<ShapeType | null>(null);
  const particlesRef = useRef(new ParticleEngine());
  const allMatchedTimerRef = useRef(0);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const { recordShapeMatch } = useTinyProgress();

  const companion = useCompanion({
    type: 'elephant',
    x: 0.88,
    y: 0.88,
    size: 52,
  });

  const initRound = useCallback((w: number, h: number) => {
    const shapePos = [
      { x: w * 0.15, y: h * 0.30 },
      { x: w * 0.15, y: h * 0.50 },
      { x: w * 0.15, y: h * 0.70 },
      { x: w * 0.30, y: h * 0.45 },
    ];
    const holePos = [
      { x: w * 0.72, y: h * 0.30 },
      { x: w * 0.72, y: h * 0.50 },
      { x: w * 0.72, y: h * 0.70 },
      { x: w * 0.85, y: h * 0.45 },
    ];
    const size = Math.min(w, h) * 0.085;

    // Shuffle hole positions for variety
    const shuffledHolePos = [...holePos].sort(() => Math.random() - 0.5);

    shapesRef.current = SHAPES.map((s, i) => ({
      id: s.id,
      x: shapePos[i].x, y: shapePos[i].y,
      homeX: shapePos[i].x, homeY: shapePos[i].y,
      size, color: s.color,
      isDragging: false, isMatched: false,
      soundFreq: s.soundFreq,
      idleAnim: Math.random() * Math.PI * 2,
    }));

    holesRef.current = SHAPES.map((s, i) => ({
      id: s.id,
      x: shuffledHolePos[i].x, y: shuffledHolePos[i].y,
      size: size * 1.2, color: s.color,
      glowIntensity: 0.3, matched: false,
    }));
  }, []);

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

    initRound(w, h);

    let lastTime = performance.now();

    const checkMatch = (shape: DraggableShape): boolean => {
      const hole = holesRef.current.find((ho) => ho.id === shape.id && !ho.matched);
      if (!hole) return false;
      const dist = Math.sqrt((shape.x - hole.x) ** 2 + (shape.y - hole.y) ** 2);
      if (dist > 50) return false;

      shape.x = hole.x; shape.y = hole.y;
      shape.isMatched = true;
      hole.matched = true;

      if (soundEnabled) {
        try { AudioEngine.playTone({ frequency: shape.soundFreq, type: 'sine', duration: 0.6, volume: 0.35, attack: 0.05, decay: 0.15 }); } catch (_) {}
      }

      particlesRef.current.emit({
        count: 20, originX: hole.x, originY: hole.y,
        color: [shape.color, '#ffffff', '#ffd700'],
        speed: 200, spread: 360, size: 8, sizeVariance: 4, maxLife: 0.8, gravity: 150, fadeOut: true,
      });

      recordShapeMatch(shape.id);
      companion.setEmotion('happy', 1500);

      if (shapesRef.current.every((s) => s.isMatched)) {
        companion.setEmotion('celebrating', 3000);
        if (soundEnabled) { try { AudioEngine.playCelebration(); } catch (_) {} }
        allMatchedTimerRef.current = 3;
      }
      return true;
    };

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      const time = timestamp / 1000;

      ctx.clearRect(0, 0, w, h);

      // Light background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#F0F9FF');
      bg.addColorStop(1, '#E0F2FE');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Reset timer
      if (allMatchedTimerRef.current > 0) {
        allMatchedTimerRef.current -= dt;
        if (allMatchedTimerRef.current <= 0) {
          initRound(w, h);
        }
      }

      // Divider arrow hint
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('→', w * 0.48, h * 0.5);
      ctx.restore();

      // Holes
      const dragging = shapesRef.current.find((s) => s.isDragging);
      holesRef.current.forEach((hole) => {
        if (hole.matched) return;

        if (dragging && dragging.id === hole.id) {
          const dist = Math.sqrt((dragging.x - hole.x) ** 2 + (dragging.y - hole.y) ** 2);
          hole.glowIntensity = Math.max(0.2, 1 - dist / 150);
        } else {
          hole.glowIntensity = 0.3 + Math.sin(time * 2) * 0.1;
        }

        // Glow ring
        const glow = ctx.createRadialGradient(hole.x, hole.y, 0, hole.x, hole.y, hole.size * 1.5);
        glow.addColorStop(0, `${hole.color}${Math.round(hole.glowIntensity * 60).toString(16).padStart(2, '0')}`);
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, hole.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Dashed outline
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = hole.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.4 + hole.glowIntensity * 0.5;
        drawShapePath(ctx, hole.id, hole.x, hole.y, hole.size * 0.8);
        ctx.stroke();
        ctx.restore();
      });

      // Shapes
      shapesRef.current.forEach((shape) => {
        const bob = shape.isDragging || shape.isMatched ? 0 : Math.sin(time * 2 + shape.idleAnim) * 4;
        const sx = shape.x;
        const sy = shape.y + bob;

        ctx.save();
        ctx.fillStyle = shape.color;
        drawShapePath(ctx, shape.id, sx, sy, shape.size);
        ctx.fill();

        // Eyes
        const eyeSize = shape.size * 0.09;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(sx - shape.size * 0.2, sy - shape.size * 0.1, eyeSize, 0, Math.PI * 2);
        ctx.arc(sx + shape.size * 0.2, sy - shape.size * 0.1, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(sx - shape.size * 0.2, sy - shape.size * 0.1, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.arc(sx + shape.size * 0.2, sy - shape.size * 0.1, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();

        if (shape.isMatched) {
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('✅', sx, sy - shape.size - 10);
        }
        ctx.restore();
      });

      // Particles
      particlesRef.current.update(dt, 200);
      particlesRef.current.draw(ctx);

      // Companion
      companion.updateCompanion(dt, time);
      companion.drawCompanion(ctx, w, h, '🐘');

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
      for (const s of shapesRef.current) {
        if (s.isMatched) continue;
        const d = Math.sqrt((pos.x - s.x) ** 2 + (pos.y - s.y) ** 2);
        if (d < s.size + 25) {
          draggingRef.current = s.id;
          s.isDragging = true;
          break;
        }
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      const pos = getPos(e);
      const s = shapesRef.current.find((sh) => sh.id === draggingRef.current);
      if (s) { s.x = pos.x; s.y = pos.y; }
    };

    const handleEnd = () => {
      if (!draggingRef.current) return;
      const s = shapesRef.current.find((sh) => sh.id === draggingRef.current);
      if (s) {
        s.isDragging = false;
        if (!checkMatch(s)) {
          s.x = s.homeX;
          s.y = s.homeY;
          companion.setEmotion('curious', 800);
        }
      }
      draggingRef.current = null;
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
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseleave', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [initRound, soundEnabled, recordShapeMatch, companion]);

  return (
    <TinyShell module="shape-sorter">
      <canvas ref={canvasRef} className="w-full h-screen block" style={{ touchAction: 'none' }} />
    </TinyShell>
  );
}
