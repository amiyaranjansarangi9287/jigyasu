// src/worlds/lab/modules/PlantGrowthWonderFirst.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

const STAGES = ['Seed', 'Sprout', 'Seedling', 'Growing', 'Flowering', 'Fruit'];
const EMOJIS = ['🌰', '🌱', '🌿', '🪴', '🌸', '🍎'];

// Exploration Component
function ExplorationComponent() {
  const [stage, setStage] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0.5);
  const [sunLevel, setSunLevel] = useState(0.8);
  const { language } = useLearnerStore();

  const handleStageChange = useCallback((s: number) => {
    setStage(s);
    LearningService.trackEvent('plant-growth-wonder-session', 'lab', language, 'stage_change', 'plant-growth', { stage: s });
  }, [language]);

  const handleWaterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setWaterLevel(val);
    LearningService.trackEvent('plant-growth-wonder-session', 'lab', language, 'water_change', 'plant-growth', { water: val });
  }, [language]);

  const handleSunChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSunLevel(val);
    LearningService.trackEvent('plant-growth-wonder-session', 'lab', language, 'sun_change', 'plant-growth', { sun: val });
  }, [language]);

  return (
    <div className="space-y-6">
      {/* Stage selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {STAGES.map((s, i) => (
          <button 
            key={i} 
            onClick={() => handleStageChange(i)} 
            className={`px-3 py-2 rounded-xl text-sm font-medium transition ${stage === i ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
          >
            <div className="text-lg">{EMOJIS[i]}</div>
            <div>{s}</div>
          </button>
        ))}
      </div>

      {/* Plant visualization */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="text-8xl mb-4">{EMOJIS[stage]}</div>
          <div className="text-2xl font-bold text-slate-800 mb-2">{STAGES[stage]}</div>
          <div className="text-sm text-slate-500">
            {stage === 0 && 'A seed contains everything needed to grow'}
            {stage === 1 && 'The seed sprouts when conditions are right'}
            {stage === 2 && 'Leaves emerge to catch sunlight'}
            {stage === 3 && 'The plant grows taller and stronger'}
            {stage === 4 && 'Flowers appear for reproduction'}
            {stage === 5 && 'Fruits contain seeds for the next generation'}
          </div>
        </div>
      </div>

      {/* Water and Sun controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400"><Trans i18nKey="auto.plantgrowthwonderfirst.water">💧 Water</Trans></span>
            <span className="text-sm font-medium text-blue-600">{Math.round(waterLevel * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={waterLevel} 
            onChange={handleWaterChange} 
            className="w-full h-3 rounded-full appearance-none cursor-pointer" 
            style={{ background: 'linear-gradient(to right, #94A3B8, #3B82F6)' }} 
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400"><Trans i18nKey="auto.plantgrowthwonderfirst.sunlight">☀️ Sunlight</Trans></span>
            <span className="text-sm font-medium text-yellow-600">{Math.round(sunLevel * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={sunLevel} 
            onChange={handleSunChange} 
            className="w-full h-3 rounded-full appearance-none cursor-pointer" 
            style={{ background: 'linear-gradient(to right, #94A3B8, #F59E0B)' }} 
          />
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.plantgrowthwonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.plantgrowthwonderfirst.what_does_a_plant_need_at_each">• What does a plant need at each stage?</Trans></li>
          <li><Trans i18nKey="auto.plantgrowthwonderfirst.how_do_water_and_sunlight_affe">• How do water and sunlight affect growth?</Trans></li>
          <li><Trans i18nKey="auto.plantgrowthwonderfirst.why_do_plants_flower_before_pr">• Why do plants flower before producing fruit?</Trans></li>
          <li><Trans i18nKey="auto.plantgrowthwonderfirst.what_would_happen_without_wate">• What would happen without water or sunlight?</Trans></li>
        </ul>
      </div>
    </div>
  );
}

export default function PlantGrowthWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const plantGrowthWonderModule: WonderFirstModule = {
    id: 'plant-growth-wonder',
    mystery: {
      question: "How does a tiny seed become a huge tree? What's inside a seed that allows it to grow? And what does a plant actually need to transform from seed to fruit?",
      visual: "🌱",
      hook: "We see plants growing everywhere, but have you ever wondered how a tiny seed becomes a massive plant? What's the secret inside that allows this transformation?",
    },
    exploration: {
      instructions: "Explore the different stages of plant growth. What does a plant need at each stage? How do water and sunlight affect the growth process?",
      hints: [
        "Start with the seed. What's inside?",
        "Watch it sprout. What triggers this?",
        "Follow the stages to flowering and fruit.",
        "Think about what plants need - water, sunlight, soil.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "A seed contains a tiny plant embryo and stored food! When conditions are right (water, warmth, sunlight), the seed germinates - the embryo wakes up and starts growing. Roots grow down to absorb water and nutrients from the soil, while the shoot grows up toward sunlight. Leaves emerge to photosynthesize (make food from sunlight), the plant grows taller, flowers appear for reproduction, and fruits develop containing seeds for the next generation. The entire cycle is powered by sunlight through photosynthesis!",
      connection: "The mystery of how seeds grow is solved: they contain everything needed to start! The key insight is that seeds are complete packages - they have a tiny plant embryo and stored food. When conditions are right, the embryo wakes up and starts growing. Roots go down for water and nutrients, shoots go up for sunlight, leaves make food through photosynthesis, and the cycle completes with flowers and fruits containing new seeds. It's a self-sustaining cycle powered by the sun!",
      ahaMoment: "Seeds contain complete plant embryos with stored food - when conditions are right, they grow into full plants through photosynthesis!",
    },
    application: {
      realWorld: "Understanding plant growth helps us grow food, manage forests, and even understand climate change. Farmers use this knowledge to optimize crop yields. Gardeners use it to care for plants. Scientists use it to develop new varieties that grow better in different conditions.",
      indianContext: "India's Green Revolution (1960s) transformed food production using plant science. Ancient Vrikshayurveda (around the 10th century CE) documented plant science — grafting, soil types, and seasonal cycles — showing sophisticated early botanical knowledge in India. The Arthashastra (traditionally dated around 300 BCE) described agricultural practices. Indian farmers developed sophisticated irrigation systems and crop rotation methods. Sacred groves (Devaranya) preserved biodiversity and native plant species. Traditional Indian agriculture honored the cycles of nature, planting according to lunar phases and seasonal rhythms.\n\n🌾 **Pongal Connection**: Pongal celebrates the harvest and the completion of the plant growth cycle. Farmers thank the Sun God for the energy that powered plant growth through photosynthesis. The festival honors the agricultural cycle from seed to harvest, recognizing that our food comes from plants that grow through the miracle of seed germination and photosynthesis. The traditional Pongal dish is made from newly harvested rice, celebrating the fruit of plant growth.\n\n🎨 **Holi Connection**: Holi celebrates spring when plants begin new growth after winter. The festival's use of natural colors from flowers celebrates the flowering stage of plant growth. The vibrant colors reflect the beauty of plants in bloom during spring, when the plant growth cycle is most visible and active.\n\n👨‍🔬 **Jagadish Chandra Bose (1858-1937)** - Pioneered plant physiology research, showing plants respond to stimuli and have life-like properties.\n\n👩‍🔬 **Janaki Ammal (1897-1984)** - Renowned botanist who studied plant genetics and worked on improving crop varieties for better growth.\n\n👨‍🔬 **M.S. Swaminathan (born 1925)** - Father of India's Green Revolution, developed high-yield crop varieties that grow faster and produce more food.\n\n👨‍🔬 **Yellapragada Subbarow (1895-1948)** - Studied plant metabolism and the chemical processes that power plant growth.",
      tryIt: "Next time you see a plant growing, think about the seed it came from. What's inside that seed? And remember: seeds are complete packages containing everything needed to start a new plant - a tiny embryo, stored food, and the genetic blueprint for the entire plant. All they need is water, warmth, and sunlight to begin the amazing journey of growth!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={plantGrowthWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
