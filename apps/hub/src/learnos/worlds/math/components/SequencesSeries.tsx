import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans } from "react-i18next";

function toSup(n: number): string {
  const m: Record<string, string> = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
  return String(n).split('').map(c => m[c] || c).join('');
}

function makeChallenge() {
  const type = Math.floor(Math.random() * 2);
  if (type === 0) {
    const a = Math.floor(Math.random() * 5) + 1;
    const d = Math.floor(Math.random() * 5) + 1;
    const n = Math.floor(Math.random() * 8) + 5;
    const answer = (n / 2) * (2 * a + (n - 1) * d);
    const wrongs = new Set([answer]); while (wrongs.size < 4) { const w = answer + Math.floor(Math.random() * 21) - 10; if (w > 0 && w !== answer) wrongs.add(w); }
    return { question: `Sum of ${n} terms: a₁=${a}, d=${d}`, answer: String(answer), options: [...wrongs].map(String).sort(() => Math.random() - 0.5), type: 'Arithmetic Sum' };
  }
  const a = Math.floor(Math.random() * 3) + 1;
  const r = [2, 3][Math.floor(Math.random() * 2)];
  const n = Math.floor(Math.random() * 4) + 3;
  const answer = a * (Math.pow(r, n) - 1) / (r - 1);
  const wrongs = new Set([answer]); while (wrongs.size < 4) { const w = answer + Math.floor(Math.random() * 31) - 15; if (w > 0 && w !== answer) wrongs.add(w); }
  return { question: `Geometric sum: a₁=${a}, r=${r}, n=${n}`, answer: String(answer), options: [...wrongs].map(String).sort(() => Math.random() - 0.5), type: 'Geometric Sum' };
}

