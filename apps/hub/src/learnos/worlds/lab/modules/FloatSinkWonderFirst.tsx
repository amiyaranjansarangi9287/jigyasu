// src/worlds/lab/modules/FloatSinkWonderFirst.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

const TEST_OBJECTS = [
  { id: 'wood', name: 'Wood', emoji: '🪵', density: 0.6 },
  { id: 'stone', name: 'Stone', emoji: '🪨', density: 2.5 },
  { id: 'leaf', name: 'Leaf', emoji: '🍃', density: 0.3 },
  { id: 'coin', name: 'Coin', emoji: '🪙', density: 7.8 },
  { id: 'apple', name: 'Apple', emoji: '🍎', density: 0.8 },
  { id: 'key', name: 'Key', emoji: '🔑', density: 7.5 },
  { id: 'cork', name: 'Cork', emoji: '🍾', density: 0.2 },
  { id: 'ball', name: 'Rubber Ball', emoji: '⚽', density: 0.9 },
];

// Exploration Component
function ExplorationComponent() {
  const [objects, setObjects] = useState(
    TEST_OBJECTS.map(o => ({ ...o, dropped: false }))
  );
  const { language } = useLearnerStore();

  const handleDrop = useCallback((id: string) => {
    setObjects(prev => prev.map(o => o.id === id ? { ...o, dropped: true } : o));
    const obj = TEST_OBJECTS.find(o => o.id === id);
    LearningService.trackEvent('float-sink-wonder-session', 'lab', language, 'canvas_interaction', 'float-sink', { objectId: id, density: obj?.density });
  }, [language]);

  const handleReset = useCallback(() => {
    setObjects(TEST_OBJECTS.map(o => ({ ...o, dropped: false })));
  }, []);

  const floats = objects.filter(o => o.dropped && o.density < 1).length;
  const sinks = objects.filter(o => o.dropped && o.density >= 1).length;

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="flex justify-center gap-4">
        <div className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-bold text-sm">
          ✓ Floats: {floats}
        </div>
        <div className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-bold text-sm">
          ✗ Sinks: {sinks}
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-300 transition"
        >
          🔄 Reset
        </button>
      </div>

      {/* Water tank visualization */}
      <div className="bg-blue-100 rounded-2xl p-6 border-4 border-blue-300">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🌊</div>
          <div className="text-sm text-blue-600 font-bold">Water Tank (Density = 1.0)</div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {objects.map((obj) => (
            <div
              key={obj.id}
              className={`py-3 rounded-xl text-sm font-medium transition ${
                obj.dropped
                  ? obj.density < 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  : 'bg-white text-slate-700'
              }`}
            >
              <div className="text-2xl mb-1">{obj.emoji}</div>
              <div>{obj.name}</div>
              <div className="text-sm text-slate-400 mt-1">ρ={obj.density}</div>
              {obj.dropped && (
                <div className="text-xs mt-1 font-bold">
                  {obj.density < 1 ? '⬆️ Floats' : '⬇️ Sinks'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Object buttons */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="grid grid-cols-4 gap-3">
          {objects.map((obj) => (
            <button
              key={obj.id}
              onClick={() => !obj.dropped && handleDrop(obj.id)}
              disabled={obj.dropped}
              className={`py-3 rounded-xl text-sm font-medium transition ${
                obj.dropped
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'
              }`}
            >
              <div className="text-2xl mb-1">{obj.emoji}</div>
              <div>{obj.name}</div>
              <div className="text-sm text-slate-400 mt-1">ρ={obj.density}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 rounded-2xl p-5 text-center">
        <div className="text-sm text-blue-600 font-bold">
          Density &lt; 1.0 = Floats • Density &gt; 1.0 = Sinks
        </div>
        <div className="text-sm text-blue-400 mt-2">
          Water has density = 1.0. Objects lighter than water float!
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          What do you notice?
        </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li>• Which objects float and which sink?</li>
          <li>• What pattern do you see in the density numbers?</li>
          <li>• Can you predict if an object will float before dropping it?</li>
          <li>• What would happen if you changed the liquid (not water)?</li>
        </ul>
      </div>
    </div>
  );
}

export default function FloatSinkWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const floatSinkWonderModule: WonderFirstModule = {
    id: 'float-sink-wonder',
    mystery: {
      question: "Why does a huge steel ship float while a tiny stone sinks? And how can a cork float but a coin sink even though they're both small?",
      visual: "🌊",
      hook: "We see things float and sink every day, but have you ever wondered what makes the difference? Is it size? Weight? Or something else?",
    },
    exploration: {
      instructions: "Explore what happens when you drop different objects in water. What patterns do you notice about which objects float and which sink? Can you predict what will happen?",
      hints: [
        "Drop the wood. Does it float or sink?",
        "Try the stone. What's different?",
        "Look at the density numbers. Is there a pattern?",
        "Think about real-life examples - ships, boats, balloons.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Whether something floats or sinks depends on its density compared to water! Density is how much mass something has in a given volume. Water has a density of 1.0. If an object's density is less than 1.0, it floats because it's lighter than the water it displaces. If it's greater than 1.0, it sinks because it's heavier. This is why a huge steel ship floats - it's mostly empty space inside, so its overall density is less than water! And this is why a tiny stone sinks - it's solid and denser than water.",
      connection: "The mystery of what makes things float or sink is solved: it's all about density! The key insight is that it's not about size or weight alone - it's about how tightly packed the material is. A huge ship floats because it's mostly air (low density), while a tiny stone sinks because it's solid (high density). This is why we can build massive ships that carry thousands of tons - they're designed to have an overall density less than water!",
      ahaMoment: "Float or sink depends on density - not size or weight! If something is less dense than water, it floats; if more dense, it sinks.",
    },
    application: {
      realWorld: "We see buoyancy every day: ships, boats, submarines, balloons, and even swimming. Understanding density helps us design vessels that float, predict if something will sink, and even understand how fish control their depth. It's why life jackets work - they're less dense than water!",
      indianContext: "Indians built ships using buoyancy principles 4,000 years ago! The Lothal dockyard (2400 BCE) in Gujarat is the world's oldest known tidal dock. Ancient shipbuilders knew which woods floated - teak (ρ=0.6) and bamboo (ρ=0.4) were preferred. The Chola dynasty built massive ships that could carry 1,000 people across oceans using these principles. Even today, traditional Indian boat builders in Kerala use ancient knowledge of density and buoyancy to craft fishing boats that withstand rough seas.\n\n🌾 **Pongal Connection**: Pongal celebrates the harvest season when farmers depend on water for irrigation. Understanding buoyancy helps in building boats for fishing and transportation in water-rich regions. The festival reminds us that water is not just essential for crops - it's also a medium for transportation and trade, made possible by understanding density and buoyancy.\n\n🎨 **Holi Connection**: In some regions of India, Holi celebrations include floating lamps on rivers and ponds. These lamps float because they're designed with materials less dense than water - often using flowers, leaves, and lightweight oils. The festival's use of floating lights celebrates the triumph of good over evil, with the lights symbolizing hope floating above darkness.\n\n👨‍🔬 **Ancient Indian Shipbuilders (2000 BCE)** - Built the world's oldest tidal dock at Lothal, demonstrating advanced understanding of buoyancy and density principles.\n\n👨‍🔬 **Bhaskara II (1114-1185 CE)** - Described buoyancy principles and explained why objects float or sink, anticipating Archimedes' principle.\n\n👨‍🔬 **M.S. Swaminathan (born 1925)** - Worked on water management and irrigation, understanding density principles for agricultural water systems.\n\n👨‍🔬 **A.P.J. Abdul Kalam (1931-2015)** - Scientist and President who worked on naval technology and emphasized the importance of understanding buoyancy for shipbuilding.",
      tryIt: "Next time you're near water, try dropping different things - leaves, sticks, coins, paper. What floats and what sinks? And remember: it's not about size or weight - it's about density! A huge ship floats because it's mostly air, while a tiny stone sinks because it's solid and dense.",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={floatSinkWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
