import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans, useTranslation } from "react-i18next";

export default function CalculusPreview() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'limits' | 'derivatives' | 'integrals'>('limits');
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.calculuspreview.calculus_preview">∫ Calculus Preview</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.calculuspreview.limits_tangent_slopes_and_area">Limits, tangent slopes, and area under curves — a visual first look!</Trans></p>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {[{ id: 'limits' as const, e: '🎯', l: t('auto.calculuspreview.limits', 'Limits') }, { id: 'derivatives' as const, e: '📐', l: t('auto.calculuspreview.derivatives', 'Derivatives') }, { id: 'integrals' as const, e: '📊', l: t('auto.calculuspreview.integrals', 'Integrals') }].map(m => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode(m.id)}>{m.e} {m.l}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {mode === 'limits' && <motion.div key="l" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><LimitsExplorer /></motion.div>}
        {mode === 'derivatives' && <motion.div key="d" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><DerivativeExplorer /></motion.div>}
        {mode === 'integrals' && <motion.div key="i" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><IntegralExplorer /></motion.div>}
      </AnimatePresence>
    </div>
  );
}

function LimitsExplorer() {
  const [xVal, setXVal] = useState(1.5);
  const f = (x: number) => x * x;
  const fLabel = 'f(x) = x²';
  const limit = f(xVal);

  const gSize = 300, gRange = 5, unit = gSize / (gRange * 2), cx = gSize / 2, cy = gSize / 2;
  const sx = (x: number) => cx + x * unit, sy = (y: number) => cy - y * unit;
  const path = useMemo(() => { const pts: string[] = []; for (let x = -gRange; x <= gRange; x += 0.1) { const y = f(x); if (Math.abs(y) <= gRange * 2) pts.push(`${sx(x)},${sy(y)}`); } return 'M ' + pts.join(' L '); }, []);

  const approach = [xVal - 0.5, xVal - 0.2, xVal - 0.1, xVal - 0.01, xVal, xVal + 0.01, xVal + 0.1, xVal + 0.2, xVal + 0.5];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
      <div className="bg-white/5 rounded-3xl p-4 border border-white/10 flex justify-center">
        <svg width={gSize} height={gSize} className="bg-black/20 rounded-xl">
          <line x1={0} y1={cy} x2={gSize} y2={cy} stroke="rgba(255,255,255,0.25)" /><line x1={cx} y1={0} x2={cx} y2={gSize} stroke="rgba(255,255,255,0.25)" />
          <path d={path} fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
          <motion.line x1={sx(xVal)} y1={0} x2={sx(xVal)} y2={gSize} stroke="rgba(251,191,36,0.4)" strokeWidth="1" strokeDasharray="4" animate={{ x1: sx(xVal), x2: sx(xVal) }} />
          <motion.circle cx={sx(xVal)} cy={sy(f(xVal))} r="6" fill="#f59e0b" animate={{ cx: sx(xVal), cy: sy(f(xVal)) }} />
        </svg>
      </div>
      <div className="space-y-4">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <p className="text-gray-400 text-sm mb-1">{fLabel}</p>
          <div className="flex items-center gap-3"><label className="text-gray-400 text-sm"><Trans i18nKey="auto.calculuspreview.x">x →</Trans></label><input type="range" min="-4" max="4" step="0.1" value={xVal} onChange={e => setXVal(Number(e.target.value))} className="flex-1 accent-yellow-500" /><span className="text-yellow-400 font-bold w-10">{xVal}</span></div>
          <p className="text-center text-2xl font-bold mt-3 text-white"><Trans i18nKey="auto.calculuspreview.lim_f_x">lim f(x) =</Trans> <motion.span key={limit} className="text-green-400" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{limit.toFixed(4)}</motion.span></p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-white font-bold text-sm mb-2"><Trans i18nKey="auto.calculuspreview.approaching_x">Approaching x =</Trans> {xVal}</h4>
          <table className="w-full text-sm"><thead><tr className="text-gray-400"><th className="text-left py-1"><Trans i18nKey="auto.calculuspreview.x">x</Trans></th><th className="text-right"><Trans i18nKey="auto.calculuspreview.f_x">f(x)</Trans></th></tr></thead><tbody>
            {approach.map(x => <tr key={x} className={`border-t border-white/5 ${Math.abs(x - xVal) < 0.001 ? 'bg-yellow-500/20' : ''}`}><td className="py-1 text-blue-300">{x.toFixed(3)}</td><td className="text-right text-green-300">{f(x).toFixed(4)}</td></tr>)}
          </tbody></table>
        </div>
        <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 text-sm text-purple-300"><Trans i18nKey="auto.calculuspreview.a_limit_is_the_value_f_x_appro">💡 A limit is the value f(x) approaches as x gets closer and closer to a point.</Trans></div>
      </div>
    </div>
  );
}

