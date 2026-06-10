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

export default function GravityOrbits() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [mass, setMass] = useState(50);
  const [showNewton, setShowNewton] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'gravity-orbits')!;

  // Track reading time for completion (2 minutes)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('gravity-orbits');
        trackConceptComplete('gravity-orbits');
        setHasCompleted(true);
        setTimeout(() => lumo.poseQuestion(concept.thinkingPrompt), 3000);
      }
    }, 120000);
    return () => clearTimeout(timeout);
  }, [hasCompleted, markCompleted, trackConceptComplete, lumo, concept]);

  // Canvas: gravity and orbit simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = CanvasHelpers.setupHiDPI(canvas, rect.width, rect.height);
    const w = rect.width;
    const h = rect.height;

    const cx = w / 2;
    const cy = h / 2;

    // Stars
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
    }));

    // Grid distortion based on mass
    const getDisplacedPoint = (
      x: number, y: number,
      mx: number, my: number,
      strength: number
    ) => {
      const dx = mx - x;
      const dy = my - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const smoothDist = dist + 15;
      const force = strength / (smoothDist / 20);
      const falloff = Math.min(force, dist * 0.5);
      if (dist < 1) return { x, y };
      return {
        x: x + (dx / dist) * falloff * 0.5,
        y: y + (dy / dist) * falloff * 0.5,
      };
    };

    const gridCols = 14;
    const gridRows = 10;
    let orbitAngle = 0;

    const animate = (timestamp: number) => {
      const time = timestamp / 1000;

      ctx.clearRect(0, 0, w, h);

      // Deep space background
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, w, h);

      // Stars
      stars.forEach((star) => {
        const twinkle = 0.2 + Math.sin(time * 1.5 + star.twinkle) * 0.2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${twinkle})`;
        ctx.fill();
      });

      // Spacetime grid
      const cellW = w / gridCols;
      const cellH = h / gridRows;

      for (let row = 0; row <= gridRows; row++) {
        ctx.beginPath();
        for (let col = 0; col <= gridCols; col++) {
          const ox = col * cellW;
          const oy = row * cellH;
          const dp = getDisplacedPoint(ox, oy, cx, cy, mass);
          if (col === 0) ctx.moveTo(dp.x, dp.y);
          else ctx.lineTo(dp.x, dp.y);
        }
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let col = 0; col <= gridCols; col++) {
        ctx.beginPath();
        for (let row = 0; row <= gridRows; row++) {
          const ox = col * cellW;
          const oy = row * cellH;
          const dp = getDisplacedPoint(ox, oy, cx, cy, mass);
          if (row === 0) ctx.moveTo(dp.x, dp.y);
          else ctx.lineTo(dp.x, dp.y);
        }
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Sun
      const sunGrad = ctx.createRadialGradient(cx - 3, cy - 3, 0, cx, cy, 20);
      sunGrad.addColorStop(0, '#FEF9C3');
      sunGrad.addColorStop(0.5, '#FCD34D');
      sunGrad.addColorStop(1, '#F59E0B');
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      // Sun glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
      glow.addColorStop(0, 'rgba(251,191,36,0.15)');
      glow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Orbiting planet
      orbitAngle += 0.008 + mass * 0.0002;
      const orbitR = Math.min(w, h) * 0.3;
      const orbitEcc = 0.55;
      const px = cx + Math.cos(orbitAngle) * orbitR;
      const py = cy + Math.sin(orbitAngle) * orbitR * orbitEcc;

      // Orbit path (dashed)
      ctx.beginPath();
      ctx.ellipse(cx, cy, orbitR, orbitR * orbitEcc, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Planet
      const planetGrad = ctx.createRadialGradient(px - 1, py - 1, 0, px, py, 7);
      planetGrad.addColorStop(0, '#93C5FD');
      planetGrad.addColorStop(1, '#3B82F6');
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = planetGrad;
      ctx.fill();

      // Newton force arrows (if toggled)
      if (showNewton) {
        const dx = cx - px;
        const dy = cy - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const arrowLen = 30;
        const ex = px + (dx / dist) * arrowLen;
        const ey = py + (dy / dist) * arrowLen;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Gravity', (px + ex) / 2, (py + ey) / 2 - 6);
      }

      // "Falling" annotation
      if (time % 6 < 3) {
        ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('continuously falling', cx, h - 20);
        ctx.fillText('and missing', cx, h - 8);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [mass, showNewton]);

  return (
    <ExplorerShell concept="gravity-orbits">
      <div className="flex flex-col">
        {/* Title and hook — editorial style */}
        <div className="px-5 pt-6 pb-4">
          <h1 className="text-xl font-bold text-white mb-3 leading-tight">
            {concept.title}
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            {concept.hook}
          </p>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: '260px', touchAction: 'none' }}
        />

        {/* Controls — clean, minimal */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 text-sm"><Trans i18nKey="auto.gravityorbits.mass_of_star">Mass of star</Trans></span>
                <span className="text-slate-400 text-sm font-mono">{mass}</span>
              </div>
              <input
                type="range" min="10" max="100" value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full h-1.5 appearance-none rounded-full bg-slate-800"
                style={{ accentColor: '#8B5CF6' }}
              />
            </div>
            <button
              onClick={() => setShowNewton(!showNewton)}
              className={`px-3 py-2 rounded-xl text-sm font-medium
                          transition-all min-h-[36px] ${
                showNewton
                  ? 'bg-violet-800/50 border border-violet-700 text-violet-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-500'
              }`}
            >
              <Trans i18nKey="auto.gravityorbits.newton">Newton</Trans>
                                      </button>
          </div>

          {/* Explanation — adult-level text */}
          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                <Trans i18nKey="auto.gravityorbits.the_planet_is_in_constant_free">The planet is in constant free fall toward the Sun.
                                              But it also has sideways velocity. The result: it
                                              keeps falling, but the Earth curves away beneath it.</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.gravityorbits.newton_realised_that_the_moon_">Newton realised that the Moon and a falling apple
                                              are obeying the same force. That unification —
                                              Earth physics and sky physics are the same —
                                              was revolutionary.</Trans>
                                            </p>
            </div>

            {/* Historical context */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase
                            tracking-wider mb-2">
                <Trans i18nKey="auto.gravityorbits.history_of_the_idea">History of the idea</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.gravityorbits.for_2_000_years_heavenly_motio">For 2,000 years, "heavenly motion" and "earthly motion"
                                              were thought to be fundamentally different. The sky
                                              followed perfect circular paths; the Earth was messy.
                                              Newton's law showed they were one thing.
                                              Einstein later showed Newton was slightly wrong —
                                              it's not force but curved spacetime.
                                              This canvas shows Newton's version.</Trans>
                                            </p>
            </div>
          </div>
        </div>

        {/* Everyday connection */}
        <EverydayConnection
          connection={concept.everydayConnection}
          indianContext={concept.indianContext}
          onRead={recordEverydayConnection}
        />

        {/* Thinking prompt */}
        <ThinkingPrompt
          question={concept.thinkingPrompt}
          onEngaged={async () => {
            await recordThinkingPrompt();
            await trackWonderMoment('gravity-orbits');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
