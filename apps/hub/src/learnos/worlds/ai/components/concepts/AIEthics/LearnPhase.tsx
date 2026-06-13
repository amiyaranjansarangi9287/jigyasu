import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface LearnPhaseProps {
  onComplete: () => void;
}

const scenarios = [
  {
    title: "The Homework Helper",
    situation: "Alex uses AI to write their entire book report without reading the book.",
    options: [
      { text: "This is fine - AI is a tool!", correct: false },
      { text: "Not okay - Alex should read the book and use AI only for help", correct: true },
    ],
    explanation: "AI should help us learn, not do our learning for us! Alex is missing out on actually reading the book and learning from it.",
    icon: "📚"
  },
  {
    title: "The Honest Artist",
    situation: "Maya creates an AI-generated painting and enters it in a 'draw by hand' art contest.",
    options: [
      { text: "Not okay - she should be honest that AI made it", correct: true },
      { text: "It's fine because it looks good", correct: false },
    ],
    explanation: "Honesty is important! If a contest is for hand-drawn art, using AI without saying so is not being truthful.",
    icon: "🎨"
  },
  {
    title: "The Private Info",
    situation: "A website asks you to type your home address into an AI chatbot to 'help you better'.",
    options: [
      { text: "Share it - the AI needs it", correct: false },
      { text: "Don't share personal info with AI!", correct: true },
    ],
    explanation: "Never share personal information like addresses, phone numbers, or passwords with AI systems!",
    icon: "🏠"
  },
  {
    title: "The Fact Checker",
    situation: "Rahul's AI says that dolphins are fish. Rahul knows they're mammals.",
    options: [
      { text: "Trust the AI - computers are always right", correct: false },
      { text: "Trust what Rahul knows - AI made a mistake", correct: true },
    ],
    explanation: "AI can make mistakes! Always use your own knowledge and check facts from reliable sources.",
    icon: "🐬"
  },
];

const ethicsRules = [
  { icon: "✓", title: "Do Check", items: ["Verify AI answers", "Ask for help using AI", "Credit AI when you use it", "Think about fairness"] },
  { icon: "✗", title: "Don't Do", items: ["Share personal info", "Pretend AI work is yours", "Use AI to be mean", "Believe everything AI says"] },
];

export default function LearnPhase({ onComplete }: LearnPhaseProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const steps = [
    { title: "Right or Wrong?", type: "scenarios" },
    { title: "AI Ethics Rules", type: "rules" },
  ];

  const scenario = scenarios[currentScenario];

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(s => s + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setStep(1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🔮 Learning AI Ethics</h2>
          <p className="text-rose-100 mt-1">{steps[step].title}</p>
        </div>

        <div className="p-6">
          {step === 0 && (
            <div>
              <p className="text-center text-gray-600 mb-6">
                Is this the right way to use AI? You decide!
              </p>

              {/* Scenario Card */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 mb-6">
                <div className="text-center mb-4">
                  <span className="text-5xl">{scenario.icon}</span>
                  <h3 className="text-xl font-bold text-gray-800 mt-2">{scenario.title}</h3>
                </div>
                <p className="text-gray-700 text-center mb-6">
                  {scenario.situation}
                </p>

                {/* Options */}
                <div className="space-y-3">
                  {scenario.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(i)}
                      disabled={showResult}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 text-left font-medium transition-all",
                        showResult
                          ? option.correct
                            ? "bg-green-100 border-green-500 text-green-800"
                            : "bg-red-100 border-red-500 text-red-800"
                          : "bg-white border-gray-200 hover:border-rose-300 hover:bg-rose-50"
                      )}
                    >
                      {option.text}
                      {showResult && option.correct && " ✓"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              {showResult && (
                <div className={cn(
                  "p-4 rounded-xl mb-6",
                  scenario.options[selectedOption!].correct
                    ? "bg-green-50 border-l-4 border-green-500"
                    : "bg-rose-50 border-l-4 border-rose-500"
                )}>
                  <p className="font-bold mb-1">
                    {scenario.options[selectedOption!].correct ? "🎉 Great thinking!" : "🤔 Let's think again..."}
                  </p>
                  <p className="text-gray-700">{scenario.explanation}</p>
                </div>
              )}

              {showResult && (
                <button
                  onClick={nextScenario}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg"
                >
                  {currentScenario < scenarios.length - 1 ? "Next Scenario →" : "See the Rules →"}
                </button>
              )}

              {/* Progress */}
              <div className="flex justify-center gap-2 mt-4">
                {scenarios.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-3 h-3 rounded-full",
                      i === currentScenario ? "bg-rose-500" : i < currentScenario ? "bg-green-400" : "bg-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-center text-gray-600 mb-6">
                Remember these important rules for using AI ethically:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {ethicsRules.map((rule, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-xl p-6",
                      i === 0 ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"
                    )}
                  >
                    <h3 className={cn(
                      "text-xl font-bold mb-4 flex items-center gap-2",
                      i === 0 ? "text-green-700" : "text-red-700"
                    )}>
                      <span className="text-2xl">{rule.icon}</span>
                      {rule.title}
                    </h3>
                    <ul className="space-y-2">
                      {rule.items.map((item, j) => (
                        <li key={j} className={cn(
                          "flex items-center gap-2",
                          i === 0 ? "text-green-700" : "text-red-700"
                        )}>
                          <span>{i === 0 ? "✅" : "❌"}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl">
                <p className="text-rose-700">
                  💜 <strong>{t('auto.learning.s875_remember', 'Remember:')}</strong> YOU are in charge! AI is a tool to help you, 
                  but you decide how to use it responsibly and kindly.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => {
                if (step === 1) {
                  setStep(0);
                  setCurrentScenario(0);
                  setSelectedOption(null);
                  setShowResult(false);
                }
              }}
              disabled={step === 0}
              className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700"
            >← Back</button>

            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    i === step ? "bg-rose-500 scale-125" : i < step ? "bg-rose-300" : "bg-gray-300"
                  )}
                />
              ))}
            </div>

            {step === steps.length - 1 ? (
              <button
                onClick={onComplete}
                className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg transition-all hover:scale-105"
              >Now let me try! 🧸</button>) : (<div className="w-24" /> 
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
