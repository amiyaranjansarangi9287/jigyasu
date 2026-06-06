// src/worlds/physics/components/HeatEngine.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function HeatEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [tHot, setTHot] = useState(500);
  const [tCold, setTCold] = useState(300);
  const [time, setTime] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const efficiency = 1 - tCold / tHot;

  const quizQuestions = [
    { q: 'Maximum possible efficiency is given by:', options: ['Newton cycle', 'Carnot cycle', 'Otto cycle', 'Diesel cycle'], correct: 1 },
    { q: '100% efficient heat engine is:', options: ['Possible with tech', 'Impossible', 'Only at 0K', 'Only in vacuum'], correct: 1 },
    { q: 'A car engine is approximately what % efficient?', options: ['5-10%', '20-30%', '60-70%', '90-95%'], correct: 1 },
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

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = `rgba(239, 68, 68, ${tHot / 1000})`;
    ctx.fillRect(cx - 150, cy - 80, 80, 160);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${tHot}K`, cx - 110, cy + 5);

    ctx.fillStyle = `rgba(59, 130, 246, ${tCold / 1000})`;
    ctx.fillRect(cx + 70, cy - 80, 80, 160);
    ctx.fillStyle = '#fff';
    ctx.fillText(`${tCold}K`, cx + 110, cy + 5);

    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-5, -35, 10, 70);
    ctx.fillRect(-35, -5, 70, 10);
    ctx.restore();

    ctx.fillStyle = '#ef4444';
    ctx.font = '20px sans-serif';
    ctx.fillText('→', cx - 60, cy - 20);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('→', cx + 40, cy + 20);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 70);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Carnot Efficiency: ${(efficiency * 100).toFixed(1)}%`, 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(`η = 1 - T_cold/T_hot`, 20, 45);
    ctx.fillText(`Work = Q_hot - Q_cold`, 20, 60);
    ctx.fillText(`Max possible efficiency!`, 20, 75);
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
      const updated = completeModule(progress, 'heat-engine', 90);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'heat-engine', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="heat-engine" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🚂 Heat Engine</h2>
          <p className="text-sm text-gray-400">Explore Carnot efficiency and thermodynamic cycles.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">T_hot: {tHot}K</label><input type="range" min="300" max="1000" value={tHot} onChange={e => setTHot(Number(e.target.value))} className="w-full accent-red-500" /></div>
            <div><label className="text-sm text-gray-400">T_cold: {tCold}K</label><input type="range" min="200" max="400" value={tCold} onChange={e => setTCold(Number(e.target.value))} className="w-full accent-blue-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Higher T_hot = better efficiency</p>
              <p>🔥 100% efficiency is impossible!</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gray-900 border border-orange-500/20">
          <h3 className="text-lg font-bold text-orange-400 mb-3">🧠 Challenge: Test Your Knowledge</h3>
          <p className="text-sm text-gray-300 mb-4">{quizQuestions[currentQuiz].q}</p>
          <div className="grid grid-cols-2 gap-3">
            {quizQuestions[currentQuiz].options.map((opt, idx) => (
              <button key={idx} onClick={() => handleQuiz(idx)} disabled={quizCorrect === true} className={`py-3 rounded-xl text-sm font-bold transition-all ${quizAnswer === idx.toString() ? quizCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} disabled:opacity-50`}>{opt}</button>
            ))}
          </div>
          {quizCorrect === true && <p className="mt-3 text-green-400 font-bold text-sm">✅ Correct! +10 bonus XP!</p>}
          {quizCorrect === false && <p className="mt-3 text-red-400 font-bold text-sm">🤔 Answer: {quizQuestions[currentQuiz].options[quizQuestions[currentQuiz].correct]}</p>}
          {quizCorrect === true && currentQuiz < quizQuestions.length - 1 && <button onClick={() => { setCurrentQuiz(prev => prev + 1); setQuizAnswer(null); setQuizCorrect(null); }} className="mt-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm">Next Question →</button>}
        </div>
      </div>
    </ModuleWrapper>
  );
}
