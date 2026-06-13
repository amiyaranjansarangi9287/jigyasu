import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface ExplorePhaseProps { onComplete: () => void; }

const checklistItems = [
  { id: 1, icon: '🔍', title: 'Check the Source', desc: 'Is it from a trusted website or person?', tip: 'Look for official domains, verified accounts, and known news sources.' },
  { id: 2, icon: '🤔', title: 'Does It Make Sense?', desc: 'Is this claim realistic or too wild?', tip: 'If it sounds too good/bad to be true, it probably is!' },
  { id: 3, icon: '📰', title: 'Multiple Sources', desc: 'Can you find the same info elsewhere?', tip: 'Real news appears on multiple trusted sites. Fake news usually has only one source.' },
  { id: 4, icon: '🧐', title: 'Look at Details', desc: 'Are there weird visual glitches or odd wording?', tip: 'AI images may have extra fingers, weird text, or blurry backgrounds.' },
  { id: 5, icon: '🗣️', title: 'Ask Someone', desc: 'When unsure, ask a parent or teacher!', tip: 'Adults with experience can often spot fakes that kids might miss.' },
  { id: 6, icon: '⏸️', title: 'Pause Before Sharing', desc: 'Don\'t share until you\'ve verified!', tip: 'Sharing fake info hurts everyone. Verify first, then share if it\'s real.' },
];

export default function ExplorePhase({ onComplete }: ExplorePhaseProps) {
  const { t } = useTranslation();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [checked, setChecked] = useState<number[]>([]);

  const toggleCheck = (id: number) => {
    setChecked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const allChecked = checked.length === checklistItems.length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 sm:p-6 text-white">
          <h2 className="text-xl sm:text-2xl font-bold">🧸 Safety Checklist Builder</h2>
          <p className="text-sky-100 mt-1 text-sm">Build your personal AI Safety checklist!</p>
        </div>

        <div className="p-4 sm:p-6">
          <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
            Tap each item to learn more, then check it off when you understand it!
          </p>

          <div className="space-y-3 mb-6">
            {checklistItems.map(item => (
              <div key={item.id} className="rounded-xl border-2 border-gray-200 overflow-hidden transition-all">
                <button
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCheck(item.id); }}
                    className={cn(
                      "w-8 h-8 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all",
                      checked.includes(item.id) ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                    )}
                  >
                    {checked.includes(item.id) && '✓'}
                  </button>
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <span className="text-gray-400">{expandedItem === item.id ? '▲' : '▼'}</span>
                </button>
                
                {expandedItem === item.id && (
                  <div className="px-4 pb-4 ml-11">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-700 text-sm">💡 <strong>{t('auto.learning.s878_tip', 'Tip:')}</strong> {item.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{t('auto.learning.s879_checklist_progress', 'Checklist Progress')}</span>
              <span className="text-blue-600 font-medium">{checked.length}/{checklistItems.length}</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300" style={{ width: `${(checked.length / checklistItems.length) * 100}%` }} />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={onComplete} className={cn("px-6 py-3 rounded-xl font-medium transition-all", allChecked ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:scale-105" : "bg-gray-200 text-gray-500")}>Ready to Play! 🎮</button>
          </div>
        </div>
      </div>
    </div>
  );
}
