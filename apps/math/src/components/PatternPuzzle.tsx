import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMathFeedback } from '../lib/MathContext';

interface Puzzle {
  sequence: (number | string)[];
  answer: number | string;
  options: (number | string)[];
  hint: string;
  type: string;
  theme: PatternTheme;
}

interface PatternTheme {
  name: string;
  emoji: string;
  gradient: string;
  border: string;
  bg: string;
  visualEmoji: string;
}

interface MemorySnapshot {
  id: string;
  sequence: (number | string)[];
  answer: number | string;
  type: string;
  theme: PatternTheme;
  timestamp: number;
}

const THEMES: Record<string, PatternTheme> = {
  Arithmetic: {
    name: 'Garden Path',
    emoji: '🌸',
    gradient: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/10',
    visualEmoji: '🌸',
  },
  Geometric: {
    name: 'Magic Growth',
    emoji: '✨',
    gradient: 'from-yellow-500/20 to-amber-500/20',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/10',
    visualEmoji: '⭐',
  },
  Fibonacci: {
    name: 'Rabbit Family',
    emoji: '🐰',
    gradient: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    visualEmoji: '🐰',
  },
  Squares: {
    name: 'Crystal Floor',
    emoji: '🟦',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    visualEmoji: '💎',
  },
  Triangular: {
    name: 'Pyramid Steps',
    emoji: '🔺',
    gradient: 'from-red-500/20 to-orange-500/20',
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    visualEmoji: '🔺',
  },
  Powers: {
    name: 'Doubling Spell',
    emoji: '🔮',
    gradient: 'from-purple-500/20 to-violet-500/20',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    visualEmoji: '🔮',
  },
  Alternating: {
    name: 'Zigzag Dance',
    emoji: '💃',
    gradient: 'from-green-500/20 to-teal-500/20',
    border: 'border-green-500/30',
    bg: 'bg-green-500/10',
    visualEmoji: '💃',
  },
  SkipCounting: {
    name: 'Hopscotch Hop',
    emoji: '🐸',
    gradient: 'from-lime-500/20 to-green-500/20',
    border: 'border-lime-500/30',
    bg: 'bg-lime-500/10',
    visualEmoji: '🐸',
  },
  Countdown: {
    name: 'Rocket Launch',
    emoji: '🚀',
    gradient: 'from-red-500/20 to-pink-500/20',
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    visualEmoji: '🚀',
  },
  Primes: {
    name: 'Prime Quest',
    emoji: '👑',
    gradient: 'from-yellow-500/20 to-orange-500/20',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/10',
    visualEmoji: '👑',
  },
  DigitSum: {
    name: 'Digit Magic',
    emoji: '🔢',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    visualEmoji: '🔢',
  },
  EvenOdd: {
    name: 'Even-Odd Masquerade',
    emoji: '🎭',
    gradient: 'from-violet-500/20 to-fuchsia-500/20',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    visualEmoji: '🎭',
  },
};

