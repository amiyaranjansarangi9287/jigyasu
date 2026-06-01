// src/worlds/lab/modules/NumberLineWonderFirst.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

// Exploration Component
function ExplorationComponent() {
  const [position, setPosition] = useState(0);
  const [targetPosition, setTargetPosition] = useState(5);
  const [showJumps, setShowJumps] = useState(true);
  const { language } = useLearnerStore();

  const handleTargetChange = useCallback((val: number) => {
    setTargetPosition(val);
    setPosition(0);
    LearningService.trackEvent('number-line-wonder-session', 'lab', language, 'target_change', 'number-line', { target: val });
  }, [language]);

  const toggleJumps = useCallback(() => setShowJumps(p => !p), []);

  const distance = Math.abs(targetPosition - position);

  return (
    <div className="space-y-6">
      {/* Target Selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {[-10, -5, 0, 5, 10].map(n => (
          <button 
            key={n} 
            onClick={() => handleTargetChange(n)} 
            className={`px-4 py-3 rounded-xl font-bold transition ${targetPosition === n ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Number Line Visualization */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="relative h-24 flex items-center">
          <div className="absolute left-0 right-0 h-1 bg-slate-300 top-1/2 transform -translate-y-1/2"></div>
          <div className="absolute left-0 right-0 flex justify-between">
            {[-10, -5, 0, 5, 10].map(n => (
              <div key={n} className="relative flex flex-col items-center">
                <div className="w-0.5 h-3 bg-slate-400 -mb-1"></div>
                <span className="text-sm font-bold text-slate-600">{n}</span>
              </div>
            ))}
          </div>
          <div 
            className="absolute h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300"
            style={{ left: `${((position + 10) / 20) * 100}%`, transform: 'translateX(-50%)' }}
          >
            🦘
          </div>
        </div>
        <div className="text-center mt-4">
          <div className="text-2xl font-bold text-blue-600">
            {position} → {targetPosition}
          </div>
          <div className="text-sm text-slate-500">
            Distance: {distance} {distance === 1 ? 'jump' : 'jumps'}
          </div>
        </div>
      </div>

      {/* Jump Toggle */}
      <button 
        onClick={toggleJumps} 
        className="w-full px-4 py-3 rounded-xl bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 transition"
      >
        {showJumps ? '🦘 Show Jumps' : '🦘 Hide Jumps'}
      </button>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          What do you notice?
        </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li>• What happens when you go from 0 to 5? How many jumps?</li>
          <li>• What about going from 0 to -5? How is it different?</li>
          <li>• What's the distance between -5 and 5?</li>
          <li>• Can you reach negative numbers by jumping left?</li>
        </ul>
      </div>
    </div>
  );
}

export default function NumberLineWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const numberLineWonderModule: WonderFirstModule = {
    id: 'number-line-wonder',
    mystery: {
      question: "If you start at 0 and jump 5 steps to the right, you reach 5. But what if you jump 5 steps to the left? Where do you end up? And what does 'negative' really mean?",
      visual: "📏",
      hook: "We use numbers every day, but have you ever wondered what negative numbers actually represent? What's below zero?",
    },
    exploration: {
      instructions: "Explore what happens when you jump to different positions on the number line. What patterns do you notice about positive and negative numbers? How do they relate to each other?",
      hints: [
        "Try jumping from 0 to 5. How many steps did you take?",
        "Now try jumping from 0 to -5. How is it different?",
        "What's the distance between -5 and 5?",
        "Think about real-life examples - temperature below freezing, debt below zero.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Negative numbers are not 'less than nothing' - they represent quantities in the opposite direction! On a number line, positive numbers go to the right (forward) and negative numbers go to the left (backward). Zero is the starting point, not the end. The distance from 0 to 5 is the same as from 0 to -5 - they're equal in magnitude, just in opposite directions. This is why -5 is not 'less than nothing' - it's 5 units in the opposite direction!",
      connection: "The mystery of what negative numbers mean is solved: they represent opposite directions! The key insight is that numbers can go both ways from zero - positive in one direction, negative in the opposite. This is why we can have temperatures below zero, debts below zero, and positions below ground level. Negative numbers are just as real as positive numbers - they just point in the opposite direction!",
      ahaMoment: "Negative numbers represent opposite directions - they're not 'less than nothing,' they're quantities going the other way from zero!",
    },
    application: {
      realWorld: "We use negative numbers every day: temperature (below freezing), money (debt), elevation (below sea level), and sports (golf scores). Understanding negative numbers helps us measure and compare quantities that go below zero.",
      indianContext: "India gave the world zero and negative numbers! Brahmagupta (628 CE) defined rules for negative numbers, calling them 'debt' (रिण) vs 'fortune' (धन). He explained that debt minus debt is zero, and fortune minus debt is the difference. Ancient Indian mathematicians understood the number line concept with negatives 1,000 years before Europe! In Indian markets, we still use negative concepts - 'karz' (debt) and 'udhaar' (credit).\n\n🌾 **Pongal Connection**: Pongal celebrates the harvest season when temperatures can dip below freezing in some parts of India. Understanding negative temperatures helps farmers protect their crops from frost. The festival reminds us that numbers can go below zero - just as winter temperatures can go below freezing, our fortunes can also dip and rise with the seasons.\n\n👨‍🔬 **Brahmagupta (598-668 CE)** - Defined rules for negative numbers 1,000 years before European mathematicians, calling them 'debt' vs 'fortune' and explaining how to perform arithmetic with them.\n\n👨‍🔬 **Aryabhata (476-550 CE)** - Worked with zero and place value system, understanding that numbers can represent quantities below zero.\n\n👨‍🔬 **Bhaskara II (1114-1185 CE)** - In his work Lilavati, he explained negative numbers through practical problems involving debt and credit.\n\n👨‍🔬 **Srinivasa Ramanujan (1887-1920)** - Mathematical genius who worked with negative numbers in his discoveries in number theory.",
      tryIt: "Next time you see a temperature below zero, a debt, or a score below par, remember: it's not 'less than nothing' - it's a quantity in the opposite direction! And the distance from zero is the same whether you go positive or negative - they're equal in magnitude, just opposite in direction!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={numberLineWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
