import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../lib/soundEngine';
import { useFormatNumber } from '../../../../hooks/useFormatNumber';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

interface Question { id: number; question: string; options: string[]; answer: string; category: string; difficulty: 'Gentle' | 'Building' | 'Stretch'; explanation: string; }

const QUESTION_BANK: ((f: (n: number) => string, t: TFunction) => Question)[] = [
  (f, t) => { const a = Math.floor(Math.random() * 8) + 2; const b = Math.floor(Math.random() * 8) + 2; const c = a * a - b * b; return { id: 0, question: t('auto.competitivemathprep.q_algebra_1', 'If x² - {{b2}} = {{c}}, what is x?', { b2: f(b * b), c: f(c) }), options: [f(a), f(a + 1), f(b), f(a - 1)].sort(() => Math.random() - 0.5), answer: f(a), category: t('auto.competitivemathprep.algebra', 'Algebra'), difficulty: 'Gentle', explanation: t('auto.competitivemathprep.exp_algebra_1', 'x² = {{c}} + {{b2}} = {{a2}}, so x = {{a}}', { c: f(c), b2: f(b * b), a2: f(a * a), a: f(a) }) }; },
  (f, t) => { const m = Math.floor(Math.random() * 5) + 1; const b = Math.floor(Math.random() * 10) - 5; const x = Math.floor(Math.random() * 5) + 1; const y = m * x + b; return { id: 1, question: t('auto.competitivemathprep.q_coordinate', 'Line passes through (0, {{b}}) and ({{x}}, {{y}}). What is the slope?', { b: f(b), x: f(x), y: f(y) }), options: [f(m), f(m + 1), f(m - 1), f(-m)].sort(() => Math.random() - 0.5), answer: f(m), category: t('auto.competitivemathprep.coordinate_geometry', 'Coordinate Geometry'), difficulty: 'Gentle', explanation: t('auto.competitivemathprep.exp_coordinate', 'Slope = ({{y}} - {{b}}) / ({{x}} - 0) = {{diff}} / {{x}} = {{m}}', { y: f(y), b: f(b), x: f(x), diff: f(y - b), m: f(m) }) }; },
  (f, t) => { const r = Math.floor(Math.random() * 6) + 3; const area = Math.round(Math.PI * r * r); return { id: 2, question: t('auto.competitivemathprep.q_circle', 'Circle with radius {{r}}. Area closest to?', { r: f(r) }), options: [f(area), f(area + 10), f(Math.round(2 * Math.PI * r)), f(area - 8)].sort(() => Math.random() - 0.5), answer: f(area), category: t('auto.competitivemathprep.geometry', 'Geometry'), difficulty: 'Building', explanation: t('auto.competitivemathprep.exp_circle', 'A = πr² = π × {{r}}² ≈ {{area}}', { r: f(r), area: f(area) }) }; },
  (f, t) => { const pct = [15, 20, 25, 30][Math.floor(Math.random() * 4)]; const orig = Math.floor(Math.random() * 8 + 3) * 20; const sale = orig - (orig * pct / 100); return { id: 3, question: t('auto.competitivemathprep.q_discount', 'Item costs ₹{{orig}}. After {{pct}}% discount, price is?', { orig: f(orig), pct: f(pct) }), options: [`₹${f(sale)}`, `₹${f(sale + 10)}`, `₹${f(orig - pct)}`, `₹${f(Math.round(orig * pct / 100))}`].sort(() => Math.random() - 0.5), answer: `₹${f(sale)}`, category: t('auto.competitivemathprep.percent', 'Percent'), difficulty: 'Gentle', explanation: t('auto.competitivemathprep.exp_discount', 'Discount = ₹{{orig}} × {{pct}}% = ₹{{discount}}. Final = ₹{{sale}}', { orig: f(orig), pct: f(pct), discount: f(orig * pct / 100), sale: f(sale) }) }; },
  (f, t) => { const a = Math.floor(Math.random() * 5) + 2; const b = Math.floor(Math.random() * 5) + 2; const answer = a * a + b * b; const c = Math.round(Math.sqrt(answer)); return { id: 4, question: t('auto.competitivemathprep.q_pythagoras', 'Right triangle with legs {{a}} and {{b}}. Hypotenuse² = ?', { a: f(a), b: f(b) }), options: [f(answer), f(answer + 1), f(a + b), f(c * c + 1)].sort(() => Math.random() - 0.5), answer: f(answer), category: t('auto.competitivemathprep.geometry', 'Geometry'), difficulty: 'Building', explanation: t('auto.competitivemathprep.exp_pythagoras', 'c² = {{a}}² + {{b}}² = {{a2}} + {{b2}} = {{answer}}', { a: f(a), b: f(b), a2: f(a * a), b2: f(b * b), answer: f(answer) }) }; },
  (f, t) => { const n = Math.floor(Math.random() * 5) + 3; const avg = Math.floor(Math.random() * 20) + 60; const sum = n * avg; return { id: 5, question: t('auto.competitivemathprep.q_average', 'Average of {{n}} numbers is {{avg}}. Sum of all numbers?', { n: f(n), avg: f(avg) }), options: [f(sum), f(sum + avg), f(n + avg), f(sum - n)].sort(() => Math.random() - 0.5), answer: f(sum), category: t('auto.competitivemathprep.statistics', 'Statistics'), difficulty: 'Gentle', explanation: t('auto.competitivemathprep.exp_average', 'Sum = count × average = {{n}} × {{avg}} = {{sum}}', { n: f(n), avg: f(avg), sum: f(sum) }) }; },
  (f, t) => { const a = Math.floor(Math.random() * 4) + 2; const ans = Math.floor(Math.random() * 5) + 1; return { id: 6, question: t('auto.competitivemathprep.q_solve', 'Solve: {{a}}({{two}}x - {{ans}}) = {{rhs}}', { a: f(a), two: f(2), ans: f(ans), rhs: f(a * (2 * ans - ans)) }), options: [f(ans), f(ans + 1), f(ans * 2), f(ans - 1)].sort(() => Math.random() - 0.5), answer: f(ans), category: t('auto.competitivemathprep.algebra', 'Algebra'), difficulty: 'Building', explanation: t('auto.competitivemathprep.exp_solve', '{{a}}({{two}}x - {{ans}}) = {{rhs}} → {{two}}x - {{ans}} = {{ans}} → {{two}}x = {{twoAns}} → x = {{ans}}', { a: f(a), two: f(2), ans: f(ans), rhs: f(a * ans), twoAns: f(2 * ans) }) }; },
  (f, t) => { const total = Math.floor(Math.random() * 5 + 3) * 10; const boys = Math.floor(total * (0.4 + Math.random() * 0.3)); const girls = total - boys; const pct = Math.round((girls / total) * 100); return { id: 7, question: t('auto.competitivemathprep.q_class', 'Class of {{total}}: {{boys}} boys, {{girls}} girls. What % are girls?', { total: f(total), boys: f(boys), girls: f(girls) }), options: [`${f(pct)}%`, `${f(100 - pct)}%`, `${f(pct + 5)}%`, `${f(pct - 5)}%`].sort(() => Math.random() - 0.5), answer: `${f(pct)}%`, category: t('auto.competitivemathprep.percent', 'Percent'), difficulty: 'Gentle', explanation: t('auto.competitivemathprep.exp_class', '{{girls}}/{{total}} × 100 = {{pct}}%', { girls: f(girls), total: f(total), pct: f(pct) }) }; },
  (f, t) => { const base = Math.floor(Math.random() * 8) + 5; const height = Math.floor(Math.random() * 6) + 3; const area = (base * height) / 2; return { id: 8, question: t('auto.competitivemathprep.q_triangle', 'Triangle: base {{base}}, height {{height}}. Area?', { base: f(base), height: f(height) }), options: [f(area), f(base * height), f(area + base), f(area - 2)].sort(() => Math.random() - 0.5), answer: f(area), category: t('auto.competitivemathprep.geometry', 'Geometry'), difficulty: 'Gentle', explanation: t('auto.competitivemathprep.exp_triangle', 'A = ½ × {{base}} × {{height}} = {{area}}', { base: f(base), height: f(height), area: f(area) }) }; },
  (f, t) => { const r1 = Math.floor(Math.random() * 5) + 1; const r2 = Math.floor(Math.random() * 5) + 1; const sum = -(r1 + r2); const prod = r1 * r2; return { id: 9, question: t('auto.competitivemathprep.q_roots', 'x² + {{sum}}x + {{prod}} = 0. One root is {{r1}}. Other root?', { sum: sum < 0 ? `(${f(sum)})` : f(sum), prod: f(prod), r1: f(r1) }), options: [f(r2), f(-r2), f(r1 + r2), f(prod)].sort(() => Math.random() - 0.5), answer: f(r2), category: t('auto.competitivemathprep.algebra', 'Algebra'), difficulty: 'Stretch', explanation: t('auto.competitivemathprep.exp_roots', 'Sum of roots = {{sumRoots}}. Other root = {{sumRoots}} - {{r1}} = {{r2}}', { sumRoots: f(-sum), r1: f(r1), r2: f(r2) }) }; },
];

