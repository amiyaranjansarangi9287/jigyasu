import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMathFeedback } from '../lib/MathContext';

interface Challenge {
  id: string;
  question: string;
  answer: number;
  options: number[];
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hint: string;
  explanation: string;
}

// Deterministic random based on date
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function generateDailyChallenge(day: number): Challenge {
  const seed = day * 12345;
  const r = (max: number) => Math.floor(seededRandom(seed + max) * max);

  const challenges: (() => Challenge)[] = [
    () => {
      const a = r(20) + 10;
      const b = r(20) + 10;
      const c = r(10) + 5;
      const answer = a + b * c;
      return {
        id: `bodmas-${day}`,
        question: `${a} + ${b} × ${c} = ?`,
        answer,
        options: [answer, answer + b, a * b + c, answer - c].sort(() => seededRandom(seed) - 0.5),
        category: '🔢 BODMAS',
        difficulty: 'Medium',
        hint: 'Remember: Multiplication before addition!',
        explanation: `First: ${b} × ${c} = ${b * c}, then ${a} + ${b * c} = ${answer}`,
      };
    },
    () => {
      const base = r(10) + 5;
      const answer = base * base;
      return {
        id: `squares-${day}`,
        question: `${base}² = ?`,
        answer,
        options: [answer, base * 2, answer + base, answer - 1].sort(() => seededRandom(seed) - 0.5),
        category: '² Squares',
        difficulty: 'Easy',
        hint: `${base} × ${base}`,
        explanation: `${base}² = ${base} × ${base} = ${answer}`,
      };
    },
    () => {
      const pct = [10, 20, 25, 50][r(4)];
      const whole = (r(10) + 2) * (100 / pct);
      const answer = (whole * pct) / 100;
      return {
        id: `percent-${day}`,
        question: `${pct}% of ${whole} = ?`,
        answer,
        options: [answer, answer + 10, whole / pct, answer * 2].sort(() => seededRandom(seed) - 0.5),
        category: '% Percentage',
        difficulty: 'Medium',
        hint: `${pct}% = ${pct}/100`,
        explanation: `${whole} × ${pct}/100 = ${whole} × ${pct / 100} = ${answer}`,
      };
    },
    () => {
      const a = r(5) + 2;
      const b = r(8) + 2;
      return {
        id: `algebra-${day}`,
        question: `If 2x + ${b} = ${2 * a + b}, what is x?`,
        answer: a,
        options: [a, a + 1, a - 1, b].sort(() => seededRandom(seed) - 0.5),
        category: '🧮 Algebra',
        difficulty: 'Medium',
        hint: 'Isolate x by subtracting, then dividing',
        explanation: `2x = ${2 * a + b} - ${b} = ${2 * a}, so x = ${a}`,
      };
    },
    () => {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
      const idx = r(6);
      const answer = primes[idx + 1];
      return {
        id: `prime-${day}`,
        question: `What comes next: ${primes.slice(idx, idx + 4).join(', ')}, ?`,
        answer,
        options: [answer, answer + 1, primes[idx + 2] + 2, answer - 1].sort(() => seededRandom(seed) - 0.5),
        category: '👑 Primes',
        difficulty: 'Hard',
        hint: 'These are prime numbers',
        explanation: `The next prime after ${primes[idx + 3]} is ${answer}`,
      };
    },
    () => {
      const a = r(8) + 3;
      const b = r(8) + 3;
      const answer = Math.sqrt(a * a + b * b);
      const isWhole = Number.isInteger(answer);
      if (!isWhole) {
        const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
        const [ta, tb, tc] = triples[r(triples.length)];
        return {
          id: `pyth-${day}`,
          question: `Right triangle: a=${ta}, b=${tb}. Find c (hypotenuse)?`,
          answer: tc,
          options: [tc, ta + tb, tc + 1, tc - 1].sort(() => seededRandom(seed) - 0.5),
          category: '📐 Geometry',
          difficulty: 'Hard',
          hint: 'Use a² + b² = c²',
          explanation: `${ta}² + ${tb}² = ${ta * ta} + ${tb * tb} = ${tc * tc}, so c = ${tc}`,
        };
      }
      return {
        id: `pyth-${day}`,
        question: `Right triangle: a=${a}, b=${b}. Find c?`,
        answer,
        options: [answer, a + b, answer + 1, answer - 1].sort(() => seededRandom(seed) - 0.5),
        category: '📐 Geometry',
        difficulty: 'Hard',
        hint: 'Use a² + b² = c²',
        explanation: `${a}² + ${b}² = ${a * a + b * b}, √${a * a + b * b} = ${answer}`,
      };
    },
  ];

  return challenges[day % challenges.length]();
}

