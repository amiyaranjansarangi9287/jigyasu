// src/worlds/tiny/companions/CompanionCanvas.tsx
// Shared companion renderer — draws the companion emoji on a canvas context.
// Not used as a standalone component; the drawCompanion method from
// useCompanion hook handles rendering directly onto each module's canvas.
// This file provides utility functions for companion visual effects.

export function drawCompanionGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  intensity: number
): void {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `${color}${Math.round(intensity * 60).toString(16).padStart(2, '0')}`);
  gradient.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

export function drawSleepBubbles(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number
): void {
  const bubbles = [
    { offset: 0, size: 8 },
    { offset: 0.8, size: 12 },
    { offset: 1.6, size: 16 },
  ];

  bubbles.forEach((b) => {
    const t = (time + b.offset) % 3;
    const bx = x + 15 + t * 5;
    const by = y - 20 - t * 15;
    const alpha = Math.max(0, 1 - t / 3);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `${b.size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💤', bx, by);
    ctx.restore();
  });
}

export function drawExcitementStars(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number,
  count: number = 3
): void {
  for (let i = 0; i < count; i++) {
    const angle = (time * 2 + (i * Math.PI * 2) / count);
    const dist = 25 + Math.sin(time * 3 + i) * 5;
    const sx = x + Math.cos(angle) * dist;
    const sy = y + Math.sin(angle) * dist;

    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨', sx, sy);
    ctx.restore();
  }
}
