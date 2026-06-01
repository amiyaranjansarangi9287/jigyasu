// src/worlds/physics/components/StandingWaves.tsx
import { useRef, useEffect, useState } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

export default function StandingWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [harmonic, setHarmonic] = useState(1);
  const [amplitude, setAmplitude] = useState(1);
  const [time, setTime] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);

  const quizQuestions = [
    { q: 'Points of zero displacement in standing waves are:', options: ['Antinodes', 'Nodes', 'Peaks', 'Troughs'], correct: 1 },
    { q: 'The 3rd harmonic has frequency:', options: ['Same as 1st', '2× fundamental', '3× fundamental', '4× fundamental'], correct: 2 },
    { q: 'Standing waves form due to:', options: ['Refraction', 'Diffraction', 'Interference', 'Dispersion'], correct: 2 },
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

    ctx.beginPath();
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    for (let x = 0; x < w; x++) {
      const envelope = Math.sin((harmonic * Math.PI * x) / w);
      const y = midY + amplitude * 60 * envelope * Math.sin(time * 3);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    for (let x = 0; x < w; x++) {
      const envelope = Math.sin((harmonic * Math.PI * x) / w);
      const y = midY + amplitude * 60 * envelope;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const envelope = Math.sin((harmonic * Math.PI * x) / w);
      const y = midY - amplitude * 60 * envelope;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 0; i <= harmonic; i++) {
      const x = (i / harmonic) * w;
      ctx.beginPath();
      ctx.arc(x, midY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
    }

    ctx.fillStyle = '#888';
    ctx.font = '11px sans-serif';
    ctx.fillText(`Harmonic: n=${harmonic}`, 10, 25);
    ctx.fillText(`Nodes: ${harmonic + 1} | Antinodes: ${harmonic}`, 10, 40);
    ctx.fillText(`λ = ${(2 / harmonic).toFixed(2)}L`, 10, 55);
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
      t += 0.05;
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
      const updated = completeModule(progress, 'standing-waves', 90);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'standing-waves', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="standing-waves" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">〰️ Standing Waves</h2>
          <p className="text-sm text-gray-400">Explore harmonics, nodes, and antinodes on a vibrating string.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-64 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400">Harmonic: n={harmonic}</label><input type="range" min="1" max="8" value={harmonic} onChange={e => setHarmonic(Number(e.target.value))} className="w-full accent-purple-500" /></div>
            <div><label className="text-sm text-gray-400">Amplitude: {amplitude.toFixed(1)}</label><input type="range" min="0" max="2" step="0.1" value={amplitude} onChange={e => setAmplitude(Number(e.target.value))} className="w-full accent-purple-500" /></div>
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Nodes = no movement points</p>
              <p>🔥 f_n = n × f₁ (harmonics)</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gray-900 border border-purple-500/20">
          <h3 className="text-lg font-bold text-purple-400 mb-3">🧠 Challenge: Test Your Knowledge</h3>
          <p className="text-sm text-gray-300 mb-4">{quizQuestions[currentQuiz].q}</p>
          <div className="grid grid-cols-2 gap-3">
            {quizQuestions[currentQuiz].options.map((opt, idx) => (
              <button key={idx} onClick={() => handleQuiz(idx)} disabled={quizCorrect === true} className={`py-3 rounded-xl text-sm font-bold transition-all ${quizAnswer === idx.toString() ? quizCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} disabled:opacity-50`}>{opt}</button>
            ))}
          </div>
          {quizCorrect === true && <p className="mt-3 text-green-400 font-bold text-sm">✅ Correct! +10 bonus XP!</p>}
          {quizCorrect === false && <p className="mt-3 text-red-400 font-bold text-sm">❌ Answer: {quizQuestions[currentQuiz].options[quizQuestions[currentQuiz].correct]}</p>}
          {quizCorrect === true && currentQuiz < quizQuestions.length - 1 && <button onClick={() => { setCurrentQuiz(prev => prev + 1); setQuizAnswer(null); setQuizCorrect(null); }} className="mt-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm">Next Question →</button>}
        </div>
      </div>
    </ModuleWrapper>
  );
}
