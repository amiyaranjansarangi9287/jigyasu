import { useState } from 'react';
import { cn } from '../../../utils/cn';
import { useTranslation } from 'react-i18next';

interface LearnPhaseProps {
  onComplete: () => void;
}

const documents = [
  { id: 1, title: "Weather Report", content: "Today is sunny with a high of 24°C. Perfect weather for outdoor activities!", icon: "☀️" },
  { id: 2, title: "Recipe Book", content: "To make chocolate cake: Mix flour, cocoa, sugar, eggs, and butter. Bake at 180°C for 30 minutes.", icon: "🍰" },
  { id: 3, title: "Space Facts", content: "Mars is called the Red Planet. It has two moons: Phobos and Deimos. A day on Mars is 24.6 hours.", icon: "🚀" },
  { id: 4, title: "Animal Encyclopedia", content: "Dolphins are mammals that live in water. They use echolocation to find food and communicate.", icon: "🐬" },
  { id: 5, title: "Sports News", content: "The championship game ended with a score of 3-2. The winning team celebrated their victory!", icon: "⚽" },
];

const questions = [
  { question: "What's the weather like today?", relevantDocs: [1], answer: "It's sunny with a high of 24°C!" },
  { question: "How do I make chocolate cake?", relevantDocs: [2], answer: "Mix flour, cocoa, sugar, eggs, and butter, then bake at 180°C for 30 minutes!" },
  { question: "Tell me about Mars", relevantDocs: [3], answer: "Mars is the Red Planet with two moons, and a day there is 24.6 hours!" },
];

export default function LearnPhase({ onComplete }: LearnPhaseProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<'question' | 'retrieve' | 'augment' | 'generate'>('question');
  const [highlightedDocs, setHighlightedDocs] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentQ = questions[questionIndex];

  const runRAGProcess = async () => {
    // Phase 1: Show question
    setPhase('question');
    await new Promise(r => setTimeout(r, 1000));
    
    // Phase 2: Retrieve - highlight relevant documents
    setPhase('retrieve');
    for (let i = 0; i < documents.length; i++) {
      await new Promise(r => setTimeout(r, 300));
      if (currentQ.relevantDocs.includes(documents[i].id)) {
        setHighlightedDocs(prev => [...prev, documents[i].id]);
      }
    }
    await new Promise(r => setTimeout(r, 500));
    
    // Phase 3: Augment
    setPhase('augment');
    await new Promise(r => setTimeout(r, 1000));
    
    // Phase 4: Generate
    setPhase('generate');
    await new Promise(r => setTimeout(r, 500));
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(q => q + 1);
      setPhase('question');
      setHighlightedDocs([]);
      setShowAnswer(false);
    } else {
      setStep(1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🔮 How RAG Works</h2>
          <p className="text-green-100 mt-1">{t('auto.learning.s930_watch_the_magic_happen', 'Watch the magic happen!')}</p>
        </div>

        <div className="p-6">
          {step === 0 && (
            <>
              {/* Process Indicator */}
              <div className="flex justify-around mb-8 px-4">
                {['Question', 'Retrieve', 'Augment', 'Generate'].map((label, i) => {
                  const phases = ['question', 'retrieve', 'augment', 'generate'];
                  const isActive = phases.indexOf(phase) >= i;
                  const isCurrent = phases[i] === phase;
                  
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all",
                        isCurrent ? "bg-green-500 text-white scale-110 animate-pulse" :
                        isActive ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-500"
                      )}>
                        {i + 1}
                      </div>
                      <span className={cn(
                        "text-sm mt-2 font-medium",
                        isActive ? "text-green-600" : "text-gray-400"
                      )}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Question */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6 text-center">
                <span className="text-blue-500 text-sm font-medium">{t('auto.learning.s931_question', 'Question:')}</span>
                <p className="text-xl font-bold text-blue-800">"{currentQ.question}"</p>
              </div>

              {/* Document Library */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {documents.map((doc) => {
                  const isHighlighted = highlightedDocs.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all text-center",
                        isHighlighted 
                          ? "border-green-500 bg-green-50 scale-105 shadow-lg" 
                          : "border-gray-200 bg-white",
                        phase === 'retrieve' && !isHighlighted && "opacity-50"
                      )}
                    >
                      <span className="text-2xl block mb-1">{doc.icon}</span>
                      <span className="text-xs font-medium text-gray-700">{doc.title}</span>
                      {isHighlighted && (
                        <span className="block text-xs text-green-600 mt-1">✓ Found!</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Augment Phase */}
              {(phase === 'augment' || phase === 'generate') && highlightedDocs.length >0 && (<div className="bg-yellow-50 rounded-xl p-4 mb-6">
                  <p className="text-yellow-800 font-medium mb-2">📝 Relevant Information Found:</p>
                  {documents.filter(d =>highlightedDocs.includes(d.id)).map(doc => (<p key={doc.id} className="text-yellow-700 text-sm italic">
                      "{doc.content}"
                    </p>
                  ))}
                </div>
              )}

              {/* Answer */}
              {showAnswer && (
                <div className="bg-green-50 rounded-xl p-4 mb-6 border-2 border-green-500">
                  <p className="text-green-800 font-medium mb-2">🤖 AI Answer:</p>
                  <p className="text-green-700 text-lg">{currentQ.answer}</p>
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-center gap-4">
                {!showAnswer ? (
                  <button
                    onClick={runRAGProcess}
                    disabled={phase !== 'question'}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >▶️ Run RAG Process</button>) : (<button
                    onClick={nextQuestion}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    {questionIndex < questions.length - 1 ? "Try Another Question →" : "Continue →"}
                  </button>
                )}
              </div>
            </>
          )}

          {step === 1 && (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('auto.learning.s932_youve_seen_rag_in_action', "You've Seen RAG in Action!")}</h3>
              <div className="bg-green-50 rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
                <h4 className="font-bold text-green-800 mb-2">{t('auto.learning.s933_what_you_learned', 'What You Learned:')}</h4>
                <ul className="text-green-700 space-y-2">
                  <li>1️⃣ <strong>{t('auto.learning.s934_retrieve', 'Retrieve')}</strong> - Search for relevant documents</li>
                  <li>2️⃣ <strong>{t('auto.learning.s935_augment', 'Augment')}</strong> - Add that info to the prompt</li>
                  <li>3️⃣ <strong>{t('auto.learning.s936_generate', 'Generate')}</strong> - AI creates an informed answer</li>
                </ul>
              </div>
              <button
                onClick={onComplete}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
              >Now let me try! 🧸</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
