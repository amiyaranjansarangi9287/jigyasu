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
import { useTranslation } from 'react-i18next';

export default function ClimateAdult() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [co2Level, setCo2Level] = useState(420);
  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'climate')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('climate');
        trackConceptComplete('climate');
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

    let time = 0;

    // CO2 particles
    const particles: { x: number; y: number; drift: number }[] = [];
    const targetCount = Math.floor((co2Level - 280) / 5);
    
    while (particles.length < targetCount) {
      particles.push({
        x: Math.random() * w,
        y: 60 + Math.random() * (h - 120),
        drift: Math.random() * Math.PI * 2,
      });
    }
    while (particles.length > targetCount) {
      particles.pop();
    }

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Sky (gets more orange with higher CO2)
      const warmth = Math.min(1, (co2Level - 280) / 500);
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, `rgba(${100 + warmth * 155}, ${130 - warmth * 50}, ${200 - warmth * 150}, 1)`);
      skyGrad.addColorStop(1, '#0D0D14');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Sun
      ctx.beginPath();
      ctx.arc(w - 50, 40, 20, 0, Math.PI * 2);
      ctx.fillStyle = '#FCD34D';
      ctx.fill();

      // Draw CO2 particles
      particles.forEach((p) => {
        p.drift += 0.02;
        const wobbleX = Math.sin(p.drift) * 2;
        const wobbleY = Math.cos(p.drift * 0.7) * 1;
        
        ctx.fillStyle = 'rgba(156, 163, 175, 0.4)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CO₂', p.x + wobbleX, p.y + wobbleY);
      });

      // Infrared arrows (trapped heat)
      if (co2Level > 300) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        
        for (let i = 0; i < 5; i++) {
          const x = 50 + i * (w - 100) / 4;
          ctx.beginPath();
          ctx.moveTo(x, h - 40);
          ctx.lineTo(x, h - 100);
          ctx.moveTo(x, h - 80);
          ctx.lineTo(x - 5, h - 90);
          ctx.moveTo(x, h - 80);
          ctx.lineTo(x + 5, h - 90);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // Ground
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(0, h - 35, w, 35);

      // Temperature indicator
      const tempRise = ((co2Level - 280) / 280) * 2;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`CO₂: ${co2Level} ppm`, w / 2, 25);
      ctx.fillStyle = tempRise > 1 ? '#EF4444' : '#F59E0B';
      ctx.font = '12px sans-serif';
      ctx.fillText(`+${tempRise.toFixed(1)}°C warming potential`, w / 2, 45);

      // Historical markers
      ctx.fillStyle = '#8B5CF6';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Pre-industrial: 280 ppm', 10, h - 45);
      ctx.fillText('Today: ~420 ppm', 10, h - 55);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [co2Level]);

  return (
    <ExplorerShell concept="climate">
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
          style={{ height: '220px', touchAction: 'none' }}
        />

        <div className="px-5 py-4">
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-slate-500 text-sm"><Trans i18nKey="auto.climateadult.co_concentration">CO₂ concentration</Trans></span>
              <span className="text-slate-400 text-sm font-mono">{co2Level} <Trans i18nKey="auto.climateadult.ppm">ppm</Trans></span>
            </div>
            <input
              type="range" min="280" max="800" value={co2Level}
              onChange={(e) => setCo2Level(Number(e.target.value))}
              className="w-full h-1.5 appearance-none rounded-full bg-slate-800"
              style={{ accentColor: '#EF4444' }}
            />
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                <Trans i18nKey="auto.climateadult.co_molecules_trap_infrared_rad">CO₂ molecules trap infrared radiation that would otherwise
                                              escape to space. More CO₂ means more trapped heat. This is
                                              physics, not politics — Svante Arrhenius calculated this
                                              in 1896.</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.climateadult.the_carbon_you_exhale_becomes_">The carbon you exhale becomes part of a plant within days.
                                              But the carbon from burning fossil fuels adds NEW carbon
                                              that was locked underground for millions of years.</Trans>
                                            </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                <Trans i18nKey="auto.climateadult.history_of_the_idea">History of the idea</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.climateadult.john_tyndall_discovered_the_gr">Joseph Fourier first proposed the greenhouse effect in 1824. John Tyndall demonstrated its mechanism in 1859 by showing that gases like CO₂ absorb infrared radiation.
                                              Arrhenius linked it to fossil fuels in 1896. Charles
                                              Keeling began measuring CO₂ in 1958 — the "Keeling Curve"
                                              has risen uninterrupted ever since.</Trans>
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
            await trackWonderMoment('climate');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
