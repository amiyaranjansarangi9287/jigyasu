import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

type MoleType = 'hidden' | 'mole' | 'whacked' | 'bomb' | 'golden' | 'fast' | 'healing' | 'multiplier';
type Difficulty = 'easy' | 'normal' | 'hard' | 'insane';

const GRID_SIZE = 9; // 3x3
const GAME_DURATION = 30;

const DIFFICULTY_CONFIG: Record<Difficulty, { moleTime: number; spawnRate: number; bombChance: number; specialChance: number }> = {
  easy: { moleTime: 1500, spawnRate: 1000, bombChance: 0, specialChance: 0.08 },
  normal: { moleTime: 1200, spawnRate: 800, bombChance: 0.1, specialChance: 0.12 },
  hard: { moleTime: 900, spawnRate: 600, bombChance: 0.15, specialChance: 0.15 },
  insane: { moleTime: 600, spawnRate: 400, bombChance: 0.2, specialChance: 0.18 },
};

const MOLE_CONFIG: Record<MoleType, { emoji: string; points: number; description: string }> = {
  hidden: { emoji: '', points: 0, description: '' },
  whacked: { emoji: '💥', points: 0, description: '' },
  mole: { emoji: '🐹', points: 10, description: 'Normal mole' },
  bomb: { emoji: '💣', points: -50, description: 'Avoid!' },
  golden: { emoji: '⭐', points: 50, description: 'Golden star' },
  fast: { emoji: '⚡', points: 25, description: 'Fast mole - quick!' },
  healing: { emoji: '💚', points: 5, description: 'Heals +3 seconds' },
  multiplier: { emoji: '✖️', points: 15, description: '2x next hit' },
};

// Load high score
function loadHighScore(): number {
  const { t } = useTranslation();
  try {
    return parseInt(localStorage.getItem('whackamole-highscore') || '0', 10);
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem('whackamole-highscore', score.toString());
  } catch {
    // Ignore
  }
}

interface Props { darkMode: boolean; }

