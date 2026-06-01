import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../lib/soundEngine';

type CarnivalMode = 'coins' | 'dice' | 'spinner' | 'challenge';

const SPINNER_SLICES = [
  { label: 'Red', color: '#ef4444', weight: 1 },
  { label: 'Blue', color: '#3b82f6', weight: 1 },
  { label: 'Green', color: '#22c55e', weight: 1 },
  { label: 'Yellow', color: '#eab308', weight: 1 },
  { label: 'Purple', color: '#a855f7', weight: 1 },
  { label: 'Orange', color: '#f97316', weight: 1 },
];

function makeChallenge() {
  const type = Math.floor(Math.random() * 5);
  if (type === 0) return { question: 'Probability of heads on a fair coin?', answer: '1/2', options: ['1/2', '1/4', '1/3', '2/3'].sort(() => Math.random() - 0.5), type: '🪙 Coins' };
  if (type === 1) return { question: 'P(rolling 6 on a fair die)?', answer: '1/6', options: ['1/6', '1/3', '1/2', '6/6'].sort(() => Math.random() - 0.5), type: '🎲 Dice' };
  if (type === 2) { const colors = 6; return { question: `Equal spinner with ${colors} colors. P(landing on Red)?`, answer: `1/${colors}`, options: [`1/${colors}`, `2/${colors}`, '1/2', `1/${colors - 1}`].sort(() => Math.random() - 0.5), type: '🎡 Spinner' }; }
  if (type === 3) return { question: 'You flip 2 coins. P(both heads)?', answer: '1/4', options: ['1/4', '1/2', '1/3', '3/4'].sort(() => Math.random() - 0.5), type: '🪙 Coins' };
  return { question: 'Roll 2 dice. P(sum = 7)?', answer: '1/6', options: ['1/6', '1/12', '7/36', '1/7'].sort(() => Math.random() - 0.5), type: '🎲 Dice' };
}

