import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function gcd(a: number, b: number): number { while (b) { [a, b] = [b, a % b]; } return a; }

function makeRecipe() {
  const names = ['Pancakes', 'Cookies', 'Smoothie', 'Lemonade', 'Muffins', 'Pasta Sauce'];
  const ingredientSets = [
    [{ name: 'Flour', amount: 2, unit: 'cups' }, { name: 'Eggs', amount: 3, unit: '' }, { name: 'Milk', amount: 1, unit: 'cup' }, { name: 'Sugar', amount: 2, unit: 'tbsp' }],
    [{ name: 'Butter', amount: 1, unit: 'cup' }, { name: 'Sugar', amount: 2, unit: 'cups' }, { name: 'Flour', amount: 3, unit: 'cups' }, { name: 'Chocolate chips', amount: 1, unit: 'cup' }],
    [{ name: 'Bananas', amount: 2, unit: '' }, { name: 'Yogurt', amount: 1, unit: 'cup' }, { name: 'Honey', amount: 2, unit: 'tbsp' }, { name: 'Ice', amount: 4, unit: 'cubes' }],
    [{ name: 'Lemons', amount: 6, unit: '' }, { name: 'Sugar', amount: 1, unit: 'cup' }, { name: 'Water', amount: 8, unit: 'cups' }, { name: 'Ice', amount: 10, unit: 'cubes' }],
    [{ name: 'Flour', amount: 3, unit: 'cups' }, { name: 'Blueberries', amount: 1, unit: 'cup' }, { name: 'Egg', amount: 1, unit: '' }, { name: 'Milk', amount: 1, unit: 'cup' }],
    [{ name: 'Tomatoes', amount: 4, unit: '' }, { name: 'Garlic cloves', amount: 3, unit: '' }, { name: 'Olive oil', amount: 2, unit: 'tbsp' }, { name: 'Basil', amount: 5, unit: 'leaves' }],
  ];
  const idx = Math.floor(Math.random() * names.length);
  return { name: names[idx], baseServings: [4, 6, 8, 12][Math.floor(Math.random() * 4)], ingredients: ingredientSets[idx] };
}

function makeChallenge() {
  const type = Math.floor(Math.random() * 3);
  if (type === 0) {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    const scale = Math.floor(Math.random() * 4) + 2;
    const answer = a * scale;
    const wrongs = new Set<number>();
    while (wrongs.size < 3) { const w = answer + Math.floor(Math.random() * 11) - 5; if (w !== answer && w > 0) wrongs.add(w); }
    return { question: `If ${a}:${b} = ?:${b * scale}, find ?`, answer, options: [answer, ...wrongs].sort(() => Math.random() - 0.5) };
  }
  if (type === 1) {
    const servings = Math.floor(Math.random() * 4) + 2;
    const amount = Math.floor(Math.random() * 5) + 1;
    const target = servings * 2;
    const answer = amount * 2;
    const wrongs = new Set<number>();
    while (wrongs.size < 3) { const w = answer + Math.floor(Math.random() * 7) - 3; if (w !== answer && w > 0) wrongs.add(w); }
    return { question: `A recipe needs ${amount} cups of flour for ${servings} servings. How much for ${target} servings?`, answer, options: [answer, ...wrongs].sort(() => Math.random() - 0.5) };
  }
  const speed = Math.floor(Math.random() * 40) + 30;
  const time = Math.floor(Math.random() * 4) + 2;
  const answer = speed * time;
  const wrongs = new Set<number>();
  while (wrongs.size < 3) { const w = answer + Math.floor(Math.random() * 41) - 20; if (w !== answer && w > 0) wrongs.add(w); }
  return { question: `Traveling ${speed} km/h for ${time} hours. Distance?`, answer, options: [answer, ...wrongs].sort(() => Math.random() - 0.5) };
}

