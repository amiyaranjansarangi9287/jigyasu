import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../lib/soundEngine';
import { useFormatNumber } from '../../../../hooks/useFormatNumber';
import { Trans } from "react-i18next";

interface Question { id: number; question: string; options: string[]; answer: string; category: string; difficulty: 'Easy' | 'Medium' | 'Hard'; explanation: string; }

const QUESTION_BANK: ((f: (n: number) => string) => Question)[] = [
  (f) => { const a = Math.floor(Math.random() * 8) + 2; const b = Math.floor(Math.random() * 8) + 2; const c = a * a - b * b; return { id: 0, question: `If x² - ${f(b * b)} = ${f(c)}, what is x?`, options: [f(a), f(a + 1), f(b), f(a - 1)].sort(() => Math.random() - 0.5), answer: f(a), category: 'Algebra', difficulty: 'Easy', explanation: `x² = ${f(c)} + ${f(b * b)} = ${f(a * a)}, so x = ${f(a)}` }; },
  (f) => { const m = Math.floor(Math.random() * 5) + 1; const b = Math.floor(Math.random() * 10) - 5; const x = Math.floor(Math.random() * 5) + 1; const y = m * x + b; return { id: 1, question: `Line passes through (0, ${f(b)}) and (${f(x)}, ${f(y)}). What is the slope?`, options: [f(m), f(m + 1), f(m - 1), f(-m)].sort(() => Math.random() - 0.5), answer: f(m), category: 'Coordinate Geometry', difficulty: 'Easy', explanation: `Slope = (${f(y)} - ${f(b)}) / (${f(x)} - 0) = ${f(y - b)} / ${f(x)} = ${f(m)}` }; },
  (f) => { const r = Math.floor(Math.random() * 6) + 3; const area = Math.round(Math.PI * r * r); return { id: 2, question: `Circle with radius ${f(r)}. Area closest to?`, options: [f(area), f(area + 10), f(Math.round(2 * Math.PI * r)), f(area - 8)].sort(() => Math.random() - 0.5), answer: f(area), category: 'Geometry', difficulty: 'Medium', explanation: `A = πr² = π × ${f(r)}² ≈ ${f(area)}` }; },
  (f) => { const pct = [15, 20, 25, 30][Math.floor(Math.random() * 4)]; const orig = Math.floor(Math.random() * 8 + 3) * 20; const sale = orig - (orig * pct / 100); return { id: 3, question: `Item costs $${f(orig)}. After ${f(pct)}% discount, price is?`, options: [`$${f(sale)}`, `$${f(sale + 10)}`, `$${f(orig - pct)}`, `$${f(Math.round(orig * pct / 100))}`].sort(() => Math.random() - 0.5), answer: `$${f(sale)}`, category: 'Percent', difficulty: 'Easy', explanation: `Discount = $${f(orig)} × ${f(pct)}% = $${f(orig * pct / 100)}. Final = $${f(sale)}` }; },
  (f) => { const a = Math.floor(Math.random() * 5) + 2; const b = Math.floor(Math.random() * 5) + 2; const answer = a * a + b * b; const c = Math.round(Math.sqrt(answer)); return { id: 4, question: `Right triangle with legs ${f(a)} and ${f(b)}. Hypotenuse² = ?`, options: [f(answer), f(answer + 1), f(a + b), f(c * c + 1)].sort(() => Math.random() - 0.5), answer: f(answer), category: 'Geometry', difficulty: 'Medium', explanation: `c² = ${f(a)}² + ${f(b)}² = ${f(a * a)} + ${f(b * b)} = ${f(answer)}` }; },
  (f) => { const n = Math.floor(Math.random() * 5) + 3; const avg = Math.floor(Math.random() * 20) + 60; const sum = n * avg; return { id: 5, question: `Average of ${f(n)} numbers is ${f(avg)}. Sum of all numbers?`, options: [f(sum), f(sum + avg), f(n + avg), f(sum - n)].sort(() => Math.random() - 0.5), answer: f(sum), category: 'Statistics', difficulty: 'Easy', explanation: `Sum = count × average = ${f(n)} × ${f(avg)} = ${f(sum)}` }; },
  (f) => { const a = Math.floor(Math.random() * 4) + 2; const ans = Math.floor(Math.random() * 5) + 1; return { id: 6, question: `Solve: ${f(a)}(${f(2)}x - ${f(ans)}) = ${f(a * (2 * ans - ans))}`, options: [f(ans), f(ans + 1), f(ans * 2), f(ans - 1)].sort(() => Math.random() - 0.5), answer: f(ans), category: 'Algebra', difficulty: 'Medium', explanation: `${f(a)}(${f(2)}x - ${f(ans)}) = ${f(a * ans)} → ${f(2)}x - ${f(ans)} = ${f(ans)} → ${f(2)}x = ${f(2 * ans)} → x = ${f(ans)}` }; },
  (f) => { const total = Math.floor(Math.random() * 5 + 3) * 10; const boys = Math.floor(total * (0.4 + Math.random() * 0.3)); const girls = total - boys; const pct = Math.round((girls / total) * 100); return { id: 7, question: `Class of ${f(total)}: ${f(boys)} boys, ${f(girls)} girls. What % are girls?`, options: [`${f(pct)}%`, `${f(100 - pct)}%`, `${f(pct + 5)}%`, `${f(pct - 5)}%`].sort(() => Math.random() - 0.5), answer: `${f(pct)}%`, category: 'Percent', difficulty: 'Easy', explanation: `${f(girls)}/${f(total)} × ${f(100)} = ${f(pct)}%` }; },
  (f) => { const base = Math.floor(Math.random() * 8) + 5; const height = Math.floor(Math.random() * 6) + 3; const area = (base * height) / 2; return { id: 8, question: `Triangle: base ${f(base)}, height ${f(height)}. Area?`, options: [f(area), f(base * height), f(area + base), f(area - 2)].sort(() => Math.random() - 0.5), answer: f(area), category: 'Geometry', difficulty: 'Easy', explanation: `A = ½ × ${f(base)} × ${f(height)} = ${f(area)}` }; },
  (f) => { const r1 = Math.floor(Math.random() * 5) + 1; const r2 = Math.floor(Math.random() * 5) + 1; const sum = -(r1 + r2); const prod = r1 * r2; return { id: 9, question: `x² + ${sum < 0 ? `(${f(sum)})` : f(sum)}x + ${f(prod)} = 0. One root is ${f(r1)}. Other root?`, options: [f(r2), f(-r2), f(r1 + r2), f(prod)].sort(() => Math.random() - 0.5), answer: f(r2), category: 'Algebra', difficulty: 'Hard', explanation: `Sum of roots = ${f(-sum)}. Other root = ${f(-sum)} - ${f(r1)} = ${f(r2)}` }; },
];

