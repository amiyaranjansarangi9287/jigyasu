import { useRef, useEffect, useState } from 'react';
import ExplorerShell from '../ExplorerShell';
import { useExplorerProgress } from '../hooks/useExplorerProgress';
import { useExplorerSession } from '../hooks/useExplorerSession';
import { useLumoPeer } from '../hooks/useLumoPeer';
import { EverydayConnection } from '../components/EverydayConnection';
import { ThinkingPrompt } from '../components/ThinkingPrompt';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import { EXPLORER_CONCEPTS } from '../data/explorerContent';

export default function MagnetsAdult() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [showField, setShowField] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'magnets')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('magnets');
        trackConceptComplete('magnets');
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

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Draw bar magnet
      const magnetW = 120;
      const magnetH = 30;
      
      // North pole (red)
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(cx - magnetW / 2, cy - magnetH / 2, magnetW / 2, magnetH);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('N', cx - magnetW / 4, cy + 5);

      // South pole (blue)
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(cx, cy - magnetH / 2, magnetW / 2, magnetH);
      ctx.fillStyle = '#fff';
      ctx.fillText('S', cx + magnetW / 4, cy + 5);

      if (showField) {
        // Draw field lines
        const drawFieldLine = (startY: number, direction: number) => {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
          ctx.lineWidth = 1.5;

          const startX = cx - magnetW / 2 - 5;
          const endX = cx + magnetW / 2 + 5;
          
          ctx.moveTo(startX, cy + startY * direction);
          
          // Curved field line
          const controlY = startY * 2.5 * direction;
          ctx.bezierCurveTo(
            startX - 40, cy + controlY,
            endX + 40, cy + controlY,
            endX, cy + startY * direction
          );
          
          ctx.stroke();

          // Arrow
          const arrowX = cx;
          const arrowY = cy + controlY * 0.6;
          ctx.beginPath();
          ctx.moveTo(arrowX - 5, arrowY - 3 * direction);
          ctx.lineTo(arrowX, arrowY);
          ctx.lineTo(arrowX + 5, arrowY - 3 * direction);
          ctx.stroke();
        };

        // Draw multiple field lines
        [15, 30, 50].forEach(y => {
          drawFieldLine(y, 1);
          drawFieldLine(y, -1);
        });

        // Internal field lines
        ctx.beginPath();
        ctx.moveTo(cx + magnetW / 2 - 10, cy);
        ctx.lineTo(cx - magnetW / 2 + 10, cy);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Animated electrons
      const electronRadius = 80;
      for (let i = 0; i < 6; i++) {
        const angle = time * 2 + (i * Math.PI / 3);
        const ex = cx + Math.cos(angle) * electronRadius;
        const ey = cy + Math.sin(angle) * (electronRadius * 0.3);
        
        ctx.beginPath();
        ctx.arc(ex, ey, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FCD34D';
        ctx.fill();
      }

      // Label
      ctx.fillStyle = '#8B5CF6';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Moving charges create magnetic fields', cx, h - 20);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [showField]);

  return (
    <ExplorerShell concept="magnets">
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
            onClick={() => setShowField(!showField)}
            className={`w-full py-3 rounded-xl text-sm font-medium mb-4 min-h-[44px]
              ${showField
                ? 'bg-violet-700 text-white'
                : 'bg-slate-800 text-slate-400'
              }`}
          >
            {showField ? 'Hide Field Lines' : 'Show Field Lines'}
          </button>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                Maxwell unified electricity and magnetism in 1865. Moving
                charges create magnetic fields. Changing magnetic fields
                create electric fields. They're the same fundamental force.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your phone charger uses induction — a changing magnetic field
                creates an electric current. Every motor, generator, and
                transformer relies on this principle.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                History of the idea
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Faraday discovered electromagnetic induction in 1831 with
                almost no formal education. His intuitive drawings of "field
                lines" were considered unscientific — until Maxwell proved
                them mathematically correct.
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
            await trackWonderMoment('magnets');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
