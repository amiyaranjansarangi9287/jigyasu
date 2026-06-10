import type { InterestLens } from '../types/explorer.types';
import { INTEREST_LENSES } from '../data/explorerContent';
import { Trans } from "react-i18next";

interface ExplorerNavProps {
  selectedLens: InterestLens | 'all';
  onSelectLens: (lens: InterestLens | 'all') => void;
}

export function ExplorerNav({ selectedLens, onSelectLens }: ExplorerNavProps) {

  return (
    <div className="px-5 mb-4">
      <p className="text-slate-600 text-sm mb-2">
        <Trans i18nKey="auto.explorernav.what_are_you_here_for_today">What are you here for today?</Trans>
                    </p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => onSelectLens('all')}
          className={`flex-shrink-0 px-3 py-2 rounded-full text-sm
                      font-medium transition-all min-h-[36px] ${
            selectedLens === 'all'
              ? 'bg-violet-700 text-white'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Trans i18nKey="auto.explorernav.everything">Everything</Trans>
                          </button>
        {(Object.entries(INTEREST_LENSES) as [InterestLens, typeof INTEREST_LENSES[InterestLens]][]).map(([key, lens]) => (
          <button
            key={key}
            onClick={() => onSelectLens(key)}
            className={`flex-shrink-0 flex items-center gap-1.5
                        px-3 py-2 rounded-full text-sm font-medium
                        transition-all min-h-[36px] ${
              selectedLens === key
                ? 'bg-violet-700 text-white'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <span>{lens.emoji}</span>
            <span className="hidden sm:inline">{lens.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
