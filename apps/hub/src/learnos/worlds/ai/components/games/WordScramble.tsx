import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { scrambleWords, shuffle, scrambleWord } from '../../data/gameData';
import { useAudio } from '../../context/AudioContext';

interface WordScrambleProps {
  onBack: () => void;
}

export default function WordScramble({ onBack }: WordScrambleProps) {
  const { t } = useTranslation();
  const { playSound } = useAudio();
  const [words, setWords] = useState(shuffle(scrambleWords).slice(0, 8));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const current = words[currentIndex];

  useEffect(() => {
    if (current) {
      setScrambled(scrambleWord(current.word));
      setGuess('');
      setShowResult(false);
    }
  }, [currentIndex, current]);

  const handleSubmit = () => {
    if (!guess.trim()) return;
    
    const correct = guess.trim().toUpperCase() === current.word;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(s => s + 1);
      playSound('success');
    } else {
      playSound('error');
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      playSound('celebration');
      setGameOver(true);
    }
  };

  const restart = () => {
    setWords(shuffle(scrambleWords).slice(0, 8));
    setCurrentIndex(0);
    setScore(0);
    setGameOver(false);
    setShowResult(false);
    setGuess('');
  };

  if (gameOver) {
    const pct = (score / words.length) * 100;
    const stars = pct >= 80 ? 3 : pct >= 60 ? 2 : pct >= 40 ? 1 : 0;
    return (<div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
            <div className="text-5xl mb-2">🏆</div>
            <h2 className="text-2xl font-bold">{t('auto.learning.s808_game_over', 'Game Over!')}</h2>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-3">{[...Array(3)].map((_, i) => (<span key={i} className={i < stars ? "" : "opacity-30"}>⭐</span>))}</div>
            <p className="text-xl font-bold text-gray-800 mb-1">{score}/{words.length} correct!</p>
            <p className="text-gray-600 mb-6">{pct >= 80 ? "🎉 Word master!" : pct >= 60 ? "👏 Well done!" : "👍 Keep practicing!"}</p>
            <div className="flex gap-3">
              <button onClick={restart} className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-medium hover:shadow-lg">🔄 Play Again</button>
              <button onClick={onBack} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">← Games</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 sm:p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">🔤 Word Scramble</h2>
              <p className="text-orange-100 text-sm">Unscramble the AI word!</p>
            </div>
            <button onClick={onBack} className="px-3 py-1.5 bg-white/20 rounded-lg text-sm hover:bg-white/30">← Back</button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Progress */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Word {currentIndex + 1}/{words.length}</span>
            <span className="text-sm text-orange-600 font-bold">{score} correct</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all" style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }} />
          </div>

          {/* Hint */}
          <div className="text-center mb-4">
            <span className="text-4xl">{current.emoji}</span>
            <p className="text-gray-600 text-sm mt-1">Hint: {current.hint}</p>
          </div>

          {/* Scrambled Word */}
          <div className="bg-slate-900 rounded-2xl p-6 text-center mb-4">
            <div className="flex justify-center gap-2 mb-2">
              {scrambled.split('').map((letter, i) => (
                <span
                  key={i}
                  className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-700 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold text-yellow-400"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          {/* Input */}
          {!showResult ? (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value.toUpperCase())}
                placeholder="Type your answer..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-center text-lg font-bold uppercase tracking-wider"
                maxLength={current.word.length}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />
              <button
                onClick={handleSubmit}
                disabled={!guess.trim()}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50"
              >
                ✓
              </button>
            </div>) : (<div className={cn("p-4 rounded-xl mb-4 text-center", isCorrect ? "bg-green-100" : "bg-red-100")}>
              <p className="font-bold text-lg">{isCorrect ? "🎉 Correct!" : `❌ It was: ${current.word}`}</p>
            </div>
          )}

          {showResult && (
            <button onClick={handleNext} className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-medium hover:shadow-lg">
              {currentIndex < words.length - 1 ? "Next Word →" : "See Results! 🏆"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
