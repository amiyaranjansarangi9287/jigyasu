import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface EverydayConnectionProps {
  connection: string;
  indianContext: string;
  onRead?: () => void;
}

export function EverydayConnection({
  connection,
  indianContext,
  onRead,
}: EverydayConnectionProps) {
  const { t } = useTranslation();
  const [showIndian, setShowIndian] = useState(false);

  const handleToggle = () => {
    if (!showIndian && onRead) {
      onRead();
    }
    setShowIndian(!showIndian);
  };

  return (
    <div className="mx-4 mb-4">
      <div className="bg-violet-950/30 rounded-2xl p-4
                      border border-violet-800/30">
        <p className="text-violet-300 text-sm font-bold uppercase
                      tracking-wider mb-2">
          {t('explorer.concept.everyday')}
        </p>
        <p className="text-slate-200 text-sm leading-relaxed">
          {connection}
        </p>

        {/* Indian context toggle */}
        <button
          onClick={handleToggle}
          className="mt-3 text-violet-500 text-sm hover:text-violet-400
                     transition-colors underline"
        >
          {showIndian ? t('explorer.concept.hide', 'Hide') : `${t('explorer.concept.indian_context')} →`}
        </button>

        <AnimatePresence>
          {showIndian && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 pt-2 border-t border-violet-800/30"
            >
              <p className="text-amber-300 text-sm leading-relaxed">
                🇮🇳 {indianContext}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
