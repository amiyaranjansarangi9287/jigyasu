// src/worlds/physics/components/ResonanceLab.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';
import { useTranslation } from 'react-i18next';

export default function ResonanceLab() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [drivingFreq, setDrivingFreq] = useState(1);
  const [naturalFreq, setNaturalFreq] = useState(3);
  const [damping, setDamping] = useState(0.1);
  const [amplitude, setAmplitude] = useState(0);
  const [time, setTime] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Pendulum
    const pivotX = w / 2;
    const pivotY = 40;
    const length = 150;
    const angle = amplitude * Math.sin(time * drivingFreq) * 0.5;
    const bobX = pivotX + Math.sin(angle) * length;
    const bobY = pivotY + Math.cos(angle) * length;

    ctx.beginPath();
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Amplitude meter
    const meterX = w - 80;
    const meterH = 200;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(meterX - 10, 20, 60, meterH + 20);
    ctx.fillStyle = '#374151';
    ctx.fillRect(meterX, 30, 20, meterH);
    const fillH = Math.min(amplitude / 5, 1) * meterH;
    const gradient = ctx.createLinearGradient(0, 30 + meterH - fillH, 0, 30 + meterH);
    gradient.addColorStop(0, '#ef4444');
    gradient.addColorStop(0.5, '#f59e0b');
    gradient.addColorStop(1, '#22c55e');
    ctx.fillStyle = gradient;
    ctx.fillRect(meterX, 30 + meterH - fillH, 20, fillH);
    ctx.fillStyle = '#888';
    ctx.font = '9px sans-serif';
    ctx.fillText('AMP', meterX + 2, 30 + meterH + 12);

    // Resonance indicator
    const ratio = drivingFreq / naturalFreq;
    const isResonant = Math.abs(ratio - 1) < 0.2;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 200, 50);
    ctx.fillStyle = isResonant ? '#22c55e' : '#888';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(isResonant ? '🔥 RESONANCE!' : 'Adjust driving freq', 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`f_drive/f_natural = ${ratio.toFixed(2)}`, 20, 45);
  }, [drivingFreq, naturalFreq, damping, amplitude, time]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, []);

  useEffect(() => {
    let t = time;
    let amp = amplitude;
    const dt = 0.016;

    const animate = () => {
      t += dt;
      const ratio = drivingFreq / naturalFreq;
      const resonanceFactor = 1 / (Math.sqrt((1 - ratio ** 2) ** 2 + (2 * damping * ratio) ** 2));
      const targetAmp = Math.min(resonanceFactor * 0.5, 5);
      amp += (targetAmp - amp) * dt * 2;

      setTime(t);
      setAmplitude(amp);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [drivingFreq, naturalFreq, damping]);

  const handleComplete = () => {
    const updated = completeModule(progress, 'resonance-lab', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="resonance-lab" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🔔 Resonance Lab</h2>
          <p className="text-sm text-gray-400">Match driving frequency to natural frequency to achieve resonance!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Driving Freq: {drivingFreq.toFixed(1)}</label><input type="range" min="0.5" max="6" step="0.1" value={drivingFreq} onChange={e => setDrivingFreq(Number(e.target.value))} className="w-full accent-purple-500" /></div>
            <div><label className="text-sm text-gray-400">Natural Freq: {naturalFreq}</label><input type="range" min="1" max="5" value={naturalFreq} onChange={e => setNaturalFreq(Number(e.target.value))} className="w-full accent-purple-500" /></div>
            <div><label className="text-sm text-gray-400">Damping: {damping}</label><input type="range" min="0.01" max="0.5" step="0.01" value={damping} onChange={e => setDamping(Number(e.target.value))} className="w-full accent-purple-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Match freqs for max amplitude!</p>
              <p>🔥 Tacoma Bridge collapsed from resonance</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
