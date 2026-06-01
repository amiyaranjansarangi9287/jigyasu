// src/worlds/physics/components/OhmsLaw.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function OhmsLaw() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [voltage, setVoltage] = useState(9);
  const [resistance, setResistance] = useState(100);
  const current = voltage / resistance;
  const power = voltage * current;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Circuit visualization
    const cx = w / 2;
    const cy = h / 2;

    // Battery
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 120, cy - 20, 30, 40);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${voltage}V`, cx - 105, cy + 5);

    // Wire
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.moveTo(cx - 90, cy);
    ctx.lineTo(cx + 90, cy);
    ctx.stroke();

    // Resistor
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(cx - 20, cy - 10, 40, 20);
    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.fillText(`${resistance}Ω`, cx, cy + 25);

    // Current flow arrows
    const arrowCount = Math.floor(current * 100);
    for (let i = 0; i < Math.min(arrowCount, 10); i++) {
      const x = cx - 80 + i * 20;
      ctx.fillStyle = '#fbbf24';
      ctx.font = '14px sans-serif';
      ctx.fillText('⚡', x, cy - 15);
    }

    // Ohm's Law triangle
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 180, 100);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText("V = I × R", 20, 35);
    ctx.fillStyle = '#888';
    ctx.font = '11px sans-serif';
    ctx.fillText(`I = ${current.toFixed(4)} A`, 20, 55);
    ctx.fillText(`P = ${power.toFixed(3)} W`, 20, 70);
    ctx.fillText(`V = ${voltage} V`, 20, 85);
    ctx.fillText(`R = ${resistance} Ω`, 20, 100);

    // Graph
    const graphX = w - 200;
    const graphY = 20;
    const graphW = 180;
    const graphH = 120;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(graphX - 10, graphY - 10, graphW + 20, graphH + 30);
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.strokeRect(graphX, graphY, graphW, graphH);

    // V-I line
    ctx.beginPath();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.moveTo(graphX, graphY + graphH);
    ctx.lineTo(graphX + graphW, graphY);
    ctx.stroke();

    // Current point
    const px = graphX + (current / 0.2) * graphW;
    const py = graphY + graphH - (voltage / 20) * graphH;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    ctx.fillStyle = '#888';
    ctx.font = '9px sans-serif';
    ctx.fillText('V-I Graph', graphX + 60, graphY + graphH + 15);
  }, [voltage, resistance, current, power]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

  const handleComplete = () => {
    const updated = completeModule(progress, 'ohms-law', 85);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="ohms-law" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">⚡ Ohm's Law Lab</h2>
          <p className="text-sm text-gray-400">Explore the relationship between Voltage, Current, and Resistance.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Voltage: {voltage}V</label><input type="range" min="1" max="20" value={voltage} onChange={e => setVoltage(Number(e.target.value))} className="w-full accent-yellow-500" /></div>
            <div><label className="text-sm text-gray-400">Resistance: {resistance}Ω</label><input type="range" min="10" max="1000" value={resistance} onChange={e => setResistance(Number(e.target.value))} className="w-full accent-yellow-500" /></div>
            <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
              <p className="text-sm text-yellow-400 font-bold">I = V/R = {current.toFixed(4)} A</p>
              <p className="text-sm text-gray-500 mt-1">Power: {power.toFixed(3)} W</p>
            </div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 More V = more current</p>
              <p>🔥 More R = less current</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
