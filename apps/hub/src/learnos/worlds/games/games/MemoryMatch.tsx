import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef, useCallback } from 'react';

type Theme = 'emoji' | 'animals' | 'food' | 'nature';
type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'classic' | 'timed' | 'zen';

const THEMES: Record<Theme, { name: string; nameKey: string; items: string[] }> = {
  emoji: {
    name: '😀 Emoji',
    nameKey: 'auto.memorymatch.theme_emoji',
    items: ['😀','😎','🥳','😍','🤩','😴','🤔','😱','👻','🤖','👽','🦄','🐶','🐱','🦊','🐻','🐼','🐨','🦁','🐯','🐸','🐵','🦋','🐝','🌈','⭐','🌙','☀️','🔥','❄️','💎','🎯'],
  },
  animals: {
    name: '🦁 Animals',
    nameKey: 'auto.memorymatch.theme_animals',
    items: ['🦁','🐯','🐻','🐼','🐨','🦊','🐰','🐶','🐱','🐵','🐸','🦋','🐝','🐢','🦜','🐬','🦩','🦔','🐙','🦈','🐘','🦒','🦘','🐿️','🦀','🐠','🐺','🦅','🦉','🦚','🦭','🐳'],
  },
  food: {
    name: '🍕 Food',
    nameKey: 'auto.memorymatch.theme_food',
    items: ['🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🌽','🥕','🥑','🧁','🍩','🍪','🍕','🌮','🍔','🍟','🥤','🍦','🎂','🧀','🥨','🍿'],
  },
  nature: {
    name: '🌸 Nature',
    nameKey: 'auto.memorymatch.theme_nature',
    items: ['🌸','🌺','🌻','🌷','🌹','💐','🌿','🍀','🌴','🌵','🌲','🍁','🍂','🌾','🌊','⛰️','🏔️','🌈','☀️','🌙','⭐','☁️','⛈️','❄️','🔥','💎','🪨','🌋','🏝️','🪻','🪷','🍄'],
  },
};

const GRID_CONFIG: Record<Difficulty, { pairs: number; cols: string; timeLimit: number }> = {
  easy: { pairs: 6, cols: 'grid-cols-3 sm:grid-cols-4', timeLimit: 60 },
  medium: { pairs: 10, cols: 'grid-cols-4 sm:grid-cols-5', timeLimit: 90 },
  hard: { pairs: 15, cols: 'grid-cols-5 sm:grid-cols-6', timeLimit: 120 },
};

interface Props { darkMode: boolean; }

