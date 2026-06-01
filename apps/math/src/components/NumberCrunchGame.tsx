import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMathFeedback } from '../lib/MathContext';
import WhatsNext from './shared/WhatsNext';

interface Question {
  text: string;
  answer: number;
  options: number[];
  emoji: string;
}

const generateQuestion = (difficulty: number): Question => {
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
      text = `${a} + ${b}`;
      break;
    case 1: // subtraction
      a = Math.floor(Math.random() * maxNum) + 5;
      b = Math.floor(Math.random() * Math.min(a, maxNum)) + 1;
      answer = a - b;
      text = `${a} - ${b}`;
      break;
    case 2: // multiplication
      a = Math.floor(Math.random() * Math.min(maxNum, 12)) + 1;
      b = Math.floor(Math.random() * Math.min(maxNum, 12)) + 1;
      answer = a * b;
      text = `${a} × ${b}`;
      break;
    default: // division
      b = Math.floor(Math.random() * Math.min(maxNum, 10)) + 1;
      answer = Math.floor(Math.random() * Math.min(maxNum, 10)) + 1;
      a = b * answer;
      text = `${a} ÷ ${b}`;
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
  const math = useMathFeedback();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [difficulty, setDifficulty] = useState(1);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [combo, setCombo] = useState(1);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const particleId = useRef(0);

  const nextQuestion = useCallback(() => {
    const newDifficulty = Math.floor(score / 50) + 1;
    setDifficulty(newDifficulty);
    setQuestion(generateQuestion(newDifficulty));
    setFeedback(null);
  }, [score]);

  useEffect(() => {
    if (gameState === 'playing') {
      nextQuestion();
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('gameover');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

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
      const points = 10 * combo;
      setScore((prev) => prev + points);
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
      setTimeout(() => nextQuestion(), 800);
    }
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(60);
    setDifficulty(1);
    setTotalAnswered(0);
    setTotalCorrect(0);
    setCombo(1);
    setGameState('playing');
  };

  const getTimerColor = () => {
    if (timeLeft > 30) return 'text-green-400';
    if (timeLeft > 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🎮 Number Crunch Quest</h2>
        <p className="text-purple-300 text-lg">Race against time to solve math puzzles!</p>
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
                🧙‍♂️
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready, Math Wizard?</h3>
              <p className="text-gray-400 mb-6">
                Answer as many math questions as you can in 60 seconds!
                <br />Build combos for bonus points! 🔥
              </p>
              <div className="space-y-3 text-left text-sm text-gray-400 mb-6 bg-white/5 rounded-xl p-4">
                <p>⚡ <span className="text-white">Speed</span> — 60 seconds on the clock</p>
                <p>🔥 <span className="text-white">Combos</span> — Streak multiplier up to 5x</p>
                <p>📈 <span className="text-white">Adaptive</span> — Gets harder as you level up</p>
                <p>🏆 <span className="text-white">High Score</span> — Beat your best!</p>
              </div>
              <motion.button
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startGame}
              >
                🚀 Start Quest!
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* PLAYING */}
        {gameState === 'playing' && question && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-2">
              <div className="flex items-center gap-4">
                <span className="text-yellow-400 font-bold text-lg">⭐ {score}</span>
                <span className="text-orange-400 font-bold">🔥 {streak}</span>
                {combo > 1 && (
                  <motion.span
                    className="text-pink-400 font-bold"
                    key={combo}
                    initial={{ scale: 2 }}
                    animate={{ scale: 1 }}
                  >
                    ×{combo}
                  </motion.span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <motion.span
                  className={`font-bold text-xl ${getTimerColor()}`}
                  animate={timeLeft <= 10 ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  ⏱️ {timeLeft}s
                </motion.span>
              </div>
            </div>

            {/* Timer Bar */}
            <div className="h-2 w-full bg-gray-700 rounded-full mb-6 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  timeLeft > 30
                    ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                    : timeLeft > 10
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
                    : 'bg-gradient-to-r from-red-500 to-rose-400'
                }`}
                animate={{ width: `${(timeLeft / 60) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Difficulty Badge */}
            <div className="text-center mb-2">
              <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">
                Level {difficulty} {['', '🌱', '🌿', '🌳', '🔥', '💎'][Math.min(difficulty, 5)]}
              </span>
            </div>

            {/* Question Card */}
            <motion.div
              key={question.text}
              className={`max-w-md mx-auto rounded-3xl p-8 text-center border-2 transition-colors ${
                feedback === 'correct'
                  ? 'bg-green-500/10 border-green-500/50'
                  : feedback === 'wrong'
                  ? 'bg-red-500/10 border-red-500/50'
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
                    {option}
                  </motion.button>
                ))}
              </div>

              {feedback === 'correct' && (
                <motion.p
                  className="mt-4 text-green-400 font-bold text-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                >
                  ✨ +{10 * combo} pts!
                </motion.p>
              )}
              {feedback === 'wrong' && (
                <motion.p
                  className="mt-4 text-red-400 font-bold"
                  initial={{ x: -10 }}
                  animate={{ x: [10, -10, 5, 0] }}
                >
                  ❌ Answer: {question.answer}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* GAME OVER */}
        {gameState === 'gameover' && (
          <motion.div
            key="gameover"
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-3xl border border-purple-500/30 p-8 max-w-md mx-auto">
              <motion.div
                className="text-7xl mb-4"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: 1 }}
              >
                🏆
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-4">Quest Complete!</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3">
                  <span className="text-gray-400">⭐ Final Score</span>
                  <span className="text-2xl font-bold text-yellow-400">{score}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3">
                  <span className="text-gray-400">✅ Accuracy</span>
                  <span className="text-lg font-bold text-green-400">
                    {totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3">
                  <span className="text-gray-400">🔥 Best Streak</span>
                  <span className="text-lg font-bold text-orange-400">{bestStreak}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3">
                  <span className="text-gray-400">📊 Questions</span>
                  <span className="text-lg font-bold text-blue-400">{totalCorrect}/{totalAnswered}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3">
                  <span className="text-gray-400">📈 Max Level</span>
                  <span className="text-lg font-bold text-purple-400">{difficulty}</span>
                </div>
              </div>

              <div className="text-center mb-6">
                {score >= 200 ? (
                  <p className="text-yellow-400 font-bold">🌟 Legendary Math Wizard! 🌟</p>
                ) : score >= 100 ? (
                  <p className="text-purple-400 font-bold">🧙 Grand Sorcerer of Numbers!</p>
                ) : score >= 50 ? (
                  <p className="text-blue-400 font-bold">📚 Apprentice Mathematician!</p>
                ) : (
                  <p className="text-green-400 font-bold">🌱 Keep practicing, young wizard!</p>
                )}
              </div>

              <motion.button
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl shadow-lg shadow-purple-500/30"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startGame}
              >
                🔄 Play Again!
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {gameState === 'gameover' && <WhatsNext moduleId="times-tables" />}
    </div>
  );
}
