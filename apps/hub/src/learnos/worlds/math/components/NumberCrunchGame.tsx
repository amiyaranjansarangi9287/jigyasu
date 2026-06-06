import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMathFeedback } from '../lib/MathContext';
import { useTranslation } from 'react-i18next';
import WhatsNext from './shared/WhatsNext';
import { useFormatNumber } from '../../../../hooks/useFormatNumber';

interface Question {
  text: string;
  answer: number;
  options: number[];
  emoji: string;
}

const generateQuestion = (difficulty: number, formatNumber: (n: number) => string): Question => {
  const emojis = ['🧙‍♂️', '🐉', '🦄', '🧚', '🪄', '🏰', '⚔️', '🛡️', '🗝️', '🧪'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  const type = Math.floor(Math.random() * 4);
  let a: number, b: number, answer: number, text: string;
  
  const maxNum = 5 + difficulty * 3;
  
  switch (type) {
    case 0: // addition
      a = Math.floor(Math.random() * maxNum) + 1;
      b = Math.floor(Math.random() * maxNum) + 1;
      answer = a + b;
      text = `${formatNumber(a)} + ${formatNumber(b)}`;
      break;
    case 1: // subtraction
      a = Math.floor(Math.random() * maxNum) + 5;
      b = Math.floor(Math.random() * Math.min(a, maxNum)) + 1;
      answer = a - b;
      text = `${formatNumber(a)} - ${formatNumber(b)}`;
      break;
    case 2: // multiplication
      a = Math.floor(Math.random() * Math.min(maxNum, 12)) + 1;
      b = Math.floor(Math.random() * Math.min(maxNum, 12)) + 1;
      answer = a * b;
      text = `${formatNumber(a)} × ${formatNumber(b)}`;
      break;
    default: // division
      b = Math.floor(Math.random() * Math.min(maxNum, 10)) + 1;
      answer = Math.floor(Math.random() * Math.min(maxNum, 10)) + 1;
      a = b * answer;
      text = `${formatNumber(a)} ÷ ${formatNumber(b)}`;
      break;
  }
  
  // Generate wrong options
  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const wrong = answer + (offset === 0 ? 1 : offset);
    if (wrong >= 0) options.add(wrong);
  }
  
  return {
    text,
    answer,
    options: [...options].sort(() => Math.random() - 0.5),
    emoji,
  };
};

