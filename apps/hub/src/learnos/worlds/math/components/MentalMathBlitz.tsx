import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../lib/soundEngine';
import { useFormatNumber } from '../../../../hooks/useFormatNumber';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

type Category = 'bodmas' | 'squares' | 'percentages' | 'powers' | 'mixed';

interface Question {
  display: string;
  answer: number;
  options: number[];
  category: Category;
  difficulty: number;
}

const generateQuestion = (cat: Category, diff: number, formatNumber: (n: number) => string): Question => {
  const r = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
  let display: string, answer: number;

  const actualCat = cat === 'mixed' ? (['bodmas', 'squares', 'percentages', 'powers'] as Category[])[r(0, 3)] : cat;

  switch (actualCat) {
    case 'bodmas': {
      const type = r(0, 3 + diff);
      switch (type) {
        case 0: { const a = r(2, 10); const b = r(1, 10); const c = r(1, 10); answer = a + b * c; display = `${formatNumber(a)} + ${formatNumber(b)} × ${formatNumber(c)}`; break; }
        case 1: { const a = r(5, 20); const b = r(1, 5); const c = r(1, 5); answer = a - b * c; display = `${formatNumber(a)} - ${formatNumber(b)} × ${formatNumber(c)}`; break; }
        case 2: { const a = r(1, 5); const b = r(1, 5); const c = r(1, 5); answer = a * (b + c); display = `${formatNumber(a)} × (${formatNumber(b)} + ${formatNumber(c)})`; break; }
        case 3: { const a = r(2, 8); const c = r(1, 10); answer = a * a + c; display = `${formatNumber(a)}² + ${formatNumber(c)}`; break; }
        case 4: { const a = r(10, 50); const b = r(2, 5); const c = r(1, 10); answer = a / b + c; display = `${formatNumber(a)} ÷ ${formatNumber(b)} + ${formatNumber(c)}`; if (!Number.isInteger(answer)) { answer = a + b * c; display = `${formatNumber(a)} + ${formatNumber(b)} × ${formatNumber(c)}`; } break; }
        default: { const a = r(1, 5); const b = r(1, 5); const c = r(1, 3); answer = (a + b) * c; display = `(${formatNumber(a)} + ${formatNumber(b)}) × ${formatNumber(c)}`; break; }
      }
      break;
    }
    case 'squares': {
      const n = r(2, 12 + diff * 3);
      if (r(0, 1) === 0) { answer = n * n; display = `${formatNumber(n)}² = ?`; }
      else { answer = n; display = `√${formatNumber(n * n)} = ?`; }
      break;
    }
    case 'percentages': {
      const type = r(0, 2);
      switch (type) {
        case 0: { const pct = [10, 20, 25, 50, 75][r(0, 4)]; const of = r(2, 20) * (100 / pct); answer = (pct / 100) * of; display = `${formatNumber(pct)}% of ${formatNumber(of)}`; break; }
        case 1: { const a = r(10, 100); const pct = r(1, 5) * 10; answer = a + (pct / 100) * a; display = `${formatNumber(a)} + ${formatNumber(pct)}% of ${formatNumber(a)}`; break; }
        default: { const a = r(5, 50) * 2; const b = r(1, a); answer = Math.round((b / a) * 100); display = `${formatNumber(b)} out of ${formatNumber(a)} = ?%`; break; }
      }
      break;
    }
    case 'powers': {
      const type = r(0, 2);
      switch (type) {
        case 0: { const base = r(2, 5); const exp = r(2, 4); answer = Math.pow(base, exp); display = `${formatNumber(base)}${toSup(exp)} = ?`; break; }
        case 1: { const base = r(2, 5); answer = base * base * base; display = `${formatNumber(base)}³ = ?`; break; }
        default: { const base = r(2, 10); answer = base * base; display = `${formatNumber(base)}² = ?`; break; }
      }
      break;
    }
    default: {
      answer = r(1, 50);
      display = `${formatNumber(answer)}`;
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
  const { t } = useTranslation();
  const formatNumber = useFormatNumber();
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
  const [category, setCategory] = useState<Category>('mixed');
  const [difficulty, setDifficulty] = useState(1);
  const [question, setQuestion] = useState<Question | null>(null);
  const [mastery, setMastery] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const qRef = useRef(0);

  const nextQ = useCallback(() => {
    qRef.current++;
    setQuestion(generateQuestion(category, difficulty, formatNumber));
    setFeedback(null);
  }, [category, difficulty, formatNumber]);

  const startGame = () => {
    setGameState('playing');
    setMastery(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrect(0);
    setTotal(0);
    nextQ();
  };

  const handleAnswer = (opt: number) => {
    if (feedback || !question) return;
    setTotal(t => t + 1);
    if (opt === question.answer) {
      setFeedback('correct');
      sfx.correct();
      setMastery(s => s + 1);
      setStreak(s => { const n = s + 1; setMaxStreak(m => Math.max(m, n)); return n; });
      setCorrect(c => c + 1);
      // Adaptive difficulty
      if (streak > 0 && streak % 5 === 0 && difficulty < 3) setDifficulty(d => d + 1);
      setTimeout(nextQ, 500);
    } else {
      setFeedback('hint');
      sfx.wrong();
      setStreak(0);
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const categories: { id: Category; emoji: string; label: string; labelKey: string; desc: string; descKey: string }[] = [
    { id: 'bodmas', emoji: '🔢', label: 'BODMAS', labelKey: 'auto.mentalmathblitz.bodmas', desc: 'Order of operations', descKey: 'auto.mentalmathblitz.order_of_operations' },
    { id: 'squares', emoji: '²', label: 'Squares & Roots', labelKey: 'auto.mentalmathblitz.squares_roots', desc: 'n² and √n', descKey: 'auto.mentalmathblitz.n2_and_sqrt_n' },
    { id: 'percentages', emoji: '%', label: 'Percentages', labelKey: 'auto.mentalmathblitz.percentages', desc: '% calculations', descKey: 'auto.mentalmathblitz.pct_calculations' },
    { id: 'powers', emoji: '⚡', label: 'Powers', labelKey: 'auto.mentalmathblitz.powers', desc: 'Exponents', descKey: 'auto.mentalmathblitz.exponents' },
    { id: 'mixed', emoji: '🎲', label: 'Mixed', labelKey: 'auto.mentalmathblitz.mixed', desc: 'All topics!', descKey: 'auto.mentalmathblitz.all_topics' },
  ];

  const getCatEmoji = (c: Category) => categories.find(x => x.id === c)?.emoji || '🎲';

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.mentalmathblitz.mental_math_mastery">🧠 Mental Math Mastery</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.mentalmathblitz.sharpen_your_mind_without_the_">Sharpen your mind without the pressure!</Trans></p>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-lg mx-auto space-y-4">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-gray-400 text-sm mb-3"><Trans i18nKey="auto.mentalmathblitz.choose_category">Choose category:</Trans></p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map(c => (
                  <motion.button key={c.id}
                    className={`p-3 rounded-xl border-2 text-center ${category === c.id ? 'border-purple-400 bg-purple-500/20' : 'border-white/10 bg-white/5'}`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(c.id)}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <p className="text-white font-bold text-sm mt-1">{t(c.labelKey, c.label)}</p>
                    <p className="text-gray-500 text-sm">{t(c.descKey, c.desc)}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-gray-400 text-sm mb-3"><Trans i18nKey="auto.mentalmathblitz.difficulty">Difficulty:</Trans></p>
              <div className="flex gap-2">
                {[1, 2, 3].map(d => (
                  <motion.button key={d}
                    className={`flex-1 py-3 rounded-xl font-bold ${difficulty === d ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white/10 text-gray-400'}`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDifficulty(d)}
                  >
                    {d === 1 ? t('auto.mentalmathblitz.normal', '🌱 Normal') : d === 2 ? t('auto.mentalmathblitz.hard', '⚔️ Hard') : t('auto.mentalmathblitz.extreme', '🔥 Extreme')}
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
              <Trans i18nKey="auto.mentalmathblitz.start_journey">🚀 Start Journey</Trans>
                                      </motion.button>
          </motion.div>
        )}

        {gameState === 'playing' && question && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-lg mx-auto">
            {/* Stats bar */}
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex gap-2">
                <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold text-sm"><Trans i18nKey="auto.mentalmathblitz.mastery">🌟 Mastery</Trans> {formatNumber(mastery)}</span>
                <span className="bg-white/5 px-3 py-1.5 rounded-lg text-sky-400 font-bold text-sm"><Trans i18nKey="auto.mentalmathblitz.streak">🔥 Streak</Trans> {formatNumber(streak)}</span>
                <span className="bg-white/5 px-3 py-1.5 rounded-lg text-blue-400 font-bold text-sm">{getCatEmoji(question.category)}</span>
              </div>
              <span className="text-green-400 font-bold text-sm"><Trans i18nKey="auto.mentalmathblitz.take_your_time">Take your time 🌱</Trans></span>
            </div>

            <motion.div
              key={qRef.current}
              className={`rounded-3xl p-8 text-center border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}
              initial={{ scale: 0.9, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: 'spring' }}
            >
              <span className="text-sm bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                {t(`auto.mentalmathblitz.category_${question.category}`, question.category.toUpperCase())} <Trans i18nKey="auto.mentalmathblitz.lv">· Lv</Trans>{formatNumber(question.difficulty)}
              </span>
              <p className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-6 font-mono">{question.display}</p>

              <div className="grid grid-cols-2 gap-3">
                {question.options.map((opt, i) => (
                  <motion.button
                    key={`${qRef.current}-${i}`}
                    className={`py-3 rounded-xl text-xl font-bold ${
                      feedback === 'correct' && opt === question.answer ? 'bg-green-500 text-white'
                      : feedback === 'hint' && opt === question.answer ? 'bg-green-500/50 text-green-200'
                      : feedback === 'hint' ? 'bg-white/5 text-gray-500'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                    whileHover={!feedback ? { scale: 1.05 } : {}}
                    whileTap={!feedback ? { scale: 0.95 } : {}}
                    onClick={() => handleAnswer(opt)}
                    disabled={feedback !== null}
                  >
                    {formatNumber(opt)}
                  </motion.button>
                ))}
              </div>

              {feedback === 'correct' && <motion.p className="mt-3 text-green-400 font-bold" initial={{ scale: 0 }} animate={{ scale: 1 }}><Trans i18nKey="auto.mentalmathblitz.correct">✨ Correct!</Trans></motion.p>}
              {feedback === 'hint' && <p className="mt-3 text-sky-400 font-bold"><Trans i18nKey="auto.mentalmathblitz.try_again">🤔 Let us explore!</Trans></p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
