// src/worlds/lab/modules/WaterCycleWonderFirst.tsx
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
  const [sunIntensity, setSunIntensity] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(true);
  const { language } = useLearnerStore();

  const handleIntensityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSunIntensity(val);
    LearningService.trackEvent('water-cycle-wonder-session', 'lab', language, 'canvas_interaction', 'water-cycle', { sunIntensity: val });
  }, [language]);

  const togglePlay = useCallback(() => setIsPlaying(prev => !prev), []);

  return (
    <div className="space-y-6">
      {/* Sun intensity control */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400"><Trans i18nKey="auto.watercyclewonderfirst.low_sun">🌥️ Low sun</Trans></span>
          <span className="text-sm text-slate-400"><Trans i18nKey="auto.watercyclewonderfirst.intense_sun">☀️ Intense sun</Trans></span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={sunIntensity}
          onChange={handleIntensityChange}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #94A3B8 0%, #F59E0B 100%)`,
          }}
        />
        <div className="text-center mt-2 text-sm text-slate-400">
          <Trans i18nKey="auto.watercyclewonderfirst.sun_intensity">Sun intensity:</Trans> {Math.round(sunIntensity * 100)}%
        </div>
      </div>

      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className={`w-full px-5 py-3 rounded-xl text-sm font-medium transition ${
          isPlaying
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
        }`}
      >
        {isPlaying ? '⏸️ Pause Cycle' : '▶️ Play Cycle'}
      </button>

      {/* 4 stages visualization */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-50 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">☀️</div>
          <div className="font-bold text-amber-600 text-sm"><Trans i18nKey="auto.watercyclewonderfirst.evaporation">Evaporation</Trans></div>
          <div className="text-xs text-slate-500 mt-1"><Trans i18nKey="auto.watercyclewonderfirst.water_turns_to_vapor">Water turns to vapor</Trans></div>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">☁️</div>
          <div className="font-bold text-slate-600 text-sm"><Trans i18nKey="auto.watercyclewonderfirst.condensation">Condensation</Trans></div>
          <div className="text-xs text-slate-500 mt-1"><Trans i18nKey="auto.watercyclewonderfirst.vapor_turns_to_clouds">Vapor turns to clouds</Trans></div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">🌧️</div>
          <div className="font-bold text-blue-600 text-sm"><Trans i18nKey="auto.watercyclewonderfirst.precipitation">Precipitation</Trans></div>
          <div className="text-xs text-slate-500 mt-1"><Trans i18nKey="auto.watercyclewonderfirst.clouds_release_rain">Clouds release rain</Trans></div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">🌊</div>
          <div className="font-bold text-green-600 text-sm"><Trans i18nKey="auto.watercyclewonderfirst.collection">Collection</Trans></div>
          <div className="text-xs text-slate-500 mt-1"><Trans i18nKey="auto.watercyclewonderfirst.water_gathers_again">Water gathers again</Trans></div>
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.watercyclewonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.watercyclewonderfirst.what_happens_when_you_increase">• What happens when you increase the sun intensity?</Trans></li>
          <li><Trans i18nKey="auto.watercyclewonderfirst.how_does_the_water_move_throug">• How does the water move through the cycle?</Trans></li>
          <li><Trans i18nKey="auto.watercyclewonderfirst.does_the_same_water_keep_cycli">• Does the same water keep cycling forever?</Trans></li>
          <li><Trans i18nKey="auto.watercyclewonderfirst.what_would_happen_if_the_sun_s">• What would happen if the sun stopped shining?</Trans></li>
        </ul>
      </div>
    </div>
  );
}

export default function WaterCycleWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const waterCycleWonderModule: WonderFirstModule = {
    id: 'water-cycle-wonder',
    mystery: {
      question: "The same water that falls as rain today might have been drunk by a dinosaur millions of years ago. How is that possible? And where does rain really come from?",
      visual: "🌧️",
      hook: "We see rain fall from the sky, but have you ever wondered where that water came from? And where does it go after it hits the ground?",
    },
    exploration: {
      instructions: "Explore what happens when you change the sun's intensity. Watch how water moves through evaporation, condensation, precipitation, and collection. What patterns do you notice?",
      hints: [
        "Increase the sun intensity. What happens to the water?",
        "Decrease the sun intensity. Does the cycle slow down?",
        "Think about where the water goes after it rains.",
        "What would happen if the sun stopped completely?",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "The water on Earth has been cycling for billions of years! The sun heats water, causing it to evaporate and turn into invisible water vapor. This vapor rises, cools, and condenses into clouds. When clouds become too heavy, water falls back as rain or snow. This water collects in rivers, lakes, and oceans, only to evaporate again. The same water molecules have been cycling endlessly - the water you drink today might have been part of a glacier, a cloud, or even a dinosaur!",
      connection: "The mystery of where rain comes from is solved: it's the same water cycling endlessly! The key insight is that water doesn't disappear - it just changes form. From liquid to vapor to liquid again, water is constantly moving through this cycle powered by the sun's energy. This is why we can have droughts (when the cycle slows) and floods (when it speeds up) - it's all about the balance in this eternal dance of water.",
      ahaMoment: "Water cycles endlessly - the same molecules have been moving for billions of years, powered by the sun's energy!",
    },
    application: {
      realWorld: "We see the water cycle every day: rain, snow, clouds, and even the water in our taps. Understanding the water cycle helps us predict weather, manage water resources, and protect our environment. It's why we have seasons, why some places are dry and others wet, and why we need to conserve water.",
      indianContext: "The Indian monsoon is the world's largest water cycle event! Ancient Indians tracked this through Nakshatras (lunar mansions) and built stepwells like Chand Baori (800 CE) to harvest rainwater. These stepwells are engineering marvels that modern scientists still study. During monsoon season, India receives most of its annual rainfall - the water cycle in action on a massive scale! Farmers depend on this cycle for their crops, and festivals celebrate the arrival of rain.\n\n🌾 **Pongal Connection**: Pongal celebrates the harvest season when the water cycle brings life-giving rains to crops. The festival coincides with the sun's northward journey (Uttarayan), which influences the monsoon patterns. Farmers thank the Sun God and rain gods for the water that makes their harvest possible. The festival reminds us that the water cycle is not just science - it's the foundation of agriculture and life itself.\n\n🎨 **Holi Connection**: Holi is celebrated in spring when winter transitions to summer - a change driven by the water cycle. The melting of winter snow and the arrival of spring rains bring new life to nature. The festival's use of water (in some regions) celebrates this renewal. The vibrant colors of Holi reflect the life that returns when the water cycle brings rain after the dry winter months.\n\n👨‍🔬 **Varahamihira (505-587 CE)** - In his work Brihat Samhita, he described the water cycle and monsoon patterns, helping farmers predict rainfall for agriculture.\n\n👨‍🔬 **Bhaskara II (1114-1185 CE)** - Described evaporation and condensation processes, understanding how water changes states in the cycle.\n\n👨‍🔬 **M.S. Swaminathan (born 1925)** - Father of India's Green Revolution, worked on water management and irrigation systems based on understanding the water cycle.\n\n👨‍🔬 **A.P.J. Abdul Kalam (1931-2015)** - Scientist and President who emphasized the importance of water conservation and understanding the water cycle for India's future.",
      tryIt: "Next time it rains, remember: that water has been cycling for billions of years! It might have been part of a glacier, a cloud, or even a dinosaur. And when you drink a glass of water, think about the incredible journey those molecules have taken - from the ocean to the sky to the clouds to the rain to the river to your tap. You're drinking ancient water!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={waterCycleWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
