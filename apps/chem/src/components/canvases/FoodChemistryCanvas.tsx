import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasProps } from '../../types';

interface FoodReaction {
  id: string;
  name: string;
  emoji: string;
  ingredients: string[];
  reaction: string;
  product: string;
  temperature: number;
  duration: number; // seconds to simulate
  color: string;
  description: string;
  indianContext: string;
}

const FOOD_REACTIONS: FoodReaction[] = [
  { id: 'chai', name: 'Making Chai', emoji: '☕', ingredients: ['Water', 'Tea Leaves', 'Milk', 'Sugar'], reaction: 'Tannin extraction + Maillard reaction', product: 'Chai!', temperature: 100, duration: 5, color: 'from-amber-800 to-amber-600', description: 'Boiling extracts tannins (color) and caffeine from tea leaves. Milk proteins undergo Maillard reaction creating aroma.', indianContext: 'India drinks 837 million kg of tea per year!' },
  { id: 'paneer', name: 'Paneer from Milk', emoji: '🧀', ingredients: ['Milk', 'Lemon Juice / Vinegar'], reaction: 'Acid coagulation of casein protein', product: 'Paneer + Whey', temperature: 80, duration: 4, color: 'from-white to-amber-100', description: 'Acid (citric/acetic) makes casein protein unfold and clump together — that\'s coagulation! The liquid left is whey.', indianContext: 'India is the world\'s largest producer of paneer and cheese!' },
  { id: 'idli', name: 'Idli/Dosa Fermentation', emoji: '🫓', ingredients: ['Rice', 'Urad Dal', 'Water'], reaction: 'Bacterial fermentation → CO₂', product: 'Fluffy Batter', temperature: 30, duration: 6, color: 'from-amber-50 to-yellow-100', description: 'Lactobacillus bacteria eat sugars and release CO₂ gas + lactic acid. CO₂ makes it fluffy, acid gives tangy taste!', indianContext: 'Idli batter fermentation is 2000+ years of Indian food science!' },
  { id: 'jaggery', name: 'Sugar Caramelization', emoji: '🍬', ingredients: ['Sugarcane Juice'], reaction: 'Sucrose → Caramel polymers', product: 'Gur (Jaggery)', temperature: 180, duration: 5, color: 'from-amber-600 to-amber-900', description: 'Heating sugar above 170°C breaks it down into hundreds of compounds — creating color, flavor, and that amazing aroma!', indianContext: 'India produces 70% of the world\'s jaggery (gur)!' },
  { id: 'pickle', name: 'Pickling (Achar)', emoji: '🥒', ingredients: ['Vegetables', 'Oil', 'Salt', 'Spices'], reaction: 'Preservation by oil barrier + salt osmosis', product: 'Achar!', temperature: 25, duration: 4, color: 'from-red-600 to-orange-600', description: 'Oil prevents oxygen and bacteria. Salt draws water out (osmosis), dehydrating microbes. Spices like mustard and turmeric add antimicrobial power!', indianContext: 'Every Indian grandma has a secret achar recipe — food chemistry at its finest!' },
  { id: 'roti', name: 'Roti Browning', emoji: '🫓', ingredients: ['Wheat Flour', 'Water'], reaction: 'Maillard reaction + Steam puffing', product: 'Golden Roti', temperature: 200, duration: 3, color: 'from-amber-200 to-amber-700', description: 'Above 140°C, amino acids react with sugars → hundreds of flavor compounds (Maillard reaction). Steam trapped inside makes it puff up!', indianContext: 'The perfect phulka puffs because trapped steam expands!' },
];

type ViewMode = 'cook' | 'nutrients' | 'quiz';