function DerivativeExplorer() {
  const { t } = useTranslation();
  const [xVal, setXVal] = useState(1);
  const [funcType, setFuncType] = useState<'x2' | 'x3' | 'sinx'>('x2');

  const fn = funcType === 'x2' ? (x: number) => x * x : funcType === 'x3' ? (x: number) => x * x * x : (x: number) => Math.sin(x) * 3;
  const dfn = funcType === 'x2' ? (x: number) => 2 * x : funcType === 'x3' ? (x: number) => 3 * x * x : (x: number) => Math.cos(x) * 3;
  const fLabel = funcType === 'x2' ? 'x²' : funcType === 'x3' ? 'x³' : '3sin(x)';
  const dfLabel = funcType === 'x2' ? '2x' : funcType === 'x3' ? '3x²' : '3cos(x)';

  const slope = dfn(xVal);
  const yVal = fn(xVal);

  const gSize = 300, gRange = 5, unit = gSize / (gRange * 2), cx = gSize / 2, cy = gSize / 2;
  const sx = (x: number) => cx + x * unit, sy = (y: number) => cy - y * unit;
  const curvePath = useMemo(() => { const pts: string[] = []; for (let x = -gRange; x <= gRange; x += 0.1) { const y = fn(x); if (Math.abs(y) <= 20) pts.push(`${sx(x)},${sy(y)}`); } return 'M ' + pts.join(' L '); }, [funcType]);

  const tangentLen = 2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
      <div className="bg-white/5 rounded-3xl p-4 border border-white/10 flex justify-center">
        <svg width={gSize} height={gSize} className="bg-black/20 rounded-xl">
          <line x1={0} y1={cy} x2={gSize} y2={cy} stroke="rgba(255,255,255,0.25)" /><line x1={cx} y1={0} x2={cx} y2={gSize} stroke="rgba(255,255,255,0.25)" />
          <path d={curvePath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
          {/* Tangent line */}
          <motion.line x1={sx(xVal - tangentLen)} y1={sy(yVal - slope * tangentLen)} x2={sx(xVal + tangentLen)} y2={sy(yVal + slope * tangentLen)} stroke="#ef4444" strokeWidth="2" strokeDasharray="6"
            animate={{ x1: sx(xVal - tangentLen), y1: sy(yVal - slope * tangentLen), x2: sx(xVal + tangentLen), y2: sy(yVal + slope * tangentLen) }} />
          <motion.circle cx={sx(xVal)} cy={sy(yVal)} r="6" fill="#f59e0b" animate={{ cx: sx(xVal), cy: sy(yVal) }} />
        </svg>
      </div>
      <div className="space-y-4">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <div className="flex gap-2 mb-3">{(['x2', 'x3', 'sinx'] as const).map(f => <button key={f} className={`flex-1 py-2 rounded-lg font-bold text-sm ${funcType === f ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-gray-400'}`} onClick={() => setFuncType(f)}>{f === 'x2' ? 'x²' : f === 'x3' ? 'x³' : '3sin(x)'}</button>)}</div>
          <div className="flex items-center gap-3"><label className="text-gray-400 text-sm"><Trans i18nKey="auto.calculuspreview.x">x =</Trans></label><input type="range" min="-4" max="4" step="0.1" value={xVal} onChange={e => setXVal(Number(e.target.value))} className="flex-1 accent-yellow-500" /><span className="text-yellow-400 font-bold w-10">{xVal}</span></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 text-center"><p className="text-gray-400 text-sm"><Trans i18nKey="auto.calculuspreview.f_x">f(x) =</Trans> {fLabel}</p><motion.p key={yVal} className="text-purple-400 font-bold text-xl" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{yVal.toFixed(3)}</motion.p></div>
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20 text-center"><p className="text-gray-400 text-sm"><Trans i18nKey="auto.calculuspreview.f_x">f'(x) =</Trans> {dfLabel}</p><motion.p key={slope} className="text-sky-400 font-bold text-xl" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{slope.toFixed(3)}</motion.p></div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-sm text-gray-300 space-y-1">
          <p><Trans i18nKey="auto.calculuspreview.the">📝 The</Trans> <span className="text-sky-400"><Trans i18nKey="auto.calculuspreview.derivative_f_x">derivative f'(x)</Trans></span> <Trans i18nKey="auto.calculuspreview.is_the">is the</Trans> <strong><Trans i18nKey="auto.calculuspreview.slope_of_the_tangent_line">slope of the tangent line</Trans></strong> <Trans i18nKey="auto.calculuspreview.at_x">at x.</Trans></p>
          <p>📝 {slope > 0 ? t('auto.calculuspreview.positive_slope_function_increasing', '📈 Positive slope → function increasing') : slope < 0 ? t('auto.calculuspreview.negative_slope_function_decreasing', '📉 Negative slope → function decreasing') : t('auto.calculuspreview.zero_slope_function_flat', '➖ Zero slope → function flat (possible max/min)')}</p>
        </div>
      </div>
    </div>
  );
}

