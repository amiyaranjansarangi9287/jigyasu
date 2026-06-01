import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useCountdown — Generic countdown timer hook
 * Returns { count, isRunning, start, reset }
 */
export function useCountdown(initialSeconds: number) {
  const [count, setCount] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setCount((c) => {
          if (c <= 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setCount(initialSeconds);
  }, [initialSeconds]);

  return { count, isRunning, start, reset };
}

/**
 * MemoryMatch — Generic card memory matching game
 * Accepts an array of { id, emoji } pairs; each pair is duplicated into a board.
 */
interface MemoryCard {
  id: string;
  emoji: string;
  pairId: string;
}

interface MemoryMatchProps {
  pairs: Array<{ id: string; emoji: string }>;
  onComplete?: (moves: number, timeSeconds: number) => void;
  accentColor?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MemoryMatch({ pairs, onComplete, accentColor = '#6366F1' }: MemoryMatchProps) {
  const makeBoard = useCallback((): MemoryCard[] => {
    const cards: MemoryCard[] = pairs.flatMap((p) => [
      { id: `${p.id}-a`, pairId: p.id, emoji: p.emoji },
      { id: `${p.id}-b`, pairId: p.id, emoji: p.emoji },
    ]);
    return shuffle(cards);
  }, [pairs]);

  const [board, setBoard] = useState<MemoryCard[]>(makeBoard);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const [locked, setLocked] = useState(false);

  const handleFlip = (cardId: string) => {
    if (locked || flipped.includes(cardId) || matched.includes(cardId)) return;
    const next = [...flipped, cardId];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = next.map((id) => board.find((c) => c.id === id)!);
      if (a.pairId === b.pairId) {
        const newMatched = [...matched, a.pairId];
        setMatched(newMatched);
        setFlipped([]);
        setLocked(false);
        if (newMatched.length === pairs.length) {
          onComplete?.(moves + 1, Math.round((Date.now() - startTime) / 1000));
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  const reset = () => {
    setBoard(makeBoard());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <span>Moves: <strong className="text-gray-800">{moves}</strong></span>
        <span>Matched: <strong className="text-gray-800">{matched.length}/{pairs.length}</strong></span>
        <button onClick={reset} className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-medium">
          Reset
        </button>
      </div>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(pairs.length * 2))}, minmax(0, 1fr))` }}
      >
        {board.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.pairId);
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className="w-16 h-16 rounded-xl text-2xl flex items-center justify-center transition-all duration-200 border-2 select-none"
              style={{
                background: isMatched
                  ? `${accentColor}22`
                  : isFlipped
                  ? 'white'
                  : accentColor,
                borderColor: isMatched ? accentColor : isFlipped ? accentColor : 'transparent',
                boxShadow: isFlipped || isMatched ? `0 0 0 2px ${accentColor}44` : 'none',
                transform: isFlipped || isMatched ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {(isFlipped || isMatched) ? card.emoji : '?'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * SimonSays — Classic colour sequence memory game
 */
const SIMON_COLORS = [
  { id: 'red', color: '#EF4444', light: '#FCA5A5' },
  { id: 'green', color: '#22C55E', light: '#86EFAC' },
  { id: 'blue', color: '#3B82F6', light: '#93C5FD' },
  { id: 'yellow', color: '#EAB308', light: '#FDE047' },
];

interface SimonSaysProps {
  onScore?: (score: number) => void;
}

export function SimonSays({ onScore }: SimonSaysProps) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSeq, setUserSeq] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'showing' | 'input' | 'fail'>('idle');
  const [score, setScore] = useState(0);

  const playSequence = useCallback(async (seq: string[]) => {
    setPhase('showing');
    for (const id of seq) {
      await new Promise<void>((res) => setTimeout(res, 400));
      setActive(id);
      await new Promise<void>((res) => setTimeout(res, 500));
      setActive(null);
    }
    await new Promise<void>((res) => setTimeout(res, 200));
    setPhase('input');
    setUserSeq([]);
  }, []);

  const startRound = useCallback(() => {
    const next = [...sequence, SIMON_COLORS[Math.floor(Math.random() * 4)].id];
    setSequence(next);
    playSequence(next);
  }, [sequence, playSequence]);

  const handlePress = (id: string) => {
    if (phase !== 'input') return;
    const next = [...userSeq, id];
    const idx = next.length - 1;
    if (sequence[idx] !== id) {
      setPhase('fail');
      setScore(0);
      setSequence([]);
      return;
    }
    if (next.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      onScore?.(newScore);
      setUserSeq([]);
      setTimeout(() => startRound(), 600);
    } else {
      setUserSeq(next);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4 text-sm">
        <span className="font-semibold text-gray-700">Score: {score}</span>
        {phase === 'fail' && <span className="text-red-500 font-medium">❌ Try again!</span>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {SIMON_COLORS.map((c) => (
          <button
            key={c.id}
            onMouseDown={() => handlePress(c.id)}
            className="w-24 h-24 rounded-2xl transition-all duration-100 border-4 border-transparent"
            style={{
              background: active === c.id ? c.light : c.color,
              transform: active === c.id ? 'scale(1.08)' : 'scale(1)',
              boxShadow: active === c.id ? `0 0 20px ${c.color}88` : 'none',
            }}
          />
        ))}
      </div>
      {(phase === 'idle' || phase === 'fail') && (
        <button
          onClick={startRound}
          className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
        >
          {phase === 'fail' ? 'Try Again' : 'Start'}
        </button>
      )}
      {phase === 'showing' && <p className="text-gray-500 text-sm animate-pulse">Watch the sequence…</p>}
      {phase === 'input' && <p className="text-indigo-600 text-sm font-medium">Your turn! Repeat the sequence.</p>}
    </div>
  );
}
