import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Heart, Zap, Star, Trophy } from 'lucide-react';
import { playCollect, playHit, playGameOver, playVictory, playLevelUp } from '../lib/sounds';

interface Entity {
  id: number;
  x: number;
  y: number;
  emoji: string;
  name: string;
  type: 'food' | 'predator' | 'powerup';
  speed: number;
  size: number;
}

interface Level {
  id: number;
  name: string;
  playerEmoji: string;
  playerName: string;
  foods: { emoji: string; name: string; points: number }[];
  predators: { emoji: string; name: string }[];
  background: string;
  spawnRate: number;
  description: string;
}

const levels: Level[] = [
  {
    id: 1, name: 'Pond Life', playerEmoji: '🐟', playerName: 'Fish',
    foods: [{ emoji: '🟢', name: 'Algae', points: 10 }, { emoji: '🪱', name: 'Worm', points: 20 }],
    predators: [{ emoji: '🐊', name: 'Crocodile' }],
    background: 'from-blue-950 to-cyan-950', spawnRate: 1200,
    description: 'Eat algae and worms. Avoid the crocodile!',
  },
  {
    id: 2, name: 'Savanna', playerEmoji: '🐰', playerName: 'Rabbit',
    foods: [{ emoji: '🌱', name: 'Grass', points: 10 }, { emoji: '🥕', name: 'Carrot', points: 25 }],
    predators: [{ emoji: '🦊', name: 'Fox' }, { emoji: '🦅', name: 'Eagle' }],
    background: 'from-amber-950 to-orange-950', spawnRate: 1000,
    description: 'Munch on grass and carrots. Watch out for fox and eagle!',
  },
  {
    id: 3, name: 'Deep Ocean', playerEmoji: '🐙', playerName: 'Octopus',
    foods: [{ emoji: '🦐', name: 'Shrimp', points: 15 }, { emoji: '🐟', name: 'Fish', points: 30 }],
    predators: [{ emoji: '🦈', name: 'Shark' }, { emoji: '🐋', name: 'Whale' }],
    background: 'from-indigo-950 to-blue-950', spawnRate: 900,
    description: 'Catch shrimp and fish. Escape the shark and whale!',
  },
];

const GAME_W = 500;
const GAME_H = 400;
const PLAYER_SIZE = 30;

