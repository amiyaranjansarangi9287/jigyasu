// src/worlds/lab/modules/MagnetsWonderFirst.tsx
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
  const [magnet1Pole, setMagnet1Pole] = useState<'N' | 'S'>('N');
  const [magnet2Pole, setMagnet2Pole] = useState<'N' | 'S'>('S');
  const [distance, setDistance] = useState(150);
  const { language } = useLearnerStore();

  const handleDistanceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setDistance(val);
    LearningService.trackEvent('magnets-wonder-session', 'lab', language, 'canvas_interaction', 'magnets', { magnet1Pole, magnet2Pole, distance: val });
  }, [language, magnet1Pole, magnet2Pole]);

  const togglePole1 = useCallback(() => setMagnet1Pole(prev => prev === 'N' ? 'S' : 'N'), []);
  const togglePole2 = useCallback(() => setMagnet2Pole(prev => prev === 'N' ? 'S' : 'N'), []);

  const isAttracting = (magnet1Pole === 'N' ? 'S' : 'N') !== magnet2Pole;

  return (
    <div className="space-y-6">
      {/* Pole toggles */}
      <div className="flex justify-center gap-4">
        <button
          onClick={togglePole1}
          className={`px-6 py-3 rounded-xl font-bold text-lg transition ${
            magnet1Pole === 'N'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Trans i18nKey="auto.magnetswonderfirst.magnet_1">Magnet 1:</Trans> {magnet1Pole}
        </button>
        <button
          onClick={togglePole2}
          className={`px-6 py-3 rounded-xl font-bold text-lg transition ${
            magnet2Pole === 'N'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Trans i18nKey="auto.magnetswonderfirst.magnet_2">Magnet 2:</Trans> {magnet2Pole}
        </button>
      </div>

      {/* Distance slider */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400"><Trans i18nKey="auto.magnetswonderfirst.close">📏 Close</Trans></span>
          <span className="text-sm text-slate-400"><Trans i18nKey="auto.magnetswonderfirst.far">Far 📏</Trans></span>
        </div>
        <input
          type="range"
          min="60"
          max="250"
          value={distance}
          onChange={handleDistanceChange}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #A855F7 0%, #6366F1 100%)`,
          }}
        />
        <div className="text-center mt-2 text-sm text-slate-400">
          <Trans i18nKey="auto.magnetswonderfirst.distance">Distance:</Trans> {distance}<Trans i18nKey="auto.magnetswonderfirst.px">px</Trans>
                          </div>
      </div>

      {/* Result indicator */}
      <div className={`rounded-2xl p-5 text-center ${
        isAttracting
          ? 'bg-purple-100 border-2 border-purple-300'
          : 'bg-orange-100 border-2 border-orange-300'
      }`}>
        <div className={`text-2xl font-bold mb-2 ${isAttracting ? 'text-purple-700' : 'text-orange-700'}`}>
          {isAttracting ? '💜 ATTRACT!' : '🧡 REPEL!'}
        </div>
        <p className={`text-sm ${isAttracting ? 'text-purple-600' : 'text-orange-600'}`}>
          {isAttracting
            ? 'Opposite poles attract — they want to stick together!'
            : 'Same poles repel — they push each other away!'}
        </p>
      </div>

      {/* Magnet visualization */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="text-8xl mb-4">🧲</div>
          <div className="text-2xl font-bold text-slate-800 mb-2">
            {isAttracting ? 'Attraction' : 'Repulsion'}
          </div>
          <div className="text-sm text-slate-500">
            {isAttracting ? 'N and S poles attract each other' : 'N-N or S-S poles repel each other'}
          </div>
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.magnetswonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.magnetswonderfirst.what_happens_when_opposite_pol">• What happens when opposite poles face each other?</Trans></li>
          <li><Trans i18nKey="auto.magnetswonderfirst.what_happens_when_same_poles_f">• What happens when same poles face each other?</Trans></li>
          <li><Trans i18nKey="auto.magnetswonderfirst.how_does_distance_affect_the_m">• How does distance affect the magnetic force?</Trans></li>
          <li><Trans i18nKey="auto.magnetswonderfirst.why_do_magnets_have_two_poles">• Why do magnets have two poles?</Trans></li>
        </ul>
      </div>
    </div>
  );
}

export default function MagnetsWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const magnetsWonderModule: WonderFirstModule = {
    id: 'magnets-wonder',
    mystery: {
      question: "Why do some magnets stick together while others push apart? And why can you never find a magnet with only one pole - they always have both north and south?",
      visual: "🧲",
      hook: "Magnets can attract or repel, but have you ever wondered why? And why do they always have two poles - never just one?",
    },
    exploration: {
      instructions: "Explore what happens when you flip the poles of two magnets. What patterns do you notice about attraction and repulsion? How does distance affect the force?",
      hints: [
        "Set the poles to N and S. What happens?",
        "Try N and N or S and S. What's different?",
        "Change the distance between magnets.",
        "Think about real-life magnets - fridge magnets, compasses.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Magnets have two poles - north (N) and south (S) - and opposite poles attract while same poles repel! This is because magnetic fields are created by the alignment of tiny magnetic domains in the material. When poles are opposite (N facing S), the magnetic fields line up and pull together (attraction). When poles are the same (N facing N or S facing S), the fields push against each other (repulsion). The force gets stronger as magnets get closer, following an inverse square law. You can never have a single pole because magnetic fields always form closed loops - if you cut a magnet in half, you get two smaller magnets, each with both poles!",
      connection: "The mystery of why magnets attract and repel is solved: it's about pole alignment! The key insight is that magnets always have two poles because magnetic fields form closed loops. Opposite poles attract because their fields line up, while same poles repel because their fields push against each other. The force follows an inverse square law - stronger when closer, weaker when farther. This is why you can never isolate a single pole - cutting a magnet just creates two smaller magnets, each with both poles!",
      ahaMoment: "Opposite poles attract, same poles repel - and you can never have a single pole because magnetic fields always form closed loops!",
    },
    application: {
      realWorld: "We use magnets every day: fridge magnets, compasses, electric motors, speakers, MRI machines, and even credit cards! Understanding magnetism helps us design better technology, from simple door latches to advanced medical imaging.",
      indianContext: "Indians discovered magnetism ~600 BCE! The word 'magnet' may come from Magnesia, but Indian sailors used Ayaskanta (iron-lover) lodestones for navigation. Sushruta used magnets in surgery to remove iron arrows from wounds. Ancient Indian texts describe the use of magnetic stones for healing and navigation. The concept of 'Chumbak' (magnet) appears in Sanskrit literature. Indian craftsmen used magnets in traditional tools and toys. The compass-like device 'Matsya Yantra' was used for navigation by ancient Indian sailors.\n\n🎨 **Holi Connection**: In some regions of India, Holi celebrations include magnetic toys and games. The festival's playful nature reflects the invisible forces of attraction and repulsion in magnets. The colors of Holi - red and blue - are often used to represent the north and south poles of magnets in educational demonstrations.\n\n🌾 **Pongal Connection**: While not directly related to magnets, Pongal celebrations involve traditional games that use magnetic principles. The festival's emphasis on traditional knowledge includes understanding natural forces like magnetism. Farmers use magnetic tools and understand the Earth's magnetic field for agricultural practices.\n\n👨‍🔬 **Sushruta (600 BCE)** - Ancient Indian surgeon who used magnets in surgery to remove iron arrows from wounds, demonstrating early understanding of magnetic properties.\n\n👨‍🔬 **Baudhayana (800 BCE)** - Described magnetic properties in the Sulba Sutras, showing ancient Indian knowledge of magnetism.\n\n👨‍🔬 **C.V. Raman (1888-1970)** - Nobel laureate who studied magnetic properties of materials and their relationship to light scattering.\n\n👨‍🔬 **A.P.J. Abdul Kalam (1931-2015)** - Scientist and President who worked on magnetic materials for defense and space applications.",
      tryIt: "Next time you use a magnet, try to find its poles. What attracts and what repels? And remember: you can never isolate a single pole - if you break a magnet, you just get two smaller magnets, each with both poles. This is because magnetic fields always form closed loops, like a circle with no beginning or end!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={magnetsWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
