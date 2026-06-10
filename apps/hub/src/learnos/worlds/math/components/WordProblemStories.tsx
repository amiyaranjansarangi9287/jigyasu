import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../lib/soundEngine';
import WhatsNext from './shared/WhatsNext';
import { Trans } from "react-i18next";

interface Problem {
  story: string;
  emoji: string;
  category: string;
  question: string;
  answer: number;
  options: number[];
  hint: string;
  solution: string;
}

const templates: (() => Problem)[] = [
  () => {
    const a = Math.floor(Math.random() * 20) + 5;
    const b = Math.floor(Math.random() * 15) + 3;
    const answer = a + b;
    return { story: `Sam picked ${a} apples in the morning. In the afternoon, he picked ${b} more.`, emoji: '🍎', category: 'Addition', question: 'How many apples did Sam pick in total?', answer, options: opts(answer), hint: 'Add the morning and afternoon amounts.', solution: `${a} + ${b} = ${answer} apples` };
  },
  () => {
    const a = Math.floor(Math.random() * 30) + 20;
    const b = Math.floor(Math.random() * 15) + 5;
    const answer = a - b;
    return { story: `A bakery made ${a} cookies. They sold ${b} cookies before lunch.`, emoji: '🍪', category: 'Subtraction', question: 'How many cookies are left?', answer, options: opts(answer), hint: 'Subtract the cookies sold from the total.', solution: `${a} - ${b} = ${answer} cookies` };
  },
  () => {
    const bags = Math.floor(Math.random() * 6) + 3;
    const per = Math.floor(Math.random() * 8) + 4;
    const answer = bags * per;
    return { story: `A farmer has ${bags} bags of oranges. Each bag holds ${per} oranges.`, emoji: '🍊', category: 'Multiplication', question: 'How many oranges are there in total?', answer, options: opts(answer), hint: 'Multiply the number of bags by oranges per bag.', solution: `${bags} × ${per} = ${answer} oranges` };
  },
  () => {
    const kids = Math.floor(Math.random() * 5) + 3;
    const per = Math.floor(Math.random() * 8) + 4;
    const total = kids * per;
    return { story: `${total} stickers are shared equally among ${kids} children.`, emoji: '⭐', category: 'Division', question: 'How many stickers does each child get?', answer: per, options: opts(per), hint: 'Divide the total stickers by the number of children.', solution: `${total} ÷ ${kids} = ${per} stickers each` };
  },
  () => {
    const price = Math.floor(Math.random() * 8 + 2) * 5;
    const qty = Math.floor(Math.random() * 4) + 2;
    const paid = price * qty + Math.floor(Math.random() * 3) * 10 + 10;
    const total = price * qty;
    const answer = paid - total;
    return { story: `Emma buys ${qty} notebooks at $${price} each. She pays with a $${paid} bill.`, emoji: '📓', category: 'Multi-step', question: 'How much change does Emma get?', answer, options: opts(answer), hint: `First find the total cost: ${qty} × $${price}.`, solution: `Total = ${qty} × $${price} = $${total}. Change = $${paid} - $${total} = $${answer}` };
  },
  () => {
    const speed = [30, 40, 50, 60][Math.floor(Math.random() * 4)];
    const time = Math.floor(Math.random() * 4) + 2;
    const answer = speed * time;
    return { story: `A train travels at ${speed} km/h for ${time} hours.`, emoji: '🚂', category: 'Distance', question: 'How far does the train travel?', answer, options: opts(answer), hint: 'Distance = Speed × Time', solution: `${speed} × ${time} = ${answer} km` };
  },
  () => {
    const l = Math.floor(Math.random() * 10) + 5;
    const w = Math.floor(Math.random() * 8) + 3;
    const answer = 2 * (l + w);
    return { story: `A rectangular garden is ${l} meters long and ${w} meters wide.`, emoji: '🌿', category: 'Perimeter', question: 'What is the perimeter of the garden?', answer, options: opts(answer), hint: 'Perimeter = 2 × (length + width)', solution: `2 × (${l} + ${w}) = 2 × ${l + w} = ${answer} m` };
  },
  () => {
    const total = Math.floor(Math.random() * 30) + 20;
    const fraction = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const answer = total / fraction;
    const adjTotal = Math.round(answer) * fraction;
    const adjAnswer = adjTotal / fraction;
    return { story: `There are ${adjTotal} students in a class. 1/${fraction} of them wear glasses.`, emoji: '👓', category: 'Fractions', question: 'How many students wear glasses?', answer: adjAnswer, options: opts(adjAnswer), hint: `Divide the total by ${fraction}.`, solution: `${adjTotal} ÷ ${fraction} = ${adjAnswer} students` };
  },
];

