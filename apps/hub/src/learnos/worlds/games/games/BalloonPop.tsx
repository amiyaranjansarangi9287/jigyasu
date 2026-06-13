import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  points: number;
  emoji: string;
  type: 'normal' | 'star' | 'diamond' | 'freeze' | 'bomb' | 'multiPop';
}

const BALLOON_TYPES: { type: string; bg: string; emoji: string; points: number; chance: number }[] = [
  { type: 'normal', bg: 'bg-red-400', emoji: '🎈', points: 10, chance: 0.55 },
  { type: 'normal', bg: 'bg-blue-400', emoji: '🎈', points: 10, chance: 0.55 },
  { type: 'normal', bg: 'bg-green-400', emoji: '🎈', points: 10, chance: 0.55 },
  { type: 'normal', bg: 'bg-yellow-400', emoji: '🎈', points: 10, chance: 0.55 },
  { type: 'normal', bg: 'bg-pink-400', emoji: '🎈', points: 10, chance: 0.55 },
  { type: 'normal', bg: 'bg-purple-400', emoji: '🎈', points: 10, chance: 0.55 },
  { type: 'star', bg: 'bg-gradient-to-br from-yellow-300 to-amber-500', emoji: '⭐', points: 50, chance: 0.08 },
  { type: 'diamond', bg: 'bg-gradient-to-br from-cyan-300 to-blue-500', emoji: '💎', points: 100, chance: 0.04 },
  { type: 'freeze', bg: 'bg-gradient-to-br from-blue-200 to-cyan-400', emoji: '❄️', points: 25, chance: 0.06 },
  { type: 'bomb', bg: 'bg-gradient-to-br from-gray-700 to-gray-900', emoji: '💥', points: 0, chance: 0.05 },
  { type: 'multiPop', bg: 'bg-gradient-to-br from-purple-400 to-pink-500', emoji: '🌟', points: 30, chance: 0.05 },
];

const GAME_DURATION = 45;

// Load high score
function loadHighScore(): number {
  const { t } = useTranslation();
  try {
    return parseInt(localStorage.getItem('balloonpop-highscore') || '0', 10);
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem('balloonpop-highscore', score.toString());
  } catch {
    // Ignore
  }
}

interface Props { darkMode: boolean; }

