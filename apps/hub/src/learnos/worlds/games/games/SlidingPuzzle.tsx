import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';

type Size = 3 | 4 | 5;

function createSolvedBoard(size: Size): number[] {
  const board = [];
  for (let i = 1; i < size * size; i++) board.push(i);
  board.push(0);
  return board;
}

function isSolvable(board: number[], size: Size): boolean {
  let inversions = 0;
  const flat = board.filter(n =>n !== 0);
  for (let i = 0; i< flat.length; i++)
    for (let j = i + 1; j < flat.length; j++)
      if (flat[i] > flat[j]) inversions++;

  if (size % 2 === 1) return inversions % 2 === 0;
  const emptyRow = Math.floor(board.indexOf(0) / size);
  const fromBottom = size - emptyRow;
  return (fromBottom % 2 === 0) === (inversions % 2 === 1);
}

function shuffle(size: Size): number[] {
  let board: number[];
  do {
    board = createSolvedBoard(size).sort(() => Math.random() - 0.5);
  } while (!isSolvable(board, size) || isSolved(board, size));
  return board;
}

function isSolved(board: number[], size: Size): boolean {
  for (let i = 0; i < size * size - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[size * size - 1] === 0;
}

interface Props { darkMode: boolean; }

export default function SlidingPuzzle({ darkMode }: Props) {
  const { t } = useTranslation();
  const [size, setSize] = useState<Size>(4);
  const [board, setBoard] = useState<number[]>(() => shuffle(4));
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [solved, setSolved] = useState(false);
  const timerRef = useRef<number | null>(null);

  const initGame = (s: Size) => {
    setSize(s);
    setBoard(shuffle(s));
    setMoves(0);
    setTimer(0);
    setIsPlaying(false);
    setSolved(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying]);

  const handleClick = (index: number) => {
    if (solved) return;
    const emptyIndex = board.indexOf(0);
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (!isAdjacent) return;

    if (!isPlaying) setIsPlaying(true);

    const newBoard = [...board];
    [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
    setBoard(newBoard);
    setMoves(m => m + 1);

    if (isSolved(newBoard, size)) {
      setSolved(true);
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const getColor = (_num: number): string => {
    return '';
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Size selector */}
      <div className="flex gap-2 mb-4">
        {([3, 4, 5] as Size[]).map(s => (
          <button
            key={s}
            onClick={() => initGame(s)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              size === s
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {s}×{s}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className={`flex gap-6 mb-6 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span>⏱️ {formatTime(timer)}</span>
        <span>🔄 {moves} moves</span>
      </div>

      {/* Win */}
      {solved && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg animate-bounce shadow-lg">
          🎉 Solved in {moves} moves ({formatTime(timer)})!
        </div>
      )}

      {/* Board */}
      <div
        className="grid gap-1.5 sm:gap-2 mb-6"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {board.map((num, i) => {
          const isCorrect = num !== 0 && num === i + 1;
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={num === 0}
              className={`w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl text-xl sm:text-2xl font-bold transition-all duration-200 ${
                num === 0
                  ? darkMode ? 'bg-gray-800' : 'bg-gray-100'
                  : isCorrect
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md'
                    : darkMode
                      ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600 shadow-md border border-gray-500'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500 shadow-md'
              } ${num !== 0 ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''} ${getColor(num)}`}
            >
              {num !== 0 ? num : ''}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => initGame(size)}
        className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md"
      >{t('auto.learning.s528_shuffle', 'Shuffle')}</button>
    </div>
  );
}
