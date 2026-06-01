import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FlashcardProps {
  question: string;
  answer: string;
  onGrade: (grade: 'easy' | 'hard' | 'again') => void;
  emoji?: string;
}

export default function Flashcard({ question, answer, onGrade, emoji = '🧠' }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  const handleGrade = (grade: 'easy' | 'hard' | 'again') => {
    onGrade(grade);
    // Reset state for the next card if this component is re-used
    setTimeout(() => setIsFlipped(false), 300);
  };

  return (
    <div className="w-full max-w-sm mx-auto relative perspective-1000">
      <motion.div
        className="relative w-full h-80 cursor-pointer preserve-3d"
        onClick={handleFlip}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 backface-hidden bg-white rounded-3xl p-8 border-4 border-sky-400 shadow-xl flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-5xl mb-6 bg-sky-50 w-20 h-20 rounded-full flex items-center justify-center shadow-inner">
            {emoji}
          </div>
          <h3 className="text-2xl font-black text-slate-800 leading-tight">{question}</h3>
          <p className="mt-8 text-sm font-bold text-sky-500 bg-sky-50 px-4 py-2 rounded-full uppercase tracking-widest animate-pulse">
            Tap to reveal
          </p>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 bg-sky-500 rounded-3xl p-8 border-4 border-sky-600 shadow-xl flex flex-col items-center justify-center text-center text-white"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-sm font-bold text-sky-200 uppercase tracking-widest mb-4">
            Answer
          </div>
          <p className="text-2xl font-black mb-8 leading-tight">{answer}</p>
          
          <AnimatePresence>
            {isFlipped && (
              <motion.div 
                className="grid grid-cols-3 gap-2 w-full mt-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={(e) => e.stopPropagation()} // Prevent flipping back when grading
              >
                <button
                  onClick={() => handleGrade('again')}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-1 rounded-xl text-sm transition-all active:scale-95 shadow-lg"
                >
                  Again
                </button>
                <button
                  onClick={() => handleGrade('hard')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-1 rounded-xl text-sm transition-all active:scale-95 shadow-lg"
                >
                  Hard
                </button>
                <button
                  onClick={() => handleGrade('easy')}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-1 rounded-xl text-sm transition-all active:scale-95 shadow-lg"
                >
                  Easy
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
