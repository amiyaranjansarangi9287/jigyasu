import { useRef, useEffect, useState } from 'react';
import ExplorerShell from '../ExplorerShell';
import { useExplorerProgress } from '../hooks/useExplorerProgress';
import { useExplorerSession } from '../hooks/useExplorerSession';
import { useLumoPeer } from '../hooks/useLumoPeer';
import { EverydayConnection } from '../components/EverydayConnection';
import { ThinkingPrompt } from '../components/ThinkingPrompt';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import { EXPLORER_CONCEPTS } from '../data/explorerContent';
import { Trans } from "react-i18next";

export default function WaterCycleAdult() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'water-cycle')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('water-cycle');
        trackConceptComplete('water-cycle');
        setHasCompleted(true);
        setTimeout(() => lumo.poseQuestion(concept.thinkingPrompt), 3000);
      }
    }, 120000);
    return () => clearTimeout(timeout);
  }, [hasCompleted, markCompleted, trackConceptComplete, lumo, concept]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = CanvasHelpers.setupHiDPI(canvas, rect.width, rect.height);
    const w = rect.width;
    const h = rect.height;

    const drops: { x: number; y: number; phase: 'rain' | 'evap'; vy: number }[] = [];
    let time = 0;

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1E3A5F');
      grad.addColorStop(0.6, '#60A5FA');
      grad.addColorStop(1, '#0D0D14');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Sun
      ctx.beginPath();
      ctx.arc(w - 50, 40, 25, 0, Math.PI * 2);
      ctx.fillStyle = '#FCD34D';
      ctx.fill();

      // Cloud
      const cloudX = 80;
      const cloudY = 50;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 25, 0, Math.PI * 2);
      ctx.arc(cloudX + 30, cloudY - 5, 20, 0, Math.PI * 2);
      ctx.arc(cloudX + 55, cloudY, 22, 0, Math.PI * 2);
      ctx.fill();

      // Ocean
      ctx.fillStyle = '#1E40AF';
      ctx.fillRect(0, h - 50, w, 50);

      // Wave effect
      ctx.beginPath();
      ctx.moveTo(0, h - 50);
      for (let x = 0; x < w; x += 10) {
        const y = h - 50 + Math.sin(x * 0.05 + time * 2) * 3;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();

      // Mountain
      ctx.beginPath();
      ctx.moveTo(w - 120, h - 50);
      ctx.lineTo(w - 60, h - 120);
      ctx.lineTo(w, h - 50);
      ctx.fillStyle = '#374151';
      ctx.fill();

      // Add rain drops
      if (Math.random() < 0.3) {
        drops.push({
          x: cloudX + Math.random() * 60,
          y: cloudY + 30,
          phase: 'rain',
          vy: 100 + Math.random() * 50,
        });
      }

      // Add evaporation
      if (Math.random() < 0.15) {
        drops.push({
          x: Math.random() * w,
          y: h - 50,
          phase: 'evap',
          vy: -40 - Math.random() * 30,
        });
      }

      // Update drops
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.y += d.vy * 0.016;

        if (d.phase === 'rain') {
          ctx.fillStyle = '#60A5FA';
          ctx.fillRect(d.x, d.y, 2, 8);
          if (d.y > h - 50) drops.splice(i, 1);
        } else {
          const alpha = Math.max(0, 1 - (h - 50 - d.y) / 150);
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
          ctx.beginPath();
          ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
          ctx.fill();
          if (d.y < 60) drops.splice(i, 1);
        }
      }

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Condensation', cloudX + 25, cloudY - 35);
      ctx.fillText('Precipitation', cloudX + 25, cloudY + 60);
      ctx.fillText('Evaporation', w / 2, h - 60);

      // Arrows
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      
      // Evap arrow
      ctx.beginPath();
      ctx.moveTo(w / 2 + 50, h - 55);
      ctx.quadraticCurveTo(w / 2 + 80, h - 100, cloudX + 60, cloudY + 20);
      ctx.stroke();
      
      ctx.setLineDash([]);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <ExplorerShell concept="water-cycle">
      <div className="flex flex-col">
        <div className="px-5 pt-6 pb-4">
          <h1 className="text-xl font-bold text-white mb-3 leading-tight">
            {concept.title}
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            {concept.hook}
          </p>
        </div>

        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: '240px', touchAction: 'none' }}
        />

        <div className="px-5 py-4">
          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                <Trans i18nKey="auto.watercycleadult.earth_has_had_the_same_water_f">Earth has had the same water for 4 billion years. The water
                                              you drink today was once in a dinosaur, an ice age glacier,
                                              and countless other organisms.</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.watercycleadult.evaporation_condensation_preci">Evaporation, condensation, precipitation — an endless cycle
                                              powered entirely by the sun's energy. Understanding this
                                              cycle explains droughts, floods, and groundwater depletion.</Trans>
                                            </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                <Trans i18nKey="auto.watercycleadult.history_of_the_idea">History of the idea</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.watercycleadult.ancient_civilizations_understo">Ancient civilizations understood rain as divine gift. The
                                              scientific water cycle was first correctly described by
                                              Bernard Palissy in 1580. Understanding groundwater flow
                                              came much later — and is still being refined today.</Trans>
                                            </p>
            </div>
          </div>
        </div>

        <EverydayConnection
          connection={concept.everydayConnection}
          indianContext={concept.indianContext}
          onRead={recordEverydayConnection}
        />

        <ThinkingPrompt
          question={concept.thinkingPrompt}
          onEngaged={async () => {
            await recordThinkingPrompt();
            await trackWonderMoment('water-cycle');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
