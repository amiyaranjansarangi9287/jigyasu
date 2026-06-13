import { useState } from 'react';
import { LearningPhase } from '../../../types';
import PhaseIndicator from '../../PhaseIndicator';
import ConceptPhase from './ConceptPhase';
import LearnPhase from './LearnPhase';
import ExplorePhase from './ExplorePhase';
import PlayPhase from './PlayPhase';

interface Props { onComplete: () => void; }

export default function ReinforcementLearning({ onComplete }: Props) {
  const [currentPhase, setCurrentPhase] = useState<LearningPhase>('concept');
  const [completedPhases, setCompletedPhases] = useState<LearningPhase[]>([]);

  const handlePhaseComplete = (phase: LearningPhase) => {
    if (!completedPhases.includes(phase)) setCompletedPhases([...completedPhases, phase]);
    const phases: LearningPhase[] = ['concept', 'learn', 'explore', 'play'];
    const i = phases.indexOf(phase);
    if (i < phases.length - 1) setCurrentPhase(phases[i + 1]);
    else onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-lime-50 py-4 sm:py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <PhaseIndicator currentPhase={currentPhase} onPhaseChange={setCurrentPhase} completedPhases={completedPhases} />
        {currentPhase === 'concept' && <ConceptPhase onComplete={() => handlePhaseComplete('concept')} />}
        {currentPhase === 'learn' && <LearnPhase onComplete={() => handlePhaseComplete('learn')} />}
        {currentPhase === 'explore' && <ExplorePhase onComplete={() => handlePhaseComplete('explore')} />}
        {currentPhase === 'play' && <PlayPhase onComplete={() => handlePhaseComplete('play')} />}
      </div>
    </div>
  );
}
