import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Clock, Star, Zap, BookOpen } from 'lucide-react';
import { playMatch, playWrong, playClick, playVictory } from '../lib/sounds';

interface MicrobeInfo {
  name: string;
  emoji: string;
  fact: string;
  type: string;
}

const allMicrobes: MicrobeInfo[] = [
  { name: 'E. coli', emoji: '🦠', fact: 'Found in your gut! Most strains are harmless and help digest food.', type: 'Bacteria' },
  { name: 'Virus', emoji: '🧫', fact: 'Not technically alive — they need a host cell to reproduce.', type: 'Virus' },
  { name: 'Amoeba', emoji: '🫧', fact: 'Single-celled organisms that move by extending pseudopods (false feet).', type: 'Protist' },
  { name: 'Yeast', emoji: '🍄', fact: 'A fungus used to make bread rise and to brew beer! Saccharomyces cerevisiae.', type: 'Fungus' },
  { name: 'Algae', emoji: '🟢', fact: 'Produce about 50% of all the oxygen in Earth\'s atmosphere!', type: 'Protist' },
  { name: 'Paramecium', emoji: '🔬', fact: 'Covered in tiny hair-like cilia that help it swim and eat.', type: 'Protist' },
  { name: 'Tardigrade', emoji: '🐻', fact: 'Nearly indestructible! Can survive in space, extreme heat, and freezing cold.', type: 'Animal' },
  { name: 'Diatom', emoji: '💎', fact: 'Beautiful glass-like shells made of silica. Over 100,000 species exist!', type: 'Protist' },
  { name: 'Staph', emoji: '🟡', fact: 'Staphylococcus lives on your skin. Mostly harmless but can cause infections.', type: 'Bacteria' },
  { name: 'Phage', emoji: '🔷', fact: 'Bacteriophages are viruses that infect bacteria — used to fight infections!', type: 'Virus' },
  { name: 'Euglena', emoji: '🌿', fact: 'Can photosynthesize like a plant AND eat food like an animal!', type: 'Protist' },
  { name: 'Plasmodium', emoji: '🦟', fact: 'The parasite that causes malaria, transmitted by mosquitoes.', type: 'Protist' },
];

type Difficulty = 'easy' | 'medium' | 'hard';

const difficultySettings = {
  easy: { pairs: 6, cols: 3, label: '🟢 Easy (6 pairs)' },
  medium: { pairs: 8, cols: 4, label: '🟡 Medium (8 pairs)' },
  hard: { pairs: 12, cols: 4, label: '🔴 Hard (12 pairs)' },
};