const puzzleTemplates: (() => Puzzle)[] = [
  () => {
    const start = Math.floor(Math.random() * 10) + 1;
    const diff = Math.floor(Math.random() * 5) + 2;
    const seq = Array.from({ length: 5 }, (_, i) => start + diff * i);
    const answer = start + diff * 5;
    return {
      sequence: [...seq, '?'],
      answer,
      options: shuffleOptions(answer, [answer + diff, answer - diff, answer + 1, answer * 2]),
      hint: `Each number increases by ${diff}`,
      type: 'Arithmetic',
      theme: THEMES.Arithmetic,
    };
  },
  () => {
    const start = Math.floor(Math.random() * 3) + 2;
    const ratio = Math.floor(Math.random() * 2) + 2;
    const seq = Array.from({ length: 4 }, (_, i) => start * Math.pow(ratio, i));
    const answer = start * Math.pow(ratio, 4);
    return {
      sequence: [...seq, '?'],
      answer,
      options: shuffleOptions(answer, [answer * ratio, Math.floor(answer / ratio), answer + ratio, answer - 1]),
      hint: `Each number is multiplied by ${ratio}`,
      type: 'Geometric',
      theme: THEMES.Geometric,
    };
  },
  () => {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    const seq = [a, b];
    for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]);
    const answer = seq[5];
    const shown = [...seq.slice(0, 5), '?'];
    return {
      sequence: shown,
      answer,
      options: shuffleOptions(answer, [answer + 1, answer - 1, answer + seq[3], seq[4] * 2]),
      hint: 'Each number is the sum of the two before it',
      type: 'Fibonacci',
      theme: THEMES.Fibonacci,
    };
  },
  () => {
    const offset = Math.floor(Math.random() * 3);
    const seq = Array.from({ length: 5 }, (_, i) => (i + 1 + offset) * (i + 1 + offset));
    const answer = (6 + offset) * (6 + offset);
    return {
      sequence: [...seq, '?'],
      answer,
      options: shuffleOptions(answer, [answer + 1, (5 + offset) * (5 + offset) + 1, answer - 2, answer + 5]),
      hint: 'These are perfect square numbers!',
      type: 'Squares',
      theme: THEMES.Squares,
    };
  },
  () => {
    const seq = [1, 3, 6, 10, 15];
    const answer = 21;
    return {
      sequence: [...seq, '?'],
      answer,
      options: shuffleOptions(answer, [20, 22, 18, 25]),
      hint: 'Each number adds +1 more than the previous addition',
      type: 'Triangular',
      theme: THEMES.Triangular,
    };
  },
  () => {
    const start = Math.floor(Math.random() * 2);
    const seq = Array.from({ length: 5 }, (_, i) => Math.pow(2, i + start));
    const answer = Math.pow(2, 5 + start);
    return {
      sequence: [...seq, '?'],
      answer,
      options: shuffleOptions(answer, [answer / 2, answer + 2, answer * 2, answer - 1]),
      hint: 'Each number doubles!',
      type: 'Powers',
      theme: THEMES.Powers,
    };
  },
  () => {
    const start = Math.floor(Math.random() * 10) + 10;
    const a = Math.floor(Math.random() * 3) + 2;
    const b = Math.floor(Math.random() * 2) + 1;
    const seq = [start];
    for (let i = 1; i < 6; i++) {
      seq.push(i % 2 === 1 ? seq[i - 1] + a : seq[i - 1] - b);
    }
    const answer = seq[5];
    seq.length = 5;
    return {
      sequence: [...seq, '?'],
      answer,
      options: shuffleOptions(answer, [answer + 1, answer - 1, answer + a, answer - b]),
      hint: `Alternates between +${a} and -${b}`,
      type: 'Alternating',
      theme: THEMES.Alternating,
    };
  },
  // Skip Counting (counting by 2s, 3s, 5s, 10s)
  () => {
    const steps = [2, 3, 5, 10];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const start = step * (Math.floor(Math.random() * 3) + 1);
    const seq = Array.from({ length: 5 }, (_, i) => start + step * i);
    const answer = start + step * 5;
    return {
      sequence: [...seq, '?'],
      answer,
      options: shuffleOptions(answer, [answer + step, answer - step, answer + 1, answer + step * 2]),
      hint: `Counting by ${step}s (skip counting)`,
      type: 'SkipCounting',
      theme: THEMES.SkipCounting,
    };
  },
  // Countdown (decreasing sequences)
  () => {
    const start = Math.floor(Math.random() * 30) + 50;
    const step = Math.floor(Math.random() * 5) + 3;
    const seq = Array.from({ length: 5 }, (_, i) => start - step * i);
    const answer = start - step * 5;
    return {
      sequence: [...seq, '?'],
      answer,
      options: shuffleOptions(answer, [answer - step, answer + step, answer - 1, answer - step * 2]),
      hint: `Each number decreases by ${step} (blast off!)`,
      type: 'Countdown',
      theme: THEMES.Countdown,
    };
  },
  // Prime Numbers
  () => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const startIndex = Math.floor(Math.random() * 5);
    const seq = primes.slice(startIndex, startIndex + 5);
    const answer = primes[startIndex + 5];
    return {
      sequence: [...seq, '?'],
      answer,
      options: shuffleOptions(answer, [answer + 1, answer + 2, answer - 1, primes[startIndex + 6] || answer + 4]),
      hint: 'These are prime numbers (only divisible by 1 and themselves)',
      type: 'Primes',
      theme: THEMES.Primes,
    };
  },
  // Digit Sum (numbers where digits add up to a target)
  () => {
    const targetSum = Math.floor(Math.random() * 5) + 5; // 5-9
    const nums: number[] = [];
    for (let i = 1; nums.length < 5 && i < 200; i++) {
      const digitSum = String(i).split('').reduce((s, d) => s + parseInt(d), 0);
      if (digitSum === targetSum) nums.push(i);
    }
    const answer = nums[4] || 50;
    const seq = nums.slice(0, 4);
    return {
      sequence: [...seq, '?'],
      answer,
      options: shuffleOptions(answer, [answer + 1, answer - 1, answer + 2, answer + 9]),
      hint: `Each number's digits add up to ${targetSum}`,
      type: 'DigitSum',
      theme: THEMES.DigitSum,
    };
  },
  // Even/Odd patterns
  () => {
    const isEvenPattern = Math.random() > 0.5;
    const startEven = Math.floor(Math.random() * 5) * 2 + 2;
    const startOdd = Math.floor(Math.random() * 5) * 2 + 1;
    const seq = Array.from({ length: 5 }, (_, i) =>
      isEvenPattern ? startEven + i * 2 : startOdd + i * 2,
    );
    const answer = isEvenPattern ? startEven + 5 * 2 : startOdd + 5 * 2;
    return {
      sequence: [...seq, '?'],
      answer,
      options: shuffleOptions(answer, [answer + 1, answer - 1, answer + 2, answer + 3]),
      hint: isEvenPattern ? 'All even numbers (counting by 2s)' : 'All odd numbers (counting by 2s)',
      type: 'EvenOdd',
      theme: THEMES.EvenOdd,
    };
  },
];

