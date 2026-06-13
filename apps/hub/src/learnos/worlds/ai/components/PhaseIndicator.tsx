import { LearningPhase } from '../types';
import { cn } from '../utils/cn';
import { useTranslation } from 'react-i18next';

interface PhaseIndicatorProps {
  currentPhase: LearningPhase;
  onPhaseChange: (phase: LearningPhase) => void;
  completedPhases: LearningPhase[];
}

const phases: { id: LearningPhase; emoji: string; label: string; labelKey: string }[] = [
  { id: 'concept', emoji: '📖', label: 'Story', labelKey: 'auto.phaseindicator.story' },
  { id: 'learn', emoji: '🔮', label: 'Learn', labelKey: 'auto.phaseindicator.learn' },
  { id: 'explore', emoji: '🧸', label: 'Explore', labelKey: 'auto.phaseindicator.explore' },
  { id: 'play', emoji: '🎮', label: 'Play', labelKey: 'auto.phaseindicator.play' },
];

export default function PhaseIndicator({ currentPhase, onPhaseChange, completedPhases }: PhaseIndicatorProps) {
  const { t } = useTranslation();
  const currentIndex = phases.findIndex(p =>p.id === currentPhase);
  
  return (<div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex items-center justify-between gap-1">
        {phases.map((phase, index) => {
          const isCompleted = completedPhases.includes(phase.id);
          const isCurrent = phase.id === currentPhase;
          const isAccessible = index <= currentIndex || completedPhases.includes(phases[index - 1]?.id);
          
          return (
            <div key={phase.id} className="flex items-center flex-1">
              <button
                onClick={() => isAccessible && onPhaseChange(phase.id)}
                disabled={!isAccessible}
                className={cn(
                  "flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all w-full",
                  isCurrent && "bg-purple-100 scale-105",
                  isCompleted && !isCurrent && "bg-green-50",
                  isAccessible ? "cursor-pointer hover:bg-purple-50" : "cursor-not-allowed opacity-50"
                )}
                aria-label={`${t(phase.labelKey, phase.label)} phase${isCompleted ? ' (completed)' : ''}${isCurrent ? ' (current)' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className={cn(
                  "text-xl sm:text-3xl mb-0.5 sm:mb-1 transition-transform",
                  isCurrent && "animate-bounce"
                )}>
                  {isCompleted && !isCurrent ? '✅' : phase.emoji}
                </span>
                <span className={cn(
                  "text-xs sm:text-sm font-medium",
                  isCurrent ? "text-purple-700" : "text-gray-600"
                )}>
                  {t(phase.labelKey, phase.label)}
                </span>
              </button>
              
              {index < phases.length - 1 && (
                <div className={cn(
                  "h-1 flex-1 mx-1 sm:mx-2 rounded-full hidden sm:block",
                  isCompleted ? "bg-green-400" : "bg-gray-200"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
