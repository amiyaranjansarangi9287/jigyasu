// src/crosscutting/MistakeMuseum.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../constants/routes';
import { ParentCorner } from '../shared/layout';
import { Button, Card } from '@jigyasu/ui';
import { MISTAKE_EXHIBITS, MistakeExhibit } from './data/mistakeMuseumContent';

export default function MistakeMuseum() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedExhibit, setSelectedExhibit] = useState<MistakeExhibit | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < MISTAKE_EXHIBITS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedExhibit(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedExhibit(null);
    }
  };

  void MISTAKE_EXHIBITS[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 relative">
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
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {MISTAKE_EXHIBITS.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!selectedExhibit ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🏛️</div>
                <h1 className="text-3xl font-bold text-purple-700 mb-2">
                  {t('crosscutting.mistake_museum.title')}
                </h1>
                <p className="text-gray-500">
                  {t('crosscutting.mistake_museum.subtitle')}
                </p>
              </div>

              <div className="space-y-3">
                {MISTAKE_EXHIBITS.map((ex, i) => (
                  <motion.div
                    key={ex.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card
                      hoverable
                      onClick={() => setSelectedExhibit(ex)}
                      className={`w-full p-4 text-left min-h-[72px] transition-all
                        ${i === currentIndex
                          ? 'bg-purple-100 border-purple-300 ring-2 ring-purple-300'
                          : 'border-transparent hover:border-purple-200 hover:bg-purple-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{ex.emoji}</span>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm">
                            {t(`crosscutting.data.mistake_museum.${ex.id}.wrongBelief`, { defaultValue: ex.wrongBelief })}
                          </p>
                          <p className="text-sm text-gray-400">
                            {t(`crosscutting.data.mistake_museum.${ex.id}.period`, { defaultValue: ex.period })}
                          </p>
                        </div>
                        <span className="text-gray-300">→</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setSelectedExhibit(null)}
                className="text-gray-400 hover:text-gray-600 mb-4"
              >
                ← Back to exhibits
              </button>

              <Card className="p-6 mb-4 border-purple-100/50">
                <div className="text-5xl mb-4">{selectedExhibit.emoji}</div>
                <h2 className="text-xl font-bold text-purple-700 mb-1">
                  {t('crosscutting.mistake_museum.wrong_belief')}
                </h2>
                <p className="text-lg text-gray-800 mb-4">
                  {t(`crosscutting.data.mistake_museum.${selectedExhibit.id}.wrongBelief`, { defaultValue: selectedExhibit.wrongBelief })}
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      {t('crosscutting.mistake_museum.how_long')}
                    </p>
                    <p className="text-gray-700">
                      {t(`crosscutting.data.mistake_museum.${selectedExhibit.id}.period`, { defaultValue: selectedExhibit.period })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      {t('crosscutting.mistake_museum.why_sense')}
                    </p>
                    <p className="text-gray-700">
                      {t(`crosscutting.data.mistake_museum.${selectedExhibit.id}.whySense`, { defaultValue: selectedExhibit.whySense })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      {t('crosscutting.mistake_museum.overturned')}
                    </p>
                    <p className="text-gray-700">
                      {t(`crosscutting.data.mistake_museum.${selectedExhibit.id}.overturned`, { defaultValue: selectedExhibit.overturned })}
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-4">
                    <p className="text-sm font-semibold text-amber-700">
                      {t('crosscutting.mistake_museum.indian_connection')}
                    </p>
                    <p className="text-amber-800">
                      {t(`crosscutting.data.mistake_museum.${selectedExhibit.id}.indianConnection`, { defaultValue: selectedExhibit.indianConnection })}
                    </p>
                  </div>
                </div>
              </Card>

              <div className="text-center py-4">
                <p className="text-lg italic text-purple-600 font-medium">
                  "{t(`crosscutting.data.mistake_museum.${selectedExhibit.id}.quote`, { defaultValue: selectedExhibit.quote })}"
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handlePrev}
                  variant="secondary"
                  disabled={currentIndex === 0}
                  className="flex-1"
                >
                  ← Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentIndex === MISTAKE_EXHIBITS.length - 1}
                  className="flex-1"
                >
                  Next →
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