function shuffleOptions(answer: number | string, wrongs: (number | string)[]): (number | string)[] {
  const uniqueWrongs = wrongs.filter(
    (w, i, arr) =>
      w !== answer &&
      arr.indexOf(w) === i &&
      typeof w === 'number' &&
      w > 0 &&
      Number.isInteger(w),
  );
  while (uniqueWrongs.length < 3) {
    const offset = Math.floor(Math.random() * 10) + 1;
    const wrong = (answer as number) + (Math.random() > 0.5 ? offset : -offset);
    if (wrong > 0 && wrong !== answer && !uniqueWrongs.includes(wrong)) uniqueWrongs.push(wrong);
  }
  const options = [answer, ...uniqueWrongs.slice(0, 3)];
  return options.sort(() => Math.random() - 0.5);
}

/* Visual pattern representations */
function PatternVisual({ puzzle }: { puzzle: Puzzle }) {
  const nums = puzzle.sequence.filter((n) => typeof n === 'number') as number[];
  const max = Math.max(...nums, 1);
  const emoji = puzzle.theme.visualEmoji;

  switch (puzzle.type) {
    case 'Arithmetic':
      return (
        <div className="flex items-end gap-2 justify-center flex-wrap">
          {nums.map((n, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="flex flex-wrap justify-center gap-0.5 max-w-[80px]">
                {Array.from({ length: Math.min(n, 15) }).map((_, j) => (
                  <motion.span
                    key={j}
                    className="text-base"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.15 + j * 0.03 }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
              <span className="text-xs text-gray-400 mt-1">{n}</span>
            </motion.div>
          ))}
        </div>
      );

    case 'Geometric':
      return (
        <div className="flex items-end gap-2 justify-center">
          {nums.map((n, i) => {
            const size = Math.max(20, (n / max) * 60);
            return (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15, type: 'spring' }}
              >
                <motion.div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: size,
                    height: size,
                    background: `radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.6), rgba(251, 191, 36, 0.1))`,
                    boxShadow: `0 0 ${size / 3}px rgba(251, 191, 36, 0.4)`,
                  }}
                >
                  <span style={{ fontSize: size / 3 }}>{emoji}</span>
                </motion.div>
                <span className="text-xs text-gray-400 mt-1">{n}</span>
              </motion.div>
            );
          })}
        </div>
      );

    case 'Fibonacci':
      return (
        <div className="flex items-end gap-2 justify-center flex-wrap">
          {nums.map((n, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: i * 0.15, type: 'spring' }}
            >
              <div className="flex flex-wrap justify-center gap-0.5 max-w-[80px]">
                {Array.from({ length: Math.min(n, 15) }).map((_, j) => (
                  <motion.span
                    key={j}
                    className="text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.15 + j * 0.05 }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
              <span className="text-xs text-gray-400 mt-1">{n}</span>
            </motion.div>
          ))}
        </div>
      );

    case 'Squares':
      return (
        <div className="flex items-center gap-3 justify-center flex-wrap">
          {nums.map((n, i) => {
            const side = Math.sqrt(n);
            return (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2, type: 'spring' }}
              >
                <div
                  className="grid gap-0.5 p-1 rounded-lg bg-white/5 border border-white/10"
                  style={{ gridTemplateColumns: `repeat(${side}, 1fr)` }}
                >
                  {Array.from({ length: n }).map((_, j) => (
                    <motion.span
                      key={j}
                      className="text-xs"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.2 + j * 0.02 }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
                <span className="text-xs text-gray-400 mt-1">{n}</span>
              </motion.div>
            );
          })}
        </div>
      );

    case 'Triangular':
      return (
        <div className="flex items-end gap-3 justify-center flex-wrap">
          {nums.map((n, i) => {
            // Find which triangular number this is
            let row = 1;
            while ((row * (row + 1)) / 2 < n) row++;
            return (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="flex flex-col items-center gap-0.5">
                  {Array.from({ length: row }).map((_, r) => (
                    <div key={r} className="flex gap-0.5">
                      {Array.from({ length: r + 1 }).map((_, c) => (
                        <motion.span
                          key={c}
                          className="text-xs"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.2 + (r * row + c) * 0.03 }}
                        >
                          {emoji}
                        </motion.span>
                      ))}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-400 mt-1">{n}</span>
              </motion.div>
            );
          })}
        </div>
      );

    case 'Powers':
      return (
        <div className="flex items-center gap-2 justify-center flex-wrap">
          {nums.map((n, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, type: 'spring' }}
            >
              <motion.div
                animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5 + i * 0.3, repeat: Infinity }}
              >
                <div className="flex flex-wrap justify-center gap-0.5 max-w-[80px]">
                  {Array.from({ length: Math.min(n, 16) }).map((_, j) => (
                    <span key={j} className="text-base">
                      {emoji}
                    </span>
                  ))}
                </div>
              </motion.div>
              <span className="text-xs text-gray-400 mt-1">{n}</span>
            </motion.div>
          ))}
        </div>
      );

    case 'Alternating':
      return (
        <div className="flex items-center gap-2 justify-center">
          {nums.map((n, i) => {
            const up = i % 2 === 0;
            return (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                initial={{ opacity: 0, x: up ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <motion.div
                  animate={{ y: up ? [0, -8, 0] : [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="text-2xl"
                >
                  {emoji}
                </motion.div>
                <span className="text-sm font-bold text-white">{n}</span>
              </motion.div>
            );
          })}
        </div>
      );

    case 'SkipCounting':
      return (
        <div className="flex items-center gap-2 justify-center flex-wrap">
          {nums.map((n, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, type: 'spring' }}
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                className="text-2xl"
              >
                {emoji}
              </motion.div>
              <div className="w-8 h-8 rounded-full bg-lime-500/30 border-2 border-lime-400 flex items-center justify-center text-white font-bold text-sm mt-1">
                {n}
              </div>
            </motion.div>
          ))}
        </div>
      );

    case 'Countdown':
      return (
        <div className="flex flex-col items-center gap-2">
          {nums.map((n, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <motion.div
                className="text-2xl"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                {i === 0 ? '🚀' : emoji}
              </motion.div>
              <motion.div
                className="w-14 h-8 rounded-lg bg-red-500/30 border border-red-400 flex items-center justify-center text-white font-bold"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                {n}
              </motion.div>
              <span className="text-gray-500 text-xs">{i === 0 ? '🌍' : '🔥'}</span>
            </motion.div>
          ))}
        </div>
      );

    case 'Primes':
      return (
        <div className="flex items-center gap-3 justify-center flex-wrap">
          {nums.map((n, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, type: 'spring' }}
            >
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg"
                animate={{ rotate: [0, 5, -5, 0], boxShadow: ['0 0 0 rgba(251, 191, 36, 0)', '0 0 20px rgba(251, 191, 36, 0.6)', '0 0 0 rgba(251, 191, 36, 0)'] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                {n}
              </motion.div>
              <span className="text-sm mt-1">{emoji}</span>
            </motion.div>
          ))}
        </div>
      );

    case 'DigitSum':
      return (
        <div className="flex items-center gap-3 justify-center flex-wrap">
          {nums.map((n, i) => {
            const digits = String(n).split('');
            return (
              <motion.div
                key={i}
                className="flex flex-col items-center bg-white/5 rounded-xl p-2 border border-white/10"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="flex gap-1 mb-1">
                  {digits.map((d, j) => (
                    <motion.span
                      key={j}
                      className="w-6 h-6 rounded bg-cyan-500/30 flex items-center justify-center text-cyan-200 text-xs font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.2 + j * 0.1 }}
                    >
                      {d}
                    </motion.span>
                  ))}
                </div>
                <span className="text-xs text-gray-400">{digits.join(' + ')} = {digits.reduce((s, d) => s + parseInt(d), 0)}</span>
              </motion.div>
            );
          })}
        </div>
      );

    case 'EvenOdd':
      return (
        <div className="flex items-center gap-2 justify-center flex-wrap">
          {nums.map((n, i) => {
            const isEven = n % 2 === 0;
            return (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: isEven ? -20 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, type: 'spring' }}
              >
                <motion.div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold border-2 ${
                    isEven
                      ? 'bg-pink-500/40 border-pink-400'
                      : 'bg-violet-500/40 border-violet-400'
                  }`}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, delay: i * 0.5, ease: 'linear' }}
                >
                  {n}
                </motion.div>
                <span className="text-xs mt-1 text-gray-400">
                  {isEven ? '🎀 even' : '🎭 odd'}
                </span>
              </motion.div>
            );
          })}
        </div>
      );

    default:
      return null;
  }
}

export default function PatternPuzzle() {
  const math = useMathFeedback();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState(0);
  const [showSnapshots, setShowSnapshots] = useState(false);
  const [snapshots, setSnapshots] = useState<MemorySnapshot[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mathkingdom_snapshots');
      if (saved) setSnapshots(JSON.parse(saved));
    } catch {}
  }, []);

  const saveSnapshot = (p: Puzzle) => {
    const snap: MemorySnapshot = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sequence: p.sequence,
      answer: p.answer,
      type: p.type,
      theme: p.theme,
      timestamp: Date.now(),
    };
    const newSnaps = [snap, ...snapshots].slice(0, 20);
    setSnapshots(newSnaps);
    try {
      localStorage.setItem('mathkingdom_snapshots', JSON.stringify(newSnaps));
    } catch {}
  };

  const clearSnapshots = () => {
    setSnapshots([]);
    try {
      localStorage.removeItem('mathkingdom_snapshots');
    } catch {}
  };

  const newPuzzle = useCallback(() => {
    const gen = puzzleTemplates[Math.floor(Math.random() * puzzleTemplates.length)];
    setPuzzle(gen());
    setFeedback(null);
    setShowHint(false);
    setRound((prev) => prev + 1);
  }, []);

  useEffect(() => {
    newPuzzle();
  }, []);

  const handleAnswer = (option: number | string) => {
    if (feedback !== null || !puzzle) return;
    if (option === puzzle.answer) {
      setFeedback('correct');
      math.correct('patterns', showHint ? 5 : 10);
      setScore((prev) => prev + (showHint ? 5 : 10));
      setSolved((prev) => prev + 1);
      saveSnapshot(puzzle);
      setTimeout(() => newPuzzle(), 1500);
    } else {
      setFeedback('wrong');
      math.wrong('patterns');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  if (!puzzle) return null;

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🧩 Pattern Puzzle Quest</h2>
        <p className="text-purple-300 text-lg">Find the missing number in each magical sequence!</p>
      </div>

      {/* Stats + Snapshot toggle */}
      <div className="flex justify-center gap-3 sm:gap-6 mb-6 flex-wrap">
        <div className="bg-white/5 rounded-xl px-4 py-2 border border-white/10">
          <span className="text-gray-400 text-sm">Score</span>
          <p className="text-yellow-400 font-bold text-xl">⭐ {score}</p>
        </div>
        <div className="bg-white/5 rounded-xl px-4 py-2 border border-white/10">
          <span className="text-gray-400 text-sm">Solved</span>
          <p className="text-green-400 font-bold text-xl">✅ {solved}</p>
        </div>
        <div className="bg-white/5 rounded-xl px-4 py-2 border border-white/10">
          <span className="text-gray-400 text-sm">Round</span>
          <p className="text-blue-400 font-bold text-xl">🔄 {round}</p>
        </div>
        <motion.button
          className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl px-4 py-2 border border-purple-500/30 relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSnapshots(true)}
        >
          <span className="text-gray-400 text-sm block">Memory Book</span>
          <p className="text-purple-300 font-bold text-xl">📖 {snapshots.length}</p>
          {snapshots.length > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              !
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Puzzle Card with theme */}
      <motion.div
        key={round}
        className={`max-w-2xl mx-auto rounded-3xl border-2 p-6 sm:p-8 bg-gradient-to-br ${puzzle.theme.gradient} ${puzzle.theme.border} relative overflow-hidden`}
        initial={{ opacity: 0, rotateX: 20 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {/* Theme background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {puzzle.theme.emoji}
            </motion.span>
          ))}
        </div>

        {/* Theme badge */}
        <div className="text-center mb-4 relative">
          <div className="inline-flex items-center gap-2 bg-black/30 rounded-full px-4 py-1.5 border border-white/10">
            <span className="text-xl">{puzzle.theme.emoji}</span>
            <span className="text-sm font-bold text-white">{puzzle.theme.name}</span>
            <span className="text-xs text-gray-400">· {puzzle.type}</span>
          </div>
        </div>

        {/* Visual representation */}
        <div className="mb-6 p-4 rounded-2xl bg-black/20 border border-white/10 min-h-[100px] flex items-center justify-center relative">
          <PatternVisual puzzle={puzzle} />
          <span className="absolute top-2 left-3 text-xs text-gray-500">🎨 Visual</span>
        </div>

        {/* Sequence Display */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 relative">
          {puzzle.sequence.map((item, index) => {
            const isQuestion = item === '?';
            return (
              <motion.div
                key={index}
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold transition-all ${
                    isQuestion
                      ? feedback === 'correct'
                        ? 'bg-green-500/40 border-2 border-green-400 text-green-400 animate-pulse-glow'
                        : 'bg-white/10 border-2 border-white/40 border-dashed text-white animate-pulse'
                      : 'bg-white/15 border border-white/30 text-white backdrop-blur-sm'
                  }`}
                  style={
                    !isQuestion
                      ? {
                          boxShadow: '0 4px 0 rgba(0,0,0,0.3), 0 6px 15px rgba(0,0,0,0.2)',
                          transform: 'perspective(500px) rotateX(5deg)',
                        }
                      : {}
                  }
                >
                  {isQuestion ? (feedback === 'correct' ? puzzle.answer : '?') : item}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hint */}
        <div className="text-center mb-4 relative">
          {!showHint ? (
            <motion.button
              className="text-sm text-white/70 hover:text-white underline decoration-dashed"
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowHint(true)}
            >
              💡 Need a hint? (-5 pts)
            </motion.button>
          ) : (
            <motion.p
              className="text-sm text-amber-300 bg-amber-500/10 rounded-lg px-3 py-2 inline-block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              💡 {puzzle.hint}
            </motion.p>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 relative">
          {puzzle.options.map((option, idx) => (
            <motion.button
              key={`${round}-${idx}`}
              className={`py-3 px-4 rounded-xl text-xl font-bold transition-all ${
                feedback === 'correct' && option === puzzle.answer
                  ? 'bg-green-500 text-white ring-4 ring-green-400/50'
                  : feedback === 'wrong'
                  ? 'bg-white/5 text-gray-500'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/40'
              }`}
              whileHover={feedback === null ? { scale: 1.05 } : {}}
              whileTap={feedback === null ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(option)}
              disabled={feedback !== null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.08 }}
            >
              {option}
            </motion.button>
          ))}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.div
              className="mt-4 text-center relative"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              exit={{ scale: 0 }}
            >
              <p className="text-green-400 font-bold text-lg">
                ✨ Pattern Mastered! +{showHint ? 5 : 10} pts ✨
              </p>
              <p className="text-xs text-green-300/70 mt-1">📸 Saved to Memory Book</p>
            </motion.div>
          )}
          {feedback === 'wrong' && (
            <motion.div
              className="mt-4 text-center relative"
              initial={{ x: -10 }}
              animate={{ x: [10, -10, 5, 0] }}
              exit={{ opacity: 0 }}
            >
              <p className="text-red-400 font-bold">🤔 Not quite! Try another option!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="text-center mt-4">
        <button
          className="text-gray-500 hover:text-gray-400 text-sm underline"
          onClick={newPuzzle}
        >
          Skip this puzzle →
        </button>
      </div>

      {/* Memory Book Modal */}
      <AnimatePresence>
        {showSnapshots && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSnapshots(false)}
          >
            <motion.div
              className="relative max-w-3xl w-full max-h-[85vh] rounded-3xl bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-purple-500/40 p-6 overflow-hidden"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 relative">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    📖 Memory Book
                  </h3>
                  <p className="text-purple-300 text-sm">Your solved pattern snapshots</p>
                </div>
                <div className="flex items-center gap-2">
                  {snapshots.length > 0 && (
                    <button
                      className="text-xs text-gray-400 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/10"
                      onClick={clearSnapshots}
                    >
                      🗑️ Clear
                    </button>
                  )}
                  <button
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                    onClick={() => setShowSnapshots(false)}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {snapshots.length === 0 ? (
                <div className="text-center py-16">
                  <motion.div
                    className="text-6xl mb-3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    📭
                  </motion.div>
                  <p className="text-gray-400">No snapshots yet!</p>
                  <p className="text-gray-500 text-sm mt-1">Solve puzzles to fill your Memory Book ✨</p>
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[calc(85vh-150px)] pr-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {snapshots.map((snap, idx) => (
                      <motion.div
                        key={snap.id}
                        className="bg-white rounded-lg p-3 shadow-xl transform"
                        style={{
                          transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * (Math.random() * 2 + 1)}deg)`,
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                      >
                        {/* Polaroid top - the "photo" */}
                        <div className={`aspect-square rounded bg-gradient-to-br ${snap.theme.gradient} p-3 flex flex-col items-center justify-center mb-2 relative overflow-hidden`}>
                          {/* Theme emoji background */}
                          <div className="absolute inset-0 opacity-20">
                            {[...Array(6)].map((_, i) => (
                              <span
                                key={i}
                                className="absolute text-2xl"
                                style={{
                                  left: `${(i % 3) * 40 + 10}%`,
                                  top: `${Math.floor(i / 3) * 50 + 10}%`,
                                }}
                              >
                                {snap.theme.emoji}
                              </span>
                            ))}
                          </div>

                          <div className="relative z-10 flex flex-col items-center gap-2 w-full">
                            <span className="text-3xl">{snap.theme.emoji}</span>
                            <div className="flex flex-wrap items-center justify-center gap-1">
                              {snap.sequence.map((item, i) => (
                                <span
                                  key={i}
                                  className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                    item === '?'
                                      ? 'bg-white/30 text-purple-700'
                                      : 'bg-white/60 text-gray-800'
                                  }`}
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                            <div className="text-xs font-bold text-white bg-black/30 px-2 py-1 rounded-full">
                              = {snap.answer}
                            </div>
                          </div>
                        </div>

                        {/* Polaroid bottom - caption */}
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-800">{snap.theme.name}</p>
                          <p className="text-[10px] text-gray-500">
                            {new Date(snap.timestamp).toLocaleDateString()} ·{' '}
                            {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
