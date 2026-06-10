// src/worlds/lab/modules/HabitatsWonderFirst.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

const HABITATS = [
  { id: 'forest' as const, emoji: '🌲', name: 'Forest', description: 'Trees and wildlife', climate: 'Moderate, rainy' },
  { id: 'ocean' as const, emoji: '🌊', name: 'Ocean', description: 'Saltwater world', climate: 'Varies by depth' },
  { id: 'desert' as const, emoji: '🏜️', name: 'Desert', description: 'Dry and sandy', climate: 'Hot, very dry' },
  { id: 'arctic' as const, emoji: '❄️', name: 'Arctic', description: 'Frozen lands', climate: 'Very cold' },
];

// Exploration Component
function ExplorationComponent() {
  const [habitat, setHabitat] = useState<'forest' | 'ocean' | 'desert' | 'arctic'>('forest');
  const { language } = useLearnerStore();

  const handleHabitatChange = useCallback((h: typeof habitat) => {
    setHabitat(h);
    LearningService.trackEvent('habitats-wonder-session', 'lab', language, 'habitat_change', 'habitats', { habitat: h });
  }, [language]);

  const currentHabitat = HABITATS.find(h => h.id === habitat);

  return (
    <div className="space-y-6">
      {/* Habitat selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {HABITATS.map(h => (
          <button 
            key={h.id} 
            onClick={() => handleHabitatChange(h.id)} 
            className={`px-4 py-3 rounded-xl font-bold transition ${habitat === h.id ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
          >
            <div className="text-xl">{h.emoji}</div>
            <div className="text-sm">{h.name}</div>
          </button>
        ))}
      </div>

      {/* Habitat visualization */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="text-8xl mb-4">{currentHabitat?.emoji}</div>
          <div className="text-2xl font-bold text-slate-800 mb-2">{currentHabitat?.name}</div>
          <div className="text-sm text-slate-500 mb-2">{currentHabitat?.description}</div>
          <div className="text-xs text-green-600 font-medium"><Trans i18nKey="auto.habitatswonderfirst.climate">Climate:</Trans> {currentHabitat?.climate}</div>
        </div>
      </div>

      {/* Four habitats grid */}
      <div className="grid grid-cols-2 gap-3">
        {HABITATS.map(h => (
          <div key={h.id} className={`p-4 rounded-xl text-center ${habitat === h.id ? 'bg-green-100' : 'bg-slate-50'}`}>
            <div className="text-3xl mb-2">{h.emoji}</div>
            <div className="font-bold text-slate-700 text-sm">{h.name}</div>
            <div className="text-xs text-slate-500 mt-1">{h.climate}</div>
          </div>
        ))}
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.habitatswonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.habitatswonderfirst.how_do_animals_adapt_to_differ">• How do animals adapt to different habitats?</Trans></li>
          <li><Trans i18nKey="auto.habitatswonderfirst.what_makes_each_habitat_unique">• What makes each habitat unique?</Trans></li>
          <li><Trans i18nKey="auto.habitatswonderfirst.why_can_t_all_animals_live_in_">• Why can't all animals live in all habitats?</Trans></li>
          <li><Trans i18nKey="auto.habitatswonderfirst.how_do_habitats_change_with_se">• How do habitats change with seasons?</Trans></li>
        </ul>
      </div>
    </div>
  );
}

export default function HabitatsWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const habitatsWonderModule: WonderFirstModule = {
    id: 'habitats-wonder',
    mystery: {
      question: "Why do polar bears live in the Arctic and camels in the desert? Why can't all animals live everywhere? What makes a place the right home for some animals but not others?",
      visual: "🌲",
      hook: "Animals live in many different places - forests, oceans, deserts, and more. But have you ever wondered why each animal lives where it does? What makes a habitat the right home?",
    },
    exploration: {
      instructions: "Explore different habitats and think about what makes each one unique. What adaptations do animals need to survive in each habitat? Why can't all animals live everywhere?",
      hints: [
        "Start with the forest. What do animals need there?",
        "Try the ocean. How is it different from the forest?",
        "Explore the desert and Arctic. What challenges do they present?",
        "Think about real-life animals and where they live.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Animals live where they can survive! Each habitat provides specific conditions - temperature, water, food, and shelter. Animals have adaptations (special features) that help them survive in their habitat. Polar bears have thick fur for cold weather, camels store water for dry conditions, fish have gills for underwater breathing, and forest animals climb trees for safety. An animal can only live where its adaptations match the habitat's conditions!",
      connection: "The mystery of why animals live where they do is solved: it's about matching adaptations to habitat conditions! The key insight is that animals have special features (adaptations) that help them survive in specific conditions. A polar bear would overheat in the desert, and a camel would freeze in the Arctic. Each animal is perfectly suited to its habitat - not by choice, but by evolution over millions of years. This is why biodiversity is so important - different habitats support different animals, and losing a habitat means losing the animals that depend on it!",
      ahaMoment: "Animals live where their adaptations match the habitat - each habitat provides specific conditions that only certain animals can survive in!",
    },
    application: {
      realWorld: "Understanding habitats helps us protect endangered species, manage ecosystems, and even plan cities sustainably. When we destroy habitats, we lose the animals that depend on them. Conservation efforts focus on protecting habitats to save biodiversity.",
      indianContext: "India has 4 biodiversity hotspots - among the world's most diverse regions! From Himalayan snow leopards to Western Ghats frogs, India's habitats are incredibly diverse. Ancient Indians practiced Van Prastha (forest conservation) 3,000 years before modern ecology. The Arthashastra (300 BCE) described forest management and wildlife protection. Indian kings established protected hunting grounds. Sacred groves (Devaranya) preserved biodiversity through religious practices. The Sundarbans mangrove forest is home to the Bengal tiger and countless other species.\n\n🌾 **Pongal Connection**: Pongal celebrates the agricultural habitat - the farm ecosystem where humans and nature work together. The festival honors the habitat that provides food and livelihood. Farmers understand the importance of maintaining healthy soil, water, and biodiversity for sustainable agriculture. The festival reminds us that habitats are not just for wild animals - they're also the foundation of human civilization.\n\n🎨 **Holi Connection**: Holi celebrates the arrival of spring when habitats come alive with new growth. The festival's use of natural colors from flowers and plants connects to the diversity of plant habitats. The vibrant colors reflect the biodiversity of forests and fields during spring.\n\n👨‍🔬 **Salim Ali (1896-1987)** - Birdman of India, pioneered ornithology and habitat conservation, documenting over 1,300 bird species across India's diverse habitats.\n\n👨‍🔬 **M.S. Swaminathan (born 1925)** - Father of India's Green Revolution, emphasized the importance of habitat conservation for sustainable agriculture.\n\n👨‍🔬 **R. Sukumar (born 1953)** - Renowned elephant biologist who studies Asian elephant habitats and conservation.\n\n👨‍🔬 **A.P.J. Abdul Kalam (1931-2015)** - Scientist and President who emphasized the importance of protecting habitats for future generations.",
      tryIt: "Next time you visit a park, forest, or even just look out your window, think about the habitat around you. What animals live there? What adaptations do they have? And remember: every animal is perfectly suited to its habitat - not by choice, but by millions of years of evolution. Protecting habitats means protecting the animals that depend on them!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={habitatsWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
