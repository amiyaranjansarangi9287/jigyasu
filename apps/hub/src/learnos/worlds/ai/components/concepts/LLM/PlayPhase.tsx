import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface PlayPhaseProps {
  onComplete: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  emoji: string;
}

const questions: Question[] = [
  {
    question: "What does LLM stand for?",
    options: ["Large Learning Machine", "Large Language Model", "Little Language Model", "Long List Memory"],
    correctIndex: 1,
    explanation: "LLM stands for Large Language Model - 'Large' because it's huge, 'Language' because it works with text, and 'Model' because it's a computer program!",
    emoji: "🤖"
  },
  {
    question: "What are tokens?",
    options: ["Small coins", "Computer games", "Pieces of text that LLMs process", "Secret passwords"],
    correctIndex: 2,
    explanation: "Tokens are the small pieces that text gets broken into - like puzzle pieces that make up words and sentences!",
    emoji: "🧩"
  },
  {
    question: "How do LLMs learn?",
    options: ["By going to school", "By reading lots of text and finding patterns", "By watching TV", "By asking questions"],
    correctIndex: 1,
    explanation: "LLMs learn by reading massive amounts of text and learning patterns in how words go together!",
    emoji: "📚"
  },
  {
    question: "What do LLMs predict?",
    options: ["The weather", "The next word", "Your age", "Lottery numbers"],
    correctIndex: 1,
    explanation: "LLMs work by predicting what word should come next, one word at a time!",
    emoji: "🎯"
  },
  {
    question: "Why are LLMs called 'Large'?",
    options: ["They're physically big", "They know a lot of information", "They're loud", "They eat a lot"],
    correctIndex: 1,
    explanation: "They're called 'Large' because they contain billions of learned patterns from reading tons of text!",
    emoji: "🌟"
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
          <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-8 text-white">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold">{t('auto.learning.s907_quiz_complete', 'Quiz Complete!')}</h2>
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
                ? "🎉 Amazing! You're an LLM Expert!" 
                : percentage >= 60 
                ? "👏 Great job! You understand LLMs well!"
                : percentage >= 40
                ? "👍 Good start! Keep learning!"
                : "💪 Keep practicing! You'll get there!"}
            </p>

            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-blue-800 mb-2">🎓 What You Learned:</h3>
              <ul className="text-left text-blue-700 space-y-2">
                <li>✅ LLM = Large Language Model</li>
                <li>✅ They process text as tokens</li>
                <li>✅ They learn patterns from reading text</li>
                <li>✅ They predict the next word</li>
              </ul>
            </div>
            
            <button
              onClick={onComplete}
              className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg transition-all hover:scale-105 text-lg"
            >🎉 Complete Learning!</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🎮 LLM Quiz!</h2>
              <p className="text-blue-100">{t('auto.learning.s908_test_your_knowledge', 'Test your knowledge!')}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{score} 🌟</div>
              <div className="text-sm text-blue-100">
                Question {currentQuestion + 1}/{questions.length}
              </div>
            </div>
          </div>
          
          <div className="mt-4 h-2 bg-blue-300/30 rounded-full overflow-hidden">
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
              let buttonStyle = "bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300";
              
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
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 font-bold">
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
              isCorrect ? "bg-green-50 border-l-4 border-green-500" : "bg-orange-50 border-l-4 border-orange-500"
            )}>
              <p className={cn("font-medium mb-1", isCorrect ? "text-green-800" : "text-orange-800")}>
                {isCorrect ? "🎉 Correct!" : "💡 Not quite!"}
              </p>
              <p className={isCorrect ? "text-green-700" : "text-orange-700"}>
                {question.explanation}
              </p>
            </div>
          )}

          {showExplanation && (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              {currentQuestion < questions.length - 1 ? "Next Question →" : "See Results! 🏆"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
