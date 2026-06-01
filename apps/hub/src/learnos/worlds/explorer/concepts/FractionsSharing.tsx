import { useRef, useEffect, useState } from 'react';
import ExplorerShell from '../ExplorerShell';
import { useExplorerProgress } from '../hooks/useExplorerProgress';
import { useExplorerSession } from '../hooks/useExplorerSession';
import { useLumoPeer } from '../hooks/useLumoPeer';
import { EverydayConnection } from '../components/EverydayConnection';
import { ThinkingPrompt } from '../components/ThinkingPrompt';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import { EXPLORER_CONCEPTS } from '../data/explorerContent';

export default function FractionsSharing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [divisions, setDivisions] = useState(4);
  const [selected, setSelected] = useState(2);
  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'fractions-sharing')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('fractions-sharing');
        trackConceptComplete('fractions-sharing');
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

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const radius = 70;

      // Draw pizza slices
      const sliceAngle = (Math.PI * 2) / divisions;
      
      for (let i = 0; i < divisions; i++) {
        const startAngle = i * sliceAngle - Math.PI / 2;
        const endAngle = startAngle + sliceAngle;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        
        if (i < selected) {
          ctx.fillStyle = '#F59E0B';
        } else {
          ctx.fillStyle = '#374151';
        }
        ctx.fill();
        ctx.strokeStyle = '#0D0D14';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Center circle (crust)
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#FCD34D';
      ctx.fill();

      // Fraction label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${selected}/${divisions}`, cx, cy + radius + 40);

      // Decimal equivalent
      ctx.fillStyle = '#8B5CF6';
      ctx.font = '16px sans-serif';
      ctx.fillText(`= ${(selected / divisions).toFixed(4)}`, cx, cy + radius + 65);

      // Percentage
      ctx.fillStyle = '#60A5FA';
      ctx.font = '14px sans-serif';
      ctx.fillText(`= ${((selected / divisions) * 100).toFixed(1)}%`, cx, cy + radius + 90);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [divisions, selected]);

  return (
    <ExplorerShell concept="fractions-sharing">
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
          style={{ height: '280px', touchAction: 'none' }}
        />

        <div className="px-5 py-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 text-sm">Total slices</span>
                <span className="text-slate-400 text-sm font-mono">{divisions}</span>
              </div>
              <input
                type="range" min="2" max="12" value={divisions}
                onChange={(e) => {
                  const newDiv = Number(e.target.value);
                  setDivisions(newDiv);
                  setSelected(Math.min(selected, newDiv));
                }}
                className="w-full h-1.5 appearance-none rounded-full bg-slate-800"
                style={{ accentColor: '#8B5CF6' }}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 text-sm">Slices taken</span>
                <span className="text-slate-400 text-sm font-mono">{selected}</span>
              </div>
              <input
                type="range" min="0" max={divisions} value={selected}
                onChange={(e) => setSelected(Number(e.target.value))}
                className="w-full h-1.5 appearance-none rounded-full bg-slate-800"
                style={{ accentColor: '#F59E0B' }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                A fraction is simply "how many parts of the whole?" The bottom
                number says how many equal pieces exist. The top says how
                many you're talking about. That's it.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Fractions, decimals, and percentages are three ways of
                writing the same idea. 1/2 = 0.5 = 50%. Once you see
                this, they all become intuitive.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                History of the idea
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Egyptians used unit fractions (1/n) exclusively. Indians
                invented modern fraction notation. The decimal system came
                from India through Arab mathematicians to Europe.
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
            await trackWonderMoment('fractions-sharing');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
