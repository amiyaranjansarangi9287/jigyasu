import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../lib/soundEngine';

interface Problem { question: string; answer: number; hint: string; solution: string; difficulty: 1 | 2 | 3 | 4 | 5; category: string; }

const PROBLEMS: (() => Problem)[] = [
  () => { const n = Math.floor(Math.random() * 5) + 5; const answer = (n * (n + 1)) / 2; return { question: `What is 1 + 2 + 3 + … + ${n}?`, answer, hint: 'Use the formula n(n+1)/2.', solution: `${n}×${n + 1}/2 = ${answer}`, difficulty: 1, category: 'Number Theory' }; },
  () => { const answer = 2; return { question: 'How many prime numbers are even?', answer, hint: 'Is 2 even? Is 2 prime? Are there other even primes?', solution: 'Only 2 is both even and prime. Wait — just 1. Trick: the answer is 1!', difficulty: 2, category: 'Primes' }; },
  () => { const a = Math.floor(Math.random() * 5) + 3; const b = a + 2; const answer = a * b; return { question: `The product of two consecutive odd numbers is ${answer}. What are they? (Give the smaller)`, answer: a, hint: 'Try n(n+2) for odd values of n.', solution: `${a} × ${b} = ${answer}`, difficulty: 2, category: 'Algebra' }; },
  () => { const n = Math.floor(Math.random() * 4) + 4; const answer = n * (n - 3) / 2; return { question: `How many diagonals does a ${n}-sided polygon have?`, answer, hint: 'Formula: n(n-3)/2.', solution: `${n}(${n}-3)/2 = ${n}×${n - 3}/2 = ${answer}`, difficulty: 3, category: 'Geometry' }; },
  () => { const base = Math.floor(Math.random() * 3) + 2; const answer = Math.pow(base, 10) % 10; return { question: `What is the units digit of ${base}¹⁰?`, answer, hint: 'Look at the cycle of units digits for powers of the base.', solution: `Powers of ${base}: units digits cycle. ${base}¹⁰ ends in ${answer}.`, difficulty: 3, category: 'Number Theory' }; },
  () => { const a = Math.floor(Math.random() * 10) + 10; const b = Math.floor(Math.random() * 10) + 10; const answer = (a + b) * (a - b); return { question: `${a}² - ${b}² = ?`, answer, hint: 'Use difference of squares: a² - b² = (a+b)(a-b).', solution: `(${a}+${b})(${a}-${b}) = ${a + b} × ${a - b} = ${answer}`, difficulty: 2, category: 'Algebra' }; },
  () => { const n = Math.floor(Math.random() * 3) + 3; const answer = Math.pow(2, n); return { question: `How many subsets does a set with ${n} elements have?`, answer, hint: 'Each element is either in or out → 2 choices per element.', solution: `2^${n} = ${answer}`, difficulty: 3, category: 'Combinatorics' }; },
  () => { const n = Math.floor(Math.random() * 5) + 5; const answer = (n * (n + 1) * (2 * n + 1)) / 6; return { question: `1² + 2² + 3² + … + ${n}² = ?`, answer, hint: 'Sum of squares formula: n(n+1)(2n+1)/6.', solution: `${n}×${n + 1}×${2 * n + 1}/6 = ${answer}`, difficulty: 4, category: 'Number Theory' }; },
  () => { const answer = 5; return { question: 'The interior angles of a polygon sum to 540°. How many sides?', answer, hint: 'Sum of interior angles = (n-2)×180.', solution: '(n-2)×180 = 540 → n-2 = 3 → n = 5 (pentagon)', difficulty: 3, category: 'Geometry' }; },
  () => { const n = Math.floor(Math.random() * 4) + 4; const k = 2; const answer = (n * (n - 1)) / 2; return { question: `C(${n}, ${k}) = ? (combinations)`, answer, hint: 'C(n,2) = n(n-1)/2.', solution: `C(${n},2) = ${n}!/((${n}-2)!×2!) = ${n}×${n - 1}/2 = ${answer}`, difficulty: 4, category: 'Combinatorics' }; },
  () => { const n = Math.floor(Math.random() * 3) + 3; return { question: `A staircase has ${n} steps. How many unit squares are used? (Each step i has i squares wide and 1 tall)`, answer: (n * (n + 1)) / 2, hint: 'Sum of 1 + 2 + 3 + … + n.', solution: `Sum = ${n}(${n}+1)/2 = ${(n * (n + 1)) / 2}`, difficulty: 2, category: 'Counting' }; },
  () => { return { question: 'How many 3-letter arrangements can be made from A, B, C, D, E (no repeats)?', answer: 60, hint: 'Permutation: P(5,3) = 5×4×3.', solution: 'P(5,3) = 5×4×3 = 60', difficulty: 4, category: 'Combinatorics' }; },
];

