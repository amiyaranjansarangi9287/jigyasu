import { useRef, useEffect, useState } from 'react';
import ExplorerShell from '../ExplorerShell';
import { useExplorerProgress } from '../hooks/useExplorerProgress';
import { useExplorerSession } from '../hooks/useExplorerSession';
import { useLumoPeer } from '../hooks/useLumoPeer';
import { EverydayConnection } from '../components/EverydayConnection';
import { ThinkingPrompt } from '../components/ThinkingPrompt';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';
import { EXPLORER_CONCEPTS } from '../data/explorerContent';

export default function DayNightAdult() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'day-night')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('day-night');
        trackConceptComplete('day-night');
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

    let rotation = 0;

    const animate = () => {
      rotation += 0.01 * rotationSpeed;
      
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, w, h);

      // Sun on the left
      const sunX = 50;
      const sunY = h / 2;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 30);
      sunGrad.addColorStop(0, '#FEF9C3');
      sunGrad.addColorStop(0.5, '#FCD34D');
      sunGrad.addColorStop(1, '#F59E0B');
      ctx.beginPath();
      ctx.arc(sunX, sunY, 25, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      // Sun rays
      ctx.strokeStyle = 'rgba(252, 211, 77, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(angle) * 30, sunY + Math.sin(angle) * 30);
        ctx.lineTo(sunX + Math.cos(angle) * 50, sunY + Math.sin(angle) * 50);
        ctx.stroke();
      }

      // Earth
      const earthX = w / 2 + 40;
      const earthY = h / 2;
      const earthR = 50;

      // Earth base (night side)
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
      ctx.fillStyle = '#1E3A5F';
      ctx.fill();

      // Day side (lit by sun)
      ctx.save();
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
      ctx.clip();
      
      ctx.beginPath();
      ctx.ellipse(earthX - 10, earthY, earthR, earthR, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#22C55E';
      ctx.fill();
      ctx.restore();

      // India marker
      const indiaAngle = rotation + Math.PI * 0.3;
      const indiaX = earthX + Math.cos(indiaAngle) * earthR * 0.7;
      const indiaY = earthY + Math.sin(indiaAngle) * earthR * 0.3;
      
      ctx.beginPath();
      ctx.arc(indiaX, indiaY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();

      // Check if India is in daylight
      const isDay = Math.cos(indiaAngle) < 0.3;

      // Rotation arrow
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(earthX, earthY - earthR - 15, 12, Math.PI * 0.8, Math.PI * 2.2);
      ctx.stroke();
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(earthX + 10, earthY - earthR - 20);
      ctx.lineTo(earthX + 15, earthY - earthR - 15);
      ctx.lineTo(earthX + 8, earthY - earthR - 12);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Sun', sunX, sunY + 45);
      ctx.fillText('Earth', earthX, earthY + earthR + 20);
      
      ctx.fillStyle = '#F59E0B';
      ctx.fillText(`India: ${isDay ? 'Day' : 'Night'}`, earthX, h - 15);

      ctx.fillStyle = '#8B5CF6';
      ctx.font = '10px sans-serif';
      ctx.fillText('Earth rotates', earthX, earthY - earthR - 35);
      ctx.fillText('(Sun stays still)', earthX, earthY - earthR - 22);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [rotationSpeed]);

  return (
    <ExplorerShell concept="day-night">
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
              <span className="text-slate-500 text-sm">Rotation speed</span>
              <span className="text-slate-400 text-sm font-mono">{rotationSpeed}x</span>
            </div>
            <input
              type="range" min="0.1" max="3" step="0.1" value={rotationSpeed}
              onChange={(e) => setRotationSpeed(Number(e.target.value))}
              className="w-full h-1.5 appearance-none rounded-full bg-slate-800"
              style={{ accentColor: '#8B5CF6' }}
            />
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                The Sun doesn't "rise" — Earth rotates, bringing you into
                sunlight. This Copernican insight took centuries to accept
                because our intuition says the Sun moves.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Earth rotates once every 24 hours. Time zones exist because
                different places face the Sun at different times. Jet lag
                is your body catching up to a new rotation position.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                History of the idea
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Aryabhata in 499 AD proposed Earth's rotation. Copernicus
                revived the idea in 1543 Europe. Galileo was put under
                house arrest for supporting it. The idea that our daily
                experience could be an illusion was revolutionary.
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
            await trackWonderMoment('day-night');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
