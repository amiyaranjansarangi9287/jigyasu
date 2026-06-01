// src/worlds/physics/components/BlackHole.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [mass, setMass] = useState(5);
  const [time, setTime] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);

  const quizQuestions = [
    { q: 'What is the boundary of a black hole called?', options: ['Event horizon', 'Photon sphere', 'Singularity', 'Accretion disk'], correct: 0 },
    { q: 'Who first predicted black holes theoretically?', options: ['Einstein', 'Schwarzschild', 'Hawking', 'Newton'], correct: 1 },
    { q: 'What happens to time near a black hole?', options: ['Speeds up', 'Slows down', 'Stops completely', 'Reverses'], correct: 1 },
  ];

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const schwarzschildRadius = mass * 10;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    for (let r = schwarzschildRadius + 10; r < schwarzschildRadius + 100; r += 5) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      const alpha = Math.max(0, 1 - (r - schwarzschildRadius) / 100) * 0.3;
      ctx.strokeStyle = `rgba(255, 150, 50, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, schwarzschildRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, schwarzschildRadius + 20 + i * 30, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(100, 200, 255, ${0.1 - i * 0.03})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2 + time;
      const dist = schwarzschildRadius + 50 + Math.sin(time + i) * 30;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 200, 100, 0.5)';
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 80);
    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🕳️ Black Hole', 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Mass: ${mass} solar masses`, 20, 50);
    ctx.fillText(`Schwarzschild radius: ${schwarzschildRadius}px`, 20, 65);
    ctx.fillText(`Event horizon: r = 2GM/c²`, 20, 80);
    ctx.fillText('Nothing escapes, not even light!', 20, 95);
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

  const handleQuiz = (idx: number) => {
    setQuizAnswer(idx.toString());
    setQuizCorrect(idx === quizQuestions[currentQuiz].correct);
    if (idx === quizQuestions[currentQuiz].correct) {
      const updated = completeModule(progress, 'black-hole', 90);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'black-hole', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="black-hole" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🕳️ Black Hole</h2>
          <p className="text-sm text-gray-400">Explore event horizons, accretion disks, and spacetime curvature!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Mass: {mass} solar masses</label><input type="range" min="1" max="10" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-violet-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 r_s = 2GM/c²</p>
              <p>🔥 Time slows near event horizon!</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gray-900 border border-violet-500/20">
          <h3 className="text-lg font-bold text-violet-400 mb-3">🧠 Challenge: Test Your Knowledge</h3>
          <p className="text-sm text-gray-300 mb-4">{quizQuestions[currentQuiz].q}</p>
          <div className="grid grid-cols-2 gap-3">
            {quizQuestions[currentQuiz].options.map((opt, idx) => (
              <button key={idx} onClick={() => handleQuiz(idx)} disabled={quizCorrect === true} className={`py-3 rounded-xl text-sm font-bold transition-all ${quizAnswer === idx.toString() ? quizCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} disabled:opacity-50`}>{opt}</button>
            ))}
          </div>
          {quizCorrect === true && <p className="mt-3 text-green-400 font-bold text-sm">✅ Correct! +10 bonus XP!</p>}
          {quizCorrect === false && <p className="mt-3 text-red-400 font-bold text-sm">❌ Answer: {quizQuestions[currentQuiz].options[quizQuestions[currentQuiz].correct]}</p>}
          {quizCorrect === true && currentQuiz < quizQuestions.length - 1 && <button onClick={() => { setCurrentQuiz(prev => prev + 1); setQuizAnswer(null); setQuizCorrect(null); }} className="mt-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm">Next Question →</button>}
        </div>
      </div>
    </ModuleWrapper>
  );
}
