import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface FractionsCanvasProps {
  numerator: number;
  denominator: number;
}

export default function FractionsCanvas({ numerator, denominator }: FractionsCanvasProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const animationRef = useRef({ currentNumerator: 0, targetNumerator: numerator });
  const numeratorRef = useRef(numerator);
  const denominatorRef = useRef(denominator);

  useEffect(() => {
    animationRef.current.targetNumerator = numerator;
    numeratorRef.current = numerator;
  }, [numerator]);

  useEffect(() => {
    denominatorRef.current = denominator;
    animationRef.current.currentNumerator = 0;
    animationRef.current.targetNumerator = numeratorRef.current;
  }, [denominator]);

  useEffect(() => {
    denominatorRef.current = denominator;
  }, [denominator]);

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

    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(w, h) * 0.32;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      const totalDenominator = denominatorRef.current;
      const targetNumerator = animationRef.current.targetNumerator;
      
      // Smooth animation
      const diff = targetNumerator - animationRef.current.currentNumerator;
      animationRef.current.currentNumerator += diff * 0.08;
      const currentNumerator = animationRef.current.currentNumerator;

      // Background plate
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
      const plateGrad = ctx.createRadialGradient(centerX - 20, centerY - 20, 0, centerX, centerY, radius + 20);
      plateGrad.addColorStop(0, '#f8fafc');
      plateGrad.addColorStop(0.8, '#e2e8f0');
      plateGrad.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = plateGrad;
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw pizza base
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      const pizzaGrad = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, 0, centerX, centerY, radius);
      pizzaGrad.addColorStop(0, '#fde68a');
      pizzaGrad.addColorStop(0.7, '#fbbf24');
      pizzaGrad.addColorStop(1, '#d97706');
      ctx.fillStyle = pizzaGrad;
      ctx.fill();

      // Crust edge
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Draw toppings (pepperoni circles)
      const toppingPositions = [
        { x: -0.3, y: -0.4 }, { x: 0.35, y: -0.25 }, { x: 0.1, y: 0.4 },
        { x: -0.4, y: 0.2 }, { x: 0.4, y: 0.35 }, { x: -0.15, y: -0.1 },
        { x: 0.25, y: 0.1 }, { x: -0.25, y: 0.45 }, { x: 0.05, y: -0.35 },
      ];
      
      toppingPositions.forEach(pos => {
        const tx = centerX + pos.x * radius * 0.8;
        const ty = centerY + pos.y * radius * 0.8;
        
        ctx.beginPath();
        ctx.arc(tx, ty, 12, 0, Math.PI * 2);
        const pepGrad = ctx.createRadialGradient(tx - 2, ty - 2, 0, tx, ty, 12);
        pepGrad.addColorStop(0, '#ef4444');
        pepGrad.addColorStop(0.7, '#dc2626');
        pepGrad.addColorStop(1, '#991b1b');
        ctx.fillStyle = pepGrad;
        ctx.fill();
      });

      // Draw slice lines
      const sliceAngle = (Math.PI * 2) / totalDenominator;
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < totalDenominator; i++) {
        const angle = i * sliceAngle - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        );
        ctx.stroke();
      }

      // Draw taken slices (lifted out)
      for (let i = 0; i < Math.ceil(currentNumerator); i++) {
        const progress = Math.min(1, currentNumerator - i);
        const angle1 = i * sliceAngle - Math.PI / 2;
        const angle2 = (i + 1) * sliceAngle - Math.PI / 2;
        
        // Calculate slice center for lift animation
        const midAngle = (angle1 + angle2) / 2;
        const liftDistance = 30 * progress;
        const offsetX = Math.cos(midAngle) * liftDistance;
        const offsetY = Math.sin(midAngle) * liftDistance;

        // Shadow for lifted slice
        ctx.save();
        ctx.globalAlpha = 0.2 * progress;
        ctx.beginPath();
        ctx.moveTo(centerX + offsetX + 5, centerY + offsetY + 5);
        ctx.arc(centerX + offsetX + 5, centerY + offsetY + 5, radius, angle1, angle2);
        ctx.closePath();
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.restore();

        // Lifted slice
        ctx.save();
        ctx.globalAlpha = progress;
        
        // Slice base
        ctx.beginPath();
        ctx.moveTo(centerX + offsetX, centerY + offsetY);
        ctx.arc(centerX + offsetX, centerY + offsetY, radius, angle1, angle2);
        ctx.closePath();
        
        const sliceGrad = ctx.createRadialGradient(
          centerX + offsetX - radius * 0.2, 
          centerY + offsetY - radius * 0.2, 
          0, 
          centerX + offsetX, 
          centerY + offsetY, 
          radius
        );
        sliceGrad.addColorStop(0, '#fef3c7');
        sliceGrad.addColorStop(0.7, '#fcd34d');
        sliceGrad.addColorStop(1, '#f59e0b');
        ctx.fillStyle = sliceGrad;
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Toppings on lifted slice
        toppingPositions.forEach(pos => {
          const tx = pos.x * radius * 0.8;
          const ty = pos.y * radius * 0.8;
          const tAngle = Math.atan2(ty, tx);
          
          if (tAngle >= angle1 && tAngle < angle2) {
            const ttx = centerX + offsetX + tx;
            const tty = centerY + offsetY + ty;
            ctx.beginPath();
            ctx.arc(ttx, tty, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#dc2626';
            ctx.fill();
          }
        });

        ctx.restore();

        // Highlight the removed area
        ctx.save();
        ctx.globalAlpha = 0.3 * progress;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle1, angle2);
        ctx.closePath();
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.restore();
      }

      // Labels
      if (denominatorRef.current) {
        const displayNumerator = Math.round(currentNumerator);
        const remaining = totalDenominator - displayNumerator;

        // Taken label
        if (displayNumerator > 0) {
          ctx.fillStyle = '#22c55e';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${displayNumerator} taken`, w - 70, 40);
        }

        // Remaining label  
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${remaining} left`, 70, 40);

        // Fraction display
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${displayNumerator}/${totalDenominator}`, centerX, h - 25);
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.fillText('of the pizza', centerX, h - 8);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[4/3] block" />;
}
