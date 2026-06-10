import { useState, useCallback } from 'react';
import { Trans } from "react-i18next";

function generateSudoku4(): { puzzle: number[][]; solution: number[][] } {
  // Generate a valid 4x4 Sudoku and remove some cells
  const sol: number[][] = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]];
  // Shuffle rows within bands and columns within stacks
  const perm = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
  const mapped = sol.map(row => row.map(v => perm[v - 1]));
  // Swap random rows in same band
  if (Math.random() > 0.5) [mapped[0], mapped[1]] = [mapped[1], mapped[0]];
  if (Math.random() > 0.5) [mapped[2], mapped[3]] = [mapped[3], mapped[2]];

  const puzzle = mapped.map(row => [...row]);
  // Remove cells
  const remove = 8 + Math.floor(Math.random() * 3);
  const indices = Array.from({ length: 16 }, (_, i) => i).sort(() => Math.random() - 0.5);
  for (let i = 0; i < remove; i++) {
    const r = Math.floor(indices[i] / 4), c = indices[i] % 4;
    puzzle[r][c] = 0;
  }
  return { puzzle, solution: mapped };
}

function generateKenKen(): { size: number; cells: { row: number; col: number; group: number }[]; groups: { id: number; target: string; cells: [number, number][] }[]; solution: number[][] } {
  const sol = [[1, 2, 3], [3, 1, 2], [2, 3, 1]];
  const perm = [1, 2, 3].sort(() => Math.random() - 0.5);
  const mapped = sol.map(row => row.map(v => perm[v - 1]));
  
  // Simple groups: pairs and singles
  const groups: { id: number; target: string; cells: [number, number][] }[] = [];
  const assigned = Array.from({ length: 3 }, () => Array(3).fill(-1));
  let gId = 0;
  
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (assigned[r][c] >= 0) continue;
      // Try to pair with right or below
      const dirs: [number, number][] = [];
      if (c + 1 < 3 && assigned[r][c + 1] < 0) dirs.push([r, c + 1]);
      if (r + 1 < 3 && assigned[r + 1][c] < 0) dirs.push([r + 1, c]);
      
      if (dirs.length > 0 && Math.random() > 0.3) {
        const [nr, nc] = dirs[Math.floor(Math.random() * dirs.length)];
        const a = mapped[r][c], b = mapped[nr][nc];
        const ops = [
          { op: '+', val: a + b },
          { op: '-', val: Math.abs(a - b) },
          { op: '×', val: a * b },
        ];
        const chosen = ops[Math.floor(Math.random() * ops.length)];
        groups.push({ id: gId, target: `${chosen.val}${chosen.op}`, cells: [[r, c], [nr, nc]] });
        assigned[r][c] = gId;
        assigned[nr][nc] = gId;
      } else {
        groups.push({ id: gId, target: String(mapped[r][c]), cells: [[r, c]] });
        assigned[r][c] = gId;
      }
      gId++;
    }
  }
  
  const cells = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cells.push({ row: r, col: c, group: assigned[r][c] });
  return { size: 3, cells, groups, solution: mapped };
}

