import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const EMPTY = 0;

const TETROMINOES = [
  { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500', name: 'I' },
  { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500', name: 'O' },
  { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500', name: 'T' },
  { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-orange-500', name: 'L' },
  { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-blue-500', name: 'J' },
  { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500', name: 'S' },
  { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500', name: 'Z' },
];

type Board = number[][];

interface Piece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

function createBoard(): Board {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(EMPTY));
}

function rotateMatrix(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: number[][] = [];
  for (let c = 0; c < cols; c++) {
    rotated.push([]);
    for (let r = rows - 1; r >= 0; r--) {
      rotated[c].push(matrix[r][c]);
    }
  }
  return rotated;
}

function randomPiece(): Piece {
  const idx = Math.floor(Math.random() * TETROMINOES.length);
  const { shape, color } = TETROMINOES[idx];
  return {
    shape: shape.map(row => [...row]),
    color,
    x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
    y: 0,
  };
}

// Load high score from localStorage
function loadHighScore(): number {
  try {
    return parseInt(localStorage.getItem('tetris-highscore') || '0', 10);
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem('tetris-highscore', score.toString());
  } catch {
    // Ignore
  }
}

interface Props { darkMode: boolean; }

export default function Tetris({ darkMode }: Props) {
  const { t } = useTranslation();
  const [board, setBoard] = useState<Board>(createBoard);
  const [piece, setPiece] = useState<Piece>(randomPiece);
  const [nextPiece, setNextPiece] = useState<Piece>(randomPiece);
  const [holdPiece, setHoldPiece] = useState<Piece | null>(null);
  const [canHold, setCanHold] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(loadHighScore);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const gameRef = useRef<number | null>(null);
  const speedRef = useRef(1000);

  const collides = useCallback((board: Board, piece: Piece): boolean => {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const newY = piece.y + r;
          const newX = piece.x + c;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return true;
          if (newY >= 0 && board[newY][newX]) return true;
        }
      }
    }
    return false;
  }, []);

  // Calculate ghost piece position
  const getGhostY = useCallback((board: Board, piece: Piece): number => {
    let ghostY = piece.y;
    while (!collides(board, { ...piece, y: ghostY + 1 })) {
      ghostY++;
    }
    return ghostY;
  }, [collides]);

  const mergePiece = useCallback((board: Board, piece: Piece, colorIndex: number): Board => {
    const newBoard = board.map(row =>[...row]);
    for (let r = 0; r< piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const y = piece.y + r;
          const x = piece.x + c;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x< BOARD_WIDTH) {
            newBoard[y][x] = colorIndex + 1;
          }
        }
      }
    }
    return newBoard;
  }, []);

  const clearLines = useCallback((board: Board): { board: Board; linesCleared: number } => {
    let linesCleared = 0;
    const newBoard = board.filter(row => {
      const isFull = row.every(cell => cell !== EMPTY);
      if (isFull) linesCleared++;
      return !isFull;
    });
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY));
    }
    return { board: newBoard, linesCleared };
  }, []);

  const moveDown = useCallback(() => {
    if (!isPlaying || gameOver || isPaused) return;

    setPiece(prev => {
      const moved = { ...prev, y: prev.y + 1 };
      if (!collides(board, moved)) return moved;

      // Lock piece
      const colorIndex = TETROMINOES.findIndex(t => t.color === prev.color);
      const merged = mergePiece(board, prev, colorIndex);
      const { board: cleared, linesCleared } = clearLines(merged);
      
      setBoard(cleared);
      setCanHold(true); // Allow hold again after piece locks
      
      if (linesCleared > 0) {
        const points = [0, 100, 300, 500, 800][linesCleared] * level;
        setScore(s => {
          const newScore = s + points;
          if (newScore > highScore) {
            setHighScore(newScore);
            saveHighScore(newScore);
          }
          return newScore;
        });
        setLines(l => {
          const newLines = l + linesCleared;
          const newLevel = Math.floor(newLines / 10) + 1;
          if (newLevel > level) {
            setLevel(newLevel);
            speedRef.current = Math.max(100, 1000 - (newLevel - 1) * 100);
          }
          return newLines;
        });
      }

      // Spawn new piece
      const newPiece = nextPiece;
      setNextPiece(randomPiece());
      
      if (collides(cleared, newPiece)) {
        setGameOver(true);
        setIsPlaying(false);
        if (score > highScore) {
          saveHighScore(score);
        }
      }
      
      return newPiece;
    });
  }, [isPlaying, gameOver, isPaused, board, collides, mergePiece, clearLines, level, nextPiece, highScore, score]);

  const move = useCallback((dx: number) => {
    if (!isPlaying || gameOver || isPaused) return;
    setPiece(prev => {
      const moved = { ...prev, x: prev.x + dx };
      return collides(board, moved) ? prev : moved;
    });
  }, [isPlaying, gameOver, isPaused, board, collides]);

  const rotate = useCallback(() => {
    if (!isPlaying || gameOver || isPaused) return;
    setPiece(prev => {
      const rotated = { ...prev, shape: rotateMatrix(prev.shape) };
      // Wall kick attempts
      const kicks = [0, -1, 1, -2, 2];
      for (const kick of kicks) {
        const kicked = { ...rotated, x: rotated.x + kick };
        if (!collides(board, kicked)) return kicked;
      }
      return prev;
    });
  }, [isPlaying, gameOver, isPaused, board, collides]);

  const hardDrop = useCallback(() => {
    if (!isPlaying || gameOver || isPaused) return;
    setPiece(prev => {
      const ghostY = getGhostY(board, prev);
      const dropDistance = ghostY - prev.y;
      setScore(s => s + dropDistance * 2); // Bonus points for hard drop
      return { ...prev, y: ghostY };
    });
    setTimeout(moveDown, 0);
  }, [isPlaying, gameOver, isPaused, board, getGhostY, moveDown]);

  const hold = useCallback(() => {
    if (!isPlaying || gameOver || isPaused || !canHold) return;
    
    setPiece(prev => {
      const currentHold = holdPiece;
      // Store current piece (reset position)
      const pieceToHold: Piece = {
        shape: prev.shape,
        color: prev.color,
        x: Math.floor((BOARD_WIDTH - prev.shape[0].length) / 2),
        y: 0,
      };
      setHoldPiece(pieceToHold);
      setCanHold(false); // Can't hold again until piece locks
      
      if (currentHold) {
        // Swap with held piece
        return {
          ...currentHold,
          x: Math.floor((BOARD_WIDTH - currentHold.shape[0].length) / 2),
          y: 0,
        };
      } else {
        // Get next piece
        const newPiece = nextPiece;
        setNextPiece(randomPiece());
        return newPiece;
      }
    });
  }, [isPlaying, gameOver, isPaused, canHold, holdPiece, nextPiece]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          e.preventDefault();
          move(-1);
          break;
        case 'ArrowRight':
        case 'KeyD':
          e.preventDefault();
          move(1);
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault();
          rotate();
          break;
        case 'Space':
          e.preventDefault();
          hardDrop();
          break;
        case 'KeyC':
        case 'ShiftLeft':
        case 'ShiftRight':
          e.preventDefault();
          hold();
          break;
        case 'KeyP':
        case 'Escape':
          e.preventDefault();
          if (isPlaying && !gameOver) setIsPaused(p => !p);
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move, moveDown, rotate, hardDrop, hold, isPlaying, gameOver]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) return;
    gameRef.current = window.setInterval(moveDown, speedRef.current);
    return () => {
      if (gameRef.current) clearInterval(gameRef.current);
    };
  }, [isPlaying, gameOver, isPaused, moveDown]);

  const startGame = () => {
    setBoard(createBoard());
    setPiece(randomPiece());
    setNextPiece(randomPiece());
    setHoldPiece(null);
    setCanHold(true);
    setScore(0);
    setLines(0);
    setLevel(1);
    setIsPlaying(true);
    setGameOver(false);
    setIsPaused(false);
    speedRef.current = 1000;
  };

  const getColor = (value: number): string => {
    if (value === 0) return darkMode ? 'bg-gray-800' : 'bg-gray-200';
    return TETROMINOES[value - 1]?.color || 'bg-gray-500';
  };

  // Render board with current piece and ghost
  const renderBoard = () => {
    const display = board.map(row =>[...row]);
    const ghostY = getGhostY(board, piece);
    
    // Draw ghost piece
    for (let r = 0; r< piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const y = ghostY + r;
          const x = piece.x + c;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x< BOARD_WIDTH && display[y][x] === 0) {
            display[y][x] = -1; // Ghost indicator
          }
        }
      }
    }
    
    // Draw current piece (overwrites ghost if overlapping)
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const y = piece.y + r;
          const x = piece.x + c;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x< BOARD_WIDTH) {
            display[y][x] = TETROMINOES.findIndex(t => t.color === piece.color) + 1;
          }
        }
      }
    }
    return display;
  };

  const renderPiecePreview = (p: Piece | null, label: string, canUse: boolean = true) => (
    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow'} ${!canUse ? 'opacity-50' : ''}`}>
      <p className={`text-xs font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
      <div className="w-20 h-16 flex items-center justify-center">
        {p ? (
          <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${p.shape[0].length}, 1fr)` }}>
            {p.shape.map((row, r) =>row.map((cell, c) => (<div
                  key={`${r}-${c}`}
                  className={`w-4 h-4 rounded-sm ${cell ? p.color : 'bg-transparent'}`}
                />
              ))
            )}
          </div>) : (<span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>{t('auto.learning.s532_empty', 'Empty')}</span>
        )}
      </div>
    </div>);

  return (<div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Stats */}
      <div className={`flex gap-4 mb-4 text-sm font-bold flex-wrap justify-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span>🎯 {score}</span>
        <span>🏆 {highScore}</span>
        <span>📊 {t('auto.tetris.lines', 'Lines:')} {lines}</span>
        <span>⚡ {t('auto.tetris.lv', 'Lv.')}{level}</span>
      </div>

      {gameOver && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg">
          💀 {t('auto.tetris.game_over', 'Game Over!')} {t('auto.tetris.score_label', 'Score:')} {score}
        </div>
      )}

      {isPaused && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold shadow-lg">⏸️ {t('auto.tetris.paused', 'Paused')}</div>
      )}

      <div className="flex gap-4">
        {/* Hold piece */}
        {renderPiecePreview(holdPiece, t('auto.tetris.hold', 'HOLD (C)'), canHold)}

        {/* Game Board */}
        <div className={`p-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
          <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)` }}>
            {renderBoard().map((row, r) =>row.map((cell, c) => (<div
                  key={`${r}-${c}`}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-sm ${
                    cell === -1 
                      ? `${piece.color} opacity-30` // Ghost piece
                      : getColor(cell)
                  }`}
                />
              ))
            )}
          </div>
        </div>

        {/* Next piece */}
        {renderPiecePreview(nextPiece, t('auto.tetris.next', 'NEXT'), true)}
      </div>

      {/* Mobile controls */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => move(-1)} className={`p-3 rounded-lg text-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>◀</button>
        <button onClick={rotate} className={`p-3 rounded-lg text-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>🔄</button>
        <button onClick={moveDown} className={`p-3 rounded-lg text-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>▼</button>
        <button onClick={() => move(1)} className={`p-3 rounded-lg text-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>▶</button>
        <button onClick={hardDrop} className={`p-3 rounded-lg text-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>⬇️</button>
        <button onClick={hold} disabled={!canHold} className={`p-3 rounded-lg text-xl disabled:opacity-50 ${darkMode ? 'bg-purple-700 text-white' : 'bg-purple-200 text-purple-700'}`}>📦</button>
      </div>

      <div className="flex gap-2 mt-4">
        {!isPlaying || gameOver ? (
          <button onClick={startGame} className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold shadow-md">
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>) : (<button onClick={() => setIsPaused(!isPaused)} className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold shadow-md">
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
        )}
      </div>

      <p className={`mt-3 text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        ← → Move | ↑ Rotate | Space: Drop | C: Hold | P: Pause
      </p>
    </div>
  );
}
