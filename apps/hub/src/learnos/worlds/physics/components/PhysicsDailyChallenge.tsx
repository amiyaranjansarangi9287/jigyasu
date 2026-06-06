// src/worlds/physics/components/PhysicsDailyChallenge.tsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

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
  const seed = day * 54321;
  const r = (max: number) => Math.floor(seededRandom(seed + max) * max);

  const challenges: (() => Challenge)[] = [
    () => {
      const v = r(30) + 10;
      const t = r(5) + 1;
      const a = 9.8;
      const answer = Math.round(v * t + 0.5 * a * t ** 2);
      return {
        id: `kinematics-${day}`,
        question: `An object moves at ${v} m/s and accelerates at ${a} m/s² for ${t}s. Distance traveled?`,
        answer,
        options: [answer, answer + 10, answer - 5, answer + 20].sort(() => seededRandom(seed) - 0.5),
        category: '🎯 Kinematics',
        difficulty: 'Medium',
        hint: 'Use: s = vt + ½at²',
        explanation: `s = ${v}×${t} + ½×${a}×${t}² = ${v * t} + ${Math.round(0.5 * a * t ** 2)} = ${answer}m`,
      };
    },
    () => {
      const m = r(10) + 1;
      const a = r(20) + 5;
      const answer = m * a;
      return {
        id: `newton-${day}`,
        question: `Force on a ${m}kg object accelerating at ${a} m/s²?`,
        answer,
        options: [answer, answer + m, answer * 2, answer - a].sort(() => seededRandom(seed) - 0.5),
        category: '🍎 Newton\'s Laws',
        difficulty: 'Easy',
        hint: 'F = ma',
        explanation: `F = ${m} × ${a} = ${answer} N`,
      };
    },
    () => {
      const m = r(5) + 1;
      const h = r(20) + 5;
      const g = 9.8;
      const answer = Math.round(m * g * h);
      return {
        id: `energy-${day}`,
        question: `PE of a ${m}kg object at ${h}m height? (g=9.8)`,
        answer,
        options: [answer, answer + 50, answer - 20, answer * 2].sort(() => seededRandom(seed) - 0.5),
        category: '🛹 Energy',
        difficulty: 'Medium',
        hint: 'PE = mgh',
        explanation: `PE = ${m} × 9.8 × ${h} = ${answer} J`,
      };
    },
    () => {
      const v = r(300) + 100;
      const f = r(500) + 200;
      const answer = Math.round(v / f * 100) / 100;
      return {
        id: `wave-${day}`,
        question: `Wavelength of sound at ${f}Hz? (speed=${v}m/s)`,
        answer: Math.round(answer * 100) / 100,
        options: [Math.round(answer * 100) / 100, Math.round((answer + 0.5) * 100) / 100, Math.round((answer - 0.3) * 100) / 100, Math.round((answer + 1) * 100) / 100].sort(() => seededRandom(seed) - 0.5),
        category: '🌊 Waves',
        difficulty: 'Hard',
        hint: 'λ = v/f',
        explanation: `λ = ${v} / ${f} = ${answer.toFixed(2)} m`,
      };
    },
    () => {
      const v = r(20) + 5;
      const r_val = r(10) + 1;
      const answer = Math.round((v ** 2) / r_val);
      return {
        id: `circular-${day}`,
        question: `Centripetal acceleration: v=${v}m/s, r=${r_val}m?`,
        answer,
        options: [answer, answer + 10, answer - 5, answer * 2].sort(() => seededRandom(seed) - 0.5),
        category: '🔄 Circular Motion',
        difficulty: 'Medium',
        hint: 'a = v²/r',
        explanation: `a = ${v}² / ${r_val} = ${v ** 2} / ${r_val} = ${answer} m/s²`,
      };
    },
    () => {
      const r1 = r(100) + 10;
      const r2 = r(100) + 10;
      const answer = Math.round((r1 * r2) / (r1 + r2) * 10) / 10;
      return {
        id: `circuit-${day}`,
        question: `Parallel resistance: R₁=${r1}Ω, R₂=${r2}Ω?`,
        answer,
        options: [answer, answer + 10, r1 + r2, Math.round((r1 + r2) / 2 * 10) / 10].sort(() => seededRandom(seed) - 0.5),
        category: '⚡ Circuits',
        difficulty: 'Hard',
        hint: '1/R = 1/R₁ + 1/R₂',
        explanation: `R = (${r1}×${r2})/(${r1}+${r2}) = ${r1 * r2}/${r1 + r2} = ${answer}Ω`,
      };
    },
  ];

  return challenges[day % challenges.length]();
}

export default function PhysicsDailyChallenge() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const day = getDayOfYear();
  const challenge = useMemo(() => generateDailyChallenge(day), [day]);
  const [selected, setSelected] = useState<number | null>(null);
  const [streak, setStreak] = useState(() => {
    try { return parseInt(localStorage.getItem('physics_streak') || '0'); } catch { return 0; }
  });
  const [showHint, setShowHint] = useState(false);

  const isCorrect = selected === challenge.options.indexOf(challenge.answer);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (challenge.options[idx] === challenge.answer) {
      setStreak(prev => {
        const next = prev + 1;
        localStorage.setItem('physics_streak', String(next));
        return next;
      });
      const updated = completeModule(progress, 'daily-challenge', 95);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-gray-900 via-blue-950/30 to-gray-900 rounded-3xl border border-blue-500/20 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-blue-400">Daily Challenge</span>
            <h2 className="text-2xl font-bold text-white mt-1">⚛️ Physics of the Day</h2>
          </div>
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2">
            <span className="text-orange-400 text-lg">🔥</span>
            <span className="text-orange-400 font-bold">{streak}</span>
          </div>
        </div>

        {/* Challenge Info */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">{challenge.category.split(' ')[0]}</span>
          <div>
            <p className="text-white font-bold">{challenge.category}</p>
            <p className={`text-sm font-bold ${challenge.difficulty === 'Easy' ? 'text-green-400' : challenge.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>{challenge.difficulty}</p>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800/50 rounded-2xl p-5 mb-6">
          <p className="text-lg text-white font-medium">{challenge.question}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {challenge.options.map((opt, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              whileHover={{ scale: selected === null ? 1.02 : 1 }}
              whileTap={{ scale: selected === null ? 0.98 : 1 }}
              className={`py-4 rounded-xl text-lg font-bold transition-all ${
                selected === null
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  : challenge.options[idx] === challenge.answer
                  ? 'bg-green-600 text-white'
                  : selected === idx
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-500'
              } disabled:cursor-not-allowed`}
            >
              {opt}
            </motion.button>
          ))}
        </div>

        {/* Hint */}
        {!showHint && selected === null && (
          <button onClick={() => setShowHint(true)} className="w-full py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-sm hover:bg-blue-600/30">💡 Show Hint</button>
        )}
        {showHint && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
            <p className="text-blue-300 text-sm">{challenge.hint}</p>
          </div>
        )}

        {/* Explanation */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800/50 rounded-2xl p-5">
              <p className={`font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '✅ Correct!' : '🤔 Not quite!'}
              </p>
              <p className="text-gray-300 text-sm">{challenge.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">New challenge every day! Come back tomorrow for another.</p>
      </motion.div>
    </div>
  );
}
