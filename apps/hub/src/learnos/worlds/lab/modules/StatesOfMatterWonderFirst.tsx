// src/worlds/lab/modules/StatesOfMatterWonderFirst.tsx
// Wonder-First Redesign of States of Matter Module
// Mission Alignment: Wonder Value - "We begin with questions, not answers"

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import StatesOfMatterCanvas from './StatesOfMatterCanvas';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

export default function StatesOfMatterWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [temperature, setTemperature] = useState(20);
  const connectionOptimization = useConnectionOptimization();

  const getStateLabel = (temp: number) => {
    if (temp < 33) return { label: 'SOLID', color: '#60A5FA', emoji: '🧊' };
    if (temp < 66) return { label: 'LIQUID', color: '#3B82F6', emoji: '💧' };
    return { label: 'GAS', color: '#F59E0B', emoji: '💨' };
  };

  const state = getStateLabel(temperature);

  const handleTempChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setTemperature(val);
    LearningService.trackEvent(
      'states-of-matter-wonder-session',
      'lab',
      language,
      'canvas_interaction',
      'states-of-matter',
      { temperature: val }
    );
  }, [language]);

  // Interactive exploration component
  const ExplorationComponent = (
    <div className="space-y-6">
      {/* State indicator */}
      <div className="flex justify-center">
        <div
          className="px-6 py-3 rounded-2xl font-bold text-lg text-white"
          style={{ backgroundColor: state.color }}
        >
          {state.label} — {temperature}<Trans i18nKey="auto.statesofmatterwonderfirst.c">°C</Trans>
                          </div>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4">
        <StatesOfMatterCanvas temperature={temperature} />
      </div>

      {/* Temperature slider */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400"><Trans i18nKey="auto.statesofmatterwonderfirst.cold">🧊 Cold</Trans></span>
          <span className="text-sm text-slate-400"><Trans i18nKey="auto.statesofmatterwonderfirst.hot">Hot 🔥</Trans></span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={temperature}
          onChange={handleTempChange}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #60A5FA 0%, #3B82F6 33%, #F59E0B 66%, #EF4444 100%)`,
          }}
        />
        <div className="flex justify-between mt-2 text-sm text-slate-400">
          <span><Trans i18nKey="auto.statesofmatterwonderfirst.0_c">0°C</Trans></span>
          <span><Trans i18nKey="auto.statesofmatterwonderfirst.33_c">33°C</Trans></span>
          <span><Trans i18nKey="auto.statesofmatterwonderfirst.66_c">66°C</Trans></span>
          <span><Trans i18nKey="auto.statesofmatterwonderfirst.100_c">100°C</Trans></span>
        </div>
      </div>

      {/* State explanations */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">🧊</div>
          <div className="font-bold text-blue-600 text-sm"><Trans i18nKey="auto.statesofmatterwonderfirst.solid">Solid</Trans></div>
          <p className="text-sm text-blue-400 mt-1"><Trans i18nKey="auto.statesofmatterwonderfirst.particles_vibrate_in_place">Particles vibrate in place</Trans></p>
        </div>
        <div className="bg-cyan-50 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">💧</div>
          <div className="font-bold text-cyan-600 text-sm"><Trans i18nKey="auto.statesofmatterwonderfirst.liquid">Liquid</Trans></div>
          <p className="text-sm text-cyan-400 mt-1"><Trans i18nKey="auto.statesofmatterwonderfirst.particles_slide_past_each_othe">Particles slide past each other</Trans></p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">💨</div>
          <div className="font-bold text-orange-600 text-sm"><Trans i18nKey="auto.statesofmatterwonderfirst.gas">Gas</Trans></div>
          <p className="text-sm text-orange-400 mt-1"><Trans i18nKey="auto.statesofmatterwonderfirst.particles_fly_freely">Particles fly freely</Trans></p>
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.statesofmatterwonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.statesofmatterwonderfirst.what_happens_to_the_particles_">• What happens to the particles when you cool them down?</Trans></li>
          <li><Trans i18nKey="auto.statesofmatterwonderfirst.what_happens_when_you_heat_the">• What happens when you heat them up?</Trans></li>
          <li><Trans i18nKey="auto.statesofmatterwonderfirst.at_what_temperature_does_ice_b">• At what temperature does ice become water?</Trans></li>
          <li><Trans i18nKey="auto.statesofmatterwonderfirst.at_what_temperature_does_water">• At what temperature does water become steam?</Trans></li>
        </ul>
      </div>
    </div>
  );

  // Wonder-First module configuration
  const statesOfMatterWonderModule: WonderFirstModule = {
    id: 'states-of-matter-wonder',
    mystery: {
      question: "How can the same substance be a solid ice cube, a flowing liquid, and an invisible gas? What actually changes when something melts or boils?",
      visual: "🧊",
      hook: "It's the same water, but it behaves completely differently. What invisible force is making it change form?",
    },
    exploration: {
      instructions: "Explore what happens when you change the temperature. Watch how the particles behave as they heat up and cool down. What patterns do you notice about how particles move in each state?",
      hints: [
        "Set the temperature to very cold (0°C). How are the particles moving?",
        "Now increase to room temperature (around 33°C). How did the particles change?",
        "Heat it up to boiling (66°C+). What's different about the particles now?",
        "Think about what would happen if you could see the particles themselves - what's different about their movement?",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "The substance doesn't change - only the energy of its particles changes! When particles have less energy (cold), they vibrate in place and form a solid structure. When they have more energy (warm), they can slide past each other and flow as a liquid. When they have lots of energy (hot), they break free completely and fly around as a gas. Temperature is just a measure of particle energy!",
      connection: "The mystery of how the same substance can be solid, liquid, and gas is solved: it's all about particle energy. The particles themselves are identical - only their movement changes. More energy = more movement = different state. This is why ice melts when heated (particles gain energy to move freely) and water boils when heated further (particles gain enough energy to break free completely).",
      ahaMoment: "States of matter are just different energy levels of the same particles dancing to different rhythms!",
    },
    application: {
      realWorld: "We use this knowledge every day: cooking (boiling water), refrigeration (freezing food), weather (water vapor in clouds), and manufacturing (melting metals). Understanding states of matter helps us predict how materials will behave under different conditions.",
      indianContext: "Maharishi Kanad (~600 BCE) described these states as Prithvi (solid), Jala (liquid), and Vāyu (gas) - 2,400 years before modern science! The Panchabhutas framework maps perfectly to today's states of matter. Ancient Indian alchemists understood how heat transforms substances. During Indian summers, we see water evaporate from lakes and rivers, and during winters, we see it condense as dew - all examples of states of matter in action!\n\n🎨 **Holi Connection**: Holi is celebrated in spring when winter transitions to summer - a perfect example of states of matter changing! During Holi, we play with water (liquid) that can be colored with natural pigments. In some regions of India, people light bonfires the night before Holi (Holika Dahan) - watching wood burn from solid to gas. The festival reminds us that change is natural - just as water changes from solid ice in winter to liquid in spring, our lives also transform with the seasons.\n\n👨‍🔬 **Maharishi Kanad (~600 BCE)** - Founded the Vaisheshika school of philosophy and proposed atomic theory (Anu and Parmanu) 2,400 years before John Dalton! Described states of matter as Prithvi (solid), Jala (liquid), Vāyu (gas), Agni (energy), and Akasha (space).\n\n👨‍🔬 **Nagarjuna (150-250 CE)** - Ancient Indian alchemist who understood how heat transforms substances and worked with metallurgy, showing practical knowledge of states of matter.\n\n👨‍🔬 **C.V. Raman (1888-1970)** - Nobel laureate who studied how light interacts with matter, contributing to our understanding of how particles behave in different states.\n\n👨‍🔬 **Homi Bhabha (1909-1966)** - Father of India's nuclear program, studied particle physics and how matter behaves at the atomic level, building on ancient Indian atomic theories.",
      tryIt: "Next time you boil water for chai or tea, watch the steam rising - that's water turning into gas because the particles gained enough energy to break free. And when you put ice in your drink, watch it melt - that's solid turning into liquid as particles gain energy to move more freely. You're watching states of matter change right before your eyes!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={statesOfMatterWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