export default function SequencesSeries() {
  const [seqType, setSeqType] = useState<'arithmetic' | 'geometric'>('arithmetic');
  const [a1, setA1] = useState(2);
  const [d, setD] = useState(3);
  const [r, setR] = useState(2);
  const [n, setN] = useState(8);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);

  const terms = useMemo(() => {
    return Array.from({ length: n }, (_, i) =>
      seqType === 'arithmetic' ? a1 + i * d : a1 * Math.pow(r, i)
    );
  }, [seqType, a1, d, r, n]);

  const sum = useMemo(() => terms.reduce((a, b) => a + b, 0), [terms]);
  const maxTerm = useMemo(() => Math.max(...terms.map(Math.abs), 1), [terms]);

  const formulaSum = useMemo(() => {
    if (seqType === 'arithmetic') return (n / 2) * (2 * a1 + (n - 1) * d);
    return r === 1 ? a1 * n : a1 * (Math.pow(r, n) - 1) / (r - 1);
  }, [seqType, a1, d, r, n]);

  const nthTerm = useMemo(() => seqType === 'arithmetic' ? a1 + (n - 1) * d : a1 * Math.pow(r, n - 1), [seqType, a1, d, r, n]);

  const answerChallenge = useCallback((opt: string) => {
    if (feedback) return;
    if (opt === challenge.answer) { setFeedback('correct'); setMastery(m => m + 1); setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200); }
    else { setFeedback('hint'); setTimeout(() => setFeedback(null), 900); }
  }, [feedback, challenge]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.sequencesseries.sequences_series">∑ Sequences & Series</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.sequencesseries.explore_arithmetic_and_geometr">Explore arithmetic and geometric sequences, sums, and sigma notation!</Trans></p>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${seqType === 'arithmetic' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setSeqType('arithmetic')}><Trans i18nKey="auto.sequencesseries.arithmetic">📏 Arithmetic</Trans></button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${seqType === 'geometric' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setSeqType('geometric')}><Trans i18nKey="auto.sequencesseries.geometric">📈 Geometric</Trans></button>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl text-sm font-bold ${mode === 'explore' ? 'bg-green-500/30 text-green-300' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('explore')}><Trans i18nKey="auto.sequencesseries.explore">🔍 Explore</Trans></button>
        <button className={`px-4 py-2 rounded-xl text-sm font-bold ${mode === 'challenge' ? 'bg-orange-500/30 text-orange-300' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('challenge'); setChallenge(makeChallenge()); }}><Trans i18nKey="auto.sequencesseries.challenge">🎯 Challenge</Trans></button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'challenge' ? (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {mastery}</span><span className="text-sm text-gray-400">{challenge.type}</span></div>
              <p className="text-xl font-bold text-white text-center mb-5">{challenge.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-xl font-bold ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                    whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}}
                    onClick={() => answerChallenge(opt)} disabled={!!feedback}>{opt}</motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4"><Trans i18nKey="auto.sequencesseries.correct">✅ Correct!</Trans></p>}
              {feedback === 'hint' && <p className="text-sky-400 font-bold text-center mt-4"><Trans i18nKey="auto.sequencesseries.answer">Answer:</Trans> {challenge.answer}</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="ex" className="max-w-3xl mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Controls */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div><label className="text-gray-400 text-sm"><Trans i18nKey="auto.sequencesseries.first_term_a">First term (a₁)</Trans></label><input type="range" min="1" max="10" value={a1} onChange={e => setA1(Number(e.target.value))} className="w-full accent-blue-500" /><p className="text-white font-bold text-center">{a1}</p></div>
                {seqType === 'arithmetic' ? (
                  <div><label className="text-gray-400 text-sm"><Trans i18nKey="auto.sequencesseries.common_diff_d">Common diff (d)</Trans></label><input type="range" min="-5" max="10" value={d} onChange={e => setD(Number(e.target.value))} className="w-full accent-green-500" /><p className="text-white font-bold text-center">{d}</p></div>
                ) : (
                  <div><label className="text-gray-400 text-sm"><Trans i18nKey="auto.sequencesseries.common_ratio_r">Common ratio (r)</Trans></label><input type="range" min="-3" max="5" value={r} onChange={e => setR(Number(e.target.value))} className="w-full accent-purple-500" /><p className="text-white font-bold text-center">{r}</p></div>
                )}
                <div><label className="text-gray-400 text-sm"><Trans i18nKey="auto.sequencesseries.terms_n">Terms (n)</Trans></label><input type="range" min="3" max="15" value={n} onChange={e => setN(Number(e.target.value))} className="w-full accent-orange-500" /><p className="text-white font-bold text-center">{n}</p></div>
              </div>
            </div>

            {/* Sequence display */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h4 className="text-white font-bold mb-2"><Trans i18nKey="auto.sequencesseries.sequence">Sequence</Trans></h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {terms.map((t, i) => (
                  <motion.span key={i} className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-bold font-mono text-sm border border-white/10"
                    initial={{ scale: 0, y: -10 }} animate={{ scale: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    {Math.round(t * 100) / 100}
                  </motion.span>
                ))}
              </div>
              <p className="text-gray-400 text-sm"><Trans i18nKey="auto.sequencesseries.sigma_notation">Sigma notation:</Trans> <span className="text-white font-mono">∑ᵢ₌₁ⁿ {seqType === 'arithmetic' ? `(${a1} + (i-1)·${d})` : `${a1}·${r}ⁱ⁻¹`}</span></p>
            </div>

            {/* Bar visualization */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h4 className="text-white font-bold mb-2"><Trans i18nKey="auto.sequencesseries.visual">📊 Visual</Trans></h4>
              <div className="flex items-end gap-1 h-32">
                {terms.map((t, i) => (
                  <motion.div key={i} className="flex-1 flex flex-col items-center"
                    initial={{ height: 0 }} animate={{ height: 'auto' }}>
                    <span className="text-sm text-gray-400 mb-0.5">{Math.round(t)}</span>
                    <motion.div className={`w-full rounded-t-sm ${seqType === 'arithmetic' ? 'bg-blue-500' : 'bg-purple-500'}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(2, (Math.abs(t) / maxTerm) * 100)}px` }}
                      transition={{ delay: i * 0.04 }} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20 text-center"><p className="text-gray-400 text-sm"><Trans i18nKey="auto.sequencesseries.sum_of">Sum of</Trans> {n} <Trans i18nKey="auto.sequencesseries.terms">terms</Trans></p><motion.p key={sum} className="text-green-400 font-bold text-2xl" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{Math.round(formulaSum * 100) / 100}</motion.p></div>
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 text-center"><p className="text-gray-400 text-sm"><Trans i18nKey="auto.sequencesseries.nth_term_a">nth term (a</Trans>{toSup(n)})</p><motion.p key={nthTerm} className="text-blue-400 font-bold text-2xl" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{Math.round(nthTerm * 100) / 100}</motion.p></div>
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 text-center"><p className="text-gray-400 text-sm"><Trans i18nKey="auto.sequencesseries.average">Average</Trans></p><motion.p key={sum / n} className="text-purple-400 font-bold text-2xl" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{(sum / n).toFixed(2)}</motion.p></div>
            </div>

            {/* Formulas */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-sm text-gray-300 space-y-1">
              {seqType === 'arithmetic' ? (
                <>
                  <p>📝 <strong><Trans i18nKey="auto.sequencesseries.nth_term">nth term:</Trans></strong> <Trans i18nKey="auto.sequencesseries.a_a_n_1_d">aₙ = a₁ + (n-1)d =</Trans> {a1} + ({n}<Trans i18nKey="auto.sequencesseries.1">-1)·</Trans>{d} = {nthTerm}</p>
                  <p>📝 <strong><Trans i18nKey="auto.sequencesseries.sum">Sum:</Trans></strong> <Trans i18nKey="auto.sequencesseries.s_n_2_2a_n_1_d">Sₙ = n/2 · (2a₁ + (n-1)d) =</Trans> {n}<Trans i18nKey="auto.sequencesseries.2_2">/2 · (2·</Trans>{a1} + ({n}<Trans i18nKey="auto.sequencesseries.1">-1)·</Trans>{d}) = {formulaSum}</p>
                </>
              ) : (
                <>
                  <p>📝 <strong><Trans i18nKey="auto.sequencesseries.nth_term">nth term:</Trans></strong> <Trans i18nKey="auto.sequencesseries.a_a_r_n_1">aₙ = a₁ · r^(n-1) =</Trans> {a1} · {r}{toSup(n - 1)} = {Math.round(nthTerm * 100) / 100}</p>
                  <p>📝 <strong><Trans i18nKey="auto.sequencesseries.sum">Sum:</Trans></strong> <Trans i18nKey="auto.sequencesseries.s_a_r_1_r_1">Sₙ = a₁(rⁿ - 1)/(r - 1) =</Trans> {a1}({r}{toSup(n)} <Trans i18nKey="auto.sequencesseries.1">- 1)/(</Trans>{r} <Trans i18nKey="auto.sequencesseries.1">- 1) =</Trans> {Math.round(formulaSum * 100) / 100}</p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
