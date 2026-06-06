import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface BloodCirculationCanvasProps {
  heartRate: number;
  isPlaying: boolean;
}

export default function BloodCirculationCanvas({ heartRate, isPlaying }: BloodCirculationCanvasProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const heartRateRef = useRef(heartRate);
  const isPlayingRef = useRef(isPlaying);
  const timeRef = useRef(0);

  useEffect(() => { heartRateRef.current = heartRate; }, [heartRate]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

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
    const cx = w / 2;

    // Path: Heart → Body → Heart → Lungs → Heart (loop)
    // Simplified path points
    const heartX = cx;
    const heartY = h * 0.45;

    // Blood cells
    const cellCount = 20;
    const cells: { progress: number }[] = [];
    for (let i = 0; i < cellCount; i++) cells.push({ progress: i / cellCount });

    // Path segments (progress 0-1 maps to full loop)
    // 0-0.25: heart→body (going down, red/oxygenated)
    // 0.25-0.5: body→heart (going up, blue/deoxygenated)
    // 0.5-0.75: heart→lungs (going up)
    // 0.75-1.0: lungs→heart (going down, back to red)
    const getPosition = (p: number): { x: number; y: number; oxygenated: boolean } => {
      const pp = ((p % 1) + 1) % 1;

      if (pp < 0.25) {
        // Heart → Body (right side, going down)
        const t = pp / 0.25;
        return {
          x: heartX + 60 + Math.sin(t * Math.PI) * 30,
          y: heartY + t * (h * 0.45),
          oxygenated: true,
        };
      } else if (pp < 0.5) {
        // Body → Heart (left side, going up)
        const t = (pp - 0.25) / 0.25;
        return {
          x: heartX - 60 - Math.sin(t * Math.PI) * 30,
          y: heartY + (1 - t) * (h * 0.45),
          oxygenated: false,
        };
      } else if (pp < 0.75) {
        // Heart → Lungs (going up, both sides)
        const t = (pp - 0.5) / 0.25;
        const side = t < 0.5 ? 1 : -1;
        const tt = t < 0.5 ? t * 2 : (t - 0.5) * 2;
        return {
          x: heartX + side * (40 + Math.sin(tt * Math.PI) * 40),
          y: heartY - tt * (h * 0.3),
          oxygenated: false,
        };
      } else {
        // Lungs → Heart (coming back down)
        const t = (pp - 0.75) / 0.25;
        return {
          x: heartX + Math.sin(t * Math.PI * 2) * 30,
          y: heartY - (1 - t) * (h * 0.3),
          oxygenated: true,
        };
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.016;
      const spd = heartRateRef.current / 60;

      // Background - body silhouette
      ctx.fillStyle = '#fce7f3';
      ctx.beginPath();
      ctx.ellipse(cx, h * 0.5, w * 0.4, h * 0.47, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lungs (top)
      const lungY = h * 0.2;
      // Left lung
      ctx.beginPath();
      ctx.ellipse(cx - 55, lungY, 40, 50, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = '#fda4af';
      ctx.fill();
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Right lung
      ctx.beginPath();
      ctx.ellipse(cx + 55, lungY, 40, 50, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Body (lower)
      ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
      ctx.beginPath();
      ctx.ellipse(cx, h * 0.75, w * 0.3, h * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Blood vessels (arteries red, veins blue)
      // Artery (right, going down) - oxygenated
      ctx.beginPath();
      ctx.moveTo(heartX + 20, heartY);
      ctx.quadraticCurveTo(heartX + 90, heartY + h * 0.2, heartX + 60, heartY + h * 0.45);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 14;
      ctx.stroke();
      ctx.strokeStyle = '#fecaca';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Vein (left, going up) - deoxygenated
      ctx.beginPath();
      ctx.moveTo(heartX - 60, heartY + h * 0.45);
      ctx.quadraticCurveTo(heartX - 90, heartY + h * 0.2, heartX - 20, heartY);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 14;
      ctx.stroke();
      ctx.strokeStyle = '#bfdbfe';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Pulmonary vessels
      ctx.beginPath();
      ctx.moveTo(heartX, heartY - 15);
      ctx.quadraticCurveTo(heartX - 60, heartY - h * 0.15, cx - 55, lungY + 30);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 10;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 55, lungY + 30);
      ctx.quadraticCurveTo(heartX + 60, heartY - h * 0.15, heartX, heartY - 15);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 10;
      ctx.stroke();

      // Heart
      const heartBeat = 1 + Math.sin(timeRef.current * 4 * spd) * 0.08;
      ctx.save();
      ctx.translate(heartX, heartY);
      ctx.scale(heartBeat, heartBeat);

      // Heart shape
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.bezierCurveTo(-25, -10, -25, -30, 0, -15);
      ctx.bezierCurveTo(25, -30, 25, -10, 0, 10);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Heart divider
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(0, 10);
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      // Blood cells
      cells.forEach(cell => {
        cell.progress += spd * 0.003;
        if (cell.progress > 1) cell.progress -= 1;
        const pos = getPosition(cell.progress);

        // RBC shape (red/blue based on oxygenation)
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
        if (pos.oxygenated) {
          ctx.fillStyle = '#ef4444';
        } else {
          ctx.fillStyle = '#3b82f6';
        }
        ctx.fill();

        // Inner dip (RBC shape)
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pos.oxygenated ? '#fca5a5' : '#93c5fd';
        ctx.fill();
      });

      // Labels
      if (isPlayingRef.current) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';

        // Heart
        ctx.fillText('❤️ Heart', heartX, heartY + 30);

        // Lungs
        ctx.fillText('🫁 Lungs', cx, lungY - 55);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.font = '9px sans-serif';
        ctx.fillText('(Pick up O₂, drop CO₂)', cx, lungY - 42);

        // Body
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('🦵 Body', cx, h * 0.88);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.font = '9px sans-serif';
        ctx.fillText('(Drop O₂, pick up CO₂)', cx, h * 0.91);

        // Artery label
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('🔴 Artery', heartX + 80, heartY + h * 0.15);
        ctx.font = '9px sans-serif';
        ctx.fillText('(O₂ rich)', heartX + 80, heartY + h * 0.15 + 13);

        // Vein label
        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('🔵 Vein', heartX - 80, heartY + h * 0.15);
        ctx.font = '9px sans-serif';
        ctx.fillText('(CO₂ rich)', heartX - 80, heartY + h * 0.15 + 13);
      }

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[3/4] sm:aspect-[4/5] block" />;
}
