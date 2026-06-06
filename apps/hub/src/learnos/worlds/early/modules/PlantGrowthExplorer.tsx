// src/worlds/early/modules/PlantGrowthExplorer.tsx

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import EarlyShell from '../EarlyShell';
import { usePip } from '../hooks/usePip';
import { useEarlyProgress } from '../hooks/useEarlyProgress';
import { useEarlySession } from '../hooks/useEarlySession';

const PLANT_STAGES = [
  { id: 0, name: 'Seed', emoji: '🌰', pipMsg: "A tiny seed! What does it need to grow?", waterNeeded: 0.5, sunNeeded: 0.3, question: "What did the seed need to sprout?", options: ['Water and Sunlight', 'Just water', 'Just sunlight', 'Nothing'], correct: 0 },
  { id: 1, name: 'Sprout', emoji: '🌱', pipMsg: "It's sprouting! A tiny green shoot!", waterNeeded: 0.6, sunNeeded: 0.5, question: "What does the sprout use sunlight for?", options: ['Making food', 'Making water', 'Making flowers', 'Making seeds'], correct: 0 },
  { id: 2, name: 'Seedling', emoji: '🌿', pipMsg: "Leaves! Leaves catch sunlight for energy.", waterNeeded: 0.6, sunNeeded: 0.6, question: "What do leaves do?", options: ['Catch sunlight', 'Drink water', 'Make soil', 'Make clouds'], correct: 0 },
  { id: 3, name: 'Growing', emoji: '🪴', pipMsg: "Getting bigger! Plants need soil, water, and sun.", waterNeeded: 0.7, sunNeeded: 0.7, question: "How many things does a plant need?", options: ['3 things', '1 thing', '5 things', '10 things'], correct: 0 },
  { id: 4, name: 'Flowering', emoji: '🌸', pipMsg: "Flowers! Bees help plants make seeds!", waterNeeded: 0.7, sunNeeded: 0.8, question: "What do bees help flowers do?", options: ['Make seeds', 'Grow taller', 'Drink water', 'Move to sun'], correct: 0 },
  { id: 5, name: 'Fruit', emoji: '🍎', pipMsg: "Fruit! Seeds inside will grow new plants!", waterNeeded: 0.8, sunNeeded: 0.8, question: "What is inside the fruit?", options: ['Seeds for new plants', 'Water', 'Soil', 'Flowers'], correct: 0 },
];

