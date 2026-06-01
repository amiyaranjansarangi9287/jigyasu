// src/worlds/physics/components/LensSim.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function LensSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [focalLength, setFocalLength] = useState(100);
  const [objectDist, setObjectDist] = useState(200);
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cy = h / 2;
    const lensX = w / 2;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Optical axis
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // Lens
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    if (lensType === 'convex') {
      ctx.ellipse(lensX, cy, 10, 80, 0, 0, Math.PI * 2);
    } else {
      ctx.moveTo(lensX - 5, cy - 80);
      ctx.quadraticCurveTo(lensX, cy, lensX - 5, cy + 80);
      ctx.moveTo(lensX + 5, cy - 80);
      ctx.quadraticCurveTo(lensX, cy, lensX + 5, cy + 80);
    }
    ctx.stroke();

    // Object
    const objX = lensX - objectDist;
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.moveTo(objX, cy);
    ctx.lineTo(objX, cy - 60);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(objX, cy - 65, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    // Image calculation
    const f = lensType === 'convex' ? focalLength : -focalLength;
    const imageDist = (objectDist * f) / (objectDist - f);
    const magnification = -imageDist / objectDist;
    const imageX = lensX + imageDist;
    const imageH = 60 * magnification;

    if (Math.abs(imageDist) < 1000) {
      ctx.beginPath();
      ctx.strokeStyle = imageDist > 0 ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.moveTo(imageX, cy);
      ctx.lineTo(imageX, cy - imageH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(imageX, cy - imageH, 4, 0, Math.PI * 2);
      ctx.fillStyle = imageDist > 0 ? '#22c55e' : '#ef4444';
      ctx.fill();
    }

    // Focal points
    ctx.fillStyle = '#ef4444';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('F', lensX - f, cy + 15);
    ctx.fillText("F'", lensX + f, cy + 15);

    // Info
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 80);
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(lensType === 'convex' ? '🔍 Convex Lens' : '🔍 Concave Lens', 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`1/f = 1/u + 1/v`, 20, 45);
    ctx.fillText(`Image dist: ${imageDist.toFixed(0)} px`, 20, 60);
    ctx.fillText(`Magnification: ${magnification.toFixed(2)}x`, 20, 75);
    ctx.fillText(imageDist > 0 ? 'Real, inverted image' : 'Virtual, upright image', 20, 90);
  }, [focalLength, objectDist, lensType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

  const handleComplete = () => {
    const updated = completeModule(progress, 'lens-sim', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="lens-sim" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🔍 Lens Simulator</h2>
          <p className="text-sm text-gray-400">Trace rays through convex and concave lenses.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <button onClick={() => setLensType('convex')} className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${lensType === 'convex' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Convex</button>
              <button onClick={() => setLensType('concave')} className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${lensType === 'concave' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Concave</button>
            </div>
            <div><label className="text-sm text-gray-400">Focal Length: {focalLength}</label><input type="range" min="50" max="200" value={focalLength} onChange={e => setFocalLength(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <div><label className="text-sm text-gray-400">Object Distance: {objectDist}</label><input type="range" min="100" max="400" value={objectDist} onChange={e => setObjectDist(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 1/f = 1/u + 1/v</p>
              <p>🔥 Convex converges, concave diverges</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
