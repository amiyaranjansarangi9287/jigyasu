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

export default function DnaNatureAdult() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lumo = useLumoPeer();
  const { markCompleted, recordThinkingPrompt, recordEverydayConnection } = useExplorerProgress();
  const { trackConceptComplete, trackWonderMoment } = useExplorerSession();

  const [hasCompleted, setHasCompleted] = useState(false);

  const concept = EXPLORER_CONCEPTS.find((c) => c.id === 'dna-nature')!;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        markCompleted('dna-nature');
        trackConceptComplete('dna-nature');
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
    const bases = ['A', 'T', 'G', 'C'];
    const baseColors: Record<string, string> = {
      A: '#EF4444',
      T: '#22C55E',
      G: '#3B82F6',
      C: '#F59E0B',
    };
    const pairs: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };

    // Generate DNA sequence
    const sequence = Array.from({ length: 20 }, () => bases[Math.floor(Math.random() * 4)]);

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0D0D14';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const helixWidth = 60;
      const spacing = 15;

      // Draw double helix
      sequence.forEach((base, i) => {
        const y = 30 + i * spacing;
        const offset = Math.sin(time + i * 0.3) * helixWidth;
        const depth = Math.cos(time + i * 0.3);
        
        // Left strand
        const leftX = cx - offset;
        const rightX = cx + offset;
        
        // Draw backbone
        if (i > 0) {
          const prevOffset = Math.sin(time + (i - 1) * 0.3) * helixWidth;
          const prevY = 30 + (i - 1) * spacing;
          
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx - prevOffset, prevY);
          ctx.lineTo(leftX, y);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(cx + prevOffset, prevY);
          ctx.lineTo(rightX, y);
          ctx.stroke();
        }
        
        // Draw base pair connection
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(rightX, y);
        ctx.stroke();
        
        // Draw bases (size based on depth)
        const size = 8 + depth * 3;
        const alpha = 0.6 + depth * 0.4;
        
        // Left base
        ctx.fillStyle = baseColors[base] + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(leftX, y, Math.max(4, size), 0, Math.PI * 2);
        ctx.fill();
        
        // Right base (pair)
        const pairBase = pairs[base];
        ctx.fillStyle = baseColors[pairBase] + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(rightX, y, Math.max(4, size), 0, Math.PI * 2);
        ctx.fill();
        
        // Labels (only for front bases)
        if (depth > 0.5) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(base, leftX, y + 3);
          ctx.fillText(pairBase, rightX, y + 3);
        }
      });

      // Legend
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      let legendY = h - 60;
      Object.entries(baseColors).forEach(([base, color]) => {
        ctx.fillStyle = color;
        ctx.fillRect(20, legendY, 12, 12);
        ctx.fillStyle = '#fff';
        const names: Record<string, string> = { A: 'Adenine', T: 'Thymine', G: 'Guanine', C: 'Cytosine' };
        ctx.fillText(`${base} - ${names[base]}`, 38, legendY + 10);
        legendY += 16;
      });

      // Pairing rules
      ctx.fillStyle = '#8B5CF6';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('A pairs with T  |  G pairs with C', cx, h - 10);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <ExplorerShell concept="dna-nature">
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
          style={{ height: '320px', touchAction: 'none' }}
        />

        <div className="px-5 py-4">
          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                <Trans i18nKey="auto.dnanatureadult.the_human_genome_has_3_billion">The human genome has 3 billion base pairs. If you printed
                                              them as letters, it would fill 200 phone books. Yet only
                                              about 2% codes for proteins — the rest was once called
                                              "junk DNA" but isn't junk at all.</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.dnanatureadult.mrna_vaccines_work_by_giving_y">mRNA vaccines work by giving your cells the instructions
                                              (in this same code) to make a harmless piece of a virus.
                                              Your immune system learns from it. The code is the key.</Trans>
                                            </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-2">
                <Trans i18nKey="auto.dnanatureadult.history_of_the_idea">History of the idea</Trans>
                                            </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                <Trans i18nKey="auto.dnanatureadult.watson_and_crick_discovered_th">Watson and Crick discovered the structure in 1953. Rosalind
                                              Franklin's X-ray crystallography was essential — she received
                                              almost no credit in her lifetime. The Human Genome Project
                                              completed in 2003. CRISPR gene editing arrived in 2012.</Trans>
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
            await trackWonderMoment('dna-nature');
          }}
        />
      </div>
    </ExplorerShell>
  );
}