export default function PlantGrowthExplorer() {
  const { t } = useTranslation();
  const pip = usePip();
  const { recordPlantStage } = useEarlyProgress();
  const { trackCorrect, trackWrong } = useEarlySession();
  const [currentStage, setCurrentStage] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0.3);
  const [sunLevel, setSunLevel] = useState(0.3);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [canAdvance, setCanAdvance] = useState(false);

  const stage = PLANT_STAGES[currentStage];
  const conditionsMet = waterLevel >= stage.waterNeeded && sunLevel >= stage.sunNeeded;

  const handleGrow = useCallback(() => {
    if (!conditionsMet) { pip.sayCustom(waterLevel < stage.waterNeeded ? "The plant is thirsty! Add more water!" : "It needs more sunlight!", 'curious'); return; }
    pip.sayCustom(stage.pipMsg, 'excited');
    setShowQuestion(true);
  }, [conditionsMet, waterLevel, stage, pip]);

  const handleAnswer = useCallback(async (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === stage.correct) { pip.celebrate(); await trackCorrect('plant-growth', { stage: stage.name }); await recordPlantStage(); }
    else { pip.reactToMistake(); await trackWrong('plant-growth', {}); }
    setCanAdvance(true);
  }, [selectedAnswer, stage, pip, trackCorrect, trackWrong, recordPlantStage]);

  const handleNext = useCallback(() => {
    if (currentStage < PLANT_STAGES.length - 1) { setCurrentStage(p => p + 1); setShowQuestion(false); setSelectedAnswer(null); setCanAdvance(false); setWaterLevel(0.3); setSunLevel(0.3); }
    else { pip.sayCustom("Amazing! You grew a plant from seed to fruit!", 'celebrating'); setShowQuestion(false); setCurrentStage(0); setWaterLevel(0.3); setSunLevel(0.3); }
  }, [currentStage, pip]);

  return (
    <EarlyShell module="plant-growth">
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 flex flex-col">
        <div className="px-5 pt-6 pb-3">
          <div className="flex items-center gap-2 mb-3">
            {PLANT_STAGES.map((_, i) => (<div key={i} className={`flex-1 h-2 rounded-full transition-all duration-500 ${i < currentStage ? 'bg-green-500' : i === currentStage ? 'bg-green-300' : 'bg-gray-200'}`} />))}
          </div>
          <div className="flex items-center gap-2"><span className="text-3xl">{stage.emoji}</span><span className="font-bold text-green-800">{stage.name}</span><span className="text-base text-gray-500">Stage {currentStage + 1}/{PLANT_STAGES.length}</span></div>
        </div>

        <div className="mx-5 bg-white rounded-3xl overflow-hidden border border-green-100 shadow-sm mb-4" style={{ height: '180px' }}>
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-100 to-green-100">
            <motion.div key={currentStage} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-center">
              <div className="text-8xl mb-2">{stage.emoji}</div>
            </motion.div>
          </div>
        </div>

        <div className="px-5 space-y-4 mb-4">
          <div>
            <div className="flex items-center justify-between mb-1"><span className="text-base font-bold text-blue-600">{t('early.modules.PlantGrowthExplorer.spn_Water', '💧 Water')}</span><span className="text-sm text-gray-500">{Math.round(waterLevel * 100)}%</span></div>
            <input type="range" min="0" max="100" value={Math.round(waterLevel * 100)} onChange={e => setWaterLevel(Number(e.target.value) / 100)} className="w-full h-3 rounded-full appearance-none bg-blue-100 cursor-pointer" style={{ accentColor: '#3B82F6' }} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1"><span className="text-base font-bold text-yellow-600">{t('early.modules.PlantGrowthExplorer.spn_Sunlight', '☀️ Sunlight')}</span><span className="text-sm text-gray-500">{Math.round(sunLevel * 100)}%</span></div>
            <input type="range" min="0" max="100" value={Math.round(sunLevel * 100)} onChange={e => setSunLevel(Number(e.target.value) / 100)} className="w-full h-3 rounded-full appearance-none bg-yellow-100 cursor-pointer" style={{ accentColor: '#F59E0B' }} />
          </div>
        </div>

        {!showQuestion && <div className="px-5"><motion.button whileTap={{ scale: 0.97 }} onClick={handleGrow} className={`w-full py-4 rounded-2xl font-bold text-xl min-h-[56px] transition-all ${conditionsMet ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>{conditionsMet ? '🌱 Grow!' : 'Adjust water and sunlight...'}</motion.button></div>}

        <AnimatePresence>{showQuestion && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mx-5 bg-white rounded-3xl p-5 shadow-xl border border-green-200">
            <div className="flex items-center gap-2 mb-4"><span className="text-3xl">{t('early.modules.PlantGrowthExplorer.spn_', '🐤')}</span><p className="font-bold text-gray-800">{stage.question}</p></div>
            <div className="space-y-3">{stage.options.map((opt, i) => {
              const done = selectedAnswer !== null;
              return (<motion.button key={opt} whileTap={{ scale: 0.98 }} onClick={() => handleAnswer(i)}
                className={`w-full py-4 px-5 rounded-2xl text-left font-semibold text-lg min-h-[52px] transition-all ${!done ? 'bg-gray-50 border-2 border-gray-200 text-gray-700' : i === stage.correct ? 'bg-green-100 border-2 border-green-400 text-green-700' : selectedAnswer === i ? 'bg-red-100 border-2 border-red-300 text-red-600' : 'bg-white border-2 border-gray-100 text-gray-500'}`}>
                {opt} {done && i === stage.correct && '✓'}</motion.button>);
            })}</div>
            {canAdvance && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} onClick={handleNext} className="w-full py-4 bg-green-600 text-white font-bold text-xl rounded-2xl mt-4 min-h-[56px]">{currentStage < PLANT_STAGES.length - 1 ? 'Next Stage →' : '🌟 Start Again!'}</motion.button>}
          </motion.div>
        )}</AnimatePresence>
      </div>
    </EarlyShell>
  );
}
