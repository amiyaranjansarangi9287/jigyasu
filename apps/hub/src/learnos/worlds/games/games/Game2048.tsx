import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef } from 'react';

type Board = number[][];
type GameMode = '4x4' | '5x5' | '6x6';

const SIZES: Record<GameMode, number> = { '4x4': 4, '5x5': 5, '6x6': 6 };

const COLORS: Record<number, string> = {
  0: 'bg-gray-200 dark:bg-gray-700',
  2: 'bg-gray-100 text-gray-800',
  4: 'bg-gray-200 text-gray-800',
  8: 'bg-orange-300 text-white',
  16: 'bg-orange-400 text-white',
  32: 'bg-orange-500 text-white',
  64: 'bg-orange-600 text-white',
  128: 'bg-yellow-400 text-white',
  256: 'bg-yellow-500 text-white',
  512: 'bg-yellow-600 text-white',
  1024: 'bg-green-500 text-white',
  2048: 'bg-green-600 text-white',
  4096: 'bg-blue-500 text-white',
  8192: 'bg-purple-500 text-white',
  16384: 'bg-pink-500 text-white',
  32768: 'bg-red-500 text-white',
};

interface GameState {
  board: Board;
  score: number;
}

function createEmptyBoard(size: number): Board {
  return Array(size).fill(null).map(() => Array(size).fill(0));
}

function addRandomTile(board: Board): Board {
  const size = board.length;
  const empty: [number, number][] = [];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (board[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newBoard = board.map(row =>[...row]);
  newBoard[r][c] = Math.random()< 0.9 ? 2 : 4;
  return newBoard;
}

function slide(row: number[]): { row: number[]; score: number } {
  let score = 0;
  const filtered = row.filter(x =>x !== 0);
  const result: number[] = [];
  let i = 0;
  while (i< filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2;
      result.push(merged);
      score += merged;
      i += 2;
    } else {
      result.push(filtered[i]);
      i++;
    }
  }
  while (result.length < row.length) result.push(0);
  return { row: result, score };
}

function moveLeft(board: Board): { board: Board; score: number; moved: boolean } {
  let totalScore = 0;
  let moved = false;
  const newBoard = board.map(row => {
    const { row: newRow, score } = slide(row);
    totalScore += score;
    if (newRow.join() !== row.join()) moved = true;
    return newRow;
  });
  return { board: newBoard, score: totalScore, moved };
}

function rotateClockwise(board: Board): Board {
  const n = board.length;
  const rotated: Board = createEmptyBoard(n);
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      rotated[c][n - 1 - r] = board[r][c];
  return rotated;
}

function move(board: Board, direction: 'left' | 'right' | 'up' | 'down'): { board: Board; score: number; moved: boolean } {
  let b = board.map(row => [...row]);
  const rotations = { left: 0, up: 1, right: 2, down: 3 }[direction];
  for (let i = 0; i < rotations; i++) b = rotateClockwise(b);
  const result = moveLeft(b);
  for (let i = 0; i < (4 - rotations) % 4; i++) result.board = rotateClockwise(result.board);
  return result;
}

function canMove(board: Board): boolean {
  const size = board.length;
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) return true;
      if (c + 1 < size && board[r][c] === board[r][c + 1]) return true;
      if (r + 1 < size && board[r][c] === board[r + 1][c]) return true;
    }
  return false;
}

function hasWon(board: Board, target: number): boolean {
  return board.some(row => row.some(cell => cell >= target));
}

function getMaxTile(board: Board): number {
  return Math.max(...board.flat());
}

interface Props { darkMode: boolean; }

