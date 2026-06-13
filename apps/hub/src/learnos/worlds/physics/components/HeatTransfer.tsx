// src/worlds/physics/components/HeatTransfer.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';
import { useTranslation } from 'react-i18next';

export default function HeatTransfer() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [temp1, setTemp1] = useState(100);
  const [temp2, setTemp2] = useState(20);
  const [conductivity, setConductivity] = useState(0.5);
  const [time, setTime] = useState(0);
  const [particles, setParticles] = useState<{x:number,y:number,vx:number,vy:number,temp:number}[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Hot side
    const gradient1 = ctx.createLinearGradient(0, 0, w / 4, 0);
    gradient1.addColorStop(0, `rgba(239, 68, 68, ${temp1 / 200})`);
    gradient1.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, w / 2, h);

    // Cold side
    const gradient2 = ctx.createLinearGradient(w / 2, 0, w, 0);
    gradient2.addColorStop(0, 'rgba(59, 130, 246, 0)');
    gradient2.addColorStop(1, `rgba(59, 130, 246, ${temp2 / 200})`);
    ctx.fillStyle = gradient2;
    ctx.fillRect(w / 2, 0, w / 2, h);

    // Divider
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();

    // Particles
    particles.forEach(p => {
      const color = p.temp > 60 ? `rgba(239, 68, 68, 0.8)` : `rgba(59, 130, 246, 0.8)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    // Info
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 200, 70);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Hot: ${temp1.toFixed(0)}°C`, 20, 30);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`Cold: ${temp2.toFixed(0)}°C`, 20, 50);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Conductivity: ${conductivity}`, 20, 70);
  }, [temp1, temp2, conductivity, particles, time]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, []);

  useEffect(() => {
    const p = Array.from({ length: 50 }, () => ({
      x: Math.random() * 700,
      y: Math.random() * 300,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      temp: Math.random() > 0.5 ? temp1 : temp2,
    }));
    setParticles(p);
  }, []);

  useEffect(() => {
    let t = time;
    const animate = () => {
      t += 0.05;
      setParticles(prev => prev.map(p => {
        let newTemp = p.temp;
        if (p.x < 350) newTemp += (temp1 - p.temp) * conductivity * 0.01;
        else newTemp += (temp2 - p.temp) * conductivity * 0.01;
        return { ...p, x: (p.x + p.vx + 350) % 700, y: (p.y + p.vy + 300) % 300, temp: newTemp };
      }));
      setTime(t);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [temp1, temp2, conductivity]);

  const handleComplete = () => {
    const updated = completeModule(progress, 'heat-transfer', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="heat-transfer" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🔥 Heat Transfer</h2>
          <p className="text-sm text-gray-400">Watch heat flow from hot to cold through conduction.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Hot Temp: {temp1}°C</label><input type="range" min="20" max="200" value={temp1} onChange={e => setTemp1(Number(e.target.value))} className="w-full accent-red-500" /></div>
            <div><label className="text-sm text-gray-400">Cold Temp: {temp2}°C</label><input type="range" min="0" max="50" value={temp2} onChange={e => setTemp2(Number(e.target.value))} className="w-full accent-blue-500" /></div>
            <div><label className="text-sm text-gray-400">Conductivity: {conductivity}</label><input type="range" min="0.1" max="1" step="0.1" value={conductivity} onChange={e => setConductivity(Number(e.target.value))} className="w-full accent-orange-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Heat flows hot → cold</p>
              <p>🔥 Higher conductivity = faster transfer</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
