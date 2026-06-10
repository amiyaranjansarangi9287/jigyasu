// src/worlds/lab/modules/SolarSystemWonderFirst.tsx
// Wonder-First Redesign of Solar System Module
// Mission Alignment: Wonder Value - "We begin with questions, not answers"

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import SolarSystemCanvas from './SolarSystemCanvas';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

export default function SolarSystemWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [speed, setSpeed] = useState(1);
  const connectionOptimization = useConnectionOptimization();

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSpeed(val);
    LearningService.trackEvent(
      'solar-system-wonder-session',
      'lab',
      language,
      'canvas_interaction',
      'solar-system',
      { speed: val }
    );
  }, [language]);

  // Interactive exploration component
  const ExplorationComponent = (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="bg-slate-800/50 rounded-3xl shadow-sm border border-slate-700/50 p-4">
        <SolarSystemCanvas speed={speed} highlightPlanet={-1} />
      </div>

      {/* Speed slider */}
      <div className="bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400"><Trans i18nKey="auto.solarsystemwonderfirst.slow">🐢 Slow</Trans></span>
          <span className="text-sm text-slate-400"><Trans i18nKey="auto.solarsystemwonderfirst.fast">🚀 Fast</Trans></span>
        </div>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={speed}
          onChange={handleSpeedChange}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6366F1 0%, #8B5CF6 50%, #F59E0B 100%)`,
          }}
        />
        <div className="text-center mt-2 text-sm text-slate-400">
          <Trans i18nKey="auto.solarsystemwonderfirst.speed">Speed:</Trans> {speed.toFixed(1)}<Trans i18nKey="auto.solarsystemwonderfirst.x">x</Trans>
                          </div>
      </div>

      {/* Planet facts */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-yellow-900/20 rounded-xl p-3 text-center border border-yellow-700/30">
          <div className="text-xl mb-1">☀️</div>
          <div className="font-bold text-yellow-300 text-sm"><Trans i18nKey="auto.solarsystemwonderfirst.sun">Sun</Trans></div>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-3 text-center border border-gray-600/30">
          <div className="text-xl mb-1">🌍</div>
          <div className="font-bold text-blue-300 text-sm"><Trans i18nKey="auto.solarsystemwonderfirst.earth">Earth</Trans></div>
        </div>
        <div className="bg-red-900/20 rounded-xl p-3 text-center border border-red-700/30">
          <div className="text-xl mb-1">🪐</div>
          <div className="font-bold text-red-300 text-sm"><Trans i18nKey="auto.solarsystemwonderfirst.saturn">Saturn</Trans></div>
        </div>
        <div className="bg-orange-900/20 rounded-xl p-3 text-center border border-orange-700/30">
          <div className="text-xl mb-1">🔴</div>
          <div className="font-bold text-orange-300 text-sm"><Trans i18nKey="auto.solarsystemwonderfirst.mars">Mars</Trans></div>
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200">
        <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.solarsystemwonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.solarsystemwonderfirst.which_planet_moves_fastest_aro">• Which planet moves fastest around the Sun?</Trans></li>
          <li><Trans i18nKey="auto.solarsystemwonderfirst.which_planet_moves_slowest">• Which planet moves slowest?</Trans></li>
          <li><Trans i18nKey="auto.solarsystemwonderfirst.what_happens_when_you_increase">• What happens when you increase the speed?</Trans></li>
          <li><Trans i18nKey="auto.solarsystemwonderfirst.why_do_planets_closer_to_the_s">• Why do planets closer to the Sun move faster?</Trans></li>
        </ul>
      </div>
    </div>
  );

  // Wonder-First module configuration
  const solarSystemWonderModule: WonderFirstModule = {
    id: 'solar-system-wonder',
    mystery: {
      question: "If the Sun is so massive, why don't all the planets just fall into it? What keeps them in their perfect orbits?",
      visual: "🌌",
      hook: "It seems like they should crash into the Sun. But they've been orbiting for billions of years. What invisible force keeps them in place?",
    },
    exploration: {
      instructions: "Explore what happens when you change the orbital speed. Watch how the planets move around the Sun. Observe the relationship between distance from the Sun and orbital speed. What patterns do you notice?",
      hints: [
        "Set the speed to very slow. Which planet completes an orbit first?",
        "Now increase the speed. Do all planets speed up equally?",
        "Compare the inner planets (Mercury, Venus, Earth) with outer planets (Jupiter, Saturn). What's different?",
        "Think about what would happen if gravity suddenly disappeared - would the planets fly off in straight lines?",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Planets don't fall into the Sun because they're constantly falling toward it while moving sideways at the same time. This sideways motion creates an orbit. The closer a planet is to the Sun, the stronger the gravitational pull, so it must move faster to maintain its orbit. This is why Mercury zooms around the Sun while Neptune crawls - they're both 'falling' around the Sun at different speeds!",
      connection: "The mystery of why planets don't crash into the Sun is solved: they're in a constant state of falling but never hitting because they're also moving sideways. This balance between gravitational pull and sideways motion creates stable orbits. The faster the sideways motion, the further out the orbit can be before gravity pulls it in.",
      ahaMoment: "Planets are cosmic dancers - constantly falling toward the Sun but never hitting it because they're also moving sideways in a perfect balance!",
    },
    application: {
      realWorld: "This is how satellites stay in orbit around Earth - they're constantly falling around our planet. It's also why the Moon doesn't crash into Earth. Even the International Space Station is falling around Earth at 17,500 mph! Understanding orbital mechanics helps us launch satellites, plan space missions, and predict planetary positions.",
      indianContext: "Aryabhata (499 CE) calculated Earth's circumference with 99% accuracy and described heliocentric motion 1,000 years before Copernicus! The Surya Siddhanta (400 CE) described planetary orbits and eclipses with remarkable precision. ISRO's Chandrayaan-3 orbited the Moon using these same principles of orbital mechanics. Ancient Indian astronomers like Varahamihira could predict eclipses and planetary positions using mathematical models based on observation.\n\n🌾 **Pongal Connection**: Pongal is a four-day harvest festival celebrated in Tamil Nadu, thanking the Sun God for a bountiful harvest. The festival coincides with the sun's northward journey (Uttarayan) when days become longer and the sun appears higher in the sky. This change in the sun's position is due to Earth's orbit around the sun - the same orbital mechanics that keep planets in their paths! The festival reminds us that the sun's energy, delivered through Earth's orbit, makes all life on our planet possible.\n\n👨‍🔬 **Aryabhata (476-550 CE)** - Calculated Earth's circumference with 99% accuracy and proposed that Earth rotates on its axis, explaining day and night. Described heliocentric motion 1,000 years before Copernicus!\n\n👨‍🔬 **Varahamihira (505-587 CE)** - In his work Pancha Siddhantika, he compiled five astronomical systems and could predict eclipses and planetary positions with remarkable accuracy.\n\n👨‍🔬 **Bhaskara II (1114-1185 CE)** - Described gravitational attraction and how planets are held in their orbits, anticipating Newton's laws by 500 years.\n\n👨‍🔬 **Vikram Sarabhai (1919-1971)** - Father of India's space program, founded ISRO and led India's first satellite launch, Aryabhata, in 1975 - named after the ancient astronomer!",
      tryIt: "Next time you see the Moon in the sky, remember: it's not just hanging there - it's falling around Earth at 2,288 mph! And Earth? It's falling around the Sun at 67,000 mph. We're all cosmic dancers, constantly falling but never hitting our partners!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={solarSystemWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
