import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef } from 'react';

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 54;
const BRICK_HEIGHT = 18;
const BRICK_GAP = 4;
const BRICK_OFFSET_TOP = 40;
const BRICK_OFFSET_LEFT = 12;

const BRICK_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
];

type PowerUpType = 'wide' | 'multi' | 'laser' | 'slow' | 'life';

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points: number;
  visible: boolean;
  hasPowerUp?: PowerUpType;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface PowerUp {
  x: number;
  y: number;
  type: PowerUpType;
  width: number;
  height: number;
}

interface Laser {
  x: number;
  y: number;
}

const POWER_UP_CONFIG: Record<PowerUpType, { emoji: string; color: string; duration?: number }> = {
  wide: { emoji: '↔️', color: 'bg-blue-400', duration: 10000 },
  multi: { emoji: '⚪', color: 'bg-purple-400' },
  laser: { emoji: '🔫', color: 'bg-red-400', duration: 8000 },
  slow: { emoji: '🐢', color: 'bg-green-400', duration: 6000 },
  life: { emoji: '❤️', color: 'bg-pink-400' },
};

// Load high score
function loadHighScore(): number {
  try {
    return parseInt(localStorage.getItem('breakout-highscore') || '0', 10);
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem('breakout-highscore', score.toString());
  } catch {
    // Ignore
  }
}

interface Props { darkMode: boolean; }

