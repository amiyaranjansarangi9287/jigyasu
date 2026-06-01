// src/worlds/physics/components/Viscosity.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface Racer {
  id: number;
  x: number;
  y: number;
  fluid: string;
  viscosity: number;
  finished: boolean;
  time: number;
}

const FLUIDS = [
  { name: 'Water', viscosity: 0.1, color: '#3b82f6', emoji: '💧' },
  { name: 'Oil', viscosity: 0.4, color: '#eab308', emoji: '🛢️' },
  { name: 'Honey', viscosity: 0.7, color: '#f59e0b', emoji: '🍯' },
  { name: 'Syrup', viscosity: 0.9, color: '#ef4444', emoji: '🥞' },
];

export default function Viscosity() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [viscosity, setViscosity] = useState(0.5);
  const [angle, setAngle] = useState(30);
  const [time, setTime] = useState(0);
  const [ballPos, setBallPos] = useState(0);
  const [mode, setMode] = useState<'explore' | 'race'>('explore');
  const [racers, setRacers] = useState<Racer[]>([]);
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);

  const quizQuestions = [
    { q: 'Which fluid has the highest viscosity?', options: ['Water', 'Honey', 'Air', 'Alcohol'], correct: 1 },
    { q: 'Stokes Law applies to objects moving through:', options: ['Vacuum', 'Viscous fluid', 'Electric field', 'Magnetic field'], correct: 1 },
    { q: 'Unit of dynamic viscosity is:', options: ['Pascal-second', 'Newton', 'Joule', 'Watt'], correct: 0 },
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
      const tubeY = h / 2;
      ctx.fillStyle = 'rgba(100, 200, 255, 0.1)';
      ctx.fillRect(50, tubeY - 20, w - 100, 40);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, tubeY - 20, w - 100, 40);

      const fluidColor = viscosity > 0.7 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(6, 182, 212, 0.2)';
      ctx.fillStyle = fluidColor;
      ctx.fillRect(55, tubeY - 15, w - 110, 30);

      const ballX = 80 + ballPos * (w - 160);
      ctx.beginPath();
      ctx.arc(ballX, tubeY, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();

      const speed = (1 - viscosity) * Math.sin((angle * Math.PI) / 180) * 5;
      if (speed > 0.1) {
        ctx.beginPath();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.moveTo(ballX + 15, tubeY);
        ctx.lineTo(ballX + 15 + speed * 10, tubeY);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 220, 70);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`🍯 Viscosity: ${viscosity.toFixed(2)}`, 20, 30);
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText(`Angle: ${angle}° | Speed: ${speed.toFixed(2)}`, 20, 50);
      ctx.fillText('Higher viscosity = slower flow', 20, 65);
      ctx.fillText('Stokes Law: F = 6πηrv', 20, 80);
    } else {
      // Race mode
      const finishLine = w - 50;

      // Lanes
      FLUIDS.forEach((fluid, idx) => {
        const laneY = 40 + idx * 70;
        ctx.fillStyle = 'rgba(100, 200, 255, 0.05)';
        ctx.fillRect(50, laneY, w - 100, 50);
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(50, laneY, w - 100, 50);

        // Fluid label
        ctx.fillStyle = fluid.color;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${fluid.emoji} ${fluid.name} (η=${fluid.viscosity})`, 60, laneY + 15);

        // Finish line
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(finishLine, laneY, 5, 50);

        // Racer
        const racer = racers.find(r => r.id === idx);
        if (racer) {
          const rx = 60 + racer.x * (w - 120);
          ctx.beginPath();
          ctx.arc(rx, laneY + 30, 10, 0, Math.PI * 2);
          ctx.fillStyle = fluid.color;
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();

          if (racer.finished) {
            ctx.fillStyle = '#22c55e';
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText(`✓ ${racer.time.toFixed(1)}s`, rx + 15, laneY + 35);
          }
        }
      });

      if (raceFinished) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(w / 2 - 100, h / 2 - 30, 200, 60);
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏁 Race Complete!', w / 2, h / 2);
        ctx.fillStyle = '#888';
        ctx.font = '12px sans-serif';
        ctx.fillText('Lower viscosity = faster!', w / 2, h / 2 + 20);
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
    let t = time;
    let pos = ballPos;
    const animate = () => {
      t += 0.05;
      const speed = (1 - viscosity) * Math.sin((angle * Math.PI) / 180) * 0.01;
      pos += speed;
      if (pos > 1) pos = 0;
      setTime(t);
      setBallPos(pos);

      if (mode === 'race' && raceStarted && !raceFinished) {
        setRacers(prev => {
          const updated = prev.map(r => {
            if (r.finished) return r;
            const speed = (1 - r.viscosity) * 0.005;
            const newX = r.x + speed;
            if (newX >= 1) {
              return { ...r, x: 1, finished: true, time: t };
            }
            return { ...r, x: newX };
          });
          if (updated.every(r => r.finished)) {
            setRaceFinished(true);
            const updated2 = completeModule(progress, 'viscosity', 95);
            setProgress(updated2);
            saveProgress(updated2);
          }
          return updated;
        });
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [viscosity, angle, mode, raceStarted, raceFinished, progress]);

  const startRace = () => {
    setRacers(FLUIDS.map((f, idx) => ({ id: idx, x: 0, y: 0, fluid: f.name, viscosity: f.viscosity, finished: false, time: 0 })));
    setRaceStarted(true);
    setRaceFinished(false);
  };

  const handleQuiz = (idx: number) => {
    setQuizAnswer(idx.toString());
    setQuizCorrect(idx === quizQuestions[currentQuiz].correct);
    if (idx === quizQuestions[currentQuiz].correct) {
      const updated = completeModule(progress, 'viscosity', 90);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'viscosity', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="viscosity" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🍯 Viscosity Lab</h2>
          <p className="text-sm text-gray-400">Explore fluid resistance AND race different fluids!</p>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('explore')} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'explore' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400'}`}>🔬 Explore</button>
          <button onClick={() => { setMode('race'); setRaceStarted(false); setRaceFinished(false); setRacers([]); }} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === 'race' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400'}`}>🏁 Fluid Race</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            {mode === 'explore' && (
              <>
                <div><label className="text-sm text-gray-400">Viscosity: {viscosity.toFixed(2)}</label><input type="range" min="0.1" max="0.99" step="0.01" value={viscosity} onChange={e => setViscosity(Number(e.target.value))} className="w-full accent-amber-500" /></div>
                <div><label className="text-sm text-gray-400">Angle: {angle}°</label><input type="range" min="5" max="80" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full accent-amber-500" /></div>
              </>
            )}
            {mode === 'race' && !raceStarted && (
              <button onClick={startRace} className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold text-sm">🏁 Start Race!</button>
            )}
            {mode === 'race' && raceStarted && !raceFinished && (
              <p className="text-sm text-amber-400 font-bold">🏁 Racing...</p>
            )}
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gray-900 border border-amber-500/20">
          <h3 className="text-lg font-bold text-amber-400 mb-3">🧠 Challenge: Test Your Knowledge</h3>
          <p className="text-sm text-gray-300 mb-4">{quizQuestions[currentQuiz].q}</p>
          <div className="grid grid-cols-2 gap-3">
            {quizQuestions[currentQuiz].options.map((opt, idx) => (
              <button key={idx} onClick={() => handleQuiz(idx)} disabled={quizCorrect === true} className={`py-3 rounded-xl text-sm font-bold transition-all ${quizAnswer === idx.toString() ? quizCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} disabled:opacity-50`}>{opt}</button>
            ))}
          </div>
          {quizCorrect === true && <p className="mt-3 text-green-400 font-bold text-sm">✅ Correct! +10 bonus XP!</p>}
          {quizCorrect === false && <p className="mt-3 text-red-400 font-bold text-sm">❌ Answer: {quizQuestions[currentQuiz].options[quizQuestions[currentQuiz].correct]}</p>}
          {quizCorrect === true && currentQuiz < quizQuestions.length - 1 && <button onClick={() => { setCurrentQuiz(prev => prev + 1); setQuizAnswer(null); setQuizCorrect(null); }} className="mt-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm">Next Question →</button>}
        </div>
      </div>
    </ModuleWrapper>
  );
}
