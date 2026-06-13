import { useTranslation } from 'react-i18next';
import { useState, useCallback, useEffect, useRef } from 'react';

type CellState = 'hidden' | 'revealed' | 'flagged';
interface Cell {
  isMine: boolean;
  adjacentMines: number;
  state: CellState;
}
type Board = Cell[][];
type Difficulty = 'easy' | 'medium' | 'hard';

const CONFIG: Record<Difficulty, { rows: number; cols: number; mines: number }> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

function createBoard(rows: number, cols: number, mines: number, firstClick?: [number, number]): Board {
  const board: Board = Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({ isMine: false, adjacentMines: 0, state: 'hidden' as CellState }))
  );

  // Place mines avoiding first click
  const positions: [number, number][] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (!firstClick || Math.abs(r - firstClick[0]) > 1 || Math.abs(c - firstClick[1]) >1)
        positions.push([r, c]);
  
  positions.sort(() => Math.random() - 0.5);
  for (let i = 0; i< Math.min(mines, positions.length); i++) {
    const [r, c] = positions[i];
    board[r][c].isMine = true;
  }

  // Calculate adjacent mines
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc< cols && board[nr][nc].isMine) count++;
        }
      board[r][c].adjacentMines = count;
    }
  }

  return board;
}

const NUMBER_COLORS = ['', 'text-blue-600', 'text-green-600', 'text-red-600', 'text-purple-800', 'text-red-800', 'text-teal-600', 'text-black', 'text-gray-600'];

interface Props { darkMode: boolean; }

export default function Minesweeper({ darkMode }: Props) {
  const { t } = useTranslation();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<Board | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [flagCount, setFlagCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  const config = CONFIG[difficulty];

  const initGame = useCallback((diff: Difficulty) => {
    const cfg = CONFIG[diff];
    setBoard(createBoard(cfg.rows, cfg.cols, cfg.mines));
    setDifficulty(diff);
    setGameOver(false);
    setWon(false);
    setFirstClick(true);
    setFlagCount(0);
    setTimer(0);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    initGame('easy');
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [initGame]);

  useEffect(() => {
    if (isPlaying && !gameOver && !won) {
      timerRef.current = window.setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, gameOver, won]);

  const reveal = useCallback((board: Board, r: number, c: number): Board => {
    const { rows, cols } = config;
    if (r < 0 || r >= rows || c< 0 || c >= cols) return board;
    const cell = board[r][c];
    if (cell.state !== 'hidden') return board;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[r][c].state = 'revealed';

    if (newBoard[r][c].adjacentMines === 0 && !newBoard[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (dr !== 0 || dc !== 0)
            reveal(newBoard, r + dr, c + dc).forEach((row, ri) =>
              row.forEach((cell, ci) => { newBoard[ri][ci] = cell; })
            );
    }

    return newBoard;
  }, [config]);

  const handleClick = (r: number, c: number) => {
    if (!board || gameOver || won) return;
    const cell = board[r][c];
    if (cell.state === 'flagged') return;

    if (!isPlaying) setIsPlaying(true);

    let newBoard = board;
    if (firstClick) {
      newBoard = createBoard(config.rows, config.cols, config.mines, [r, c]);
      setFirstClick(false);
    }

    if (newBoard[r][c].isMine) {
      // Game over - reveal all mines
      newBoard = newBoard.map(row => row.map(cell => 
        cell.isMine ? { ...cell, state: 'revealed' as CellState } : cell
      ));
      setBoard(newBoard);
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    newBoard = reveal(newBoard, r, c);
    setBoard(newBoard);

    // Check win
    const hiddenNonMines = newBoard.flat().filter(c => c.state === 'hidden' && !c.isMine).length;
    if (hiddenNonMines === 0) {
      setWon(true);
      setIsPlaying(false);
    }
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (!board || gameOver || won) return;
    const cell = board[r][c];
    if (cell.state === 'revealed') return;

    if (!isPlaying) setIsPlaying(true);

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    if (cell.state === 'flagged') {
      newBoard[r][c].state = 'hidden';
      setFlagCount(f => f - 1);
    } else {
      newBoard[r][c].state = 'flagged';
      setFlagCount(f => f + 1);
    }
    setBoard(newBoard);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!board) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto overflow-x-auto">
      {/* Difficulty */}
      <div className="flex gap-2 mb-4">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => initGame(d)}
            className={`px-4 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              difficulty === d
                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)} ({CONFIG[d].mines} 💣)
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className={`flex gap-6 mb-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span>💣 {config.mines - flagCount}</span>
        <span>🚩 {flagCount}</span>
        <span>⏱️ {formatTime(timer)}</span>
      </div>

      {(gameOver || won) && (
        <div className={`mb-4 px-6 py-3 rounded-xl font-bold text-lg shadow-lg ${
          won ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        }`}>
          {won ? `🎉 You won in ${formatTime(timer)}!` : '💥 BOOM! Game Over'}
        </div>
      )}

      {/* Board */}
      <div className={`rounded-xl p-1.5 inline-block ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))` }}
        >
          {board.map((row, r) =>row.map((cell, c) => (<button
                key={`${r}-${c}`}
                onClick={() => handleClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
                className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm font-bold transition-all rounded-sm ${
                  cell.state === 'revealed'
                    ? cell.isMine
                      ? 'bg-red-500 text-white'
                      : darkMode ? 'bg-gray-600' : 'bg-gray-100'
                    : cell.state === 'flagged'
                      ? darkMode ? 'bg-gray-500' : 'bg-yellow-200'
                      : darkMode
                        ? 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600'
                        : 'bg-gray-400 hover:bg-gray-350 active:bg-gray-300 shadow-sm'
                } ${cell.state === 'revealed' && !cell.isMine ? NUMBER_COLORS[cell.adjacentMines] : ''}`}
              >
                {cell.state === 'flagged' ? '🚩' :
                 cell.state === 'revealed' ? (
                   cell.isMine ? '💣' : (cell.adjacentMines > 0 ? cell.adjacentMines : '')
                 ) : ''}
              </button>
            ))
          )}
        </div>
      </div>

      <button
        onClick={() => initGame(difficulty)}
        className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all shadow-md"
      >{t('auto.learning.s525_new_game', 'New Game')}</button>

      <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Left-click to reveal • Right-click to flag
      </p>
    </div>
  );
}
