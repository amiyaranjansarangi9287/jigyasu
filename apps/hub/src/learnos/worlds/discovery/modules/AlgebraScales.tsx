// src/worlds/discovery/modules/AlgebraScales.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import DiscoveryShell from '../DiscoveryShell';
import { useLumoSage } from '../hooks/useLumoSage';
import { useDiscoveryProgress } from '../hooks/useDiscoveryProgress';
import { useDiscoverySession } from '../hooks/useDiscoverySession';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import { ALGEBRA_CHALLENGES } from '../data/discoveryContent';

export default function AlgebraScales() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lumo = useLumoSage();
  const { recordAlgebraSolved, updateMastery } = useDiscoveryProgress();
  const { trackEvent } = useDiscoverySession();
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState('');
  const [chk, setChk] = useState(false);
  const ch = ALGEBRA_CHALLENGES[idx % ALGEBRA_CHALLENGES.length];
  const ok = Math.abs(parseFloat(ans) - ch.solution) < 0.01;

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = CanvasHelpers.setupHiDPI(canvas, canvas.getBoundingClientRect().width, 240);
    const w = canvas.getBoundingClientRect().width, h = 240;
    const render = (t: number) => {
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#0F172A'; ctx.fillRect(0, 0, w, h);
      const tilt = chk ? (ok ? 0 : Math.sin(t/200) * 0.05) : Math.sin(t/1000) * 0.03;
      ctx.save(); ctx.translate(w/2, h/2); ctx.rotate(tilt);
      ctx.fillStyle = '#94A3B8'; ctx.fillRect(-100, -5, 200, 10);
      ctx.fillStyle = '#1E293B'; ctx.strokeStyle = '#6366F1'; ctx.beginPath(); ctx.roundRect(-140, 20, 80, 40, 6); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(60, 20, 80, 40, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#FFF'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
      ctx.fillText(ch.equation.split('=')[0], -100, 45); ctx.fillText(ch.equation.split('=')[1], 100, 45);
      ctx.restore();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }, [ch, chk, ok]);

  const handleCheck = useCallback(async () => {
    setChk(true);
    if (ok) { lumo.afterDiscovery(); await recordAlgebraSolved(); await updateMastery('algebra-scales', 'understand'); await trackEvent('algebra-scales', 'correct_answer'); }
    else await trackEvent('algebra-scales', 'wrong_answer');
  }, [ok, lumo, recordAlgebraSolved, updateMastery, trackEvent]);

  return (
    <DiscoveryShell module="algebra-scales">
      <div className="flex flex-col flex-1 p-6 overflow-auto pb-24">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 mb-6 text-center">
          <p className="text-indigo-400 text-sm font-bold uppercase mb-2">{t('discovery.modules.AlgebraScales.txt_Equation', 'Equation')}</p>
          <p className="text-3xl font-mono text-white font-bold">{ch.equation}</p>
        </div>
        <canvas ref={canvasRef} className="w-full mb-6" style={{ height: '240px' }} />
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 p-4 flex items-center">
            <span className="text-slate-500 font-mono mr-2">{t('discovery.modules.AlgebraScales.spn_x', 'x =')}</span>
            <input type="number" value={ans} onChange={e => { setAns(e.target.value); setChk(false); }} className="bg-transparent text-white font-bold outline-none flex-1" placeholder="?" />
          </div>
          <button onClick={handleCheck} className="bg-indigo-600 text-white px-6 rounded-2xl font-bold">{t('discovery.modules.AlgebraScales.btn_Check', 'Check')}</button>
        </div>
        <AnimatePresence>{chk && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-2xl ${ok ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            <p className="font-bold">{ok ? 'Correct! The scale balances.' : `Not quite. ${ch.hint}`}</p>
            {ok && <button onClick={() => { setIdx(i => i+1); setAns(''); setChk(false); }} className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold"><Trans i18nKey="auto.algebrascales.next_equation">Next Equation</Trans></button>}
          </motion.div>
        )}</AnimatePresence>
      </div>
    </DiscoveryShell>
  );
}
