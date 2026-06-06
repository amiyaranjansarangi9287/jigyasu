// src/worlds/tiny/modules/BubbleWorld.tsx
// Module 5: Pop rising bubbles to reveal animals, letters, numbers.
// Zero text in child UI. Otter companion.

import { useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store';
import { ParticleEngine } from '@/shared/canvas/engines/ParticleEngine';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import TinyShell from '../TinyShell';
import { useCompanion } from '../hooks/useCompanion';
import { useTinyProgress } from '../hooks/useTinyProgress';
import { BUBBLE_CONTENT } from '../data/tinyContent';

type BubbleContentType = 'animal' | 'number' | 'letter';

interface Bubble {
  id: number;
  x: number; y: number;
  radius: number;
  color: string;
  vy: number; vx: number;
  wobble: number; wobbleSpeed: number;
  contentType: BubbleContentType;
  contentIndex: number;
  popped: boolean;
  popScale: number;
  popAlpha: number;
}

interface PopReveal {
  x: number; y: number;
  contentType: BubbleContentType;
  contentValue: string;
  scale: number; alpha: number; age: number;
  starCount: number;
}

export default function BubbleWorld() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const bubblesRef = useRef<Bubble[]>([]);
  const revealRef = useRef<PopReveal[]>([]);
  const particlesRef = useRef(new ParticleEngine());
  const nextIdRef = useRef(0);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const { recordBubblePop } = useTinyProgress();

  const companion = useCompanion({ type: 'otter', x: 0.08, y: 0.88, size: 48 });

  const spawnBubble = useCallback((w: number, h: number) => {
    const roll = Math.random();
    let contentType: BubbleContentType;
    let contentIndex: number;
    if (roll < BUBBLE_CONTENT.typeWeights.animal) {
      contentType = 'animal';
      contentIndex = Math.floor(Math.random() * BUBBLE_CONTENT.animals.length);
    } else if (roll < BUBBLE_CONTENT.typeWeights.animal + BUBBLE_CONTENT.typeWeights.number) {
      contentType = 'number';
      contentIndex = Math.floor(Math.random() * BUBBLE_CONTENT.numbers.length);
    } else {
      contentType = 'letter';
      contentIndex = Math.floor(Math.random() * BUBBLE_CONTENT.letters.length);
    }
    bubblesRef.current.push({
      id: nextIdRef.current++,
      x: 35 + Math.random() * (w - 70),
      y: h + 50,
      radius: 35 + Math.random() * 45,
      color: BUBBLE_CONTENT.colors[Math.floor(Math.random() * BUBBLE_CONTENT.colors.length)],
      vy: -(40 + Math.random() * 50),
      vx: (Math.random() - 0.5) * 20,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.8 + Math.random() * 0.8,
      contentType, contentIndex,
      popped: false, popScale: 1, popAlpha: 0,
    });
  }, []);

  const popBubble = useCallback((bubble: Bubble) => {
    bubble.popped = true;
    bubble.popScale = 0.5;
    bubble.popAlpha = 1;

    let displayValue: string;
    let soundFreq: number;
    if (bubble.contentType === 'animal') {
      const a = BUBBLE_CONTENT.animals[bubble.contentIndex];
      displayValue = a.emoji;
      soundFreq = a.sound;
    } else if (bubble.contentType === 'number') {
      displayValue = String(BUBBLE_CONTENT.numbers[bubble.contentIndex]);
      soundFreq = 400 + BUBBLE_CONTENT.numbers[bubble.contentIndex] * 50;
    } else {
      displayValue = BUBBLE_CONTENT.letters[bubble.contentIndex];
      soundFreq = 600 + bubble.contentIndex * 10;
    }

    particlesRef.current.emit({
      count: 15, originX: bubble.x, originY: bubble.y,
      color: [bubble.color, '#ffffff', '#ffe4e1'],
      speed: 150, spread: 360, size: 6, sizeVariance: 3,
      maxLife: 0.6, gravity: 100, fadeOut: true,
    });

    if (soundEnabled) {
      try {
        AudioEngine.playTone({ frequency: soundFreq, type: 'sine', duration: 0.2, volume: 0.25, attack: 0.01, decay: 0.1 });
      } catch (_) { /* silent */ }
    }

    revealRef.current.push({
      x: bubble.x, y: bubble.y,
      contentType: bubble.contentType,
      contentValue: displayValue,
      scale: 0, alpha: 1, age: 0,
      starCount: bubble.contentType === 'number' ? BUBBLE_CONTENT.numbers[bubble.contentIndex] : 0,
    });

    if (bubble.contentType === 'letter') {
      recordBubblePop('letter', BUBBLE_CONTENT.letters[bubble.contentIndex]);
    } else if (bubble.contentType === 'number') {
      recordBubblePop('number', BUBBLE_CONTENT.numbers[bubble.contentIndex]);
    } else {
      recordBubblePop('animal', BUBBLE_CONTENT.animals[bubble.contentIndex].emoji);
    }
    companion.setEmotion('happy', 1000);
  }, [soundEnabled, recordBubblePop, companion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width; const h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    for (let i = 0; i < 6; i++) setTimeout(() => spawnBubble(w, h), i * 400);

    let lastTime = performance.now();
    let spawnTimer = 0;

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      const time = timestamp / 1000;
      ctx.clearRect(0, 0, w, h);

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#0f172a');
      bg.addColorStop(0.5, '#1e1b4b');
      bg.addColorStop(1, '#0f172a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Spawn
      spawnTimer += dt;
      if (spawnTimer > 1.5 && bubblesRef.current.filter(b => !b.popped).length < 12) {
        spawnBubble(w, h);
        spawnTimer = 0;
      }

      // Remove off-screen / fully popped
      bubblesRef.current = bubblesRef.current.filter(b =>
        (!b.popped && b.y + b.radius > -50) || (b.popped && b.popAlpha > 0)
      );

      // Update & draw bubbles
      bubblesRef.current.forEach((b) => {
        if (b.popped) {
          b.popScale += dt * 4;
          b.popAlpha -= dt * 3;
          ctx.save();
          ctx.globalAlpha = Math.max(0, b.popAlpha);
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius * b.popScale, 0, Math.PI * 2);
          ctx.strokeStyle = b.color;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
          return;
        }
        b.y += b.vy * dt;
        b.x += b.vx * dt;
        b.wobble += b.wobbleSpeed * dt;
        b.x += Math.sin(b.wobble) * 0.5;
        if (b.x - b.radius < 0) { b.x = b.radius; b.vx = Math.abs(b.vx); }
        if (b.x + b.radius > w) { b.x = w - b.radius; b.vx = -Math.abs(b.vx); }

        ctx.save();
        // Glow
        const glow = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius * 1.3);
        glow.addColorStop(0, b.color.replace('0.65', '0.1'));
        glow.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(b.x, b.y, b.radius * 1.3, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
        // Body
        ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); ctx.fillStyle = b.color; ctx.fill();
        // Shine
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
        // Outline
        ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.restore();
      });

      // Reveals
      revealRef.current = revealRef.current.filter(r => r.alpha > 0);
      revealRef.current.forEach((r) => {
        r.age += dt;
        r.scale = Math.min(1.2, r.scale + dt * 5);
        if (r.age > 0.5) r.alpha -= dt * 1.5;
        ctx.save();
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (r.contentType === 'number') {
          ctx.font = `bold ${48 * r.scale}px sans-serif`;
          ctx.fillStyle = '#FDE047';
          ctx.fillText(r.contentValue, r.x, r.y);
          for (let i = 0; i < r.starCount; i++) {
            const angle = (i / r.starCount) * Math.PI * 2;
            const sr = 40 * r.scale + r.age * 30;
            ctx.font = '16px sans-serif';
            ctx.fillText('⭐', r.x + Math.cos(angle) * sr, r.y + Math.sin(angle) * sr);
          }
        } else if (r.contentType === 'letter') {
          ctx.font = `bold ${56 * r.scale}px sans-serif`;
          ctx.fillStyle = '#F472B6';
          ctx.fillText(r.contentValue, r.x, r.y);
        } else {
          ctx.font = `${52 * r.scale}px sans-serif`;
          ctx.fillText(r.contentValue, r.x, r.y);
        }
        ctx.restore();
      });

      particlesRef.current.update(dt, 50);
      particlesRef.current.draw(ctx);
      companion.updateCompanion(dt, time);
      companion.drawCompanion(ctx, w, h, '🦦');
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    const handlePop = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      let tx: number, ty: number;
      if ('touches' in e && e.touches.length > 0) { tx = e.touches[0].clientX - r.left; ty = e.touches[0].clientY - r.top; }
      else { tx = (e as MouseEvent).clientX - r.left; ty = (e as MouseEvent).clientY - r.top; }
      for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
        const b = bubblesRef.current[i];
        if (b.popped) continue;
        if (Math.sqrt((tx - b.x) ** 2 + (ty - b.y) ** 2) < b.radius + 10) { popBubble(b); return; }
      }
      companion.setEmotion('curious', 800);
    };

    canvas.addEventListener('click', handlePop);
    canvas.addEventListener('touchstart', handlePop, { passive: false });
    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener('click', handlePop);
      canvas.removeEventListener('touchstart', handlePop);
    };
  }, [spawnBubble, popBubble, companion]);

  return (
    <TinyShell module="bubble-world">
      <canvas ref={canvasRef} className="w-full h-screen block" style={{ touchAction: 'none' }} />
    </TinyShell>
  );
}
