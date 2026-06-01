// src/shared/layout/ParentCorner.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore, useSettingsStore } from '../../store';
import { LANGUAGES } from '../../constants/languages';
import type { Language } from '../../types/shared';

interface ParentCornerProps {
  onExit?: () => void;
}

export function ParentCorner({ onExit }: ParentCornerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [pressTimer, setPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const { language, setLanguage } = useLearnerStore();
  const { soundEnabled, toggleSound, highContrast, toggleHighContrast, dyslexiaFont, toggleDyslexiaFont } = useSettingsStore();

  const handlePressStart = () => {
    const timer = setTimeout(() => setOpen(true), 3000);
    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (pressTimer) clearTimeout(pressTimer);
    setPressTimer(null);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        className="fixed top-4 right-4 z-50 w-10 h-10
                   bg-white/80 backdrop-blur rounded-full
                   flex items-center justify-center
                   text-gray-500 shadow-sm
                   select-none"
        title="Hold 3 seconds for parent options"
        aria-label="Parent corner - hold for 3 seconds"
      >
        ⚙️
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative bg-white rounded-t-3xl w-full max-w-sm p-6 space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-800 text-lg">
                  {t('family.parent_corner')}
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-600 text-xl
                             w-10 h-10 flex items-center justify-center"
                  aria-label="Close Parent Corner"
                >
                  ✕
                </button>
              </div>

              {/* Language switcher */}
              <div>
                <p className="text-sm text-gray-500 mb-2">{t('common.language')}</p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-2 py-2 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                        language === lang
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      aria-pressed={language === lang}
                      aria-label={`Set language to ${LANGUAGES[lang].nativeName}`}
                    >
                      {LANGUAGES[lang].nativeName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound toggle */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Sound</span>
                <button
                  onClick={toggleSound}
                  className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${
                    soundEnabled ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                  aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
                  aria-pressed={soundEnabled}
                  role="switch"
                  aria-checked={soundEnabled}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* High Contrast toggle */}
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">High Contrast Mode</span>
                <button
                  onClick={toggleHighContrast}
                  className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${
                    highContrast ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                  aria-label={highContrast ? 'Disable high contrast' : 'Enable high contrast'}
                  aria-pressed={highContrast}
                  role="switch"
                  aria-checked={highContrast}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Dyslexia Font toggle */}
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Dyslexia-Friendly Font</span>
                <button
                  onClick={toggleDyslexiaFont}
                  className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${
                    dyslexiaFont ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                  aria-label={dyslexiaFont ? 'Disable dyslexia font' : 'Enable dyslexia font'}
                  aria-pressed={dyslexiaFont}
                  role="switch"
                  aria-checked={dyslexiaFont}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    dyslexiaFont ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Exit */}
              {onExit && (
                <button
                  onClick={() => {
                    setOpen(false);
                    onExit();
                  }}
                  className="w-full py-3 bg-gray-100 text-gray-700
                             font-semibold rounded-2xl hover:bg-gray-200
                             transition-colors min-h-[48px]"
                  aria-label="Exit to Family Home"
                >
                  Exit to Family Home
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
