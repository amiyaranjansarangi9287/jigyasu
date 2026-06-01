// src/worlds/lab/modules/EcosystemSandbox.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import LabShell from '../LabShell';
import { useLumoOwl } from '../hooks/useLumoOwl';
import { useLabProgress } from '../hooks/useLabProgress';
import { useLabSession } from '../hooks/useLabSession';
import { ECOSYSTEM_ORGANISMS } from '../data/labContent';
import { drawLumoOwl } from '../components/LumoOwlCanvas';

export default function EcosystemSandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pops, setPops] = useState<Record<string, number>>({ grass: 100, rabbit: 30, tiger: 5 });
  const [isRunning, setIsRunning] = useState(false);
  const lumo = useLumoOwl('ecosystem-sandbox');
  const { recordEcosystemEvent, updateCertification } = useLabProgress();
  const { trackEvent } = useLabSession();

  const tick = useCallback(() => {
    setPops(p => {
      const g = p.grass, r = p.rabbit, t = p.tiger;
      const ng = Math.min(200, g * 1.1 - r * 0.5);
      const nr = Math.max(0, r * 1.05 + g * 0.1 - t * 2);
      const nt = Math.max(0, t * 0.95 + r * 0.2);
      if (nr === 0 && r > 0) lumo.show("Prey population collapse! Notice the trophic cascade.");
      return { grass: ng, rabbit: nr, tiger: nt };
    });
  }, [lumo]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isRunning, tick]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = CanvasHelpers.setupHiDPI(canvas, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
    const w = canvas.getBoundingClientRect().width, h = canvas.getBoundingClientRect().height;
    let frame: number;
    const render = (t: number) => {
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#F0FDF4'; ctx.fillRect(0, 0, w, h);
      Object.entries(pops).forEach(([id, count], i) => {
        const org = ECOSYSTEM_ORGANISMS.find(o => o.id === id);
        if (!org) return;
        ctx.fillStyle = '#1E293B'; ctx.font = '14px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(`${org.emoji} ${org.name}: ${Math.round(count)}`, 20, 40 + i * 30);
        ctx.fillStyle = '#BBF7D0'; ctx.fillRect(150, 28 + i * 30, 100, 15);
        ctx.fillStyle = '#22C55E'; ctx.fillRect(150, 28 + i * 30, (count / org.maxPopulation) * 100, 15);
      });
      drawLumoOwl(ctx, w - 40, h - 40, 20, lumo.guideEmotion, 'biology', t / 1000);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [pops, lumo.guideEmotion]);

  return (
    <LabShell module="ecosystem-sandbox" subject="biology">
      <div className="flex flex-col h-screen">
        <div className="bg-white p-4 border-b flex justify-between items-center">
          <h2 className="font-bold">Ecosystem Sandbox</h2>
          <button onClick={() => { setIsRunning(!isRunning); recordEcosystemEvent(false); updateCertification('ecosystem-sandbox', 'explorer'); trackEvent('ecosystem-sandbox', 'canvas_interaction'); }} className={`px-6 py-2 rounded-full font-bold text-white ${isRunning ? 'bg-red-500' : 'bg-green-600'}`}>{isRunning ? 'Pause' : 'Run'}</button>
        </div>
        <canvas ref={canvasRef} className="flex-1 w-full block" />
      </div>
    </LabShell>
  );
}
