import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export interface ExplanatoryFeedbackProps {
  explanation: string;
}

export function ExplanatoryFeedback({ explanation }: ExplanatoryFeedbackProps) {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="mt-3 text-center">
      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="bg-blue-100 text-blue-800 font-bold py-2 px-4 rounded-full text-sm border-2 border-blue-200 shadow-sm active:scale-95 transition-transform"
        >
          {t('core.pedagogy.feedback.why_btn', 'Why? 🤔')}
        </button>
      ) : (
        <motion.div
          className="text-left text-blue-900 bg-blue-100 rounded-xl p-4 text-sm border-2 border-blue-200 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-bold text-blue-800 mb-1 flex items-center gap-1">
            <span>💡</span> {t('core.pedagogy.feedback.explanation', 'Explanation')}
          </p>
          <p>{explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
