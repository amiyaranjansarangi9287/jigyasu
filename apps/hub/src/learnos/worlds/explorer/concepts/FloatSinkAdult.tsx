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
import { useTranslation } from 'react-i18next';

export default function FloatSinkAdult() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [objectType, setObjectType] = useState<'ship' | 'needle' | 'ball'>('ship');
  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'float-sink')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('float-sink');
        trackConceptComplete('float-sink');
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
    let objectY = 50;
    const waterLevel = h * 0.4;
    
    const objects = {
      ship: { density: 0.3, width: 80, height: 25, color: '#6B7280', label: 'Steel Ship', floats: true },
      needle: { density: 7.8, width: 40, height: 3, color: '#9CA3AF', label: 'Steel Needle', floats: false },
      ball: { density: 0.5, width: 30, height: 30, color: '#F59E0B', label: 'Wooden Ball', floats: true },
    };

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);
      
      // Sky
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, w, h);

      // Water
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.fillRect(0, waterLevel, w, h - waterLevel);

      // Water surface wave
      ctx.beginPath();
      ctx.moveTo(0, waterLevel);
      for (let x = 0; x < w; x += 5) {
        const y = waterLevel + Math.sin(x * 0.03 + time * 2) * 3;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.fill();

      const obj = objects[objectType];
      const targetY = obj.floats ? waterLevel - obj.height * 0.4 : h - 40;
      objectY += (targetY - objectY) * 0.03;

      const cx = w / 2;

      // Draw object
      ctx.fillStyle = obj.color;
      if (objectType === 'ship') {
        // Ship hull shape
        ctx.beginPath();
        ctx.moveTo(cx - obj.width / 2, objectY);
        ctx.lineTo(cx - obj.width / 2 + 10, objectY + obj.height);
        ctx.lineTo(cx + obj.width / 2 - 10, objectY + obj.height);
        ctx.lineTo(cx + obj.width / 2, objectY);
        ctx.closePath();
        ctx.fill();
        // Cabin
        ctx.fillRect(cx - 15, objectY - 15, 30, 15);
      } else if (objectType === 'needle') {
        ctx.fillRect(cx - obj.width / 2, objectY, obj.width, obj.height);
      } else {
        ctx.beginPath();
        ctx.arc(cx, objectY + obj.height / 2, obj.height / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Displaced water indicator
      if (obj.floats) {
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx - obj.width / 2 - 20, objectY + obj.height * 0.6);
        ctx.lineTo(cx + obj.width / 2 + 20, objectY + obj.height * 0.6);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#60A5FA';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Displaced water', cx + obj.width / 2 + 25, objectY + obj.height * 0.6 + 4);
      }

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(obj.label, cx, 25);
      ctx.fillStyle = '#8B5CF6';
      ctx.font = '11px sans-serif';
      ctx.fillText(`Density: ${obj.density} g/cm³`, cx, 45);
      ctx.fillText(obj.floats ? 'FLOATS' : 'SINKS', cx, h - 15);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [objectType]);

  return (
    <ExplorerShell concept="float-sink">
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
          <div className="flex gap-2 mb-4">
            {(['ship', 'needle', 'ball'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setObjectType(type)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium min-h-[40px]
                  ${objectType === type
                    ? 'bg-violet-700 text-white'
                    : 'bg-slate-800 text-slate-400'
                  }`}
              >
                {type === 'ship' ? 'Ship' : type === 'needle' ? 'Needle' : 'Ball'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                <Trans i18nKey="auto.floatsinkadult.a_ship_floats_because_its_hull">A ship floats because its hull displaces enough water to
                                              equal its weight. The steel needle is solid — it can't
                                              displace enough water, so it sinks.</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.floatsinkadult.archimedes_principle_the_buoya">Archimedes' principle: the buoyant force equals the weight
                                              of displaced fluid. Shape matters more than material.</Trans>
                                            </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                <Trans i18nKey="auto.floatsinkadult.history_of_the_idea">History of the idea</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.floatsinkadult.legend_says_archimedes_discove">Legend says Archimedes discovered this while bathing and
                                              ran through Syracuse naked shouting "Eureka!" The story
                                              may be myth, but the principle is 2,300 years old.</Trans>
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
            await trackWonderMoment('float-sink');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
