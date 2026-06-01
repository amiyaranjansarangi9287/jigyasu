import { useRef, useEffect } from 'react';

interface PythagoreanCanvasProps {
  sideA: number;
  sideB: number;
  showProof?: boolean;
}

export default function PythagoreanCanvas({ sideA, sideB, showProof = false }: PythagoreanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const aRef = useRef(sideA);
  const bRef = useRef(sideB);
  const showProofRef = useRef(showProof);
  const animRef = useRef(0);
  const fillRef = useRef(0);

  useEffect(() => { aRef.current = sideA; }, [sideA]);
  useEffect(() => { bRef.current = sideB; }, [sideB]);
  useEffect(() => { showProofRef.current = showProof; fillRef.current = 0; }, [showProof]);

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

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      animRef.current += 0.02;

      const a = aRef.current;
      const b = bRef.current;
      const c = Math.sqrt(a * a + b * b);
      const scale = Math.min(w, h) / (Math.max(a, b) * 5.5);

      // Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(0,0,0,0.04)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 20) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
      for (let gy = 0; gy < h; gy += 20) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }

      // Triangle position
      const triX = w * 0.35;
      const triY = h * 0.6;
      const aScaled = a * scale;
      const bScaled = b * scale;
      const cScaled = c * scale;

      // Points of right triangle
      const p1 = { x: triX, y: triY }; // bottom-left (right angle)
      const p2 = { x: triX + aScaled, y: triY }; // bottom-right
      const p3 = { x: triX, y: triY - bScaled }; // top-left

      // Draw triangle
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Right angle marker
      const markerSize = 15;
      ctx.beginPath();
      ctx.moveTo(p1.x + markerSize, p1.y);
      ctx.lineTo(p1.x + markerSize, p1.y - markerSize);
      ctx.lineTo(p1.x, p1.y - markerSize);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Side labels
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';

      // Side a (bottom)
      ctx.fillStyle = '#ef4444';
      ctx.fillText(`a = ${a}`, (p1.x + p2.x) / 2, p1.y + 25);

      // Side b (left)
      ctx.save();
      ctx.translate(p1.x - 25, (p1.y + p3.y) / 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fillText(`b = ${b}`, 0, 0);
      ctx.restore();

      // Side c (hypotenuse)
      const midCx = (p2.x + p3.x) / 2 + 20;
      const midCy = (p2.y + p3.y) / 2;
      ctx.fillStyle = '#a855f7';
      ctx.fillText(`c = ${c.toFixed(1)}`, midCx, midCy);

      // Squares on each side
      // a² square (red, bottom)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.fillRect(p1.x, p1.y, aScaled, aScaled);
      ctx.strokeRect(p1.x, p1.y, aScaled, aScaled);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`a² = ${a * a}`, p1.x + aScaled / 2, p1.y + aScaled / 2 + 5);

      // Draw grid inside a²
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.lineWidth = 1;
      for (let gi = 1; gi < a; gi++) {
        const gp = gi * scale;
        ctx.beginPath(); ctx.moveTo(p1.x + gp, p1.y); ctx.lineTo(p1.x + gp, p1.y + aScaled); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y + gp); ctx.lineTo(p1.x + aScaled, p1.y + gp); ctx.stroke();
      }

      // b² square (blue, left)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.fillRect(p1.x - bScaled, p1.y - bScaled, bScaled, bScaled);
      ctx.strokeRect(p1.x - bScaled, p1.y - bScaled, bScaled, bScaled);
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`b² = ${b * b}`, p1.x - bScaled / 2, p1.y - bScaled / 2 + 5);

      // Draw grid inside b²
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.lineWidth = 1;
      for (let gi = 1; gi < b; gi++) {
        const gp = gi * scale;
        ctx.beginPath(); ctx.moveTo(p1.x - bScaled + gp, p1.y - bScaled); ctx.lineTo(p1.x - bScaled + gp, p1.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p1.x - bScaled, p1.y - bScaled + gp); ctx.lineTo(p1.x, p1.y - bScaled + gp); ctx.stroke();
      }

      // c² square (purple, on hypotenuse)
      if (showProofRef.current) {
        fillRef.current = Math.min(1, fillRef.current + 0.01);
        const fill = fillRef.current;

        // c² square rotated along hypotenuse
        const hypAngle = Math.atan2(p3.y - p2.y, p3.x - p2.x);
        ctx.save();
        ctx.translate(p2.x, p2.y);
        ctx.rotate(hypAngle);

        ctx.fillStyle = `rgba(168, 85, 247, ${0.2 * fill})`;
        ctx.strokeStyle = `rgba(168, 85, 247, ${fill})`;
        ctx.lineWidth = 2;
        ctx.fillRect(0, 0, cScaled, cScaled);
        ctx.strokeRect(0, 0, cScaled, cScaled);

        ctx.fillStyle = `rgba(168, 85, 247, ${fill})`;
        ctx.font = 'bold 14px sans-serif';
        ctx.save();
        ctx.translate(cScaled / 2, cScaled / 2);
        ctx.rotate(-hypAngle);
        ctx.textAlign = 'center';
        ctx.fillText(`c² = ${Math.round(c * c)}`, 0, 5);
        ctx.restore();

        ctx.restore();
      }

      // Equation display
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 130, h - 50, 260, 42, 21);
      ctx.fill();

      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ef4444';
      ctx.fillText(`${a * a}`, w / 2 - 65, h - 24);
      ctx.fillStyle = 'white';
      ctx.fillText(' + ', w / 2 - 35, h - 24);
      ctx.fillStyle = '#3b82f6';
      ctx.fillText(`${b * b}`, w / 2 - 5, h - 24);
      ctx.fillStyle = 'white';
      ctx.fillText(' = ', w / 2 + 25, h - 24);
      ctx.fillStyle = '#a855f7';
      ctx.fillText(`${a * a + b * b}`, w / 2 + 60, h - 24);

      const check = a * a + b * b === Math.round(c * c);
      ctx.fillStyle = check ? '#22c55e' : '#fbbf24';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(check ? '✓' : '≈', w / 2 + 95, h - 24);

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[16/10] block" />;
}
