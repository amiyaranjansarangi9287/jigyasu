// src/worlds/early/components/QuizQuestion.tsx

import { motion } from 'framer-motion';

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctAnswer: string;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export function QuizQuestion({ question, options, correctAnswer, selectedIndex, onSelect }: QuizQuestionProps) {
  const showResult = selectedIndex !== null;

  return (
    <div>
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100 mb-6">
        <div className="text-4xl text-center mb-3">🐤</div>
        <p className="text-xl font-bold text-gray-800 text-center">{question}</p>
      </div>
      <div className="space-y-3">
        {options.map((option, i) => {
          const isCorrect = option === correctAnswer;
          const isSelected = selectedIndex === i;
          return (
            <motion.button
              key={option}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectedIndex === null && onSelect(i)}
              className={`w-full py-5 px-6 rounded-2xl font-bold text-xl text-left min-h-[64px] transition-all duration-300 ${
                !showResult ? 'bg-white border-2 border-gray-200 text-gray-700'
                : isCorrect ? 'bg-green-100 border-2 border-green-400 text-green-700'
                : isSelected ? 'bg-red-100 border-2 border-red-300 text-red-600'
                : 'bg-white border-2 border-gray-100 text-gray-500'
              }`}
            >
              {option} {showResult && isCorrect && '✓'}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
