import { useRef, useEffect } from 'react';

interface GravityCanvasProps {
  mass: number;
  showNewton: boolean;
}

export default function GravityCanvas({ mass, showNewton }: GravityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const draggingRef = useRef(false);
  const massPosRef = useRef({ x: 0, y: 0 });
  const orbitAngleRef = useRef(0);
  const orbit2AngleRef = useRef(0);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const trail2Ref = useRef<{ x: number; y: number }[]>([]);
  const starsRef = useRef<{ x: number; y: number; r: number; a: number }[]>([]);
  const massRef = useRef(mass);
  const showNewtonRef = useRef(showNewton);

  useEffect(() => {
    massRef.current = mass;
  }, [mass]);

  useEffect(() => {
    showNewtonRef.current = showNewton;
  }, [showNewton]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    massPosRef.current = { x: w / 2, y: h / 2 };

    starsRef.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random() * 0.6 + 0.2,
    }));

    orbitAngleRef.current = 0;
    orbit2AngleRef.current = Math.PI * 0.7;
    trailRef.current = [];
    trail2Ref.current = [];

    const gridCols = 18;
    const gridRows = 14;

    const getDisplacedPoint = (x: number, y: number, mx: number, my: number, strength: number) => {
      const dx = mx - x;
      const dy = my - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const smoothDist = dist + 15;
      const force = strength / (smoothDist / 20);
      const falloff = Math.min(force, dist * 0.5);
      if (dist < 1) return { x, y };
      return {
        x: x + (dx / dist) * falloff * 0.5,
        y: y + (dy / dist) * falloff * 0.5,
      };
    };

    const animate = () => {
      const mx = massPosRef.current.x;
      const my = massPosRef.current.y;
      const strength = massRef.current;
      const isNewton = showNewtonRef.current;

      ctx.clearRect(0, 0, w, h);

      starsRef.current.forEach((star) => {
        const twinkle = star.a + Math.sin(Date.now() * 0.002 + star.x) * 0.15;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        ctx.fill();
      });

      const cellW = w / gridCols;
      const cellH = h / gridRows;

      for (let row = 0; row <= gridRows; row++) {
        ctx.beginPath();
        for (let col = 0; col <= gridCols; col++) {
          const ox = col * cellW;
          const oy = row * cellH;
          const dp = getDisplacedPoint(ox, oy, mx, my, strength);
          if (col === 0) ctx.moveTo(dp.x, dp.y);
          else ctx.lineTo(dp.x, dp.y);
        }
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let col = 0; col <= gridCols; col++) {
        ctx.beginPath();
        for (let row = 0; row <= gridRows; row++) {
          const ox = col * cellW;
          const oy = row * cellH;
          const dp = getDisplacedPoint(ox, oy, mx, my, strength);
          if (row === 0) ctx.moveTo(dp.x, dp.y);
          else ctx.lineTo(dp.x, dp.y);
        }
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (isNewton) {
        const arrowCount = 8;
        for (let i = 0; i < arrowCount; i++) {
          const angle = (i / arrowCount) * Math.PI * 2;
          const startR = 80;
          const endR = 140;
          const sx = mx + Math.cos(angle) * startR;
          const sy = my + Math.sin(angle) * startR;
          const ex = mx + Math.cos(angle) * endR;
          const ey = my + Math.sin(angle) * endR;

          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();

          const headLen = 8;
          const headAngle = angle + Math.PI;
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex + Math.cos(headAngle - 0.4) * headLen, ey + Math.sin(headAngle - 0.4) * headLen);
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex + Math.cos(headAngle + 0.4) * headLen, ey + Math.sin(headAngle + 0.4) * headLen);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Gravity pulls inward', mx, my - 60);
      }

      const massGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
      massGlow.addColorStop(0, 'rgba(251, 191, 36, 0.15)');
      massGlow.addColorStop(0.5, 'rgba(251, 146, 60, 0.05)');
      massGlow.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.beginPath();
      ctx.arc(mx, my, 60, 0, Math.PI * 2);
      ctx.fillStyle = massGlow;
      ctx.fill();

      const wellGrad = ctx.createRadialGradient(mx, my, 0, mx, my, strength * 1.5);
      wellGrad.addColorStop(0, 'rgba(251, 191, 36, 0.08)');
      wellGrad.addColorStop(0.5, 'rgba(251, 146, 60, 0.03)');
      wellGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(mx, my, strength * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = wellGrad;
      ctx.fill();

      const sunGrad = ctx.createRadialGradient(mx - 3, my - 3, 0, mx, my, 18);
      sunGrad.addColorStop(0, '#fef3c7');
      sunGrad.addColorStop(0.3, '#fbbf24');
      sunGrad.addColorStop(0.7, '#f59e0b');
      sunGrad.addColorStop(1, '#d97706');
      ctx.beginPath();
      ctx.arc(mx, my, 16, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mx, my, 20, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      orbitAngleRef.current += 0.008 + strength * 0.00015;
      const orbit1R = Math.min(w, h) * 0.22;
      const orbit2R = Math.min(w, h) * 0.22 * 0.55;
      const p1x = mx + Math.cos(orbitAngleRef.current) * orbit1R;
      const p1y = my + Math.sin(orbitAngleRef.current) * orbit2R;

      trailRef.current.push({ x: p1x, y: p1y });
      if (trailRef.current.length > 80) trailRef.current.shift();

      if (trailRef.current.length > 1) {
        for (let i = 1; i < trailRef.current.length; i++) {
          const alpha = (i / trailRef.current.length) * 0.5;
          ctx.beginPath();
          ctx.arc(trailRef.current[i].x, trailRef.current[i].y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
          ctx.fill();
        }
      }

      const planet1Grad = ctx.createRadialGradient(p1x - 1, p1y - 1, 0, p1x, p1y, 6);
      planet1Grad.addColorStop(0, '#93c5fd');
      planet1Grad.addColorStop(1, '#3b82f6');
      ctx.beginPath();
      ctx.arc(p1x, p1y, 6, 0, Math.PI * 2);
      ctx.fillStyle = planet1Grad;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(mx, my, orbit1R, orbit2R, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      orbit2AngleRef.current += 0.004 + strength * 0.00008;
      const orbit3R = Math.min(w, h) * 0.33;
      const orbit4R = Math.min(w, h) * 0.33 * 0.5;
      const p2x = mx + Math.cos(orbit2AngleRef.current) * orbit3R;
      const p2y = my + Math.sin(orbit2AngleRef.current) * orbit4R;

      trail2Ref.current.push({ x: p2x, y: p2y });
      if (trail2Ref.current.length > 100) trail2Ref.current.shift();

      if (trail2Ref.current.length > 1) {
        for (let i = 1; i < trail2Ref.current.length; i++) {
          const alpha = (i / trail2Ref.current.length) * 0.35;
          ctx.beginPath();
          ctx.arc(trail2Ref.current[i].x, trail2Ref.current[i].y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
          ctx.fill();
        }
      }

      const planet2Grad = ctx.createRadialGradient(p2x - 1, p2y - 1, 0, p2x, p2y, 4);
      planet2Grad.addColorStop(0, '#c4b5fd');
      planet2Grad.addColorStop(1, '#8b5cf6');
      ctx.beginPath();
      ctx.arc(p2x, p2y, 4, 0, Math.PI * 2);
      ctx.fillStyle = planet2Grad;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(mx, my, orbit3R, orbit4R, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (!isNewton) {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Space is curved → planets follow the curve', mx, my + 50);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    const getCanvasPos = (e: MouseEvent | TouchEvent) => {
      const rect2 = canvas.getBoundingClientRect();
      if ('touches' in e) {
        return {
          x: e.touches[0].clientX - rect2.left,
          y: e.touches[0].clientY - rect2.top,
        };
      }
      return {
        x: e.clientX - rect2.left,
        y: e.clientY - rect2.top,
      };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const pos = getCanvasPos(e);
      const dx = pos.x - massPosRef.current.x;
      const dy = pos.y - massPosRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 40) {
        draggingRef.current = true;
        canvas.style.cursor = 'grabbing';
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      const pos = getCanvasPos(e);
      massPosRef.current = {
        x: Math.max(30, Math.min(w - 30, pos.x)),
        y: Math.max(30, Math.min(h - 30, pos.y)),
      };
    };

    const handleEnd = () => {
      draggingRef.current = false;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);
    canvas.style.cursor = 'grab';

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
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[16/9] block" />;
}
