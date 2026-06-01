import { useRef, useEffect } from 'react';

interface PiCanvasProps {
  precision: number;
  showUnwrap: boolean;
}

export default function PiCanvas({ precision, showUnwrap }: PiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const rollAngleRef = useRef(0);
  const showUnwrapRef = useRef(showUnwrap);
  const precisionRef = useRef(precision);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    showUnwrapRef.current = showUnwrap;
    if (showUnwrap) {
      hasCompletedRef.current = false;
      rollAngleRef.current = 0;
    }
  }, [showUnwrap]);

  useEffect(() => {
    precisionRef.current = precision;
  }, [precision]);

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

      const radius = precisionRef.current;
      const diameter = radius * 2;
      const circumference = Math.PI * diameter;

      // Ground line
      const groundY = h * 0.65;
      const lineStartX = 40;
      const lineEndX = w - 40;

      // Background grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 25) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += 25) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      // Draw the ground line
      ctx.beginPath();
      ctx.moveTo(lineStartX, groundY);
      ctx.lineTo(lineEndX, groundY);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Calculate circle position based on roll
      const rollProgress = rollAngleRef.current / (Math.PI * 2);
      const distanceTraveled = rollProgress * circumference;
      const circleX = lineStartX + radius + distanceTraveled;
      const circleY = groundY - radius;

      // Circumference track (the colored line showing distance traveled)
      if (distanceTraveled > 0) {
        // Gradient for the traveled distance
        const trackGrad = ctx.createLinearGradient(lineStartX, groundY, lineStartX + distanceTraveled, groundY);
        trackGrad.addColorStop(0, '#f59e0b');
        trackGrad.addColorStop(1, '#fbbf24');
        
        ctx.beginPath();
        ctx.moveTo(lineStartX, groundY);
        ctx.lineTo(lineStartX + Math.min(distanceTraveled, circumference), groundY);
        ctx.strokeStyle = trackGrad;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.lineCap = 'butt';

        // Distance markers
        for (let d = 0; d <= distanceTraveled && d <= circumference; d += diameter) {
          if (d > 0) {
            ctx.beginPath();
            ctx.moveTo(lineStartX + d, groundY - 8);
            ctx.lineTo(lineStartX + d, groundY + 8);
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label showing diameter count
            const count = d / diameter;
            ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${count}d`, lineStartX + d, groundY + 22);
          }
        }
      }

      // Draw circle
      ctx.save();
      ctx.translate(circleX, circleY);
      ctx.rotate(rollAngleRef.current);

      // Circle fill with gradient
      const circleGrad = ctx.createRadialGradient(-radius * 0.2, -radius * 0.2, 0, 0, 0, radius);
      circleGrad.addColorStop(0, '#60a5fa');
      circleGrad.addColorStop(0.7, '#3b82f6');
      circleGrad.addColorStop(1, '#2563eb');
      
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = circleGrad;
      ctx.fill();

      // Circle border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Diameter line inside circle
      ctx.beginPath();
      ctx.moveTo(-radius + 4, 0);
      ctx.lineTo(radius - 4, 0);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Reference dot on edge (to show rotation)
      ctx.beginPath();
      ctx.arc(radius - 3, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();

      // Center dot
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      ctx.restore();

      // Draw diameter bracket below circle start position
      const bracketY = groundY + 40;
      const bracketStartX = lineStartX;
      const bracketEndX = lineStartX + diameter;

      ctx.beginPath();
      ctx.moveTo(bracketStartX, bracketY - 5);
      ctx.lineTo(bracketStartX, bracketY);
      ctx.lineTo(bracketEndX, bracketY);
      ctx.lineTo(bracketEndX, bracketY - 5);
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('diameter (d)', (bracketStartX + bracketEndX) / 2, bracketY + 15);

      // Pi calculation display
      if (rollProgress > 0) {
        const displayedCircumference = Math.min(distanceTraveled, circumference);
        const ratio = displayedCircumference / diameter;

        // Info box
        const boxX = w - 160;
        const boxY = 20;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, 140, 90, 10);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Circumference ÷ Diameter', boxX + 10, boxY + 18);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(ratio.toFixed(4), boxX + 10, boxY + 50);

        if (rollProgress >= 1 && !hasCompletedRef.current) {
          ctx.fillStyle = '#22c55e';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('= π ✓', boxX + 95, boxY + 50);
          
          hasCompletedRef.current = true;
        }

        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = '9px sans-serif';
        ctx.fillText(`C: ${displayedCircumference.toFixed(1)}px`, boxX + 10, boxY + 70);
        ctx.fillText(`d: ${diameter.toFixed(1)}px`, boxX + 70, boxY + 70);
      }

      // Title hint
      if (rollProgress === 0) {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Click "Roll" to see π in action', w / 2, h - 20);
      }

      // Roll animation
      if (showUnwrapRef.current && rollAngleRef.current < Math.PI * 2) {
        rollAngleRef.current += 0.02;
        if (rollAngleRef.current >= Math.PI * 2) {
          rollAngleRef.current = Math.PI * 2;
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [showUnwrap]);

  return <canvas ref={canvasRef} className="w-full aspect-[16/9] block" />;
}
