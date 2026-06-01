// src/worlds/lab/modules/ForceLab.tsx
import { useRef, useEffect, useState } from 'react';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import LabShell from '../LabShell';
import { useLumoOwl } from '../hooks/useLumoOwl';
import { useLabProgress } from '../hooks/useLabProgress';
import { useLabSession } from '../hooks/useLabSession';
import { FORCE_SCENARIOS } from '../data/labContent';
import { drawLumoOwl } from '../components/LumoOwlCanvas';
import { ScientificSlider } from '../components/ScientificSlider';

export default function ForceLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [f, setF] = useState(50); const [m, setM] = useState(5); const [sIdx, setSIdx] = useState(0);
  const [v, setV] = useState(0); const [px, setPx] = useState(50);
  const lumo = useLumoOwl('force-lab');
  const { recordForceExperiment, updateCertification } = useLabProgress();
  const { trackEvent } = useLabSession();
  const scenario = FORCE_SCENARIOS[sIdx];

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = CanvasHelpers.setupHiDPI(canvas, canvas.getBoundingClientRect().width, 200);
    const w = canvas.getBoundingClientRect().width, h = 200;
    let frame: number, last = performance.now();
    const render = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      const fr = scenario.frictionCoefficient * m * 9.8;
      const acc = Math.max(0, (f - fr) / m);
      const nv = v > 0 || f > fr ? v + acc * dt : 0;
      setV(nv); setPx(p => (p + nv * 10) % w);
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#F8FAFC'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#E2E8F0'; ctx.fillRect(0, 150, w, 50);
      ctx.font = '50px sans-serif'; ctx.fillText(scenario.boxEmoji, px, 140);
      drawLumoOwl(ctx, w - 30, 30, 15, lumo.lumoEmotion, 'physics', now / 1000);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [f, m, scenario, v, px, lumo.lumoEmotion]);

  return (
    <LabShell module="force-lab" subject="physics">
      <div className="flex flex-col h-screen bg-slate-50 overflow-auto pb-24 p-6">
        <canvas ref={canvasRef} className="w-full rounded-2xl border bg-white mb-6" style={{ height: '200px' }} />
        <div className="grid gap-4 mb-6">
          <ScientificSlider label="Push Force" emoji="💪" value={f} min={0} max={100} unit="N" onChange={v => { setF(v); recordForceExperiment(false, false); updateCertification('force-lab', 'explorer'); trackEvent('force-lab', 'canvas_interaction'); }} />
          <ScientificSlider label="Box Mass" emoji="⚖️" value={m} min={1} max={20} unit="kg" onChange={setM} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {FORCE_SCENARIOS.map((s, i) => (
            <button key={s.id} onClick={() => setSIdx(i)} className={`p-3 rounded-xl border-2 flex-shrink-0 ${sIdx === i ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
              <span className="text-xl">{s.surfaceEmoji}</span>
            </button>
          ))}
        </div>
      </div>
    </LabShell>
  );
}