export default function FoodChemistryCanvas({ isPlaying }: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('cook');
  const [selectedReaction, setSelectedReaction] = useState<FoodReaction>(FOOD_REACTIONS[0]);
  const [isCooking, setIsCooking] = useState(false);
  const [cookProgress, setCookProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(25);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // Cooking animation
  useEffect(() => {
    if (!isCooking || !isPlaying) return;

    const interval = setInterval(() => {
      setCookProgress(prev => {
        const next = prev + (1 / (selectedReaction.duration * 10));
        if (next >= 1) {
          setIsCooking(false);
          setIsDone(true);
          return 1;
        }
        return next;
      });
      setCurrentTemp(prev => {
        const target = selectedReaction.temperature;
        return prev + (target - prev) * 0.08;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isCooking, isPlaying, selectedReaction]);

  const startCooking = () => {
    setCookProgress(0);
    setIsDone(false);
    setIsCooking(true);
    setCurrentTemp(25);
  };

  const QUIZ_QUESTIONS = [
    { q: 'What makes chai brown?', options: ['Sugar', 'Tannins from tea leaves', 'Milk', 'Water'], correct: 1 },
    { q: 'How does paneer form?', options: ['Freezing', 'Acid coagulates protein', 'Adding salt', 'Boiling'], correct: 1 },
    { q: 'What makes idli batter rise?', options: ['Yeast', 'Baking soda', 'CO₂ from bacteria', 'Heat'], correct: 2 },
    { q: 'The Maillard reaction happens when?', options: ['At 0°C', 'Above 140°C', 'In cold water', 'In sunlight'], correct: 1 },
    { q: 'Oil in pickle prevents...', options: ['Taste', 'Color change', 'Bacteria growth', 'Spice flavor'], correct: 2 },
  ];

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Mode Tabs */}
      <div className="flex gap-2">
        {([['cook', '👨‍🍳 Cook'], ['nutrients', '🧬 Science'], ['quiz', '🎯 Quiz']] as [ViewMode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === m ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* COOK MODE */}
      {viewMode === 'cook' && (
        <>
          <h3 className="text-xl font-bold text-amber-400">👨‍🍳 Kitchen Chemistry</h3>

          {/* Recipe selector */}
          <div className="flex gap-2 flex-wrap justify-center max-w-md">
            {FOOD_REACTIONS.map(r => (
              <button key={r.id} onClick={() => { setSelectedReaction(r); setCookProgress(0); setIsDone(false); setIsCooking(false); setCurrentTemp(25); }}
                className={`px-3 py-2 rounded-xl text-sm transition-all ${selectedReaction.id === r.id ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {r.emoji} {r.name}
              </button>
            ))}
          </div>

          {/* Cooking Visualization */}
          <div className="relative w-64 min-h-48 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
            {/* Background heat */}
            <motion.div className={`absolute inset-0 bg-gradient-to-t ${selectedReaction.color}`}
              animate={{ opacity: isCooking ? [0.1, 0.3, 0.1] : isDone ? 0.3 : 0.05 }}
              transition={{ duration: 1, repeat: isCooking ? Infinity : 0 }} />

            {/* Cooking vessel */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <div className="w-32 min-h-20 bg-slate-600 rounded-b-3xl border-t-4 border-slate-500 overflow-hidden relative">
                {/* Contents */}
                <motion.div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${selectedReaction.color}`}
                  animate={{ height: isDone ? '90%' : `${30 + cookProgress * 60}%` }} />

                {/* Bubbles when cooking */}
                {isCooking && Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={i} className="absolute w-2 h-2 bg-white/40 rounded-full"
                    style={{ left: `${15 + i * 15}%` }}
                    animate={{ y: [0, -30, 0], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>

              {/* Flame */}
              {(isCooking || isDone) && (
                <div className="flex justify-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div key={i} className="w-2 rounded-full bg-gradient-to-t from-orange-500 to-yellow-300"
                      animate={{ height: isCooking ? [8, 14, 8] : [4, 6, 4] }}
                      transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.08 }} />
                  ))}
                </div>
              )}
            </div>

            {/* Temperature */}
            <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white font-mono">
              🌡️ {Math.round(currentTemp)}°C
            </div>

            {/* Done emoji */}
            <AnimatePresence>
              {isDone && (
                <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 text-5xl">
                  {selectedReaction.emoji}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ingredients */}
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedReaction.ingredients.map(ing => (
              <motion.span key={ing} initial={{ scale: 0.8 }} animate={{ scale: isCooking ? [1, 0.9] : 1 }}
                transition={{ duration: 0.5, repeat: isCooking ? Infinity : 0 }}
                className="px-3 py-1 bg-slate-700 rounded-full text-xs text-white">
                {ing}
              </motion.span>
            ))}
          </div>

          {/* Progress */}
          {(isCooking || isDone) && (
            <div className="w-full max-w-xs">
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${cookProgress * 100}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-1 text-center italic">{selectedReaction.reaction}</p>
            </div>
          )}

          {/* Cook Button */}
          <button onClick={startCooking} disabled={isCooking || !isPlaying}
            className="px-8 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 rounded-xl text-white font-bold">
            {isCooking ? '🔥 Cooking...' : isDone ? '🔄 Cook Again' : '🔥 Start Cooking'}
          </button>

          {/* Result Info */}
          <AnimatePresence>
            {isDone && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 rounded-xl p-4 max-w-sm border border-slate-700">
                <h4 className="font-bold text-white mb-2">{selectedReaction.emoji} {selectedReaction.product}</h4>
                <p className="text-sm text-slate-300 mb-2">{selectedReaction.description}</p>
                <p className="text-sm text-emerald-400">🇮🇳 {selectedReaction.indianContext}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* SCIENCE MODE */}
      {viewMode === 'nutrients' && (
        <>
          <h3 className="text-xl font-bold text-cyan-400">🧬 Chemistry Behind Food</h3>

          <div className="w-full max-w-md space-y-3">
            {FOOD_REACTIONS.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{r.emoji}</span>
                  <div>
                    <h4 className="font-bold text-white">{r.name}</h4>
                    <p className="text-xs text-cyan-400 font-mono">{r.reaction}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-2">{r.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">🌡️ {r.temperature}°C</span>
                  <span className="text-xs text-emerald-400">🇮🇳 {r.indianContext}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* QUIZ MODE */}
      {viewMode === 'quiz' && (
        <>
          <h3 className="text-xl font-bold text-purple-400">🎯 Food Chemistry Quiz</h3>
          <p className="text-amber-400 font-bold">Score: {quizScore}/{QUIZ_QUESTIONS.length}</p>

          {quizIndex < QUIZ_QUESTIONS.length ? (
            <div className="bg-slate-800/50 rounded-xl p-6 max-w-sm w-full border border-slate-700">
              <p className="text-white font-semibold mb-4">{QUIZ_QUESTIONS[quizIndex].q}</p>
              <div className="space-y-2">
                {QUIZ_QUESTIONS[quizIndex].options.map((opt, i) => (
                  <button key={i} onClick={() => {
                    if (quizAnswer !== null) return;
                    setQuizAnswer(opt);
                    if (i === QUIZ_QUESTIONS[quizIndex].correct) setQuizScore(prev => prev + 1);
                    setTimeout(() => { setQuizAnswer(null); setQuizIndex(prev => prev + 1); }, 1200);
                  }}
                    className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                      quizAnswer === null ? 'bg-slate-700 hover:bg-slate-600 text-white' :
                      i === QUIZ_QUESTIONS[quizIndex].correct ? 'bg-green-600 text-white' :
                      quizAnswer === opt ? 'bg-red-600 text-white' : 'bg-slate-700/50 text-slate-500'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-4">{quizScore >= 4 ? '🏆' : quizScore >= 3 ? '👍' : '📚'}</div>
              <p className="text-white text-xl font-bold mb-4">You got {quizScore} out of {QUIZ_QUESTIONS.length}!</p>
              <button onClick={() => { setQuizIndex(0); setQuizScore(0); }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold">
                Try Again
              </button>
            </div>
          )}
        </>
      )}

      {/* Indian Context */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center">
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 India's food science</span> dates back thousands of years — fermentation (idli/dosa), 
          preservation (achar), and Ayurvedic cooking are all chemistry in the kitchen!
        </p>
      </motion.div>
    </div>
  );
}
