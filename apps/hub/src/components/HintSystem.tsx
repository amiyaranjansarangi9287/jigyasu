import React from 'react';
import { useTranslation } from 'react-i18next';

export interface HintSystemProps {
  hintLevel: number;
  maxHints?: number;
  onRequestHint: () => void;
  disabled?: boolean;
}

export function HintSystem({ hintLevel, maxHints = 3, onRequestHint, disabled = false }: HintSystemProps) {
  const { t } = useTranslation();

  if (hintLevel >= maxHints) return null;

  return (
    <button 
      onClick={onRequestHint}
      disabled={disabled}
      className="absolute top-0 right-0 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-sm border border-yellow-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
      title={hintLevel === 0 ? t('core.pedagogy.hints.title_free', "Hint 1: Free") : hintLevel === 1 ? t('core.pedagogy.hints.title_cost', "Hint 2: Costs 5 XP") : t('core.pedagogy.hints.title_answer', "Hint 3: Show Answer")}
     aria-label="Action button">
      <span>💡</span> {hintLevel === 0 ? t('core.pedagogy.hints.free', "Free Hint") : hintLevel === 1 ? t('core.pedagogy.hints.cost', "Hint (-5 XP)") : t('core.pedagogy.hints.show_answer', "Show Answer")}
    </button>
  );
}
