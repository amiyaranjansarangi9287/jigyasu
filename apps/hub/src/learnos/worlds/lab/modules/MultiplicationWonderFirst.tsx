// src/worlds/lab/modules/MultiplicationWonderFirst.tsx
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
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const { language } = useLearnerStore();

  const handleRowsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setRows(val);
    LearningService.trackEvent('multiplication-wonder-session', 'lab', language, 'rows_change', 'multiplication', { rows: val, cols });
  }, [language, cols]);

  const handleColsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCols(val);
    LearningService.trackEvent('multiplication-wonder-session', 'lab', language, 'cols_change', 'multiplication', { rows, cols: val });
  }, [language, rows]);

  const total = rows * cols;

  return (
    <div className="space-y-6">
      {/* Visual Array */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400"><Trans i18nKey="auto.multiplicationwonderfirst.rows">↕️ Rows</Trans></span>
            <span className="text-sm font-bold text-emerald-600">{rows}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="12" 
            value={rows} 
            onChange={handleRowsChange} 
            className="w-full h-3 rounded-full appearance-none cursor-pointer" 
            style={{ background: 'linear-gradient(to right, #10B981, #059669)' }} 
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400"><Trans i18nKey="auto.multiplicationwonderfirst.columns">↔️ Columns</Trans></span>
            <span className="text-sm font-bold text-teal-600">{cols}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="12" 
            value={cols} 
            onChange={handleColsChange} 
            className="w-full h-3 rounded-full appearance-none cursor-pointer" 
            style={{ background: 'linear-gradient(to right, #14B8A6, #0D9488)' }} 
          />
        </div>
      </div>

      {/* Result Display */}
      <div className="bg-emerald-50 rounded-2xl p-5 text-center">
        <div className="text-2xl font-bold text-emerald-600">{rows} × {cols} = {total}</div>
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.multiplicationwonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.multiplicationwonderfirst.what_happens_when_you_increase">• What happens when you increase the rows?</Trans></li>
          <li><Trans i18nKey="auto.multiplicationwonderfirst.what_happens_when_you_increase">• What happens when you increase the columns?</Trans></li>
          <li><Trans i18nKey="auto.multiplicationwonderfirst.can_you_predict_the_total_befo">• Can you predict the total before counting?</Trans></li>
          <li><Trans i18nKey="auto.multiplicationwonderfirst.what_pattern_do_you_see_in_the">• What pattern do you see in the numbers?</Trans></li>
        </ul>
      </div>
    </div>
  );
}

export default function MultiplicationWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const multiplicationWonderModule: WonderFirstModule = {
    id: 'multiplication-wonder',
    mystery: {
      question: "If you have 3 rows of 4 stars each, how many stars do you have in total? Is multiplication just repeated addition, or is there something deeper going on?",
      visual: "✖️",
      hook: "We use multiplication every day, but have you ever wondered what it really means? Why does 3 × 4 give you 12? What's the hidden pattern?",
    },
    exploration: {
      instructions: "Explore what happens when you change the number of rows and columns. Watch how the array grows and shrinks. What patterns do you notice about how multiplication works?",
      hints: [
        "Set rows to 3 and columns to 4. Count the total - is it 12?",
        "Now try rows 4 and columns 3. Is the total the same or different?",
        "What happens when you double the rows? Does the total double too?",
        "Think about real-life examples - arranging chairs, packing boxes, sharing cookies.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Multiplication is not just repeated addition - it's a way of counting in groups! When we say 3 × 4, we mean '3 groups of 4' or '4 groups of 3' - both give us 12. The order doesn't matter (commutative property) because we're just rearranging the same items into different groupings. Multiplication helps us count large quantities quickly by organizing them into equal groups.",
      connection: "The mystery of what multiplication means is solved: it's counting in groups! Instead of adding 4 + 4 + 4, we can simply say 3 × 4 = 12. The key insight is that multiplication is about organizing things into equal groups and counting those groups efficiently. This is why 3 × 4 = 4 × 3 - we're just looking at the same 12 items from a different perspective.",
      ahaMoment: "Multiplication is counting in groups - a shortcut for repeated addition that lets us count large quantities quickly!",
    },
    application: {
      realWorld: "We use multiplication every day: calculating area (length × width), shopping (price × quantity), cooking (recipe scaling), and time (hours × days). Understanding multiplication helps us solve real problems efficiently.",
      indianContext: "Ancient Indians developed sophisticated multiplication methods in Vedic mathematics (1000 BCE). The Urdhva Tiryagbhyam (vertical and crosswise) method can multiply large numbers faster than traditional methods! Aryabhata worked with multiplication tables and algebraic operations. Indian markets still use multiplication for pricing - 'do hazar' (two thousand), 'paanch sau' (five hundred). During festivals, we multiply ingredients to feed large gatherings!\n\n🪔 **Diwali Connection**: During Diwali, families prepare sweets in large quantities. If each family member eats 5 ladoos and you have 8 family members, you need 5 × 8 = 40 ladoos! The festival teaches us to plan and multiply resources to ensure everyone has enough to celebrate.\n\n🎨 **Holi Connection**: Holi celebrations involve preparing colors in bulk. If each color packet makes 2 liters of colored water and you need 6 colors, you need 2 × 6 = 12 liters total! The festival's vibrant celebrations require multiplication to ensure enough colors for everyone to play.\n\n🌾 **Pongal Connection**: Pongal harvest celebrations involve sharing rice with the community. If each family receives 5 kg of rice and there are 12 families, you need 5 × 12 = 60 kg of rice! The festival teaches us to multiply our blessings by sharing with others.\n\n👨‍🔬 **Aryabhata (476-550 CE)** - Developed multiplication tables and algebraic operations, working with large numbers and calculations 1,500 years before European mathematicians.\n\n👨‍🔬 **Brahmagupta (598-668 CE)** - Formalized multiplication rules including negative numbers, showing how multiplication works with different types of numbers.\n\n👨‍🔬 **Bhaskara II (1114-1185 CE)** - In his work Lilavati, he explained multiplication through practical problems and stories, making mathematics accessible to students.\n\n👨‍🔬 **Srinivasa Ramanujan (1887-1920)** - Mathematical genius who discovered patterns in multiplication and number theory, showing the beauty hidden in mathematical operations.",
      tryIt: "Next time you're arranging items - books on a shelf, chairs at a table, or cookies on a plate - think about the multiplication involved. How many rows? How many columns? What's the total? And remember: multiplication is just counting in groups - a powerful shortcut that helps us count large quantities quickly!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={multiplicationWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
