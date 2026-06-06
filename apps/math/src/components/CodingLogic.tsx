import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type LogicMode = 'binary' | 'boolean' | 'challenge';

function toBin(n: number) { return (n >>> 0).toString(2); }
function fromBin(s: string) { return parseInt(s, 2) || 0; }

function makeChallenge() {
  const type = Math.floor(Math.random() * 4);
  if (type === 0) { const n = Math.floor(Math.random() * 64); const answer = toBin(n); const wrongs = new Set<string>([answer]); while (wrongs.size < 4) wrongs.add(toBin(n + Math.floor(Math.random() * 7) - 3)); return { question: `Convert ${n} to binary`, answer, options: [...wrongs].sort(() => Math.random() - 0.5), type: '🔢 Binary' }; }
  if (type === 1) { const bits = Math.floor(Math.random() * 6) + 2; const n = Math.floor(Math.random() * Math.pow(2, bits)); const bin = toBin(n).padStart(bits, '0'); const answer = String(n); const wrongs = new Set<string>([answer]); while (wrongs.size < 4) wrongs.add(String(n + Math.floor(Math.random() * 7) - 3)); return { question: `Binary ${bin} = ? in decimal`, answer, options: [...wrongs].sort(() => Math.random() - 0.5), type: '🔢 Binary' }; }
  if (type === 2) { const a = Math.random() < 0.5; const b = Math.random() < 0.5; const ops = ['AND', 'OR', 'XOR']; const op = ops[Math.floor(Math.random() * ops.length)]; let answer: string; if (op === 'AND') answer = String(a && b); else if (op === 'OR') answer = String(a || b); else answer = String(a !== b); return { question: `${String(a).toUpperCase()} ${op} ${String(b).toUpperCase()} = ?`, answer, options: ['true', 'false'].sort(() => Math.random() - 0.5).concat([]).slice(0, 2), type: '🔲 Boolean' }; }
  const a = Math.random() < 0.5; const answer = String(!a); return { question: `NOT ${String(a).toUpperCase()} = ?`, answer, options: ['true', 'false'], type: '🔲 Boolean' };
}

