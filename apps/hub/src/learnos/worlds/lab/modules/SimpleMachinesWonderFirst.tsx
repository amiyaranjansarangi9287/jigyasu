// src/worlds/lab/modules/SimpleMachinesWonderFirst.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

const MACHINES = [
  { id: 'lever' as const, emoji: '🔧', name: 'Lever', description: 'Lifts heavy loads with less effort' },
  { id: 'ramp' as const, emoji: '📐', name: 'Ramp', description: 'Moves things up gradually' },
  { id: 'wheel' as const, emoji: '☸️', name: 'Wheel', description: 'Reduces friction and makes moving easier' },
  { id: 'pulley' as const, emoji: '🪢', name: 'Pulley', description: 'Changes direction of force' },
];

// Exploration Component
function ExplorationComponent() {
  const [machine, setMachine] = useState<'lever' | 'wheel' | 'ramp' | 'pulley'>('lever');
  const [effortLevel, setEffortLevel] = useState(50);
  const { language } = useLearnerStore();

  const handleMachineChange = useCallback((m: typeof machine) => {
    setMachine(m);
    LearningService.trackEvent('simple-machines-wonder-session', 'lab', language, 'machine_change', 'simple-machines', { machine: m });
  }, [language]);

  const handleEffortChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setEffortLevel(val);
    LearningService.trackEvent('simple-machines-wonder-session', 'lab', language, 'effort_change', 'simple-machines', { effort: val });
  }, [language]);

  const currentMachine = MACHINES.find(m => m.id === machine);

  return (
    <div className="space-y-6">
      {/* Machine Selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {MACHINES.map(m => (
          <button 
            key={m.id} 
            onClick={() => handleMachineChange(m.id)} 
            className={`px-4 py-3 rounded-xl font-bold transition ${machine === m.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          >
            <div className="text-xl">{m.emoji}</div>
            <div className="text-sm">{m.name}</div>
          </button>
        ))}
      </div>

      {/* Machine Visualization */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-center mb-4">
          <div className="text-8xl">{currentMachine?.emoji}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-800 mb-2">{currentMachine?.name}</div>
          <div className="text-sm text-slate-500">{currentMachine?.description}</div>
        </div>
      </div>

      {/* Effort Control */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-slate-400"><Trans i18nKey="auto.simplemachineswonderfirst.effort">💪 Effort</Trans></span>
          <span className="text-sm font-medium text-blue-600">{effortLevel}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={effortLevel} 
          onChange={handleEffortChange} 
          className="w-full h-3 rounded-full appearance-none cursor-pointer" 
          style={{ background: 'linear-gradient(to right, #3B82F6, #1D4ED8)' }} 
        />
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.simplemachineswonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.simplemachineswonderfirst.how_does_each_machine_make_wor">• How does each machine make work easier?</Trans></li>
          <li><Trans i18nKey="auto.simplemachineswonderfirst.what_happens_when_you_increase">• What happens when you increase the effort?</Trans></li>
          <li><Trans i18nKey="auto.simplemachineswonderfirst.can_you_find_these_machines_in">• Can you find these machines in real life?</Trans></li>
          <li><Trans i18nKey="auto.simplemachineswonderfirst.what_would_happen_without_simp">• What would happen without simple machines?</Trans></li>
        </ul>
      </div>
    </div>
  );
}

export default function SimpleMachinesWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const simpleMachinesWonderModule: WonderFirstModule = {
    id: 'simple-machines-wonder',
    mystery: {
      question: "How did ancient Egyptians move 2.5-ton stone blocks without modern cranes? And how can a small child lift a heavy object using a simple tool?",
      visual: "⚙️",
      hook: "We use machines every day, but have you ever wondered how they make work easier? What's the secret behind simple machines?",
    },
    exploration: {
      instructions: "Explore different simple machines and see how they reduce the effort needed to do work. What patterns do you notice about how they work?",
      hints: [
        "Try the lever. How does it help lift heavy things?",
        "Experiment with the ramp. What happens when you make it longer?",
        "What about the wheel and pulley? How do they help?",
        "Think about real-life examples - seesaws, ramps, cranes.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Simple machines don't create energy - they multiply force! A lever lets you trade distance for force: you move a longer distance with less effort to lift a heavy load a shorter distance. A ramp does the same by spreading the work over a longer distance. Wheels reduce friction, and pulleys change the direction of force. The key insight is that work = force × distance, and simple machines let you trade one for the other. You can't do less work, but you can do it with less force by applying it over a longer distance!",
      connection: "The mystery of how machines make work easier is solved: they trade distance for force! The key insight is that simple machines don't reduce the total work needed - they just let you apply less force over a longer distance. This is why a longer ramp is easier than a steep one, and why a lever with a long arm can lift heavy loads. The trade-off is always the same: less force means more distance, and more force means less distance. This is the fundamental principle behind all machines!",
      ahaMoment: "Simple machines trade distance for force - you can't do less work, but you can do it with less effort by applying it over a longer distance!",
    },
    application: {
      realWorld: "We use simple machines every day: seesaws (levers), ramps (inclined planes), wheels and axles (cars), pulleys (cranes), and screws (jar lids). Understanding simple machines helps us build tools, design buildings, and solve engineering problems.",
      indianContext: "Ancient Indians used simple machines to build monumental structures 4,000 years ago! The Brihadeeswarar Temple (1010 CE) has an 80-ton capstone lifted using ramps and levers - an engineering marvel still studied today. The Indus Valley Civilization (2600 BCE) used wells with pulleys for water. Stepwells like Chand Baori (800 CE) used ramps and pulleys to access water. Indian craftsmen used simple machines in textile production, metalworking, and construction. Even today, traditional Indian tools like the kolhu (oil press) use simple machine principles!\n\n🎨 **Holi Connection**: Holi celebrations often involve using pulleys to hoist water buckets for playing with colors. The festival's use of simple machines reminds us that engineering is part of our cultural celebrations. The festival teaches us that making work easier through machines is not just practical - it's part of how we celebrate joyfully.\n\n🌾 **Pongal Connection**: Pongal harvest celebrations involve using simple machines to process crops. Traditional tools like the uruli (cooking vessel) and kolam (patterns) use principles of simple machines. Farmers use levers, ramps, and pulleys in agriculture - from lifting water to moving harvest. The festival reminds us that simple machines are the foundation of agriculture and food production.\n\n👨‍🔬 **Baudhayana (800 BCE)** - Described construction techniques using simple machines in the Sulba Sutras, showing ancient Indian engineering knowledge.\n\n👨‍🔬 **Bhaskara II (1114-1185 CE)** - In his work, he described mechanical devices and simple machines, including levers and pulleys.\n\n👨‍🔬 **M.S. Swaminathan (born 1925)** - Worked on agricultural engineering, using simple machine principles to improve farming tools and techniques.\n\n👨‍🔬 **A.P.J. Abdul Kalam (1931-2015)** - Scientist and President who emphasized the importance of understanding simple machines as the foundation of engineering and technology.",
      tryIt: "Next time you use a seesaw, climb a ramp, or turn a doorknob, remember: you're using a simple machine! Think about how it's trading distance for force to make work easier. And remember: simple machines are the building blocks of all complex machines - from bicycles to rockets, they all start with these basic principles!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={simpleMachinesWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
