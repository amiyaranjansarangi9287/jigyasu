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

export default function EvolutionAdult() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [generation, setGeneration] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'evolution')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('evolution');
        trackConceptComplete('evolution');
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

    // Tree of life nodes
    const nodes = [
      { x: w / 2, y: h - 40, label: 'Common Ancestor', emoji: '🦠', gen: 0 },
      { x: w / 4, y: h - 100, label: 'Plants', emoji: '🌿', gen: 1 },
      { x: w * 3 / 4, y: h - 100, label: 'Animals', emoji: '🐛', gen: 1 },
      { x: w / 6, y: h - 160, label: 'Trees', emoji: '🌳', gen: 2 },
      { x: w / 3, y: h - 160, label: 'Flowers', emoji: '🌸', gen: 2 },
      { x: w * 2 / 3, y: h - 160, label: 'Fish', emoji: '🐟', gen: 2 },
      { x: w * 5 / 6, y: h - 160, label: 'Reptiles', emoji: '🦎', gen: 2 },
      { x: w / 2, y: h - 220, label: 'Mammals', emoji: '🐵', gen: 3 },
      { x: w * 3 / 4, y: h - 220, label: 'Birds', emoji: '🐦', gen: 3 },
    ];

    const connections = [
      [0, 1], [0, 2],
      [1, 3], [1, 4],
      [2, 5], [2, 6],
      [6, 7], [6, 8],
    ];

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, w, h);

      // Draw connections
      connections.forEach(([from, to]) => {
        const fromNode = nodes[from];
        const toNode = nodes[to];
        
        if (fromNode.gen <= generation && toNode.gen <= generation) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y - 15);
          ctx.lineTo(toNode.x, toNode.y + 15);
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        if (node.gen <= generation) {
          // Circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
          ctx.fillStyle = '#1E293B';
          ctx.fill();
          ctx.strokeStyle = '#8B5CF6';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Emoji
          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(node.emoji, node.x, node.y + 7);
        }
      });

      // DNA shared percentage
      ctx.fillStyle = '#60A5FA';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Humans share DNA with:', w / 2, 25);
      ctx.fillText('🐵 98% Chimps  |  🍌 60% Bananas  |  🪰 40% Flies', w / 2, 42);

      // Generation label
      ctx.fillStyle = '#8B5CF6';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Showing ${generation === 0 ? 'origin' : generation + ' branches'}`, w / 2, h - 10);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [generation]);

  return (
    <ExplorerShell concept="evolution">
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
          style={{ height: '260px', touchAction: 'none' }}
        />

        <div className="px-5 py-4">
          <div className="flex gap-2 mb-4">
            {[0, 1, 2, 3].map((gen) => (
              <button
                key={gen}
                onClick={() => setGeneration(gen)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium min-h-[40px]
                  ${generation === gen
                    ? 'bg-violet-700 text-white'
                    : 'bg-slate-800 text-slate-400'
                  }`}
              >
                {gen === 0 ? 'Origin' : `+${gen} Branch${gen > 1 ? 'es' : ''}`}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                <Trans i18nKey="auto.evolutionadult.humans_didn_t_descend_from_chi">Humans didn't descend from chimps. Humans and chimps share
                                              a common ancestor. That's very different — we're cousins,
                                              not descendants.</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.evolutionadult.the_60_dna_shared_with_bananas">The 60% DNA shared with bananas represents the core
                                              machinery of life — cell division, energy production —
                                              that hasn't changed in billions of years.</Trans>
                                            </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                <Trans i18nKey="auto.evolutionadult.history_of_the_idea">History of the idea</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.evolutionadult.darwin_gathered_evidence_for_2">Darwin gathered evidence for 20 years before publishing
                                              "On the Origin of Species" in 1859. He knew it would be
                                              controversial. That patience — evidence before claim —
                                              remains a model for science.</Trans>
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
            await trackWonderMoment('evolution');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
