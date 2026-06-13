import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';

interface ExplorePhaseProps {
  onComplete: () => void;
}

// Simple grid world game
const GRID = 5;
const GOAL = { r: 0, c: 4 };
const TRAP = { r: 2, c: 2 };
const WALL = { r: 1, c: 2 };

export default function ExplorePhase({ onComplete }: ExplorePhaseProps) {
  const { t } = useTranslation();
  const [pos, setPos] = useState({ r: 4, c: 0 });
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("Guide the robot 🤖 to the star ⭐!");
  const [hasWon, setHasWon] = useState(false);
  const [trail, setTrail] = useState<string[]>(['4-0']);

  const isWall = (r: number, c: number) => r === WALL.r && c === WALL.c;
  const isGoal = (r: number, c: number) => r === GOAL.r && c === GOAL.c;
  const isTrap = (r: number, c: number) => r === TRAP.r && c === TRAP.c;

  const move = useCallback((dr: number, dc: number) => {
    if (hasWon) return;

    const newR = pos.r + dr;
    const newC = pos.c + dc;

    if (newR < 0 || newR >= GRID || newC< 0 || newC >= GRID) {
      setMessage("🚫 Can't go there! Try another direction.");
      setScore(s => s - 1);
      return;
    }

    if (isWall(newR, newC)) {
      setMessage("🧱 That's a wall! Find another way.");
      setScore(s => s - 1);
      return;
    }

    setPos({ r: newR, c: newC });
    setMoves(m => m + 1);
    setTrail(t => [...t, `${newR}-${newC}`]);

    if (isTrap(newR, newC)) {
      setMessage("💥 Ouch! That was a trap! -5 points. Keep going!");
      setScore(s => s - 5);
    } else if (isGoal(newR, newC)) {
      const bonus = Math.max(20 - moves, 5);
      setScore(s => s + bonus);
      setMessage(`🎉 You found the star! +${bonus} points!`);
      setHasWon(true);
    } else {
      setScore(s => s - 1);
      setMessage("Keep going! Each step costs 1 point. Find the star quickly!");
    }
  }, [pos, hasWon, moves]);

  const reset = () => {
    setPos({ r: 4, c: 0 });
    setScore(0);
    setMoves(0);
    setMessage("Guide the robot 🤖 to the star ⭐!");
    setHasWon(false);
    setTrail(['4-0']);
  };

  const getCell = (r: number, c: number) => {
    if (pos.r === r && pos.c === c) return '🤖';
    if (isGoal(r, c)) return '⭐';
    if (isTrap(r, c)) return '💥';
    if (isWall(r, c)) return '🧱';
    if (trail.includes(`${r}-${c}`)) return '·';
    return '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-lime-500 p-4 sm:p-6 text-white">
          <h2 className="text-xl sm:text-2xl font-bold">🧸 Train the Robot!</h2>
          <p className="text-emerald-100 mt-1 text-sm">{t('auto.learning.s939_youre_the_reward_system_guide_the_robot_', "You're the reward system! Guide the robot to the star.")}</p>
        </div>

        <div className="p-4 sm:p-6">
          {/* Stats */}
          <div className="flex justify-around mb-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">{score}</div>
              <div className="text-xs text-gray-500">{t('auto.learning.s940_score', 'Score')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{moves}</div>
              <div className="text-xs text-gray-500">{t('auto.learning.s941_moves', 'Moves')}</div>
            </div>
          </div>

          {/* Message */}
          <div className={cn(
            "text-center p-3 rounded-xl mb-4 font-medium text-sm",
            hasWon ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-700"
          )}>
            {message}
          </div>

          {/* Grid */}
          <div className="flex justify-center mb-4">
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {Array.from({ length: GRID }).map((_, r) =>
                Array.from({ length: GRID }).map((_, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={cn(
                      "w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold border-2 transition-all",
                      pos.r === r && pos.c === c
                        ? "bg-emerald-100 border-emerald-400 scale-110"
                        : isGoal(r, c) ? "bg-yellow-100 border-yellow-300"
                        : isTrap(r, c) ? "bg-red-50 border-red-200"
                        : isWall(r, c) ? "bg-gray-300 border-gray-400"
                        : trail.includes(`${r}-${c}`) ? "bg-emerald-50 border-gray-200"
                        : "bg-white border-gray-200"
                    )}
                  >
                    {getCell(r, c)}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center mb-4">
            <div className="grid grid-cols-3 gap-1.5 w-fit">
              <div />
              <button onClick={() => move(-1, 0)} disabled={hasWon} className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-2xl font-bold disabled:opacity-30 transition-all active:scale-95">↑</button>
              <div />
              <button onClick={() => move(0, -1)} disabled={hasWon} className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-2xl font-bold disabled:opacity-30 transition-all active:scale-95">←</button>
              <button onClick={reset} className="w-14 h-14 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-bold transition-all active:scale-95">{t('auto.learning.s942_reset', 'Reset')}</button>
              <button onClick={() => move(0, 1)} disabled={hasWon} className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-2xl font-bold disabled:opacity-30 transition-all active:scale-95">→</button>
              <div />
              <button onClick={() => move(1, 0)} disabled={hasWon} className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-2xl font-bold disabled:opacity-30 transition-all active:scale-95">↓</button>
              <div />
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600 mb-4">
            <span>🤖 Robot</span>
            <span>⭐ Goal (+pts)</span>
            <span>💥 Trap (-5)</span>
            <span>🧱 Wall</span>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-xl mb-4">
            <p className="text-yellow-800 text-sm">
              💡 <strong>{t('auto.learning.s943_this_is_rl', 'This is RL!')}</strong> The robot (agent) explores the grid (environment) 
              and learns from rewards and penalties. Fewer moves = better score!
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onComplete}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all",
                hasWon
                  ? "bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-500"
              )}
            >Ready to Play! 🎮</button>
          </div>
        </div>
      </div>
    </div>
  );
}
