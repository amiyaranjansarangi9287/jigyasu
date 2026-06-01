import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ThinkingPromptProps {
  question: string;
  onEngaged: () => void;
}

export function ThinkingPrompt({ question, onEngaged }: ThinkingPromptProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [thought, setThought] = useState('');
  const [shared, setShared] = useState(false);

  const handleExpand = () => {
    setExpanded(true);
    onEngaged();
  };

  return (
    <div className="mx-4 mb-6">
      <button
        onClick={handleExpand}
        className="w-full text-left bg-slate-900 rounded-2xl p-4
                   border border-slate-700 hover:border-violet-600/50
                   transition-all group"
      >
        <p className="text-slate-500 text-sm font-bold uppercase
                      tracking-wider mb-2">
          {t('explorer.concept.thinking_prompt')}
        </p>
        <p className="text-slate-200 text-sm leading-relaxed">
          {question}
        </p>
        {!expanded && (
          <p className="text-violet-500 text-sm mt-2 group-hover:text-violet-400
                        transition-colors">
            {t('explorer.concept.reflect')} →
          </p>
        )}
      </button>

      <AnimatePresence>
        {expanded && !shared && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2"
          >
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder={t('explorer.concept.write_thinking')}
              rows={3}
              className="w-full bg-slate-900 text-slate-300 rounded-xl
                         p-3 text-sm resize-none border border-slate-700
                         focus:border-violet-600/50 focus:outline-none
                         placeholder-slate-600"
            />
            {thought.length > 20 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShared(true)}
                className="mt-2 px-4 py-2 bg-violet-800/50 text-violet-300
                           rounded-xl text-sm font-bold border border-violet-700/50
                           hover:bg-violet-800 transition-colors min-h-[36px]"
              >
                {t('explorer.concept.save_thought')}
              </motion.button>
            )}
          </motion.div>
        )}

        {shared && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 bg-slate-900 rounded-xl p-3
                       border border-slate-800 text-center"
          >
            <p className="text-slate-500 text-sm italic">
              "{thought}"
            </p>
            <p className="text-slate-700 text-sm mt-1">
              {t('explorer.concept.saved')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