export default function CompetitiveMathPrep() {
  const { t } = useTranslation();
  const formatNumber = useFormatNumber();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);

  const generateTest = useCallback(() => {
    const qs = QUESTION_BANK.sort(() => Math.random() - 0.5).slice(0, 8).map((fn, i) => ({ ...fn(formatNumber, t), id: i }));
    setQuestions(qs);
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setStarted(true);
  }, [formatNumber, t]);

  const explored = submitted ? questions.filter((q, i) => answers[i] === q.answer).length : 0;
  const q = questions[current];

  const diffClass = (d: string) => {
    if (d === 'Gentle') return 'bg-green-500/30 text-green-300';
    if (d === 'Building') return 'bg-yellow-500/30 text-yellow-300';
    return 'bg-purple-500/30 text-purple-300';
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.competitivemathprep.deep_concepts_practice">🎓 Deep Concepts Practice</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.competitivemathprep.self_paced_advanced_math_explo">Self-paced advanced math exploration!</Trans></p>
      </div>

      {!started ? (
        <motion.div className="max-w-md mx-auto text-center bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-3xl border border-blue-500/30 p-8" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <span className="text-6xl">🧠</span>
          <h3 className="text-2xl font-bold text-white mt-4 mb-2"><Trans i18nKey="auto.competitivemathprep.explore_deeply">Explore Deeply</Trans></h3>
          <p className="text-gray-400 mb-6"><Trans i18nKey="auto.competitivemathprep.8_questions_take_your_time_mix">8 questions • Take your time • Mixed topics</Trans></p>
          <motion.button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={generateTest}><Trans i18nKey="auto.competitivemathprep.begin_exploration">🚀 Begin Exploration</Trans></motion.button>
        </motion.div>
      ) : submitted ? (
        <motion.div className="max-w-lg mx-auto space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-3xl border border-purple-500/30 p-8 text-center">
            <span className="text-6xl">🌟</span>
            <h3 className="text-3xl font-bold text-white mt-4"><Trans i18nKey="auto.competitivemathprep.concepts_explored">Concepts Explored:</Trans> {formatNumber(explored)}</h3>
            <p className="text-purple-300 font-bold mt-2"><Trans i18nKey="auto.competitivemathprep.you_are_exploring">You are exploring</Trans> {formatNumber(explored)} <Trans i18nKey="auto.competitivemathprep.concepts_deeply">concepts deeply.</Trans> {formatNumber(questions.length - explored)} <Trans i18nKey="auto.competitivemathprep.more_to_discover">more to discover!</Trans></p>
          </div>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const correct = answers[i] === q.answer;
              return (
                <div key={i} className={`rounded-xl p-4 border ${correct ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-start gap-2"><span>{correct ? '✅' : '🤔'}</span><div><p className="text-white text-sm">{q.question}</p>{!correct && <p className="text-green-400 text-sm mt-1"><Trans i18nKey="auto.competitivemathprep.correct">Correct:</Trans> {q.answer}</p>}<p className="text-gray-400 text-sm mt-1">{q.explanation}</p></div></div>
                </div>
              );
            })}
          </div>
          <motion.button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={generateTest}><Trans i18nKey="auto.competitivemathprep.explore_new_concepts">🔄 Explore New Concepts</Trans></motion.button>
        </motion.div>
      ) : q ? (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm"><Trans i18nKey="auto.competitivemathprep.concept">Concept</Trans> {formatNumber(current + 1)} <Trans i18nKey="auto.competitivemathprep.of">of</Trans> {formatNumber(questions.length)}</span>
            <span className="text-green-400 font-bold text-sm"><Trans i18nKey="auto.competitivemathprep.take_your_time">Take your time 🌱</Trans></span>
          </div>
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
          <div className="rounded-3xl p-6 bg-white/5 border border-white/10">
            <div className="flex gap-2 mb-3"><span className="text-sm bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">{q.category}</span><span className={`text-sm px-2 py-0.5 rounded-full ${diffClass(q.difficulty)}`}>{q.difficulty}</span></div>
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
            <button className="px-4 py-2 rounded-xl bg-white/10 text-gray-400 text-sm" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}><Trans i18nKey="auto.competitivemathprep.prev">← Prev</Trans></button>
            {current < questions.length - 1 ? (
              <button className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-sm" onClick={() => setCurrent(c => c + 1)}><Trans i18nKey="auto.competitivemathprep.next">Next →</Trans></button>
            ) : (
              <button className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm" onClick={() => { setSubmitted(true); sfx.celebrate(); }}><Trans i18nKey="auto.competitivemathprep.submit">Submit ✓</Trans></button>
            )}
          </div>
          <div className="flex justify-center gap-1">{questions.map((_, i) => <button key={i} className={`w-8 h-8 rounded-lg text-sm font-bold ${i === current ? 'bg-purple-500 text-white' : answers[i] ? 'bg-green-500/30 text-green-300' : 'bg-white/10 text-gray-500'}`} onClick={() => setCurrent(i)}>{formatNumber(i + 1)}</button>)}</div>
        </div>
      ) : null}
    </div>
  );
}
