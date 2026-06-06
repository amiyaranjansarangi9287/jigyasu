import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMathFeedback } from '../lib/MathContext';
import { useTranslation } from 'react-i18next';
import WhatsNext from './shared/WhatsNext';

interface Equation {
  display: string;
  variable: string;
  answer: number;
  options: number[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  hint: string;
  steps: string[];
}

const generateEquation = (diff: 'basic' | 'intermediate' | 'advanced'): Equation => {
  const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (diff === 'basic') {
    const type = r(0, 3);
    let a: number, b: number, ans: number, display: string, steps: string[];
    switch (type) {
      case 0:
        a = r(2, 12); ans = r(1, 20); b = a * ans;
        display = `${a}x = ${b}`;
        steps = [`${a}x = ${b}`, `x = ${b} ÷ ${a}`, `x = ${ans}`];
        break;
      case 1:
        a = r(1, 10); b = r(1, 15); ans = b - a;
        display = `x + ${a} = ${b}`;
        steps = [`x + ${a} = ${b}`, `x = ${b} - ${a}`, `x = ${ans}`];
        break;
      case 2:
        a = r(1, 10); b = r(a + 1, a + 20); ans = b + a;
        display = `x - ${a} = ${b}`;
        steps = [`x - ${a} = ${b}`, `x = ${b} + ${a}`, `x = ${ans}`];
        break;
      default:
        ans = r(2, 10); a = r(2, 6); b = ans * a;
        display = `x ÷ ${a} = ${ans}`;
        steps = [`x ÷ ${a} = ${ans}`, `x = ${ans} × ${a}`, `x = ${b}`];
        ans = b;
        break;
    }
    const wrongs = new Set<number>();
    while (wrongs.size < 3) {
      const w = ans + r(-5, 5);
      if (w !== ans && w >= 0) wrongs.add(w);
    }
    return { display, variable: 'x', answer: ans, options: [ans, ...wrongs].sort(() => Math.random() - 0.5), difficulty: diff, hint: steps[1], steps };
  }

  if (diff === 'intermediate') {
    const type = r(0, 3);
    let ans: number, display: string, steps: string[];
    switch (type) {
      case 0: {
        const a = r(2, 6); const b = r(1, 10); ans = r(1, 10); const c = a * ans + b;
        display = `${a}x + ${b} = ${c}`;
        steps = [`${a}x + ${b} = ${c}`, `${a}x = ${c} - ${b} = ${c - b}`, `x = ${c - b} ÷ ${a}`, `x = ${ans}`];
        break;
      }
      case 1: {
        const a = r(2, 5); const b = r(1, 8); ans = r(1, 10); const c = a * ans - b;
        display = `${a}x - ${b} = ${c}`;
        steps = [`${a}x - ${b} = ${c}`, `${a}x = ${c} + ${b} = ${c + b}`, `x = ${c + b} ÷ ${a}`, `x = ${ans}`];
        break;
      }
      case 2: {
        ans = r(2, 8); const a = r(2, 5); const b = r(1, 5);
        void 0;
        display = `${a}(x + ${b}) = ${a * (ans + b)}`;
        steps = [`${a}(x + ${b}) = ${a * (ans + b)}`, `${a}x + ${a * b} = ${a * (ans + b)}`, `${a}x = ${a * (ans + b)} - ${a * b} = ${a * ans}`, `x = ${ans}`];
        break;
      }
      default: {
        ans = r(1, 8); const a = r(2, 4); const b = r(1, 3);
        const lhs = (a + b) * ans;
        display = `${a}x + ${b}x = ${lhs}`;
        steps = [`${a}x + ${b}x = ${lhs}`, `${a + b}x = ${lhs}`, `x = ${lhs} ÷ ${a + b}`, `x = ${ans}`];
        break;
      }
    }
    const wrongs = new Set<number>();
    while (wrongs.size < 3) {
      const w = ans + r(-4, 4);
      if (w !== ans && w >= 0) wrongs.add(w);
    }
    return { display, variable: 'x', answer: ans, options: [ans, ...wrongs].sort(() => Math.random() - 0.5), difficulty: diff, hint: steps[1], steps };
  }

  // Advanced
  const type = r(0, 3);
  let ans: number, display: string, steps: string[];
  switch (type) {
    case 0: {
      ans = r(1, 6); const a = r(2, 4); const b = r(1, 5); const c = r(1, 3);
      display = `${a}x + ${b} - ${c}x = ${(a - c) * ans + b}`;
      steps = [`${a}x + ${b} - ${c}x = ${(a - c) * ans + b}`, `${a - c}x + ${b} = ${(a - c) * ans + b}`, `${a - c}x = ${(a - c) * ans}`, `x = ${ans}`];
      break;
    }
    case 1: {
      ans = r(2, 8);
      display = `x² = ${ans * ans}`;
      steps = [`x² = ${ans * ans}`, `x = √${ans * ans}`, `x = ${ans}`];
      break;
    }
    case 2: {
      ans = r(1, 5); const a = r(2, 4);
      const val = Math.pow(ans, a);
      display = `x${superscript(a)} = ${val}`;
      steps = [`x${superscript(a)} = ${val}`, `x = ${val}^(1/${a})`, `x = ${ans}`];
      break;
    }
    default: {
      ans = r(2, 10); const a = r(2, 5); const b = r(1, 8); const c = r(2, 4);
      const lhs = a * ans + b;
      if (a > c) {
        display = `${a}x + ${b} = ${c}x + ${lhs - c * ans}`;
        steps = [`${a}x + ${b} = ${c}x + ${lhs - c * ans}`, `${a}x - ${c}x = ${lhs - c * ans} - ${b}`, `${a - c}x = ${lhs - c * ans - b}`, `x = ${ans}`];
      } else {
        display = `${a + 2}x + ${b} = ${a}x + ${2 * ans + b}`;
        steps = [`${a + 2}x + ${b} = ${a}x + ${2 * ans + b}`, `2x = ${2 * ans}`, `x = ${ans}`];
      }
      break;
    }
  }
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const w = ans + r(-5, 5);
    if (w !== ans && w > 0) wrongs.add(w);
  }
  return { display, variable: 'x', answer: ans, options: [ans, ...wrongs].sort(() => Math.random() - 0.5), difficulty: diff, hint: steps[1], steps };
};

