import { useTranslation } from 'react-i18next';
import { useState, useCallback, useEffect, useRef } from 'react';

type Cell = number | null;
type Notes = Set<number>;
type Board = Cell[][];
type NotesBoard = Notes[][];
type Difficulty = 'easy' | 'medium' | 'hard';

const REMOVE_COUNT: Record<Difficulty, number> = { easy: 30, medium: 40, hard: 52 };

interface GameState {
  board: Board;
  notes: NotesBoard;
}

function createEmptyNotes(): NotesBoard {
  return Array(9).fill(null).map(() =>Array(9).fill(null).map(() => new Set<number>()));
}

function cloneNotes(notes: NotesBoard): NotesBoard {
  return notes.map(row => row.map(cell => new Set(cell)));
}

function createFullBoard(): number[][] {
  const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));

  function isValid(board: number[][], row: number, col: number, num: number): boolean {
    for (let c = 0; c < 9; c++) if (board[row][c] === num) return false;
    for (let r = 0; r < 9; r++) if (board[r][col] === num) return false;
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++)
      for (let c = bc; c < bc + 3; c++)
        if (board[r][c] === num) return false;
    return true;
  }

  function fill(board: number[][]): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (const num of nums) {
            if (isValid(board, r, c, num)) {
              board[r][c] = num;
              if (fill(board)) return true;
              board[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fill(board);
  return board;
}

function generatePuzzle(difficulty: Difficulty): { puzzle: Board; solution: number[][] } {
  const solution = createFullBoard();
  const puzzle: Board = solution.map(row =>[...row]);
  const positions: [number, number][] = [];
  for (let r = 0; r< 9; r++)
    for (let c = 0; c < 9; c++)
      positions.push([r, c]);
  positions.sort(() => Math.random() - 0.5);

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= REMOVE_COUNT[difficulty]) break;
    puzzle[r][c] = null;
    removed++;
  }

  return { puzzle, solution };
}

interface Props { darkMode: boolean; }

