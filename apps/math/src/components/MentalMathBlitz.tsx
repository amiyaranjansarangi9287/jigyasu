import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../lib/soundEngine';

type Category = 'bodmas' | 'squares' | 'percentages' | 'powers' | 'mixed';

interface Question {
  display: string;
  answer: number;
  options: number[];
  category: Category;
  difficulty: number;
}

const generateQuestion = (cat: Category, diff: number): Question => {
  const r = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
  let display: string, answer: number;

  const actualCat = cat === 'mixed' ? (['bodmas', 'squares', 'percentages', 'powers'] as Category[])[r(0, 3)] : cat;

  switch (actualCat) {
    case 'bodmas': {
      const type = r(0, 3 + diff);
      switch (type) {
        case 0: { const a = r(2, 10); const b = r(1, 10); const c = r(1, 10); answer = a + b * c; display = `${a} + ${b} × ${c}`; break; }
        case 1: { const a = r(5, 20); const b = r(1, 5); const c = r(1, 5); answer = a - b * c; display = `${a} - ${b} × ${c}`; break; }
        case 2: { const a = r(1, 5); const b = r(1, 5); const c = r(1, 5); answer = a * (b + c); display = `${a} × (${b} + ${c})`; break; }
        case 3: { const a = r(2, 8); const c = r(1, 10); answer = a * a + c; display = `${a}² + ${c}`; break; }
        case 4: { const a = r(10, 50); const b = r(2, 5); const c = r(1, 10); answer = a / b + c; display = `${a} ÷ ${b} + ${c}`; if (!Number.isInteger(answer)) { answer = a + b * c; display = `${a} + ${b} × ${c}`; } break; }
        default: { const a = r(1, 5); const b = r(1, 5); const c = r(1, 3); answer = (a + b) * c; display = `(${a} + ${b}) × ${c}`; break; }
      }
      break;
    }
    case 'squares': {
      const n = r(2, 12 + diff * 3);
      if (r(0, 1) === 0) { answer = n * n; display = `${n}² = ?`; }
      else { answer = n; display = `√${n * n} = ?`; }
      break;
    }
    case 'percentages': {
      const type = r(0, 2);
      switch (type) {
        case 0: { const pct = [10, 20, 25, 50, 75][r(0, 4)]; const of = r(2, 20) * (100 / pct); answer = (pct / 100) * of; display = `${pct}% of ${of}`; break; }
        case 1: { const a = r(10, 100); const pct = r(1, 5) * 10; answer = a + (pct / 100) * a; display = `${a} + ${pct}% of ${a}`; break; }
        default: { const a = r(5, 50) * 2; const b = r(1, a); answer = Math.round((b / a) * 100); display = `${b} out of ${a} = ?%`; break; }
      }
      break;
    }
    case 'powers': {
      const type = r(0, 2);
      switch (type) {
        case 0: { const base = r(2, 5); const exp = r(2, 4); answer = Math.pow(base, exp); display = `${base}${toSup(exp)} = ?`; break; }
        case 1: { const base = r(2, 5); answer = base * base * base; display = `${base}³ = ?`; break; }
        default: { const base = r(2, 10); answer = base * base; display = `${base}² = ?`; break; }
      }
      break;
    }
    default: {
      answer = r(1, 50);
      display = `${answer}`;
    }
  }

  answer = Math.round(answer);
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const offset = r(1, Math.max(5, Math.abs(answer) / 3 + 1));
    const w = answer + (Math.random() > 0.5 ? offset : -offset);
    const rounded = Math.round(w);
    if (rounded !== answer && rounded >= 0) wrongs.add(rounded);
  }

  return {
    display,
    answer,
    options: [answer, ...wrongs].sort(() => Math.random() - 0.5),
    category: actualCat,
    difficulty: diff,
  };
};

function toSup(n: number): string {
  const m: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(n).split('').map(c => m[c] || c).join('');
}

