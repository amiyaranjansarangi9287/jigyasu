// src/worlds/lab/modules/LightShadowsWonderFirst.tsx
// Wonder-First Redesign of Light and Shadows Module
// Mission Alignment: Wonder Value - "We begin with questions, not answers"

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import LightShadowsCanvas from './LightShadowsCanvas';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

export default function LightShadowsWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [lightX, setLightX] = useState(50);
  const [lightY, setLightY] = useState(20);
  const connectionOptimization = useConnectionOptimization();

  const handleLightMove = useCallback((x: number, y: number) => {
    setLightX(x);
    setLightY(y);
    LearningService.trackEvent(
      'light-shadows-wonder-session',
      'lab',
      language,
      'canvas_interaction',
      'light-shadows',
      { lightX: x, lightY: y }
    );
  }, [language]);

  const timeOfDay = lightY < 20 ? 'Noon' : lightY < 35 ? 'Afternoon' : 'Sunset';

  // Interactive exploration component
  const ExplorationComponent = (
    <div className="space-y-6">
      {/* Time indicator */}
      <div className="flex justify-center">
        <div className="px-6 py-3 rounded-2xl font-bold text-lg bg-amber-100 text-amber-700">
          {timeOfDay} <Trans i18nKey="auto.lightshadowswonderfirst.sun_at">— Sun at</Trans> {Math.round(lightX)}%, {Math.round(lightY)}%
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4">
        <LightShadowsCanvas lightX={lightX} lightY={lightY} onLightMove={handleLightMove} />
      </div>

      {/* Explanation cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">☀️</div>
          <div className="font-bold text-yellow-600 text-sm"><Trans i18nKey="auto.lightshadowswonderfirst.light_source">Light Source</Trans></div>
          <p className="text-sm text-yellow-400 mt-1"><Trans i18nKey="auto.lightshadowswonderfirst.light_travels_in_straight_line">Light travels in straight lines</Trans></p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">🌳</div>
          <div className="font-bold text-slate-600 text-sm"><Trans i18nKey="auto.lightshadowswonderfirst.object_blocks">Object Blocks</Trans></div>
          <p className="text-sm text-slate-400 mt-1"><Trans i18nKey="auto.lightshadowswonderfirst.opaque_objects_block_light">Opaque objects block light</Trans></p>
        </div>
        <div className="bg-gray-100 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">🌑</div>
          <div className="font-bold text-gray-600 text-sm"><Trans i18nKey="auto.lightshadowswonderfirst.shadow_forms">Shadow Forms</Trans></div>
          <p className="text-sm text-gray-400 mt-1"><Trans i18nKey="auto.lightshadowswonderfirst.dark_area_behind_the_object">Dark area behind the object</Trans></p>
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
        <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.lightshadowswonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.lightshadowswonderfirst.what_happens_to_the_shadow_whe">• What happens to the shadow when you move the sun higher?</Trans></li>
          <li><Trans i18nKey="auto.lightshadowswonderfirst.what_happens_when_you_move_the">• What happens when you move the sun lower (closer to sunset)?</Trans></li>
          <li><Trans i18nKey="auto.lightshadowswonderfirst.which_direction_does_the_shado">• Which direction does the shadow point relative to the sun?</Trans></li>
          <li><Trans i18nKey="auto.lightshadowswonderfirst.why_are_shadows_longer_at_suns">• Why are shadows longer at sunset than at noon?</Trans></li>
        </ul>
      </div>
    </div>
  );

  // Wonder-First module configuration
  const lightShadowsWonderModule: WonderFirstModule = {
    id: 'light-shadows-wonder',
    mystery: {
      question: "Why are your shadows long in the morning and evening, but short at noon? What makes shadows change length throughout the day?",
      visual: "🔦",
      hook: "It's the same you, same sun, but your shadow keeps changing size and direction. What's really happening?",
    },
    exploration: {
      instructions: "Explore what happens when you move the sun to different positions. Watch how the shadow changes in length and direction. What patterns do you notice about the relationship between the sun's position and the shadow?",
      hints: [
        "Move the sun to the highest position (noon). How long is the shadow?",
        "Now move the sun lower (afternoon/sunset). What happened to the shadow length?",
        "Which direction does the shadow point when the sun is on the left? On the right?",
        "Think about why shadows are longer when the sun is lower in the sky.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Shadows are just the absence of light where an object blocks it! Light travels in straight lines from the sun, so when an object blocks those rays, a dark area forms behind it. The shadow's length depends on the angle of the light - when the sun is high (noon), the light comes from above and creates short shadows. When the sun is low (morning/evening), the light comes from the side and creates long shadows. The shadow always points opposite to the light source!",
      connection: "The mystery of changing shadow lengths is solved: it's all about the angle of light. The same object, same light source, but different angles create different shadows. This is why your shadow stretches out in the morning and evening when the sun is low, but shrinks to a small circle at noon when the sun is directly overhead. The shadow is always opposite the sun - pointing away from the light source.",
      ahaMoment: "Shadows are just light's absence! Their length and direction tell us exactly where the light is coming from.",
    },
    application: {
      realWorld: "We use this knowledge every day: sundials (using shadows to tell time), photography (understanding lighting), and even predicting eclipses. Understanding light and shadows helps us navigate, take better photos, and understand how the solar system works.",
      indianContext: "Aryabhata (499 CE) correctly explained eclipses as shadows - the Moon blocks sunlight for lunar eclipses, Earth's shadow falls on the Moon for solar eclipses! Ancient Indians used Shanku Yantra (shadow sticks) to measure time and calculate Earth's tilt with remarkable accuracy. During Diwali, we light lamps to chase away darkness - celebrating the triumph of light over shadows. The ancient Indian science of light (Jyotish) helped predict eclipses and planetary positions using shadow measurements.\n\n🪔 **Diwali Connection**: Diwali celebrates the triumph of light over darkness, knowledge over ignorance. The festival is named after the Sanskrit word 'Deepavali' meaning 'row of lights.' Just as shadows are the absence of light, darkness is the absence of knowledge. By lighting diyas, we symbolically chase away the shadows of ignorance. The festival reminds us that light (knowledge) dispels shadows (ignorance), just as understanding light and shadows helps us understand the world around us.\n\n🎨 **Holi Connection**: Holi, the festival of colors, celebrates the arrival of spring and the victory of good over evil. The vibrant colors of Holi remind us of how light interacts with different surfaces to create the colors we see. When sunlight hits water droplets during Holi celebrations, it creates rainbows - a beautiful demonstration of light splitting into its component colors. The festival teaches us that just as white light contains all colors, our diversity makes us beautiful together!\n\n👨‍🔬 **Aryabhata (476-550 CE)** - Correctly explained eclipses as shadows and used shadow measurements to calculate Earth's tilt with remarkable accuracy. His work influenced astronomy for centuries.\n\n👨‍🔬 **Varahamihira (505-587 CE)** - In his work Brihat Samhita, he described how to use shadows for timekeeping and architectural planning, showing practical applications of light and shadow knowledge.\n\n👨‍🔬 **Bhaskara II (1114-1185 CE)** - Described how light travels in straight lines and how shadows form, anticipating modern optics by 500 years.\n\n👨‍🔬 **C.V. Raman (1888-1970)** - Nobel laureate who studied how light scatters, contributing to our understanding of how light interacts with matter and creates shadows.",
      tryIt: "Next time you're outside in the morning or evening, look at your shadow and notice how long it is. Then at noon, check again - your shadow will be much shorter! And remember: your shadow is always pointing away from the sun, like a silent arrow showing you exactly where the light is coming from.",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={lightShadowsWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
