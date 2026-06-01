import React from 'react';

export interface HintSystemProps {
  hintLevel: number;
  maxHints?: number;
  onRequestHint: () => void;
  disabled?: boolean;
}

export function HintSystem({ hintLevel, maxHints = 3, onRequestHint, disabled = false }: HintSystemProps) {
  if (hintLevel >= maxHints) return null;

  return (
    <button 
      onClick={onRequestHint}
      disabled={disabled}
      className="absolute top-0 right-0 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-sm border border-yellow-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
      title={hintLevel === 0 ? "Hint 1: Free" : hintLevel === 1 ? "Hint 2: Costs 5 XP" : "Hint 3: Show Answer"}
    >
      <span>💡</span> {hintLevel === 0 ? "Free Hint" : hintLevel === 1 ? "Hint (-5 XP)" : "Show Answer"}
    </button>
  );
}