export default function MentalMathBlitz() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'results'>('menu');
  const [category, setCategory] = useState<Category>('mixed');
  const [difficulty, setDifficulty] = useState(1);
  const [question, setQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const qRef = useRef(0);

  const nextQ = useCallback(() => {
    qRef.current++;
    setQuestion(generateQuestion(category, difficulty));
    setFeedback(null);
  }, [category, difficulty]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(90);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrect(0);
    setTotal(0);
    nextQ();
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) { setGameState('results'); return; }
    const t = setInterval(() => setTimeLeft(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [gameState, timeLeft]);

  const handleAnswer = (opt: number) => {
    if (feedback || !question) return;
    setTotal(t => t + 1);
    if (opt === question.answer) {
      setFeedback('correct');
      sfx.correct();
      const pts = (10 + difficulty * 5) * (1 + Math.floor(streak / 3));
      setScore(s => s + pts);
      setStreak(s => { const n = s + 1; setMaxStreak(m => Math.max(m, n)); return n; });
      setCorrect(c => c + 1);
      // Adaptive difficulty
      if (streak > 0 && streak % 5 === 0 && difficulty < 3) setDifficulty(d => d + 1);
      setTimeout(nextQ, 500);
    } else {
      setFeedback('wrong');
      sfx.wrong();
      setStreak(0);
      setTimeout(nextQ, 800);
    }
  };

  const categories: { id: Category; emoji: string; label: string; desc: string }[] = [
    { id: 'bodmas', emoji: '🔢', label: 'BODMAS', desc: 'Order of operations' },
    { id: 'squares', emoji: '²', label: 'Squares & Roots', desc: 'n² and √n' },
    { id: 'percentages', emoji: '%', label: 'Percentages', desc: '% calculations' },
    { id: 'powers', emoji: '⚡', label: 'Powers', desc: 'Exponents' },
    { id: 'mixed', emoji: '🎲', label: 'Mixed', desc: 'All topics!' },
  ];

  const getCatEmoji = (c: Category) => categories.find(x => x.id === c)?.emoji || '🎲';

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🧠 Mental Math Blitz</h2>
        <p className="text-purple-300 text-lg">Advanced speed challenges for sharp minds!</p>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-lg mx-auto space-y-4">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-gray-400 text-sm mb-3">Choose category:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map(c => (
                  <motion.button key={c.id}
                    className={`p-3 rounded-xl border-2 text-center ${category === c.id ? 'border-purple-400 bg-purple-500/20' : 'border-white/10 bg-white/5'}`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(c.id)}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <p className="text-white font-bold text-xs mt-1">{c.label}</p>
                    <p className="text-gray-500 text-[10px]">{c.desc}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-gray-400 text-sm mb-3">Difficulty:</p>
              <div className="flex gap-2">
                {[1, 2, 3].map(d => (
                  <motion.button key={d}
                    className={`flex-1 py-3 rounded-xl font-bold ${difficulty === d ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white/10 text-gray-400'}`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDifficulty(d)}
                  >
                    {d === 1 ? '🌱 Normal' : d === 2 ? '⚔️ Hard' : '🔥 Extreme'}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl shadow-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startGame}
            >
              🚀 Start Blitz! (90 seconds)
            </motion.button>
          </motion.div>
        )}

        {gameState === 'playing' && question && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-lg mx-auto">
            {/* Stats bar */}
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex gap-2">
                <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold text-sm">⭐ {score}</span>
                <span className="bg-white/5 px-3 py-1.5 rounded-lg text-orange-400 font-bold text-sm">🔥 {streak}</span>
                <span className="bg-white/5 px-3 py-1.5 rounded-lg text-blue-400 font-bold text-sm">{getCatEmoji(question.category)}</span>
              </div>
              <motion.span
                className={`font-bold text-lg ${timeLeft > 30 ? 'text-green-400' : timeLeft > 10 ? 'text-yellow-400' : 'text-red-400'}`}
                animate={timeLeft <= 10 ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ⏱️ {timeLeft}s
              </motion.span>
            </div>

            <div className="h-2 w-full bg-gray-700 rounded-full mb-4 overflow-hidden">
              <motion.div className={`h-full rounded-full ${timeLeft > 30 ? 'bg-green-500' : timeLeft > 10 ? 'bg-yellow-500' : 'bg-red-500'}`}
                animate={{ width: `${(timeLeft / 90) * 100}%` }}
              />
            </div>

            <motion.div
              key={qRef.current}
              className={`rounded-3xl p-8 text-center border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}
              initial={{ scale: 0.9, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: 'spring' }}
            >
              <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                {question.category.toUpperCase()} · Lv{question.difficulty}
              </span>
              <p className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-6 font-mono">{question.display}</p>

              <div className="grid grid-cols-2 gap-3">
                {question.options.map((opt, i) => (
                  <motion.button
                    key={`${qRef.current}-${i}`}
                    className={`py-3 rounded-xl text-xl font-bold ${
                      feedback === 'correct' && opt === question.answer ? 'bg-green-500 text-white'
                      : feedback === 'wrong' && opt === question.answer ? 'bg-green-500/50 text-green-200'
                      : feedback === 'wrong' ? 'bg-white/5 text-gray-500'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                    whileHover={!feedback ? { scale: 1.05 } : {}}
                    whileTap={!feedback ? { scale: 0.95 } : {}}
                    onClick={() => handleAnswer(opt)}
                    disabled={feedback !== null}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>

              {feedback === 'correct' && <motion.p className="mt-3 text-green-400 font-bold" initial={{ scale: 0 }} animate={{ scale: 1 }}>✨ Correct!</motion.p>}
              {feedback === 'wrong' && <p className="mt-3 text-red-400 font-bold">❌ Answer: {question.answer}</p>}
            </motion.div>
          </motion.div>
        )}

        {gameState === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center">
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-3xl border border-purple-500/30 p-8">
              <motion.div className="text-7xl mb-3" animate={{ rotate: [0, 360] }} transition={{ duration: 2 }}>🧠</motion.div>
              <h3 className="text-3xl font-bold text-white mb-4">Blitz Complete!</h3>
              <div className="space-y-3 mb-6">
                {[
                  { label: '⭐ Score', value: score, color: 'text-yellow-400' },
                  { label: '✅ Accuracy', value: `${total > 0 ? Math.round((correct / total) * 100) : 0}%`, color: 'text-green-400' },
                  { label: '🔥 Best Streak', value: maxStreak, color: 'text-orange-400' },
                  { label: '📊 Questions', value: `${correct}/${total}`, color: 'text-blue-400' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3">
                    <span className="text-gray-400">{s.label}</span>
                    <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-purple-300 mb-4 font-bold">
                {score >= 500 ? '🏆 Mental Math LEGEND!' : score >= 300 ? '⚡ Lightning Calculator!' : score >= 150 ? '🧙 Math Sorcerer!' : '📚 Keep training!'}
              </p>
              <motion.button className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={startGame}>
                🔄 Play Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
