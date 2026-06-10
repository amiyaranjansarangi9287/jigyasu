import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans, useTranslation } from "react-i18next";

type M2 = [[number, number], [number, number]];


function addM(a: M2, b: M2): M2 { return [[a[0][0] + b[0][0], a[0][1] + b[0][1]], [a[1][0] + b[1][0], a[1][1] + b[1][1]]]; }
function mulM(a: M2, b: M2): M2 { return [[a[0][0]*b[0][0]+a[0][1]*b[1][0], a[0][0]*b[0][1]+a[0][1]*b[1][1]], [a[1][0]*b[0][0]+a[1][1]*b[1][0], a[1][0]*b[0][1]+a[1][1]*b[1][1]]]; }
function detM(a: M2): number { return a[0][0]*a[1][1] - a[0][1]*a[1][0]; }
function scaleM(a: M2, k: number): M2 { return [[a[0][0]*k, a[0][1]*k], [a[1][0]*k, a[1][1]*k]]; }
function transposeM(a: M2): M2 { return [[a[0][0], a[1][0]], [a[0][1], a[1][1]]]; }

function MatrixInput({ label, matrix, setMatrix, color }: { label: string; matrix: M2; setMatrix: (m: M2) => void; color: string }) {
    const { t } = useTranslation();
  const set = (r: number, c: number, v: number) => { const m: M2 = [[...matrix[0]], [...matrix[1]]]; m[r][c] = v; setMatrix(m); };
  return (
    <div className={`bg-${color}-500/10 rounded-2xl p-4 border border-${color}-500/20`}>
      <h4 className={`text-${color}-400 font-bold mb-2`}>{label}</h4>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1].map(r => [0, 1].map(c => (
          <input key={`${r}${c}`} type="number" value={matrix[r][c]}
            onChange={e => set(r, c, Number(e.target.value) || 0)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-bold text-center" />
        )))}
      </div>
    </div>
  );
}

function MatrixDisplay({ matrix, color, label }: { matrix: M2; color: string; label: string }) {
    const { t } = useTranslation();
  return (
    <div className={`bg-${color}-500/10 rounded-xl p-3 border border-${color}-500/20`}>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <div className="flex items-center gap-1">
        <span className="text-gray-500 text-2xl font-light">[</span>
        <div className="grid grid-cols-2 gap-1">
          {[0, 1].map(r => [0, 1].map(c => (
            <motion.span key={`${r}${c}`} className={`text-${color}-300 font-bold text-lg w-10 text-center`}
              initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{matrix[r][c]}</motion.span>
          )))}
        </div>
        <span className="text-gray-500 text-2xl font-light">]</span>
      </div>
    </div>
  );
}

function makeChallenge() {
  const type = Math.floor(Math.random() * 2);
  const rn = () => Math.floor(Math.random() * 9) - 4;
  const a: M2 = [[rn(), rn()], [rn(), rn()]];
  if (type === 0) {
    const det = detM(a);
    const wrongs = new Set([det]);
    while (wrongs.size < 4) wrongs.add(det + Math.floor(Math.random() * 11) - 5);
    return { question: `det [[${a[0].join(',')}],[${a[1].join(',')}]]`, answer: String(det), options: [...wrongs].map(String).sort(() => Math.random() - 0.5), type: 'Determinant' };
  }
  const b: M2 = [[rn(), rn()], [rn(), rn()]];
  const sum = addM(a, b);
  const answer = `[[${sum[0].join(',')}],[${sum[1].join(',')}]]`;
  const wrongs = new Set([answer]);
  while (wrongs.size < 4) { const w = addM(a, [[rn(), rn()], [rn(), rn()]]); wrongs.add(`[[${w[0].join(',')}],[${w[1].join(',')}]]`); }
  return { question: `[[${a[0].join(',')}],[${a[1].join(',')}]] + [[${b[0].join(',')}],[${b[1].join(',')}]]`, answer, options: [...wrongs].sort(() => Math.random() - 0.5), type: 'Addition' };
}

