// src/worlds/lab/modules/DayNightWonderFirst.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

// Exploration Component
function ExplorationComponent() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const { language } = useLearnerStore();

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setRotationSpeed(val);
    LearningService.trackEvent('day-night-wonder-session', 'lab', language, 'speed_change', 'day-night', { speed: val });
  }, [language]);

  const toggleRotate = useCallback(() => setAutoRotate(p => !p), []);

  return (
    <div className="space-y-6">
      {/* Rotation control */}
      <button 
        onClick={toggleRotate} 
        className={`w-full px-5 py-3 rounded-xl text-sm font-medium transition ${autoRotate ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}
      >
        {autoRotate ? '⏸️ Pause Rotation' : '▶️ Start Rotation'}
      </button>

      {/* Speed control */}
      <div className="bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-700/50">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-slate-400"><Trans i18nKey="auto.daynightwonderfirst.speed">🔄 Speed</Trans></span>
          <span className="text-sm font-medium text-indigo-400">{rotationSpeed.toFixed(1)}<Trans i18nKey="auto.daynightwonderfirst.x">x</Trans></span>
        </div>
        <input 
          type="range" 
          min="0.1" 
          max="5" 
          step="0.1" 
          value={rotationSpeed} 
          onChange={handleSpeedChange} 
          className="w-full h-3 rounded-full appearance-none cursor-pointer" 
          style={{ background: 'linear-gradient(to right, #6366F1, #8B5CF6)' }} 
        />
      </div>

      {/* Earth visualization */}
      <div className="bg-gradient-to-br from-slate-800 to-indigo-900 rounded-2xl p-6 shadow-sm border border-slate-700">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <div className="text-white font-bold text-xl mb-2"><Trans i18nKey="auto.daynightwonderfirst.earth_rotating">Earth Rotating</Trans></div>
          <div className="text-slate-300 text-sm">
            {autoRotate ? 'Earth is spinning on its axis' : 'Rotation paused'}
          </div>
        </div>
      </div>

      {/* Day/Night explanation */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-yellow-100 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">☀️</div>
          <div className="font-bold text-yellow-700 text-sm"><Trans i18nKey="auto.daynightwonderfirst.day_side">Day Side</Trans></div>
          <div className="text-xs text-yellow-600 mt-1"><Trans i18nKey="auto.daynightwonderfirst.facing_the_sun">Facing the sun</Trans></div>
        </div>
        <div className="bg-indigo-100 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">🌙</div>
          <div className="font-bold text-indigo-700 text-sm"><Trans i18nKey="auto.daynightwonderfirst.night_side">Night Side</Trans></div>
          <div className="text-xs text-indigo-600 mt-1"><Trans i18nKey="auto.daynightwonderfirst.facing_away">Facing away</Trans></div>
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.daynightwonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.daynightwonderfirst.what_happens_as_earth_rotates">• What happens as Earth rotates?</Trans></li>
          <li><Trans i18nKey="auto.daynightwonderfirst.how_long_does_it_take_for_one_">• How long does it take for one full rotation?</Trans></li>
          <li><Trans i18nKey="auto.daynightwonderfirst.why_do_we_have_day_and_night">• Why do we have day and night?</Trans></li>
          <li><Trans i18nKey="auto.daynightwonderfirst.what_would_happen_if_earth_sto">• What would happen if Earth stopped rotating?</Trans></li>
        </ul>
      </div>
    </div>
  );
}

export default function DayNightWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const dayNightWonderModule: WonderFirstModule = {
    id: 'day-night-wonder',
    mystery: {
      question: "Why does the sun 'rise' in the morning and 'set' in the evening? Is the sun actually moving across the sky, or is something else happening?",
      visual: "🌍",
      hook: "We experience day and night every single day, but have you ever wondered what really causes this cycle? Is the sun moving, or are we?",
    },
    exploration: {
      instructions: "Explore what happens when Earth rotates. What patterns do you notice about day and night? How does rotation speed affect the cycle?",
      hints: [
        "Watch Earth rotate. What happens to the side facing the sun?",
        "What about the side facing away from the sun?",
        "How long does it take for one complete rotation?",
        "Think about real-life - sunrise, sunset, and the time in between.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Day and night are caused by Earth's rotation, not the sun's movement! Earth spins on its axis once every 24 hours. As it rotates, different parts of Earth face the sun (day) and different parts face away (night). The sun doesn't actually 'rise' or 'set' - it's Earth that's turning! This is why we have a 24-hour cycle: one complete rotation of Earth equals one full day. The side facing the sun experiences day, and the side facing away experiences night.",
      connection: "The mystery of what causes day and night is solved: it's Earth's rotation! The key insight is that we're the ones moving, not the sun. Earth spins on its axis like a top, and as it turns, different parts face the sun at different times. This is why the sun appears to rise and set - it's actually Earth turning toward and away from the sun. The 24-hour day is simply how long it takes Earth to complete one full rotation!",
      ahaMoment: "Day and night are caused by Earth's rotation - we're spinning, not the sun! One full rotation equals one 24-hour day.",
    },
    application: {
      realWorld: "We experience day and night every day, but understanding Earth's rotation helps us with time zones, navigation, and even planning our daily activities. It's why different parts of the world have different times, and why seasons change as Earth orbits the sun.",
      indianContext: "Aryabhata (499 CE) correctly explained day/night as Earth's rotation — an early Indian astronomical insight. He calculated Earth's circumference with remarkable accuracy. Ancient Indians used sundials to track time based on the sun's apparent movement. The Surya Siddhanta (400 CE) described Earth's rotation and its effect on day and night. Indian astronomers like Varahamihira could predict eclipses and planetary positions using this knowledge.\n\n🌾 **Pongal Connection**: Pongal celebrates the sun's northward journey (Uttarayan) when days become longer. This change in day length is due to Earth's rotation combined with its orbit around the sun. The festival marks the transition from shorter winter days to longer summer days, celebrating the return of longer daylight hours for agriculture.\n\n🎨 **Holi Connection**: Holi is celebrated during spring when day and night are nearly equal (equinox). This balance is due to Earth's position in its orbit combined with its rotation. The festival's celebration of light and colors reflects the balance between day and night during this time of year.\n\n👨‍🔬 **Aryabhata (476-550 CE)** - Correctly explained day/night as Earth's rotation and calculated Earth's circumference with remarkable accuracy — an early Indian astronomical insight.\n\n👨‍🔬 **Varahamihira (505-587 CE)** - In his work Pancha Siddhantika, he described Earth's rotation and its effects on time and seasons.\n\n👨‍🔬 **Bhaskara II (1114-1185 CE)** - Described Earth's rotation and how it creates day and night, building on ancient Indian astronomical knowledge.\n\n👨‍🔬 **Vikram Sarabhai (1919-1971)** - Father of India's space program, used knowledge of Earth's rotation to launch satellites and plan space missions.\n\n👩‍🔬 **Anna Mani (1918-2001)** - Pioneering physicist and meteorologist who studied atmospheric ozone and solar radiation. Her instruments for measuring solar radiation advanced Indian weather forecasting and our understanding of the Sun's energy.",
      tryIt: "Next time you watch the sunrise or sunset, remember: the sun isn't moving - you are! Earth is spinning on its axis, and as it turns, different parts face the sun at different times. And the 24-hour day is simply how long it takes Earth to complete one full rotation. You're living on a spinning planet!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={dayNightWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