export default function RatiosProportions() {
  const [mode, setMode] = useState<'ratio' | 'recipe' | 'challenge'>('ratio');
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [recipe] = useState(makeRecipe);
  const [servings, setServings] = useState(recipe.baseServings);
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const g = useMemo(() => gcd(a, b), [a, b]);
  const scale = servings / recipe.baseServings;

  const answerChallenge = (opt: number) => {
    if (feedback) return;
    if (opt === challenge.answer) {
      setFeedback('correct'); setScore(s => s + 10);
      setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200);
    } else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 900); }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">⚖️ Ratios & Proportions</h2>
        <p className="text-purple-300 text-lg">Scale recipes, compare ratios, and solve proportions!</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {[
          { id: 'ratio' as const, emoji: '⚖️', label: 'Ratio Explorer' },
          { id: 'recipe' as const, emoji: '🍳', label: 'Recipe Scaler' },
          { id: 'challenge' as const, emoji: '🎯', label: 'Challenge' },
        ].map(m => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`}
            onClick={() => setMode(m.id)}>{m.emoji} {m.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'ratio' && (
          <motion.div key="r" className="max-w-lg mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-blue-400 text-sm font-bold">A</label>
                  <input type="range" min="1" max="20" value={a} onChange={e => setA(Number(e.target.value))} className="w-full accent-blue-500" />
                  <p className="text-white font-bold text-center text-2xl">{a}</p></div>
                <div><label className="text-orange-400 text-sm font-bold">B</label>
                  <input type="range" min="1" max="20" value={b} onChange={e => setB(Number(e.target.value))} className="w-full accent-orange-500" />
                  <p className="text-white font-bold text-center text-2xl">{b}</p></div>
              </div>
              <div className="text-center text-3xl font-bold text-white mb-2">{a} : {b}</div>
              <p className="text-gray-400 text-center text-sm">Simplified: <span className="text-purple-300 font-bold">{a / g} : {b / g}</span></p>
              <p className="text-gray-400 text-center text-sm">Fraction: <span className="text-green-300 font-bold">{a}/{b} = {(a / b).toFixed(3)}</span></p>
            </div>

            {/* Visual bar */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-gray-400 text-sm mb-2">Visual ratio</p>
              <div className="flex h-10 rounded-lg overflow-hidden">
                <motion.div className="bg-blue-500 flex items-center justify-center text-sm font-bold text-white" animate={{ width: `${(a / (a + b)) * 100}%` }}>{a}</motion.div>
                <motion.div className="bg-orange-500 flex items-center justify-center text-sm font-bold text-white" animate={{ width: `${(b / (a + b)) * 100}%` }}>{b}</motion.div>
              </div>
              <div className="flex justify-between text-sm mt-1"><span className="text-blue-400">A: {((a / (a + b)) * 100).toFixed(1)}%</span><span className="text-orange-400">B: {((b / (a + b)) * 100).toFixed(1)}%</span></div>
            </div>

            {/* Equivalent ratios */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-gray-400 text-sm mb-2">Equivalent ratios</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map(m => (
                  <span key={m} className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-sm font-mono">{(a / g) * m} : {(b / g) * m}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'recipe' && (
          <motion.div key="re" className="max-w-lg mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-2xl p-5 border border-orange-500/20">
              <h3 className="text-xl font-bold text-white mb-1">🍳 {recipe.name}</h3>
              <p className="text-gray-400 text-sm mb-3">Base recipe: {recipe.baseServings} servings</p>
              <div className="flex items-center gap-3 mb-4">
                <label className="text-gray-400 text-sm">Scale to</label>
                <input type="range" min="1" max={recipe.baseServings * 4} value={servings} onChange={e => setServings(Number(e.target.value))} className="flex-1 accent-orange-500" />
                <span className="text-orange-400 font-bold text-xl w-12 text-right">{servings}</span>
                <span className="text-gray-400 text-sm">servings</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">Scale factor: <span className="text-orange-300 font-bold">×{scale.toFixed(2)}</span></p>
              <div className="space-y-2">
                {recipe.ingredients.map(ing => (
                  <div key={ing.name} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2">
                    <span className="text-white">{ing.name}</span>
                    <div className="text-right">
                      <span className="text-gray-500 text-sm line-through mr-2">{ing.amount} {ing.unit}</span>
                      <motion.span key={servings} className="text-orange-400 font-bold" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                        {(Math.round(ing.amount * scale * 100) / 100)} {ing.unit}
                      </motion.span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'challenge' && (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {score}</span></div>
              <p className="text-xl font-bold text-white text-center mb-5">{challenge.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-xl font-bold ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`} whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}} onClick={() => answerChallenge(opt)} disabled={!!feedback}>{opt}</motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4">✅ Correct!</p>}
              {feedback === 'wrong' && <p className="text-red-400 font-bold text-center mt-4">Answer: {challenge.answer}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
