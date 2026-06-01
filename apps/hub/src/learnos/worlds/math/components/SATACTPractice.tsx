import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../lib/soundEngine';

interface Question { id: number; question: string; options: string[]; answer: string; category: string; difficulty: 'Easy' | 'Medium' | 'Hard'; explanation: string; }

const QUESTION_BANK: (() => Question)[] = [
  () => { const a = Math.floor(Math.random() * 8) + 2; const b = Math.floor(Math.random() * 8) + 2; const c = a * a - b * b; return { id: 0, question: `If x² - ${b * b} = ${c}, what is x?`, options: [String(a), String(a + 1), String(b), String(a - 1)].sort(() => Math.random() - 0.5), answer: String(a), category: 'Algebra', difficulty: 'Easy', explanation: `x² = ${c} + ${b * b} = ${a * a}, so x = ${a}` }; },
  () => { const m = Math.floor(Math.random() * 5) + 1; const b = Math.floor(Math.random() * 10) - 5; const x = Math.floor(Math.random() * 5) + 1; const y = m * x + b; return { id: 1, question: `Line passes through (0, ${b}) and (${x}, ${y}). What is the slope?`, options: [String(m), String(m + 1), String(m - 1), String(-m)].sort(() => Math.random() - 0.5), answer: String(m), category: 'Coordinate Geometry', difficulty: 'Easy', explanation: `Slope = (${y} - ${b}) / (${x} - 0) = ${y - b} / ${x} = ${m}` }; },
  () => { const r = Math.floor(Math.random() * 6) + 3; const area = Math.round(Math.PI * r * r); return { id: 2, question: `Circle with radius ${r}. Area closest to?`, options: [String(area), String(area + 10), String(Math.round(2 * Math.PI * r)), String(area - 8)].sort(() => Math.random() - 0.5), answer: String(area), category: 'Geometry', difficulty: 'Medium', explanation: `A = πr² = π × ${r}² ≈ ${area}` }; },
  () => { const pct = [15, 20, 25, 30][Math.floor(Math.random() * 4)]; const orig = Math.floor(Math.random() * 8 + 3) * 20; const sale = orig - (orig * pct / 100); return { id: 3, question: `Item costs $${orig}. After ${pct}% discount, price is?`, options: [`$${sale}`, `$${sale + 10}`, `$${orig - pct}`, `$${Math.round(orig * pct / 100)}`].sort(() => Math.random() - 0.5), answer: `$${sale}`, category: 'Percent', difficulty: 'Easy', explanation: `Discount = $${orig} × ${pct}% = $${orig * pct / 100}. Final = $${sale}` }; },
  () => { const a = Math.floor(Math.random() * 5) + 2; const b = Math.floor(Math.random() * 5) + 2; const answer = a * a + b * b; const c = Math.round(Math.sqrt(answer)); return { id: 4, question: `Right triangle with legs ${a} and ${b}. Hypotenuse² = ?`, options: [String(answer), String(answer + 1), String(a + b), String(c * c + 1)].sort(() => Math.random() - 0.5), answer: String(answer), category: 'Geometry', difficulty: 'Medium', explanation: `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${answer}` }; },
  () => { const n = Math.floor(Math.random() * 5) + 3; const avg = Math.floor(Math.random() * 20) + 60; const sum = n * avg; return { id: 5, question: `Average of ${n} numbers is ${avg}. Sum of all numbers?`, options: [String(sum), String(sum + avg), String(n + avg), String(sum - n)].sort(() => Math.random() - 0.5), answer: String(sum), category: 'Statistics', difficulty: 'Easy', explanation: `Sum = count × average = ${n} × ${avg} = ${sum}` }; },
  () => { const a = Math.floor(Math.random() * 4) + 2; const ans = Math.floor(Math.random() * 5) + 1; return { id: 6, question: `Solve: ${a}(2x - ${ans}) = ${a * (2 * ans - ans)}`, options: [String(ans), String(ans + 1), String(ans * 2), String(ans - 1)].sort(() => Math.random() - 0.5), answer: String(ans), category: 'Algebra', difficulty: 'Medium', explanation: `${a}(2x - ${ans}) = ${a * ans} → 2x - ${ans} = ${ans} → 2x = ${2 * ans} → x = ${ans}` }; },
  () => { const total = Math.floor(Math.random() * 5 + 3) * 10; const boys = Math.floor(total * (0.4 + Math.random() * 0.3)); const girls = total - boys; const pct = Math.round((girls / total) * 100); return { id: 7, question: `Class of ${total}: ${boys} boys, ${girls} girls. What % are girls?`, options: [`${pct}%`, `${100 - pct}%`, `${pct + 5}%`, `${pct - 5}%`].sort(() => Math.random() - 0.5), answer: `${pct}%`, category: 'Percent', difficulty: 'Easy', explanation: `${girls}/${total} × 100 = ${pct}%` }; },
  () => { const base = Math.floor(Math.random() * 8) + 5; const height = Math.floor(Math.random() * 6) + 3; const area = (base * height) / 2; return { id: 8, question: `Triangle: base ${base}, height ${height}. Area?`, options: [String(area), String(base * height), String(area + base), String(area - 2)].sort(() => Math.random() - 0.5), answer: String(area), category: 'Geometry', difficulty: 'Easy', explanation: `A = ½ × ${base} × ${height} = ${area}` }; },
  () => { const r1 = Math.floor(Math.random() * 5) + 1; const r2 = Math.floor(Math.random() * 5) + 1; const sum = -(r1 + r2); const prod = r1 * r2; return { id: 9, question: `x² + ${sum < 0 ? `(${sum})` : sum}x + ${prod} = 0. One root is ${r1}. Other root?`, options: [String(r2), String(-r2), String(r1 + r2), String(prod)].sort(() => Math.random() - 0.5), answer: String(r2), category: 'Algebra', difficulty: 'Hard', explanation: `Sum of roots = ${-sum}. Other root = ${-sum} - ${r1} = ${r2}` }; },
];

