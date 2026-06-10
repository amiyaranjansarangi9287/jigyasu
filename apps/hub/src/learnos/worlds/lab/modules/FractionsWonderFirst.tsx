// src/worlds/lab/modules/FractionsWonderFirst.tsx
// Wonder-First Redesign of Fractions Module
// Mission Alignment: Wonder Value - "We begin with questions, not answers"

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import FractionsCanvas from './FractionsCanvas';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

export default function FractionsWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(4);
  const connectionOptimization = useConnectionOptimization();

  const handleNumChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setNumerator(Math.min(val, denominator));
    LearningService.trackEvent('fractions-wonder-session', 'lab', language, 'numerator_change', 'fractions', { numerator: val, denominator });
  }, [language, denominator]);

  const handleDenChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setDenominator(val);
    setNumerator(prev => Math.min(prev, val));
    LearningService.trackEvent('fractions-wonder-session', 'lab', language, 'denominator_change', 'fractions', { numerator, denominator: val });
  }, [language, numerator]);

  // Interactive exploration component
  const ExplorationComponent = (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4">
        <FractionsCanvas numerator={numerator} denominator={denominator} />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400"><Trans i18nKey="auto.fractionswonderfirst.parts_taken_numerator">🔢 Parts taken (numerator)</Trans></span>
            <span className="text-sm font-bold text-amber-600">{numerator}</span>
          </div>
          <input
            type="range"
            min="0"
            max={denominator}
            value={numerator}
            onChange={handleNumChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{ background: 'linear-gradient(to right, #F59E0B, #EF4444)' }}
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400"><Trans i18nKey="auto.fractionswonderfirst.total_parts_denominator">📊 Total parts (denominator)</Trans></span>
            <span className="text-sm font-bold text-orange-600">{denominator}</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={denominator}
            onChange={handleDenChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{ background: 'linear-gradient(to right, #3B82F6, #8B5CF6)' }}
          />
        </div>
      </div>

      {/* Percentage display */}
      <div className="bg-amber-50 rounded-2xl p-5 text-center">
        <div className="text-2xl font-bold text-amber-600">
          {numerator}/{denominator} = {(numerator / denominator * 100).toFixed(0)}%
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
        <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.fractionswonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.fractionswonderfirst.what_happens_when_you_increase">• What happens when you increase the denominator but keep the numerator the same?</Trans></li>
          <li><Trans i18nKey="auto.fractionswonderfirst.what_happens_when_you_increase">• What happens when you increase the numerator to match the denominator?</Trans></li>
          <li><Trans i18nKey="auto.fractionswonderfirst.how_does_the_visual_representa">• How does the visual representation change with different fractions?</Trans></li>
          <li><Trans i18nKey="auto.fractionswonderfirst.what_does_1_2_look_like_compar">• What does 1/2 look like compared to 1/4 or 1/8?</Trans></li>
        </ul>
      </div>
    </div>
  );

  // Wonder-First module configuration
  const fractionsWonderModule: WonderFirstModule = {
    id: 'fractions-wonder',
    mystery: {
      question: "If you share 1 roti equally among 4 people, each gets 1/4. But what does '1/4' really mean? Is it a number? A piece? Something else?",
      visual: "🍕",
      hook: "We use fractions every day, but have you ever wondered what they actually represent? What does it mean to have 'a part of a whole'?",
    },
    exploration: {
      instructions: "Explore what happens when you change the numerator (parts taken) and denominator (total parts). Watch how the visual representation changes. What patterns do you notice about how fractions represent parts of a whole?",
      hints: [
        "Try setting the denominator to 4 and the numerator to 2. What does 2/4 look like?",
        "Now try denominator 2 and numerator 1. Does 1/2 look the same as 2/4?",
        "What happens when numerator equals denominator? What does that represent?",
        "Think about sharing food - how would you explain fractions using rotis or sweets?",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "A fraction is not just a number - it's a relationship between parts and wholes. The numerator tells us how many parts we have, and the denominator tells us how many equal parts make up the whole. Fractions represent fair sharing, not just mathematical notation. When we say 1/4, we mean 'one part out of four equal parts that make up the whole.'",
      connection: "The mystery of what fractions mean is solved: they're a way to describe fair sharing and parts of a whole. The key insight is that the denominator must always represent equal parts - otherwise the fraction doesn't make sense. This is why 2/4 equals 1/2 - they represent the same amount of the whole, just divided differently!",
      ahaMoment: "Fractions are the language of fair sharing! They describe how we divide things equally among people.",
    },
    application: {
      realWorld: "We use fractions every day: cooking (half a cup), time (quarter past), money (half a rupee), and sharing (divide a pizza among friends). Understanding fractions helps us make fair decisions and measure things accurately.",
      indianContext: "Ancient Indians used fractions in the Sulba Sutras (800 BCE) for constructing sacred altars with precise measurements. Aryabhata worked with fractions of fractions - 1,500 years before European mathematicians formalized fraction arithmetic. In Indian markets, we still use fractions: 'aadha kilo' (half kilogram), 'sava kilo' (1.25 kilogram), 'pauna kilo' (0.75 kilogram). During festivals, sweets are divided using fractions to ensure everyone gets an equal share!\n\n🪔 **Diwali & Raksha Bandhan Connection**: During Diwali, families share mithai (sweets) equally among all members - a perfect example of fractions in action! If you have 12 laddoos to share among 4 family members, each gets 12/4 = 3 laddoos. During Raksha Bandhan, sisters tie rakhi on brothers' wrists and brothers give gifts - often sharing sweets equally. The concept of 'equal share' (samaan bhag) is deeply embedded in Indian culture, reflecting the mathematical principle that fractions represent fair sharing.\n\n🌾 **Pongal Connection**: Pongal is a harvest festival where farmers celebrate by sharing the harvest with family, friends, and the community. The traditional Pongal dish is made from rice and jaggery, often divided equally among family members. The festival teaches us about sharing - if you harvest 100 kg of rice and share it among 5 families, each gets 100/5 = 20 kg. This practical application of fractions ensures everyone benefits from the harvest equally, reflecting the spirit of community and gratitude.\n\n🌙 **Eid Connection**: Eid al-Fitr and Eid al-Adha are festivals of celebration and sharing. During Eid, Muslims prepare special dishes like sheer khurma and biryani, which are shared with family, friends, and the less fortunate. The practice of Zakat (charity) involves giving 1/40 (2.5%) of one's wealth to those in need - a beautiful application of fractions for social good. The festival reminds us that sharing resources fairly, whether it's food or wealth, is a universal value that mathematics helps us practice.\n\n👨‍🔬 **Aryabhata (476-550 CE)** - Developed sophisticated fraction arithmetic, working with fractions of fractions and decimal-like notation 1,500 years before European mathematicians.\n\n👨‍🔬 **Brahmagupta (598-668 CE)** - Formalized rules for arithmetic with positive and negative numbers and fractions, including zero as a number.\n\n👨‍🔬 **Bhaskara II (1114-1185 CE)** - In his work Lilavati, he explained fractions through practical problems and stories, making mathematics accessible to students.\n\n👨‍🔬 **Madhava of Sangamagrama (1350-1425 CE)** - Used fractions in his infinite series for π and trigonometric functions, showing advanced understanding of fractional calculus.",
      tryIt: "Next time you share food with family or friends, think about the fractions involved. Are you dividing equally? What fraction does each person get? And remember: fractions are just the mathematics of fair sharing - something humans have been doing for thousands of years!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={fractionsWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