export default function DailyChallenge() {
  const math = useMathFeedback();
  const [completed, setCompleted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);

  const day = getDayOfYear();
  const challenge = useMemo(() => generateDailyChallenge(day), [day]);

  // Load saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mathkingdom_daily');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.day === day && data.completed) {
          setCompleted(true);
          setSelected(challenge.answer);
          setFeedback('correct');
        }
        setStreak(data.streak || 0);
      }
    } catch {}
  }, [day, challenge.answer]);

  const handleAnswer = (opt: number) => {
    if (completed || feedback) return;
    setSelected(opt);
    if (opt === challenge.answer) {
      setFeedback('correct');
      math.correct('daily-challenge', 15);
      setCompleted(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      try {
        localStorage.setItem('mathkingdom_daily', JSON.stringify({ day, completed: true, streak: newStreak }));
      } catch {}
    } else {
      setFeedback('wrong');
      math.wrong('daily-challenge');
      setTimeout(() => { setFeedback(null); setSelected(null); }, 1000);
    }
  };

  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const difficultyColor = {
    'Easy': 'text-green-400',
    'Medium': 'text-yellow-400',
    'Hard': 'text-red-400',
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🎯 Daily Challenge</h2>
        <p className="text-purple-300 text-lg">A new challenge every day!</p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="bg-white/5 rounded-xl px-4 py-2 border border-white/10 text-center">
          <p className="text-gray-400 text-xs">Day</p>
          <p className="text-white font-bold">#{day}</p>
        </div>
        <div className="bg-orange-500/10 rounded-xl px-4 py-2 border border-orange-500/20 text-center">
          <p className="text-gray-400 text-xs">Streak</p>
          <p className="text-orange-400 font-bold">🔥 {streak}</p>
        </div>
        <div className="bg-white/5 rounded-xl px-4 py-2 border border-white/10 text-center">
          <p className="text-gray-400 text-xs">Resets in</p>
          <p className="text-white font-bold">{getTimeUntilReset()}</p>
        </div>
      </div>

      {/* Challenge card */}
      <motion.div
        className={`rounded-3xl p-6 border-2 transition-colors ${
          feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' :
          feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' :
          'bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/30'
        }`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">{challenge.category}</span>
          <span className={`text-xs font-bold ${difficultyColor[challenge.difficulty]}`}>{challenge.difficulty}</span>
        </div>

        <p className="text-2xl font-bold text-white text-center mb-6">{challenge.question}</p>

        <div className="grid grid-cols-2 gap-3">
          {challenge.options.map((opt, i) => (
            <motion.button
              key={i}
              className={`py-4 rounded-xl text-xl font-bold transition-all ${
                feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white ring-4 ring-green-400/50' :
                feedback === 'wrong' && selected === opt ? 'bg-red-500 text-white' :
                completed ? 'bg-white/5 text-gray-500' :
                'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
              whileHover={!completed ? { scale: 1.05 } : {}}
              whileTap={!completed ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(opt)}
              disabled={completed || feedback !== null}
            >
              {opt}
            </motion.button>
          ))}
        </div>

        {/* Hint */}
        {!completed && !showHint && (
          <button className="w-full mt-4 text-sm text-purple-400 hover:text-purple-300 underline decoration-dashed"
            onClick={() => setShowHint(true)}>
            💡 Need a hint?
          </button>
        )}
        {showHint && !completed && (
          <motion.p className="mt-4 text-center text-amber-300 bg-amber-500/10 rounded-lg px-3 py-2 text-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            💡 {challenge.hint}
          </motion.p>
        )}

        {/* Result */}
        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.div className="mt-6 text-center"
              initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <span className="text-5xl">🏆</span>
              <p className="text-green-400 font-bold text-xl mt-2">Daily Challenge Complete!</p>
              <p className="text-gray-400 text-sm mt-1">{challenge.explanation}</p>
              <p className="text-orange-400 font-bold mt-2">🔥 {streak} day streak!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {completed && (
        <p className="text-center text-gray-500 mt-4 text-sm">
          Come back tomorrow for a new challenge! ⏰
        </p>
      )}
    </div>
  );
}