export default function CodingLogic() {
  const [mode, setMode] = useState<LogicMode>('binary');
  const [decimal, setDecimal] = useState(42);
  const [boolA, setBoolA] = useState(true);
  const [boolB, setBoolB] = useState(false);
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const binary = useMemo(() => toBin(decimal).padStart(8, '0'), [decimal]);
  const hex = useMemo(() => decimal.toString(16).toUpperCase(), [decimal]);
  const octal = useMemo(() => decimal.toString(8), [decimal]);

  const boolResults = useMemo(() => ({
    AND: boolA && boolB,
    OR: boolA || boolB,
    XOR: boolA !== boolB,
    NAND: !(boolA && boolB),
    NOR: !(boolA || boolB),
    NOT_A: !boolA,
    NOT_B: !boolB,
  }), [boolA, boolB]);

  const answerChallenge = useCallback((opt: string) => {
    if (feedback) return;
    if (opt === challenge.answer) {
      setFeedback('correct'); setScore(s => s + 10);
      setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200);
    } else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 900); }
  }, [feedback, challenge]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">💻 Coding & Logic</h2>
        <p className="text-purple-300 text-lg">Binary numbers, Boolean logic, and computational thinking!</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {([
          { id: 'binary' as LogicMode, emoji: '🔢', label: 'Binary' },
          { id: 'boolean' as LogicMode, emoji: '🔲', label: 'Boolean' },
          { id: 'challenge' as LogicMode, emoji: '🎯', label: 'Challenge' },
        ]).map(m => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50' : 'bg-white/5 text-gray-400'}`}
            onClick={() => { setMode(m.id); if (m.id === 'challenge') setChallenge(makeChallenge()); }}>{m.emoji} {m.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'binary' && (
          <motion.div key="bin" className="max-w-2xl mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <h4 className="text-white font-bold mb-3">Decimal ↔ Binary Converter</h4>
              <div className="flex items-center gap-4 mb-4">
                <input type="range" min="0" max="255" value={decimal} onChange={e => setDecimal(Number(e.target.value))} className="flex-1 accent-cyan-500" />
                <input type="number" value={decimal} min={0} max={255} onChange={e => setDecimal(Math.max(0, Math.min(255, Number(e.target.value) || 0)))}
                  className="w-20 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-bold text-center" />
              </div>

              {/* Bit display */}
              <div className="flex justify-center gap-1 mb-4">
                {binary.split('').map((bit, i) => (
                  <motion.button key={i}
                    className={`w-10 min-h-12 rounded-lg font-bold text-xl flex items-center justify-center ${bit === '1' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-500'}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      const bits = binary.split('');
                      bits[i] = bits[i] === '1' ? '0' : '1';
                      setDecimal(fromBin(bits.join('')));
                    }}>
                    {bit}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-center gap-1 mb-4">
                {binary.split('').map((_, i) => (
                  <span key={i} className="w-10 text-center text-gray-500 text-xs">{Math.pow(2, 7 - i)}</span>
                ))}
              </div>

              {/* Conversions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Decimal', value: String(decimal), color: 'text-white' },
                  { label: 'Binary', value: binary, color: 'text-cyan-400' },
                  { label: 'Hexadecimal', value: `0x${hex}`, color: 'text-purple-400' },
                  { label: 'Octal', value: `0o${octal}`, color: 'text-orange-400' },
                ].map(c => (
                  <div key={c.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                    <p className="text-gray-400 text-xs">{c.label}</p>
                    <motion.p key={c.value} className={`font-bold font-mono text-lg ${c.color}`} initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{c.value}</motion.p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20 text-sm">
              <p className="text-cyan-300">💡 Each bit position represents a power of 2. Click the bits above to toggle them on/off and watch the decimal change!</p>
            </div>
          </motion.div>
        )}

        {mode === 'boolean' && (
          <motion.div key="bool" className="max-w-lg mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <h4 className="text-white font-bold mb-4">Boolean Logic Gates</h4>
              <div className="flex justify-center gap-6 mb-6">
                {[
                  { label: 'A', value: boolA, set: setBoolA, color: 'blue' },
                  { label: 'B', value: boolB, set: setBoolB, color: 'orange' },
                ].map(input => (
                  <div key={input.label} className="text-center">
                    <p className={`text-${input.color}-400 font-bold mb-2`}>{input.label}</p>
                    <motion.button
                      className={`w-20 min-h-12 rounded-xl font-bold text-lg ${input.value ? 'bg-green-500 text-white' : 'bg-red-500/50 text-red-200'}`}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => input.set(!input.value)}
                    >{input.value ? 'TRUE' : 'FALSE'}</motion.button>
                  </div>
                ))}
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: 'AND', result: boolResults.AND, symbol: '∧' },
                  { name: 'OR', result: boolResults.OR, symbol: '∨' },
                  { name: 'XOR', result: boolResults.XOR, symbol: '⊕' },
                  { name: 'NAND', result: boolResults.NAND, symbol: '⊼' },
                  { name: 'NOT A', result: boolResults.NOT_A, symbol: '¬A' },
                  { name: 'NOT B', result: boolResults.NOT_B, symbol: '¬B' },
                ].map(gate => (
                  <motion.div
                    key={`${gate.name}-${gate.result}`}
                    className={`rounded-xl p-3 text-center border ${gate.result ? 'bg-green-500/20 border-green-500/40' : 'bg-red-500/10 border-red-500/30'}`}
                    initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                    <p className="text-gray-400 text-xs">{gate.name} ({gate.symbol})</p>
                    <p className={`font-bold text-lg ${gate.result ? 'text-green-400' : 'text-red-400'}`}>{gate.result ? 'TRUE' : 'FALSE'}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Truth table */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-bold mb-2 text-sm">AND Truth Table</h4>
              <table className="w-full text-sm text-center">
                <thead><tr className="text-gray-400 border-b border-white/10"><th className="py-1">A</th><th>B</th><th>A AND B</th></tr></thead>
                <tbody>
                  {[[false, false], [false, true], [true, false], [true, true]].map(([a, b]) => (
                    <tr key={`${a}-${b}`} className={`border-b border-white/5 ${a === boolA && b === boolB ? 'bg-purple-500/20' : ''}`}>
                      <td className="py-1 text-blue-300">{a ? 'T' : 'F'}</td>
                      <td className="text-orange-300">{b ? 'T' : 'F'}</td>
                      <td className={a && b ? 'text-green-400 font-bold' : 'text-red-400'}>{a && b ? 'T' : 'F'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {mode === 'challenge' && (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {score}</span><span className="text-xs text-gray-400">{challenge.type}</span></div>
              <p className="text-2xl font-bold text-white text-center font-mono mb-5">{challenge.question}</p>
              <div className={`grid ${challenge.options.length <= 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-3`}>
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
