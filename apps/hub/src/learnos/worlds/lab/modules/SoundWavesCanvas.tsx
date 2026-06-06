import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SoundWavesCanvasProps {
  frequency: number; // 0.5-3
  amplitude: number; // 0.2-1
  isPlaying: boolean;
}

export default function SoundWavesCanvas({ frequency, amplitude, isPlaying }: SoundWavesCanvasProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const freqRef = useRef(frequency);
  const ampRef = useRef(amplitude);
  const playRef = useRef(isPlaying);
  const timeRef = useRef(0);

  useEffect(() => { freqRef.current = frequency; }, [frequency]);
  useEffect(() => { ampRef.current = amplitude; }, [amplitude]);
  useEffect(() => { playRef.current = isPlaying; }, [isPlaying]);

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

    // Air molecules
    const molecules: { baseX: number; baseY: number }[] = [];
    const cols = 25;
    const rows = 8;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        molecules.push({
          baseX: 30 + (c / (cols - 1)) * (w - 60),
          baseY: h * 0.25 + (r / (rows - 1)) * (h * 0.35),
        });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      if (playRef.current) timeRef.current += 0.05;
      const time = timeRef.current;
      const freq = freqRef.current;
      const amp = ampRef.current;

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 30) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }

      // Speaker icon on left
      ctx.fillStyle = '#64748b';
      ctx.fillRect(8, h * 0.35, 18, h * 0.15);
      ctx.beginPath();
      ctx.moveTo(26, h * 0.3);
      ctx.lineTo(26, h * 0.55);
      ctx.lineTo(45, h * 0.6);
      ctx.lineTo(45, h * 0.25);
      ctx.closePath();
      ctx.fillStyle = '#94a3b8';
      ctx.fill();

      // Speaker vibration rings
      if (playRef.current) {
        for (let r = 1; r <= 3; r++) {
          const ringR = 15 + r * 15 + Math.sin(time * 5) * 3;
          ctx.beginPath();
          ctx.arc(45, h * 0.425, ringR, -Math.PI * 0.3, Math.PI * 0.3);
          ctx.strokeStyle = `rgba(96, 165, 250, ${0.4 - r * 0.1})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Draw air molecules
      molecules.forEach(mol => {
        // Displacement based on wave
        const wavePhase = (mol.baseX / w) * Math.PI * 2 * freq * 3 - time * freq * 5;
        const displacement = Math.sin(wavePhase) * amp * 18;

        const x = mol.baseX + displacement;
        const y = mol.baseY;

        // Color based on compression
        const compression = Math.sin(wavePhase);
        const radius = 4 + compression * amp * 1.5;
        const alpha = 0.5 + compression * 0.3;

        // Molecule
        ctx.beginPath();
        ctx.arc(x, y, Math.max(2, radius), 0, Math.PI * 2);
        if (compression > 0.3) {
          ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`; // Compressed = red
        } else if (compression < -0.3) {
          ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.8})`; // Expanded = blue
        } else {
          ctx.fillStyle = `rgba(148, 163, 184, ${alpha * 0.6})`;
        }
        ctx.fill();
      });

      // Wave visualization (bottom)
      const waveY = h * 0.78;
      const waveH = h * 0.15 * amp;

      // Axis
      ctx.beginPath();
      ctx.moveTo(30, waveY);
      ctx.lineTo(w - 20, waveY);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Wave
      ctx.beginPath();
      for (let x = 30; x < w - 20; x++) {
        const phase = ((x - 30) / (w - 50)) * Math.PI * 2 * freq * 3 - time * freq * 5;
        const y = waveY - Math.sin(phase) * waveH;
        if (x === 30) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Amplitude label
      if (amp > 0.3) {
        ctx.beginPath();
        ctx.moveTo(50, waveY);
        ctx.lineTo(50, waveY - waveH);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Amplitude', 55, waveY - waveH / 2);
        ctx.fillText('(Volume)', 55, waveY - waveH / 2 + 12);
      }

      // Wavelength label
      const waveLength = (w - 50) / (freq * 3);
      if (waveLength > 30) {
        ctx.beginPath();
        ctx.moveTo(80, waveY + waveH + 15);
        ctx.lineTo(80 + waveLength, waveY + waveH + 15);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Arrows
        ctx.beginPath();
        ctx.moveTo(80, waveY + waveH + 10);
        ctx.lineTo(80, waveY + waveH + 20);
        ctx.moveTo(80 + waveLength, waveY + waveH + 10);
        ctx.lineTo(80 + waveLength, waveY + waveH + 20);
        ctx.stroke();
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Wavelength (Pitch)', 80 + waveLength / 2, waveY + waveH + 30);
      }

      // Labels
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 120, 8, 240, 50, 10);
      ctx.fill();
      
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔊 Sound = Vibrating Air Molecules', w / 2, 28);
      
      ctx.fillStyle = 'rgba(148,163,184,0.8)';
      ctx.font = '10px sans-serif';
      ctx.fillText('🔴 Compressed (bunched up)  🔵 Expanded (spread apart)', w / 2, 48);

      // Ear on right
      ctx.font = '35px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👂', w - 30, h * 0.43);

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[16/9] block" />;
}
