import { useState } from 'react';
import { LearningPhase } from '../../../types';
import PhaseIndicator from '../../PhaseIndicator';
import ConceptPhase from './ConceptPhase';
import LearnPhase from './LearnPhase';
import ExplorePhase from './ExplorePhase';
import PlayPhase from './PlayPhase';

interface PromptEngineeringProps {
  onComplete: () => void;
}

export default function PromptEngineering({ onComplete }: PromptEngineeringProps) {
  const [currentPhase, setCurrentPhase] = useState<LearningPhase>('concept');
  const [completedPhases, setCompletedPhases] = useState<LearningPhase[]>([]);

  const handlePhaseComplete = (phase: LearningPhase) => {
    if (!completedPhases.includes(phase)) {
      setCompletedPhases([...completedPhases, phase]);
    }
    
    const phases: LearningPhase[] = ['concept', 'learn', 'explore', 'play'];
    const currentIndex = phases.indexOf(phase);
    
    if (currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1]);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-orange-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <PhaseIndicator
          currentPhase={currentPhase}
          onPhaseChange={setCurrentPhase}
          completedPhases={completedPhases}
        />
        
        {currentPhase === 'concept' && (
          <ConceptPhase onComplete={() => handlePhaseComplete('concept')} />
        )}
        {currentPhase === 'learn' && (
          <LearnPhase onComplete={() => handlePhaseComplete('learn')} />
        )}
        {currentPhase === 'explore' && (
          <ExplorePhase onComplete={() => handlePhaseComplete('explore')} />
        )}
        {currentPhase === 'play' && (
          <PlayPhase onComplete={() => handlePhaseComplete('play')} />
        )}
      </div>
    </div>
  );
}
