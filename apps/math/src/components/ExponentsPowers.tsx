import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function toSup(n: number): string {
  const m: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  return String(n).split('').map(c => m[c] || c).join('');
}

function makeChallenge() {
  const type = Math.floor(Math.random() * 5);
  let question: string, answer: number;
  if (type === 0) { const b = Math.floor(Math.random() * 8) + 2; const e = Math.floor(Math.random() * 3) + 2; answer = Math.pow(b, e); question = `${b}${toSup(e)} = ?`; }
  else if (type === 1) { const b = Math.floor(Math.random() * 5) + 2; answer = 1; question = `${b}${toSup(0)} = ?`; }
  else if (type === 2) { const a = Math.floor(Math.random() * 4) + 2; const m = Math.floor(Math.random() * 3) + 1; const n = Math.floor(Math.random() * 3) + 1; answer = m + n; question = `${a}${toSup(m)} × ${a}${toSup(n)} = ${a}^?`; }
  else if (type === 3) { const val = [100, 1000, 10000, 5000, 300, 47000][Math.floor(Math.random() * 6)]; const exp = Math.floor(Math.log10(val)); const coeff = val / Math.pow(10, exp); answer = exp; question = `${val} in scientific notation = ${coeff} × 10^?`; }
  else { const b = [2, 3, 5, 10][Math.floor(Math.random() * 4)]; const e = Math.floor(Math.random() * 3) + 2; answer = Math.pow(b, e); question = `(${b}${toSup(e)}) = ?`; }
  const wrongs = new Set<number>();
  while (wrongs.size < 3) { const w = answer + Math.floor(Math.random() * 11) - 5; if (w !== answer && w >= 0) wrongs.add(w); }
  return { question, answer, options: [answer, ...wrongs].sort(() => Math.random() - 0.5) };
}

