// src/worlds/lab/modules/MoonPhasesWonderFirst.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

const PHASES = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
const EMOJIS = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];

// Exploration Component
function ExplorationComponent() {
  const [phase, setPhase] = useState(4);
  const [showOrbit, setShowOrbit] = useState(false);
  const { language } = useLearnerStore();

  const handlePhaseChange = useCallback((p: number) => {
    setPhase(p);
    LearningService.trackEvent('moon-phases-wonder-session', 'lab', language, 'phase_change', 'moon-phases', { phase: p });
  }, [language]);

  const toggleView = useCallback(() => setShowOrbit(p => !p), []);

  return (
    <div className="space-y-6">
      {/* View toggle */}
      <button 
        onClick={toggleView} 
        className="w-full px-5 py-3 rounded-xl bg-indigo-600/30 text-indigo-200 text-sm font-medium hover:bg-indigo-600/50 transition"
      >
        {showOrbit ? '🌙 Moon View' : '🔄 Orbit View'}
      </button>

      {/* Moon visualization */}
      <div className="bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-700">
        <div className="text-center">
          <div className="text-8xl mb-4">{EMOJIS[phase]}</div>
          <div className="text-white font-bold text-xl mb-2">{PHASES[phase]}</div>
          <div className="text-slate-300 text-sm">
            {showOrbit ? 'Viewing Moon orbiting Earth' : 'Viewing Moon from Earth'}
          </div>
        </div>
      </div>

      {/* Phase selector */}
      <div className="bg-slate-800/50 rounded-2xl p-4 shadow-sm border border-slate-700">
        <div className="grid grid-cols-4 gap-2">
          {PHASES.map((p, i) => (
            <button 
              key={i} 
              onClick={() => handlePhaseChange(i)} 
              className={`py-2 rounded-xl text-sm font-medium transition ${phase === i ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              <div className="text-lg">{EMOJIS[i]}</div>
              <div className="text-sm">{p.split(' ').pop()}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.moonphaseswonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.moonphaseswonderfirst.how_does_the_moon_s_appearance">• How does the Moon's appearance change through the phases?</Trans></li>
          <li><Trans i18nKey="auto.moonphaseswonderfirst.what_pattern_do_you_see_in_the">• What pattern do you see in the sequence?</Trans></li>
          <li><Trans i18nKey="auto.moonphaseswonderfirst.why_does_the_moon_look_differe">• Why does the Moon look different from Earth vs from orbit?</Trans></li>
          <li><Trans i18nKey="auto.moonphaseswonderfirst.how_long_does_it_take_to_compl">• How long does it take to complete all 8 phases?</Trans></li>
        </ul>
      </div>
    </div>
  );
}

export default function MoonPhasesWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const moonPhasesWonderModule: WonderFirstModule = {
    id: 'moon-phases-wonder',
    mystery: {
      question: "Why does the Moon change shape every night? Sometimes it's a full circle, sometimes a crescent, and sometimes it disappears completely. What's really happening?",
      visual: "🌙",
      hook: "We see the Moon change shape every night, but have you ever wondered why? Is the Moon actually changing, or is something else going on?",
    },
    exploration: {
      instructions: "Explore the different phases of the Moon. What patterns do you notice in how the Moon changes? How does the view from Earth differ from the orbit view?",
      hints: [
        "Start with the New Moon. What do you see?",
        "Move to the Full Moon. How is it different?",
        "Watch the sequence from New Moon back to New Moon.",
        "Think about the relationship between the Sun, Earth, and Moon.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "The Moon doesn't actually change shape - it's always a sphere! What changes is how much of the Moon's illuminated side we can see from Earth. As the Moon orbits Earth, the Sun lights up different parts of it. When the Moon is between Earth and Sun, we see nothing (New Moon). When Earth is between Moon and Sun, we see the full illuminated side (Full Moon). The phases are just different angles of the same Moon being lit by the Sun!",
      connection: "The mystery of why the Moon changes shape is solved: it's all about angles! The key insight is that the Moon is always a sphere, but we only see the part that's lit by the Sun. As the Moon orbits Earth, the angle between Sun, Earth, and Moon changes, so we see different portions of the illuminated side. This is why the Moon appears to grow (wax) and shrink (wane) - it's not changing, our view of it is!",
      ahaMoment: "Moon phases are just different viewing angles of the same Moon - the Moon doesn't change, our perspective does!",
    },
    application: {
      realWorld: "We see moon phases every month. Understanding them helps us predict tides, plan fishing and agriculture, and even track time. Many cultures use lunar calendars for festivals and religious events. The lunar month (29.53 days) is the basis for many traditional calendars.",
      indianContext: "India's Panchang calendar tracks 30 lunar phases (Tithis) with remarkable precision! Festivals like Diwali (Amavasya - New Moon) and Karwa Chauth (Purnima - Full Moon) are based on moon phases. Ancient Indians calculated the lunar month at 29.53 days - accurate to modern science! The Surya Siddhanta (400 CE) described lunar phases and their calculation. Indian astronomers could predict eclipses by understanding the alignment of Sun, Earth, and Moon.\n\n🪔 **Diwali Connection**: Diwali is celebrated on Amavasya (New Moon) when the Moon is not visible. The festival of lights celebrates the triumph of light over darkness - symbolically, the darkest night becomes the brightest with diyas. The New Moon represents new beginnings, and Diwali marks the start of the Hindu new year in many regions.\n\n🎨 **Holi Connection**: Holi is celebrated during the full moon of Phalguna month (Purnima). The full moon illuminates the night as people play with colors, symbolizing the triumph of good over evil. The festival's connection to the full moon represents completeness and the victory of light.\n\n🌾 **Pongal Connection**: While Pongal is a solar festival, the timing is often coordinated with lunar phases in traditional calendars. The full moon during harvest season provides light for nighttime celebrations and activities.\n\n👨‍🔬 **Aryabhata (476-550 CE)** - Calculated the lunar month at 29.53 days and described lunar phases with remarkable accuracy.\n\n👨‍🔬 **Varahamihira (505-587 CE)** - In his work Brihat Samhita, he described lunar phases and their effects on tides and agriculture.\n\n👨‍🔬 **Bhaskara II (1114-1185 CE)** - Explained the geometry of lunar phases and eclipses, understanding the alignment of Sun, Earth, and Moon.\n\n👨‍🔬 **Vikram Sarabhai (1919-1971)** - Father of India's space program, founded ISRO and initiated India's satellite programme. India's first satellite, Aryabhata, was launched in 1975 and named after the ancient astronomer.\n\n👩‍🔬 **Ritu Karidhal (born 1975)** - ISRO scientist who led the Chandrayaan-2 mission to the Moon, building on India's astronomical and space exploration heritage.",
      tryIt: "Next time you see the Moon at night, try to identify which phase it is. And remember: the Moon isn't changing shape - you're just seeing a different angle of the same sphere being lit by the Sun. The Moon is always there, always round, just sometimes hidden in shadow!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={moonPhasesWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
