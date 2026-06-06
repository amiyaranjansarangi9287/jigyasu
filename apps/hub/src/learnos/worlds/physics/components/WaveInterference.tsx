// src/worlds/physics/components/WaveInterference.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function WaveInterference() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [freq1, setFreq1] = useState(3);
  const [freq2, setFreq2] = useState(3);
  const [amp1, setAmp1] = useState(1);
  const [amp2, setAmp2] = useState(1);
  const [phase, setPhase] = useState(0);
  const [time, setTime] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 3;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    const drawWave = (yOffset: number, freq: number, amp: number, color: string, phaseShift: number = 0) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      for (let x = 0; x < w; x++) {
        const y = yOffset + amp * 40 * Math.sin((x * freq * Math.PI) / 200 + time + phaseShift);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    // Wave 1
    drawWave(midY, freq1, amp1, '#3b82f6');
    // Wave 2
    drawWave(midY + 80, freq2, amp2, '#ef4444', phase);
    // Combined
    ctx.beginPath();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    for (let x = 0; x < w; x++) {
      const y1 = amp1 * 40 * Math.sin((x * freq1 * Math.PI) / 200 + time);
      const y2 = amp2 * 40 * Math.sin((x * freq2 * Math.PI) / 200 + time + phase);
      const y = midY + 160 + y1 + y2;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#3b82f6';
    ctx.font = '11px sans-serif';
    ctx.fillText('Wave 1', 10, midY - 50);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Wave 2', 10, midY + 30);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('Combined', 10, midY + 110);

    // Interference type
    const isConstructive = Math.abs(freq1 - freq2) < 0.5 && Math.abs(phase) < 0.5;
    const isDestructive = Math.abs(freq1 - freq2) < 0.5 && Math.abs(phase - Math.PI) < 0.5;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(w - 180, 10, 170, 30);
    ctx.fillStyle = isConstructive ? '#22c55e' : isDestructive ? '#ef4444' : '#f59e0b';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(isConstructive ? '✅ Constructive' : isDestructive ? '🤔 Destructive' : '🌊 Mixed', w - 170, 30);
  }, [freq1, freq2, amp1, amp2, phase, time]);

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
    const updated = completeModule(progress, 'wave-interference', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="wave-interference" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🌊 Wave Interference</h2>
          <p className="text-sm text-gray-400">See how waves combine — constructive vs destructive interference!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Freq 1: {freq1}</label><input type="range" min="1" max="8" value={freq1} onChange={e => setFreq1(Number(e.target.value))} className="w-full accent-blue-500" /></div>
            <div><label className="text-sm text-gray-400">Freq 2: {freq2}</label><input type="range" min="1" max="8" value={freq2} onChange={e => setFreq2(Number(e.target.value))} className="w-full accent-red-500" /></div>
            <div><label className="text-sm text-gray-400">Amp 1: {amp1}</label><input type="range" min="0" max="2" step="0.1" value={amp1} onChange={e => setAmp1(Number(e.target.value))} className="w-full accent-blue-500" /></div>
            <div><label className="text-sm text-gray-400">Amp 2: {amp2}</label><input type="range" min="0" max="2" step="0.1" value={amp2} onChange={e => setAmp2(Number(e.target.value))} className="w-full accent-red-500" /></div>
            <div><label className="text-sm text-gray-400">Phase: {(phase * 180 / Math.PI).toFixed(0)}°</label><input type="range" min="0" max={Math.PI * 2} step="0.1" value={phase} onChange={e => setPhase(Number(e.target.value))} className="w-full accent-purple-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Same freq + same phase = constructive</p>
              <p>🔥 Same freq + opposite phase = destructive</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
