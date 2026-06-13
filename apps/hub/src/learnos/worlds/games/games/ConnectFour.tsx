import { useTranslation } from 'react-i18next';
import { useState, useCallback, useEffect } from 'react';

const ROWS = 6;
const COLS = 7;

type Cell = 0 | 1 | 2; // 0 = empty, 1 = red, 2 = yellow
type Board = Cell[][];
type Mode = 'pvp' | 'ai';

function createBoard(): Board {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
}

function checkWin(board: Board, player: Cell): [number, number][] | null {
  // Check all directions
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== player) continue;
      
      for (const [dr, dc] of directions) {
        const line: [number, number][] = [[r, c]];
        for (let i = 1; i < 4; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          if (nr < 0 || nr >= ROWS || nc< 0 || nc >= COLS) break;
          if (board[nr][nc] !== player) break;
          line.push([nr, nc]);
        }
        if (line.length >= 4) return line;
      }
    }
  }
  return null;
}

function getAvailableRow(board: Board, col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) return r;
  }
  return -1;
}

function isBoardFull(board: Board): boolean {
  return board[0].every(cell => cell !== 0);
}

// Simple AI
function getAIMove(board: Board): number {
  // Check for winning move
  for (let c = 0; c < COLS; c++) {
    const r = getAvailableRow(board, c);
    if (r === -1) continue;
    const testBoard = board.map(row => [...row]);
    testBoard[r][c] = 2;
    if (checkWin(testBoard, 2)) return c;
  }

  // Block opponent's winning move
  for (let c = 0; c < COLS; c++) {
    const r = getAvailableRow(board, c);
    if (r === -1) continue;
    const testBoard = board.map(row => [...row]);
    testBoard[r][c] = 1;
    if (checkWin(testBoard, 1)) return c;
  }

  // Prefer center column
  const centerCol = Math.floor(COLS / 2);
  if (getAvailableRow(board, centerCol) !== -1) return centerCol;

  // Random available column
  const available = [];
  for (let c = 0; c < COLS; c++) {
    if (getAvailableRow(board, c) !== -1) available.push(c);
  }
  return available[Math.floor(Math.random() * available.length)];
}

interface Props { darkMode: boolean; }

export default function ConnectFour({ darkMode }: Props) {
  const { t } = useTranslation();
  const [board, setBoard] = useState<Board>(createBoard);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [mode, setMode] = useState<Mode>('ai');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Cell>(0);
  const [winLine, setWinLine] = useState<[number, number][] | null>(null);
  const [scores, setScores] = useState({ red: 0, yellow: 0, draw: 0 });
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const dropPiece = useCallback((col: number) => {
    if (gameOver || isAnimating) return;
    const row = getAvailableRow(board, col);
    if (row === -1) return;

    setIsAnimating(true);
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    setTimeout(() => {
      const win = checkWin(newBoard, currentPlayer);
      if (win) {
        setWinLine(win);
        setWinner(currentPlayer);
        setGameOver(true);
        setScores(prev => ({
          ...prev,
          [currentPlayer === 1 ? 'red' : 'yellow']: prev[currentPlayer === 1 ? 'red' : 'yellow'] + 1
        }));
      } else if (isBoardFull(newBoard)) {
        setGameOver(true);
        setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
      } else {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
      setIsAnimating(false);
    }, 300);
  }, [board, currentPlayer, gameOver, isAnimating]);

  // AI move
  useEffect(() => {
    if (mode === 'ai' && currentPlayer === 2 && !gameOver && !isAnimating) {
      const timer = setTimeout(() => {
        const col = getAIMove(board);
        if (col !== undefined) dropPiece(col);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, mode, gameOver, board, dropPiece, isAnimating]);

  const resetGame = () => {
    setBoard(createBoard());
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(0);
    setWinLine(null);
  };

  const changeMode = (m: Mode) => {
    setMode(m);
    resetGame();
    setScores({ red: 0, yellow: 0, draw: 0 });
  };

  const isWinCell = (r: number, c: number) =>winLine?.some(([wr, wc]) => wr === r && wc === c);

  return (<div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Mode */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => changeMode('ai')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            mode === 'ai'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >🤖 vs AI</button>
        <button
          onClick={() => changeMode('pvp')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            mode === 'pvp'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >👥 2 Players</button>
      </div>

      {/* Scores */}
      <div className={`flex gap-6 mb-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span className="text-red-500">🔴 Red: {scores.red}</span>
        <span className="text-gray-400">Draw: {scores.draw}</span>
        <span className="text-yellow-500">🟡 Yellow: {scores.yellow}</span>
      </div>

      {/* Status */}
      <div className={`text-lg font-bold mb-4 px-4 py-2 rounded-lg ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 shadow-sm'
      }`}>
        {gameOver
          ? winner
            ? `${winner === 1 ? '🔴 Red' : '🟡 Yellow'} wins! 🎉`
            : "It's a draw! 🤝"
          : `${currentPlayer === 1 ? '🔴 Red' : '🟡 Yellow'}'s turn`}
      </div>

      {/* Board */}
      <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-900' : 'bg-blue-600'}`}>
        {/* Column indicators */}
        <div className="flex gap-1 mb-1">
          {Array(COLS).fill(null).map((_, c) => (
            <div
              key={c}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
              onMouseEnter={() => setHoverCol(c)}
              onMouseLeave={() => setHoverCol(null)}
              onClick={() => !isAnimating && dropPiece(c)}
            >
              {hoverCol === c && !gameOver && getAvailableRow(board, c) !== -1 && (
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full opacity-50 ${
                  currentPlayer === 1 ? 'bg-red-500' : 'bg-yellow-400'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-1">
          {board.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((cell, c) => (
                <div
                  key={c}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                    darkMode ? 'bg-blue-950' : 'bg-blue-800'
                  }`}
                  onMouseEnter={() => setHoverCol(c)}
                  onMouseLeave={() => setHoverCol(null)}
                  onClick={() => !isAnimating && dropPiece(c)}
                >
                  {cell !== 0 && (
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all ${
                        cell === 1 ? 'bg-red-500' : 'bg-yellow-400'
                      } ${isWinCell(r, c) ? 'ring-4 ring-white animate-pulse' : 'shadow-inner'}`}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={resetGame}
        className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md"
      >{t('auto.learning.s518_new_game', 'New Game')}</button>

      <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Click a column to drop your piece • Connect 4 to win!
      </p>
    </div>
  );
}
