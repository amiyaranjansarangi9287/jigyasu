import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef } from 'react';

const GAME_HEIGHT = 150;
const GAME_WIDTH = 600;
const GROUND_HEIGHT = 20;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 50;
const GRAVITY = 0.8;
const JUMP_FORCE = -14;
const OBSTACLE_WIDTH = 20;

interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: 'cactus' | 'bird';
  y: number;
}

// Load high score
function loadHighScore(): number {
  try {
    return parseInt(localStorage.getItem('dino-highscore') || '0', 10);
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem('dino-highscore', score.toString());
  } catch {
    // Ignore
  }
}

interface Props { darkMode: boolean; }

export default function DinoRun({ darkMode }: Props) {
  const { t } = useTranslation();
  const [dinoY, setDinoY] = useState(GAME_HEIGHT - GROUND_HEIGHT - DINO_HEIGHT);
  const [dinoVelocity, setDinoVelocity] = useState(0);
  const [isDucking, setIsDucking] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(loadHighScore);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [isNight, setIsNight] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  
  const gameRef = useRef<number | null>(null);
  const frameRef = useRef(0);
  const lastObstacleRef = useRef(0);

  const groundY = GAME_HEIGHT - GROUND_HEIGHT - DINO_HEIGHT;
  const duckHeight = DINO_HEIGHT / 2;

  const jump = useCallback(() => {
    if (!isPlaying && !gameOver) {
      // Start game
      setIsPlaying(true);
      setObstacles([]);
      setScore(0);
      setSpeed(5);
      setIsNight(false);
      setIsNewHighScore(false);
      lastObstacleRef.current = 0;
      frameRef.current = 0;
    }
    
    if (gameOver) {
      // Restart
      setGameOver(false);
      setIsPlaying(true);
      setObstacles([]);
      setScore(0);
      setSpeed(5);
      setDinoY(groundY);
      setDinoVelocity(0);
      setIsNight(false);
      setIsNewHighScore(false);
      lastObstacleRef.current = 0;
      frameRef.current = 0;
      return;
    }
    
    // Jump only if on ground
    setDinoY(y => {
      if (y >= groundY - 5) {
        setDinoVelocity(JUMP_FORCE);
      }
      return y;
    });
  }, [isPlaying, gameOver, groundY]);

  const duck = useCallback((ducking: boolean) => {
    if (!isPlaying || gameOver) return;
    setIsDucking(ducking);
  }, [isPlaying, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        duck(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        duck(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [jump, duck]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = () => {
      frameRef.current++;
      
      // Update dino physics
      setDinoY(y => {
        const newY = y + dinoVelocity;
        if (newY >= groundY) {
          setDinoVelocity(0);
          return groundY;
        }
        setDinoVelocity(v => v + GRAVITY);
        return newY;
      });

      // Update obstacles
      setObstacles(prev => {
        let newObstacles = prev.map(obs => ({ ...obs, x: obs.x - speed })).filter(obs => obs.x > -50);
        
        // Spawn new obstacle
        const minGap = Math.max(200, 350 - score / 10);
        const lastObs = newObstacles[newObstacles.length - 1];
        const canSpawn = !lastObs || lastObs.x < GAME_WIDTH - minGap;
        
        if (canSpawn && Math.random() < 0.02) {
          const isBird = score >200 && Math.random()< 0.3;
          const isDoubleCactus = !isBird && score >100 && Math.random()< 0.3;
          
          newObstacles.push({
            x: GAME_WIDTH,
            width: isBird ? 30 : isDoubleCactus ? 40 : OBSTACLE_WIDTH + Math.random() * 15,
            height: isBird ? 25 : 30 + Math.random() * 25,
            type: isBird ? 'bird' : 'cactus',
            y: isBird ? GAME_HEIGHT - GROUND_HEIGHT - 50 - Math.random() * 40 : GAME_HEIGHT - GROUND_HEIGHT,
          });
        }
        
        return newObstacles;
      });

      // Update score
      setScore(s => {
        const newScore = s + 1;
        // Increase speed every 500 points
        if (newScore % 500 === 0) {
          setSpeed(sp => Math.min(sp + 1, 15));
        }
        // Toggle night every 1000 points
        if (newScore % 1000 === 0) {
          setIsNight(n => !n);
        }
        return newScore;
      });

      gameRef.current = requestAnimationFrame(gameLoop);
    };

    gameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameRef.current) cancelAnimationFrame(gameRef.current);
    };
  }, [isPlaying, gameOver, dinoVelocity, speed, groundY, score]);

  // Collision detection
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const dinoRect = {
      x: 50,
      y: dinoY,
      width: DINO_WIDTH - 10,
      height: isDucking ? duckHeight : DINO_HEIGHT - 10,
    };

    for (const obs of obstacles) {
      const obsRect = {
        x: obs.x,
        y: obs.type === 'bird' ? obs.y : obs.y - obs.height,
        width: obs.width,
        height: obs.height,
      };

      // AABB collision
      if (
        dinoRect.x < obsRect.x + obsRect.width &&
        dinoRect.x + dinoRect.width >obsRect.x &&
        dinoRect.y< obsRect.y + obsRect.height &&
        dinoRect.y + dinoRect.height > obsRect.y
      ) {
        setIsPlaying(false);
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          saveHighScore(score);
          setIsNewHighScore(true);
        }
        break;
      }
    }
  }, [dinoY, obstacles, isPlaying, gameOver, isDucking, duckHeight, score, highScore]);

  const scaleX = Math.min(1, (typeof window !== 'undefined' ? window.innerWidth - 32 : GAME_WIDTH) / GAME_WIDTH);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Stats */}
      <div className={`flex gap-6 mb-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span className="font-mono text-xl">🦖 {String(score).padStart(5, '0')}</span>
        <span className="font-mono">🏆 {String(highScore).padStart(5, '0')}</span>
        <span>⚡ {speed}x</span>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className={`mb-4 px-6 py-3 rounded-xl font-bold text-lg shadow-lg ${
          isNewHighScore 
            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white animate-pulse' 
            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        }`}>
          {isNewHighScore ? '🎉 NEW HIGH SCORE!' : '💀 Game Over!'} Score: {score}
        </div>
      )}

      {/* Game Canvas */}
      <div
        className={`relative overflow-hidden rounded-xl border-4 cursor-pointer select-none ${
          isNight
            ? 'bg-gray-900 border-gray-700'
            : darkMode
              ? 'bg-gray-800 border-gray-600'
              : 'bg-gradient-to-b from-sky-200 to-sky-100 border-gray-300'
        }`}
        style={{ width: GAME_WIDTH * scaleX, height: GAME_HEIGHT + 20 }}
        onClick={jump}
        onTouchStart={(e) => {
          e.preventDefault();
          const touchY = e.touches[0].clientY;
          const rect = e.currentTarget.getBoundingClientRect();
          if (touchY > rect.top + rect.height / 2) {
            duck(true);
          } else {
            jump();
          }
        }}
        onTouchEnd={() => duck(false)}
      >
        <div style={{ transform: `scaleX(${scaleX})`, transformOrigin: 'top left', width: GAME_WIDTH, height: GAME_HEIGHT + 20 }}>
          {/* Sun/Moon */}
          <div className={`absolute top-4 right-8 w-10 h-10 rounded-full ${
            isNight ? 'bg-yellow-100' : 'bg-yellow-300'
          }`} />

          {/* Clouds/Stars */}
          {isNight ? (
            <>
              <div className="absolute top-4 left-[10%] text-xs">⭐</div>
              <div className="absolute top-8 left-[30%] text-xs">✨</div>
              <div className="absolute top-6 left-[60%] text-xs">⭐</div>
              <div className="absolute top-10 left-[80%] text-xs">✨</div>
            </>) : (<>
              <div className="absolute top-6 left-[20%] text-2xl opacity-60">☁️</div>
              <div className="absolute top-10 left-[50%] text-xl opacity-40">☁️</div>
              <div className="absolute top-4 left-[70%] text-3xl opacity-50">☁️</div>
            </>
          )}

          {/* Ground */}
          <div
            className={`absolute bottom-0 left-0 right-0 ${
              isNight ? 'bg-gray-700' : darkMode ? 'bg-amber-800' : 'bg-amber-600'
            }`}
            style={{ height: GROUND_HEIGHT }}
          >
            <div className="w-full h-1 bg-black/20" />
            {/* Ground details */}
            <div className="absolute bottom-1 left-[10%] text-xs opacity-50">~</div>
            <div className="absolute bottom-1 left-[30%] text-xs opacity-50">~</div>
            <div className="absolute bottom-1 left-[50%] text-xs opacity-50">~</div>
            <div className="absolute bottom-1 left-[70%] text-xs opacity-50">~</div>
            <div className="absolute bottom-1 left-[90%] text-xs opacity-50">~</div>
          </div>

          {/* Dino */}
          <div
            className="absolute transition-none text-4xl"
            style={{
              left: 50,
              bottom: GAME_HEIGHT - dinoY - (isDucking ? duckHeight : DINO_HEIGHT) + GROUND_HEIGHT,
              transform: isDucking ? 'scaleY(0.5) translateY(50%)' : '',
            }}
          >
            {gameOver ? '💀' : dinoVelocity < 0 ? '🦖' : isDucking ? '🦎' : frameRef.current % 10 < 5 ? '🦖' : '🦕'}
          </div>

          {/* Obstacles */}
          {obstacles.map((obs, i) => (
            <div
              key={i}
              className="absolute transition-none"
              style={{
                left: obs.x,
                bottom: obs.type === 'bird' ? GAME_HEIGHT - obs.y : GROUND_HEIGHT,
                fontSize: obs.type === 'bird' ? '24px' : `${Math.max(24, obs.height)}px`,
              }}
            >
              {obs.type === 'bird' ? (frameRef.current % 10 < 5 ? '🦅' : '🦆') : (obs.width > 30 ? '🌵🌵' : '🌵')}
            </div>
          ))}

          {/* Speed indicator */}
          {speed >8 && (<div className="absolute top-2 left-2 text-xs text-red-500 font-bold animate-pulse">⚡ FAST MODE</div>
          )}

          {/* Start message */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`px-6 py-3 rounded-xl font-bold ${
                darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-800'
              }`}>{t('auto.learning.s519_tap_or_press_space_to_start', 'Tap or Press Space to Start!')}</div>
            </div>
          )}
        </div>
      </div>

      {/* Milestone markers */}
      {score >0 && (<div className={`mt-2 flex gap-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {[500, 1000, 2000, 5000].map(milestone => (
            <span key={milestone} className={score >= milestone ? 'text-emerald-500' : ''}>
              {score >= milestone ? '✓' : '○'} {milestone}
            </span>
          ))}
        </div>
      )}

      {/* Mobile controls */}
      <div className="flex gap-4 mt-4">
        <button
          onTouchStart={() => jump()}
          onClick={() => jump()}
          className={`px-8 py-4 rounded-xl font-bold text-xl ${
            darkMode ? 'bg-gray-700 text-white active:bg-gray-600' : 'bg-gray-200 text-gray-700 active:bg-gray-300'
          }`}
        >⬆️ Jump</button>
        <button
          onTouchStart={() => duck(true)}
          onTouchEnd={() => duck(false)}
          onMouseDown={() => duck(true)}
          onMouseUp={() => duck(false)}
          onMouseLeave={() => duck(false)}
          className={`px-8 py-4 rounded-xl font-bold text-xl ${
            darkMode ? 'bg-gray-700 text-white active:bg-gray-600' : 'bg-gray-200 text-gray-700 active:bg-gray-300'
          }`}
        >⬇️ Duck</button>
      </div>

      <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Space/↑ = Jump | ↓ = Duck | Avoid obstacles! 🌵🦅
      </p>
    </div>
  );
}
