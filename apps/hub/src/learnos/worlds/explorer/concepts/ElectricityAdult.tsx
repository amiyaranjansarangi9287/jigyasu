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

export default function ElectricityAdult() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [circuitOn, setCircuitOn] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'electricity')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('electricity');
        trackConceptComplete('electricity');
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
    const electrons: { pos: number; speed: number }[] = [];
    
    // Initialize electrons
    for (let i = 0; i < 15; i++) {
      electrons.push({ pos: i / 15, speed: 0.002 + Math.random() * 0.001 });
    }

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const circuitW = 200;
      const circuitH = 120;

      // Draw circuit path
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(cx - circuitW / 2, cy - circuitH / 2);
      ctx.lineTo(cx + circuitW / 2, cy - circuitH / 2);
      ctx.lineTo(cx + circuitW / 2, cy + circuitH / 2);
      ctx.lineTo(cx - circuitW / 2, cy + circuitH / 2);
      ctx.closePath();
      ctx.stroke();

      // Battery
      ctx.fillStyle = '#4B5563';
      ctx.fillRect(cx - circuitW / 2 - 5, cy - 20, 10, 40);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(cx - circuitW / 2 - 3, cy - 18, 6, 15);
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(cx - circuitW / 2 - 3, cy + 3, 6, 15);
      
      // + and - labels
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+', cx - circuitW / 2 - 15, cy - 8);
      ctx.fillText('−', cx - circuitW / 2 - 15, cy + 12);

      // Light bulb
      const bulbX = cx + circuitW / 2;
      const bulbY = cy;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 15, 0, Math.PI * 2);
      ctx.fillStyle = circuitOn ? '#FCD34D' : '#374151';
      ctx.fill();
      
      if (circuitOn) {
        // Glow effect
        const glow = ctx.createRadialGradient(bulbX, bulbY, 0, bulbX, bulbY, 40);
        glow.addColorStop(0, 'rgba(252, 211, 77, 0.3)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(bulbX, bulbY, 40, 0, Math.PI * 2);
        ctx.fill();
      }

      // Switch
      const switchX = cx;
      const switchY = cy + circuitH / 2;
      ctx.fillStyle = '#6B7280';
      ctx.fillRect(switchX - 15, switchY - 5, 30, 10);

      // Update and draw electrons
      if (circuitOn) {
        electrons.forEach((e) => {
          e.pos = (e.pos + e.speed) % 1;
          
          // Calculate position along circuit
          const pathLength = 2 * circuitW + 2 * circuitH;
          const dist = e.pos * pathLength;
          
          let ex, ey;
          if (dist < circuitW) {
            // Top
            ex = cx - circuitW / 2 + dist;
            ey = cy - circuitH / 2;
          } else if (dist < circuitW + circuitH) {
            // Right
            ex = cx + circuitW / 2;
            ey = cy - circuitH / 2 + (dist - circuitW);
          } else if (dist < 2 * circuitW + circuitH) {
            // Bottom
            ex = cx + circuitW / 2 - (dist - circuitW - circuitH);
            ey = cy + circuitH / 2;
          } else {
            // Left
            ex = cx - circuitW / 2;
            ey = cy + circuitH / 2 - (dist - 2 * circuitW - circuitH);
          }
          
          ctx.beginPath();
          ctx.arc(ex, ey, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#60A5FA';
          ctx.fill();
        });
      }

      // Labels
      ctx.fillStyle = '#8B5CF6';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Electrons jostle in place', cx, 30);
      ctx.fillText('Signal travels at light speed', cx, 45);
      
      ctx.fillStyle = circuitOn ? '#22C55E' : '#EF4444';
      ctx.fillText(circuitOn ? 'CIRCUIT CLOSED' : 'CIRCUIT OPEN', cx, h - 15);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [circuitOn]);

  return (
    <ExplorerShell concept="electricity">
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
          <button
            onClick={() => setCircuitOn(!circuitOn)}
            className={`w-full py-3 rounded-xl text-sm font-medium mb-4 min-h-[44px]
              ${circuitOn
                ? 'bg-red-600 text-white'
                : 'bg-green-600 text-white'
              }`}
          >
            {circuitOn ? 'Open Circuit (Turn Off)' : 'Close Circuit (Turn On)'}
          </button>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                <Trans i18nKey="auto.electricityadult.electrons_don_t_zoom_through_w">Electrons don't zoom through wires like water. They drift
                                              slowly — millimeters per second. But the electromagnetic
                                              wave that carries the signal travels at near light speed.</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.electricityadult.your_charger_gets_warm_because">Your charger gets warm because electrons collide with atoms
                                              (resistance). That wasted energy becomes heat. Higher
                                              resistance means more heat, more energy loss.</Trans>
                                            </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                <Trans i18nKey="auto.electricityadult.history_of_the_idea">History of the idea</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.electricityadult.franklin_thought_electricity_f">Franklin thought electricity flowed from positive to
                                              negative. He was wrong — electrons flow the other way.
                                              We still use his convention. Faraday and Ohm gave us
                                              the laws that govern circuits.</Trans>
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
            await trackWonderMoment('electricity');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