interface Card {
  id: number;
  microbe: MicrobeInfo;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createCards(difficulty: Difficulty): Card[] {
  const count = difficultySettings[difficulty].pairs;
  const selected = shuffleArray(allMicrobes).slice(0, count);
  const pairs = [...selected, ...selected];
  return shuffleArray(pairs).map((m, i) => ({
    id: i, microbe: m, isFlipped: false, isMatched: false,
  }));
}

export default function MicrobeMatch() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [cards, setCards] = useState<Card[]>(createCards('medium'));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bestScores, setBestScores] = useState<Record<Difficulty, number | null>>({ easy: null, medium: null, hard: null });
  const [lastMatchedMicrobe, setLastMatchedMicrobe] = useState<MicrobeInfo | null>(null);
  const [streak, setStreak] = useState(0);
  const [showFact, setShowFact] = useState(false);

  const totalPairs = difficultySettings[difficulty].pairs;

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  const checkMatch = useCallback((ids: number[]) => {
    if (ids.length !== 2) return;
    const [first, second] = ids;
    const card1 = cards.find(c => c.id === first);
    const card2 = cards.find(c => c.id === second);

    if (card1 && card2 && card1.microbe.name === card2.microbe.name) {
      playMatch();
      setLastMatchedMicrobe(card1.microbe);
      setShowFact(true);
      setTimeout(() => setShowFact(false), 3000);
      setStreak(s => s + 1);
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === first || c.id === second ? { ...c, isMatched: true } : c
        ));
        setMatches(m => {
          const newMatches = m + 1;
          if (newMatches === totalPairs) {
            playVictory();
            setGameOver(true);
            setBestScores(prev => ({
              ...prev,
              [difficulty]: prev[difficulty] === null ? moves + 1 : Math.min(prev[difficulty]!, moves + 1)
            }));
          }
          return newMatches;
        });
        setFlippedIds([]);
      }, 600);
    } else {
      playWrong();
      setStreak(0);
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === first || c.id === second ? { ...c, isFlipped: false } : c
        ));
        setFlippedIds([]);
      }, 900);
    }
  }, [cards, moves, totalPairs, difficulty]);

  const handleCardClick = (id: number) => {
    if (flippedIds.length >= 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    if (!isPlaying) setIsPlaying(true);
    playClick();

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));
    setMoves(m => m + 1);
    if (newFlipped.length === 2) checkMatch(newFlipped);
  };

  const resetGame = (diff?: Difficulty) => {
    const d = diff || difficulty;
    setDifficulty(d);
    setCards(createCards(d));
    setFlippedIds([]); setMoves(0); setMatches(0);
    setTime(0); setIsPlaying(false); setGameOver(false);
    setStreak(0); setLastMatchedMicrobe(null); setShowFact(false);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const getStars = () => { const ratio = moves / (totalPairs * 2); if (ratio <= 1.2) return 3; if (ratio <= 1.8) return 2; return 1; };
  const cols = difficultySettings[difficulty].cols;

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🦠 Microbe Match</h2>
          <p className="text-gray-400 text-lg">Find matching pairs and learn about microorganisms!</p>
        </motion.div>

        {/* Difficulty selector */}
        <div className="flex justify-center gap-2 mb-4">
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button key={d} onClick={() => resetGame(d)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${difficulty === d ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {difficultySettings[d].label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 text-sm uppercase font-bold">
              <Trophy className="w-3 h-3" />Moves
            </div>
            <div className="text-xl font-black text-white">{moves}</div>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 text-sm uppercase font-bold">
              <Star className="w-3 h-3" />Matches
            </div>
            <div className="text-xl font-black text-emerald-400">{matches}/{totalPairs}</div>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 text-sm uppercase font-bold">
              <Clock className="w-3 h-3" />Time
            </div>
            <div className="text-xl font-black text-purple-400">{formatTime(time)}</div>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 text-sm uppercase font-bold">
              <Zap className="w-3 h-3" />Streak
            </div>
            <div className={`text-xl font-black ${streak >= 3 ? 'text-yellow-400' : streak >= 2 ? 'text-orange-400' : 'text-gray-400'}`}>
              {streak}{streak >= 3 ? '🔥' : ''}
            </div>
          </div>
        </div>

        {/* Fact popup */}
        <AnimatePresence>
          {showFact && lastMatchedMicrobe && (
            <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-4 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 rounded-xl border border-emerald-500/30 p-3 flex items-center gap-3">
                <div className="text-3xl">{lastMatchedMicrobe.emoji}</div>
                <div>
                  <div className="text-sm text-emerald-400 font-bold flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Match! — {lastMatchedMicrobe.name} <span className="text-gray-500">({lastMatchedMicrobe.type})</span>
                  </div>
                  <div className="text-sm text-gray-300 mt-0.5">{lastMatchedMicrobe.fact}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Board */}
        <div className={`grid gap-2.5 mb-5`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {cards.map(card => (
            <motion.button key={card.id}
              onClick={() => handleCardClick(card.id)}
              whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.04 } : {}}
              whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.96 } : {}}
              className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                card.isMatched ? 'border-emerald-500/40 bg-emerald-900/15 scale-95'
                : card.isFlipped ? 'border-blue-500/50 bg-blue-900/20'
                : 'border-gray-700 bg-gray-800 hover:border-gray-500 cursor-pointer'
              }`}>
              <motion.div initial={false} animate={{ rotateY: card.isFlipped || card.isMatched ? 0 : 180 }} transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col items-center justify-center">
                {card.isFlipped || card.isMatched ? (
                  <div className="flex flex-col items-center px-1">
                    <span className="text-2xl sm:text-3xl">{card.microbe.emoji}</span>
                    <span className="text-[8px] sm:text-sm text-gray-400 mt-1 font-medium text-center leading-tight">{card.microbe.name}</span>
                    <span className="text-[7px] text-gray-600">{card.microbe.type}</span>
                  </div>
                ) : (
                  <span className="text-2xl sm:text-3xl">❓</span>
                )}
              </motion.div>
            </motion.button>
          ))}
        </div>

        <div className="text-center">
          <button onClick={() => resetGame()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700">
            <RotateCcw className="w-4 h-4" /> New Game
          </button>
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ y: 30, scale: 0.9 }} animate={{ y: 0, scale: 1 }}
              className="bg-gray-900 rounded-2xl border border-emerald-500/30 p-7 max-w-sm w-full text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-2xl font-black text-white mb-1">Amazing!</h3>
              <p className="text-gray-400 text-sm mb-4">All microbes matched!</p>

              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3].map(s => (
                  <Star key={s} className={`w-7 h-7 ${s <= getStars() ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`} />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="text-gray-500 text-sm uppercase font-bold">Moves</div>
                  <div className="text-lg font-bold text-white">{moves}</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="text-gray-500 text-sm uppercase font-bold">Time</div>
                  <div className="text-lg font-bold text-white">{formatTime(time)}</div>
                </div>
              </div>

              {bestScores[difficulty] !== null && (
                <div className="text-sm text-emerald-400 mb-4">🏆 Best on {difficulty}: {bestScores[difficulty]} moves</div>
              )}

              <div className="flex gap-2">
                <button onClick={() => resetGame()} className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600">Play Again</button>
                <button onClick={() => {
                  const next = difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'hard';
                  resetGame(next);
                }} className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white text-sm font-bold hover:bg-purple-600">
                  {difficulty === 'hard' ? 'Replay Hard' : 'Next Difficulty →'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
