import { useRef, useEffect } from 'react';

interface HabitatsCanvasProps {
  habitat: 'forest' | 'ocean' | 'desert' | 'arctic';
}

export default function HabitatsCanvas({ habitat }: HabitatsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const habitatRef = useRef(habitat);
  const animRef = useRef(0);

  useEffect(() => { habitatRef.current = habitat; }, [habitat]);

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
      animRef.current += 0.01;
      const hab = habitatRef.current;

      if (hab === 'forest') {
        // Sky
        const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
        sky.addColorStop(0, '#7dd3fc');
        sky.addColorStop(1, '#bae6fd');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h * 0.6);
        // Sun
        ctx.beginPath();
        ctx.arc(w - 60, 50, 30, 0, Math.PI * 2);
        ctx.fillStyle = '#fde047';
        ctx.fill();
        // Ground
        ctx.fillStyle = '#4d7c0f';
        ctx.fillRect(0, h * 0.6, w, h * 0.4);
        // Trees
        for (let i = 0; i < 5; i++) {
          const tx = 60 + i * (w - 120) / 4;
          const th = 80 + Math.sin(i * 2) * 20;
          const sway = Math.sin(animRef.current * 2 + i) * 3;
          // Trunk
          ctx.fillStyle = '#78350f';
          ctx.fillRect(tx - 8, h * 0.6 - th + 30, 16, th - 30);
          // Canopy
          ctx.beginPath();
          ctx.arc(tx + sway, h * 0.6 - th + 20, 35, 0, Math.PI * 2);
          ctx.fillStyle = '#22c55e';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(tx - 20 + sway, h * 0.6 - th + 40, 25, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(tx + 20 + sway, h * 0.6 - th + 40, 25, 0, Math.PI * 2);
          ctx.fill();
        }
        // Animals
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🦊', w * 0.2, h * 0.75);
        ctx.fillText('🐿️', w * 0.45, h * 0.68);
        ctx.fillText('🦌', w * 0.7, h * 0.72);
        ctx.fillText('🐦', w * 0.35 + Math.sin(animRef.current * 3) * 20, h * 0.3);
        ctx.fillText('🦉', w * 0.6, h * 0.35);
        ctx.fillText('🐻', w * 0.85, h * 0.78);

      } else if (hab === 'ocean') {
        // Sky
        ctx.fillStyle = '#7dd3fc';
        ctx.fillRect(0, 0, w, h * 0.3);
        // Water
        const waterGrad = ctx.createLinearGradient(0, h * 0.3, 0, h);
        waterGrad.addColorStop(0, '#38bdf8');
        waterGrad.addColorStop(0.3, '#0ea5e9');
        waterGrad.addColorStop(0.7, '#0369a1');
        waterGrad.addColorStop(1, '#0c4a6e');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, h * 0.3, w, h * 0.7);
        // Waves
        ctx.beginPath();
        for (let x = 0; x < w; x += 10) {
          const waveY = h * 0.3 + Math.sin(animRef.current * 3 + x * 0.03) * 5;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.lineTo(w, h * 0.35);
        ctx.lineTo(0, h * 0.35);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fill();
        // Sun
        ctx.beginPath();
        ctx.arc(w - 50, 40, 25, 0, Math.PI * 2);
        ctx.fillStyle = '#fde047';
        ctx.fill();
        // Coral
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(w * 0.3, h);
        ctx.quadraticCurveTo(w * 0.3 - 10, h - 50, w * 0.3 - 20, h - 30);
        ctx.quadraticCurveTo(w * 0.3, h - 60, w * 0.3 + 20, h - 30);
        ctx.quadraticCurveTo(w * 0.3 + 10, h - 50, w * 0.3, h);
        ctx.fill();
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(w * 0.6, h - 30, 20, 0, Math.PI * 2);
        ctx.arc(w * 0.6 + 15, h - 20, 15, 0, Math.PI * 2);
        ctx.fill();
        // Seaweed
        for (let sx = 0; sx < 4; sx++) {
          const seaX = w * 0.1 + sx * w * 0.25;
          ctx.beginPath();
          ctx.moveTo(seaX, h);
          for (let sy = 0; sy < 6; sy++) {
            const sway = Math.sin(animRef.current * 2 + sy * 0.5 + sx) * 15;
            ctx.lineTo(seaX + sway, h - sy * 15);
          }
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
        // Animals
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        const fishX = (w * 0.3 + animRef.current * 30) % (w + 50) - 25;
        ctx.fillText('🐠', fishX, h * 0.5);
        ctx.fillText('🐙', w * 0.7, h * 0.7);
        ctx.fillText('🐢', w * 0.5 + Math.sin(animRef.current) * 30, h * 0.45);
        ctx.fillText('🦈', w * 0.2, h * 0.6);
        ctx.fillText('🐬', w * 0.6 + Math.cos(animRef.current * 2) * 20, h * 0.35);
        ctx.fillText('🐚', w * 0.8, h * 0.9);

      } else if (hab === 'desert') {
        // Sky
        const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
        sky.addColorStop(0, '#fbbf24');
        sky.addColorStop(1, '#fde68a');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h * 0.6);
        // Hot sun
        ctx.beginPath();
        ctx.arc(w / 2, 60, 45, 0, Math.PI * 2);
        ctx.fillStyle = '#fef9c3';
        ctx.fill();
        for (let r = 0; r < 8; r++) {
          const angle = (r / 8) * Math.PI * 2 + animRef.current;
          ctx.beginPath();
          ctx.moveTo(w / 2 + Math.cos(angle) * 50, 60 + Math.sin(angle) * 50);
          ctx.lineTo(w / 2 + Math.cos(angle) * 70, 60 + Math.sin(angle) * 70);
          ctx.strokeStyle = 'rgba(253,224,71,0.5)';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        // Sand
        const sand = ctx.createLinearGradient(0, h * 0.6, 0, h);
        sand.addColorStop(0, '#fde68a');
        sand.addColorStop(1, '#d97706');
        ctx.fillStyle = sand;
        ctx.fillRect(0, h * 0.6, w, h * 0.4);
        // Sand dunes
        ctx.beginPath();
        ctx.moveTo(0, h * 0.65);
        ctx.quadraticCurveTo(w * 0.3, h * 0.55, w * 0.5, h * 0.63);
        ctx.quadraticCurveTo(w * 0.7, h * 0.58, w, h * 0.62);
        ctx.lineTo(w, h * 0.65);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        // Cacti
        ctx.fillStyle = '#22c55e';
        const drawCactus = (cx: number, ch: number) => {
          ctx.fillRect(cx - 10, h * 0.6 - ch, 20, ch);
          ctx.fillRect(cx - 30, h * 0.6 - ch * 0.7, 20, 8);
          ctx.fillRect(cx - 30, h * 0.6 - ch * 0.7, 8, 25);
          ctx.fillRect(cx + 10, h * 0.6 - ch * 0.5, 20, 8);
          ctx.fillRect(cx + 22, h * 0.6 - ch * 0.5, 8, 25);
        };
        drawCactus(w * 0.2, 70);
        drawCactus(w * 0.7, 55);
        // Animals
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🦎', w * 0.4, h * 0.75);
        ctx.fillText('🐪', w * 0.6, h * 0.72);
        ctx.fillText('🦂', w * 0.3, h * 0.85);
        ctx.fillText('🦅', w * 0.5 + Math.sin(animRef.current) * 40, h * 0.2);
        ctx.fillText('🐍', w * 0.8, h * 0.8);

      } else if (hab === 'arctic') {
        // Sky
        const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
        sky.addColorStop(0, '#c7d2fe');
        sky.addColorStop(1, '#e0e7ff');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h * 0.5);
        // Aurora
        ctx.save();
        ctx.globalAlpha = 0.2;
        for (let a = 0; a < 3; a++) {
          ctx.beginPath();
          ctx.moveTo(w * 0.1, 30 + a * 15);
          ctx.quadraticCurveTo(w * 0.3, 10 + Math.sin(animRef.current + a) * 15, w * 0.5, 25 + a * 10);
          ctx.quadraticCurveTo(w * 0.7, 15 + Math.cos(animRef.current + a) * 15, w * 0.9, 30 + a * 15);
          ctx.strokeStyle = a === 0 ? '#22c55e' : a === 1 ? '#3b82f6' : '#a855f7';
          ctx.lineWidth = 8;
          ctx.stroke();
        }
        ctx.restore();
        // Snow ground
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, h * 0.5, w, h * 0.5);
        // Ice
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.5);
        ctx.lineTo(w * 0.3, h * 0.48);
        ctx.lineTo(w * 0.4, h * 0.52);
        ctx.lineTo(w * 0.6, h * 0.47);
        ctx.lineTo(w * 0.8, h * 0.51);
        ctx.lineTo(w, h * 0.5);
        ctx.lineTo(w, h * 0.55);
        ctx.lineTo(0, h * 0.55);
        ctx.fill();
        // Icebergs
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath();
        ctx.moveTo(w * 0.15, h * 0.5);
        ctx.lineTo(w * 0.2, h * 0.35);
        ctx.lineTo(w * 0.28, h * 0.5);
        ctx.fill();
        ctx.fillStyle = '#93c5fd';
        ctx.beginPath();
        ctx.moveTo(w * 0.65, h * 0.5);
        ctx.lineTo(w * 0.72, h * 0.3);
        ctx.lineTo(w * 0.8, h * 0.5);
        ctx.fill();
        // Snowflakes
        for (let s = 0; s < 15; s++) {
          const sx = (s * w / 15 + animRef.current * 20) % w;
          const sy = (s * 37 + animRef.current * 30) % (h * 0.5);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        // Animals
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🐧', w * 0.3, h * 0.7);
        ctx.fillText('🐻‍❄️', w * 0.55, h * 0.68);
        ctx.fillText('🦭', w * 0.8, h * 0.75);
        ctx.fillText('🐳', w * 0.15, h * 0.9);
        ctx.fillText('🦌', w * 0.7, h * 0.85);
      }

      // Label
      const habNames: Record<string, string> = { forest: '🌳 FOREST', ocean: '🌊 OCEAN', desert: '🏜️ DESERT', arctic: '❄️ ARCTIC' };
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.roundRect(10, 10, 100, 30, 15);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(habNames[hab], 20, 30);

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[16/10] block" />;
}