export default function FoodChainDash() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'win'>('menu');
  const [player, setPlayer] = useState({ x: GAME_W / 2, y: GAME_H / 2 });
  const [entities, setEntities] = useState<Entity[]>([]);
  const [mastery, setMastery] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [targetScore, setTargetScore] = useState(200);
  const [invincible, setInvincible] = useState(false);
  const [combo, setCombo] = useState(0);
  const [showHit, setShowHit] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const lastSpawn = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const entityIdRef = useRef(0);

  const level = levels[currentLevel];

  const startGame = (lvl: number) => {
    setCurrentLevel(lvl);
    setGameState('playing');
    setPlayer({ x: GAME_W / 2, y: GAME_H / 2 });
    setEntities([]);
    setMastery(0);
    setLives(3);
    setInvincible(false);
    setCombo(0);
    setTargetScore(200 + lvl * 100);
    lastSpawn.current = Date.now();
    entityIdRef.current = 0;
  };

  const spawnEntity = useCallback(() => {
    const lvl = levels[currentLevel];
    const rand = Math.random();
    let entity: Entity;
    const side = Math.floor(Math.random() * 4);
    let x: number, y: number;
    if (side === 0) { x = -30; y = Math.random() * GAME_H; }
    else if (side === 1) { x = GAME_W + 30; y = Math.random() * GAME_H; }
    else if (side === 2) { x = Math.random() * GAME_W; y = -30; }
    else { x = Math.random() * GAME_W; y = GAME_H + 30; }

    if (rand < 0.15) {
      const predator = lvl.predators[Math.floor(Math.random() * lvl.predators.length)];
      entity = { id: entityIdRef.current++, x, y, emoji: predator.emoji, name: predator.name, type: 'predator', speed: 1.5 + currentLevel * 0.3, size: 28 };
    } else if (rand < 0.2) {
      entity = { id: entityIdRef.current++, x, y, emoji: '⭐', name: 'Star Power', type: 'powerup', speed: 0.5, size: 20 };
    } else {
      const food = lvl.foods[Math.floor(Math.random() * lvl.foods.length)];
      entity = { id: entityIdRef.current++, x, y, emoji: food.emoji, name: food.name, type: 'food', speed: 0.3 + Math.random() * 0.5, size: 22 };
    }
    setEntities(prev => [...prev.slice(-30), entity]);
  }, [currentLevel]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.key.toLowerCase());
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = () => {
      const keys = keysRef.current;
      const speed = 4;

      // Move player
      setPlayer(prev => {
        let { x, y } = prev;
        if (keys.has('arrowleft') || keys.has('a')) x -= speed;
        if (keys.has('arrowright') || keys.has('d')) x += speed;
        if (keys.has('arrowup') || keys.has('w')) y -= speed;
        if (keys.has('arrowdown') || keys.has('s')) y += speed;
        x = Math.max(PLAYER_SIZE / 2, Math.min(GAME_W - PLAYER_SIZE / 2, x));
        y = Math.max(PLAYER_SIZE / 2, Math.min(GAME_H - PLAYER_SIZE / 2, y));
        return { x, y };
      });

      // Spawn entities
      if (Date.now() - lastSpawn.current > levels[currentLevel].spawnRate) {
        spawnEntity();
        lastSpawn.current = Date.now();
      }

      // Move entities toward center or player
      setEntities(prev => prev.map(e => {
        const targetX = e.type === 'predator' ? player.x : GAME_W / 2 + Math.sin(Date.now() / 1000 + e.id) * 100;
        const targetY = e.type === 'predator' ? player.y : GAME_H / 2 + Math.cos(Date.now() / 1000 + e.id) * 80;
        const dx = targetX - e.x;
        const dy = targetY - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        return { ...e, x: e.x + (dx / dist) * e.speed, y: e.y + (dy / dist) * e.speed };
      }));

      animRef.current = requestAnimationFrame(gameLoop);
    };

    animRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, spawnEntity, currentLevel, player.x, player.y]);

  // Collision detection
  useEffect(() => {
    if (gameState !== 'playing') return;
    const checkInterval = setInterval(() => {
      setEntities(prev => {
        const remaining: Entity[] = [];
        let scoreBonus = 0;
        let hitPredator = false;
        let gotPowerup = false;

        for (const e of prev) {
          const dx = player.x - e.x;
          const dy = player.y - e.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const collisionDist = (PLAYER_SIZE + e.size) / 2;

          if (dist < collisionDist) {
            if (e.type === 'food') {
              const food = level.foods.find(f => f.emoji === e.emoji);
              scoreBonus += (food?.points || 10) * (1 + combo * 0.1);
              setCombo(c => c + 1);
            } else if (e.type === 'predator' && !invincible) {
              hitPredator = true;
            } else if (e.type === 'powerup') {
              gotPowerup = true;
            } else {
              remaining.push(e);
            }
          } else {
            // Remove off-screen entities (give buffer)
            if (e.x > -100 && e.x < GAME_W + 100 && e.y > -100 && e.y < GAME_H + 100) {
              remaining.push(e);
            }
          }
        }

        if (scoreBonus > 0) {
          playCollect();
          setMastery(m => {
            const newMastery = m + scoreBonus;
            if (newMastery >= targetScore) {
              playVictory();
              if (currentLevel < levels.length - 1) {
                setGameState('win');
              } else {
                setGameState('win');
              }
            }
            return newMastery;
          });
        }

        if (hitPredator) {
          playHit();
          setLives(l => {
            if (l <= 1) { playGameOver(); setGameState('gameover'); return 0; }
            return l - 1;
          });
          setInvincible(true);
          setShowHit(true);
          setCombo(0);
          setTimeout(() => setInvincible(false), 2000);
          setTimeout(() => setShowHit(false), 300);
        }

        if (gotPowerup) {
          setInvincible(true);
          setTimeout(() => setInvincible(false), 5000);
        }

        return remaining;
      });
    }, 50);

    return () => clearInterval(checkInterval);
  }, [gameState, player, invincible, level, combo, targetScore, currentLevel]);

  // Touch/click movement
  const handlePointerMove = (e: React.PointerEvent) => {
    if (gameState !== 'playing') return;
    const rect = gameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scaleX = GAME_W / rect.width;
    const scaleY = GAME_H / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setPlayer({ x: Math.max(15, Math.min(GAME_W - 15, x)), y: Math.max(15, Math.min(GAME_H - 15, y)) });
  };

  // Update high mastery on game over
  useEffect(() => {
    if (gameState === 'gameover' || gameState === 'win') {
      setHighScore(h => Math.max(h, mastery));
    }
  }, [gameState, mastery]);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🏊 Food Chain Dash</h2>
            <p className="text-gray-400 text-lg">Eat food, avoid predators, survive the food chain!</p>
          </motion.div>

          <div className="grid gap-4 max-w-md mx-auto">
            {levels.map((lvl, i) => (
              <motion.button key={lvl.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => startGame(i)}
                className={`bg-gradient-to-r ${lvl.background} rounded-2xl border border-gray-700 p-5 text-left hover:border-emerald-500/50 transition-all hover:-translate-y-0.5`}>
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{lvl.playerEmoji}</div>
                  <div>
                    <div className="text-sm text-emerald-400 font-bold uppercase">Level {lvl.id}</div>
                    <div className="text-xl font-bold text-white">{lvl.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{lvl.description}</div>
                    <div className="flex gap-2 mt-2">
                      <span className="text-sm bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        Food: {lvl.foods.map(f => f.emoji).join('')}
                      </span>
                      <span className="text-sm bg-red-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                        Danger: {lvl.predators.map(p => p.emoji).join('')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {highScore > 0 && (
            <div className="text-center mt-6 text-sm text-gray-400">
              <Trophy className="w-4 h-4 inline mr-1 text-yellow-400" /> High Mastery: {highScore}
            </div>
          )}

          <div className="text-center mt-6 bg-gray-900 rounded-xl p-4 max-w-md mx-auto border border-gray-800">
            <h3 className="text-sm font-bold text-white mb-2">🎮 Controls</h3>
            <p className="text-sm text-gray-400">
              <strong>Desktop:</strong> Arrow keys or WASD to move<br />
              <strong>Mobile:</strong> Touch/drag on the game area
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
          <h2 className="text-2xl font-black text-white">🏊 {level.name}</h2>
        </motion.div>

        {/* HUD */}
        <div className="flex items-center justify-between mb-3 bg-gray-900 rounded-xl border border-gray-800 px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart key={i} className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} />
              ))}
            </div>
            {combo > 1 && (
              <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                <Zap className="w-3 h-3" /> x{combo} combo!
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              <Star className="w-3 h-3 inline mr-1 text-yellow-400" />{mastery}/{targetScore}
            </div>
            {invincible && <div className="text-sm text-cyan-400 font-bold animate-pulse">🛡️ Shield!</div>}
          </div>
        </div>

        {/* Game Area */}
        <div ref={gameRef}
          className={`relative w-full rounded-2xl overflow-hidden border-2 border-gray-700 bg-gradient-to-b ${level.background} cursor-none select-none`}
          style={{ aspectRatio: `${GAME_W}/${GAME_H}` }}
          onPointerMove={handlePointerMove}
        >
          {/* Mastery progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800/50 z-20">
            <motion.div className="h-full bg-emerald-500" animate={{ width: `${Math.min(100, (mastery / targetScore) * 100)}%` }} />
          </div>

          {/* Hit flash */}
          {showHit && <div className="absolute inset-0 bg-red-500/30 z-30 pointer-events-none" />}

          {/* Entities */}
          {entities.map(e => (
            <div key={e.id} className="absolute transition-none pointer-events-none"
              style={{
                left: `${(e.x / GAME_W) * 100}%`,
                top: `${(e.y / GAME_H) * 100}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${e.size}px`,
                filter: e.type === 'predator' ? 'drop-shadow(0 0 4px rgba(239,68,68,0.5))' : undefined,
              }}>
              {e.emoji}
            </div>
          ))}

          {/* Player */}
          <motion.div
            className="absolute pointer-events-none z-10"
            style={{
              left: `${(player.x / GAME_W) * 100}%`,
              top: `${(player.y / GAME_H) * 100}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${PLAYER_SIZE}px`,
              filter: invincible ? 'drop-shadow(0 0 8px rgba(56,189,248,0.8))' : 'drop-shadow(0 0 4px rgba(0,0,0,0.5))',
            }}
            animate={invincible ? { scale: [1, 1.1, 1] } : {}}
            transition={invincible ? { repeat: Infinity, duration: 0.5 } : {}}
          >
            {level.playerEmoji}
          </motion.div>
        </div>

        <div className="text-center mt-3">
          <button onClick={() => setGameState('menu')} className="text-sm text-gray-500 hover:text-gray-300">← Back to Menu</button>
        </div>

        {/* Game Over / Win overlay */}
        {(gameState === 'gameover' || gameState === 'win') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="bg-gray-900 rounded-2xl border border-gray-700 p-7 max-w-sm w-full text-center">
              <div className="text-5xl mb-3">{gameState === 'win' ? '🎉' : '💀'}</div>
              <h3 className="text-2xl font-black text-white mb-2">
                {gameState === 'win' ? 'Level Complete!' : 'Game Over!'}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {gameState === 'win'
                  ? `You survived the ${level.name} food chain!`
                  : `The food chain caught up with you!`}
              </p>
              <div className="bg-gray-800 rounded-xl p-3 mb-5">
                <div className="text-gray-500 text-sm">Mastery</div>
                <div className="text-3xl font-black text-emerald-400">{mastery}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startGame(currentLevel)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 flex items-center justify-center gap-1">
                  <RotateCcw className="w-4 h-4" /> Retry
                </button>
                {gameState === 'win' && currentLevel < levels.length - 1 && (
                  <button onClick={() => { playLevelUp(); startGame(currentLevel + 1); }}
                    className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white text-sm font-bold hover:bg-purple-600">
                    Next Level →
                  </button>
                )}
                <button onClick={() => setGameState('menu')}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-bold hover:bg-gray-700">
                  Menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
