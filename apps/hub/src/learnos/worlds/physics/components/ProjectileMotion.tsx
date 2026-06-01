// src/worlds/physics/components/ProjectileMotion.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function ProjectileMotion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(50);
  const [gravity, setGravity] = useState(9.8);
  const [isRunning, setIsRunning] = useState(false);
  const [projectile, setProjectile] = useState({ x: 0, y: 0, vx: 0, vy: 0, trail: [] as {x:number,y:number}[] });
  const [maxHeight, setMaxHeight] = useState(0);
  const [range, setRange] = useState(0);
  const [timeOfFlight, setTimeOfFlight] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i < h; i += 50) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    // Ground
    ctx.fillStyle = '#1a3a2a';
    ctx.fillRect(0, h - 40, w, 40);
    ctx.fillStyle = '#2a5a3a';
    for (let i = 0; i < w; i += 20) { ctx.fillRect(i, h - 40, 10, 5); }

    // Trail
    if (projectile.trail.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.moveTo(projectile.trail[0].x, h - 40 - projectile.trail[0].y);
      for (let i = 1; i < projectile.trail.length; i++) {
        ctx.lineTo(projectile.trail[i].x, h - 40 - projectile.trail[i].y);
      }
      ctx.stroke();
    }

    // Projectile
    ctx.beginPath();
    ctx.arc(projectile.x, h - 40 - projectile.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#00d4ff';
    ctx.fill();
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Launch angle indicator
    if (!isRunning) {
      const rad = (angle * Math.PI) / 180;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 200, 50, 0.5)';
      ctx.lineWidth = 2;
      ctx.moveTo(50, h - 40);
      ctx.lineTo(50 + Math.cos(rad) * 60, h - 40 - Math.sin(rad) * 60);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 200, 50, 0.8)';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${angle}°`, 60 + Math.cos(rad) * 30, h - 50 - Math.sin(rad) * 30);
    }

    // Stats
    ctx.fillStyle = '#888';
    ctx.font = '11px sans-serif';
    ctx.fillText(`Max Height: ${maxHeight.toFixed(1)}m`, 10, 20);
    ctx.fillText(`Range: ${range.toFixed(1)}m`, 10, 35);
    ctx.fillText(`Time: ${timeOfFlight.toFixed(2)}s`, 10, 50);
  }, [projectile, isRunning, angle, maxHeight, range, timeOfFlight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

  useEffect(() => {
    if (!isRunning) return;
    const rad = (angle * Math.PI) / 180;
    let x = 50, y = 0;
    let vx = velocity * Math.cos(rad);
    let vy = velocity * Math.sin(rad);
    let t = 0;
    const dt = 0.05;
    const trail: {x:number,y:number}[] = [{x, y}];
    let mh = 0;

    const animate = () => {
      t += dt;
      x += vx * dt * 10;
      vy -= gravity * dt;
      y += vy * dt * 10;
      if (y > mh) mh = y;

      if (y < 0) {
        y = 0;
        setIsRunning(false);
        setRange(x - 50);
        setMaxHeight(mh);
        setTimeOfFlight(t);
        setProjectile({ x, y, vx, vy, trail: [...trail, {x, y}] });
        return;
      }

      trail.push({x, y});
      setProjectile({ x, y, vx, vy, trail: [...trail] });
      setMaxHeight(mh);
      setTimeOfFlight(t);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, angle, velocity, gravity]);

  const handleLaunch = () => {
    setProjectile({ x: 50, y: 0, vx: 0, vy: 0, trail: [] });
    setMaxHeight(0);
    setRange(0);
    setTimeOfFlight(0);
    setIsRunning(true);
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'projectile-motion', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="projectile-motion" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🎯 Projectile Motion Simulator</h2>
          <p className="text-sm text-gray-400">Adjust angle and velocity, then launch to see the trajectory!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-80 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Angle: {angle}°</label>
              <input type="range" min="5" max="85" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Velocity: {velocity} m/s</label>
              <input type="range" min="10" max="100" value={velocity} onChange={e => setVelocity(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Gravity: {gravity} m/s²</label>
              <input type="range" min="1" max="25" step="0.1" value={gravity} onChange={e => setGravity(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <button onClick={handleLaunch} disabled={isRunning} className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm">
              {isRunning ? 'Launching...' : '🚀 Launch'}
            </button>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">
              ✓ Mark Complete (+25 XP)
            </button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 <strong className="text-gray-400">Tip:</strong> 45° gives maximum range!</p>
              <p>🌍 Moon gravity: 1.6 m/s²</p>
              <p>🪐 Jupiter gravity: 24.8 m/s²</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
