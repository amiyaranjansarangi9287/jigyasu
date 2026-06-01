import { useRef, useEffect, useState, useCallback } from 'react';
import ExplorerShell from '../ExplorerShell';
import { useExplorerProgress } from '../hooks/useExplorerProgress';
import { useExplorerSession } from '../hooks/useExplorerSession';
import { useLumoPeer } from '../hooks/useLumoPeer';
import { EverydayConnection } from '../components/EverydayConnection';
import { ThinkingPrompt } from '../components/ThinkingPrompt';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import { EXPLORER_CONCEPTS } from '../data/explorerContent';

export default function ProbabilityAdult() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [flips, setFlips] = useState<('H' | 'T')[]>([]);
  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'probability')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('probability');
        trackConceptComplete('probability');
        setHasCompleted(true);
        setTimeout(() => lumo.poseQuestion(concept.thinkingPrompt), 3000);
      }
    }, 120000);
    return () => clearTimeout(timeout);
  }, [hasCompleted, markCompleted, trackConceptComplete, lumo, concept]);

  const flipCoin = useCallback(() => {
    const result = Math.random() < 0.5 ? 'H' : 'T';
    setFlips((prev) => [...prev.slice(-49), result]);
  }, []);

  const flip100 = useCallback(() => {
    const newFlips: ('H' | 'T')[] = [];
    for (let i = 0; i < 100; i++) {
      newFlips.push(Math.random() < 0.5 ? 'H' : 'T');
    }
    setFlips(newFlips);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = CanvasHelpers.setupHiDPI(canvas, rect.width, rect.height);
    const w = rect.width;
    const h = rect.height;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, w, h);

      const heads = flips.filter((f) => f === 'H').length;
      const tails = flips.length - heads;
      const ratio = flips.length > 0 ? heads / flips.length : 0.5;

      // Bar chart
      const barWidth = 80;
      const maxHeight = 150;
      const headHeight = flips.length > 0 ? (heads / flips.length) * maxHeight : maxHeight / 2;
      const tailHeight = flips.length > 0 ? (tails / flips.length) * maxHeight : maxHeight / 2;

      // Heads bar
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(w / 2 - barWidth - 20, h - 50 - headHeight, barWidth, headHeight);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Heads', w / 2 - barWidth / 2 - 20, h - 30);
      ctx.fillText(`${heads}`, w / 2 - barWidth / 2 - 20, h - 50 - headHeight - 10);

      // Tails bar
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(w / 2 + 20, h - 50 - tailHeight, barWidth, tailHeight);
      ctx.fillText('Tails', w / 2 + barWidth / 2 + 20, h - 30);
      ctx.fillText(`${tails}`, w / 2 + barWidth / 2 + 20, h - 50 - tailHeight - 10);

      // Expected line
      ctx.strokeStyle = '#8B5CF6';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(w / 2 - barWidth - 30, h - 50 - maxHeight / 2);
      ctx.lineTo(w / 2 + barWidth + 30, h - 50 - maxHeight / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#8B5CF6';
      ctx.font = '10px sans-serif';
      ctx.fillText('Expected: 50%', w / 2 + barWidth + 50, h - 50 - maxHeight / 2 + 4);

      // Stats
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`Flips: ${flips.length}`, w / 2, 30);
      ctx.fillStyle = '#60A5FA';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Heads ratio: ${(ratio * 100).toFixed(1)}%`, w / 2, 55);

      // Law of large numbers note
      if (flips.length > 50) {
        ctx.fillStyle = '#22C55E';
        ctx.font = '11px sans-serif';
        ctx.fillText('As flips increase, ratio approaches 50%', w / 2, 75);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [flips]);

  return (
    <ExplorerShell concept="probability">
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
          <div className="flex gap-2 mb-4">
            <button
              onClick={flipCoin}
              className="flex-1 py-3 bg-violet-700 text-white rounded-xl text-sm font-medium min-h-[44px]"
            >
              Flip Once
            </button>
            <button
              onClick={flip100}
              className="flex-1 py-3 bg-slate-800 text-white rounded-xl text-sm font-medium min-h-[44px]"
            >
              Flip 100×
            </button>
            <button
              onClick={() => setFlips([])}
              className="px-4 py-3 bg-slate-900 text-slate-400 rounded-xl text-sm font-medium min-h-[44px]"
            >
              Reset
            </button>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                After 5 flips, anything can happen. After 1,000 flips,
                the ratio will be remarkably close to 50%. This is the
                Law of Large Numbers — certainty emerges from randomness.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Insurance companies use this. They can't predict if YOU
                will crash, but they know exactly what percentage of
                drivers will. Individual randomness, aggregate certainty.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                History of the idea
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Pascal and Fermat invented probability theory in 1654
                to solve a gambling problem. Bayes gave us conditional
                probability. Today it underpins medicine, finance, AI,
                and nearly every quantitative field.
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
            await trackWonderMoment('probability');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
