// src/worlds/lab/modules/ShapesWonderFirst.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

const SHAPES = [
  { id: 'triangle' as const, emoji: '🔺', name: 'Triangle', sides: 3 },
  { id: 'square' as const, emoji: '🟦', name: 'Square', sides: 4 },
  { id: 'pentagon' as const, emoji: '⬠', name: 'Pentagon', sides: 5 },
  { id: 'hexagon' as const, emoji: '⬡', name: 'Hexagon', sides: 6 },
  { id: 'circle' as const, emoji: '🟡', name: 'Circle', sides: 0 },
];

// Exploration Component
function ExplorationComponent() {
  const [shape, setShape] = useState<'triangle' | 'square' | 'pentagon' | 'hexagon' | 'circle'>('triangle');
  const [showAngles, setShowAngles] = useState(true);
  const { language } = useLearnerStore();

  const handleShapeChange = useCallback((s: typeof shape) => {
    setShape(s);
    LearningService.trackEvent('shapes-wonder-session', 'lab', language, 'shape_change', 'shapes', { shape: s });
  }, [language]);

  const toggleAngles = useCallback(() => setShowAngles(p => !p), []);

  const currentShape = SHAPES.find(s => s.id === shape);

  return (
    <div className="space-y-6">
      {/* Shape Selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {SHAPES.map(s => (
          <button 
            key={s.id} 
            onClick={() => handleShapeChange(s.id)} 
            className={`px-4 py-3 rounded-xl font-bold transition ${shape === s.id ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
          >
            <div className="text-xl">{s.emoji}</div>
            <div className="text-sm">{s.name}</div>
          </button>
        ))}
      </div>

      {/* Shape Visualization */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="flex justify-center mb-4">
          <div className="text-8xl">{currentShape?.emoji}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-800 mb-2">{currentShape?.name}</div>
          <div className="text-sm text-slate-500">
            {currentShape?.sides === 0 ? 'No straight sides - infinite angles!' : `${currentShape?.sides} sides, ${currentShape?.sides} angles`}
          </div>
        </div>
      </div>

      {/* Angle Toggle */}
      <button 
        onClick={toggleAngles} 
        className="w-full px-4 py-3 rounded-xl bg-purple-100 text-purple-700 text-sm font-medium hover:bg-purple-200 transition"
      >
        {showAngles ? '📐 Show Angles' : '📐 Hide Angles'}
      </button>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          What do you notice?
        </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li>• How many sides does each shape have?</li>
          <li>• What happens to the angles as you add more sides?</li>
          <li>• What's special about the circle?</li>
          <li>• Can you find these shapes in real life?</li>
        </ul>
      </div>
    </div>
  );
}

export default function ShapesWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const shapesWonderModule: WonderFirstModule = {
    id: 'shapes-wonder',
    mystery: {
      question: "Why do triangles have 3 sides and squares have 4? What makes a shape a shape? And what about circles - do they have sides at all?",
      visual: "🔷",
      hook: "Shapes are everywhere, but have you ever wondered what makes a triangle different from a square? What's the pattern behind shapes?",
    },
    exploration: {
      instructions: "Explore different shapes and count their sides and angles. What patterns do you notice as you add more sides? What makes the circle special?",
      hints: [
        "Start with the triangle. Count its sides and angles.",
        "Move to the square. How is it different from the triangle?",
        "Try the pentagon and hexagon. What pattern do you see?",
        "What about the circle? Does it follow the same pattern?",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Shapes are defined by their sides and angles! A triangle has 3 sides and 3 angles, a square has 4 sides and 4 angles, and so on. The more sides a shape has, the more angles it has, and the closer it gets to becoming a circle. A circle is special - it has no straight sides and infinite angles! It's the limit of adding more and more sides to a polygon.",
      connection: "The mystery of what makes shapes different is solved: it's all about sides and angles! The pattern is clear: 3 sides = triangle, 4 sides = square, 5 sides = pentagon, and so on. The circle breaks the pattern by having no straight sides at all - it's the perfect shape with infinite angles. This is why circles roll smoothly while polygons don't!",
      ahaMoment: "Shapes are defined by their sides and angles - the circle is the limit of adding more sides, becoming perfectly smooth!",
    },
    application: {
      realWorld: "We use shapes every day: architecture (buildings), engineering (bridges), art (design), and nature (flowers, honeycombs). Understanding shapes helps us build, design, and understand the world around us.",
      indianContext: "The Sulba Sutras (800-500 BCE) contain geometry rules for building sacred fire altars - including the Pythagorean theorem 1,000 years before Pythagoras! Baudhayana described constructing squares, circles, and triangles with precision. Ancient Indian architects used geometry to build temples, palaces, and cities. Rangoli patterns during festivals use geometric shapes to create beautiful designs!\n\n🪔 **Diwali Connection**: During Diwali, families create rangoli patterns using geometric shapes - circles, triangles, squares, and more. These patterns are made with colored powders, rice, or flowers. The festival teaches us that geometry is not just abstract - it's a beautiful art form that brings joy to our homes!\n\n🎨 **Holi Connection**: Holi celebrations often include creating colorful patterns on the ground using different shapes. The vibrant colors and geometric designs reflect the festival's spirit of creativity and joy. The festival reminds us that shapes and colors together create beautiful art.\n\n🌾 **Pongal Connection**: Pongal kolam designs are geometric patterns drawn with rice flour at the entrance of homes. These patterns use circles, squares, and triangles to create intricate designs that welcome prosperity. The festival teaches us that geometry has both practical and spiritual significance in Indian culture.\n\n👨‍🔬 **Baudhayana (800 BCE)** - Author of the Sulba Sutras, described the Pythagorean theorem and methods for constructing squares, circles, and triangles with precision - 1,000 years before Pythagoras!\n\n👨‍🔬 **Aryabhata (476-550 CE)** - Worked with geometry and trigonometry, calculating the value of π and describing methods for constructing geometric shapes.\n\n👨‍🔬 **Bhaskara II (1114-1185 CE)** - In his work Lilavati, he explained geometry through practical problems involving areas and perimeters of shapes.\n\n👨‍🔬 **Srinivasa Ramanujan (1887-1920)** - Mathematical genius who discovered patterns in geometry and number theory, showing the beauty hidden in mathematical shapes.",
      tryIt: "Next time you see a building, a flower, or a pattern, look for the shapes. How many sides does it have? What angles can you find? And remember: shapes are everywhere - from the triangles in bridges to the circles in wheels, geometry is the language of our world!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={shapesWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
