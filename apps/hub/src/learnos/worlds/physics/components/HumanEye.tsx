// src/worlds/physics/components/HumanEye.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

const SNELLEN_LINES = [
  { size: 48, letters: 'E', acuity: '6/60' },
  { size: 36, letters: 'F P', acuity: '6/36' },
  { size: 28, letters: 'T O Z', acuity: '6/24' },
  { size: 22, letters: 'L P E D', acuity: '6/18' },
  { size: 18, letters: 'P E C F D', acuity: '6/12' },
  { size: 14, letters: 'E D F C Z P', acuity: '6/9' },
  { size: 11, letters: 'F E L O P Z D', acuity: '6/6' },
  { size: 9, letters: 'D E F P O T E C', acuity: '6/5' },
];

const COLOR_BLINDNESS_TESTS = [
  { dots: 5, hidden: 7, answer: 12, description: 'Normal: 12, Red-blind: 7' },
  { dots: 3, hidden: 5, answer: 8, description: 'Normal: 8, Red-blind: 3' },
  { dots: 6, hidden: 2, answer: 8, description: 'Normal: 8, Green-blind: 6' },
];

export default function HumanEye() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [mode, setMode] = useState<'explore' | 'vision-test' | 'color-test'>('explore');
  const [focus, setFocus] = useState(50);
  const [pupilSize, setPupilSize] = useState(50);
  const [visionDefect, setVisionDefect] = useState<'normal' | 'myopia' | 'hyperopia'>('normal');
  const [time, setTime] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [visionScore, setVisionScore] = useState(0);
  const [colorTestIdx, setColorTestIdx] = useState(0);
  const [colorAnswer, setColorAnswer] = useState('');
  const [_colorScore, setColorScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);

  const quizQuestions = [
    { q: 'Myopia means you can see:', options: ['Far clearly', 'Near clearly', 'Nothing', 'Only colors'], correct: 1 },
    { q: 'The retina contains:', options: ['Bones', 'Rods and cones', 'Muscles', 'Blood only'], correct: 1 },
    { q: 'Cataract affects the:', options: ['Cornea', 'Lens', 'Retina', 'Optic nerve'], correct: 1 },
  ];

  const draw = useCallback(() => {
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
      // Eye diagram
      ctx.beginPath();
      ctx.ellipse(cx, cy, 120, 80, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx - 80, cy, 30, 60, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#06b6d4';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Cornea', cx - 80, cy + 75);

      const lensThickness = focus / 100;
      ctx.beginPath();
      ctx.ellipse(cx - 20, cy, 10 + lensThickness * 10, 40, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.fill();
      ctx.strokeStyle = '#a855f7';
      ctx.stroke();
      ctx.fillStyle = '#a855f7';
      ctx.fillText('Lens', cx - 20, cy + 55);

      const pupilRadius = pupilSize / 10;
      ctx.beginPath();
      ctx.arc(cx + 40, cy, pupilRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 40, cy, pupilRadius + 10, 0, Math.PI * 2);
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#8b5cf6';
      ctx.fillText('Iris/Pupil', cx + 40, cy + 30);

      ctx.beginPath();
      ctx.arc(cx + 100, cy, 30, -Math.PI / 2, Math.PI / 2);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillText('Retina', cx + 115, cy);

      // Light rays
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 100, 0.5)';
      ctx.lineWidth = 2;
      ctx.moveTo(cx - 200, cy - 30);
      ctx.lineTo(cx - 80, cy - 20);
      ctx.lineTo(cx - 20, cy - 5);
      ctx.lineTo(cx + 100, visionDefect === 'myopia' ? cy - 20 : visionDefect === 'hyperopia' ? cy + 20 : cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 200, cy + 30);
      ctx.lineTo(cx - 80, cy + 20);
      ctx.lineTo(cx - 20, cy + 5);
      ctx.lineTo(cx + 100, visionDefect === 'myopia' ? cy + 20 : visionDefect === 'hyperopia' ? cy - 20 : cy);
      ctx.stroke();

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, 220, 60);
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('👁️ Eye Model', 20, 30);
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText(`Vision: ${visionDefect}`, 20, 50);
      ctx.fillText('Adjust focus and pupil size!', 20, 65);
    } else if (mode === 'vision-test') {
      // Snellen chart
      ctx.fillStyle = '#fff';
      ctx.fillRect(50, 20, w - 100, h - 40);

      SNELLEN_LINES.forEach((line, idx) => {
        if (idx > currentLine) return;
        const blur = visionDefect === 'myopia' && idx >= 4 ? (idx - 3) * 2 : visionDefect === 'hyperopia' && idx <= 2 ? (3 - idx) * 2 : 0;
        ctx.fillStyle = '#000';
        ctx.font = `bold ${line.size}px sans-serif`;
        ctx.textAlign = 'center';
        if (blur > 0) {
          ctx.filter = `blur(${blur}px)`;
        }
        ctx.fillText(line.letters, w / 2, 60 + idx * (line.size + 10));
        ctx.filter = 'none';
      });

      ctx.fillStyle = '#0a0a1a';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Line: ${currentLine + 1}/${SNELLEN_LINES.length}`, 60, h - 20);
      ctx.fillText(`Acuity: ${SNELLEN_LINES[currentLine]?.acuity || '??'}`, 200, h - 20);
      ctx.fillText(`Score: ${visionScore}`, 380, h - 20);
    } else if (mode === 'color-test') {
      // Ishihara-style color blindness test
      const test = COLOR_BLINDNESS_TESTS[colorTestIdx];
      const canvasW = canvas.width;
      const canvasH = canvas.height;
      const cx2 = canvasW / 2;
      const cy2 = canvasH / 2;
      const radius = 100;

      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Background dots
      for (let i = 0; i < 200; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        const x = cx2 + Math.cos(angle) * r;
        const y = cy2 + Math.sin(angle) * r;
        const size = 3 + Math.random() * 4;
        const isAnswerDigit = test.answer.toString().includes(Math.floor(Math.random() * 10).toString());
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        if (isAnswerDigit && r < radius * 0.7) {
          ctx.fillStyle = `rgb(${180 + Math.random() * 40}, ${80 + Math.random() * 40}, ${80 + Math.random() * 40})`;
        } else {
          ctx.fillStyle = `rgb(${80 + Math.random() * 40}, ${160 + Math.random() * 40}, ${80 + Math.random() * 40})`;
        }
        ctx.fill();
      }

      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Test ${colorTestIdx + 1}/${COLOR_BLINDNESS_TESTS.length}`, cx2, 30);
      ctx.fillText('What number do you see?', cx2, canvasH - 30);
    }
  }, [focus, pupilSize, visionDefect, time, mode, currentLine, visionScore, colorTestIdx, colorAnswer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    draw();
  }, [draw]);

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

  const handleVisionRead = (correct: boolean) => {
    if (correct) {
      setVisionScore(prev => prev + 1);
      if (currentLine < SNELLEN_LINES.length - 1) {
        setCurrentLine(prev => prev + 1);
      } else {
        const updated = completeModule(progress, 'human-eye', 95);
        setProgress(updated);
        saveProgress(updated);
      }
    } else {
      const updated = completeModule(progress, 'human-eye', 70);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const handleColorAnswer = (guess: string) => {
    setColorAnswer(guess);
    const test = COLOR_BLINDNESS_TESTS[colorTestIdx];
    if (guess === test.answer.toString()) {
      setColorScore(prev => prev + 1);
    }
    if (colorTestIdx < COLOR_BLINDNESS_TESTS.length - 1) {
      setTimeout(() => {
        setColorTestIdx(prev => prev + 1);
        setColorAnswer('');
      }, 1000);
    } else {
      const updated = completeModule(progress, 'human-eye', 90);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const handleQuiz = (idx: number) => {
    setQuizAnswer(idx.toString());
    setQuizCorrect(idx === quizQuestions[currentQuiz].correct);
    if (idx === quizQuestions[currentQuiz].correct) {
      const updated = completeModule(progress, 'human-eye', 95);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const handleComplete = () => {
    const updated = completeModule(progress, 'human-eye', 80);
    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <ModuleWrapper moduleId="human-eye" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">👁️ Human Eye Lab</h2>
          <p className="text-sm text-gray-400">Explore eye anatomy, take a vision test, and check for color blindness!</p>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-4">
          {([['explore', '🔬 Explore'], ['vision-test', '👁️ Vision Test'], ['color-test', '🎨 Color Test']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setMode(key)} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{label}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <canvas ref={canvasRef} className="w-full h-80 rounded-xl border border-gray-800 bg-gray-950" />
          </div>
          <div className="space-y-4">
            {mode === 'explore' && (
              <>
                <div className="flex gap-2">
                  {(['normal', 'myopia', 'hyperopia'] as const).map(v => (
                    <button key={v} onClick={() => setVisionDefect(v)} className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${visionDefect === v ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{v}</button>
                  ))}
                </div>
                <div><label className="text-sm text-gray-400">Focus: {focus}%</label><input type="range" min="0" max="100" value={focus} onChange={e => setFocus(Number(e.target.value))} className="w-full accent-blue-500" /></div>
                <div><label className="text-sm text-gray-400">Pupil Size: {pupilSize}%</label><input type="range" min="20" max="100" value={pupilSize} onChange={e => setPupilSize(Number(e.target.value))} className="w-full accent-blue-500" /></div>
              </>
            )}
            {mode === 'vision-test' && (
              <>
                <p className="text-sm text-gray-400">Can you read this line?</p>
                <div className="flex gap-2">
                  <button onClick={() => handleVisionRead(true)} className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-bold">✅ Yes</button>
                  <button onClick={() => handleVisionRead(false)} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-bold">🤔 No</button>
                </div>
                <button onClick={() => { setCurrentLine(0); setVisionScore(0); }} className="w-full py-2 rounded-lg bg-gray-700 text-white text-sm font-bold">🔄 Reset Test</button>
              </>
            )}
            {mode === 'color-test' && (
              <>
                <p className="text-sm text-gray-400">Enter the number you see:</p>
                <div className="flex gap-2">
                  {[0,1,2,3,4,5,6,7,8,9].map(n => (
                    <button key={n} onClick={() => handleColorAnswer(n.toString())} className="flex-1 py-2 rounded-lg bg-gray-700 text-white text-sm font-bold hover:bg-gray-600">{n}</button>
                  ))}
                </div>
                {colorAnswer && <p className="text-sm text-gray-500">Your answer: {colorAnswer}</p>}
              </>
            )}
            <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-600/30">✓ Mark Complete (+25 XP)</button>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gray-900 border border-blue-500/20">
          <h3 className="text-lg font-bold text-blue-400 mb-3">🧠 Challenge: Test Your Knowledge</h3>
          <p className="text-sm text-gray-300 mb-4">{quizQuestions[currentQuiz].q}</p>
          <div className="grid grid-cols-2 gap-3">
            {quizQuestions[currentQuiz].options.map((opt, idx) => (
              <button key={idx} onClick={() => handleQuiz(idx)} disabled={quizCorrect === true} className={`py-3 rounded-xl text-sm font-bold transition-all ${quizAnswer === idx.toString() ? quizCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} disabled:opacity-50`}>{opt}</button>
            ))}
          </div>
          {quizCorrect === true && <p className="mt-3 text-green-400 font-bold text-sm">✅ Correct! +10 bonus XP!</p>}
          {quizCorrect === false && <p className="mt-3 text-red-400 font-bold text-sm">🤔 Answer: {quizQuestions[currentQuiz].options[quizQuestions[currentQuiz].correct]}</p>}
          {quizCorrect === true && currentQuiz < quizQuestions.length - 1 && <button onClick={() => { setCurrentQuiz(prev => prev + 1); setQuizAnswer(null); setQuizCorrect(null); }} className="mt-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm">Next Question →</button>}
        </div>
      </div>
    </ModuleWrapper>
  );
}
