// src/worlds/physics/components/CollisionSim.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function CollisionSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [mass1, setMass1] = useState(2);
  const [mass2, setMass2] = useState(3);
  const [vel1, setVel1] = useState(5);
  const [vel2, setVel2] = useState(-2);
  const [elastic, setElastic] = useState(true);
  const [ball1, setBall1] = useState({ x: 150, vx: 5 });
  const [ball2, setBall2] = useState({ x: 500, vx: -2 });
  const [isRunning, setIsRunning] = useState(false);
  const [collided, setCollided] = useState(false);
  const [_momentumBefore, setMomentumBefore] = useState(0);
  const [_keBefore, setKeBefore] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Track
    ctx.fillStyle = '#1a2a3a';
    ctx.fillRect(0, h / 2 - 20, w, 40);

    const r1 = 20 + mass1 * 5;
    const r2 = 20 + mass2 * 5;
    const y = h / 2;

    // Ball 1
    ctx.beginPath();
    ctx.arc(ball1.x, y, r1, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass1}kg`, ball1.x, y + 4);

    // Ball 2
    ctx.beginPath();
    ctx.arc(ball2.x, y, r2, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(`${mass2}kg`, ball2.x, y + 4);

    // Velocity arrows
    if (Math.abs(ball1.vx) > 0.1) {
      ctx.beginPath();
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.moveTo(ball1.x + r1, y);
      ctx.lineTo(ball1.x + r1 + ball1.vx * 8, y);
      ctx.stroke();
    }
    if (Math.abs(ball2.vx) > 0.1) {
      ctx.beginPath();
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 2;
      ctx.moveTo(ball2.x - r2, y);
      ctx.lineTo(ball2.x - r2 + ball2.vx * 8, y);
      ctx.stroke();
    }

    // Collision flash
    if (collided) {
      ctx.beginPath();
      ctx.arc((ball1.x + ball2.x) / 2, y, 30, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 100, 0.3)';
      ctx.fill();
    }

    // Stats
    const p = mass1 * ball1.vx + mass2 * ball2.vx;
    const ke = 0.5 * mass1 * ball1.vx ** 2 + 0.5 * mass2 * ball2.vx ** 2;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 80);
    ctx.fillStyle = '#888';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Momentum: ${p.toFixed(1)} kg·m/s`, 20, 30);
    ctx.fillText(`KE: ${ke.toFixed(1)} J`, 20, 45);
    ctx.fillText(`v₁: ${ball1.vx.toFixed(2)} m/s`, 20, 60);
    ctx.fillText(`v₂: ${ball2.vx.toFixed(2)} m/s`, 20, 75);

    // Type label
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(w - 160, 10, 150, 30);
    ctx.fillStyle = elastic ? '#22c55e' : '#f59e0b';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(elastic ? '✅ Elastic' : '⚠️ Inelastic', w - 150, 30);
  }, [ball1, ball2, mass1, mass2, collided, elastic]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

  useEffect(() => {
    if (!isRunning) return;
    let b1 = { ...ball1 };
    let b2 = { ...ball2 };
    const r1 = 20 + mass1 * 5;
    const r2 = 20 + mass2 * 5;
    const dt = 0.016;
    setCollided(false);

    const animate = () => {
      b1.x += b1.vx * dt * 20;
      b2.x += b2.vx * dt * 20;

      // Collision detection
      if (b1.x + r1 >= b2.x - r2 && !collided) {
        setCollided(true);
        const pBefore = mass1 * b1.vx + mass2 * b2.vx;
        const keBefore = 0.5 * mass1 * b1.vx ** 2 + 0.5 * mass2 * b2.vx ** 2;
        setMomentumBefore(pBefore);
        setKeBefore(keBefore);

        if (elastic) {
          const v1f = ((mass1 - mass2) * b1.vx + 2 * mass2 * b2.vx) / (mass1 + mass2);
          const v2f = ((mass2 - mass1) * b2.vx + 2 * mass1 * b1.vx) / (mass1 + mass2);
          b1.vx = v1f;
          b2.vx = v2f;
        } else {
          const vf = (mass1 * b1.vx + mass2 * b2.vx) / (mass1 + mass2);
          b1.vx = vf;
          b2.vx = vf;
        }
      }

      // Wall bounce
      if (b1.x - r1 < 0) b1.vx = Math.abs(b1.vx);
      if (b2.x + r2 > 700) b2.vx = -Math.abs(b2.vx);

      setBall1(b1);
      setBall2(b2);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, mass1, mass2, elastic, collided]);

  const handleStart = () => {
    setBall1({ x: 150, vx: vel1 });
    setBall2({ x: 500, vx: vel2 });
    setCollided(false);
    setIsRunning(true);
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'collision-sim', 85);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="collision-sim" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">💥 Collision Simulator</h2>
          <p className="text-sm text-gray-400">Observe elastic vs inelastic collisions and momentum conservation.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-64 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Mass 1: {mass1} kg</label>
              <input type="range" min="1" max="10" value={mass1} onChange={e => setMass1(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Mass 2: {mass2} kg</label>
              <input type="range" min="1" max="10" value={mass2} onChange={e => setMass2(Number(e.target.value))} className="w-full accent-red-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Velocity 1: {vel1} m/s</label>
              <input type="range" min="-10" max="10" value={vel1} onChange={e => setVel1(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Velocity 2: {vel2} m/s</label>
              <input type="range" min="-10" max="10" value={vel2} onChange={e => setVel2(Number(e.target.value))} className="w-full accent-red-500" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={elastic} onChange={e => setElastic(e.target.checked)} className="accent-purple-500" />
              Elastic collision
            </label>
            <button onClick={handleStart} disabled={isRunning} className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm">▶ Collide!</button>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Momentum is always conserved!</p>
              <p>🔥 KE conserved only in elastic</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