export default function BalloonPop({ darkMode }: Props) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(loadHighScore);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [poppedCount, setPoppedCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showPop, setShowPop] = useState<{ x: number; y: number; points: number; text?: string } | null>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [frozenTimer, setFrozenTimer] = useState(0);
  
  const gameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const spawnRef = useRef<number | null>(null);
  const idRef = useRef(0);
  const freezeRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (gameRef.current) cancelAnimationFrame(gameRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    if (freezeRef.current) clearTimeout(freezeRef.current);
  }, []);

  const spawnBalloon = useCallback(() => {
    // Calculate which type to spawn
    const rand = Math.random();
    let cumulative = 0;
    let selectedType = BALLOON_TYPES[0];
    
    for (const type of BALLOON_TYPES) {
      cumulative += type.chance;
      if (rand < cumulative) {
        selectedType = type;
        break;
      }
    }
    
    const size = 40 + Math.random() * 30;
    
    const balloon: Balloon = {
      id: idRef.current++,
      x: Math.random() * 80 + 10,
      y: 110,
      color: selectedType.bg,
      speed: isFrozen ? 0.1 : 0.3 + Math.random() * 0.5,
      size,
      points: selectedType.points,
      emoji: selectedType.emoji,
      type: selectedType.type as Balloon['type'],
    };
    
    setBalloons(prev => [...prev, balloon]);
  }, [isFrozen]);

  const startGame = useCallback(() => {
    clearTimers();
    setBalloons([]);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setGameOver(false);
    setPoppedCount(0);
    setMissedCount(0);
    setCombo(0);
    setIsFrozen(false);
    setFrozenTimer(0);
    idRef.current = 0;
    
    // Spawn balloons
    spawnRef.current = window.setInterval(spawnBalloon, 800);
    
    // Timer
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsPlaying(false);
          setGameOver(true);
          clearTimers();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [clearTimers, spawnBalloon]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const loop = () => {
      setBalloons(prev => {
        const speed = isFrozen ? 0.1 : 1;
        const updated = prev.map(b => ({ ...b, y: b.y - b.speed * speed }));
        const remaining = updated.filter(b => {
          if (b.y < -10) {
            if (b.type !== 'bomb') {
              setMissedCount(m => m + 1);
              setCombo(0);
            }
            return false;
          }
          return true;
        });
        return remaining;
      });
      gameRef.current = requestAnimationFrame(loop);
    };

    gameRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameRef.current) cancelAnimationFrame(gameRef.current);
    };
  }, [isPlaying, gameOver, isFrozen]);

  // Frozen timer countdown
  useEffect(() => {
    if (isFrozen && frozenTimer > 0) {
      const timer = setInterval(() => {
        setFrozenTimer(t => {
          if (t <= 1) {
            setIsFrozen(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isFrozen, frozenTimer]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      saveHighScore(score);
    }
  }, [gameOver, score, highScore]);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  const popBalloon = (balloon: Balloon, e: React.MouseEvent | React.TouchEvent) => {
    if (!isPlaying) return;
    
    e.stopPropagation();
    
    // Handle bomb - ends game early!
    if (balloon.type === 'bomb') {
      setBalloons(prev => prev.filter(b => b.id !== balloon.id));
      setShowPop({ x: balloon.x, y: balloon.y, points: -100, text: 'BOOM!' });
      setScore(s => Math.max(0, s - 100));
      setCombo(0);
      setTimeout(() => setShowPop(null), 500);
      return;
    }
    
    const newCombo = combo + 1;
    setCombo(newCombo);
    
    const comboBonus = Math.min(newCombo - 1, 10) * 5;
    let points = balloon.points + comboBonus;
    let extraText = '';
    
    // Handle special balloons
    if (balloon.type === 'freeze') {
      setIsFrozen(true);
      setFrozenTimer(5);
      extraText = '+❄️5s';
    }
    
    if (balloon.type === 'multiPop') {
      // Pop nearby balloons
      const nearbyBalloons = balloons.filter(b =>b.id !== balloon.id &&
        Math.abs(b.x - balloon.x)< 20 &&
        Math.abs(b.y - balloon.y) < 20
      );
      const bonusPoints = nearbyBalloons.length * 15;
      points += bonusPoints;
      extraText = nearbyBalloons.length > 0 ? `+${nearbyBalloons.length} combo!` : '';
      setBalloons(prev => prev.filter(b => !nearbyBalloons.some(nb => nb.id === b.id)));
      setPoppedCount(p => p + nearbyBalloons.length);
    }
    
    setScore(s => s + points);
    setPoppedCount(p => p + 1);
    setBalloons(prev => prev.filter(b => b.id !== balloon.id));
    
    // Show pop effect
    setShowPop({ x: balloon.x, y: balloon.y, points, text: extraText || undefined });
    setTimeout(() => setShowPop(null), 500);
  };

  const accuracy = poppedCount + missedCount >0 
    ? Math.round((poppedCount / (poppedCount + missedCount)) * 100) 
    : 0;

  return (<div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Stats */}
      <div className={`flex gap-4 mb-2 text-sm font-bold flex-wrap justify-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span className="text-xl">🎯 {score}</span>
        <span>🏆 {highScore}</span>
        <span className={timeLeft <= 10 ? 'text-red-500 animate-pulse' : ''}>⏱️ {timeLeft}s</span>
        {combo >1 &&<span className="text-orange-500 animate-pulse">🔥 x{combo}</span>}
      </div>

      {/* Frozen indicator */}
      {isFrozen && (
        <div className="mb-2 px-3 py-1 bg-cyan-500 text-white rounded-full text-sm font-bold animate-pulse">
          ❄️ FROZEN! {frozenTimer}s
        </div>
      )}

      {gameOver && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg animate-bounce">
          <div>🎉 Score: {score}</div>
          <div className="text-sm font-normal mt-1">
            Popped: {poppedCount} | Accuracy: {accuracy}%
          </div>
        </div>
      )}

      {/* Legend */}
      {!isPlaying && !gameOver && (
        <div className={`mb-3 px-4 py-2 rounded-lg text-xs ${
          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 shadow-sm'
        }`}>
          <div className="grid grid-cols-3 gap-2 text-center">
            <span>🎈 +10</span>
            <span>⭐ +50</span>
            <span>💎 +100</span>
            <span>❄️ Freeze</span>
            <span>🌟 Multi-pop</span>
            <span>💥 Avoid!</span>
          </div>
        </div>
      )}

      {/* Game Area */}
      <div
        className={`relative w-full h-96 rounded-2xl overflow-hidden ${
          isFrozen
            ? 'bg-gradient-to-b from-blue-200 via-cyan-300 to-blue-400'
            : darkMode 
              ? 'bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900' 
              : 'bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500'
        }`}
      >
        {/* Clouds/Stars */}
        {!isFrozen && (darkMode ? (
          <>
            <div className="absolute top-4 left-[10%] text-xs">⭐</div>
            <div className="absolute top-8 left-[25%] text-sm">✨</div>
            <div className="absolute top-6 left-[50%] text-xs">⭐</div>
            <div className="absolute top-12 left-[75%] text-sm">✨</div>
            <div className="absolute top-4 left-[90%] text-xs">⭐</div>
          </>) : (<>
            <div className="absolute top-6 left-[10%] text-3xl opacity-60">☁️</div>
            <div className="absolute top-10 left-[40%] text-2xl opacity-50">☁️</div>
            <div className="absolute top-4 left-[70%] text-4xl opacity-40">☁️</div>
          </>
        ))}

        {/* Snowflakes when frozen */}
        {isFrozen && (
          <>
            <div className="absolute top-4 left-[15%] text-xl animate-bounce">❄️</div>
            <div className="absolute top-8 left-[45%] text-lg animate-bounce delay-100">❄️</div>
            <div className="absolute top-6 left-[75%] text-xl animate-bounce delay-200">❄️</div>
          </>
        )}

        {/* Balloons */}
        {balloons.map(balloon => (
          <button
            key={balloon.id}
            onClick={(e) => popBalloon(balloon, e)}
            onTouchStart={(e) => popBalloon(balloon, e)}
            className={`absolute transform -translate-x-1/2 transition-transform hover:scale-110 cursor-pointer ${balloon.color} rounded-full flex items-center justify-center shadow-lg ${
              balloon.type === 'bomb' ? 'animate-pulse' : ''
            }`}
            style={{
              left: `${balloon.x}%`,
              bottom: `${balloon.y}%`,
              width: balloon.size,
              height: balloon.size * 1.2,
              fontSize: balloon.size * 0.6,
            }}
          >
            {balloon.emoji}
            {/* String */}
            <div className="absolute -bottom-4 w-px h-4 bg-gray-400" />
          </button>
        ))}

        {/* Pop effect */}
        {showPop && (
          <div
            className={`absolute transform -translate-x-1/2 font-bold z-20 animate-[fadeUp_0.5s_ease-out] pointer-events-none text-center ${
              showPop.points >= 0 ? 'text-yellow-300' : 'text-red-500'
            }`}
            style={{ left: `${showPop.x}%`, bottom: `${showPop.y}%` }}
          >
            <div className="text-2xl">{showPop.points >= 0 ? `+${showPop.points}` : showPop.points}</div>
            {showPop.text && <div className="text-sm">{showPop.text}</div>}
          </div>
        )}

        {/* Start overlay */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className={`px-6 py-4 rounded-xl text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🎈 Balloon Pop!</h3>
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Pop balloons & catch power-ups!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Live stats */}
      {isPlaying && (
        <div className={`mt-3 flex gap-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>✅ Popped: {poppedCount}</span>
          <span>❌ Missed: {missedCount}</span>
          <span>🎯 Accuracy: {accuracy}%</span>
        </div>
      )}

      <button
        onClick={startGame}
        disabled={isPlaying}
        className="mt-4 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
      >
        {gameOver ? '🎈 Play Again' : isPlaying ? '🎈 Popping...' : '🎈 Start Game'}
      </button>

      <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Tap balloons! ❄️ = freeze time, 🌟 = multi-pop, 💥 = avoid!
      </p>
    </div>
  );
}