export default function MathOlympiad() {
  const [problem, setProblem] = useState<Problem>(() => PROBLEMS[0]());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(0);
  const [attempted, setAttempted] = useState(0);

  const next = useCallback(() => {
    setProblem(PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)]());
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
  }, []);

  const checkAnswer = () => {
    if (feedback) return;
    setAttempted(a => a + 1);
    const parsed = Number(userAnswer);
    if (parsed === problem.answer) {
      setFeedback('correct');
      sfx.correct();
      setScore(s => s + problem.difficulty * 5);
      setSolved(s => s + 1);
    } else {
      setFeedback('wrong');
      sfx.wrong();
    }
  };

  const diffStars = '⭐'.repeat(problem.difficulty) + '☆'.repeat(5 - problem.difficulty);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Math Olympiad</h2>
        <p className="text-purple-300 text-lg">AMC/MATHCOUNTS-style challenge problems!</p>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold text-sm">⭐ {score}</span>
        <span className="bg-white/5 px-3 py-1.5 rounded-lg text-green-400 font-bold text-sm">✅ {solved}/{attempted}</span>
      </div>

      <motion.div
        key={problem.question}
        className={`max-w-xl mx-auto rounded-3xl p-6 sm:p-8 border-2 transition-colors ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-yellow-500/30'}`}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full">{problem.category}</span>
          <span className="text-sm text-gray-400">{diffStars}</span>
        </div>

        <div className="bg-black/20 rounded-2xl p-5 mb-5">
          <motion.span className="text-4xl block text-center mb-3" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>🏆</motion.span>
          <p className="text-white text-lg leading-relaxed text-center">{problem.question}</p>
        </div>

        {!feedback && (
          <div className="flex gap-2 mb-4">
            <input type="number" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
              className="flex-1 bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 text-white text-xl font-bold text-center focus:outline-none focus:border-yellow-400"
              placeholder="Your answer"
              onKeyDown={e => e.key === 'Enter' && checkAnswer()} />
            <motion.button className="px-6 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold text-lg"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={checkAnswer}>✓</motion.button>
          </div>
        )}

        <div className="flex justify-center gap-4">
          {!showHint && !feedback && <button className="text-sm text-amber-400 hover:text-amber-300 underline decoration-dashed" onClick={() => setShowHint(true)}>💡 Hint</button>}
          {feedback && <button className="text-sm text-blue-400 hover:text-blue-300 underline decoration-dashed" onClick={() => setShowSolution(true)}>📝 Solution</button>}
          {feedback && <button className="text-sm text-purple-400 hover:text-purple-300 underline decoration-dashed" onClick={next}>Next Problem →</button>}
        </div>

        <AnimatePresence>
          {showHint && <motion.p className="mt-3 text-center text-amber-300 bg-amber-500/10 rounded-lg px-3 py-2 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>💡 {problem.hint}</motion.p>}
          {showSolution && <motion.p className="mt-3 text-center text-blue-300 bg-blue-500/10 rounded-lg px-3 py-2 text-sm font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>📝 {problem.solution}</motion.p>}
        </AnimatePresence>

        {feedback === 'correct' && <motion.p className="mt-4 text-center text-green-400 font-bold text-lg" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}>🏆 Brilliant! +{problem.difficulty * 5} points</motion.p>}
        {feedback === 'wrong' && <motion.p className="mt-4 text-center text-red-400 font-bold" initial={{ x: -10 }} animate={{ x: [10, -10, 5, 0] }}>❌ Answer: {problem.answer}. Check the solution!</motion.p>}
      </motion.div>
    </div>
  );
}
