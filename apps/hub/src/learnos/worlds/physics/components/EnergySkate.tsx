// src/worlds/physics/components/EnergySkate.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function EnergySkate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [friction, setFriction] = useState(0);
  const [skater, setSkater] = useState({ x: 0, y: 0, vx: 0, vy: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [ke, setKe] = useState(0);
  const [pe, setPe] = useState(0);
  const [totalE, setTotalE] = useState(0);

  const trackPoints = useCallback(() => {
    const pts: {x:number,y:number}[] = [];
    for (let x = 0; x <= 800; x += 5) {
      const y = 200 + 100 * Math.sin(x * 0.008) + 50 * Math.cos(x * 0.015);
      pts.push({ x, y });
    }
    return pts;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const track = trackPoints();

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Track
    ctx.beginPath();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.moveTo(track[0].x, track[0].y);
    for (let i = 1; i < track.length; i++) ctx.lineTo(track[i].x, track[i].y);
    ctx.stroke();

    // Fill under track
    ctx.lineTo(track[track.length - 1].x, h);
    ctx.lineTo(track[0].x, h);
    ctx.closePath();
    ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
    ctx.fill();

    // Skater
    const skaterX = skater.x;
    const idx = Math.floor(skaterX / 5);
    const skaterY = idx >= 0 && idx < track.length ? track[idx].y : 200;
    ctx.beginPath();
    ctx.arc(skaterX, skaterY - 15, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Energy bars
    const maxE = 500;
    const barW = 20;
    const barH = 150;
    const startX = w - 100;
    const startY = 30;

    // KE bar
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(startX, startY, barW + 10, barH + 30);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(startX + 2, startY + barH - (ke / maxE) * barH, barW, (ke / maxE) * barH);
    ctx.fillStyle = '#888';
    ctx.font = '9px sans-serif';
    ctx.fillText('KE', startX + 5, startY + barH + 12);

    // PE bar
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(startX + 35, startY + barH - (pe / maxE) * barH, barW, (pe / maxE) * barH);
    ctx.fillStyle = '#888';
    ctx.fillText('PE', startX + 37, startY + barH + 12);

    // Total bar
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(startX + 70, startY + barH - (totalE / maxE) * barH, barW, (totalE / maxE) * barH);
    ctx.fillStyle = '#888';
    ctx.fillText('Total', startX + 68, startY + barH + 12);

    // Labels
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`KE: ${ke.toFixed(0)} J`, 10, 20);
    ctx.fillText(`PE: ${pe.toFixed(0)} J`, 10, 35);
    ctx.fillText(`Total: ${totalE.toFixed(0)} J`, 10, 50);
  }, [skater, ke, pe, totalE, trackPoints]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

  useEffect(() => {
    if (!isRunning) return;
    const track = trackPoints();
    let x = skater.x || 50;
    let vx = skater.vx || 2;
    const dt = 0.016;
    const g = 9.8;
    const mass = 1;

    const animate = () => {
      const idx = Math.floor(x / 5);
      if (idx < 0 || idx >= track.length - 1) { setIsRunning(false); return; }

      const y1 = track[idx].y;
      const y2 = track[idx + 1].y;
      const slope = (y2 - y1) / 5;

      const ax = g * slope - friction * vx;
      vx += ax * dt * 10;
      x += vx * dt * 10;

      if (x < 0) { x = 0; vx = Math.abs(vx) * 0.5; }
      if (x > 800) { x = 800; vx = -Math.abs(vx) * 0.5; }

      const currentY = track[Math.floor(x / 5)]?.y || 200;
      const height = 300 - currentY;
      const kineticE = 0.5 * mass * vx ** 2;
      const potentialE = mass * g * height;

      setSkater({ x, y: currentY, vx, vy: 0 });
      setKe(kineticE);
      setPe(potentialE);
      setTotalE(kineticE + potentialE);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, friction, trackPoints]);

  const handleStart = () => {
    setSkater({ x: 50, y: 0, vx: 2, vy: 0 });
    setIsRunning(true);
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'energy-skate', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="energy-skate" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🛹 Energy Skate Park</h2>
          <p className="text-sm text-gray-400">Watch kinetic and potential energy transform as the skater moves!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Friction: {friction}</label>
              <input type="range" min="0" max="0.5" step="0.01" value={friction} onChange={e => setFriction(Number(e.target.value))} className="w-full accent-green-500" />
            </div>
            <button onClick={handleStart} disabled={isRunning} className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold text-sm">▶ Drop Skater</button>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 KE + PE = Total Energy</p>
              <p>🔥 Friction converts KE to heat</p>
              <p>📈 PE highest at peaks</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
