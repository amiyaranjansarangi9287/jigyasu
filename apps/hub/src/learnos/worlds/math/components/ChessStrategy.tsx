import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ChessMode = 'queens' | 'knights' | 'counting';

export default function ChessStrategy() {
  const [mode, setMode] = useState<ChessMode>('queens');
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">♟️ Chess & Strategy</h2>
        <p className="text-purple-300 text-lg">Math puzzles on the chessboard — combinatorics & logic!</p>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {[{ id: 'queens' as ChessMode, e: '👑', l: 'N-Queens' }, { id: 'knights' as ChessMode, e: '🐴', l: "Knight's Tour" }, { id: 'counting' as ChessMode, e: '🔢', l: 'Counting' }].map(m => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode(m.id)}>{m.e} {m.l}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {mode === 'queens' && <motion.div key="q" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><NQueens /></motion.div>}
        {mode === 'knights' && <motion.div key="k" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><KnightsTour /></motion.div>}
        {mode === 'counting' && <motion.div key="c" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><ChessCounting /></motion.div>}
      </AnimatePresence>
    </div>
  );
}

function NQueens() {
  const [n, setN] = useState(8);
  const [queens, setQueens] = useState<number[]>([]);

  const conflicts = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < queens.length; i++) {
      for (let j = i + 1; j < queens.length; j++) {
        if (queens[i] === queens[j] || Math.abs(queens[i] - queens[j]) === Math.abs(i - j)) {
          set.add(`${i},${queens[i]}`); set.add(`${j},${queens[j]}`);
        }
      }
    }
    return set;
  }, [queens]);

  const toggleQueen = (row: number, col: number) => {
    const next = [...queens];
    if (next.length > row && next[row] === col) { next.splice(row); }
    else if (next.length === row) { next.push(col); }
    else { next[row] = col; next.length = row + 1; }
    setQueens(next);
  };

  const solved = queens.length === n && conflicts.size === 0;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2 border border-white/10">
        <div className="flex items-center gap-2"><label className="text-gray-400 text-sm">Board size:</label>
          <select value={n} onChange={e => { setN(Number(e.target.value)); setQueens([]); }} className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white">
            {[4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}×{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold ${solved ? 'text-green-400' : conflicts.size > 0 ? 'text-orange-400' : 'text-gray-400'}`}>
            {solved ? '✅ Solved!' : `👑 ${queens.length}/${n}`}
          </span>
          <button className="text-sm text-gray-500 hover:text-white" onClick={() => setQueens([])}>Reset</button>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="inline-grid gap-0" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {Array.from({ length: n * n }).map((_, idx) => {
            const row = Math.floor(idx / n), col = idx % n;
            const isLight = (row + col) % 2 === 0;
            const hasQueen = queens[row] === col;
            const isConflict = conflicts.has(`${row},${col}`);
            return (
              <motion.button key={idx}
                className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-lg sm:text-xl font-bold transition-colors ${isLight ? 'bg-amber-100' : 'bg-amber-800'} ${isConflict ? 'ring-2 ring-red-500 ring-inset' : ''} ${hasQueen && solved ? 'ring-2 ring-green-400 ring-inset' : ''}`}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => toggleQueen(row, col)}>
                {hasQueen ? '👑' : ''}
              </motion.button>
            );
          })}
        </div>
      </div>
      <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20 text-sm text-amber-300">
        💡 Place {n} queens so no two attack each other — no shared row, column, or diagonal. This is a classic <strong>combinatorics</strong> problem!
      </div>
    </div>
  );
}