export default function SATACTPractice() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<number>(0);

  const generateTest = useCallback(() => {
    const qs = QUESTION_BANK.sort(() => Math.random() - 0.5).slice(0, 8).map((fn, i) => ({ ...fn(), id: i }));
    setQuestions(qs);
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setTimeLeft(300);
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!started || submitted) return;
    if (timeLeft <= 0) { setSubmitted(true); return; }
    timerRef.current = window.setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [started, submitted]);

  const score = submitted ? questions.filter((q, i) => answers[i] === q.answer).length : 0;
  const q = questions[current];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">📋 SAT/ACT Practice</h2>
        <p className="text-purple-300 text-lg">Timed exam-style math problems!</p>
      </div>

      {!started ? (
        <motion.div className="max-w-md mx-auto text-center bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-3xl border border-blue-500/30 p-8" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <span className="text-6xl">📝</span>
          <h3 className="text-2xl font-bold text-white mt-4 mb-2">Practice Test</h3>
          <p className="text-gray-400 mb-6">8 questions · 5 minutes · Mixed topics</p>
          <motion.button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={generateTest}>🚀 Start Test</motion.button>
        </motion.div>
      ) : submitted ? (
        <motion.div className="max-w-lg mx-auto space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-3xl border border-purple-500/30 p-8 text-center">
            <span className="text-6xl">{score >= 7 ? '🏆' : score >= 5 ? '⭐' : '📚'}</span>
            <h3 className="text-3xl font-bold text-white mt-4">Score: {score}/{questions.length}</h3>
            <p className="text-gray-400 mt-1">{Math.round((score / questions.length) * 100)}%</p>
            <p className="text-purple-300 font-bold mt-2">{score >= 7 ? 'Excellent!' : score >= 5 ? 'Good effort!' : 'Keep practicing!'}</p>
          </div>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const correct = answers[i] === q.answer;
              return (
                <div key={i} className={`rounded-xl p-4 border ${correct ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <div className="flex items-start gap-2"><span>{correct ? '✅' : '❌'}</span><div><p className="text-white text-sm">{q.question}</p>{!correct && <p className="text-green-400 text-sm mt-1">Correct: {q.answer}</p>}<p className="text-gray-400 text-sm mt-1">{q.explanation}</p></div></div>
                </div>
              );
            })}
          </div>
          <motion.button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={generateTest}>🔄 New Test</motion.button>
        </motion.div>
      ) : q ? (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Q{current + 1}/{questions.length}</span>
            <span className={`font-bold ${timeLeft > 60 ? 'text-green-400' : timeLeft > 20 ? 'text-yellow-400' : 'text-red-400'}`}>⏱️ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
          </div>
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
          <div className="rounded-3xl p-6 bg-white/5 border border-white/10">
            <div className="flex gap-2 mb-3"><span className="text-sm bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">{q.category}</span><span className={`text-sm px-2 py-0.5 rounded-full ${q.difficulty === 'Easy' ? 'bg-green-500/30 text-green-300' : q.difficulty === 'Medium' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-red-500/30 text-red-300'}`}>{q.difficulty}</span></div>
            <p className="text-xl font-bold text-white mb-5">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <motion.button key={i} className={`w-full py-3 px-4 rounded-xl text-left font-bold text-sm flex items-center gap-3 ${answers[current] === opt ? 'bg-purple-500/30 border-2 border-purple-400' : 'bg-white/10 border border-white/20 hover:bg-white/20'}`}
                  whileHover={{ x: 4 }} onClick={() => setAnswers({ ...answers, [current]: opt })}>
                  <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-sm text-gray-400">{String.fromCharCode(65 + i)}</span>
                  <span className="text-white">{opt}</span>
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <button className="px-4 py-2 rounded-xl bg-white/10 text-gray-400 text-sm" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>← Prev</button>
            {current < questions.length - 1 ? (
              <button className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-sm" onClick={() => setCurrent(c => c + 1)}>Next →</button>
            ) : (
              <button className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm" onClick={() => { setSubmitted(true); sfx.celebrate(); }}>Submit ✓</button>
            )}
          </div>
          {/* Question navigator */}
          <div className="flex justify-center gap-1">{questions.map((_, i) => <button key={i} className={`w-8 h-8 rounded-lg text-sm font-bold ${i === current ? 'bg-purple-500 text-white' : answers[i] ? 'bg-green-500/30 text-green-300' : 'bg-white/10 text-gray-500'}`} onClick={() => setCurrent(i)}>{i + 1}</button>)}</div>
        </div>
      ) : null}
    </div>
  );
}
