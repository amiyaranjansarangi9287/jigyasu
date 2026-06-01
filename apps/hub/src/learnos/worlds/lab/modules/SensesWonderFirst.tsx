// src/worlds/lab/modules/SensesWonderFirst.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

const SENSES = [
  { id: 'sight' as const, emoji: '👁️', name: 'Sight', element: 'Fire', description: 'Detects light and color' },
  { id: 'hearing' as const, emoji: '👂', name: 'Hearing', element: 'Space', description: 'Detects sound vibrations' },
  { id: 'touch' as const, emoji: '✋', name: 'Touch', element: 'Air', description: 'Detects pressure and texture' },
  { id: 'taste' as const, emoji: '👅', name: 'Taste', element: 'Water', description: 'Detects flavors' },
  { id: 'smell' as const, emoji: '👃', name: 'Smell', element: 'Earth', description: 'Detects scents' },
];

// Exploration Component
function ExplorationComponent() {
  const [sense, setSense] = useState<'sight' | 'hearing' | 'touch' | 'taste' | 'smell'>('sight');
  const { language } = useLearnerStore();

  const handleSenseChange = useCallback((s: typeof sense) => {
    setSense(s);
    LearningService.trackEvent('senses-wonder-session', 'lab', language, 'sense_change', 'senses', { sense: s });
  }, [language]);

  const currentSense = SENSES.find(s => s.id === sense);

  return (
    <div className="space-y-6">
      {/* Sense selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {SENSES.map(s => (
          <button 
            key={s.id} 
            onClick={() => handleSenseChange(s.id)} 
            className={`px-4 py-3 rounded-xl font-bold transition ${sense === s.id ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}
          >
            <div className="text-xl">{s.emoji}</div>
            <div className="text-sm">{s.name}</div>
          </button>
        ))}
      </div>

      {/* Sense visualization */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="text-8xl mb-4">{currentSense?.emoji}</div>
          <div className="text-2xl font-bold text-slate-800 mb-2">{currentSense?.name}</div>
          <div className="text-sm text-slate-500 mb-2">{currentSense?.description}</div>
          <div className="text-xs text-pink-600 font-medium">Element: {currentSense?.element}</div>
        </div>
      </div>

      {/* Five senses explanation */}
      <div className="grid grid-cols-5 gap-2">
        {SENSES.map(s => (
          <div key={s.id} className={`p-3 rounded-xl text-center ${sense === s.id ? 'bg-pink-100' : 'bg-slate-50'}`}>
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="text-xs font-bold text-slate-700">{s.name}</div>
          </div>
        ))}
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          What do you notice?
        </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li>• How do your senses help you understand the world?</li>
          <li>• What happens when you close your eyes and rely on other senses?</li>
          <li>• Which sense do you use most in your daily life?</li>
          <li>• How do senses work together to give you a complete picture?</li>
        </ul>
      </div>
    </div>
  );
}

export default function SensesWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const sensesWonderModule: WonderFirstModule = {
    id: 'senses-wonder',
    mystery: {
      question: "How do we know what's happening around us? We see, hear, touch, taste, and smell - but how does our body actually detect these things? And why do we have exactly five senses?",
      visual: "👁️",
      hook: "We use our five senses every moment, but have you ever wondered how they actually work? What's happening inside your body when you see, hear, or touch something?",
    },
    exploration: {
      instructions: "Explore each of the five senses. What patterns do you notice about how they work? How do they help you understand the world around you?",
      hints: [
        "Start with sight. How do your eyes detect light?",
        "Try hearing. How do your ears detect sound?",
        "Explore touch, taste, and smell. How are they different?",
        "Think about how senses work together in daily life.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Our five senses are specialized detectors that convert physical stimuli into electrical signals our brain can understand! Sight detects light waves through our eyes, hearing detects sound vibrations through our ears, touch detects pressure through our skin, taste detects chemicals through our tongue, and smell detects airborne chemicals through our nose. Each sense has specialized cells (receptors) that respond to specific types of energy. These receptors send electrical signals to the brain, which combines them to create our perception of reality!",
      connection: "The mystery of how our senses work is solved: they're energy detectors! The key insight is that each sense converts a different type of physical energy into electrical signals the brain can process. Light becomes sight, sound becomes hearing, pressure becomes touch, chemicals become taste and smell. Our brain combines these signals to create our complete experience of the world. This is why losing one sense can enhance others - the brain adapts to use the available information more effectively!",
      ahaMoment: "Senses convert physical energy into electrical signals - our brain combines these signals to create our perception of reality!",
    },
    application: {
      realWorld: "We use our five senses every moment to navigate the world. Understanding how they work helps us appreciate our body's complexity, protect our health (like protecting our hearing from loud noises), and even design better technology (like cameras that mimic human vision).",
      indianContext: "Indian philosophy describes 5 Indriyas (senses) connected to 5 elements: sight→fire, hearing→space, touch→air, taste→water, smell→earth. The Tanmatras (subtle elements) theory maps senses to atomic properties - remarkably aligned with modern neuroscience! Ayurveda, the ancient Indian medical system, uses this understanding to diagnose and treat imbalances. The Sushruta Samhita (600 BCE) described the anatomy of sensory organs with remarkable accuracy. Indian classical music uses the connection between hearing and emotion for healing and meditation.\n\n🎨 **Holi Connection**: Holi is a festival that engages all five senses! Sight (vibrant colors), hearing (music and laughter), touch (playing with colors), taste (sweets and festive foods), and smell (flowers, incense, and traditional foods). The festival's sensory richness celebrates the joy of experiencing the world through all our senses.\n\n🌾 **Pongal Connection**: Pongal engages the senses in celebration of harvest. Sight (decorations and kolam patterns), hearing (traditional music and celebrations), touch (preparing Pongal dish), taste (sweet Pongal rice), and smell (aromas of cooking and flowers). The festival reminds us that our senses connect us to the cycles of nature and the joy of harvest.\n\n👨‍🔬 **Sushruta (600 BCE)** - Ancient Indian surgeon who described the anatomy of sensory organs in the Sushruta Samhita with remarkable accuracy.\n\n👨‍🔬 **Charaka (300 BCE)** - Author of the Charaka Samhita, described the connection between senses, elements, and health in Ayurveda.\n\n👨‍🔬 **Jagadish Chandra Bose (1858-1937)** - Pioneered research on plant responses to stimuli, showing that plants have sensory-like capabilities.\n\n👨‍🔬 **V. Ramalingaswami (1921-2001)** - Renowned Indian physician who studied sensory physiology and its connection to health.",
      tryIt: "Next time you're eating, walking, or just sitting, pay attention to all five senses. What do you see, hear, feel, taste, and smell? And remember: your senses are converting physical energy into electrical signals that your brain combines to create your experience of reality. You're not just experiencing the world - you're actively constructing it through your senses!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={sensesWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
