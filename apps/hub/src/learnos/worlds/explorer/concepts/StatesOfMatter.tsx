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

interface Molecule {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function StatesOfMatter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [temperature, setTemperature] = useState(25);
  const [hasCompleted, setHasCompleted] = useState(false);
  const moleculesRef = useRef<Molecule[]>([]);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'states-of-matter')!;

  // Track time for completion
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('states-of-matter');
        trackConceptComplete('states-of-matter');
        setHasCompleted(true);
        setTimeout(() => lumo.poseQuestion(concept.thinkingPrompt), 3000);
      }
    }, 120000);
    return () => clearTimeout(timeout);
  }, [hasCompleted, markCompleted, trackConceptComplete, lumo, concept]);

  // Initialize molecules
  useEffect(() => {
    moleculesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * 300,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = CanvasHelpers.setupHiDPI(canvas, rect.width, rect.height);
    const w = rect.width;
    const h = rect.height;

    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, w, h);

      // Determine state
      const state = temperature < 0 ? 'solid' : temperature < 100 ? 'liquid' : 'gas';
      const speed = state === 'solid' ? 0.1 : state === 'liquid' ? 1.5 : 4;
      const bondStrength = state === 'solid' ? 0.95 : state === 'liquid' ? 0.6 : 0;

      // Update molecules
      moleculesRef.current.forEach((m) => {
        // Add random velocity based on temperature
        m.vx += (Math.random() - 0.5) * speed * dt * 10;
        m.vy += (Math.random() - 0.5) * speed * dt * 10;

        // Damping based on state
        m.vx *= 0.98 - bondStrength * 0.05;
        m.vy *= 0.98 - bondStrength * 0.05;

        // Clamp velocity
        const maxVel = speed * 3;
        m.vx = Math.max(-maxVel, Math.min(maxVel, m.vx));
        m.vy = Math.max(-maxVel, Math.min(maxVel, m.vy));

        m.x += m.vx;
        m.y += m.vy;

        // Boundaries
        if (m.x < 10) { m.x = 10; m.vx *= -0.5; }
        if (m.x > w - 10) { m.x = w - 10; m.vx *= -0.5; }
        if (m.y < 10) { m.y = 10; m.vy *= -0.5; }
        if (m.y > h - 10) { m.y = h - 10; m.vy *= -0.5; }
      });

      // Draw molecules
      const color = state === 'solid' ? '#60A5FA' : state === 'liquid' ? '#3B82F6' : '#93C5FD';
      moleculesRef.current.forEach((m) => {
        ctx.beginPath();
        ctx.arc(m.x, m.y, state === 'gas' ? 4 : 6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Draw bonds for solid
        if (state === 'solid') {
          moleculesRef.current.forEach((other) => {
            if (m === other) return;
            const dx = other.x - m.x;
            const dy = other.y - m.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 25) {
              ctx.beginPath();
              ctx.moveTo(m.x, m.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        }
      });

      // State label
      ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(state.toUpperCase(), w / 2, 25);
      ctx.fillText(`${temperature}°C`, w / 2, h - 10);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [temperature]);

  return (
    <ExplorerShell concept="states-of-matter">
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
              <span className="text-slate-500 text-sm"><Trans i18nKey="auto.statesofmatter.temperature">Temperature</Trans></span>
              <span className="text-slate-400 text-sm font-mono">{temperature}<Trans i18nKey="auto.statesofmatter.c">°C</Trans></span>
            </div>
            <input
              type="range" min="-30" max="150" value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-1.5 appearance-none rounded-full bg-slate-800"
              style={{ accentColor: '#8B5CF6' }}
            />
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                <Trans i18nKey="auto.statesofmatter.the_same_h_o_molecules_form_ic">The same H₂O molecules form ice, water, or steam depending
                                              solely on how much energy they have. More energy means
                                              faster movement and weaker bonds.</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.statesofmatter.water_is_unusual_it_expands_wh">Water is unusual — it expands when freezing. This is why
                                              ice floats, why pipes burst in winter, and why life in
                                              frozen ponds survives.</Trans>
                                            </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                <Trans i18nKey="auto.statesofmatter.history_of_the_idea">History of the idea</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.statesofmatter.lavoisier_proved_that_matter_i">Lavoisier proved that matter is conserved in phase transitions.
                                              The same atoms, just different arrangements. This overturned
                                              the ancient belief that fire "destroyed" things.</Trans>
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
            await trackWonderMoment('states-of-matter');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