function IntegralExplorer() {
  const [aVal, setAVal] = useState(0); const [bVal, setBVal] = useState(3);
  const fn = (x: number) => x * x;
  const fLabel = 'f(x) = x²';

  const gSize = 300, gRange = 5, unit = gSize / (gRange * 2), cx = gSize / 2, cy = gSize / 2;
  const sx = (x: number) => cx + x * unit, sy = (y: number) => cy - y * unit;
  const curvePath = useMemo(() => { const pts: string[] = []; for (let x = -gRange; x <= gRange; x += 0.1) { const y = fn(x); if (Math.abs(y) <= 30) pts.push(`${sx(x)},${sy(y)}`); } return 'M ' + pts.join(' L '); }, []);

  const numRects = 20;
  const dx = (bVal - aVal) / numRects;
  const rects = useMemo(() => Array.from({ length: numRects }, (_, i) => { const x = aVal + i * dx; return { x, y: fn(x), w: dx }; }), [aVal, bVal, dx]);
  const approxArea = useMemo(() => rects.reduce((s, r) => s + r.y * r.w, 0), [rects]);
  const exactArea = useMemo(() => (Math.pow(bVal, 3) - Math.pow(aVal, 3)) / 3, [aVal, bVal]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
      <div className="bg-white/5 rounded-3xl p-4 border border-white/10 flex justify-center">
        <svg width={gSize} height={gSize} className="bg-black/20 rounded-xl">
          <line x1={0} y1={cy} x2={gSize} y2={cy} stroke="rgba(255,255,255,0.25)" /><line x1={cx} y1={0} x2={cx} y2={gSize} stroke="rgba(255,255,255,0.25)" />
          {/* Riemann rectangles */}
          {rects.map((r, i) => r.y >= 0 ? <motion.rect key={i} x={sx(r.x)} y={sy(r.y)} width={Math.max(1, r.w * unit)} height={r.y * unit} fill="rgba(34,197,94,0.3)" stroke="rgba(34,197,94,0.5)" strokeWidth="0.5" initial={{ height: 0, y: cy }} animate={{ height: r.y * unit, y: sy(r.y) }} transition={{ delay: i * 0.02 }} /> : null)}
          <path d={curvePath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
          {/* Bounds markers */}
          <motion.line x1={sx(aVal)} y1={0} x2={sx(aVal)} y2={gSize} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4" animate={{ x1: sx(aVal), x2: sx(aVal) }} />
          <motion.line x1={sx(bVal)} y1={0} x2={sx(bVal)} y2={gSize} stroke="#f97316" strokeWidth="1.5" strokeDasharray="4" animate={{ x1: sx(bVal), x2: sx(bVal) }} />
          <text x={sx(aVal) - 4} y={gSize - 5} fill="#60a5fa" fontSize="11" fontWeight="bold"><Trans i18nKey="auto.calculuspreview.a">a</Trans></text>
          <text x={sx(bVal) - 4} y={gSize - 5} fill="#f97316" fontSize="11" fontWeight="bold"><Trans i18nKey="auto.calculuspreview.b">b</Trans></text>
        </svg>
      </div>
      <div className="space-y-4">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <p className="text-gray-400 text-sm mb-3">{fLabel}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3"><label className="text-blue-400 text-sm w-6"><Trans i18nKey="auto.calculuspreview.a">a</Trans></label><input type="range" min="-4" max="4" step="0.1" value={aVal} onChange={e => setAVal(Math.min(Number(e.target.value), bVal - 0.1))} className="flex-1 accent-blue-500" /><span className="text-blue-400 font-bold w-10">{aVal}</span></div>
            <div className="flex items-center gap-3"><label className="text-sky-400 text-sm w-6"><Trans i18nKey="auto.calculuspreview.b">b</Trans></label><input type="range" min="-4" max="4" step="0.1" value={bVal} onChange={e => setBVal(Math.max(Number(e.target.value), aVal + 0.1))} className="flex-1 accent-orange-500" /><span className="text-sky-400 font-bold w-10">{bVal}</span></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20 text-center"><p className="text-gray-400 text-sm"><Trans i18nKey="auto.calculuspreview.approx_area">Approx area (</Trans>{numRects} <Trans i18nKey="auto.calculuspreview.rects">rects)</Trans></p><motion.p key={approxArea} className="text-green-400 font-bold text-xl" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{approxArea.toFixed(3)}</motion.p></div>
          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 text-center"><p className="text-gray-400 text-sm"><Trans i18nKey="auto.calculuspreview.exact_x_dx">Exact ∫x² dx</Trans></p><motion.p key={exactArea} className="text-purple-400 font-bold text-xl" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{exactArea.toFixed(3)}</motion.p></div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-sm text-gray-300 space-y-1">
          <p><Trans i18nKey="auto.calculuspreview.x_dx_x_3">📝 ∫ₐᵇ x² dx = [x³/3]ₐᵇ =</Trans> {bVal}<Trans i18nKey="auto.calculuspreview.3">³/3 −</Trans> {aVal}<Trans i18nKey="auto.calculuspreview.3">³/3 =</Trans> {exactArea.toFixed(3)}</p>
          <p><Trans i18nKey="auto.calculuspreview.the">📝 The</Trans> <span className="text-green-400"><Trans i18nKey="auto.calculuspreview.green_rectangles">green rectangles</Trans></span> <Trans i18nKey="auto.calculuspreview.approximate_the_area_under_the">approximate the area under the curve.</Trans></p>
          <p><Trans i18nKey="auto.calculuspreview.more_rectangles_better_approxi">📝 More rectangles → better approximation → the integral is the exact limit.</Trans></p>
        </div>
      </div>
    </div>
  );
}
