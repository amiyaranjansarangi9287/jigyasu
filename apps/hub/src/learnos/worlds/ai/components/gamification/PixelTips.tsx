import { useState, useEffect } from 'react';
import PixelMascot from '../story/PixelMascot';
import { useTranslation } from 'react-i18next';

const tips = [
  "Did you know? The human brain has about 86 billion neurons! 🧠",
  "ChatGPT was trained on text from millions of websites! 📚",
  "The word 'robot' comes from a Czech word meaning 'forced labor'! 🤖",
  "AI can now compose music that sounds like A.R. Rahman! 🎵",
  "The first computer program was written by Ada Lovelace in 1843! 👩‍💻",
  "Some AI can beat the best human players at chess AND Go! ♟️",
  "Your phone does over 5 trillion AI operations per second! 📱",
  "AI helps astronomers discover new planets! 🌍",
  "Neural networks can have millions of parameters! 🔢",
  "The 'T' in GPT stands for 'Transformer'! 🤖",
  "AI can translate between over 100 languages! 🌐",
  "Self-driving cars use Computer Vision to see the road! 🚗",
  "The first AI program was created in 1956! 📅",
  "Embeddings turn words into lists of hundreds of numbers! 🗺️",
  "RAG helps AI avoid making up facts! 📚",
];

export default function PixelTips() {
  const { t } = useTranslation();
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show tip after 2 seconds
    const showTimer = setTimeout(() => {
      setCurrentTip(Math.floor(Math.random() * tips.length));
      setIsVisible(true);
    }, 2000);

    // Rotate tips every 15 seconds
    const rotateTimer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTip(Math.floor(Math.random() * tips.length));
        setIsVisible(true);
      }, 500);
    }, 15000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(rotateTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="flex items-start gap-3 bg-white rounded-2xl shadow-lg p-4 max-w-md mx-auto transition-all animate-fadeIn">
      <div className="flex-shrink-0">
        <PixelMascot mood="curious" size="sm" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800 mb-1">💡 Did you know?</p>
        <p className="text-sm text-gray-600">{tips[currentTip]}</p>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-gray-400 hover:text-gray-600 text-sm flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
