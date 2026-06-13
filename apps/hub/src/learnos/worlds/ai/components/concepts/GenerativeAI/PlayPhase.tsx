import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface PlayPhaseProps { onComplete: () => void; }

const questions = [
  { question: "What does Generative AI do?", options: ["Only analyzes data", "Creates new content like images and text", "Only deletes things", "Only copies existing content"], correctIndex: 1, explanation: "Generative AI creates brand new content — images, text, music, and more — that never existed before!", emoji: "🎨" },
  { question: "How do diffusion models create images?", options: ["By copying other images", "By starting with noise and gradually forming an image", "By taking photos", "By using a printer"], correctIndex: 1, explanation: "Diffusion models start with random noise and learn to remove it step by step until a clear image forms!", emoji: "✨" },
  { question: "Which is an example of Generative AI?", options: ["A calculator", "ChatGPT", "A thermometer", "A clock"], correctIndex: 1, explanation: "ChatGPT is a generative AI that creates new text responses based on what you ask!", emoji: "🤖" },
  { question: "What should you do with AI-generated content?", options: ["Claim you made it yourself", "Be honest that AI helped create it", "Never show anyone", "Delete it immediately"], correctIndex: 1, explanation: "Always be honest about AI-generated content — transparency is important!", emoji: "🤝" },
  { question: "What helps Generative AI create better results?", options: ["Vague, unclear prompts", "Detailed, specific prompts", "No prompts at all", "Random keyboard mashing"], correctIndex: 1, explanation: "Better, more detailed prompts guide the AI to create exactly what you want!", emoji: "🎯" },
];

export default function PlayPhase({ onComplete }: PlayPhaseProps) {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctIndex;

  const handleAnswer = (index: number) => { if (selectedAnswer !== null) return; setSelectedAnswer(index); setShowExplanation(true); if (index === question.correctIndex) setScore(s => s + 1); };
  const handleNext = () => { if (currentQuestion < questions.length - 1) { setCurrentQuestion(q => q + 1); setSelectedAnswer(null); setShowExplanation(false); } else setGameComplete(true); };

  if (gameComplete) {
    const percentage = (score / questions.length) * 100;
    const stars = percentage >= 80 ? 3 : percentage >= 60 ? 2 : percentage >= 40 ? 1 : 0;
    return (<div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center">
          <div className="bg-gradient-to-r from-fuchsia-400 to-purple-500 p-8 text-white">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold">{t('auto.learning.s900_quiz_complete', 'Quiz Complete!')}</h2>
          </div>
          <div className="p-6 sm:p-8">
            <div className="text-5xl mb-4">{[...Array(3)].map((_, i) => (<span key={i} className={i < stars ? "" : "opacity-30"}>⭐</span>))}</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">You scored {score} out of {questions.length}!</p>
            <p className="text-gray-600 mb-8">{percentage >= 80 ? "🎉 Amazing! You're a Gen AI Expert!" : percentage >= 60 ? "👏 Great job!" : "👍 Keep learning!"}</p>
            <div className="bg-fuchsia-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-fuchsia-800 mb-2">🎓 What You Learned:</h3>
              <ul className="text-left text-fuchsia-700 space-y-2">
                <li>✅ Gen AI creates new content</li>
                <li>✅ Diffusion turns noise into images</li>
                <li>✅ Better prompts = better results</li>
                <li>✅ Always be honest about AI content!</li>
              </ul>
            </div>
            <button onClick={onComplete} className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white hover:shadow-lg transition-all hover:scale-105 text-lg">🎉 Complete!</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-fuchsia-500 to-purple-500 p-4 sm:p-6 text-white">
          <div className="flex justify-between items-center">
            <div><h2 className="text-xl sm:text-2xl font-bold">🎮 Gen AI Quiz!</h2></div>
            <div className="text-right"><div className="text-2xl font-bold">{score} 🌟</div><div className="text-sm text-fuchsia-100">{currentQuestion + 1}/{questions.length}</div></div>
          </div>
          <div className="mt-3 h-2 bg-fuchsia-300/30 rounded-full overflow-hidden"><div className="h-full bg-white transition-all" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} /></div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="text-center mb-6"><span className="text-5xl mb-4 block">{question.emoji}</span><h3 className="text-lg sm:text-xl font-bold text-gray-800">{question.question}</h3></div>
          <div className="grid gap-3 mb-6">
            {question.options.map((option, index) => {
              let s = "bg-gray-50 hover:bg-fuchsia-50 border-gray-200 hover:border-fuchsia-300";
              if (selectedAnswer !== null) { if (index === question.correctIndex) s = "bg-green-100 border-green-500 text-green-800"; else if (index === selectedAnswer) s = "bg-red-100 border-red-500 text-red-800"; else s = "bg-gray-50 border-gray-200 opacity-50"; }
              return (<button key={index} onClick={() => handleAnswer(index)} disabled={selectedAnswer !== null} className={cn("p-3 sm:p-4 rounded-xl border-2 text-left font-medium transition-all text-sm sm:text-base", s, selectedAnswer === null && "hover:scale-[1.02]")}><span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-fuchsia-100 text-fuchsia-600 mr-2 sm:mr-3 font-bold text-sm">{String.fromCharCode(65 + index)}</span>{option}</button>);
            })}
          </div>
          {showExplanation && (<div className={cn("p-4 rounded-xl mb-6", isCorrect ? "bg-green-50 border-l-4 border-green-500" : "bg-orange-50 border-l-4 border-orange-500")}><p className={cn("font-medium mb-1", isCorrect ? "text-green-800" : "text-orange-800")}>{isCorrect ? "🎉 Correct!" : "💡 Not quite!"}</p><p className={isCorrect ? "text-green-700" : "text-orange-700"}>{question.explanation}</p></div>)}
          {showExplanation && (<button onClick={handleNext} className="w-full py-3 sm:py-4 rounded-xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white hover:shadow-lg transition-all">{currentQuestion < questions.length - 1 ? "Next Question →" : "See Results! 🏆"}</button>)}
        </div>
      </div>
    </div>
  );
}
