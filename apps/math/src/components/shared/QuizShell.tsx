import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../../lib/soundEngine';
import { recordAnswer, getTopicStats, getDifficultyLabel, getDifficultyEmoji, type DiffLevel } from '../../lib/difficultyEngine';
import WhatsNext from './WhatsNext';
import DifficultyBadge from './DifficultyBadge';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

interface QuizShellProps {
  title: string;
  emoji: string;
  moduleId: string;
  generateQuestion: (level: DiffLevel) => QuizQuestion;
  color?: string;
}

/**
 * Drop-in quiz component that wraps any module's challenge mode with:
 * - Adaptive difficulty (auto-levels up after 4 correct, down on <40% accuracy)
 * - Sound effects on correct/wrong
 * - Score, streak, and accuracy tracking
 * - Difficulty badge display
 * - "What's Next?" cross-module suggestions at the bottom
 * - Level-up celebration animation
 */
export default function QuizShell({ emoji, moduleId, generateQuestion }: QuizShellProps) {
  const stats = getTopicStats(moduleId);
  const [level, setLevel] = useState<DiffLevel>(stats.level);
  const [question, setQuestion] = useState<QuizQuestion>(() => generateQuestion(stats.level));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const nextQ = useCallback(() => {
    const currentStats = getTopicStats(moduleId);
    setLevel(currentStats.level);
    setQuestion(generateQuestion(currentStats.level));
    setFeedback(null);
    setShowExplanation(false);
  }, [moduleId, generateQuestion]);

  const handleAnswer = useCallback((option: string) => {
    if (feedback) return;
    const isCorrect = option === question.answer;
    setTotal(t => t + 1);

    const result = recordAnswer(moduleId, isCorrect);

    if (isCorrect) {
      setFeedback('correct');
      sfx.correct();
      setScore(s => s + (level * 5));
      setStreak(s => s + 1);
      setCorrect(c => c + 1);

      if (result.levelChanged && result.direction === 'up') {
        setShowLevelUp(true);
        sfx.levelUp();
        setTimeout(() => setShowLevelUp(false), 2000);
      }

      setTimeout(nextQ, 1200);
    } else {
      setFeedback('wrong');
      sfx.wrong();
      setStreak(0);

      if (result.levelChanged && result.direction === 'down') {
        setLevel(result.level);
      }

      setTimeout(() => setFeedback(null), 1200);
    }
  }, [feedback, question, moduleId, level, nextQ]);

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="w-full">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold text-sm">⭐ {score}</span>
          <span className="bg-white/5 px-3 py-1.5 rounded-lg text-orange-400 font-bold text-sm">🔥 {streak}</span>
          {total > 0 && <span className="bg-white/5 px-3 py-1.5 rounded-lg text-green-400 font-bold text-sm">🎯 {accuracy}%</span>}
        </div>
        <DifficultyBadge level={level} />
      </div>

      {/* Level up animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-yellow-400/50 text-center"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: [0, 1.2, 1], rotate: [10, -5, 0] }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <span className="text-6xl block mb-2">🎉</span>
              <p className="text-yellow-400 font-bold text-2xl">Level Up!</p>
              <p className="text-white text-lg">{getDifficultyEmoji(level)} {getDifficultyLabel(level)}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question card */}
      <motion.div
        key={question.question}
        className={`max-w-lg mx-auto rounded-3xl p-6 sm:p-8 border-2 transition-colors ${
          feedback === 'correct'
            ? 'bg-green-500/10 border-green-500/40'
            : feedback === 'wrong'
            ? 'bg-red-500/10 border-red-500/40'
            : 'bg-white/5 border-white/10'
        }`}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="text-center mb-6">
          <motion.span
            className="text-4xl block mb-3"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {emoji}
          </motion.span>
          <p className="text-2xl sm:text-3xl font-bold text-white">{question.question}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt) => (
            <motion.button
              key={opt}
              className={`py-3 px-4 rounded-xl text-lg font-bold transition-all ${
                feedback === 'correct' && opt === question.answer
                  ? 'bg-green-500 text-white ring-4 ring-green-400/50'
                  : feedback === 'wrong' && opt === question.answer
                  ? 'bg-green-500/50 text-green-200'
                  : feedback
                  ? 'bg-white/5 text-gray-500'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/40 active:scale-95'
              }`}
              whileHover={!feedback ? { scale: 1.04 } : {}}
              whileTap={!feedback ? { scale: 0.96 } : {}}
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback}
            >
              {opt}
            </motion.button>
          ))}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.p
              className="mt-4 text-center text-green-400 font-bold text-lg"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
            >
              ✨ Correct! +{level * 5} pts
            </motion.p>
          )}
          {feedback === 'wrong' && (
            <motion.div className="mt-4 text-center">
              <motion.p
                className="text-red-400 font-bold"
                initial={{ x: -10 }}
                animate={{ x: [10, -10, 5, 0] }}
              >
                ❌ Answer: {question.answer}
              </motion.p>
              {question.explanation && (
                <button
                  className="text-xs text-blue-400 hover:text-blue-300 underline decoration-dashed mt-2"
                  onClick={() => setShowExplanation(true)}
                >
                  📝 Why?
                </button>
              )}
            </motion.div>
          )}
          {showExplanation && question.explanation && (
            <motion.p
              className="mt-2 text-center text-blue-300 bg-blue-500/10 rounded-lg px-3 py-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              📝 {question.explanation}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Skip */}
      <div className="text-center mt-4">
        <button
          className="text-gray-500 hover:text-gray-400 text-sm underline"
          onClick={nextQ}
        >
          Skip →
        </button>
      </div>

      {/* Cross-module links */}
      <WhatsNext moduleId={moduleId} />
    </div>
  );
}