export default function Game2048({ darkMode }: Props) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<GameMode>('4x4');
  const [board, setBoard] = useState<Board>(() => {
    const initial = createEmptyBoard(4);
    return addRandomTile(addRandomTile(initial));
  });
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState<Record<GameMode, number>>({ '4x4': 0, '5x5': 0, '6x6': 0 });
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [continueAfterWin, setContinueAfterWin] = useState(false);
  const [history, setHistory] = useState<GameState[]>([]);
  const [undosLeft, setUndosLeft] = useState(3);
  const [newTiles, setNewTiles] = useState<Set<string>>(new Set());
  const [mergedTiles, setMergedTiles] = useState<Set<string>>(new Set());
  
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const size = SIZES[mode];
  const target = mode === '4x4' ? 2048 : mode === '5x5' ? 4096 : 8192;

  const initGame = useCallback((m: GameMode) => {
    const s = SIZES[m];
    const initial = createEmptyBoard(s);
    const newBoard = addRandomTile(addRandomTile(initial));
    setMode(m);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setContinueAfterWin(false);
    setHistory([]);
    setUndosLeft(3);
    setNewTiles(new Set());
    setMergedTiles(new Set());
  }, []);

  const handleMove = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;
    
    const result = move(board, direction);
    if (!result.moved) return;
    
    // Save to history for undo
    setHistory(prev => [...prev.slice(-9), { board: board.map(r => [...r]), score }]);
    
    // Find new tile position
    const newBoard = addRandomTile(result.board);
    const newTilePos = new Set<string>();
    const merged = new Set<string>();
    
    for (let r = 0; r< size; r++) {
      for (let c = 0; c < size; c++) {
        if (newBoard[r][c] !== 0 && result.board[r][c] === 0) {
          newTilePos.add(`${r}-${c}`);
        }
        if (newBoard[r][c] > board[r][c] && board[r][c] !== 0) {
          merged.add(`${r}-${c}`);
        }
      }
    }
    
    setNewTiles(newTilePos);
    setMergedTiles(merged);
    setTimeout(() => {
      setNewTiles(new Set());
      setMergedTiles(new Set());
    }, 200);
    
    setBoard(newBoard);
    const newScore = score + result.score;
    setScore(newScore);
    if (newScore > bestScore[mode]) {
      setBestScore(prev => ({ ...prev, [mode]: newScore }));
    }
    
    if (!continueAfterWin && hasWon(newBoard, target) && !won) {
      setWon(true);
    }
    if (!canMove(newBoard)) {
      setGameOver(true);
    }
  }, [board, score, bestScore, mode, gameOver, won, continueAfterWin, size, target]);

  const undo = () => {
    if (history.length === 0 || undosLeft <= 0) return;
    const prev = history[history.length - 1];
    setBoard(prev.board);
    setScore(prev.score);
    setHistory(h => h.slice(0, -1));
    setUndosLeft(u => u - 1);
    setGameOver(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's'].includes(e.key)) {
        e.preventDefault();
        const dir = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
                      a: 'left', d: 'right', w: 'up', s: 'down' }[e.key] as 'left' | 'right' | 'up' | 'down';
        handleMove(dir);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleMove]);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const minSwipe = 30;
    
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
      handleMove(dx > 0 ? 'right' : 'left');
    } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipe) {
      handleMove(dy > 0 ? 'down' : 'up');
    }
    touchStart.current = null;
  };

  const continueGame = () => {
    setContinueAfterWin(true);
    setWon(false);
  };

  const getColor = (val: number) => COLORS[val] || 'bg-purple-700 text-white';
  const maxTile = getMaxTile(board);
  const cellSize = mode === '4x4' ? 'w-16 h-16 sm:w-20 sm:h-20' : mode === '5x5' ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-12 h-12 sm:w-14 sm:h-14';
  const fontSize = mode === '4x4' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl';

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Mode selector */}
      <div className="flex gap-2 mb-4">
        {(['4x4', '5x5', '6x6'] as GameMode[]).map(m => (
          <button
            key={m}
            onClick={() => initGame(m)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              mode === m
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Scores */}
      <div className="flex gap-4 mb-4">
        <div className={`px-4 py-2 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>SCORE</div>
          <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{score}</div>
        </div>
        <div className={`px-4 py-2 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BEST</div>
          <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{bestScore[mode]}</div>
        </div>
        <div className={`px-4 py-2 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>MAX</div>
          <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{maxTile}</div>
        </div>
      </div>

      {/* Win / Game Over */}
      {(won || gameOver) && (
        <div className={`mb-4 px-6 py-3 rounded-xl font-bold text-lg shadow-lg ${
          won ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        }`}>
          {won ? `🎉 You reached ${target}!` : '💀 Game Over!'}
        </div>
      )}

      {/* Board */}
      <div
        className={`p-2 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const key = `${r}-${c}`;
              const isNew = newTiles.has(key);
              const isMerged = mergedTiles.has(key);
              return (
                <div
                  key={key}
                  className={`${cellSize} rounded-lg flex items-center justify-center font-bold transition-all duration-100 ${getColor(cell)} ${fontSize} ${
                    cell >= 1000 ? 'text-base sm:text-lg' : ''
                  } ${isNew ? 'animate-[pop_0.2s_ease-out]' : ''} ${isMerged ? 'animate-[merge_0.2s_ease-out]' : ''}`}
                >
                  {cell || ''}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-1 mt-4 w-36">
        <div />
        <button onClick={() => handleMove('up')} className={`p-3 rounded-lg text-xl font-bold ${darkMode ? 'bg-gray-700 text-white active:bg-gray-600' : 'bg-gray-200 text-gray-700 active:bg-gray-300'}`}>▲</button>
        <div />
        <button onClick={() => handleMove('left')} className={`p-3 rounded-lg text-xl font-bold ${darkMode ? 'bg-gray-700 text-white active:bg-gray-600' : 'bg-gray-200 text-gray-700 active:bg-gray-300'}`}>◀</button>
        <button onClick={() => handleMove('down')} className={`p-3 rounded-lg text-xl font-bold ${darkMode ? 'bg-gray-700 text-white active:bg-gray-600' : 'bg-gray-200 text-gray-700 active:bg-gray-300'}`}>▼</button>
        <button onClick={() => handleMove('right')} className={`p-3 rounded-lg text-xl font-bold ${darkMode ? 'bg-gray-700 text-white active:bg-gray-600' : 'bg-gray-200 text-gray-700 active:bg-gray-300'}`}>▶</button>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={undo}
          disabled={history.length === 0 || undosLeft <= 0}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 ${
            darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          ↩️ Undo ({undosLeft})
        </button>
        {won && !continueAfterWin && (
          <button onClick={continueGame} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-md">{t('auto.learning.s520_keep_going', 'Keep Going!')}</button>
        )}
        <button onClick={() => initGame(mode)} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md">{t('auto.learning.s521_new_game', 'New Game')}</button>
      </div>

      <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Swipe or use Arrow Keys • Goal: reach {target}!
      </p>
    </div>
  );
}
