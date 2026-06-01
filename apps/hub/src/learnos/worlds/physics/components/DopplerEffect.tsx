// src/worlds/physics/components/DopplerEffect.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function DopplerEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [sourceSpeed, setSourceSpeed] = useState(2);
  const [frequency, setFrequency] = useState(5);
  const [sourceX, setSourceX] = useState(100);
  const [time, setTime] = useState(0);
  const [waves, setWaves] = useState<{x:number,y:number,r:number}[]>([]);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);

  const quizQuestions = [
    { q: 'When a source approaches, observed frequency:', options: ['Decreases', 'Increases', 'Stays same', 'Becomes zero'], correct: 1 },
    { q: 'The Doppler effect is used in:', options: ['Microwave ovens', 'Police radar', 'Solar panels', 'Batteries'], correct: 1 },
    { q: 'Red shift in astronomy means galaxies are:', options: ['Approaching', 'Receding', 'Stationary', 'Exploding'], correct: 1 },
  ];

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    waves.forEach((wave, _i) => {
      const alpha = Math.max(0, 1 - wave.r / 300);
      ctx.beginPath();
      ctx.arc(wave.x, midY, wave.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.5})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.arc(sourceX, midY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(w - 80, midY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText('👂 Observer', w - 110, midY + 25);

    const vSound = 343;
    const vSource = sourceSpeed * 10;
    const fObs = frequency * vSound / (vSound - vSource);
    const fRatio = fObs / frequency;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 220, 60);
    ctx.fillStyle = fRatio > 1 ? '#ef4444' : '#3b82f6';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`f_observed = ${fObs.toFixed(1)} Hz`, 20, 30);
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(fRatio > 1 ? '🔴 Approaching (higher pitch)' : '🔵 Receding (lower pitch)', 20, 50);
    ctx.fillText(`Speed: ${vSource.toFixed(0)} m/s`, 20, 65);
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
    let sx = sourceX;
    let w: {x:number,y:number,r:number}[] = [];
    let lastWave = 0;

    const animate = () => {
      t += 0.05;
      sx += sourceSpeed * 2;
      if (sx > 700) sx = 50;

      if (t - lastWave > 0.3) {
        w.push({ x: sx, y: 0, r: 0 });
        lastWave = t;
      }

      w = w.map(wave => ({ ...wave, r: wave.r + 5 })).filter(wave => wave.r < 300);

      setSourceX(sx);
      setTime(t);
      setWaves(w);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [sourceSpeed]);

  const handleQuiz = (idx: number) => {
    setQuizAnswer(idx.toString());
    setQuizCorrect(idx === quizQuestions[currentQuiz].correct);
    if (idx === quizQuestions[currentQuiz].correct) {
      const updated = completeModule(progress, 'doppler-effect', 90);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'doppler-effect', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="doppler-effect" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">🚑 Doppler Effect Simulator</h2>
          <p className="text-sm text-gray-400">Watch how frequency changes as the source moves toward/away from you.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-64 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Source Speed: {sourceSpeed}</label><input type="range" min="0" max="8" value={sourceSpeed} onChange={e => setSourceSpeed(Number(e.target.value))} className="w-full accent-red-500" /></div>
            <div><label className="text-sm text-gray-400">Frequency: {frequency}</label><input type="range" min="1" max="10" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full accent-red-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Approaching = higher pitch</p>
              <p>🔊 Receding = lower pitch</p>
              <p>🚀 Used in radar & astronomy!</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gray-900 border border-red-500/20">
          <h3 className="text-lg font-bold text-red-400 mb-3">🧠 Challenge: Test Your Knowledge</h3>
          <p className="text-sm text-gray-300 mb-4">{quizQuestions[currentQuiz].q}</p>
          <div className="grid grid-cols-2 gap-3">
            {quizQuestions[currentQuiz].options.map((opt, idx) => (
              <button key={idx} onClick={() => handleQuiz(idx)} disabled={quizCorrect === true} className={`py-3 rounded-xl text-sm font-bold transition-all ${quizAnswer === idx.toString() ? quizCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} disabled:opacity-50`}>{opt}</button>
            ))}
          </div>
          {quizCorrect === true && <p className="mt-3 text-green-400 font-bold text-sm">✅ Correct! +10 bonus XP!</p>}
          {quizCorrect === false && <p className="mt-3 text-red-400 font-bold text-sm">❌ Answer: {quizQuestions[currentQuiz].options[quizQuestions[currentQuiz].correct]}</p>}
          {quizCorrect === true && currentQuiz < quizQuestions.length - 1 && <button onClick={() => { setCurrentQuiz(prev => prev + 1); setQuizAnswer(null); setQuizCorrect(null); }} className="mt-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm">Next Question →</button>}
        </div>
      </div>
    </ModuleWrapper>
  );
}
