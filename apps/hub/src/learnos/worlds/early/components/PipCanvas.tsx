// src/worlds/early/components/PipCanvas.tsx
// Pip character drawn on canvas — called inside animation loops.

import type { PipEmotion } from '../types/early.types';

export function drawPip(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  emotion: PipEmotion, time: number
) {
  ctx.save();
  let bodyY = y;
  let bodyScale = 1.0;
  let rotation = 0;

  switch (emotion) {
    case 'excited': case 'celebrating':
      bodyY = y - Math.abs(Math.sin(time * 8)) * 12;
      bodyScale = 1.15;
      rotation = Math.sin(time * 6) * 0.1;
      break;
    case 'curious': case 'thinking':
      rotation = 0.25;
      break;
    case 'encouraging':
      bodyY = y - Math.abs(Math.sin(time * 4)) * 6;
      bodyScale = 1.05;
      break;
    case 'surprised':
      bodyScale = 1.2;
      break;
    case 'sleepy':
      bodyY = y + Math.sin(time * 0.8) * 3;
      bodyScale = 0.9;
      break;
    default:
      bodyY = y + Math.sin(time * 1.5) * 3;
  }

  ctx.translate(x, bodyY);
  ctx.rotate(rotation);
  ctx.scale(bodyScale, bodyScale);

  // Body
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(-size * 0.3, -size * 0.3, 0, 0, 0, size);
  grad.addColorStop(0, '#FEF3C7');
  grad.addColorStop(0.5, '#FCD34D');
  grad.addColorStop(1, '#F59E0B');
  ctx.fillStyle = grad;
  ctx.fill();

  // Wings
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.ellipse(-size * 0.8, size * 0.2, size * 0.35, size * 0.2, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(size * 0.8, size * 0.2, size * 0.35, size * 0.2, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  const eyeY = -size * 0.15;
  const eyeX = size * 0.28;
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(-eyeX, eyeY, size * 0.22, 0, Math.PI * 2);
  ctx.arc(eyeX, eyeY, size * 0.22, 0, Math.PI * 2);
  ctx.fill();

  const pupilOff = emotion === 'curious' ? { x: 3, y: -2 } : { x: 0, y: 0 };
  ctx.fillStyle = '#1F2937';
  ctx.beginPath();
  ctx.arc(-eyeX + pupilOff.x, eyeY + pupilOff.y, size * 0.13, 0, Math.PI * 2);
  ctx.arc(eyeX + pupilOff.x, eyeY + pupilOff.y, size * 0.13, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(-eyeX + size * 0.07, eyeY - size * 0.07, size * 0.06, 0, Math.PI * 2);
  ctx.arc(eyeX + size * 0.07, eyeY - size * 0.07, size * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // Sleepy lids
  if (emotion === 'sleepy') {
    ctx.fillStyle = '#FCD34D';
    ctx.fillRect(-eyeX - size * 0.22, eyeY, size * 0.44, size * 0.22);
    ctx.fillRect(eyeX - size * 0.22, eyeY, size * 0.44, size * 0.22);
    ctx.font = `${size * 0.5}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('💤', size * 1.2, -size);
  }

  // Beak
  ctx.fillStyle = '#F97316';
  ctx.beginPath();
  ctx.moveTo(-size * 0.1, size * 0.15);
  ctx.lineTo(0, size * 0.35);
  ctx.lineTo(size * 0.1, size * 0.15);
  ctx.closePath();
  ctx.fill();

  // Expression marks
  if (emotion === 'celebrating' || emotion === 'excited') {
    ctx.font = `${size * 0.6}px sans-serif`;
    ctx.textAlign = 'center';
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + time * 2;
      ctx.fillText('✨', Math.cos(a) * size * 1.6, Math.sin(a) * size * 1.6);
    }
  }
  if (emotion === 'surprised') {
    ctx.font = `${size * 0.5}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('❗', 0, -size * 1.5);
  }

  ctx.restore();
}
