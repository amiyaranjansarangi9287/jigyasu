import { useRef, useEffect, useState } from 'react';
import ExplorerShell from '../ExplorerShell';
import { useExplorerProgress } from '../hooks/useExplorerProgress';
import { useExplorerSession } from '../hooks/useExplorerSession';
import { useLumoPeer } from '../hooks/useLumoPeer';
import { EverydayConnection } from '../components/EverydayConnection';
import { ThinkingPrompt } from '../components/ThinkingPrompt';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import { EXPLORER_CONCEPTS } from '../data/explorerContent';

export default function FoodChainAdult() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'food-chain')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('food-chain');
        trackConceptComplete('food-chain');
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

    const levels = [
      { y: h - 50, label: 'Producers (Plants)', emoji: '🌿', color: '#22C55E', energy: 100 },
      { y: h - 110, label: 'Primary Consumers', emoji: '🐛', color: '#84CC16', energy: 10 },
      { y: h - 170, label: 'Secondary Consumers', emoji: '🐸', color: '#EAB308', energy: 1 },
      { y: h - 230, label: 'Top Predators', emoji: '🦅', color: '#EF4444', energy: 0.1 },
    ];

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, w, h);

      // Draw pyramid
      levels.forEach((level, i) => {
        const width = (w - 80) * (1 - i * 0.2);
        const x = (w - width) / 2;
        
        ctx.fillStyle = level.color + '40';
        ctx.fillRect(x, level.y - 40, width, 45);
        
        // Energy flow arrows
        if (i < levels.length - 1) {
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(w / 2, level.y - 45);
          ctx.lineTo(w / 2, level.y - 55);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Energy lost label
          ctx.fillStyle = '#F59E0B';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText('~90% lost as heat', w / 2 + 80, level.y - 48);
        }
        
        // Label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(level.emoji + ' ' + level.label, w / 2, level.y - 15);
        
        // Energy percentage
        ctx.fillStyle = level.color;
        ctx.font = '10px sans-serif';
        ctx.fillText(`${level.energy}% of original energy`, w / 2, level.y - 2);
      });

      // Sun (energy source)
      const sunY = 30;
      ctx.beginPath();
      ctx.arc(w / 2, sunY, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#FCD34D';
      ctx.fill();
      
      ctx.fillStyle = '#FCD34D';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Solar Energy', w / 2, sunY + 30);
      
      // Arrow from sun
      ctx.strokeStyle = '#FCD34D';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w / 2, sunY + 40);
      ctx.lineTo(w / 2, levels[3].y - 45);
      ctx.stroke();

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <ExplorerShell concept="food-chain">
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
          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                Only 10% of energy transfers between levels. A tiger needs
                to eat 100 deer to get the energy those deer got from 10,000
                plants. This is why top predators are rare.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Remove one species and cascades happen. When wolves returned
                to Yellowstone, deer behaviour changed, riverbanks recovered,
                and the rivers themselves changed course.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                History of the idea
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Charles Elton formalized food chains in 1927. The term
                "trophic cascade" came later. The Yellowstone wolf
                reintroduction (1995) became the most dramatic demonstration
                of how interconnected ecosystems truly are.
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
            await trackWonderMoment('food-chain');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
