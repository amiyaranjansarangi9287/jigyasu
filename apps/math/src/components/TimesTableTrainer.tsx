import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../lib/soundEngine';

interface Question {
  a: number;
  b: number;
  answer: number;
}

export default function TimesTableTrainer() {
  const [table, setTable] = useState<number>(2);
  const [mode, setMode] = useState<'practice' | 'quiz'>('practice');
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState<Set<string>>(new Set());
  const [showAllTables, setShowAllTables] = useState(false);
  const [quizTime, setQuizTime] = useState(60);
  const [quizScore, setQuizScore] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const generateQuestion = useCallback((t: number): Question => {
    const b = Math.floor(Math.random() * 12) + 1;
    return { a: t, b, answer: t * b };
  }, []);

  useEffect(() => {
    if (mode === 'practice') {
      setQuestion(generateQuestion(table));
      setUserAnswer('');
      setFeedback(null);
      setRevealed(false);
    }
  }, [table, mode, generateQuestion]);

  useEffect(() => {
    if (!quizActive) return;
    if (quizTime <= 0) {
      setQuizActive(false);
      return;
    }
    const timer = setInterval(() => setQuizTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [quizActive, quizTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || userAnswer.trim() === '') return;
    const parsed = parseInt(userAnswer);
    if (parsed === question.answer) {
      setFeedback('correct');
      sfx.correct();
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      if (quizActive) {
        setQuizScore((s) => s + 1);
        setTimeout(() => {
          setQuestion(generateQuestion(Math.floor(Math.random() * 12) + 1));
          setUserAnswer('');
          setFeedback(null);
        }, 600);
      } else {
        setTimeout(() => {
          setQuestion(generateQuestion(table));
          setUserAnswer('');
          setFeedback(null);
        }, 800);
      }
    } else {
      setFeedback('wrong');
      sfx.wrong();
      setStreak(0);
      setMistakes((prev) => new Set([...prev, `${question.a}×${question.b}`]));
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer('');
      }, 1000);
    }
  };

  const startQuiz = () => {
    setQuizActive(true);
    setQuizTime(60);
    setQuizScore(0);
    setQuestion(generateQuestion(Math.floor(Math.random() * 12) + 1));
    setUserAnswer('');
    setFeedback(null);
  };

  const getTableColor = (n: number) => {
    const colors = [
      'from-gray-500 to-gray-600',
      'from-red-500 to-rose-600',
      'from-orange-500 to-amber-600',
      'from-yellow-500 to-amber-500',
      'from-green-500 to-emerald-600',
      'from-teal-500 to-cyan-600',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-violet-600',
      'from-pink-500 to-rose-600',
      'from-amber-600 to-orange-700',
      'from-lime-500 to-green-600',
      'from-sky-500 to-blue-600',
    ];
    return colors[n - 1] || colors[0];
  };

  const tableEmoji = ['🌑', '🍎', '🔥', '⭐', '🌿', '🌊', '💙', '💜', '🌸', '🎯', '🍀', '✨'];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🎯 Times Table Master</h2>
        <p className="text-purple-300 text-lg">Master multiplication one table at a time!</p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-white/5 rounded-2xl p-1 border border-white/10">
          <button
            className={`px-4 sm:px-6 py-2 rounded-xl font-medium text-sm transition-colors ${
              mode === 'practice' ? 'bg-green-500/30 text-green-300 border border-green-400/30' : 'text-gray-400'
            }`}
            onClick={() => { setMode('practice'); setQuizActive(false); }}
          >
            📚 Practice
          </button>
          <button
            className={`px-4 sm:px-6 py-2 rounded-xl font-medium text-sm transition-colors ${
              mode === 'quiz' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/30' : 'text-gray-400'
            }`}
            onClick={() => setMode('quiz')}
          >
            ⚡ Speed Quiz
          </button>
        </div>
      </div>

      {/* Table selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-400 text-sm">Choose your table:</p>
          <button
            className="text-xs text-purple-400 hover:text-purple-300"
            onClick={() => setShowAllTables(!showAllTables)}
          >
            {showAllTables ? 'Hide' : 'Show'} full table
          </button>
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <motion.button
              key={n}
              className={`py-3 rounded-xl font-bold text-white transition-all bg-gradient-to-br ${getTableColor(n)} ${
                table === n ? 'ring-4 ring-white/50 scale-105' : 'opacity-70 hover:opacity-100'
              }`}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setTable(n); setMistakes(new Set()); }}
            >
              {tableEmoji[n - 1]}
              <div className="text-xs mt-0.5">×{n}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Practice Mode */}
        {mode === 'practice' && question && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto"
          >
            {/* Stats */}
            <div className="flex justify-center gap-3 mb-4">
              <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold text-sm">
                ⭐ {score}
              </span>
              <span className="bg-white/5 px-3 py-1.5 rounded-lg text-orange-400 font-bold text-sm">
                🔥 {streak}
              </span>
            </div>

            {/* Question card */}
            <motion.div
              className={`rounded-3xl p-8 text-center border-2 transition-colors ${
                feedback === 'correct'
                  ? 'bg-green-500/10 border-green-500/50'
                  : feedback === 'wrong'
                  ? 'bg-red-500/10 border-red-500/50'
                  : 'bg-white/5 border-white/10'
              }`}
              key={`${question.a}x${question.b}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <span className="text-4xl">{tableEmoji[table - 1]}</span>
              <div className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
                <span className="text-blue-400">{question.a}</span>
                <span className="text-purple-400 mx-2">×</span>
                <span className="text-orange-400">{question.b}</span>
                <span className="text-gray-400 mx-2">=</span>
                <span className="text-green-400">?</span>
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="flex-1 text-center text-2xl font-bold bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                  placeholder="?"
                  autoFocus
                  disabled={feedback !== null}
                />
                <motion.button
                  type="submit"
                  className="px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg"
                  whileTap={{ scale: 0.95 }}
                  disabled={feedback !== null}
                >
                  ✓
                </motion.button>
              </form>

              {feedback === 'correct' && (
                <motion.p
                  className="mt-4 text-green-400 font-bold text-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                >
                  ✨ Correct!
                </motion.p>
              )}
              {feedback === 'wrong' && (
                <motion.p
                  className="mt-4 text-red-400 font-bold text-xl"
                  initial={{ x: -10 }}
                  animate={{ x: [10, -10, 5, 0] }}
                >
                  ❌ It's {question.answer} — try again!
                </motion.p>
              )}

              <button
                className="mt-3 text-xs text-gray-500 hover:text-gray-400 underline"
                onClick={() => setRevealed(!revealed)}
              >
                {revealed ? 'Hide hint' : '💡 Peek at answer'}
              </button>
              {revealed && (
                <motion.p
                  className="text-amber-300 font-bold mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Answer: {question.answer}
                </motion.p>
              )}
            </motion.div>

            {/* Full table display */}
            {showAllTables && (
              <motion.div
                className="mt-4 bg-white/5 rounded-2xl p-4 border border-white/10"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                <h4 className="text-white font-bold mb-2 text-center">
                  {tableEmoji[table - 1]} The {table}× Table
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <div
                      key={n}
                      className={`text-center px-2 py-1.5 rounded-lg text-sm ${
                        mistakes.has(`${table}×${n}`)
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-white/5 text-gray-300'
                      }`}
                    >
                      {table} × {n} = <span className="font-bold text-white">{table * n}</span>
                    </div>
                  ))}
                </div>
                {mistakes.size > 0 && (
                  <p className="text-xs text-red-400 mt-2 text-center">
                    🔴 Red = mistakes made (review these!)
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Quiz Mode */}
        {mode === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto"
          >
            {!quizActive && quizTime === 60 ? (
              <div className="text-center bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-3xl border border-purple-500/30 p-8">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Speed Quiz</h3>
                <p className="text-gray-400 mb-6">
                  Answer as many multiplication questions as possible in 60 seconds!
                  <br />All tables mixed together!
                </p>
                <motion.button
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startQuiz}
                >
                  🚀 Start!
                </motion.button>
              </div>
            ) : !quizActive && quizTime <= 0 ? (
              <div className="text-center bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-3xl border border-purple-500/30 p-8">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2 }}
                >
                  🏆
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Time's Up!</h3>
                <div className="text-5xl font-bold text-yellow-400 my-4">{quizScore}</div>
                <p className="text-gray-400 mb-6">
                  {quizScore >= 20 ? '🌟 Times Table Champion!' : quizScore >= 10 ? '🧙 Math Wizard!' : '🌱 Keep practicing!'}
                </p>
                <motion.button
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setQuizTime(60); setQuizScore(0); }}
                >
                  🔄 Try Again
                </motion.button>
              </div>
            ) : question ? (
              <div>
                <div className="flex justify-between mb-4">
                  <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold">⭐ {quizScore}</span>
                  <span className={`font-bold ${quizTime > 10 ? 'text-green-400' : 'text-red-400'}`}>
                    ⏱️ {quizTime}s
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-700 rounded-full mb-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    animate={{ width: `${(quizTime / 60) * 100}%` }}
                  />
                </div>
                <motion.div
                  className="rounded-3xl p-8 text-center bg-white/5 border border-white/10"
                  key={`${question.a}x${question.b}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <div className="text-4xl font-bold text-white mb-4">
                    <span className="text-blue-400">{question.a}</span>
                    <span className="text-purple-400 mx-2">×</span>
                    <span className="text-orange-400">{question.b}</span>
                    <span className="text-gray-400 mx-2">=</span>
                    <span className="text-green-400">?</span>
                  </div>
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="flex-1 text-center text-2xl font-bold bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                      placeholder="?"
                      autoFocus
                      disabled={feedback !== null}
                    />
                    <motion.button
                      type="submit"
                      className="px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg"
                      whileTap={{ scale: 0.95 }}
                      disabled={feedback !== null}
                    >
                      ✓
                    </motion.button>
                  </form>
                  {feedback === 'correct' && (
                    <motion.p className="mt-3 text-green-400 font-bold" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      ✨ +1!
                    </motion.p>
                  )}
                  {feedback === 'wrong' && (
                    <p className="mt-3 text-red-400 font-bold">Answer: {question.answer}</p>
                  )}
                </motion.div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
