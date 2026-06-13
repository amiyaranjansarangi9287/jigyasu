// src/worlds/physics/components/Bernoulli.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';
import { useTranslation } from 'react-i18next';

export default function Bernoulli() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [velocity, setVelocity] = useState(3);
  const [pipeWidth, setPipeWidth] = useState(60);
  const [time, setTime] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cy = h / 2;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Pipe with constriction
    const narrowX = w / 2 - 50;
    const narrowW = 100;
    const narrowH = pipeWidth;

    // Wide section
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fillRect(0, cy - 50, narrowX, 100);
    ctx.fillRect(narrowX + narrowW, cy - 50, w - narrowX - narrowW, 100);

    // Narrow section
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.fillRect(narrowX, cy - narrowH / 2, narrowW, narrowH);

    // Pipe outline
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy - 50);
    ctx.lineTo(narrowX, cy - 50);
    ctx.lineTo(narrowX, cy - narrowH / 2);
    ctx.lineTo(narrowX + narrowW, cy - narrowH / 2);
    ctx.lineTo(narrowX + narrowW, cy - 50);
    ctx.lineTo(w, cy - 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, cy + 50);
    ctx.lineTo(narrowX, cy + 50);
    ctx.lineTo(narrowX, cy + narrowH / 2);
    ctx.lineTo(narrowX + narrowW, cy + narrowH / 2);
    ctx.lineTo(narrowX + narrowW, cy + 50);
    ctx.lineTo(w, cy + 50);
    ctx.stroke();

    // Flow particles
    for (let i = 0; i < 20; i++) {
      const x = ((i * 40 + time * velocity * 20) % w);
      let y = cy + (Math.random() - 0.5) * 80;
      if (x > narrowX && x < narrowX + narrowW) {
        y = cy + (Math.random() - 0.5) * narrowH * 0.8;
      }
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = x > narrowX && x < narrowX + narrowW ? '#ef4444' : '#3b82f6';
      ctx.fill();
    }

    // Pressure indicators
    const pressure1 = 100 - velocity * 5;
    const pressure2 = 100 - velocity * 5 * (100 / narrowH);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 80);
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Wide section:', 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`v = ${velocity.toFixed(1)} m/s | P = ${pressure1.toFixed(0)} Pa`, 20, 45);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Narrow section:', 20, 60);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`v = ${(velocity * 100 / narrowH).toFixed(1)} m/s | P = ${pressure2.toFixed(0)} Pa`, 20, 75);
    ctx.fillText('P + ½ρv² = constant (Bernoulli)', 20, 90);
  }, [velocity, pipeWidth, time]);

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
    const updated = completeModule(progress, 'bernoulli', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="bernoulli" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">💨 Bernoulli's Principle</h2>
          <p className="text-sm text-gray-400">Faster flow = lower pressure. See how pipe constriction affects flow!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-64 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Flow Velocity: {velocity}</label><input type="range" min="1" max="10" value={velocity} onChange={e => setVelocity(Number(e.target.value))} className="w-full accent-sky-500" /></div>
            <div><label className="text-sm text-gray-400">Narrow Width: {pipeWidth}</label><input type="range" min="20" max="80" value={pipeWidth} onChange={e => setPipeWidth(Number(e.target.value))} className="w-full accent-sky-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Narrower = faster = lower pressure</p>
              <p>🔥 Bernoulli's principle is one factor in wing lift, but angle of attack and Newton's 3rd Law (deflecting air downward) are equally important!</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
