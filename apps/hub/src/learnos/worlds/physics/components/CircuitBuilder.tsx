// src/worlds/physics/components/CircuitBuilder.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function CircuitBuilder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [voltage, setVoltage] = useState(9);
  const [resistance, setResistance] = useState(100);
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');
  const [r2, setR2] = useState(200);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const size = 150;

    // Circuit path
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.rect(cx - size, cy - size / 2, size * 2, size);
    ctx.stroke();

    // Battery
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - size - 10, cy - 15, 20, 30);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(cx - size + 10, cy - 20, 10, 40);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${voltage}V`, cx - size, cy + 35);

    // Resistor(s)
    const drawResistor = (x: number, y: number, r: number, label: string) => {
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(x - 20, y - 8, 40, 16);
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText(label, x, y - 12);
      ctx.fillText(`${r}Ω`, x, y + 22);
    };

    if (circuitType === 'series') {
      drawResistor(cx, cy - size / 2, resistance, 'R₁');
      drawResistor(cx + 80, cy - size / 2, r2, 'R₂');
      const totalR = resistance + r2;
      const current = voltage / totalR;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 200, 70);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`R_total = ${totalR}Ω`, 20, 30);
      ctx.fillText(`I = ${current.toFixed(3)} A`, 20, 45);
      ctx.fillText(`V₁ = ${(current * resistance).toFixed(2)}V`, 20, 60);
      ctx.fillText(`V₂ = ${(current * r2).toFixed(2)}V`, 20, 75);
    } else {
      drawResistor(cx - 50, cy - size / 2, resistance, 'R₁');
      drawResistor(cx + 50, cy - size / 2, r2, 'R₂');
      const totalR = (resistance * r2) / (resistance + r2);
      const totalI = voltage / totalR;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 200, 70);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`R_total = ${totalR.toFixed(1)}Ω`, 20, 30);
      ctx.fillText(`I_total = ${totalI.toFixed(3)} A`, 20, 45);
      ctx.fillText(`I₁ = ${(voltage / resistance).toFixed(3)} A`, 20, 60);
      ctx.fillText(`I₂ = ${(voltage / r2).toFixed(3)} A`, 20, 75);
    }

    // Current flow animation
    ctx.fillStyle = '#fbbf24';
    ctx.font = '20px sans-serif';
    ctx.fillText('⚡', cx + size - 10, cy + 5);
  }, [voltage, resistance, circuitType, r2]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

  const handleComplete = () => {
    const updated = completeModule(progress, 'circuit-builder', 85);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="circuit-builder" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">💡 Circuit Builder</h2>
          <p className="text-sm text-gray-400">Build series and parallel circuits, see Ohm's Law in action!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Voltage: {voltage}V</label><input type="range" min="1" max="24" value={voltage} onChange={e => setVoltage(Number(e.target.value))} className="w-full accent-yellow-500" /></div>
            <div><label className="text-sm text-gray-400">R₁: {resistance}Ω</label><input type="range" min="10" max="1000" value={resistance} onChange={e => setResistance(Number(e.target.value))} className="w-full accent-yellow-500" /></div>
            <div><label className="text-sm text-gray-400">R₂: {r2}Ω</label><input type="range" min="10" max="1000" value={r2} onChange={e => setR2(Number(e.target.value))} className="w-full accent-yellow-500" /></div>
            <div className="flex gap-2">
              <button onClick={() => setCircuitType('series')} className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${circuitType === 'series' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Series</button>
              <button onClick={() => setCircuitType('parallel')} className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${circuitType === 'parallel' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Parallel</button>
            </div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Series: R_total = R₁ + R₂</p>
              <p>🔥 Parallel: 1/R = 1/R₁ + 1/R₂</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
