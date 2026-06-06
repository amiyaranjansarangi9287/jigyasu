import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../../lib/soundEngine';
import { recordAnswer, getTopicStats, getDifficultyLabel, getDifficultyEmoji, type DiffLevel } from '../../lib/difficultyEngine';
import { useUserProfile } from '@jigyasu/storage';
import WhatsNext from './WhatsNext';
import DifficultyBadge from './DifficultyBadge';
import { useVariableRewards, VariableRewardOverlay } from '../../../../../components/VariableRewards';
import { HintSystem } from '../../../../../components/HintSystem';
import { ExplanatoryFeedback } from '../../../../../components/ExplanatoryFeedback';
import { ShakeError, PulseSuccess } from '../../../../../components/MicroInteractions';
import { AudioNarration } from '../../../../../components/MultimodalLearning';

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
  const [mastery, setMastery] = useState(0);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const { profile, unlockAvatar, saveProfile } = useUserProfile();
  const { bonusXP, chestUnlocked, triggerReward } = useVariableRewards();

  const nextQ = useCallback(() => {
    const currentStats = getTopicStats(moduleId);
    setLevel(currentStats.level);
    setQuestion(generateQuestion(currentStats.level));
    setFeedback(null);
    setShowExplanation(false);
    setHintLevel(0);
    setEliminatedOptions([]);
  }, [moduleId, generateQuestion]);

  const handleHint = () => {
    if (feedback || hintLevel >= 3) return;
    
    if (hintLevel === 1) {
      if (profile) saveProfile({ xp: Math.max(0, (profile.xp || 0) - 5) });
    }
    
    setHintLevel(h => h + 1);

    const incorrectOptions = question.options.filter(opt => opt !== question.answer && !eliminatedOptions.includes(opt));
    
    if (hintLevel === 2) {
      setEliminatedOptions(prev => [...prev, ...incorrectOptions]);
    } else {
      if (incorrectOptions.length > 0) {
        const toEliminate = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
        setEliminatedOptions(prev => [...prev, toEliminate]);
      }
    }
  };

  const handleAnswer = useCallback((option: string) => {
    if (feedback) return;
    const isCorrect = option === question.answer;
    setTotal(t => t + 1);

    const result = recordAnswer(moduleId, isCorrect);
    
    // XP calculation: 3rd hint means no XP for this question
    const baseXP = level * 5;
    const xpGained = hintLevel >= 3 ? 0 : baseXP;

    if (isCorrect) {
      setFeedback('correct');
      sfx.correct();
      setMastery(m => m + 1);
      setStreak(s => s + 1);
      setCorrect(c => c + 1);

      if (result.levelChanged && result.direction === 'up') {
        setShowLevelUp(true);
        sfx.levelUp();
        setTimeout(() => setShowLevelUp(false), 2000);
      }

      // Variable Rewards Logic
      triggerReward(xpGained);

      setTimeout(nextQ, 1200);
    } else {
      setFeedback('wrong');
      sfx.wrong();
      setStreak(0);

      if (result.levelChanged && result.direction === 'down') {
        setLevel(result.level);
      }

      // Don't auto-advance when wrong. Let them read the explanation and click next manually.
    }
  }, [feedback, question, moduleId, level, nextQ]);

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="w-full">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold text-sm">⭐ {mastery}</span>
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

      {/* Mystery Chest Overlay */}
      <VariableRewardOverlay chestUnlocked={chestUnlocked} bonusXP={bonusXP} />

      {/* Question card */}
      <ShakeError isError={feedback === 'wrong'}>
        <PulseSuccess isSuccess={feedback === 'correct'}>
          <div
            key={question.question}
            className={`max-w-lg mx-auto rounded-3xl p-6 sm:p-8 border-2 transition-colors ${
              feedback === 'correct'
                ? 'bg-green-500/10 border-green-500/40'
                : feedback === 'wrong'
                ? 'bg-white/5 border-white/10'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="text-center mb-6 relative">
              {question.options.length > 2 && (
                <HintSystem
                  hintLevel={hintLevel}
                  onRequestHint={handleHint}
                  disabled={!!feedback}
                />
              )}
              <motion.span
                className="text-4xl block mb-3"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {emoji}
              </motion.span>
              <div className="flex items-center justify-center gap-3 mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-white">{question.question}</p>
                <AudioNarration text={question.question} />
              </div>
            </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt) => {
            const isEliminated = eliminatedOptions.includes(opt);
            return (
            <motion.button
              key={opt}
              className={`py-3 px-4 rounded-xl text-lg font-bold transition-all ${
                isEliminated 
                  ? 'opacity-20 bg-white/5 text-gray-500 scale-95 cursor-not-allowed'
                  : feedback === 'correct' && opt === question.answer
                  ? 'bg-green-500 text-white ring-4 ring-green-400/50 shadow-lg'
                  : feedback === 'wrong' && opt === question.answer
                  ? 'bg-green-500/50 text-green-200'
                  : feedback
                  ? 'bg-white/5 text-gray-500'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/40 shadow-sm active:scale-95'
              }`}
              whileHover={!feedback && !isEliminated ? { scale: 1.04 } : {}}
              whileTap={!feedback && !isEliminated ? { scale: 0.96 } : {}}
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback || isEliminated}
            >
              {opt}
            </motion.button>
          )})}
        </div>

        {/* Feedback Overlays */}
        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-green-500 rounded-full w-32 h-32 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.6)]">
                <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
          )}
          {feedback === 'wrong' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-red-500 rounded-full w-32 h-32 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.6)]">
                <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Feedback */}
        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.p
              className="mt-4 text-center text-green-400 font-bold text-lg relative z-20"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
            >
              ✨ Correct! {hintLevel >= 3 ? '+0 pts (Answer Revealed)' : `+${level * 5} pts`}
              {bonusXP > 0 && (
                <motion.span 
                  className="block text-amber-300 font-black mt-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  🎉 BONUS DROP: +{bonusXP} XP!
                </motion.span>
              )}
            </motion.p>
          )}
          {feedback === 'wrong' && (
            <motion.div className="mt-4 text-center relative z-20">
              <motion.p
                className="text-orange-400 font-bold"
                initial={{ x: -10 }}
                animate={{ x: [10, -10, 5, 0] }}
              >
                🤔 Answer: {question.answer}
              </motion.p>
              {question.explanation && (
                <ExplanatoryFeedback explanation={question.explanation} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
          </div>
        </PulseSuccess>
      </ShakeError>

      {/* Skip / Next */}
      <div className="text-center mt-4">
        {feedback === 'wrong' ? (
          <button
            className="bg-slate-800 text-white hover:bg-slate-700 px-6 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95"
            onClick={nextQ}
          >
            Next Question →
          </button>
        ) : (
          <button
            className="text-gray-500 hover:text-gray-400 text-sm underline"
            onClick={nextQ}
          >
            Skip →
          </button>
        )}
      </div>

      {/* Cross-module links */}
      <WhatsNext moduleId={moduleId} />
    </div>
  );
}
