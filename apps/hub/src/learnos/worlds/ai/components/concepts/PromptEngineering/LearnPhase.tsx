import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface LearnPhaseProps {
  onComplete: () => void;
}

const promptComparisons = [
  {
    bad: "Tell me about dogs",
    good: "Write 3 fun facts about golden retrievers that a 10-year-old would find interesting",
    badResponse: "Dogs are animals. They bark. People have them as pets.",
    goodResponse: "🐕 Fun Facts about Golden Retrievers:\n1. They LOVE water and are amazing swimmers!\n2. Their fluffy coat is actually two layers - one waterproof!\n3. Golden Retrievers can learn over 200 commands!",
  },
  {
    bad: "Help me with math",
    good: "Explain how to add fractions with different denominators, step by step, with an example like 1/2 + 1/3",
    badResponse: "Math involves numbers. Addition is when you put things together.",
    goodResponse: "Adding Fractions - Easy Steps! 📝\n1. Find a common denominator (2 & 3 → 6)\n2. Convert: 1/2 = 3/6 and 1/3 = 2/6\n3. Add the tops: 3/6 + 2/6 = 5/6\n✅ Answer: 5/6",
  },
  {
    bad: "Write a story",
    good: "Write a short adventure story (100 words) about a brave mouse who finds a magical ladoo, for kids age 8-10",
    badResponse: "Once upon a time, something happened. The end.",
    goodResponse: "🐭 The Magical Ladoo\n\nMax the mouse discovered a glowing ladoo in the old kitchen. When he took a bite - WHOOSH! He could fly! He soared over the village, waving to surprised monkeys. But the ladoo only worked until sunset...",
  },
];

const promptParts = [
  { name: "Task", icon: "🎯", desc: "What do you want AI to do?", example: "Write a poem" },
  { name: "Context", icon: "📋", desc: "Background information", example: "for my Mummy's birthday" },
  { name: "Format", icon: "📐", desc: "How should it look?", example: "4 lines, rhyming" },
  { name: "Style", icon: "🎨", desc: "What tone or voice?", example: "funny and cheerful" },
];

export default function LearnPhase({ onComplete }: LearnPhaseProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [selectedComparison, setSelectedComparison] = useState(0);
  const [showResponses, setShowResponses] = useState(false);

  const steps = [
    { title: "Good vs Bad Prompts", type: "comparison" },
    { title: "Parts of a Great Prompt", type: "parts" },
  ];

  const comparison = promptComparisons[selectedComparison];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🔮 The Art of Prompting</h2>
          <p className="text-yellow-100 mt-1">{steps[step].title}</p>
        </div>

        <div className="p-6">
          {step === 0 && (
            <div>
              <p className="text-center text-gray-600 mb-6">
                See how the same question asked differently gets very different answers!
              </p>

              {/* Example Selector */}
              <div className="flex justify-center gap-2 mb-6">
                {promptComparisons.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedComparison(i);
                      setShowResponses(false);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-all",
                      selectedComparison === i
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-orange-100"
                    )}
                  >
                    Example {i + 1}
                  </button>
                ))}
              </div>

              {/* Comparison */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Bad Prompt */}
                <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">❌</span>
                    <span className="font-bold text-red-700">{t('auto.learning.s921_vague_prompt', 'Vague Prompt')}</span>
                  </div>
                  <p className="text-red-800 font-mono text-sm bg-white p-3 rounded-lg">
                    "{comparison.bad}"
                  </p>
                  {showResponses && (
                    <div className="mt-3 bg-red-100 p-3 rounded-lg">
                      <p className="text-red-700 text-sm">{comparison.badResponse}</p>
                    </div>
                  )}
                </div>

                {/* Good Prompt */}
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">✅</span>
                    <span className="font-bold text-green-700">{t('auto.learning.s922_great_prompt', 'Great Prompt')}</span>
                  </div>
                  <p className="text-green-800 font-mono text-sm bg-white p-3 rounded-lg">
                    "{comparison.good}"
                  </p>
                  {showResponses && (
                    <div className="mt-3 bg-green-100 p-3 rounded-lg">
                      <p className="text-green-700 text-sm whitespace-pre-line">{comparison.goodResponse}</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowResponses(!showResponses)}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg"
              >
                {showResponses ? "Hide Responses" : "🔍 See the Difference!"}
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-center text-gray-600 mb-6">
                Great prompts have these building blocks:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {promptParts.map((part, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{part.icon}</span>
                      <span className="font-bold text-gray-800">{part.name}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{part.desc}</p>
                    <p className="text-orange-600 text-sm font-mono bg-white px-2 py-1 rounded">
                      "{part.example}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Example combined prompt */}
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-6">
                <p className="font-bold text-orange-800 mb-2">✨ All together:</p>
                <p className="text-orange-700 font-mono text-sm bg-white p-3 rounded-lg">
                  "🎯 Write a poem 📋 for my Mummy's birthday 📐 that's 4 lines and rhymes 🎨 in a funny and cheerful style"
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                <p className="text-yellow-800">
                  💡 <strong>{t('auto.learning.s923_pro_tip', 'Pro tip:')}</strong> You don't need ALL parts every time, but the more 
                  details you give, the better AI understands what you want!
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700"
            >← Back</button>

            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    i === step ? "bg-orange-500 scale-125" : i < step ? "bg-orange-300" : "bg-gray-300"
                  )}
                />
              ))}
            </div>

            {step === steps.length - 1 ? (
              <button
                onClick={onComplete}
                className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg transition-all hover:scale-105"
              >Now let me try! 🧸</button>) : (<button
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-3 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all"
              >{t('auto.learning.s924_next', 'Next →')}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
