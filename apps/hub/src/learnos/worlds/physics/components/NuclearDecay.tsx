// src/worlds/physics/components/NuclearDecay.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function NuclearDecay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [halfLife, setHalfLife] = useState(5);
  const [initialAtoms, setInitialAtoms] = useState(100);
  const [time, setTime] = useState(0);
  const [remaining, setRemaining] = useState(100);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Atoms grid
    const cols = 10;
    const cellSize = 25;
    const startX = (w - cols * cellSize) / 2;
    const startY = 50;
    let count = 0;
    for (let row = 0; row < 10 && count < initialAtoms; row++) {
      for (let col = 0; col < cols && count < initialAtoms; col++) {
        const x = startX + col * cellSize;
        const y = startY + row * cellSize;
        const isDecayed = count >= remaining;
        ctx.beginPath();
        ctx.arc(x + cellSize / 2, y + cellSize / 2, 8, 0, Math.PI * 2);
        ctx.fillStyle = isDecayed ? 'rgba(239, 68, 68, 0.3)' : '#22c55e';
        ctx.fill();
        if (!isDecayed) {
          ctx.strokeStyle = '#4ade80';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        count++;
      }
    }

    // Decay curve
    const graphX = 50;
    const graphY = h - 120;
    const graphW = w - 100;
    const graphH = 80;
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.strokeRect(graphX, graphY, graphW, graphH);
    ctx.beginPath();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    for (let x = 0; x <= graphW; x++) {
      const t = (x / graphW) * 20;
      const n = initialAtoms * Math.pow(0.5, t / halfLife);
      const y = graphY + graphH - (n / initialAtoms) * graphH;
      x === 0 ? ctx.moveTo(graphX + x, y) : ctx.lineTo(graphX + x, y);
    }
    ctx.stroke();

    // Current time marker
    const markerX = graphX + (time / 20) * graphW;
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.moveTo(markerX, graphY);
    ctx.lineTo(markerX, graphY + graphH);
    ctx.stroke();

    // Info
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 60);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`☢️ Remaining: ${remaining}/${initialAtoms}`, 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Half-life: ${halfLife}s | t = ${time.toFixed(1)}s`, 20, 50);
    ctx.fillText(`${(remaining / initialAtoms * 100).toFixed(0)}% still undecayed`, 20, 65);
  }, [halfLife, initialAtoms, time, remaining]);

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
      const r = Math.round(initialAtoms * Math.pow(0.5, t / halfLife));
      setTime(t);
      setRemaining(r);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [halfLife, initialAtoms]);

  const handleComplete = () => {
    const updated = completeModule(progress, 'nuclear-decay', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="nuclear-decay" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">☢️ Nuclear Decay</h2>
          <p className="text-sm text-gray-400">Watch radioactive decay and understand half-life!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-80 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Half-Life: {halfLife}s</label><input type="range" min="1" max="10" value={halfLife} onChange={e => setHalfLife(Number(e.target.value))} className="w-full accent-green-500" /></div>
            <div><label className="text-sm text-gray-400">Initial Atoms: {initialAtoms}</label><input type="range" min="20" max="100" value={initialAtoms} onChange={e => setInitialAtoms(Number(e.target.value))} className="w-full accent-green-500" /></div>
            <button onClick={() => { setTime(0); setRemaining(initialAtoms); }} className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold text-sm">🔄 Reset</button>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 After 1 half-life: 50% remain</p>
              <p>🔥 After 2: 25%, After 3: 12.5%</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
