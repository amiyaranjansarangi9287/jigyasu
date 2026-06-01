import { useRef, useEffect } from 'react';

interface MagnetsCanvasProps {
  magnet1Pole: 'N' | 'S';
  magnet2Pole: 'N' | 'S';
  distance: number;
}

export default function MagnetsCanvas({ magnet1Pole, magnet2Pole, distance }: MagnetsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number }[]>([]);
  const magnet1PoleRef = useRef(magnet1Pole);
  const magnet2PoleRef = useRef(magnet2Pole);
  const distanceRef = useRef(distance);
  const animOffsetRef = useRef(0);

  useEffect(() => {
    magnet1PoleRef.current = magnet1Pole;
  }, [magnet1Pole]);

  useEffect(() => {
    magnet2PoleRef.current = magnet2Pole;
  }, [magnet2Pole]);

  useEffect(() => {
    distanceRef.current = distance;
  }, [distance]);

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
    const centerY = h / 2;

    const drawMagnet = (x: number, y: number, leftPole: 'N' | 'S', isShaking: boolean) => {
      const magnetW = 80;
      const magnetH = 50;
      const shakeX = isShaking ? Math.sin(Date.now() * 0.02) * 3 : 0;
      
      ctx.save();
      ctx.translate(x + shakeX, y);

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.roundRect(-magnetW/2 + 4, -magnetH/2 + 4, magnetW, magnetH, 8);
      ctx.fill();

      // Left half (first pole)
      const leftColor = leftPole === 'N' ? '#ef4444' : '#3b82f6';
      const leftGrad = ctx.createLinearGradient(-magnetW/2, 0, 0, 0);
      leftGrad.addColorStop(0, leftPole === 'N' ? '#fca5a5' : '#93c5fd');
      leftGrad.addColorStop(1, leftColor);
      
      ctx.beginPath();
      ctx.roundRect(-magnetW/2, -magnetH/2, magnetW/2, magnetH, [8, 0, 0, 8]);
      ctx.fillStyle = leftGrad;
      ctx.fill();

      // Right half (opposite pole)
      const rightPole = leftPole === 'N' ? 'S' : 'N';
      const rightColor = rightPole === 'N' ? '#ef4444' : '#3b82f6';
      const rightGrad = ctx.createLinearGradient(0, 0, magnetW/2, 0);
      rightGrad.addColorStop(0, rightColor);
      rightGrad.addColorStop(1, rightPole === 'N' ? '#fca5a5' : '#93c5fd');
      
      ctx.beginPath();
      ctx.roundRect(0, -magnetH/2, magnetW/2, magnetH, [0, 8, 8, 0]);
      ctx.fillStyle = rightGrad;
      ctx.fill();

      // Divider line
      ctx.beginPath();
      ctx.moveTo(0, -magnetH/2);
      ctx.lineTo(0, magnetH/2);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pole labels
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(leftPole, -magnetW/4, 0);
      ctx.fillText(rightPole, magnetW/4, 0);

      // Shine effect
      ctx.beginPath();
      ctx.roundRect(-magnetW/2 + 5, -magnetH/2 + 5, magnetW - 10, 8, 4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();

      ctx.restore();
    };

    const drawFieldLines = (x1: number, x2: number, y: number, attract: boolean) => {
      const midX = (x1 + x2) / 2;
      const gap = x2 - x1;
      
      ctx.save();
      animOffsetRef.current += attract ? 0.02 : -0.02;
      
      for (let i = -2; i <= 2; i++) {
        const yOffset = i * 18;
        const lineY = y + yOffset;
        
        if (attract) {
          // Attracting - lines connect the magnets
          ctx.beginPath();
          ctx.moveTo(x1 + 40, lineY);
          
          // Curved line connecting them
          const controlY = lineY + (Math.abs(i) * 15 * Math.sign(i));
          ctx.quadraticCurveTo(midX, controlY, x2 - 40, lineY);
          
          // Animated dashes
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 8]);
          ctx.lineDashOffset = -animOffsetRef.current * 50;
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Arrow in middle pointing toward center
          const arrowX = midX;
          const arrowY = lineY + (Math.abs(i) * 8 * Math.sign(i)) * 0.5;
          ctx.beginPath();
          ctx.moveTo(arrowX - 5, arrowY - 4);
          ctx.lineTo(arrowX, arrowY);
          ctx.lineTo(arrowX - 5, arrowY + 4);
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          // Repelling - lines push away from center
          const pushAmount = Math.max(0, 50 - gap * 0.3);
          
          // Left side lines curving away
          ctx.beginPath();
          ctx.moveTo(x1 + 40, lineY);
          ctx.quadraticCurveTo(x1 + 60, lineY + i * 8, x1 + 50 - pushAmount * 0.3, lineY + i * 20);
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.5)';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.lineDashOffset = animOffsetRef.current * 50;
          ctx.stroke();
          
          // Right side lines curving away
          ctx.beginPath();
          ctx.moveTo(x2 - 40, lineY);
          ctx.quadraticCurveTo(x2 - 60, lineY + i * 8, x2 - 50 + pushAmount * 0.3, lineY + i * 20);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Background
      const bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.6);
      bgGrad.addColorStop(0, '#1e293b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 30) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += 30) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      const dist = distanceRef.current;
      const magnet1X = w / 2 - dist / 2 - 40;
      const magnet2X = w / 2 + dist / 2 + 40;
      
      // Determine if attracting or repelling
      // Magnet 1 shows its RIGHT pole to magnet 2
      // Magnet 2 shows its LEFT pole to magnet 1
      const m1RightPole = magnet1PoleRef.current === 'N' ? 'S' : 'N';
      const m2LeftPole = magnet2PoleRef.current;
      const isAttracting = m1RightPole !== m2LeftPole;
      const isClose = dist < 120;

      // Draw field lines
      drawFieldLines(magnet1X, magnet2X, centerY, isAttracting);

      // Draw magnets
      drawMagnet(magnet1X, centerY, magnet1PoleRef.current, !isAttracting && isClose);
      drawMagnet(magnet2X, centerY, magnet2PoleRef.current, !isAttracting && isClose);

      // Interaction indicator
      const indicatorY = centerY + 80;
      if (isAttracting) {
        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💜 ATTRACT!', w / 2, indicatorY);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';
        ctx.font = '12px sans-serif';
        ctx.fillText('Opposites attract — they want to stick together!', w / 2, indicatorY + 20);
        
        // Pull arrows
        ctx.fillStyle = '#a855f7';
        ctx.font = '20px sans-serif';
        ctx.fillText('→', magnet1X + 60, centerY);
        ctx.fillText('←', magnet2X - 60, centerY);
      } else {
        ctx.fillStyle = '#fb923c';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🧡 REPEL!', w / 2, indicatorY);
        ctx.fillStyle = 'rgba(251, 146, 60, 0.6)';
        ctx.font = '12px sans-serif';
        ctx.fillText('Same poles push away — they refuse to touch!', w / 2, indicatorY + 20);
        
        // Push arrows
        ctx.fillStyle = '#fb923c';
        ctx.font = '20px sans-serif';
        ctx.fillText('←', magnet1X + 60, centerY);
        ctx.fillText('→', magnet2X - 60, centerY);
      }

      // Spawn particles for visual effect
      if (Math.random() < 0.1) {
        const midX = (magnet1X + magnet2X) / 2;
        particlesRef.current.push({
          x: midX + (Math.random() - 0.5) * 50,
          y: centerY + (Math.random() - 0.5) * 60,
          vx: isAttracting ? 0 : (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 1,
          life: 1,
        });
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = isAttracting 
          ? `rgba(168, 85, 247, ${p.life * 0.5})`
          : `rgba(251, 146, 60, ${p.life * 0.5})`;
        ctx.fill();
      }

      // Legend
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('N = North Pole', 15, 25);
      ctx.fillStyle = '#3b82f6';
      ctx.fillText('S = South Pole', 15, 45);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[16/10] block" />;
}
