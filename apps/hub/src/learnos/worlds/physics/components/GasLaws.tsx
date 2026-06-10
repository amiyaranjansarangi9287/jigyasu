// src/worlds/physics/components/GasLaws.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface FoodItem {
  name: string;
  emoji: string;
  cookTemp: number;
  cookTime: number;
  cooked: boolean;
  burnt: boolean;
  progress: number;
}

export default function GasLaws() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [pressure, setPressure] = useState(1);
  const [volume, setVolume] = useState(5);
  const [temperature, setTemperature] = useState(300);
  const [particles, setParticles] = useState<{x:number,y:number,vx:number,vy:number}[]>([]);
  const [mode, setMode] = useState<'explore' | 'cooker'>('explore');
  const [foods, setFoods] = useState<FoodItem[]>([
    { name: 'Rice', emoji: '🍚', cookTemp: 373, cookTime: 10, cooked: false, burnt: false, progress: 0 },
    { name: 'Potato', emoji: '🥔', cookTemp: 375, cookTime: 15, cooked: false, burnt: false, progress: 0 },
    { name: 'Egg', emoji: '🥚', cookTemp: 343, cookTime: 5, cooked: false, burnt: false, progress: 0 },
  ]);
  const [_cookerTime, setCookerTime] = useState(0);
  const [lidClosed, setLidClosed] = useState(false);
  const [time, setTime] = useState(0);


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
      const containerW = volume * 60;
      const containerH = 200;
      const cx = (w - containerW) / 2;
      const cy = (h - containerH) / 2;

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.strokeRect(cx, cy, containerW, containerH);

      particles.forEach(p => {
        const px = cx + (p.x / 100) * containerW;
        const py = cy + (p.y / 100) * containerH;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${temperature / 3}, 80%, 60%)`;
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 220, 80);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('PV = nRT', 20, 30);
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText(`P × V = ${(pressure * volume).toFixed(2)}`, 20, 50);
      ctx.fillText(`nRT = ${(1 * 0.0821 * temperature).toFixed(2)}`, 20, 65);
      ctx.fillText(`T = ${temperature} K`, 20, 80);
    } else {
      // Pressure cooker mode
      const cx = w / 2;
      const cy = h / 2;

      // Cooker body
      ctx.fillStyle = '#374151';
      ctx.fillRect(cx - 80, cy - 60, 160, 140);
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 3;
      ctx.strokeRect(cx - 80, cy - 60, 160, 140);

      // Lid
      if (lidClosed) {
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(cx - 85, cy - 70, 170, 15);
        ctx.fillStyle = '#ef4444';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔒 SEALED', cx, cy - 75);

        // Steam/pressure indicator
        const steamIntensity = (pressure - 1) * 5;
        for (let i = 0; i < steamIntensity; i++) {
          ctx.beginPath();
          ctx.arc(cx + Math.sin(time * 3 + i) * 30, cy - 80 - i * 5, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 200, 200, ${0.5 - i * 0.1})`;
          ctx.fill();
        }
      } else {
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(cx - 85, cy - 80, 170, 15);
        ctx.fillStyle = '#22c55e';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔓 OPEN', cx, cy - 85);
      }

      // Food items
      foods.forEach((food, idx) => {
        const fx = cx - 50 + idx * 50;
        const fy = cy + 20;
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(food.emoji, fx, fy);

        // Progress bar
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(fx - 15, fy + 10, 30, 6);
        const progressColor = food.burnt ? '#ef4444' : food.cooked ? '#22c55e' : '#f59e0b';
        ctx.fillStyle = progressColor;
        ctx.fillRect(fx - 15, fy + 10, 30 * Math.min(food.progress / 100, 1), 6);

        ctx.fillStyle = '#888';
        ctx.font = '8px sans-serif';
        ctx.fillText(food.burnt ? 'BURNT' : food.cooked ? 'DONE!' : `${Math.round(food.progress)}%`, fx, fy + 28);
      });

      // Temperature gauge
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 180, 80);
      ctx.fillStyle = temperature > 373 ? '#ef4444' : '#f59e0b';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Temp: ${temperature}K (${(temperature - 273).toFixed(0)}°C)`, 20, 30);
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText(`Pressure: ${pressure.toFixed(1)} atm`, 20, 50);
      ctx.fillText(`Volume: ${volume.toFixed(1)} L`, 20, 65);
      ctx.fillText(`Boiling point: ${(373 * pressure).toFixed(0)}K`, 20, 80);
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
    const p = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
    }));
    setParticles(p);
  }, []);

  useEffect(() => {
    let t = 0;
    const animate = () => {
      t += 0.05;
      setTime(t);
      setParticles(prev => prev.map(p => {
        let nx = p.x + p.vx * (temperature / 300);
        let ny = p.y + p.vy * (temperature / 300);
        let nvx = p.vx;
        let nvy = p.vy;
        if (nx < 0 || nx > 100) { nvx = -nvx; nx = Math.max(0, Math.min(100, nx)); }
        if (ny < 0 || ny > 100) { nvy = -nvy; ny = Math.max(0, Math.min(100, ny)); }
        return { x: nx, y: ny, vx: nvx, vy: nvy };
      }));
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [temperature]);

  useEffect(() => {
    if (mode !== 'cooker' || !lidClosed) return;
    const interval = setInterval(() => {
      setCookerTime(prev => {
        const next = prev + 1;
        setFoods(prevFoods => prevFoods.map(food => {
          if (food.cooked || food.burnt) return food;
          const newProgress = food.progress + (temperature / food.cookTemp) * (pressure * 2);
          if (newProgress >= 100 && temperature > food.cookTemp + 50) return { ...food, burnt: true, progress: 100 };
          if (newProgress >= 100) return { ...food, cooked: true, progress: 100 };
          return { ...food, progress: newProgress };
        }));
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [mode, lidClosed, temperature, pressure]);


  const handleComplete = () => {
    const updated = completeModule(progress, 'gas-laws', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  const allCooked = foods.every(f => f.cooked);
  const anyBurnt = foods.some(f => f.burnt);

  return (
    <ModuleWrapper moduleId="gas-laws" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🎈 Gas Laws Lab</h2>
          <p className="text-sm text-gray-400">Explore PV=nRT AND cook food in a pressure cooker!</p>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('explore')} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'explore' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>🔬 Explore PV=nRT</button>
          <button onClick={() => setMode('cooker')} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'cooker' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400'}`}>🍲 Pressure Cooker</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Pressure: {pressure} atm</label><input type="range" min="0.5" max="5" step="0.1" value={pressure} onChange={e => setPressure(Number(e.target.value))} className="w-full accent-blue-500" /></div>
            <div><label className="text-sm text-gray-400">Volume: {volume} L</label><input type="range" min="1" max="10" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full accent-blue-500" /></div>
            <div><label className="text-sm text-gray-400">Temperature: {temperature} K</label><input type="range" min="100" max="500" value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="w-full accent-blue-500" /></div>
            {mode === 'cooker' && (
              <button onClick={() => setLidClosed(prev => !prev)} className={`w-full py-2 rounded-lg text-sm font-bold ${lidClosed ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>{lidClosed ? '🔓 Open Lid' : '🔒 Close Lid'}</button>
            )}
            {mode === 'cooker' && allCooked && <p className="text-green-400 text-sm font-bold">🎉 All food cooked! +20 bonus XP!</p>}
            {mode === 'cooker' && anyBurnt && <p className="text-red-400 text-sm font-bold">💥 Something burnt! Lower the temp!</p>}
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
          </div>
        </div>

      </div>
    </ModuleWrapper>
  );
}