function opts(answer: number): number[] {
  const s = new Set([answer]);
  while (s.size < 4) {
    const w = answer + Math.floor(Math.random() * 11) - 5;
    if (w > 0 && w !== answer) s.add(w);
  }
  return [...s].sort(() => Math.random() - 0.5);
}

export default function WordProblemStories() {
  const [problem, setProblem] = useState<Problem>(() => templates[0]());
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [mastery, setMastery] = useState(0);
  const [solved, setSolved] = useState(0);

  const next = useCallback(() => {
    setProblem(templates[Math.floor(Math.random() * templates.length)]());
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
  }, []);

  const handleAnswer = (opt: number) => {
    if (feedback) return;
    if (opt === problem.answer) {
      setFeedback('correct');
      sfx.correct();
      setMastery(m => m + 1);
      setSolved(s => s + 1);
      setTimeout(next, 1800);
    } else {
      setFeedback('hint');
      sfx.wrong();
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.wordproblemstories.word_problem_stories">📖 Word Problem Stories</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.wordproblemstories.read_the_story_find_the_math_s">Read the story, find the math, solve the problem!</Trans></p>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold text-sm">⭐ {mastery}</span>
        <span className="bg-white/5 px-3 py-1.5 rounded-lg text-green-400 font-bold text-sm">✅ {solved}</span>
      </div>

      <motion.div
        key={problem.story}
        className={`max-w-xl mx-auto rounded-3xl p-6 sm:p-8 border-2 transition-colors ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">{problem.category}</span>
        </div>

        {/* Story */}
        <div className="bg-black/20 rounded-2xl p-5 mb-5">
          <motion.span className="text-5xl block text-center mb-3" animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }}>{problem.emoji}</motion.span>
          <p className="text-white text-lg leading-relaxed text-center">{problem.story}</p>
        </div>

        {/* Question */}
        <p className="text-xl font-bold text-white text-center mb-5">❓ {problem.question}</p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {problem.options.map((opt) => (
            <motion.button key={opt}
              className={`py-3 rounded-xl text-xl font-bold ${feedback === 'correct' && opt === problem.answer ? 'bg-green-500 text-white ring-4 ring-green-400/50' : feedback === 'hint' ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/40'}`}
              whileHover={!feedback ? { scale: 1.05 } : {}}
              whileTap={!feedback ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback}
            >{opt}</motion.button>
          ))}
        </div>

        {/* Hint & Solution */}
        <div className="mt-4 flex justify-center gap-4">
          {!showHint && !feedback && <button className="text-sm text-purple-400 hover:text-purple-300 underline decoration-dashed" onClick={() => setShowHint(true)}><Trans i18nKey="auto.wordproblemstories.hint">💡 Hint</Trans></button>}
          {(feedback === 'correct' || showSolution) && <button className="text-sm text-blue-400 hover:text-blue-300 underline decoration-dashed" onClick={() => setShowSolution(true)}><Trans i18nKey="auto.wordproblemstories.solution">📝 Solution</Trans></button>}
          <button className="text-sm text-gray-500 hover:text-gray-400" onClick={next}><Trans i18nKey="auto.wordproblemstories.skip">Skip →</Trans></button>
        </div>

        <AnimatePresence>
          {showHint && <motion.p className="mt-3 text-center text-amber-300 bg-amber-500/10 rounded-lg px-3 py-2 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>💡 {problem.hint}</motion.p>}
          {showSolution && <motion.p className="mt-3 text-center text-blue-300 bg-blue-500/10 rounded-lg px-3 py-2 text-sm font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>📝 {problem.solution}</motion.p>}
        </AnimatePresence>

        {feedback === 'correct' && <motion.p className="mt-4 text-center text-green-400 font-bold text-lg" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}><Trans i18nKey="auto.wordproblemstories.great_reading_solving">✨ Great reading & solving!</Trans></motion.p>}
        {feedback === 'hint' && <motion.p className="mt-4 text-center text-sky-400 font-bold" initial={{ x: -10 }} animate={{ x: [10, -10, 5, 0] }}><Trans i18nKey="auto.wordproblemstories.re_read_the_story_carefully">🤔 Re-read the story carefully!</Trans></motion.p>}
      </motion.div>
      <WhatsNext moduleId="word-problems" />
    </div>
  );
}
