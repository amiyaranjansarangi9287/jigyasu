// src/worlds/tiny/modules/AnimalOrchestra.tsx
// Module 4: Tap animals to hear their notes. Play all for group performance.
// Pentatonic scale — everything sounds good together.
// Zero text. Peacock companion fans tail during performance.

import { useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import TinyShell from '../TinyShell';
import { useCompanion } from '../hooks/useCompanion';
import { useTinyProgress } from '../hooks/useTinyProgress';
import { ORCHESTRA_ANIMALS } from '../data/tinyContent';

interface OrchestraAnimal {
  emoji: string;
  note: number;
  label: string;
  waveform: OscillatorType;
  x: number;
  y: number;
  scale: number;
  isPlaying: boolean;
  playTimer: number;
  animOffset: number;
}

interface NoteTrail {
  x: number; y: number;
  alpha: number;
  vy: number;
  size: number;
}

export default function AnimalOrchestra() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const animalsRef = useRef<OrchestraAnimal[]>([]);
  const noteTrailsRef = useRef<NoteTrail[]>([]);
  const playedSetRef = useRef<Set<string>>(new Set());
  const groupPerformingRef = useRef(false);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const { recordAnimalPlayed } = useTinyProgress();

  const companion = useCompanion({
    type: 'peacock',
    x: 0.92,
    y: 0.45,
    size: 52,
  });

  const playAnimal = useCallback((idx: number) => {
    const animal = animalsRef.current[idx];
    if (!animal || groupPerformingRef.current) return;

    if (soundEnabled) {
      try {
        AudioEngine.playTone({
          frequency: animal.note,
          type: animal.waveform,
          duration: 0.5,
          volume: 0.3,
          attack: 0.02,
          decay: 0.15,
        });
      } catch (_) { /* silent */ }
    }

    animal.isPlaying = true;
    animal.scale = 1.4;
    animal.playTimer = 0.5;

    noteTrailsRef.current.push({
      x: animal.x,
      y: animal.y - 25,
      alpha: 1,
      vy: -60,
      size: 24,
    });

    recordAnimalPlayed(animal.label);
    playedSetRef.current.add(animal.label);
    companion.setEmotion('happy', 800);

    // Check if all unique animals played
    if (playedSetRef.current.size >= ORCHESTRA_ANIMALS.length && !groupPerformingRef.current) {
      groupPerformingRef.current = true;
      companion.setEmotion('celebrating', 5000);

      if (soundEnabled) {
        animalsRef.current.forEach((a, i) => {
          setTimeout(() => {
            try {
              AudioEngine.playTone({
                frequency: a.note,
                type: a.waveform,
                duration: 0.4,
                volume: 0.25,
                attack: 0.02,
                decay: 0.1,
              });
              a.isPlaying = true;
              a.playTimer = 0.6;
            } catch (_) { /* silent */ }
          }, i * 180);
        });
      }

      setTimeout(() => {
        groupPerformingRef.current = false;
        playedSetRef.current.clear();
      }, 5000);
    }
  }, [soundEnabled, recordAnimalPlayed, companion]);

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

    animalsRef.current = ORCHESTRA_ANIMALS.map((a) => ({
      emoji: a.emoji,
      note: a.note,
      label: a.label,
      waveform: a.waveform,
      x: a.position.x * w,
      y: a.position.y * h,
      scale: 1,
      isPlaying: false,
      playTimer: 0,
      animOffset: Math.random() * Math.PI * 2,
    }));

    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      const time = timestamp / 1000;

      ctx.clearRect(0, 0, w, h);

      // Forest clearing
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      sky.addColorStop(0, '#86efac');
      sky.addColorStop(1, '#bbf7d0');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h * 0.5);

      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, h * 0.5, w, h * 0.5);

      // Trees
      const drawTree = (tx: number) => {
        ctx.fillStyle = '#854d0e';
        ctx.fillRect(tx - 7, h * 0.35, 14, h * 0.25);
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(tx, h * 0.32, 30, 0, Math.PI * 2);
        ctx.fill();
      };
      drawTree(18);
      drawTree(w - 18);

      // Logs
      ctx.fillStyle = '#92400e';
      animalsRef.current.forEach((a) => {
        ctx.beginPath();
        ctx.ellipse(a.x, a.y + 28, 28, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Group performance sparkles
      if (groupPerformingRef.current) {
        for (let i = 0; i < 4; i++) {
          const sx = (Math.sin(time * 3 + i * 2) * 0.4 + 0.5) * w;
          const sy = (Math.cos(time * 2.5 + i * 1.7) * 0.3 + 0.3) * h;
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✨', sx, sy);
        }
      }

      // Animals
      animalsRef.current.forEach((animal, idx) => {
        if (animal.playTimer > 0) {
          animal.playTimer -= dt;
          if (animal.playTimer <= 0) animal.isPlaying = false;
        }

        const targetScale = animal.isPlaying ? 1.3 : 1.0;
        animal.scale += (targetScale - animal.scale) * 8 * dt;

        const bob = animal.isPlaying ? 0 : Math.sin(time * 1.5 + animal.animOffset) * 4;

        const emojiSize = 44 * animal.scale;
        ctx.font = `${emojiSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (groupPerformingRef.current) {
          const dx = animal.x + Math.sin(time * 5 + idx) * 10;
          const dy = animal.y + Math.cos(time * 5 + idx) * 8;
          ctx.fillText(animal.emoji, dx, dy);
        } else {
          ctx.fillText(animal.emoji, animal.x, animal.y + bob);
        }

        if (animal.isPlaying) {
          ctx.font = '16px sans-serif';
          ctx.fillText('🎵', animal.x + 22, animal.y - 28);
        }
      });

      // Note trails
      noteTrailsRef.current = noteTrailsRef.current.filter((n) => n.alpha > 0);
      noteTrailsRef.current.forEach((note) => {
        note.y += note.vy * dt;
        note.alpha -= dt * 1.5;
        note.size -= dt * 5;
        ctx.save();
        ctx.globalAlpha = Math.max(0, note.alpha);
        ctx.font = `${Math.max(8, note.size)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♪', note.x, note.y);
        ctx.restore();
      });

      // Companion
      companion.updateCompanion(dt, time);
      companion.drawCompanion(ctx, w, h, '🦚');

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    // Tap
    const handleTap = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      let tapX: number, tapY: number;
      if ('touches' in e && e.touches.length > 0) {
        tapX = e.touches[0].clientX - r.left;
        tapY = e.touches[0].clientY - r.top;
      } else {
        tapX = (e as MouseEvent).clientX - r.left;
        tapY = (e as MouseEvent).clientY - r.top;
      }

      for (let i = 0; i < animalsRef.current.length; i++) {
        const a = animalsRef.current[i];
        const d = Math.sqrt((tapX - a.x) ** 2 + (tapY - a.y) ** 2);
        if (d < 45) {
          playAnimal(i);
          return;
        }
      }
    };

    canvas.addEventListener('click', handleTap);
    canvas.addEventListener('touchstart', handleTap, { passive: false });

    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener('click', handleTap);
      canvas.removeEventListener('touchstart', handleTap);
    };
  }, [playAnimal, companion]);

  return (
    <TinyShell module="animal-orchestra">
      <canvas ref={canvasRef} className="w-full h-screen block" style={{ touchAction: 'none' }} />
    </TinyShell>
  );
}
