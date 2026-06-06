// src/worlds/academy/modules/TrigonometryCircle.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import AcademyShell from '../AcademyShell';
import { useLumoAncient } from '../hooks/useLumoAncient';
import { useAcademyProgress } from '../hooks/useAcademyProgress';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import { calculateTrigPoint, SPECIAL_ANGLES, TRIG_MEMORY_AIDS } from '../data/academyContent';

export default function TrigonometryCircle() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lumo = useLumoAncient();
  const { recordTrigonometry } = useAcademyProgress();
  const [angleDeg, setAngleDeg] = useState(45);
  const [showRadians, setShowRadians] = useState(false);
  const [showWave, setShowWave] = useState(false);
  const trigPoint = calculateTrigPoint(angleDeg);

  const handleWaveToggle = useCallback(async () => {
    setShowWave(w => !w);
    if (!showWave) { await recordTrigonometry(true, true, showRadians, false); lumo.afterProfoundDiscovery(); }
  }, [showWave, showRadians, recordTrigonometry, lumo]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = CanvasHelpers.setupHiDPI(canvas, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
    const w = canvas.getBoundingClientRect().width, h = canvas.getBoundingClientRect().height;
    const cx = showWave ? w * 0.3 : w * 0.5, cy = h * 0.5, r = Math.min(cx, cy) * 0.7;
    let frame: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#0A0A0F'; ctx.fillRect(0, 0, w, h);
      // Axes
      ctx.strokeStyle = 'rgba(148,163,184,0.2)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - r - 10, cy); ctx.lineTo(cx + r + 10, cy); ctx.moveTo(cx, cy - r - 10); ctx.lineTo(cx, cy + r + 10); ctx.stroke();
      // Circle
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(99,102,241,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();
      // Special angle dots
      SPECIAL_ANGLES.forEach(deg => { const rad = deg * Math.PI / 180; ctx.beginPath(); ctx.arc(cx + Math.cos(rad) * r, cy - Math.sin(rad) * r, 2, 0, Math.PI * 2); ctx.fillStyle = 'rgba(99,102,241,0.3)'; ctx.fill(); });
      // Point
      const rad = angleDeg * Math.PI / 180;
      const px = cx + Math.cos(rad) * r, py = cy - Math.sin(rad) * r;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.strokeStyle = '#818CF8'; ctx.lineWidth = 2; ctx.stroke();
      // Sin line
      ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.strokeStyle = '#F87171'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
      // Cos line
      ctx.beginPath(); ctx.moveTo(cx, py); ctx.lineTo(px, py); ctx.strokeStyle = '#60A5FA'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
      // Point dot
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fillStyle = '#818CF8'; ctx.fill();
      // Angle arc
      ctx.beginPath(); ctx.arc(cx, cy, 25, 0, -rad, rad > 0); ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2; ctx.stroke();
      // Waves
      if (showWave) {
        const wX = w * 0.55, wW = w * 0.42;
        ctx.beginPath(); for (let x = 0; x <= wW; x++) { const t = (x / wW) * Math.PI * 2; const y = h * 0.5 - Math.sin(t) * h * 0.25; if (x === 0) ctx.moveTo(wX + x, y); else ctx.lineTo(wX + x, y); }
        ctx.strokeStyle = 'rgba(248,113,113,0.6)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); for (let x = 0; x <= wW; x++) { const t = (x / wW) * Math.PI * 2; const y = h * 0.5 - Math.cos(t) * h * 0.25; if (x === 0) ctx.moveTo(wX + x, y); else ctx.lineTo(wX + x, y); }
        ctx.strokeStyle = 'rgba(96,165,250,0.6)'; ctx.lineWidth = 2; ctx.stroke();
        const mx = wX + (angleDeg / 360) * wW;
        ctx.beginPath(); ctx.arc(mx, h * 0.5 - Math.sin(rad) * h * 0.25, 4, 0, Math.PI * 2); ctx.fillStyle = '#F87171'; ctx.fill();
        ctx.beginPath(); ctx.arc(mx, h * 0.5 - Math.cos(rad) * h * 0.25, 4, 0, Math.PI * 2); ctx.fillStyle = '#60A5FA'; ctx.fill();
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    const getAngle = (x: number, y: number) => { let a = Math.atan2(-(y - cy), x - cx) * 180 / Math.PI; if (a < 0) a += 360; const closest = SPECIAL_ANGLES.reduce((p, c) => Math.abs(c - a) < Math.abs(p - a) ? c : p); return Math.abs(closest - a) < 8 ? closest : Math.round(a); };
    let dragging = false;
    const getPos = (e: any) => { const rect = canvas.getBoundingClientRect(); return 'touches' in e ? { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top } : { x: e.clientX - rect.left, y: e.clientY - rect.top }; };
    const onStart = (e: any) => { e.preventDefault(); dragging = true; const p = getPos(e); setAngleDeg(getAngle(p.x, p.y)); };
    const onMove = (e: any) => { if (!dragging) return; e.preventDefault(); const p = getPos(e); setAngleDeg(getAngle(p.x, p.y)); };
    const onEnd = () => { dragging = false; };
    canvas.addEventListener('mousedown', onStart); canvas.addEventListener('mousemove', onMove); canvas.addEventListener('mouseup', onEnd);
    canvas.addEventListener('touchstart', onStart, { passive: false }); canvas.addEventListener('touchmove', onMove, { passive: false }); canvas.addEventListener('touchend', onEnd);
    return () => { cancelAnimationFrame(frame); canvas.removeEventListener('mousedown', onStart); canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseup', onEnd); canvas.removeEventListener('touchstart', onStart); canvas.removeEventListener('touchmove', onMove); canvas.removeEventListener('touchend', onEnd); };
  }, [angleDeg, showWave, showRadians]);

  return (
    <AcademyShell module="trigonometry-circle">
      <div className="flex flex-col min-h-screen bg-slate-950">
        <canvas ref={canvasRef} className="w-full block" style={{ height: '260px', touchAction: 'none', cursor: 'crosshair' }} />
        <div className="px-4 py-3">
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800"><p className="text-red-400 text-sm font-bold mb-1">{t('academy.modules.TrigonometryCircle.txt_sin', 'sin θ')}</p><p className="text-white font-mono font-bold">{trigPoint.sinValue.toFixed(4)}</p></div>
            <div className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800"><p className="text-blue-400 text-sm font-bold mb-1">{t('academy.modules.TrigonometryCircle.txt_cos', 'cos θ')}</p><p className="text-white font-mono font-bold">{trigPoint.cosValue.toFixed(4)}</p></div>
            <div className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800"><p className="text-yellow-400 text-sm font-bold mb-1">{t('academy.modules.TrigonometryCircle.txt_tan', 'tan θ')}</p><p className="text-white font-mono font-bold">{trigPoint.tanValue !== null ? trigPoint.tanValue.toFixed(3) : 'undef'}</p></div>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <input type="range" min="0" max="360" value={angleDeg} onChange={e => setAngleDeg(Number(e.target.value))} className="flex-1 h-2 appearance-none rounded-full bg-slate-800 cursor-pointer" style={{ accentColor: '#818CF8' }} />
            <div className="bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 min-w-[70px] text-center"><span className="text-white font-mono text-sm font-bold">{showRadians ? `${(angleDeg * Math.PI / 180).toFixed(2)}r` : `${angleDeg}°`}</span></div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {[{ label: 'Radians', active: showRadians, fn: () => setShowRadians(!showRadians) }, { label: 'Show Waves', active: showWave, fn: handleWaveToggle }].map(item => (
              <button key={item.label} onClick={item.fn} className={`px-3 py-1.5 rounded-lg text-sm font-bold min-h-[36px] transition-all ${item.active ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>{item.label}</button>
            ))}
          </div>
          <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 mb-4 overflow-x-auto">
            <table className="w-full text-sm text-center min-w-[280px]"><thead><tr><th className="text-slate-500 py-1 px-2">θ</th><th className="text-red-400 py-1 px-2">sin</th><th className="text-blue-400 py-1 px-2">cos</th><th className="text-yellow-400 py-1 px-2">tan</th></tr></thead>
              <tbody>{TRIG_MEMORY_AIDS.map(row => (<tr key={row.angle} className={`cursor-pointer ${angleDeg === row.angle ? 'bg-indigo-900/30' : ''}`} onClick={() => setAngleDeg(row.angle)}><td className="text-indigo-400 py-1.5 px-2 font-mono">{row.angle}°</td><td className="text-white py-1.5 px-2 font-mono">{row.sin}</td><td className="text-white py-1.5 px-2 font-mono">{row.cos}</td><td className="text-white py-1.5 px-2 font-mono">{row.tan}</td></tr>))}</tbody></table>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800 text-center"><p className="text-slate-500 text-sm mb-1">{t('academy.modules.TrigonometryCircle.txt_sincos', 'sin²θ + cos²θ =')}</p><p className="text-white font-mono font-bold">{(trigPoint.sinValue ** 2 + trigPoint.cosValue ** 2).toFixed(4)}</p><p className="text-indigo-400 text-sm mt-1">{t('academy.modules.TrigonometryCircle.txt_Always1', 'Always 1')}</p></div>
        </div>
      </div>
    </AcademyShell>
  );
}
