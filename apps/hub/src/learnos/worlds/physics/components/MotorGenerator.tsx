// src/worlds/physics/components/MotorGenerator.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';
import { useTranslation } from 'react-i18next';

export default function MotorGenerator() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [mode, setMode] = useState<'motor' | 'generator'>('motor');
  const [speed, setSpeed] = useState(3);
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

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    const angle = time * speed;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(-40, -60, 80, 120);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(-35, -55, 70, 110);
    ctx.restore();

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 100, cy - 30, 30, 60);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(cx + 70, cy - 30, 30, 60);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', cx - 85, cy + 5);
    ctx.fillText('S', cx + 85, cy + 5);

    const output = mode === 'motor' ? speed * 10 : Math.sin(time * speed) * speed * 5;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 200, 60);
    ctx.fillStyle = mode === 'motor' ? '#22c55e' : '#f59e0b';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(mode === 'motor' ? '⚡ Motor Mode' : '🔄 Generator Mode', 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(mode === 'motor' ? `Torque: ${output.toFixed(1)} Nm` : `EMF: ${output.toFixed(2)} V`, 20, 50);
    ctx.fillText('Energy conversion in action!', 20, 65);
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
    const updated = completeModule(progress, 'motor-generator', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="motor-generator" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">⚙️ Motor & Generator</h2>
          <p className="text-sm text-gray-400">See how electric motors and generators convert energy.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <button onClick={() => setMode('motor')} className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${mode === 'motor' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Motor</button>
              <button onClick={() => setMode('generator')} className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${mode === 'generator' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Generator</button>
            </div>
            <div><label className="text-sm text-gray-400">Speed: {speed}</label><input type="range" min="1" max="10" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full accent-yellow-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Motor: Electrical → Mechanical</p>
              <p>🔥 Generator: Mechanical → Electrical</p>
            </div>
          </div>
        </div>

      </div>
    </ModuleWrapper>
  );
}