export default function ExponentsPowers() {
  const [base, setBase] = useState(2);
  const [exp, setExp] = useState(3);
  const [mode, setMode] = useState<'explore' | 'laws' | 'scientific' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [sciNum, setSciNum] = useState(4500);

  const result = useMemo(() => Math.pow(base, exp), [base, exp]);
  const expanded = useMemo(() => Array(Math.abs(exp)).fill(base).join(' × '), [base, exp]);

  const sciExponent = useMemo(() => {
    if (sciNum === 0) return { coeff: 0, exp: 0 };
    const e = Math.floor(Math.log10(Math.abs(sciNum)));
    const c = sciNum / Math.pow(10, e);
    return { coeff: Math.round(c * 1000) / 1000, exp: e };
  }, [sciNum]);

  const powers = useMemo(() => Array.from({ length: 8 }, (_, i) => ({ exp: i, value: Math.pow(base, i) })), [base]);

  const answerChallenge = useCallback((opt: number) => {
    if (feedback) return;
    if (opt === challenge.answer) {
      setFeedback('correct'); setScore(s => s + 10);
      setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200);
    } else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 900); }
  }, [feedback, challenge]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">⚡ Exponents & Powers</h2>
        <p className="text-purple-300 text-lg">Understand exponent rules and scientific notation!</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {([
          { id: 'explore' as const, emoji: '🔍', label: 'Explore' },
          { id: 'laws' as const, emoji: '📜', label: 'Laws' },
          { id: 'scientific' as const, emoji: '🔬', label: 'Sci Notation' },
          { id: 'challenge' as const, emoji: '🎯', label: 'Challenge' },
        ]).map(m => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`}
            onClick={() => { setMode(m.id); if (m.id === 'challenge') setChallenge(makeChallenge()); }}>{m.emoji} {m.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'explore' && (
          <motion.div key="ex" className="max-w-2xl mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-blue-400 text-sm font-bold">Base</label>
                  <input type="range" min="1" max="10" value={base} onChange={e => setBase(Number(e.target.value))} className="w-full accent-blue-500" />
                  <p className="text-white font-bold text-center text-3xl">{base}</p></div>
                <div><label className="text-orange-400 text-sm font-bold">Exponent</label>
                  <input type="range" min="0" max="7" value={exp} onChange={e => setExp(Number(e.target.value))} className="w-full accent-orange-500" />
                  <p className="text-white font-bold text-center text-3xl">{exp}</p></div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold"><span className="text-blue-400">{base}</span><span className="text-orange-400">{toSup(exp)}</span> <span className="text-gray-400">=</span> <motion.span key={result} className="text-green-400" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{result.toLocaleString()}</motion.span></p>
                {exp > 0 && <p className="text-gray-400 text-sm mt-2">= {expanded} = {result.toLocaleString()}</p>}
                {exp === 0 && <p className="text-gray-400 text-sm mt-2">Any number to the power of 0 equals 1</p>}
              </div>
            </div>

            {/* Powers table */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h4 className="text-white font-bold mb-3">Powers of {base}</h4>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {powers.map(p => (
                  <motion.div key={p.exp} className={`rounded-xl p-2 text-center border ${p.exp === exp ? 'bg-purple-500/30 border-purple-400' : 'bg-white/5 border-white/10'}`}
                    whileHover={{ scale: 1.1 }} onClick={() => setExp(p.exp)}>
                    <p className="text-white text-xs">{base}{toSup(p.exp)}</p>
                    <p className="text-green-400 font-bold text-sm">{p.value.toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h4 className="text-white font-bold mb-2">🟦 Visual: {base}{toSup(exp)} = {result} blocks</h4>
              <div className="flex flex-wrap gap-0.5 max-min-h-32 overflow-y-auto">
                {Array.from({ length: Math.min(result, 200) }).map((_, i) => (
                  <motion.div key={i} className="w-3 h-3 rounded-sm bg-blue-500" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.005 }} />
                ))}
                {result > 200 && <span className="text-gray-500 text-xs self-end ml-2">+{result - 200} more</span>}
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'laws' && (
          <motion.div key="laws" className="max-w-lg mx-auto space-y-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {[
              { rule: 'Product Rule', formula: 'aⁿ × aᵐ = aⁿ⁺ᵐ', example: `${base}² × ${base}³ = ${base}⁵ = ${Math.pow(base, 5)}`, color: 'blue' },
              { rule: 'Quotient Rule', formula: 'aⁿ ÷ aᵐ = aⁿ⁻ᵐ', example: `${base}⁵ ÷ ${base}² = ${base}³ = ${Math.pow(base, 3)}`, color: 'green' },
              { rule: 'Power Rule', formula: '(aⁿ)ᵐ = aⁿˣᵐ', example: `(${base}²)³ = ${base}⁶ = ${Math.pow(base, 6)}`, color: 'purple' },
              { rule: 'Zero Exponent', formula: 'a⁰ = 1', example: `${base}⁰ = 1`, color: 'yellow' },
              { rule: 'Negative Exponent', formula: 'a⁻ⁿ = 1/aⁿ', example: `${base}⁻² = 1/${base}² = 1/${base * base}`, color: 'red' },
              { rule: 'Power of Product', formula: '(ab)ⁿ = aⁿ × bⁿ', example: `(2×3)² = 2² × 3² = 4 × 9 = 36`, color: 'cyan' },
            ].map((law, i) => (
              <motion.div key={law.rule} className={`bg-${law.color}-500/10 rounded-2xl p-4 border border-${law.color}-500/20`}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <p className="text-white font-bold">{law.rule}</p>
                <p className="text-2xl font-bold font-mono text-white mt-1">{law.formula}</p>
                <p className="text-gray-400 text-sm mt-1">Example: {law.example}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {mode === 'scientific' && (
          <motion.div key="sci" className="max-w-lg mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <h4 className="text-white font-bold mb-3">🔬 Scientific Notation Converter</h4>
              <input type="range" min="1" max="999999" value={sciNum} onChange={e => setSciNum(Number(e.target.value))} className="w-full accent-purple-500 mb-2" />
              <input type="number" value={sciNum} onChange={e => setSciNum(Math.max(1, Number(e.target.value) || 1))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-2xl font-bold text-center mb-4" />
              <div className="text-center">
                <p className="text-gray-400 text-sm">Standard form</p>
                <p className="text-4xl font-bold text-white">{sciNum.toLocaleString()}</p>
                <p className="text-gray-400 text-sm mt-3">Scientific notation</p>
                <motion.p key={sciNum} className="text-4xl font-bold text-purple-400" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                  {sciExponent.coeff} × 10{toSup(sciExponent.exp)}
                </motion.p>
                <p className="text-gray-500 text-xs mt-2">Move decimal {sciExponent.exp} place{sciExponent.exp !== 1 ? 's' : ''} to the right</p>
              </div>
            </div>
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 text-sm">
              <p className="text-purple-300">💡 <strong>Scientific notation</strong> writes numbers as a coefficient between 1 and 10 multiplied by a power of 10. Useful for very large or very small numbers!</p>
            </div>
          </motion.div>
        )}

        {mode === 'challenge' && (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {score}</span></div>
              <p className="text-3xl font-bold text-white text-center mb-5">{challenge.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-xl font-bold ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
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
