// src/worlds/physics/components/InterferencePatterns.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';
import { useTranslation } from 'react-i18next';

export default function InterferencePatterns() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [slitDist, setSlitDist] = useState(30);
  const [wavelength, setWavelength] = useState(20);
  const [time, setTime] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Barrier with slits
    const barrierX = 100;
    ctx.fillStyle = '#374151';
    ctx.fillRect(barrierX - 5, 0, 10, h);
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(barrierX - 5, h / 2 - slitDist - 5, 10, 10);
    ctx.fillRect(barrierX - 5, h / 2 + slitDist - 5, 10, 10);

    // Interference pattern on screen
    const screenX = w - 100;
    for (let y = 0; y < h; y += 2) {
      const d1 = Math.sqrt((screenX - barrierX) ** 2 + (y - (h / 2 - slitDist)) ** 2);
      const d2 = Math.sqrt((screenX - barrierX) ** 2 + (y - (h / 2 + slitDist)) ** 2);
      const phaseDiff = (d2 - d1) / wavelength * Math.PI * 2;
      const intensity = Math.cos(phaseDiff / 2) ** 2;
      ctx.fillStyle = `rgba(100, 200, 255, ${intensity * 0.8})`;
      ctx.fillRect(screenX, y, 5, 2);
    }

    // Waves from slits
    for (let r = 0; r < 300; r += wavelength) {
      const alpha = Math.max(0, 1 - r / 300) * 0.3;
      ctx.beginPath();
      ctx.arc(barrierX, h / 2 - slitDist, r, -Math.PI / 3, Math.PI / 3);
      ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(barrierX, h / 2 + slitDist, r, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
    }

    // Info
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 60);
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🔬 Double-Slit Experiment', 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Slit distance: ${slitDist}`, 20, 50);
    ctx.fillText(`Wavelength: ${wavelength}`, 20, 65);
  }, [slitDist, wavelength, time]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, []);

  useEffect(() => {
    let t = time;
    const animate = () => {
      t += 0.05;
      setTime(t);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleComplete = () => {
    const updated = completeModule(progress, 'interference-patterns', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="interference-patterns" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🔬 Interference Patterns</h2>
          <p className="text-sm text-gray-400">The famous double-slit experiment — wave-particle duality!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Slit Distance: {slitDist}</label><input type="range" min="10" max="60" value={slitDist} onChange={e => setSlitDist(Number(e.target.value))} className="w-full accent-indigo-500" /></div>
            <div><label className="text-sm text-gray-400">Wavelength: {wavelength}</label><input type="range" min="10" max="40" value={wavelength} onChange={e => setWavelength(Number(e.target.value))} className="w-full accent-indigo-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Closer slits = wider pattern</p>
              <p>🔥 Light behaves as wave AND particle!</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
