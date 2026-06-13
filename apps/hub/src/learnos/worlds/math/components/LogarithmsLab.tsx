import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

function toSup(n: number): string {
  const m: Record<string, string> = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻' };
  return String(n).split('').map(c => m[c] || c).join('');
}

function makeChallenge() {
  const type = Math.floor(Math.random() * 3);
  if (type === 0) { const base = [2,3,5,10][Math.floor(Math.random() * 4)]; const exp = Math.floor(Math.random() * 5) + 1; const val = Math.pow(base, exp); const answer = exp; const wrongs = new Set([answer]); while (wrongs.size < 4) { const w = answer + Math.floor(Math.random() * 5) - 2; if (w > 0 && w !== answer) wrongs.add(w); } return { question: `log${toSub(base)}(${val}) = ?`, answer: String(answer), options: [...wrongs].map(String).sort(() => Math.random() - 0.5), type: 'Evaluate' }; }
  if (type === 1) { const base = [2, 10][Math.floor(Math.random() * 2)]; const a = Math.floor(Math.random() * 3) + 1; const b = Math.floor(Math.random() * 3) + 1; const answer = a + b; const wrongs = new Set([answer]); while (wrongs.size < 4) { const w = answer + Math.floor(Math.random() * 5) - 2; if (w > 0 && w !== answer) wrongs.add(w); } return { question: `log${toSub(base)}(${Math.pow(base, a)}) + log${toSub(base)}(${Math.pow(base, b)}) = ?`, answer: String(answer), options: [...wrongs].map(String).sort(() => Math.random() - 0.5), type: 'Product Rule' }; }
  const val = [10, 100, 1000, 10000][Math.floor(Math.random() * 4)]; const answer = Math.log10(val); const wrongs = new Set([answer]); while (wrongs.size < 4) { const w = answer + Math.floor(Math.random() * 5) - 2; if (w > 0 && w !== answer) wrongs.add(w); }
  return { question: `log₁₀(${val}) = ?`, answer: String(answer), options: [...wrongs].map(String).sort(() => Math.random() - 0.5), type: 'Common log' };
}

function toSub(n: number): string {
  const m: Record<string, string> = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
  return String(n).split('').map(c => m[c] || c).join('');
}

