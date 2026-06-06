// src/crosscutting/DailyWarmUp.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '../store';
import { LearningService } from '../services';
import { ROUTES } from '../constants/routes';
import { ParentCorner } from '../shared/layout';
import { Button } from '@jigyasu/ui';
import {
  getTodayWarmup,
  getStreak,
  incrementStreak,
} from './data/dailyWarmUpContent';

type WarmUpState = 'intro' | 'question' | 'answered' | 'complete';

export default function DailyWarmUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const todayChallenge = getTodayWarmup();
  const streak = getStreak();

  const [state, setState] = useState<WarmUpState>('intro');
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(streak);

  // Use age groups defined in our language store, fallback to 'explorer'
  const ageKey = ['tiny', 'early', 'lab', 'discovery', 'academy'].includes(language) ? language : 'explorer';
  const ageAdaptation = t(`crosscutting.data.daily_warmups.${todayChallenge.id}.ageAdaptations.${ageKey}`, { defaultValue: todayChallenge.ageAdaptations[ageKey] || todayChallenge.question });

  const themeText = t(`crosscutting.data.daily_warmups.${todayChallenge.id}.theme`, { defaultValue: todayChallenge.theme });
  const optionsText = (todayChallenge.options || []).map((opt, i) => 
    t(`crosscutting.data.daily_warmups.${todayChallenge.id}.options.${i}`, { defaultValue: opt })
  );
  const promptText = todayChallenge.prompt ? t(`crosscutting.data.daily_warmups.${todayChallenge.id}.prompt`, { defaultValue: todayChallenge.prompt }) : undefined;

  const handleAnswer = async (index: number) => {
    const correct = index === todayChallenge.correctIndex;
    setIsCorrect(correct);
    setState('answered');

    await LearningService.trackEvent(
      'warmup-session',
      'crosscutting',
      language,
      correct ? 'correct_answer' : 'wrong_answer',
      `warmup-${todayChallenge.id}`,
      { challengeId: todayChallenge.id, selected: index, correct }
    );
  };

  const handleComplete = async () => {
    const newStreak = incrementStreak();
    setCurrentStreak(newStreak);
    setState('complete');

    await LearningService.trackEvent(
      'warmup-session',
      'crosscutting',
      language,
      'concept_completed',
      `warmup-${todayChallenge.id}`,
      { streak: newStreak }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 relative">
      <ParentCorner />

      <div className="max-w-lg mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(ROUTES.FAMILY_HOME)}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-orange-600">{currentStreak} day streak</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {state === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="text-8xl mb-6"
              >
                ☀️
              </motion.div>
              <h1 className="text-3xl font-bold text-orange-700 mb-2">
                {t('crosscutting.daily_warmup.title')}
              </h1>
              <p className="text-gray-500 mb-2">
                {t('crosscutting.daily_warmup.subtitle')}
              </p>
              <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
                <p className="text-sm text-gray-400 mb-1">{t('crosscutting.daily_warmup.today')}</p>
                <p className="text-xl font-bold text-gray-800">{themeText}</p>
                <p className="text-sm text-orange-500 mt-2">
                  ~{todayChallenge.estimatedMinutes} {t('explorer.time_estimate')}
                </p>
              </div>
              <Button onClick={() => setState('question')} size="lg" fullWidth>
                {t('crosscutting.daily_warmup.start')} →
              </Button>
            </motion.div>
          )}

          {state === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
                <p className="text-sm text-orange-500 font-semibold mb-2">{themeText}</p>
                <p className="text-xl font-bold text-gray-800 mb-4">{ageAdaptation}</p>
                {promptText && (
                  <p className="text-sm text-gray-400 italic mb-4">💡 {promptText}</p>
                )}
              </div>

              {optionsText.length > 0 && (
                <div className="space-y-3">
                  {optionsText.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="w-full p-4 bg-white rounded-2xl border-2 border-gray-200
                                 hover:border-orange-300 hover:bg-orange-50 transition-all
                                 text-left font-medium min-h-[56px]"
                    >
                      <span className="inline-block w-8 h-8 rounded-full bg-gray-100
                                       text-center leading-8 mr-3 text-sm font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {state === 'answered' && (
            <motion.div
              key="answered"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className={`rounded-3xl p-8 mb-6 ${isCorrect ? 'bg-green-50' : 'bg-orange-50'}`}>
                <div className="text-6xl mb-4">{isCorrect ? '🎉' : '🤔'}</div>
                <h2 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                  {isCorrect ? t('crosscutting.daily_warmup.correct') : 'Not quite!'}
                </h2>
                <p className="text-gray-600">
                  {isCorrect
                    ? t('crosscutting.daily_warmup.correct_msg', { defaultValue: 'Great thinking!' })
                    : t('crosscutting.daily_warmup.wrong_msg', { defaultValue: 'The answer was:' }) + ` ${optionsText[todayChallenge.correctIndex ?? 0]}`}
                </p>
              </div>
              <Button onClick={handleComplete} size="lg" fullWidth>
                {t('crosscutting.daily_warmup.complete')} ✨
              </Button>
            </motion.div>
          )}

          {state === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="text-8xl mb-6"
              >
                🌟
              </motion.div>
              <h2 className="text-3xl font-bold text-orange-700 mb-2">
                {t('crosscutting.daily_warmup.done')}
              </h2>
              <p className="text-gray-500 mb-2">
                {t('crosscutting.daily_warmup.come_back')}
              </p>
              <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
                <p className="text-4xl font-bold text-orange-600">{currentStreak}</p>
                <p className="text-sm text-gray-400">day streak</p>
              </div>
              <Button onClick={() => navigate(ROUTES.FAMILY_HOME)} size="lg" fullWidth>
                {t('common.back')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
