// src/worlds/physics/components/EmInduction.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';
import { useTranslation } from 'react-i18next';

export default function EmInduction() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [magnetPos, setMagnetPos] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [emf, setEmf] = useState(0);
  const [time, setTime] = useState(0);


  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cy = h / 2;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      const x = w / 2 - 60 + i * 15;
      ctx.ellipse(x, cy, 8, 40, 0, 0, Math.PI * 2);
    }
    ctx.stroke();

    const mx = w / 2 + magnetPos;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(mx - 20, cy - 15, 20, 30);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(mx, cy - 15, 20, 30);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', mx - 10, cy + 5);
    ctx.fillText('S', mx + 10, cy + 5);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 180, 60);
    ctx.fillStyle = Math.abs(emf) > 2 ? '#ef4444' : '#22c55e';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`EMF: ${emf.toFixed(2)} V`, 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText('Faraday: EMF = -dΦ/dt', 20, 55);

    const currentDir = emf > 0 ? '→' : '←';
    ctx.fillStyle = '#fbbf24';
    ctx.font = '20px sans-serif';
    ctx.fillText(currentDir, w / 2, cy - 50);
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
    let pos = magnetPos;
    const animate = () => {
      t += 0.05;
      pos = Math.sin(t * speed * 0.5) * 150;
      const e = Math.cos(t * speed * 0.5) * speed * 3;
      setMagnetPos(pos);
      setEmf(e);
      setTime(t);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [speed]);


  const handleComplete = () => {
    const updated = completeModule(progress, 'em-induction', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="em-induction" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🔄 EM Induction</h2>
          <p className="text-sm text-gray-400">Move a magnet through a coil to generate electricity!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-64 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Speed: {speed}</label><input type="range" min="1" max="10" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full accent-purple-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Faster motion = more EMF</p>
              <p>🔥 This is how generators work!</p>
            </div>
          </div>
        </div>

      </div>
    </ModuleWrapper>
  );
}
