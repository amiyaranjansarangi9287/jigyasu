import { useRef, useEffect } from 'react';

interface NumberLineCanvasProps {
  position: number;
  targetPosition: number;
  showJumps: boolean;
}

export default function NumberLineCanvas({ position, targetPosition, showJumps }: NumberLineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const posRef = useRef(position);
  const targetRef = useRef(targetPosition);
  const showJumpsRef = useRef(showJumps);
  const personYRef = useRef(0);

  useEffect(() => { targetRef.current = targetPosition; }, [targetPosition]);
  useEffect(() => { showJumpsRef.current = showJumps; }, [showJumps]);

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
    const lineY = h * 0.65;
    const unitWidth = Math.min(45, (w - 80) / 20);

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Sky/ground
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#e0f2fe');
      skyGrad.addColorStop(0.6, '#bae6fd');
      skyGrad.addColorStop(0.65, '#86efac');
      skyGrad.addColorStop(1, '#4ade80');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(w * 0.2, 30, 20, 0, Math.PI * 2);
      ctx.arc(w * 0.2 + 18, 25, 15, 0, Math.PI * 2);
      ctx.arc(w * 0.2 + 35, 30, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w * 0.7, 45, 15, 0, Math.PI * 2);
      ctx.arc(w * 0.7 + 15, 40, 12, 0, Math.PI * 2);
      ctx.fill();

      // Animate position toward target
      const diff = targetRef.current - posRef.current;
      posRef.current += diff * 0.06;

      // Bounce animation
      const isMoving = Math.abs(diff) > 0.1;
      if (isMoving) {
        personYRef.current = Math.abs(Math.sin(Date.now() * 0.01)) * 8;
      } else {
        personYRef.current *= 0.9;
      }

      const centerX = w / 2;

      // Number line
      ctx.beginPath();
      ctx.moveTo(20, lineY);
      ctx.lineTo(w - 20, lineY);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Arrow heads
      ctx.beginPath();
      ctx.moveTo(20, lineY);
      ctx.lineTo(30, lineY - 8);
      ctx.moveTo(20, lineY);
      ctx.lineTo(30, lineY + 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w - 20, lineY);
      ctx.lineTo(w - 30, lineY - 8);
      ctx.moveTo(w - 20, lineY);
      ctx.lineTo(w - 30, lineY + 8);
      ctx.stroke();

      // Tick marks and numbers
      for (let n = -10; n <= 10; n++) {
        const tickX = centerX + n * unitWidth;
        if (tickX < 30 || tickX > w - 30) continue;

        const isZero = n === 0;
        const isNegative = n < 0;
        const isCurrentPos = Math.abs(n - Math.round(posRef.current)) < 0.5;

        // Tick mark
        ctx.beginPath();
        ctx.moveTo(tickX, lineY - (isZero ? 15 : 10));
        ctx.lineTo(tickX, lineY + (isZero ? 15 : 10));
        ctx.strokeStyle = isCurrentPos ? '#fbbf24' : isZero ? '#1e293b' : isNegative ? '#3b82f6' : '#22c55e';
        ctx.lineWidth = isZero ? 3 : isCurrentPos ? 3 : 2;
        ctx.stroke();

        // Number label
        ctx.fillStyle = isCurrentPos ? '#fbbf24' : isZero ? '#1e293b' : isNegative ? '#3b82f6' : '#22c55e';
        ctx.font = isZero || isCurrentPos ? 'bold 16px sans-serif' : 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.toString(), tickX, lineY + 30);

        // Color zone
        if (isNegative) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
          ctx.fillRect(tickX, lineY - 40, unitWidth, 80);
        }
      }

      // Zero label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ZERO', centerX, lineY + 45);

      // Negative / Positive labels
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('← NEGATIVE', 35, lineY - 25);

      ctx.fillStyle = '#22c55e';
      ctx.textAlign = 'right';
      ctx.fillText('POSITIVE →', w - 35, lineY - 25);

      // Jump arcs
      if (showJumpsRef.current && Math.abs(diff) > 0.5) {
        const jumpDir = diff > 0 ? 1 : -1;
        const startN = Math.round(posRef.current);
        const endN = Math.round(targetRef.current);
        const steps = Math.abs(endN - startN);

        for (let i = 0; i < steps; i++) {
          const fromN = startN + i * jumpDir;
          const toN = fromN + jumpDir;
          const fromX = centerX + fromN * unitWidth;
          const toX = centerX + toN * unitWidth;
          const midX = (fromX + toX) / 2;
          const arcHeight = 25;

          const progress = Math.min(1, (posRef.current - position) / (targetRef.current - position));
          const arcAlpha = i / steps < progress ? 0.8 : 0.3;

          ctx.beginPath();
          ctx.moveTo(fromX, lineY - 12);
          ctx.quadraticCurveTo(midX, lineY - 12 - arcHeight, toX, lineY - 12);
          ctx.strokeStyle = jumpDir > 0 ? `rgba(34, 197, 94, ${arcAlpha})` : `rgba(59, 130, 246, ${arcAlpha})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Arrow on arc
          if (i / steps < progress) {
            ctx.fillStyle = jumpDir > 0 ? '#22c55e' : '#3b82f6';
            ctx.beginPath();
            ctx.moveTo(toX + jumpDir * 2, lineY - 15);
            ctx.lineTo(toX - jumpDir * 5, lineY - 20);
            ctx.lineTo(toX - jumpDir * 5, lineY - 10);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      // Person emoji
      const personX = centerX + posRef.current * unitWidth;
      const personY = lineY - 55 - personYRef.current;

      // Direction the person faces
      const facingRight = diff >= 0;

      ctx.save();
      ctx.translate(personX, personY);
      if (!facingRight) ctx.scale(-1, 1);

      // Body
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, -15, 12, 0, Math.PI * 2); // Head
      ctx.fill();

      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(-8, -3, 16, 20); // Body

      // Legs
      ctx.fillStyle = '#1e293b';
      if (isMoving) {
        const legAngle = Math.sin(Date.now() * 0.01) * 0.4;
        ctx.save();
        ctx.translate(-4, 17);
        ctx.rotate(legAngle);
        ctx.fillRect(-3, 0, 6, 15);
        ctx.restore();
        ctx.save();
        ctx.translate(4, 17);
        ctx.rotate(-legAngle);
        ctx.fillRect(-3, 0, 6, 15);
        ctx.restore();
      } else {
        ctx.fillRect(-7, 17, 6, 15);
        ctx.fillRect(1, 17, 6, 15);
      }

      // Eyes
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(3, -17, 2, 0, Math.PI * 2);
      ctx.arc(-3, -17, 2, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.beginPath();
      ctx.arc(0, -13, 5, 0.1, Math.PI - 0.1);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // Position badge
      const roundedPos = Math.round(posRef.current * 10) / 10;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.roundRect(personX - 25, personY - 50, 50, 25, 12);
      ctx.fill();
      ctx.fillStyle = roundedPos < 0 ? '#60a5fa' : roundedPos > 0 ? '#4ade80' : 'white';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(roundedPos.toString(), personX, personY - 33);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [position]);

  return <canvas ref={canvasRef} className="w-full aspect-[16/9] block" />;
}
