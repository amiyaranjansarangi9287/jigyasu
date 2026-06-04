// src/crosscutting/TeachMeMode.tsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '../store';
import { LearningService } from '../services';
import { ROUTES } from '../constants/routes';
import { ParentCorner } from '../shared/layout';
import { Button } from '@jigyasu/ui';

const MAX_CONCEPTS = ['gravity', 'photosynthesis', 'fractions', 'magnetism', 'water-cycle'];

const MAX_QUESTIONS: Record<string, string[]> = {
  gravity: [
    'What is gravity?',
    'Why do things fall down?',
    'Does the Moon have gravity?',
    'Why do astronauts float?',
  ],
  photosynthesis: [
    'How do plants make food?',
    'Do plants need sunlight?',
    'What do plants breathe?',
    'Where does the mass of a tree come from?',
  ],
  fractions: [
    'What is a half?',
    'Is 1/2 bigger than 1/3?',
    'What is 1/2 + 1/4?',
    'Can you show me with pizza?',
  ],
  magnetism: [
    'What is a magnet?',
    'Why do magnets stick to metal?',
    'Do all metals stick to magnets?',
    'Can magnets push things away?',
  ],
  'water-cycle': [
    'Where does rain come from?',
    'Why do clouds float?',
    'What happens to puddles?',
    'Is the water I drink the same as dinosaur water?',
  ],
};

type TeachState = 'select' | 'teaching' | 'question' | 'feedback' | 'complete';

export default function TeachMeMode() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [state, setState] = useState<TeachState>('select');
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [explanation, setExplanation] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<'clear' | 'good' | 'needs-more'>('clear');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const questions = selectedConcept ? MAX_QUESTIONS[selectedConcept] ?? [] : [];
  const currentQuestion = questions[currentQuestionIndex] ?? '';

  const handleStartTeaching = (concept: string) => {
    setSelectedConcept(concept);
    setState('teaching');
    setExplanation('');
    setCurrentQuestionIndex(0);
    setQuestionsAnswered(0);
  };

  const handleSubmitExplanation = async () => {
    if (explanation.length < 10) return;

    const quality =
      explanation.length > 100 ? 'clear' :
      explanation.length > 30 ? 'good' : 'needs-more';
    setFeedback(quality);
    setState('feedback');

    if (selectedConcept) {
      await LearningService.trackEvent(
        'teach-session',
        'crosscutting',
        language,
        'teach_me_completed',
        `teach-${selectedConcept}`,
        { explanationLength: explanation.length, quality }
      );
    }
  };

  const handleAskQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setExplanation('');
      setState('teaching');
    } else {
      setState('complete');
    }
    setQuestionsAnswered(questionsAnswered + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 relative">
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
          {state !== 'select' && (
            <span className="text-sm text-gray-400">
              Max is listening 👂
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">
          {state === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🎓</div>
              <h1 className="text-3xl font-bold text-emerald-700 mb-2">
                {t('crosscutting.teach_me.title')}
              </h1>
              <p className="text-gray-500 mb-2">
                {t('crosscutting.teach_me.subtitle')}
              </p>
              <div className="bg-white rounded-2xl p-4 mb-6">
                <p className="text-2xl mb-1">🧒</p>
                <p className="font-bold text-gray-800">{t('crosscutting.teach_me.max_name')}</p>
                <p className="text-sm text-gray-500">
                  {t('crosscutting.teach_me.max_description')}
                </p>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                {t('crosscutting.teach_me.teach_what')}
              </p>
              <div className="space-y-3">
                {MAX_CONCEPTS.map((concept) => (
                  <button
                    key={concept}
                    onClick={() => handleStartTeaching(concept)}
                    className="w-full p-4 bg-white rounded-2xl border-2 border-gray-200
                               hover:border-emerald-300 hover:bg-emerald-50 transition-all
                               text-left font-medium capitalize min-h-[56px]"
                  >
                    {concept.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {state === 'teaching' && (
            <motion.div
              key="teaching"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🧒</span>
                  <div>
                    <p className="font-bold text-gray-800">{t('crosscutting.teach_me.max_name')}</p>
                    <p className="text-sm text-gray-500">
                      {t('crosscutting.teach_me.max_asks')}:
                    </p>
                  </div>
                </div>
                <p className="text-lg text-emerald-700 font-medium bg-emerald-50 rounded-xl p-4">
                  {currentQuestionIndex === 0
                    ? `Can you explain ${selectedConcept?.replace('-', ' ')} to me?`
                    : currentQuestion}
                </p>
              </div>

              <textarea
                ref={textareaRef}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Write your explanation here..."
                className="w-full p-4 bg-white rounded-2xl border-2 border-gray-200
                           focus:border-emerald-400 focus:outline-none min-h-[120px]
                           text-gray-800 resize-none mb-4"
              />

              <Button
                onClick={handleSubmitExplanation}
                disabled={explanation.length < 10}
                size="lg"
                fullWidth
              >
                {t('crosscutting.teach_me.submit')} →
              </Button>
            </motion.div>
          )}

          {state === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className={`rounded-3xl p-8 mb-6 ${
                feedback === 'clear' ? 'bg-green-50' :
                feedback === 'good' ? 'bg-amber-50' : 'bg-orange-50'
              }`}>
                <div className="text-6xl mb-4">
                  {feedback === 'clear' ? '🌟' : feedback === 'good' ? '👍' : '💭'}
                </div>
                <h2 className="text-xl font-bold mb-2">
                  {feedback === 'clear'
                    ? t('crosscutting.teach_me.clear_explanation')
                    : feedback === 'good'
                    ? t('crosscutting.teach_me.good_start')
                    : 'Good effort — try adding more detail!'}
                </h2>
              </div>

              <Button onClick={handleAskQuestion} size="lg" fullWidth>
                {currentQuestionIndex < questions.length - 1
                  ? `Max asks another question →`
                  : t('crosscutting.teach_me.complete') + ' ✨'}
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
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-emerald-700 mb-2">
                {t('crosscutting.teach_me.teaching_test')}
              </h2>
              <p className="text-gray-500 mb-4">
                You answered {questionsAnswered} of Max's questions!
              </p>
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
