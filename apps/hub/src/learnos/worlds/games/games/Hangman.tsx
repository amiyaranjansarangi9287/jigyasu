import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

const WORD_CATEGORIES: Record<string, string[]> = {
  Animals: ['TIGER', 'ELEPHANT', 'PEACOCK', 'COBRA', 'DOLPHIN', 'RHINO', 'BUTTERFLY', 'CROCODILE', 'CHEETAH', 'FLAMINGO'],
  Countries: ['INDIA', 'CHINA', 'BRAZIL', 'GERMANY', 'JAPAN', 'MEXICO', 'SPAIN', 'THAILAND', 'EGYPT', 'NORWAY'],
  Food: ['SAMOSA', 'BIRYANI', 'DOSA', 'CHAPATI', 'LADDU', 'JALEBI', 'POHA', 'IDLI', 'VADA', 'PONGAL'],
  Monuments: ['TAJMAHAL', 'REDFORT', 'GATEWAY', 'KONARK', 'AJANTA', 'ELLORA', 'HAWA', 'QUTUB', 'LOTUS', 'INDIAGATE'],
  Sports: ['CRICKET', 'HOCKEY', 'KABADDI', 'KHOKHO', 'BADMINTON', 'TENNIS', 'VOLLEYBALL', 'SWIMMING', 'CYCLING', 'ATHLETICS'],
};

const MAX_WRONG = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const HangmanDrawing = ({ wrongGuesses, darkMode }: { wrongGuesses: number; darkMode: boolean }) => {
  const color = darkMode ? '#fff' : '#333';
  return (
    <svg viewBox="0 0 200 220" className="w-40 h-44 sm:w-48 sm:h-52">
      {/* Base */}
      <line x1="20" y1="210" x2="100" y2="210" stroke={color} strokeWidth="4" />
      {/* Pole */}
      <line x1="60" y1="210" x2="60" y2="20" stroke={color} strokeWidth="4" />
      {/* Top */}
      <line x1="60" y1="20" x2="140" y2="20" stroke={color} strokeWidth="4" />
      {/* Rope */}
      <line x1="140" y1="20" x2="140" y2="40" stroke={color} strokeWidth="4" />
      
      {/* Head */}
      {wrongGuesses >= 1 && (<circle cx="140" cy="55" r="15" fill="none" stroke={color} strokeWidth="4" />
      )}
      {/* Body */}
      {wrongGuesses >= 2 && (<line x1="140" y1="70" x2="140" y2="120" stroke={color} strokeWidth="4" />
      )}
      {/* Left arm */}
      {wrongGuesses >= 3 && (<line x1="140" y1="85" x2="115" y2="105" stroke={color} strokeWidth="4" />
      )}
      {/* Right arm */}
      {wrongGuesses >= 4 && (<line x1="140" y1="85" x2="165" y2="105" stroke={color} strokeWidth="4" />
      )}
      {/* Left leg */}
      {wrongGuesses >= 5 && (<line x1="140" y1="120" x2="115" y2="160" stroke={color} strokeWidth="4" />
      )}
      {/* Right leg */}
      {wrongGuesses >= 6 && (<line x1="140" y1="120" x2="165" y2="160" stroke={color} strokeWidth="4" />
      )}
    </svg>
  );
};

interface Props { darkMode: boolean; }

