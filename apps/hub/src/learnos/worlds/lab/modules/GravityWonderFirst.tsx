// src/worlds/lab/modules/GravityWonderFirst.tsx
// Wonder-First Redesign of Gravity Module
// Mission Alignment: Wonder Value - "We begin with questions, not answers"

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import GravityCanvas from './GravityCanvas';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

export default function GravityWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [mass, setMass] = useState(50);
  const [rotationSpeed, setRotationSpeed] = useState(50);
  const [showNewton, setShowNewton] = useState(true);
  const connectionOptimization = useConnectionOptimization();

  const handleMassChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMass(val);
    LearningService.trackEvent(
      'gravity-wonder-session',
      'lab',
      language,
      'canvas_interaction',
      'gravity',
      { mass: val, rotation: rotationSpeed, view: showNewton ? 'newton' : 'einstein' }
    );
  }, [language, rotationSpeed, showNewton]);

  const handleRotationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setRotationSpeed(val);
    LearningService.trackEvent(
      'gravity-wonder-session',
      'lab',
      language,
      'canvas_interaction',
      'gravity',
      { mass, rotation: val, view: showNewton ? 'newton' : 'einstein' }
    );
  }, [language, mass, showNewton]);

  const toggleView = useCallback(() => {
    setShowNewton(prev => !prev);
  }, []);

  // Interactive exploration component
  const ExplorationComponent = (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="bg-slate-800/50 rounded-3xl shadow-sm border border-slate-700/50 p-4">
        <GravityCanvas mass={mass} showNewton={showNewton} />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mass slider */}
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">🌑 Small mass</span>
            <span className="text-sm text-slate-400">☀️ Large mass</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={mass}
            onChange={handleMassChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #6366F1 0%, #8B5CF6 50%, #F59E0B 100%)`,
            }}
          />
          <div className="text-center mt-2 text-sm text-slate-400">
            Mass: {mass}
          </div>
        </div>

        {/* Rotation speed slider */}
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">🐢 Slow rotation</span>
            <span className="text-sm text-slate-400">🚀 Fast rotation</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={rotationSpeed}
            onChange={handleRotationChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #10B981 0%, #3B82F6 50%, #EF4444 100%)`,
            }}
          />
          <div className="text-center mt-2 text-sm text-slate-400">
            Rotation: {rotationSpeed}
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex justify-center">
        <button
          onClick={toggleView}
          className="px-5 py-2 rounded-xl bg-indigo-600/30 text-indigo-200 text-sm font-medium hover:bg-indigo-600/50 transition"
        >
          {showNewton ? '🍎 Newton: Force' : '🌊 Einstein: Curved Space'}
        </button>
      </div>

      {/* Observation prompts */}
      <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200">
        <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          What do you notice?
        </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li>• What happens when you increase the mass?</li>
          <li>• What happens when you increase the rotation speed?</li>
          <li>• What happens when you change both together?</li>
          <li>• How does the Newton view differ from Einstein view?</li>
        </ul>
      </div>
    </div>
  );

  // Wonder-First module configuration
  const gravityWonderModule: WonderFirstModule = {
    id: 'gravity-wonder',
    mystery: {
      question: "If Earth is spinning at 1,670 km/h at the equator, why don't we fly off into space?",
      visual: "🌍",
      hook: "It seems impossible. How can we stay on something moving that fast?",
    },
    exploration: {
      instructions: "Explore what happens when you change Earth's mass and rotation speed. Observe how objects behave. Try the Newton and Einstein views. What patterns do you notice?",
      hints: [
        "Try slowing down Earth's rotation to the minimum. What happens to objects?",
        "Now increase Earth's mass to the maximum. Does that change anything?",
        "What if both rotation and mass are at maximum? What happens then?",
        "Switch between Newton and Einstein views. How do they explain the same phenomenon differently?",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Gravity isn't a force pulling things down. It's the curvature of spacetime caused by mass. The more massive an object, the more it curves spacetime around it. Objects follow these curves like a marble rolling on a curved surface.",
      connection: "Earth's massive size curves spacetime so much that we're constantly 'falling' toward it. But because we're also moving sideways (due to Earth's rotation), we keep missing the ground - which is why we stay on the surface instead of flying off! The faster the rotation, the more sideways speed we have, which helps us stay on the curved surface.",
      ahaMoment: "We're not being pulled down by a mysterious force - we're following the curves in the fabric of space and time itself!",
    },
    application: {
      realWorld: "This is why satellites stay in orbit - they're constantly falling around Earth, moving sideways fast enough to miss it. It's also why the Moon doesn't crash into Earth - it's falling around us forever. Even astronauts in the ISS are falling around Earth, which is why they float!",
      indianContext: "ISRO's satellites use this same principle. When Chandrayaan-3 orbited the Moon, it was following the Moon's gravitational curves. Indian scientists have made remarkable contributions to understanding gravity:\n\n👨‍🔬 **Aryabhata (499 CE)** - Described gravity as a natural attraction called 'Gurutva' (गुरुत्व) - 1,100 years before Newton! He explained that Earth holds objects down due to this force.\n\n👨‍🔬 **Bhaskaracharya II (1114-1185 CE)** - In his work Siddhanta Shiromani, he described gravitational force and how planets are held in their orbits by an attractive force.\n\n👨‍🔬 **C.V. Raman (1888-1970)** - Nobel laureate who studied how light and gravity interact in space, contributing to our understanding of gravitational effects on light.\n\n👨‍🔬 **Satyendra Nath Bose (1894-1974)** - His work on quantum statistics helped Einstein develop his theory of gravity, showing how Indian scientists contributed to modern gravitational theory.",
      tryIt: "Next time you see a satellite in the night sky, remember: it's not being held up by anything - it's falling around Earth, forever curious about our planet. And you're doing the same thing right now - falling around Earth while exploring the universe!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={gravityWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