export default function Sudoku({ darkMode }: Props) {
  const { t } = useTranslation();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameData, setGameData] = useState(() => generatePuzzle('easy'));
  const [board, setBoard] = useState<Board>(() => gameData.puzzle.map(row => [...row]));
  const [notes, setNotes] = useState<NotesBoard>(createEmptyNotes);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [isOriginal, setIsOriginal] = useState<boolean[][]>(() =>
    gameData.puzzle.map(row => row.map(cell => cell !== null))
  );
  const [solved, setSolved] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [notesMode, setNotesMode] = useState(false);
  const [history, setHistory] = useState<GameState[]>([]);
  const [future, setFuture] = useState<GameState[]>([]);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  const initGame = (diff: Difficulty) => {
    const data = generatePuzzle(diff);
    setGameData(data);
    setBoard(data.puzzle.map(row => [...row]));
    setNotes(createEmptyNotes());
    setIsOriginal(data.puzzle.map(row => row.map(cell => cell !== null)));
    setSelected(null);
    setErrors(new Set());
    setDifficulty(diff);
    setSolved(false);
    setHintsUsed(0);
    setHistory([]);
    setFuture([]);
    setTimer(0);
    setIsPaused(false);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (isPlaying && !isPaused && !solved) {
      timerRef.current = window.setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, isPaused, solved]);

  const validate = useCallback((b: Board): Set<string> => {
    const errs = new Set<string>();
    for (let r = 0; r< 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = b[r][c];
        if (val === null) continue;
        for (let c2 = 0; c2 < 9; c2++) {
          if (c2 !== c && b[r][c2] === val) {
            errs.add(`${r}-${c}`);
            errs.add(`${r}-${c2}`);
          }
        }
        for (let r2 = 0; r2 < 9; r2++) {
          if (r2 !== r && b[r2][c] === val) {
            errs.add(`${r}-${c}`);
            errs.add(`${r2}-${c}`);
          }
        }
        const br = Math.floor(r / 3) * 3;
        const bc = Math.floor(c / 3) * 3;
        for (let r2 = br; r2 < br + 3; r2++)
          for (let c2 = bc; c2 < bc + 3; c2++)
            if ((r2 !== r || c2 !== c) && b[r2][c2] === val) {
              errs.add(`${r}-${c}`);
              errs.add(`${r2}-${c2}`);
            }
      }
    }
    return errs;
  }, []);

  const saveHistory = () => {
    setHistory(prev => [...prev, { 
      board: board.map(row => [...row]), 
      notes: cloneNotes(notes) 
    }]);
    setFuture([]);
  };

  const handleNumber = (num: number) => {
    if (!selected || solved || isPaused) return;
    const [r, c] = selected;
    if (isOriginal[r][c]) return;

    if (!isPlaying) setIsPlaying(true);
    saveHistory();

    if (notesMode && num !== 0) {
      const newNotes = cloneNotes(notes);
      if (newNotes[r][c].has(num)) {
        newNotes[r][c].delete(num);
      } else {
        newNotes[r][c].add(num);
      }
      setNotes(newNotes);
    } else {
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = num === 0 ? null : num;
      setBoard(newBoard);
      setErrors(validate(newBoard));
      
      // Clear notes when placing a number
      if (num !== 0) {
        const newNotes = cloneNotes(notes);
        newNotes[r][c].clear();
        // Remove this number from notes in same row, column, box
        for (let i = 0; i < 9; i++) {
          newNotes[r][i].delete(num);
          newNotes[i][c].delete(num);
        }
        const br = Math.floor(r / 3) * 3;
        const bc = Math.floor(c / 3) * 3;
        for (let r2 = br; r2 < br + 3; r2++)
          for (let c2 = bc; c2 < bc + 3; c2++)
            newNotes[r2][c2].delete(num);
        setNotes(newNotes);
      }

      const allFilled = newBoard.every(row => row.every(cell => cell !== null));
      if (allFilled && validate(newBoard).size === 0) {
        setSolved(true);
        setIsPlaying(false);
      }
    }
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture(f => [...f, { board: board.map(row => [...row]), notes: cloneNotes(notes) }]);
    setBoard(prev.board);
    setNotes(prev.notes);
    setHistory(h => h.slice(0, -1));
    setErrors(validate(prev.board));
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[future.length - 1];
    setHistory(h => [...h, { board: board.map(row => [...row]), notes: cloneNotes(notes) }]);
    setBoard(next.board);
    setNotes(next.notes);
    setFuture(f => f.slice(0, -1));
    setErrors(validate(next.board));
  };

  const handleHint = () => {
    if (solved || isPaused) return;
    const emptyCells: [number, number][] = [];
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (board[r][c] === null) emptyCells.push([r, c]);
    if (emptyCells.length === 0) return;
    
    saveHistory();
    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = gameData.solution[r][c];
    const newOriginal = isOriginal.map(row => [...row]);
    newOriginal[r][c] = true;
    setBoard(newBoard);
    setIsOriginal(newOriginal);
    setErrors(validate(newBoard));
    setHintsUsed(h => h + 1);
    setSelected([r, c]);

    if (!isPlaying) setIsPlaying(true);

    const allFilled = newBoard.every(row => row.every(cell => cell !== null));
    if (allFilled && validate(newBoard).size === 0) {
      setSolved(true);
      setIsPlaying(false);
    }
  };

  const checkProgress = () => {
    let correctCount = 0;
    let wrongCount = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== null && !isOriginal[r][c]) {
          if (board[r][c] === gameData.solution[r][c]) {
            correctCount++;
          } else {
            wrongCount++;
          }
        }
      }
    }
    alert(`✅ Correct: ${correctCount}\n❌ Wrong: ${wrongCount}`);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const sameValue = selected && board[selected[0]][selected[1]];

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Difficulty */}
      <div className="flex gap-2 mb-4">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => initGame(d)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              difficulty === d
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {/* Timer & Stats */}
      <div className={`flex gap-4 mb-4 text-sm font-semibold items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span className="flex items-center gap-1">
          ⏱️ {formatTime(timer)}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`ml-1 px-2 py-0.5 rounded text-xs ${
              isPaused
                ? 'bg-emerald-500 text-white'
                : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
        </span>
        <span>💡 Hints: {hintsUsed}</span>
      </div>

      {solved && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg animate-bounce shadow-lg">
          🎉 Solved in {formatTime(timer)}! ({hintsUsed} hints)
        </div>
      )}

      {/* Paused overlay */}
      {isPaused && !solved && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold shadow-lg">
          ⏸️ Game Paused - Click play to resume
        </div>
      )}

      {/* Board */}
      <div className={`rounded-xl overflow-hidden shadow-2xl border-2 mb-4 ${darkMode ? 'border-gray-600' : 'border-gray-800'} ${isPaused ? 'blur-md' : ''}`}>
        {Array(9).fill(null).map((_, r) => (
          <div key={r} className="flex">
            {Array(9).fill(null).map((_, c) => {
              const val = board[r][c];
              const cellNotes = notes[r][c];
              const isOrig = isOriginal[r][c];
              const isSel = selected?.[0] === r && selected?.[1] === c;
              const isErr = errors.has(`${r}-${c}`);
              const isSameRow = selected && selected[0] === r;
              const isSameCol = selected && selected[1] === c;
              const isSameBox = selected &&
                Math.floor(selected[0] / 3) === Math.floor(r / 3) &&
                Math.floor(selected[1] / 3) === Math.floor(c / 3);
              const isSameVal = sameValue && val === sameValue && val !== null;

              let bg = darkMode ? 'bg-gray-800' : 'bg-white';
              if (isSameRow || isSameCol || isSameBox) bg = darkMode ? 'bg-gray-700' : 'bg-blue-50';
              if (isSameVal) bg = darkMode ? 'bg-blue-900' : 'bg-blue-100';
              if (isSel) bg = darkMode ? 'bg-blue-800' : 'bg-blue-200';
              if (isErr && !isOrig) bg = 'bg-red-100';

              const borderR = (c + 1) % 3 === 0 && c < 8 ? (darkMode ? 'border-r-2 border-r-gray-500' : 'border-r-2 border-r-gray-800') : 'border-r border-r-gray-300';
              const borderB = (r + 1) % 3 === 0 && r < 8 ? (darkMode ? 'border-b-2 border-b-gray-500' : 'border-b-2 border-b-gray-800') : 'border-b border-b-gray-300';

              return (
                <button
                  key={c}
                  onClick={() => !isPaused && setSelected([r, c])}
                  className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-base sm:text-lg font-bold transition-colors ${bg} ${borderR} ${borderB} ${
                    isOrig
                      ? darkMode ? 'text-gray-100' : 'text-gray-900'
                      : isErr
                        ? 'text-red-500'
                        : darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  {val ? (
                    val
                  ) : cellNotes.size > 0 ? (
                    <div className="grid grid-cols-3 gap-0 w-full h-full text-[8px] sm:text-[9px] p-0.5">
                      {[1,2,3,4,5,6,7,8,9].map(n => (
                        <span key={n} className={`flex items-center justify-center ${
                          cellNotes.has(n) 
                            ? darkMode ? 'text-blue-400' : 'text-blue-500'
                            : 'text-transparent'
                        }`}>
                          {n}
                        </span>
                      ))}
                    </div>
                  ) : ''}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Notes mode toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setNotesMode(false)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            !notesMode
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >✏️ Normal</button>
        <button
          onClick={() => setNotesMode(true)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            notesMode
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >📝 Notes</button>
      </div>

      {/* Number pad */}
      <div className="flex gap-1.5 sm:gap-2 mb-4 flex-wrap justify-center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumber(num)}
            disabled={isPaused}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-bold text-lg transition-all hover:scale-110 disabled:opacity-50 ${
              notesMode
                ? darkMode ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 shadow-sm'
            }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleNumber(0)}
          disabled={isPaused}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-bold text-sm transition-all hover:scale-110 disabled:opacity-50 ${
            darkMode
              ? 'bg-red-900 text-red-300 hover:bg-red-800'
              : 'bg-red-100 text-red-600 hover:bg-red-200 shadow-sm'
          }`}
        >
          ✕
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={undo}
          disabled={history.length === 0 || isPaused}
          className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 ${
            darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >↩️ Undo</button>
        <button
          onClick={redo}
          disabled={future.length === 0 || isPaused}
          className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 ${
            darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >↪️ Redo</button>
        <button
          onClick={handleHint}
          disabled={isPaused}
          className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 ${
            darkMode ? 'bg-amber-700 text-amber-100 hover:bg-amber-600' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >💡 Hint</button>
        <button
          onClick={checkProgress}
          disabled={isPaused}
          className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 ${
            darkMode ? 'bg-blue-700 text-blue-100 hover:bg-blue-600' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >✅ Check</button>
        <button
          onClick={() => initGame(difficulty)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md"
        >{t('auto.learning.s531_new_puzzle', 'New Puzzle')}</button>
      </div>
    </div>
  );
}
