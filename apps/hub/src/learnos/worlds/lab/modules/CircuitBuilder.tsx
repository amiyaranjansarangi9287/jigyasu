// src/worlds/lab/modules/CircuitBuilder.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import LabShell from '../LabShell';
import { useLumoOwl } from '../hooks/useLumoOwl';
import { useLabProgress } from '../hooks/useLabProgress';
import { useLabSession } from '../hooks/useLabSession';
import { drawLumoOwl } from '../components/LumoOwlCanvas';

const LIB = [
  { type: 'battery', emoji: '🔋', color: '#22C55E' },
  { type: 'bulb', emoji: '💡', color: '#FBBF24' },
  { type: 'wire', emoji: '〰️', color: '#94A3B8' },
];

export default function CircuitBuilder() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [comps, setComps] = useState<{ type: string; x: number; y: number; id: string }[]>([]);
  const [wires, setWires] = useState<{ f: string; t: string }[]>([]);
  const [tool, setTool] = useState<string | null>(null);
  const [wireStart, setWireStart] = useState<string | null>(null);
  const [isOn, setIsOn] = useState(false);
  const lumo = useLumoOwl('circuit-builder');
  const { recordCircuitComplete, updateCertification } = useLabProgress();
  const { trackEvent } = useLabSession();

  useEffect(() => {
    const hasBattery = comps.some(c => c.type === 'battery');
    const hasBulb = comps.some(c => c.type === 'bulb');
    const complete = hasBattery && hasBulb && wires.length >= comps.length - 1;
    if (complete && !isOn) {
      setIsOn(true); AudioEngine.playCelebration(); lumo.showAfterDiscovery();
      recordCircuitComplete(false, false); updateCertification('circuit-builder', 'explorer');
      trackEvent('circuit-builder', 'correct_answer');
    } else if (!complete && isOn) setIsOn(false);
  }, [comps, wires, isOn, lumo, recordCircuitComplete, updateCertification, trackEvent]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = CanvasHelpers.setupHiDPI(canvas, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
    const w = canvas.getBoundingClientRect().width, h = canvas.getBoundingClientRect().height;
    let frame: number;
    const render = (t: number) => {
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#F8FAFC'; ctx.fillRect(0, 0, w, h);
      wires.forEach(wi => {
        const f = comps.find(c => c.id === wi.f), t = comps.find(c => c.id === wi.t);
        if (f && t) { ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(t.x, t.y); ctx.strokeStyle = isOn ? '#22C55E' : '#94A3B8'; ctx.lineWidth = 3; ctx.stroke(); }
      });
      comps.forEach(c => {
        ctx.beginPath(); ctx.arc(c.x, c.y, 25, 0, Math.PI * 2); ctx.fillStyle = isOn && c.type === 'bulb' ? '#FEF3C7' : '#FFFFFF'; ctx.fill();
        ctx.strokeStyle = '#CBD5E1'; ctx.stroke(); ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(LIB.find(l => l.type === c.type)?.emoji || '', c.x, c.y);
      });
      drawLumoOwl(ctx, w - 40, h - 40, 20, lumo.guideEmotion, 'physics', t / 1000);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [comps, wires, isOn, lumo.guideEmotion]);

  const handleTap = (e: any) => {
    const r = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - r.left, y = (e.clientY || e.touches[0].clientY) - r.top;
    const hit = comps.find(c => Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2) < 30);
    if (tool === 'wire' && hit) { if (!wireStart) setWireStart(hit.id); else if (wireStart !== hit.id) { setWires(p => [...p, { f: wireStart, t: hit.id }]); setWireStart(null); } }
    else if (tool && tool !== 'wire' && !hit) { setComps(p => [...p, { type: tool, x, y, id: Math.random().toString() }]); }
  };

  return (
    <LabShell module="circuit-builder" subject="physics">
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="bg-white p-4 flex gap-2 overflow-x-auto no-scrollbar">
          {LIB.map(l => (
            <button key={l.type} onClick={() => { setTool(l.type === 'wire' ? 'wire' : l.type); setWireStart(null); }} className={`p-3 rounded-xl border-2 transition-all min-w-[60px] ${tool === l.type ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <span className="text-2xl">{l.emoji}</span>
            </button>
          ))}
          <button onClick={() => { setComps([]); setWires([]); setIsOn(false); }} className="ml-auto p-3 text-red-500 font-bold text-sm"><Trans i18nKey="auto.circuitbuilder.clear">Clear</Trans></button>
        </div>
        <canvas ref={canvasRef} onClick={handleTap} onTouchStart={handleTap} className="flex-1 w-full block touch-none" />
      </div>
    </LabShell>
  );
}
