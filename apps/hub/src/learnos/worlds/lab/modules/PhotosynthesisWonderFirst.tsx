// src/worlds/lab/modules/PhotosynthesisWonderFirst.tsx
// Wonder-First Redesign of Photosynthesis Module
// Mission Alignment: Wonder Value - "We begin with questions, not answers"

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import PhotosynthesisCanvas from './PhotosynthesisCanvas';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

export default function PhotosynthesisWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [sunIntensity, setSunIntensity] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(true);
  const connectionOptimization = useConnectionOptimization();

  const handleIntensityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSunIntensity(val);
    LearningService.trackEvent(
      'photosynthesis-wonder-session',
      'lab',
      language,
      'canvas_interaction',
      'photosynthesis',
      { sunIntensity: val }
    );
  }, [language]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Interactive exploration component
  const ExplorationComponent = (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={togglePlay}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
            isPlaying
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4">
        <PhotosynthesisCanvas sunIntensity={sunIntensity} isPlaying={isPlaying} />
      </div>

      {/* Sun intensity slider */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">🌥️ Low light</span>
          <span className="text-sm text-slate-400">☀️ Bright sun</span>
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
          Sun intensity: {Math.round(sunIntensity * 100)}%
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
        <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          What do you notice?
        </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li>• What happens to the plant when sunlight is low?</li>
          <li>• What happens when sunlight is bright?</li>
          <li>• What does the plant produce in each case?</li>
          <li>• How does the plant's energy change with sunlight?</li>
        </ul>
      </div>
    </div>
  );

  // Wonder-First module configuration
  const photosynthesisWonderModule: WonderFirstModule = {
    id: 'photosynthesis-wonder',
    mystery: {
      question: "How can a plant eat sunlight? It has no mouth, no stomach, and no cooking skills!",
      visual: "🌿",
      hook: "It seems impossible. But plants do it every day, all day long. How?",
    },
    exploration: {
      instructions: "Explore what happens when you change the sun's intensity. Watch how the plant responds. Observe what it produces. What patterns do you notice about how plants use sunlight?",
      hints: [
        "Try setting the sun intensity to very low. What does the plant produce?",
        "Now increase the sun intensity to maximum. How does the plant's energy change?",
        "What happens when you pause the simulation? Does the plant keep producing?",
        "Think about what the plant needs besides sunlight - what else is it taking in?",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Plants don't 'eat' sunlight directly. They use sunlight as energy to transform water and carbon dioxide into glucose (food) and oxygen. This process is called photosynthesis - literally 'making with light.' Sunlight provides the energy to break apart water and CO2 molecules and rearrange them into glucose.",
      connection: "The mystery of how plants 'eat' sunlight is solved: they use sunlight as a power source, like a solar panel, to power a chemical factory inside their leaves. The more sunlight, the more energy they have to make food - which is why plants grow faster in bright sun!",
      ahaMoment: "Plants are solar-powered chemical factories! They transform light energy into chemical energy stored in glucose.",
    },
    application: {
      realWorld: "This is why plants need sunlight to grow. Farmers time their crops to match sunlight patterns. Indoor plants need grow lights. Even the oxygen we breathe comes from plants using sunlight to split water molecules!",
      indianContext: "India's Green Revolution (1960s) maximized photosynthesis through better crop varieties that could use sunlight more efficiently. Ancient Indians understood plant nutrition through Vrikshayurveda (Science of Plant Life), documented ~1000 BCE - describing how sunlight, water, and soil nourish plants. During monsoon season, farmers in India plant rice when sunlight is most abundant to maximize photosynthesis!\n\n🪔 **Diwali Connection**: During Diwali, we light diyas (oil lamps) to celebrate the triumph of light over darkness. Just as plants use sunlight to create energy, diyas use fire to create light. The festival reminds us of the importance of light in our lives - whether from the Sun or from lamps we light ourselves. Many families also plant tulsi (holy basil) during Diwali, understanding its importance for air purification and health.\n\n🎨 **Holi Connection**: Holi, the festival of colors and spring, celebrates the arrival of new life in nature. The vibrant colors of Holi come from natural plant sources - tesu flowers (flame of the forest), palash flowers (flame tree), and turmeric. These plants use photosynthesis to create the pigments that give us the beautiful colors we play with. The festival reminds us that the green plants we see around us are actually using sunlight to create the colors that make our world beautiful!\n\n🌾 **Pongal Connection**: Pongal is a four-day harvest festival celebrated in Tamil Nadu, thanking the Sun God for a bountiful harvest. The festival coincides with the sun's northward journey (Uttarayan) when days become longer and plants receive more sunlight for photosynthesis. Farmers celebrate the harvest of crops like rice and sugarcane - all made possible by photosynthesis! The traditional Pongal dish is made from newly harvested rice, celebrating the sun's energy that transformed into food through plants.\n\n👨‍🔬 **Jagadish Chandra Bose (1858-1937)** - Pioneered plant physiology research, showing plants respond to stimuli like light and stress. He invented the crescograph to measure plant growth.\n\n👩‍🔬 **Janaki Ammal (1897-1984)** - Renowned botanist who studied plant genetics and worked on improving crop varieties for better photosynthesis efficiency.\n\n👨‍🔬 **M.S. Swaminathan (born 1925)** - Father of India's Green Revolution, developed high-yield wheat and rice varieties that use sunlight more efficiently to produce more food.\n\n👨‍🔬 **Yellapragada Subbarow (1895-1948)** - Discovered ATP (adenosine triphosphate), the energy molecule that plants create during photosynthesis to store energy from sunlight!",
      tryIt: "Next time you see a plant growing toward a window, remember: it's not just stretching - it's hunting for sunlight to power its internal chemical factory. And every breath you take? Thank a plant for using sunlight to make that oxygen!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={photosynthesisWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
