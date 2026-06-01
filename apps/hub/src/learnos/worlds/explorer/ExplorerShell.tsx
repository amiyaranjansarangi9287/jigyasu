import { useNavigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { LumoPeerBubble } from './components/LumoPeerBubble';
import { useExplorerSession } from './hooks/useExplorerSession';
import { useLumoPeer } from './hooks/useLumoPeer';
import type { ExplorerConcept } from './types/explorer.types';
import { EXPLORER_CONCEPTS } from './data/explorerContent';

interface ExplorerShellProps {
  concept: ExplorerConcept;
  children: ReactNode;
}

export default function ExplorerShell({ concept, children }: ExplorerShellProps) {
  const navigate = useNavigate();
  const { trackConceptOpen } = useExplorerSession();
  const lumo = useLumoPeer();

  const conceptInfo = EXPLORER_CONCEPTS.find((c) => c.id === concept);

  useEffect(() => {
    trackConceptOpen(concept);
    // Share Lumo's opener after 5 seconds — let person read first
    if (conceptInfo) {
      const timer = setTimeout(() => {
        lumo.shareInsight(conceptInfo.lumoOpener);
      }, 5000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concept, trackConceptOpen, conceptInfo, lumo.shareInsight]);

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col">
      {/* Minimal header — no title, just back */}
      <div className="flex items-center justify-between
                      px-4 py-3 border-b border-slate-900">
        <button
          onClick={() => navigate('/explorer')}
          className="text-slate-600 hover:text-slate-400 text-sm
                     transition-colors flex items-center gap-1"
        >
          ← Explorer
        </button>
        {/* Subject tag — very subtle */}
        <span className="text-slate-700 text-sm capitalize">
          {conceptInfo?.subject}
        </span>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Lumo peer bubble */}
      <LumoPeerBubble
        visible={lumo.peacockVisible}
        message={lumo.peacockMessage}
        name={lumo.peacockName}
        emotion={lumo.peacockEmotion}
        onDismiss={lumo.dismiss}
      />

      {/* Parent corner */}
      <ParentCorner onExit={() => navigate('/explorer')} />
    </div>
  );
}
