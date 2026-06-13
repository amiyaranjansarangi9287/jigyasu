import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface PlayPhaseProps { onComplete: () => void; }

const questions = [
  { question: "What are AI 'guardrails'?", options: ["Fences on a highway", "Rules that keep AI safe and helpful", "Computer keyboards", "Robot legs"], correctIndex: 1, explanation: "Guardrails are safety rules built into AI to prevent harmful, dishonest, or dangerous outputs!", emoji: "🛡️" },
  { question: "What is a 'deepfake'?", options: ["A very deep ocean", "AI-generated fake video or audio of real people", "A type of fish", "A computer game"], correctIndex: 1, explanation: "Deepfakes use AI to create realistic but FAKE videos, images, or voices of real people!", emoji: "🎭" },
  { question: "What should you do if AI content makes you uncomfortable?", options: ["Ignore it", "Share it with friends", "Tell a trusted adult", "Delete your computer"], correctIndex: 2, explanation: "Always tell a parent, teacher, or trusted adult when something online makes you feel worried or uncomfortable!", emoji: "👨‍👩‍👧" },
  { question: "How can you spot AI-generated images?", options: ["They're always blurry", "Check for odd details like extra fingers or weird text", "AI images have watermarks always", "You can't — they're perfect"], correctIndex: 1, explanation: "Look for strange details: extra fingers, garbled text, odd backgrounds, or faces that look slightly 'off'!", emoji: "🔍" },
  { question: "Before sharing content online, you should...", options: ["Share immediately for likes", "Verify it's real first", "Add more filters", "Send to everyone"], correctIndex: 1, explanation: "Always verify content is real before sharing! Spreading fake info hurts everyone.", emoji: "⏸️" },
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

  const handleAnswer = (i: number) => { if (selectedAnswer !== null) return; setSelectedAnswer(i); setShowExplanation(true); if (i === question.correctIndex) setScore(s => s + 1); };
  const handleNext = () => { if (currentQuestion < questions.length - 1) { setCurrentQuestion(q => q + 1); setSelectedAnswer(null); setShowExplanation(false); } else setGameComplete(true); };

  if (gameComplete) {
    const pct = (score / questions.length) * 100;
    const stars = pct >= 80 ? 3 : pct >= 60 ? 2 : pct >= 40 ? 1 : 0;
    return (<div className="max-w-2xl mx-auto"><div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center">
        <div className="bg-gradient-to-r from-sky-400 to-blue-600 p-8 text-white"><div className="text-6xl mb-4">🏆</div><h2 className="text-3xl font-bold">{t('auto.learning.s881_quiz_complete', 'Quiz Complete!')}</h2></div>
        <div className="p-6 sm:p-8">
          <div className="text-5xl mb-4">{[...Array(3)].map((_, i) => (<span key={i} className={i < stars ? "" : "opacity-30"}>⭐</span>))}</div>
          <p className="text-2xl font-bold text-gray-800 mb-2">You scored {score} out of {questions.length}!</p>
          <p className="text-gray-600 mb-8">{pct >= 80 ? "🎉 Amazing! You're an AI Safety Expert!" : pct >= 60 ? "👏 Great job!" : "👍 Keep learning!"}</p>
          <div className="bg-sky-50 rounded-2xl p-6 mb-6"><h3 className="font-bold text-sky-800 mb-2">🎓 What You Learned:</h3>
            <ul className="text-left text-sky-700 space-y-2"><li>✅ AI guardrails keep AI safe</li><li>✅ Deepfakes can fool you</li><li>✅ Always verify before sharing</li><li>✅ Ask adults when unsure</li></ul>
          </div>
          <button onClick={onComplete} className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg transition-all hover:scale-105 text-lg">🎉 Complete!</button>
        </div>
      </div></div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto"><div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 sm:p-6 text-white">
        <div className="flex justify-between items-center"><div><h2 className="text-xl sm:text-2xl font-bold">🎮 Safety Quiz!</h2></div><div className="text-right"><div className="text-2xl font-bold">{score} 🌟</div><div className="text-sm text-sky-100">{currentQuestion + 1}/{questions.length}</div></div></div>
        <div className="mt-3 h-2 bg-sky-300/30 rounded-full overflow-hidden"><div className="h-full bg-white transition-all" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} /></div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="text-center mb-6"><span className="text-5xl mb-4 block">{question.emoji}</span><h3 className="text-lg sm:text-xl font-bold text-gray-800">{question.question}</h3></div>
        <div className="grid gap-3 mb-6">
          {question.options.map((opt, i) => {
            let s = "bg-gray-50 hover:bg-sky-50 border-gray-200 hover:border-sky-300";
            if (selectedAnswer !== null) { if (i === question.correctIndex) s = "bg-green-100 border-green-500 text-green-800"; else if (i === selectedAnswer) s = "bg-red-100 border-red-500 text-red-800"; else s = "bg-gray-50 border-gray-200 opacity-50"; }
            return (<button key={i} onClick={() => handleAnswer(i)} disabled={selectedAnswer !== null} className={cn("p-3 sm:p-4 rounded-xl border-2 text-left font-medium transition-all text-sm sm:text-base", s, selectedAnswer === null && "hover:scale-[1.02]")}><span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 text-sky-600 mr-2 sm:mr-3 font-bold text-sm">{String.fromCharCode(65 + i)}</span>{opt}</button>);
          })}
        </div>
        {showExplanation && (<div className={cn("p-4 rounded-xl mb-6", isCorrect ? "bg-green-50 border-l-4 border-green-500" : "bg-orange-50 border-l-4 border-orange-500")}><p className={cn("font-medium mb-1", isCorrect ? "text-green-800" : "text-orange-800")}>{isCorrect ? "🎉 Correct!" : "💡 Not quite!"}</p><p className={isCorrect ? "text-green-700" : "text-orange-700"}>{question.explanation}</p></div>)}
        {showExplanation && (<button onClick={handleNext} className="w-full py-3 sm:py-4 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg transition-all">{currentQuestion < questions.length - 1 ? "Next Question →" : "See Results! 🏆"}</button>)}
      </div>
    </div></div>
  );
}
