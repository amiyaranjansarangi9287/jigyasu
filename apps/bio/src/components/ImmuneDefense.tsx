import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, RotateCcw, Play, Pause } from 'lucide-react';
import { playPlace, playCollect, playHit, playGameOver, playVictory } from '../lib/sounds';

interface Pathogen {
  id: number;
  x: number;
  y: number;
  type: 'bacteria' | 'virus' | 'parasite';
  health: number;
  maxHealth: number;
  speed: number;
  emoji: string;
  name: string;
  points: number;
}

interface Defender {
  id: number;
  x: number;
  y: number;
  type: 'neutrophil' | 'macrophage' | 'tcell' | 'bcell' | 'antibody';
  emoji: string;
  name: string;
  damage: number;
  range: number;
  cooldown: number;
  lastAttack: number;
  cost: number;
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  targetId: number;
  damage: number;
  speed: number;
}

const defenderTypes: Omit<Defender, 'id' | 'x' | 'y' | 'lastAttack'>[] = [
  { type: 'neutrophil', emoji: '⚪', name: 'Neutrophil', damage: 15, range: 80, cooldown: 800, cost: 25 },
  { type: 'macrophage', emoji: '🟡', name: 'Macrophage', damage: 30, range: 100, cooldown: 1200, cost: 50 },
  { type: 'tcell', emoji: '🔵', name: 'T Cell', damage: 40, range: 120, cooldown: 1500, cost: 75 },
  { type: 'bcell', emoji: '🟣', name: 'B Cell', damage: 20, range: 150, cooldown: 600, cost: 60 },
];

const pathogenTypes = [
  { type: 'bacteria' as const, emoji: '🦠', name: 'Bacteria', health: 50, speed: 0.8, points: 10 },
  { type: 'virus' as const, emoji: '🧫', name: 'Virus', health: 30, speed: 1.2, points: 15 },
  { type: 'parasite' as const, emoji: '🐛', name: 'Parasite', health: 100, speed: 0.5, points: 25 },
];

const GAME_W = 600;
const GAME_H = 400;
const CELL_CORE_X = 550;

