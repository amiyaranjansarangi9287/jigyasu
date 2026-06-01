import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ProbMode = 'coins' | 'dice' | 'cards' | 'challenge';

export default function ProbabilityPlayground() {
  const [mode, setMode] = useState<ProbMode>('coins');

  const modes = [
    { id: 'coins' as ProbMode, emoji: '🪙', label: 'Coin Flip' },
    { id: 'dice' as ProbMode, emoji: '🎲', label: 'Dice Roll' },
    { id: 'cards' as ProbMode, emoji: '🃏', label: 'Card Draw' },
    { id: 'challenge' as ProbMode, emoji: '🎯', label: 'Challenge' },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🎲 Probability Playground</h2>
        <p className="text-purple-300 text-lg">Explore chance and randomness!</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {modes.map(m => (
          <button key={m.id}
            className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`}
            onClick={() => setMode(m.id)}>
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {mode === 'coins' && <CoinFlip />}
          {mode === 'dice' && <DiceRoll />}
          {mode === 'cards' && <CardDraw />}
          {mode === 'challenge' && <ProbabilityChallenge />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function CoinFlip() {
  const [flips, setFlips] = useState<('H' | 'T')[]>([]);
  const [flipping, setFlipping] = useState(false);
  const [numCoins, setNumCoins] = useState(1);

  const stats = useMemo(() => {
    const heads = flips.filter(f => f === 'H').length;
    const tails = flips.length - heads;
    return {
      heads,
      tails,
      total: flips.length,
      headsPercent: flips.length > 0 ? ((heads / flips.length) * 100).toFixed(1) : '0',
      tailsPercent: flips.length > 0 ? ((tails / flips.length) * 100).toFixed(1) : '0',
    };
  }, [flips]);

  const flip = () => {
    setFlipping(true);
    setTimeout(() => {
      const newFlips: ('H' | 'T')[] = Array.from({ length: numCoins }, () => Math.random() < 0.5 ? 'H' : 'T');
      setFlips([...flips, ...newFlips]);
      setFlipping(false);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <label className="text-gray-400">Coins per flip:</label>
            <select value={numCoins} onChange={e => setNumCoins(Number(e.target.value))}
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white">
              {[1, 2, 3, 5, 10].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {Array.from({ length: numCoins }).map((_, i) => (
              <motion.div key={i}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-2xl font-bold shadow-lg"
                animate={flipping ? { rotateY: [0, 360, 720], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {flipping ? '?' : (flips[flips.length - numCoins + i] || '?')}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            <motion.button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={flip}
              disabled={flipping}
            >
              🪙 Flip!
            </motion.button>
            <button className="px-4 py-2 rounded-xl bg-white/10 text-gray-400" onClick={() => setFlips([])}>Reset</button>
          </div>
        </div>

        {/* Probability theory */}
        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
          <h4 className="text-white font-bold mb-2">📊 Theory</h4>
          <p className="text-gray-300 text-sm">P(Heads) = P(Tails) = <span className="text-purple-400 font-bold">1/2 = 50%</span></p>
          <p className="text-gray-400 text-sm mt-1">Each flip is independent — past results don't affect future flips!</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20 text-center">
            <span className="text-3xl">🪙</span>
            <p className="text-yellow-400 font-bold text-2xl">{stats.heads}</p>
            <p className="text-gray-400 text-sm">Heads ({stats.headsPercent}%)</p>
          </div>
          <div className="bg-gray-500/10 rounded-xl p-4 border border-gray-500/20 text-center">
            <span className="text-3xl">⭕</span>
            <p className="text-gray-300 font-bold text-2xl">{stats.tails}</p>
            <p className="text-gray-400 text-sm">Tails ({stats.tailsPercent}%)</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-white font-bold mb-2">📜 History ({stats.total} flips)</h4>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {flips.slice(-50).map((f, i) => (
              <motion.span key={i}
                className={`w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold ${f === 'H' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-gray-500/30 text-gray-300'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >{f}</motion.span>
            ))}
          </div>
        </div>

        {/* Bar comparison */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex h-8 rounded-lg overflow-hidden">
            <motion.div className="bg-yellow-500 flex items-center justify-center text-sm font-bold"
              animate={{ width: `${stats.total > 0 ? (stats.heads / stats.total) * 100 : 50}%` }}
              transition={{ duration: 0.3 }}>
              {stats.headsPercent}%
            </motion.div>
            <motion.div className="bg-gray-500 flex items-center justify-center text-sm font-bold"
              animate={{ width: `${stats.total > 0 ? (stats.tails / stats.total) * 100 : 50}%` }}
              transition={{ duration: 0.3 }}>
              {stats.tailsPercent}%
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiceRoll() {
  const [rolls, setRolls] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [numDice, setNumDice] = useState(2);

  const stats = useMemo(() => {
    const freq: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    rolls.forEach(r => freq[r]++);
    const sum = rolls.reduce((a, b) => a + b, 0);
    return { freq, total: rolls.length, sum, avg: rolls.length > 0 ? (sum / rolls.length).toFixed(2) : '0' };
  }, [rolls]);

  const lastRoll = rolls.slice(-numDice);

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      const newRolls = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
      setRolls([...rolls, ...newRolls]);
      setRolling(false);
    }, 500);
  };

  const diceEmoji = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <label className="text-gray-400">Number of dice:</label>
            <select value={numDice} onChange={e => setNumDice(Number(e.target.value))}
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white">
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {Array.from({ length: numDice }).map((_, i) => (
              <motion.div key={i}
                className="w-16 h-16 rounded-xl bg-white text-4xl flex items-center justify-center shadow-lg"
                animate={rolling ? { rotate: [0, 360], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {rolling ? '🎲' : diceEmoji[(lastRoll[i] || 1) - 1]}
              </motion.div>
            ))}
          </div>

          {lastRoll.length > 1 && !rolling && (
            <p className="text-green-400 font-bold text-lg mb-2">Sum: {lastRoll.reduce((a, b) => a + b, 0)}</p>
          )}

          <div className="flex justify-center gap-2">
            <motion.button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={roll}
              disabled={rolling}
            >
              🎲 Roll!
            </motion.button>
            <button className="px-4 py-2 rounded-xl bg-white/10 text-gray-400" onClick={() => setRolls([])}>Reset</button>
          </div>
        </div>

        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
          <h4 className="text-white font-bold mb-2">📊 Theory</h4>
          <p className="text-gray-300 text-sm">P(any number) = <span className="text-purple-400 font-bold">1/6 ≈ 16.67%</span></p>
          <p className="text-gray-400 text-sm mt-1">Expected average = 3.5</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-white font-bold mb-3">📊 Frequency ({stats.total} rolls)</h4>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map(n => {
              const pct = stats.total > 0 ? (stats.freq[n] / stats.total) * 100 : 0;
              return (
                <div key={n} className="flex items-center gap-2">
                  <span className="text-xl w-8">{diceEmoji[n - 1]}</span>
                  <div className="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-end pr-2 text-sm font-bold"
                      animate={{ width: `${Math.max(pct, 2)}%` }}
                    >
                      {stats.freq[n]}
                    </motion.div>
                  </div>
                  <span className="text-gray-400 text-sm w-12">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 text-center">
            <p className="text-gray-400 text-sm">Average</p>
            <p className="text-blue-400 font-bold text-2xl">{stats.avg}</p>
          </div>
          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20 text-center">
            <p className="text-gray-400 text-sm">Total Sum</p>
            <p className="text-green-400 font-bold text-2xl">{stats.sum}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardDraw() {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const fullDeck = suits.flatMap(s => ranks.map(r => ({ suit: s, rank: r })));

  const [deck, setDeck] = useState([...fullDeck]);
  const [drawn, setDrawn] = useState<{ suit: string; rank: string }[]>([]);
  const [drawing, setDrawing] = useState(false);

  const draw = () => {
    if (deck.length === 0) return;
    setDrawing(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * deck.length);
      const card = deck[idx];
      setDrawn([card, ...drawn]);
      setDeck(deck.filter((_, i) => i !== idx));
      setDrawing(false);
    }, 300);
  };

  const reset = () => {
    setDeck([...fullDeck]);
    setDrawn([]);
  };

  const isRed = (suit: string) => suit === '♥' || suit === '♦';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
          <div className="mb-4">
            <p className="text-gray-400 text-sm">Cards remaining: <span className="text-white font-bold">{deck.length}</span> / 52</p>
          </div>

          <div className="flex justify-center mb-4">
            {drawn.length > 0 ? (
              <motion.div
                className={`w-24 h-36 rounded-xl bg-white flex flex-col items-center justify-center shadow-xl text-3xl font-bold ${isRed(drawn[0].suit) ? 'text-red-600' : 'text-gray-900'}`}
                key={`${drawn[0].rank}${drawn[0].suit}`}
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
              >
                <span>{drawn[0].rank}</span>
                <span className="text-4xl">{drawn[0].suit}</span>
              </motion.div>
            ) : (
              <div className="w-24 h-36 rounded-xl bg-blue-800 border-2 border-blue-600 flex items-center justify-center">
                <span className="text-3xl">🂠</span>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2">
            <motion.button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={draw}
              disabled={drawing || deck.length === 0}
            >
              🃏 Draw Card
            </motion.button>
            <button className="px-4 py-2 rounded-xl bg-white/10 text-gray-400" onClick={reset}>Shuffle</button>
          </div>
        </div>

        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 text-sm">
          <h4 className="text-white font-bold mb-2">📊 Probabilities</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-gray-300">P(any card) = 1/{deck.length} = {deck.length > 0 ? ((1 / deck.length) * 100).toFixed(1) : 0}%</p>
            <p className="text-gray-300">P(Ace) = {deck.filter(c => c.rank === 'A').length}/{deck.length}</p>
            <p className="text-red-300">P(Red) = {deck.filter(c => isRed(c.suit)).length}/{deck.length}</p>
            <p className="text-gray-300">P(Face) = {deck.filter(c => ['J', 'Q', 'K'].includes(c.rank)).length}/{deck.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-white font-bold mb-3">📜 Drawn Cards ({drawn.length})</h4>
        <div className="flex flex-wrap gap-1 max-h-64 overflow-y-auto">
          {drawn.map((card, i) => (
            <motion.div key={i}
              className={`w-10 h-14 rounded bg-white flex flex-col items-center justify-center text-sm font-bold ${isRed(card.suit) ? 'text-red-600' : 'text-gray-900'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              <span>{card.rank}</span>
              <span>{card.suit}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProbabilityChallenge() {
  const [question, setQuestion] = useState<{ q: string; answer: string; options: string[]; explanation: string } | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const generateQuestion = useCallback(() => {
    const questions = [
      { q: 'P(heads) on a fair coin?', answer: '1/2', options: ['1/2', '1/4', '1/6', '2/3'], explanation: '2 outcomes: H or T. P = 1/2' },
      { q: 'P(rolling a 6) on a die?', answer: '1/6', options: ['1/2', '1/6', '1/3', '6/6'], explanation: '6 outcomes, 1 is a 6. P = 1/6' },
      { q: 'P(drawing a heart) from a deck?', answer: '1/4', options: ['1/4', '1/13', '1/52', '1/2'], explanation: '13 hearts in 52 cards. P = 13/52 = 1/4' },
      { q: 'P(rolling odd) on a die?', answer: '1/2', options: ['1/3', '1/2', '1/6', '2/3'], explanation: '3 odd numbers (1,3,5) out of 6. P = 3/6 = 1/2' },
      { q: 'P(getting at least 1 head in 2 flips)?', answer: '3/4', options: ['1/2', '1/4', '3/4', '1/3'], explanation: 'HH,HT,TH,TT - 3 have heads. P = 3/4' },
      { q: 'P(drawing an Ace) from a deck?', answer: '1/13', options: ['1/52', '1/13', '1/4', '4/13'], explanation: '4 Aces in 52 cards. P = 4/52 = 1/13' },
      { q: 'P(rolling sum of 7) with 2 dice?', answer: '1/6', options: ['1/6', '1/12', '7/36', '1/7'], explanation: '6 ways to get 7 out of 36 combinations. P = 6/36 = 1/6' },
    ];
    setQuestion(questions[Math.floor(Math.random() * questions.length)]);
    setFeedback(null);
  }, []);

  useState(() => { generateQuestion(); });

  const handleAnswer = (opt: string) => {
    if (!question || feedback) return;
    if (opt === question.answer) {
      setFeedback('correct');
      setScore(s => s + 10);
      setTimeout(generateQuestion, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  if (!question) { generateQuestion(); return null; }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-center mb-4">
        <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold">⭐ {score}</span>
      </div>

      <motion.div
        key={question.q}
        className={`rounded-2xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <p className="text-xl font-bold text-white text-center mb-6">{question.q}</p>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt, i) => (
            <motion.button key={i}
              className={`py-3 rounded-xl text-lg font-bold font-mono ${
                feedback === 'correct' && opt === question.answer ? 'bg-green-500 text-white'
                : feedback ? 'bg-white/5 text-gray-500'
                : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              whileHover={!feedback ? { scale: 1.05 } : {}}
              whileTap={!feedback ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(opt)}
              disabled={feedback !== null}
            >
              {opt}
            </motion.button>
          ))}
        </div>

        {feedback === 'correct' && (
          <div className="mt-4 text-center">
            <p className="text-green-400 font-bold">✅ Correct!</p>
            <p className="text-gray-400 text-sm">{question.explanation}</p>
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="mt-4 text-center">
            <p className="text-red-400 font-bold">❌ Answer: {question.answer}</p>
            <p className="text-gray-400 text-sm">{question.explanation}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
