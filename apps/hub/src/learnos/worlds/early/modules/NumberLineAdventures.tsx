// src/worlds/early/modules/NumberLineAdventures.tsx

import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import EarlyShell from '../EarlyShell';
import { usePip } from '../hooks/usePip';
import { useEarlyProgress } from '../hooks/useEarlyProgress';
import { useEarlySession } from '../hooks/useEarlySession';
import { NUMBER_LINE_PROBLEMS } from '../data/earlyContent';
import { drawPip } from '../components/PipCanvas';

export default function NumberLineAdventures() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const pip = usePip();
  const { recordProblemSolved, recordHintUsed, recordWrongAnswer } = useEarlyProgress();
  const { trackCorrect, trackWrong } = useEarlySession();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [pipPos, setPipPos] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const problemsForDifficulty = NUMBER_LINE_PROBLEMS.filter(p => p.difficulty === difficulty);
  const problem = problemsForDifficulty[currentIdx % problemsForDifficulty.length];

  const generateOptions = useCallback((correct: number) => {
    const opts = new Set([correct]);
    while (opts.size < 4) { const d = correct + Math.floor(Math.random() * 7) - 3; if (d !== correct) opts.add(d); }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  }, []);

  const [options, setOptions] = useState(() => generateOptions(problem.answer));

  useEffect(() => {
    setOptions(generateOptions(problem.answer));
    setPipPos(problem.startNumber);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [problem, generateOptions]);

  // Stuck timer
  useEffect(() => {
    if (showResult) return;
    let timer = 0;
    const id = setInterval(() => { timer++; if (timer >= 20) { pip.giveHint(); recordHintUsed(); timer = 0; } }, 1000);
    return () => clearInterval(id);
  }, [showResult, pip, recordHintUsed]);

  const animatePip = useCallback(async (from: number, to: number) => {
    setIsAnimating(true);
    const steps = Math.abs(to - from);
    const dir = to > from ? 1 : -1;
    for (let i = 1; i <= steps; i++) {
      await new Promise(r => setTimeout(r, 250));
      setPipPos(from + dir * i);
      if (soundEnabled) try { AudioEngine.playTone({ frequency: 400 + i * 30, type: 'sine', duration: 0.12, volume: 0.18, attack: 0.01, decay: 0.05 }); } catch (_) {}
    }
    setIsAnimating(false);
  }, [soundEnabled]);

  const handleAnswer = useCallback(async (answer: number) => {
    if (isAnimating || showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    await animatePip(problem.startNumber, problem.answer);
    if (answer === problem.answer) {
      pip.celebrate();
      if (soundEnabled) try { AudioEngine.playSuccess(); } catch (_) {}
      await trackCorrect('number-line', { answer });
      await recordProblemSolved(problem.answer);
    } else {
      pip.reactToMistake();
      await trackWrong('number-line', { answer, correct: problem.answer });
      await recordWrongAnswer();
    }
  }, [isAnimating, showResult, problem, animatePip, pip, soundEnabled, trackCorrect, trackWrong, recordProblemSolved, recordWrongAnswer]);

  const handleNext = useCallback(() => {
    setCurrentIdx(prev => {
      const next = prev + 1;
      if (next >= problemsForDifficulty.length && difficulty < 3) {
        setDifficulty(d => Math.min(3, d + 1));
        pip.sayCustom(t('auto.numberlineadventures.ready_bigger', "Ooh! You're ready for bigger numbers!"), 'celebrating');
        return 0;
      }
      return next;
    });
  }, [problemsForDifficulty.length, difficulty, pip]);

  // Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width; const h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const lineMin = difficulty === 1 ? -1 : difficulty === 2 ? -2 : -10;
    const lineMax = difficulty === 1 ? 15 : difficulty === 2 ? 25 : 20;
    const totalNums = lineMax - lineMin + 1;
    const numSpacing = w / (totalNums + 1);
    const numToX = (n: number) => numSpacing + (n - lineMin) * numSpacing;
    const lineY = h * 0.5;

    const animate = (timestamp: number) => {
      const time = timestamp / 1000;
      ctx.clearRect(0, 0, w, h);

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#F0F9FF'); bg.addColorStop(1, '#E0F2FE');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

      // Ground
      ctx.fillStyle = '#86EFAC'; ctx.fillRect(0, lineY + 40, w, h - lineY - 40);

      // Landmarks
      ctx.font = '24px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🏠', numToX(0), lineY - 40);
      ctx.fillText('🏝️', numToX(lineMax - 2), lineY - 35);

      // Number line
      ctx.strokeStyle = '#60A5FA'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(numSpacing * 0.5, lineY); ctx.lineTo(w - numSpacing * 0.5, lineY); ctx.stroke();

      // Ticks and numbers
      for (let n = lineMin; n <= lineMax; n++) {
        const x = numToX(n);
        const isMajor = n % 5 === 0;
        ctx.strokeStyle = n === 0 ? '#4338CA' : '#94A3B8';
        ctx.lineWidth = n === 0 ? 3 : 1.5;
        ctx.beginPath(); ctx.moveTo(x, lineY - (isMajor ? 16 : 8)); ctx.lineTo(x, lineY + (isMajor ? 16 : 8)); ctx.stroke();

        if (isMajor || Math.abs(n) <= 2 || totalNums <= 20) {
          ctx.fillStyle = n === 0 ? '#4338CA' : '#64748B';
          ctx.font = `${n === 0 ? 'bold ' : ''}${Math.min(14, numSpacing * 0.7)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(String(n), x, lineY + 30);
        }
      }

      // Start marker
      ctx.beginPath(); ctx.arc(numToX(problem.startNumber), lineY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#6366F1'; ctx.fill();

      // Jump arcs
      if (problem.direction === 'forward') {
        for (let step = 0; step < problem.steps; step++) {
          const s = numToX(problem.startNumber + step);
          const e = numToX(problem.startNumber + step + 1);
          ctx.beginPath(); ctx.moveTo(s, lineY);
          ctx.quadraticCurveTo((s + e) / 2, lineY - 28, e, lineY);
          ctx.strokeStyle = `rgba(99,102,241,${showResult ? 0.8 : 0.25})`; ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
        }
      }

      // Pip
      drawPip(ctx, numToX(pipPos), lineY - 38, 16,
        isAnimating ? 'excited' : showResult ? (selectedAnswer === problem.answer ? 'celebrating' : 'curious') : 'idle', time);

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [problem, pipPos, isAnimating, showResult, selectedAnswer, difficulty]);

  return (
    <EarlyShell module="number-line">
      <div className="min-h-screen bg-sky-50 flex flex-col">
        <div className="px-5 pt-6 pb-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-sky-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{problem.emoji}</span>
              <div>
                <p className="text-xl font-bold text-gray-800"><Trans i18nKey="auto.numberlineadventures.start_at">Start at</Trans> <span className="text-blue-600">{problem.startNumber}</span></p>
                <p className="text-lg text-gray-600"><Trans i18nKey="auto.numberlineadventures.jump">Jump</Trans> <span className="font-bold text-indigo-600">{problem.steps}</span> <Trans i18nKey="auto.numberlineadventures.steps">steps</Trans> <span className="font-bold">{problem.direction === 'forward' ? t('auto.numberlineadventures.forward', 'forward →') : t('auto.numberlineadventures.backward', '← backward')}</span></p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-2"><canvas ref={canvasRef} className="w-full rounded-2xl" style={{ height: '180px' }} /></div>
        <div className="px-5 pt-4 flex-1">
          <p className="text-base font-bold text-gray-500 mb-3 text-center">{t('early.modules.NumberLineAdventures.txt_WheredoIla', 'Where do I land?')}</p>
          <div className="grid grid-cols-2 gap-3">
            {options.map(opt => (
              <motion.button key={opt} whileTap={{ scale: 0.97 }} onClick={() => handleAnswer(opt)} disabled={showResult || isAnimating}
                className={`py-5 rounded-2xl font-extrabold text-3xl min-h-[64px] transition-all ${
                  !showResult ? 'bg-white border-2 border-sky-200 text-gray-700' : opt === problem.answer ? 'bg-green-100 border-2 border-green-400 text-green-700' : selectedAnswer === opt ? 'bg-red-100 border-2 border-red-300 text-red-600' : 'bg-white border-2 border-gray-100 text-gray-300'
                }`}>{opt}</motion.button>
            ))}
          </div>
        </div>
        {showResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="px-5 pb-24 pt-4">
            <button onClick={handleNext} className="w-full py-4 bg-sky-600 text-white font-bold text-xl rounded-2xl min-h-[56px]">{t('early.modules.NumberLineAdventures.btn_NextProble', 'Next Problem →')}</button>
          </motion.div>
        )}
      </div>
    </EarlyShell>
  );
}
