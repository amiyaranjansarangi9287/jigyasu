import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef } from 'react';

const GRID = 20;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Point = { x: number; y: number };
type GameMode = 'classic' | 'wrap' | 'obstacles';
type Skin = 'green' | 'blue' | 'rainbow' | 'fire';
type Speed = 'slow' | 'normal' | 'fast' | 'insane';

const SPEED_VALUES: Record<Speed, number> = {
  slow: 200,
  normal: 150,
  fast: 100,
  insane: 60,
};

const SKINS: Record<Skin, { head: string; body: string[]; name: string; nameKey: string }> = {
  green: { head: '🟢', body: ['bg-emerald-500', 'bg-emerald-400'], name: 'Classic Green', nameKey: 'auto.snake.skin_green' },
  blue: { head: '🔵', body: ['bg-blue-500', 'bg-blue-400'], name: 'Ocean Blue', nameKey: 'auto.snake.skin_blue' },
  rainbow: { head: '🌈', body: ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'], name: 'Rainbow', nameKey: 'auto.snake.skin_rainbow' },
  fire: { head: '🔥', body: ['bg-red-600', 'bg-orange-500', 'bg-yellow-400'], name: 'Fire', nameKey: 'auto.snake.skin_fire' },
};

const FOODS = ['🍎', '🍕', '🍔', '🍩', '🍪', '🍇', '🍓', '⭐', '💎', '🌟'];

function randomFood(snake: Point[], obstacles: Point[]): Point {
  let food: Point;
  do {
    food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (
    snake.some(s => s.x === food.x && s.y === food.y) ||
    obstacles.some(o => o.x === food.x && o.y === food.y)
  );
  return food;
}

function generateObstacles(count: number, snake: Point[]): Point[] {
  const obstacles: Point[] = [];
  while (obstacles.length < count) {
    const obs = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    if (!snake.some(s => s.x === obs.x && s.y === obs.y) &&
        !obstacles.some(o =>o.x === obs.x && o.y === obs.y) &&
        !(obs.x >= 8 && obs.x<= 12 && obs.y >= 8 && obs.y<= 12)) { // Keep center clear
      obstacles.push(obs);
    }
  }
  return obstacles;
}

interface Props { darkMode: boolean; }

export default function Snake({ darkMode }: Props) {
  const { t } = useTranslation();
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [foodEmoji, setFoodEmoji] = useState('🍎');
  const [, setDirection] = useState<Direction>('RIGHT');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState<Speed>('normal');
  const [mode, setMode] = useState<GameMode>('classic');
  const [skin, setSkin] = useState<Skin>('green');
  const [obstacles, setObstacles] = useState<Point[]>([]);
  const [combo, setCombo] = useState(0);
  const [lastEatTime, setLastEatTime] = useState(0);
  
  const dirRef = useRef<Direction>('RIGHT');
  const gameRef = useRef<number | null>(null);

  const resetGame = useCallback(() => {
    const initial = [{ x: 10, y: 10 }];
    const obs = mode === 'obstacles' ? generateObstacles(15, initial) : [];
    setSnake(initial);
    setObstacles(obs);
    setFood(randomFood(initial, obs));
    setFoodEmoji(FOODS[Math.floor(Math.random() * FOODS.length)]);
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setCombo(0);
    if (gameRef.current) clearInterval(gameRef.current);
  }, [mode]);

  useEffect(() => {
    resetGame();
  }, [mode, resetGame]);

  const startGame = useCallback(() => {
    if (gameOver) resetGame();
    setIsPlaying(true);
  }, [gameOver, resetGame]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const tick = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        const dir = dirRef.current;

        switch (dir) {
          case 'UP': head.y--; break;
          case 'DOWN': head.y++; break;
          case 'LEFT': head.x--; break;
          case 'RIGHT': head.x++; break;
        }

        // Wrap mode
        if (mode === 'wrap') {
          if (head.x < 0) head.x = GRID - 1;
          if (head.x >= GRID) head.x = 0;
          if (head.y< 0) head.y = GRID - 1;
          if (head.y >= GRID) head.y = 0;
        } else {
          // Wall collision
          if (head.x < 0 || head.x >= GRID || head.y< 0 || head.y >= GRID) {
            setIsPlaying(false);
            setGameOver(true);
            setHighScore(prev => Math.max(prev, prevSnake.length - 1));
            return prevSnake;
          }
        }

        // Self collision
        if (prevSnake.some(s => s.x === head.x && s.y === head.y)) {
          setIsPlaying(false);
          setGameOver(true);
          setHighScore(prev => Math.max(prev, prevSnake.length - 1));
          return prevSnake;
        }

        // Obstacle collision
        if (obstacles.some(o => o.x === head.x && o.y === head.y)) {
          setIsPlaying(false);
          setGameOver(true);
          setHighScore(prev => Math.max(prev, prevSnake.length - 1));
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food collision
        setFood(prevFood => {
          if (head.x === prevFood.x && head.y === prevFood.y) {
            const now = Date.now();
            const timeDiff = now - lastEatTime;
            
            // Combo system - eat within 3 seconds
            if (timeDiff < 3000 && lastEatTime !== 0) {
              setCombo(c => c + 1);
              setScore(s => s + 1 + Math.min(combo, 5)); // Bonus for combo
            } else {
              setCombo(0);
              setScore(s => s + 1);
            }
            setLastEatTime(now);
            
            setFoodEmoji(FOODS[Math.floor(Math.random() * FOODS.length)]);
            return randomFood(newSnake, obstacles);
          } else {
            newSnake.pop();
            return prevFood;
          }
        });

        return newSnake;
      });
    };

    gameRef.current = window.setInterval(tick, SPEED_VALUES[speed]);
    return () => { if (gameRef.current) clearInterval(gameRef.current); };
  }, [isPlaying, gameOver, speed, mode, obstacles, combo, lastEatTime]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isPlaying && !gameOver && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        startGame();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          if (dirRef.current !== 'DOWN') { dirRef.current = 'UP'; setDirection('UP'); }
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          if (dirRef.current !== 'UP') { dirRef.current = 'DOWN'; setDirection('DOWN'); }
          break;
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          if (dirRef.current !== 'RIGHT') { dirRef.current = 'LEFT'; setDirection('LEFT'); }
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          if (dirRef.current !== 'LEFT') { dirRef.current = 'RIGHT'; setDirection('RIGHT'); }
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, gameOver, startGame]);

  const handleDirection = (dir: Direction) => {
    const opposites: Record<Direction, Direction> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (dirRef.current !== opposites[dir]) {
      dirRef.current = dir;
      setDirection(dir);
    }
    if (!isPlaying && !gameOver) startGame();
  };

  const getSkinColor = (index: number) => {
    const colors = SKINS[skin].body;
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Mode selector */}
      <div className="flex gap-2 mb-3 flex-wrap justify-center">
        {(['classic', 'wrap', 'obstacles'] as GameMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            disabled={isPlaying}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all disabled:opacity-50 ${
              mode === m
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {m === 'classic' ? t('auto.snake.classic', '🎮 Classic') : m === 'wrap' ? t('auto.snake.wrap', '🌀 Wrap') : t('auto.snake.obstacles', '🧱 Obstacles')}
          </button>
        ))}
      </div>

      {/* Speed & Skin */}
      <div className="flex gap-2 mb-3 flex-wrap justify-center">
        <select
          value={speed}
          onChange={(e) => setSpeed(e.target.value as Speed)}
          disabled={isPlaying}
          className={`px-3 py-1.5 rounded-lg font-semibold text-xs ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
          } disabled:opacity-50`}
        >
          <option value="slow">{t('auto.snake.slow', '🐢 Slow')}</option>
          <option value="normal">{t('auto.snake.normal', '🏃 Normal')}</option>
          <option value="fast">{t('auto.snake.fast', '🚀 Fast')}</option>
          <option value="insane">{t('auto.snake.insane', '⚡ Insane')}</option>
        </select>
        <select
          value={skin}
          onChange={(e) => setSkin(e.target.value as Skin)}
          className={`px-3 py-1.5 rounded-lg font-semibold text-xs ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {Object.entries(SKINS).map(([key, { name, nameKey }]) => (
            <option key={key} value={key}>{t(nameKey, name)}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className={`flex gap-4 mb-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span>🍎 Score: {score}</span>
        <span>🏆 Best: {highScore}</span>
        {combo >0 &&<span className="text-orange-500 animate-pulse">🔥 x{combo + 1}</span>}
      </div>

      {/* Game Over / Start */}
      {gameOver && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg">
          💀 Game Over! Score: {score}
        </div>
      )}

      {!isPlaying && !gameOver && (
        <div className={`mb-4 px-6 py-3 rounded-xl font-semibold ${
          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 shadow-sm'
        }`}>{t('auto.learning.s529_press_arrow_keys_or_tap_start', 'Press arrow keys or tap Start!')}</div>
      )}

      {/* Board */}
      <div
        className={`rounded-xl overflow-hidden shadow-2xl border-2 mb-4 ${
          darkMode ? 'border-gray-600 bg-gray-900' : 'border-gray-300 bg-gray-100'
        }`}
        style={{ width: `${GRID * 20 + 4}px`, height: `${GRID * 20 + 4}px`, padding: '2px' }}
      >
        <div className="relative w-full h-full">
          {/* Grid background */}
          {Array(GRID).fill(null).map((_, r) =>(
            Array(GRID).fill(null).map((_, c) => (<div
                key={`${r}-${c}`}
                className={`absolute ${(r + c) % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-green-100') : (darkMode ? 'bg-gray-850' : 'bg-green-50')}`}
                style={{
                  left: `${c * 20}px`,
                  top: `${r * 20}px`,
                  width: '20px',
                  height: '20px',
                }}
              />
            ))
          ))}

          {/* Obstacles */}
          {obstacles.map((obs, i) => (
            <div
              key={`obs-${i}`}
              className="absolute bg-gray-600 rounded-sm flex items-center justify-center text-xs"
              style={{
                left: `${obs.x * 20 + 1}px`,
                top: `${obs.y * 20 + 1}px`,
                width: '18px',
                height: '18px',
              }}
            >
              🧱
            </div>
          ))}

          {/* Snake */}
          {snake.map((seg, i) => (
            <div
              key={i}
              className={`absolute rounded-sm transition-all duration-75 ${
                i === 0 ? '' : getSkinColor(i)
              }`}
              style={{
                left: `${seg.x * 20 + 1}px`,
                top: `${seg.y * 20 + 1}px`,
                width: '18px',
                height: '18px',
              }}
            >
              {i === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-sm">
                  {SKINS[skin].head}
                </div>
              ) : null}
            </div>
          ))}

          {/* Food */}
          <div
            className="absolute z-10 flex items-center justify-center text-lg animate-pulse"
            style={{
              left: `${food.x * 20}px`,
              top: `${food.y * 20}px`,
              width: '20px',
              height: '20px',
            }}
          >
            {foodEmoji}
          </div>
        </div>
      </div>

      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-1 mb-4 w-36">
        <div />
        <button
          onClick={() => handleDirection('UP')}
          className={`p-3 rounded-lg text-xl font-bold ${darkMode ? 'bg-gray-700 text-white active:bg-gray-600' : 'bg-gray-200 text-gray-700 active:bg-gray-300'}`}
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => handleDirection('LEFT')}
          className={`p-3 rounded-lg text-xl font-bold ${darkMode ? 'bg-gray-700 text-white active:bg-gray-600' : 'bg-gray-200 text-gray-700 active:bg-gray-300'}`}
        >
          ◀
        </button>
        <button
          onClick={() => handleDirection('DOWN')}
          className={`p-3 rounded-lg text-xl font-bold ${darkMode ? 'bg-gray-700 text-white active:bg-gray-600' : 'bg-gray-200 text-gray-700 active:bg-gray-300'}`}
        >
          ▼
        </button>
        <button
          onClick={() => handleDirection('RIGHT')}
          className={`p-3 rounded-lg text-xl font-bold ${darkMode ? 'bg-gray-700 text-white active:bg-gray-600' : 'bg-gray-200 text-gray-700 active:bg-gray-300'}`}
        >
          ▶
        </button>
      </div>

      <div className="flex gap-3">
        {!isPlaying && (
          <button
            onClick={gameOver ? resetGame : startGame}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md"
          >
            {gameOver ? 'Play Again' : 'Start'}
          </button>
        )}
        {isPlaying && (
          <button
            onClick={() => { setIsPlaying(false); if (gameRef.current) clearInterval(gameRef.current); }}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-md"
          >{t('auto.learning.s530_pause', 'Pause')}</button>
        )}
      </div>
      <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Arrow Keys/WASD • {mode === 'wrap' ? 'Go through walls!' : mode === 'obstacles' ? 'Avoid the walls!' : 'Classic mode'}
      </p>
    </div>
  );
}
