import { useTranslation } from 'react-i18next';
import { useState, useCallback, useEffect } from 'react';

type Cell = 'X' | 'O' | null;
type Mode = 'pvp' | 'ai';

function checkWinner(board: Cell[]): { winner: Cell; line: number[] } | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

function minimax(board: Cell[], isMaximizing: boolean): number {
  const result = checkWinner(board);
  if (result?.winner === 'O') return 10;
  if (result?.winner === 'X') return -10;
  if (board.every(c => c !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function getAIMove(board: Cell[]): number {
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      const score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

interface Props { darkMode: boolean; }

export default function TicTacToe({ darkMode }: Props) {
  const { t } = useTranslation();
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [mode, setMode] = useState<Mode>('ai');
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState("X's turn");

  const checkEnd = useCallback((b: Cell[]) => {
    const result = checkWinner(b);
    if (result) {
      setWinLine(result.line);
      setGameOver(true);
      setStatus(`${result.winner} wins! 🎉`);
      setScores(prev => ({ ...prev, [result.winner!]: prev[result.winner!] + 1 }));
      return true;
    }
    if (b.every(c => c !== null)) {
      setGameOver(true);
      setStatus("It's a draw! 🤝");
      setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
      return true;
    }
    return false;
  }, []);

  const handleClick = useCallback((index: number) => {
    if (board[index] || gameOver) return;
    if (mode === 'ai' && turn === 'O') return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    if (!checkEnd(newBoard)) {
      const next = turn === 'X' ? 'O' : 'X';
      setTurn(next);
      setStatus(`${next}'s turn`);
    }
  }, [board, turn, gameOver, mode, checkEnd]);

  // AI move
  useEffect(() => {
    if (mode === 'ai' && turn === 'O' && !gameOver) {
      const timer = setTimeout(() => {
        const move = getAIMove([...board]);
        if (move !== -1) {
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);
          if (!checkEnd(newBoard)) {
            setTurn('X');
            setStatus("X's turn");
          }
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [turn, mode, gameOver, board, checkEnd]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinLine(null);
    setGameOver(false);
    setStatus("X's turn");
  };

  const changeMode = (m: Mode) => {
    setMode(m);
    resetGame();
    setScores({ X: 0, O: 0, draw: 0 });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Mode */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => changeMode('ai')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            mode === 'ai'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >🤖 vs AI</button>
        <button
          onClick={() => changeMode('pvp')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            mode === 'pvp'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >👥 2 Players</button>
      </div>

      {/* Scores */}
      <div className={`flex gap-6 mb-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span className="text-blue-500">X: {scores.X}</span>
        <span className="text-gray-400">Draw: {scores.draw}</span>
        <span className="text-red-500">O: {scores.O}</span>
      </div>

      {/* Status */}
      <div className={`text-xl font-bold mb-6 px-4 py-2 rounded-lg ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 shadow-sm'
      }`}>
        {status}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((cell, i) => {
          const isWin = winLine?.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-xl text-4xl sm:text-5xl font-extrabold transition-all duration-200 ${
                cell === null
                  ? darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 border-2 border-gray-600'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
                  : isWin
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-emerald-300 scale-105'
                    : darkMode
                      ? 'bg-gray-700 border-2 border-gray-500'
                      : 'bg-white border-2 border-gray-200 shadow-sm'
              } ${cell === null && !gameOver ? 'hover:scale-105 cursor-pointer' : ''}`}
            >
              <span className={`${
                cell === 'X' ? 'text-blue-500' : cell === 'O' ? 'text-red-500' : ''
              } ${isWin ? 'text-white' : ''}`}>
                {cell}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={resetGame}
        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-md"
      >{t('auto.learning.s533_new_round', 'New Round')}</button>
    </div>
  );
}
