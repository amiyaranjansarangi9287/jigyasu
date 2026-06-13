import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface ExplorePhaseProps {
  onComplete: () => void;
}

const promptBlocks = {
  task: [
    "Write a short story",
    "Create a poem",
    "Explain how",
    "List 5 facts about",
  ],
  topic: [
    "dragons",
    "robots",
    "the ocean",
    "space travel",
  ],
  audience: [
    "for a 5-year-old",
    "for kids who love science",
    "for someone who's never heard of it",
    "for a curious beginner",
  ],
  style: [
    "in a funny way",
    "like a teacher",
    "with lots of emojis",
    "keeping it simple",
  ],
};

export default function ExplorePhase({ onComplete }: ExplorePhaseProps) {
  const { t } = useTranslation();
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedAudience, setSelectedAudience] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [hasExplored, setHasExplored] = useState(false);

  const buildPrompt = () => {
    const parts = [selectedTask, selectedTopic, selectedAudience, selectedStyle]
      .filter(Boolean);
    return parts.join(" ").trim();
  };

  const prompt = buildPrompt();
  const completeness = [selectedTask, selectedTopic, selectedAudience, selectedStyle]
    .filter(Boolean).length;

  const selectBlock = (category: string, value: string) => {
    setHasExplored(true);
    switch (category) {
      case 'task': setSelectedTask(value); break;
      case 'topic': setSelectedTopic(value); break;
      case 'audience': setSelectedAudience(value); break;
      case 'style': setSelectedStyle(value); break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🧸 Prompt Builder</h2>
          <p className="text-yellow-100 mt-1">{t('auto.learning.s914_build_your_own_prompt_by_clicking_blocks', 'Build your own prompt by clicking blocks!')}</p>
        </div>

        <div className="p-6">
          {/* Block Categories */}
          <div className="space-y-4 mb-6">
            {/* Task */}
            <div>
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                <span className="text-lg">🎯</span>What should AI do?</label>
              <div className="flex flex-wrap gap-2">
                {promptBlocks.task.map(item => (
                  <button
                    key={item}
                    onClick={() => selectBlock('task', item)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      selectedTask === item
                        ? "bg-orange-500 text-white"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                <span className="text-lg">📋</span>{t('auto.learning.s915_about_what', 'About what?')}</label>
              <div className="flex flex-wrap gap-2">
                {promptBlocks.topic.map(item => (
                  <button
                    key={item}
                    onClick={() => selectBlock('topic', item)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      selectedTopic === item
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div>
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                <span className="text-lg">👤</span>{t('auto.learning.s916_for_who', 'For who?')}</label>
              <div className="flex flex-wrap gap-2">
                {promptBlocks.audience.map(item => (
                  <button
                    key={item}
                    onClick={() => selectBlock('audience', item)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      selectedAudience === item
                        ? "bg-green-500 text-white"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                <span className="text-lg">🎨</span>{t('auto.learning.s917_what_style', 'What style?')}</label>
              <div className="flex flex-wrap gap-2">
                {promptBlocks.style.map(item => (
                  <button
                    key={item}
                    onClick={() => selectBlock('style', item)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      selectedStyle === item
                        ? "bg-purple-500 text-white"
                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Built Prompt Display */}
          <div className="bg-slate-900 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-400 text-sm font-medium">{t('auto.learning.s918_your_prompt', 'Your Prompt:')}</span>
              <span className="text-gray-400 text-xs">
                {completeness}/4 parts added
              </span>
            </div>
            <p className={cn(
              "text-white font-mono min-h-[60px] p-3 bg-slate-800 rounded-lg",
              !prompt && "text-gray-500 italic"
            )}>
              {prompt || "Click blocks above to build your prompt..."}
            </p>
          </div>

          {/* Quality Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{t('auto.learning.s919_prompt_quality', 'Prompt Quality')}</span>
              <span className="text-sm text-gray-500">
                {completeness === 4 ? "🌟 Excellent!" : completeness >= 2 ? "👍 Good" : "Keep adding!"}
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  completeness === 4 ? "bg-green-500" :
                  completeness >= 2 ? "bg-yellow-500" : "bg-orange-500"
                )}
                style={{ width: `${(completeness / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl mb-6">
            <p className="text-yellow-800">
              💡 <strong>{t('auto.learning.s920_try_it', 'Try it:')}</strong> Mix and match different blocks to create unique prompts! 
              The more specific your prompt, the better AI can help you.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onComplete}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all",
                hasExplored
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-500"
              )}
            >Ready to Play! 🎮</button>
          </div>
        </div>
      </div>
    </div>
  );
}
