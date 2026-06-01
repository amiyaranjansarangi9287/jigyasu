// src/worlds/physics/components/MagneticFields.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function MagneticFields() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [strength, setStrength] = useState(5);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [showCompass, setShowCompass] = useState(true);
  const [time, setTime] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Field lines
    if (showFieldLines) {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + strength * 0.05})`;
        ctx.lineWidth = 1;
        for (let r = 30; r < 250; r += 5) {
          const x = cx + Math.cos(angle + r * 0.01) * (r + strength * 5);
          const y = cy + Math.sin(angle + r * 0.01) * (r * 0.5);
          r === 30 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    // Magnet
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 40, cy - 15, 40, 30);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(cx, cy - 15, 40, 30);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', cx - 20, cy + 6);
    ctx.fillText('S', cx + 20, cy + 6);

    // Compass needles
    if (showCompass) {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time * 0.5;
        const dist = 100 + strength * 10;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const needleAngle = angle + Math.PI / 2;
        ctx.beginPath();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.moveTo(x - Math.cos(needleAngle) * 10, y - Math.sin(needleAngle) * 10);
        ctx.lineTo(x + Math.cos(needleAngle) * 10, y + Math.sin(needleAngle) * 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
      }
    }

    // Info
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 200, 50);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Strength: ${strength}`, 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText('Field lines: N → S', 20, 45);
    ctx.fillText('Like poles repel, opposite attract', 20, 55);
  }, [strength, showFieldLines, showCompass, time]);

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
      t += 0.02;
      setTime(t);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleComplete = () => {
    const updated = completeModule(progress, 'magnetic-fields', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="magnetic-fields" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🧲 Magnetic Fields Visualizer</h2>
          <p className="text-sm text-gray-400">See magnetic field lines and how compass needles align.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Strength: {strength}</label><input type="range" min="1" max="10" value={strength} onChange={e => setStrength(Number(e.target.value))} className="w-full accent-red-500" /></div>
            <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" checked={showFieldLines} onChange={e => setShowFieldLines(e.target.checked)} className="accent-red-500" />Field Lines</label>
            <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" checked={showCompass} onChange={e => setShowCompass(e.target.checked)} className="accent-red-500" />Compass Needles</label>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Field lines: N → S</p>
              <p>🧲 Like poles repel!</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