export default function SATACTPractice() {
  const formatNumber = useFormatNumber();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);

  const generateTest = useCallback(() => {
    const qs = QUESTION_BANK.sort(() => Math.random() - 0.5).slice(0, 8).map((fn, i) => ({ ...fn(formatNumber), id: i }));
    setQuestions(qs);
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setStarted(true);
  }, []);

  const mastery = submitted ? questions.filter((q, i) => answers[i] === q.answer).length : 0;
  const q = questions[current];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.satactpractice.deep_concepts_practice">🎓 Deep Concepts Practice</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.satactpractice.self_paced_advanced_math_explo">Self-paced advanced math exploration!</Trans></p>
      </div>

      {!started ? (
        <motion.div className="max-w-md mx-auto text-center bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-3xl border border-blue-500/30 p-8" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <span className="text-6xl">🧠</span>
          <h3 className="text-2xl font-bold text-white mt-4 mb-2"><Trans i18nKey="auto.satactpractice.explore_deeply">Explore Deeply</Trans></h3>
          <p className="text-gray-400 mb-6"><Trans i18nKey="auto.satactpractice.8_questions_take_your_time_mix">8 questions • Take your time • Mixed topics</Trans></p>
          <motion.button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={generateTest}><Trans i18nKey="auto.satactpractice.begin_exploration">🚀 Begin Exploration</Trans></motion.button>
        </motion.div>
      ) : submitted ? (
        <motion.div className="max-w-lg mx-auto space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-3xl border border-purple-500/30 p-8 text-center">
            <span className="text-6xl">🌟</span>
            <h3 className="text-3xl font-bold text-white mt-4"><Trans i18nKey="auto.satactpractice.concepts_mastered">Concepts Mastered:</Trans> {formatNumber(mastery)}</h3>
            <p className="text-purple-300 font-bold mt-2"><Trans i18nKey="auto.satactpractice.you_are_exploring">You are exploring</Trans> {formatNumber(mastery)} <Trans i18nKey="auto.satactpractice.concepts_deeply">concepts deeply.</Trans> {formatNumber(questions.length - mastery)} <Trans i18nKey="auto.satactpractice.more_to_discover">more to discover!</Trans></p>
          </div>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const correct = answers[i] === q.answer;
              return (
                <div key={i} className={`rounded-xl p-4 border ${correct ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-start gap-2"><span>{correct ? '✅' : '🤔'}</span><div><p className="text-white text-sm">{q.question}</p>{!correct && <p className="text-green-400 text-sm mt-1"><Trans i18nKey="auto.satactpractice.correct">Correct:</Trans> {q.answer}</p>}<p className="text-gray-400 text-sm mt-1">{q.explanation}</p></div></div>
                </div>
              );
            })}
          </div>
          <motion.button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={generateTest}><Trans i18nKey="auto.satactpractice.explore_new_concepts">🔄 Explore New Concepts</Trans></motion.button>
        </motion.div>
      ) : q ? (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm"><Trans i18nKey="auto.satactpractice.concept">Concept</Trans> {formatNumber(current + 1)} <Trans i18nKey="auto.satactpractice.of">of</Trans> {formatNumber(questions.length)}</span>
            <span className="text-green-400 font-bold text-sm"><Trans i18nKey="auto.satactpractice.take_your_time">Take your time 🌱</Trans></span>
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
            <button className="px-4 py-2 rounded-xl bg-white/10 text-gray-400 text-sm" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}><Trans i18nKey="auto.satactpractice.prev">← Prev</Trans></button>
            {current < questions.length - 1 ? (
              <button className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-sm" onClick={() => setCurrent(c => c + 1)}><Trans i18nKey="auto.satactpractice.next">Next →</Trans></button>
            ) : (
              <button className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm" onClick={() => { setSubmitted(true); sfx.celebrate(); }}><Trans i18nKey="auto.satactpractice.submit">Submit ✓</Trans></button>
            )}
          </div>
          <div className="flex justify-center gap-1">{questions.map((_, i) => <button key={i} className={`w-8 h-8 rounded-lg text-sm font-bold ${i === current ? 'bg-purple-500 text-white' : answers[i] ? 'bg-green-500/30 text-green-300' : 'bg-white/10 text-gray-500'}`} onClick={() => setCurrent(i)}>{formatNumber(i + 1)}</button>)}</div>
        </div>
      ) : null}
    </div>
  );
}
