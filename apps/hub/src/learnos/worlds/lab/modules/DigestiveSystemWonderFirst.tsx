// src/worlds/lab/modules/DigestiveSystemWonderFirst.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

const STAGES = [
  { id: 0, name: 'Mouth', emoji: '👄', desc: 'Teeth chew food, saliva starts breaking it down' },
  { id: 1, name: 'Esophagus', emoji: '📍', desc: 'Muscle tube pushes food to stomach' },
  { id: 2, name: 'Stomach', emoji: '🫙', desc: 'Acid breaks food into soup-like mixture' },
  { id: 3, name: 'Small Intestine', emoji: '🌀', desc: 'Nutrients absorbed through villi' },
  { id: 4, name: 'Large Intestine', emoji: '🔄', desc: 'Water absorbed, waste prepared' },
];

// Exploration Component
function ExplorationComponent() {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { language } = useLearnerStore();

  const handleStageChange = useCallback((stage: number) => {
    setCurrentStage(stage);
    LearningService.trackEvent('digestive-wonder-session', 'lab', language, 'canvas_interaction', 'digestive', { stage });
  }, [language]);

  const togglePlay = useCallback(() => setIsPlaying(prev => !prev), []);

  return (
    <div className="space-y-6">
      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className={`w-full px-5 py-3 rounded-xl text-sm font-medium transition ${
          isPlaying
            ? 'bg-pink-600 text-white hover:bg-pink-700'
            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
        }`}
      >
        {isPlaying ? '⏸️ Pause Journey' : '▶️ Play Journey'}
      </button>

      {/* Stage selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex justify-between gap-2">
          {STAGES.map((stage) => (
            <button
              key={stage.id}
              onClick={() => handleStageChange(stage.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                currentStage === stage.id
                  ? 'bg-pink-100 text-pink-700 border-2 border-pink-300'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <div className="text-lg mb-1">{stage.emoji}</div>
              <div>{stage.name}</div>
            </button>
          ))}
        </div>
        <div className="mt-3 text-center text-sm text-slate-500">
          {STAGES[currentStage].desc}
        </div>
      </div>

      {/* Digestive system visualization */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="text-8xl mb-4">{STAGES[currentStage].emoji}</div>
          <div className="text-2xl font-bold text-slate-800 mb-2">{STAGES[currentStage].name}</div>
          <div className="text-sm text-slate-500">{STAGES[currentStage].desc}</div>
        </div>
      </div>

      {/* Fun facts */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-rose-50 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">📏</div>
          <div className="font-bold text-rose-600 text-sm"><Trans i18nKey="auto.digestivesystemwonderfirst.6m_long">6m Long</Trans></div>
          <p className="text-sm text-rose-400 mt-1"><Trans i18nKey="auto.digestivesystemwonderfirst.small_intestine_length">Small intestine length</Trans></p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">⏱️</div>
          <div className="font-bold text-orange-600 text-sm"><Trans i18nKey="auto.digestivesystemwonderfirst.24_72_hrs">24-72 hrs</Trans></div>
          <p className="text-sm text-orange-400 mt-1"><Trans i18nKey="auto.digestivesystemwonderfirst.total_digestion_time">Total digestion time</Trans></p>
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.digestivesystemwonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.digestivesystemwonderfirst.how_does_food_change_at_each_s">• How does food change at each stage?</Trans></li>
          <li><Trans i18nKey="auto.digestivesystemwonderfirst.why_does_the_body_need_to_brea">• Why does the body need to break food down?</Trans></li>
          <li><Trans i18nKey="auto.digestivesystemwonderfirst.what_would_happen_if_one_stage">• What would happen if one stage didn't work?</Trans></li>
          <li><Trans i18nKey="auto.digestivesystemwonderfirst.how_does_the_body_absorb_nutri">• How does the body absorb nutrients?</Trans></li>
        </ul>
      </div>
    </div>
  );
}

export default function DigestiveSystemWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const digestiveWonderModule: WonderFirstModule = {
    id: 'digestive-system-wonder',
    mystery: {
      question: "When you eat an apple, where does it go? How does your body turn food into energy? And what happens to the parts your body can't use?",
      visual: "🍎",
      hook: "We eat every day, but have you ever wondered what happens to food inside your body? How does it become the energy that powers everything you do?",
    },
    exploration: {
      instructions: "Explore the journey of food through the digestive system. What happens at each stage? How does the body break down food and absorb nutrients?",
      hints: [
        "Start with the mouth. What happens when you chew?",
        "Follow food to the stomach. What does acid do?",
        "Explore the intestines. How are nutrients absorbed?",
        "Think about why digestion takes so long.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Digestion is a multi-stage process that breaks food into tiny molecules your body can use! In the mouth, teeth break food into smaller pieces while saliva starts chemical digestion. The esophagus uses muscle contractions to push food to the stomach. The stomach uses strong acid and enzymes to break food into a liquid mixture. The small intestine (6 meters long!) absorbs nutrients through tiny finger-like projections called villi. The large intestine absorbs water, and waste is eliminated. The entire process takes 24-72 hours, turning food into the energy that powers your body!",
      connection: "The mystery of what happens to food is solved: it's broken down into energy! The key insight is that digestion is a multi-stage process where food is mechanically and chemically broken down into molecules small enough to be absorbed. Each organ has a specific job - mouth for initial breakdown, stomach for chemical digestion, small intestine for nutrient absorption, and large intestine for water recovery. The 6-meter small intestine maximizes surface area for absorption, and the 24-72 hour timeline ensures complete digestion. This is how your body turns food into the energy that powers everything you do!",
      ahaMoment: "Digestion breaks food into energy-absorbing molecules through a multi-stage journey - mouth to stomach to intestines, taking 24-72 hours!",
    },
    application: {
      realWorld: "Understanding digestion helps us make healthy food choices, recognize digestive problems, and appreciate how our bodies work. It's why chewing food thoroughly is important, why we need fiber, and why certain foods cause discomfort.",
      indianContext: "Ayurveda described Agni (digestive fire) 5,000 years ago! The concept of Jatharagni - the stomach's digestive power - matches modern understanding of stomach acid (HCl) and enzymes. Spices like turmeric and ginger were known to boost digestion long before science proved it. The Sushruta Samhita (traditionally dated around 600 BCE) described the digestive system with remarkable accuracy. Ancient Indian medicine emphasized the importance of proper digestion for overall health, prescribing dietary guidelines and herbal remedies. The concept of 'Agni' as the transformative force in the body parallels modern understanding of metabolism.\n\n🌾 **Pongal Connection**: Pongal celebrates the harvest and the food that nourishes our bodies. The traditional Pongal dish is made with rice and lentils, foods that require proper digestion. The festival honors the digestive fire (Agni) that transforms food into energy. The cooking of Pongal in earthen pots connects to traditional cooking methods that preserve digestive health. The festival reminds us that food is not just sustenance - it's the fuel that powers our bodies through the miracle of digestion.\n\n🎨 **Holi Connection**: Holi celebrations include traditional sweets and foods that are easy to digest. The festival's use of natural ingredients in foods reflects Ayurvedic principles of digestive health. The vibrant colors and joyful celebrations stimulate appetite and digestion, showing the connection between emotional well-being and digestive health.\n\n👨‍🔬 **Sushruta (traditionally dated around 600 BCE)** - Ancient Indian surgeon who described the digestive system in the Sushruta Samhita with remarkable accuracy.\n\n👨‍🔬 **Charaka (traditionally dated around 300 BCE)** - Author of the Charaka Samhita, described digestion, metabolism, and the importance of Agni for health.\n\n👨‍🔬 **V. Ramalingaswami (1921-2001)** - Renowned Indian physician who studied digestive physiology and nutrition.\n\n👨‍🔬 **M.S. Swaminathan (born 1925)** - Worked on nutrition and food security, understanding the connection between diet and digestive health.\n\n👩‍🔬 **Kamala Sohonie (1912–1998)** - First Indian woman to earn a PhD in science, studied biochemistry and nutrition, advancing our understanding of how food provides energy.",
      tryIt: "Next time you eat, pay attention to the process - chewing, swallowing, and how your stomach feels. And remember: your body is breaking down that food into tiny molecules that will become the energy powering everything you do. The 6-meter small intestine inside you is working hard to absorb every nutrient. Digestion is the amazing process that turns food into you!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={digestiveWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
