import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HeritageStory } from '../types';
import { ChevronLeft, ChevronRight, X, BookOpen, Sparkles } from 'lucide-react';

interface StoryReaderProps {
  story: HeritageStory;
  onClose: () => void;
}

const moodGradients: Record<string, string> = {
  peaceful: 'from-sky-100 to-blue-50',
  tense: 'from-amber-100 to-orange-50',
  joyful: 'from-yellow-100 to-amber-50',
  sad: 'from-slate-100 to-gray-50',
  heroic: 'from-orange-100 to-red-50',
  mystical: 'from-purple-100 to-violet-50',
};

export default function StoryReader({ story, onClose }: StoryReaderProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const pages = story.pages;
  const isLastPage = currentPage === pages.length - 1;
  const hasQuiz = !!story.quiz && isLastPage;

  const goNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(p => p + 1);
      setQuizAnswer(null);
      setQuizSubmitted(false);
    }
  };

  const goPrev = () => {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
      setQuizAnswer(null);
      setQuizSubmitted(false);
    }
  };

  const page = pages[currentPage];
  const mood = page.mood || 'peaceful';
  const bgClass = moodGradients[mood] || moodGradients.peaceful;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{story.emoji || story.icon || '📖'}</span>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">{story.title}</h2>
              <p className="text-xs text-slate-500">{story.collection}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Page background */}
              <div className={`bg-gradient-to-br ${bgClass} rounded-2xl p-6 mb-4`}>
                {/* Visual cue */}
                {page.visualCue && (
                  <div className="text-4xl mb-4 text-center">{page.visualCue}</div>
                )}

                {/* Verse */}
                {page.verse && (
                  <div className="mb-4 p-3 bg-white/60 rounded-xl border border-amber-200/50">
                    <p className="text-sm text-amber-800 font-serif italic text-center">
                      {page.verse}
                    </p>
                  </div>
                )}

                {/* Page text */}
                <p className="text-lg text-slate-800 leading-relaxed font-body">
                  {page.text}
                </p>

                {/* Teaching moment */}
                {page.isTeachingMoment && (
                  <div className="mt-4 flex items-center gap-2 text-amber-600">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">{t('auto.learning.s508_teaching_moment', 'Teaching Moment')}</span>
                  </div>
                )}
              </div>

              {/* Quiz on last page */}
              {hasQuiz && story.quiz && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-slate-800">{t('auto.learning.s509_story_quiz', 'Story Quiz')}</h3>
                  </div>
                  <p className="text-slate-700 mb-4">{story.quiz.question}</p>
                  <div className="space-y-2">
                    {story.quiz.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => !quizSubmitted && setQuizAnswer(i)}
                        className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all ${
                          quizSubmitted
                            ? i === story.quiz!.correct
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : i === quizAnswer
                                ? 'bg-red-100 text-red-700 border-red-300'
                                : 'bg-slate-100 text-slate-500'
                            : quizAnswer === i
                              ? 'bg-amber-100 text-amber-800 border-amber-300 border-2'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {quizAnswer !== null && !quizSubmitted && (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      className="mt-3 w-full py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors"
                    >{t('auto.learning.s510_check_answer', 'Check Answer')}</button>
                  )}
                  {quizSubmitted && (
                    <div className={`mt-3 p-3 rounded-xl text-sm ${
                      quizAnswer === story.quiz!.correct
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {quizAnswer === story.quiz!.correct
                        ? `Correct! ${story.quiz!.explanation}`
                        : `Not quite. ${story.quiz!.explanation}`
                      }
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer - Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
          <button
            onClick={goPrev}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />{t('auto.learning.s511_previous', 'Previous')}</button>

          <span className="text-sm text-slate-500 font-medium">
            {currentPage + 1} / {pages.length}
          </span>

          <button
            onClick={goNext}
            disabled={currentPage >= pages.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >{t('auto.learning.s512_next', 'Next')}<ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
