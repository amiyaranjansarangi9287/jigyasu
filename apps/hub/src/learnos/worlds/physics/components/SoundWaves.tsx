// src/worlds/physics/components/SoundWaves.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';
import { useTranslation } from 'react-i18next';

export default function SoundWaves() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [frequency, setFrequency] = useState(440);
  const [amplitude, setAmplitude] = useState(0.5);
  const [waveform, setWaveform] = useState<'sine' | 'square' | 'sawtooth'>('sine');
  const [time, setTime] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i < h; i += 50) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    // Wave
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    for (let x = 0; x < w; x++) {
      const t = (x / w) * 4 * Math.PI;
      let y: number;
      if (waveform === 'sine') y = Math.sin(t * (frequency / 100) + time);
      else if (waveform === 'square') y = Math.sin(t * (frequency / 100) + time) > 0 ? 1 : -1;
      else y = 2 * ((t * (frequency / 200) + time) / (2 * Math.PI) % 1) - 1;
      ctx.lineTo(x, midY + y * amplitude * 80);
    }
    ctx.stroke();

    // Particles visualization
    for (let i = 0; i < 30; i++) {
      const x = (i / 30) * w;
      const displacement = Math.sin((i / 30) * 4 * Math.PI * (frequency / 100) + time) * amplitude * 15;
      ctx.beginPath();
      ctx.arc(x + displacement, h - 30, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6, 182, 212, ${0.3 + amplitude * 0.7})`;
      ctx.fill();
    }

    // Info
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 200, 60);
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`${frequency} Hz — ${waveform}`, 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    const note = frequency < 262 ? 'C4' : frequency < 294 ? 'D4' : frequency < 330 ? 'E4' : frequency < 349 ? 'F4' : frequency < 392 ? 'G4' : frequency < 440 ? 'A4' : frequency < 494 ? 'B4' : 'C5+';
    ctx.fillText(`Note: ${note} | λ = ${(343 / frequency).toFixed(2)}m`, 20, 45);
    ctx.fillText(`Speed of sound: 343 m/s`, 20, 60);
  }, [frequency, amplitude, waveform, time]);

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
      t += 0.08;
      setTime(t);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleComplete = () => {
    const updated = completeModule(progress, 'sound-waves', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="sound-waves" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🔊 Sound Waves Visualizer</h2>
          <p className="text-sm text-gray-400">See how frequency, amplitude, and waveform shape sound!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Frequency: {frequency} Hz</label><input type="range" min="100" max="2000" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <div><label className="text-sm text-gray-400">Amplitude: {amplitude.toFixed(1)}</label><input type="range" min="0" max="1" step="0.1" value={amplitude} onChange={e => setAmplitude(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <div className="flex gap-2">
              {(['sine', 'square', 'sawtooth'] as const).map(w => (
                <button key={w} onClick={() => setWaveform(w)} className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${waveform === w ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{w}</button>
              ))}
            </div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Higher freq = higher pitch</p>
              <p>🔊 Higher amp = louder sound</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
