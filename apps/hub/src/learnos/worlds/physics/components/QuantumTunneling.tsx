// src/worlds/physics/components/QuantumTunneling.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface Barrier {
  x: number;
  width: number;
  height: number;
}

export default function QuantumTunneling() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [barrierHeight, setBarrierHeight] = useState(50);
  const [barrierWidth, setBarrierWidth] = useState(50);
  const [particleEnergy, setParticleEnergy] = useState(30);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState<'explore' | 'puzzle'>('explore');
  const [level, setLevel] = useState(0);
  const [particleX, setParticleX] = useState(50);
  const [tunnelled, setTunnelled] = useState(false);
  const [puzzleScore, setPuzzleScore] = useState(0);

  const levels: Barrier[] = [
    { x: 200, width: 30, height: 30 },
    { x: 200, width: 50, height: 40 },
    { x: 180, width: 60, height: 50 },
    { x: 150, width: 80, height: 60 },
    { x: 120, width: 100, height: 70 },
  ];

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
      const barrierX = w / 2 - barrierWidth / 2;
      const barrierY = h / 2 - barrierHeight;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.fillRect(barrierX, barrierY, barrierWidth, barrierHeight * 2);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(barrierX, barrierY, barrierWidth, barrierHeight * 2);

      const energyY = h / 2 - particleEnergy;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.moveTo(0, energyY);
      ctx.lineTo(w, energyY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      for (let x = 0; x < w; x++) {
        let amp = 30;
        if (x > barrierX && x < barrierX + barrierWidth) {
          amp = 30 * Math.exp(-((x - barrierX) / barrierWidth) * 3);
        } else if (x >= barrierX + barrierWidth) {
          amp = 30 * Math.exp(-3) * (particleEnergy > barrierHeight ? 1 : 0.3);
        }
        const y = h / 2 + amp * Math.sin(x * 0.05 + time * 3);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      const px = (time * 50) % w;
      ctx.beginPath();
      ctx.arc(px, h / 2, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      const tunnelProb = particleEnergy > barrierHeight ? 1 : Math.exp(-barrierWidth * 0.05 * (barrierHeight - particleEnergy));
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 220, 70);
      ctx.fillStyle = tunnelProb > 0.1 ? '#22c55e' : '#ef4444';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Tunnel Probability: ${(tunnelProb * 100).toFixed(1)}%`, 20, 30);
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText(`E = ${particleEnergy} | V₀ = ${barrierHeight}`, 20, 50);
      ctx.fillText('Quantum particles can pass through!', 20, 65);
      ctx.fillText('Stokes Law: F = 6πηrv', 20, 80);
    } else {
      // Puzzle mode
      const currentLevel = levels[level];
      if (!currentLevel) return;

      // Barrier
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.fillRect(currentLevel.x, h / 2 - currentLevel.height, currentLevel.width, currentLevel.height * 2);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(currentLevel.x, h / 2 - currentLevel.height, currentLevel.width, currentLevel.height * 2);

      // Goal
      ctx.beginPath();
      ctx.arc(w - 50, h / 2, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e';
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GOAL', w - 50, h / 2 + 20);

      // Particle
      ctx.beginPath();
      ctx.arc(particleX, h / 2, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Wave function visualization
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
      ctx.lineWidth = 2;
      for (let x = 0; x < w; x++) {
        let amp = 15;
        if (x > currentLevel.x && x < currentLevel.x + currentLevel.width) {
          amp = 15 * Math.exp(-((x - currentLevel.x) / currentLevel.width) * (currentLevel.height / 20));
        } else if (x >= currentLevel.x + currentLevel.width) {
          amp = 15 * Math.exp(-(currentLevel.height / 20));
        }
        const y = h / 2 + amp * Math.sin(x * 0.08 + time * 4);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Info
      const tunnelProb = Math.exp(-(currentLevel.height / 20) * (currentLevel.width / 30));
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 220, 60);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`🌀 Level ${level + 1}/${levels.length}`, 20, 30);
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText(`Barrier: ${currentLevel.height}h × ${currentLevel.width}w`, 20, 50);
      ctx.fillText(`Tunnel chance: ${(tunnelProb * 100).toFixed(1)}%`, 20, 65);
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
      t += 0.03;
      setTime(t);

      if (mode === 'puzzle') {
        setParticleX(prev => {
          const next = prev + 2;
          const currentLevel = levels[level];
          if (currentLevel && next >= currentLevel.x + currentLevel.width) {
            const tunnelProb = Math.exp(-(currentLevel.height / 20) * (currentLevel.width / 30));
            if (Math.random() < tunnelProb && !tunnelled) {
              setTunnelled(true);
              setPuzzleScore(s => s + 1);
              if (level < levels.length - 1) {
                setTimeout(() => {
                  setLevel(l => l + 1);
                  setParticleX(50);
                  setTunnelled(false);
                }, 1000);
              } else {
                const updated = completeModule(progress, 'quantum-tunneling', 100);
                setProgress(updated);
                saveProgress(updated);
              }
            } else if (Math.random() < 0.02) {
              setParticleX(50);
              setTunnelled(false);
            }
          }
          if (next > 700) return 50;
          return next;
        });
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [mode, level, tunnelled, progress]);

  const handleComplete = () => {
    const updated = completeModule(progress, 'quantum-tunneling', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="quantum-tunneling" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🌀 Quantum Tunneling</h2>
          <p className="text-sm text-gray-400">Watch particles tunnel through barriers — and play the puzzle!</p>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('explore')} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'explore' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}>🔬 Explore</button>
          <button onClick={() => { setMode('puzzle'); setLevel(0); setParticleX(50); setPuzzleScore(0); setTunnelled(false); }} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'puzzle' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}>🧩 Tunnel Puzzle</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            {mode === 'explore' && (
              <>
                <div><label className="text-sm text-gray-400">Barrier Height: {barrierHeight}</label><input type="range" min="10" max="100" value={barrierHeight} onChange={e => setBarrierHeight(Number(e.target.value))} className="w-full accent-purple-500" /></div>
                <div><label className="text-sm text-gray-400">Barrier Width: {barrierWidth}</label><input type="range" min="20" max="100" value={barrierWidth} onChange={e => setBarrierWidth(Number(e.target.value))} className="w-full accent-purple-500" /></div>
                <div><label className="text-sm text-gray-400">Particle Energy: {particleEnergy}</label><input type="range" min="10" max="100" value={particleEnergy} onChange={e => setParticleEnergy(Number(e.target.value))} className="w-full accent-purple-500" /></div>
              </>
            )}
            {mode === 'puzzle' && (
              <>
                <p className="text-sm text-gray-400">Level: {level + 1}/{levels.length}</p>
                <p className="text-sm text-gray-400">Tunnelled: {puzzleScore}</p>
                <p className="text-sm text-gray-500">Particle auto-moves. Thinner/lower barriers = easier tunneling!</p>
              </>
            )}
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Thinner barrier = more tunneling</p>
              <p>🔥 Used in flash memory & STM!</p>
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  );
}
