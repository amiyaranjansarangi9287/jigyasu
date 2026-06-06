// src/worlds/physics/components/PhaseChange.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function PhaseChange() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [temperature, setTemperature] = useState(20);
  const [phase, setPhase] = useState('solid');
  const [particles, setParticles] = useState<{x:number,y:number}[]>([]);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);

  const quizQuestions = [
    { q: 'Direct solid → gas transition is called:', options: ['Evaporation', 'Sublimation', 'Condensation', 'Melting'], correct: 1 },
    { q: 'During phase change, temperature:', options: ['Increases', 'Decreases', 'Stays constant', 'Fluctuates'], correct: 2 },
    { q: 'Dry ice is solid:', options: ['Water', 'Oxygen', 'CO₂', 'Nitrogen'], correct: 2 },
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

    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 50, w - 200, h - 100);

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      if (phase === 'solid') ctx.fillStyle = '#3b82f6';
      else if (phase === 'liquid') ctx.fillStyle = '#06b6d4';
      else ctx.fillStyle = '#ef4444';
      ctx.fill();
    });

    ctx.fillStyle = phase === 'solid' ? '#3b82f6' : phase === 'liquid' ? '#06b6d4' : '#ef4444';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(phase.toUpperCase(), w / 2, 35);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 180, 60);
    ctx.fillStyle = '#888';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Temperature: ${temperature}°C`, 20, 30);
    ctx.fillText(`0°C = Melting | 100°C = Boiling`, 20, 50);
    ctx.fillText(`Phase: ${phase}`, 20, 65);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, []);

  useEffect(() => {
    const p = Array.from({ length: 40 }, (_, i) => ({
      x: 150 + (i % 8) * 50,
      y: 100 + Math.floor(i / 8) * 40,
    }));
    setParticles(p);
  }, []);

  useEffect(() => {
    if (temperature <= 0) setPhase('solid');
    else if (temperature < 100) setPhase('liquid');
    else setPhase('gas');

    const animate = () => {
      setParticles(prev => prev.map(p => {
        const speed = temperature > 100 ? 3 : temperature > 0 ? 1 : 0.2;
        let nx = p.x + (Math.random() - 0.5) * speed * 4;
        let ny = p.y + (Math.random() - 0.5) * speed * 4;
        if (temperature <= 0) { nx = 150 + Math.round((p.x - 150) / 50) * 50; ny = 100 + Math.round((p.y - 100) / 40) * 40; }
        nx = Math.max(110, Math.min(690, nx));
        ny = Math.max(60, Math.min(340, ny));
        return { x: nx, y: ny };
      }));
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [temperature]);

  const handleQuiz = (idx: number) => {
    setQuizAnswer(idx.toString());
    setQuizCorrect(idx === quizQuestions[currentQuiz].correct);
    if (idx === quizQuestions[currentQuiz].correct) {
      const updated = completeModule(progress, 'phase-change', 90);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'phase-change', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="phase-change" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🧊 Phase Change</h2>
          <p className="text-sm text-gray-400">Watch particles transition between solid, liquid, and gas phases.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-72 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Temperature: {temperature}°C</label><input type="range" min="-50" max="150" value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="w-full accent-cyan-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 ≤0°C = Solid (ice)</p>
              <p>🔥 ≥100°C = Gas (steam)</p>
            </div>
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
