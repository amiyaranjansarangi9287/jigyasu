import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Droplets, TreeDeciduous, Bug } from 'lucide-react';
import { Trans, useTranslation } from "react-i18next";
import ChallengeOverlay, { ChallengeData } from '../../../shared/ui/ChallengeOverlay';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface Biome {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgGradient: string;
  temperature: string;
  precipitation: string;
  location: string;
  description: string;
  climate: string;
  flora: { name: string; emoji: string }[];
  fauna: { name: string; emoji: string }[];
  funFacts: string[];
}

const biomes: Biome[] = [
  {
    id: 'tropical', name: 'Tropical Rainforest', emoji: '🌴', color: '#22c55e',
    bgGradient: 'from-green-900 via-emerald-900 to-green-950',
    temperature: '25-30°C (77-86°F)', precipitation: '200-450 cm/year',
    location: 'Amazon Basin, Congo, Southeast Asia',
    description: 'The most biodiverse biome on Earth! Warm, wet, and teeming with life year-round. Contains over 50% of all species despite covering only 6% of Earth\'s surface.',
    climate: 'Hot and humid year-round with no distinct seasons. Rainfall almost daily.',
    flora: [{ name: 'Kapok Tree', emoji: '🌳' }, { name: 'Orchids', emoji: '🌸' }, { name: 'Bromeliads', emoji: '🌿' }, { name: 'Lianas', emoji: '🌱' }],
    fauna: [{ name: 'Jaguar', emoji: '🐆' }, { name: 'Toucan', emoji: '🦜' }, { name: 'Tree Frog', emoji: '🐸' }, { name: 'Monkey', emoji: '🐒' }],
    funFacts: ['A single hectare can contain 750 tree species', '80% of insects are undiscovered here', 'Canopy is so thick, rain takes 10 mins to reach ground'],
  },
  {
    id: 'desert', name: 'Desert', emoji: '🏜️', color: '#f59e0b',
    bgGradient: 'from-amber-900 via-orange-900 to-yellow-950',
    temperature: '20-49°C day / -4-10°C night', precipitation: '<25 cm/year',
    location: 'Sahara, Gobi, Mojave, Arabian',
    description: 'Extreme environments with sparse vegetation adapted to conserve water. Despite harsh conditions, deserts host surprisingly diverse life forms.',
    climate: 'Extremely dry with intense heat during day and cold nights. Large temperature swings.',
    flora: [{ name: 'Saguaro Cactus', emoji: '🌵' }, { name: 'Joshua Tree', emoji: '🌴' }, { name: 'Tumbleweed', emoji: '🌿' }, { name: 'Aloe', emoji: '🪴' }],
    fauna: [{ name: 'Camel', emoji: '🐪' }, { name: 'Rattlesnake', emoji: '🐍' }, { name: 'Scorpion', emoji: '🦂' }, { name: 'Roadrunner', emoji: '🐦' }],
    funFacts: ['Deserts cover 1/3 of Earth\'s land', 'Sahara was green 6,000 years ago', 'Some cacti can live 200+ years'],
  },
  {
    id: 'tundra', name: 'Arctic Tundra', emoji: '🧊', color: '#06b6d4',
    bgGradient: 'from-cyan-900 via-sky-900 to-blue-950',
    temperature: '-40 to 18°C', precipitation: '15-25 cm/year',
    location: 'Northern Canada, Alaska, Russia, Scandinavia',
    description: 'A frozen landscape with permafrost and minimal vegetation. Growing season is just 50-60 days. One of Earth\'s most challenging environments.',
    climate: 'Long, brutally cold winters; short, cool summers. Permafrost up to 450m deep.',
    flora: [{ name: 'Arctic Moss', emoji: '🌿' }, { name: 'Lichens', emoji: '🍄' }, { name: 'Dwarf Shrubs', emoji: '🌱' }, { name: 'Sedges', emoji: '🌾' }],
    fauna: [{ name: 'Polar Bear', emoji: '🐻‍❄️' }, { name: 'Arctic Fox', emoji: '🦊' }, { name: 'Caribou', emoji: '🦌' }, { name: 'Snowy Owl', emoji: '🦉' }],
    funFacts: ['Ground is permanently frozen (permafrost)', 'Trees cannot grow here', 'Arctic terns migrate 44,000 miles/year'],
  },
  {
    id: 'ocean', name: 'Coral Reef', emoji: '🐠', color: '#3b82f6',
    bgGradient: 'from-blue-900 via-cyan-900 to-blue-950',
    temperature: '23-29°C (warm shallow waters)', precipitation: 'N/A (Marine)',
    location: 'Great Barrier Reef, Caribbean, Red Sea',
    description: 'Called the "rainforests of the sea." Built by tiny coral polyps over thousands of years. Home to 25% of all marine species despite covering <1% of ocean floor.',
    climate: 'Warm, clear, shallow tropical/subtropical waters. Need sunlight for coral growth.',
    flora: [{ name: 'Seagrass', emoji: '🌿' }, { name: 'Kelp', emoji: '🌊' }, { name: 'Algae', emoji: '🟢' }, { name: 'Sea Anemone', emoji: '🪸' }],
    fauna: [{ name: 'Clownfish', emoji: '🐠' }, { name: 'Sea Turtle', emoji: '🐢' }, { name: 'Octopus', emoji: '🐙' }, { name: 'Shark', emoji: '🦈' }],
    funFacts: ['Great Barrier Reef visible from space', 'Corals are actually animals!', 'Some reefs are 50 million years old'],
  },
  {
    id: 'temperate', name: 'Temperate Forest', emoji: '🍂', color: '#84cc16',
    bgGradient: 'from-lime-900 via-green-900 to-emerald-950',
    temperature: '-30 to 30°C (seasonal)', precipitation: '75-150 cm/year',
    location: 'Eastern US, Europe, East Asia',
    description: 'Four distinct seasons with deciduous trees that lose leaves in fall. Rich biodiversity with diverse wildlife adapted to seasonal changes.',
    climate: 'Warm summers, cold winters. Moderate rainfall distributed throughout year.',
    flora: [{ name: 'Oak', emoji: '🌳' }, { name: 'Maple', emoji: '🍁' }, { name: 'Ferns', emoji: '🌿' }, { name: 'Wildflowers', emoji: '🌼' }],
    fauna: [{ name: 'Deer', emoji: '🦌' }, { name: 'Bear', emoji: '🐻' }, { name: 'Squirrel', emoji: '🐿️' }, { name: 'Owl', emoji: '🦉' }],
    funFacts: ['Fall colors = chlorophyll breaking down', 'Up to 6 forest layers exist', 'These forests once covered most of Europe'],
  },
  {
    id: 'savanna', name: 'Savanna', emoji: '🦁', color: '#eab308',
    bgGradient: 'from-yellow-900 via-amber-900 to-orange-950',
    temperature: '20-30°C', precipitation: '50-130 cm/year (seasonal)',
    location: 'African Serengeti, Brazilian Cerrado, Australian Outback',
    description: 'Tropical grasslands with scattered trees. Distinct wet and dry seasons drive the great animal migrations.',
    climate: 'Warm year-round with distinct wet and dry seasons. Frequent fires shape the landscape.',
    flora: [{ name: 'Acacia Tree', emoji: '🌳' }, { name: 'Baobab', emoji: '🌴' }, { name: 'Elephant Grass', emoji: '🌾' }, { name: 'Shrubs', emoji: '🌿' }],
    fauna: [{ name: 'Lion', emoji: '🦁' }, { name: 'Elephant', emoji: '🐘' }, { name: 'Zebra', emoji: '🦓' }, { name: 'Giraffe', emoji: '🦒' }],
    funFacts: ['Serengeti migration = 1.5 million wildebeest', 'Fire is essential for savanna health', 'Acacia trees have symbiosis with ants'],
  },
  {
    id: 'taiga', name: 'Boreal Forest (Taiga)', emoji: '🌲', color: '#166534',
    bgGradient: 'from-green-950 via-emerald-950 to-gray-950',
    temperature: '-40 to 20°C', precipitation: '40-100 cm/year',
    location: 'Canada, Russia, Scandinavia',
    description: 'The world\'s largest land biome! Dominated by coniferous trees adapted to cold. Contains 1/3 of all trees on Earth.',
    climate: 'Long, cold winters; short, mild summers. Snow covers ground for much of year.',
    flora: [{ name: 'Spruce', emoji: '🌲' }, { name: 'Pine', emoji: '🌲' }, { name: 'Fir', emoji: '🎄' }, { name: 'Mosses', emoji: '🌿' }],
    fauna: [{ name: 'Moose', emoji: '🫎' }, { name: 'Wolf', emoji: '🐺' }, { name: 'Lynx', emoji: '🐱' }, { name: 'Beaver', emoji: '🦫' }],
    funFacts: ['Largest terrestrial biome on Earth', 'Contains more freshwater than any other biome', 'Trees grow very slowly due to cold'],
  },
  {
    id: 'grassland', name: 'Temperate Grassland', emoji: '🌾', color: '#a3a3a3',
    bgGradient: 'from-gray-800 via-stone-900 to-gray-950',
    temperature: '-20 to 30°C (seasonal)', precipitation: '25-75 cm/year',
    location: 'US Prairies, Eurasian Steppes, Pampas',
    description: 'Vast treeless plains dominated by grasses. Rich soils formed over millennia make these prime agricultural land. Home to large grazing mammals.',
    climate: 'Hot summers, cold winters. Too dry for trees, too wet for desert.',
    flora: [{ name: 'Buffalo Grass', emoji: '🌾' }, { name: 'Sunflowers', emoji: '🌻' }, { name: 'Clover', emoji: '☘️' }, { name: 'Wild Rye', emoji: '🌱' }],
    fauna: [{ name: 'Bison', emoji: '🦬' }, { name: 'Prairie Dog', emoji: '🐕' }, { name: 'Hawk', emoji: '🦅' }, { name: 'Coyote', emoji: '🐺' }],
    funFacts: ['Most converted biome for agriculture', 'Roots can extend 6 feet deep', 'Prairies once had 60 million bison'],
  },
];