export default function Hangman({ darkMode }: Props) {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>('Animals');
  const [word, setWord] = useState<string>('');
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState({ wins: 0, losses: 0 });
  const [hint, setHint] = useState<string | null>(null);

  const initGame = useCallback((cat: string) => {
    const words = WORD_CATEGORIES[cat];
    const newWord = words[Math.floor(Math.random() * words.length)];
    setWord(newWord);
    setGuessed(new Set());
    setWrongGuesses(0);
    setCategory(cat);
    setHint(null);
  }, []);

  useEffect(() => {
    initGame('Animals');
  }, [initGame]);

  const handleGuess = (letter: string) => {
    if (guessed.has(letter) || wrongGuesses >= MAX_WRONG) return;
    
    const newGuessed = new Set(guessed);
    newGuessed.add(letter);
    setGuessed(newGuessed);

    if (!word.includes(letter)) {
      setWrongGuesses(w => w + 1);
    }
  };

  const isWon = word.split('').every(letter => guessed.has(letter));
  const isLost = wrongGuesses >= MAX_WRONG;
  const gameOver = isWon || isLost;

  useEffect(() => {
    if (isWon && word) {
      setScore(prev => ({ ...prev, wins: prev.wins + 1 }));
    } else if (isLost && word) {
      setScore(prev => ({ ...prev, losses: prev.losses + 1 }));
    }
  }, [isWon, isLost, word]);

  const showHint = () => {
    const unguessed = word.split('').filter(letter => !guessed.has(letter));
    if (unguessed.length > 0 && wrongGuesses < MAX_WRONG - 1) {
      const randomLetter = unguessed[Math.floor(Math.random() * unguessed.length)];
      setHint(randomLetter);
      setTimeout(() => setHint(null), 2000);
      setWrongGuesses(w => w + 1); // Hint costs a guess
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const letter = e.key.toUpperCase();
      if (ALPHABET.includes(letter) && !gameOver) {
        handleGuess(letter);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Category */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {Object.keys(WORD_CATEGORIES).map(cat => (
          <button
            key={cat}
            onClick={() => initGame(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              category === cat
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scores */}
      <div className={`flex gap-6 mb-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span className="text-emerald-500">✓ Wins: {score.wins}</span>
        <span className="text-red-500">✗ Losses: {score.losses}</span>
        <span>❤️ {MAX_WRONG - wrongGuesses}/{MAX_WRONG}</span>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className={`mb-4 px-6 py-3 rounded-xl font-bold text-lg shadow-lg ${
          isWon ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        }`}>
          {isWon ? '🎉 You won!' : `💀 Game Over! Word: ${word}`}
        </div>
      )}

      {/* Hangman */}
      <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <HangmanDrawing wrongGuesses={wrongGuesses} darkMode={darkMode} />
      </div>

      {/* Word display */}
      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        {word.split('').map((letter, i) => (
          <div
            key={i}
            className={`w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl font-bold border-b-4 ${
              darkMode ? 'border-gray-500' : 'border-gray-300'
            } ${
              guessed.has(letter) || gameOver
                ? darkMode ? 'text-white' : 'text-gray-800'
                : 'text-transparent'
            } ${hint === letter ? 'bg-yellow-200 rounded animate-pulse' : ''}`}
          >
            {(guessed.has(letter) || gameOver) ? letter : '_'}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="flex flex-wrap gap-1.5 justify-center max-w-md mb-4">
        {ALPHABET.map(letter => {
          const isGuessed = guessed.has(letter);
          const isCorrect = isGuessed && word.includes(letter);
          const isWrong = isGuessed && !word.includes(letter);
          return (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={isGuessed || gameOver}
              className={`w-9 h-10 sm:w-10 sm:h-11 rounded-lg font-bold text-sm sm:text-base transition-all ${
                isCorrect
                  ? 'bg-emerald-500 text-white'
                  : isWrong
                    ? 'bg-red-400 text-white opacity-50'
                    : isGuessed
                      ? 'bg-gray-400 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm'
              } disabled:cursor-not-allowed`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={showHint}
          disabled={gameOver || wrongGuesses >= MAX_WRONG - 1}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            darkMode ? 'bg-yellow-700 text-yellow-100 hover:bg-yellow-600' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          } disabled:opacity-50`}
        >💡 Hint (-1 life)</button>
        <button
          onClick={() => initGame(category)}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-md"
        >{t('auto.learning.s522_new_word', 'New Word')}</button>
      </div>

      <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Type letters on keyboard or click • Category: {category}
      </p>
    </div>
  );
}
