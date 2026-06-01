// src/worlds/physics/components/PrismDispersion.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function PrismDispersion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [angle, setAngle] = useState(60);
  const [wavelength, setWavelength] = useState(550);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Prism
    ctx.beginPath();
    ctx.moveTo(cx, cy - 80);
    ctx.lineTo(cx - 70, cy + 60);
    ctx.lineTo(cx + 70, cy + 60);
    ctx.closePath();
    ctx.fillStyle = 'rgba(100, 200, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.stroke();

    // White light beam
    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.moveTo(cx - 200, cy - 20);
    ctx.lineTo(cx - 70, cy);
    ctx.stroke();

    // Rainbow spectrum
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'];
    colors.forEach((color, i) => {
      const spread = (i - 3) * 15;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.moveTo(cx + 70, cy + spread * 0.5);
      ctx.lineTo(cx + 250, cy + spread * 2);
      ctx.stroke();
    });

    // Wavelength indicator
    const currentColor = wavelength > 620 ? '#ef4444' : wavelength > 580 ? '#f97316' : wavelength > 530 ? '#eab308' : wavelength > 470 ? '#22c55e' : wavelength > 440 ? '#06b6d4' : '#8b5cf6';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 60);
    ctx.fillStyle = currentColor;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`λ = ${wavelength} nm`, 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(wavelength > 600 ? 'Red (long λ, less refraction)' : wavelength < 450 ? 'Violet (short λ, more refraction)' : 'Green (middle of spectrum)', 20, 50);
    ctx.fillText('Different wavelengths bend differently!', 20, 65);
  }, [angle, wavelength]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

  const handleComplete = () => {
    const updated = completeModule(progress, 'prism-dispersion', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="prism-dispersion" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🌈 Prism & Dispersion</h2>
          <p className="text-sm text-gray-400">See how white light splits into a rainbow of colors!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Wavelength: {wavelength} nm</label><input type="range" min="400" max="700" value={wavelength} onChange={e => setWavelength(Number(e.target.value))} className="w-full accent-pink-500" /></div>
            <div><label className="text-sm text-gray-400">Prism Angle: {angle}°</label><input type="range" min="30" max="90" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full accent-pink-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Violet bends more than red</p>
              <p>🔥 Newton discovered this in 1666!</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