export default function WhackAMole({ darkMode }: Props) {
  const [holes, setHoles] = useState<MoleType[]>(Array(GRID_SIZE).fill('hidden'));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(loadHighScore);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [combo, setCombo] = useState(0);
  const [lastWhackTime, setLastWhackTime] = useState(0);
  const [showHit, setShowHit] = useState<{ index: number; points: number } | null>(null);
  const [multiplierActive, setMultiplierActive] = useState(false);
  const [stats, setStats] = useState({ hits: 0, misses: 0, maxCombo: 0 });
  
  const gameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const moleTimers = useRef<Map<number, number>>(new Map());

  const config = DIFFICULTY_CONFIG[difficulty];

  const clearAllTimers = useCallback(() => {
    if (gameRef.current) clearInterval(gameRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    moleTimers.current.forEach(timer => clearTimeout(timer));
    moleTimers.current.clear();
  }, []);

  const spawnMole = useCallback(() => {
    setHoles(prev => {
      const hiddenIndices = prev.map((state, i) => state === 'hidden' ? i : -1).filter(i => i !== -1);
      if (hiddenIndices.length === 0) return prev;
      
      const randomIndex = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
      const newHoles = [...prev];
      
      // Determine what appears
      const rand = Math.random();
      let moleType: MoleType;
      let displayTime = config.moleTime;
      
      if (rand < config.bombChance) {
        moleType = 'bomb';
      } else if (rand < config.bombChance + config.specialChance) {
        // Special moles
        const specials: MoleType[] = ['golden', 'fast', 'healing', 'multiplier'];
        moleType = specials[Math.floor(Math.random() * specials.length)];
        if (moleType === 'fast') displayTime = config.moleTime * 0.5; // Fast mole disappears quickly
      } else {
        moleType = 'mole';
      }
      
      newHoles[randomIndex] = moleType;
      
      // Auto-hide after time
      const timer = window.setTimeout(() => {
        setHoles(current => {
          const updated = [...current];
          if (updated[randomIndex] !== 'hidden' && updated[randomIndex] !== 'whacked') {
            if (updated[randomIndex] !== 'bomb') {
              setStats(s => ({ ...s, misses: s.misses + 1 }));
            }
            updated[randomIndex] = 'hidden';
          }
          return updated;
        });
        moleTimers.current.delete(randomIndex);
      }, displayTime);
      
      moleTimers.current.set(randomIndex, timer);
      return newHoles;
    });
  }, [config]);

  const startGame = useCallback(() => {
    clearAllTimers();
    setHoles(Array(GRID_SIZE).fill('hidden'));
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setGameOver(false);
    setCombo(0);
    setLastWhackTime(0);
    setMultiplierActive(false);
    setStats({ hits: 0, misses: 0, maxCombo: 0 });
    
    // Spawn moles
    gameRef.current = window.setInterval(spawnMole, config.spawnRate);
    
    // Timer countdown
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsPlaying(false);
          setGameOver(true);
          clearAllTimers();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [config.spawnRate, spawnMole, clearAllTimers]);

  useEffect(() => {
    return clearAllTimers;
  }, [clearAllTimers]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      saveHighScore(score);
    }
  }, [gameOver, score, highScore]);

  const whack = (index: number) => {
    if (!isPlaying) return;
    
    const state = holes[index];
    if (state === 'hidden' || state === 'whacked') return;
    
    const now = Date.now();
    let points = MOLE_CONFIG[state].points;
    let newCombo = 0;
    
    if (state === 'bomb') {
      // Hit bomb - lose points and combo
      setCombo(0);
      setMultiplierActive(false);
      setScore(s => Math.max(0, s + points));
      setStats(s => ({ ...s, misses: s.misses + 1 }));
    } else {
      // Hit something good
      if (now - lastWhackTime < 2000) {
        newCombo = combo + 1;
      }
      setCombo(newCombo);
      setStats(s => ({ ...s, hits: s.hits + 1, maxCombo: Math.max(s.maxCombo, newCombo) }));
      setLastWhackTime(now);
      
      const comboBonus = Math.min(newCombo, 10) * 5;
      let totalPoints = points + comboBonus;
      
      // Apply multiplier
      if (multiplierActive) {
        totalPoints *= 2;
        setMultiplierActive(false);
      }
      
      // Special effects
      if (state === 'healing') {
        setTimeLeft(t => Math.min(t + 3, GAME_DURATION + 10)); // Add 3 seconds
      }
      if (state === 'multiplier') {
        setMultiplierActive(true);
      }
      
      points = totalPoints;
      setScore(s => s + totalPoints);
    }
    
    // Show hit effect
    setShowHit({ index, points });
    setTimeout(() => setShowHit(null), 300);
    
    // Clear mole timer
    const timer = moleTimers.current.get(index);
    if (timer) {
      clearTimeout(timer);
      moleTimers.current.delete(index);
    }
    
    // Show whacked state briefly
    setHoles(prev => {
      const newHoles = [...prev];
      newHoles[index] = 'whacked';
      return newHoles;
    });
    
    setTimeout(() => {
      setHoles(prev => {
        const newHoles = [...prev];
        newHoles[index] = 'hidden';
        return newHoles;
      });
    }, 200);
  };

  const accuracy = stats.hits + stats.misses >0 
    ? Math.round((stats.hits / (stats.hits + stats.misses)) * 100) 
    : 0;

  return (<div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Difficulty */}
      <div className="flex gap-2 mb-3 flex-wrap justify-center">
        {(['easy', 'normal', 'hard', 'insane'] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            disabled={isPlaying}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all disabled:opacity-50 ${
              difficulty === d
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className={`flex gap-4 mb-3 text-sm font-bold flex-wrap justify-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span className="text-2xl">🎯 {score}</span>
        <span>🏆 {highScore}</span>
        <span className={timeLeft <= 5 ? 'text-red-500 animate-pulse text-lg' : ''}>⏱️ {timeLeft}s</span>
      </div>

      {/* Active effects */}
      <div className="flex gap-2 mb-2 h-6">
        {combo >0 &&<span className="text-orange-500 animate-pulse font-bold">🔥 x{combo + 1}</span>}
        {multiplierActive && <span className="text-purple-500 animate-pulse font-bold">✖️ 2x NEXT!</span>}
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg shadow-lg animate-bounce">
          <div>🎉 Score: {score}</div>
          <div className="text-sm font-normal mt-1">
            Hits: {stats.hits} | Accuracy: {accuracy}% | Best Combo: x{stats.maxCombo + 1}
          </div>
        </div>
      )}

      {/* Legend */}
      {!isPlaying && !gameOver && (
        <div className={`mb-3 px-4 py-2 rounded-lg text-xs grid grid-cols-2 gap-x-4 gap-y-1 ${
          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 shadow-sm'
        }`}>
          <span>🐹 +10</span><span>⭐ +50</span>
          <span>⚡ +25 (fast!)</span><span>💚 +5 +3s</span>
          <span>✖️ 2x next</span><span>💣 -50</span>
        </div>
      )}

      {/* Game Board */}
      <div className={`grid grid-cols-3 gap-3 p-4 rounded-2xl ${
        darkMode ? 'bg-gradient-to-br from-green-900 to-emerald-900' : 'bg-gradient-to-br from-green-400 to-emerald-500'
      }`}>
        {holes.map((state, index) => (
          <button
            key={index}
            onClick={() => whack(index)}
            className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full transition-all duration-100 flex items-center justify-center text-5xl sm:text-6xl ${
              darkMode ? 'bg-amber-900' : 'bg-amber-700'
            } ${state !== 'hidden' ? 'cursor-pointer active:scale-95' : ''}`}
            style={{
              boxShadow: 'inset 0 8px 16px rgba(0,0,0,0.4)',
            }}
          >
            {/* Hole dirt */}
            <div className={`absolute inset-2 rounded-full ${
              darkMode ? 'bg-amber-950' : 'bg-amber-800'
            }`} style={{ boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.5)' }} />
            
            {/* Mole/Item */}
            {state !== 'hidden' && (
              <span className={`relative z-10 transition-transform ${
                state === 'whacked' ? 'scale-150' : 
                state === 'fast' ? 'animate-bounce' : 
                'animate-[pop_0.2s_ease-out]'
              }`}>
                {MOLE_CONFIG[state].emoji}
              </span>
            )}
            
            {/* Hit score popup */}
            {showHit?.index === index && (
              <span className={`absolute -top-4 left-1/2 transform -translate-x-1/2 font-bold text-lg z-20 animate-[fadeUp_0.3s_ease-out] ${
                showHit.points > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {showHit.points > 0 ? `+${showHit.points}` : showHit.points}
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={startGame}
        disabled={isPlaying}
        className="mt-6 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50"
      >
        {gameOver ? '🔨 Play Again' : isPlaying ? '🔨 Playing...' : '🔨 Start Game'}
      </button>

      <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Tap to whack! Quick hits = combo bonus!
      </p>
    </div>
  );
}
