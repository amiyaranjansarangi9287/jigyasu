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

export default function PiVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [rollProgress, setRollProgress] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'pi-visual')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('pi-visual');
        trackConceptComplete('pi-visual');
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

    const radius = 40;
    const diameter = radius * 2;
    const circumference = Math.PI * diameter;
    const startX = 60;
    const groundY = h - 60;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, w, h);

      // Ground line
      ctx.beginPath();
      ctx.moveTo(20, groundY);
      ctx.lineTo(w - 20, groundY);
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Calculate position
      const maxRoll = circumference;
      const currentRoll = (rollProgress / 100) * maxRoll;
      const circleX = startX + currentRoll;
      const rotation = currentRoll / radius;

      // Draw circle
      ctx.save();
      ctx.translate(circleX, groundY - radius);
      ctx.rotate(rotation);
      
      // Circle with marker
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Marker point
      ctx.beginPath();
      ctx.arc(0, -radius + 5, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();

      // Diameter line
      ctx.beginPath();
      ctx.moveTo(0, -radius);
      ctx.lineTo(0, radius);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      // Draw circumference traced
      ctx.beginPath();
      ctx.moveTo(startX, groundY);
      ctx.lineTo(startX + currentRoll, groundY);
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Diameter markers
      const numDiameters = Math.floor(currentRoll / diameter);
      for (let i = 0; i <= numDiameters && i < 4; i++) {
        const x = startX + i * diameter;
        ctx.beginPath();
        ctx.moveTo(x, groundY - 5);
        ctx.lineTo(x, groundY + 15);
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        if (i > 0) {
          ctx.fillStyle = '#F59E0B';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${i}d`, x - diameter / 2, groundY + 30);
        }
      }

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Circumference = ${(currentRoll / diameter).toFixed(4)} × diameter`, 20, 30);
      
      if (rollProgress === 100) {
        ctx.fillStyle = '#8B5CF6';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`π ≈ ${Math.PI.toFixed(6)}...`, 20, 55);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [rollProgress]);

  const startRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    setRollProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setRollProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 40);
  };

  return (
    <ExplorerShell concept="pi-visual">
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
          <button
            onClick={startRoll}
            disabled={isRolling}
            className={`w-full py-3 rounded-xl text-sm font-medium mb-4 min-h-[44px]
              ${isRolling
                ? 'bg-slate-800 text-slate-600'
                : 'bg-violet-700 text-white hover:bg-violet-600'
              }`}
          >
            {isRolling ? 'Rolling...' : 'Roll the Circle'}
          </button>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                <Trans i18nKey="auto.pivisual.if_you_measure_any_circle_s_ci">If you measure any circle's circumference and divide by its
                                              diameter, you always get the same number: π ≈ 3.14159...</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.pivisual.this_number_is_irrational_its_">This number is irrational — its decimals never repeat and
                                              never end. Yet it appears everywhere in nature, from the
                                              spirals of galaxies to the ripples in a pond.</Trans>
                                            </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                <Trans i18nKey="auto.pivisual.history_of_the_idea">History of the idea</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.pivisual.aryabhata_in_499_ad_calculated">Aryabhata in 499 AD calculated π as 3.1416. Madhava of
                                              Sangamagrama discovered infinite series for π in the 14th
                                              century — predating European mathematicians by 200 years.</Trans>
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
            await trackWonderMoment('pi-visual');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
