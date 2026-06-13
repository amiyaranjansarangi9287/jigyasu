import { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { trueFalseItems, shuffle } from '../../data/gameData';
import { useAudio } from '../../context/AudioContext';
import { useTranslation } from 'react-i18next';

interface SpeedRoundProps {
  onBack: () => void;
}

const ROUND_TIME = 60; // seconds
const ITEMS_PER_ROUND = 10;

export default function SpeedRound({
  onBack }: SpeedRoundProps) {
  const { t } = useTranslation();
  const { playSound } = useAudio();
  const [items, setItems] = useState(shuffle(trueFalseItems).slice(0, ITEMS_PER_ROUND));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [lastAnswer, setLastAnswer] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
    if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
  }, [timeLeft, gameState]);

  const startGame = () => {
    setItems(shuffle(trueFalseItems).slice(0, ITEMS_PER_ROUND));
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(ROUND_TIME);
    setStreak(0);
    setBestStreak(0);
    setLastAnswer(null);
    setGameState('playing');
  };

  const endGame = () => {
    setGameState('ended');
    playSound('celebration');
  };

  const handleAnswer = (answer: boolean) => {
    if (gameState !== 'playing') return;

    const correct = answer === items[currentIndex].isTrue;
    
    if (correct) {
      setScore(s => s + (1 + Math.floor(streak / 3))); // Streak bonus
      setStreak(s => {
        const newStreak = s + 1;
        setBestStreak(b => Math.max(b, newStreak));
        return newStreak;
      });
      setLastAnswer('correct');
      playSound('success');
    } else {
      setStreak(0);
      setLastAnswer('wrong');
      playSound('error');
    }

    setTimeout(() => {
      setLastAnswer(null);
      if (currentIndex < items.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        // Reshuffle and continue if time remains
        setItems(shuffle(trueFalseItems).slice(0, ITEMS_PER_ROUND));
        setCurrentIndex(0);
      }
    }, 600);
  };

  const timePercentage = (timeLeft / ROUND_TIME) * 100;
  const current = items[currentIndex];

  if (gameState === 'ready') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
            <div className="text-5xl mb-2">⚡</div>
            <h2 className="text-2xl font-bold">{t('auto.learning.s806_speed_round', 'Speed Round!')}</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-2">{t('auto.learning.s807_answer_true_or_false_as_fast_as_you_can', 'Answer True or False as fast as you can!')}</p>
            <p className="text-gray-500 text-sm mb-6">You have {ROUND_TIME} seconds. Build streaks for bonus points!</p>
            <div className="flex gap-3">
              <button onClick={startGame} className="flex-1 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all hover:scale-105">▶️ Start!</button>
              <button onClick={onBack} className="px-4 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">←</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'ended') {
    const stars = score >= 12 ? 3 : score >= 8 ? 2 : score >= 4 ? 1 : 0;
    return (<div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
            <div className="text-5xl mb-2">⏱️</div>
            <h2 className="text-2xl font-bold">{t('auto.worlds_ai_components_games_SpeedRound.time_s_up', "Time's Up!")}</h2>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-3">{[...Array(3)].map((_, i) => (<span key={i} className={i < stars ? "" : "opacity-30"}>⭐</span>))}</div>
            <p className="text-3xl font-bold text-gray-800 mb-1">{score} points!</p>
            <p className="text-gray-600 mb-2">Best streak: {bestStreak} 🔥</p>
            <p className="text-gray-500 text-sm mb-6">{score >= 12 ? "🎉 Lightning fast!" : score >= 8 ? "⚡ Quick thinker!" : "🧠 Keep practicing!"}</p>
            <div className="flex gap-3">
              <button onClick={startGame} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg">🔄 Again!</button>
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
        <div className={cn(
          "p-4 text-white transition-colors",
          timeLeft > 30 ? "bg-gradient-to-r from-green-500 to-emerald-500"
            : timeLeft > 10 ? "bg-gradient-to-r from-yellow-500 to-orange-500"
            : "bg-gradient-to-r from-red-500 to-red-600"
        )}>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">{score} pts</span>
            {streak >= 2 &&<span className="text-sm bg-white/20 px-2 py-1 rounded-full">🔥 x{streak}</span>}
            <span className="font-bold text-2xl">{timeLeft}s</span>
          </div>
          <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-1000 ease-linear" style={{ width: `${timePercentage}%` }} />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Flash feedback */}
          <div className={cn(
            "absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl",
            lastAnswer === 'correct' ? "bg-green-500/10 opacity-100" :
            lastAnswer === 'wrong' ? "bg-red-500/10 opacity-100" : "opacity-0"
          )} />

          {/* Statement */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-center min-h-[120px] flex items-center justify-center">
            <p className="text-lg font-medium text-gray-800">
              "{current.statement}"
            </p>
          </div>

          {/* True/False Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(true)}
              disabled={lastAnswer !== null}
              className="py-6 bg-green-100 border-2 border-green-300 rounded-xl font-bold text-green-700 text-xl hover:bg-green-200 transition-all active:scale-95 disabled:opacity-50"
            >✅ TRUE</button>
            <button
              onClick={() => handleAnswer(false)}
              disabled={lastAnswer !== null}
              className="py-6 bg-red-100 border-2 border-red-300 rounded-xl font-bold text-red-700 text-xl hover:bg-red-200 transition-all active:scale-95 disabled:opacity-50"
            >❌ FALSE</button>
          </div>

          {/* Show explanation briefly on answer */}
          {lastAnswer && (
            <div className={cn(
              "mt-4 p-3 rounded-xl text-sm text-center animate-fadeIn",
              lastAnswer === 'correct' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {lastAnswer === 'correct' ? '✓ ' : '✗ '}{current.explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
