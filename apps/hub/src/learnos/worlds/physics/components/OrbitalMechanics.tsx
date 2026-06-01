// src/worlds/physics/components/OrbitalMechanics.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function OrbitalMechanics() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [velocity, setVelocity] = useState(5);
  const [mass, setMass] = useState(5);
  const [time, setTime] = useState(0);
  const [orbit, setOrbit] = useState<{x:number,y:number}[]>([]);

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
    for (let i = 0; i < 50; i++) {
      const x = (i * 137.5) % w;
      const y = (i * 97.3) % h;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
    }

    // Central body
    ctx.beginPath();
    ctx.arc(cx, cy, 20 + mass * 2, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20 + mass * 2);
    gradient.addColorStop(0, '#fbbf24');
    gradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Orbit trail
    if (orbit.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.moveTo(orbit[0].x, orbit[0].y);
      for (let i = 1; i < orbit.length; i++) ctx.lineTo(orbit[i].x, orbit[i].y);
      ctx.stroke();
    }

    // Satellite
    if (orbit.length > 0) {
      const sat = orbit[orbit.length - 1];
      ctx.beginPath();
      ctx.arc(sat.x, sat.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Info
    const escapeV = Math.sqrt(2 * mass * 0.5);
    const isOrbiting = velocity > 2 && velocity < escapeV * 1.5;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 70);
    ctx.fillStyle = isOrbiting ? '#22c55e' : '#ef4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(isOrbiting ? '🛰️ Stable Orbit!' : velocity >= escapeV * 1.5 ? '🚀 Escaped!' : '⬇️ Falling!', 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`v = ${velocity} km/s | M = ${mass}`, 20, 50);
    ctx.fillText(`Escape velocity: ${escapeV.toFixed(1)} km/s`, 20, 65);
    ctx.fillText('Gravity keeps satellites in orbit!', 20, 80);
  }, [velocity, mass, time, orbit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, []);

  useEffect(() => {
    let t = time;
    let angle = 0;
    const radius = 150;
    const o: {x:number,y:number}[] = [];
    const cx = 700 / 2;
    const cy = 300 / 2;

    const animate = () => {
      t += 0.03;
      angle += velocity * 0.01;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius * (velocity < 4 ? 0.5 : 1);
      o.push({x, y});
      if (o.length > 500) o.shift();
      setTime(t);
      setOrbit([...o]);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [velocity, mass]);

  const handleComplete = () => {
    const updated = completeModule(progress, 'orbital-mechanics', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="orbital-mechanics" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🛰️ Orbital Mechanics</h2>
          <p className="text-sm text-gray-400">Launch satellites and explore orbital velocity vs escape velocity!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Velocity: {velocity} km/s</label><input type="range" min="1" max="15" value={velocity} onChange={e => setVelocity(Number(e.target.value))} className="w-full accent-indigo-500" /></div>
            <div><label className="text-sm text-gray-400">Central Mass: {mass}</label><input type="range" min="1" max="10" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-indigo-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Right velocity = stable orbit</p>
              <p>🔥 Too fast = escape! Too slow = fall!</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
