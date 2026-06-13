// src/worlds/academy/modules/DerivativesVisual.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import AcademyShell from '../AcademyShell';
import { useLumoAncient } from '../hooks/useLumoAncient';
import { useAcademyProgress } from '../hooks/useAcademyProgress';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import { CURVES } from '../data/academyContent';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

export default function DerivativesVisual() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lumo = useLumoAncient();
  const { recordDerivatives } = useAcademyProgress();
  const [curveIdx, setCurveIdx] = useState(0);
  const [xPos, setXPos] = useState(0);
  const [showDeriv, setShowDeriv] = useState(false);
  const curve = CURVES[curveIdx];
  const slope = curve.derivative(xPos);

  const handleDerivToggle = useCallback(async () => {
    setShowDeriv(d => !d);
    if (!showDeriv) { await recordDerivatives(true, Math.abs(slope) < 0.1, false, false); if (Math.abs(slope) < 0.1) lumo.afterProfoundDiscovery(); }
  }, [showDeriv, slope, recordDerivatives, lumo]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = CanvasHelpers.setupHiDPI(canvas, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
    const w = canvas.getBoundingClientRect().width, h = canvas.getBoundingClientRect().height;
    const [xMin, xMax] = curve.domain;
    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * w;
    const yRange = 8; const toCanvasY = (y: number) => h / 2 - (y / yRange) * h;
    let frame: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#0A0A0F'; ctx.fillRect(0, 0, w, h);
      // Axes
      ctx.strokeStyle = 'rgba(148,163,184,0.15)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, h/2); ctx.lineTo(w, h/2); ctx.moveTo(toCanvasX(0), 0); ctx.lineTo(toCanvasX(0), h); ctx.stroke();
      // Curve
      ctx.beginPath();
      for (let px = 0; px < w; px++) { const x = xMin + (px / w) * (xMax - xMin); const y = curve.fn(x); const cy = toCanvasY(y); if (px === 0) ctx.moveTo(px, cy); else ctx.lineTo(px, cy); }
      ctx.strokeStyle = '#EC4899'; ctx.lineWidth = 2.5; ctx.stroke();
      // Derivative curve
      if (showDeriv) {
        ctx.beginPath();
        for (let px = 0; px < w; px++) { const x = xMin + (px / w) * (xMax - xMin); const dy = curve.derivative(x); const cy = toCanvasY(dy); if (px === 0) ctx.moveTo(px, cy); else ctx.lineTo(px, cy); }
        ctx.strokeStyle = 'rgba(96,165,250,0.6)'; ctx.lineWidth = 2; ctx.stroke();
      }
      // Point on curve
      const ptX = toCanvasX(xPos), ptY = toCanvasY(curve.fn(xPos));
      ctx.beginPath(); ctx.arc(ptX, ptY, 6, 0, Math.PI * 2); ctx.fillStyle = '#F59E0B'; ctx.fill();
      // Tangent line
      const tangentLen = 60;
      const dx = tangentLen, dy = -slope * tangentLen * (w / (xMax - xMin)) / (h / yRange);
      ctx.beginPath(); ctx.moveTo(ptX - dx, ptY - dy); ctx.lineTo(ptX + dx, ptY + dy);
      ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
      // Slope label
      ctx.fillStyle = '#FCD34D'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(`slope = ${slope.toFixed(2)}`, ptX + 10, ptY - 10);
      if (Math.abs(slope) < 0.1) { ctx.fillStyle = '#10B981'; ctx.fillText('← min/max (slope ≈ 0)', ptX + 10, ptY + 15); }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    let dragging = false;
    const getX = (e: any) => { const rect = canvas.getBoundingClientRect(); const px = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left; return xMin + (px / rect.width) * (xMax - xMin); };
    const onStart = (e: any) => { e.preventDefault(); dragging = true; setXPos(Math.max(xMin, Math.min(xMax, getX(e)))); };
    const onMove = (e: any) => { if (!dragging) return; e.preventDefault(); setXPos(Math.max(xMin, Math.min(xMax, getX(e)))); };
    const onEnd = () => { dragging = false; };
    canvas.addEventListener('mousedown', onStart); canvas.addEventListener('mousemove', onMove); canvas.addEventListener('mouseup', onEnd);
    canvas.addEventListener('touchstart', onStart, { passive: false }); canvas.addEventListener('touchmove', onMove, { passive: false }); canvas.addEventListener('touchend', onEnd);
    return () => { cancelAnimationFrame(frame); canvas.removeEventListener('mousedown', onStart); canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseup', onEnd); canvas.removeEventListener('touchstart', onStart); canvas.removeEventListener('touchmove', onMove); canvas.removeEventListener('touchend', onEnd); };
  }, [curve, xPos, showDeriv, slope]);

  return (
    <AcademyShell module="derivatives-visual">
      <div className="flex flex-col min-h-screen bg-slate-950">
        <canvas ref={canvasRef} className="w-full block" style={{ height: '260px', touchAction: 'none', cursor: 'crosshair' }} />
        <div className="px-4 py-3">
          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">{CURVES.map((c, i) => (
            <button key={c.id} onClick={() => { setCurveIdx(i); setXPos(0); }} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold min-h-[36px] ${curveIdx === i ? 'bg-pink-700 text-white' : 'bg-slate-800 text-slate-400'}`}>{c.label}</button>
          ))}</div>
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 mb-3">
            <p className="text-pink-400 text-sm font-bold mb-1">{curve.expression}</p>
            <div className="flex items-center gap-3"><span className="text-slate-400 text-sm"><Trans i18nKey="auto.derivativesvisual.x">x =</Trans></span><input type="range" min={curve.domain[0] * 100} max={curve.domain[1] * 100} value={xPos * 100} onChange={e => setXPos(Number(e.target.value) / 100)} className="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#EC4899' }} /><span className="text-white font-mono text-sm font-bold min-w-[40px] text-right">{xPos.toFixed(2)}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800"><p className="text-pink-400 text-sm font-bold"><Trans i18nKey="auto.derivativesvisual.f_x">f(x)</Trans></p><p className="text-white font-mono font-bold">{curve.fn(xPos).toFixed(3)}</p></div>
            <div className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800"><p className="text-blue-400 text-sm font-bold"><Trans i18nKey="auto.derivativesvisual.f_x_slope">f'(x) = slope</Trans></p><p className="text-white font-mono font-bold">{slope.toFixed(3)}</p></div>
          </div>
          <button onClick={handleDerivToggle} className={`w-full py-3 rounded-xl text-sm font-bold min-h-[44px] transition-all ${showDeriv ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'}`}>{showDeriv ? '📉 Hide Derivative Curve' : '📉 Show Derivative Curve'}</button>
        </div>
      </div>
    </AcademyShell>
  );
}
