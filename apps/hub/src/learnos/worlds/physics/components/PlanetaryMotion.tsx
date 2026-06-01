// src/worlds/physics/components/PlanetaryMotion.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function PlanetaryMotion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [eccentricity, setEccentricity] = useState(0.3);
  const [speed, setSpeed] = useState(3);
  const [time, setTime] = useState(0);

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

    // Stars
    for (let i = 0; i < 30; i++) {
      const x = (i * 137.5) % w;
      const y = (i * 97.3) % h;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
    }

    // Sun
    ctx.beginPath();
    ctx.arc(cx - 50, cy, 15, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(cx - 50, cy, 0, cx - 50, cy, 15);
    gradient.addColorStop(0, '#fbbf24');
    gradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Orbit path (elliptical)
    const a = 150;
    const b = a * Math.sqrt(1 - eccentricity ** 2);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.ellipse(cx - 50, cy, a, b, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Planet position
    const angle = time * speed * 0.02;
    const r = a * (1 - eccentricity ** 2) / (1 + eccentricity * Math.cos(angle));
    const px = cx - 50 + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle) * (b / a);

    ctx.beginPath();
    ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Velocity vector
    const vx = -Math.sin(angle) * speed * 0.5;
    const vy = Math.cos(angle) * speed * 0.5 * (b / a);
    ctx.beginPath();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.moveTo(px, py);
    ctx.lineTo(px + vx * 20, py + vy * 20);
    ctx.stroke();

    // Info
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 80);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🪐 Planetary Motion', 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Eccentricity: ${eccentricity.toFixed(2)}`, 20, 50);
    ctx.fillText(`a = ${a}px | b = ${b.toFixed(0)}px`, 20, 65);
    ctx.fillText("Kepler's 1st Law: Elliptical orbits", 20, 80);
    ctx.fillText('2nd Law: Equal areas in equal time', 20, 95);
  }, [eccentricity, speed, time]);

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
    const updated = completeModule(progress, 'planetary-motion', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="planetary-motion" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🪐 Planetary Motion</h2>
          <p className="text-sm text-gray-400">Explore Kepler's laws — elliptical orbits and equal areas!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Eccentricity: {eccentricity.toFixed(2)}</label><input type="range" min="0" max="0.9" step="0.01" value={eccentricity} onChange={e => setEccentricity(Number(e.target.value))} className="w-full accent-amber-500" /></div>
            <div><label className="text-sm text-gray-400">Speed: {speed}</label><input type="range" min="1" max="10" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full accent-amber-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 e=0 → circle, e→1 → ellipse</p>
              <p>🔥 Planets move faster near the Sun!</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
