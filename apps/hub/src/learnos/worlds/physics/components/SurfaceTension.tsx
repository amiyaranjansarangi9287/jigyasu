// src/worlds/physics/components/SurfaceTension.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface Target {
  x: number;
  y: number;
  radius: number;
  hit: boolean;
}

interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  active: boolean;
}

export default function SurfaceTension() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [surfaceTension, setSurfaceTension] = useState(0.5);
  const [dropSize, setDropSize] = useState(50);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState<'explore' | 'game'>('explore');
  const [targets, setTargets] = useState<Target[]>([]);
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const [mastery, setMastery] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);

  const quizQuestions = [
    { q: 'Why are water droplets spherical?', options: ['Gravity', 'Surface tension', 'Air pressure', 'Viscosity'], correct: 1 },
    { q: 'Adding soap to water _____ surface tension.', options: ['Increases', 'Decreases', 'Has no effect', 'Doubles'], correct: 1 },
    { q: 'Which insect walks on water using surface tension?', options: ['Ant', 'Water strider', 'Mosquito', 'Bee'], correct: 1 },
  ];

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cy = h / 2;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    if (mode === 'explore') {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.fillRect(0, cy, w, h - cy);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      for (let x = 0; x < w; x += 5) {
        const y = cy + Math.sin(x * 0.02 + time * 2) * 5 * surfaceTension;
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      const dropRadius = dropSize / 3;
      const dropX = w / 2;
      const dropY = cy - dropRadius - 30;
      ctx.beginPath();
      ctx.ellipse(dropX, dropY, dropRadius * 0.8, dropRadius, 0, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(dropX - dropRadius * 0.3, dropY - dropRadius * 0.3, 0, dropX, dropY, dropRadius);
      gradient.addColorStop(0, 'rgba(100, 200, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.2)');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();

      for (let x = 50; x < w - 50; x += 30) {
        const y = cy + Math.sin(x * 0.02 + time * 2) * 5 * surfaceTension;
        ctx.beginPath();
        ctx.arc(x, y - 5, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
        ctx.fill();
        if (x < w - 80) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
          ctx.lineWidth = 1;
          ctx.moveTo(x + 3, y - 5);
          ctx.lineTo(x + 27, y - 5);
          ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 220, 70);
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`💧 Surface Tension: ${surfaceTension.toFixed(2)}`, 20, 30);
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText(`Drop size: ${dropSize} μL`, 20, 50);
      ctx.fillText('Molecules pull inward → spherical drops', 20, 65);
      ctx.fillText('Water striders walk on water!', 20, 80);
    } else {
      // Game mode
      // Water surface
      ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.fillRect(0, cy, w, h - cy);

      // Targets
      targets.forEach(t => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.strokeStyle = t.hit ? '#22c55e' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        if (!t.hit) {
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ef4444';
          ctx.fill();
        } else {
          ctx.fillStyle = '#22c55e';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('✓', t.x, t.y + 5);
        }
      });

      // Droplets
      droplets.forEach(d => {
        if (!d.active) return;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(d.x - d.radius * 0.3, d.y - d.radius * 0.3, 0, d.x, d.y, d.radius);
        gradient.addColorStop(0, 'rgba(100, 200, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Score
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 150, 40);
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Mastery: ${mastery}/${targets.length}`, 20, 35);

      if (targets.every(t => t.hit)) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(w / 2 - 100, h / 2 - 20, 200, 40);
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 All targets hit!', w / 2, h / 2 + 5);
      }
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
    if (mode === 'game' && targets.length === 0) {
      const newTargets: Target[] = Array.from({ length: 5 }, (_, i) => ({
        x: 100 + i * 130,
        y: 100 + Math.random() * 100,
        radius: 20 + Math.random() * 15,
        hit: false,
      }));
      setTargets(newTargets);
    }
  }, [mode, targets.length]);

  useEffect(() => {
    let t = time;
    const animate = () => {
      t += 0.05;
      setTime(t);

      if (mode === 'game') {
        setDroplets(prev => {
          const updated = prev.map(d => {
            if (!d.active) return d;
            const nx = d.x + d.vx;
            const ny = d.y + d.vy;
            const canvas = canvasRef.current;
            if (!canvas) return d;
            const h = canvas.height / 2;

            // Check target hits
            let hitTarget = false;
            setTargets(prevTargets => {
              return prevTargets.map(target => {
                if (target.hit) return target;
                const dist = Math.sqrt((nx - target.x) ** 2 + (ny - target.y) ** 2);
                if (dist < target.radius + d.radius) {
                  hitTarget = true;
                  setMastery(m => m + 1);
                  return { ...target, hit: true };
                }
                return target;
              });
            });

            if (hitTarget || ny > h || nx < 0 || nx > (canvas?.width || 700)) {
              return { ...d, active: false };
            }
            return { ...d, x: nx, y: ny, vy: d.vy + 0.2 };
          });
          return updated;
        });
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [mode, time]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'game') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * 2;

    const newDroplet: Droplet = {
      x: canvas.width / 2,
      y: 30,
      vx: (x - canvas.width / 2) * 0.02,
      vy: 2,
      radius: 8 + surfaceTension * 10,
      active: true,
    };
    setDroplets(prev => [...prev, newDroplet]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (mode !== 'game') return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const newDroplet: Droplet = {
        x: canvas.width / 2,
        y: 30,
        vx: (Math.random() - 0.5) * 5, // Random spread for keyboard users
        vy: 2,
        radius: 8 + surfaceTension * 10,
        active: true,
      };
      setDroplets(prev => [...prev, newDroplet]);
    }
  };

  const handleQuiz = (idx: number) => {
    setQuizAnswer(idx.toString());
    setQuizCorrect(idx === quizQuestions[currentQuiz].correct);
    if (idx === quizQuestions[currentQuiz].correct) {
      const updated = completeModule(progress, 'surface-tension', 90);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'surface-tension', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="surface-tension" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">💧 Surface Tension Lab</h2>
          <p className="text-sm text-gray-400">Explore surface tension AND hit targets with water droplets!</p>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => { setMode('explore'); setTargets([]); setDroplets([]); setMastery(0); }} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'explore' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}>🔬 Explore</button>
          <button onClick={() => { setMode('game'); setTargets([]); setDroplets([]); setMastery(0); }} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'game' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}>🎯 Droplet Game</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="sr-only" aria-live="polite">
              {mode === 'game' ? 'Droplet Game Mode. Press Space to launch droplets randomly.' : 'Explore Mode. Adjust sliders below.'}
            </div>
            <canvas 
              ref={canvasRef} 
              onClick={handleClick} 
              onKeyDown={handleKeyDown}
              tabIndex={0}
              aria-label="Surface tension interactive area"
              role="application"
              className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950 cursor-crosshair focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900" 
            />
          </div>
          <div className="space-y-4">
            {mode === 'explore' && (
              <>
                <div><label className="text-sm text-gray-400">Surface Tension: {surfaceTension.toFixed(2)}</label><input type="range" min="0.1" max="1" step="0.01" value={surfaceTension} onChange={e => setSurfaceTension(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
                <div><label className="text-sm text-gray-400">Drop Size: {dropSize} μL</label><input type="range" min="20" max="100" value={dropSize} onChange={e => setDropSize(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
              </>
            )}
            {mode === 'game' && (
              <>
                <p className="text-sm text-gray-400">Click to launch droplets!</p>
                <p className="text-sm text-gray-400">Higher tension = bigger droplets</p>
                <button onClick={() => { setTargets([]); setDroplets([]); setMastery(0); }} className="w-full py-2 rounded-lg bg-gray-700 text-white text-sm font-bold">🔄 Reset Game</button>
              </>
            )}
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gray-900 border border-cyan-500/20">
          <h3 className="text-lg font-bold text-cyan-400 mb-3">🧠 Challenge: Test Your Knowledge</h3>
          <p className="text-sm text-gray-300 mb-4">{quizQuestions[currentQuiz].q}</p>
          <div className="grid grid-cols-2 gap-3">
            {quizQuestions[currentQuiz].options.map((opt, idx) => (
              <button key={idx} onClick={() => handleQuiz(idx)} disabled={quizCorrect === true} className={`py-3 rounded-xl text-sm font-bold transition-all ${quizAnswer === idx.toString() ? quizCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} disabled:opacity-50`}>{opt}</button>
            ))}
          </div>
          {quizCorrect === true && <p className="mt-3 text-green-400 font-bold text-sm">✅ Correct! +10 bonus XP!</p>}
          {quizCorrect === false && <p className="mt-3 text-red-400 font-bold text-sm">🤔 Answer: {quizQuestions[currentQuiz].options[quizQuestions[currentQuiz].correct]}</p>}
          {quizCorrect === true && currentQuiz < quizQuestions.length - 1 && <button onClick={() => { setCurrentQuiz(prev => prev + 1); setQuizAnswer(null); setQuizCorrect(null); }} className="mt-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm">Next Question →</button>}
        </div>
      </div>
    </ModuleWrapper>
  );
}
