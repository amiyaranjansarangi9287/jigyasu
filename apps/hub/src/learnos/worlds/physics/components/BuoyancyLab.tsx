// src/worlds/physics/components/BuoyancyLab.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function BuoyancyLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [objectDensity, setObjectDensity] = useState(0.5);
  const [objectVolume, setObjectVolume] = useState(50);
  const [fluidDensity, setFluidDensity] = useState(1.0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Fluid
    const fluidY = h / 2;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.fillRect(0, fluidY, w, h - fluidY);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, fluidY);
    ctx.lineTo(w, fluidY);
    ctx.stroke();

    // Object
    const floats = objectDensity < fluidDensity;
    const submerged = floats ? objectDensity / fluidDensity : 1;
    const objSize = objectVolume / 2;
    const objX = w / 2 - objSize / 2;
    const objY = floats ? fluidY - objSize * (1 - submerged) : fluidY + 20;

    ctx.fillStyle = floats ? '#22c55e' : '#ef4444';
    ctx.fillRect(objX, objY, objSize, objSize);
    ctx.strokeStyle = floats ? '#4ade80' : '#f87171';
    ctx.lineWidth = 2;
    ctx.strokeRect(objX, objY, objSize, objSize);

    // Density label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${objectDensity} g/cm³`, objX + objSize / 2, objY + objSize / 2 + 4);

    // Forces
    const weight = objectDensity * objectVolume * 0.1;
    const buoyancy = fluidDensity * objectVolume * submerged * 0.1;

    // Weight arrow (down)
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.moveTo(objX + objSize / 2, objY + objSize);
    ctx.lineTo(objX + objSize / 2, objY + objSize + weight * 2);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.font = '10px sans-serif';
    ctx.fillText(`W=${weight.toFixed(1)}N`, objX + objSize / 2 + 30, objY + objSize + weight);

    // Buoyancy arrow (up)
    ctx.beginPath();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.moveTo(objX + objSize / 2, objY);
    ctx.lineTo(objX + objSize / 2, objY - buoyancy * 2);
    ctx.stroke();
    ctx.fillStyle = '#22c55e';
    ctx.fillText(`B=${buoyancy.toFixed(1)}N`, objX + objSize / 2 + 30, objY - buoyancy);

    // Info
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 70);
    ctx.fillStyle = floats ? '#22c55e' : '#ef4444';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(floats ? '🚢 FLOATS!' : '⬇️ SINKS!', 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`ρ_object = ${objectDensity} | ρ_fluid = ${fluidDensity}`, 20, 50);
    ctx.fillText(`Submerged: ${(submerged * 100).toFixed(0)}%`, 20, 65);
    ctx.fillText('Archimedes: B = weight of displaced fluid', 20, 80);
  }, [objectDensity, objectVolume, fluidDensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

  const handleComplete = () => {
    const updated = completeModule(progress, 'buoyancy-lab', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="buoyancy-lab" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🚢 Buoyancy Lab</h2>
          <p className="text-sm text-gray-400">Explore Archimedes' principle — why objects float or sink!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Object Density: {objectDensity} g/cm³</label><input type="range" min="0.1" max="3" step="0.1" value={objectDensity} onChange={e => setObjectDensity(Number(e.target.value))} className="w-full accent-blue-500" /></div>
            <div><label className="text-sm text-gray-400">Volume: {objectVolume} cm³</label><input type="range" min="20" max="100" value={objectVolume} onChange={e => setObjectVolume(Number(e.target.value))} className="w-full accent-blue-500" /></div>
            <div><label className="text-sm text-gray-400">Fluid Density: {fluidDensity} g/cm³</label><input type="range" min="0.5" max="2" step="0.1" value={fluidDensity} onChange={e => setFluidDensity(Number(e.target.value))} className="w-full accent-blue-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 ρ_object {'<'} ρ_fluid → floats</p>
              <p>🔥 Ships float because they displace water!</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
