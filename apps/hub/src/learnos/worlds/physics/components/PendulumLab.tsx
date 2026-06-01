// src/worlds/physics/components/PendulumLab.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function PendulumLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [length, setLength] = useState(150);
  const [gravity, setGravity] = useState(9.8);
  const [damping, setDamping] = useState(0.99);
  const [angle, setAngle] = useState(Math.PI / 4);
  const [angularVel, setAngularVel] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [trail, setTrail] = useState<{x:number,y:number}[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const pivotX = w / 2;
    const pivotY = 60;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Trail
    if (trail.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = 2;
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
      ctx.stroke();
    }

    // Pivot
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#888';
    ctx.fill();

    // Rod
    const bobX = pivotX + Math.sin(angle) * length;
    const bobY = pivotY + Math.cos(angle) * length;
    ctx.beginPath();
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(bobX, bobY, 0, bobX, bobY, 15);
    gradient.addColorStop(0, '#c084fc');
    gradient.addColorStop(1, '#7c3aed');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Angle arc
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 200, 50, 0.5)';
    ctx.lineWidth = 1;
    ctx.arc(pivotX, pivotY, 40, Math.PI / 2 - angle, Math.PI / 2);
    ctx.stroke();

    // Stats
    const T = 2 * Math.PI * Math.sqrt(length / 100 / gravity);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 180, 70);
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`Period: ${T.toFixed(2)} s`, 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Length: ${(length/100).toFixed(2)} m`, 20, 45);
    ctx.fillText(`g: ${gravity} m/s²`, 20, 60);
    ctx.fillText(`ω: ${angularVel.toFixed(3)} rad/s`, 20, 75);

    // Formula
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(w - 200, 10, 190, 50);
    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('T = 2π√(L/g)', w - 190, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText('Period depends on L and g only!', w - 190, 50);
  }, [angle, length, gravity, angularVel, trail]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

  useEffect(() => {
    if (!isRunning) return;
    let a = angle;
    let av = angularVel;
    const dt = 0.016;
    const t: {x:number,y:number}[] = [];

    const animate = () => {
      const angularAcc = (-gravity / (length / 100)) * Math.sin(a);
      av += angularAcc * dt;
      av *= damping;
      a += av * dt;

      const canvas = canvasRef.current;
      if (canvas) {
        const pivotX = canvas.width / 2;
        const pivotY = 60;
        const bobX = pivotX + Math.sin(a) * length;
        const bobY = pivotY + Math.cos(a) * length;
        t.push({x: bobX, y: bobY});
        if (t.length > 200) t.shift();
        setTrail([...t]);
      }

      setAngle(a);
      setAngularVel(av);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, length, gravity, damping]);

  const handleStart = () => {
    setAngle(Math.PI / 4);
    setAngularVel(0);
    setTrail([]);
    setIsRunning(true);
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'pendulum-lab', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="pendulum-lab" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🕰️ Pendulum Lab</h2>
          <p className="text-sm text-gray-400">Explore how length and gravity affect the period of a pendulum.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-80 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Length: {length} cm</label>
              <input type="range" min="50" max="300" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Gravity: {gravity} m/s²</label>
              <input type="range" min="1" max="25" step="0.1" value={gravity} onChange={e => setGravity(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Damping: {damping}</label>
              <input type="range" min="0.9" max="1" step="0.005" value={damping} onChange={e => setDamping(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <button onClick={handleStart} disabled={isRunning} className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm">▶ Start Swing</button>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Longer pendulum = longer period</p>
              <p>🌍 Earth: 9.8 m/s² | Moon: 1.6</p>
              <p>🔬 Galileo discovered this in 1602!</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