export default function MemoryMatch({ darkMode }: Props) {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme>('emoji');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mode, setMode] = useState<GameMode>('classic');
  const [cards, setCards] = useState<{ id: number; item: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timeLimit, setTimeLimit] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [showLose, setShowLose] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState<Record<string, number>>({});
  
  const timerRef = useRef<number | null>(null);
  const lastMatchTime = useRef<number>(0);

  const initGame = useCallback((th: Theme, diff: Difficulty, m: GameMode) => {
    const config = GRID_CONFIG[diff];
    const items = THEMES[th].items;
    const shuffled = [...items].sort(() => Math.random() - 0.5).slice(0, config.pairs);
    const deck = [...shuffled, ...shuffled]
      .sort(() => Math.random() - 0.5)
      .map((item, i) => ({ id: i, item, flipped: false, matched: false }));
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setTimeLimit(config.timeLimit);
    setIsPlaying(false);
    setShowWin(false);
    setShowLose(false);
    setCombo(0);
    setMaxCombo(0);
    setScore(0);
    setTheme(th);
    setDifficulty(diff);
    setMode(m);
    lastMatchTime.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    initGame('emoji', 'easy', 'classic');
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [initGame]);

  useEffect(() => {
    if (isPlaying && !showWin && !showLose) {
      timerRef.current = window.setInterval(() => {
        setTimer(t => {
          const newTime = t + 1;
          if (mode === 'timed' && newTime >= timeLimit) {
            setIsPlaying(false);
            setShowLose(true);
            if (timerRef.current) clearInterval(timerRef.current);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, showWin, showLose, mode, timeLimit]);

  const handleFlip = (index: number) => {
    if (flippedIndices.length >= 2) return;
    if (cards[index].flipped || cards[index].matched) return;

    if (!isPlaying) setIsPlaying(true);

    const newCards = [...cards];
    newCards[index] = { ...newCards[index], flipped: true };
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (newCards[first].item === newCards[second].item) {
        // Match!
        const now = Date.now();
        const timeSinceLastMatch = now - lastMatchTime.current;
        
        // Combo: match within 5 seconds of last match
        let newCombo = 0;
        if (lastMatchTime.current !== 0 && timeSinceLastMatch < 5000) {
          newCombo = combo + 1;
          setCombo(newCombo);
          setMaxCombo(Math.max(maxCombo, newCombo));
        } else {
          setCombo(0);
        }
        lastMatchTime.current = now;
        
        // Score calculation
        const basePoints = 100;
        const comboBonus = newCombo * 50;
        const speedBonus = mode === 'timed' ? Math.max(0, 50 - Math.floor(timer / 3)) : 0;
        const matchPoints = basePoints + comboBonus + speedBonus;
        setScore(s => s + matchPoints);
        
        setTimeout(() => {
          const matched = newCards.map((card, i) =>
            i === first || i === second ? { ...card, matched: true } : card
          );
          setCards(matched);
          setFlippedIndices([]);
          const newMatches = matches + 1;
          setMatches(newMatches);
          
          if (newMatches === GRID_CONFIG[difficulty].pairs) {
            setIsPlaying(false);
            setShowWin(true);
            const key = `${theme}-${difficulty}-${mode}`;
            const finalScore = score + matchPoints;
            if (!bestScore[key] || finalScore > bestScore[key]) {
              setBestScore(prev => ({ ...prev, [key]: finalScore }));
            }
          }
        }, 300);
      } else {
        // No match
        setCombo(0);
        setTimeout(() => {
          const reset = newCards.map((card, i) =>
            i === first || i === second ? { ...card, flipped: false } : card
          );
          setCards(reset);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const config = GRID_CONFIG[difficulty];
  const key = `${theme}-${difficulty}-${mode}`;
  const currentBest = bestScore[key];

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Theme */}
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {(Object.entries(THEMES) as [Theme, { name: string; nameKey: string }][]).map(([key, { name, nameKey }]) => (
          <button
            key={key}
            onClick={() => initGame(key, difficulty, mode)}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              theme === key
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {t(nameKey, name)}
          </button>
        ))}
      </div>

      {/* Difficulty & Mode */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => initGame(theme, d, mode)}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              difficulty === d
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {t(`auto.memorymatch.diff_${d}`, d.charAt(0).toUpperCase() + d.slice(1))}
          </button>
        ))}
        <span className={`px-2 flex items-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>|</span>
        {(['classic', 'timed', 'zen'] as GameMode[]).map(m => (
          <button
            key={m}
            onClick={() => initGame(theme, difficulty, m)}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              mode === m
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {m === 'classic' ? t('auto.memorymatch.classic', '🎮 Classic') : m === 'timed' ? t('auto.memorymatch.timed', '⏱️ Timed') : t('auto.memorymatch.zen', '🧘 Zen')}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className={`flex gap-4 mb-4 text-sm font-semibold flex-wrap justify-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {mode !== 'zen' && (
          <span className={mode === 'timed' ? (timer > timeLimit - 10 ? 'text-red-500 animate-pulse' : '') : ''}>
            ⏱️ {mode === 'timed' ? `${formatTime(timeLimit - timer)}` : formatTime(timer)}
          </span>
        )}
        <span>🔄 {moves} {t('auto.memorymatch.moves', 'moves')}</span>
        <span>✅ {matches}/{config.pairs}</span>
        <span>🎯 {score}</span>
        {combo >0 &&<span className="text-orange-500 animate-pulse">🔥 x{combo + 1}</span>}
        {currentBest && <span className="text-purple-500">🏆 {currentBest}</span>}
      </div>

      {/* Win/Lose Message */}
      {showWin && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg animate-bounce shadow-lg">
          {t('auto.memorymatch.you_won', '🎉 You won!')} {t('auto.memorymatch.score', 'Score:')} {score} | {t('auto.memorymatch.max_combo', 'Max Combo:')} x{maxCombo + 1}
        </div>
      )}
      {showLose && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg">
          {t('auto.memorymatch.times_up', "⏰ Time's up!")} {t('auto.memorymatch.found_pairs', 'Found')} {matches}/{config.pairs} {t('auto.memorymatch.pairs', 'pairs')}
        </div>
      )}

      {/* Grid */}
      <div className={`grid ${config.cols} gap-2 sm:gap-3 mb-6`}>
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => handleFlip(i)}
            disabled={showWin || showLose}
            className={`w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl text-2xl sm:text-3xl md:text-4xl font-bold transition-all duration-300 transform ${
              card.flipped || card.matched
                ? card.matched
                  ? 'bg-emerald-100 border-2 border-emerald-400 scale-95'
                  : darkMode ? 'bg-gray-700 border-2 border-blue-400' : 'bg-white border-2 border-blue-400 shadow-md'
                : darkMode
                  ? 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 border-2 border-gray-500'
                  : 'bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 border-2 border-purple-400 shadow-md'
            } ${!card.flipped && !card.matched && !showWin && !showLose ? 'hover:scale-105 cursor-pointer' : ''}`}
          >
            {card.flipped || card.matched ? (
              <span className="inline-block animate-[flipIn_0.3s_ease]">{card.item}</span>) : (<span className="text-white/60 text-xl">?</span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => initGame(theme, difficulty, mode)}
        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-md"
      >{t('auto.learning.s524_new_game', 'New Game')}</button>

      <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {mode === 'timed' ? 'Beat the clock!' : mode === 'zen' ? 'Relax, no timer!' : 'Match pairs to score!'}
        {' | '}Quick matches = combo bonus! 🔥
      </p>
    </div>
  );
}
