// src/worlds/early/modules/WaterCycleJourney.tsx

import { useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import EarlyShell from '../EarlyShell';
import { usePip } from '../hooks/usePip';
import { useEarlyProgress } from '../hooks/useEarlyProgress';
import { useEarlySession } from '../hooks/useEarlySession';

const WATER_STAGES = [
  { id: 'evaporation', emoji: '☀️', droppyMood: '😄', droppyText: "I'm Droppy! The sun makes me warm... I'm rising up!", pipMsg: "Heat makes water rise as vapour!", question: "Why does water rise?", options: ['Sun heats it', 'Wind blows', 'It is cold', 'Fish push it'], correct: 0, bg: 'from-sky-400 to-blue-400', scene: '🌊☀️' },
  { id: 'condensation', emoji: '☁️', droppyMood: '😮', droppyText: "Up here it's cold! We're making a cloud!", pipMsg: "Cold air turns vapour back into drops — clouds!", question: "What makes clouds?", options: ['Cold air up high', 'Hot sun', 'Strong wind', 'Rain falling'], correct: 0, bg: 'from-gray-300 to-sky-200', scene: '☁️🌤️' },
  { id: 'precipitation', emoji: '🌧️', droppyMood: '😲', droppyText: "The cloud is too heavy... I'm falling as RAIN!", pipMsg: "Heavy clouds drop water as rain!", question: "What happens when clouds are heavy?", options: ['Water falls as rain', 'Clouds fly away', 'Sun comes out', 'Wind blows them'], correct: 0, bg: 'from-gray-400 to-blue-300', scene: '🌧️⛅' },
  { id: 'collection', emoji: '🌊', droppyMood: '😊', droppyText: "I landed in the river! Flowing to the ocean... and it starts again!", pipMsg: "Water collects in rivers and oceans — cycle restarts!", question: "Where does rain collect?", options: ['Rivers and ocean', 'In the sky', 'On clouds', 'In the sun'], correct: 0, bg: 'from-sky-300 to-blue-500', scene: '🌊🏞️' },
];

export default function WaterCycleJourney() {
  const { t } = useTranslation();
  const pip = usePip();
  const { recordWaterCycle } = useEarlyProgress();
  const { trackCorrect, trackWrong } = useEarlySession();
  const [currentStage, setCurrentStage] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [canAdvance, setCanAdvance] = useState(false);
  const [cycleComplete, setCycleComplete] = useState(false);

  const stage = WATER_STAGES[currentStage];

  const handleReady = useCallback(() => { pip.sayCustom(stage.pipMsg, 'excited'); setShowQuestion(true); }, [stage, pip]);

  const handleAnswer = useCallback(async (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === stage.correct) { pip.celebrate(); await trackCorrect('water-cycle', { stage: stage.id }); }
    else { pip.reactToMistake(); await trackWrong('water-cycle', {}); }
    setCanAdvance(true);
  }, [selectedAnswer, stage, pip, trackCorrect, trackWrong]);

  const handleNext = useCallback(async () => {
    if (currentStage < WATER_STAGES.length - 1) { setCurrentStage(p => p + 1); setShowQuestion(false); setSelectedAnswer(null); setCanAdvance(false); }
    else { setCycleComplete(true); await recordWaterCycle(); pip.sayCustom("You followed Droppy's whole journey! Water never disappears!", 'celebrating'); }
  }, [currentStage, pip, recordWaterCycle]);

  const handleRestart = () => { setCurrentStage(0); setShowQuestion(false); setSelectedAnswer(null); setCanAdvance(false); setCycleComplete(false); };

  return (
    <EarlyShell module="water-cycle">
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 flex flex-col">
        <div className="px-5 pt-6 pb-3">
          <div className="flex items-center justify-center gap-4">
            {WATER_STAGES.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${i < currentStage ? 'bg-blue-500 text-white' : i === currentStage ? 'bg-blue-200 border-2 border-blue-500 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                  {i < currentStage ? '✓' : s.emoji}
                </div>
                {i < WATER_STAGES.length - 1 && <div className={`w-6 h-1 rounded-full ${i < currentStage ? 'bg-blue-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-5 rounded-3xl overflow-hidden shadow-sm border border-sky-200 mb-4" style={{ height: '160px' }}>
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-b ${stage.bg} transition-all duration-1000`}>
            <div className="text-center"><div className="text-6xl mb-2">{stage.scene}</div><div className="text-3xl">{stage.droppyMood}💧</div></div>
          </div>
        </div>

        <div className="mx-5 bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
          <div className="flex items-start gap-2"><span className="text-3xl flex-shrink-0">{t('early.modules.WaterCycleJourney.spn_', '💧')}</span><p className="text-base text-blue-800 font-medium italic leading-relaxed">"{stage.droppyText}"</p></div>
        </div>

        {!showQuestion && !cycleComplete && (
          <div className="px-5"><motion.button whileTap={{ scale: 0.97 }} onClick={handleReady} className="w-full py-4 bg-blue-600 text-white font-bold text-xl rounded-2xl min-h-[56px]"><Trans i18nKey="auto.watercyclejourney.what_happens_next">What happens next? →</Trans></motion.button></div>
        )}

        <AnimatePresence>
          {showQuestion && !cycleComplete && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-5 bg-white rounded-3xl p-5 shadow-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-4"><span className="text-3xl">{t('early.modules.WaterCycleJourney.spn_', '🐤')}</span><p className="font-bold text-gray-800">{stage.question}</p></div>
              <div className="space-y-2">{stage.options.map((opt, i) => {
                const done = selectedAnswer !== null;
                return (<button key={opt} onClick={() => handleAnswer(i)} className={`w-full py-3 px-4 rounded-xl text-left font-medium text-base min-h-[48px] transition-all ${!done ? 'bg-gray-50 border-2 border-gray-200' : i === stage.correct ? 'bg-green-100 border-2 border-green-400 text-green-700' : selectedAnswer === i ? 'bg-red-100 border-2 border-red-300 text-red-600' : 'bg-white border-2 border-gray-100 text-gray-500'}`}>{opt} {done && i === stage.correct && '✓'}</button>);
              })}</div>
              {canAdvance && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} onClick={handleNext} className="w-full py-4 bg-blue-600 text-white font-bold text-xl rounded-2xl mt-4 min-h-[56px]">{currentStage < WATER_STAGES.length - 1 ? t('auto.watercyclejourney.next_stage', 'Next Stage →') : t('auto.watercyclejourney.complete_cycle', '🎉 Complete the Cycle!')}</motion.button>}
            </motion.div>
          )}
          {cycleComplete && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-5 bg-gradient-to-br from-blue-500 to-sky-600 rounded-3xl p-6 text-white text-center">
              <div className="text-5xl mb-3">💧🌊☁️🌧️</div>
              <h3 className="text-2xl font-extrabold mb-2"><Trans i18nKey="auto.watercyclejourney.water_cycle_complete">Water Cycle Complete!</Trans></h3>
              <p className="text-base text-blue-100 mb-4">{t('early.modules.WaterCycleJourney.txt_Droppythan', 'Droppy thanks you!')}</p>
              <button onClick={handleRestart} className="px-6 py-3 bg-white text-blue-600 font-bold rounded-2xl min-h-[48px]">{t('early.modules.WaterCycleJourney.btn_FollowDrop', 'Follow Droppy Again 💧')}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </EarlyShell>
  );
}
