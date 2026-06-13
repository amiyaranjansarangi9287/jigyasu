import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

const WORD_LISTS: Record<string, string[]> = {
  Animals: ['TIGER', 'ELEPHANT', 'PEACOCK', 'COBRA', 'MONKEY', 'RHINO', 'DOLPHIN', 'EAGLE', 'CROCODILE', 'CHEETAH', 'LION', 'LANGUR'],
  Nature: ['MOUNTAIN', 'RIVER', 'OCEAN', 'FOREST', 'DESERT', 'ISLAND', 'VALLEY', 'MEADOW', 'CANYON', 'GLACIER', 'VOLCANO', 'BEACH'],
  Space: ['PLANET', 'GALAXY', 'COMET', 'ASTEROID', 'NEBULA', 'STAR', 'MOON', 'ROCKET', 'ORBIT', 'COSMOS', 'METEOR', 'SATURN'],
  Food: ['SAMOSA', 'BIRYANI', 'DOSA', 'CHAPATI', 'LADDU', 'JALEBI', 'POHA', 'IDLI', 'VADA', 'PONGAL', 'ROTI', 'DAAL'],
  Sports: ['CRICKET', 'HOCKEY', 'KABADDI', 'KHOKHO', 'BADMINTON', 'TENNIS', 'VOLLEYBALL', 'SWIMMING', 'CYCLING', 'ATHLETICS', 'ARCHERY', 'BOXING'],
};

type Difficulty = 'easy' | 'medium' | 'hard';
const GRID_SIZE: Record<Difficulty, number> = { easy: 10, medium: 12, hard: 15 };
const WORD_COUNT: Record<Difficulty, number> = { easy: 5, medium: 7, hard: 10 };

const DIRECTIONS = [
  [0, 1], [1, 0], [1, 1], [-1, 1], // right, down, diag-down-right, diag-up-right
  [0, -1], [-1, 0], [-1, -1], [1, -1], // left, up, diag-up-left, diag-down-left
];

function generateGrid(words: string[], size: number): { grid: string[][]; placements: Map<string, [number, number][]> } {
  const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
  const placements = new Map<string, [number, number][]>();

  const placeWord = (word: string): boolean => {
    const shuffledDirs = DIRECTIONS.sort(() => Math.random() - 0.5);
    const attempts: [number, number][] = [];
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) attempts.push([r, c]);
    attempts.sort(() => Math.random() - 0.5);

    for (const [sr, sc] of attempts) {
      for (const [dr, dc] of shuffledDirs) {
        const er = sr + dr * (word.length - 1);
        const ec = sc + dc * (word.length - 1);
        if (er < 0 || er >= size || ec < 0 || ec >= size) continue;

        let canPlace = true;
        const cells: [number, number][] = [];
        for (let i = 0; i< word.length; i++) {
          const r = sr + dr * i;
          const c = sc + dc * i;
          if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
            canPlace = false;
            break;
          }
          cells.push([r, c]);
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[sr + dr * i][sc + dc * i] = word[i];
          }
          placements.set(word, cells);
          return true;
        }
      }
    }
    return false;
  };

  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  for (const word of sortedWords) placeWord(word);

  // Fill empty cells with random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (grid[r][c] === '') grid[r][c] = letters[Math.floor(Math.random() * letters.length)];

  return { grid, placements };
}

interface Props { darkMode: boolean; }

export default function WordSearch({ darkMode }: Props) {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>('Animals');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [words, setWords] = useState<string[]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [placements, setPlacements] = useState<Map<string, [number, number][]>>(new Map());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selection, setSelection] = useState<[number, number][]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const initGame = useCallback(() => {
    const size = GRID_SIZE[difficulty];
    const count = WORD_COUNT[difficulty];
    const allWords = WORD_LISTS[category].filter(w =>w.length<= size);
    const shuffled = [...allWords].sort(() => Math.random() - 0.5).slice(0, count);
    const { grid: newGrid, placements: newPlacements } = generateGrid(shuffled, size);
    setWords(shuffled);
    setGrid(newGrid);
    setPlacements(newPlacements);
    setFoundWords(new Set());
    setSelection([]);
  }, [category, difficulty]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCellMouseDown = (r: number, c: number) => {
    setIsSelecting(true);
    setSelection([[r, c]]);
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (!isSelecting) return;
    const start = selection[0];
    if (!start) return;

    const dr = Math.sign(r - start[0]);
    const dc = Math.sign(c - start[1]);
    
    // Only allow straight lines
    if (dr !== 0 && dc !== 0 && Math.abs(r - start[0]) !== Math.abs(c - start[1])) return;
    if (dr === 0 && dc === 0) { setSelection([start]); return; }

    const newSelection: [number, number][] = [];
    let cr = start[0], cc = start[1];
    while (true) {
      newSelection.push([cr, cc]);
      if (cr === r && cc === c) break;
      cr += dr;
      cc += dc;
    }
    setSelection(newSelection);
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    const selectedWord = selection.map(([r, c]) => grid[r][c]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    for (const word of words) {
      if ((word === selectedWord || word === reversedWord) && !foundWords.has(word)) {
        setFoundWords(prev => new Set([...prev, word]));
        break;
      }
    }
    setSelection([]);
  };

  const isSelected = (r: number, c: number) => selection.some(([sr, sc]) => sr === r && sc === c);

  const isFound = (r: number, c: number) => {
    for (const word of foundWords) {
      const cells = placements.get(word);
      if (cells?.some(([wr, wc]) => wr === r && wc === c)) return true;
    }
    return false;
  };

  const allFound = foundWords.size === words.length && words.length >0;
  const size = GRID_SIZE[difficulty];

  return (<div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      {/* Category */}
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {Object.keys(WORD_LISTS).map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              category === cat
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Difficulty */}
      <div className="flex gap-2 mb-4">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-4 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              difficulty === d
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {allFound && (
        <div className="mb-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg animate-bounce shadow-lg">🎉 All words found!</div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Grid */}
        <div
          className={`rounded-xl p-2 select-none ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {grid.map((row, r) =>row.map((cell, c) => (<div
                  key={`${r}-${c}`}
                  onMouseDown={() => handleCellMouseDown(r, c)}
                  onMouseEnter={() => handleCellMouseEnter(r, c)}
                  onTouchStart={() => handleCellMouseDown(r, c)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-sm sm:text-base rounded cursor-pointer transition-all ${
                    isSelected(r, c)
                      ? 'bg-blue-500 text-white scale-110'
                      : isFound(r, c)
                        ? 'bg-emerald-400 text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {cell}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Word list */}
        <div className={`flex-1 p-4 rounded-xl min-w-[150px] ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h3 className={`font-bold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Find these words ({foundWords.size}/{words.length})
          </h3>
          <div className="space-y-1">
            {words.map(word => (
              <div
                key={word}
                className={`text-sm font-medium py-1 px-2 rounded transition-all ${
                  foundWords.has(word)
                    ? 'line-through text-emerald-500 bg-emerald-500/10'
                    : darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {foundWords.has(word) ? '✓ ' : ''}{word}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={initGame}
        className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md"
      >{t('auto.learning.s534_new_puzzle', 'New Puzzle')}</button>

      <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Click and drag to select words • Words can go in any direction
      </p>
    </div>
  );
}
