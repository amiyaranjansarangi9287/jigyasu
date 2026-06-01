// src/worlds/lab/components/JigyasuGuideCanvas.tsx
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import type { JigyasuGuideEmotion, LabSubject } from '../types/lab.types';

const SUBJECT_ACCESSORIES: Record<LabSubject, { emoji: string; x: number; y: number; }> = {
  math: { emoji: '📐', x: 20, y: -10 },
  physics: { emoji: '⚡', x: -20, y: -15 },
  biology: { emoji: '🌿', x: 20, y: 5 },
  chemistry: { emoji: '🧪', x: -20, y: 0 },
  'earth-science': { emoji: '🌍', x: 20, y: 10 },
  'computer-science': { emoji: '💻', x: -22, y: -5 },
};

export function drawJigyasuGuide(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, emotion: JigyasuGuideEmotion, subject: LabSubject, time: number) {
  ctx.save();
  let dy = 0, sc = 1.0, rot = 0;
  if (emotion === 'appearing') sc = 0.1 + (Math.sin(time * 8) * 0.5 + 0.5) * 0.9;
  else if (emotion === 'speaking') dy = Math.sin(time * 4) * 2;
  else if (emotion === 'celebrating') { dy = -Math.abs(Math.sin(time * 6)) * 10; sc = 1.1 + Math.sin(time * 5) * 0.05; }
  else if (emotion === 'thinking') { rot = 0.2; dy = Math.sin(time * 1.5) * 3; }
  else if (emotion === 'departing') sc = Math.max(0, 1 - (time % 1));
  else dy = Math.sin(time * 1.2) * 3;

  ctx.translate(x, y + dy); ctx.rotate(rot); ctx.scale(sc, sc);
  const grad = CanvasHelpers.createRadialGradient(ctx, 0, 0, 0, size, [[0, '#F8FAFC'], [0.5, '#CBD5E1'], [1, '#94A3B8']]);
  ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
  ctx.fillStyle = '#94A3B8';
  ctx.beginPath(); ctx.ellipse(-size * 0.85, size * 0.15, size * 0.35, size * 0.5, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(size * 0.85, size * 0.15, size * 0.35, size * 0.5, 0.3, 0, Math.PI * 2); ctx.fill();
  const ey = -size * 0.1, es = size * 0.32;
  ctx.fillStyle = '#FEF3C7';
  ctx.beginPath(); ctx.arc(-es, ey, size * 0.28, 0, Math.PI * 2); ctx.arc(es, ey, size * 0.28, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#78350F'; ctx.lineWidth = size * 0.06;
  ctx.beginPath(); ctx.arc(-es, ey, size * 0.28, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(es, ey, size * 0.28, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-es + size * 0.28, ey); ctx.lineTo(es - size * 0.28, ey); ctx.stroke();
  ctx.fillStyle = '#1E293B';
  ctx.beginPath(); ctx.arc(-es, ey, size * 0.15, 0, Math.PI * 2); ctx.arc(es, ey, size * 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#FBBF24';
  ctx.beginPath(); ctx.moveTo(-size * 0.1, size * 0.12); ctx.lineTo(0, size * 0.28); ctx.lineTo(size * 0.1, size * 0.12); ctx.fill();
  const acc = SUBJECT_ACCESSORIES[subject];
  if (acc) { ctx.font = `${size * 0.5}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText(acc.emoji, acc.x, acc.y); }
  ctx.restore();
}

export { drawJigyasuGuide as drawLumoOwl };
