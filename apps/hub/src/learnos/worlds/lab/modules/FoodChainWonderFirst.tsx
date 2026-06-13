// src/worlds/lab/modules/FoodChainWonderFirst.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

const CHAINS = [
  { id: 'grassland' as const, emoji: '🌾', name: 'Grassland', description: 'Sun → Grass → Rabbit → Fox' },
  { id: 'ocean' as const, emoji: '🌊', name: 'Ocean', description: 'Sun → Plankton → Fish → Shark' },
  { id: 'forest' as const, emoji: '🌲', name: 'Forest', description: 'Sun → Trees → Deer → Tiger' },
  { id: 'pond' as const, emoji: '🏞️', name: 'Pond', description: 'Sun → Algae → Frog → Heron' },
];

// Exploration Component
function ExplorationComponent() {
  const [chain, setChain] = useState<'grassland' | 'ocean' | 'forest' | 'pond'>('grassland');
  const { language } = useLearnerStore();

  const handleChainChange = useCallback((c: typeof chain) => {
    setChain(c);
    LearningService.trackEvent('food-chain-wonder-session', 'lab', language, 'chain_change', 'food-chain', { chain: c });
  }, [language]);

  const currentChain = CHAINS.find(c => c.id === chain);

  return (
    <div className="space-y-6">
      {/* Chain selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {CHAINS.map(c => (
          <button 
            key={c.id} 
            onClick={() => handleChainChange(c.id)} 
            className={`px-4 py-3 rounded-xl font-bold transition ${chain === c.id ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
          >
            <div className="text-xl">{c.emoji}</div>
            <div className="text-sm">{c.name}</div>
          </button>
        ))}
      </div>

      {/* Food chain visualization */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="text-8xl mb-4">{currentChain?.emoji}</div>
          <div className="text-2xl font-bold text-slate-800 mb-2">{currentChain?.name}</div>
          <div className="text-sm text-slate-500">{currentChain?.description}</div>
        </div>
      </div>

      {/* Energy flow diagram */}
      <div className="bg-green-50 rounded-2xl p-5 text-center">
        <div className="text-sm text-green-600 font-bold"><Trans i18nKey="auto.foodchainwonderfirst.sun_producer_consumer_decompos">Sun → Producer → Consumer → Decomposer</Trans></div>
        <div className="text-sm text-green-400 mt-2"><Trans i18nKey="auto.foodchainwonderfirst.energy_flows_from_the_sun_thro">Energy flows from the sun through every living thing!</Trans></div>
      </div>

      {/* Four chains grid */}
      <div className="grid grid-cols-2 gap-3">
        {CHAINS.map(c => (
          <div key={c.id} className={`p-4 rounded-xl text-center ${chain === c.id ? 'bg-green-100' : 'bg-slate-50'}`}>
            <div className="text-3xl mb-2">{c.emoji}</div>
            <div className="font-bold text-slate-700 text-sm">{c.name}</div>
          </div>
        ))}
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.foodchainwonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.foodchainwonderfirst.where_does_the_energy_in_the_f">• Where does the energy in the food chain come from?</Trans></li>
          <li><Trans i18nKey="auto.foodchainwonderfirst.what_happens_if_one_link_in_th">• What happens if one link in the chain disappears?</Trans></li>
          <li><Trans i18nKey="auto.foodchainwonderfirst.why_are_there_fewer_predators_">• Why are there fewer predators than prey?</Trans></li>
          <li><Trans i18nKey="auto.foodchainwonderfirst.how_do_decomposers_complete_th">• How do decomposers complete the cycle?</Trans></li>
        </ul>
      </div>
    </div>
  );
}

export default function FoodChainWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const foodChainWonderModule: WonderFirstModule = {
    id: 'food-chain-wonder',
    mystery: {
      question: "If all the grass disappeared, what would happen to the rabbits? And if all the rabbits disappeared, what would happen to the foxes? How are all living things connected?",
      visual: "🔗",
      hook: "Animals eat other animals to survive, but have you ever wondered what happens if one species disappears? How are all living things connected in a chain?",
    },
    exploration: {
      instructions: "Explore different food chains in various habitats. What patterns do you notice about how energy flows? What happens if one link in the chain breaks?",
      hints: [
        "Start with the grassland. Who eats what?",
        "Try the ocean. How is it similar or different?",
        "Explore the forest and pond chains.",
        "Think about what would happen if one species disappeared.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "All living things are connected in food chains! Energy flows from the sun to producers (plants) to consumers (animals) to decomposers (fungi, bacteria). Each link in the chain depends on the previous one for energy. If one link breaks, the whole chain is affected! This is why biodiversity is so important - more species means more stable food chains. Energy decreases at each level (10% rule), which is why there are fewer predators than prey - there's not enough energy to support many top predators!",
      connection: "The mystery of how living things are connected is solved: they're linked in food chains! The key insight is that energy flows from the sun through all living things, but decreases at each level. This is why food chains are limited in length - there's not enough energy to support many levels. When one species disappears, the whole chain is affected, which is why protecting biodiversity is crucial for ecosystem stability!",
      ahaMoment: "Food chains connect all living things - energy flows from the sun through producers, consumers, and decomposers, decreasing at each level!",
    },
    application: {
      realWorld: "Understanding food chains helps us protect ecosystems, manage wildlife populations, and even understand human impact on nature. When we protect habitats, we protect entire food chains. This is why conservation efforts focus on preserving biodiversity.",
      indianContext: "The Bishnoi community (1485 CE) in Rajasthan sacrificed 363 lives to protect trees - inspiring the modern Chipko movement. Ancient Indian texts describe Ahimsa (non-violence) and the interconnectedness of all life - core ecological principles. The concept of 'Prana' (life force) recognizes that all living beings share the same energy. The Arthashastra (traditionally dated around 300 BCE) described forest management and wildlife protection. Sacred groves (Devaranya) preserved biodiversity through religious practices, protecting entire ecosystems and their food chains.\n\n🌾 **Pongal Connection**: Pongal celebrates the harvest and the agricultural food chain. Farmers understand that crops (producers) feed humans and animals (consumers), and that the cycle continues with decomposers returning nutrients to the soil. The festival honors the sun as the ultimate energy source that powers all food chains. The traditional Pongal dish represents the bounty of the agricultural food chain.\n\n🎨 **Holi Connection**: Holi celebrates the arrival of spring when food chains come alive with new growth. The festival's use of natural colors from flowers and plants connects to the producer level of food chains. The vibrant celebrations reflect the abundance of spring when food chains are most active.\n\n👨‍🔬 **Salim Ali (1896-1987)** - Birdman of India, studied food chains in ecosystems and pioneered conservation efforts to protect biodiversity.\n\n👨‍🔬 **M.S. Swaminathan (born 1925)** - Father of India's Green Revolution, emphasized sustainable agriculture that respects natural food chains.\n\n👨‍🔬 **R. Sukumar (born 1953)** - Studied elephant food chains and habitat conservation in India.\n\n👨‍🔬 **A.P.J. Abdul Kalam (1931-2015)** - Emphasized the importance of protecting ecosystems and food chains for future generations.\n\n👩‍🔬 **Janaki Ammal (1897-1984)** - Pioneering Indian botanist who studied plant genetics and worked on improving crop varieties, contributing to our understanding of plant biology and food chains.",
      tryIt: "Next time you see an animal eating, think about the food chain it's part of. Where does its energy come from? And what would happen if that animal disappeared? Remember: all living things are connected in food chains, and protecting one species means protecting the entire chain!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={foodChainWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