export default function ProbabilityCarnival() {
  const [mode, setMode] = useState<CarnivalMode>('spinner');
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  // Coin state
  const [coinFlips, setCoinFlips] = useState<('H' | 'T')[]>([]);
  const [flipping, setFlipping] = useState(false);

  // Dice state
  const [diceRolls, setDiceRolls] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  // Spinner state
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinHistory, setSpinHistory] = useState<string[]>([]);

  const flipCoin = () => {
    setFlipping(true);
    sfx.click();
    setTimeout(() => {
      const result: 'H' | 'T' = Math.random() < 0.5 ? 'H' : 'T';
      setCoinFlips(prev => [result, ...prev]);
      setFlipping(false);
    }, 500);
  };

  const rollDice = () => {
    setRolling(true);
    sfx.click();
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceRolls(prev => [result, ...prev]);
      setRolling(false);
    }, 500);
  };

  const spinWheel = () => {
    setSpinning(true);
    sfx.click();
    const totalWeight = SPINNER_SLICES.reduce((s, sl) => s + sl.weight, 0);
    const r = Math.random() * totalWeight;
    let cumulative = 0;
    let winner = SPINNER_SLICES[0].label;
    for (const sl of SPINNER_SLICES) {
      cumulative += sl.weight;
      if (r <= cumulative) { winner = sl.label; break; }
    }
    const newAngle = spinAngle + 1440 + Math.random() * 360;
    setSpinAngle(newAngle);
    setTimeout(() => {
      setSpinResult(winner);
      setSpinHistory(prev => [winner, ...prev]);
      setSpinning(false);
      sfx.correct();
    }, 2000);
  };

  const coinStats = useMemo(() => {
    const h = coinFlips.filter(f => f === 'H').length;
    return { heads: h, tails: coinFlips.length - h, total: coinFlips.length };
  }, [coinFlips]);

  const diceStats = useMemo(() => {
    const freq: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    diceRolls.forEach(r => freq[r]++);
    return { freq, total: diceRolls.length };
  }, [diceRolls]);

  const spinnerStats = useMemo(() => {
    const freq: Record<string, number> = {};
    SPINNER_SLICES.forEach(s => freq[s.label] = 0);
    spinHistory.forEach(s => freq[s]++);
    return { freq, total: spinHistory.length };
  }, [spinHistory]);

  const diceEmoji = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const answerChallenge = (opt: string) => {
    if (feedback) return;
    if (opt === challenge.answer) { setFeedback('correct'); sfx.correct(); setScore(s => s + 10); setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200); }
    else { setFeedback('wrong'); sfx.wrong(); setTimeout(() => setFeedback(null), 900); }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🎪 Probability Carnival</h2>
        <p className="text-purple-300 text-lg">Flip coins, roll dice, spin the wheel — learn chance!</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {[
          { id: 'spinner' as CarnivalMode, e: '🎡', l: 'Spinner' },
          { id: 'coins' as CarnivalMode, e: '🪙', l: 'Coins' },
          { id: 'dice' as CarnivalMode, e: '🎲', l: 'Dice' },
          { id: 'challenge' as CarnivalMode, e: '🎯', l: 'Challenge' },
        ].map(m => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-pink-500/30 text-pink-300 border border-pink-400/50' : 'bg-white/5 text-gray-400'}`}
            onClick={() => { setMode(m.id); if (m.id === 'challenge') setChallenge(makeChallenge()); }}>{m.e} {m.l}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ─── SPINNER ─── */}
        {mode === 'spinner' && (
          <motion.div key="spin" className="max-w-2xl mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <div className="relative w-56 h-56">
                  <motion.svg width="224" height="224" viewBox="-112 -112 224 224"
                    animate={{ rotate: spinAngle }}
                    transition={{ duration: 2, ease: [0.2, 0.8, 0.3, 1] }}>
                    {SPINNER_SLICES.map((sl, i) => {
                      const angle = (360 / SPINNER_SLICES.length);
                      const startRad = (i * angle - 90) * Math.PI / 180;
                      const endRad = ((i + 1) * angle - 90) * Math.PI / 180;
                      const r = 100;
                      const x1 = Math.cos(startRad) * r, y1 = Math.sin(startRad) * r;
                      const x2 = Math.cos(endRad) * r, y2 = Math.sin(endRad) * r;
                      const midRad = ((i + 0.5) * angle - 90) * Math.PI / 180;
                      return (
                        <g key={i}>
                          <path d={`M 0 0 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`} fill={sl.color} stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
                          <text x={Math.cos(midRad) * 60} y={Math.sin(midRad) * 60 + 4} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">{sl.label}</text>
                        </g>
                      );
                    })}
                    <circle cx={0} cy={0} r="12" fill="white" stroke="#333" strokeWidth="2" />
                  </motion.svg>
                  {/* Pointer */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[18px] border-l-transparent border-r-transparent border-t-white z-10" />
                </div>

                <motion.button className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={spinWheel} disabled={spinning}>
                  {spinning ? '🎡 Spinning...' : '🎡 Spin!'}
                </motion.button>

                {spinResult && !spinning && (
                  <motion.p className="mt-3 text-white font-bold text-lg" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    Landed on: <span style={{ color: SPINNER_SLICES.find(s => s.label === spinResult)?.color }}>{spinResult}!</span>
                  </motion.p>
                )}
              </div>

              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white font-bold mb-2">📊 Results ({spinnerStats.total} spins)</h4>
                  {SPINNER_SLICES.map(sl => {
                    const count = spinnerStats.freq[sl.label] || 0;
                    const pct = spinnerStats.total > 0 ? (count / spinnerStats.total * 100).toFixed(1) : '0';
                    return (
                      <div key={sl.label} className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: sl.color }} />
                        <span className="text-gray-300 text-xs flex-1">{sl.label}</span>
                        <span className="text-white font-bold text-xs w-6 text-right">{count}</span>
                        <span className="text-gray-500 text-xs w-12 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-pink-500/10 rounded-xl p-3 border border-pink-500/20 text-sm text-pink-300">
                  💡 With {SPINNER_SLICES.length} equal slices, P(any color) = <strong>1/{SPINNER_SLICES.length} ≈ {(100 / SPINNER_SLICES.length).toFixed(1)}%</strong>. Spin many times to see it converge!
                </div>
                <button className="text-xs text-gray-500 hover:text-white" onClick={() => { setSpinHistory([]); setSpinResult(null); }}>Reset</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── COINS ─── */}
        {mode === 'coins' && (
          <motion.div key="coins" className="max-w-lg mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
              <motion.div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-3xl font-bold shadow-xl mb-4"
                animate={flipping ? { rotateY: [0, 360, 720], scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.5 }}>
                {flipping ? '?' : (coinFlips[0] || '?')}
              </motion.div>
              <div className="flex justify-center gap-3">
                <motion.button className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={flipCoin} disabled={flipping}>🪙 Flip!</motion.button>
                <button className="px-4 py-2 rounded-xl bg-white/10 text-gray-400 text-sm" onClick={() => setCoinFlips([])}>Reset</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20 text-center">
                <p className="text-yellow-400 font-bold text-3xl">{coinStats.heads}</p>
                <p className="text-gray-400 text-sm">Heads ({coinStats.total > 0 ? (coinStats.heads / coinStats.total * 100).toFixed(1) : 0}%)</p>
              </div>
              <div className="bg-gray-500/10 rounded-xl p-4 border border-gray-500/20 text-center">
                <p className="text-gray-300 font-bold text-3xl">{coinStats.tails}</p>
                <p className="text-gray-400 text-sm">Tails ({coinStats.total > 0 ? (coinStats.tails / coinStats.total * 100).toFixed(1) : 0}%)</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex flex-wrap gap-1">{coinFlips.slice(0, 40).map((f, i) => <span key={i} className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${f === 'H' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-gray-500/30 text-gray-300'}`}>{f}</span>)}</div>
            </div>
          </motion.div>
        )}

        {/* ─── DICE ─── */}
        {mode === 'dice' && (
          <motion.div key="dice" className="max-w-lg mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
              <motion.div className="w-20 h-20 mx-auto rounded-xl bg-white flex items-center justify-center text-5xl shadow-xl mb-4"
                animate={rolling ? { rotate: [0, 360], scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.5 }}>
                {rolling ? '🎲' : diceEmoji[(diceRolls[0] || 1) - 1]}
              </motion.div>
              <div className="flex justify-center gap-3">
                <motion.button className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={rollDice} disabled={rolling}>🎲 Roll!</motion.button>
                <button className="px-4 py-2 rounded-xl bg-white/10 text-gray-400 text-sm" onClick={() => setDiceRolls([])}>Reset</button>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-bold mb-3">Frequency ({diceStats.total} rolls)</h4>
              {[1, 2, 3, 4, 5, 6].map(n => {
                const pct = diceStats.total > 0 ? (diceStats.freq[n] / diceStats.total) * 100 : 0;
                return (
                  <div key={n} className="flex items-center gap-2 mb-1">
                    <span className="text-xl w-8">{diceEmoji[n - 1]}</span>
                    <div className="flex-1 h-5 bg-gray-700 rounded-full overflow-hidden"><motion.div className="h-full bg-red-500 rounded-full" animate={{ width: `${Math.max(pct, 1)}%` }} /></div>
                    <span className="text-gray-400 text-xs w-16 text-right">{diceStats.freq[n]} ({pct.toFixed(1)}%)</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ─── CHALLENGE ─── */}
        {mode === 'challenge' && (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {score}</span><span className="text-xs text-gray-400">{challenge.type}</span></div>
              <p className="text-xl font-bold text-white text-center mb-5">{challenge.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-lg font-bold font-mono ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                    whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}}
                    onClick={() => answerChallenge(opt)} disabled={!!feedback}>{opt}</motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4">✅ Correct!</p>}
              {feedback === 'wrong' && <p className="text-red-400 font-bold text-center mt-4">Answer: {challenge.answer}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
