import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils/cn';

interface PlayPhaseProps {
  onComplete: () => void;
}

const questions = [
  {
    question: "What should you do before trusting AI's answer?",
    options: ["Nothing, AI is always right", "Verify it with other sources", "Delete it immediately", "Share it everywhere"],
    correctIndex: 1,
    explanation: "Always verify AI's answers! AI can make mistakes, so checking with reliable sources is important.",
    emoji: "🔍"
  },
  {
    question: "If you use AI to help with homework, you should...",
    options: ["Pretend you did it all yourself", "Be honest and tell your teacher", "Use AI for all answers", "Never tell anyone"],
    correctIndex: 1,
    explanation: "Honesty is key! Let your teacher know when AI helped you - it's part of learning to use tools responsibly.",
    emoji: "📚"
  },
  {
    question: "What personal information should you NEVER share with AI?",
    options: ["Your favorite color", "Your home address and password", "Your favorite food", "What games you like"],
    correctIndex: 1,
    explanation: "Never share sensitive info like addresses, phone numbers, or passwords with AI!",
    emoji: "🔒"
  },
  {
    question: "What does 'AI bias' mean?",
    options: ["AI loves robots", "AI might treat some people unfairly", "AI is too smart", "AI likes certain colors"],
    correctIndex: 1,
    explanation: "AI bias means AI might accidentally be unfair to certain groups of people - we should watch for this!",
    emoji: "⚖️"
  },
  {
    question: "Using AI to help you write is okay, but...",
    options: ["You should claim it's all your work", "You should understand and learn from it", "You should never read it", "You should only use it for everything"],
    correctIndex: 1,
    explanation: "AI should help you learn, not replace your learning! Understand what AI writes and learn from it.",
    emoji: "✨"
  },
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

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === question.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameComplete(true);
    }
  };

  if (gameComplete) {
    const percentage = (score / questions.length) * 100;
    const stars = percentage >= 80 ? 3 : percentage >= 60 ? 2 : percentage >= 40 ? 1 : 0;
    
    return (<div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center">
          <div className="bg-gradient-to-r from-rose-400 to-pink-500 p-8 text-white">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold">{t('auto.learning.s876_quiz_complete', 'Quiz Complete!')}</h2>
          </div>
          
          <div className="p-8">
            <div className="text-5xl mb-4">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={i < stars ? "" : "opacity-30"}>⭐</span>
              ))}
            </div>
            
            <p className="text-2xl font-bold text-gray-800 mb-2">
              You scored {score} out of {questions.length}!
            </p>
            
            <p className="text-gray-600 mb-8">
              {percentage >= 80 
                ? "🎉 Amazing! You're an AI Ethics Champion!" 
                : percentage >= 60 
                ? "👏 Great job! You understand AI ethics well!"
                : percentage >= 40
                ? "👍 Good start! Keep learning!"
                : "💪 Keep practicing! Ethics matters!"}
            </p>

            <div className="bg-rose-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-rose-800 mb-2">🎓 What You Learned:</h3>
              <ul className="text-left text-rose-700 space-y-2">
                <li>{t('auto.worlds_ai_components_concepts_AIEthics_PlayPhase.always_verify_ai_s_answers', "✅ Always verify AI's answers")}</li>
                <li>✅ Be honest about using AI</li>
                <li>✅ Keep personal info private</li>
                <li>✅ Think about fairness and kindness</li>
              </ul>
            </div>
            
            <button
              onClick={onComplete}
              className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg transition-all hover:scale-105 text-lg"
            >🎉 Complete Learning!</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🎮 Ethics Quiz!</h2>
              <p className="text-rose-100">{t('auto.learning.s877_test_your_knowledge', 'Test your knowledge!')}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{score} 🌟</div>
              <div className="text-sm text-rose-100">
                Question {currentQuestion + 1}/{questions.length}
              </div>
            </div>
          </div>
          
          <div className="mt-4 h-2 bg-rose-300/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <span className="text-5xl mb-4 block">{question.emoji}</span>
            <h3 className="text-xl font-bold text-gray-800">{question.question}</h3>
          </div>

          <div className="grid gap-3 mb-6">
            {question.options.map((option, index) => {
              let buttonStyle = "bg-gray-50 hover:bg-rose-50 border-gray-200 hover:border-rose-300";
              
              if (selectedAnswer !== null) {
                if (index === question.correctIndex) {
                  buttonStyle = "bg-green-100 border-green-500 text-green-800";
                } else if (index === selectedAnswer) {
                  buttonStyle = "bg-red-100 border-red-500 text-red-800";
                } else {
                  buttonStyle = "bg-gray-50 border-gray-200 opacity-50";
                }
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left font-medium transition-all",
                    buttonStyle,
                    selectedAnswer === null && "hover:scale-[1.02]"
                  )}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600 mr-3 font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className={cn(
              "p-4 rounded-xl mb-6",
              isCorrect ? "bg-green-50 border-l-4 border-green-500" : "bg-rose-50 border-l-4 border-rose-500"
            )}>
              <p className={cn("font-medium mb-1", isCorrect ? "text-green-800" : "text-rose-800")}>
                {isCorrect ? "🎉 Correct!" : "💡 Let's learn!"}
              </p>
              <p className={isCorrect ? "text-green-700" : "text-rose-700"}>
                {question.explanation}
              </p>
            </div>
          )}

          {showExplanation && (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              {currentQuestion < questions.length - 1 ? "Next Question →" : "See Results! 🏆"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
