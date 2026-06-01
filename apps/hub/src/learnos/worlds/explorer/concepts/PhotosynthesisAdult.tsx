import { useRef, useEffect, useState } from 'react';
import ExplorerShell from '../ExplorerShell';
import { useExplorerProgress } from '../hooks/useExplorerProgress';
import { useExplorerSession } from '../hooks/useExplorerSession';
import { useLumoPeer } from '../hooks/useLumoPeer';
import { EverydayConnection } from '../components/EverydayConnection';
import { ThinkingPrompt } from '../components/ThinkingPrompt';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import { EXPLORER_CONCEPTS } from '../data/explorerContent';

export default function PhotosynthesisAdult() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [lightIntensity, setLightIntensity] = useState(50);
  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'photosynthesis')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('photosynthesis');
        trackConceptComplete('photosynthesis');
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

    const particles: { x: number; y: number; type: 'photon' | 'o2' | 'co2'; vy: number }[] = [];
    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      ctx.clearRect(0, 0, w, h);
      
      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, `rgba(251, 191, 36, ${lightIntensity / 100})`);
      skyGrad.addColorStop(1, '#0D0D14');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Add photons from top
      if (Math.random() < lightIntensity / 100 * 0.3) {
        particles.push({
          x: Math.random() * w,
          y: 0,
          type: 'photon',
          vy: 80 + Math.random() * 40,
        });
      }

      // Leaf shape
      const leafY = h * 0.6;
      ctx.beginPath();
      ctx.ellipse(w / 2, leafY, 80, 30, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#22C55E';
      ctx.fill();

      // Leaf vein
      ctx.beginPath();
      ctx.moveTo(w / 2 - 70, leafY);
      ctx.lineTo(w / 2 + 70, leafY);
      ctx.strokeStyle = '#166534';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.vy * dt * (p.type === 'o2' ? -1 : 1);

        if (p.type === 'photon') {
          // Yellow photon
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#FCD34D';
          ctx.fill();

          // Check if hit leaf
          if (p.y > leafY - 30 && p.y < leafY + 30 && 
              Math.abs(p.x - w / 2) < 80) {
            particles.splice(i, 1);
            // Emit O2
            if (Math.random() < 0.7) {
              particles.push({
                x: p.x,
                y: leafY - 35,
                type: 'o2',
                vy: 30 + Math.random() * 20,
              });
            }
          }
        } else if (p.type === 'o2') {
          // Blue O2
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#60A5FA';
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = '6px sans-serif';
          ctx.fillText('O₂', p.x - 5, p.y + 2);
        }

        // Remove off-screen
        if (p.y < -10 || p.y > h + 10) {
          particles.splice(i, 1);
        }
      }

      // Labels
      ctx.fillStyle = '#FCD34D';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Sunlight (Photons)', w / 2, 25);

      ctx.fillStyle = '#60A5FA';
      ctx.fillText('Oxygen released', w / 2, h - 20);

      ctx.fillStyle = '#22C55E';
      ctx.fillText('Chloroplast', w / 2, leafY + 50);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [lightIntensity]);

  return (
    <ExplorerShell concept="photosynthesis">
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
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-slate-500 text-sm">Light intensity</span>
              <span className="text-slate-400 text-sm font-mono">{lightIntensity}%</span>
            </div>
            <input
              type="range" min="5" max="100" value={lightIntensity}
              onChange={(e) => setLightIntensity(Number(e.target.value))}
              className="w-full h-1.5 appearance-none rounded-full bg-slate-800"
              style={{ accentColor: '#22C55E' }}
            />
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                Photons from the sun strike chlorophyll molecules. Their
                energy splits water, releasing oxygen. The hydrogen
                combines with CO₂ to make glucose — stored sunlight.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Coal and petrol are ancient photosynthesis — sunlight
                captured by plants millions of years ago, compressed
                underground. Burning them releases that ancient light.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                History of the idea
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                For centuries, people believed plants ate soil. Jan van Helmont
                in 1648 proved this wrong. Joseph Priestley in 1771 showed plants
                produce oxygen. Melvin Calvin won the Nobel Prize in 1961 for
                mapping the exact chemical pathway.
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
            await trackWonderMoment('photosynthesis');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
