import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../lib/soundEngine';

interface Card {
  id: number;
  pairId: number;
  content: string;
  type: 'question' | 'answer';
  emoji: string;
}

interface MatchRound {
  moves: number;
  matches: number;
  timeSeconds: number;
  date: string;
}

const generateDeck = (difficulty: 'easy' | 'medium' | 'hard'): Card[] => {
  const pairCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
  const pairs: { q: string; a: string; emoji: string }[] = [];

  const emojis = ['🧙‍♂️', '🐉', '🦄', '🧚', '🪄', '🏰', '⚔️', '🛡️', '🗝️', '🧪', '🍄', '🌸'];
  const usedEmojis = new Set<string>();

  while (pairs.length < pairCount) {
    const type = Math.floor(Math.random() * 4);
    let q: string, a: string;

    const max = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 50;

    switch (type) {
      case 0: {
        const x = Math.floor(Math.random() * max) + 1;
        const y = Math.floor(Math.random() * max) + 1;
        q = `${x} + ${y}`;
        a = String(x + y);
        break;
      }
      case 1: {
        const x = Math.floor(Math.random() * max) + max;
        const y = Math.floor(Math.random() * max) + 1;
        q = `${x} - ${y}`;
        a = String(x - y);
        break;
      }
      case 2: {
        const x = Math.floor(Math.random() * 10) + 2;
        const y = Math.floor(Math.random() * 10) + 2;
        q = `${x} × ${y}`;
        a = String(x * y);
        break;
      }
      default: {
        const y = Math.floor(Math.random() * 10) + 2;
        const ans = Math.floor(Math.random() * 10) + 2;
        q = `${y * ans} ÷ ${y}`;
        a = String(ans);
        break;
      }
    }

    // Avoid duplicate answers
    if (pairs.some((p) => p.a === a)) continue;

    let emoji = emojis[Math.floor(Math.random() * emojis.length)];
    while (usedEmojis.has(emoji)) {
      emoji = emojis[Math.floor(Math.random() * emojis.length)];
    }
    usedEmojis.add(emoji);

    pairs.push({ q, a, emoji });
  }

  const cards: Card[] = [];
  pairs.forEach((pair, i) => {
    cards.push({ id: i * 2, pairId: i, content: pair.q, type: 'question', emoji: pair.emoji });
    cards.push({ id: i * 2 + 1, pairId: i, content: pair.a, type: 'answer', emoji: pair.emoji });
  });

  // Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};

export default function MemoryMatch() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [history, setHistory] = useState<MatchRound[]>([]);

  const totalPairs = useMemo(() => cards.length / 2, [cards]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mathkingdom_match_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const startGame = (diff: 'easy' | 'medium' | 'hard') => {
    setDifficulty(diff);
    setCards(generateDeck(diff));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setMatches(0);
    setTimeSeconds(0);
    setGameStarted(true);
    setGameWon(false);
  };

  useEffect(() => {
    if (!gameStarted || gameWon) return;
    const timer = setInterval(() => setTimeSeconds((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, gameWon]);

  useEffect(() => {
    if (matches > 0 && matches === totalPairs && totalPairs > 0) {
      setGameWon(true);
      sfx.celebrate();
      const round: MatchRound = {
        moves,
        matches,
        timeSeconds,
        date: new Date().toLocaleDateString(),
      };
      const newHistory = [round, ...history].slice(0, 10);
      setHistory(newHistory);
      try {
        localStorage.setItem('mathkingdom_match_history', JSON.stringify(newHistory));
      } catch {}
    }
  }, [matches, totalPairs]);

  const handleCardClick = (cardId: number) => {
    if (flipped.length === 2) return;
    if (flipped.includes(cardId)) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card || matched.has(card.pairId)) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const first = cards.find((c) => c.id === firstId)!;
      const second = cards.find((c) => c.id === secondId)!;

      if (first.pairId === second.pairId && first.type !== second.type) {
        setTimeout(() => {
          setMatched((prev) => new Set([...prev, first.pairId]));
          setMatches((m) => m + 1);
          sfx.correct();
          setFlipped([]);
        }, 600);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const gridCols = difficulty === 'easy' ? 'grid-cols-4' : difficulty === 'medium' ? 'grid-cols-4' : 'grid-cols-4';

  return (
    <div className="w-full">
      {/* Menu */}
      {!gameStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <motion.div
            className="text-7xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🃏
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">Memory Match Magic</h3>
          <p className="text-gray-400 mb-6">
            Match equations with their answers! Flip two cards at a time to find the pairs.
          </p>

          <div className="space-y-3">
            {(['easy', 'medium', 'hard'] as const).map((d) => {
              const config = {
                easy: { pairs: 4, color: 'from-green-600 to-emerald-600', label: 'Apprentice', emoji: '🌱' },
                medium: { pairs: 6, color: 'from-blue-600 to-indigo-600', label: 'Sorcerer', emoji: '🔮' },
                hard: { pairs: 8, color: 'from-purple-600 to-pink-600', label: 'Grand Wizard', emoji: '🧙‍♂️' },
              }[d];
              return (
                <motion.button
                  key={d}
                  className={`w-full py-4 rounded-2xl bg-gradient-to-r ${config.color} text-white font-bold text-lg shadow-lg`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startGame(d)}
                >
                  <span className="text-2xl mr-2">{config.emoji}</span>
                  {config.label} — {config.pairs} pairs
                </motion.button>
              );
            })}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-6 bg-white/5 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-bold">📖 Recent Games</h4>
                <button
                  className="text-sm text-gray-500 hover:text-red-400"
                  onClick={() => {
                    setHistory([]);
                    try { localStorage.removeItem('mathkingdom_match_history'); } catch {}
                  }}
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.map((round, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-sm">
                    <span className="text-gray-400">{round.date}</span>
                    <span className="text-white">
                      🎯 {round.moves} moves · ⏱️ {round.timeSeconds}s
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Game Board */}
      {gameStarted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Stats bar */}
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <motion.button
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20"
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameStarted(false)}
            >
              ← Menu
            </motion.button>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold text-sm">
                🎯 {moves} moves
              </span>
              <span className="bg-white/5 px-3 py-1.5 rounded-lg text-green-400 font-bold text-sm">
                ✨ {matches}/{totalPairs}
              </span>
              <span className="bg-white/5 px-3 py-1.5 rounded-lg text-blue-400 font-bold text-sm">
                ⏱️ {timeSeconds}s
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-gray-700 rounded-full mb-6 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              animate={{ width: `${(matches / totalPairs) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Cards Grid */}
          <div className={`grid ${gridCols} gap-2 sm:gap-3 max-w-2xl mx-auto`}>
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id) || matched.has(card.pairId);
              const isMatched = matched.has(card.pairId);
              return (
                <motion.button
                  key={card.id}
                  className="aspect-square relative"
                  style={{ perspective: '800px' }}
                  whileHover={!isFlipped ? { scale: 1.05, y: -4 } : {}}
                  whileTap={!isFlipped ? { scale: 0.95 } : {}}
                  onClick={() => handleCardClick(card.id)}
                  disabled={isFlipped}
                >
                  <motion.div
                    className="absolute inset-0 preserve-3d"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                  >
                    {/* Back of card */}
                    <div
                      className="absolute inset-0 rounded-xl flex items-center justify-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 border-2 border-purple-400/50 flex items-center justify-center overflow-hidden relative">
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute inset-2 border-2 border-white/40 rounded-lg" />
                          <div className="absolute inset-4 border border-white/30 rounded" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-3xl">
                            ✨
                          </div>
                        </div>
                        <span className="text-3xl sm:text-4xl relative z-10">🔮</span>
                      </div>
                    </div>

                    {/* Front of card */}
                    <div
                      className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center p-2 ${
                        isMatched
                          ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-2 border-green-400 shadow-lg shadow-green-500/30'
                          : card.type === 'question'
                          ? 'bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border-2 border-blue-400/50'
                          : 'bg-gradient-to-br from-amber-500/30 to-orange-500/30 border-2 border-amber-400/50'
                      }`}
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      {isMatched && (
                        <motion.span
                          className="absolute top-1 right-1 text-sm"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.5, 1] }}
                        >
                          ⭐
                        </motion.span>
                      )}
                      <span className="text-sm sm:text-sm mb-1">{card.emoji}</span>
                      <span className={`font-bold text-sm sm:text-lg ${
                        card.type === 'question' ? 'text-blue-200' : 'text-amber-200'
                      }`}>
                        {card.content}
                      </span>
                      <span className="text-sm sm:text-sm text-gray-400 mt-1">
                        {card.type === 'question' ? '❓' : '💡'}
                      </span>
                    </div>
                  </motion.div>
                </motion.button>
              );
            })}
          </div>

          {/* Win Screen */}
          <AnimatePresence>
            {gameWon && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="max-w-md w-full bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl border-2 border-yellow-400 p-8 text-center shadow-2xl shadow-yellow-500/20"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <motion.div
                    className="text-7xl mb-3"
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1 }}
                  >
                    🏆
                  </motion.div>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-2">Victory!</h3>
                  <p className="text-gray-300 mb-6">You matched all the pairs!</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-gray-400 text-sm">Moves</p>
                      <p className="text-2xl font-bold text-white">{moves}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-gray-400 text-sm">Time</p>
                      <p className="text-2xl font-bold text-white">{timeSeconds}s</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => startGame(difficulty)}
                    >
                      🔄 Play Again
                    </motion.button>
                    <motion.button
                      className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setGameStarted(false)}
                    >
                      🏠 Menu
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