const biomeDecorations = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 37) % 90}%`,
  top: `${(i * 53) % 80}%`,
}));

export default function BiomeExplorer() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [showChallenge, setShowChallenge] = useState(true);

  const activeChallenge: ChallengeData = {
    title: t('learnos.biology.biome_wonder', 'A Curious Question...'),
    prompt: t('learnos.biology.biome_prompt', "From icy tundras to lush rainforests, Earth is home to diverse habitats. Let's explore the biomes!"),
    options: [t('learnos.challenge.explore', "Let's explore and find out!")],
    onSuccess: () => {
      setShowChallenge(false);
      const updated = completeModule(progress, 'biome-explorer', 60);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const [selectedBiome, setSelectedBiome] = useState<Biome>(biomes[0]);

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2"><Trans i18nKey="auto.biomeexplorer.biome_explorer">🏔️ Biome Explorer</Trans></h2>
          <p className="text-gray-400 text-lg"><Trans i18nKey="auto.biomeexplorer.discover_earth_s_major_ecosyst">Discover Earth's major ecosystems and their unique life!</Trans></p>
        </motion.div>

        {/* Biome selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {biomes.map(b => (
            <button key={b.id} onClick={() => setSelectedBiome(b)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${selectedBiome.id === b.id ? 'text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              style={selectedBiome.id === b.id ? { backgroundColor: b.color } : {}}>
              <span>{b.emoji}</span>
              <span className="hidden sm:inline">{b.name}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={selectedBiome.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {/* Main biome display */}
            <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${selectedBiome.bgGradient} border border-gray-700 mb-6`}>
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-10">
                {biomeDecorations.map((decoration, i) => (
                  <div key={i} className="absolute text-4xl opacity-20"
                    style={decoration}>
                    {selectedBiome.emoji}
                  </div>
                ))}
              </div>

              <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Title & Description */}
                  <div className="flex-1">
                    <div className="text-5xl mb-3">{selectedBiome.emoji}</div>
                    <h3 className="text-3xl font-black text-white mb-2">{selectedBiome.name}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{selectedBiome.description}</p>

                    {/* Location */}
                    <div className="inline-block bg-black/30 backdrop-blur rounded-lg px-3 py-1.5 text-sm text-gray-300">
                      📍 {selectedBiome.location}
                    </div>
                  </div>

                  {/* Right: Stats */}
                  <div className="flex-shrink-0 w-full md:w-64 space-y-3">
                    <div className="bg-black/30 backdrop-blur rounded-xl p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <Thermometer className="w-3 h-3" /> <Trans i18nKey="auto.biomeexplorer.temperature">Temperature</Trans>
                                                                    </div>
                      <div className="text-white font-bold">{selectedBiome.temperature}</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur rounded-xl p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <Droplets className="w-3 h-3" /> <Trans i18nKey="auto.biomeexplorer.precipitation">Precipitation</Trans>
                                                                    </div>
                      <div className="text-white font-bold">{selectedBiome.precipitation}</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-1"><Trans i18nKey="auto.biomeexplorer.climate">🌤️ Climate</Trans></div>
                      <div className="text-white text-sm">{selectedBiome.climate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flora & Fauna */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <TreeDeciduous className="w-4 h-4 text-green-400" /> <Trans i18nKey="auto.biomeexplorer.flora_plants">Flora (Plants)</Trans>
                                                  </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedBiome.flora.map(f => (
                    <motion.div key={f.name} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="bg-green-500/10 rounded-lg p-3 border border-green-500/20 flex items-center gap-2">
                      <span className="text-2xl">{f.emoji}</span>
                      <span className="text-sm text-gray-300">{f.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Bug className="w-4 h-4 text-amber-400" /> <Trans i18nKey="auto.biomeexplorer.fauna_animals">Fauna (Animals)</Trans>
                                                  </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedBiome.fauna.map(f => (
                    <motion.div key={f.name} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20 flex items-center gap-2">
                      <span className="text-2xl">{f.emoji}</span>
                      <span className="text-sm text-gray-300">{f.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/20 p-5">
              <h4 className="text-sm font-bold text-white mb-3"><Trans i18nKey="auto.biomeexplorer.amazing_facts">💡 Amazing Facts</Trans></h4>
              <div className="grid md:grid-cols-3 gap-3">
                {selectedBiome.funFacts.map((fact, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-black/20 rounded-lg p-3 text-sm text-gray-300">
                    {fact}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
