// src/worlds/physics/components/MirrorLab.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function MirrorLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [focalLength, setFocalLength] = useState(100);
  const [objectDist, setObjectDist] = useState(200);
  const [mirrorType, setMirrorType] = useState<'concave' | 'convex'>('concave');

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cy = h / 2;
    const mirrorX = w / 2;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Optical axis
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // Mirror
    ctx.beginPath();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    const radius = focalLength * 2;
    if (mirrorType === 'concave') {
      ctx.arc(mirrorX + radius, cy, radius, Math.PI * 0.7, Math.PI * 1.3);
    } else {
      ctx.arc(mirrorX - radius, cy, radius, -Math.PI * 0.3, Math.PI * 0.3);
    }
    ctx.stroke();

    // Object
    const objX = mirrorX - objectDist;
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.moveTo(objX, cy);
    ctx.lineTo(objX, cy - 60);
    ctx.stroke();

    // Image
    const f = mirrorType === 'concave' ? focalLength : -focalLength;
    const imageDist = (objectDist * f) / (objectDist - f);
    const magnification = -imageDist / objectDist;
    const imageX = mirrorX - imageDist;
    const imageH = 60 * magnification;

    ctx.beginPath();
    ctx.strokeStyle = imageDist > 0 ? '#22c55e' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.moveTo(imageX, cy);
    ctx.lineTo(imageX, cy - imageH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Info
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 200, 70);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(mirrorType === 'concave' ? '🪞 Concave Mirror' : '🪞 Convex Mirror', 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Image dist: ${imageDist.toFixed(0)}`, 20, 50);
    ctx.fillText(`Magnification: ${magnification.toFixed(2)}x`, 20, 65);
  }, [focalLength, objectDist, mirrorType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

  const handleComplete = () => {
    const updated = completeModule(progress, 'mirror-lab', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="mirror-lab" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🪞 Mirror Lab</h2>
          <p className="text-sm text-gray-400">Explore image formation in concave and convex mirrors.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <button onClick={() => setMirrorType('concave')} className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${mirrorType === 'concave' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Concave</button>
              <button onClick={() => setMirrorType('convex')} className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${mirrorType === 'convex' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Convex</button>
            </div>
            <div><label className="text-sm text-gray-400">Focal Length: {focalLength}</label><input type="range" min="50" max="200" value={focalLength} onChange={e => setFocalLength(Number(e.target.value))} className="w-full accent-gray-500" /></div>
            <div><label className="text-sm text-gray-400">Object Distance: {objectDist}</label><input type="range" min="100" max="400" value={objectDist} onChange={e => setObjectDist(Number(e.target.value))} className="w-full accent-gray-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Same formula as lenses!</p>
              <p>🔥 Concave: real or virtual images</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