export default function MatrixOps() {
    const { t } = useTranslation();
  const [matA, setMatA] = useState<M2>([[1, 2], [3, 4]]);
  const [matB, setMatB] = useState<M2>([[5, 6], [7, 8]]);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);

  const results = useMemo(() => ({
    sum: addM(matA, matB),
    product: mulM(matA, matB),
    detA: detM(matA),
    detB: detM(matB),
    transA: transposeM(matA),
    scaled: scaleM(matA, 2),
  }), [matA, matB]);

  const answerChallenge = (opt: string) => {
    if (feedback) return;
    if (opt === challenge.answer) { setFeedback('correct'); setMastery(m => m + 1); setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200); }
    else { setFeedback('hint'); setTimeout(() => setFeedback(null), 900); }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.matrixops.matrix_operations">🧮 Matrix Operations</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.matrixops.add_multiply_transpose_and_fin">Add, multiply, transpose, and find determinants of 2×2 matrices!</Trans></p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'explore' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('explore')}><Trans i18nKey="auto.matrixops.explore">🔍 Explore</Trans></button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('challenge'); setChallenge(makeChallenge()); }}><Trans i18nKey="auto.matrixops.challenge">🎯 Challenge</Trans></button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'challenge' ? (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {mastery}</span><span className="text-sm text-gray-400">{challenge.type}</span></div>
              <p className="text-lg font-bold text-white text-center font-mono mb-5">{challenge.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-sm font-bold font-mono ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                    whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}}
                    onClick={() => answerChallenge(opt)} disabled={!!feedback}>{opt}</motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4"><Trans i18nKey="auto.matrixops.correct">✅ Correct!</Trans></p>}
              {feedback === 'hint' && <p className="text-sky-400 font-bold text-center mt-4"><Trans i18nKey="auto.matrixops.answer">Answer:</Trans> {challenge.answer}</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="ex" className="space-y-4 max-w-3xl mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-2 gap-4">
              <MatrixInput label={t('auto.attr.matrixops.matrix_a')} matrix={matA} setMatrix={setMatA} color="blue" />
              <MatrixInput label={t('auto.attr.matrixops.matrix_b')} matrix={matB} setMatrix={setMatB} color="orange" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <MatrixDisplay matrix={results.sum} color="green" label={t('auto.attr.matrixops.a_b')} />
              <MatrixDisplay matrix={results.product} color="purple" label={t('auto.attr.matrixops.a_b')} />
              <MatrixDisplay matrix={results.transA} color="cyan" label={t('auto.attr.matrixops.a_transpose')} />
              <MatrixDisplay matrix={results.scaled} color="yellow" label={t('auto.attr.matrixops.2a_scalar')} />
              <div className="bg-pink-500/10 rounded-xl p-3 border border-pink-500/20"><p className="text-gray-400 text-sm mb-1"><Trans i18nKey="auto.matrixops.det_a">det(A)</Trans></p><motion.p key={results.detA} className="text-pink-300 font-bold text-2xl" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{results.detA}</motion.p></div>
              <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20"><p className="text-gray-400 text-sm mb-1"><Trans i18nKey="auto.matrixops.det_b">det(B)</Trans></p><motion.p key={results.detB} className="text-red-300 font-bold text-2xl" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{results.detB}</motion.p></div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-sm text-gray-300 space-y-1">
              <p>📝 <strong><Trans i18nKey="auto.matrixops.det">det</Trans></strong> <Trans i18nKey="auto.matrixops.a_b_c_d_ad_bc">[[a,b],[c,d]] = ad − bc</Trans></p>
              <p>📝 <strong><Trans i18nKey="auto.matrixops.a_b">A×B</Trans></strong> <Trans i18nKey="auto.matrixops.multiplies_rows_of_a_by_column">multiplies rows of A by columns of B</Trans></p>
              <p>📝 <strong><Trans i18nKey="auto.matrixops.a">Aᵀ</Trans></strong> <Trans i18nKey="auto.matrixops.swaps_rows_and_columns">swaps rows and columns</Trans></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
