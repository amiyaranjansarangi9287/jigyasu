import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef } from 'react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PADDLE_SPEED = 8;
const WINNING_SCORE = 7;

type Mode = 'ai' | 'pvp';
type Difficulty = 'easy' | 'normal' | 'hard';
type PowerUpType = 'speed' | 'big' | 'small' | 'multi';

interface PowerUp {
  x: number;
  y: number;
  type: PowerUpType;
  forPlayer: 'left' | 'right';
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const AI_SPEED: Record<Difficulty, number> = {
  easy: 3,
  normal: 5,
  hard: 7,
};

const POWER_UP_CONFIG: Record<PowerUpType, { emoji: string; color: string; effect: string }> = {
  speed: { emoji: '⚡', color: 'bg-yellow-400', effect: 'Speed boost' },
  big: { emoji: '📏', color: 'bg-green-400', effect: 'Bigger paddle' },
  small: { emoji: '📍', color: 'bg-red-400', effect: 'Shrink opponent' },
  multi: { emoji: '🔮', color: 'bg-purple-400', effect: 'Multi-ball' },
};

// Load high score
function loadStats(): { wins: number; losses: number } {
  try {
    const data = localStorage.getItem('pong-stats');
    return data ? JSON.parse(data) : { wins: 0, losses: 0 };
  } catch {
    return { wins: 0, losses: 0 };
  }
}

function saveStats(stats: { wins: number; losses: number }) {
  try {
    localStorage.setItem('pong-stats', JSON.stringify(stats));
  } catch {
    // Ignore
  }
}

interface Props { darkMode: boolean; }

export default function Pong({ darkMode }: Props) {
  const { t } = useTranslation();
  const [leftY, setLeftY] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [rightY, setRightY] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [leftHeight, setLeftHeight] = useState(PADDLE_HEIGHT);
  const [rightHeight, setRightHeight] = useState(PADDLE_HEIGHT);
  const [balls, setBalls] = useState<Ball[]>([{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 5, dy: 3 }]);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'left' | 'right' | null>(null);
  const [mode, setMode] = useState<Mode>('ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [rally, setRally] = useState(0);
  const [maxRally, setMaxRally] = useState(0);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [stats, setStats] = useState(loadStats);
  const [showPowerUp, setShowPowerUp] = useState<{ text: string; side: 'left' | 'right' } | null>(null);
  
  const gameRef = useRef<number | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const powerUpTimers = useRef<Map<string, number>>(new Map());

  const resetBall = useCallback((direction: number = 1) => {
    setBalls([{
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: direction * (4 + Math.random() * 2),
      dy: (Math.random() - 0.5) * 6,
    }]);
    setRally(0);
  }, []);

  const spawnPowerUp = useCallback(() => {
    if (powerUps.length >= 2) return;
    if (Math.random() > 0.3) return; // 30% chance
    
    const types: PowerUpType[] = ['speed', 'big', 'small', 'multi'];
    const type = types[Math.floor(Math.random() * types.length)];
    const forPlayer = Math.random() > 0.5 ? 'left' : 'right';
    
    setPowerUps(prev => [...prev, {
      x: CANVAS_WIDTH / 4 + Math.random() * (CANVAS_WIDTH / 2),
      y: 50 + Math.random() * (CANVAS_HEIGHT - 100),
      type,
      forPlayer,
    }]);
  }, [powerUps.length]);

  const applyPowerUp = useCallback((type: PowerUpType, side: 'left' | 'right') => {
    const opponent = side === 'left' ? 'right' : 'left';
    
    setShowPowerUp({ text: `${POWER_UP_CONFIG[type].emoji} ${POWER_UP_CONFIG[type].effect}`, side });
    setTimeout(() => setShowPowerUp(null), 1500);
    
    switch (type) {
      case 'speed':
        // Ball speeds up
        setBalls(prev => prev.map(b => ({
          ...b,
          dx: b.dx * 1.3,
          dy: b.dy * 1.3,
        })));
        break;
        
      case 'big':
        // Make own paddle bigger
        if (side === 'left') {
          setLeftHeight(PADDLE_HEIGHT * 1.5);
          const timer = window.setTimeout(() => setLeftHeight(PADDLE_HEIGHT), 10000);
          powerUpTimers.current.set('leftBig', timer);
        } else {
          setRightHeight(PADDLE_HEIGHT * 1.5);
          const timer = window.setTimeout(() => setRightHeight(PADDLE_HEIGHT), 10000);
          powerUpTimers.current.set('rightBig', timer);
        }
        break;
        
      case 'small':
        // Shrink opponent paddle
        if (opponent === 'left') {
          setLeftHeight(PADDLE_HEIGHT * 0.6);
          const timer = window.setTimeout(() => setLeftHeight(PADDLE_HEIGHT), 8000);
          powerUpTimers.current.set('leftSmall', timer);
        } else {
          setRightHeight(PADDLE_HEIGHT * 0.6);
          const timer = window.setTimeout(() => setRightHeight(PADDLE_HEIGHT), 8000);
          powerUpTimers.current.set('rightSmall', timer);
        }
        break;
        
      case 'multi':
        // Add extra ball
        setBalls(prev => {
          if (prev.length >= 3) return prev;
          const firstBall = prev[0];
          return [...prev, {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            dx: -firstBall.dx,
            dy: (Math.random() - 0.5) * 8,
          }];
        });
        break;
    }
  }, []);

  const startGame = useCallback(() => {
    // Clear power-up timers
    powerUpTimers.current.forEach(timer => clearTimeout(timer));
    powerUpTimers.current.clear();
    
    setLeftY(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setRightY(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setLeftHeight(PADDLE_HEIGHT);
    setRightHeight(PADDLE_HEIGHT);
    setLeftScore(0);
    setRightScore(0);
    setIsPlaying(true);
    setGameOver(false);
    setWinner(null);
    setRally(0);
    setMaxRally(0);
    setPowerUps([]);
    resetBall(Math.random() > 0.5 ? 1 : -1);
  }, [resetBall]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (['ArrowUp', 'ArrowDown', 'KeyW', 'KeyS'].includes(e.code)) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const loop = () => {
      // Handle paddle movement
      const keys = keysRef.current;
      
      // Left paddle (W/S)
      if (keys.has('KeyW')) setLeftY(y => Math.max(0, y - PADDLE_SPEED));
      if (keys.has('KeyS')) setLeftY(y => Math.min(CANVAS_HEIGHT - leftHeight, y + PADDLE_SPEED));
      
      // Right paddle (Arrow keys) - only in PvP mode
      if (mode === 'pvp') {
        if (keys.has('ArrowUp')) setRightY(y => Math.max(0, y - PADDLE_SPEED));
        if (keys.has('ArrowDown')) setRightY(y => Math.min(CANVAS_HEIGHT - rightHeight, y + PADDLE_SPEED));
      }

      // AI control for right paddle
      if (mode === 'ai') {
        setRightY(y => {
          const paddleCenter = y + rightHeight / 2;
          const aiSpeed = AI_SPEED[difficulty];
          const targetBall = balls.reduce((closest, ball) => 
            ball.dx > 0 && ball.x > closest.x ? ball : closest, balls[0]);
          const reactionZone = difficulty === 'easy' ? 30 : difficulty === 'normal' ? 15 : 5;
          
          if (targetBall.x > CANVAS_WIDTH / 3) {
            if (paddleCenter < targetBall.y - reactionZone) {
              return Math.min(CANVAS_HEIGHT - rightHeight, y + aiSpeed);
            } else if (paddleCenter > targetBall.y + reactionZone) {
              return Math.max(0, y - aiSpeed);
            }
          }
          return y;
        });
      }

      // Ball movement
      setBalls(prevBalls => {
        let scored: 'left' | 'right' | null = null;
        
        const newBalls = prevBalls.map(ball => {
          let { x, y, dx, dy } = ball;
          x += dx;
          y += dy;
          
          // Top/bottom walls
          if (y <= BALL_SIZE / 2 || y >= CANVAS_HEIGHT - BALL_SIZE / 2) {
            dy = -dy;
            y = Math.max(BALL_SIZE / 2, Math.min(CANVAS_HEIGHT - BALL_SIZE / 2, y));
          }
          
          // Left paddle collision
          if (x <= PADDLE_WIDTH + BALL_SIZE / 2 && 
              y >= leftY && 
              y<= leftY + leftHeight) {
            dx = Math.abs(dx) * 1.03;
            dy = dy + (y - (leftY + leftHeight / 2)) * 0.1;
            setRally(r => {
              const newRally = r + 1;
              setMaxRally(m => Math.max(m, newRally));
              if (newRally % 5 === 0) spawnPowerUp();
              return newRally;
            });
            x = PADDLE_WIDTH + BALL_SIZE / 2 + 1;
          }
          
          // Right paddle collision
          if (x >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE / 2 && 
              y >= rightY && 
              y<= rightY + rightHeight) {
            dx = -Math.abs(dx) * 1.03;
            dy = dy + (y - (rightY + rightHeight / 2)) * 0.1;
            setRally(r => {
              const newRally = r + 1;
              setMaxRally(m => Math.max(m, newRally));
              if (newRally % 5 === 0) spawnPowerUp();
              return newRally;
            });
            x = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE / 2 - 1;
          }
          
          // Score detection
          if (x < 0) scored = 'right';
          if (x > CANVAS_WIDTH) scored = 'left';
          
          return { x, y, dx, dy };
        }).filter(ball =>ball.x > 0 && ball.x< CANVAS_WIDTH);

        // Handle scoring
        if (scored) {
          if (scored === 'right') {
            setRightScore(s => {
              const newScore = s + 1;
              if (newScore >= WINNING_SCORE) {
                setGameOver(true);
                setIsPlaying(false);
                setWinner('right');
                if (mode === 'ai') {
                  setStats(prev => {
                    const newStats = { ...prev, losses: prev.losses + 1 };
                    saveStats(newStats);
                    return newStats;
                  });
                }
              } else {
                setTimeout(() => resetBall(-1), 500);
              }
              return newScore;
            });
          } else {
            setLeftScore(s => {
              const newScore = s + 1;
              if (newScore >= WINNING_SCORE) {
                setGameOver(true);
                setIsPlaying(false);
                setWinner('left');
                if (mode === 'ai') {
                  setStats(prev => {
                    const newStats = { ...prev, wins: prev.wins + 1 };
                    saveStats(newStats);
                    return newStats;
                  });
                }
              } else {
                setTimeout(() => resetBall(1), 500);
              }
              return newScore;
            });
          }
          setPowerUps([]);
          return [{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 0, dy: 0 }];
        }

        // Keep at least one ball
        return newBalls.length > 0 ? newBalls : [{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 4, dy: 3 }];
      });

      // Power-up collision
      setPowerUps(prev => prev.filter(powerUp => {
        for (const ball of balls) {
          const dist = Math.sqrt((ball.x - powerUp.x) ** 2 + (ball.y - powerUp.y) ** 2);
          if (dist < 25) {
            applyPowerUp(powerUp.type, powerUp.forPlayer);
            return false;
          }
        }
        return true;
      }));

      gameRef.current = requestAnimationFrame(loop);
    };

    gameRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameRef.current) cancelAnimationFrame(gameRef.current);
    };
  }, [isPlaying, gameOver, balls, leftY, rightY, leftHeight, rightHeight, mode, difficulty, resetBall, spawnPowerUp, applyPowerUp]);

  const scale = Math.min(1, (typeof window !== 'undefined' ? window.innerWidth - 32 : CANVAS_WIDTH) / CANVAS_WIDTH);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Mode & Difficulty */}
      <div className="flex gap-2 mb-3 flex-wrap justify-center">
        <button
          onClick={() => setMode('ai')}
          disabled={isPlaying}
          className={`px-3 py-1.5 rounded-lg font-semibold text-xs disabled:opacity-50 ${
            mode === 'ai'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
              : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}
        >🤖 vs AI</button>
        <button
          onClick={() => setMode('pvp')}
          disabled={isPlaying}
          className={`px-3 py-1.5 rounded-lg font-semibold text-xs disabled:opacity-50 ${
            mode === 'pvp'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
              : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}
        >👥 2 Players</button>
        {mode === 'ai' && (
          <>
            <span className={`px-2 flex items-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>|</span>
            {(['easy', 'normal', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                disabled={isPlaying}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs disabled:opacity-50 ${
                  difficulty === d
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Stats */}
      {mode === 'ai' && (
        <div className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Record: {stats.wins}W - {stats.losses}L
        </div>
      )}

      {/* Score */}
      <div className={`flex gap-8 mb-4 text-4xl font-mono font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <span className="text-blue-500">{leftScore}</span>
        <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>-</span>
        <span className="text-red-500">{rightScore}</span>
      </div>

      {rally >3 && isPlaying && (<div className="mb-2 text-orange-500 font-bold animate-pulse">
          🔥 Rally: {rally} {balls.length > 1 && `| ⚪×${balls.length}`}
        </div>
      )}

      {gameOver && winner && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg shadow-lg animate-bounce">
          🎉 {winner === 'left' ? (mode === 'ai' ? 'You Win!' : 'Player 1 Wins!') : (mode === 'ai' ? 'AI Wins!' : 'Player 2 Wins!')}
          {maxRally > 5 && ` | Best Rally: ${maxRally}`}
        </div>
      )}

      {/* Game area */}
      <div
        className={`relative rounded-xl overflow-hidden ${
          darkMode ? 'bg-gray-900' : 'bg-gray-800'
        }`}
        style={{ width: CANVAS_WIDTH * scale, height: CANVAS_HEIGHT * scale }}
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 border-l-2 border-dashed border-gray-600" />

          {/* Power-up effect indicators */}
          {showPowerUp && (
            <div className={`absolute top-1/2 transform -translate-y-1/2 px-3 py-1 rounded bg-black/70 text-white text-sm font-bold animate-pulse ${
              showPowerUp.side === 'left' ? 'left-20' : 'right-20'
            }`}>
              {showPowerUp.text}
            </div>
          )}

          {/* Power-ups */}
          {powerUps.map((powerUp, i) => (
            <div
              key={i}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-lg animate-bounce ${POWER_UP_CONFIG[powerUp.type].color}`}
              style={{ left: powerUp.x - 16, top: powerUp.y - 16 }}
            >
              {POWER_UP_CONFIG[powerUp.type].emoji}
            </div>
          ))}

          {/* Left paddle */}
          <div
            className="absolute bg-blue-500 rounded-r-lg transition-none"
            style={{
              left: 0,
              top: leftY,
              width: PADDLE_WIDTH,
              height: leftHeight,
            }}
          />

          {/* Right paddle */}
          <div
            className="absolute bg-red-500 rounded-l-lg transition-none"
            style={{
              right: 0,
              top: rightY,
              width: PADDLE_WIDTH,
              height: rightHeight,
            }}
          />

          {/* Balls */}
          {balls.map((ball, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full shadow-lg transition-none"
              style={{
                left: ball.x - BALL_SIZE / 2,
                top: ball.y - BALL_SIZE / 2,
                width: BALL_SIZE,
                height: BALL_SIZE,
                boxShadow: '0 0 15px rgba(255,255,255,0.8)',
              }}
            />
          ))}

          {/* Start overlay */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-center">
                <h3 className="text-2xl font-bold mb-2">{t('auto.pong.title', '🏓 Pong')}</h3>
                <p className="text-sm opacity-80">
                  {mode === 'pvp' ? t('auto.pong.controls_pvp', 'P1: W/S | P2: ↑/↓') : t('auto.pong.controls_ai', 'Use W/S to move')}
                </p>
                <p className="text-xs opacity-60 mt-1">{t('auto.learning.s526_rally_to_spawn_powerups', 'Rally to spawn power-ups!')}</p>
                <div className="flex gap-2 justify-center mt-2 text-xs">
                  {Object.entries(POWER_UP_CONFIG).map(([key, { emoji, effect }]) => (
                    <span key={key}>{emoji} {t(`auto.pong.powerup_${key}`, effect)}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile controls */}
      <div className="flex justify-between w-full mt-4 px-4">
        <div className="flex flex-col gap-2">
          <button
            onTouchStart={() => keysRef.current.add('KeyW')}
            onTouchEnd={() => keysRef.current.delete('KeyW')}
            onMouseDown={() => keysRef.current.add('KeyW')}
            onMouseUp={() => keysRef.current.delete('KeyW')}
            className="p-4 bg-blue-500 text-white rounded-lg font-bold"
          >
            ▲
          </button>
          <button
            onTouchStart={() => keysRef.current.add('KeyS')}
            onTouchEnd={() => keysRef.current.delete('KeyS')}
            onMouseDown={() => keysRef.current.add('KeyS')}
            onMouseUp={() => keysRef.current.delete('KeyS')}
            className="p-4 bg-blue-500 text-white rounded-lg font-bold"
          >
            ▼
          </button>
        </div>
        
        <button
          onClick={startGame}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold shadow-md self-center"
        >
          {gameOver ? t('auto.pong.rematch', '🔄 Rematch') : isPlaying ? t('auto.pong.playing', '🎮 Playing') : t('auto.pong.start', '▶️ Start')}
        </button>
        
        {mode === 'pvp' && (
          <div className="flex flex-col gap-2">
            <button
              onTouchStart={() => keysRef.current.add('ArrowUp')}
              onTouchEnd={() => keysRef.current.delete('ArrowUp')}
              onMouseDown={() => keysRef.current.add('ArrowUp')}
              onMouseUp={() => keysRef.current.delete('ArrowUp')}
              className="p-4 bg-red-500 text-white rounded-lg font-bold"
            >
              ▲
            </button>
            <button
              onTouchStart={() => keysRef.current.add('ArrowDown')}
              onTouchEnd={() => keysRef.current.delete('ArrowDown')}
              onMouseDown={() => keysRef.current.add('ArrowDown')}
              onMouseUp={() => keysRef.current.delete('ArrowDown')}
              className="p-4 bg-red-500 text-white rounded-lg font-bold"
            >
              ▼
            </button>
          </div>
        )}
      </div>

      <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {mode === 'pvp' ? t('auto.pong.footer_pvp', 'Player 1: W/S | Player 2: ↑/↓') : t('auto.pong.footer_ai', 'Use W/S or touch controls')} | {t('auto.pong.rally', 'Rally for power-ups!')}
      </p>
    </div>
  );
}
