// src/worlds/lab/modules/MultiplicationLab.tsx
import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import LabShell from '../LabShell';
import { useLumoOwl } from '../hooks/useLumoOwl';
import { useLabProgress } from '../hooks/useLabProgress';
import { useLabSession } from '../hooks/useLabSession';

const ARRAYS = [
  { rows: 3, cols: 4, emoji: '🍎', context: 'Apples in a box' },
  { rows: 5, cols: 6, emoji: '🪔', context: 'Diyas in rows' },
  { rows: 4, cols: 4, emoji: '🧱', context: 'Bricks in a wall' },
  { rows: 6, cols: 7, emoji: '🌾', context: 'Rice plants' },
];

export default function MultiplicationLab() {
  const { t } = useTranslation();
  const lumo = useLumoOwl('multiplication-lab');
  const { recordMultiplication, updateCertification } = useLabProgress();
  const { trackEvent } = useLabSession();
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const a = ARRAYS[idx];
  const r = flipped ? a.cols : a.rows, c = flipped ? a.rows : a.cols;
  const correct = r * c;

  const handleCheck = useCallback(async () => {
    setChecked(true);
    if (parseInt(answer) === correct) {
      lumo.showAfterDiscovery(); await recordMultiplication(); await updateCertification('multiplication-lab', 'explorer');
      await trackEvent('multiplication-lab', 'correct_answer');
    } else await trackEvent('multiplication-lab', 'wrong_answer');
  }, [answer, correct, lumo, recordMultiplication, updateCertification, trackEvent]);

  return (
    <LabShell module="multiplication-lab" subject="math">
      <div className="min-h-screen bg-orange-50 flex flex-col p-6 pb-24">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-100 mb-6">
          <h2 className="font-bold text-lg mb-1">{a.context}</h2>
          <p className="text-sm text-slate-500">{r} <Trans i18nKey="auto.multiplicationlab.rows">rows ×</Trans> {c} <Trans i18nKey="auto.multiplicationlab.columns">columns = ?</Trans></p>
          <button onClick={() => { setFlipped(!flipped); setChecked(false); setAnswer(''); }} className="mt-2 text-sm text-orange-600 font-bold"><Trans i18nKey="auto.multiplicationlab.flip_array_commutative">🔄 Flip array (commutative)</Trans></button>
        </div>

        {/* Visual array */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-6 overflow-auto">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${c}, minmax(0, 1fr))` }}>
            {Array.from({ length: r * c }, (_, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.02 }} className="text-center text-xl">{a.emoji}</motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-6">
          <p className="text-center text-2xl font-extrabold text-slate-800 mb-3">{r} × {c} = <input type="number" value={answer} onChange={e => { setAnswer(e.target.value); setChecked(false); }} className={`w-20 text-center border-b-2 font-extrabold text-2xl focus:outline-none ${checked ? (parseInt(answer) === correct ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600') : 'border-blue-400'}`} /></p>
          {checked && parseInt(answer) === correct && <p className="text-center text-green-600 font-bold"><Trans i18nKey="auto.multiplicationlab.correct">✓ Correct!</Trans> {r} × {c} = {correct}</p>}
          {checked && parseInt(answer) !== correct && <p className="text-center text-red-500 font-bold"><Trans i18nKey="auto.multiplicationlab.try_again_count_the">Try again! Count the</Trans> {a.emoji}<Trans i18nKey="auto.multiplicationlab.s">s</Trans></p>}
        </div>

        {!checked ? <button onClick={handleCheck} disabled={!answer} className={`w-full py-4 rounded-2xl font-bold text-lg min-h-[56px] ${answer ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{t('lab.modules.MultiplicationLab.btn_Check', 'Check')}</button>
        : checked && parseInt(answer) === correct && <button onClick={() => { setIdx(p => (p + 1) % ARRAYS.length); setAnswer(''); setChecked(false); setFlipped(false); }} className="w-full py-4 bg-orange-600 text-white font-bold text-lg rounded-2xl min-h-[56px]"><Trans i18nKey="auto.multiplicationlab.next">Next →</Trans></button>}
      </div>
    </LabShell>
  );
}
