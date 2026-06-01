// src/worlds/tiny/modules/TapWorld.tsx
// Module 1: Tap anywhere to spawn animals with sounds and particles.
// Zero text. Pure sensory discovery.

import { useRef, useEffect, useCallback } from 'react';
import { useSettingsStore } from '@/store';
import { ParticleEngine } from '@/shared/canvas/engines/ParticleEngine';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import TinyShell from '../TinyShell';
import { useCompanion } from '../hooks/useCompanion';
import { useTinyProgress } from '../hooks/useTinyProgress';
import { useTinySession } from '../hooks/useTinySession';
import { TAP_ANIMALS } from '../data/tinyContent';

interface SpawnedAnimal {
  x: number;
  y: number;
  emoji: string;
  scale: number;
  alpha: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  animOffset: number;
  label: string;
}

export default function TapWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const animalsRef = useRef<SpawnedAnimal[]>([]);
  const particlesRef = useRef(new ParticleEngine());
  const lastTimeRef = useRef(0);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const { discoverAnimal } = useTinyProgress();
  const { trackInteraction } = useTinySession();

  const companion = useCompanion({
    type: 'bunny',
    x: 0.1,
    y: 0.9,
    size: 48,
  });

  const spawnAnimal = useCallback((tapX: number, tapY: number) => {
    const animal = TAP_ANIMALS[Math.floor(Math.random() * TAP_ANIMALS.length)];

    if (soundEnabled) {
      try {
        AudioEngine.playTone({
          frequency: animal.sound.freq,
          type: animal.sound.type,
          duration: animal.sound.duration,
          volume: 0.3,
          attack: 0.05,
          decay: 0.1,
        });
      } catch (_) { /* audio can fail silently */ }
    }

    particlesRef.current.emit({
      count: 12,
      originX: tapX,
      originY: tapY,
      color: [animal.color, '#ffffff', '#ffe4e1'],
      speed: 150,
      spread: 360,
      size: 8,
      sizeVariance: 4,
      maxLife: 0.8,
      gravity: 200,
      fadeOut: true,
    });

    animalsRef.current.push({
      x: tapX,
      y: tapY,
      emoji: animal.emoji,
      scale: 0,
      alpha: 1,
      vx: (Math.random() - 0.5) * 30,
      vy: -20,
      age: 0,
      maxAge: 20,
      animOffset: Math.random() * Math.PI * 2,
      label: animal.label,
    });

    if (animalsRef.current.length > 8) {
      animalsRef.current.shift();
    }

    discoverAnimal(animal.label);
    trackInteraction('tap-world', { animal: animal.label, x: tapX, y: tapY });
    companion.setEmotion('happy', 1000);
  }, [soundEnabled, discoverAnimal, trackInteraction, companion]);

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

    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
    }));

    lastTimeRef.current = performance.now();

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;
      const time = timestamp / 1000;

      ctx.clearRect(0, 0, w, h);

      // Dark sky
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#1a1a2e');
      bg.addColorStop(1, '#16213e');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Stars
      stars.forEach((star) => {
        const twinkle = 0.3 + Math.sin(time * 2 + star.twinkle) * 0.3;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${twinkle})`;
        ctx.fill();
      });

      // Animals
      const animals = animalsRef.current;
      for (let i = animals.length - 1; i >= 0; i--) {
        const a = animals[i];
        a.age += dt;

        if (a.scale < 1) a.scale = Math.min(1, a.scale + dt * 6);

        a.x += a.vx * dt;
        a.vy *= 0.95;
        a.y += a.vy * dt;
        a.vx *= 0.98;

        const swayX = a.x + Math.sin(time * 2 + a.animOffset) * 5;

        if (a.age > a.maxAge - 2) {
          a.alpha = Math.max(0, (a.maxAge - a.age) / 2);
        }
        if (a.age >= a.maxAge) {
          animals.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = a.alpha;
        ctx.translate(swayX, a.y);
        ctx.scale(a.scale * 1.2, a.scale * 1.2);
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(a.emoji, 0, 0);
        ctx.restore();
      }

      // Dance sparkles when 5+ animals
      if (animals.length >= 5) {
        companion.setEmotion('celebrating', 500);
        animals.forEach((a) => {
          const dx = a.x + Math.sin(time * 5 + a.animOffset) * 15;
          const dy = a.y + Math.cos(time * 5 + a.animOffset) * 8;
          ctx.save();
          ctx.globalAlpha = a.alpha * 0.3;
          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✨', dx, dy);
          ctx.restore();
        });
      }

      // Particles
      particlesRef.current.update(dt, 300);
      particlesRef.current.draw(ctx);

      // Companion
      companion.updateCompanion(dt, time);
      companion.drawCompanion(ctx, w, h, '🐇');

      // Tap hint when empty
      if (animals.length === 0) {
        const pulse = 0.4 + Math.sin(time * 2) * 0.3;
        ctx.globalAlpha = pulse;
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('👇', w / 2, h - 100);
        ctx.globalAlpha = 1;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    const handleInput = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      let x: number, y: number;
      if ('touches' in e && e.touches.length > 0) {
        x = e.touches[0].clientX - r.left;
        y = e.touches[0].clientY - r.top;
      } else {
        x = (e as MouseEvent).clientX - r.left;
        y = (e as MouseEvent).clientY - r.top;
      }
      spawnAnimal(x, y);
    };

    canvas.addEventListener('click', handleInput);
    canvas.addEventListener('touchstart', handleInput, { passive: false });

    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener('click', handleInput);
      canvas.removeEventListener('touchstart', handleInput);
    };
  }, [spawnAnimal, companion]);

  return (
    <TinyShell module="tap-world">
      <canvas
        ref={canvasRef}
        className="w-full h-screen block"
        style={{ touchAction: 'none' }}
      />
    </TinyShell>
  );
}
