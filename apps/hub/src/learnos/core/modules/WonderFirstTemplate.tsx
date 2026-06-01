// src/core/modules/WonderFirstTemplate.tsx
// Wonder-First Content Design Template
// Mission Alignment: Wonder Value - "We begin with questions, not answers"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '@jigyasu/ui';
import { useConnectionOptimization } from '../../../hooks/useConnectionOptimization';
import WhatsAppShare from '../../../components/WhatsAppShare';

export interface WonderFirstModule {
  id: string;
  mystery: {
    question: string;
    visual: string;
    hook: string;
  };
  exploration: {
    component: React.ReactElement | (() => React.ReactElement);
    instructions: string;
    hints: string[];
  };
  insight: {
    revelation: string;
    connection: string;
    ahaMoment: string;
  };
  application: {
    realWorld: string;
    indianContext: string;
    tryIt: string;
  };
}

interface WonderFirstTemplateProps {
  module: WonderFirstModule;
  onComplete?: () => void;
}

export default function WonderFirstTemplate({ module, onComplete }: WonderFirstTemplateProps) {
  const [phase, setPhase] = useState<'mystery' | 'exploration' | 'insight' | 'application'>('mystery');
  const [explorationTime, setExplorationTime] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const connectionOptimization = useConnectionOptimization();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const phaseAnnouncements = {
      mystery: 'Mystery phase: Starting with a question',
      exploration: 'Exploration phase: Time to investigate and discover',
      insight: 'Insight phase: The moment of understanding',
      application: 'Application phase: Connecting to real life',
    };
    setAnnouncement(phaseAnnouncements[phase]);
  }, [phase]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // N - Next phase
      if (e.key === 'n' || e.key === 'N') {
        if (phase === 'mystery') handleStartExploration();
        else if (phase === 'exploration') handleShowInsight();
        else if (phase === 'insight') handleShowApplication();
        else if (phase === 'application') handleComplete();
      }
      // H - Show hint (only in exploration phase)
      if ((e.key === 'h' || e.key === 'H') && phase === 'exploration') {
        if (hintsUsed < module.exploration.hints.length) {
          setHintsUsed(hintsUsed + 1);
        }
      }
      // S - Skip to insight (only in exploration phase)
      if ((e.key === 's' || e.key === 'S') && phase === 'exploration') {
        handleShowInsight();
      }
      // ESC - Exit module
      if (e.key === 'Escape') {
        onComplete?.();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [phase, hintsUsed, module.exploration.hints.length]);

  const handleStartExploration = () => {
    setPhase('exploration');
    setExplorationTime(0);
    const timer = setInterval(() => setExplorationTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  };

  const handleShowInsight = () => {
    setPhase('insight');
  };

  const handleShowApplication = () => {
    setPhase('application');
  };

  const handleComplete = () => {
    onComplete?.();
  };

  // Animation configuration based on connection speed
  const animationConfig = connectionOptimization.shouldLoadAnimations
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: 'easeOut' as const },
      }
    : {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Keyboard shortcuts help */}
      <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-bold z-50 opacity-70 hover:opacity-100 transition-opacity">
        <span className="sr-only">Keyboard shortcuts:</span>
        <span aria-hidden="true">N: Next | H: Hint | S: Skip | ESC: Exit</span>
      </div>

      {/* Phase 1: Mystery Hook */}
      {phase === 'mystery' && (
        <motion.div
          {...animationConfig}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border-2 border-indigo-100">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{module.mystery.visual}</div>
              <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                {module.mystery.question}
              </h1>
              <p className="text-xl text-indigo-600 italic">{module.mystery.hook}</p>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🤔</span>
                What do you think?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Take a moment to wonder. Don't worry about the right answer.
                Just let your curiosity guide you.
              </p>
            </div>

            <button
              onClick={handleStartExploration}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105"
              aria-label="Start exploring the mystery"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-2xl" aria-hidden="true">🔍</span>
                <span>Let's Explore Together</span>
              </span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Phase 2: Exploration */}
      {phase === 'exploration' && (
        <motion.div
          {...animationConfig}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border-2 border-indigo-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔬</span>
                <h2 className="text-2xl font-bold text-indigo-900">Exploration Time</h2>
              </div>
              <div className="text-slate-500 text-sm">
                Time exploring: {Math.floor(explorationTime / 60)}:{(explorationTime % 60).toString().padStart(2, '0')}
              </div>
            </div>

            <p className="text-lg text-slate-700 mb-6">{module.exploration.instructions}</p>

            <div className="mb-6">
              <ErrorBoundary>
                {typeof module.exploration.component === 'function'
                  ? (module.exploration.component as () => React.ReactElement)()
                  : module.exploration.component}
              </ErrorBoundary>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 mb-6 border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Need a hint?
              </h3>
              <p className="text-amber-800 text-sm mb-3">
                Hints are here to guide you, not judge you. Take your time.
              </p>
              {module.exploration.hints.map((hint, index) => (
                <button
                  key={index}
                  onClick={() => setHintsUsed(hintsUsed + 1)}
                  className="block w-full text-left bg-white hover:bg-amber-100 rounded-xl p-3 mb-2 border border-amber-300 transition-colors"
                  aria-label={`Show hint ${index + 1}`}
                >
                  <span className="text-amber-700 font-semibold">
                    Hint {index + 1}:
                  </span>
                  <span className="text-slate-700 ml-2">{hint}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleShowInsight}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg shadow-green-500/30 transition-all transform hover:scale-105"
              aria-label="Show insight and explanation"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-2xl" aria-hidden="true">💡</span>
                <span>I Think I Understand</span>
              </span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Phase 3: Insight Moment */}
      {phase === 'insight' && (
        <motion.div
          {...animationConfig}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Insight</h2>
              <p className="text-xl text-indigo-100 italic">{module.insight.ahaMoment}</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <span>🎯</span>
                Here's what's happening:
              </h3>
              <p className="text-lg leading-relaxed">{module.insight.revelation}</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <span>🔗</span>
                Connection to the mystery:
              </h3>
              <p className="text-lg leading-relaxed">{module.insight.connection}</p>
            </div>

            <button
              onClick={handleShowApplication}
              className="w-full bg-white hover:bg-indigo-50 text-indigo-700 font-bold py-4 px-8 rounded-2xl text-lg shadow-lg transition-all transform hover:scale-105"
              aria-label="See how this concept applies in real life"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-2xl" aria-hidden="true">🌍</span>
                <span>See How This Applies</span>
              </span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Phase 4: Application */}
      {phase === 'application' && (
        <motion.div
          {...animationConfig}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border-2 border-green-100">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🌍</div>
              <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">In Real Life</h2>
              <p className="text-xl text-green-700">Understanding connects to the world around you</p>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 mb-6 border border-green-200">
              <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🏙️</span>
                Real World:
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">{module.application.realWorld}</p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 mb-6 border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🇮🇳</span>
                Indian Context:
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">{module.application.indianContext}</p>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6 mb-8 border border-indigo-200">
              <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                Try It:
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">{module.application.tryIt}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleComplete}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg shadow-green-500/30 transition-all transform hover:scale-105"
                aria-label="Complete module and return to home"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-2xl" aria-hidden="true">🎉</span>
                  <span>I Understand!</span>
                </span>
              </button>
              <WhatsAppShare 
                moduleName={module.id}
                progress={100}
                completed={true}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Example usage for Gravity module
export const GRAVITY_WONDER_MODULE: WonderFirstModule = {
  id: 'gravity-wonder',
  mystery: {
    question: "If Earth is spinning at 1,670 km/h at the equator, why don't we fly off into space?",
    visual: "🌍",
    hook: "It seems impossible. How can we stay on something moving that fast?",
  },
  exploration: {
    instructions: "Explore what happens when you change Earth's rotation speed and mass. Observe how objects behave. What patterns do you notice?",
    hints: [
      "Try slowing down Earth's rotation. What happens to objects?",
      "Now increase Earth's mass. Does that change anything?",
      "What if both rotation and mass change together?",
    ],
    component: (
      <div className="bg-slate-100 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
        <p className="text-slate-500 text-center">
          [Interactive Gravity Simulation Component]
          <br />
          <span className="text-sm">
            (This would be the actual interactive canvas where users can adjust
            Earth's rotation speed and mass, observing how objects behave)
          </span>
        </p>
      </div>
    ),
  },
  insight: {
    revelation: "Gravity isn't a force pulling things down. It's the curvature of spacetime caused by mass. The more massive an object, the more it curves spacetime around it. Objects follow these curves.",
    connection: "Earth's massive size curves spacetime so much that we're constantly 'falling' toward it. But because we're also moving sideways (due to Earth's rotation), we keep missing the ground - which is why we stay on the surface instead of flying off!",
    ahaMoment: "We're not being pulled down - we're following the curves in the fabric of space and time itself!",
  },
  application: {
    realWorld: "This is why satellites stay in orbit - they're constantly falling around Earth, moving sideways fast enough to miss it. It's also why the Moon doesn't crash into Earth - it's falling around us forever.",
    indianContext: "ISRO's satellites use this same principle. When Chandrayaan-3 orbited the Moon, it was following the Moon's gravitational curves. Indian scientists like C.V. Raman studied how light and gravity interact in space.",
    tryIt: "Next time you see a satellite in the night sky, remember: it's not being held up by anything - it's falling around Earth, forever curious about our planet.",
  },
};