function superscript(n: number): string {
  const map: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(n).split('').map(c => map[c] || c).join('');
}

export default function AlgebraArena() {
  const { t } = useTranslation();
  const math = useMathFeedback();
  const [difficulty, setDifficulty] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [equation, setEquation] = useState<Equation | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [mastery, setMastery] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(0);

  const nextEquation = useCallback(() => {
    setEquation(generateEquation(difficulty));
    setFeedback(null);
    setShowSteps(false);
    setRound(r => r + 1);
  }, [difficulty]);

  useEffect(() => { nextEquation(); }, [difficulty]);

  const handleAnswer = (option: number) => {
    if (feedback !== null || !equation) return;
    if (option === equation.answer) {
      setFeedback('correct');
      math.correct('algebra', difficulty === 'advanced' ? 30 : difficulty === 'intermediate' ? 20 : 10);
      setMastery(m => m + 1);
      setStreak(s => s + 1);
      setTimeout(nextEquation, 1500);
    } else {
      setFeedback('wrong');
      math.wrong('algebra');
      setStreak(0);
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  // Balance scale visual
  const BalanceScale = ({ eq }: { eq: Equation }) => {
    const { t } = useTranslation();
    const parts = eq.display.split('=');
    const solved = feedback === 'correct';
    return (
      <div className="flex flex-col items-center my-4">
        {/* Scale beam */}
        <div className="relative w-64 sm:w-80">
          <motion.div
            className="h-1 bg-gray-500 rounded-full relative"
            animate={{ rotate: solved ? 0 : [-2, 2, -2] }}
            transition={{ duration: 2, repeat: solved ? 0 : Infinity }}
          >
            {/* Fulcrum */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[16px] border-l-transparent border-r-transparent border-b-gray-500" />
            {/* Left pan */}
            <motion.div
              className="absolute -left-4 -top-14 w-28 sm:w-32 text-center"
              animate={solved ? { y: 0 } : { y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className={`px-3 py-2 rounded-xl border-2 text-sm sm:text-base font-bold ${solved ? 'bg-green-500/20 border-green-400 text-green-300' : 'bg-blue-500/20 border-blue-400 text-blue-300'}`}>
                {parts[0]?.trim()}
              </div>
              <div className="w-px h-4 bg-gray-500 mx-auto" />
              <div className="w-20 h-1 bg-gray-500 mx-auto rounded" />
            </motion.div>
            {/* Right pan */}
            <motion.div
              className="absolute -right-4 -top-14 w-28 sm:w-32 text-center"
              animate={solved ? { y: 0 } : { y: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className={`px-3 py-2 rounded-xl border-2 text-sm sm:text-base font-bold ${solved ? 'bg-green-500/20 border-green-400 text-green-300' : 'bg-orange-500/20 border-orange-400 text-orange-300'}`}>
                {parts[1]?.trim()}
              </div>
              <div className="w-px h-4 bg-gray-500 mx-auto" />
              <div className="w-20 h-1 bg-gray-500 mx-auto rounded" />
            </motion.div>
          </motion.div>
        </div>
        <div className="mt-8 text-gray-500 text-sm">{t('math_modules.AlgebraArena.balance', '⚖️ Both sides must be equal')}</div>
      </div>
    );
  };

  if (!equation) return null;

  const diffs = [
    { id: 'basic' as const, label: t('math_modules.AlgebraArena.diffBasic', 'Basic'), emoji: '🌱', desc: t('math_modules.AlgebraArena.diffBasicDesc', '1-step: 3x=12'), color: 'from-green-600 to-emerald-600' },
    { id: 'intermediate' as const, label: t('math_modules.AlgebraArena.diffInter', 'Intermediate'), emoji: '⚔️', desc: t('math_modules.AlgebraArena.diffInterDesc', '2-step: 2x+3=11'), color: 'from-blue-600 to-indigo-600' },
    { id: 'advanced' as const, label: t('math_modules.AlgebraArena.diffAdv', 'Advanced'), emoji: '🔥', desc: t('math_modules.AlgebraArena.diffAdvDesc', 'Multi-step, x², powers'), color: 'from-red-600 to-rose-600' },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{t('math_modules.AlgebraArena.title', '🧮 Algebra Arena')}</h2>
        <p className="text-purple-300 text-lg">{t('math_modules.AlgebraArena.subtitle', 'Solve for x — balance the equation!')}</p>
      </div>

      {/* Difficulty selector */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {diffs.map(d => (
          <motion.button
            key={d.id}
            className={`p-3 rounded-xl border-2 text-center transition-all ${difficulty === d.id ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDifficulty(d.id)}
          >
            <span className="text-2xl">{d.emoji}</span>
            <p className="text-white font-bold text-sm mt-1">{d.label}</p>
            <p className="text-gray-500 text-sm">{d.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-4 mb-4">
        <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold text-sm">⭐ {mastery}</span>
        <span className="bg-white/5 px-3 py-1.5 rounded-lg text-orange-400 font-bold text-sm">🔥 {streak}</span>
        <span className="bg-white/5 px-3 py-1.5 rounded-lg text-blue-400 font-bold text-sm">🔄 {round}</span>
      </div>

      {/* Equation card */}
      <motion.div
        key={round}
        className={`max-w-lg mx-auto rounded-3xl p-6 sm:p-8 border-2 transition-colors ${
          feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="text-center mb-2">
          <span className="text-sm bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full">{equation.difficulty}</span>
        </div>

        {/* Equation display */}
        <div className="text-center mb-2">
          <motion.p
            className="text-3xl sm:text-4xl font-bold text-white font-mono"
            key={equation.display}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {equation.display}
          </motion.p>
          <p className="text-gray-400 mt-1" dangerouslySetInnerHTML={{ __html: t('math_modules.AlgebraArena.findX', 'Find <span className="text-purple-400 font-bold">x</span>') }}></p>
        </div>

        {/* Balance Scale */}
        <BalanceScale eq={equation} />

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {equation.options.map((opt, i) => (
            <motion.button
              key={`${round}-${i}`}
              className={`py-3 rounded-xl text-xl font-bold transition-all ${
                feedback === 'correct' && opt === equation.answer ? 'bg-green-500 text-white ring-4 ring-green-400/50'
                : feedback === 'wrong' ? 'bg-white/5 text-gray-500'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/40'
              }`}
              whileHover={feedback === null ? { scale: 1.05 } : {}}
              whileTap={feedback === null ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(opt)}
              disabled={feedback !== null}
            >
              x = {opt}
            </motion.button>
          ))}
        </div>

        {/* Steps toggle */}
        <div className="mt-4 text-center">
          <button className="text-sm text-purple-400 hover:text-purple-300 underline decoration-dashed" onClick={() => setShowSteps(!showSteps)}>
            {showSteps ? t('math_modules.AlgebraArena.hideSteps', '🙈 Hide steps') : t('math_modules.AlgebraArena.showSteps', '📝 Show solution steps')}
          </button>
        </div>

        <AnimatePresence>
          {showSteps && (
            <motion.div className="mt-3 bg-black/30 rounded-xl p-4 space-y-2" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              {equation.steps.map((step, i) => (
                <motion.div key={i} className="flex items-center gap-2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.15 }}>
                  <span className="text-sm text-gray-500">{i + 1}.</span>
                  <span className={`font-mono text-sm ${i === equation.steps.length - 1 ? 'text-green-400 font-bold' : 'text-gray-300'}`}>{step}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {feedback === 'correct' && (
          <motion.p className="mt-4 text-center text-green-400 font-bold text-lg" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}>
            {t('math_modules.AlgebraArena.correct', '✨ x = {{ans}} is correct! ✨', { ans: equation.answer })}
          </motion.p>
        )}
        {feedback === 'wrong' && (
          <motion.p className="mt-4 text-center text-orange-400 font-bold" initial={{ x: -10 }} animate={{ x: [10, -10, 5, 0] }}>
            {t('math_modules.AlgebraArena.wrong', '🤔 Try again! Check the steps for a hint.')}
          </motion.p>
        )}
      </motion.div>

      <div className="text-center mt-4">
        <button className="text-gray-500 hover:text-gray-400 text-sm underline" onClick={nextEquation}>{t('math_modules.AlgebraArena.skip', 'Skip →')}</button>
      </div>
      <WhatsNext moduleId="algebra" />
    </div>
  );
}
