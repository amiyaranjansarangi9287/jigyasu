import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { matchingPairs, shuffle } from '../../data/gameData';
import { useAudio } from '../../context/AudioContext';

interface MatchingGameProps {
  onBack: () => void;
}

type Card = {
  id: string;
  text: string;
  pairId: number;
  type: 'term' | 'definition';
};

export default function MatchingGame({ onBack }: MatchingGameProps) {
  const { t } = useTranslation();
  const { playSound } = useAudio();
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const startNewRound = () => {
    const pairs = shuffle(matchingPairs).slice(0, 6);
    const newCards: Card[] = [];
    pairs.forEach((pair, i) => {
      newCards.push({ id: `t-${i}`, text: `${pair.emoji} ${pair.term}`, pairId: i, type: 'term' });
      newCards.push({ id: `d-${i}`, text: pair.definition, pairId: i, type: 'definition' });
    });
    setCards(shuffle(newCards));
    setSelected([]);
    setMatched([]);
    setWrong([]);
    setMoves(0);
    setGameComplete(false);
  };

  useEffect(() => {
    startNewRound();
  }, []);

  const handleCardClick = (cardId: string) => {
    if (matched.includes(cardId) || selected.includes(cardId) || selected.length >= 2 || wrong.length > 0) return;

    const newSelected = [...selected, cardId];
    setSelected(newSelected);
    playSound('pop');

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const card1 = cards.find(c => c.id === newSelected[0])!;
      const card2 = cards.find(c => c.id === newSelected[1])!;

      if (card1.pairId === card2.pairId && card1.type !== card2.type) {
        // Match!
        playSound('success');
        const newMatched = [...matched, newSelected[0], newSelected[1]];
        setMatched(newMatched);
        setSelected([]);
        
        if (newMatched.length === cards.length) {
          setTimeout(() => {
            playSound('celebration');
            setGameComplete(true);
          }, 400);
        }
      } else {
        // No match
        playSound('error');
        setWrong(newSelected);
        setTimeout(() => {
          setSelected([]);
          setWrong([]);
        }, 800);
      }
    }
  };

  const stars = moves <= 8 ? 3 : moves <= 12 ? 2 : 1;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 sm:p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">🧩 Match the Pairs</h2>
              <p className="text-purple-100 text-sm">Match each AI term with its definition!</p>
            </div>
            <button onClick={onBack} className="px-3 py-1.5 bg-white/20 rounded-lg text-sm hover:bg-white/30">← Back</button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {!gameComplete ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">{t('auto.learning.s803_moves', 'Moves:')}<span className="font-bold text-purple-600">{moves}</span></span>
                <span className="text-sm text-gray-600">{t('auto.learning.s804_matched', 'Matched:')}<span className="font-bold text-green-600">{matched.length / 2}/6</span></span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {cards.map(card => {
                  const isSelected = selected.includes(card.id);
                  const isMatched = matched.includes(card.id);
                  const isWrong = wrong.includes(card.id);

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      disabled={isMatched}
                      className={cn(
                        "p-2 sm:p-3 rounded-xl border-2 text-xs sm:text-sm font-medium transition-all min-h-[70px] sm:min-h-[80px]",
                        isMatched && "bg-green-100 border-green-400 text-green-700 scale-95",
                        isSelected && !isWrong && "bg-purple-100 border-purple-400 text-purple-700 scale-105",
                        isWrong && "bg-red-100 border-red-400 text-red-700 animate-pulse",
                        !isSelected && !isMatched && !isWrong && "bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:scale-[1.02]",
                        isMatched && "cursor-default"
                      )}
                    >
                      {card.text}
                    </button>
                  );
                })}
              </div>
            </>) : (<div className="text-center py-6">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('auto.learning.s805_all_matched', 'All Matched!')}</h3>
              <div className="text-4xl mb-3">{[...Array(3)].map((_, i) => (<span key={i} className={i < stars ? "" : "opacity-30"}>⭐</span>))}</div>
              <p className="text-gray-600 mb-6">Completed in {moves} moves!</p>
              <button onClick={startNewRound} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                🔄 Play Again (New Words!)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
