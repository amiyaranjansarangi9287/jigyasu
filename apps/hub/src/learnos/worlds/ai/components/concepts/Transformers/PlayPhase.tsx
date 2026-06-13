import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface PlayPhaseProps {
  onComplete: () => void;
}

const questions = [
  {
    question: "What's special about how Transformers read text?",
    options: ["They read one word at a time", "They read all words at once", "They skip words", "They only read short sentences"],
    correctIndex: 1,
    explanation: "Transformers can process entire sentences at once, seeing all words simultaneously!",
    emoji: "⚡"
  },
  {
    question: "What is 'Attention' in Transformers?",
    options: ["A way to stay focused in class", "How words relate to each other", "A type of memory", "A computer button"],
    correctIndex: 1,
    explanation: "Attention helps the model understand how each word relates to every other word in a sentence!",
    emoji: "🎯"
  },
  {
    question: "In 'The cat ate its food', what does 'its' pay attention to?",
    options: ["food", "cat", "ate", "The"],
    correctIndex: 1,
    explanation: "'its' refers to 'cat', so the attention mechanism connects these two words!",
    emoji: "🐱"
  },
  {
    question: "Why are Transformers better than older methods?",
    options: ["They're louder", "They can understand context better", "They're smaller", "They only work at night"],
    correctIndex: 1,
    explanation: "By seeing all words at once and using attention, Transformers understand context much better!",
    emoji: "🧠"
  },
  {
    question: "Which of these uses Transformers?",
    options: ["A calculator", "ChatGPT", "A light bulb", "A bicycle"],
    correctIndex: 1,
    explanation: "ChatGPT and most modern AI language tools are powered by Transformer technology!",
    emoji: "🤖"
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
          <div className="bg-gradient-to-r from-orange-400 to-red-500 p-8 text-white">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold">{t('auto.learning.s958_quiz_complete', 'Quiz Complete!')}</h2>
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
                ? "🎉 Amazing! You're a Transformer Expert!" 
                : percentage >= 60 
                ? "👏 Great job! You understand Transformers well!"
                : percentage >= 40
                ? "👍 Good start! Keep learning!"
                : "💪 Keep practicing! You'll get there!"}
            </p>

            <div className="bg-orange-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-orange-800 mb-2">🎓 What You Learned:</h3>
              <ul className="text-left text-orange-700 space-y-2">
                <li>✅ Transformers read all words at once</li>
                <li>✅ Attention connects related words</li>
                <li>✅ They understand context better</li>
                <li>✅ They power ChatGPT and many AI tools</li>
              </ul>
            </div>
            
            <button
              onClick={onComplete}
              className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg transition-all hover:scale-105 text-lg"
            >🎉 Complete Learning!</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🎮 Transformer Quiz!</h2>
              <p className="text-orange-100">{t('auto.learning.s959_test_your_knowledge', 'Test your knowledge!')}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{score} 🌟</div>
              <div className="text-sm text-orange-100">
                Question {currentQuestion + 1}/{questions.length}
              </div>
            </div>
          </div>
          
          <div className="mt-4 h-2 bg-orange-300/30 rounded-full overflow-hidden">
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
              let buttonStyle = "bg-gray-50 hover:bg-orange-50 border-gray-200 hover:border-orange-300";
              
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
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-3 font-bold">
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
              className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              {currentQuestion < questions.length - 1 ? "Next Question →" : "See Results! 🏆"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
