// src/worlds/physics/components/NewtonsLaws.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';
import { useTranslation } from 'react-i18next';

export default function NewtonsLaws() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [mass, setMass] = useState(5);
  const [force, setForce] = useState(20);
  const [friction, setFriction] = useState(0.1);
  const [box, setBox] = useState({ x: 100, vx: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [acceleration, setAcceleration] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Ground
    ctx.fillStyle = '#1a2a3a';
    ctx.fillRect(0, h - 80, w, 80);
    ctx.strokeStyle = '#2a4a5a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h - 80);
    ctx.lineTo(w, h - 80);
    ctx.stroke();

    // Box size based on mass
    const boxSize = 30 + mass * 5;
    const boxY = h - 80 - boxSize;

    // Box
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(box.x, boxY, boxSize, boxSize);
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, boxY, boxSize, boxSize);

    // Mass label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass} kg`, box.x + boxSize / 2, boxY + boxSize / 2 + 4);

    // Force arrow
    if (force > 0) {
      const arrowLen = force * 3;
      ctx.beginPath();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.moveTo(box.x + boxSize, boxY + boxSize / 2);
      ctx.lineTo(box.x + boxSize + arrowLen, boxY + boxSize / 2);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.fillStyle = '#f59e0b';
      ctx.moveTo(box.x + boxSize + arrowLen, boxY + boxSize / 2);
      ctx.lineTo(box.x + boxSize + arrowLen - 10, boxY + boxSize / 2 - 6);
      ctx.lineTo(box.x + boxSize + arrowLen - 10, boxY + boxSize / 2 + 6);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`F = ${force} N`, box.x + boxSize + arrowLen + 5, boxY + boxSize / 2 + 4);
    }

    // Friction arrow
    if (friction > 0 && box.vx > 0) {
      const frictionForce = friction * mass * 9.8;
      const arrowLen = Math.min(frictionForce * 3, 80);
      ctx.beginPath();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.moveTo(box.x, boxY + boxSize / 2);
      ctx.lineTo(box.x - arrowLen, boxY + boxSize / 2);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`f = ${frictionForce.toFixed(1)} N`, box.x - arrowLen - 5, boxY + boxSize / 2 + 4);
    }

    // Stats panel
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 200, 80);
    ctx.fillStyle = '#888';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`a = F/m = ${acceleration.toFixed(2)} m/s²`, 20, 30);
    ctx.fillText(`v = ${box.vx.toFixed(2)} m/s`, 20, 45);
    ctx.fillText(`F_net = ${force - friction * mass * 9.8} N`, 20, 60);
    ctx.fillText(`x = ${box.x.toFixed(0)} px`, 20, 75);

    // Laws display
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(w - 220, 10, 210, 70);
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText("Newton's Laws:", w - 210, 28);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText('1. Inertia: Objects resist change', w - 210, 43);
    ctx.fillText('2. F = ma (shown above)', w - 210, 58);
    ctx.fillText('3. Action = Reaction', w - 210, 73);
  }, [box, mass, force, friction, acceleration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

  useEffect(() => {
    if (!isRunning) return;
    const netForce = force - friction * mass * 9.8;
    const a = netForce / mass;
    setAcceleration(a);
    let x = box.x;
    let vx = box.vx;
    const dt = 0.016;

    const animate = () => {
      vx += a * dt * 10;
      x += vx * dt * 10;

      if (x > 800) { x = 100; vx = 0; }
      if (vx < 0) { vx = 0; x = 100; }

      setBox({ x, vx });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, mass, force, friction]);

  const handleStart = () => {
    setBox({ x: 100, vx: 0 });
    setAcceleration(0);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setBox({ x: 100, vx: 0 });
    setAcceleration(0);
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'newtons-laws', 85);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="newtons-laws" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🍎 Newton's Laws Interactive</h2>
          <p className="text-sm text-gray-400">See F=ma in action! Adjust mass, force, and friction.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-80 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Mass: {mass} kg</label>
              <input type="range" min="1" max="20" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Force: {force} N</label>
              <input type="range" min="0" max="100" value={force} onChange={e => setForce(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Friction: {friction}</label>
              <input type="range" min="0" max="1" step="0.05" value={friction} onChange={e => setFriction(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleStart} disabled={isRunning} className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm">▶ Start</button>
              <button onClick={handleStop} className="flex-1 py-2 rounded-lg bg-red-600/50 hover:bg-red-500 text-white font-bold text-sm">⏹ Reset</button>
            </div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 More mass = less acceleration</p>
              <p>🔥 More force = more acceleration</p>
              <p>⚠️ Friction opposes motion!</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