export default function LogicPuzzles() {
  const [puzzleType, setPuzzleType] = useState<'sudoku' | 'kenken'>('sudoku');
  const [sudokuData, setSudokuData] = useState(() => generateSudoku4());
  const [kenkenData, setKenkenData] = useState(() => generateKenKen());
  const [grid, setGrid] = useState<number[][]>(() => sudokuData.puzzle.map(r => [...r]));
  const [kenGrid, setKenGrid] = useState<number[][]>(() => Array.from({ length: 3 }, () => Array(3).fill(0)));
  const [solved, setSolved] = useState(false);

  const checkSudoku = useCallback(() => {
    const match = grid.every((row, r) => row.every((v, c) => v === sudokuData.solution[r][c]));
    setSolved(match);
    return match;
  }, [grid, sudokuData]);

  const checkKenKen = useCallback(() => {
    const match = kenGrid.every((row, r) => row.every((v, c) => v === kenkenData.solution[r][c]));
    setSolved(match);
    return match;
  }, [kenGrid, kenkenData]);

  const newSudoku = () => { const d = generateSudoku4(); setSudokuData(d); setGrid(d.puzzle.map(r => [...r])); setSolved(false); };
  const newKenKen = () => { const d = generateKenKen(); setKenkenData(d); setKenGrid(Array.from({ length: 3 }, () => Array(3).fill(0))); setSolved(false); };

  const setCell = (r: number, c: number, v: number) => {
    if (puzzleType === 'sudoku') {
      if (sudokuData.puzzle[r][c] !== 0) return;
      const next = grid.map(row => [...row]);
      next[r][c] = v;
      setGrid(next);
    } else {
      const next = kenGrid.map(row => [...row]);
      next[r][c] = v;
      setKenGrid(next);
    }
    setSolved(false);
  };

  const size = puzzleType === 'sudoku' ? 4 : 3;
  const currentGrid = puzzleType === 'sudoku' ? grid : kenGrid;

  const hasConflict = useCallback((r: number, c: number): boolean => {
    const val = currentGrid[r][c];
    if (val === 0) return false;
    for (let i = 0; i < size; i++) { if (i !== c && currentGrid[r][i] === val) return true; if (i !== r && currentGrid[i][c] === val) return true; }
    if (puzzleType === 'sudoku') {
      const br = Math.floor(r / 2) * 2, bc = Math.floor(c / 2) * 2;
      for (let dr = 0; dr < 2; dr++) for (let dc = 0; dc < 2; dc++) { if (br + dr !== r || bc + dc !== c) { if (currentGrid[br + dr][bc + dc] === val) return true; } }
    }
    return false;
  }, [currentGrid, size, puzzleType]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.logicpuzzles.logic_puzzles">🧩 Logic Puzzles</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.logicpuzzles.sudoku_and_kenken_pure_logical">Sudoku and KenKen — pure logical reasoning!</Trans></p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${puzzleType === 'sudoku' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`}
          onClick={() => { setPuzzleType('sudoku'); newSudoku(); }}><Trans i18nKey="auto.logicpuzzles.mini_sudoku_4_4">🔢 Mini Sudoku (4×4)</Trans></button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${puzzleType === 'kenken' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`}
          onClick={() => { setPuzzleType('kenken'); newKenKen(); }}><Trans i18nKey="auto.logicpuzzles.kenken_3_3">🧮 KenKen (3×3)</Trans></button>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <span className={`font-bold ${solved ? 'text-green-400' : 'text-gray-400'}`}>{solved ? '🎉 Solved!' : `Fill all cells with 1-${size}`}</span>
          <div className="flex gap-2">
            <button className="text-sm text-gray-500 hover:text-white px-2 py-1 rounded bg-white/5" onClick={puzzleType === 'sudoku' ? checkSudoku : checkKenKen}><Trans i18nKey="auto.logicpuzzles.check">Check</Trans></button>
            <button className="text-sm text-gray-500 hover:text-white px-2 py-1 rounded bg-white/5" onClick={puzzleType === 'sudoku' ? newSudoku : newKenKen}><Trans i18nKey="auto.logicpuzzles.new">New</Trans></button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex justify-center">
          <div className={`inline-grid gap-0 border-2 ${solved ? 'border-green-400' : 'border-white/30'}`}
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {Array.from({ length: size * size }).map((_, idx) => {
              const r = Math.floor(idx / size), c = idx % size;
              const val = currentGrid[r][c];
              const isGiven = puzzleType === 'sudoku' && sudokuData.puzzle[r][c] !== 0;
              const conflict = hasConflict(r, c);
              
              // KenKen group label
              let groupLabel = '';
              if (puzzleType === 'kenken') {
                const group = kenkenData.groups.find(g => g.cells[0][0] === r && g.cells[0][1] === c);
                if (group) groupLabel = group.target;
              }

              // Border logic for 4x4 sudoku boxes
              const borderR = puzzleType === 'sudoku' && c === 1 ? 'border-r-2 border-r-white/40' : '';
              const borderB = puzzleType === 'sudoku' && r === 1 ? 'border-b-2 border-b-white/40' : '';

              return (
                <div key={idx} className={`w-14 h-14 sm:w-16 sm:h-16 border border-white/15 flex items-center justify-center relative ${isGiven ? 'bg-white/10' : 'bg-white/5'} ${conflict ? 'bg-red-500/20' : ''} ${borderR} ${borderB}`}>
                  {groupLabel && <span className="absolute top-0.5 left-1 text-[9px] text-yellow-400 font-bold">{groupLabel}</span>}
                  {isGiven ? (
                    <span className="text-white font-bold text-xl">{val}</span>
                  ) : (
                    <select value={val} onChange={e => setCell(r, c, Number(e.target.value))}
                      className="w-full h-full bg-transparent text-center text-xl font-bold text-cyan-300 appearance-none cursor-pointer focus:outline-none">
                      <option value="0" className="bg-gray-800"></option>
                      {Array.from({ length: size }, (_, i) => i + 1).map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-sm text-gray-300 space-y-1">
          {puzzleType === 'sudoku' ? (
            <>
              <p><Trans i18nKey="auto.logicpuzzles.fill_each_row_column_and_2_2_b">📝 Fill each row, column, and 2×2 box with numbers 1-4.</Trans></p>
              <p><Trans i18nKey="auto.logicpuzzles.no_repeats_in_any_row_column_o">📝 No repeats in any row, column, or box.</Trans></p>
              <p><Trans i18nKey="auto.logicpuzzles.gray_cells_are_given_you_fill_">📝 Gray cells are given — you fill the rest!</Trans></p>
            </>
          ) : (
            <>
              <p><Trans i18nKey="auto.logicpuzzles.fill_each_row_and_column_with_">📝 Fill each row and column with numbers 1-3, no repeats.</Trans></p>
              <p><Trans i18nKey="auto.logicpuzzles.yellow_labels_show_the_target_">📝 Yellow labels show the target: e.g. "5+" means cells in that group add to 5.</Trans></p>
              <p><Trans i18nKey="auto.logicpuzzles.operations_add_subtract_multip">📝 Operations: + (add), - (subtract), × (multiply).</Trans></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