function KnightsTour() {
  const [size] = useState(5);
  const [path, setPath] = useState<number[]>([]);
  const [stuck, setStuck] = useState(false);

  const knightMoves = useCallback((pos: number): number[] => {
    const r = Math.floor(pos / size), c = pos % size;
    const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    return offsets.map(([dr, dc]) => [r + dr, c + dc]).filter(([nr, nc]) => nr >= 0 && nr < size && nc >= 0 && nc < size).map(([nr, nc]) => nr * size + nc);
  }, [size]);

  const validMoves = useMemo(() => {
    if (path.length === 0) return [];
    const last = path[path.length - 1];
    return knightMoves(last).filter(m => !path.includes(m));
  }, [path, knightMoves]);

  const handleClick = useCallback((pos: number) => {
    if (path.length === 0) { setPath([pos]); setStuck(false); return; }
    if (validMoves.includes(pos)) {
      const next = [...path, pos];
      setPath(next);
      const nextValid = knightMoves(pos).filter(m => !next.includes(m));
      if (nextValid.length === 0 && next.length < size * size) setStuck(true);
      else setStuck(false);
    }
  }, [path, validMoves, knightMoves, size]);

  const complete = path.length === size * size;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2 border border-white/10">
        <span className={`text-sm font-bold ${complete ? 'text-green-400' : stuck ? 'text-orange-400' : 'text-gray-400'}`}>
          {complete ? '✅ Complete tour!' : stuck ? '🤔 Stuck! Reset and try again.' : `🐴 Moves: ${path.length}/${size * size}`}
        </span>
        <button className="text-sm text-gray-500 hover:text-white" onClick={() => { setPath([]); setStuck(false); }}>Reset</button>
      </div>
      <div className="flex justify-center">
        <div className="inline-grid gap-0" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {Array.from({ length: size * size }).map((_, idx) => {
            const row = Math.floor(idx / size), col = idx % size;
            const isLight = (row + col) % 2 === 0;
            const pathIdx = path.indexOf(idx);
            const isValid = validMoves.includes(idx);
            const isLast = path.length > 0 && path[path.length - 1] === idx;
            return (
              <motion.button key={idx}
                className={`w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center text-sm font-bold transition-colors ${isLight ? 'bg-amber-100' : 'bg-amber-800'} ${isValid ? 'ring-2 ring-green-400 ring-inset cursor-pointer' : ''} ${isLast ? 'ring-2 ring-yellow-400 ring-inset' : ''} ${pathIdx >= 0 && !isLast ? 'opacity-60' : ''}`}
                whileHover={isValid || path.length === 0 ? { scale: 1.1 } : {}}
                whileTap={isValid || path.length === 0 ? { scale: 0.9 } : {}}
                onClick={() => handleClick(idx)}
                disabled={path.length > 0 && !isValid && pathIdx < 0}>
                {isLast ? '🐴' : pathIdx >= 0 ? <span className={isLight ? 'text-amber-700' : 'text-amber-200'}>{pathIdx + 1}</span> : isValid ? <span className="text-green-500 text-lg">•</span> : ''}
              </motion.button>
            );
          })}
        </div>
      </div>
      <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20 text-sm text-amber-300">
        💡 Move the knight to visit every square exactly once. Green dots show valid moves. A 5×5 tour has <strong>5! × many</strong> possible paths!
      </div>
    </div>
  );
}

function ChessCounting() {
  const questions = useMemo(() => [
    { q: 'How many squares on a standard chessboard?', a: 64, opts: [32, 64, 128, 48] },
    { q: 'How many ways can 2 rooks be placed so they don\'t attack each other on an 8×8 board?', a: 1568, opts: [1568, 2016, 3136, 784] },
    { q: 'A knight on the corner can move to how many squares?', a: 2, opts: [2, 3, 4, 8] },
    { q: 'A knight in the center can move to how many squares?', a: 8, opts: [4, 6, 8, 12] },
    { q: 'Maximum bishops that can be placed without attacking each other?', a: 14, opts: [8, 14, 16, 12] },
    { q: 'How many possible first moves in chess (white)?', a: 20, opts: [16, 20, 24, 32] },
  ], []);

  const [qIdx, setQIdx] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [mastery, setMastery] = useState(0);

  const current = questions[qIdx % questions.length];

  const handleAnswer = (opt: number) => {
    if (feedback) return;
    if (opt === current.a) { setFeedback('correct'); setMastery(m => m + 1); setTimeout(() => { setQIdx(i => i + 1); setFeedback(null); }, 1200); }
    else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 900); }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {mastery}</span><span className="text-gray-400 text-sm">Q{(qIdx % questions.length) + 1}/{questions.length}</span></div>
      <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}>
        <p className="text-xl font-bold text-white text-center mb-6">♟️ {current.q}</p>
        <div className="grid grid-cols-2 gap-3">
          {current.opts.sort(() => Math.random() - 0.5).map(opt => (
            <motion.button key={opt} className={`py-3 rounded-xl text-xl font-bold ${feedback === 'correct' && opt === current.a ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
              whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(opt)} disabled={!!feedback}>{opt}</motion.button>
          ))}
        </div>
        {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4">✅ Correct!</p>}
        {feedback === 'wrong' && <p className="text-orange-400 font-bold text-center mt-4">Answer: {current.a}</p>}
      </div>
    </div>
  );
}
