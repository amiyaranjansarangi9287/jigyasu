// src/worlds/physics/components/AtomicStructure.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';
import { useTranslation } from 'react-i18next';

const ELEMENTS: Record<number, { name: string; symbol: string; protons: number; neutrons: number; electrons: number; shells: number[] }> = {
  1: { name: 'Hydrogen', symbol: 'H', protons: 1, neutrons: 0, electrons: 1, shells: [1] },
  2: { name: 'Helium', symbol: 'He', protons: 2, neutrons: 2, electrons: 2, shells: [2] },
  3: { name: 'Lithium', symbol: 'Li', protons: 3, neutrons: 4, electrons: 3, shells: [2, 1] },
  6: { name: 'Carbon', symbol: 'C', protons: 6, neutrons: 6, electrons: 6, shells: [2, 4] },
  8: { name: 'Oxygen', symbol: 'O', protons: 8, neutrons: 8, electrons: 8, shells: [2, 6] },
  10: { name: 'Neon', symbol: 'Ne', protons: 10, neutrons: 10, electrons: 10, shells: [2, 8] },
  11: { name: 'Sodium', symbol: 'Na', protons: 11, neutrons: 12, electrons: 11, shells: [2, 8, 1] },
  26: { name: 'Iron', symbol: 'Fe', protons: 26, neutrons: 30, electrons: 26, shells: [2, 8, 14, 2] },
};

export default function AtomicStructure() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [atomicNumber, setAtomicNumber] = useState(6);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState<'explore' | 'build'>('explore');
  const [userProtons, setUserProtons] = useState(0);
  const [_userNeutrons, setUserNeutrons] = useState(0);
  const [userElectrons, setUserElectrons] = useState(0);
  const [targetElement, setTargetElement] = useState(6);
  const [_built, setBuilt] = useState(false);
  const [buildScore, setBuildScore] = useState(0);


  const draw = () => {
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

    if (mode === 'explore') {
      const el = ELEMENTS[atomicNumber];
      const shells = el.shells;

      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${el.protons}p`, cx, cy + 4);

      shells.forEach((electrons, i) => {
        const radius = 40 + i * 35;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        for (let j = 0; j < electrons; j++) {
          const angle = (j / electrons) * Math.PI * 2 + time * (1 + i * 0.5);
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
        }
      });

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 200, 60);
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`⚛️ ${el.name} (${el.symbol})`, 20, 30);
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText(`p=${el.protons} n=${el.neutrons} e=${el.electrons}`, 20, 50);
      ctx.fillText(`Shells: ${shells.join(', ')}`, 20, 65);
    } else {
      // Build mode
      const target = ELEMENTS[targetElement];
      const isCorrect = userProtons === target.protons && userElectrons === target.electrons;

      // User's atom
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.fillStyle = userProtons === target.protons ? '#22c55e' : '#ef4444';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${userProtons}p`, cx, cy + 4);

      // Electron shells
      const maxShells = userElectrons <= 2 ? 1 : userElectrons <= 10 ? 2 : 3;
      for (let i = 0; i < maxShells; i++) {
        const radius = 40 + i * 35;
        const shellCapacity = i === 0 ? 2 : 8;
        const shellElectrons = Math.min(Math.max(0, userElectrons - i * 8), shellCapacity);

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        for (let j = 0; j < shellElectrons; j++) {
          const angle = (j / shellElectrons) * Math.PI * 2 + time * (1 + i * 0.5);
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
        }
      }

      // Target info
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 200, 80);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`🎯 Build: ${target.name}`, 20, 30);
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText(`Need: p=${target.protons} e=${target.electrons}`, 20, 50);
      ctx.fillText(`You have: p=${userProtons} e=${userElectrons}`, 20, 65);
      ctx.fillStyle = isCorrect ? '#22c55e' : '#ef4444';
      ctx.fillText(isCorrect ? '✅ Correct!' : '🤔 Keep trying!', 20, 80);
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
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleBuild = () => {
    const target = ELEMENTS[targetElement];
    if (userProtons === target.protons && userElectrons === target.electrons) {
      setBuilt(true);
      setBuildScore(prev => prev + 1);
      const updated = completeModule(progress, 'atomic-structure', 95);
      setProgress(updated);
      saveProgress(updated);
      setTimeout(() => {
        const keys = Object.keys(ELEMENTS).map(Number);
        setTargetElement(keys[Math.floor(Math.random() * keys.length)]);
        setUserProtons(0);
        setUserElectrons(0);
        setUserNeutrons(0);
        setBuilt(false);
      }, 2000);
    }
  };


  const handleComplete = () => {
    const updated = completeModule(progress, 'atomic-structure', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="atomic-structure" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">⚛️ Build-an-Atom</h2>
          <p className="text-sm text-gray-400">Explore atoms AND build them from scratch!</p>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('explore')} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'explore' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}>🔬 Explore</button>
          <button onClick={() => setMode('build')} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'build' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}>🏗️ Build Challenge</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            {mode === 'explore' && (
              <div><label className="text-sm text-gray-400">Atomic Number: {atomicNumber}</label><input type="range" min="1" max="26" value={atomicNumber} onChange={e => setAtomicNumber(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            )}
            {mode === 'build' && (
              <>
                <div><label className="text-sm text-gray-400">Protons: {userProtons}</label><input type="range" min="0" max="26" value={userProtons} onChange={e => setUserProtons(Number(e.target.value))} className="w-full accent-red-500" /></div>
                <div><label className="text-sm text-gray-400">Electrons: {userElectrons}</label><input type="range" min="0" max="26" value={userElectrons} onChange={e => setUserElectrons(Number(e.target.value))} className="w-full accent-blue-500" /></div>
                <button onClick={handleBuild} className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold text-sm">🔬 Check Atom</button>
                <p className="text-sm text-gray-500">Built: {buildScore} atoms</p>
              </>
            )}
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
          </div>
        </div>

      </div>
    </ModuleWrapper>
  );
}