export default function ImmuneDefense() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'won' | 'lost'>('menu');
  const [wave, setWave] = useState(1);
  const [health, setHealth] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [score, setScore] = useState(0);
  const [pathogens, setPathogens] = useState<Pathogen[]>([]);
  const [defenders, setDefenders] = useState<Defender[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [selectedDefender, setSelectedDefender] = useState<typeof defenderTypes[0] | null>(null);
  const [wavePathogens, setWavePathogens] = useState(0);
  const [pathogensSpawned, setPathogensSpawned] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const entityIdRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const gameLoopRef = useRef<number>(0);

  const startGame = () => {
    setGameState('playing');
    setWave(1);
    setHealth(100);
    setEnergy(100);
    setScore(0);
    setPathogens([]);
    setDefenders([]);
    setProjectiles([]);
    setWavePathogens(5);
    setPathogensSpawned(0);
    entityIdRef.current = 0;
  };

  const placeDefender = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedDefender || gameState !== 'playing') return;
    if (energy < selectedDefender.cost) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * GAME_W;
    const y = ((e.clientY - rect.top) / rect.height) * GAME_H;

    if (x > GAME_W - 80) return; // Don't place near the cell

    setDefenders(prev => [...prev, {
      ...selectedDefender,
      id: entityIdRef.current++,
      x, y,
      lastAttack: 0,
    }]);
    setEnergy(prev => prev - selectedDefender.cost);
    setSelectedDefender(null);
    playPlace();
  }, [selectedDefender, energy, gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = () => {
      const now = Date.now();

      // Spawn pathogens
      if (pathogensSpawned < wavePathogens && now - lastSpawnRef.current > 1500) {
        const pType = pathogenTypes[Math.floor(Math.random() * pathogenTypes.length)];
        const difficulty = 1 + wave * 0.2;
        setPathogens(prev => [...prev, {
          id: entityIdRef.current++,
          x: -30,
          y: 50 + Math.random() * (GAME_H - 100),
          type: pType.type,
          health: pType.health * difficulty,
          maxHealth: pType.health * difficulty,
          speed: pType.speed,
          emoji: pType.emoji,
          name: pType.name,
          points: pType.points,
        }]);
        setPathogensSpawned(p => p + 1);
        lastSpawnRef.current = now;
      }

      // Move pathogens
      setPathogens(prev => {
        const updated: Pathogen[] = [];
        for (const p of prev) {
          const newX = p.x + p.speed;
          if (newX >= CELL_CORE_X - 20) {
            playHit();
            setHealth(h => Math.max(0, h - 10));
          } else if (p.health > 0) {
            updated.push({ ...p, x: newX });
          }
        }
        return updated;
      });

      // Defenders attack
      setDefenders(prev => {
        return prev.map(d => {
          if (now - d.lastAttack < d.cooldown) return d;

          // Find nearest pathogen in range
          let nearest: Pathogen | null = null;
          let nearestDist = Infinity;
          for (const p of pathogens) {
            const dist = Math.sqrt((p.x - d.x) ** 2 + (p.y - d.y) ** 2);
            if (dist < d.range && dist < nearestDist) {
              nearest = p;
              nearestDist = dist;
            }
          }

          if (nearest) {
            setProjectiles(proj => [...proj, {
              id: entityIdRef.current++,
              x: d.x,
              y: d.y,
              targetId: nearest.id,
              damage: d.damage,
              speed: 5,
            }]);
            return { ...d, lastAttack: now };
          }
          return d;
        });
      });

      // Move projectiles
      setProjectiles(prev => {
        const remaining: Projectile[] = [];
        for (const proj of prev) {
          const target = pathogens.find(p => p.id === proj.targetId);
          if (!target) continue;

          const dx = target.x - proj.x;
          const dy = target.y - proj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 10) {
            // Hit!
            setPathogens(pths => pths.map(p =>
              p.id === proj.targetId ? { ...p, health: p.health - proj.damage } : p
            ).filter(p => {
              if (p.health <= 0 && p.id === proj.targetId) {
                playCollect();
                setScore(s => s + p.points);
                setEnergy(e => Math.min(200, e + 5));
                return false;
              }
              return true;
            }));
          } else {
            remaining.push({
              ...proj,
              x: proj.x + (dx / dist) * proj.speed,
              y: proj.y + (dy / dist) * proj.speed,
            });
          }
        }
        return remaining;
      });

      // Energy regen
      setEnergy(e => Math.min(200, e + 0.05));

      // Check game state
      if (health <= 0) {
        playGameOver();
        setGameState('lost');
        setHighScore(h => Math.max(h, score));
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameState, pathogens, defenders, health, score, pathogensSpawned, wavePathogens, wave]);

  // Wave completion check
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (pathogensSpawned >= wavePathogens && pathogens.length === 0) {
      if (wave >= 10) {
        playVictory();
        setGameState('won');
        setHighScore(h => Math.max(h, score));
      } else {
        setWave(w => w + 1);
        setWavePathogens(w => w + 3);
        setPathogensSpawned(0);
        setEnergy(e => Math.min(200, e + 50));
      }
    }
  }, [pathogensSpawned, wavePathogens, pathogens.length, gameState, wave, score]);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-6xl mb-4">🛡️</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Immune System Battle</h2>
            <p className="text-gray-400 mb-6">Defend your cell against invading pathogens!</p>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6 text-left">
              <h3 className="text-lg font-bold text-white mb-3">🎮 How to Play</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• <strong className="text-emerald-400">Select</strong> a defender from the bottom panel</li>
                <li>• <strong className="text-emerald-400">Click</strong> on the battlefield to place it</li>
                <li>• Defenders automatically attack nearby pathogens</li>
                <li>• Don't let pathogens reach your cell (right side)!</li>
                <li>• Survive 10 waves to win</li>
              </ul>

              <h4 className="text-sm font-bold text-white mt-4 mb-2">⚪ Your Immune Cells</h4>
              <div className="grid grid-cols-2 gap-2">
                {defenderTypes.map(d => (
                  <div key={d.type} className="bg-gray-800/50 rounded-lg p-2 text-xs">
                    <span className="text-lg mr-2">{d.emoji}</span>
                    <strong className="text-white">{d.name}</strong>
                    <div className="text-gray-500 mt-1">DMG: {d.damage} | Range: {d.range} | Cost: {d.cost}⚡</div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={startGame}
              className="px-8 py-3 rounded-xl bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-600 transition-colors">
              <Play className="w-5 h-5 inline mr-2" /> Start Defense
            </button>

            {highScore > 0 && (
              <div className="mt-4 text-gray-500 text-sm">🏆 High Score: {highScore}</div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-3">
          <h2 className="text-2xl font-black text-white">🛡️ Immune System Battle</h2>
        </motion.div>

        {/* HUD */}
        <div className="flex items-center justify-between bg-gray-900 rounded-xl border border-gray-800 px-4 py-2 mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500" />
              <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all" style={{ width: `${health}%` }} />
              </div>
              <span className="text-xs text-gray-400">{health}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-bold text-yellow-400">{Math.floor(energy)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm"><span className="text-gray-500">Wave:</span> <span className="text-white font-bold">{wave}/10</span></div>
            <div className="text-sm"><span className="text-gray-500">Score:</span> <span className="text-emerald-400 font-bold">{score}</span></div>
            <button onClick={() => setGameState(gameState === 'paused' ? 'playing' : 'paused')}
              className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white">
              {gameState === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Battlefield */}
        <div
          className="relative rounded-2xl overflow-hidden border-2 border-gray-700 bg-gradient-to-r from-red-950/30 via-gray-900 to-pink-950/50 cursor-crosshair"
          style={{ aspectRatio: `${GAME_W}/${GAME_H}` }}
          onClick={placeDefender}
        >
          {/* Cell core */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-24 rounded-full bg-pink-500/20 border-2 border-pink-500/40 flex items-center justify-center">
            <div className="text-3xl">🫀</div>
          </div>

          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="white" strokeWidth="1" />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${i * 20}%`} x2="100%" y2={`${i * 20}%`} stroke="white" strokeWidth="1" />
            ))}
          </svg>

          {/* Defenders */}
          {defenders.map(d => (
            <div key={d.id} className="absolute pointer-events-none"
              style={{ left: `${(d.x / GAME_W) * 100}%`, top: `${(d.y / GAME_H) * 100}%`, transform: 'translate(-50%, -50%)' }}>
              <div className="text-2xl">{d.emoji}</div>
              {/* Range indicator */}
              <div className="absolute rounded-full border border-blue-500/20 pointer-events-none"
                style={{ width: d.range * 2, height: d.range * 2, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
            </div>
          ))}

          {/* Pathogens */}
          {pathogens.map(p => (
            <motion.div key={p.id} className="absolute"
              style={{ left: `${(p.x / GAME_W) * 100}%`, top: `${(p.y / GAME_H) * 100}%`, transform: 'translate(-50%, -50%)' }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}>
              <div className="text-2xl">{p.emoji}</div>
              {/* Health bar */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${(p.health / p.maxHealth) * 100}%` }} />
              </div>
            </motion.div>
          ))}

          {/* Projectiles */}
          {projectiles.map(p => (
            <div key={p.id} className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{ left: `${(p.x / GAME_W) * 100}%`, top: `${(p.y / GAME_H) * 100}%`, transform: 'translate(-50%, -50%)', boxShadow: '0 0 6px #facc15' }} />
          ))}

          {/* Placement preview */}
          {selectedDefender && (
            <div className="absolute inset-0 bg-emerald-500/5 flex items-center justify-center pointer-events-none">
              <div className="text-gray-400 text-sm">Click to place {selectedDefender.emoji} {selectedDefender.name}</div>
            </div>
          )}

          {/* Paused overlay */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="text-white text-2xl font-bold">PAUSED</div>
            </div>
          )}
        </div>

        {/* Defender selection */}
        <div className="flex gap-2 mt-3 justify-center flex-wrap">
          {defenderTypes.map(d => {
            const canAfford = energy >= d.cost;
            return (
              <button key={d.type}
                onClick={() => canAfford && setSelectedDefender(selectedDefender?.type === d.type ? null : d)}
                disabled={!canAfford}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                  selectedDefender?.type === d.type
                    ? 'border-emerald-500 bg-emerald-500/20'
                    : canAfford
                    ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    : 'border-gray-800 bg-gray-900 opacity-40 cursor-not-allowed'
                }`}>
                <span className="text-xl">{d.emoji}</span>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">{d.name}</div>
                  <div className="text-[10px] text-gray-500">{d.cost}⚡ | DMG:{d.damage}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Game Over / Win modal */}
        <AnimatePresence>
          {(gameState === 'won' || gameState === 'lost') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                className="bg-gray-900 rounded-2xl border border-gray-700 p-8 max-w-sm w-full text-center">
                <div className="text-5xl mb-3">{gameState === 'won' ? '🏆' : '💀'}</div>
                <h3 className="text-2xl font-black text-white mb-2">
                  {gameState === 'won' ? 'Infection Cleared!' : 'Cell Compromised!'}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {gameState === 'won' ? 'You defended against all 10 waves!' : `You made it to wave ${wave}`}
                </p>
                <div className="bg-gray-800 rounded-xl p-3 mb-5">
                  <div className="text-gray-500 text-xs">Final Score</div>
                  <div className="text-3xl font-black text-emerald-400">{score}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={startGame} className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center gap-1">
                    <RotateCcw className="w-4 h-4" /> Play Again
                  </button>
                  <button onClick={() => setGameState('menu')} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-bold">
                    Menu
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
