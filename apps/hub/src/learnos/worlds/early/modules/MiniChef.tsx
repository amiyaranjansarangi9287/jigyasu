// src/worlds/early/modules/MiniChef.tsx
// Select a recipe, add ingredients in order, celebrate the dish.

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store';
import { AudioEngine } from '@/shared/audio/AudioEngine';
import EarlyShell from '../EarlyShell';
import { usePip } from '../hooks/usePip';
import { useEarlyProgress } from '../hooks/useEarlyProgress';
import { useEarlySession } from '../hooks/useEarlySession';
import { RECIPES } from '../data/earlyContent';
import type { Recipe } from '../types/early.types';

type ChefStep = 'select' | 'cook' | 'complete';

export default function MiniChef() {
  const { t } = useTranslation();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const pip = usePip();
  const { recordRecipeAttempt } = useEarlyProgress();
  const { trackCorrect, trackWrong } = useEarlySession();

  const [step, setStep] = useState<ChefStep>('select');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [currentIngIdx, setCurrentIngIdx] = useState(0);
  const [addedIngredients, setAddedIngredients] = useState<number[]>([]);
  const [wrongTap, setWrongTap] = useState(false);
  const [showMixing, setShowMixing] = useState(false);

  const handleSelectRecipe = (r: Recipe) => {
    setRecipe(r);
    setStep('cook');
    setCurrentIngIdx(0);
    setAddedIngredients([]);
    pip.sayCustom(`Let's make ${r.name}! First ingredient!`, 'excited');
  };

  const handleIngredientTap = useCallback(async (ingIdx: number) => {
    if (!recipe || showMixing) return;

    if (ingIdx === currentIngIdx) {
      // Correct ingredient
      setWrongTap(false);
      const newAdded = [...addedIngredients, ingIdx];
      setAddedIngredients(newAdded);

      if (soundEnabled) try { AudioEngine.playTone({ frequency: 400 + ingIdx * 80, type: 'sine', duration: 0.3, volume: 0.25, attack: 0.02, decay: 0.1 }); } catch (_) {}

      if (newAdded.length >= recipe.ingredients.length) {
        // All ingredients added — mixing!
        setShowMixing(true);
        pip.sayCustom('Time to mix it all together!', 'celebrating');
        await trackCorrect('mini-chef', { recipe: recipe.id });

        setTimeout(() => {
          setShowMixing(false);
          setStep('complete');
          pip.celebrate();
          if (soundEnabled) try { AudioEngine.playCelebration(); } catch (_) {}
          recordRecipeAttempt(recipe.id, true);
        }, 2000);
      } else {
        setCurrentIngIdx(ingIdx + 1);
        const nextIng = recipe.ingredients[ingIdx + 1];
        pip.sayCustom(`Next: add ${nextIng.amount} ${nextIng.unit} of ${nextIng.name}!`, 'encouraging');
      }
    } else {
      // Wrong ingredient
      setWrongTap(true);
      pip.reactToMistake();
      await trackWrong('mini-chef', { expected: currentIngIdx, got: ingIdx });
      setTimeout(() => setWrongTap(false), 1000);
    }
  }, [recipe, currentIngIdx, addedIngredients, showMixing, soundEnabled, pip, trackCorrect, trackWrong, recordRecipeAttempt]);

  const handleNewRecipe = () => { setStep('select'); setRecipe(null); setCurrentIngIdx(0); setAddedIngredients([]); };

  return (
    <EarlyShell module="mini-chef">
      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-200 mb-6">
              <div className="flex items-center gap-3"><span className="text-3xl">{t('early.modules.MiniChef.spn_', '🐤👨‍🍳')}</span><p className="text-lg font-bold text-gray-700">{t('early.modules.MiniChef.txt_Choosearec', 'Choose a recipe to cook!')}</p></div>
            </div>
            <div className="space-y-4">
              {RECIPES.map(r => (
                <motion.button key={r.id} whileTap={{ scale: 0.97 }} onClick={() => handleSelectRecipe(r)}
                  className="w-full bg-white rounded-2xl p-5 shadow-sm border border-orange-100 flex items-center gap-4 text-left min-h-[80px]">
                  <span className="text-5xl">{r.emoji}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-xl">{r.name}</p>
                    <p className="text-base text-gray-500">{r.ingredients.length} ingredients · {r.isIndian ? '🇮🇳' : '🌍'}</p>
                    <div className="flex gap-1 mt-1">{Array.from({ length: r.difficulty }, (_, i) => <span key={i} className="text-sm">{t('early.modules.MiniChef.spn_', '⭐')}</span>)}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'cook' && recipe && (
          <motion.div key="cook" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-6 flex flex-col">
            {/* Recipe header */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-200 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{recipe.emoji}</span>
                <div>
                  <p className="font-bold text-gray-800">{recipe.name}</p>
                  <p className="text-base text-gray-500">{addedIngredients.length} / {recipe.ingredients.length} ingredients</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div className="h-full bg-orange-500 rounded-full" animate={{ width: `${(addedIngredients.length / recipe.ingredients.length) * 100}%` }} />
              </div>
            </div>

            {/* Current instruction */}
            {!showMixing && currentIngIdx < recipe.ingredients.length && (
              <div className="bg-yellow-50 rounded-2xl p-4 mb-4 border border-yellow-200">
                <p className="text-center font-bold text-gray-700">
                  Add <span className="text-orange-600">{recipe.ingredients[currentIngIdx].amount} {recipe.ingredients[currentIngIdx].unit}</span> of{' '}
                  <span className="text-orange-600">{recipe.ingredients[currentIngIdx].name}</span> {recipe.ingredients[currentIngIdx].emoji}
                </p>
                {recipe.ingredients[currentIngIdx].visualFraction && (
                  <p className="text-center text-3xl mt-2 font-bold text-orange-500">{recipe.ingredients[currentIngIdx].visualFraction}</p>
                )}
              </div>
            )}

            {/* Mixing animation */}
            {showMixing && (
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-center my-8"><span className="text-8xl">{t('early.modules.MiniChef.spn_', '🥣')}</span></motion.div>
            )}

            {/* Ingredient shelf */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {recipe.ingredients.map((ing, i) => {
                const isAdded = addedIngredients.includes(i);
                const isWrong = wrongTap && i !== currentIngIdx;
                return (
                  <motion.button key={i} whileTap={{ scale: isAdded ? 1 : 0.95 }}
                    onClick={() => !isAdded && handleIngredientTap(i)}
                    disabled={isAdded || showMixing}
                    animate={isWrong ? { x: [0, -5, 5, -5, 0] } : {}}
                    className={`rounded-2xl p-4 flex flex-col items-center gap-2 min-h-[100px] transition-all ${
                      isAdded ? 'bg-green-100 border-2 border-green-300 opacity-60' : 'bg-white border-2 border-gray-200 shadow-sm'
                    }`}>
                    <span className="text-4xl">{ing.emoji}</span>
                    <span className="text-sm font-bold text-gray-600">{ing.name}</span>
                    {isAdded && <span className="text-green-500 text-base">{t('early.modules.MiniChef.spn_', '✓')}</span>}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 'complete' && recipe && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col items-center justify-center p-8">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-[100px] mb-6">{recipe.emoji}</motion.div>
            <p className="text-3xl font-extrabold text-gray-800 mb-2">{recipe.name}</p>
            <p className="text-xl text-orange-600 font-bold mb-8">{t('early.modules.MiniChef.txt_isreadyYum', 'is ready! Yum! 🎉')}</p>
            <button onClick={handleNewRecipe} className="px-8 py-4 bg-orange-500 text-white font-bold text-xl rounded-2xl min-h-[56px]">{t('early.modules.MiniChef.btn_CookSometh', 'Cook Something Else! 👨‍🍳')}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </EarlyShell>
  );
}