export default function Breakout({ darkMode }: Props) {
  const { t } = useTranslation();
  const [paddleX, setPaddleX] = useState(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [paddleWidth, setPaddleWidth] = useState(PADDLE_WIDTH);
  const [balls, setBalls] = useState<Ball[]>([{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 4, dy: -4 }]);
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [lasers, setLasers] = useState<Laser[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(loadHighScore);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [level, setLevel] = useState(1);
  const [hasLaser, setHasLaser] = useState(false);
  const [activePowerUps, setActivePowerUps] = useState<Set<PowerUpType>>(new Set());
  
  const gameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const powerUpTimers = useRef<Map<PowerUpType, number>>(new Map());

  const initBricks = useCallback((lvl: number) => {
    const newBricks: Brick[] = [];
    const rows = Math.min(BRICK_ROWS + Math.floor(lvl / 2), 8);
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        // Random power-up chance (15%)
        let powerUp: PowerUpType | undefined;
        if (Math.random() < 0.15) {
          const types: PowerUpType[] = ['wide', 'multi', 'laser', 'slow', 'life'];
          powerUp = types[Math.floor(Math.random() * types.length)];
        }
        
        newBricks.push({
          x: BRICK_OFFSET_LEFT + c * (BRICK_WIDTH + BRICK_GAP),
          y: BRICK_OFFSET_TOP + r * (BRICK_HEIGHT + BRICK_GAP),
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: BRICK_COLORS[r % BRICK_COLORS.length],
          points: (rows - r) * 10,
          visible: true,
          hasPowerUp: powerUp,
        });
      }
    }
    return newBricks;
  }, []);

  const resetBall = useCallback(() => {
    setBalls([{
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 50,
      dx: (Math.random() > 0.5 ? 1 : -1) * (3 + level * 0.5),
      dy: -(3 + level * 0.5),
    }]);
  }, [level]);

  const startGame = useCallback(() => {
    // Clear power-up timers
    powerUpTimers.current.forEach(timer => clearTimeout(timer));
    powerUpTimers.current.clear();
    
    setBricks(initBricks(1));
    setPaddleX(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
    setPaddleWidth(PADDLE_WIDTH);
    resetBall();
    setPowerUps([]);
    setLasers([]);
    setScore(0);
    setLives(3);
    setLevel(1);
    setIsPlaying(true);
    setGameOver(false);
    setWon(false);
    setHasLaser(false);
    setActivePowerUps(new Set());
  }, [initBricks, resetBall]);

  const nextLevel = useCallback(() => {
    const newLevel = level + 1;
    setLevel(newLevel);
    setBricks(initBricks(newLevel));
    resetBall();
    setPowerUps([]);
    setLasers([]);
    setHasLaser(false);
    setPaddleWidth(PADDLE_WIDTH);
    setActivePowerUps(new Set());
    powerUpTimers.current.forEach(timer => clearTimeout(timer));
    powerUpTimers.current.clear();
  }, [level, initBricks, resetBall]);

  const applyPowerUp = useCallback((type: PowerUpType) => {
    switch (type) {
      case 'wide':
        setPaddleWidth(PADDLE_WIDTH * 1.5);
        setActivePowerUps(prev => new Set([...prev, 'wide']));
        const wideTimer = window.setTimeout(() => {
          setPaddleWidth(PADDLE_WIDTH);
          setActivePowerUps(prev => {
            const next = new Set(prev);
            next.delete('wide');
            return next;
          });
        }, POWER_UP_CONFIG.wide.duration!);
        powerUpTimers.current.set('wide', wideTimer);
        break;
        
      case 'multi':
        setBalls(prev => {
          if (prev.length >= 5) return prev; // Max 5 balls
          const newBalls: Ball[] = [];
          prev.forEach(ball => {
            newBalls.push(ball);
            newBalls.push({ ...ball, dx: ball.dx + 2, dy: ball.dy - 1 });
            newBalls.push({ ...ball, dx: ball.dx - 2, dy: ball.dy - 1 });
          });
          return newBalls.slice(0, 5);
        });
        break;
        
      case 'laser':
        setHasLaser(true);
        setActivePowerUps(prev => new Set([...prev, 'laser']));
        const laserTimer = window.setTimeout(() => {
          setHasLaser(false);
          setActivePowerUps(prev => {
            const next = new Set(prev);
            next.delete('laser');
            return next;
          });
        }, POWER_UP_CONFIG.laser.duration!);
        powerUpTimers.current.set('laser', laserTimer);
        break;
        
      case 'slow':
        setBalls(prev => prev.map(ball => ({
          ...ball,
          dx: ball.dx * 0.7,
          dy: ball.dy * 0.7,
        })));
        setActivePowerUps(prev => new Set([...prev, 'slow']));
        const slowTimer = window.setTimeout(() => {
          setBalls(prev => prev.map(ball => ({
            ...ball,
            dx: ball.dx / 0.7,
            dy: ball.dy / 0.7,
          })));
          setActivePowerUps(prev => {
            const next = new Set(prev);
            next.delete('slow');
            return next;
          });
        }, POWER_UP_CONFIG.slow.duration!);
        powerUpTimers.current.set('slow', slowTimer);
        break;
        
      case 'life':
        setLives(l => Math.min(l + 1, 5));
        break;
    }
  }, []);

  // Shoot laser
  const shootLaser = useCallback(() => {
    if (!hasLaser || !isPlaying) return;
    setLasers(prev => [...prev, { x: paddleX + paddleWidth / 2, y: CANVAS_HEIGHT - PADDLE_HEIGHT - 15 }]);
  }, [hasLaser, isPlaying, paddleX, paddleWidth]);

  // Mouse/touch control
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (clientX: number) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const scale = CANVAS_WIDTH / rect.width;
      setPaddleX(Math.max(0, Math.min(CANVAS_WIDTH - paddleWidth, x * scale - paddleWidth / 2)));
    };

    const handleMouse = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };
    const handleClick = () => shootLaser();

    container.addEventListener('mousemove', handleMouse);
    container.addEventListener('touchmove', handleTouch, { passive: false });
    container.addEventListener('touchstart', handleTouch, { passive: false });
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('mousemove', handleMouse);
      container.removeEventListener('touchmove', handleTouch);
      container.removeEventListener('touchstart', handleTouch);
      container.removeEventListener('click', handleClick);
    };
  }, [paddleWidth, shootLaser]);

  // Keyboard control
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setPaddleX(x => Math.max(0, x - 30));
      } else if (e.key === 'ArrowRight') {
        setPaddleX(x => Math.min(CANVAS_WIDTH - paddleWidth, x + 30));
      } else if (e.key === ' ') {
        e.preventDefault();
        shootLaser();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [paddleWidth, shootLaser]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver || won) return;

    const loop = () => {
      // Update balls
      setBalls(prevBalls => {
        let newBalls = prevBalls.map(ball => {
          let { x, y, dx, dy } = ball;
          x += dx;
          y += dy;

          // Wall collision
          if (x <= BALL_RADIUS || x >= CANVAS_WIDTH - BALL_RADIUS) {
            dx = -dx;
            x = Math.max(BALL_RADIUS, Math.min(CANVAS_WIDTH - BALL_RADIUS, x));
          }
          if (y <= BALL_RADIUS) {
            dy = Math.abs(dy);
            y = BALL_RADIUS;
          }

          // Paddle collision
          const paddleTop = CANVAS_HEIGHT - PADDLE_HEIGHT - 10;
          if (
            y >= paddleTop - BALL_RADIUS &&
            y<= paddleTop + PADDLE_HEIGHT &&
            x >= paddleX - BALL_RADIUS &&
            x<= paddleX + paddleWidth + BALL_RADIUS
          ) {
            dy = -Math.abs(dy) * 1.02;
            const hitPos = (x - paddleX) / paddleWidth;
            dx = (hitPos - 0.5) * 8;
            y = paddleTop - BALL_RADIUS;
          }

          return { x, y, dx, dy };
        });

        // Remove balls that fell
        const activeBalls = newBalls.filter(ball =>ball.y< CANVAS_HEIGHT - BALL_RADIUS);
        
        if (activeBalls.length === 0) {
          setLives(l => {
            if (l <= 1) {
              setGameOver(true);
              setIsPlaying(false);
              return 0;
            }
            resetBall();
            return l - 1;
          });
          return [{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 4, dy: -4 }];
        }

        return activeBalls;
      });

      // Update power-ups
      setPowerUps(prev => {
        const updated = prev.map(p => ({ ...p, y: p.y + 2 }));
        return updated.filter(p => {
          // Check paddle collision
          if (
            p.y + p.height >= CANVAS_HEIGHT - PADDLE_HEIGHT - 10 &&
            p.y<= CANVAS_HEIGHT &&
            p.x + p.width >= paddleX &&
            p.x<= paddleX + paddleWidth
          ) {
            applyPowerUp(p.type);
            return false;
          }
          return p.y < CANVAS_HEIGHT;
        });
      });

      // Update lasers
      setLasers(prev => {
        return prev.map(l => ({ ...l, y: l.y - 10 })).filter(l => l.y > 0);
      });

      // Brick collision (balls)
      setBricks(prevBricks => {
        let scoreToAdd = 0;
        const newPowerUps: PowerUp[] = [];
        
        const updated = prevBricks.map(brick => {
          if (!brick.visible) return brick;

          // Check ball collision
          for (const ball of balls) {
            if (
              ball.x >= brick.x - BALL_RADIUS &&
              ball.x<= brick.x + brick.width + BALL_RADIUS &&
              ball.y >= brick.y - BALL_RADIUS &&
              ball.y<= brick.y + brick.height + BALL_RADIUS
            ) {
              scoreToAdd += brick.points;
              
              if (brick.hasPowerUp) {
                newPowerUps.push({
                  x: brick.x + brick.width / 2 - 12,
                  y: brick.y,
                  type: brick.hasPowerUp,
                  width: 24,
                  height: 24,
                });
              }

              // Bounce
              const overlapLeft = ball.x + BALL_RADIUS - brick.x;
              const overlapRight = brick.x + brick.width - (ball.x - BALL_RADIUS);
              const overlapTop = ball.y + BALL_RADIUS - brick.y;
              const overlapBottom = brick.y + brick.height - (ball.y - BALL_RADIUS);
              const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

              setBalls(prev => prev.map(b => {
                if (b === ball) {
                  if (minOverlap === overlapTop || minOverlap === overlapBottom) {
                    return { ...b, dy: -b.dy };
                  } else {
                    return { ...b, dx: -b.dx };
                  }
                }
                return b;
              }));

              return { ...brick, visible: false };
            }
          }

          // Check laser collision
          for (const laser of lasers) {
            if (
              laser.x >= brick.x &&
              laser.x<= brick.x + brick.width &&
              laser.y >= brick.y &&
              laser.y<= brick.y + brick.height
            ) {
              scoreToAdd += brick.points;
              
              if (brick.hasPowerUp) {
                newPowerUps.push({
                  x: brick.x + brick.width / 2 - 12,
                  y: brick.y,
                  type: brick.hasPowerUp,
                  width: 24,
                  height: 24,
                });
              }

              setLasers(prev => prev.filter(l => l !== laser));
              return { ...brick, visible: false };
            }
          }

          return brick;
        });

        if (scoreToAdd > 0) {
          setScore(s => {
            const newScore = s + scoreToAdd;
            if (newScore > highScore) {
              setHighScore(newScore);
              saveHighScore(newScore);
            }
            return newScore;
          });
        }

        if (newPowerUps.length > 0) {
          setPowerUps(prev => [...prev, ...newPowerUps]);
        }

        if (updated.every(b => !b.visible)) {
          setWon(true);
          setIsPlaying(false);
        }

        return updated;
      });

      gameRef.current = requestAnimationFrame(loop);
    };

    gameRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameRef.current) cancelAnimationFrame(gameRef.current);
    };
  }, [isPlaying, gameOver, won, balls, paddleX, paddleWidth, lasers, resetBall, applyPowerUp, highScore]);

  const scale = Math.min(1, (typeof window !== 'undefined' ? window.innerWidth - 32 : CANVAS_WIDTH) / CANVAS_WIDTH);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      {/* Stats */}
      <div className={`flex gap-4 mb-2 text-sm font-bold flex-wrap justify-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span>🎯 {score}</span>
        <span>🏆 {highScore}</span>
        <span>❤️ {'❤️'.repeat(lives)}</span>
        <span>⚡ Lv.{level}</span>
        <span>⚪ ×{balls.length}</span>
      </div>

      {/* Active power-ups */}
      {activePowerUps.size >0 && (<div className="flex gap-2 mb-2">
          {Array.from(activePowerUps).map(type => (
            <span key={type} className={`px-2 py-1 rounded text-xs ${POWER_UP_CONFIG[type].color} text-white`}>
              {POWER_UP_CONFIG[type].emoji} {type}
            </span>
          ))}
        </div>
      )}

      {(gameOver || won) && (
        <div className={`mb-4 px-6 py-3 rounded-xl font-bold text-lg shadow-lg ${
          won ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        }`}>
          {won ? `🎉 Level ${level} Complete! Score: ${score}` : `💀 Game Over! Score: ${score}`}
        </div>
      )}

      {/* Game area */}
      <div
        ref={containerRef}
        className={`relative rounded-xl overflow-hidden cursor-none ${
          darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-indigo-900 to-purple-900'
        }`}
        style={{ 
          width: CANVAS_WIDTH * scale, 
          height: CANVAS_HEIGHT * scale,
        }}
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
          {/* Bricks */}
          {bricks.map((brick, i) =>(
            brick.visible && (<div
                key={i}
                className={`absolute rounded-sm ${brick.color} shadow-md flex items-center justify-center`}
                style={{
                  left: brick.x,
                  top: brick.y,
                  width: brick.width,
                  height: brick.height,
                }}
              >
                {brick.hasPowerUp && (
                  <span className="text-xs">{POWER_UP_CONFIG[brick.hasPowerUp].emoji}</span>
                )}
              </div>
            )
          ))}

          {/* Power-ups */}
          {powerUps.map((p, i) => (
            <div
              key={`powerup-${i}`}
              className={`absolute rounded-lg ${POWER_UP_CONFIG[p.type].color} flex items-center justify-center shadow-lg animate-pulse`}
              style={{
                left: p.x,
                top: p.y,
                width: p.width,
                height: p.height,
              }}
            >
              <span className="text-sm">{POWER_UP_CONFIG[p.type].emoji}</span>
            </div>
          ))}

          {/* Lasers */}
          {lasers.map((l, i) => (
            <div
              key={`laser-${i}`}
              className="absolute bg-red-500 rounded"
              style={{
                left: l.x - 2,
                top: l.y,
                width: 4,
                height: 15,
                boxShadow: '0 0 8px red',
              }}
            />
          ))}

          {/* Balls */}
          {balls.map((ball, i) => (
            <div
              key={`ball-${i}`}
              className="absolute bg-white rounded-full shadow-lg"
              style={{
                left: ball.x - BALL_RADIUS,
                top: ball.y - BALL_RADIUS,
                width: BALL_RADIUS * 2,
                height: BALL_RADIUS * 2,
                boxShadow: '0 0 10px rgba(255,255,255,0.5)',
              }}
            />
          ))}

          {/* Paddle */}
          <div
            className={`absolute rounded-lg transition-none ${hasLaser ? 'bg-gradient-to-b from-red-400 to-red-600' : 'bg-gradient-to-b from-gray-200 to-gray-400'}`}
            style={{
              left: paddleX,
              top: CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
              width: paddleWidth,
              height: PADDLE_HEIGHT,
            }}
          >
            {hasLaser && (
              <>
                <div className="absolute -top-2 left-2 w-2 h-2 bg-red-500 rounded" />
                <div className="absolute -top-2 right-2 w-2 h-2 bg-red-500 rounded" />
              </>
            )}
          </div>

          {/* Start overlay */}
          {!isPlaying && !gameOver && !won && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-center">
                <h3 className="text-2xl font-bold mb-2">{t('auto.breakout.title', '💥 Breakout')}</h3>
                <p className="text-sm opacity-80">{t('auto.learning.s514_catch_powerups_for_special_abilities', 'Catch power-ups for special abilities!')}</p>
                <div className="flex gap-2 justify-center mt-2 text-xs">
                  <span>{t('auto.breakout.wide', '↔️ Wide')}</span>
                  <span>{t('auto.breakout.multi', '⚪ Multi')}</span>
                  <span>{t('auto.breakout.laser', '🔫 Laser')}</span>
                  <span>{t('auto.breakout.slow', '🐢 Slow')}</span>
                  <span>{t('auto.breakout.life', '❤️ Life')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {won ? (
          <button onClick={nextLevel} className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold shadow-md">{t('auto.breakout.next_level', '➡️ Next Level')}</button>
        ) : null}
        <button 
          onClick={startGame} 
          disabled={isPlaying && !gameOver && !won}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold shadow-md disabled:opacity-50"
        >
          {gameOver ? t('auto.breakout.restart', '🔄 Restart') : isPlaying ? t('auto.breakout.playing', '🎮 Playing...') : t('auto.breakout.start', '▶️ Start')}
        </button>
      </div>

      <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {t('auto.breakout.controls', 'Move: mouse/touch/← → | Space/Click: Shoot laser (when active)')}
      </p>
    </div>
  );
}