export default function LogarithmsLab() {
  const { t } = useTranslation();
  const [base, setBase] = useState(2);
  const [value, setValue] = useState(8);
  const [mode, setMode] = useState<'explore' | 'rules' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);

  const logResult = useMemo(() => Math.log(value) / Math.log(base), [base, value]);
  const isExact = useMemo(() => Math.abs(logResult - Math.round(logResult)) < 0.0001, [logResult]);

  const powerTable = useMemo(() => Array.from({ length: 8 }, (_, i) => ({ exp: i, val: Math.pow(base, i) })), [base]);

  const answerChallenge = useCallback((opt: string) => {
    if (feedback) return;
    if (opt === challenge.answer) { setFeedback('correct'); setMastery(m => m + 1); setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200); }
    else { setFeedback('hint'); setTimeout(() => setFeedback(null), 900); }
  }, [feedback, challenge]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.logarithmslab.logarithms_lab">📐 Logarithms Lab</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.logarithmslab.logs_are_the_inverse_of_expone">Logs are the inverse of exponents — explore and master them!</Trans></p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {[{ id: 'explore' as const, e: '🔍', l: t('auto.logarithmslab.explore', 'Explore') }, { id: 'rules' as const, e: '📜', l: t('auto.logarithmslab.rules', 'Rules') }, { id: 'challenge' as const, e: '🎯', l: t('auto.logarithmslab.challenge', 'Challenge') }].map(m => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`}
            onClick={() => { setMode(m.id); if (m.id === 'challenge') setChallenge(makeChallenge()); }}>{m.e} {m.l}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'explore' && (
          <motion.div key="ex" className="max-w-2xl mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-blue-400 text-sm font-bold"><Trans i18nKey="auto.logarithmslab.base">Base</Trans></label>
                  <input type="range" min="2" max="10" value={base} onChange={e => setBase(Number(e.target.value))} className="w-full accent-blue-500" />
                  <p className="text-white font-bold text-center text-2xl">{base}</p></div>
                <div><label className="text-sky-400 text-sm font-bold"><Trans i18nKey="auto.logarithmslab.value">Value</Trans></label>
                  <input type="range" min="1" max="1000" value={value} onChange={e => setValue(Number(e.target.value))} className="w-full accent-orange-500" />
                  <p className="text-white font-bold text-center text-2xl">{value}</p></div>
              </div>
              <div className="text-center bg-black/20 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1"><Trans i18nKey="auto.logarithmslab.logarithm">Logarithm</Trans></p>
                <p className="text-3xl font-bold"><span className="text-blue-400"><Trans i18nKey="auto.logarithmslab.log">log</Trans></span><span className="text-blue-300 text-lg">{toSub(base)}</span><span className="text-white">(</span><span className="text-sky-400">{value}</span><span className="text-white">) = </span><motion.span key={logResult} className={isExact ? 'text-green-400' : 'text-yellow-400'} initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{logResult.toFixed(4)}</motion.span></p>
                <p className="text-gray-400 text-sm mt-2"><Trans i18nKey="auto.logarithmslab.meaning">Meaning:</Trans> <span className="text-blue-400">{base}</span>{toSup(Math.round(logResult * 100) / 100 === Math.round(logResult) ? Math.round(logResult) : logResult)} ≈ <span className="text-sky-400">{value}</span></p>
                {isExact && <p className="text-green-300 text-sm mt-1"><Trans i18nKey="auto.logarithmslab.exact_integer_result">✨ Exact integer result!</Trans> {base}{toSup(Math.round(logResult))} = {value}</p>}
              </div>
            </div>

            {/* Power table */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h4 className="text-white font-bold mb-3"><Trans i18nKey="auto.logarithmslab.powers_of">Powers of</Trans> {base} <Trans i18nKey="auto.logarithmslab.click_to_set_value">(click to set value)</Trans></h4>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {powerTable.map(p => (
                  <motion.button key={p.exp} className={`rounded-xl p-2 text-center border ${value === p.val ? 'bg-green-500/30 border-green-400' : 'bg-white/5 border-white/10'}`}
                    whileHover={{ scale: 1.1 }} onClick={() => setValue(p.val)}>
                    <p className="text-sm text-gray-400">{base}{toSup(p.exp)}</p>
                    <p className="text-white font-bold text-sm">{p.val}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 text-sm text-center">
              <p className="text-purple-300">💡 <strong><Trans i18nKey="auto.logarithmslab.log">log</Trans>{toSub(base)}({value})</strong> <Trans i18nKey="auto.logarithmslab.asks">asks: "</Trans><strong>{base}</strong> <Trans i18nKey="auto.logarithmslab.raised_to">raised to</Trans> <em><Trans i18nKey="auto.logarithmslab.what_power">what power</Trans></em> <Trans i18nKey="auto.logarithmslab.gives">gives</Trans> <strong>{value}</strong>?"</p>
            </div>
          </motion.div>
        )}

        {mode === 'rules' && (
          <motion.div key="rules" className="max-w-lg mx-auto space-y-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {[
              { rule: 'Product Rule', formula: 'log(ab) = log(a) + log(b)', example: `log₂(4×8) = log₂(4) + log₂(8) = 2 + 3 = 5`, color: 'blue' },
              { rule: 'Quotient Rule', formula: 'log(a/b) = log(a) - log(b)', example: `log₂(32/4) = log₂(32) - log₂(4) = 5 - 2 = 3`, color: 'green' },
              { rule: 'Power Rule', formula: 'log(aⁿ) = n·log(a)', example: `log₂(8²) = 2·log₂(8) = 2×3 = 6`, color: 'purple' },
              { rule: 'Change of Base', formula: 'logₐ(x) = log(x) / log(a)', example: `log₃(9) = log(9) / log(3) = 2`, color: 'orange' },
              { rule: 'Log of 1', formula: 'logₐ(1) = 0', example: 'Because a⁰ = 1 for any base a', color: 'yellow' },
              { rule: 'Log of Base', formula: 'logₐ(a) = 1', example: 'Because a¹ = a', color: 'cyan' },
              { rule: 'Inverse', formula: 'a^(logₐ(x)) = x', example: 'Logs and exponents undo each other', color: 'pink' },
            ].map((law, i) => (
              <motion.div key={law.rule} className={`bg-${law.color}-500/10 rounded-2xl p-4 border border-${law.color}-500/20`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <p className="text-white font-bold">{law.rule}</p>
                <p className="text-xl font-bold font-mono text-white mt-1">{law.formula}</p>
                <p className="text-gray-400 text-sm mt-1">{law.example}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {mode === 'challenge' && (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {mastery}</span><span className="text-sm text-gray-400">{challenge.type}</span></div>
              <p className="text-2xl font-bold text-white text-center font-mono mb-5">{challenge.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-xl font-bold ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                    whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}}
                    onClick={() => answerChallenge(opt)} disabled={!!feedback}>{opt}</motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4"><Trans i18nKey="auto.logarithmslab.correct">✅ Correct!</Trans></p>}
              {feedback === 'hint' && <p className="text-sky-400 font-bold text-center mt-4"><Trans i18nKey="auto.logarithmslab.answer">Answer:</Trans> {challenge.answer}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
