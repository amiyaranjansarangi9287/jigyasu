// src/worlds/physics/components/Photoelectric.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';
import { useTranslation } from 'react-i18next';

export default function Photoelectric() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [frequency, setFrequency] = useState(5);
  const [intensity, setIntensity] = useState(50);
  const [workFunction, setWorkFunction] = useState(3);
  const [time, setTime] = useState(0);
  const [electrons, setElectrons] = useState<{x:number,y:number,vx:number,vy:number}[]>([]);
  const [mode, setMode] = useState<'explore' | 'solar'>('explore');
  const [panelAngle, setPanelAngle] = useState(45);
  const [panelEfficiency, setPanelEfficiency] = useState(0);
  const [targetCurrent, setTargetCurrent] = useState(5);


  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    if (mode === 'explore') {
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, h - 100, w, 100);
      ctx.fillStyle = '#888';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Metal Surface', w / 2, h - 50);

      const photonColor = frequency > 6 ? '#8b5cf6' : frequency > 4 ? '#3b82f6' : '#ef4444';
      for (let i = 0; i < intensity / 10; i++) {
        const x = (i * 50 + time * 100) % w;
        const y = 50 + Math.sin(time + i) * 20;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = photonColor;
        ctx.fill();
        ctx.shadowColor = photonColor;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      electrons.forEach(e => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();
      });

      const photonEnergy = frequency * 0.5;
      const ke = photonEnergy - workFunction;
      const emits = ke > 0;

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 220, 80);
      ctx.fillStyle = emits ? '#22c55e' : '#ef4444';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(emits ? '✅ Electrons emitted!' : '🤔 No emission (E < φ)', 20, 30);
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText(`E_photon = ${photonEnergy.toFixed(2)} eV`, 20, 50);
      ctx.fillText(`Work function φ = ${workFunction} eV`, 20, 65);
      ctx.fillText(`KE_max = ${Math.max(0, ke).toFixed(2)} eV`, 20, 80);
    } else {
      // Solar panel mode
      const cx = w / 2;
      const cy = h / 2;

      // Sun
      ctx.beginPath();
      ctx.arc(80, 80, 30, 0, Math.PI * 2);
      const sunGrad = ctx.createRadialGradient(80, 80, 0, 80, 80, 30);
      sunGrad.addColorStop(0, '#fbbf24');
      sunGrad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = sunGrad;
      ctx.fill();

      // Light rays
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 200, 50, 0.3)';
        ctx.lineWidth = 2;
        ctx.moveTo(80 + Math.cos(angle) * 35, 80 + Math.sin(angle) * 35);
        ctx.lineTo(80 + Math.cos(angle) * 60, 80 + Math.sin(angle) * 60);
        ctx.stroke();
      }

      // Solar panel
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((panelAngle * Math.PI) / 180);
      ctx.fillStyle = '#1e3a5f';
      ctx.fillRect(-80, -50, 160, 100);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(-80, -50, 160, 100);
      // Grid lines
      for (let x = -60; x < 80; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, -50);
        ctx.lineTo(x, 50);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.stroke();
      }
      for (let y = -30; y < 50; y += 20) {
        ctx.beginPath();
        ctx.moveTo(-80, y);
        ctx.lineTo(80, y);
        ctx.stroke();
      }
      ctx.restore();

      // Current meter
      const angleFactor = Math.abs(Math.cos((panelAngle * Math.PI) / 180));
      const freqFactor = frequency > workFunction * 2 ? 1 : frequency > workFunction ? 0.5 : 0;
      const current = intensity * angleFactor * freqFactor * 0.1;
      setPanelEfficiency(current);

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 220, 90);
      ctx.fillStyle = current >= targetCurrent ? '#22c55e' : '#f59e0b';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`☀️ Solar Panel Designer`, 20, 30);
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText(`Current: ${current.toFixed(2)} mA`, 20, 50);
      ctx.fillText(`Target: ${targetCurrent} mA`, 20, 65);
      ctx.fillText(`Angle: ${panelAngle}° | Freq: ${frequency}`, 20, 80);
      ctx.fillText(current >= targetCurrent ? '✅ Target met!' : '⚠️ Adjust angle/frequency', 20, 95);
    }
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
      t += 0.05;
      const ke = frequency * 0.5 - workFunction;
      if (ke > 0 && mode === 'explore') {
        setElectrons(prev => {
          const next = prev.map(e => ({ ...e, x: e.x + e.vx, y: e.y + e.vy })).filter(e => e.y > -50);
          if (Math.random() < 0.3) next.push({ x: Math.random() * 700, y: 250, vx: (Math.random() - 0.5) * 2, vy: -ke * 2 });
          return next;
        });
      }
      setTime(t);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [frequency, workFunction, mode]);


  const handleComplete = () => {
    const updated = completeModule(progress, 'photoelectric', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="photoelectric" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">☀️ Photoelectric + Solar</h2>
          <p className="text-sm text-gray-400">Explore photon emission AND design optimal solar panels!</p>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('explore')} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'explore' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400'}`}>🔬 Explore</button>
          <button onClick={() => setMode('solar')} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'solar' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400'}`}>☀️ Solar Designer</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Frequency: {frequency}</label><input type="range" min="1" max="10" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full accent-yellow-500" /></div>
            <div><label className="text-sm text-gray-400">Intensity: {intensity}%</label><input type="range" min="10" max="100" value={intensity} onChange={e => setIntensity(Number(e.target.value))} className="w-full accent-yellow-500" /></div>
            {mode === 'solar' && (
              <>
                <div><label className="text-sm text-gray-400">Panel Angle: {panelAngle}°</label><input type="range" min="0" max="90" value={panelAngle} onChange={e => setPanelAngle(Number(e.target.value))} className="w-full accent-yellow-500" /></div>
                <div><label className="text-sm text-gray-400">Target Current: {targetCurrent} mA</label><input type="range" min="1" max="10" value={targetCurrent} onChange={e => setTargetCurrent(Number(e.target.value))} className="w-full accent-yellow-500" /></div>
                {panelEfficiency >= targetCurrent && <p className="text-green-400 text-sm font-bold">✅ Optimal configuration!</p>}
              </>
            )}
            {mode === 'explore' && (
              <div><label className="text-sm text-gray-400">Work Function: {workFunction} eV</label><input type="range" min="1" max="6" step="0.5" value={workFunction} onChange={e => setWorkFunction(Number(e.target.value))} className="w-full accent-yellow-500" /></div>
            )}
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
          </div>
        </div>

      </div>
    </ModuleWrapper>
  );
}
