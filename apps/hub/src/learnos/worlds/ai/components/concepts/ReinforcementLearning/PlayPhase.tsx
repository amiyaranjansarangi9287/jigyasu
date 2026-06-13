import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface PlayPhaseProps { onComplete: () => void; }

const questions = [
  { question: "What is Reinforcement Learning?", options: ["Learning from a textbook", "Learning from rewards and penalties", "Learning from watching videos", "Learning from a teacher"], correctIndex: 1, explanation: "RL is all about learning from rewards (for good actions) and penalties (for bad actions)!", emoji: "🎮" },
  { question: "What is the 'Agent' in RL?", options: ["The teacher", "The score", "The learner that makes decisions", "The game"], correctIndex: 2, explanation: "The agent is the learner - like a robot or game character - that decides what to do!", emoji: "🤖" },
  { question: "How does an RL agent learn?", options: ["By reading books", "By trying things and seeing the results", "By being programmed with every answer", "By sleeping"], correctIndex: 1, explanation: "RL agents learn by trial and error - trying actions and learning from what happens!", emoji: "🔄" },
  { question: "Which uses Reinforcement Learning?", options: ["A flashlight", "Game AI that learns to play", "A calculator", "A pencil"], correctIndex: 1, explanation: "Game AI characters that learn to beat levels use Reinforcement Learning!", emoji: "🕹️" },
  { question: "What's the goal in RL?", options: ["Use the most energy", "Get the most reward over time", "Make the most mistakes", "Be the slowest"], correctIndex: 1, explanation: "The goal is to maximize total reward - make the best decisions over time!", emoji: "⭐" },
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
  const handleNext = () => { if (currentQuestion < questions.length - 1) { setCurrentQuestion(q => q + 1); setSelectedAnswer(null); setShowExplanation(false); } else { setGameComplete(true); } };

  if (gameComplete) {
    const percentage = (score / questions.length) * 100;
    const stars = percentage >= 80 ? 3 : percentage >= 60 ? 2 : percentage >= 40 ? 1 : 0;
    return (<div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center">
          <div className="bg-gradient-to-r from-emerald-400 to-lime-500 p-8 text-white">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold">{t('auto.learning.s951_quiz_complete', 'Quiz Complete!')}</h2>
          </div>
          <div className="p-6 sm:p-8">
            <div className="text-5xl mb-4">{[...Array(3)].map((_, i) => (<span key={i} className={i < stars ? "" : "opacity-30"}>⭐</span>))}</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">You scored {score} out of {questions.length}!</p>
            <p className="text-gray-600 mb-8">{percentage >= 80 ? "🎉 Amazing! You're an RL Expert!" : percentage >= 60 ? "👏 Great job!" : "👍 Keep learning!"}</p>
            <div className="bg-emerald-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-emerald-800 mb-2">🎓 What You Learned:</h3>
              <ul className="text-left text-emerald-700 space-y-2">
                <li>✅ RL = learning from rewards and penalties</li>
                <li>✅ Agent, Environment, Reward</li>
                <li>✅ Trial and error is the key</li>
                <li>✅ Used in games, robots, and more!</li>
              </ul>
            </div>
            <button onClick={onComplete} className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:shadow-lg transition-all hover:scale-105 text-lg">🎉 Complete!</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-lime-500 p-4 sm:p-6 text-white">
          <div className="flex justify-between items-center">
            <div><h2 className="text-xl sm:text-2xl font-bold">🎮 RL Quiz!</h2></div>
            <div className="text-right"><div className="text-2xl font-bold">{score} 🌟</div><div className="text-sm text-emerald-100">{currentQuestion + 1}/{questions.length}</div></div>
          </div>
          <div className="mt-3 h-2 bg-emerald-300/30 rounded-full overflow-hidden"><div className="h-full bg-white transition-all" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} /></div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="text-center mb-6"><span className="text-5xl mb-4 block">{question.emoji}</span><h3 className="text-lg sm:text-xl font-bold text-gray-800">{question.question}</h3></div>
          <div className="grid gap-3 mb-6">
            {question.options.map((option, index) => {
              let s = "bg-gray-50 hover:bg-emerald-50 border-gray-200 hover:border-emerald-300";
              if (selectedAnswer !== null) { if (index === question.correctIndex) s = "bg-green-100 border-green-500 text-green-800"; else if (index === selectedAnswer) s = "bg-red-100 border-red-500 text-red-800"; else s = "bg-gray-50 border-gray-200 opacity-50"; }
              return (<button key={index} onClick={() => handleAnswer(index)} disabled={selectedAnswer !== null} className={cn("p-3 sm:p-4 rounded-xl border-2 text-left font-medium transition-all text-sm sm:text-base", s, selectedAnswer === null && "hover:scale-[1.02]")}><span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-600 mr-2 sm:mr-3 font-bold text-sm">{String.fromCharCode(65 + index)}</span>{option}</button>);
            })}
          </div>
          {showExplanation && (<div className={cn("p-4 rounded-xl mb-6", isCorrect ? "bg-green-50 border-l-4 border-green-500" : "bg-orange-50 border-l-4 border-orange-500")}><p className={cn("font-medium mb-1", isCorrect ? "text-green-800" : "text-orange-800")}>{isCorrect ? "🎉 Correct!" : "💡 Not quite!"}</p><p className={isCorrect ? "text-green-700" : "text-orange-700"}>{question.explanation}</p></div>)}
          {showExplanation && (<button onClick={handleNext} className="w-full py-3 sm:py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:shadow-lg transition-all">{currentQuestion < questions.length - 1 ? "Next Question →" : "See Results! 🏆"}</button>)}
        </div>
      </div>
    </div>
  );
}
