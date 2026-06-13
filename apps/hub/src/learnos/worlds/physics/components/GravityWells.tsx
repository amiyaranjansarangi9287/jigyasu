// src/worlds/physics/components/GravityWells.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';
import GravityTeachingBridge from './GravityTeachingBridge';
import { useTranslation } from 'react-i18next';

export default function GravityWells() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [mass, setMass] = useState(5);
  const [time, setTime] = useState(0);


  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const depth = mass * 8;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    const gridSize = 30;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 5) {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const warp = depth * Math.exp(-dist / 100);
        const warpedY = y + warp;
        y === 0 ? ctx.moveTo(x, warpedY) : ctx.lineTo(x, warpedY);
      }
      ctx.stroke();
    }

    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 5) {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const warp = depth * Math.exp(-dist / 100);
        const warpedX = x + warp * 0.3;
        x === 0 ? ctx.moveTo(warpedX, y) : ctx.lineTo(warpedX, y);
      }
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 10 + mass * 2, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10 + mass * 2);
    gradient.addColorStop(0, '#fbbf24');
    gradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    const orbitRadius = 80 + mass * 10;
    const angle = time * 2 / Math.sqrt(mass);
    const px = cx + Math.cos(angle) * orbitRadius;
    const py = cy + Math.sin(angle) * orbitRadius;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 70);
    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🌌 Gravity Well', 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Mass: ${mass} | Depth: ${(mass * 8).toFixed(0)}px`, 20, 50);
    ctx.fillText('Mass curves spacetime', 20, 65);
    ctx.fillText('Objects follow curved paths = gravity', 20, 80);
  };

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
      t += 0.03;
      setTime(t);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);


  const handleComplete = () => {
    const updated = completeModule(progress, 'gravity-wells', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="gravity-wells" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🌌 Gravity Wells</h2>
          <p className="text-sm text-gray-400">Visualize how mass curves spacetime — Einstein's general relativity!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Mass: {mass}</label><input type="range" min="1" max="10" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-violet-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 More mass = deeper well</p>
              <p>🔥 Gravity = curved spacetime!</p>
            </div>
          </div>
        </div>


        <GravityTeachingBridge />
      </div>
    </ModuleWrapper>
  );
}