export default function NumberCrunchGame() {
  const { t } = useTranslation();
  const math = useMathFeedback();
  const formatNumber = useFormatNumber();
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
  const [mastery, setMastery] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [difficulty, setDifficulty] = useState(1);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [combo, setCombo] = useState(1);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const particleId = useRef(0);

  const nextQuestion = useCallback(() => {
    const newDifficulty = Math.floor(mastery / 5) + 1;
    setDifficulty(newDifficulty);
    setQuestion(generateQuestion(newDifficulty, formatNumber));
    setFeedback(null);
  }, [mastery, formatNumber]);

  useEffect(() => {
    if (gameState === 'playing') {
      nextQuestion();
    }
  }, [gameState]);

  const spawnParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 5 }).map(() => ({
      id: particleId.current++,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      emoji: ['✨', '⭐', '🌟', '💫', '🎉'][Math.floor(Math.random() * 5)],
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 1000);
  };

  const handleAnswer = (option: number, e: React.MouseEvent) => {
    if (feedback !== null) return;
    setTotalAnswered((prev) => prev + 1);
    
    if (option === question?.answer) {
      setFeedback('correct');
      math.correct('number-crunch', 10 * combo);
      setMastery((prev) => prev + 1);
      setStreak((prev) => {
        const newStreak = prev + 1;
        setBestStreak((best) => Math.max(best, newStreak));
        return newStreak;
      });
      setCombo((prev) => Math.min(prev + 1, 5));
      setTotalCorrect((prev) => prev + 1);
      spawnParticles(e.clientX, e.clientY);
      setTimeout(() => nextQuestion(), 600);
    } else {
      setFeedback('wrong');
      math.wrong('number-crunch');
      setStreak(0);
      setCombo(1);
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const startGame = () => {
    setMastery(0);
    setStreak(0);
    setBestStreak(0);
    setDifficulty(1);
    setCombo(1);
    setGameState('playing');
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🧠 Number Exploration</h2>
        <p className="text-purple-300 text-lg">Take your time and explore number patterns!</p>
      </div>

      {/* Floating Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="fixed text-2xl pointer-events-none z-50"
            style={{ left: p.x, top: p.y }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 2, y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* MENU */}
        {gameState === 'menu' && (
          <motion.div
            key="menu"
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-3xl border border-purple-500/30 p-8 max-w-md mx-auto">
              <motion.div
                className="text-7xl mb-4"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🧠
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to explore?</h3>
              <p className="text-gray-400 mb-6">
                Take your time to deeply understand numbers.<br />Build streaks to level up! 🌱
              </p>
              <div className="space-y-3 text-left text-sm text-gray-400 mb-6 bg-white/5 rounded-xl p-4">
                <p dangerouslySetInnerHTML={{ __html: '🌱 <span className="text-white">Patience</span> ➝ No timers. Think deeply.' }} />
                <p dangerouslySetInnerHTML={{ __html: '✨ <span className="text-white">Streaks</span> ➝ Consistent understanding multiplier' }} />
                <p dangerouslySetInnerHTML={{ __html: '📈 <span className="text-white">Adaptive</span> ➝ Gets harder as you master concepts' }} />
              </div>
              <motion.button
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startGame}
              >
                🚀 Begin Journey
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* PLAYING */}
        {gameState === 'playing' && question && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-2xl mx-auto"
          >
            {/* HUD */}
            <div className="flex justify-between items-center mb-8 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500/20 px-4 py-2 rounded-xl border border-purple-500/30">
                  <span className="text-gray-400 text-sm uppercase font-bold tracking-wider block mb-1">Mastery</span>
                  <div className="text-2xl font-bold text-white">
                    🌟 {formatNumber(mastery)}
                  </div>
                </div>
                <div className="bg-pink-500/20 px-4 py-2 rounded-xl border border-pink-500/30">
                  <span className="text-gray-400 text-sm uppercase font-bold tracking-wider block mb-1">Streak</span>
                  <div className="text-2xl font-bold text-white flex items-center gap-2">
                    🔥 {formatNumber(streak)} 
                    {combo > 1 && <span className="text-sm bg-pink-500 text-white px-2 py-0.5 rounded-lg">x{formatNumber(combo)}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Difficulty Badge */}
            <div className="text-center mb-2">
              <span className="text-sm bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">
                {t('math_modules.NumberCrunchGame.level', 'Level {{level}}', { level: formatNumber(difficulty) })} {['', '🌱', '🌿', '🌳', '🔥', '💎'][Math.min(difficulty, 5)]}
              </span>
            </div>

            {/* Question Card */}
            <motion.div
              key={question.text}
              className={`max-w-md mx-auto rounded-3xl p-8 text-center border-2 transition-colors ${
                feedback === 'correct'
                  ? 'bg-green-500/10 border-green-500/50'
                  : feedback === 'wrong'
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/5 border-white/10'
              }`}
              initial={{ scale: 0.8, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.span
                className="text-5xl block mb-4"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {question.emoji}
              </motion.span>
              <p className="text-4xl font-bold text-white mb-6">{question.text} = ?</p>

              <div className="grid grid-cols-2 gap-3">
                {question.options.map((option) => (
                  <motion.button
                    key={option}
                    className={`py-4 rounded-xl text-xl font-bold transition-all ${
                      feedback !== null && option === question.answer
                        ? 'bg-green-500 text-white ring-4 ring-green-400/50'
                        : feedback === 'wrong' && option !== question.answer
                        ? 'bg-white/5 text-gray-500'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/40 active:scale-95'
                    }`}
                    whileHover={feedback === null ? { scale: 1.05 } : {}}
                    whileTap={feedback === null ? { scale: 0.95 } : {}}
                    onClick={(e) => handleAnswer(option, e)}
                    disabled={feedback !== null}
                  >
                    {formatNumber(option)}
                  </motion.button>
                ))}
              </div>

              {feedback === 'correct' && (
                <motion.p
                  className="mt-4 text-green-400 font-bold text-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                >
                  ✨ {t('math_modules.NumberCrunchGame.correct', 'Correct!')}
                </motion.p>
              )}
              {feedback === 'wrong' && (
                <motion.p
                  className="mt-4 text-orange-400 font-bold"
                  initial={{ x: -10 }}
                  animate={{ x: [10, -10, 5, 0] }}
                >
                  🤔 {t('math_modules.NumberCrunchGame.answerIs', 'Answer: {{answer}}', { answer: formatNumber(question.answer) })}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
      <WhatsNext moduleId="number-exploration" />
    </div>
  );
}
