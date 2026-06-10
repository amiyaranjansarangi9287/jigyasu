import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface ChallengeData {
  title: string;
  prompt: string;
  options?: string[];
  correctAnswerIndex?: number;
  successMessage?: string;
  onSuccess?: () => void;
}

interface ChallengeOverlayProps {
  challenge: ChallengeData | null;
  onClose: () => void;
}

export default function ChallengeOverlay({ challenge, onClose }: ChallengeOverlayProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!challenge) return null;

  const handleCheck = () => {
    if (challenge.correctAnswerIndex !== undefined) {
      if (selected === challenge.correctAnswerIndex) {
        setShowFeedback(true);
        if (challenge.onSuccess) challenge.onSuccess();
      } else {
        // Simple shake animation could be added here
        alert(t('learnos.challenge.try_again', 'Try again! Think about the physics!'));
      }
    } else {
      setShowFeedback(true);
      if (challenge.onSuccess) challenge.onSuccess();
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(challenge.prompt);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-modal-in">
      <div className="bg-gray-900 border-4 border-indigo-500/50 shadow-2xl shadow-indigo-500/20 rounded-3xl max-w-lg w-full p-6 lg:p-8 flex flex-col gap-6 transform transition-all">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl animate-bounce-slow">🧑‍🔬</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              {challenge.title}
            </h3>
          </div>
          <button 
            onClick={handleSpeak}
            className="p-3 rounded-full bg-indigo-900/50 hover:bg-indigo-800 text-indigo-300 transition-colors"
          >
            🔊
          </button>
        </div>

        {/* Prompt */}
        <p className="text-xl text-gray-200 font-medium leading-relaxed">
          {challenge.prompt}
        </p>

        {/* Options */}
        {challenge.options && !showFeedback && (
          <div className="flex flex-col gap-3">
            {challenge.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelected(idx)}
                className={`p-4 rounded-2xl text-left font-bold text-lg border-2 transition-all active:scale-95 ${
                  selected === idx 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30' 
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-indigo-500 hover:bg-gray-800/80'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Feedback Area */}
        {showFeedback ? (
          <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-6 text-center animate-bounce-in">
            <span className="text-5xl block mb-2">🎉</span>
            <p className="text-green-400 font-bold text-xl">
              {challenge.successMessage || t('learnos.challenge.success', 'Great job! You figured it out!')}
            </p>
            <button 
              onClick={onClose}
              className="mt-6 w-full py-4 rounded-xl bg-green-500 hover:bg-green-400 text-gray-900 font-black text-lg tracking-widest uppercase transition-all"
            >
              {t('learnos.challenge.continue', 'Continue Lab')}
            </button>
          </div>
        ) : (
          <button
            onClick={handleCheck}
            disabled={challenge.options ? selected === null : false}
            className={`w-full py-4 rounded-2xl font-black text-xl uppercase tracking-widest transition-all ${
              (challenge.options ? selected !== null : true)
                ? 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white shadow-lg shadow-indigo-500/25 active:scale-95'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
            }`}
          >
            {t('learnos.challenge.submit', 'Submit')}
          </button>
        )}
      </div>
    </div>
  );
}
